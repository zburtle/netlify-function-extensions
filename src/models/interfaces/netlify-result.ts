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

    static Ok<T>(result: T): NetlifyResult<T> {
        return new NetlifyResult<T>(StatusCodes.OK, result);
    }

    static OkResult(): NetlifyResult<void> {
        return new NetlifyResult<void>(StatusCodes.OK);
    }

    static Error(): NetlifyResult<void> {
        return new NetlifyResult<void>(StatusCodes.INTERNAL_SERVER_ERROR);
    }
}