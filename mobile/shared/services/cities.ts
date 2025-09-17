// Liste des villes avec coordonnées pour l'autocomplétion et les calculs astrologiques
export interface CityData {
  name: string;
  longitude: number;
  latitude: number;
  altitude: number;
  timezone: string;
}

export const cities: CityData[] = [
  {
    name: "Paris, France",
    longitude: 2.3483915,
    latitude: 48.8534951,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Marseille, France",
    longitude: 5.3699525,
    latitude: 43.2961743,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Lyon, France",
    longitude: 4.8320114,
    latitude: 45.7578137,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Toulouse, France",
    longitude: 1.4442469,
    latitude: 43.6044622,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Nice, France",
    longitude: 7.2683912,
    latitude: 43.7009358,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Nantes, France",
    longitude: -1.5541362,
    latitude: 47.2186371,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Strasbourg, France",
    longitude: 7.7507127,
    latitude: 48.584614,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Montpellier, France",
    longitude: 3.8767337,
    latitude: 43.6112422,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Bordeaux, France",
    longitude: -0.5800364,
    latitude: 44.841225,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Lille, France",
    longitude: 3.0635282,
    latitude: 50.6365654,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Rennes, France",
    longitude: -1.6800198,
    latitude: 48.1113387,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Reims, France",
    longitude: 4.031926,
    latitude: 49.2577886,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Saint-Étienne, France",
    longitude: 4.3873058,
    latitude: 45.4401467,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Toulon, France",
    longitude: 5.9304919,
    latitude: 43.1257311,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Le Havre, France",
    longitude: 0.1079732,
    latitude: 49.4938975,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Grenoble, France",
    longitude: 5.7357819,
    latitude: 45.1875602,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Dijon, France",
    longitude: 5.0414701,
    latitude: 47.3215806,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Angers, France",
    longitude: -0.5515588,
    latitude: 47.4739884,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Villeurbanne, France",
    longitude: 4.8868454,
    latitude: 45.7733573,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Le Mans, France",
    longitude: 0.1967849,
    latitude: 48.0073849,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Aix-en-Provence, France",
    longitude: 5.4474738,
    latitude: 43.5298424,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Brest, France",
    longitude: -4.4860088,
    latitude: 48.3905283,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Nîmes, France",
    longitude: 4.3600687,
    latitude: 43.8374249,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Limoges, France",
    longitude: 1.2644847,
    latitude: 45.8354243,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Clermont-Ferrand, France",
    longitude: 3.0819427,
    latitude: 45.7774551,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Tours, France",
    longitude: 0.6889268,
    latitude: 47.3900474,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Amiens, France",
    longitude: 2.2956951,
    latitude: 49.8941708,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Perpignan, France",
    longitude: 2.8953121,
    latitude: 42.6985304,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Metz, France",
    longitude: 6.1763552,
    latitude: 49.1196964,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Besançon, France",
    longitude: 6.0243622,
    latitude: 47.2380222,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Boulogne-Billancourt, France",
    longitude: 2.240206,
    latitude: 48.8356649,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Orléans, France",
    longitude: 1.9086066,
    latitude: 47.9027336,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Mulhouse, France",
    longitude: 7.3389937,
    latitude: 47.7467233,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Rouen, France",
    longitude: 1.0939658,
    latitude: 49.4404591,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Saint-Denis, France",
    longitude: 2.3580232,
    latitude: 48.935773,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Caen, France",
    longitude: -0.3635615,
    latitude: 49.1813403,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Argenteuil, France",
    longitude: 2.2481797,
    latitude: 48.9479069,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Saint-Paul, France",
    longitude: 2.0100016,
    latitude: 49.4318046,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Montreuil, France",
    longitude: 1.7631125,
    latitude: 50.4638918,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Nancy, France",
    longitude: 6.1834097,
    latitude: 48.6937223,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Roubaix, France",
    longitude: 3.1741734,
    latitude: 50.6915893,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Tourcoing, France",
    longitude: 3.1605714,
    latitude: 50.7235038,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Nanterre, France",
    longitude: 2.2071267,
    latitude: 48.8924273,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Vitry-sur-Seine, France",
    longitude: 2.39164,
    latitude: 48.7876,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Avignon, France",
    longitude: 4.8059012,
    latitude: 43.9492493,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Créteil, France",
    longitude: 2.4530731,
    latitude: 48.7771486,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Dunkirk, France",
    longitude: 2.3772525,
    latitude: 51.0347708,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Poitiers, France",
    longitude: 0.340196,
    latitude: 46.5802596,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Asnières-sur-Seine, France",
    longitude: 2.2890454,
    latitude: 48.9105948,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Courbevoie, France",
    longitude: 2.2561602,
    latitude: 48.8953328,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Versailles, France",
    longitude: 2.1266886,
    latitude: 48.8035403,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Colombes, France",
    longitude: 2.2543631,
    latitude: 48.9227298,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Fort-de-France, France",
    longitude: -61.0676724,
    latitude: 14.6027962,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Aulnay-sous-Bois, France",
    longitude: 2.499789,
    latitude: 48.934231,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Saint-Pierre, France",
    longitude: 7.4718731,
    latitude: 48.3832725,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Rueil-Malmaison, France",
    longitude: 2.1802832,
    latitude: 48.87778,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Pau, France",
    longitude: -0.3685668,
    latitude: 43.2957547,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Aubervilliers, France",
    longitude: 2.3821895,
    latitude: 48.9146078,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Levallois-Perret, France",
    longitude: 2.2881683,
    latitude: 48.892956,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "La Rochelle, France",
    longitude: -1.1515951,
    latitude: 46.159732,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Champigny-sur-Marne, France",
    longitude: 2.510611,
    latitude: 48.8137847,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Antibes, France",
    longitude: 7.1262071,
    latitude: 43.5812868,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Saint-Maur-des-Fossés, France",
    longitude: 2.4853015,
    latitude: 48.8033057,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Cannes, France",
    longitude: 7.0134418,
    latitude: 43.5515198,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Calais, France",
    longitude: 1.8538446,
    latitude: 50.9524769,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Bezons, France",
    longitude: 2.2105491,
    latitude: 48.9250016,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Colmar, France",
    longitude: 7.3579641,
    latitude: 48.0777517,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Drancy, France",
    longitude: 2.4455201,
    latitude: 48.9229803,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Mérignac, France",
    longitude: -0.6469022,
    latitude: 44.842168,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Valence, France",
    longitude: 4.8920811,
    latitude: 44.9332277,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Quimper, France",
    longitude: -4.1024782,
    latitude: 47.9960325,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Bourges, France",
    longitude: 2.399125,
    latitude: 47.0811658,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Béziers, France",
    longitude: 3.2131307,
    latitude: 43.3426562,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Bastia, France",
    longitude: 9.4509187,
    latitude: 42.6993979,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Albi, France",
    longitude: 2.147899,
    latitude: 43.9277552,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Agen, France",
    longitude: 0.6176112,
    latitude: 44.2015827,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Ajaccio, France",
    longitude: 8.7376029,
    latitude: 41.9263991,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Annecy, France",
    longitude: 6.1288847,
    latitude: 45.8992348,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Arras, France",
    longitude: 2.7772211,
    latitude: 50.291048,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Auxerre, France",
    longitude: 3.570579,
    latitude: 47.7961287,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Bayonne, France",
    longitude: -1.4736657,
    latitude: 43.4945144,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Blois, France",
    longitude: 1.3337639,
    latitude: 47.5876861,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Brive-la-Gaillarde, France",
    longitude: 1.5332389,
    latitude: 45.1584982,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Chambéry, France",
    longitude: 5.9203636,
    latitude: 45.5662672,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Charleville-Mézières, France",
    longitude: 4.7206939,
    latitude: 49.7735712,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Chartres, France",
    longitude: 1.4881434,
    latitude: 48.4438601,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Châteauroux, France",
    longitude: 1.6770956,
    latitude: 46.8203785,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Cholet, France",
    longitude: -0.8801359,
    latitude: 47.0617293,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Neuilly-sur-Seine, France",
    longitude: 2.2695658,
    latitude: 48.884683,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Cognac, France",
    longitude: -0.3250175,
    latitude: 45.6931647,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Dunkerque, France",
    longitude: 2.3772525,
    latitude: 51.0347708,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Épinal, France",
    longitude: 6.4503643,
    latitude: 48.1747684,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Évreux, France",
    longitude: 1.1510164,
    latitude: 49.0268903,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Forbach, France",
    longitude: 6.8958562,
    latitude: 49.1862822,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Fréjus, France",
    longitude: 6.7360182,
    latitude: 43.4330308,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Gap, France",
    longitude: 6.0820639,
    latitude: 44.5612032,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "La Roche-sur-Yon, France",
    longitude: -1.4269698,
    latitude: 46.6705431,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Laval, France",
    longitude: -0.7734022,
    latitude: 48.0706687,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Lorient, France",
    longitude: -3.3660907,
    latitude: 47.7477336,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Mâcon, France",
    longitude: 4.8322266,
    latitude: 46.3036683,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Meaux, France",
    longitude: 2.8773541,
    latitude: 48.9582708,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Melun, France",
    longitude: 2.6608169,
    latitude: 48.539927,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Moulins, France",
    longitude: 3.3331703,
    latitude: 46.5660526,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Nevers, France",
    longitude: 3.1577203,
    latitude: 46.9876601,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Niort, France",
    longitude: -0.4646064,
    latitude: 46.3239233,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Périgueux, France",
    longitude: 0.7184407,
    latitude: 45.1909365,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Saint-Brieuc, France",
    longitude: -2.7603283,
    latitude: 48.5141134,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Saint-Malo, France",
    longitude: -2.0260409,
    latitude: 48.649518,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Saint-Nazaire, France",
    longitude: -2.2138905,
    latitude: 47.2733517,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Saint-Quentin, France",
    longitude: 3.2876843,
    latitude: 49.8465253,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Sète, France",
    longitude: 3.6959771,
    latitude: 43.4014434,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Tarbes, France",
    longitude: 0.0781021,
    latitude: 43.232858,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Thionville, France",
    longitude: 6.1675872,
    latitude: 49.3579272,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Troyes, France",
    longitude: 4.0746257,
    latitude: 48.2971626,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Valenciennes, France",
    longitude: 3.5234846,
    latitude: 50.3579317,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Vannes, France",
    longitude: -2.7599079,
    latitude: 47.6586772,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Vienne, France",
    longitude: 0.465407,
    latitude: 46.6121165,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Villefranche-sur-Saône, France",
    longitude: 4.726611,
    latitude: 45.9864749,
    altitude: 0.035,
    timezone: "Europe/Paris"
  },
  {
    name: "Londres, Royaume-Uni",
    longitude: -0.1440551,
    latitude: 51.4893335,
    altitude: 0.035,
    timezone: "Europe/London"
  },
  {
    name: "Berlin, Allemagne",
    longitude: 13.3989367,
    latitude: 52.510885,
    altitude: 0.035,
    timezone: "Europe/Berlin"
  },
  {
    name: "Madrid, Espagne",
    longitude: -3.7035825,
    latitude: 40.4167047,
    altitude: 0.035,
    timezone: "Europe/Madrid"
  },
  {
    name: "Rome, Italie",
    longitude: 12.4829321,
    latitude: 41.8933203,
    altitude: 0.035,
    timezone: "Europe/Rome"
  },
  {
    name: "Amsterdam, Pays-Bas",
    longitude: 4.8924534,
    latitude: 52.3730796,
    altitude: 0.035,
    timezone: "Europe/Amsterdam"
  },
  {
    name: "Bruxelles, Belgique",
    longitude: 4.351697,
    latitude: 50.8465573,
    altitude: 0.035,
    timezone: "Europe/Brussels"
  },
  {
    name: "Vienne, Autriche",
    longitude: 16.3725042,
    latitude: 48.2083537,
    altitude: 0.035,
    timezone: "Europe/Vienna"
  },
  {
    name: "Prague, République tchèque",
    longitude: 14.4464593,
    latitude: 50.0596288,
    altitude: 0.035,
    timezone: "Europe/Prague"
  },
  {
    name: "Budapest, Hongrie",
    longitude: 19.1460941,
    latitude: 47.4813896,
    altitude: 0.035,
    timezone: "Europe/Budapest"
  },
  {
    name: "Varsovie, Pologne",
    longitude: 21.0067249,
    latitude: 52.2319581,
    altitude: 0.035,
    timezone: "Europe/Warsaw"
  },
  {
    name: "Stockholm, Suède",
    longitude: 18.0710935,
    latitude: 59.3251172,
    altitude: 0.035,
    timezone: "Europe/Stockholm"
  },
  {
    name: "Oslo, Norvège",
    longitude: 10.7389701,
    latitude: 59.9133301,
    altitude: 0.035,
    timezone: "Europe/Oslo"
  },
  {
    name: "Copenhague, Danemark",
    longitude: 12.5700724,
    latitude: 55.6867243,
    altitude: 0.035,
    timezone: "Europe/Copenhagen"
  },
  {
    name: "Helsinki, Finlande",
    longitude: 24.9384719,
    latitude: 60.1698897,
    altitude: 0.035,
    timezone: "Europe/Helsinki"
  },
  {
    name: "Dublin, Irlande",
    longitude: -6.2605593,
    latitude: 53.3493795,
    altitude: 0.035,
    timezone: "Europe/Dublin"
  },
  {
    name: "Lisbonne, Portugal",
    longitude: -9.1365919,
    latitude: 38.7077507,
    altitude: 0.035,
    timezone: "Europe/Lisbon"
  },
  {
    name: "Athènes, Grèce",
    longitude: 23.7348324,
    latitude: 37.9755648,
    altitude: 0.035,
    timezone: "Europe/Athens"
  },
  {
    name: "Bucarest, Roumanie",
    longitude: 26.1027202,
    latitude: 44.4361414,
    altitude: 0.035,
    timezone: "Europe/Bucharest"
  },
  {
    name: "Sofia, Bulgarie",
    longitude: 23.3217359,
    latitude: 42.6977028,
    altitude: 0.035,
    timezone: "Europe/Sofia"
  },
  {
    name: "Zagreb, Croatie",
    longitude: 15.9772795,
    latitude: 45.8130967,
    altitude: 0.035,
    timezone: "Europe/Zagreb"
  },
  {
    name: "Ljubljana, Slovénie",
    longitude: 14.5069289,
    latitude: 46.0500268,
    altitude: 0.035,
    timezone: "Europe/Ljubljana"
  },
  {
    name: "Bratislava, Slovaquie",
    longitude: 17.1093063,
    latitude: 48.1516988,
    altitude: 0.035,
    timezone: "Europe/Bratislava"
  },
  {
    name: "Tallinn, Estonie",
    longitude: 24.7453688,
    latitude: 59.4372155,
    altitude: 0.035,
    timezone: "Europe/Tallinn"
  },
  {
    name: "Riga, Lettonie",
    longitude: 24.1051846,
    latitude: 56.9493977,
    altitude: 0.035,
    timezone: "Europe/Riga"
  },
  {
    name: "Vilnius, Lituanie",
    longitude: 25.2829111,
    latitude: 54.6870458,
    altitude: 0.035,
    timezone: "Europe/Vilnius"
  },
  {
    name: "Luxembourg, Luxembourg",
    longitude: 6.1296751,
    latitude: 49.8158683,
    altitude: 0.035,
    timezone: "Europe/Luxembourg"
  },
  {
    name: "Monaco, Monaco",
    longitude: 2.7166464,
    latitude: 46.1012225,
    altitude: 0.035,
    timezone: "Europe/Monaco"
  },
  {
    name: "Andorre-la-Vieille, Andorre",
    longitude: 1.5212467,
    latitude: 42.5069391,
    altitude: 0.035,
    timezone: "Europe/Andorra"
  },
  {
    name: "San Marino, San Marino",
    longitude: 12.458306,
    latitude: 43.9458623,
    altitude: 0.035,
    timezone: "Europe/San_Marino"
  },
  {
    name: "Vatican, Vatican",
    longitude: 12.4528349,
    latitude: 41.9034912,
    altitude: 0.035,
    timezone: "Europe/Vatican"
  },
  {
    name: "Malte, Malte",
    longitude: 14.4476911,
    latitude: 35.8885993,
    altitude: 0.035,
    timezone: "Europe/Malta"
  },
  {
    name: "Chypre, Chypre",
    longitude: 32.8899027,
    latitude: 34.9174159,
    altitude: 0.035,
    timezone: "Asia/Nicosia"
  },
  {
    name: "Islande, Islande",
    longitude: -18.1059013,
    latitude: 64.9841821,
    altitude: 0.035,
    timezone: "Atlantic/Reykjavik"
  },
  {
    name: "Liechtenstein, Liechtenstein",
    longitude: 9.5531527,
    latitude: 47.1416307,
    altitude: 0.035,
    timezone: "Europe/Vaduz"
  },
  {
    name: "Manchester, Royaume-Uni",
    longitude: -2.2451148,
    latitude: 53.4794892,
    altitude: 0.035,
    timezone: "Europe/London"
  },
  {
    name: "Birmingham, Royaume-Uni",
    longitude: -1.9026911,
    latitude: 52.4796992,
    altitude: 0.035,
    timezone: "Europe/London"
  },
  {
    name: "Liverpool, Royaume-Uni",
    longitude: -2.99168,
    latitude: 53.4071991,
    altitude: 0.035,
    timezone: "Europe/London"
  },
  {
    name: "Glasgow, Royaume-Uni",
    longitude: -4.2501687,
    latitude: 55.861155,
    altitude: 0.035,
    timezone: "Europe/London"
  },
  {
    name: "Edimbourg, Royaume-Uni",
    longitude: -3.1883749,
    latitude: 55.9533456,
    altitude: 0.035,
    timezone: "Europe/London"
  },
  {
    name: "Hambourg, Allemagne",
    longitude: 10.000654,
    latitude: 53.550341,
    altitude: 0.035,
    timezone: "Europe/Berlin"
  },
  {
    name: "Munich, Allemagne",
    longitude: 11.5753822,
    latitude: 48.1371079,
    altitude: 0.035,
    timezone: "Europe/Berlin"
  },
  {
    name: "Cologne, Allemagne",
    longitude: 6.959974,
    latitude: 50.938361,
    altitude: 0.035,
    timezone: "Europe/Berlin"
  },
  {
    name: "Francfort, Allemagne",
    longitude: 8.6820917,
    latitude: 50.1106444,
    altitude: 0.035,
    timezone: "Europe/Berlin"
  },
  {
    name: "Stuttgart, Allemagne",
    longitude: 9.1800132,
    latitude: 48.7784485,
    altitude: 0.035,
    timezone: "Europe/Berlin"
  },
  {
    name: "Düsseldorf, Allemagne",
    longitude: 6.7763137,
    latitude: 51.2254018,
    altitude: 0.035,
    timezone: "Europe/Berlin"
  },
  {
    name: "Dortmund, Allemagne",
    longitude: 7.4652789,
    latitude: 51.5142273,
    altitude: 0.035,
    timezone: "Europe/Berlin"
  },
  {
    name: "Essen, Allemagne",
    longitude: 7.0158171,
    latitude: 51.4582235,
    altitude: 0.035,
    timezone: "Europe/Berlin"
  },
  {
    name: "Leipzig, Allemagne",
    longitude: 12.3747329,
    latitude: 51.3406321,
    altitude: 0.035,
    timezone: "Europe/Berlin"
  },
  {
    name: "Barcelone, Espagne",
    longitude: 2.177073,
    latitude: 41.3825802,
    altitude: 0.035,
    timezone: "Europe/Madrid"
  },
  {
    name: "Valence, Espagne",
    longitude: -0.3763353,
    latitude: 39.4697065,
    altitude: 0.035,
    timezone: "Europe/Madrid"
  },
  {
    name: "Séville, Espagne",
    longitude: -5.9953403,
    latitude: 37.3886303,
    altitude: 0.035,
    timezone: "Europe/Madrid"
  },
  {
    name: "Saragosse, Espagne",
    longitude: -0.8809428,
    latitude: 41.6521342,
    altitude: 0.035,
    timezone: "Europe/Madrid"
  },
  {
    name: "Málaga, Espagne",
    longitude: -4.4216366,
    latitude: 36.7213028,
    altitude: 0.035,
    timezone: "Europe/Madrid"
  },
  {
    name: "Milan, Italie",
    longitude: 9.1896346,
    latitude: 45.4641943,
    altitude: 0.035,
    timezone: "Europe/Rome"
  },
  {
    name: "Naples, Italie",
    longitude: 14.2487679,
    latitude: 40.8358846,
    altitude: 0.035,
    timezone: "Europe/Rome"
  },
  {
    name: "Turin, Italie",
    longitude: 7.6824892,
    latitude: 45.0677551,
    altitude: 0.035,
    timezone: "Europe/Rome"
  },
  {
    name: "Palerme, Italie",
    longitude: 13.3524434,
    latitude: 38.1112268,
    altitude: 0.035,
    timezone: "Europe/Rome"
  },
  {
    name: "Gênes, Italie",
    longitude: 8.9338624,
    latitude: 44.40726,
    altitude: 0.035,
    timezone: "Europe/Rome"
  },
  {
    name: "Bologne, Italie",
    longitude: 11.3426327,
    latitude: 44.4938203,
    altitude: 0.035,
    timezone: "Europe/Rome"
  },
  {
    name: "Florence, Italie",
    longitude: 11.2556404,
    latitude: 43.7697955,
    altitude: 0.035,
    timezone: "Europe/Rome"
  },
  {
    name: "Rotterdam, Pays-Bas",
    longitude: 4.47775,
    latitude: 51.9244424,
    altitude: 0.035,
    timezone: "Europe/Amsterdam"
  },
  {
    name: "La Haye, Pays-Bas",
    longitude: 4.3113461,
    latitude: 52.0799838,
    altitude: 0.035,
    timezone: "Europe/Amsterdam"
  },
  {
    name: "Utrecht, Pays-Bas",
    longitude: 5.1215634,
    latitude: 52.0907006,
    altitude: 0.035,
    timezone: "Europe/Amsterdam"
  },
  {
    name: "Eindhoven, Pays-Bas",
    longitude: 5.478633,
    latitude: 51.4392648,
    altitude: 0.035,
    timezone: "Europe/Amsterdam"
  },
  {
    name: "Anvers, Belgique",
    longitude: 4.3997081,
    latitude: 51.2211097,
    altitude: 0.035,
    timezone: "Europe/Brussels"
  },
  {
    name: "Gand, Belgique",
    longitude: 3.7250121,
    latitude: 51.0538286,
    altitude: 0.035,
    timezone: "Europe/Brussels"
  },
  {
    name: "Charleroi, Belgique",
    longitude: 4.444528,
    latitude: 50.4116233,
    altitude: 0.035,
    timezone: "Europe/Brussels"
  },
  {
    name: "Liège, Belgique",
    longitude: 5.5736112,
    latitude: 50.6450944,
    altitude: 0.035,
    timezone: "Europe/Brussels"
  },
  {
    name: "Graz, Autriche",
    longitude: 15.4382786,
    latitude: 47.0708678,
    altitude: 0.035,
    timezone: "Europe/Vienna"
  },
  {
    name: "Linz, Autriche",
    longitude: 14.286198,
    latitude: 48.3059078,
    altitude: 0.035,
    timezone: "Europe/Vienna"
  },
  {
    name: "Salzbourg, Autriche",
    longitude: 13.0464806,
    latitude: 47.7981346,
    altitude: 0.035,
    timezone: "Europe/Vienna"
  },
  {
    name: "Innsbruck, Autriche",
    longitude: 11.3927685,
    latitude: 47.2654296,
    altitude: 0.035,
    timezone: "Europe/Vienna"
  },
  {
    name: "Porto, Portugal",
    longitude: -8.6103497,
    latitude: 41.1502195,
    altitude: 0.035,
    timezone: "Europe/Lisbon"
  },
  {
    name: "Coimbra, Portugal",
    longitude: -8.4294632,
    latitude: 40.2111931,
    altitude: 0.035,
    timezone: "Europe/Lisbon"
  },
  {
    name: "Braga, Portugal",
    longitude: -8.4280045,
    latitude: 41.5510583,
    altitude: 0.035,
    timezone: "Europe/Lisbon"
  },
  {
    name: "Thessalonique, Grèce",
    longitude: 22.9352716,
    latitude: 40.6403167,
    altitude: 0.035,
    timezone: "Europe/Athens"
  },
  {
    name: "Patras, Grèce",
    longitude: 21.7350847,
    latitude: 38.246242,
    altitude: 0.035,
    timezone: "Europe/Athens"
  },
  {
    name: "Larissa, Grèce",
    longitude: 22.4160706,
    latitude: 39.6383092,
    altitude: 0.035,
    timezone: "Europe/Athens"
  },
  {
    name: "Heraklion, Grèce",
    longitude: 25.1332843,
    latitude: 35.33908,
    altitude: 0.035,
    timezone: "Europe/Athens"
  },
  {
    name: "Cluj-Napoca, Roumanie",
    longitude: 23.5899542,
    latitude: 46.769379,
    altitude: 0.035,
    timezone: "Europe/Bucharest"
  },
  {
    name: "Timișoara, Roumanie",
    longitude: 21.2257474,
    latitude: 45.7538355,
    altitude: 0.035,
    timezone: "Europe/Bucharest"
  },
  {
    name: "Iași, Roumanie",
    longitude: 27.5837814,
    latitude: 47.1615598,
    altitude: 0.035,
    timezone: "Europe/Bucharest"
  },
  {
    name: "Constanța, Roumanie",
    longitude: 28.6507598,
    latitude: 44.1767161,
    altitude: 0.035,
    timezone: "Europe/Bucharest"
  },
  {
    name: "Plovdiv, Bulgarie",
    longitude: 24.7499297,
    latitude: 42.1418541,
    altitude: 0.035,
    timezone: "Europe/Sofia"
  },
  {
    name: "Varna, Bulgarie",
    longitude: 27.9166653,
    latitude: 43.2073873,
    altitude: 0.035,
    timezone: "Europe/Sofia"
  },
  {
    name: "Bourgas, Bulgarie",
    longitude: 27.4721276,
    latitude: 42.4936616,
    altitude: 0.035,
    timezone: "Europe/Sofia"
  },
  {
    name: "Split, Croatie",
    longitude: 16.4399659,
    latitude: 43.5116383,
    altitude: 0.035,
    timezone: "Europe/Zagreb"
  },
  {
    name: "Rijeka, Croatie",
    longitude: 14.442208,
    latitude: 45.3267976,
    altitude: 0.035,
    timezone: "Europe/Zagreb"
  },
  {
    name: "Osijek, Croatie",
    longitude: 18.6953685,
    latitude: 45.5548793,
    altitude: 0.035,
    timezone: "Europe/Zagreb"
  },
  {
    name: "Maribor, Slovénie",
    longitude: 15.6455854,
    latitude: 46.5576439,
    altitude: 0.035,
    timezone: "Europe/Ljubljana"
  },
  {
    name: "Celje, Slovénie",
    longitude: 15.2616828,
    latitude: 46.2293889,
    altitude: 0.035,
    timezone: "Europe/Ljubljana"
  },
  {
    name: "Kranj, Slovénie",
    longitude: 14.3549353,
    latitude: 46.2432913,
    altitude: 0.035,
    timezone: "Europe/Ljubljana"
  },
  {
    name: "Košice, Slovaquie",
    longitude: 21.2496774,
    latitude: 48.7172272,
    altitude: 0.035,
    timezone: "Europe/Bratislava"
  },
  {
    name: "Žilina, Slovaquie",
    longitude: 18.7393139,
    latitude: 49.2234674,
    altitude: 0.035,
    timezone: "Europe/Bratislava"
  },
  {
    name: "Nitra, Slovaquie",
    longitude: 18.0894593,
    latitude: 48.31295,
    altitude: 0.035,
    timezone: "Europe/Bratislava"
  },
  {
    name: "Tartu, Estonie",
    longitude: 26.72245,
    latitude: 58.3801207,
    altitude: 0.035,
    timezone: "Europe/Tallinn"
  },
  {
    name: "Narva, Estonie",
    longitude: 28.1402278,
    latitude: 59.3578938,
    altitude: 0.035,
    timezone: "Europe/Tallinn"
  },
  {
    name: "Pärnu, Estonie",
    longitude: 24.5081751,
    latitude: 58.3835136,
    altitude: 0.035,
    timezone: "Europe/Tallinn"
  },
  {
    name: "Daugavpils, Lettonie",
    longitude: 26.5159337,
    latitude: 55.8712267,
    altitude: 0.035,
    timezone: "Europe/Riga"
  },
  {
    name: "Liepāja, Lettonie",
    longitude: 21.0070903,
    latitude: 56.5048435,
    altitude: 0.035,
    timezone: "Europe/Riga"
  },
  {
    name: "Jelgava, Lettonie",
    longitude: 23.7339143,
    latitude: 56.6514394,
    altitude: 0.035,
    timezone: "Europe/Riga"
  },
  {
    name: "Kaunas, Lituanie",
    longitude: 23.9044817,
    latitude: 54.8982139,
    altitude: 0.035,
    timezone: "Europe/Vilnius"
  },
  {
    name: "Klaipėda, Lituanie",
    longitude: 21.1350469,
    latitude: 55.7127529,
    altitude: 0.035,
    timezone: "Europe/Vilnius"
  },
  {
    name: "Šiauliai, Lituanie",
    longitude: 23.3157775,
    latitude: 55.9340823,
    altitude: 0.035,
    timezone: "Europe/Vilnius"
  },
  {
    name: "Zurich, Suisse",
    longitude: 8.5410422,
    latitude: 47.3744489,
    altitude: 0.035,
    timezone: "Europe/Zurich"
  },
  {
    name: "Genève, Suisse",
    longitude: 6.1466014,
    latitude: 46.2017559,
    altitude: 0.035,
    timezone: "Europe/Zurich"
  },
  {
    name: "Bâle, Suisse",
    longitude: 7.5878261,
    latitude: 47.5581077,
    altitude: 0.035,
    timezone: "Europe/Zurich"
  },
  {
    name: "Berne, Suisse",
    longitude: 7.4521749,
    latitude: 46.9484742,
    altitude: 0.035,
    timezone: "Europe/Zurich"
  },
  {
    name: "Lausanne, Suisse",
    longitude: 6.6327025,
    latitude: 46.5218269,
    altitude: 0.035,
    timezone: "Europe/Zurich"
  },
  {
    name: "Winterthour, Suisse",
    longitude: 8.7291498,
    latitude: 47.4991723,
    altitude: 0.035,
    timezone: "Europe/Zurich"
  },
  {
    name: "Saint-Gall, Suisse",
    longitude: 9.3762397,
    latitude: 47.425618,
    altitude: 0.035,
    timezone: "Europe/Zurich"
  },
  {
    name: "Lucerne, Suisse",
    longitude: 8.3054682,
    latitude: 47.0505452,
    altitude: 0.035,
    timezone: "Europe/Zurich"
  },
  {
    name: "Lugano, Suisse",
    longitude: 8.9520281,
    latitude: 46.0050102,
    altitude: 0.035,
    timezone: "Europe/Zurich"
  },
  {
    name: "Bienne, Suisse",
    longitude: 7.2439029,
    latitude: 47.1402077,
    altitude: 0.035,
    timezone: "Europe/Zurich"
  },
  {
    name: "Montréal, Canada",
    longitude: -73.5698065,
    latitude: 45.5031824,
    altitude: 0.035,
    timezone: "America/Toronto"
  },
  {
    name: "Québec, Canada",
    longitude: -71.8258668,
    latitude: 52.4760892,
    altitude: 0.035,
    timezone: "America/Toronto"
  },
  {
    name: "Ottawa, Canada",
    longitude: -75.6901106,
    latitude: 45.4208777,
    altitude: 0.035,
    timezone: "America/Toronto"
  },
  {
    name: "Toronto, Canada",
    longitude: -79.3839347,
    latitude: 43.6534817,
    altitude: 0.035,
    timezone: "America/Toronto"
  },
  {
    name: "Vancouver, Canada",
    longitude: -123.113952,
    latitude: 49.2608724,
    altitude: 0.035,
    timezone: "America/Toronto"
  },
  {
    name: "Calgary, Canada",
    longitude: -114.057541,
    latitude: 51.0456064,
    altitude: 0.035,
    timezone: "America/Toronto"
  },
  {
    name: "Edmonton, Canada",
    longitude: -113.491241,
    latitude: 53.5462055,
    altitude: 0.035,
    timezone: "America/Toronto"
  },
  {
    name: "Winnipeg, Canada",
    longitude: -97.1384584,
    latitude: 49.8955367,
    altitude: 0.035,
    timezone: "America/Toronto"
  },
  {
    name: "Halifax, Canada",
    longitude: -63.5859487,
    latitude: 44.648618,
    altitude: 0.035,
    timezone: "America/Toronto"
  },
  {
    name: "Bruxelles, Belgique",
    longitude: 4.351697,
    latitude: 50.8465573,
    altitude: 0.035,
    timezone: "Europe/Brussels"
  },
  {
    name: "Anvers, Belgique",
    longitude: 4.3997081,
    latitude: 51.2211097,
    altitude: 0.035,
    timezone: "Europe/Brussels"
  },
  {
    name: "Gand, Belgique",
    longitude: 3.7250121,
    latitude: 51.0538286,
    altitude: 0.035,
    timezone: "Europe/Brussels"
  },
  {
    name: "Charleroi, Belgique",
    longitude: 4.444528,
    latitude: 50.4116233,
    altitude: 0.035,
    timezone: "Europe/Brussels"
  },
  {
    name: "Liège, Belgique",
    longitude: 5.5736112,
    latitude: 50.6450944,
    altitude: 0.035,
    timezone: "Europe/Brussels"
  },
  {
    name: "Bruges, Belgique",
    longitude: 3.226772,
    latitude: 51.2085526,
    altitude: 0.035,
    timezone: "Europe/Brussels"
  },
  {
    name: "Namur, Belgique",
    longitude: 4.8661892,
    latitude: 50.4665284,
    altitude: 0.035,
    timezone: "Europe/Brussels"
  },
  {
    name: "Mons, Belgique",
    longitude: 3.951958,
    latitude: 50.4549568,
    altitude: 0.035,
    timezone: "Europe/Brussels"
  },
  {
    name: "Louvain, Belgique",
    longitude: 4.7011675,
    latitude: 50.879202,
    altitude: 0.035,
    timezone: "Europe/Brussels"
  },
  {
    name: "Tournai, Belgique",
    longitude: 3.3878179,
    latitude: 50.6056458,
    altitude: 0.035,
    timezone: "Europe/Brussels"
  },
  {
    name: "Luxembourg, Luxembourg",
    longitude: 6.1296751,
    latitude: 49.8158683,
    altitude: 0.035,
    timezone: "Europe/Luxembourg"
  },
  {
    name: "Esch-sur-Alzette, Luxembourg",
    longitude: 5.9850306,
    latitude: 49.4959628,
    altitude: 0.035,
    timezone: "Europe/Luxembourg"
  },
  {
    name: "Differdange, Luxembourg",
    longitude: 5.889242,
    latitude: 49.5208469,
    altitude: 0.035,
    timezone: "Europe/Luxembourg"
  },
  {
    name: "Dudelange, Luxembourg",
    longitude: 6.0847792,
    latitude: 49.4786477,
    altitude: 0.035,
    timezone: "Europe/Luxembourg"
  },
  {
    name: "Ettelbruck, Luxembourg",
    longitude: 6.0984659,
    latitude: 49.8470016,
    altitude: 0.035,
    timezone: "Europe/Luxembourg"
  },
  {
    name: "Diekirch, Luxembourg",
    longitude: 6.1600549,
    latitude: 49.8690898,
    altitude: 0.035,
    timezone: "Europe/Luxembourg"
  },
  {
    name: "Wiltz, Luxembourg",
    longitude: 5.9321021,
    latitude: 49.9666914,
    altitude: 0.035,
    timezone: "Europe/Luxembourg"
  },
  {
    name: "Grevenmacher, Luxembourg",
    longitude: 6.4430979,
    latitude: 49.679313,
    altitude: 0.035,
    timezone: "Europe/Luxembourg"
  },
  {
    name: "Remich, Luxembourg",
    longitude: 6.3676062,
    latitude: 49.5442267,
    altitude: 0.035,
    timezone: "Europe/Luxembourg"
  },
  {
    name: "Vianden, Luxembourg",
    longitude: 6.2066715,
    latitude: 49.9336976,
    altitude: 0.035,
    timezone: "Europe/Luxembourg"
  }
];

// Fonction utilitaire pour filtrer les villes
export const filterCities = (query: string): CityData[] => {
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase();
  return cities
    .filter(city => city.name.toLowerCase().includes(lowerQuery))
    .slice(0, 10); // Limiter à 10 résultats
};

// Fonction pour récupérer les coordonnées d'une ville
export const getCityCoordinates = (cityName: string): CityData | null => {
  return cities.find(city => city.name === cityName) || null;
};
