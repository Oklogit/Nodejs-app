//grab token sent thru frontend, verify it(using jwt functn), continue request if valid, else return error
//and we can pass this middleware whenever we need to verify authentication
const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
    //using header object to pass token from front to bak
    //this also means we have to pass it from front as a header
    const accessToken = req.header("accessToken");

    if (!accessToken)
        return res.status(401).json({ error: "User not authenticated" });
    try {
        //verify token from request and compare it using the same secret used to create it
        const validToken = verify(accessToken, "importantsecret");
        req.user = validToken; //we can use the middleware to create vars be called on every request/endpoint we pass the middleware)
        //because validtoken contains the  payload data we sent while creating the token,
        if (validToken) {
            return next();
        }
    } catch (error) {
        return res.json({ error: error });
    }
};

module.exports = { validateToken };
