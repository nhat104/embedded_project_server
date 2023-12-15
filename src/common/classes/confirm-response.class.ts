import { HttpStatus } from '@nestjs/common';
import { DataResponse } from '../interfaces/data-response.interface';

export class ConfirmResponse {
    static confirmResponse(
        message: string = null,
        data: DataResponse,
    ): ConfirmResponse {
        return new ConfirmResponse({
            message,
            data,
        });
    }

    message?: string;
    data?: DataResponse;
    [key: string]: any;

    constructor(partial: Partial<ConfirmResponse>) {
        Object.assign(this, partial);
    }
}
