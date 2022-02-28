import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiService } from './api.service';
import { Api } from './entities/api.entity';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get()
  findAll(@Query() query) {
    return this.apiService.findAll(query);
    return [];
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query() query) {
    return this.apiService.findOne(+id, query);
  }

  @Post()
  create(@Body() newPost: Api) {
    return this.apiService.create(newPost);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() newPost: Api, @Query() query) {
    return this.apiService.update(+id, newPost, query);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apiService.remove(id);
  }
}
