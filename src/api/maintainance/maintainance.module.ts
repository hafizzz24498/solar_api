import { Module } from '@nestjs/common';
import { MaintainanceService } from './maintainance.service';
import { MaintainanceController } from './maintainance.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { CustomerModule } from '../customer/customer.module';

@Module({
  imports: [PrismaModule, UserModule, CustomerModule],
  controllers: [MaintainanceController],
  providers: [MaintainanceService],
})
export class MaintainanceModule {}
