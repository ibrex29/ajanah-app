import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UserNotFoundException } from './exceptions/UserNotFound.exception';
import { CreateUserInput } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService
  ) {}
  
  async createUser(data: CreateUserInput): Promise<string> {

    await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        otherNames: data.otherNames,
        gender: data.gender,
        dob: new Date(data.dob),
        address: data.address,
        state: data.state,
        country: 'nigeria',
        phoneNumber: data.phoneNumber,
        isActive: true, 
        authStrategy: 'local',
        role: 'user',
      },
    });

    return 'User created successfully';
  }
  
  async findUserByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email },
      select: {
        id: true,
        phoneNumber: true,
        email: true,
        password: true,
        isActive: true,
        role: true,
        firstName: true,
        lastName: true,
        gender: true,      // Add missing fields
        dob: true,
        address: true,
        state: true,
        country: true,
      },
    });
  }
  

  async getAllUsers() {
    return this.prisma.user.findMany();
  }

  async findUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async deleteUser(userId: string): Promise<User> {
    await this.validateUserExists(userId);

    return this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }

  async validateUserExists(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UserNotFoundException();
    }
  }

  async validateUserEmailExists(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email: email } });
    if (!user) {
      throw new UserNotFoundException();
    }
  }

  async activateUser(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isActive: true,
      },
    });
  }

  async deactivateUser(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isActive: false,
      },
    });
  }
}
