import Game from "./Game";
import {
  createMockCommunicator,
  createMockInGameService,
  createMockLobbyService,
  createMockPlayerService,
} from "./utils/mocks";

describe("Game", () => {
  test.skip("chat room member", () => {
    createGame();
  });
});

function createGame() {
  const { playerService } = createMockPlayerService();
  const { sendAllFn, sendOneFn, communicator } = createMockCommunicator();
  const { lobbyService } = createMockLobbyService();
  const { inGameService } = createMockInGameService();

  const game = new Game(communicator, playerService, lobbyService, inGameService, {
    isWordExists(_word) {
      return true;
    },
  });

  return { game, sendAllFn, sendOneFn, playerService };
}
