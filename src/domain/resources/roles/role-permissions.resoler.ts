import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission } from '../permissions/permission.model';
import { Role } from '../roles/role.model';

@Resolver('Role')
export class RolePermissionsResolver {
  constructor(
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<Permission>,
  ) {}

  @ResolveField('permissions')
  listRolePermissions(@Parent() role: Role) {
    return this.permissionModel.find({ roles: role.id }).exec();
  }
}
