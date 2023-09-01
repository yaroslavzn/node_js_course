import { Logger } from 'tslog';
import { ILogger } from './logger.interface';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class LoggerService implements ILogger {
	private logger: Logger<unknown>;

	constructor() {
		this.logger = new Logger();
	}

	public log(...args: unknown[]): void {
		this.logger.info(args);
	}

	public error(...args: unknown[]): void {
		this.logger.error(args);
	}

	public warn(...args: unknown[]): void {
		this.logger.warn(args);
	}
}
