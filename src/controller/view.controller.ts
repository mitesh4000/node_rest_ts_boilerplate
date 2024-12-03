import { Request, Response } from "express";

export function serverStatus(req: Request, res: Response) {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Server Status</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background-color: #f4f4f4;
                color: #333;
            }
            h1 {
                font-size: 2rem;
            }
        </style>
    </head>
    <body>
        <h1>Server is Up and Running!</h1>
    </body>
    </html>
  `);
}
