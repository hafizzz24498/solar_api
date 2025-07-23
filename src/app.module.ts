import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from './api/api.module';

@Module({
  imports: [ConfigModule, ApiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
