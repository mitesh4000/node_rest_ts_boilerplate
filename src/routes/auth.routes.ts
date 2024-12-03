import { Router } from "express";
import { login, register } from "../controller/auth.controller";

const router = Router();
/**
 * @swagger
 * /example:
 *   get:
 *     summary: Retrieve an example item
 *     description: Returns a single example item.
 *     responses:
 *       200:
 *         description: A single example item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 */
router.post("/register", register);
router.post("/login", login);

export default router;
