import { ServerCommunicator } from "@tailhead/communicator";

import PlayerService from "./PlayerService";

interface WordChecker {
  isWordExists(word: string): boolean;
}

export default class Game {
  constructor(
    private communicator: ServerCommunicator,
    private playerService: PlayerService,
    private wordChecker: WordChecker,
  ) {}

  start() {
    this.communicator.onReceive("join", (playerId, data) => {
      this.playerService.join(playerId, data.nickname);
    });

    this.communicator.onReceive("exit", (playerId) => {
      this.playerService.leave(playerId);
    });
  }

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
