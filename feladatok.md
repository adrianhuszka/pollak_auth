### 1. Hard kódolt adatok kieemelése adatbázisba

- JWT Secret
- JWT Expiration
- JWT Algorithm
- Refresh Token Secret
- Refresh Token Expiration
- Refresh Token Algorithm

### 2. Admin felület

- User:
  - Login felület (csak adminoknak)
  - User listázás
  - User törlés (tiltás)
  - User módosítás
  - User csoporthoz rendelése
  - Force logout (kijelentkeztetés, későbbi feladat)
- Csoport:
  - Csoportok listázása felhasználókkal
  - Csoport készítése
  - Csoport törlése
  - Csoport módosítása
- Token:
  - JWT secret módosítása
  - JWT expiration módosítása
  - JWT algorithm módosítása
  - Refresh token secret módosítása
  - Refresh token expiration módosítása
  - Refresh token algorithm módosítása

### 3. Admin felület védése middlewarrel (csak adminoknak)

- JWT token ellenőrzése
  - 403-as hiba, ha nincs bejelentkezve
- User admin jogosultságának ellenőrzése
  - 401-es hiba, ha nem admin
- Hiba oldal a megfelelő hibakódokkal

## Varga "Behánytam" Ádám