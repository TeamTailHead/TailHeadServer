import { ServerCommunicator } from "@tailhead/communicator";

import PlayerService from "./PlayerService";

interface GamePlayerInfo {
  id: string;
  score: number;
}

export default class InGameService {
  private playerInfo: Map<string, GamePlayerInfo>;
  private turnOrder: string[];
  private lastWord: string;
  private mySet: Set<string>;

  constructor(private communicator: ServerCommunicator, private playerService: PlayerService) {
    this.playerInfo = new Map();
    this.turnOrder = [];
    this.lastWord = "김밥";
    this.mySet = new Set();
  }

  start() {
    this.playerService.leaveEvent.addListener(({ leavedPlayer }) => {
      this.playerInfo.delete(leavedPlayer.id);
      this.turnOrder = this.turnOrder.filter((playerId) => playerId !== leavedPlayer.id);
      this.sendTurnInfoToUsers();
    });
    this.playerService.getPlayers().forEach((player) => {
      this.playerInfo.set(player.id, {
        id: player.id,
        score: 0,
      });
    });

    this.turnOrder = this.playerService.getPlayers().map((player) => player.id);
    this.sendTurnInfoToUsers();
  }

  playerChat(playerId: string, content: string) {
    const sendPlayer = this.playerService.getPlayer(playerId);
    if (!sendPlayer) {
      throw new Error("유령이다 유령");
    }

    this.communicator.sendAll("playerChat", { playerId, nickname: sendPlayer.nickname, content });

    const isThisTurnPlayer = this.turnOrder[0] === playerId;
    if (isThisTurnPlayer) {
      this.processTurn(playerId, content);
    }
  }

  private processTurn(playerId: string, word: string) {
    if (
      this.lastWord[this.lastWord.length - 1] !== word[0] ||
      word[1] == null ||
      word.includes(" ") ||
      word.length >= 6
    ) {
      this.communicator.sendOne(playerId, "systemChat", {
        level: "info",
        content: "올바른 끝말잇기 단어를 입력해주세요.",
      });
      return;
    }
    if (this.mySet.has(word)) {
      this.communicator.sendOne(playerId, "systemChat", {
        level: "info",
        content: "중복된 단어입니다. 다시 입력해주세요",
      });
      return;
    }
    const playerInfo = this.playerInfo.get(playerId);
    if (!playerInfo) {
      throw new Error("플레이어 정보가 없습니다.");
    }

    playerInfo.score += word.length * 10; // TODO: 스코어 시스템 추가
    this.lastWord = word;
    this.turnOrder = [...this.turnOrder.slice(1), this.turnOrder[0]];
    this.sendTurnInfoToUsers();
    this.mySet.add(word);
    this.communicator.sendOne(this.turnOrder[0], "systemChat", { level: "info", content: "당신의 차례입니다." });
  }

  private sendTurnInfoToUsers() {
    this.communicator.sendAll("gameTurnInfo", {
      currentPlayerId: this.turnOrder[0],
      players: this.playerService.getPlayers().map((player) => ({
        id: player.id,
        nickname: player.nickname,
        score: this.playerInfo.get(player.id)?.score ?? 0,
      })),
      lastWord: this.lastWord,
      turnSequence: 0,
      deadline: new Date(3), // TODO: 시간제한 시스템 추가
    });
  }
}
