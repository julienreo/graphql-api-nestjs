import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from '../companies/company.model';
import { Permission, PermissionSchema } from '../permissions/permission.model';
import { RoleCompanyResolver } from './role-company.resolver';
import { RolePermissionsResolver } from './role-permissions.resoler';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Permission.name,
        schema: PermissionSchema,
      },
      {
        name: Company.name,
        schema: CompanySchema,
      },
    ]),
  ],
  providers: [RolePermissionsResolver, RoleCompanyResolver],
})
export class RolesModule {}
