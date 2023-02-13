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

    static get Ok(): NetlifyResult<void> {
        return new NetlifyResult(StatusCodes.OK);
    }

    static get Error(): NetlifyResult<void> {
        return new NetlifyResult<void>(StatusCodes.INTERNAL_SERVER_ERROR);
    }
}