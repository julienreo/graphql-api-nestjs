import { HttpCode, HttpStatus } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthenticationService } from './authentication.service';
import { RefreshTokensInput } from './dto/refresh-token.input';
import { SignInInput } from './dto/sign-in.input';
import { SignUpInput } from './dto/sign-up.input';

@Resolver()
export class AuthenticationResolver {
  constructor(private readonly authService: AuthenticationService) {}

  @Public()
  @Mutation()
  signUp(@Args('signUpInput') signUpInput: SignUpInput) {
    return this.authService.signUp(signUpInput);
  }

  // Return HTTP 200 response status code and not 201 as it is by default
  @HttpCode(HttpStatus.OK)
  @Public()
  @Mutation()
  signIn(@Args('signInInput') signInInput: SignInInput) {
    // Generate access and refresh tokens
    return this.authService.signIn(signInInput);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Mutation()
  refreshTokens(
    @Args('refreshTokensInput') refreshTokensInput: RefreshTokensInput,
  ) {
    const { refreshToken } = refreshTokensInput;
    // Generate access and refresh tokens
    return this.authService.refreshTokens(refreshToken);
  }
}
