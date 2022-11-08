import { ServerCommunicator } from "@tailhead/communicator";

import PlayerService from "./PlayerService";

export default class LobbyService {
  constructor(private communicator: ServerCommunicator, private playerService: PlayerService) {}

  playerChat(playerId: string, content: string) {
    const sendPlayer = this.playerService.getPlayer(playerId);
    if (!sendPlayer) {
      throw new Error("유령이다 유령");
    }

    this.communicator.sendAll("playerChat", { playerId, nickname: sendPlayer.nickname, content });
  }
}
