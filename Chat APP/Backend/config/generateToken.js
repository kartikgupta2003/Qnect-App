const jwt = require("jsonwebtoken");

const generateToken = (id) =>{
    return jwt.sign({id} , process.env.JWT_SECRET , {
        expiresIn : "30d"
        // the expiresIn option is used to set the expiration time of the JWT token.
        // 🔸 Why it's important Security: Prevents tokens from being valid forever if leaked.
        // Session Control: Helps automatically log users out after a certain time.
        // "30d"- > 3o days , "24h" -> 24 hours , "10m" -> 10 minutes , 60 (just number) -> 60s
    }); 
}

module.exports = generateToken;