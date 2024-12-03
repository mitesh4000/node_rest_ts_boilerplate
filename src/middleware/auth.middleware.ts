import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
interface DecodedToken {
  id: string;
}
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Authorization header is missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token is missing" });
    }

    const decoded = jwt.verify(token, process.env.JSON_SECRET as string) as {
      Id: string;
    };

    if (!decoded) {
      return res.status(401).json({ message: "Unable to decode Token" });
    }
    // @ts-ignore
    console.log(decoded, decoded.id);
    // @ts-ignore
    req.userId = decoded.id;

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
