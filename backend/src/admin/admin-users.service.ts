import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import type { DrizzleDB } from 'src/drizzle/types/drizzle';
import { users } from 'src/drizzle/schema/users.schema';
import { walletsTable } from 'src/drizzle/schema/wallets.schema';
import { ledgerTable } from 'src/drizzle/schema/ledger.schema';
import { eq, ilike, desc, or, sql, and, SQL } from 'drizzle-orm';

function isSQL(value: SQL | undefined): value is SQL {
  return value !== undefined;
}

@Injectable()
export class AdminUsersService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  // 1. Получение списка юзеров с пагинацией и кошельками
  async getUsers(
    page = 1,
    limit = 15,
    search = '',
    statusFilter: 'active' | 'suspended' | 'banned' | 'frozen',
  ) {
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];

    if (search) {
      const searchCondition = or(
        ilike(users.email, `%${search}%`),
        ilike(users.username, `%${search}%`),
      );

      if (isSQL(searchCondition)) {
        conditions.push(searchCondition);
      }
    }

    if (statusFilter) {
      conditions.push(eq(users.status, statusFilter));
    }

    const finalCondition =
      conditions.length > 0 ? and(...conditions) : undefined;

    const data = await this.db.query.users.findMany({
      where: finalCondition,
      limit,
      offset,
      orderBy: [desc(users.createdAt)],
      with: {
        walletsTable: { with: { currency: true } },
      },
    });

    const [countRes] = await this.db
      .select({ count: sql`count(*)`.mapWith(Number) })
      .from(users)
      .where(finalCondition);

    return { data, total: countRes.count, page, limit };
  }

  // 2. Получение детальной инфы по 1 юзеру (включая последние транзакции)
  async getUserDetails(userId: string) {
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
      with: { walletsTable: { with: { currency: true } } },
    });
    if (!user) throw new NotFoundException('User not found');

    // Получаем историю транзакций первого кошелька
    const defaultWalletId = user.walletsTable[0]?.id;
    let recentTx: any = [];
    if (defaultWalletId) {
      recentTx = await this.db.query.ledgerTable.findMany({
        where: eq(ledgerTable.walletId, defaultWalletId),
        orderBy: [desc(ledgerTable.createdAt)],
        limit: 10,
      });
    }

    return { ...user, recentTx };
  }

  // 3. Бан / Разбан
  async updateUserStatus(
    userId: string,
    status: 'active' | 'suspended' | 'banned',
  ) {
    const [updated] = await this.db
      .update(users)
      .set({ status })
      .where(eq(users.id, userId))
      .returning();
    return updated;
  }
}
