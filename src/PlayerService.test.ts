import { createMockPlayerService } from "./utils/mocks";

describe("PlayerService", () => {
  test("should join one player", () => {
    const { playerService, sendAllFn } = createMockPlayerService();
    playerService.join("playerId1", "nick1");

    expect(sendAllFn).toBeCalledTimes(1);
    expect(sendAllFn).toBeCalledWith("lobbyInfo", {
      players: [{ id: "playerId1", nickname: "nick1" }],
      adminId: "playerId1",
    });
  });

  test("should join two players", () => {
    const { playerService: game, sendAllFn } = createMockPlayerService();
    game.join("playerId1", "nick1");
    game.join("playerId2", "nick2");

    expect(sendAllFn).toBeCalledTimes(2);
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
  test("should leave room member", () => {
    const { playerService: game, sendAllFn } = createMockPlayerService();
    game.join("playerId1", "nick1");
    game.join("playerId2", "nick2");
    game.leave("playerId2");

    expect(sendAllFn).toBeCalledTimes(3);
    expect(sendAllFn).toHaveBeenNthCalledWith(3, "lobbyInfo", {
      players: [{ id: "playerId1", nickname: "nick1" }],
      adminId: "playerId1",
    });
  });

  test("should leave room admin", () => {
    const { playerService: game, sendAllFn } = createMockPlayerService();
    game.join("playerId1", "nick1");
    game.join("playerId2", "nick2");
    game.leave("playerId1");

    expect(sendAllFn).toBeCalledTimes(3);
    expect(sendAllFn).toHaveBeenNthCalledWith(3, "lobbyInfo", {
      players: [{ id: "playerId2", nickname: "nick2" }],
      adminId: "playerId2",
    });
  });

  test("should dispatch one join event handler", () => {
    const { playerService } = createMockPlayerService();

    const joinHandler = jest.fn();

    playerService.joinEvent.addListener(joinHandler);

    playerService.join("AAA", "asdf");
    playerService.join("BBB", "zxcv");

    expect(joinHandler).toBeCalledTimes(2);
    expect(joinHandler).toBeCalledWith({
      players: [{ id: "AAA", nickname: "asdf" }],
      joinedPlayer: { id: "AAA", nickname: "asdf" },
    });
    expect(joinHandler).toBeCalledWith({
      players: [
        { id: "AAA", nickname: "asdf" },
        { id: "BBB", nickname: "zxcv" },
      ],
      joinedPlayer: { id: "BBB", nickname: "zxcv" },
    });
  });

  test("should dispatch multiple join event handlers", () => {
    const { playerService } = createMockPlayerService();

    const joinHandler1 = jest.fn();
    const joinHandler2 = jest.fn();

    playerService.joinEvent.addListener(joinHandler1);
    playerService.joinEvent.addListener(joinHandler2);

    playerService.join("AAA", "asdf");
    playerService.join("BBB", "asdf");

    expect(joinHandler1).toBeCalledTimes(2);
    expect(joinHandler2).toBeCalledTimes(2);
  });
});
