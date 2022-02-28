import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ApiService } from 'src/api/api.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => ApiService))
    private apiService: ApiService,
    private jwtService: JwtService,
  ) {}
  // Hashing!
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
  //  Validation
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
  // Register
  async register(newUser: User): Promise<User> {
    try {
      const { firstName, lastName, email, password } = newUser;
      const hashedPassword = await this.hashPassword(password);
      const api_key = uuidv4();
      const registeredUser = await this.userRepository.save({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        api_key,
      });
      await this.apiService.generateApi(registeredUser.id.toString());
      delete registeredUser.password;
      return registeredUser;
    } catch (error) {
      throw error;
    }
  }
  // Login
  async login(credentials: User): Promise<{ accessToken: string; user: User }> {
    const { email, password } = credentials;
    const user = await this.validateUser(email, password);
    if (user) {
      // create JWT credentials
      const accessToken = await this.jwtService.signAsync({ id: user.id });
      return { accessToken, user };
    } else {
      throw new UnauthorizedException();
    }
  }
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string) {
    try {
      return await this.userRepository.findOne(id);
    } catch (error) {
      throw new NotFoundException();
    }
  }
  async findByApiKey(key: string) {
    try {
      return await this.userRepository.findOne({ api_key: key });
    } catch (error) {
      throw new NotFoundException();
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
