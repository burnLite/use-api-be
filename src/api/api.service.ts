import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Api } from './entities/api.entity';

@Injectable()
export class ApiService {
  constructor(
    @InjectRepository(Api) private readonly apiRepository: Repository<Api>,
  ) {}
  //
  async create(newPost: Api) {
    try {
      return await this.apiRepository.save(newPost);
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<Api[]> {
    try {
      return await this.apiRepository.find();
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number): Promise<Api> {
    try {
      return await this.apiRepository.findOne(id);
    } catch (error) {
      throw error;
    }
  }

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
