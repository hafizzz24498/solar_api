import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const stratus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const error =
      exception instanceof HttpException ? exception.getResponse() : 'error';

    const errorMessage = error['message']
      ? error['message']
      : exception['message'];
    console.log('Error:', errorMessage);

    response.status(stratus).json({
      success: false,
      statusCode: stratus,
      timestamp: new Date().toISOString(),
      message: errorMessage,
    });
  }
}
