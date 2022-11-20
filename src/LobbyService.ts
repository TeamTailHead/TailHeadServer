import { ServerCommunicator } from "@tailhead/communicator";

import PlayerService, { JoinEventArg } from "./PlayerService";

export default class LobbyService {
  constructor(private communicator: ServerCommunicator, private playerService: PlayerService) {
    this.handlePlayerJoin = this.handlePlayerJoin.bind(this);
    this.handlePlayerLeave = this.handlePlayerLeave.bind(this);
  }

  start() {
    this.playerService.joinEvent.addListener(this.handlePlayerJoin);
    this.playerService.leaveEvent.addListener(this.handlePlayerLeave);
  }

  stop() {
    this.playerService.joinEvent.removeListener(this.handlePlayerJoin);
    this.playerService.leaveEvent.removeListener(this.handlePlayerLeave);
  }

  playerChat(playerId: string, content: string) {
    const sendPlayer = this.playerService.getPlayer(playerId);
    if (!sendPlayer) {
      throw new Error("유령이다 유령");
    }

    this.communicator.sendAll("playerChat", { playerId, nickname: sendPlayer.nickname, content });
  }

  private sendLobbyInfo() {
    const players = this.playerService.getPlayers();
    const adminPlayerId = this.playerService.getAdminPlayerId();
    this.communicator.sendAll("lobbyInfo", {
      players: players.map((player) => ({
        id: player.id,
        nickname: player.nickname,
      })),
      adminId: adminPlayerId ?? "",
    });
  }

  private handlePlayerJoin({ joinedPlayer }: JoinEventArg) {
    this.communicator.sendOne(joinedPlayer.id, "joinInfo", {
      playerId: joinedPlayer.id,
      nickname: joinedPlayer.nickname,
    });
    this.sendLobbyInfo();
  }

  private handlePlayerLeave() {
    this.sendLobbyInfo();
  }
}
