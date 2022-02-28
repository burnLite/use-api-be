import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtGuard } from './guards/jwt.guards';
import { JwtStrategy } from './guards/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ApiModule } from 'src/api/api.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '3d' },
      }),
    }),
    TypeOrmModule.forFeature([User]),
    forwardRef(() => ApiModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtGuard, JwtStrategy],
  exports: [UsersService],
})
export class UsersModule {}
