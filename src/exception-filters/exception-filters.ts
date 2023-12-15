import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    InternalServerErrorException
} from "@nestjs/common";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: InternalServerErrorException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        /**
         * @description Exception json response
         * @param message
         */
        const responseMessage = (status, message) => {
            response.status(status).json({
                data: {
                    success: false,
                    message: message,
                }
            });
        };
        switch (exception.name) {
            case 'MongoServerError':
                responseMessage(HttpStatus.FORBIDDEN, exception.message);
                break;
            case 'CastError':
                responseMessage(HttpStatus.BAD_REQUEST, exception.message);
                break;
            case 'ValidationError':
                responseMessage(HttpStatus.BAD_REQUEST, exception.message);
                break;
            default:
                const status = exception instanceof HttpException
                    ? exception.getStatus()
                    : HttpStatus.INTERNAL_SERVER_ERROR;
                responseMessage(status, exception.message);
                break;
        }

    }
}