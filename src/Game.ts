import { ServerCommunicator } from "@tailhead/communicator";

import LobbyService from "./LobbyService";
import PlayerService from "./PlayerService";

interface WordChecker {
  isWordExists(word: string): boolean;
}

export default class Game {
  constructor(
    private communicator: ServerCommunicator,
    private playerService: PlayerService,
    private lobbyService: LobbyService,
    private wordChecker: WordChecker,
  ) {}

  start() {
    this.communicator.onReceive("join", (playerId, data) => {
      this.playerService.join(playerId, data.nickname);
    });

    this.communicator.onReceive("exit", (playerId) => {
      this.playerService.leave(playerId);
    });
    this.communicator.onReceive("sendChat", (playerId, data) => {
      this.lobbyService.playerChat(playerId, data.content);
    });
    parseInt("", 10);
  }
}
