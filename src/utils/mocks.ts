import { ServerCommunicator } from "@tailhead/communicator";

import PlayerService from "../PlayerService";

export function createMockCommunicator() {
  const sendAllFn = jest.fn();
  const sendOneFn = jest.fn();

  const mockCommunicator: ServerCommunicator = {
    sendAll: sendAllFn,
    sendOne: sendOneFn,
    onReceive() {
      throw new Error("Not Implemented");
    },
  };

  return {
    communicator: mockCommunicator,
    sendAllFn,
    sendOneFn,
  };
}

export function createMockPlayerService() {
  const { sendAllFn, sendOneFn, communicator } = createMockCommunicator();

  const playerService = new PlayerService(communicator);

  return { playerService, sendAllFn, sendOneFn };
}
