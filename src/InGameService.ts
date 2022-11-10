import { ServerCommunicator } from "@tailhead/communicator";

import PlayerService from "./PlayerService";

export default class InGameService {
  constructor(private communicator: ServerCommunicator, private playerService: PlayerService) {}

  playerChat(playerId: string, content: string) {
    const sendPlayer = this.playerService.getPlayer(playerId);
    if (!sendPlayer) {
      throw new Error("유령이다 유령");
    }
    // 턴 부여하고
    // 시간제한을 두고 턴인 사람은 계속 입력 시간안에
    // 입력하지 못하면 다음턴 그 전에 맞으면 점수 부여 후 다음 턴에게 넘김
    this.communicator.sendAll("playerChat", { playerId, nickname: sendPlayer.nickname, content });
  }
}
