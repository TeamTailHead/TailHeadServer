import { ServerCommunicator, SocketServer } from "@tailhead/communicator";

import InGameService from "./InGameService";
import LobbyService from "./LobbyService";
import PlayerService from "./PlayerService";

interface WordChecker {
  isWordExists(word: string): boolean;
}

export default class Game {
  private mode: "lobby" | "inGame";

  constructor(
    private server: SocketServer,
    private communicator: ServerCommunicator,
    private playerService: PlayerService,
    private lobbyService: LobbyService,
    private inGameService: InGameService,
    private wordChecker: WordChecker,
  ) {
    this.mode = "lobby";
    // ingameService가 실행되면 mode를 inGame으로 변경한다.
  }

  start() {
    this.communicator.onReceive("join", (playerId, data) => {
      // TODO: 대기실 기능 추가시 변경 필요
      if (this.mode === "lobby") {
        this.playerService.join(playerId, data.nickname);
      }
    });

    this.communicator.onReceive("exit", (playerId) => {
      this.leavePlayer(playerId);
    });
    this.communicator.onReceive("sendChat", (playerId, data) => {
      if (this.mode == "lobby") {
        this.lobbyService.playerChat(playerId, data.content);
      } else if (this.mode == "inGame") {
        this.inGameService.playerChat(playerId, data.content);
      }
    });
    this.communicator.onReceive("startGame", () => {
      this.mode = "inGame";
      this.inGameService.start();
    });

    this.server.onDisconnect((playerId) => {
      this.leavePlayer(playerId);
    });
  }

  private leavePlayer(playerId: string) {
    this.playerService.leave(playerId);
    if (this.playerService.getPlayers().length === 0) {
      this.mode = "lobby";
    }
  }
}
