const { sign, verify } = require('jsonwebtoken');
      Entity = require("./entity"),
      dotenv = require('dotenv'),
      envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';

dotenv.config({ path: envFile });

const createAccessToken = (email, tokenVersion) => {
    return sign({ email: email, tokenVersion: tokenVersion }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

const createRefreshToken = (email, tokenVersion) => {
    return sign({ email: email, tokenVersion: tokenVersion }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
}

//All errors functions below return will be jwt token errors.
const authenticateUser = async (req, res, next) => {
    // console.log(req.headers["authorization"]);
    const authorization = req.headers["authorization"];

    try {
        const token = authorization.split(" ")[1];
        const payload = verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.payload = {authenticated: true, data: payload};
    }catch(err){
        if(err.toString().split(":")[1].replace(" ", "") == "jwt expired"){
            try {
                const token = (await refreshToken(req.cookies.jid)).accessToken;
                const payload = verify(token, process.env.ACCESS_TOKEN_SECRET);
                req.payload = {authenticated: true, data: payload};
            } catch (error) {
                // console.log(error);
                req.payload = {authenticated: false, error: err};
            }

            return next();
        }
        
        req.payload = {authenticated: false, error: err};
    }

    return next();
}

const refreshToken = function(refreshToken){
    return new Promise(async(resolve, reject) => {
        let login = new Entity("login");

        let payload = null;

        try{
            payload = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

            //Since token is valid a new accessToken is returned;
            const loginInfo = await login.getRow("email", `"${payload.email}"`);

            if(!loginInfo){
                reject({ ok: false, email: ``, accessToken: ``});
            }

            return resolve({
                ok: true,
                email: loginInfo[0].email,
                accessToken: createAccessToken(loginInfo[0].email, loginInfo[0].token_version)
            });
        }catch(err){
            console.log(err);
            return reject(err);
        }
    })
}

const revokeTokens = function(email){
    return new Promise(async(resolve, reject) => {
        let login = new Entity("login");

        try {
            const loginInfo = await login.getRow("email", `"${email}"`);
            const response = await login.editRow("email", `"${loginInfo[0].email}"`, "token_version", `"${++loginInfo[0].token_version}"`);

            if(!response){
                return reject({ok: false, response: "Empty response on row edit"});
            }
    
            return resolve({ok: true, response: response});
        } catch (error) {
            console.log(error);
            return reject({ok: false, response: error});
        }
    })
}

module.exports = {
    createAccessToken,
    createRefreshToken,
    authenticateUser,
    revokeTokens,
    refreshToken
}