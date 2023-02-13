import { AppMetadata } from "./app-metadata";
import { UserMetadata } from "./user-metadata";

export interface UserData {
	app_metadata: AppMetadata;
    user_metadata: UserMetadata;
}