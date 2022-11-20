import { createMockLobbyService } from "./utils/mocks";

describe("Game", () => {
  test("one user join", () => {
    const { playerService, sendAllFn } = createMockLobbyService();

    playerService.join("id1", "11");

    expect(sendAllFn).toBeCalledTimes(2);
    expect(sendAllFn).toBeCalledWith("lobbyInfo", { adminId: "id1", players: [{ id: "id1", nickname: "11" }] });
  });

  test("two users join", () => {
    const { playerService, sendAllFn } = createMockLobbyService();
    playerService.join("playerId1", "nick1");
    playerService.join("playerId2", "nick2");

    expect(sendAllFn).toBeCalledTimes(3);
    expect(sendAllFn).toBeCalledWith("lobbyInfo", {
      players: [{ id: "playerId1", nickname: "nick1" }],
      adminId: "playerId1",
    });
    expect(sendAllFn).toBeCalledWith("lobbyInfo", {
      players: [
        { id: "playerId1", nickname: "nick1" },
        { id: "playerId2", nickname: "nick2" },
      ],
      adminId: "playerId1",
    });
  });

  test("chat room member", () => {
    const { lobbyService, playerService, sendAllFn } = createMockLobbyService();
    playerService.join("playerId1", "nick1");
    playerService.join("playerId2", "nick2");

    lobbyService.playerChat("playerId1", "안녕하세요");

    expect(sendAllFn).toBeCalledTimes(4);
    expect(sendAllFn).toHaveBeenNthCalledWith(4, "playerChat", {
      content: "안녕하세요",
      nickname: "nick1",
      playerId: "playerId1",
    });
  });
});
