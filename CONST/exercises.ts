interface ExerciceDto {
  number: number
  title: string
  difficulty: number
  description: string
}
export const challenges: ExerciceDto[] = [
  {
    number: 1,
    title: ' Nombre de personnes dans le bus',
    difficulty: 8,
    description:
      'Un bus se déplace en ville, il prend et/ou dépose certaines personnes à chaque arrêt. \nVous recevez une liste d’entiers. Chaque élément comporte le nombre de personnes qui \nmontent  dans le  bus  (le  premier  élément)  et le  nombre  de  personnes  qui  en  sortent  (le \ndeuxième élément). \nLe 2\ne\n nombre du premier élément de la liste vaut toujours 0 car le bus est vide en arrivant \nau premier arrêt de bus. Votre tâche consiste à renvoyer le nombre de personnes encore \ndans le bus après le dernier arrêt.  \nnumber([[10,0],[3,5],[5,8]])  5 \nnumber([[3,0],[9,1],[4,10],[12,2],[6,1],[7,10]])  17 \nnumber([[3,0],[9,1],[4,8],[12,2],[6,1],[7,8]])  21',
  },
  {
    number: 3,
    title: ' Enlever le premier et le dernier caractère d’une chaîne',
    difficulty: 8,
    description:
      'En entrée on vous donne une chaîne de caractères, en sortie vous devez  avoir la même phrase sans le \npremier ni le dernier caractère. \nremoveChar("Ceci est une phrase")  "eci est une phras"',
  },
  {
    number: 5,
    title: ' Doubler les lettres',
    difficulty: 8,
    description:
      'A  partir d\'une  chaîne de  caractères, renvoyez une  chaîne  dans  laquelle  chaque  caractère  (sensible  à  la \ncasse) est répété une fois. \ndoubleChar("String")  "SSttrriinngg" \ndoubleChar("Hello World")  "HHeelllloo  WWoorrlldd" \ndoubleChar("1234!_ ")  "11223344!!__  "',
  },
  {
    number: 7,
    title: ' Joueur suivant',
    difficulty: 8,
    description:
      'Deux joueurs - black et white - jouent à un jeu qui se compose de plusieurs tours. Si un joueur gagne \nun tour, il commencera également le prochain. S’il perd, c\'est l\'autre joueur qui commencera. A partir de \nla  couleur  du  joueur  actuel  et  du  résultat  du  tour  (true ou false),  déterminez qui  débutera  le  prochain \ntour. \nwhoseMove("black",false)  "white" \nwhoseMove("white",true)  "white" \nwhoseMove("white",false)  "black"',
  },
  {
    number: 9,
    title: ' Accumulation de lettres',
    difficulty: 7,
    description:
      'Ecrire une fonction accum telle que : \naccum("abcd")     "A-Bb-Ccc-Dddd" \naccum("RqaEzty")  "R-Qq-Aaa-Eeee-Zzzzz-Tttttt-Yyyyyyy" \naccum("cwAt")  "C-Ww-Aaa-Tttt" \nRemarquez les majuscules au début de chacun des blocs, le nombre de lettres croissant et la séparation \navec des tirets.',
  },
  {
    number: 11,
    title: ' Code PIN',
    difficulty: 7,
    description:
      'Les  distributeurs  automatiques  permettent  de  taper  des  codes  PIN,  ces \nderniers ne peuvent contenir que 4 chiffres ou exactement 6 chiffres. Si \nla  fonction  est  transmise  est  un  code  PIN  valide,  renvoyez true,  sinon \nrenvoyez false. \nValidatePIN ("1234")  true \nValidatePIN ("12345")  false \nValidatePIN ("a234")  false',
  },
  {
    number: 13,
    title: ' Nombre de voyelles',
    difficulty: 7,
    description:
      'Renvoyez le nombre de voyelles (a, e, i, o, et u) dans une chaîne donnée. \ngetCount("Ceci est une phrase")  7 \n  16',
  },
  {
    number: 15,
    title: ' Compteur',
    difficulty: 7,
    description:
      'Créez une fonction qui, à partir d’un nombre donné sous la forme d’une chaîne de caractères, renvoit : \ncounterEffect("1250")  [[0,1],[0,1,2],[0,1,2,3,4,5],[0]] \ncounterEffect("0050")  [[0],[0],[0,1,2,3,4,5],[0]] \ncounterEffect("0000")  [[0],[0],[0],[0]]',
  },
  {
    number: 17,
    title: ' Le mot le plus court',
    difficulty: 7,
    description:
      'On vous donne une chaîne de mots, renvoyez la longueur du ou des mots les plus courts. \nLa chaîne ne sera jamais vide et vous ne devez pas tenir compte des types de données (nombres, lettres \netc.). \nfindShort("bitcoin take over the world maybe who knows perhaps")  3',
  },
  {
    number: 19,
    title: ' RVB vers niveaux de gris',
    difficulty: 7,
    description:
      "Un  tableau  de  taille  N  x  M  représente  les  pixels  d'une  image.  Chaque  cellule  de  ce  tableau  contient  un \ntableau de taille 3 avec les informations de couleur du pixel : [R, G, B] \nConvertissez l'image couleur en une image moyenne en niveaux de gris. \nLe tableau [R, G, B] contient des nombres entiers entre 0 et 255 pour chaque couleur. \nPour transformer un pixel de couleur en un pixel en niveaux de gris, utilisez la valeur moyenne des valeurs \nde ce pixel : P = [R, G, B] => [(R + G + B) / 3, (R + G + B) / 3, (R + G + B) / 3] \nRemarque : les valeurs pour le pixel doivent être entières, donc trouvez l'entier le plus proche. \nExemple \nVoici un exemple d'image 2x2: \n[ \n [[123, 231, 12], [56, 43, 124]], \n [[78, 152, 76], [64, 132, 200]] \n] \nVoici l'image attendue après transformation : \n[ \n [[122, 122, 122], [74, 74, 74]], \n [[102, 102, 102], [132, 132, 132]] \n]",
  },
  {
    number: 21,
    title: ' Carte crédit – 4 derniers chiffres',
    difficulty: 7,
    description:
      "Habituellement, lorsque vous achetez quelque chose, on vous demande votre numéro de carte de crédit, \nvotre numéro de téléphone ou votre réponse à une question secrète. Cependant, comme quelqu'un pourrait \nregarder  par-dessus  votre  épaule,  vous  ne  voulez  pas  que  cela  s'affiche  sur  votre  écran.  Votre  tâche \nconsiste à écrire une fonction maskify, qui modifie tous les caractères en '#' sauf les quatre derniers. \nmaskify('4556364607935616')  '############5616' \nmaskify('1')  '1' \nmaskify('11111')  '#1111'",
  },
  {
    number: 23,
    title: ' Nombres les plus grands et plus petits d’une liste',
    difficulty: 7,
    description:
      'Vous recevez une chaîne de nombres séparés par des espaces et vous devez renvoyer le nombre le plus \ngrand et le plus petit. \nhighAndLow("1 2 3 4 5")  "5 1" \nhighAndLow("1 2 -3 4 5")  "5 -3" \nhighAndLow("1 9 3 4 -5")  "9 -5"',
  },
  {
    number: 25,
    title: ' ADN – Remplacer A par T, C par G et réciproquement',
    difficulty: 7,
    description:
      'L\'acide désoxyribonucléique (ADN) est un produit chimique trouvé dans le noyau des \ncellules et porte les « instructions » pour le développement et le fonctionnement des \norganismes   vivants.   Dans   les codes   ADN,   les   symboles   "A"   et   "T"   sont \ncomplémentaires l’un de l’autre, comme "C" et "G". Ecrire une fonction qui à partir \nd’une chaine ADN donne son complémentaire.  \nDNAStrand ("ATTGC")  "TAACG" \nDNAStrand ("GTAT")  "CATA"',
  },
  {
    number: 27,
    title: ' Couleurs et associations',
    difficulty: 7,
    description:
      'La couleur joue un rôle important dans nos vies. La plupart d\'entre nous aiment une couleur mieux qu’une \nautre. Les spécialistes pensent que certaines couleurs ont des significations psychologiques. \nVous  recevez  en  entrée  un  tableau  composé  d\'une  couleur  et  de  son  association.  La  fonction  que  vous \ndevez écrire doit renvoyer la couleur en tant que « clé » et l\'association comme sa « valeur ». \n  19 \ncolourAssociation([["white", "goodness"], ["blue", "tranquility"]])  \n [{white:"goodness"},{blue:"tranquility"}] \ncolourAssociation([["red", "energy"],["yellow", "creativity"],["brown" , \n"friendly"],["green", "growth"]]) \n [{red: "energy"},{yellow: "creativity"}, {brown: "friendly"},{green: "growth"}]',
  },
  {
    number: 29,
    title: ' Scoutisme',
    difficulty: 7,
    description:
      'Le GA-DE-RY-PO-LU-KI est un codage de substitution utilisé dans le scoutisme pour chiffrer les messages. \nLe cryptage est basé sur une clé courte et facile à retenir. La clé la plus fréquemment utilisée est "GA-DE-\nRY-PO-LU-KI". \nG => A \ng => a \na => g \nA => G \nD => E \netc. \nLes lettres qui ne figurent pas sur la liste restent dans le texte chiffré sans modifications. \nencode("Ala has a cat")  \'Gug hgs g cgt\' \nencode("Ala has a cat")  "Gug hgs g cgt" \ndecode("Gug hgs g cgt")  "Ala has a cat" \nencode("ABCD")  "GBCE" \nencode("gaderypoluki")  "agedyropulik"',
  },
  {
    number: 31,
    title: ' Nouvelle guerre des lettres',
    difficulty: 7,
    description:
      'La guerre continue entre les lettres ! Aidez-nous à déterminer quel groupe est plus puissant. Pour cela, \ncréez une fonction qui accepte 2 paramètres et renvoyez celle qui est plus forte. Chaque lettre a son propre \npouvoir : \nA = 1, B = 2, ... Y = 25, Z = 26 \na = 0,5, b = 1, ... y = 12,5, z = 13 \nSeuls les lettres alphabétiques peuvent participer à une bataille. \nLe mot dont la puissance totale (a + b + c + ...) est la plus grande gagne. \nSi les puissances sont égales, renvoyer « Tie ! » \nExemples \nbattle("One", "Two")  "Two" \nbattle("One", "Neo")  "One" \nbattle("One", "neO")  "Tie!" \nbattle("Foo", "BAR")  "Tie!" \nbattle("Four", "Five")  "Four"',
  },
  {
    number: 33,
    title: ' Divisible par ?',
    difficulty: 7,
    description:
      "Créez une fonction qui vérifie si le premier argument n est divisible par tous les autres arguments. \nIsDivisible (6,1,3)  true // car 6 est divisible par 1 et 3 \n  21 \nIsDivisible (12,2)  true // car 12 est divisible par 2 \nIsDivisible (100,5,4,10,25,20)  true \nIsDivisible (12,7)  false // parce que 12 n'est pas divisible par 7",
  },
  {
    number: 35,
    title: ' Filtrer une liste',
    difficulty: 7,
    description:
      "Créez une fonction qui prend une liste d'entiers ou de chaînes de caractères et renvoie une nouvelle liste \nen ayant filtré uniquement les nombres. \nFilter_list ([1,2, 'a', 'b'])  [1,2] \nFilter_list ([1, 'a', 'b', 0,15])  [1,0,15] \nFilter_list ([1,2, 'aasf', '3', '124', 123])  [1,2,123]",
  },
  {
    number: 37,
    title: ' Moutons perdus',
    difficulty: 7,
    description:
      'Chaque semaine (vendredi et samedi soir), un fermier et son fils comptent les moutons revenus dans la \ncour de leur ferme. Ils comptent les moutons revenus le vendredi soir et ceux qui reviennent le samedi \n(Un mouton qui rentre le vendredi ne repart pas le samedi dans la colline). \nLe fermier connait bien sûr le nombre de moutons qu’il a en tout. \nVotre objectif est de calculer la quantité de moutons perdus (non revenus) après les 2 soirées. \nlostSheep([1,2],[3,4],15)  5 //1+2=3 revenus vendredi, 7 samedi, il en manque 5 \nlostSheep([3,1,2],[4,5],21)  6 \nlostSheep([5,1,4],[5,4],29)  10 \nlostSheep([11,23,3,4,15],[7,14,9,21,15],300)  178 \n  22',
  },
  {
    number: 39,
    title: ' Qu’est-ce qui vient après ?',
    difficulty: 7,
    description:
      "Vous recevrez deux entrées : une chaîne de caractères et une lettre. Renvoyez le caractère alphabétique \naprès chaque instance de la lettre voulue (insensible à la casse). \nS'il y a un nombre, une ponctuation ou un trait de soulignement après la lettre, il ne doit pas être renvoyé. \ncomes_after(\"Pirates say arrrrrrrrr.\",'r')  'arrrrrrrr' \ncomes_after(\"Free coffee for all office workers!\",'F')  'rfeofi' \ncomes_after(\"king kUnta is the sickest rap song ever kNown k!\",'k')  'iUeN' \ncomes_after(\"p8tice makes pottery p0rfect!\",'p')  'o' \ncomes_after(\"d8u d._ rly 2d1s\",'D')  '' \ncomes_after(\"nothing to be found here\",'z')  ''",
  },
  {
    number: 41,
    title: ' « g », la lettre heureuse',
    difficulty: 7,
    description:
      'Nous dirons que "g" est une lettre heureuse dans une chaîne donnée, s\'il y a un autre "g" immédiatement \nà droite ou à gauche de celle-ci. \nPour str = "gg0gg3gg0gg", la sortie doit être true \nPour str = "gog", la sortie doit être false. \n  23 \ngHappy("ggg")  true \ngHappy("gggg")  true \ngHappy("umwho cia q6z onb kbs")  true \ngHappy("ggg ggg g ggg")  false \ngHappy("good grief")  false',
  },
  {
    number: 43,
    title: ' Tatouages',
    difficulty: 7,
    description:
      'Créez un  robot  qui  peut enlever  les  tatouages. Votre  fonction  accepte en argument un tableau  appelé \nskinScan, voici un exemple : \n  \nVotre tâche est donc de créer une fonction qui va effacer les X et les remplacer par *. Toutes les valeurs \nqui ne sont pas X doivent être laissées identiques.',
  },
  {
    number: 45,
    title: ' Taco Bell',
    difficulty: 7,
    description:
      "La chaîne de restauration Taco Bell n’utilise que 8 ingrédients pour toutes ses recettes. Votre tâche \nconsiste, à partir d’une chaine de caractères (sans tenir compte de la casse), à la convertir en une liste \nd’ingrédients avec la règle suivante : \nToutes les voyelles (sauf le 'y') = beef \nt = tomato \nl = lettuce \n  25 \nc = cheese \ng = guacamole \ns = salsa \nDe plus, peu importe les ingrédients, il y aura toujours une coquille (shell) \nVoici quelques exemples : \ntacofy(\"\")  ['shell', 'shell']) \ntacofy(\"a\")  ['shell', 'beef', 'shell'] \ntacofy(\"ggg\")  ['shell', 'guacamole', 'guacamole', 'guacamole', 'shell'] \ntacofy(\"ogl\")  ['shell', 'beef', 'guacamole', 'lettuce', 'shell'] \ntacofy(\"ydjkpwqrzto\")  ['shell', 'tomato', 'beef', 'shell']",
  },
  {
    number: 47,
    title: ' Nombre du milieu',
    difficulty: 7,
    description:
      'On vous donne une liste de 3 nombres, trouvez le rang de celui qui est au milieu des 2 autres. \ngimme([2, 3, 1])  0 \nEn effet, le chiffre 2 (de rang 0) est bien entre 1 et 3 \ngimme([5, 10, 14])  1 \nEn effet, le nombre 10 (de rang 1) est bien entre 5 et 14',
  },
  {
    number: 49,
    title: ' Écran de mobile',
    difficulty: 7,
    description:
      'Vous souvenez-vous des anciens claviers des mobiles ? Vous souvenez-vous également de l\'inconvénient \npour écrire ? Eh bien, ici, vous devez calculer le nombre de touches que vous devez taper pour écrire un \nmot spécifique. Voici la disposition : \nExemples \nmobileKeyboard("123")  3 (1+1+1) \nmobileKeyboard("abc")  9 (2+3+4) // Taper 2 fois pour obtenir « a » \nmobileKeyboard("codewars")  26 (4+4+2+3+2+2+4+5) // 4 fois pour le « c » \nNe pas oublier les touches spéciales * et #.',
  },
  {
    number: 51,
    title: ' Distribution d’or',
    difficulty: 7,
    description:
      "Sur le terrain, deux chercheurs d’or A et B ont trouvé de l'or en même temps. Ils ont décidé d'utiliser des \nrègles simples pour la distribution : \nIls divisent l'or en n piles qu’ils mettent en ligne. \nLa quantité de chaque pile et l'ordre des piles sont aléatoires. \nIls comparent la quantité d’or sur la pile à l’extrême gauche avec celle à l’extrême droite. \nIls choisissent toujours la plus grande pile. C'est-à-dire que si par exemple la gauche est 1 et la droite est \n2, ils prendront 2. \nSi les deux côtés sont égaux, ils prennent la pile de gauche. \nÉtant donné un nombre entier de piles, et supposons que A prend toujours en premier, calculez le montant \nfinal obtenu par chacun. Ce sera un tableau à deux éléments [montant pour A, montant pour B]. \n  27 \nExemple \nPour la distribution golds= [4,2,9,5,2,7], la sortie devrait être [14, 15]. En effet : \nLe tas de plus à gauche est 4, le tas le plus à droite est 7, A choisi le plus grand  7  \nMaintenant, le tas de plus à gauche est 4, le tas les plus à droite est 2, B choisit le plus grand  4 \nMaintenant, le tas de plus à gauche est 2, le tas les plus à droite est 2, A choisi le plus grand  2 (7+2=9) \nMaintenant, le tas de plus à gauche est 9, le tas les plus à droite est 2, B choisit le plus grand  9 (4+9=13) \nMaintenant, le tas de plus à gauche est 5, le tas les plus à droite est 2, A choisi le plus grand  5 (9+5=14) \nIl reste 2 qui va pour B  2+13=15 \nDeux autres exemples \ndistributionOf([4,7,2,9,5,2]) [11,18] \ndistributionOf([10,1000,2,1])  [12,1001]",
  },
  {
    number: 53,
    title: ' Shushis',
    difficulty: 7,
    description:
      "Sam  a  ouvert  un  nouveau  restaurant  à  sushis.  Il utilise une technologie  de  reconnaissance  visuelle  qui \npermet d'enregistrer le nombre et la couleur des assiettes de sushis prises par un client. Par exemple, si \nun client a mangé 3 assiettes rouges, l'ordinateur renverra la chaîne 'rrr'. \nActuellement, Sam ne sert que des sushis sur des assiettes rouges ou transparentes pour les condiments \ntels que le gingembre et le wasabi - l'ordinateur les note comme un espace ('rrr r' désigne 4 assiettes de \nsushis et une assiette de condiments). \nSam  souhaiterait  votre  aide pour calculer  le montant  total  qu'un  client  doit  payer  lorsqu'il  demande  la \nfacture. Le calcul est le suivant : \nPlaques rouges de sushi ('r') : 2 $ chacune, mais si un client mange 5 assiettes, la 5ème est gratuite. \nCondiments (' ') : gratuit. \ntotalBill('rr')  4 \ntotalBill('rr rrr')  8 \ntotalBill('rr rrr rrr rr')  16 \ntotalBill('rrrrrrrrrrrrrrrrrr   rr r')  34 \ntotalBill('')  0 \n  28",
  },
  {
    number: 55,
    title: ' Ordre des mots',
    difficulty: 6,
    description:
      'Votre tâche consiste à trier une chaîne donnée. Chaque mot de la chaîne contiendra un seul numéro. Ce \nnuméro est la position que le mot devra avoir dans le résultat final. \nRemarque : Les nombres peuvent être entre 1 à 9. Donc, 1 sera le premier mot (pas 0). \nSi la chaîne d\'entrée est vide, renvoyez une chaîne vide. Les mots dans la chaîne d\'entrée ne contiennent \nque des nombres consécutifs valides. \norder("is2 Thi1s T4est 3a")  "Thi1s is2 3a T4est" \norder("4of Fo1r pe6ople g3ood th5e the2"  "Fo1r the2 g3ood 4of th5e pe6ople" \norder("")  ""',
  },
  {
    number: 57,
    title: ' Distribution d’électrons',
    difficulty: 6,
    description:
      "Vous savez que l'idée fondamentale de la distribution d'électrons est qu’ils doivent remplir des couches \njusqu'à ce qu'elles contiennent le nombre maximum d'électrons. \nRègles : \nLe nombre maximum d'électrons dans une couche est de 2n² (n étant le niveau de la couche). \nPar exemple, le nombre maximum d'électrons dans la 3\ne\n couche est 2 * 3² = 18. \n  29 \nLes électrons doivent d'abord remplir la couche de niveau le plus bas. \nSi les électrons ont complètement rempli un niveau, les autres électrons inoccupés combleront le niveau \nsupérieur et ainsi de suite. \natomicNumber (1)  [1] \natomicNumber (10)  [2, 8] \natomicNumber (11)  [2, 8, 1] \natomicNumber (47)  [2, 8, 18, 19]",
  },
  {
    number: 59,
    title: ' Touches d’un piano',
    difficulty: 6,
    description:
      'Voici les 88 touches d’un piano : \nLa touche n°1 complètement à gauche est blanche, la 2\ne\n noire, la 3\ne\n et 4\ne\n blanches, la 5\ne\n noire etc. \nLa touche n°88 complètement à droite est blanche et la 89\ne\n sera pour nous à nouveau la touche n°1. \nVous jouez en tapant successivement sur les touches 1 puis 2 puis 3 etc. \nCompte  tenu  du  numéro  sur  lequel  vous  vous êtes  arrêté,  serez-vous  sur  une  touche  noire  ou  sur  une \ntouche blanche ? Si vous vous êtes arrêté à 92, vous êtes allé au bout des touches 1 à 88, puis vous avez \ncontinuez sur la n°1, de sorte que vous serez sur la quatrième touche qui est blanche. \nVotre fonction recevra un nombre entier quelconque et devra renvoyer la chaîne black ou white .  \nblack_or_white_key(1) "white" \nblack_or_white_key(12) "black" \nblack_or_white_key(42) "white" \nblack_or_white_key(100) "black" \nblack_or_white_key(2017) "white" \nReprendre le programme précédent en donnant cette fois le nom de la touche : \n"A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#" \nwhich_note(1) "A" \nwhich_note(12) "G#" \nwhich_note(42) "D" \nwhich_note(100) "G#" \nwhich_note(2017) "F" \n  30',
  },
  {
    number: 61,
    title: ' Mots consécutifs',
    difficulty: 6,
    description:
      'Vous recevez un tableau de chaînes de caractères et un nombre entier k. Votre tâche consiste à renvoyer \nla première chaîne la plus longue composée de k chaînes consécutives prises dans le tableau. Exemple :  \nlongest_consec(["zone","abigail","theta","forme","libe","zas","theta","abigail"], 2)  \n"abigailtheta" \nSoit n est la taille du tableau, si n = 0 ou k> n ou k <= 0 vous devez renvoyer "".',
  },
  {
    number: 63,
    title: ' Notation Polonaise Inverse',
    difficulty: 6,
    description:
      'RPN : https://fr.wikipedia.org/wiki/Notation_polonaise_inverse \nCalculatrice HP 35S en mode RPN \nL’expression « 3 × (4 + 7) » peut s\'écrire en Notation Polonaise Inverse (NPI ou RPN) sous la forme  \n« 4 {Ent} 7 + 3 × » ({Ent} pour la touche Entrée). Les données en entrée seront séparées par des espaces. \nsolvePostfix("2 3 +")  5 // 2+3=5 \nsolvePostfix("2 8 -")  -6 // 2-8=-6 \nsolvePostfix("4 2 /")  2 // 4/2=2 \nsolvePostfix("10 5 / 7 + 3 ^ 10 -")  719 // (10/5 + 7)^3-10=719 \nsolvePostfix("8 3 4 ^ +")  89 // 8+3^4=89 \n  31',
  },
  {
    number: 65,
    title: ' Parité',
    difficulty: 6,
    description:
      'Trouvez, parmi une liste de nombre, le seul qui n’a pas la même parité. \niqTest("2 4 7 8 10")  3 // Le 3\ne\n est impair, les autres sont pairs \niqTest("1 2 1 1")  2 // Le 2\ne\n est pair, les autres sont impairs',
  },
  {
    number: 67,
    title: ' 10 minutes de promenade',
    difficulty: 6,
    description:
      "Vous habitez dans une ville où tous les blocs de maisons sont disposées dans une grille parfaite. Vous êtes \narrivé dix minutes trop tôt pour un rendez-vous, alors vous avez décidé de profiter de l'occasion pour faire \nune courte promenade. La ville fournit à ses citoyens une application sur leurs téléphones - chaque fois \nque vous appuyez sur le bouton, il vous envoie un ensemble de directions (par exemple ['n', 's', 'w' 'e']). \nVous savez que cela vous prend une minute pour traverser un bloc de la ville, alors on vous demande de \ncréer une fonction qui retournera true si la marche que vous propose l'application vous prendra exactement \ndix minutes et, bien sûr, vous ramène à votre point de départ. Retournez false sinon. \nisValidWalk(['n','s','n','s','n','s','n','s','n','s'])  true \nisValidWalk(['w','e','w','e','w','e','w','e','w','e','w','e'])  false \nisValidWalk(['w'])  false // Ne dure pas 10’ et pas de retour \nisValidWalk(['n','n','n','s','n','s','n','s','n','s'])  false // Pas de retour",
  },
  {
    number: 69,
    title: ' Trier mes animaux',
    difficulty: 6,
    description:
      'Considérons la classe suivante : \nVar Animal = { \n   Nom: "Chat", \n   NumberOfLegs: 4 \n} \n  33 \nÉcrivez  une  fonction  qui  accepte  une  liste  d\'objets  de  type Animal et  renvoie  une  nouvelle  liste.  Cette \nnouvelle liste devra classer les animaux par nombre de jambes puis par ordre alphabétique du nom. \nSi null est passé, la fonction doit renvoyer null. De même, si la liste est vide, la fonction doit renvoyer \nune liste vide. \nsortAnimal([{ name: "Cat", numberOfLegs: 4 }, { name: "Snake", numberOfLegs: 0 },  \n{ name: "Dog", numberOfLegs: 4 }, { name: "Pig", numberOfLegs: 4 }, \n{ name: "Human", numberOfLegs: 2 }, { name: "Bird", numberOfLegs: 2 }]) \n [{ name: \'Snake\', numberOfLegs: 0 }, { name: \'Bird\', numberOfLegs: 2 }, { name: \n\'Human\', numberOfLegs: 2 }, { name: \'Cat\', numberOfLegs: 4 }, { name: \'Dog\', \nnumberOfLegs: 4 }, { name: \'Pig\', numberOfLegs: 4 }]',
  },
  {
    number: 71,
    title: ' Somme gauche = Somme droite',
    difficulty: 6,
    description:
      "Vous avez une liste d'entiers en entrée. Votre travail est de prendre ce tableau et de trouver un indice N \noù la somme des nombres entiers à gauche de N est égale à la somme des entiers à droite de N. S'il n'y a \npas d'index qui fonctionne, retournez -1. \nDisons qu'on vous donne le tableau {1,2,3,4,3,2,1} : \nVotre fonction renverra l'indice 3, car à la 3ème position du tableau, la somme du côté gauche de l'index \n({1,2,3}) et la somme du côté droit de l'index ({3,2, 1}) sont tous deux égaux à 6. \nRegardons un autre exemple : Vous recevez le tableau {1,100,50, -51,1,1} : \nVotre fonction renverra l'indice 1, car à la position 1 du tableau, la somme du côté gauche de l'index ({1}) \net la somme du côté droit de l'index ({50, -51,1,1}) sont toutes les 2 égales à 1. \nfindEvenIndex([1,2,3,4,3,2,1])  3 \n  34 \nfindEvenIndex([1,100,50,-51,1,1])  1 \nfindEvenIndex([1,2,3,4,5,6])  -1 \nfindEvenIndex([20,10,30,10,10,15,35])  3",
  },
  {
    number: 73,
    title: ' Nombres narcissiques',
    difficulty: 6,
    description:
      'Un nombre narcissique est un nombre qui est la somme de ses propres chiffres, chacun élevé à la puissance \ndu nombre de chiffres. \nPar exemple, 153 (3 chiffres) :    1\n3\n + 5\n3\n + 3\n3\n = 1 + 125 + 27 = 153 \nEt 1634 (4 chiffres) :    1\n4\n + 6\n4\n + 3\n4\n + 4\n4\n = 1 + 1296 + 81 + 256 = 1634 \nVotre code doit retourner true ou false selon que le nombre donné est narcissique ou non. \nnarcissistic(153)  true',
  },
  {
    number: 75,
    title: ' Décodage Morse',
    difficulty: 6,
    description:
      "Vous  devez  écrire  un  décodeur  simple  de  code  Morse.  Le  code  Morse  code  pour  chaque  lettre  est  une \nséquence de \"points\" et \"tirets\". Par exemple, la lettre A \nest codée comme · -, la lettre Q est codée comme - · -, \net le chiffre 1 est codé comme · ---. Le code Morse est \ninsensible à la casse, traditionnellement, les majuscules \nsont utilisées. Lorsque le message est écrit en code Morse, un seul espace est utilisé pour séparer les codes \nde caractères et 3 espaces sont utilisés pour séparer les mots. Par exemple, le message HEY JUDE dans le \ncode Morse est ···· · - · - · --- ·· - - ·· ·. \nREMARQUE  :  les  espaces  supplémentaires  avant  ou  après  le  code  n'ont  aucun  intérêt  et  doivent  être \nignorés. \nEn plus des lettres, des chiffres et de la ponctuation, il existe des codes de service spéciaux, dont le plus \ncélèbre est le signal de détresse international SOS, qui est codé ··· --- ···. Ces codes spéciaux sont traités \ncomme des caractères spéciaux uniques et sont généralement transmis sous forme de mots distincts. \nVotre tâche consiste à implémenter une fonction decodeMorse, qui prend le code morse en tant qu'entrée \net renvoi une chaîne décodée lisible par l'homme. \nDecodeMorse ('.... ..-.-- .--- ..- - ...')  \"HEY JUDE\" \nLa table des codes Morse est préchargée en tant que dictionnaire, n'hésitez pas à l'utiliser.  \nMORSE_CODE = { '-.-.--': '!', '.-..-.': '\"',  '...-..-': '$', '.-...': '&', '.----.': \n'', '-.--.': '(', '-.--.-': ')', '.-.-.': '+', '--..--': ',', '-....-': '-', '.-.-.-': \n'.', '-..-.': '/', '-----': '0', '.----': '1', '..---': '2', '...--': '3', '....-': '4', \n  '.....': '5', '-....': '6', '--...': '7', '---..': '8', '----.': '9', '---...': ':', \n'-.-.-.': ';', '-...-': '=', '..--..': '?', '.--.-.': '@', '.-': 'A', '-...': 'B', '-.-\n.': 'C', '-..': 'D', '.': 'E', '..-.': 'F', '--.': 'G', '....': 'H', '..': 'I', '.---': \n'J', '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': \n'Q', '.-.': 'R', '...': 'S', '-': 'T', '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', \n'-.--': 'Y', '--..': 'Z', '..--.-': '_', '...---...': 'SOS' } \nMORSE_CODE['.']  \"E\"",
  },
  {
    number: 77,
    title: ' Discours politique',
    difficulty: 6,
    description:
      'Vous devez créer une fonction pour détecter si un discours politique est bien de votre président ou non. \nNous savons que les discours du président ont  beaucoup de voyelles supplémentaires. \n  36 \nL’idée est de calculer le nombre de voyelles répétées plus d\'une fois de suite divisé par le nombre total de \nvoyelles du discours. Plus ce nombre sera élevé, plus il sera probable que le discours soit bien du président.  \nExemples \ntrumpDetector("I will build a huge wall")  0 // pas de voyelle répétée \ntrumpDetector("HUUUUUGEEEE WAAAAAALL")  4 // 4 U en trop + 3E +5A = 12 / 3 voyelles \ntrumpDetector("MEXICAAAAAAAANS GOOOO HOOOMEEEE")  2.5 // 7A+3O+2O+3E=15 / 6 voyelles \ntrumpDetector("America NUUUUUKEEEE Oooobaaaamaaaaa")  1.89 \ntrumpDetector("listen migrants: IIII KIIIDD YOOOUUU NOOOOOOTTT")  1.56',
  },
  {
    number: 79,
    title: ' Cryptage et décryptage d’une chaîne',
    difficulty: 6,
    description:
      'Partie cryptage : A partir d’une chaîne, prenez un caractère sur deux, les concaténer puis concaténer tous \nles autres. Répétez cela le nombre de fois précisé en paramètre. \nencrypt("This is a test!", 0)  "This is a test!" \nencrypt("This is a test!", 1)  "hsi  etTi sats!" \nencrypt("This is a test!", 2)  "s eT ashi tist!" \nPartie décryptage : A partir d’une chaîne codée n fois, retrouvez le texte d’origine. \ndecrypt(" Tah itse sits!", 3)  "This is a test!" \ndecrypt("hskt svr neetn!Ti aai eyitrsig", 1)  "This kata is very interesting!"',
  },
  {
    number: 81,
    title: ' File d’attente cinéma',
    difficulty: 6,
    description:
      'Le nouveau film "Avengers" vient de sortir ! Il y a beaucoup de \ngens qui attendent en file à l’entrée du cinéma. Chacun d\'eux a \nun unique billet de 100, 50 ou 25 dollars. Un billet "Avengers" \ncoûte 25 dollars. \nVous travaillez actuellement comme commis et voulez vendre un \nbillet à chaque personne dans cette ligne. \nPouvez-vous  le  faire  et  donner  le change  si  vous  n\'avez \ninitialement  pas  d\'argent  et  en  vendant  les  tickets  strictement \ndans l\'ordre que les gens suivent dans la file ? \nRetourner YES, si vous pouvez vendre un billet à chaque personne et donner le change. Sinon, renvoyez \nNO. \ntickets([25, 25, 50, 50])  "YES" // Vous récupérez 25+25 $, rendez 25$ et encore 25$ \ntickets([25, 100])  "NO" // Vous récupérez 25$ mais impossible de rembourser le n°2',
  },
  {
    number: 83,
    title: ' Diversité des langages',
    difficulty: 6,
    description:
      "Trois langages de programmation sont représentés : Python, Ruby et JavaScript. Renvoyez true si dans la \nliste des programmeurs, aucun langage n’est représenté plus de 2 fois par rapport à un autre et false \nsinon. Par exemple, s’il y a 6 programmeurs Python et 2 en Ruby, Python est 3 fois plus représenté que \nRuby et on renverra donc false. Autre exemple : \nvar list = [ \n  { firstName: 'Daniel', lastName: 'J.', country: 'Aruba', continent: 'Americas', age: \n42, language: 'Python' }, \n  38 \n  { firstName: 'Kseniya', lastName: 'T.', country: 'Belarus', continent: 'Europe', age: \n22, language: 'Ruby' }, \n  { firstName: 'Jayden', lastName: 'P.', country: 'Jamaica', continent: 'Americas', age: \n18, language: 'JavaScript' }, \n  { firstName: 'Joao', lastName: 'D.', country: 'Portugal', continent: 'Europe', age: \n25, language: 'JavaScript' } \n]; \nisLanguageDiverse(list)  true",
  },
  {
    number: 85,
    title: ' Superposition d’intervalles',
    difficulty: 6,
    description:
      'On vous donne les extrémités (début et fin) d’intervalles fermés et on vous demande combien vont se \nsuperposer. \nstart = [8, 4, 6, 1] et end = [10, 9, 7, 2]  2 \nIl y a en effet 2 intervalles qui se superposent : [4, 9] avec [6, 7] et [4, 9] avec [8,10]. \n1 2 3 4 5 6 7 8 9 10 \nstart = [1, 2] et end = [3, 4]  1 \nstart = [1, 2] et end = [2, 4]  1',
  },
  {
    number: 87,
    title: ' Liste de courses',
    difficulty: 6,
    description:
      'Calculez le coût d\'une liste d\'achats à l’aide d’une fonction. Cette dernière prend en arguments une liste \nde listes, par exemple: \nshoppingListCost([["Orange Juice", 2],["Chocolate", 4],["Pears", 8]]) \nLe liste d’achats comprend dans chaque sous-liste le nom et la quantité de chaque élément acheté, par \nexemple ici 2 jus d’oranges, 4 chocolats, 8 poires.  \nA cela s’ajoute une variable globale épicerie (groceries) dont voici le contenu fixe : \nvar groceries={ \'Orange Juice\': { price: 1.5, discount: 10, bogof: false }, \n  39 \n  Chocolate: { price: 2, discount: 0, bogof: true }, \n  Sweetcorn: { price: 4, discount: 20, bogof: true }, \n  Apples: { price: 6, discount: 0, bogof: false }, \n  Pears: { price: 2, discount: 50, bogof: false } } \nCet objet contient le prix de l\'article, la réduction actuellement appliquée et précise s’il est en  «1 acheté \n– 1 gratuit» (bogof : buy one get one free). \nRetournez le coût de la liste de courses avec 2 décimales. Si la liste d\'entrée ne contient aucun élément, \nrenvoyez zéro.  \nVous pouvez supposer que toutes les listes sont valides et contiennent des éléments inclus dans l\'épicerie. \nChaque élément n\'apparaîtra qu\'une seule fois. \nshoppingListCost([["Chocolate", 3],["Apples", 8],["Orange Juice", 15],["Pears",1]])  \n 73.25 // Choco= 2 (1 gratuit)*2 + Apples= 8*6 + Orange= 15*1.5*0.9 + Pears= 1*2*0.5 \nshoppingListCost([["Sweetcorn", 12],["Pears", 6],["Apples", 5]])  55.2 \nshoppingListCost([["Pears", 4],["Chocolate", 87],["Sweetcorn", 3]])  98.4 \nshoppingListCost([["Orange Juice", 100]])  135',
  },
  {
    number: 89,
    title: ' Lettre manquante',
    difficulty: 6,
    description:
      "Écrivez une fonction qui prend une série de lettres consécutives (en augmentation) comme entrée et qui \nrenvoie la lettre manquante en sortie. \nOn suppose que l’on a toujours un tableau valide en entrée et exactement une lettre manquante. La \nlongueur du tableau sera d'au moins 2. \nfindMissingLetter(['a','b','c','d','f'])  'e' \nfindMissingLetter(['O','Q','R','S'])  'P'",
  },
  {
    number: 91,
    title: ' Tribonnacci',
    difficulty: 6,
    description:
      "Comme le nom l'indique déjà, cela fonctionne essentiellement comme les nombres de Fibonacci, mais en \nadditionnant les 3 derniers (au lieu de 2) nombres de la suite pour générer le prochain.  \n  40 \nDonc,  si  nous  commençons  notre séquence  Tribonacci  avec  [1,1,1]  (signature),  nous  aurons  cette \nséquence : [1,1,1,3,5,9,17,31, ...] \nMais que se passe-t-il si nous commençons avec [0,0,1] comme signature ? [0,0,1,1,2,4,7,13,24, ...] \nVous  devez  créer  une  fonction tribonacci qui,  à  partir d’un tableau et d’une signature, renvoie les n \npremiers éléments (signature incluse) de la séquence. \nLa signature contiendra toujours 3 numéros ; n sera toujours un nombre positif ; Si n == 0, renvoyez un \ntableau vide. \ntribonacci([1,1,1],10)  [1,1,1,3,5,9,17,31,57,105] \ntribonacci([0,0,1],10)  [0,0,1,1,2,4,7,13,24,44] \ntribonacci([0,1,1],10)  [0,1,1,2,4,7,13,24,44,81] \ntribonacci([1,0,0],10)  [1,0,0,1,1,2,4,7,13,24]",
  },
  {
    number: 93,
    title: ' Répétition de lettres',
    difficulty: 6,
    description:
      'Ecrire une fonction qui compte le nombre de lettres ou chiffres distincts qui apparaissent plus d’une fois \ndans  une  chaîne de caractères. Le paramètre d’entrée contient seulement des lettres (majuscules et \nminuscules) ou des chiffres. \nExemples : \n"abcde"  0 # pas de caractères multiples \n"aabbcde"  2 # \'a\' et \'b\' \n"aabBcde"  2 # \'a\' et \'b\'  \n"aA11" -> 2 # \'a\' et \'1\' \nduplicateCount("")  0 \nduplicateCount("abcde")  0 \nduplicateCount("aabbcde")  2',
  },
  {
    number: 95,
    title: ' Lièvre et tortue',
    difficulty: 6,
    description:
      "Deux tortues appelées A et  B doivent faire une course. A commence avec une vitesse moyenne de 720 \npieds par heure. B sait qu'elle court plus vite et de plus il n'a pas fini son chou. \nQuand B commence, elle peut voir que A a une avance de 70 pieds, mais la vitesse B est de 850 pieds par \nheure. Combien de temps prendra-t-il B pour attraper A ? \nPlus généralement : deux vitesses v1 (vitesse de A, nombre entier> 0) et v2 (vitesse de B, nombre entier> \n0) et un écart g (nombre entier> 0) combien de temps prend-t-il B pour attraper A ? \nLe résultat sera un tableau [h, mn, s] où h, mn, s est le temps nécessaire en heures, minutes et secondes \nSi v1> = v2, renvoyez null.",
  },
  {
    number: 98,
    title: ' Couleurs HTML vers RGB',
    difficulty: 6,
    description:
      "Une chaîne de saisie représente l'une des options suivantes : \nHexadécimal à 6 chiffres : \"#RRGGBB\" comme \"# 012345\", \"# 789abc\", \"# FFA077\" \nChaque paire de chiffres représente une valeur du canal en hexadécimal: 00 à FF \nHexadécimal à 3 chiffres : \"#RGB\" comme \"# 012\", \"#aaa\", \"# F5A\" \nChaque chiffre représente une valeur de 0 à F qui se traduit 2 chiffres: 0  00, 1  11, etc. \nNom de couleur prédéfini, par exemple. \"Red\", \"Blue\", \"turquoise\" (utilisez PRESET_COLORS).  \nPRESET_COLORS= \n{aliceblue:'#f0f8ff',black:'#000000',blanchedalmond:'#ffebcd',blue:'#0000ff',blueviolet:\n'#8a2be2',brown:'#a52a2a',burlywood:'#deb887',cadetblue:'#5f9ea0',chartreuse:'#7fff00',c\nhocolate:'#d2691e',coral:'#ff7f50',cornflowerblue:'#6495ed',cornsilk:'#fff8dc',crimson:'\n#dc143c',cyan:'#00ffff',darkblue:'#00008b',gold:'#ffd700',goldenrod:'#daa520',gray:'#808\n080',grey:'#808080',green:'#008000',greenyellow:'#adff2f',honeydew:'#f0fff0',linen:'#faf\n0e6',magenta:'#ff00ff',maroon:'#800000',navy:'#000080',oldlace:'#fdf5e6',olive:'#808000'\n,olivedrab:'#6b8e23',orange:'#ffa500',orangered:'#ff4500',orchid:'#da70d6',red:'#ff0000'\n,rosybrown:'#bc8f8f',royalblue:'#4169e1',sandybrown:'#f4a460',seagreen:'#2e8b57',seashel\nl:'#fff5ee',sienna:'#a0522d',silver:'#c0c0c0',skyblue:'#87ceeb',slateblue:'#6a5acd',toma\nto:'#ff6347',turquoise:'#40e0d0',violet:'#ee82ee',wheat:'#f5deb3',white:'#ffffff',whites\nmoke:'#f5f5f5',yellow:'#ffff00',yellowgreen:'#9acd32'} \nParseHTMLColor ('# 80FFA0')  {r: 128, g: 255, b: 160} \nParseHTMLColor ('# 3B7')  {r: 51, g: 187, b: 119} \nParseHTMLColor ('LimeGreen')  {r: 50, g: 205, b: 50}",
  },
  {
    number: 100,
    title: ' Somme de nombres',
    difficulty: 6,
    description:
      "A partir d'un tableau a d'entiers, construisez un tableau b de la même taille tel que \nb [0] = a [0] + a [1] + ... + a [n - 2] + a [n - 1] \nb [1] = a [1] + ... + a [n - 2] + a [n - 1] \n... \nb [n - 2] = a [n - 2] + a [n - 1] \nb [n - 1] = a [n - 1] \nOù n est la longueur de a. \nsuffixSums ([1, 2, 3])  [6, 5, 3] \nsuffixSums ([1, 2, 3, -6])  [0, -1, -3, -6] \nsuffixSums ([0, 0, 0])  [0, 0, 0] \nsuffixSums ([1, 123, 23])  [147, 146, 23]",
  },
  {
    number: 102,
    title: ' Codes secrets par mobile',
    difficulty: 6,
    description:
      'Pour verrouiller et déverrouiller les pièces de sa maison ainsi que les différents \nappareils électroniques, monsieur Safety utilise son téléphone en tapant un \ncode spécifique. Voici quelques-uns de ses codes secrets : \nunlock("Nokia")  66542 \nunlock("Voiture")  8648873 \nunlock("Porte")  76783 \nUne fois que vous aurez compris le principe, piratez son système en créant \nune fonction qui trouvera les bons mots de passe pour chaque objet ou pièce. \n  44',
  },
  {
    number: 104,
    title: ' Aire d’un triangle',
    difficulty: 6,
    description:
      "Les objets Point ont des attributs x et y. Les objets Triangle ont les attributs a, b, c décrivant leurs coins, \nchacun d'eux étant un point. \nÉcrivez une fonction qui calcule l’aire d’un triangle donné (avec 6 décimales). \ntriangleArea(new Triangle(new Point(10, 10), new Point(40, 10), new Point(10, 50)))  600 \ntriangleArea(new Triangle(new Point(15, -10), new Point(40, 20), new Point(20, 50)))  675",
  },
  {
    number: 106,
    title: ' Parcours d’un labyrinthe',
    difficulty: 6,
    description:
      'Vous avez le plan 2D d’un labyrinthe et un ensemble de directions. Votre tâche est de suivre les instructions \ndonnées. Si vous atteignez le point final avant que tous vos mouvements ne se soient écoulés, vous devez \nretourner Finish. Si vous tapez dans les murs ou dépassez le bord du labyrinthe, vous devez retourner \nDead. Si vous vous trouvez encore dans le labyrinthe après avoir fait tous les mouvements, vous devez \nretourner Lost. Le labyrinthe maze ressemble à :  \n  45 \nmaze = [[1,1,1,1,1,1,1], \n        [1,0,0,0,0,0,3], \n        [1,0,1,0,1,0,1], \n        [0,0,1,0,0,0,1], \n        [1,0,1,0,1,0,1], \n        [1,0,0,0,0,0,1], \n        [1,2,1,0,1,0,1]] \n0 = Chemin \n1 = Mur \n2 = Départ \n3 = Arrivée \nExemples : \nmazeRunner(maze,["N","N","N","N","N","E","E","E","E","E"])  "Finish" \nmazeRunner(maze,["N","N","N","N","N","E","E","S","S","E","E","N","N","E"])  "Finish" \nmazeRunner(maze,["N","N","N","W","W"]) "Dead" \nmazeRunner(maze,["N","E","E","E","E"])  "Lost"',
  },
  {
    number: 108,
    title: ' Faux sites web',
    difficulty: 6,
    description:
      'John veut créer un site Web et donc lui donner un nom. L\'idée de John est de trouver un site célèbre puis \nmodifiez un caractère. \nVous devez coder la fonction goodName, qui accepte un nom en paramètre, c\'est le nom du site célèbre \nen suivant les règles suivantes : \n1) Si le nom du site Web contient "o", remplacez-le en "0" comme ça \ncodewars.com  c0dewars.com \n2) Si le nom du site Web contient "l", remplacez-le en "1" comme ça : \nleetcode.com  1eetcode.com \n3) Si le nom du site possède une sous-chaîne de deux caractères consécutifs identiques, l\'un d\'entre eux \nsera supprimé comme ça : \nleetcode.com  letcode.com \nfacebook.com  facebok.com \nfighter2000.com  fighter200.com \n4) Le nom de domaine de niveau supérieur ne doit pas être modifié, tel que .com .net .org etc. \n  46 \n5) John veut voir toutes les possibilités. \n6) Le tableau renvoyé doit être trié (en ordre Unicode). Si le nom du site ne peut pas changer de caractère, \nrenvoyez un tableau vide. \ngoodName("codewars.com")  ["c0dewars.com"] \ngoodName("microsoft.com")  ["micr0soft.com","micros0ft.com"] \ngoodName("leetcode.com")  ["1eetcode.com","leetc0de.com","letcode.com"] \ngoodName("goodlink.com")  ["g0odlink.com","go0dlink.com","godlink.com","good1ink.com"] \ngoodName("fighter2000.com")  ["fighter200.com"] \ngoodName("pex4fun.com")  [] \ngoodName("xqoomjlieggggg.cn")  \'["xq0omjlieggggg.cn", "xqo0mjlieggggg.cn", \n"xqomjlieggggg.cn", "xqoomj1ieggggg.cn", "xqoomjliegggg.cn"]',
  },
  {
    number: 110,
    title: ' Cellules cancéreuses',
    difficulty: 6,
    description:
      "Votre tâche est d'écrire une fonction qui coupe des cellules cancéreuses du corps. \nLes cellules cancéreuses sont divisées en deux types : \n• Étape avancée, écrite avec la lettre C en majuscule \n• Étape initiale, écrite avec la lettre c en minuscule \nLe reste des cellules est divisée comme suit : \n• Cellule normale, écrite avec une lettre minuscule \n• Cellule importante, écrite avec une lettre majuscule \nConditions : \n• Les cellules importantes ne doivent pas être ôtées. \n• Les  cellules  cancéreuses  en  état  avancé  doivent  être  découpées  avec  des  cellules  adjacentes  si \ncelles-ci peuvent être ôtées \n. \nEn entrée vous avez une chaîne (représentant un corps), supprimez les caractères \"cancéreux\" (selon les \nrègles décrites) et renvoyez le corps guéri. \ncutCancerCells('acb')  'ab' \ncutCancerCells('aCb')  '' \ncutCancerCells('acCb')  'a' \n  47 \ncutCancerCells('acCcb')  'ab' \ncutCancerCells('ab')  'ab' \ncutCancerCells('aCZ')  'Z' \ncutCancerCells('BCE')  'BE' \ncutCancerCells('sjCmwOqC')  'swO'",
  },
  {
    number: 112,
    title: ' Types de données',
    difficulty: 6,
    description:
      "Vous recevez une chaîne de chiffres, de lettres et/ou d'espaces. \nLa fonction dataTypes doit  renvoyer un  tableau contenant trois  types  de  données  JavaScript  suivants: \nstring, number, boolean. Chaque ensemble de caractères qui ne contient pas de nombres ou d'espaces \ndoit être considéré comme une seule chaîne. Les exceptions sont les valeurs true et false qui doivent être \névaluées en \"boolean\". Exemples: \ndataTypes(\"You are number 1\")  ['string', 'string', 'string', 'number'] \ndataTypes(\"Youarenumber1\")  ['string', 'number'] \ndataTypes(\"123gjet\")  ['number', 'string'] \ndataTypes(\"truestring1\")  ['boolean', 'string', 'number'] \ndataTypes(\"FalsetruefalseABCDEFGHIJKLMNOPQabcdefghijklmnwxyz0123456789false\")  \n['boolean', 'boolean', 'boolean', 'string', 'number', 'boolean'] \n  48",
  },
  {
    number: 114,
    title: ' Langage Tick',
    difficulty: 6,
    description:
      "Tick est un langage de programmation exotique créé en 2017. Il a seulement 4 commandes et une bande \nde mémoire infinie. Il est également fait pour ignorer les autres caractères sans commandement. \nCommandes \n> : Déplacez le sélecteur vers la cellule suivante du ruban \n< : Déplacer le sélecteur vers la cellule précédente du ruban \n+ : Augmenter la cellule mémoire de 1. Tronquer de sorte que 255 + 1 = 0 \n* : Ajoutez la valeur Ascii de la cellule de mémoire au flux de sortie \nExemple de programme : \ninterpreter('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*>++++++++++++++++++++++++\n+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*>++++++++++++++++++++++++++++++++\n++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++**>++++++++++++++++++++++++++++++++\n+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*>++++++++++++++++++++++++++++++\n++*>+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n++++++++++++*<<*>>>++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n++++++++++++++++++++++*<<<<*>>>>>++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n++++++++++++++++++++++*>+++++++++++++++++++++++++++++++++*') \n Hello World !",
  },
  {
    number: 118,
    title: ' Heures à partir de secondes',
    difficulty: 5,
    description:
      "Écrivez une fonction, qui prend un entier positif (secondes) en entrée et renvoie l'heure dans un format \nlisible par l'homme (HH:MM:SS) \nLe temps maximum n'excède jamais 359999 (99:59:59) \nhumanReadable(0)  '00:00:00' \nhumanReadable(5)  '00:00:05' \nhumanReadable(60)  '00:01:00' \nhumanReadable(86399)  '23:59:59' \nhumanReadable(359999)  '99:59:59'",
  },
  {
    number: 120,
    title: ' Pig Latin',
    difficulty: 5,
    description:
      "Déplacez la première lettre de chaque mot à la fin de celle-ci, puis ajoute «ay» à la fin du mot. \n'Pig latin is cool'  igPay atinlay siay oolcay",
  },
  {
    number: 122,
    title: ' Départ – Arrivée',
    difficulty: 5,
    description:
      "Vous remarquez que chaque caractère des clapets est sur une sorte de rotor où l’ordre est : \nABCDEFGHIJKLMNOPQRSTUVWXYZ ?!@#&()|<>.:=-+*/0123456789 \n  52 \nÀ partir de la gauche, tous les rotors tournent ensemble \njusqu'à ce que le caractère du rotor soit correct. \nEnsuite, le mécanisme passe au second rotor ... \n    ...  RÉPÉTEZ  la  procédure  pour  ce  rotor  (en  faisant \ntourner également tous les rotors à sa droite) \n    ...  CONTINUER  jusqu’à  ce  que  l’affichage  soit  celui \nvoulu. \nExemple : Considérons un affichage de 3 rotors et 1 ligne avec les lettres CAT. On veut afficher DOG : \nÉtape 1 : Tourner 1 fois le rotor n°1 et ceux à droite (donc tous les rotors)  DBU \nÉtape 2 : Tourner 13 fois le rotors n°2 et ceux à droite (donc rotor n°3)  DO) \nÉtape 3 : Tourner 27 fois le rotor n°3 (il n’y en a plus à droite)  DOG \nVous avez en entrée :  \nLines : tableau de chaînes. Chaque chaîne est une ligne d'affichage de la configuration initiale \nRotors : tableau des valeurs des rotors à appliquer \nExemples : \nflapDisplay([\"CODE\"], [[20,20,28,0]])  [\"WARS\"] \nflapDisplay([\"HELLO \"], [[15,49,50,48,43,13]])  [WORLD!\"] \nflapDisplay([ '+---------------------------+', '| THIS IS A MULTI LINE TEST |', '+------\n---------------------+' ] [ [ 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, \n0, 0, 0, 0, 0, 0, 0, 0, 0, 53 ], [ 8, 46, 7, 12, 30, 1, 4, 16, 34, 52, 32, 13, 11, 48, \n3, 14, 4, 24, 16, 13, 3, 47, 22, 26, 50, 13, 52, 47, 8 ], [ 1, 1, 0, 0, 0, 0, 0, 0, 0, \n0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 53 ] ])   \n[ '*****************************', '* DO YOU LIKE THIS KATA? *', \n'*****************************' ]",
  },
  {
    number: 124,
    title: ' Déplacement sur une carte',
    difficulty: 5,
    description:
      'Une  personne  reçoit  des  instructions  pour  aller  d\'un  point  à  l\'autre.  Les  indications  sont  «NORTH», \n«SOUTH», «WEST», «EAST». De toute évidence, "NORTH" et "SOUTH" sont opposés, "WEST" et "EAST" \naussi. Aller dans une direction et revenir en sens inverse est un effort inutile. Comme il s\'agit de l\'ouest \nsauvage, avec un temps terrible et pas beaucoup d\'eau, il est important de vous épargner de l\'énergie, \nsinon vous pourriez mourir de soif ! L’idée est de traverser le désert de manière intelligente. \nLes instructions données à l\'homme sont, par exemple, les suivantes : \n["NORD", "SUD", "SUD", "EST", "OUEST", "NORD", "OUEST"]. \nVous pouvez immédiatement voir que «NORTH» et ensuite «SOUTH» s’annulent, mieux vaut rester au \nmême endroit ! Donc, la tâche est de donner à l\'homme une version simplifiée du plan. Un meilleur plan \ndans ce cas est tout simplement : ["OUEST"] \nAutres exemples : \nDans ["NORTH", "SOUTH", "EAST", "WEST"], mieux vaut ne rien faire. \nDans  ["NORTH",  "EAST",  "WEST",  "SOUTH",  "WEST",  "WEST"],  "NORTH"  et  "SOUTH"  ne  sont  pas \ndirectement opposés, mais ils deviennent directement opposés après la réduction de "EAST" et "WEST" de \nsorte que tout le chemin est réductible à ["WEST", "WEST"]. \nÉcrivez une fonction dirReduc qui prendra un ensemble de chaînes et renvoie un ensemble de chaînes \navec les directions inutiles supprimées (W <-> E ou S <-> N côte à côte). \ndirReduc(["NORTH", "SOUTH", "SOUTH", "EAST", "WEST", "NORTH", "WEST"]  ["WEST"] \ndirReduc(["NORTH", "WEST", "SOUTH", "EAST"])  ["NORTH", "WEST", "SOUTH", "EAST"] \ndirReduc(["NORTH", "SOUTH", "EAST", "WEST", "EAST", "WEST"])  []',
  },
  {
    number: 126,
    title: ' Somme maxi dans un tableau',
    difficulty: 5,
    description:
      "Le problème consiste à trouver la somme maximale d'une sous-séquence contiguë dans un tableau ou une \nliste d'entiers : \nMaxSequence ([- 2, 1, -3, 4, -1, 2, 1, -5, 4])  6 //[4, -1, 2, 1] \n  54 \nLe cas simple est lorsque la liste est constituée uniquement de nombres positifs et la somme maximale est \nla somme de l'ensemble du tableau. Si la liste n'est constituée que de nombres négatifs, renvoyez 0 à la \nplace. La liste vide devra renvoyer 0.",
  },
  {
    number: 128,
    title: ' Trous entre des nombres premiers',
    difficulty: 5,
    description:
      "Les nombres premiers ne sont pas régulièrement espacés. Par exemple de 2 à 3, l'écart est égal à 1. De 3 \nà 5, l'écart est égal à 2. De 7 à 11, il est 4. Entre 2 et 50, nous avons les paires suivantes de premiers : \n3-5, 5-7, 11-13, 17-19, 29-31, 41-43 \nG (entier> = 2) qui indique l'écart que nous recherchons \nM (entier> 2) qui donne le début de la recherche (m inclus) \nN (entier> = m) qui donne la fin de la recherche (n inclus) \nDans l'exemple ci-dessus, l'intervalle (2, 3, 50) renverra [3, 5] qui est la première paire entre 3 et 50 avec \nun écart 2. \nDonc, cette fonction devra renvoyer la première paire de deux nombres premiers espacés d'un écart de G \nentre les M et N. Si ces nombres n’existent pas, renvoyez null. \nIntervalle (4, 130, 200)  [163, 167]",
  },
  {
    number: 130,
    title: ' PowerSet',
    difficulty: 5,
    description:
      "Compte tenu d'un ensemble nums de nombres entiers, votre tâche est de renvoyer l'ensemble de tous les \nsous-ensembles possibles de nums. \nPour chaque nombre entier, nous pouvons choisir de le prendre ou de ne pas le prendre. L’idée ici et dans \nun premier temps de ne pas le prendre, puis ensuite de le prendre. Exemple : \nPour nums = [1, 2], la sortie devra être [[], [2], [1], [1, 2]], en effet : \nNe pas prendre l'élément 1 \n---- ne pas prendre l'élément 2 \n--------  ajouter [] \n---- prendre l'élément 2 \n--------  ajouter [2] \nPrendre l'élément 1 \n---- ne pas prendre l'élément 2 \n--------  ajouter [1] \n---- prendre l'élément 2 \n--------  ajouter [1, 2] \nPour nums = [1, 2, 3], la sortie devrait être :  \n[[], [3], [2], [2, 3], [1], [1, 3], [1, 2], [1, 2, 3]]",
  },
  {
    number: 132,
    title: ' Combinaisons téléphoniques',
    difficulty: 5,
    description:
      'A partir d’une chaine de nombres, retournez toutes les combinaisons possibles de lettres. \nPar exemple : \nletterCombinations("23") \n Array [ "ad", "bd", "cd", "ae", "be", "ce", "af", "bf", "cf" ] \n  56 \nLes chiffres utilisés seront uniquement ceux entre 2 et 9.',
  },
  {
    number: 134,
    title: ' Meilleur score du perdant',
    difficulty: 5,
    description:
      '"AL-AHLY" et "Zamalek" sont les meilleures équipes en Egypte, mais "AL-AHLY" gagne toujours les matchs. \nLes responsables de "Zamalek" veulent savoir quel est le meilleur match qu\'ils ont joué jusqu\'ici. \nLe  meilleur  match  est le  match  qu\'ils  ont  perdu  avec  la  différence  minimale  de  buts.  S\'il  y  a  plus  d\'une \ncorrespondance avec la même différence, choisissez celle où "Zamalek" a marqué plus de buts. \nCompte  tenu  de  l\'information  sur  tous  les  matchs  qu\'ils  ont  joués,  retournez  l\'index  de  la  meilleure \ncorrespondance. S’il y a plus d\'un résultat valide, renvoyez le plus petit indice. \nPour ALAHLYGoals = [6,4] et zamalekGoals = [1,2], la sortie devrait être de 1. \nParce que 4 - 2 est inférieur à 6 - 1 \nPour ALAHLYGoals = [1,2,3,4,5] et zamalekGoals = [0,1,2,3,4], la sortie devrait être 4.',
  },
  {
    number: 136,
    title: ' Hunger Games au zoo',
    difficulty: 5,
    description:
      "Une panne de courant au zoo a provoqué l’ouverture de toutes les portes des cages ! Les animaux sont \nsortis  et  ils  commencent  à  se  manger entre eux ! Voici une liste d'animaux du zoo et ce qu’ils peuvent \nmanger : \n• L'antilope mange de l'herbe \n• Les  gros  poissons  mangent  des  petits \npoissons \n• Les punaises mangent des feuilles \n• L'ours mange des gros poissons \n• L'ours mange des punaises \n• L'ours mange des poules \n• L'ours mange des vaches \n• L'ours mange des feuilles \n• L'ours mange des moutons \n• Les poules mangent des punaises \n• La vache mange de l'herbe \n• Le renard mange des poules \n• Le renard mange des moutons \n• La girafe mange des feuilles \n• Le lion mange de l'antilope \n• Le lion mange de la vache \n• Le panda mange des feuilles \n• Le mouton mange de l'herbe \nTraduction des différents éléments en anglais : \n['antelope','grass','big-fish','little-fish','bug', 'leaves','bear','chicken','cow', \n'sheep','fox','giraffe','lion','panda'] \nLe but est d’afficher qui mange qui jusqu'à ce que la situation soit stable. \nEn entrée vous avez tous les éléments qui sont dans le zoo séparés par des virgules. \nEn sortie vous devez obtenir une liste avec : \n• Le premier élément le zoo initial \n• Le dernier élément est une chaîne séparée par des virgules de ce que ressemble le zoo à la fin \n• Tous les autres éléments (du 2\ne\n à l’avant dernier) sont de la forme X mange Y décrivant ce qui \ns'est passé \nRemarques : \n• Les animaux ne peuvent manger que des éléments (animaux ou végétaux) à côté d'eux \n• Les animaux mangent toujours à leur GAUCHE avant de manger à leur DROITE \n• L’animal le plus à gauche mange toujours avant les autres \nLes autres choses que vous pouvez trouver dans le zoo (qui ne sont pas listés ci-dessus) ne mangent rien \net ne sont pas comestibles. Exemples :  \nwhoEatsWho(\"fox,bug,chicken,grass,sheep\") \n [\"fox,bug,chicken,grass,sheep\", \"chicken eats bug\", \"fox eats chicken\", \"sheep eats \ngrass\", \"fox eats sheep\", \"fox\" ]; \n  58 \nwhoEatsWho(\"fox,panda,grass,bear,cow,chicken,antelope,little-fish,fox,sheep\") \n [\"bear eats cow\", \"bear eats chicken\", \"fox eats sheep\", \"fox,panda,grass, bear, \nantelope,little-fish,fox\" ] \nwhoEatsWho(\"fox,chicken,tree,chicken,bug,banana,bug,bear\") \n [\"fox,chicken,tree,chicken,bug,banana,bug,bear\", \"fox eats chicken\", \"chicken eats \nbug\", \"bear eats bug\", \"fox,tree,chicken,banana,bear\"]",
  },
  {
    number: 138,
    title: ' banana',
    difficulty: 5,
    description:
      'A partir d’une chaîne de lettres  a,  b  et  n,  énumérez  les  différentes façons  de  faire le  mot  «banana»  en \ntraversant les lettres de gauche à droite. (Utilisez « –«  pour indiquer une lettre non utilisée) \nEntrée : bbananana \nSortie : \nb-anana-- \nb-anan--a \nb-ana--na \nb-an--ana \nb-a--nana \nb---anana \n-banana-- \n-banan--a \n-bana--na \n-ban--ana \n-ba--nana \n-b--anana',
  },
  {
    number: 140,
    title: ' Hauteur de pluie',
    difficulty: 5,
    description:
      "Étant donné un tableau de hauteurs qui contient des nombres entiers positifs ou nuls. Il représente une \ncarte d'élévation où la largeur de chaque barre est 1. Calculez la quantité d'eau qu'elle peut piéger après \nla pluie.  \nHauteurs = [1,0,2,1,0,1,3,2,1,2,1] \n              H \n      H       H H  H \n H   H H  H H H H H H \n 1 0 2 1 0 1 3 2 1 2 1 \n              H \n      H * * * H H * H \n H * H H * H H H H H H \n 1 0 2 1 0 1 3 2 1 2 1 \nDans ce cas on doit obtenir 6 \nTrapWater ([1,0,2,1,0,1,3,2,1,2,1]) === 6 \nTrapWater ([10,0,10]) === 10 \nTrapWater ([0,10,0]) === 0",
  },
  {
    number: 142,
    title: ' NSA et espionnage',
    difficulty: 5,
    description:
      "L’agence NSA veut espionner les conversations téléphoniques (appels ou SMS) et fait appel à vos services \nde programmeur. Pour ce faire, nous aurons besoin de définir des personnes (Person) ayant au moins les \npropriétés ou méthodes suivantes : name (pour le nom), call (appel) et text (SMS). La méthode call a 2 \nparamètres, un objet téléphone contenant le propriétaire (owner) et le numéro (number) et la personne \nappelée. \nPar exemple \nvar dan = new Person(\"Dan\"); \nvar alex = new Person(\"Alex\"); \nvar phone = {owner : dan, number: \"202-555-0199\"}; \ndan.call(phone, alex); \nIci  2  personnes,  Dan  et  Alex,  un  téléphone  appartenant  à  Dan  et  Dan  appelle  Alex  avec  son  propre \ntéléphone. \nLa méthode text est très similaire à la méthode call, mais au lieu d’avoir un unique destinataire, il peut y \nen avoir un nombre quelconque (tous étant des personnes). \nExemple \nvar mark = new Person (\"Mark\"); \ndan.text (phone, alex, mark); \nDan envoie un SMS à Alex et Mark avec son propre téléphone. \nLa NSA vous oblige à enregistrer chaque appel téléphonique et chaque SMS que chaque personne a émis. \nL'objet  NSA  aura  une  méthode log.  Cette  méthode  prend  un  paramètre  :  une  instance  de Person.  Il \nrenverra le journal conservé sur cette personne dans le format suivant : \n[CALLER] called/texted [CALLEE] from [PHONE OWNER]'s phone([PHONE NUMBER]) \nChaque enregistrement sera séparé par \\n.  \nDan called Erin from Dan's phone(202-555-0149) \nDan texted Anthony from Anthony's phone(202-555-0199) \nDan texted Alex from Dan's phone(202-555-0149) \nS'il n'y a pas d'entrées pour la personne, la méthode renverra simplement « No Entries ». \nLa NSA ayant peur d’être accusée d'avoir espionné des civils, assurez-vous d'effacer chaque enregistrement \nindividuel après l’avoir lu dans le journal.  \nExemple complet \n  62 \nvar dan = new Person(\"Dan\"); \nvar mark = new Person(\"Mark\"); \nvar phone = {owner: dan, number: '202-555-0199'}; \ndan.call(phone, mark);  \nNSA.log(dan)  'Dan called Mark from Dan\\'s phone(202-555-0199)' \nvar anthony = new Person(\"Anthony\"); \nanthony.call(phone,dan) \nNSA.log(anthony)  'Anthony called Dan from Dan\\'s phone(202-555-0199)' \nvar mobile = {owner: mark, number: '202-555-0166'}; \nmark.text(mobile,dan,anthony) \nmark.call(phone,anthony) \nNSA.log(mark)   \n'Mark texted Dan from Mark\\'s phone(202-555-0166) \n Mark texted Anthony from Mark\\'s phone(202-555-0166) \n Mark called Anthony from Dan\\'s phone(202-555-0166) \n' \nvar erin = new Person(\"Erin\"); \nNSA.log(erin)  'No Entries' \nStructure de votre programme \n// Objet NSA  \nvar NSA = {}; \n// Constructeur de personnes \nvar Person = function() {  \n  this.name; \n  this.call = function(cellphone, callee) { \n  } \n  this.text = function(cellphone) {  \n  } \n}",
  },
  {
    number: 144,
    title: ' Triangle Pascal',
    difficulty: 4,
    description:
      'Écrivez une fonction qui à une profondeur (n), renvoie un tableau à une seule dimension représentant le \nTriangle de Pascal jusqu’au n ième  niveau. \npascalsTriangle(4) == [1,1,1,1,2,1,1,3,3,1]',
  },
  {
    number: 146,
    title: ' Somme d’intervalles',
    difficulty: 4,
    description:
      "Écrivez une fonction sumIntervals qui accepte en entrée une liste d'intervalles et renvoie la somme de \ntoutes les longueurs des intervalles. Les chevauchements ne doivent être comptés qu'une seule fois. \nLes intervalles sont représentés par une paire d'entiers sous la forme d’une liste. La première valeur de \nl'intervalle sera toujours inférieure à la seconde valeur. Exemple d'intervalle : [1, 5] est un intervalle de 1 \nà 5. La longueur de cet intervalle est de 4. \nListe contenant des intervalles se chevauchant : \n[ \n    [1,4] \n    [7, 10], \n    [3, 5] \n] \nLa  somme  des  longueurs  de  ces  intervalles  est  de  7.  Puisque  [1,  4]  et  [3,  5]  se  chevauchent,  on  peut \ntraiter l'intervalle comme [1, 5], qui a une longueur de 4. \nsumIntervals( [[1,2],[6, 10],[11, 15]] )  9 \nsumIntervals( [[1,4],[7, 10],[3, 5]] )  7 \nsumIntervals( [[1,5],[10, 20],[1, 6],[16, 19],[5, 11]] )  19 \n  64",
  },
  {
    number: 148,
    title: ' Simplification d’un polynôme',
    difficulty: 4,
    description:
      'Toutes  les sommes  et  soustractions  possibles  de  monômes  équivalents  ("xy  ==  yx")  seront  effectuées, \npar exemple : \n"cb + cba" -> "bc + abc", "2xy-yx"  "xy", "-a + 5ab + 3a-c-2a" -> "-c + 5ab" \nTous les monômes apparaissent dans l\'ordre du nombre croissant de variables, par exemple : \n"-abc + 3a + 2ac" -> "3a + 2ac - abc", "xyz - xz"  "-xz + xyz" \nSi  deux  monômes  ont  le  même  nombre  de  variables,  ils  apparaissent  dans  l\'ordre  lexicographique,  par \nexemple : \n"a + ca - ab" -> "a - ab + ac", "xzy + zby"  "byz + xyz" \nIl n\'y a pas de signe + si le premier coefficient est positif, par exemple : \n"-y + x" -> "x-y", mais aucune restriction pour - : "y-x" -> "- x + y" \nsimplify("dc+dcba")  "cd+abcd" \nsimplify("2xy-yx")  "xy" \nsimplify("-a+5ab+3a-c-2a")  "-c+5ab"',
  },
  {
    number: 150,
    title: ' Conversion du temps',
    difficulty: 4,
    description:
      'Votre tâche est d\'écrire une fonction qui écrit une durée, donnée en secondes, de façon conviviale. \nLa fonction doit accepter un nombre entier positif ou nul. Si le nombre est nul, renvoyer simplement "now". \nSinon, la durée est exprimée sous la forme d\'une combinaison d\'années, de jours, d\'heures, de minutes et \nde secondes. \nformatDuration(62)  "1 minute and 2 seconds" \nformatDuration(3662)  "1 hour, 1 minute and 2 seconds" \n  65 \nRègles détaillées \nL\'expression résultante est  faite de plusieurs composants comme 4 secondes, 1 an, etc. En général, un \nnombre entier positif et l\'une des unités de temps valides, séparées par un espace. L\'unité de temps est \nutilisée au pluriel si l\'entier est supérieur à 1. \nLes  composants  sont  séparés  par  une  virgule  et  une  espace  (",  ").  Sauf  le  dernier  composant,  qui  est \nséparé par " and ". Une année fera 365 jours et un jour 24 heures.',
  },
  {
    number: 152,
    title: ' Énumération des permutations',
    difficulty: 4,
    description:
      "Énumérez toutes les permutations d'une chaîne en supprimant les doublons s'il y a lieu. Cela signifie que \nvous devez mélanger toutes les lettres de l'entrée dans toutes les ordres possibles. \npermutations('a')  ['a'] \npermutations('ab')  ['ab', 'ba'] \npermutations('aabb')  ['aabb', 'abab', 'abba', 'baab', 'baba', 'bbaa'] \npermutations('abc')  [\\'abc\\', \\'acb\\', \\'bac\\', \\'bca\\', \\'cab\\', \\'cba\\']",
  },
  {
    number: 154,
    title: ' Mixer 2 chaînes de caractères',
    difficulty: 4,
    description:
      "Étant donné deux chaînes de caractères s1 et s2, nous voulons visualiser à quel point elles sont différentes. \nNous ne prendrons en compte que les lettres minuscules (a à z). Tout d'abord, comptez la fréquence de \nchaque minuscule dans s1 et s2. \n  66 \ns1 = \"A aaaa bb c\" \ns2 = \"& aaa bbb c d\" \ns1 a 4 'a', 2 'b', 1 'c' et s2 a 3 'a', 3 'b', 1 'c', 1 'd' \nDonc, le maximum pour 'a' dans s1 et s2 est le 4 de s1 ; Le maximum pour 'b' est le 3 de s2. Dans ce qui \nsuit, nous ne considérerons pas les lettres lorsque le maximum de leurs occurrences est inférieur ou égal \nà 1. \nNous pouvons reprendre les différences entre s1 et s2 dans la chaîne suivante : 1:aaaa/2:bbb \noù 1:aaaa signifie que le maximum pour « a » est 4 avec la chaîne s1. De la même manière 2:bbb signifie \nque le maximum est 3 pour « b » avec la chaîne s2. \nVotre tâche est de produire une chaîne dans laquelle chaque lettre minuscule de s1 ou s2 apparaît autant \nde fois qu'elle est maximale si ce maximum est strictement supérieur à 1. Ces lettres seront préfixées par \nle numéro de la chaîne où elles apparaissent avec leur valeur maximale et, en cas d’égalité, le préfixe sera \n= :. \nDans le résultat, les sous-chaînes (une sous-chaîne est par exemple 2:nnnnn ou 1:hhh; elle contient le \npréfixe)  seront  en  ordre  décroissant  de  leur longueur  et lorsqu'elles  auront la  même  longueur  triées  en \nordre lexicographique ascendant (lettres et chiffres); Les différents groupes seront séparés par '/'.  \ns1 = \"my&friend&Paul has heavy hats! &\" \ns2 = \"my friend John has many many friends &\" \nmix(s1, s2)  \"2:nnnnn/1:aaaa/1:hhh/2:mmm/2:yyy/2:dd/2:ff/2:ii/2:rr/=:ee/=:ss\" \ns1 = \"mmmmm m nnnnn y&friend&Paul has heavy hats! &\" \ns2 = \"my frie n d Joh n has ma n y ma n y frie n ds n&\" \nmix(s1, s2)  \"1:mmmmmm/=:nnnnnn/1:aaaa/1:hhh/2:yyy/2:dd/2:ff/2:ii/2:rr/=:ee/=:ss\" \ns1=\"Are the kids at home? aaaaa fffff\" \ns2=\"Yes they are here! aaaaa fffff\" \nmix(s1, s2)  \"=:aaaaaa/2:eeeee/=:fffff/1:tt/2:rr/=:hh\"",
  },
  {
    number: 157,
    title: ' Longueur d’une boucle',
    difficulty: 3,
    description:
      "On vous donne un nœud qui est le début d'une liste. Cette liste contient toujours une queue et une boucle. \nVotre objectif est de déterminer la longueur de la boucle. Par exemple, sur l’image suivante, la taille de la \nqueue est 3 et celle de la boucle est 11. \n  68 \n// Utilisez 'getNext' ou 'next' pour passer au noeud suivant \nnode.getNext() \nnode.next",
  },
  {
    number: 159,
    title: ' Rendez-vous entre plusieurs personnes',
    difficulty: 3,
    description:
      "Les gens d'affaires savent qu'il n'est souvent pas facile de trouver un rendez-vous. Nous voulons trouver \nun tel rendez-vous automatiquement. Vous recevez les calendriers de vos interlocuteurs et une durée pour \nla réunion. Votre tâche consiste à trouver le plus tôt possible un créneau commun libre pendant au moins \ncette durée. \n  69 \nPersonne  | Réunions \nA  | 09h00 - 11h30, 13h30 - 16h00, 16h00 - 17h30, 17h45 - 19h00 \nB  | 09h15 - 12h00, 14h00 - 16h30, 17h00 - 17h30 \nC  | 11h30 - 12h15, 15h00 - 16h30, 17h45 - 19h00 \nToutes  les  heures  dans  les  calendriers  seront  données  dans  le  format  24h  \"hh:mm\",  le  résultat  doit \négalement être dans ce format. \nUne  réunion  est  représentée  par  son  heure  de  début  (inclusivement)  et  fin  (exclusivement)  si  une \nréunion a lieu de 09h00 à 11h00, la prochaine heure de départ possible sera 11h00 \nLes hommes d'affaires travaillent à partir de 09h00 (inclusivement) jusqu’à 19h00 (exclusivement), le \nrendez-vous doit commencer et se terminer dans cette fourchette. \nSi la réunion ne correspond pas aux agendas des personnes, renvoyer null \nLa durée de la réunion sera fournie en minutes. \nEn suivant ces règles et en regardant l'exemple ci-dessous, le plus tôt possible pour une réunion de 60 \nminutes serait 12h15. \nschedules=[[['09:00', '11:30'], ['13:30', '16:00'], ['16:00', '17:30'], \n['17:45', '19:00']],[['09:15', '12:00'], ['14:00', '16:30'], ['17:00', '17:30']], \n[['17:45', '19:00']]]; \ngetStartTime(schedules, 60)  12:15",
  },
  {
    number: 161,
    title: ' Distance sur une sphère',
    difficulty: 3,
    description:
      'Nous sommes sur un grand voilier au large de la côte. Le capitaine voudrait connaître la distance entre \ndeux points sur la carte.  \nComplétez la fonction afin qu\'elle renvoie la distance entre deux coordonnées données. Exemples :  \n48 ° 12 \'30 "N, 16 ° 22\' 23" E et 23 ° 33 \'0 "S, 46 ° 38\' 0" W \n58 ° 18 \'0 "N, 134 ° 25\' 0" W et 33 ° 51 \'35 "S, 151 ° 12\' 40" E \nLa distance devra être en kilomètres. La Terre sera considérée comme une sphère de rayon 6371 km. \nIl  suffira  que  le  résultat  soit  précis  à  10  km,  plus  précisément  6387  devient  6380,  643  devient  640  et \n18299 devient 18290. Exemples d\'entrées et de résultats attendus : \nDistance ("48 ° 12 \'30" N, 16 ° 22\' 23 "E", "23 ° 33 \'0" S, 46 ° 38\' 0 "W")  10130 \nDistance ("48 ° 12 \'30" N, 16 ° 22\' 23 "E", "58 ° 18 \'0" N, 134 ° 25\' 0 "W")  7870 \nDistance ("48 ° 12 \'30" N, 16 ° 22\' 23 "E", "48 ° 12 \'30" N, 16 ° 22\' 23 "E")  0 \n  71',
  },
]
