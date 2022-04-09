"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFunctions = void 0;
const axios_1 = require("axios");
class UserFunctions {
    constructor(identity) {
        this.identity = identity;
    }
    async registerUser(email, password) {
        var registerUserUrl = `${this.identity.url}/signup`;
        var result = await axios_1.default.post(registerUserUrl, {
            email: email,
            password: password
        });
        return result.data;
    }
    async inviteUser(email) {
        var inviteUserUrl = `${this.identity.url}/invite`;
        var result = await axios_1.default.post(inviteUserUrl, {
            email: email
        }, {
            headers: {
                Authorization: `Bearer ${this.identity.token}`
            }
        });
        return result.data;
    }
    async updateUser(user) {
        var updateUserUrl = `${this.identity.url}/user`;
        await axios_1.default.put(updateUserUrl, user, { headers: { Authorization: `Bearer ${this.identity.token}` } });
    }
}
exports.UserFunctions = UserFunctions;
