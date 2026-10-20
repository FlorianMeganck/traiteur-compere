export type DailyMeal = {
    day: string;
    date: string;
    meal: string;
    price: string;
};

export type MenuWeek = {
    id: string;
    week: string;
    soups: string[];
    days: DailyMeal[];
};

export const PICKUP_DATES: Record<string, Record<string, Date>> = {
    "semaine-4-octobre": { "mardi": new Date(2026, 9, 27), "jeudi": new Date(2026, 9, 29), "samedi": new Date(2026, 9, 31) },
    "semaine-1": { "mardi": new Date(2026, 10, 3), "jeudi": new Date(2026, 10, 5), "samedi": new Date(2026, 10, 7) },
    "semaine-2": { "mardi": new Date(2026, 10, 10), "jeudi": new Date(2026, 10, 12), "samedi": new Date(2026, 10, 14) },
    "semaine-3": { "mardi": new Date(2026, 10, 17), "jeudi": new Date(2026, 10, 19), "samedi": new Date(2026, 10, 21) },
    "semaine-4": { "mardi": new Date(2026, 10, 24), "jeudi": new Date(2026, 10, 26), "samedi": new Date(2026, 10, 28) },
    // Aliases rétrocompatibles
    "semaine-4-nov": { "mardi": new Date(2026, 10, 24), "jeudi": new Date(2026, 10, 26), "samedi": new Date(2026, 10, 28) },
    "semaine-1-oct": { "mardi": new Date(2026, 9, 27), "jeudi": new Date(2026, 9, 29), "samedi": new Date(2026, 9, 31) },
    "semaine-5": { "mardi": new Date(2026, 10, 24), "jeudi": new Date(2026, 10, 26), "samedi": new Date(2026, 10, 28) },
};

export const isPlatVisible = (dayName: string, weekId: string, customNow?: Date): boolean => {
    const today = customNow || new Date();
    let targetDay = "";
    const d = dayName.toLowerCase();
    if (d === 'lundi' || d === 'mardi') targetDay = 'mardi';
    else if (d === 'mercredi' || d === 'jeudi') targetDay = 'jeudi';
    else targetDay = 'samedi';

    const pickupDate = PICKUP_DATES[weekId]?.[targetDay];
    if (!pickupDate) return false;

    const diffTime = pickupDate.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays >= 2;
};

