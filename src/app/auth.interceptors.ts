import {
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as env from '../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	intercept(
		req: HttpRequest<any>,
		next: HttpHandler,
	): Observable<HttpEvent<any>> {
		const idToken = env.environment.api_key;

		if (idToken) {
			const cloned = req.clone({
				headers: req.headers.set('Authorization', 'Bearer ' + idToken),
			});
			return next.handle(cloned);
		} else {
			return next.handle(req);
		}
	}
}
