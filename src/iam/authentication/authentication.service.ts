import { randomUUID } from 'crypto';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigType } from '@nestjs/config';
import { Model } from 'mongoose';
import { User } from 'src/domain/resources/users/user.model';
import { InvalidCredentialsError } from '../errors/invalid-credentials.error';
import { HashingService } from '../hashing/hashing.service';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { UserData } from '../interfaces/user-data.interface';
import { DB_ERROR_CODES } from 'src/constants/app.constants';
import { ConflictError } from 'src/domain/errors/conflict.error';
import { SignUpInput } from './dto/sign-up.input';
import { SignInInput } from './dto/sign-in.input';
import { RefreshTokenData } from '../interfaces/refresh-token-data.interface';
import { InvalidRefreshTokenError } from '../errors/invalid-refresh-token.error';
import { CachingService } from 'src/services/caching/caching.service';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly cachingService: CachingService,
    private readonly logger: Logger,
  ) {}

  /**
   * Sign user up
   *
   * @param signUpInput
   */
  async signUp(signUpInput: SignUpInput) {
    try {
      let user = new this.userModel({
        ...signUpInput,
        password: await this.hashingService.hash(signUpInput.password),
      });
      user = await user.save();
      return user;
    } catch (err) {
      // If email already exists, MongoDB will raise an error whose code is 11000
      if (err.code === DB_ERROR_CODES.DUPLICATE_KEY_CODE) {
        throw new ConflictError('User already exists');
      }
      throw err;
    }
  }

  /**
   * Sign user in
   *
   * @param signInInput
   */
  async signIn(signInInput: SignInInput) {
    const { email, password } = signInInput;

    // Check that user exists
    const user = await this.userModel
      .findOne({ email })
      .populate({
        path: 'role',
        populate: {
          path: 'permissions',
        },
      })
      .exec();
    if (!user) {
      throw new InvalidCredentialsError('Invalid email');
    }

    // Validate user password
    const isValid = await this.hashingService.compare(password, user.password);
    if (!isValid) {
      throw new InvalidCredentialsError('Invalid password');
    }

    // Generate access and refresh token
    return {
      accessToken: await this.generateAccessToken(user),
      refreshToken: await this.generateRefreshToken(user),
    };
  }

  /**
   * Generate access token
   *
   * @param user
   */
  private async generateAccessToken(user: User) {
    // Generate access token and include user email in its payload
    const accessToken = await this.signToken<Partial<UserData>>(
      user.id,
      this.jwtConfiguration.accessTokenTtl,
      { email: user.email },
    );

    // Store user data in caching system with a TTL that equals access token TTL
    const userData: UserData = {
      id: user.id,
      email: user.email,
      role: user.role?.name,
      permissions: user.role?.permissions?.map(({ name }) => name),
    };
    await this.cachingService.set(
      `user:${user.id}:userData`,
      JSON.stringify(userData),
      this.jwtConfiguration.accessTokenTtl,
    );

    return accessToken;
  }

  /**
   * Generate refresh tokens
   *
   * @param user
   */
  private async generateRefreshToken(user: User) {
    const refreshTokenId = randomUUID();

    // Generate refresh token and include its ID within the payload
    const refreshToken = await this.signToken<Partial<RefreshTokenData>>(
      user.id,
      this.jwtConfiguration.refreshTokenTtl,
      { refreshTokenId },
    );
    // Store refresh token ID in caching system with a TTL that equals refresh token TTL
    await this.cachingService.set(
      `user:${user.id}:refreshTokenId`,
      refreshTokenId,
      this.jwtConfiguration.refreshTokenTtl,
    );

    return refreshToken;
  }

  /**
   * Sign a token
   *
   * @param userId
   * @param expiresIn
   * @param payload
   */
  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }

  /**
   * Generate new access and refresh tokens
   *
   * @param refreshToken
   */
  async refreshTokens(refreshToken: string) {
    try {
      // Validate and decode refresh token
      const { sub, refreshTokenId }: RefreshTokenData =
        await this.jwtService.verifyAsync<RefreshTokenData>(
          refreshToken,
          this.jwtConfiguration,
        );
      if (!sub || !refreshTokenId) {
        throw new InvalidRefreshTokenError();
      }

      // Retrieve corresponding user
      const user = await this.userModel.findById(sub).exec();
      if (!user) {
        throw new InvalidRefreshTokenError();
      }

      // Check that refresh token matches the one stored in caching system
      const isRefreshTokenValid = await this.validateRefreshToken(
        `user:${user.id}:refreshTokenId`,
        refreshTokenId,
      );
      // If so, delete it from cache as it must only serve once
      if (isRefreshTokenValid) {
        await this.cachingService.delete(`user:${user.id}:refreshTokenId`);
      } else {
        throw new InvalidRefreshTokenError();
      }

      // Generate and return new access and refresh tokens
      return {
        accessToken: await this.generateAccessToken(user),
        refreshToken: await this.generateRefreshToken(user),
      };
    } catch (err) {
      this.logger.error(err);
      throw new InvalidRefreshTokenError();
    }
  }

  /**
   * Validate refresh token
   *
   * @param key
   * @param value
   */
  private async validateRefreshToken(
    key: string,
    value: string,
  ): Promise<boolean> {
    // Retrieve refresh token from caching system
    const refreshTokenId = await this.cachingService.get(key);
    if (!refreshTokenId) {
      throw new InvalidRefreshTokenError();
    }
    // Check that it matches the one supplied
    return refreshTokenId === value;
  }
}
