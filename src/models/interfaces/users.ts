import { NetlifyIdentityUser } from "./netlify-identity-user";

export interface Users<T extends NetlifyIdentityUser> {
    audience: string;
    users: T[];
}