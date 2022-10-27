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

    // 일단 나간다. 이후 게임중인지 아니면 로비인지 생각한다. 게임중일 경우 나가면서 턴을 넘긴다.
    // 게임중에 나갈 경우 그냥 나간 거 처리

    // 플레이어 나가는 사람의 정보를 저장해서 만약 나가는 플레이어아이디랑 어드민아이디가 같으면 다른 플레이어가 있을 시 adminId로 넣어주고 없으면 null값을 넣어준다.
    // 플레이어가 나갔을 때 방장아이디를 지워주어야 함.
    // 만약 남은 플레이어가 있을 시 그 플레이어에게 방장을 넘기도록 한다.
    // 남은 플레이어가 없다면 null로 만든다.

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
