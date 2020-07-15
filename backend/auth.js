const { sign, verify } = require('jsonwebtoken');
      Entity = require("./entity"),
      dotenv = require('dotenv'),
      envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';

dotenv.config({ path: envFile });

const createAccessToken = (email, username,tokenVersion) => {
    return sign({ email: email, username: username, tokenVersion: tokenVersion }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

const createRefreshToken = (email, username, tokenVersion) => {
    return sign({ email: email, username: username, tokenVersion: tokenVersion }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
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
                const token = (await refreshToken(req.cookies.jid), res).accessToken;
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

const refreshToken = function(refreshToken, response){
    return new Promise(async(resolve, reject) => {
        let login = new Entity("login");
        let payload;
        let t1ReturnVals = ["email", "token_version", "password"];
        let t2ReturnVals = ["user_name"];

        try{
            payload = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

            //Since token is valid a new accessToken is returned;
            let loginInfo = await login.getFKRightJoin(`users`, t1ReturnVals, t2ReturnVals, 'email', `"${payload.email}"`);

            if(payload.tokenVersion != loginInfo[0].token_version){
                reject({ ok: false, email: ``, username: ``, accessToken: ``});
            }

            if(!loginInfo){
                reject({ ok: false, email: ``, username: ``, accessToken: ``});
            }

            response.cookie('jid', createRefreshToken(loginInfo[0].email.toString(), loginInfo[0].user_name.toString(), loginInfo[0].token_version.toString()), {
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7days 24hours 60minutes 60secs 1000ms
                httpOnly: true,
                secure: true
                
            });
            
            return resolve({
                ok: true,
                email: loginInfo[0].email,
                username: loginInfo[0].user_name,
                accessToken: createAccessToken(loginInfo[0].email.toString(), loginInfo[0].user_name.toString(), loginInfo[0].token_version.toString())
            });
        }catch(err){
            console.log(err);
            return reject(err);
        }
    })
}

//Test this at some point
const revokeTokens = function(email){
    return new Promise(async(resolve, reject) => {
        let login = new Entity("login");
        let t1ReturnVals = ["email", "token_version", "password"];
        let t2ReturnVals = ["user_name"];

        try {
            let loginInfo = await login.getFKRightJoin(`users`, t1ReturnVals, t2ReturnVals, 'email', `"${email}"`);
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