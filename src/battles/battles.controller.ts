import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { BattlesService } from './battles.service';
import { BattleDto } from './dto/battle.dto';
import { BattleResultDto } from './dto/battle-result.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('battles')
@Controller('battles')
export class BattlesController {
  constructor(private readonly battlesService: BattlesService) {}

  @Post()
  @ApiOperation({ summary: 'Simulate a battle between two characters' })
  @ApiBody({ type: BattleDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Battle result successfully calculated',
    type: BattleResultDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid battle data or character not found',
  })
  simulateBattle(@Body() battleDto: BattleDto): BattleResultDto {
    return this.battlesService.simulateBattle(
      battleDto.character1Id,
      battleDto.character2Id,
    );
  }
}
