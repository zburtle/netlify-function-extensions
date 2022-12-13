import { StatusCodes } from "http-status-codes";

export class NetlifyResult<T> {
    statusCode: number;
    body?: string;

    constructor(code: StatusCodes, result: T | undefined = undefined) {
        this.statusCode = code;

        if (result) {
            this.body = JSON.stringify(result);
        }
    }
}