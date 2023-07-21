import { Logger, Module } from '@nestjs/common';
import { AuthenticationService } from './authentication/authentication.service';
import { BcryptService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hashing.service';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/domain/resources/users/user.model';
import { AuthenticationResolver } from './authentication/authentication.resolver';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './authentication/guards/access-token.guard';
import { CachingService } from 'src/services/caching/caching.service';
import { RedisService } from 'src/services/caching/redis.service';
import { PermissionsGuard } from './authorization/guards/permissions.guard';

@Module({
  imports: [
    // Configure JwtModule
    JwtModule.registerAsync(jwtConfig.asProvider()),
    // Load JWT config
    ConfigModule.forFeature(jwtConfig),
    // Register schemas
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [
    AuthenticationResolver,
    AuthenticationService,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    // Guards will be made available globally (not only in current module)
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    AuthenticationService,
    {
      provide: CachingService,
      useClass: RedisService,
    },
    Logger,
  ],
})
export class IamModule {}
