import {
	patchState,
	signalStore,
	withHooks,
	withMethods,
	withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
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
				tap(() => patchState(store, { isLoading: true })),
				switchMap((t) =>
					converterService
						.convert(t.baseCurrency, t.targetCurrency, t.amount)
						.pipe(
							tap({
								next: (response) => {
									patchState(store, {
										isLoading: false,
										targetCurrencyValue: response.value,
                    error: null
									});
								},
							}),
							catchError((error) => {
								(console.log('Conversion error: ', error),
									patchState(store, {
										isLoading: false,
										error: 'Error converting currency',
									}));
								return of(null);
							}),
						),
				),
			),
		),
		getCurrencies: rxMethod<void>(
			pipe(
				tap(() => patchState(store, { isLoading: true })),
				switchMap(() =>
					converterService.currencies(store.currencyType()).pipe(
						map((details) => details.response),
						tap((response) => {
							patchState(store, { isLoading: false, currencies: response, error: null });
						}),
						catchError((error) => {
							patchState(store, {
								error: 'Error retrieving currencies',
								isLoading: false,
							});
							return of(null);
						}),
					),
				),
			),
		),
	})),
	withHooks({
		onInit(store) {
			store.getCurrencies();
		},
	}),
);
