import { AppMetaData } from "./app-metadata";
import { UserMetaData } from "./user-metadata";

export interface UserData {
	app_metadata: AppMetaData;
    user_metadata: UserMetaData;
}