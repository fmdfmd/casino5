import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminUsersService } from './admin-users.service';
// import { AdminGuard } from 'src/auth/guards/admin.guard';

@Controller('admin/users')
// @UseGuards(AdminGuard)
export class AdminUsersController {
  constructor(private readonly usersService: AdminUsersService) {}

  @Get()
  getUsers(
    @Query('page') page: number,
    @Query('search') search: string,
    @Query('status') status: any,
  ) {
    return this.usersService.getUsers(Number(page) || 1, 15, search, status);
  }

  @Get(':id')
  getUserDetails(@Param('id') id: string) {
    return this.usersService.getUserDetails(id);
  }

  @Patch(':id/status')
  changeStatus(@Param('id') id: string, @Body('status') status: any) {
    return this.usersService.updateUserStatus(id, status);
  }
}
