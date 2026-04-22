export type DailyMeal = {
    day: string;
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
            { day: "Lundi", meal: "Oiseau sans tête sauce poivre, petit pois et carotte, rösti", price: "11,50 €" },
            { day: "Mardi", meal: "Pâtes aux quatre fromages", price: "10,00 €" },
            { day: "Mercredi", meal: "Cuisse de poulet sauce champignon, compote de pomme et pomme de terre rissolée", price: "11,50 €" },
            { day: "Jeudi", meal: "Cordon bleu, haricot à la crème et purée cerfeuil", price: "11,50 €" },
            { day: "Vendredi", meal: "Waterzooi de poisson, purée brocolis", price: "16,00 €" },
            { day: "Samedi", meal: "Parmentier aux épinards", price: "11,50 €" },
        ]
    },
    {
        id: "semaine-2",
        week: "SEMAINE 2",
        soups: ["Potage tomate", "Velouté de chou-fleur"],
        days: [
            { day: "Lundi", meal: "Cuisse de lapin à la bière, compote et pomme rissolée", price: "11,50 €" },
            { day: "Mardi", meal: "Escalope de veau et tagliatelle sauce tomate crème et parmesan", price: "16,00 €" },
            { day: "Mercredi", meal: "Potée aux carottes et saucisse de campagne", price: "11,50 €" },
            { day: "Jeudi", meal: "Roulade ardennaise, sauce crème champignon, haricot et gratin", price: "11,50 €" },
            { day: "Vendredi", meal: "Filet de colin aux petits légumes, purée de cerfeuil", price: "16,00 €" },
            { day: "Samedi", meal: "Chicon farci et lard fumé, purée de pomme de terre", price: "11,50 €" },
        ]
    },
    {
        id: "semaine-3",
        week: "SEMAINE 3",
        soups: ["Potage champignons des bois", "Velouté d'asperge"],
        days: [
            { day: "Lundi", meal: "Blanquette de veau, purée de céleri et légumes vapeurs", price: "16,00 €" },
            { day: "Mardi", meal: "Lasagne bolognaise", price: "10,00 €" },
            { day: "Mercredi", meal: "Boulet liégeois et purée brocolis", price: "11,50 €" },
            { day: "Jeudi", meal: "Filet de poulet sauce estragon, pomme duchesse, compote de rhubarbe", price: "11,50 €" },
            { day: "Vendredi", meal: "Filet de saumon sauce crème, pomme vapeur, gratiné de brocolis", price: "16,00 €" },
            { day: "Samedi", meal: "Roulade ardennaise et purée", price: "11,50 €" },
        ]
    },
    {
        id: "semaine-4",
        week: "SEMAINE 4",
        soups: ["Soupe à l'oignon", "Velouté butternut"],
        days: [
            { day: "Lundi", meal: "Carbonnade à la flamande, compote et croquette", price: "11,50 €" },
            { day: "Mardi", meal: "Lasagne au saumon al verde", price: "10,00 €" },
            { day: "Mercredi", meal: "Crépinette de veau, pois et carotte, pommes de terre rissolées", price: "16,00 €" },
            { day: "Jeudi", meal: "Pavé de dindonneau sauce liégeoise, endive et gratin", price: "11,50 €" },
            { day: "Vendredi", meal: "Poisson gratiné, écrasé de pomme de terre et poireau à la crème", price: "16,00 €" },
            { day: "Samedi", meal: "Linguine à la bolognaise", price: "10,00 €" },
        ]
    }
];
