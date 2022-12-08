import GenericError from "./generic.error";

export default class UnauthorizedError extends GenericError {
  constructor(message: string = "Unauthorized") {
    super({ message, status: 401 });
  }
}
