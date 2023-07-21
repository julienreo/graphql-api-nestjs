import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InvalidCredentialsError } from 'src/iam/errors/invalid-credentials.error';
import { InvalidRefreshTokenError } from 'src/iam/errors/invalid-refresh-token.error';
import { BadRequestError } from '../errors/bad-request.error';
import { ConflictError } from '../errors/conflict.error';
import { NotFoundError } from '../errors/not-found.error';

@Catch(
  NotFoundError,
  ConflictError,
  BadRequestError,
  InvalidRefreshTokenError,
  InvalidCredentialsError,
)
export class UnhandledErrorsFilter<
  T extends NotFoundError | ConflictError | UnauthorizedException,
> implements ExceptionFilter
{
  /**
   * Catch a Business error and throw its corresping HTTP exception
   *
   * @param exception
   * @param host
   */
  catch(exception: T) {
    const { name, message } = exception;

    const errorsHandlers = {
      NotFoundError: () => {
        throw new NotFoundException(message);
      },
      ConflictError: () => {
        throw new ConflictException(message);
      },
      BadRequestError: () => {
        throw new BadRequestException(message);
      },
      InvalidRefreshTokenError: () => {
        throw new UnauthorizedException(message);
      },
      InvalidCredentialsError: () => {
        throw new UnauthorizedException(message);
      },
    };

    if (errorsHandlers[name]) {
      return errorsHandlers[name]();
    }
  }
}
