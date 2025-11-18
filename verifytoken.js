import jwt from "jsonwebtoken";
import { userNameExists } from "./authdb.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer")) {
    return res.status(401).json({ error: "Unathorized" });
  }
  const token = authHeader.substring(7);
  try {
    const decodedToken = jwt.verify(token, "my_secret_key");
    if (!userNameExists(decodedToken.username)) {
      return res.status(401).json({ error: "Unathorized" });
    }
    req.user = decodedToken.username;
    next(); // send request next with added username that came from the token
  } catch (err) {
    return res.status(401).json({ error: "Unathorized" });
  }
};
