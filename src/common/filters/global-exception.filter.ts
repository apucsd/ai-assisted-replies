import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
@Injectable()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();

        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

        let message = 'Something went wrong';

        let errors: any[] = [];

        // NestJS / AppError
        if (exception instanceof HttpException) {
            statusCode = exception.getStatus();

            const exceptionResponse: any = exception.getResponse();

            message = exceptionResponse.message || exception.message || message;

            errors = exceptionResponse.errors || [];
        } 
        // Prisma Errors
        else if (exception.code === 'P2002') {
            statusCode = HttpStatus.CONFLICT;
            const target = exception.meta?.target || 'field';
            message = `Duplicate value: ${target} already exists.`;
        }
        else if (exception instanceof Error) {
            message = exception.message;
        }

        response.status(statusCode).json({
            success: false,
            statusCode,
            message,
            errors,
            path: request.url,
            timestamp: new Date().toISOString(),
        });
    }
}
