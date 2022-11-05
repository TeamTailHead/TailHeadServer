import Game from "./Game";

describe("Game", () => {
  test("should join one player", () => {
    const { game, sendAllFn } = createGame();
    game.join("playerId1", "nick1");

    expect(sendAllFn).toBeCalledTimes(1);
    expect(sendAllFn).toBeCalledWith("lobbyInfo", {
      players: [{ id: "playerId1", nickname: "nick1" }],
      adminId: "playerId1",
    });
  });

  test("should join two players", () => {
    const { game, sendAllFn } = createGame();
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
    const { game, sendAllFn } = createGame();
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
    const { game, sendAllFn } = createGame();
    game.join("playerId1", "nick1");
    game.join("playerId2", "nick2");
    game.leave("playerId1");

    expect(sendAllFn).toBeCalledTimes(3);
    expect(sendAllFn).toHaveBeenNthCalledWith(3, "lobbyInfo", {
      players: [{ id: "playerId2", nickname: "nick2" }],
      adminId: "playerId2",
    });
  });

  test("chat room member", () => {
    const { game, sendOneFn } = createGame();
    game.join("playerId1", "nick1");
    game.join("playerId2", "nick2");
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
  const sendAllFn = jest.fn();
  const sendOneFn = jest.fn();
  const isWordExistsFn = jest.fn();

  isWordExistsFn.mockReturnValue(true);

  const game = new Game(sendAllFn, sendOneFn, {
    isWordExists(_word) {
      return true;
    },
  });

  return { game, sendAllFn, sendOneFn, isWordExistsFn };
}
