import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as env from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  http = inject(HttpClient);
  baseUrl = env.environment.base_api_url;

  get<TParam, TReturn>(...params: TParam[]): Observable<TReturn> {
    const { ...values } = params;
    return this.http.get<TReturn>(`${this.baseUrl}/${values[0]}${values[1]}`);
  }
}
