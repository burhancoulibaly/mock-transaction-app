const { sign } = require('jsonwebtoken');
      dotenv = require('dotenv'),
      envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';

dotenv.config({ path: envFile });

const createAccessToken = (email) => {
    return sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

const createRefreshToken = (email) => {
    return sign({ email: email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
}

module.exports = {
    createAccessToken,
    createRefreshToken
}