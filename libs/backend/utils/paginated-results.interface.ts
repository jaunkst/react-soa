// a simple response interface for pagigated results
export interface IPagingatedResults<T> {
  results: Array<T>;
  skip: number;
  limit: number;
  count: number;
}
