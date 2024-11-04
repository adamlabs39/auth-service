export class HttpException extends Error {
  constructor(message, status) {
    super(message);
    this.message = message;
    this.status = status;
  }
}
