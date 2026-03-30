import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();

    if (context.getType() === 'http') {
      const req = context.switchToHttp().getRequest();
      const { method, url } = req;
      return next.handle().pipe(
        tap(() => this.logger.log(`${method} ${url} — ${Date.now() - start}ms`)),
      );
    }

    const info = context.getArgByIndex(3);
    const operation = info?.fieldName ?? 'graphql';
    return next.handle().pipe(
      tap(() => this.logger.log(`GraphQL ${operation} — ${Date.now() - start}ms`)),
    );
  }
}
