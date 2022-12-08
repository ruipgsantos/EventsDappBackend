import GenericError from "./generic.error";

export default class ForbiddenError extends GenericError {
  constructor(message: string = "Forbidden") {
    super({ message, status: 403 });
  }
}
