import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/create-user.dto';
import { UpdateUserInput } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { Permissions } from 'src/iam/authorization/decorators/permissions.decorator';
import { Permission } from '../permissions/enums/permission.enum';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Permissions(Permission.GET_USER)
  @Query('user')
  get(@Args('id') id: string) {
    return this.usersService.get(id);
  }

  @Permissions(Permission.LIST_USERS)
  @Query('users')
  list(@Args('limit') limit: number, @Args('offset') offset: number) {
    return this.usersService.list(limit, offset);
  }

  @Permissions(Permission.CREATE_USER)
  @Mutation('createUser')
  create(
    @Args('createUserInput')
    createUserInput: CreateUserInput,
  ) {
    return this.usersService.create(createUserInput);
  }

  @Permissions(Permission.UPDATE_USER)
  @Mutation('updateUser')
  update(
    @Args('id') id: string,
    @Args('updateUserInput')
    updateUserInput: UpdateUserInput,
  ) {
    return this.usersService.update(id, updateUserInput);
  }

  @Permissions(Permission.DELETE_USER)
  @Mutation('deleteUser')
  delete(@Args('id') id: string) {
    return this.usersService.delete(id);
  }
}
