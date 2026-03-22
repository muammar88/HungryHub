import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((res) => {
        // default
        let message = 'Success';
        let data: any = null;

        // kalau return object custom
        if (res && typeof res === 'object') {
          message = res.message || message;
          data = res.data ?? null;
        } else {
          data = res ?? null;
        }

        return {
          statusCode: response.statusCode,
          message,
          error: null,
          ...(data !== null && { data }), // hanya muncul kalau ada data
        };
      }),
    );
  }
}
