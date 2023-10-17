import { Component } from '@angular/core';
import { StorageService } from '../storage.service';
import { GameService } from '../home/game.service';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.css'],
})
export class ScoreboardComponent {
  constructor(
    private storageService: StorageService,
    private gameService: GameService
  ) {}
  getPlayerScore(player: string): string {
    let playerScore = this.storageService.getData('playerscore_' + player);
    return playerScore ?? '0';
  }

  getScores() {
    return this.gameService.players
      .map((player) => [player, this.getPlayerScore(player)])
      .sort((a, b) => Number(b[1]) - Number(a[1]));
  }
}
