// backend/src/auth-admin/auth-admin.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { AuthAdminService } from './auth-admin.service';

@Controller('admin/auth')
export class AuthAdminController {
  constructor(private svc: AuthAdminService) {}

  @Post('delete-user')
  async deleteUser(@Body('email') email: string) {
    return this.svc.deleteUserByEmail(email);
  }

  @Post('resend-confirmation')
  async resend(@Body('email') email: string) {
    return this.svc.resendConfirmation(email);
  }
}
