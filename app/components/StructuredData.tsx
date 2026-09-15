export default function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "FoodEstablishment", "CateringService"],
        "@id": "https://www.traiteur-compere.be/#caterer",
        "name": "Traiteur Compère",
        "legalName": "Maison Compère SRL",
        "alternateName": ["Traiteur Compère Saint-Georges", "Maison Compère"],
        "description": "Traiteur haut de gamme pour mariages, banquets, réceptions d'entreprise et événements privés à Saint-Georges-sur-Meuse et en région liégeoise. Maison fondée en 1821.",
        "url": "https://www.traiteur-compere.be",
        "telephone": "+32 476 86 54 07",
        "email": "contact@traiteur-compere.be",
        "logo": "https://www.traiteur-compere.be/images/logo-2.png",
        "image": "https://www.traiteur-compere.be/images/hero-traiteur.png",
        "priceRange": "€€",
        "currenciesAccepted": "EUR",
        "paymentAccepted": "Virement bancaire, Espèces, Facture",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Rue Potay 3",
          "addressLocality": "Saint-Georges-sur-Meuse",
          "postalCode": "4470",
          "addressRegion": "Liège",
          "addressCountry": "BE"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 50.59868,
          "longitude": 5.35824
        },
        "areaServed": [
          {
            "@type": "AdministrativeArea",
            "name": "Wallonie"
          },
          {
            "@type": "AdministrativeArea",
            "name": "Province de Liège"
          },
          {
            "@type": "Place",
            "name": "Liège et environs"
          },
          {
            "@type": "Place",
            "name": "Saint-Georges-sur-Meuse"
          },
          {
            "@type": "Place",
            "name": "Huy"
          },
          {
            "@type": "Place",
            "name": "Waremme"
          },
          {
            "@type": "Place",
            "name": "Flémalle"
          },
          {
            "@type": "Place",
            "name": "Amay"
          },
          {
            "@type": "Place",
            "name": "Verlaine"
          }
        ],
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "08:30",
            "closes": "18:30"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Saturday"],
            "opens": "09:00",
            "closes": "17:00"
          }
        ],
        "sameAs": [
          "https://www.facebook.com/profile.php?id=61582940090708",
          "https://www.instagram.com/traiteurcompere8/"
        ],
        "hasMenu": {
          "@type": "Menu",
          "@id": "https://www.traiteur-compere.be/formules#menu",
          "name": "Carte & Formules Traiteur Compère",
          "url": "https://www.traiteur-compere.be/formules",
          "hasMenuSection": [
            {
              "@type": "MenuSection",
              "name": "Barbecues & Grillades au feu de bois",
              "description": "Formules barbecues artisanales préparées avec viandes de qualité et accompagnements maison.",
              "hasMenuItem": [
                {
                  "@type": "MenuItem",
                  "name": "Barbecue Classique",
                  "description": "3 viandes au choix (saucisses, merguez, brochettes), assortiment de salades fraîches, pommes de terre grenailles, pâtes, sauces maison & pain artisanal.",
                  "offers": {
                    "@type": "Offer",
                    "price": "15.00",
                    "priceCurrency": "EUR",
                    "priceSpecification": {
                      "@type": "UnitPriceSpecification",
                      "price": "15.00",
                      "priceCurrency": "EUR",
                      "unitText": "par personne HTVA"
                    }
                  }
                },
                {
                  "@type": "MenuItem",
                  "name": "Barbecue Composé",
                  "description": "Menu complet avec 2 entrées au choix (scampi, saumon, tartare...), 2 plats au choix (côte d'agneau, contrefilet...), accompagnements chauds et froids à volonté.",
                  "offers": {
                    "@type": "Offer",
                    "price": "21.00",
                    "priceCurrency": "EUR",
                    "priceSpecification": {
                      "@type": "UnitPriceSpecification",
                      "price": "21.00",
                      "priceCurrency": "EUR",
                      "unitText": "par personne HTVA"
                    }
                  }
                },
                {
                  "@type": "MenuItem",
                  "name": "Barbecue Dînatoire",
                  "description": "Formule raffinée en 2 services : 1er service à table puis 2ème service barbecue varié à volonté avec buffet de salades et féculents.",
                  "offers": {
                    "@type": "Offer",
                    "price": "22.50",
                    "priceCurrency": "EUR",
                    "priceSpecification": {
                      "@type": "UnitPriceSpecification",
                      "price": "22.50",
                      "priceCurrency": "EUR",
                      "unitText": "par personne HTVA"
                    }
                  }
                },
                {
                  "@type": "MenuItem",
                  "name": "Barbecue Fruits de Mer",
                  "description": "Sélection premium : gambas géantes, homard grillé, brochettes de Saint-Jacques et scampis, pavé de saumon papilloté, salades fraîcheur.",
                  "offers": {
                    "@type": "Offer",
                    "price": "29.50",
                    "priceCurrency": "EUR",
                    "priceSpecification": {
                      "@type": "UnitPriceSpecification",
                      "price": "29.50",
                      "priceCurrency": "EUR",
                      "unitText": "par personne HTVA"
                    }
                  }
                },
                {
                  "@type": "MenuItem",
                  "name": "Barbecue Porchetta & Cochon de lait à la broche",
                  "description": "Cochon de lait doré à la broche ou porchetta artisanale cuite lentement aux herbes et épices.",
                  "offers": {
                    "@type": "Offer",
                    "price": "18.00",
                    "priceCurrency": "EUR",
                    "priceSpecification": {
                      "@type": "UnitPriceSpecification",
                      "price": "18.00",
                      "priceCurrency": "EUR",
                      "unitText": "par personne HTVA (dès 18€)"
                    }
                  }
                }
              ]
            },
            {
              "@type": "MenuSection",
              "name": "Buffets Froids",
              "description": "Buffets froids traiteur présentés sur plateaux élégants.",
              "hasMenuItem": [
                {
                  "@type": "MenuItem",
                  "name": "Buffet Campagnard",
                  "description": "Assortiment de charcuteries artisanales, pâté de campagne, cornichons, salades de pommes de terre, crudités variées et œufs durs.",
                  "offers": {
                    "@type": "Offer",
                    "price": "14.00",
                    "priceCurrency": "EUR",
                    "priceSpecification": {
                      "@type": "UnitPriceSpecification",
                      "price": "14.00",
                      "priceCurrency": "EUR",
                      "unitText": "par personne HTVA"
                    }
                  }
                },
                {
                  "@type": "MenuItem",
                  "name": "Buffet Ardennais",
                  "description": "Jambon d'Ardenne, saucisson gaumais, boudin blanc et noir, rôti de porc froid moutardé, salades et féculents.",
                  "offers": {
                    "@type": "Offer",
                    "price": "15.00",
                    "priceCurrency": "EUR",
                    "priceSpecification": {
                      "@type": "UnitPriceSpecification",
                      "price": "15.00",
                      "priceCurrency": "EUR",
                      "unitText": "par personne HTVA"
                    }
                  }
                },
                {
                  "@type": "MenuItem",
                  "name": "Buffet Réception",
                  "description": "Saumon fumé extra doux, carpaccio de bœuf parfumé, assortiment de viandes froides nobles et salades raffinées.",
                  "offers": {
                    "@type": "Offer",
                    "price": "18.00",
                    "priceCurrency": "EUR",
                    "priceSpecification": {
                      "@type": "UnitPriceSpecification",
                      "price": "18.00",
                      "priceCurrency": "EUR",
                      "unitText": "par personne HTVA"
                    }
                  }
                },
                {
                  "@type": "MenuItem",
                  "name": "Buffet Gala",
                  "description": "Le summum du raffinement : foie gras mi-cuit, cascade de fruits de mer, médaillon de saumon en belle-vue, salades prestige.",
                  "offers": {
                    "@type": "Offer",
                    "price": "22.00",
                    "priceCurrency": "EUR",
                    "priceSpecification": {
                      "@type": "UnitPriceSpecification",
                      "price": "22.00",
                      "priceCurrency": "EUR",
                      "unitText": "par personne HTVA"
                    }
                  }
                }
              ]
            },
            {
              "@type": "MenuSection",
              "name": "Buffets Chauds & Menus Festifs",
              "description": "Menus chauds en 2, 3, 4 ou 5 services élaborés sur mesure pour vos réceptions et mariages.",
              "hasMenuItem": [
                {
                  "@type": "MenuItem",
                  "name": "Buffet Chaud 2 Services",
                  "description": "Plat mijoté savoureux (carbonnade flamande, blanquette...) avec féculents et crudités, suivi d'un buffet de desserts."
                },
                {
                  "@type": "MenuItem",
                  "name": "Buffet Chaud 3 Services",
                  "description": "Entrée raffinée servie à table, généreux buffet chaud avec 2 choix de viandes, et farandole de douceurs."
                },
                {
                  "@type": "MenuItem",
                  "name": "Buffet Chaud 4 Services",
                  "description": "Zakouskis, entrée raffinée, grand buffet chaud viandes et poissons, plateau de fromages affinés ou dessert."
                },
                {
                  "@type": "MenuItem",
                  "name": "Buffet Chaud Prestige 5 Services",
                  "description": "Zakouskis en réception, double entrée froide et chaude, majestueux buffet chaud garni, buffet de fromages régionaux et cascade de desserts."
                }
              ]
            },
            {
              "@type": "MenuSection",
              "name": "Apéritifs & Mises en bouche",
              "description": "Zakouskis chauds et froids, verrines créatives, petits pains garnis et wraps.",
              "hasMenuItem": [
                {
                  "@type": "MenuItem",
                  "name": "Zakouskis & Bouchées Apéritives",
                  "description": "Créations terre et mer, arancini, mini burgers Black Angus, Saint-Jacques snackées."
                },
                {
                  "@type": "MenuItem",
                  "name": "Pains Garnis & Pains Festifs",
                  "description": "Pains surprises, pains garnis artisanaux et wraps gourmands."
                }
              ]
            },
            {
              "@type": "MenuSection",
              "name": "Plats Préparés Maison & Collectivités",
              "description": "Plats familiaux et traditionnels préparés chaque semaine avec des produits frais.",
              "hasMenuItem": [
                {
                  "@type": "MenuItem",
                  "name": "Plats Préparés du Jour",
                  "description": "Plats mijotés, poissons du jour, pâtes artisanales et légumes de saison.",
                  "offers": {
                    "@type": "Offer",
                    "price": "11.50",
                    "priceCurrency": "EUR",
                    "priceSpecification": {
                      "@type": "UnitPriceSpecification",
                      "price": "11.50",
                      "priceCurrency": "EUR",
                      "unitText": "par portion"
                    }
                  }
                }
              ]
            }
          ]
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Catalogue Prestations Traiteur Compère",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Service Traiteur Mariage",
                "description": "Prestation traiteur complète et sur-mesure pour mariages : vin d'honneur, cocktail, repas assis ou buffet, service et desserts."
              },
              "url": "https://www.traiteur-compere.be/services#mariages"
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Service Traiteur Événements d'Entreprise",
                "description": "Organisation de réceptions professionnelles, séminaires, cocktails dînatoires et repas de personnel en province de Liège."
              },
              "url": "https://www.traiteur-compere.be/services#entreprises"
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Service Traiteur Événements Privés & Fêtes de Famille",
                "description": "Repas de baptême, communion, anniversaire ou fête de famille à domicile ou en salle."
              },
              "url": "https://www.traiteur-compere.be/services#particuliers"
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Formule Barbecue Classique",
                "description": "Formule barbecue tout compris avec 3 viandes, salades fraîches, féculents et sauces maison."
              },
              "price": "15.00",
              "priceCurrency": "EUR",
              "availability": "https://schema.org/InStock",
              "url": "https://www.traiteur-compere.be/formules#bbq"
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Formule Barbecue Composé",
                "description": "Formule barbecue 2 entrées + 2 viandes au choix avec accompagnements à volonté."
              },
              "price": "21.00",
              "priceCurrency": "EUR",
              "availability": "https://schema.org/InStock",
              "url": "https://www.traiteur-compere.be/formules#bbq"
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Formule Buffet Froid Campagnard",
                "description": "Buffet froid traditionnel avec charcuteries artisanales, salades fraîches et crudités."
              },
              "price": "14.00",
              "priceCurrency": "EUR",
              "availability": "https://schema.org/InStock",
              "url": "https://www.traiteur-compere.be/formules"
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Formule Buffet Froid Gala",
                "description": "Buffet froid de prestige avec foie gras, cascade de fruits de mer et saumon en belle-vue."
              },
              "price": "22.00",
              "priceCurrency": "EUR",
              "availability": "https://schema.org/InStock",
              "url": "https://www.traiteur-compere.be/formules"
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Plats Préparés Maison de Saison",
                "description": "Plats cuisinés chaque semaine à emporter ou en livraison locale."
              },
              "price": "11.50",
              "priceCurrency": "EUR",
              "availability": "https://schema.org/InStock",
              "url": "https://www.traiteur-compere.be/plats-prepares"
            }
          ]
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://www.traiteur-compere.be/#website",
        "url": "https://www.traiteur-compere.be",
        "name": "Traiteur Compère",
        "description": "Traiteur haut de gamme pour mariages, barbecues et événements d'entreprise à Liège et en Wallonie.",
        "publisher": {
          "@id": "https://www.traiteur-compere.be/#caterer"
        },
        "hasPart": [
          {
            "@type": "WebPage",
            "@id": "https://www.traiteur-compere.be/formules",
            "name": "Formules & Menus",
            "url": "https://www.traiteur-compere.be/formules",
            "description": "Découvrez toutes nos formules : barbecues au feu de bois, buffets froids & chauds, salad bars."
          },
          {
            "@type": "WebPage",
            "@id": "https://www.traiteur-compere.be/services",
            "name": "Services Traiteur",
            "url": "https://www.traiteur-compere.be/services",
            "description": "Prestations pour mariages, banquets, réceptions d'entreprise et événements privés."
          },
          {
            "@type": "WebPage",
            "@id": "https://www.traiteur-compere.be/plats-prepares",
            "name": "Plats Préparés",
            "url": "https://www.traiteur-compere.be/plats-prepares",
            "description": "Menus hebdomadaires de plats cuisinés maison et commande en ligne."
          },
          {
            "@type": "WebPage",
            "@id": "https://www.traiteur-compere.be/contact",
            "name": "Contact & Devis",
            "url": "https://www.traiteur-compere.be/contact",
            "description": "Demandez votre devis gratuit sur-mesure pour votre événement."
          }
        ]
      },
      {
        "@type": "ItemList",
        "@id": "https://www.traiteur-compere.be/#site-navigation",
        "name": "Navigation Principale Traiteur Compère",
        "itemListElement": [
          {
            "@type": "SiteNavigationElement",
            "position": 1,
            "name": "Formules",
            "description": "Formules barbecues, buffets chauds et froids, salad bars et réceptions",
            "url": "https://www.traiteur-compere.be/formules"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 2,
            "name": "Services",
            "description": "Services traiteur pour mariages, entreprises, anniversaires et événements",
            "url": "https://www.traiteur-compere.be/services"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 3,
            "name": "Plats Préparés",
            "description": "Plats cuisinés maison chaque semaine à emporter ou en livraison",
            "url": "https://www.traiteur-compere.be/plats-prepares"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 4,
            "name": "Contact & Devis",
            "description": "Demandez un devis gratuit et personnalisé pour votre événement",
            "url": "https://www.traiteur-compere.be/contact"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 5,
            "name": "À Propos",
            "description": "Histoire et savoir-faire bicentenaire de la Maison Compère",
            "url": "https://www.traiteur-compere.be/a-propos"
          }
        ]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
