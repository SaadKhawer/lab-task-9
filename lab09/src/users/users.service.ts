import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { toSafeUser, type SafeUser, type User, type UserRole } from './user.entity';

@Injectable()
export class UsersService {
  // In-memory store, same style as Lab 08 (no database in this lab).
  private users: User[] = [];
  private nextId = 1;

  async create(input: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
  }): Promise<SafeUser> {
    const existing = this.users.find((u) => u.email === input.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    const passwordHash = await bcrypt.hash(input.password, 10);
    const user: User = {
      id: this.nextId++,
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role ?? 'user',
    };
    this.users.push(user);
    return toSafeUser(user);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((u) => u.email === email);
  }

  async findById(id: number): Promise<User | undefined> {
    return this.users.find((u) => u.id === id);
  }

  async findAll(): Promise<SafeUser[]> {
    return this.users.map((u) => toSafeUser(u));
  }

  /** Used by Task 5 (change password). Stores a fresh bcrypt hash. */
  async updatePassword(id: number, newHash: string): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.passwordHash = newHash;
  }

  /** Seed helper: creates the user only if the email is not taken yet. */
  async seedIfMissing(input: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
  }): Promise<SafeUser | undefined> {
    if (await this.findByEmail(input.email)) return undefined;
    return this.create(input);
  }
}
