import { NodeSocketServer, StringServerCommunicator } from "@tailhead/communicator";

import Game from "./Game";

const PORT = 5055;

async function main() {
  const server = new NodeSocketServer();
  const communicator = new StringServerCommunicator(server);
  const game = new Game(communicator, {
    isWordExists(word) {
      return word.length > 0;
    },
  });

  game.start();

  await server.start(PORT);
  console.log(`서버가 열렸습니다. (http://localhost:${PORT})`);
}

main();
