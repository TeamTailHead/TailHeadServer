import Game from "./Game";
import { createMockCommunicator, createMockPlayerService } from "./utils/mocks";

describe("Game", () => {
  test("chat room member", () => {
    const { game, playerService, sendOneFn } = createGame();
    playerService.join("playerId1", "nick1");
    playerService.join("playerId2", "nick2");

    game.playerChat("playerId1", "안녕하세요");

    expect(sendOneFn).toBeCalledTimes(1);
    expect(sendOneFn).toHaveBeenNthCalledWith(1, "playerId2", "playerChat", {
      content: "안녕하세요",
      nickname: "nick1",
      playerId: "playerId1",
    });
  });
});

function createGame() {
  const { playerService } = createMockPlayerService();
  const { sendAllFn, sendOneFn, communicator } = createMockCommunicator();

  const game = new Game(communicator, playerService, {
    isWordExists(_word) {
      return true;
    },
  });

  return { game, sendAllFn, sendOneFn, playerService };
}
