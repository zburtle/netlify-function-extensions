"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionInstance = void 0;
const admin_functions_1 = require("./admin-functions");
const user_functions_1 = require("./user-functions");
class FunctionInstance {
    constructor(event, context) {
        var _a, _b;
        this.event = event;
        this.context = context;
        this.Admin = new admin_functions_1.AdminFunctions((_a = context.clientContext) === null || _a === void 0 ? void 0 : _a.identity);
        this.User = new user_functions_1.UserFunctions((_b = context.clientContext) === null || _b === void 0 ? void 0 : _b.identity);
    }
    get callingUser() {
        var _a;
        return (_a = this.context.clientContext) === null || _a === void 0 ? void 0 : _a.user;
    }
    get adminToken() {
        var _a;
        return (_a = this.context.clientContext) === null || _a === void 0 ? void 0 : _a.identity.token;
    }
}
exports.FunctionInstance = FunctionInstance;
