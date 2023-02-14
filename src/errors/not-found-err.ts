interface INotFoundError {
  message: string,
  statusCode: number
}

class NotFoundError extends Error implements INotFoundError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 404;
  }
}

export default NotFoundError;
