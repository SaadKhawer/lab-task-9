export type UserRole = 'user' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  /** bcrypt hash — never send this to a client. */
  passwordHash: string;
  role: UserRole;
}

/** The shape the API is allowed to return: no password hash. */
export type SafeUser = Omit<User, 'passwordHash'>;

export function toSafeUser(user: User): SafeUser {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}
