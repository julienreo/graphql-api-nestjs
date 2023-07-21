import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BcryptService } from 'src/iam/hashing/bcrypt.service';
import { HashingService } from 'src/iam/hashing/hashing.service';
import { Company, CompanySchema } from '../companies/company.model';
import { PermissionsModule } from '../permissions/permissions.module';
import { Role, RoleSchema } from '../roles/role.model';
import { RolesModule } from '../roles/roles.module';
import { UserCompanyResolver } from './user-company.resolver';
import { UserRoleResolver } from './user-role.resolver';
import { User, UserSchema } from './user.model';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

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
    ]),
    RolesModule,
    PermissionsModule,
  ],
  providers: [
    UsersResolver,
    UsersService,
    UserCompanyResolver,
    UserRoleResolver,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
  ],
})
export class UsersModule {}
