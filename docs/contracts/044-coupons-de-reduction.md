# Exercice 044 : Coupons de réduction

## Analyse de la consigne
Il faut valider un coupon s'il correspond au bon code et s'il n'est pas expiré par rapport à la date du jour ou une date donnée. Ici, les dates sont données en string.

## Le Contrat
Entrée : enteredCode (string), correctCode (string), currentDate (string), expirationDate (string). Sortie : boolean.

## Test proposé
```ts
import { describe, it, expect } from 'vitest';
import { checkCoupon } from '../src/44-coupons-de-reduction';

describe('checkCoupon', () => {
  it('valide le coupon correctement', () => {
    expect(checkCoupon('123', '123', 'September 5, 2014', 'October 1, 2014')).toBe(true);
    expect(checkCoupon('123a', '123', 'September 5, 2014', 'October 1, 2014')).toBe(false);
  });
});
```

## Starter Code
```ts
export function checkCoupon(enteredCode: string, correctCode: string, currentDate: string, expirationDate: string): boolean {
  // Votre code ici
}
```
