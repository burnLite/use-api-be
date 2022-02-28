import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Api } from './entities/api.entity';
import { ApiKeyMiddleware } from './middleware/apikey.middleware';
import { UsersModule } from 'src/users/users.module';
import path from 'path/posix';

@Module({
  imports: [TypeOrmModule.forFeature([Api]), forwardRef(() => UsersModule)],
  controllers: [ApiController],
  providers: [ApiService],
  exports: [ApiService],
})
export class ApiModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiKeyMiddleware)
      .exclude({ path: 'api', method: RequestMethod.GET })
      .forRoutes({
        path: 'api',
        method: RequestMethod.ALL,
      });
  }
}
