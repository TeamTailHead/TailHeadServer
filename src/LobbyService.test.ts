import { createMockLobbyService } from "./utils/mocks";

describe("Game", () => {
  test("chat room member", () => {
    const { lobbyService, playerService, sendOneFn } = createMockLobbyService();
    playerService.join("playerId1", "nick1");
    playerService.join("playerId2", "nick2");

    lobbyService.playerChat("playerId1", "안녕하세요");

    expect(sendOneFn).toBeCalledTimes(1);
    expect(sendOneFn).toHaveBeenNthCalledWith(1, "playerId2", "playerChat", {
      content: "안녕하세요",
      nickname: "nick1",
      playerId: "playerId1",
    });
  });
});
