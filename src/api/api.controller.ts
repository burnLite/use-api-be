import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiService } from './api.service';
import { Api } from './entities/api.entity';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Post()
  create(@Body() newPost: Api) {
    return this.apiService.create(newPost);
  }

  @Get()
  findAll() {
    return this.apiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.apiService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() newPost: Api) {
    return this.apiService.update(+id, newPost);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apiService.remove(id);
  }
}
