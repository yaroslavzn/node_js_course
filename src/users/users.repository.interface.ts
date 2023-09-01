import { UserModel } from '@prisma/client';
import { User } from './user.entity';

export interface IUsersRepository {
	createUser(user: User): Promise<UserModel | null>;
	findUserByEmail(email: string): Promise<UserModel | null>;
}
