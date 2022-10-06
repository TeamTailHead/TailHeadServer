import { NodeSocketServer, StringServerCommunicator } from "@tailhead/communicator";

import Game from "./Game";

const PORT = 5055;

async function main() {
  const game = new Game();

  const server = new NodeSocketServer();
  const communicator = new StringServerCommunicator(server);

  communicator.onReceive("join", (clientId, data) => {
    game.join(clientId, data.nickname);
  });

  await server.start(PORT);
  console.log(`서버가 열렸습니다. (http://localhost:${PORT})`);
}

main();
