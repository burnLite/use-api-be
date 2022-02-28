import { faker } from '@faker-js/faker';
import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Api, SingleApi } from './entities/api.entity';
// Interfaces
interface queryType {
  api_key: string;
}
//
@Injectable()
export class ApiService {
  constructor(
    @InjectRepository(Api)
    private readonly apiRepository: Repository<Api>,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}
  // GENERATE APIs
  async generateApi(userId: string) {
    try {
      let apiData = {
        userId,
        data: [],
      };
      for (let i = 0; i < 20; i++) {
        const animal = {
          id: i + 1,
          name: faker.name.firstName(),
          type: faker.animal.type(),
          legs: Math.floor(Math.random() * (4 - 1) + 1),
          img: faker.image.animals(),
          tail: Boolean(Math.floor(Math.random() * (2 - 0) + 0)),
          friends: [faker.name.firstName(), faker.name.firstName()],
        };
        apiData.data.push(animal);
      }
      await this.apiRepository.save(apiData);
    } catch (error) {
      throw new Error();
    }
  }
  // ADD TO CURENT API
  async create(newPost: Api) {
    try {
      return await this.apiRepository.save(newPost);
    } catch (error) {
      throw error;
    }
  }
  // FIND ALL
  async findAll(query: queryType | undefined): Promise<SingleApi[]> {
    try {
      let api = null;
      if (query.api_key) {
        const user = await this.userService.findByApiKey(query.api_key);
        if (!user) throw new ForbiddenException();
        api = await this.apiRepository.findOne({
          userId: user.id.toString(),
        });
      } else {
        api = await this.apiRepository.findOne({ userId: 'DEFAULT' });
      }
      console.log(api);
      return api.data;
    } catch (error) {
      throw error;
    }
  }
  // Find specific API item
  async findOne(id: string, query: queryType | undefined): Promise<SingleApi> {
    try {
      let api = null;
      if (query.api_key) {
        const user = await this.userService.findByApiKey(query.api_key);
        if (!user) throw new ForbiddenException();
        api = await this.apiRepository.findOne({
          userId: user.id.toString(),
        });
      } else {
        api = await this.apiRepository.findOne({ userId: 'DEFAULT' });
      }
      return api.data.filter((item: SingleApi) => item.id == id)[0];
    } catch (error) {
      throw error;
    }
  }
  //
  async update(id: number, updatePost: Api): Promise<UpdateResult> {
    try {
      const pet = await this.apiRepository.update(id, updatePost);
      return pet;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<DeleteResult> {
    return this.apiRepository.delete(id);
  }
}
