import { ServerCommunicator } from "@tailhead/communicator";

import { LoggerService } from "./LoggerService";
import Event from "./utils/Event";

interface Player {
  id: string;
  nickname: string;
}

export interface JoinEventArg {
  players: Player[];
  adminPlayerId: string;
  joinedPlayer: Player;
}

export interface LeaveEventArg {
  players: Player[];
  adminPlayerId: string;
  leavedPlayer: Player;
}

export default class PlayerService {
  private players: Player[];
  private adminPlayerId: string | null;

  joinEvent: Event<JoinEventArg>;
  leaveEvent: Event<LeaveEventArg>;

  constructor(private communicator: ServerCommunicator, private loggerService: LoggerService) {
    this.players = [];
    this.adminPlayerId = null;

    this.joinEvent = new Event();
    this.leaveEvent = new Event();
  }

  getPlayers() {
    return [...this.players];
  }

  getPlayer(id: string) {
    return this.players.find((player) => player.id === id) ?? null;
  }

  getAdminPlayerId() {
    return this.adminPlayerId;
  }

  join(playerId: string, nickname: string) {
    const newPlayer: Player = {
      id: playerId,
      nickname,
    };

    if (nickname.trim() === "") {
      this.communicator.sendOne(playerId, "joinError", { message: "빈칸 닉네임은 사용할 수 없습니다." });
      return;
    }
    if (this.players.find((player) => player.id === playerId)) {
      // 중복 join 요청 무시
      return;
    }
    if (this.players.find((player) => player.nickname === nickname)) {
      this.communicator.sendOne(playerId, "joinError", { message: "이미 사용중인 닉네임입니다." });
      this.loggerService.log("이미 사용중인 닉네임 요청", newPlayer);
      return;
    }

    this.players.push(newPlayer);
    if (this.adminPlayerId == null) {
      this.adminPlayerId = playerId;
    }

    this.joinEvent.notify({ players: [...this.players], joinedPlayer: newPlayer, adminPlayerId: this.adminPlayerId });
    this.loggerService.log("플레이어가 접속했습니다.", newPlayer);
  }

  leave(playerId: string) {
    const index = this.players.findIndex((player) => player.id === playerId);
    if (index == -1) {
      return;
    }
    const leavedPlayer = this.players[index];

    this.players.splice(index, 1);
    if (leavedPlayer.id == this.adminPlayerId) {
      if (this.players.length > 0) {
        this.adminPlayerId = this.players[0].id;
      } else {
        this.adminPlayerId = null;
      }
    }

    this.leaveEvent.notify({ players: [...this.players], leavedPlayer, adminPlayerId: this.adminPlayerId ?? "" });
    this.loggerService.log("플레이어가 나갔습니다.", leavedPlayer);
  }
}
