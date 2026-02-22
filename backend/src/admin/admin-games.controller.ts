import { Controller, Get, Patch, Body, Param, Put } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin/games')
export class AdminGamesController {
  constructor(private readonly gamesService: AdminService) {}

  @Get()
  getGames() {
    return this.gamesService.getAllGames();
  }

  @Get('categories')
  getCategories() {
    return this.gamesService.getCategories();
  }

  @Get('analytics')
  getAnalytics() {
    return this.gamesService.getGamesAnalyticsChart();
  }

  @Patch(':id')
  updateGame(@Param('id') id: string, @Body() body: any) {
    return this.gamesService.updateGameSettings(id, body);
  }

  @Put(':id/categories')
  assignCategories(
    @Param('id') id: string,
    @Body('categoryIds') categoryIds: string[],
  ) {
    return this.gamesService.assignGameToCategories(id, categoryIds);
  }
}
