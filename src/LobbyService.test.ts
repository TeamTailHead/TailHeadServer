import { createMockLobbyService } from "./utils/mocks";

describe("Game", () => {
  test("chat room member", () => {
    const { lobbyService, playerService, sendAllFn } = createMockLobbyService();
    playerService.join("playerId1", "nick1");
    playerService.join("playerId2", "nick2");

    lobbyService.playerChat("playerId1", "안녕하세요");

    expect(sendAllFn).toBeCalledTimes(1);
    expect(sendAllFn).toHaveBeenNthCalledWith(1, "playerChat", {
      content: "안녕하세요",
      nickname: "nick1",
      playerId: "playerId1",
    });
  });
});
