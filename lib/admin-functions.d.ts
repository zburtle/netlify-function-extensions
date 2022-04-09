import { AppMetaData } from "./models/interfaces/app-metadata";
import { User } from "./models/interfaces/user";
import { UserMetaData } from "./models/interfaces/user-metadata";
import { Users } from "./models/interfaces/users";
export declare class AdminFunctions {
    private identity;
    private usersUrl;
    private userFunctions;
    constructor(identity: any);
    getAllUsers(): Promise<Users>;
    getUserById(userId: string): Promise<User>;
    getUserByEmail(email: string): Promise<User | null>;
    createUser(user: User): Promise<User>;
    updateUser(user: User): Promise<void>;
    deleteUser(userId: string): Promise<void>;
    isUserAdministrator(userId: string, adminRoleName?: string): Promise<boolean>;
    isUserInRole(userId: string, roleName: string): Promise<boolean>;
    isUserInAnyRole(userId: string, roleNames: string[]): Promise<boolean>;
    registerUserWithMetadata(email: string, password: string, appMetaData: AppMetaData, userMetaData: UserMetaData): Promise<User>;
    registerUserWithAppMetadata(email: string, password: string, appMetaData: AppMetaData): Promise<User>;
    inviteUserWithMetadata(email: string, appMetaData: AppMetaData, userMetaData: UserMetaData): Promise<User>;
    inviteUserWithAppMetadata(email: string, appMetaData: AppMetaData): Promise<User>;
}
