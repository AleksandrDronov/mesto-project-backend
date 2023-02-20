interface IAuthError {
  message: string,
  statusCode: number
}

class AuthError extends Error implements IAuthError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 401;
  }
}

export default AuthError;
