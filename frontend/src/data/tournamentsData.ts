// src/data/tournamentsData.ts

export interface LeaderboardItem {
    place: number;
    name: string;
    prize: string;
    isTop?: boolean; // Для выделения топ-3
}

export interface Tournament {
    id: number;
    title: string;
    prizePool: string;
    imageSrc: string;
    timer: { days: string; hours: string; minutes: string; seconds: string };
    
    // Детальные данные
    dates: string;
    minBet: string;
    scoringRules: string;
    terms: string[]; // Массив строк для условий
    leaderboard: LeaderboardItem[];
}

export const tournamentsData: Tournament[] = [
    {
        id: 1,
        title: "Carnival Cup",
        prizePool: "5 000 €",
        imageSrc: "/fairy.svg",
        timer: { days: '04', hours: '04', minutes: '04', seconds: '04' },
        dates: "19.05.2025 - 25.05.2025 (00:00 UTC - 23:59 UTC)",
        minBet: "€0.8",
        scoringRules: "TOTAL BET : You score points proportionally to wagered money. Only real money bets with no active bonus count.",
        terms: [
            "General Terms and Conditions and Bonus Terms and Conditions of the Casino apply.",
            "The Casino administration has the right to cancel the promo at any time.",
            "Wagering Requirement: x5",
            "Qualifying games: All slots.",
            "Qualifying bets: Real money bets only.",
            "Prize Pool Distribution details..."
        ],
        leaderboard: [
            { place: 1, name: "Viktor Z", prize: "1200$", isTop: true },
            { place: 2, name: "Lisyan", prize: "600$", isTop: true },
            { place: 3, name: "Shiva", prize: "300$", isTop: true },
            { place: 4, name: "Oleg", prize: "600$", isTop: false },
            { place: 5, name: "Abdul", prize: "300$", isTop: false },
            { place: 6, name: "Abhilash", prize: "600$", isTop: false },
            { place: 7, name: "Farhana", prize: "300$", isTop: false },
            { place: 8, name: "Gobind", prize: "300$", isTop: false },
        ]
    },
    {
        id: 2,
        title: "Golden Trophy",
        prizePool: "10 000 €",
        imageSrc: "/trophy_t.svg",
        timer: { days: '02', hours: '12', minutes: '30', seconds: '00' },
        dates: "01.06.2025 - 07.06.2025",
        minBet: "€1.0",
        scoringRules: "Highest single win multiplier.",
        terms: ["Standard terms apply."],
        leaderboard: [] 
    },
    // ... можно добавить остальные турниры
];