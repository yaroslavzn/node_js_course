import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';

@injectable()
export class PrismaService {
	private _dbClient: PrismaClient;

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		this._dbClient = new PrismaClient();
	}

	get client(): PrismaClient {
		return this._dbClient;
	}

	public async connect(): Promise<void> {
		try {
			await this._dbClient.$connect();
			this.logger.log('[PrismaService] Successfully connected to the DB');
		} catch (e) {
			if (e instanceof Error) {
				this.logger.error('[PrismaService] error on opening DB connection, ', e.message);
			}
		}
	}

	public async disconnect(): Promise<void> {
		await this._dbClient.$disconnect();
	}
}
