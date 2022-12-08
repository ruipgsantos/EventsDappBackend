import GenericError from "./generic.error";

export default class RecordNotFoundError extends GenericError {
  constructor(message: string = "Record could not be found") {
    super({ message, status: 404 });
  }
}
