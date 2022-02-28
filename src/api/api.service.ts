import { faker } from '@faker-js/faker';
import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { DeleteResult, Repository } from 'typeorm';
import { v1 as uuidv1 } from 'uuid';
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
  // Check user by API_KEY and Index of specific item
  async checkApiKey(query: queryType | undefined, id?: string | undefined) {
    const user = await this.userService.findByApiKey(query.api_key);
    if (!user) throw new ForbiddenException();
    let api = await this.apiRepository.findOne({
      userId: user.id.toString(),
    });
    let index = null;
    if (id) {
      index = api.data.findIndex((item: any) => item.id == id);
    }
    return { index, api, user };
  }
  // GENERATE APIs
  async generateApi(userId: string) {
    try {
      let apiData = {
        userId,
        data: [],
      };
      for (let i = 0; i < 10; i++) {
        const animal = {
          id: uuidv1(),
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
  // ADD TO CURENT API
  async create(newPost: SingleApi, query: queryType): Promise<SingleApi> {
    const { name, type, legs, img, tail, friends } = newPost;
    try {
      const { api, user } = await this.checkApiKey(query);
      if (api.data.length < 20) {
        const newPost = {
          id: uuidv1(),
          name,
          type,
          legs,
          img,
          tail,
          friends,
        };
        api.data.push(newPost);
        await this.apiRepository.update(
          { userId: user.id.toString() },
          { data: api.data },
        );
        return newPost;
      } else {
        throw new Error();
      }
    } catch (error) {
      throw error;
    }
  }
  // Update
  async update(
    id: string,
    updatePost: any,
    query: queryType | undefined,
  ): Promise<SingleApi> {
    try {
      // Checking
      const { api, index, user } = await this.checkApiKey(query, id);
      // updating
      api.data[index] = { ...api.data[index], ...updatePost };
      await this.apiRepository.update(
        { userId: user.id.toString() },
        { data: api.data },
      );
      return api.data[index];
    } catch (error) {
      throw error;
    }
  }

  async remove(
    id: string,
    query: queryType | undefined,
  ): Promise<{ msg: string }> {
    try {
      const { api, index, user } = await this.checkApiKey(query, id);
      api.data.splice(index, 1);
      await this.apiRepository.update(
        { userId: user.id.toString() },
        { data: api.data },
      );
      return { msg: 'Deleted' };
    } catch (error) {}
  }
}
