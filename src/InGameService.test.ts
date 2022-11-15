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

  test("start send lobbyInfo ", () => {
    const { inGameService, playerService, sendAllFn } = createMockInGameService();
    playerService.join("playerId1", "nick1");
    inGameService.start();

    expect(sendAllFn).toBeCalledTimes(1);
    expect(sendAllFn).toBeCalledWith("gameTurnInfo", {
      players: [{ id: "playerId1", nickname: "nick1", score: 0 }],
      currentPlayerId: "playerId1",
      deadline: new Date(3),
      lastWord: "김밥",
      turnSequence: 0,
    });
  });

  test("game player success turn", () => {
    const { inGameService, playerService, sendAllFn } = createMockInGameService();
    playerService.join("playerId1", "nick1");
    inGameService.start();
    inGameService.playerChat("playerId1", "밥집");

    expect(sendAllFn).toBeCalledTimes(3);
    expect(sendAllFn).toHaveBeenNthCalledWith(2, "playerChat", {
      content: "밥집",
      nickname: "nick1",
      playerId: "playerId1",
    });
    expect(sendAllFn).toBeCalledWith("gameTurnInfo", {
      currentPlayerId: "playerId1",
      deadline: new Date(3),
      lastWord: "밥집",
      players: [{ id: "playerId1", nickname: "nick1", score: 2 }],
      turnSequence: 0,
    });
  });

  test("game player failure turn", () => {
    const { inGameService, playerService, sendAllFn } = createMockInGameService();
    playerService.join("playerId1", "nick1");
    inGameService.start();
    inGameService.playerChat("playerId1", "기린");

    expect(sendAllFn).toBeCalledTimes(2);
    expect(sendAllFn).toHaveBeenNthCalledWith(2, "playerChat", {
      content: "기린",
      nickname: "nick1",
      playerId: "playerId1",
    });
  });
});
