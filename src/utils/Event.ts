type EventHandler<T> = (e: T) => void;

export default class Event<Arg> {
  private handlers: Array<EventHandler<Arg>>;

  constructor() {
    this.handlers = [];
  }

  addListener(handler: EventHandler<Arg>) {
    this.handlers.push(handler);
  }

  removeListener(handler: EventHandler<Arg>) {
    this.handlers = this.handlers.filter((fn) => !Object.is(fn, handler));
  }

  notify(e: Arg) {
    this.handlers.forEach((handler) => handler(e));
  }
}
