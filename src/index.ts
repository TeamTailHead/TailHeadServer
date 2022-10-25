import { NodeSocketServer, StringServerCommunicator } from "@tailhead/communicator";

import Game from "./Game";

const PORT = 5055;

async function main() {
  const server = new NodeSocketServer();
  const communicator = new StringServerCommunicator(server);
  const game = new Game(communicator.sendAll.bind(communicator), {
    isWordExists(word) {
      return word.length > 0;
    },
  });

  communicator.onReceive("join", (clientId, data) => {
    game.join(clientId, data.nickname);
  });

  communicator.onReceive("exit", (_clientId) => {
    game.leave(_clientId);
  });

  // communicator.onReceive("sendChat", (_clientId, data) => {
  //
  // });

  // communicator.onReceive("startGame", (_clientId, data) => {
  //
  // });

  await server.start(PORT);
  console.log(`서버가 열렸습니다. (http://localhost:${PORT})`);
}

main();
