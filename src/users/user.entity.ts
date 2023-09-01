import { hash, compare } from 'bcryptjs';

export class User {
	private _password: string;

	constructor(
		private readonly _name: string,
		private readonly _email: string,
	) {}

	public get name(): string {
		return this._name;
	}

	public get email(): string {
		return this._email;
	}

	public get password(): string {
		return this._password;
	}

	public async setPassword(password: string, salt: number): Promise<void> {
		const hashedPassword = await hash(password, salt);
		this._password = hashedPassword;
	}

	public static comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
		return compare(password, hashedPassword);
	}
}
