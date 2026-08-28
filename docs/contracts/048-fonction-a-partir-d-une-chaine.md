# Exercice 048 : Fonction à partir d’une chaine

## Analyse de la consigne
Créer une fonction avec `new Function` ou similaire à partir des chaînes fournies pour évaluer le résultat sur l'argument.

## Le Contrat
Entrée : arg (any), obj avec param (string) et func (string). Sortie : résultat de l'exécution (any).

## Test proposé
```ts
import { describe, it, expect } from 'vitest';
import { runYourString } from '../src/48-fonction-a-partir-d-une-chaine';

describe('runYourString', () => {
  it('exécute la fonction string', () => {
    expect(runYourString(4, { param: 'num', func: 'return Math.sqrt(num)' })).toBe(2);
    expect(runYourString(10, { param: 'a', func: 'return a === 10' })).toBe(true);
  });
});
```

## Starter Code
```ts
export function runYourString(arg: any, obj: { param: string, func: string }): any {
  // Votre code ici
}
```
