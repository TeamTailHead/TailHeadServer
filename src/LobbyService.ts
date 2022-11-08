import { ServerCommunicator } from "@tailhead/communicator";

import PlayerService from "./PlayerService";

export default class LobbyService {
  constructor(private communicator: ServerCommunicator, private playerService: PlayerService) {}

  playerChat(playerId: string, content: string) {
    const sendPlayer = this.playerService.getPlayer(playerId);
    if (!sendPlayer) {
      throw new Error("유령이다 유령");
    }
    const playersWithoutSender = this.playerService.getPlayers().filter((player) => player.id !== playerId);

    playersWithoutSender.forEach((player) => {
      this.communicator.sendOne(player.id, "playerChat", { playerId, nickname: sendPlayer.nickname, content });
    });
  }
}
