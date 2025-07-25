import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';
import { InstallationModule } from './installation/installation.module';
import { MaintainanceModule } from './maintainance/maintainance.module';

@Module({
  imports: [UserModule, AuthModule, CustomerModule, InstallationModule, MaintainanceModule],
})
export class ApiModule {}
