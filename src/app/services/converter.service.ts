import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { map, Observable, of, tap } from 'rxjs';
import { CurrencyDto } from '../models/currency';
import { ConversionDto } from '../models/convert';

@Injectable({
  providedIn: 'root',
})
export class ConverterService {
  api = inject(ApiService);

  convert(
    baseCurrency: string,
    targetCurrency: string,
    amount: number,
  ): Observable<ConversionDto> {
    return this.api.get<number | string, ConversionDto>(
      'convert',
      `?from=${baseCurrency}&to=${targetCurrency}&amount=${amount}`,
    );
  }

  currencies(type: currencyType): Observable<CurrencyDto> {
    return this.api.get<string, CurrencyDto>('currencies', `?type=${type}`);
  }
}

export type currencyType = 'fiat' | 'crypto';
