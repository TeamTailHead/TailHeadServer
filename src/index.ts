import { NodeSocketServer, StringServerCommunicator } from "@tailhead/communicator";

import Game from "./Game";
import InGameService from "./InGameService";
import LobbyService from "./LobbyService";
import PlayerService from "./PlayerService";

const PORT = 5055;

async function main() {
  const server = new NodeSocketServer();
  const communicator = new StringServerCommunicator(server);
  const playerService = new PlayerService(communicator);
  const lobbyService = new LobbyService(communicator, playerService);
  const inGameService = new InGameService(communicator, playerService);
  const game = new Game(communicator, playerService, lobbyService, inGameService, {
    isWordExists(word) {
      return word.length > 0;
    },
  });

  game.start();

  await server.start(PORT);
  console.log(`서버가 열렸습니다. (http://localhost:${PORT})`);
}

main();
