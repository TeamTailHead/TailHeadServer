import { BinaryServerCommunicator, NodeSocketServer } from "@tailhead/communicator";

import Game from "./Game";
import InGameService from "./InGameService";
import LobbyService from "./LobbyService";
import { ConsoleLoggerService } from "./LoggerService";
import PlayerService from "./PlayerService";

const PORT = 5055;

async function main() {
  const logger = new ConsoleLoggerService();
  const server = new NodeSocketServer();
  const communicator = new BinaryServerCommunicator(server);
  const playerService = new PlayerService(communicator, logger);
  const lobbyService = new LobbyService(communicator, playerService);
  const inGameService = new InGameService(communicator, playerService);
  const game = new Game(server, communicator, playerService, lobbyService, inGameService, {
    isWordExists(word) {
      return word.length > 0;
    },
  });

  game.start();

  await server.start(PORT);
  console.log(`서버가 열렸습니다. (localhost:${PORT})`);
}

main();
