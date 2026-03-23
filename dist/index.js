"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.version = exports.DatabaseManager = exports.EmailManager = exports.InvitationManager = exports.UserManager = exports.requirePermission = exports.requireRole = exports.adminAuth = exports.tokenAuth = exports.JwtMiddleware = exports.AlsiriusAuth = void 0;
// Main exports
var AlsiriusAuth_1 = require("./core/AlsiriusAuth");
Object.defineProperty(exports, "AlsiriusAuth", { enumerable: true, get: function () { return AlsiriusAuth_1.AlsiriusAuth; } });
var auth_1 = require("./middleware/auth");
Object.defineProperty(exports, "JwtMiddleware", { enumerable: true, get: function () { return auth_1.JwtMiddleware; } });
var auth_2 = require("./middleware/auth");
Object.defineProperty(exports, "tokenAuth", { enumerable: true, get: function () { return auth_2.tokenAuth; } });
Object.defineProperty(exports, "adminAuth", { enumerable: true, get: function () { return auth_2.adminAuth; } });
Object.defineProperty(exports, "requireRole", { enumerable: true, get: function () { return auth_2.requireRole; } });
Object.defineProperty(exports, "requirePermission", { enumerable: true, get: function () { return auth_2.requirePermission; } });
// Core managers
var UserManager_1 = require("./core/UserManager");
Object.defineProperty(exports, "UserManager", { enumerable: true, get: function () { return UserManager_1.UserManager; } });
var InvitationManager_1 = require("./core/InvitationManager");
Object.defineProperty(exports, "InvitationManager", { enumerable: true, get: function () { return InvitationManager_1.InvitationManager; } });
var EmailManager_1 = require("./core/EmailManager");
Object.defineProperty(exports, "EmailManager", { enumerable: true, get: function () { return EmailManager_1.EmailManager; } });
var DatabaseManager_1 = require("./database/DatabaseManager");
Object.defineProperty(exports, "DatabaseManager", { enumerable: true, get: function () { return DatabaseManager_1.DatabaseManager; } });
// Types - selective exports to avoid conflicts
__exportStar(require("./types/auth"), exports);
// Version
exports.version = '1.0.0';
//# sourceMappingURL=index.js.map