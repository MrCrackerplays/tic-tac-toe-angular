import { Component } from '@angular/core';
import { GameService } from '../home/game.service';

@Component({
  selector: 'app-game-settings',
  templateUrl: './game-settings.component.html',
  styleUrls: ['./game-settings.component.css'],
})
export class GameSettingsComponent {
  constructor(private gameService: GameService) {}
  playerName: string = '';
  newWidth: number = this.gameService.board_width;
  newHeight: number = this.gameService.board_height;
  newWinLength: number = this.gameService.line_win_length;

  getWidth(): number {
    return this.gameService.board_width;
  }

  getHeight(): number {
    return this.gameService.board_height;
  }

  getWinningLength(): number {
    return this.gameService.line_win_length;
  }

  saveBoard(): void {
    this.gameService.setBoardWidth(this.newWidth);
    this.gameService.setBoardHeight(this.newHeight);
    this.gameService.setWinLength(this.newWinLength);
    this.gameService.resetBoard();
  }

  resetDefaults(): void {
    this.newWidth = 3;
    this.newHeight = 3;
    this.newWinLength = 3;
    this.saveBoard();
  }

  addPlayer(name: string): void {
    if (name.length > 0 && !this.gameService.players.includes(name))
      this.gameService.players.push(name);
    this.gameService.savePlayers();
  }

  removePlayer(name: string): void {
    this.gameService.players = this.gameService.players.filter(
      (p) => p !== name
    );
    this.gameService.savePlayers();
  }

  getPlayers(): string[] {
    return this.gameService.players;
  }
}
