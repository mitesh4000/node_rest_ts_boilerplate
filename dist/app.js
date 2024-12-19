"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const view_controller_1 = require("./controller/view.controller");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const contract_routes_1 = __importDefault(require("./routes/contract.routes"));
const milestone_routes_1 = __importDefault(
  require("./routes/milestone.routes")
);
const project_routes_1 = __importDefault(require("./routes/project.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
// import swaggerDocs from "./swagger";
const http_1 = require("http");
const path_1 = __importDefault(require("path"));
const socket_io_1 = require("socket.io");
const connectToDb_1 = require("./utils/connectToDb");
const validateEnv_1 = require("./utils/validateEnv");
const swaggerUi = require("swagger-ui-express");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server);
const port = process.env.PORT;
(0, validateEnv_1.validateEnv)();
(0, connectToDb_1.connectToDatabase)();
app.use((0, morgan_1.default)("tiny"));
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.resolve("./src/public")));
app.get("/", view_controller_1.serverStatus);
app.use("/auth", auth_routes_1.default);
app.use("/user", user_routes_1.default);
app.use("/contract", contract_routes_1.default);
app.use("/", milestone_routes_1.default);
app.use("/", project_routes_1.default);
// swaggerDocs(app, Number(port));
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
