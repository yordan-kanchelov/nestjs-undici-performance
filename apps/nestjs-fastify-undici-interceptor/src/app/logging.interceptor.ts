import { Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import type { Dispatcher } from 'undici';
import type {
  HttpInterceptor,
  HttpInterceptorHandler,
  HttpInterceptorRequest,
} from 'nestjs-undici-interceptors';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(
    request: HttpInterceptorRequest,
    next: HttpInterceptorHandler
  ): Observable<Dispatcher.ResponseData> {
    const now = Date.now();
    const method = request.options.method || 'GET';
    const url = request.url.toString();

    this.logger.log(`Outgoing HTTP Request: ${method} ${url}`);

    return next.handle(request).pipe(
      tap((response) => {
        const duration = Date.now() - now;
        this.logger.log(
          `HTTP Response: ${method} ${url} - Status: ${response.statusCode} - Duration: ${duration}ms`
        );
      })
    );
  }
}