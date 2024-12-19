"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverStatus = serverStatus;
function serverStatus(req, res) {
    res.sendFile("/public/index.html");
}
