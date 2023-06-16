const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  // Define the payload for the token
  const payload = {
    userId: user.id,
    username: user.username,
    email:user.email
    // Include any other relevant user data
  };

  // Generate the token with a secret key and an expiration time
  const token = jwt.sign(payload, process.env.JWT_STR, { expiresIn: "1h" });

  return token;
};

const verifyToken = (req, res, next) => {
  const token = req.query.token; // Assuming the token is stored in a cookie

  if (!token) {
    // If the token is not present, redirect to the login page or send an error response
    return res.status(400).redirect("/login");
  }

  try {
    // Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_STR);

    // Attach the decoded token payload to the request for further use
    req.user = decoded;

    // Proceed to the next middleware or route
    next();
  } catch (error) {
    // If the token is invalid or expired, redirect to the login page or send an error response
    return res.status(400).redirect("/login");
  }
};

module.exports = { generateToken, verifyToken };
