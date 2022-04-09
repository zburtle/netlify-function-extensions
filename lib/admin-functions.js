"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminFunctions = void 0;
const axios_1 = require("axios");
const user_functions_1 = require("./user-functions");
class AdminFunctions {
    constructor(identity) {
        this.identity = identity;
        this.usersUrl = 'admin/users';
        this.userFunctions = new user_functions_1.UserFunctions(identity);
    }
    async getAllUsers() {
        var getAllUsersUrl = `${this.identity.url}/${this.usersUrl}?per_page=${100000}`;
        var results = await axios_1.default.get(getAllUsersUrl, { headers: { Authorization: `Bearer ${this.identity.token}` } });
        return results.data;
    }
    async getUserById(userId) {
        var getUserByIdUrl = `${this.identity.url}/${this.usersUrl}/${userId}`;
        var result = await axios_1.default.get(getUserByIdUrl, { headers: { Authorization: `Bearer ${this.identity.token}` } });
        return result.data;
    }
    async getUserByEmail(email) {
        var allUsers = await this.getAllUsers();
        var users = allUsers.users.filter((x) => x.email == email);
        if (users && users.length > 0) {
            return users[0];
        }
        else {
            return null;
        }
    }
    async createUser(user) {
        var updateUserUrl = `${this.identity.url}/${this.usersUrl}`;
        var result = await axios_1.default.post(updateUserUrl, user, { headers: { Authorization: `Bearer ${this.identity.token}` } });
        return result.data;
    }
    async updateUser(user) {
        var _a;
        var userId = (_a = (await this.getUserByEmail(user.email))) === null || _a === void 0 ? void 0 : _a.id;
        var updateUserUrl = `${this.identity.url}/${this.usersUrl}/${userId}`;
        await axios_1.default.put(updateUserUrl, user, { headers: { Authorization: `Bearer ${this.identity.token}` } });
    }
    async deleteUser(userId) {
        var deleteUserUrl = `${this.identity.url}/${this.usersUrl}/${userId}`;
        await axios_1.default.delete(deleteUserUrl, { headers: { Authorization: `Bearer ${this.identity.token}` } });
    }
    async isUserAdministrator(userId, adminRoleName = 'Administrator') {
        return await this.isUserInRole(userId, adminRoleName);
    }
    async isUserInRole(userId, roleName) {
        var user = await this.getUserById(userId);
        return user.app_metadata.roles.some((x) => x == roleName);
    }
    async isUserInAnyRole(userId, roleNames) {
        var user = await this.getUserById(userId);
        return user.app_metadata.roles.some((x) => roleNames.some((y) => x == y));
    }
    async registerUserWithMetadata(email, password, appMetaData, userMetaData) {
        var newUser = await this.userFunctions.registerUser(email, password);
        newUser.app_metadata = appMetaData;
        newUser.user_metadata = userMetaData;
        await this.updateUser(newUser);
        return newUser;
    }
    async registerUserWithAppMetadata(email, password, appMetaData) {
        var newUser = await this.userFunctions.registerUser(email, password);
        newUser.app_metadata = appMetaData;
        await this.updateUser(newUser);
        return newUser;
    }
    async inviteUserWithMetadata(email, appMetaData, userMetaData) {
        var newUser = await this.userFunctions.inviteUser(email);
        newUser.app_metadata = appMetaData;
        newUser.user_metadata = userMetaData;
        await this.updateUser(newUser);
        return newUser;
    }
    async inviteUserWithAppMetadata(email, appMetaData) {
        var newUser = await this.userFunctions.inviteUser(email);
        newUser.app_metadata = appMetaData;
        await this.updateUser(newUser);
        return newUser;
    }
}
exports.AdminFunctions = AdminFunctions;
