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

export const MENU_DATA: MenuWeek[] = [
    {
        id: "semaine-1",
        week: "SEMAINE 1",
        soups: ["Crème de brocolis", "Velouté champignon"],
        days: [
            { day: "Lundi", date: "lundi 4 mai 2026", meal: "Oiseau sans tête sauce poivre, petit pois et carotte, rösti", price: "11,50 €" },
            { day: "Mardi", date: "mardi 5 mai 2026", meal: "Pâtes aux quatre fromages", price: "10,00 €" },
            { day: "Mercredi", date: "mercredi 6 mai 2026", meal: "Cuisse de poulet sauce champignon, compote de pomme et pomme de terre rissolée", price: "11,50 €" },
            { day: "Jeudi", date: "jeudi 7 mai 2026", meal: "Cordon bleu, haricot à la crème et purée cerfeuil", price: "11,50 €" },
            { day: "Vendredi", date: "vendredi 8 mai 2026", meal: "Waterzooi de poisson, purée brocolis", price: "16,00 €" },
            { day: "Samedi", date: "samedi 9 mai 2026", meal: "Parmentier aux épinards", price: "11,50 €" },
        ]
    },
    {
        id: "semaine-2",
        week: "SEMAINE 2",
        soups: ["Potage tomate", "Velouté de chou-fleur"],
        days: [
            { day: "Lundi", date: "lundi 11 mai 2026", meal: "Cuisse de lapin à la bière, compote et pomme rissolée", price: "11,50 €" },
            { day: "Mardi", date: "mardi 12 mai 2026", meal: "Escalope de veau et tagliatelle sauce tomate crème et parmesan", price: "16,00 €" },
            { day: "Mercredi", date: "mercredi 13 mai 2026", meal: "Potée aux carottes et saucisse de campagne", price: "11,50 €" },
            { day: "Jeudi", date: "jeudi 14 mai 2026", meal: "Roulade ardennaise, sauce crème champignon, haricot et gratin", price: "11,50 €" },
            { day: "Vendredi", date: "vendredi 15 mai 2026", meal: "Filet de colin aux petits légumes, purée de cerfeuil", price: "16,00 €" },
            { day: "Samedi", date: "samedi 16 mai 2026", meal: "Chicon farci et lard fumé, purée de pomme de terre", price: "11,50 €" },
        ]
    },
    {
        id: "semaine-3",
        week: "SEMAINE 3",
        soups: ["Potage champignons des bois", "Velouté d'asperge"],
        days: [
            { day: "Lundi", date: "lundi 18 mai 2026", meal: "Blanquette de veau, purée de céleri et légumes vapeurs", price: "16,00 €" },
            { day: "Mardi", date: "mardi 19 mai 2026", meal: "Lasagne bolognaise", price: "10,00 €" },
            { day: "Mercredi", date: "mercredi 20 mai 2026", meal: "Boulet liégeois et purée brocolis", price: "11,50 €" },
            { day: "Jeudi", date: "jeudi 21 mai 2026", meal: "Filet de poulet sauce estragon, pomme duchesse, compote de rhubarbe", price: "11,50 €" },
            { day: "Vendredi", date: "vendredi 22 mai 2026", meal: "Filet de saumon sauce crème, pomme vapeur, gratiné de brocolis", price: "16,00 €" },
            { day: "Samedi", date: "samedi 23 mai 2026", meal: "Roulade ardennaise et purée", price: "11,50 €" },
        ]
    },
    {
        id: "semaine-4",
        week: "SEMAINE 4",
        soups: ["Soupe à l'oignon", "Velouté butternut"],
        days: [
            { day: "Lundi", date: "lundi 25 mai 2026", meal: "Carbonnade à la flamande, compote et croquette", price: "11,50 €" },
            { day: "Mardi", date: "mardi 26 mai 2026", meal: "Lasagne au saumon al verde", price: "10,00 €" },
            { day: "Mercredi", date: "mercredi 27 mai 2026", meal: "Crépinette de veau, pois et carotte, pommes de terre rissolées", price: "16,00 €" },
            { day: "Jeudi", date: "jeudi 28 mai 2026", meal: "Pavé de dindonneau sauce liégeoise, endive et gratin", price: "11,50 €" },
            { day: "Vendredi", date: "vendredi 29 mai 2026", meal: "Poisson gratiné, écrasé de pomme de terre et poireau à la crème", price: "16,00 €" },
            { day: "Samedi", date: "samedi 30 mai 2026", meal: "Linguine à la bolognaise", price: "10,00 €" },
        ]
    }
];
