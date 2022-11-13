import { ClientMessage, ServerCommunicator } from "@tailhead/communicator";

import LobbyService from "../LobbyService";
import { LoggerService } from "../LoggerService";
import PlayerService from "../PlayerService";

export function createMockLogger(): LoggerService {
  return {
    log() {
      return;
    },
    error() {
      return;
    },
  };
}

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

  const playerService = new PlayerService(communicator, createMockLogger());

  return { playerService, sendAllFn, sendOneFn, sendClientToServer };
}

export function createMockLobbyService() {
  const { sendAllFn, sendOneFn, communicator, sendClientToServer } = createMockCommunicator();
  const { playerService } = createMockPlayerService();
  const lobbyService = new LobbyService(communicator, playerService);

  return { lobbyService, playerService, sendAllFn, sendOneFn, sendClientToServer };
}
