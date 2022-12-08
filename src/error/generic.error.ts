export default class GenericError extends Error {
  private _status;
  public get status() {
    return this._status;
  }

  constructor(
    {
      message,
      status,
    }: {
      message: string;
      status: number;
    } = { message: "There has been an unexpected error.", status: 500 }
  ) {
    super(message);
    this._status = status;
  }
}
