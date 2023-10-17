import { Component } from '@angular/core';
import { GameService } from './game.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private gameService: GameService) {}

  getCurrentPlayerName(): string {
    return this.gameService.getCurrentPlayerName();
  }

  tileClick(i: number): void {
    this.gameService.tileClick(i);
  }

  getBoard(): string[] {
    return this.gameService.board;
  }

  getPlayers(): string[] {
    return this.gameService.players;
  }

  getStartPlayer(): number {
    return this.gameService.startPlayer;
  }

  setStartPlayer(i: number): void {
    this.gameService.startPlayer = i;
  }

  getCurrentPlayer(): number {
    return this.gameService.currentPlayer;
  }

  setCurrentPlayer(i: number): void {
    this.gameService.currentPlayer = i;
  }

  isGameOver(): boolean {
    return this.gameService.is_game_over;
  }

  getWinner(): string | null {
    return this.gameService.winner;
  }

  playAgain(): void {
    this.gameService.resetBoard();
  }

  getPlayerColor(i: number): string {
    let pli = this.gameService.players.findIndex(
      (p) => p === this.gameService.board[i]
    );
    if (pli == -1) return '#ac1ea6';
    const colors: string[] = [
      '#4744E0',
      '#62C911',
      '#B10F2E',
      '#087E8B',
      '#3C3C3C',
      '#570000',
      '#0B0033',
      '#D81E5B',
      '#9A348E',
    ];
    return colors[pli % colors.length];
  }

  getWidth(): number {
    return this.gameService.board_width;
  }
}
