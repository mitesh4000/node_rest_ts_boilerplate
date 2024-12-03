// import { Application } from "express";
// import swaggerJsdoc from "swagger-jsdoc";
// import swaggerUi from "swagger-ui-express";

// const options = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "Mitesh Maurya's assignment",
//       description: "API endpoints for a Assignment",
//       version: "1.0.0",
//     },
//     servers: [
//       {
//         url: "http://localhost:3200/",
//         description: "Local server",
//       },
//       {
//         url: "<your live url here>",
//         description: "Live server",
//       },
//     ],
//   },
//   apis: ["./src/routes/*.ts"],
// };

// const swaggerSpec = swaggerJsdoc(options);

// function swaggerDocs(app: Application, port: number) {
//   app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//   app.get("/docs.json", (req, res) => {
//     res.setHeader("Content-Type", "application/json");
//     res.send(swaggerSpec);
//   });
// }

// export default swaggerDocs;
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My API',
    description: 'Description'
  },
  host: 'localhost:3000'
};

const outputFile = './swagger-output.json';
const routes = ['./app.ts'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);