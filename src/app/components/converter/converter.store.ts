import {
	patchState,
	signalStore,
	withComputed,
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
import { computed, inject } from '@angular/core';
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
	date: string;
	timestamp: number;
}

export const InitState: ConverterStoreState = {
	isLoading: false,
	error: null,
	baseCurrencyAmount: 1,
	targetCurrencyValue: 0,
	currencyType: 'fiat',
	baseCurrency: 'AED', // UAE Dirham
	targetCurrency: 'AFN', // Afghani
	currencies: [],
	date: Date.toString(),
	timestamp: Date.now(),
};

export const ConverterStore = signalStore(
	withState<ConverterStoreState>(InitState),
	withComputed((store) => ({
		timestampToUtc: computed(() => new Date(store.timestamp() * 1000)),
	})),
	withMethods((store, converterService = inject(ConverterService)) => ({
		convert: rxMethod<{
			baseCurrency: string;
			targetCurrency: string;
			amount: number;
		}>(
			pipe(
				tap((t) =>
					patchState(store, {
						isLoading: true,
						baseCurrency: t.baseCurrency,
						targetCurrency: t.targetCurrency,
						baseCurrencyAmount: t.amount,
					}),
				),
				switchMap((t) =>
					converterService
						.convert(t.baseCurrency, t.targetCurrency, t.amount)
						.pipe(
							tap({
								next: (response) => {
									patchState(store, {
										isLoading: false,
										targetCurrencyValue: response.value,
										date: response.date,
										timestamp: response.timestamp,
										error: null,
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
							patchState(store, {
								isLoading: false,
								currencies: response,
								error: null,
							});
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
			store.convert({
				baseCurrency: store.baseCurrency(),
				targetCurrency: store.targetCurrency(),
				amount: store.baseCurrencyAmount(),
			});
		},
	}),
);
