import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { CompaniesModule } from './domain/resources/companies/companies.module';
import { UsersModule } from './domain/resources/users/users.module';
import { formatGraphQLError } from './graphql/graphql.helpers';
import { IamModule } from './iam/iam.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import { LoggingMiddleware } from './common/middleware/logging/logging.middleware';
import { SeedersModule } from './seeders/seeders.module';

@Module({
  imports: [
    // Load app configuration file
    ConfigModule.forRoot({ load: [appConfig] }),
    // Instanciate database connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('database.connectionUri'),
      }),
      inject: [ConfigService],
    }),
    // Configure GraphQL server
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      formatError: formatGraphQLError,
      context: ({ req }) => ({ headers: req.headers }),
    }),
    CompaniesModule,
    UsersModule,
    IamModule,
    SeedersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  // Apply middleware
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
