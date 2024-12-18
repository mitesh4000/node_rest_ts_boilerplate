import { Request, Response } from "express";

export function serverStatus(req: Request, res: Response) {
  res.sendFile("/public/index.html");
}
