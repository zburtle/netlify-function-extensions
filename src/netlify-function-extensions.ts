import { Context } from "@netlify/functions/dist/function/context";
import { Event } from "@netlify/functions/dist/function/event";
import { StatusCodes } from "http-status-codes";
import { AdminIdentityFunctions } from "./admin-identity-functions";
import { NetlifyIdentityUser } from "./models/interfaces/netlify-identity-user";
import { NetlifyResult } from "./models/interfaces/netlify-result";
import { UserIdentityFunctions } from "./user-identity-functions";

export class NetlifyFunctionExtensions {
    public adminIdentityFunctions: AdminIdentityFunctions;
    private userIdentityFunctions: UserIdentityFunctions;

    constructor(private event: Event, private context: Context, private identityUrlOverride: string | null = null, private tokenOverride: string | null = null) {
        this.userIdentityFunctions = new UserIdentityFunctions(event, context);
        this.adminIdentityFunctions = new AdminIdentityFunctions(this.identityUrl, this.adminToken, this.userIdentityFunctions);
    }

    get callingUser(): NetlifyIdentityUser {
        return this.context.clientContext?.user;
    }

    get adminToken(): string {
        return this.tokenOverride ?? this.context.clientContext?.identity.token;
    }

    get identity(): any {
        return this.context.clientContext?.identity;
    }

    get identityUrl(): string {
        return this.identityUrlOverride ?? this.context.clientContext?.identity.url;
    }

    getBodyObject<T>(): T {
        return JSON.parse(this.event.body ?? '') as T;
    }

    async registerUser<T extends NetlifyIdentityUser>(email: string, password: string): Promise<T> {
        return await this.userIdentityFunctions.registerUser(email, password);
    }

    async inviteUser<T extends NetlifyIdentityUser>(email: string): Promise<T> {
        return await this.userIdentityFunctions.inviteUser(email);
    }

    async updateUser<T extends NetlifyIdentityUser>(user: T): Promise<void> {
        return await this.userIdentityFunctions.updateUser(user);
    }

    async isUserAdministrator(user: NetlifyIdentityUser): Promise<boolean> {
        return await this.userIdentityFunctions.isUserAdministrator(user);
    }

    async isCallingUserInRole(roleName: string): Promise<boolean> {
        return await this.userIdentityFunctions.isCallingUserInRole(roleName);
    }

    async isUserInRole(user: NetlifyIdentityUser, roleName: string): Promise<boolean> {
        return await this.userIdentityFunctions.isUserInRole(user, roleName);
    }

    async isCallingUserInAnyRole(roleNames: string[]): Promise<boolean> {
        return this.userIdentityFunctions.isCallingUserInAnyRole(roleNames);
    }

    async isUserInAnyRole(user: NetlifyIdentityUser, roleNames: string[]): Promise<boolean> {
        return await this.userIdentityFunctions.isUserInAnyRole(user, roleNames);
    }

    async executeAsync<T>(action: string, functionToExecute: () => Promise<NetlifyResult<T>>, errorCallback: (error: any) => Promise<NetlifyResult<T> | NetlifyResult<void>>): Promise<NetlifyResult<T> | NetlifyResult<void>> {
        try {
            if (action == this.event.httpMethod) {                
                return await functionToExecute();
            }
            else {
                return new NetlifyResult<T>(StatusCodes.METHOD_NOT_ALLOWED);
            }
        }
        catch (error: any) {
            return await errorCallback(error);
        }
    }

    async executeAsyncWithRoleCheck<T>(action: string, roleNames: string[], functionToExecute: () => Promise<NetlifyResult<T>>, errorCallback: (error: any) => Promise<NetlifyResult<T> | NetlifyResult<void>>): Promise<NetlifyResult<T> | NetlifyResult<void>> {
        try {
            if (action == this.event.httpMethod) {
                if (this.callingUser) {
                    if (await this.isCallingUserInAnyRole(roleNames)) {               
                        return await functionToExecute();
                    }
                    else {
                        return new NetlifyResult<T>(StatusCodes.FORBIDDEN);
                    }
                }
                else {
                    return new NetlifyResult<T>(StatusCodes.UNAUTHORIZED);
                }
            }
            else {
                return new NetlifyResult<T>(StatusCodes.METHOD_NOT_ALLOWED);
            }
        }
        catch (error) {
            return await errorCallback(error);
        }
    }
}
