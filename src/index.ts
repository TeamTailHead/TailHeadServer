import { NodeSocketServer, StringServerCommunicator } from "@tailhead/communicator";

import Game from "./Game";
import LobbyService from "./LobbyService";
import { ConsoleLoggerService } from "./LoggerService";
import PlayerService from "./PlayerService";

const PORT = 5055;

async function main() {
  const logger = new ConsoleLoggerService();
  const server = new NodeSocketServer();
  const communicator = new StringServerCommunicator(server);
  const playerService = new PlayerService(communicator, logger);
  const lobbyService = new LobbyService(communicator, playerService);
  const game = new Game(server, communicator, playerService, lobbyService, {
    isWordExists(word) {
      return word.length > 0;
    },
  });

  game.start();

  await server.start(PORT);
  console.log(`서버가 열렸습니다. (http://localhost:${PORT})`);
}

main();
