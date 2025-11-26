import { Module } from '@nestjs/common';
import { UsersController } from './controllers/user.controller';
import { UsersService } from './services/user.services'
import { TrackController } from './controllers/track.controller';
import { TrackService } from './services/track.services';

@Module({
  imports: [],
  controllers: [UsersController, TrackController],
  providers: [UsersService, TrackService],
})
export class AppModule {}
