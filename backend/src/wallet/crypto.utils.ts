// src/modules/wallet/crypto.utils.ts
import { BIP32Factory } from 'bip32';
import * as ecc from 'tiny-secp256k1';
import bs58check from 'bs58check'; // Важно: импорт без * as
import keccak256 from 'keccak256';
import { payments } from 'bitcoinjs-lib';

const bip32 = BIP32Factory(ecc);

export function generateAddressFromXPub(
  network: string,
  derivationPath: string, // "m/0/1"
  xpub: string,
): string {
  // 1. Создаем ноду из XPUB
  // Внимание: xpub должен быть валидным для выбранной сети
  const node = bip32.fromBase58(xpub);

  // 2. Убираем "m/", так как XPUB — это уже корень (m)
  const cleanPath = derivationPath.replace('m/', '');

  // 3. Деривация
  const child = node.derivePath(cleanPath);

  // 4. Генерация адреса
  // Приводим network к верхнему регистру для надежности
  const net = network.toUpperCase();

  if (net === 'BITCOIN' || net === 'BTC') {
    return generateBtcAddress(child);
  }

  if (
    net === 'ETHEREUM' ||
    net === 'ETH' ||
    net === 'ERC20' ||
    net === 'BSC' ||
    net === 'BNB'
  ) {
    return generateEthAddress(child);
  }

  if (net === 'TRON' || net === 'TRX' || net === 'TRC20') {
    return generateTronAddress(child);
  }

  throw new Error(`Unsupported network: ${network}`);
}

// --- Bitcoin (Native SegWit - bc1q...) ---
function generateBtcAddress(node: any): string {
  // Используем p2wpkh (Native SegWit), так дешевле комиссии
  const { address } = payments.p2wpkh({ pubkey: node.publicKey });
  return address!;
}

// --- Ethereum (0x...) ---
function generateEthAddress(node: any): string {
  // Получаем публичный ключ
  const pubKey = node.publicKey;
  // Ражимаем его (uncompress) и убираем первый байт (0x04)
  const uncompressed = ecc.pointCompress(pubKey, false).slice(1);
  // Хешируем Keccak256
  const hash = keccak256(Buffer.from(uncompressed));
  // Берем последние 20 байт
  const addressBuffer = hash.subarray(-20);
  return `0x${addressBuffer.toString('hex')}`;
}

// --- Tron (T...) ---
// function generateTronAddress(node: any): string {
//   // 1. Логика как у ETH: Uncompress -> Keccak256 -> Last 20 bytes
//   const pubKey = node.publicKey;
//   const uncompressed = ecc.pointCompress(pubKey, false).slice(1);
//   const hash = keccak256(Buffer.from(uncompressed));
//   const ethAddressBytes = hash.subarray(-20);

//   // 2. Добавляем префикс 0x41 (Mainnet)
//   const tronAddressBytes = Buffer.concat([
//     Buffer.from([0x41]),
//     ethAddressBytes,
//   ]);

//   // 3. Кодируем в Base58Check
//   return bs58check.encode(tronAddressBytes);
// }
function generateTronAddress(node: any): string {
  const uncompressed = ecc.pointCompress(node.publicKey, false).slice(1);
  const hash = keccak256(Buffer.from(uncompressed));
  const ethAddressBytes = hash.subarray(-20);

  const tronAddressBytes = Buffer.concat([
    Buffer.from([0x41]),
    ethAddressBytes,
  ]);

  return bs58check.encode(tronAddressBytes);
}
