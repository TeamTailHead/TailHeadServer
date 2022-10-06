import Game from "./Game";

describe("Game", () => {
  test("should join", () => {
    const game = new Game();
    game.join("playerId1", "nick1");
    game.join("playerId2", "nick2");

    expect(game.players).toHaveLength(2);
    expect(game.players[0].id).toBe("playerId1");
    expect(game.players[0].nickname).toBe("nick1");
    expect(game.players[1].id).toBe("playerId2");
    expect(game.players[1].nickname).toBe("nick2");
  });

  test("should leave", () => {
    const game = new Game();
    game.join("playerId1", "nick1");
    game.join("playerId2", "nick2");
    game.leave("playerId1");

    expect(game.players).toHaveLength(1);
    expect(game.players[0].id).toBe("playerId2");
    expect(game.players[0].nickname).toBe("nick2");
  });
});
