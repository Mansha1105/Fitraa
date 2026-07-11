import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {

    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }

    // REMOVE BEARER
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = decoded.userId;

    next();

  } catch (error) {

    res.status(401).json({
      message: "Not authorized, token failed",
    });

  }
};