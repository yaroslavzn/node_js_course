import { inject, injectable } from 'inversify';
import { IConfigService } from './config.service.interface';
import { DotenvParseOutput, config } from 'dotenv';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';

@injectable()
export class ConfigService implements IConfigService {
	private parsedConfig: DotenvParseOutput;
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		const configValues = config();

		if (configValues.error) {
			this.logger.error("Can't parse .env file or it doesn't exist");
		}

		if (configValues.parsed) {
			this.parsedConfig = configValues.parsed;
			this.logger.log('.env file was successfully loaded');
		}
	}

	get(key: string): string {
		return this.parsedConfig[key];
	}
}
