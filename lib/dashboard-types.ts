export type UseCaseKey =
  | 'reactivation'
  | 'post_visit'
  | 'second_visit'
  | 'event'
  | 'fill_tables'
  | 'other';

export interface UseCaseBreakdown {
  key: UseCaseKey;
  label: string;
  sent: number;
  conversions: number;
  revenue: number;
}
