const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Remove "Bearer " prefix if present
    const tokenWithoutBearer = token.startsWith("Bearer ") ? token.slice(7) : token;

    // Verify JWT Token
    const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);

    // Attach user ID to request for further use
    req.user = { id: decoded.ownerId };

    next(); // Move to the next middleware or route
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

// module.exports = function (req, res, next) {
//     // const token = req.header("x-auth-token");
//     const token = req.header("Authorization");
//     if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

//     try {
//         // const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
//         req.user = decoded.user;
//         next();
//     } catch (err) {
//         res.status(401).json({ msg: "Invalid token" });
//     }
// };
