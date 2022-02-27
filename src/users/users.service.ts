import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  //
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne(
      { email },
      {
        select: ['id', 'firstName', 'lastName', 'email', 'password'],
      },
    );
    if (user) {
      if (bcrypt.compare(password, user.password)) {
        delete user.password;
        return user;
      }
    }
  }
  //
  async register(newUser: User): Promise<User> {
    try {
      const { firstName, lastName, email, password } = newUser;
      const hashedPassword = await this.hashPassword(password);
      const registeredUser = await this.userRepository.save({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
      delete registeredUser.password;
      return registeredUser;
    } catch (error) {
      throw error;
    }
  }
  //
  async login(credentials: User): Promise<{ accessToken: string; user: User }> {
    const { email, password } = credentials;
    const user = await this.validateUser(email, password);
    console.log(credentials);
    console.log(user);
    if (user) {
      // create JWT credentials
      const accessToken = await this.jwtService.signAsync({ user });
      return { accessToken, user };
    }
  }
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string) {
    try {
      return await this.userRepository.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateUser: User) {
    try {
      const pet = await this.userRepository.update(id, updateUser);
      return pet;
    } catch (error) {
      throw error;
    }
  }

  remove(id: string) {
    return this.userRepository.delete(id);
  }
}
