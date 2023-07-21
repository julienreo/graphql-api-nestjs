import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Company,
  CompanySchema,
} from 'src/domain/resources/companies/company.model';
import {
  Permission,
  PermissionSchema,
} from 'src/domain/resources/permissions/permission.model';
import { Role, RoleSchema } from 'src/domain/resources/roles/role.model';
import { User, UserSchema } from 'src/domain/resources/users/user.model';
import { ConfigModule } from '@nestjs/config';
import { SeedersService } from './seeders.service';
import { Seeder, SeederSchema } from './seeder.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Company.name,
        schema: CompanySchema,
      },
      {
        name: Role.name,
        schema: RoleSchema,
      },
      {
        name: Permission.name,
        schema: PermissionSchema,
      },
      {
        name: Seeder.name,
        schema: SeederSchema,
      },
    ]),
    ConfigModule,
  ],
  providers: [SeedersService],
  exports: [],
})
export class SeedersModule {}
