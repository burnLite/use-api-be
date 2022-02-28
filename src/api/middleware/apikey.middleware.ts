import {
    ForbiddenException,
    Injectable
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ApiKeyMiddleware {
  constructor(private readonly userRepository: UsersService) {}

  async use(req, res, next) {
    const user = await this.userRepository.findByApiKey(req.query.api_key);
    if (user) {
      next();
    } else {
      throw new ForbiddenException();
    }
  }
}
