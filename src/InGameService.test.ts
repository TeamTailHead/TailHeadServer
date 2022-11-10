import { createMockInGameService } from "./utils/mocks";

describe("Game", () => {
  test("chat room member", () => {
    const { inGameService, playerService, sendAllFn } = createMockInGameService();
    playerService.join("playerId1", "nick1");
    playerService.join("playerId2", "nick2");

    inGameService.playerChat("playerId1", "안녕하세요");

    expect(sendAllFn).toBeCalledTimes(1);
    expect(sendAllFn).toHaveBeenNthCalledWith(1, "playerChat", {
      content: "안녕하세요",
      nickname: "nick1",
      playerId: "playerId1",
    });
  });
});
