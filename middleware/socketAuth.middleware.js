const jwt = require("jsonwebtoken");

module.exports = async (socket, next) => {
  const token = socket.handshake.auth.token;
    if (!token) {
        const err = new Error("not authorized");
        err.data = { content: "Please retry later" }; // additional details
        next(err);
    }else{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.data.user = decoded;
        next();
    }
};
