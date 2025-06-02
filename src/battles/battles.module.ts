import { Module } from '@nestjs/common';

import { BattlesService } from './battles.service';
import { BattlesController } from './battles.controller';
import { CharactersModule } from '../characters/characters.module';

@Module({
  imports: [CharactersModule],
  controllers: [BattlesController],
  providers: [BattlesService],
})
export class BattlesModule {}
