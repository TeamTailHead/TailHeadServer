import { ServerCommunicator } from "@tailhead/communicator";

interface WordChecker {
  isWordExists(word: string): boolean;
}

export default class Game {
  players: Player[];
  adminPlayerId: string | null;

  constructor(private sendAll: ServerCommunicator["sendAll"], private wordChecker: WordChecker) {
    this.players = [];
    this.adminPlayerId = null;
  }

  join(playerId: string, nickname: string) {
    const newPlayer: Player = {
      id: playerId,
      nickname,
      score: 0,
    };
    this.players.push(newPlayer);
    if (this.adminPlayerId == null) {
      this.adminPlayerId = playerId;
    }

    this.sendAll("lobbyInfo", {
      players: this.players.map((player) => ({
        id: player.id,
        nickname: player.nickname,
      })),
      adminId: this.adminPlayerId ?? "",
    });
  }

  leave(playerId: string) {
    const index = this.players.findIndex((player) => player.id === playerId);
    if (index == -1) {
      return;
    }
    const leavedPlayerId = this.players[index].id;

    this.players.splice(index, 1);
    if (leavedPlayerId == this.adminPlayerId) {
      this.adminPlayerId = null;

      if (this.players.length != 0) {
        this.adminPlayerId = this.players[0].id;
      }
    }

    this.sendAll("lobbyInfo", {
      players: this.players.map((player) => ({
        id: player.id,
        nickname: player.nickname,
      })),
      adminId: this.adminPlayerId ?? "",
    });
  }
}

interface Player {
  id: string;
  nickname: string;
  score: number;
}

// const noopFunction = () => {
//   throw new Error("핸들러가 설정되지 않음!");
// };

//
