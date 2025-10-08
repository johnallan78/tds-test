export interface CurrencyDto {
	meta: {
		code: number;
		disclaimer: string;
	};
	response: CurrencyDetailsDto[];
}

export type thousandsSeparator = ',' | '.';

export interface CurrencyDetailsDto {
	id: number;
	name: string;
	short_code: string;
	code: string;
	precision: number;
	subunit: number;
	symbol: string;
	symbol_first: boolean;
	decimal_mark: string;
	thousands_separator: thousandsSeparator;
}