export const MENU_DATA: MenuWeek[] = [
    {
        id: "semaine-4-octobre",
        week: "Semaine 4 : du 26 au 31 octobre 2026",
        soups: ["Velouté de potiron", "Poireaux-pommes de terre"],
        days: [
            { day: "Lundi", date: "lundi 26 octobre 2026", meal: "Carbonnade flamande (Purée)", price: "13,50 €" },
            { day: "Mardi", date: "mardi 27 octobre 2026", meal: "Lasagne bolognaise", price: "11,00 €" },
            { day: "Mercredi", date: "mercredi 28 octobre 2026", meal: "Saumon, sauce crème aux poireaux (Riz)", price: "14,50 €" },
            { day: "Jeudi", date: "jeudi 29 octobre 2026", meal: "Vol-au-vent maison (Purée)", price: "13,00 €" },
            { day: "Vendredi", date: "vendredi 30 octobre 2026", meal: "Waterzooi de poulet à la gantoise (Pommes vapeur)", price: "13,00 €" },
            { day: "Samedi", date: "samedi 31 octobre 2026", meal: "Pintadeau à la kriek (Purée de céleri)", price: "16,50 €" },
        ]
    },
    {
        id: "semaine-1",
        week: "Semaine 1 : du 2 au 8 novembre 2026",
        soups: ["Velouté de champignons des bois", "Carottes au cumin"],
        days: [
            { day: "Lundi", date: "lundi 2 novembre 2026", meal: "Chicons au gratin (jambon) (Purée)", price: "12,50 €" },
            { day: "Mardi", date: "mardi 3 novembre 2026", meal: "Hachis parmentier", price: "11,00 €" },
            { day: "Mercredi", date: "mercredi 4 novembre 2026", meal: "Blanquette de veau à l'ancienne (Riz)", price: "15,50 €" },
            { day: "Jeudi", date: "jeudi 5 novembre 2026", meal: "Boulets à la liégeoise (Purée)", price: "12,50 €" },
            { day: "Vendredi", date: "vendredi 6 novembre 2026", meal: "Dos de cabillaud, sauce mousseline (Purée)", price: "14,50 €" },
            { day: "Samedi", date: "samedi 7 novembre 2026", meal: "Lapin aux pruneaux (Pommes vapeur)", price: "14,00 €" },
            { day: "Dimanche", date: "dimanche 8 novembre 2026", meal: "Filet de pintadeau, sauce champignons (Gratin dauphinois)", price: "16,50 €" },
        ]
    },
    {
        id: "semaine-2",
        week: "Semaine 2 : du 9 au 14 novembre 2026",
        soups: ["Soupe de tomates aux boulettes", "Pois cassés au lard"],
        days: [
            { day: "Lundi", date: "lundi 9 novembre 2026", meal: "Gratin de pâtes jambon-fromage", price: "11,00 €" },
            { day: "Mardi", date: "mardi 10 novembre 2026", meal: "Stoemp aux poireaux & saucisse", price: "11,50 €" },
            { day: "Mercredi", date: "mercredi 11 novembre 2026", meal: "Rôti de porc, sauce moutarde à l'ancienne (Gratin dauphinois)", price: "13,00 €" },
            { day: "Jeudi", date: "jeudi 12 novembre 2026", meal: "Poulet basquaise (Riz)", price: "12,50 €" },
            { day: "Vendredi", date: "vendredi 13 novembre 2026", meal: "Brandade de morue", price: "13,50 €" },
            { day: "Samedi", date: "samedi 14 novembre 2026", meal: "Joue de bœuf braisée au vin rouge (Purée)", price: "16,50 €" },
        ]
    },
    {
        id: "semaine-3",
        week: "Semaine 3 : du 16 au 21 novembre 2026",
        soups: ["Velouté de céleri-rave", "Minestrone"],
        days: [
            { day: "Lundi", date: "lundi 16 novembre 2026", meal: "Chili con carne (Riz)", price: "11,50 €" },
            { day: "Mardi", date: "mardi 17 novembre 2026", meal: "Lasagne saumon-épinards", price: "13,50 €" },
            { day: "Mercredi", date: "mercredi 18 novembre 2026", meal: "Navarin d'agneau aux légumes d'automne (Pommes vapeur)", price: "15,50 €" },
            { day: "Jeudi", date: "jeudi 19 novembre 2026", meal: "Poulet curry doux & lait de coco (Riz)", price: "12,50 €" },
            { day: "Vendredi", date: "vendredi 20 novembre 2026", meal: "Gratin de la mer (Purée)", price: "14,50 €" },
            { day: "Samedi", date: "samedi 21 novembre 2026", meal: "Mijoté de sanglier à la bière brune, airelles (Purée)", price: "16,00 €" },
        ]
    },
    {
        id: "semaine-4",
        week: "Semaine 4 : du 23 au 26 novembre 2026",
        soups: ["Soupe à l'oignon", "Velouté de lentilles corail"],
        days: [
            { day: "Lundi", date: "lundi 23 novembre 2026", meal: "Choucroute garnie (Pommes vapeur)", price: "13,50 €" },
            { day: "Mardi", date: "mardi 24 novembre 2026", meal: "Pain de viande, sauce tomate (Purée)", price: "11,50 €" },
            { day: "Mercredi", date: "mercredi 25 novembre 2026", meal: "Osso buco à la milanaise (Tagliatelles)", price: "15,50 €" },
            { day: "Jeudi", date: "jeudi 26 novembre 2026", meal: "Boulettes sauce chasseur (Purée)", price: "11,50 €" },
        ]
    }
];
