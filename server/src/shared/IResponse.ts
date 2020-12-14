export interface IResponse<T> {
  statusCode : Number;
  message: String;
  data?: T | T[] | null;
}
