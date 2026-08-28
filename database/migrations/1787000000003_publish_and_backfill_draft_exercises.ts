import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.defer(async () => {
      await this.db
        .from('exercises')
        .where('number', 67)
        .update({
          status: 'published',
          starter_code:
            '// #67 — 10 minutes de promenade\\n\\nfunction isValidWalk(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 88)
        .update({
          status: 'published',
          starter_code:
            '// #88 — Somme des chiffres\\n\\nfunction digitalRoot(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 111)
        .update({
          status: 'published',
          starter_code:
            '// #111 — Gendarmes et voleurs\\n\\nfunction catchThief(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 112)
        .update({
          status: 'published',
          starter_code:
            '// #112 — Types de données\\n\\nfunction dataTypes(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 113)
        .update({
          status: 'published',
          starter_code:
            '// #113 — Lettres alternées ?\\n\\nfunction isAlt(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 114)
        .update({
          status: 'published',
          starter_code:
            '// #114 — Langage Tick\\n\\nfunction interpreter(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 115)
        .update({
          status: 'published',
          starter_code:
            '// #115 — Longueur de la clé\\n\\nfunction findTheKey(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 116)
        .update({
          status: 'published',
          starter_code:
            '// #116 — Exercices sur les nœuds (6 kyu et 7 kyu)\\n\\nfunction length(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 117)
        .update({
          status: 'published',
          starter_code:
            '// #117 — Somme max dans un arbre\\n\\nfunction maxSum(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 118)
        .update({
          status: 'published',
          starter_code:
            '// #118 — Heures à partir de secondes\\n\\nfunction humanReadable(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 119)
        .update({
          status: 'published',
          starter_code:
            '// #119 — Hashtags\\n\\nfunction generateHashtag(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 120)
        .update({
          status: 'published',
          starter_code:
            '// #120 — Pig Latin\\n\\nfunction pigLatin(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 121)
        .update({
          status: 'published',
          starter_code:
            '// #121 — Camel Case\\n\\nfunction toCamelCase(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 122)
        .update({
          status: 'published',
          starter_code:
            '// #122 — Départ – Arrivée\\n\\nfunction flapDisplay(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 123)
        .update({
          status: 'published',
          starter_code:
            '// #123 — Fibonnaci\\n\\nfunction productFib(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 124)
        .update({
          status: 'published',
          starter_code:
            '// #124 — Déplacement sur une carte\\n\\nfunction dirReduc(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 125)
        .update({
          status: 'published',
          starter_code:
            '// #125 — Un problème de poids\\n\\nfunction orderWeight(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 126)
        .update({
          status: 'published',
          starter_code:
            '// #126 — Somme maxi dans un tableau\\n\\nfunction maxSequence(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 127)
        .update({
          status: 'published',
          starter_code:
            '// #127 — Anagrammes\\n\\nfunction anagrams(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 128)
        .update({
          status: 'published',
          starter_code:
            '// #128 — Trous entre des nombres premiers\\n\\nfunction gap(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 129)
        .update({
          status: 'published',
          starter_code:
            '// #129 — Somme carrés diviseurs = carré ?\\n\\nfunction listSquared(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 130)
        .update({
          status: 'published',
          starter_code:
            '// #130 — PowerSet\\n\\nfunction powerSet(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 131)
        .update({
          status: 'published',
          starter_code:
            '// #131 — Parenthèses valides\\n\\nfunction validParentheses(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 132)
        .update({
          status: 'published',
          starter_code:
            '// #132 — Combinaisons téléphoniques\\n\\nfunction letterCombinations(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 133)
        .update({
          status: 'published',
          starter_code:
            '// #133 — Nombres binaires négatifs\\n\\nfunction toNegabinary(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 134)
        .update({
          status: 'published',
          starter_code:
            '// #134 — Meilleur score du perdant\\n\\nfunction bestMatch(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 135)
        .update({
          status: 'published',
          starter_code:
            '// #135 — Animaux écrasés\\n\\nfunction roadKill(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 136)
        .update({
          status: 'published',
          starter_code:
            '// #136 — Hunger Games au zoo\\n\\nfunction whoEatsWho(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 137)
        .update({
          status: 'published',
          starter_code:
            '// #137 — Chaîne dans une chaîne\\n\\nfunction scramble(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 138)
        .update({
          status: 'published',
          starter_code:
            '// #138 — banana\\n\\nfunction banana(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 139)
        .update({
          status: 'published',
          starter_code:
            '// #139 — Données sur 1 octet\\n\\nclass Network {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 140)
        .update({
          status: 'published',
          starter_code:
            '// #140 — Hauteur de pluie\\n\\nfunction trapWater(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 141)
        .update({
          status: 'published',
          starter_code:
            '// #141 — Vecteurs\\n\\nfunction round6(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 142)
        .update({
          status: 'published',
          starter_code:
            '// #142 — NSA et espionnage\\n\\nclass Person {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 143)
        .update({
          status: 'published',
          starter_code:
            '// #143 — Matrices infinies\\n\\nfunction findTrue(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 144)
        .update({
          status: 'published',
          starter_code:
            '// #144 — Triangle Pascal\\n\\nfunction pascalsTriangle(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 145)
        .update({
          status: 'published',
          starter_code:
            '// #145 — Écriture d’intervalles\\n\\nfunction solution(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 146)
        .update({
          status: 'published',
          starter_code:
            '// #146 — Somme d’intervalles\\n\\nfunction sumIntervals(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 147)
        .update({
          status: 'published',
          starter_code:
            '// #147 — Parenthèses, accolades et crochets\\n\\nfunction validBraces(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 148)
        .update({
          status: 'published',
          starter_code:
            '// #148 — Simplification d’un polynôme\\n\\nfunction simplify(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 149)
        .update({
          status: 'published',
          starter_code:
            '// #149 — Grandes factorielles\\n\\nfunction factorial(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 150)
        .update({
          status: 'published',
          starter_code:
            '// #150 — Conversion du temps\\n\\nfunction formatDuration(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 151)
        .update({
          status: 'published',
          starter_code:
            '// #151 — Chiffres romains\\n\\nfunction solution(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 152)
        .update({
          status: 'published',
          starter_code:
            '// #152 — Énumération des permutations\\n\\nfunction permutations(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 153)
        .update({
          status: 'published',
          starter_code:
            '// #153 — Nombre suivant avec les mêmes chiffres\\n\\nfunction nextBigger(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 154)
        .update({
          status: 'published',
          starter_code:
            '// #154 — Mixer 2 chaînes de caractères\\n\\nfunction mix(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 155)
        .update({
          status: 'published',
          starter_code:
            '// #155 — Serpent\\n\\nfunction snail(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 156)
        .update({
          status: 'published',
          starter_code:
            '// #156 — Nombre binaire multiple de 3\\n\\nconst multipleOf3Regex = /votre_regex_ici/;\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 157)
        .update({
          status: 'published',
          starter_code:
            '// #157 — Longueur d’une boucle\\n\\nfunction loopSize(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 158)
        .update({
          status: 'published',
          starter_code:
            '// #158 — Distance de Levensthein\\n\\nclass Dictionary {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 159)
        .update({
          status: 'published',
          starter_code:
            '// #159 — Rendez-vous entre plusieurs personnes\\n\\nfunction getStartTime(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 160)
        .update({
          status: 'published',
          starter_code:
            '// #160 — Chemin le plus court dans un graphe\\n\\nfunction navigate(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
      await this.db
        .from('exercises')
        .where('number', 161)
        .update({
          status: 'published',
          starter_code:
            '// #161 — Distance sur une sphère\\n\\nfunction distance(...args) {\\n  // Votre solution ici\\n  \\n}\\n',
        })
    })
  }

  async down() {
    this.defer(async () => {
      await this.db
        .from('exercises')
        .whereIn(
          'number',
          [
            67, 88, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126,
            127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143,
            144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160,
            161,
          ]
        )
        .update({ status: 'draft', starter_code: null })
    })
  }
}
