import { drizzle } from 'drizzle-orm/node-postgres';
import { currenciesTable } from '../schema/currencies.schema';
import dotenv from 'dotenv';
dotenv.config();

const db = drizzle(process.env.DATABASE_URL!);

export async function seedCurrencies() {
  console.log('🌱 Seeding currencies...');

  const currencies = [
    // 1. Bitcoin (BTC) - Король
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      network: 'Bitcoin',
      decimals: 8, // У биткоина 8 знаков (Сатоши)
      minConfirmations: 2, // Обычно ждут 1-2 подтверждения
      isDepositEnabled: true,
      isWithdrawalEnabled: true,
      minDeposit: '0.0001', // ~$5-10
      minWithdrawal: '0.0005',
      withdrawalFee: '0.0002',
      contractAddress: null, // Нативная монета
      icon: '/btc.svg',
    },

    // 2. Ethereum (ETH) - Эфир
    {
      symbol: 'ETH',
      name: 'Ethereum',
      network: 'Ethereum',
      decimals: 18, // Wei
      minConfirmations: 12, // Стандарт безопасности для ETH
      isDepositEnabled: true,
      isWithdrawalEnabled: true,
      minDeposit: '0.01',
      minWithdrawal: '0.02',
      withdrawalFee: '0.005',
      contractAddress: null, // Нативная монета
      icon: '/eth.svg',
    },

    // 3. Tether (USDT) - ERC20 (Самый популярный стейблкоин)
    {
      symbol: 'USDT',
      name: 'Tether USD',
      network: 'ERC20', // Сеть Ethereum
      decimals: 6, // !! ВАЖНО: У USDT 6 знаков, а не 18
      minConfirmations: 12,
      isDepositEnabled: true,
      isWithdrawalEnabled: true,
      minDeposit: '10', // 10 USDT
      minWithdrawal: '20',
      withdrawalFee: '5', // Комиссии в ERC20 дорогие
      contractAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7', // Официальный контракт
      icon: '/usdt.svg',
    },
    {
      symbol: 'USDT',
      name: 'Tether USD',
      network: 'TRC20', // Сеть Tron
      decimals: 6, // ⚠️ У USDT всегда 6 знаков
      minConfirmations: 20, // Обычно 19–20 блоков
      isDepositEnabled: true,
      isWithdrawalEnabled: true,
      minDeposit: '5', // Минималка ниже, чем в ERC20
      minWithdrawal: '10',
      withdrawalFee: '1', // Дёшево по сравнению с ERC20
      contractAddress: 'TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj', // Официальный USDT TRC20
      icon: '/usdt.svg',
    },
    // 5. Dogecoin (DOGE) - Любимец казино (мем-коин)
    {
      symbol: 'DOGE',
      name: 'Dogecoin',
      network: 'Dogecoin',
      decimals: 8,
      minConfirmations: 10,
      isDepositEnabled: true,
      isWithdrawalEnabled: true,
      minDeposit: '10',
      minWithdrawal: '50',
      withdrawalFee: '5',
      contractAddress: null,
      icon: '/doge.svg',
    },
  ];

  await db
    .insert(currenciesTable)
    .values(currencies)
    .onConflictDoNothing({
      target: [currenciesTable.symbol, currenciesTable.network],
    });

  console.log('✅ Currencies seeded successfully');
  process.exit(2);
}

seedCurrencies();
