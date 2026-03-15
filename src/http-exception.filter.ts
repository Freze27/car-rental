import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isApi = request.path.startsWith('/api/');

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      if (isApi) {
        return response.status(status).json({
          statusCode: status,
          message: exception.message,
          path: request.path,
        });
      }
      return response.status(status).render('error', { layout: 'main', status });
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        const status = HttpStatus.CONFLICT;
        if (isApi) {
          return response.status(status).json({
            statusCode: status,
            message: 'A record with this value already exists',
            path: request.path,
          });
        }
      }
      if (exception.code === 'P2025') {
        const status = HttpStatus.NOT_FOUND;
        if (isApi) {
          return response.status(status).json({
            statusCode: status,
            message: 'Record not found',
            path: request.path,
          });
        }
      }
    }

    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    if (isApi) {
      return response.status(status).json({
        statusCode: status,
        message: 'Internal server error',
        path: request.path,
      });
    }
    return response.status(status).render('error', { layout: 'main', status });
  }
}
