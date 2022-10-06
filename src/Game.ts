export default class Game {
  players: Player[];

  constructor() {
    this.players = [];
  }

  join(playerId: string, nickname: string) {
    const newPlayer: Player = {
      id: playerId,
      nickname,
      score: 0,
    };

    this.players.push(newPlayer);
  }

  leave(playerId: string) {
    const index = this.players.findIndex((player) => player.id === playerId);
    if (index == -1) {
      return;
    }
    this.players.splice(index, 1);
  }
}

interface Player {
  id: string;
  nickname: string;
  score: number;
}
