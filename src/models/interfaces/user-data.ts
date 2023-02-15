import { NetlifyIdentityAppMetadata } from "./netlify-identity-app-metadata";
import { NetlifyIdentityUserMetadata } from "./netlify-identity-user-metadata";

export interface UserData {
	app_metadata: NetlifyIdentityAppMetadata;
    user_metadata: NetlifyIdentityUserMetadata;
}