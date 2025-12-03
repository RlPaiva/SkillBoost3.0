// backend/src/auth-admin/auth-admin.module.ts
import { Module } from '@nestjs/common';
import { AuthAdminService } from './auth-admin.service';
import { AuthAdminController } from './auth-admin.controller';

@Module({
  controllers: [AuthAdminController],
  providers: [AuthAdminService],
  exports: [AuthAdminService],
})
export class AuthAdminModule {}
