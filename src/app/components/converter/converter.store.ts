import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { map, pipe, switchMap, tap } from 'rxjs';
import {
  ConverterService,
  currencyType,
} from '../../services/converter.service';
import { inject } from '@angular/core';
import { CurrencyDetailsDto } from '../../models/currency';

export interface ConverterStoreState {
  isLoading: boolean;
  error: any;
  baseCurrencyAmount: number;
  targetCurrencyValue: number;
  currencyType: currencyType;
  baseCurrency: string;
  targetCurrency: string;
  currencies: CurrencyDetailsDto[];
}

export const InitState: ConverterStoreState = {
  isLoading: false,
  error: null,
  baseCurrencyAmount: 0,
  targetCurrencyValue: 0,
  currencyType: 'fiat',
  baseCurrency: 'AED', // UAE Dirham
  targetCurrency: 'AFN', // Afghani
  currencies: [],
};

export const ConverterStore = signalStore(
  withState<ConverterStoreState>(InitState),
  withMethods((store, converterService = inject(ConverterService)) => ({
    convert: rxMethod<{
      baseCurrency: string;
      targetCurrency: string;
      amount: number;
    }>(
      pipe(
        switchMap((t) =>
          converterService
            .convert(t.baseCurrency, t.targetCurrency, t.amount)
            .pipe(
              tap({
                next: (response) => {
                  patchState(store, {
                    isLoading: false,
                    targetCurrencyValue: response.value,
                  });
                },
                error: (error) => {
                  patchState(store, { isLoading: false, error });
                },
              }),
            ),
        ),
      ),
    ),
    getCurrencies: rxMethod<void>(
      pipe(
        switchMap(() =>
          converterService.currencies(store.currencyType()).pipe(
            map((details) => details.response),
            tap({
              next: (response) => {
                patchState(store, { isLoading: false, currencies: response });
              },
              error: (error) => {
                patchState(store, { isLoading: false, error });
                console.log('error retrieving currencies', error);
              },
            }),
          ),
        ),
      ),
    ),
    onValueChanged: rxMethod<void>(pipe()),
  })),
  withHooks({
    onInit(store) {
      store.getCurrencies();
    },
  }),
);
