import { IUsersRepository } from './users.repository.interface';
import { UserModel } from '@prisma/client';
import { User } from './user.entity';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { PrismaService } from '../database/prisma.service';

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async createUser({ name, email, password }: User): Promise<UserModel | null> {
		try {
			return await this.prismaService.client.userModel.create({
				data: { name, email, password },
			});
		} catch (e) {
			return null;
		}
	}

	async findUserByEmail(email: string): Promise<UserModel | null> {
		try {
			const user = await this.prismaService.client.userModel.findFirst({
				where: {
					email,
				},
			});

			return user;
		} catch (e) {
			return null;
		}
	}
}
