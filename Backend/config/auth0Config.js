import { auth } from "express-oauth2-jwt-bearer"

const jwtCheck = auth({
    audience: "http://localhost:8000",
    issuerBaseURL: "https://dev-mb1spz8pskzwxfg6.us.auth0.com",
    tokenSigningAlg: "RS256",
    algorithms: ["RS256"]
})

export default jwtCheck;

// import { auth } from "express-oauth2-jwt-bearer";
// import dotenv from "dotenv";

// dotenv.config();

// const jwtCheck = auth({
//     audience: process.env.AUTH0_AUDIENCE,
//     issuerBaseURL: process.env.AUTH0_ISSUER,
//     tokenSigningAlg: "RS256",
// });
// export default jwtCheck;
