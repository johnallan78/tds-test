export interface ConversionDto {
  meta: {
    code: number;
    disclaimer: string;
  };
  response: {
    timestamp: number;
    date: string;
    from: string;
    to: string;
    amount: number;
    value: number;
  };
  timestamp: number;
  date: string;
  from: string;
  to: string;
  amount: number;
  value: number;
}
