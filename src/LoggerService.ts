export interface LoggerService {
  log(...data: unknown[]): void;
  error(...data: unknown[]): void;
}

export class ConsoleLoggerService implements LoggerService {
  log(...data: unknown[]): void {
    console.log("[LOG]:", ...data);
  }
  error(...data: unknown[]): void {
    console.error("[ERROR]:", ...data);
  }
}
