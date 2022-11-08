import { ServerCommunicator } from "@tailhead/communicator";

import Event from "./utils/Event";

interface Player {
  id: string;
  nickname: string;
}

interface JoinEventArg {
  players: Player[];
  joinedPlayer: Player;
}

interface LeaveEventArg {
  players: Player[];
  leavedPlayer: Player;
}

export default class PlayerService {
  private players: Player[];
  private adminPlayerId: string | null;

  joinEvent: Event<JoinEventArg>;
  leaveEvent: Event<LeaveEventArg>;

  constructor(private communicator: ServerCommunicator) {
    this.players = [];
    this.adminPlayerId = null;

    this.joinEvent = new Event();
    this.leaveEvent = new Event();
  }

  join(playerId: string, nickname: string) {
    const newPlayer: Player = {
      id: playerId,
      nickname,
    };

    this.players.push(newPlayer);
    if (this.adminPlayerId == null) {
      this.adminPlayerId = playerId;
    }

    this.communicator.sendAll("lobbyInfo", {
      players: this.players.map((player) => ({
        id: player.id,
        nickname: player.nickname,
      })),
      adminId: this.adminPlayerId ?? "",
    });

    this.joinEvent.notify({ players: [...this.players], joinedPlayer: newPlayer });
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

    this.communicator.sendAll("lobbyInfo", {
      players: this.players.map((player) => ({
        id: player.id,
        nickname: player.nickname,
      })),
      adminId: this.adminPlayerId ?? "",
    });

    this.leaveEvent.notify({ players: [...this.players], leavedPlayer });
  }
}
