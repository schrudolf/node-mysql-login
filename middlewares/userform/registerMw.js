const Msg = require("../../Message/userForms");

module.exports = (con) => {
    return async (req,res,next) => {
        const {email, password, password2} = req.body;
        if(!email | !password | !password2){
            res.locals.errorMsg.push(Msg.empty);
        }
        if(password.length < 6){
            res.locals.errorMsg.push(Msg.pwdL);
        }
        if(password !== password2){
            res.locals.errorMsg.push(Msg.noMatch);
        }
        if(res.locals.errorMsg.length > 0){
            return res.render("user/register");
        }
        con.query(`SELECT * FROM users WHERE email="${email}"`, (err, checkEmail)=>{
        if(err){
            return console.log(err);
        } if(checkEmail.length > 0){
            res.locals.errorMsg.push(Msg.existEmail);
            return res.render("user/register");
        }
        con.query("INSERT INTO users SET ?", {email,password});
        res.locals.errorMsg.push(Msg.successReg);
        return res.render("user/register");
    })
    };
}