const jwt = require("jsonwebtoken");

module.exports = async (socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    const err = new Error("not authorized");
    err.data = { content: "Please retry later" }; 
    return next(err); 
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.data.user = decoded;
    next();
  } catch (error) {
    const err = new Error("not authorized");
    if (error.name === "TokenExpiredError") {
      err.data = { content: "Session expired. Please log in again." };
    } else {
      err.data = { content: "Invalid token details." };
    }
    
    next(err);
  }
};
