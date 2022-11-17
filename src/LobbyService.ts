import { ServerCommunicator } from "@tailhead/communicator";

import PlayerService from "./PlayerService";

export default class LobbyService {
  constructor(private communicator: ServerCommunicator, private playerService: PlayerService) {
    playerService.joinEvent.addListener(({ joinedPlayer }) => {
      communicator.sendOne(joinedPlayer.id, "joinInfo", { playerId: joinedPlayer.id, nickname: joinedPlayer.nickname });
      this.sendLobbyInfo();
    });
    playerService.leaveEvent.addListener(() => {
      this.sendLobbyInfo();
    });
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
}
