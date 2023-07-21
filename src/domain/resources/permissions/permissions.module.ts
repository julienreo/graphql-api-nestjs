import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from '../roles/role.model';
import { PermissionRolesResolver } from './permission-roles.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Role.name,
        schema: RoleSchema,
      },
    ]),
  ],
  providers: [PermissionRolesResolver],
})
export class PermissionsModule {}
