export interface LiveGame {
  id: number;
  slug: string;
  title: string;
  imageSrc: string;
  description: string;
  type: 'show' | 'roulette' | 'blackjack' | 'baccarat' | 'poker';
  isPopular?: boolean;
  isNew?: boolean;
}

export const liveGamesData: LiveGame[] = [
  // --- GAME SHOWS (20 игр) ---
  { id: 101, slug: 'crazy-time', title: 'Crazy Time', imageSrc: '/slot1.svg', description: 'Evolution', type: 'show', isPopular: true },
  { id: 102, slug: 'monopoly-live', title: 'Monopoly Live', imageSrc: '/slot1.svg', description: 'Evolution', type: 'show', isPopular: true },
  { id: 103, slug: 'mega-ball', title: 'Mega Ball', imageSrc: '/slot1.svg', description: 'Evolution', type: 'show' },
  { id: 104, slug: 'funky-time', title: 'Funky Time', imageSrc: '/slot1.svg', description: 'Evolution', type: 'show', isNew: true },
  { id: 105, slug: 'dream-catcher', title: 'Dream Catcher', imageSrc: '/slot1.svg', description: 'Evolution', type: 'show' },
  { id: 106, slug: 'lightning-dice', title: 'Lightning Dice', imageSrc: '/slot1.svg', description: 'Evolution', type: 'show' },
  { id: 125, slug: 'sweet-bonanza-candyland', title: 'Sweet Bonanza CandyLand', imageSrc: '/slot1.svg', description: 'Pragmatic Play', type: 'show', isPopular: true },
  { id: 126, slug: 'snakes-ladders-live', title: 'Snakes & Ladders Live', imageSrc: '/slot1.svg', description: 'Pragmatic Play', type: 'show', isNew: true },
  { id: 127, slug: 'treasure-island', title: 'Treasure Island', imageSrc: '/slot1.svg', description: 'Pragmatic Play', type: 'show', isNew: true },
  { id: 128, slug: 'extra-chilli-spins', title: 'Extra Chilli Epic Spins', imageSrc: '/slot1.svg', description: 'Evolution', type: 'show' },
  { id: 129, slug: 'deal-or-no-deal', title: 'Deal or No Deal Live', imageSrc: '/slot1.svg', description: 'Evolution', type: 'show' },
  { id: 130, slug: 'cash-or-crash', title: 'Cash or Crash', imageSrc: '/slot1.svg', description: 'Evolution', type: 'show' },
  { id: 131, slug: 'gonzos-treasure-hunt', title: 'Gonzo\'s Treasure Hunt', imageSrc: '/slot1.svg', description: 'Evolution', type: 'show' },
  { id: 132, slug: 'boom-city', title: 'Boom City', imageSrc: '/slot1.svg', description: 'Pragmatic Play', type: 'show' },
  { id: 133, slug: 'stock-market', title: 'Stock Market', imageSrc: '/slot1.svg', description: 'Evolution', type: 'show', isNew: true },
  { id: 134, slug: 'balloon-race', title: 'Balloon Race', imageSrc: '/slot1.svg', description: 'Evolution', type: 'show', isNew: true },
  { id: 135, slug: 'crazy-pachinko', title: 'Crazy Pachinko', imageSrc: '/slot1.svg', description: 'Evolution', type: 'show', isNew: true },
  { id: 136, slug: 'vegas-ball-bonanza', title: 'Vegas Ball Bonanza', imageSrc: '/slot1.svg', description: 'Pragmatic Play', type: 'show' },
  { id: 137, slug: 'mega-wheel', title: 'Mega Wheel', imageSrc: '/slot1.svg', description: 'Pragmatic Play', type: 'show' },
  { id: 138, slug: 'adventures-beyond-wonderland', title: 'Adventures Wonderland', imageSrc: '/slot1.svg', description: 'Playtech', type: 'show' },

  // --- ROULETTE (15 игр) ---
  { id: 107, slug: 'lightning-roulette', title: 'Lightning Roulette', imageSrc: '/slot1.svg', description: 'Evolution', type: 'roulette', isPopular: true },
  { id: 108, slug: 'immersive-roulette', title: 'Immersive Roulette', imageSrc: '/slot1.svg', description: 'Evolution', type: 'roulette' },
  { id: 109, slug: 'speed-roulette', title: 'Speed Roulette', imageSrc: '/slot1.svg', description: 'Pragmatic Play', type: 'roulette' },
  { id: 110, slug: 'mega-roulette', title: 'Mega Roulette', imageSrc: '/slot1.svg', description: 'Pragmatic Play', type: 'roulette' },
  { id: 111, slug: 'double-ball-roulette', title: 'Double Ball Roulette', imageSrc: '/slot1.svg', description: 'Evolution', type: 'roulette' },
  { id: 112, slug: 'instant-roulette', title: 'Instant Roulette', imageSrc: '/slot1.svg', description: 'Evolution', type: 'roulette' },
  { id: 139, slug: 'powerup-roulette', title: 'PowerUP Roulette', imageSrc: '/slot1.svg', description: 'Pragmatic Play', type: 'roulette' },
  { id: 140, slug: 'red-door-roulette', title: 'Red Door Roulette', imageSrc: '/slot1.svg', description: 'Evolution', type: 'roulette', isNew: true },
  { id: 141, slug: 'gold-vault-roulette', title: 'Gold Vault Roulette', imageSrc: '/slot1.svg', description: 'Evolution', type: 'roulette' },
  { id: 142, slug: 'quantum-roulette', title: 'Quantum Roulette', imageSrc: '/slot1.svg', description: 'Playtech', type: 'roulette' },
  { id: 143, slug: 'auto-roulette', title: 'Auto-Roulette', imageSrc: '/slot1.svg', description: 'Evolution', type: 'roulette' },
  { id: 144, slug: 'american-roulette', title: 'American Roulette', imageSrc: '/slot1.svg', description: 'Evolution', type: 'roulette' },
  { id: 145, slug: 'french-roulette', title: 'French Roulette', imageSrc: '/slot1.svg', description: 'Evolution', type: 'roulette' },
  { id: 146, slug: 'vip-roulette', title: 'VIP Roulette', imageSrc: '/slot1.svg', description: 'Evolution', type: 'roulette' },
  { id: 147, slug: 'galaxy-roulette', title: 'Galaxy Roulette', imageSrc: '/slot1.svg', description: 'Pragmatic Play', type: 'roulette' },

  // --- BLACKJACK (20 игр) ---
  { id: 113, slug: 'infinite-blackjack', title: 'Infinite Blackjack', imageSrc: '/slot1.svg', description: 'Evolution', type: 'blackjack', isPopular: true },
  { id: 114, slug: 'speed-blackjack', title: 'Speed Blackjack', imageSrc: '/slot1.svg', description: 'Evolution', type: 'blackjack', isNew: true },
  { id: 115, slug: 'power-blackjack', title: 'Power Blackjack', imageSrc: '/slot1.svg', description: 'Evolution', type: 'blackjack' },
  { id: 116, slug: 'blackjack-classic', title: 'Blackjack Classic', imageSrc: '/slot1.svg', description: 'Pragmatic Play', type: 'blackjack' },
  { id: 117, slug: 'free-bet-blackjack', title: 'Free Bet Blackjack', imageSrc: '/slot1.svg', description: 'Evolution', type: 'blackjack' },
  { id: 118, slug: 'vip-blackjack', title: 'VIP Blackjack', imageSrc: '/slot1.svg', description: 'Evolution', type: 'blackjack' },
  { id: 148, slug: 'blackjack-azure', title: 'Blackjack Azure', imageSrc: '/slot1.svg', description: 'Pragmatic Play', type: 'blackjack' },
  { id: 149, slug: 'blackjack-ruby', title: 'Blackjack Ruby', imageSrc: '/slot1.svg', description: 'Pragmatic Play', type: 'blackjack' },
  { id: 150, slug: 'lightning-blackjack', title: 'Lightning Blackjack', imageSrc: '/slot1.svg', description: 'Evolution', type: 'blackjack' },
  { id: 151, slug: 'blackjack-prive', title: 'Blackjack Prive', imageSrc: '/slot1.svg', description: 'Pragmatic Play', type: 'blackjack' },
  { id: 152, slug: 'blackjack-party', title: 'Blackjack Party', imageSrc: '/slot1.svg', description: 'Evolution', type: 'blackjack' },
  { id: 153, slug: 'one-blackjack', title: 'ONE Blackjack', imageSrc: '/slot1.svg', description: 'Pragmatic Play', type: 'blackjack' },
  // Повторяющиеся столы для объема (Blackjack A, B, C...)
  { id: 154, slug: 'blackjack-a', title: 'Blackjack A', imageSrc: '/slot1.svg', description: 'Evolution', type: 'blackjack' },
  { id: 155, slug: 'blackjack-b', title: 'Blackjack B', imageSrc: '/slot1.svg', description: 'Evolution', type: 'blackjack' },
  { id: 156, slug: 'blackjack-c', title: 'Blackjack C', imageSrc: '/slot1.svg', description: 'Evolution', type: 'blackjack' },
  { id: 157, slug: 'blackjack-d', title: 'Blackjack D', imageSrc: '/slot1.svg', description: 'Evolution', type: 'blackjack' },
  { id: 158, slug: 'blackjack-e', title: 'Blackjack E', imageSrc: '/slot1.svg', description: 'Evolution', type: 'blackjack' },
  { id: 159, slug: 'blackjack-f', title: 'Blackjack F', imageSrc: '/slot1.svg', description: 'Evolution', type: 'blackjack' },
  { id: 160, slug: 'blackjack-g', title: 'Blackjack G', imageSrc: '/slot1.svg', description: 'Evolution', type: 'blackjack' },
  { id: 161, slug: 'blackjack-h', title: 'Blackjack H', imageSrc: '/slot1.svg', description: 'Evolution', type: 'blackjack' },

  // --- POKER (10 игр) ---
  { id: 119, slug: 'casino-holdem', title: 'Casino Holdem', imageSrc: '/slot1.svg', description: 'Evolution', type: 'poker' },
  { id: 120, slug: 'three-card-poker', title: 'Three Card Poker', imageSrc: '/slot1.svg', description: 'Evolution', type: 'poker' },
  { id: 121, slug: 'caribbean-stud', title: 'Caribbean Stud Poker', imageSrc: '/slot1.svg', description: 'Evolution', type: 'poker' },
  { id: 122, slug: 'texas-holdem-bonus', title: 'Texas Holdem Bonus', imageSrc: '/slot1.svg', description: 'Evolution', type: 'poker' },
  { id: 123, slug: 'side-bet-city', title: 'Side Bet City', imageSrc: '/slot1.svg', description: 'Evolution', type: 'poker', isNew: true },
  { id: 124, slug: 'ultimate-texas', title: 'Ultimate Texas Holdem', imageSrc: '/slot1.svg', description: 'Evolution', type: 'poker', isPopular: true },
  { id: 162, slug: '2-hand-holdem', title: '2 Hand Casino Holdem', imageSrc: '/slot1.svg', description: 'Evolution', type: 'poker' },
  { id: 163, slug: 'video-poker-live', title: 'Video Poker Live', imageSrc: '/slot1.svg', description: 'Evolution', type: 'poker', isNew: true },
  { id: 164, slug: 'extreme-holdem', title: 'Extreme Texas Holdem', imageSrc: '/slot1.svg', description: 'Evolution', type: 'poker' },
  { id: 165, slug: 'teen-patti', title: 'Teen Patti Live', imageSrc: '/slot1.svg', description: 'Evolution', type: 'poker' },

  // --- BACCARAT & DICE (15 игр) ---
  { id: 166, slug: 'speed-baccarat-a', title: 'Speed Baccarat A', imageSrc: '/slot1.svg', description: 'Evolution', type: 'baccarat', isPopular: true },
  { id: 167, slug: 'speed-baccarat-b', title: 'Speed Baccarat B', imageSrc: '/slot1.svg', description: 'Evolution', type: 'baccarat' },
  { id: 168, slug: 'lightning-baccarat', title: 'Lightning Baccarat', imageSrc: '/slot1.svg', description: 'Evolution', type: 'baccarat' },
  { id: 169, slug: 'baccarat-squeeze', title: 'Baccarat Squeeze', imageSrc: '/slot1.svg', description: 'Evolution', type: 'baccarat' },
  { id: 170, slug: 'no-commission-baccarat', title: 'No Commission Baccarat', imageSrc: '/slot1.svg', description: 'Evolution', type: 'baccarat' },
  { id: 171, slug: 'peek-baccarat', title: 'Peek Baccarat', imageSrc: '/slot1.svg', description: 'Evolution', type: 'baccarat', isNew: true },
  { id: 172, slug: 'golden-wealth-baccarat', title: 'Golden Wealth Baccarat', imageSrc: '/slot1.svg', description: 'Evolution', type: 'baccarat' },
  { id: 173, slug: 'dragon-tiger', title: 'Dragon Tiger', imageSrc: '/slot1.svg', description: 'Evolution', type: 'baccarat' },
  { id: 174, slug: 'bac-bo', title: 'Bac Bo', imageSrc: '/slot1.svg', description: 'Evolution', type: 'baccarat', isPopular: true },
  { id: 175, slug: 'fan-tan', title: 'Fan Tan', imageSrc: '/slot1.svg', description: 'Evolution', type: 'baccarat' },
  { id: 176, slug: 'super-sic-bo', title: 'Super Sic Bo', imageSrc: '/slot1.svg', description: 'Evolution', type: 'baccarat' },
  { id: 177, slug: 'mega-sic-bo', title: 'Mega Sic Bo', imageSrc: '/slot1.svg', description: 'Pragmatic Play', type: 'baccarat' },
  { id: 178, slug: 'baccarat-fortune', title: 'Fortune 6 Baccarat', imageSrc: '/slot1.svg', description: 'Pragmatic Play', type: 'baccarat' },
  { id: 179, slug: 'prosperity-tree-baccarat', title: 'Prosperity Tree Baccarat', imageSrc: '/slot1.svg', description: 'Evolution', type: 'baccarat', isNew: true },
  { id: 180, slug: 'speed-baccarat-c', title: 'Speed Baccarat C', imageSrc: '/slot1.svg', description: 'Pragmatic Play', type: 'baccarat' },
];