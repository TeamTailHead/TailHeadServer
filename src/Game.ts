import { ServerCommunicator, SocketServer } from "@tailhead/communicator";

import InGameService from "./InGameService";
import LobbyService from "./LobbyService";
import PlayerService from "./PlayerService";

interface WordChecker {
  isWordExists(word: string): boolean;
}

export default class Game {
  private mode: "lobby" | "inGame" | "none";

  constructor(
    private server: SocketServer,
    private communicator: ServerCommunicator,
    private playerService: PlayerService,
    private lobbyService: LobbyService,
    private inGameService: InGameService,
    private wordChecker: WordChecker,
  ) {
    this.mode = "none";
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
      this.setMode("inGame");
    });

    this.inGameService.gameOverEvent.addListener(() => {
      this.setMode("lobby");
    });

    this.server.onDisconnect((playerId) => {
      this.leavePlayer(playerId);
    });

    this.setMode("lobby");
  }

  private leavePlayer(playerId: string) {
    this.playerService.leave(playerId);
    if (this.playerService.getPlayers().length === 0) {
      this.setMode("lobby");
    }
  }

  private setMode(mode: "lobby" | "inGame") {
    if (mode === "lobby") {
      this.mode = "lobby";
      this.inGameService.stop();
      this.lobbyService.start();
    } else if (mode === "inGame") {
      this.mode = "inGame";
      this.lobbyService.stop();
      this.inGameService.start();
    }
  }
}
