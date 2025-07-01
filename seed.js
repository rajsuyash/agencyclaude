const Database = require('better-sqlite3');
const db = new Database('./recipes.db');

try {
  db.exec('DROP TABLE IF EXISTS recipes');
  db.exec(`CREATE TABLE recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mood TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    steps TEXT NOT NULL
  )`);

  const stmt = db.prepare('INSERT INTO recipes (mood, title, description, steps) VALUES (?, ?, ?, ?)');
  
  // Happy
  stmt.run('happy', 'Pasta alla Vongole', 'Des spaghetti aux palourdes, l\'un des plats préférés de Candice !', JSON.stringify([
    'Faites cuire les spaghetti dans de l\'eau salée.',
    'Dans une poêle, faites revenir de l\'ail et du piment dans l\'huile d\'olive.',
    'Ajoutez les palourdes et faites-les ouvrir à feu vif.',
    'Ajoutez les pâtes, du persil et un peu d\'eau de cuisson.',
    'Servez immédiatement avec du citron.'
  ]));
  stmt.run('happy', 'Lasagna alla Bolognese', 'Une lasagne traditionnelle italienne, gratinée et fondante.', JSON.stringify([
    'Préparez la sauce bolognaise avec viande hachée, oignons, carottes, céleri.',
    'Faites cuire les feuilles de lasagne.',
    'Alternez couches de pâtes, sauce bolognaise, béchamel et parmesan.',
    'Faites gratiner au four 30 minutes à 180°C.',
    'Laissez reposer 10 minutes avant de servir.'
  ]));
  stmt.run('happy', 'Insalata Caprese', 'Une salade fraîche aux couleurs de l\'Italie.', JSON.stringify([
    'Coupez des tomates et de la mozzarella en tranches.',
    'Disposez-les en alternance sur un plat.',
    'Ajoutez des feuilles de basilic frais.',
    'Arrosez d\'huile d\'olive et de balsamique.',
    'Salez et poivrez selon votre goût.'
  ]));
  stmt.run('happy', 'Crêpes Suzette', 'Des crêpes fines nappées d\'une sauce à l\'orange flambée.', JSON.stringify([
    'Préparez la pâte à crêpes et laissez reposer 30 minutes.',
    'Faites cuire les crêpes dans une poêle chaude.',
    'Dans une autre poêle, faites fondre du beurre, ajoutez du sucre, du jus et du zeste d\'orange.',
    'Pliez les crêpes, nappez-les de sauce et flambez au Grand Marnier.',
    'Servez chaud avec des zestes d\'orange.'
  ]));
  stmt.run('happy', 'Tarte Tatin', 'Une tarte aux pommes caramélisées, renversée et fondante.', JSON.stringify([
    'Préchauffez le four à 180°C.',
    'Caramélisez du sucre et du beurre dans un moule.',
    'Disposez les quartiers de pommes sur le caramel.',
    'Recouvrez de pâte brisée et enfournez 30 minutes.',
    'Démoulez la tarte encore chaude.'
  ]));
  stmt.run('happy', 'Madeleines', 'Petits gâteaux moelleux en forme de coquillage.', JSON.stringify([
    'Préchauffez le four à 200°C.',
    'Mélangez œufs, sucre, farine, levure et beurre fondu.',
    'Versez la pâte dans des moules à madeleines.',
    'Faites cuire 8-10 minutes jusqu\'à ce qu\'elles soient dorées.',
    'Laissez refroidir avant de déguster.'
  ]));
  stmt.run('happy', 'Île flottante', 'Un dessert aérien de blancs en neige sur une crème anglaise.', JSON.stringify([
    'Montez les blancs en neige avec du sucre.',
    'Faites pocher les blancs dans du lait chaud.',
    'Préparez une crème anglaise avec les jaunes, le sucre et le lait.',
    'Versez la crème dans des coupes, ajoutez les blancs et nappez de caramel.'
  ]));
  stmt.run('happy', 'Financiers', 'Petits gâteaux aux amandes, dorés et moelleux.', JSON.stringify([
    'Préchauffez le four à 180°C.',
    'Mélangez poudre d\'amandes, sucre glace, farine.',
    'Ajoutez des blancs d\'œufs et du beurre fondu.',
    'Versez dans des moules à financiers.',
    'Faites cuire 15 minutes.'
  ]));
  stmt.run('happy', 'Clafoutis aux poires', 'Un dessert fruité et léger.', JSON.stringify([
    'Préchauffez le four à 180°C.',
    'Beurrez un plat et disposez les poires coupées.',
    'Mélangez œufs, sucre, farine, lait.',
    'Versez sur les poires et faites cuire 35 minutes.'
  ]));
  stmt.run('happy', 'Baba au rhum', 'Un gâteau imbibé de sirop au rhum.', JSON.stringify([
    'Préparez une pâte à baba et laissez lever.',
    'Faites cuire dans des moules individuels.',
    'Préparez un sirop au rhum et imbibez les babas.',
    'Servez avec de la chantilly.'
  ]));
  stmt.run('happy', 'Galette des rois', 'Une galette feuilletée à la frangipane.', JSON.stringify([
    'Préchauffez le four à 200°C.',
    'Préparez la frangipane (amandes, sucre, beurre, œufs).',
    'Étalez la pâte feuilletée, garnissez de frangipane.',
    'Recouvrez d\'une autre pâte, soudez les bords.',
    'Dorez et faites cuire 30 minutes.'
  ]));
  stmt.run('happy', 'Mousse au chocolat', 'Un dessert onctueux et gourmand.', JSON.stringify([
    'Faites fondre du chocolat.',
    'Séparez les blancs des jaunes d\'œufs.',
    'Mélangez les jaunes au chocolat fondu.',
    'Incorporez délicatement les blancs montés en neige.',
    'Réfrigérez 2h avant de servir.'
  ]));
  stmt.run('happy', 'Pain perdu', 'Des tranches de pain dorées, sucrées et moelleuses.', JSON.stringify([
    'Battez des œufs avec du lait et du sucre.',
    'Trempez les tranches de pain dans le mélange.',
    'Faites dorer à la poêle avec du beurre.',
    'Servez chaud, saupoudré de sucre glace.'
  ]));

  // Sad
  stmt.run('sad', 'Lasagna al Forno', 'Une lasagne réconfortante au fromage et à la viande.', JSON.stringify([
    'Préparez une sauce tomate avec viande hachée et épices.',
    'Faites une béchamel crémeuse.',
    'Alternez couches de lasagne, sauce, béchamel et fromage.',
    'Faites gratiner 25 minutes à 180°C.',
    'Servez bien chaud et réconfortant.'
  ]));
  stmt.run('sad', 'Gratin Dauphinois', 'Des pommes de terre fondantes à la crème et au fromage.', JSON.stringify([
    'Préchauffez le four à 180°C.',
    'Épluchez et coupez les pommes de terre en fines rondelles.',
    'Disposez-les dans un plat à gratin, salez, poivrez.',
    'Ajoutez de la crème et du lait, parsemez de fromage râpé.',
    'Faites cuire 1h jusqu\'à ce que le dessus soit doré.'
  ]));
  stmt.run('sad', 'Soupe à l\'oignon', 'Une soupe réconfortante gratinée au fromage.', JSON.stringify([
    'Émincez les oignons et faites-les revenir dans du beurre.',
    'Ajoutez de la farine, puis du bouillon.',
    'Laissez mijoter 30 minutes.',
    'Versez la soupe dans des bols, ajoutez du pain et du fromage.',
    'Faites gratiner au four avant de servir.'
  ]));
  stmt.run('sad', 'Moelleux au chocolat', 'Un gâteau au chocolat au cœur fondant.', JSON.stringify([
    'Préchauffez le four à 200°C.',
    'Faites fondre du chocolat et du beurre.',
    'Mélangez avec des œufs, du sucre et un peu de farine.',
    'Versez dans des moules individuels.',
    'Faites cuire 10 minutes, le cœur doit rester coulant.'
  ]));
  stmt.run('sad', 'Riz au lait', 'Un dessert crémeux et réconfortant.', JSON.stringify([
    'Faites chauffer du lait avec du sucre et une gousse de vanille.',
    'Ajoutez le riz rond et laissez cuire à feu doux 30 minutes.',
    'Remuez régulièrement.',
    'Servez tiède ou froid.'
  ]));
  stmt.run('sad', 'Tartiflette', 'Un gratin savoyard au reblochon, pommes de terre et lardons.', JSON.stringify([
    'Faites cuire les pommes de terre à l\'eau.',
    'Faites revenir lardons et oignons.',
    'Disposez pommes de terre, lardons, oignons dans un plat.',
    'Ajoutez le reblochon coupé en deux.',
    'Faites gratiner au four.'
  ]));
  stmt.run('sad', 'Pot-au-feu', 'Un plat familial de viande et légumes mijotés.', JSON.stringify([
    'Faites bouillir de la viande de bœuf avec des légumes (carottes, poireaux, navets).',
    'Écumez et laissez mijoter 2h.',
    'Servez la viande et les légumes avec du bouillon.'
  ]));
  stmt.run('sad', 'Purée maison', 'Une purée de pommes de terre onctueuse.', JSON.stringify([
    'Faites cuire les pommes de terre à l\'eau.',
    'Écrasez-les avec du beurre et du lait.',
    'Salez, poivrez et servez bien chaud.'
  ]));
  stmt.run('sad', 'Poulet rôti', 'Un poulet doré et juteux, parfait pour se réconforter.', JSON.stringify([
    'Préchauffez le four à 200°C.',
    'Badigeonnez le poulet de beurre, salez, poivrez.',
    'Faites cuire 1h15 en arrosant régulièrement.',
    'Servez avec des pommes de terre rôties.'
  ]));
  stmt.run('sad', 'Flan pâtissier', 'Un flan crémeux à la vanille.', JSON.stringify([
    'Préparez une pâte brisée et foncez un moule.',
    'Faites chauffer du lait avec de la vanille.',
    'Mélangez œufs, sucre, maïzena, ajoutez le lait chaud.',
    'Versez sur la pâte et faites cuire 40 minutes.'
  ]));
  stmt.run('sad', 'Gâteau au yaourt', 'Un gâteau moelleux et facile à faire.', JSON.stringify([
    'Mélangez un pot de yaourt, deux pots de sucre, trois pots de farine.',
    'Ajoutez trois œufs, un demi-pot d\'huile, un sachet de levure.',
    'Versez dans un moule et faites cuire 30 minutes à 180°C.'
  ]));

  // Adventurous
  stmt.run('adventurous', 'Pasta alla Norma', 'Des pâtes siciliennes aux aubergines et ricotta salée.', JSON.stringify([
    'Faites griller des aubergines coupées en dés.',
    'Faites cuire des pâtes courtes (rigatoni).',
    'Préparez une sauce tomate avec ail et basilic.',
    'Mélangez pâtes, sauce, aubergines et ricotta salée.',
    'Parsemez de basilic frais et servez.'
  ]));
  stmt.run('adventurous', 'Bouillabaisse', 'Une soupe de poissons provençale parfumée au safran.', JSON.stringify([
    'Préparez un bouillon avec des poissons de roche, oignons, tomates, ail et safran.',
    'Filtrez le bouillon et faites cuire des morceaux de poisson plus nobles dedans.',
    'Servez avec une rouille et des croûtons.'
  ]));
  stmt.run('adventurous', 'Cassoulet', 'Un plat du Sud-Ouest à base de haricots, confit et saucisse.', JSON.stringify([
    'Faites tremper les haricots blancs la veille.',
    'Faites cuire les haricots avec des aromates.',
    'Ajoutez confit de canard, saucisse et poitrine de porc.',
    'Laissez mijoter longuement au four.',
    'Servez bien chaud.'
  ]));
  stmt.run('adventurous', 'Escargots de Bourgogne', 'Escargots cuits au beurre persillé.', JSON.stringify([
    'Préparez un beurre d\'ail et de persil.',
    'Placez un peu de beurre dans chaque coquille avec un escargot.',
    'Disposez les escargots dans un plat.',
    'Faites gratiner 10 minutes à 200°C.',
    'Servez aussitôt.'
  ]));
  stmt.run('adventurous', 'Andouillette grillée', 'Saucisse typique, grillée et servie avec de la moutarde.', JSON.stringify([
    'Préchauffez le grill.',
    'Faites griller les andouillettes 10 minutes de chaque côté.',
    'Servez avec de la moutarde et des pommes de terre vapeur.'
  ]));
  stmt.run('adventurous', 'Boudin noir aux pommes', 'Un plat sucré-salé original.', JSON.stringify([
    'Faites revenir des rondelles de pommes dans du beurre.',
    'Ajoutez le boudin noir coupé en tranches.',
    'Faites dorer quelques minutes et servez chaud.'
  ]));
  stmt.run('adventurous', 'Tête de veau sauce gribiche', 'Un plat traditionnel pour les curieux.', JSON.stringify([
    'Faites cuire la tête de veau dans un bouillon aromatique.',
    'Préparez une sauce gribiche (œufs durs, cornichons, câpres, moutarde, huile).',
    'Servez la viande nappée de sauce.'
  ]));
  stmt.run('adventurous', 'Pieds de porc panés', 'Un plat rustique et croustillant.', JSON.stringify([
    'Faites cuire les pieds de porc dans un bouillon.',
    'Panez-les avec de la chapelure.',
    'Faites dorer à la poêle et servez avec une salade.'
  ]));
  stmt.run('adventurous', 'Cervelle meunière', 'Un mets délicat pour les aventuriers.', JSON.stringify([
    'Faites tremper la cervelle dans l\'eau froide.',
    'Faites-la pocher, puis panez et faites dorer au beurre.',
    'Servez avec du citron.'
  ]));
  stmt.run('adventurous', 'Rognons à la moutarde', 'Des rognons de veau cuisinés à la moutarde.', JSON.stringify([
    'Coupez les rognons en morceaux.',
    'Faites-les revenir à la poêle.',
    'Ajoutez de la crème et de la moutarde.',
    'Servez avec du riz.'
  ]));
  stmt.run('adventurous', 'Lapin à la moutarde', 'Un plat de lapin mijoté à la moutarde.', JSON.stringify([
    'Badigeonnez les morceaux de lapin de moutarde.',
    'Faites-les dorer à la poêle.',
    'Ajoutez de la crème et laissez mijoter 45 minutes.'
  ]));

  // Relaxed
  stmt.run('relaxed', 'Insalata Caesar', 'La salade préférée de Candice, fraîche et croquante.', JSON.stringify([
    'Lavez et coupez la laitue romaine.',
    'Préparez la vinaigrette Caesar avec anchois, ail, citron, parmesan.',
    'Ajoutez des croûtons dorés et du parmesan râpé.',
    'Mélangez délicatement et servez frais.'
  ]));
  stmt.run('relaxed', 'Quiche Lorraine', 'Une tarte salée aux lardons et à la crème.', JSON.stringify([
    'Préchauffez le four à 180°C.',
    'Étalez la pâte dans un moule.',
    'Répartissez les lardons sur la pâte.',
    'Mélangez œufs, crème, sel, poivre et versez sur les lardons.',
    'Faites cuire 35 minutes.'
  ]));
  stmt.run('relaxed', 'Salade niçoise', 'Une salade fraîche et colorée du Sud de la France.', JSON.stringify([
    'Lavez et coupez tomates, poivrons, radis, œufs durs, thon, olives.',
    'Disposez joliment les ingrédients dans un saladier.',
    'Assaisonnez avec huile d\'olive, sel, poivre et basilic.'
  ]));
  stmt.run('relaxed', 'Croque-monsieur', 'Un sandwich chaud au jambon et fromage, doré à la poêle.', JSON.stringify([
    'Beurrez deux tranches de pain de mie.',
    'Ajoutez une tranche de jambon et du fromage.',
    'Refermez le sandwich et faites dorer à la poêle ou au four.',
    'Servez chaud.'
  ]));
  stmt.run('relaxed', 'Oeufs cocotte', 'Des œufs cuits au four dans des ramequins.', JSON.stringify([
    'Beurrez des ramequins.',
    'Cassez un œuf dans chaque.',
    'Ajoutez crème, sel, poivre, herbes.',
    'Faites cuire au bain-marie 10 minutes.'
  ]));
  stmt.run('relaxed', 'Soupe de légumes', 'Une soupe douce et réconfortante.', JSON.stringify([
    'Épluchez et coupez les légumes de saison.',
    'Faites-les cuire dans de l\'eau salée.',
    'Mixez et servez chaud.'
  ]));
  stmt.run('relaxed', 'Tartine chèvre-miel', 'Une tartine grillée au fromage de chèvre et miel.', JSON.stringify([
    'Faites griller des tranches de pain.',
    'Déposez des rondelles de chèvre.',
    'Arrosez de miel et passez au four quelques minutes.'
  ]));
  stmt.run('relaxed', 'Salade de tomates anciennes', 'Une salade simple et savoureuse.', JSON.stringify([
    'Coupez différentes variétés de tomates.',
    'Ajoutez huile d\'olive, sel, poivre, basilic.',
    'Mélangez et servez frais.'
  ]));
  stmt.run('relaxed', 'Rillettes de thon', 'Une tartinade fraîche pour l\'apéritif.', JSON.stringify([
    'Émiettez du thon en boîte.',
    'Mélangez avec du fromage frais, citron, herbes.',
    'Servez sur des toasts.'
  ]));
  stmt.run('relaxed', 'Cake aux olives', 'Un cake salé moelleux aux olives et jambon.', JSON.stringify([
    'Mélangez farine, œufs, lait, huile.',
    'Ajoutez olives, jambon, fromage râpé.',
    'Versez dans un moule et faites cuire 40 minutes à 180°C.'
  ]));
  stmt.run('relaxed', 'Pissaladière', 'Une tarte provençale aux oignons et anchois.', JSON.stringify([
    'Préparez une pâte à pain.',
    'Faites fondre des oignons à la poêle.',
    'Étalez la pâte, garnissez d\'oignons, anchois, olives.',
    'Faites cuire 25 minutes à 200°C.'
  ]));

  // Energetic
  stmt.run('energetic', 'Insalata Mista', 'Une salade italienne fraîche et énergisante.', JSON.stringify([
    'Mélangez laitue, roquette, tomates cerises, concombre.',
    'Ajoutez des olives et du parmesan.',
    'Assaisonnez avec huile d\'olive, vinaigre balsamique, sel, poivre.'
  ]));
  stmt.run('energetic', 'Pasta al Pomodoro', 'Des spaghetti à la sauce tomate fraîche et basilic.', JSON.stringify([
    'Faites cuire les spaghetti al dente.',
    'Préparez une sauce tomate avec ail, basilic frais.',
    'Mélangez pâtes et sauce, ajoutez du parmesan.',
    'Servez immédiatement.'
  ]));
  stmt.run('energetic', 'Ratatouille', 'Un plat de légumes mijotés, plein de couleurs et de vitamines.', JSON.stringify([
    'Coupez aubergines, courgettes, poivrons, tomates en dés.',
    'Faites revenir chaque légume séparément dans l\'huile d\'olive.',
    'Mélangez tous les légumes et laissez mijoter 30 minutes.',
    'Servez chaud ou froid.'
  ]));
  stmt.run('energetic', 'Salade de lentilles', 'Une salade nourrissante et pleine d\'énergie.', JSON.stringify([
    'Faites cuire les lentilles dans de l\'eau salée.',
    'Égouttez et laissez refroidir.',
    'Ajoutez échalotes, carottes râpées, vinaigrette et persil.',
    'Mélangez et servez.'
  ]));
  stmt.run('energetic', 'Clafoutis aux cerises', 'Un dessert léger aux cerises, parfait pour l\'été.', JSON.stringify([
    'Préchauffez le four à 180°C.',
    'Beurrez un plat et disposez les cerises.',
    'Mélangez œufs, sucre, farine, lait et versez sur les cerises.',
    'Faites cuire 35 minutes.',
    'Laissez tiédir avant de déguster.'
  ]));
  stmt.run('energetic', 'Salade de quinoa', 'Une salade fraîche et protéinée.', JSON.stringify([
    'Faites cuire le quinoa.',
    'Ajoutez tomates, concombre, feta, herbes.',
    'Assaisonnez avec huile d\'olive et citron.'
  ]));
  stmt.run('energetic', 'Taboulé', 'Une salade de semoule, légumes et herbes.', JSON.stringify([
    'Faites gonfler la semoule avec de l\'eau.',
    'Ajoutez tomates, concombre, menthe, persil.',
    'Assaisonnez et servez frais.'
  ]));
  stmt.run('energetic', 'Omelette aux fines herbes', 'Une omelette légère et rapide.', JSON.stringify([
    'Battez les œufs avec sel, poivre, herbes.',
    'Faites cuire à la poêle avec un peu de beurre.',
    'Servez chaud.'
  ]));
  stmt.run('energetic', 'Tian de légumes', 'Un gratin coloré de légumes du soleil.', JSON.stringify([
    'Coupez courgettes, aubergines, tomates en rondelles.',
    'Disposez-les dans un plat, arrosez d\'huile d\'olive.',
    'Faites cuire 40 minutes à 180°C.'
  ]));
  stmt.run('energetic', 'Soupe froide de concombre', 'Une soupe rafraîchissante pour l\'été.', JSON.stringify([
    'Mixez concombre, yaourt, menthe, sel, poivre.',
    'Servez bien frais.'
  ]));
  stmt.run('energetic', 'Poêlée de champignons', 'Des champignons sautés à l\'ail et au persil.', JSON.stringify([
    'Nettoyez et coupez les champignons.',
    'Faites-les sauter à la poêle avec ail et persil.',
    'Servez chaud.'
  ]));
  stmt.run('energetic', 'Gaspacho', 'Une soupe froide de légumes mixés.', JSON.stringify([
    'Mixez tomates, poivrons, concombre, oignon, ail.',
    'Ajoutez huile d\'olive, vinaigre, sel, poivre.',
    'Servez très frais.'
  ]));

  console.log('Database seeded!');
} catch (error) {
  console.error('Error seeding database:', error);
} finally {
  db.close();
} 