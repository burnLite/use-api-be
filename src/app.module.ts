import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ApiModule } from './api/api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGO_DB,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      useUnifiedTopology: true,
      // useNewUrlParser: true,
      synchronize: true,
    }),
    UsersModule,
    ApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
