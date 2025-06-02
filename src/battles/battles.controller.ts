import { Controller, Post, Body } from '@nestjs/common';

import { BattleDto } from './dto/battle.dto';
import { BattlesService } from './battles.service';

@Controller('battles')
export class BattlesController {
  constructor(private readonly battlesService: BattlesService) {}

  @Post()
  battle(@Body() battleDto: BattleDto) {
    return this.battlesService.battle(battleDto);
  }
}
