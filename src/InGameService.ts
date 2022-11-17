import { ServerCommunicator } from "@tailhead/communicator";
import { addSeconds, differenceInMilliseconds } from "date-fns";

import PlayerService from "./PlayerService";
import Event from "./utils/Event";

interface GamePlayerInfo {
  id: string;
  score: number;
}

export default class InGameService {
  private playerInfo: Map<string, GamePlayerInfo>;
  private turnOrder: string[];
  private lastWord: string;
  private mySet: Set<string>;
  private deadLine: Date;
  private stopDeadLineCheck: () => void;

  gameOverEvent: Event<unknown>;

  constructor(private communicator: ServerCommunicator, private playerService: PlayerService) {
    this.playerInfo = new Map();
    this.turnOrder = [];
    this.lastWord = "사수";
    this.mySet = new Set();
    this.deadLine = new Date();
    this.stopDeadLineCheck = () => {
      //
    };
    this.gameOverEvent = new Event();
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

    this.deadLine = addSeconds(new Date(), 10);
    const cancelToken = setInterval(() => {
      this.checkDeadLine();
    }, 100);
    this.stopDeadLineCheck = () => clearTimeout(cancelToken);

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
    this.deadLine = addSeconds(new Date(), 10);
    this.lastWord = word;
    this.turnOrder = [...this.turnOrder.slice(1), this.turnOrder[0]];
    this.sendTurnInfoToUsers();
    this.mySet.add(word);
    this.communicator.sendOne(this.turnOrder[0], "systemChat", { level: "info", content: "당신의 차례입니다." });
  }

  private checkDeadLine() {
    const now = new Date();
    const diff = differenceInMilliseconds(this.deadLine, now);
    if (diff < 0) {
      this.gameOver();
      this.lastWord = "사수";
    }
  }

  private gameOver() {
    this.stopDeadLineCheck();
    this.communicator.sendAll("gameResult", {
      players: this.playerService.getPlayers().map((player) => ({
        id: player.id,
        nickname: player.nickname,
        score: this.playerInfo.get(player.id)?.score ?? 0,
      })),
    });
    this.gameOverEvent.notify({});
  }

  private sendTurnInfoToUsers() {
    if (this.turnOrder.length === 0) {
      return;
    }
    this.communicator.sendAll("gameTurnInfo", {
      currentPlayerId: this.turnOrder[0],
      players: this.playerService.getPlayers().map((player) => ({
        id: player.id,
        nickname: player.nickname,
        score: this.playerInfo.get(player.id)?.score ?? 0,
      })),
      lastWord: this.lastWord,
      turnSequence: 0,
      deadline: this.deadLine,
    });
  }
}
