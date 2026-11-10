import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { NotesController } from './notes/notes.controller';
import { NotesModule } from './notes/notes.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, AuthModule, NotesModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Task 3 — RequestId runs BEFORE the logger, for the Auth and
    // Notes controllers, so every log line can include the request id.
    consumer
      .apply(RequestIdMiddleware, LoggerMiddleware)
      .forRoutes(AuthController, NotesController);
  }
}
