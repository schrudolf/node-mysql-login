const Msg = require("../../Message/userForms");
const bcrypt = require('bcryptjs');

module.exports = (con) => {
    return (req,res,next) => {
        const {email, password, password2} = req.body;
        if(!email | !password | !password2){
            res.locals.errorMsg.push(Msg.empty);
            return res.render("user/register");
        }
        if(password !== password2){
            res.locals.errorMsg.push(Msg.noMatch);
        }
        if(password.length < 6){
            res.locals.errorMsg.push(Msg.pwdL);
        }
        if(res.locals.errorMsg.length > 0){
            return res.render("user/register");
        }
        con.query(`SELECT * FROM users WHERE email="${email}"`, (err, checkEmail)=>{
        if(err){
            return next(err);
        } if(checkEmail.length > 0){
            res.locals.errorMsg.push(Msg.existEmail);
            return res.render("user/register");
        }
        const newUser = {
            email,
            password
        };
        bcrypt.genSalt(10, (err,salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err) { 
                   return next(err); 
                }
                newUser.password = hash;
                con.query("INSERT INTO users SET ?", newUser);
                res.locals.userEmail = newUser.email;
                req.flash("success_msg", Msg.successReg);
                res.redirect("/login");
                return next();
                });
            }) 
        })
    };
}