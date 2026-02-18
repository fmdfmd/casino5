import { pgEnum } from 'drizzle-orm/pg-core';

// --- Users & Access ---
export const userRoleEnum = pgEnum('user_role', [
  'user',
  'admin',
  'moderator',
  'bot',
]);
export const userStatusEnum = pgEnum('user_status', [
  'active',
  'suspended',
  'banned',
  'frozen',
]);
export const kycStatusEnum = pgEnum('kyc_status', [
  'none',
  'pending',
  'level_1',
  'level_2',
  'level_3',
  'rejected',
]);

// --- Chat ---
export const chatTypeEnum = pgEnum('chat_type', [
  'public',
  'support',
  'private',
]);
export const chatStatusEnum = pgEnum('chat_status', [
  'queued',
  'active',
  'closed',
]);
export const participantRoleEnum = pgEnum('participant_role', [
  'user',
  'operator',
  'system',
]);
export const messageTypeEnum = pgEnum('message_type', [
  'text',
  'image',
  'file',
  'system',
]);
export const deliveryStatusEnum = pgEnum('delivery_status', [
  'sent',
  'delivered',
  'read',
]);

// --- Games ---
export const gameEventsTypeEnum = pgEnum('game_events_type', ['launch', 'bet']);
export const gameEventsModeEnum = pgEnum('game_events_mode', ['real', 'demo']);
export const gameRoundStatusEnum = pgEnum('game_round_status', [
  'active',
  'completed',
  'cancelled',
  'failed',
]);

// --- Finance (Critical) ---
export const paymentsTypeEnum = pgEnum('payment_type', [
  'deposit',
  'withdrawal',
]);
export const paymentsStatusEnum = pgEnum('payment_status', [
  'pending_approval', // Ждет админа
  'processing', // Отправлено в сеть
  'completed', // Успех
  'failed', // Ошибка сети
  'rejected', // Отклонено админом
  'cancelled', // Отменено юзером
]);

// Polymorphic reference types
export const ledgerRefType = pgEnum('ref_type', [
  'game_round',
  'payment',
  'bonus',
  'affiliate',
  'manual',
]);

export const kycLevelEnum = pgEnum('kyc_level', [
  'none',
  'basic',
  'verified',
  'enhanced',
]);

// --- Finance ---
export const currencyTypeEnum = pgEnum('currency_type', ['crypto', 'fiat']);
export const txTypeEnum = pgEnum('tx_type', [
  'deposit',
  'withdrawal',
  'bet',
  'win',
  'refund',
  'adjustment',
  'affiliate',
  'bonus',
  'swap',
  'tip',
]);
export const txStatusEnum = pgEnum('tx_status', [
  'pending',
  'processing',
  'completed',
  'failed',
  'cancelled',
  'rejected',
]);

export const gameStatusEnum = pgEnum('game_status', [
  'active',
  'maintenance',
  'disabled',
]);
export const sessionStatusEnum = pgEnum('session_status', [
  'created',
  'in_progress',
  'completed',
  'cancelled',
]);

// --- Bonuses ---
export const bonusTypeEnum = pgEnum('bonus_type', [
  'deposit_match',
  'free_spins',
  'rakeback',
  'weekly_boost',
]);
export const bonusStatusEnum = pgEnum('bonus_status', [
  'active',
  'completed',
  'expired',
  'forfeited',
]);

export const transactionTypeEnum = pgEnum('transaction_type', [
  'deposit',
  'withdrawal',
  'bet',
  'win',
  'refund', // Возврат ставки (отмена раунда)
  'adjustment', // Ручная коррекция админом
  'affiliate_payout',
  'bonus_credit',
  'tip',
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending', // Ожидает подтверждений в сети (депозит)
  'pending_approval', // Ожидает ручного подтверждения (вывод)
  'processing', // Отправлено в сеть (вывод)
  'completed', // Успешно завершено
  'failed', // Ошибка (сеть, провайдер)
  'rejected', // Отклонено админом
  'cancelled', // Отменено пользователем
]);

// --- Gaming Logic ---
export const gameProviderEnum = pgEnum('game_provider', [
  'original',
  'pragmatic_play',
  'evolution',
  'hacksaw',
]);
export const gameCategoryEnum = pgEnum('game_category', [
  'slots',
  'live_casino',
  'originals',
  'table_games',
]);
export const gameSessionStatusEnum = pgEnum('game_session_status', [
  'created',
  'active',
  'completed',
  'cancelled',
]);

// --- Ledger (Audit Trail) ---
export const ledgerRefTypeEnum = pgEnum('ledger_ref_type', [
  'game_bet',
  'payment',
  'bonus',
  'adjustment',
]);
