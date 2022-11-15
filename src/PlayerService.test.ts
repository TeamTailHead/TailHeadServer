import { createMockPlayerService } from "./utils/mocks";

describe("PlayerService", () => {
  test("should join one player", () => {
    const { playerService } = createMockPlayerService();
    const joinHandler = jest.fn();
    playerService.joinEvent.addListener(joinHandler);

    playerService.join("playerId1", "nick1");

    expect(joinHandler).toBeCalledTimes(1);
    expect(joinHandler).toBeCalledWith({
      adminPlayerId: "playerId1",
      joinedPlayer: {
        id: "playerId1",
        nickname: "nick1",
      },
      players: [
        {
          id: "playerId1",
          nickname: "nick1",
        },
      ],
    });
  });

  test("should join two players", () => {
    const { playerService } = createMockPlayerService();
    const joinHandler = jest.fn();
    playerService.joinEvent.addListener(joinHandler);

    playerService.join("playerId1", "nick1");
    playerService.join("playerId2", "nick2");

    expect(joinHandler).toBeCalledTimes(2);
    expect(joinHandler).toBeCalledWith({
      adminPlayerId: "playerId1",
      joinedPlayer: {
        id: "playerId1",
        nickname: "nick1",
      },
      players: [
        {
          id: "playerId1",
          nickname: "nick1",
        },
      ],
    });
    expect(joinHandler).toBeCalledWith({
      adminPlayerId: "playerId1",
      joinedPlayer: {
        id: "playerId2",
        nickname: "nick2",
      },
      players: [
        {
          id: "playerId1",
          nickname: "nick1",
        },
        {
          id: "playerId2",
          nickname: "nick2",
        },
      ],
    });
  });

  test("should leave room member", () => {
    const { playerService } = createMockPlayerService();
    const leaveHandler = jest.fn();
    playerService.leaveEvent.addListener(leaveHandler);

    playerService.join("playerId1", "nick1");
    playerService.join("playerId2", "nick2");
    playerService.leave("playerId2");

    expect(leaveHandler).toBeCalledTimes(1);
    expect(leaveHandler).toBeCalledWith({
      adminPlayerId: "playerId1",
      leavedPlayer: {
        id: "playerId2",
        nickname: "nick2",
      },
      players: [
        {
          id: "playerId1",
          nickname: "nick1",
        },
      ],
    });
  });

  test("should leave room admin", () => {
    const { playerService } = createMockPlayerService();
    const leaveHandler = jest.fn();
    playerService.leaveEvent.addListener(leaveHandler);

    playerService.join("playerId1", "nick1");
    playerService.join("playerId2", "nick2");
    playerService.leave("playerId1");

    expect(leaveHandler).toBeCalledTimes(1);
    expect(leaveHandler).toBeCalledWith({
      adminPlayerId: "playerId2",
      leavedPlayer: expect.anything(),
      players: expect.anything(),
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
      adminPlayerId: "AAA",
      joinedPlayer: { id: "AAA", nickname: "asdf" },
    });
    expect(joinHandler).toBeCalledWith({
      players: [
        { id: "AAA", nickname: "asdf" },
        { id: "BBB", nickname: "zxcv" },
      ],
      adminPlayerId: "AAA",
      joinedPlayer: { id: "BBB", nickname: "zxcv" },
    });
  });

  test("should dispatch multiple join event handlers", () => {
    const { playerService } = createMockPlayerService();

    const joinHandler1 = jest.fn();
    const joinHandler2 = jest.fn();

    playerService.joinEvent.addListener(joinHandler1);
    playerService.joinEvent.addListener(joinHandler2);

    playerService.join("AAA", "AAA");
    playerService.join("BBB", "BBB");

    expect(joinHandler1).toBeCalledTimes(2);
    expect(joinHandler2).toBeCalledTimes(2);
  });

  test("should block duplicated nickname", () => {
    const { playerService, sendOneFn } = createMockPlayerService();
    const joinEventHandler = jest.fn();

    playerService.joinEvent.addListener(joinEventHandler);

    playerService.join("playerId1", "aaa");
    playerService.join("playerId2", "aaa");

    expect(sendOneFn).toBeCalledTimes(1);
    expect(sendOneFn).toBeCalledWith("playerId2", "joinError", {
      message: expect.anything(),
    });
  });

  test("should block empty nickname", () => {
    const { playerService: game, sendOneFn } = createMockPlayerService();
    game.join("playerId1", "   ");

    expect(sendOneFn).toBeCalledTimes(1);
    expect(sendOneFn).toBeCalledWith("playerId1", "joinError", {
      message: expect.anything(),
    });
  });
});
