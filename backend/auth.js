const { sign, verify } = require('jsonwebtoken');
      dotenv = require('dotenv'),
      envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';

dotenv.config({ path: envFile });

const createAccessToken = (email) => {
    return sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

const createRefreshToken = (email) => {
    return sign({ email: email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
}

const authenticateUser = (req, res, next) => {
    // console.log(req.headers["authorization"]);
    const authorization = req.headers["authorization"];

    if(!authorization){
        req.payload = {authenticated: false, error: new Error("User is not authenticated")};
        return next();
    }

    try {
        const token = authorization.split(" ")[1];
        const payload = verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.payload = {authenticated: true, data: payload};
    }catch(err){
        req.payload = {authenticated: false, error: err};
    }

    return next();
}

module.exports = {
    createAccessToken,
    createRefreshToken,
    authenticateUser
}