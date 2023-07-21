import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from '../roles/role.model';
import { User } from './user.model';

@Resolver('User')
export class UserRoleResolver {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
  ) {}

  @ResolveField('role')
  getUserRole(@Parent() user: User) {
    return this.roleModel.findById(user.role).exec();
  }
}
