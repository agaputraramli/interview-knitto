"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveJsonWithRetry = saveJsonWithRetry;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
async function saveJsonWithRetry(filePath, data, maxRetries = 3, delayMs = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await fs_1.promises.mkdir(path_1.default.dirname(filePath), { recursive: true });
            await fs_1.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
            return;
        }
        catch (err) {
            if (attempt === maxRetries)
                throw err;
            await new Promise(res => setTimeout(res, delayMs));
        }
    }
}
