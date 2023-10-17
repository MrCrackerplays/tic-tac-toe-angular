import { Injectable } from '@angular/core';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private storageService: StorageService) {}

  board_width = this.getNumber('board_width', 3);
  board_height = this.getNumber('board_height', 3);
  line_win_length = this.getNumber('board_win_length', 3);
  board: string[] = Array<string>(this.board_width * this.board_height).fill(
    ''
  );
  players: string[] = this.getPlayers();
  winner: string | null = null;
  is_game_over: boolean = false;
  currentPlayer: number = -1;
  startPlayer: number = -1;

  private getNumber(key: string, fallback: number): number {
    let val = this.storageService.getData(key);
    if (val !== null && !Number.isNaN(Number(val))) return Number(val);
    return fallback;
  }

  private getPlayers(): string[] {
    let val = this.storageService.getData('players_list');
    const fallback = ['X', 'O'];
    if (val === null) return fallback;
    return JSON.parse(val);
  }

  savePlayers(): void {
    this.storageService.saveData('players_list', JSON.stringify(this.players));
  }

  getCurrentPlayerName(): string {
    if (this.currentPlayer >= 0 && this.currentPlayer < this.players.length)
      return this.players[this.currentPlayer];
    return 'No Player';
  }

  tileClick(i: number): void {
    if (
      this.board[i] != '' ||
      this.is_game_over ||
      this.currentPlayer < 0 ||
      this.players.length <= this.currentPlayer
    )
      return;
    this.board.splice(i, 1, this.players[this.currentPlayer]);
    if (this.generalHasWon(i)) {
      this.winner = this.players[this.currentPlayer];
      const curval = this.storageService.getData('playerscore_' + this.winner);
      this.storageService.saveData(
        'playerscore_' + this.winner,
        curval === null ? '1' : Number(curval) + 1 + ''
      );
      this.is_game_over = true;
    } else if (!this.board.includes('')) {
      this.is_game_over = true;
    } else this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
  }

  setBoardWidth(width: number): void {
    this.board_width = width;
    this.storageService.saveData('board_width', this.board_width + '');
  }

  setBoardHeight(height: number): void {
    this.board_height = height;
    this.storageService.saveData('board_height', this.board_height + '');
  }

  setWinLength(winLength: number): void {
    this.line_win_length = winLength;
    this.storageService.saveData('board_win_length', this.line_win_length + '');
  }

  resetBoard(): void {
    this.startPlayer = (this.startPlayer + 1) % this.players.length;
    this.currentPlayer = this.startPlayer;
    this.is_game_over = false;
    this.winner = null;
    this.board = Array<string>(this.board_width * this.board_height).fill('');
  }

  // hasWon(): boolean {
  //   const lines = [
  //     [0, 1, 2],
  //     [3, 4, 5],
  //     [6, 7, 8],
  //     [0, 3, 6],
  //     [1, 4, 7],
  //     [2, 5, 8],
  //     [0, 4, 8],
  //     [2, 4, 6],
  //   ];
  //   for (let i = 0; i < lines.length; i++) {
  //     const [a, b, c] = lines[i];
  //     if (
  //       this.board[a] &&
  //       this.board[a] === this.board[b] &&
  //       this.board[a] === this.board[c]
  //     ) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }

  generalHasWon(index: number): boolean {
    if (this.line_win_length < 2) return true;
    let to_test: string = this.board[index];
    if (to_test === '') return false;

    let x: number = index % this.board_width;
    let y: number = Math.floor(index / this.board_width);

    // * begins at position x+1-line_win_length,y-1+line_win_length and ends at position x,y  this is direction x+1,y-1
    // * begins at position x+1-line_win_length,y and ends at position x,y                    this is direction x+1,y
    // * begins at position x+1-line_win_length,y+1-line_win_length and ends at position x,y  this is direction x+1,y+1
    // * begins at position x,y+1-line_win_length and ends at position x,y                    this is direction x,y+1
    // fill line with the first [line_win_length] strings in a line that [* SEE ABOVE]
    // then check every string
    // if not every string matches replace the oldest placed string with what comes next going in the direction of the direction vector

    let line: string[] = Array<string>(this.line_win_length).fill('');
    let direction: number[] = [1, -1];
    let dx = x;
    let dy = y;
    const calcDX = (progress: number) => {
      dx = x + direction[0] * (this.line_win_length - 1 - progress) * -1;
    };
    const calcDY = (progress: number) => {
      dy = y + direction[1] * (this.line_win_length - 1 - progress) * -1;
    };
    const getDXYString = () => {
      if (dy < 0 || dy >= this.board_height || dx < 0 || dx >= this.board_width)
        return '';
      else return this.board[dy * this.board_width + dx];
    };
    const setUp = () => {
      for (let i = 0; i < this.line_win_length; i++) {
        calcDX(i);
        calcDY(i);
        line[i] = getDXYString();
      }
    };
    const lineSolve = () => {
      if (line.every((s) => s === this.board[index])) return true;
      for (
        let progress = this.line_win_length;
        progress < 2 * this.line_win_length;
        progress++
      ) {
        calcDX(progress);
        calcDY(progress);
        line[progress % this.line_win_length] = getDXYString();
        if (line.every((s) => s === this.board[index])) return true;
      }
      return false;
    };
    direction = [1, -1]; // /
    setUp();
    if (lineSolve()) return true;
    direction = [1, 0]; // -
    setUp();
    if (lineSolve()) return true;
    direction = [1, 1]; // \
    setUp();
    if (lineSolve()) return true;
    direction = [0, 1]; // |
    setUp();
    if (lineSolve()) return true;
    return false;
  }
}
