import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from '../roles/role.model';
import { User, UserSchema } from '../users/user.model';
import { CompaniesResolver } from './companies.resolver';
import { CompaniesService } from './companies.service';
import { CompanyRolesResolver } from './company-roles.resolver';
import { CompanyUsersResolver } from './company-users.resolver';
import { Company, CompanySchema } from './company.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Company.name,
        schema: CompanySchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Role.name,
        schema: RoleSchema,
      },
    ]),
  ],
  providers: [
    CompaniesResolver,
    CompaniesService,
    CompanyUsersResolver,
    CompanyRolesResolver,
  ],
})
export class CompaniesModule {}
