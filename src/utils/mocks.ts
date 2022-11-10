import { ClientMessage, ServerCommunicator } from "@tailhead/communicator";

import InGameService from "../InGameService";
import LobbyService from "../LobbyService";
import PlayerService from "../PlayerService";

export function createMockCommunicator() {
  const sendAllFn = jest.fn();
  const sendOneFn = jest.fn();

  const handlers = new Map();

  const sendClientToServer = <K extends keyof ClientMessage>(type: K, data: ClientMessage[K]) => {
    const handler = handlers.get(type);

    if (!handler) {
      throw new Error(`${type}에 대한 핸들러가 없습니다!`);
    }

    handler(data);
  };

  const mockCommunicator: ServerCommunicator = {
    sendAll: sendAllFn,
    sendOne: sendOneFn,
    onReceive(type, fn) {
      handlers.set(type, fn);
    },
  };

  return {
    communicator: mockCommunicator,
    sendAllFn,
    sendOneFn,
    sendClientToServer,
  };
}

export function createMockPlayerService() {
  const { sendAllFn, sendOneFn, communicator, sendClientToServer } = createMockCommunicator();

  const playerService = new PlayerService(communicator);

  return { playerService, sendAllFn, sendOneFn, sendClientToServer };
}

export function createMockLobbyService() {
  const { sendAllFn, sendOneFn, communicator, sendClientToServer } = createMockCommunicator();
  const { playerService } = createMockPlayerService();
  const lobbyService = new LobbyService(communicator, playerService);

  return { lobbyService, playerService, sendAllFn, sendOneFn, sendClientToServer };
}

export function createMockInGameService() {
  const { sendAllFn, sendOneFn, communicator, sendClientToServer } = createMockCommunicator();
  const { playerService } = createMockPlayerService();
  const inGameService = new InGameService(communicator, playerService);

  return { inGameService, playerService, sendAllFn, sendOneFn, sendClientToServer };
}
