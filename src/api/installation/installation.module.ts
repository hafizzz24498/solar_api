import { Module } from '@nestjs/common';
import { InstallationService } from './installation.service';
import { InstallationController } from './installation.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CustomerModule } from '../customer/customer.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule, CustomerModule, UserModule],
  controllers: [InstallationController],
  providers: [InstallationService],
})
export class InstallationModule {}
