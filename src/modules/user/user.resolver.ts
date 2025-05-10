import { Resolver, Mutation, Query, Args, Context } from '@nestjs/graphql';
import { CreateUserInput } from './dto/user.dto';
import { User } from './models/user.model';
import { UserService } from './user.service';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { CheckConnectionDTO } from './dto/check-connection.dto';
import { Public } from 'src/common/decorators/param-decorator/public.decorator';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => CheckConnectionDTO)
  checkServer(@Context() context): CheckConnectionDTO {
    console.log('Request Headers:', context.req.headers);
    return { connectionStatus: 'connected with graphql' };
  }

  @Mutation(() => String)
  @Public()
  async createUser(@Args('data') data: CreateUserInput): Promise<string> {
    return this.userService.createUser(data);
  }

  @Query(() => [User])
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Query(() => User, { nullable: true })
  async findUserByEmail(@Args('email') email: string): Promise<User | null> {
    const user = await this.userService.findUserByEmail(email);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return user;
  }
}
