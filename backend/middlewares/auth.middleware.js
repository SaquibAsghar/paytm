const jwt = require("jsonwebtoken");
const { jwtSecretKey } = require("../config");

function authMiddleware(req, res, next) {
  const headerAuth = req.headers.authorization;
  console.log(`headerAuth: ${headerAuth}`);
  if (!headerAuth || !headerAuth.startsWith("Bearer ")) {
    return res.status(404).json({
      msg: "Token not found",
      success: false,
    });
  }
  const token = headerAuth.split(" ")[1];
  console.log(`token: ${token}`);
  try {
    const decodedToken = jwt.verify(token, jwtSecretKey);
    console.log(`Decoded Token => , ${JSON.stringify(decodedToken)}`)
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    console.log('Error Caught', error.message);
    res.status(400).json({
      msg: error.message,
      success: false,
    })
  }
}

module.exports = authMiddleware;
