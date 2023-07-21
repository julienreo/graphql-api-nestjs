import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission } from './permission.model';
import { Role } from '../roles/role.model';

@Resolver('Permission')
export class PermissionRolesResolver {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<Role>,
  ) {}

  @ResolveField('roles')
  listPermissionRoles(@Parent() permission: Permission) {
    return this.roleModel.find({ permissions: permission.id }).exec();
  }
}
