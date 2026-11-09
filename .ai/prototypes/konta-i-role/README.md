# Prototyp: konta i role (Epik 01)

Klikalny prototyp ekranów s01–s09 z `lekcja-07/mapa-ekranow.md`, zbudowany z komponentów i tokenów
design systemu (`@org/ui`). Dla właściciela produktu (klika i komentuje) i developera (buduje z niego prawdziwe ekrany).
Specyfikacja: `.ai/specs/2026-10-18-auth-and-roles.md`. Postęp i decyzje: `POSTEP.md`.

## Jak uruchomić
1. Zbuduj: `cd .ai/prototypes/konta-i-role && npx ng build`. Wynik trafia do
   `libs/ui/.storybook/public/prototypes/konta-i-role/` (ignorowany przez git; nie commituj).
2. Uruchom Storybook na porcie 3000 (`npx nx storybook ui --port 3000`) albo użyj już działającego podglądu.
3. Otwórz `/prototypes/konta-i-role/index.html` (np. `http://localhost:3000/prototypes/konta-i-role/index.html`).
4. Testy nawigacji: `npx vitest run -c .ai/prototypes/konta-i-role/nav.vitest.mts` (20 testów).

## Pasek przeglądu
- **Prototyp** — oznaczenie, że to nie jest aplikacja. **Ekran** — skok do s01–s09 (bramki dostępu działają też tu).
- **Clickable / Comment** — klikanie albo komentarze przypięte do elementów. **Threads** — lista i eksport
  („Export for repository” podmienia `public/comments.js`, „Export Markdown”). **Presentation** — jeden ekran naraz
  (domyślnie włączony); wyłączenie pokazuje wszystkie ekrany z notatkami. **Back** — poprzedni ekran.
- **Motyw** — wyłączony: design system ma tylko jasny motyw (decyzja 2026-10-22).

## Konta demo
| Konto | Rola | Jak wejść |
|---|---|---|
| Ada Lovelace | mentee | GitHub, scenariusz „nowy mentee” |
| Grace Hopper | mentee | logowanie mailem (dowolny poprawny e-mail i hasło, scenariusz „Dobre dane”) |
| Linus Torvalds | mentor | GitHub, scenariusz „mentor” |
| Oliwia (founder A) | operator | GitHub, scenariusz „operator z allowlisty”; po „Usuń Oliwię z allowlisty” jest mentee |
| nowe konto | mentee | rejestracja na s02 |

## Scenariusze (pasek „Scenariusze”, osobno od nawigacji produktu)
- **GitHub:** sukces (Ada / Linus / Oliwia), odmowa użytkownika, GitHub niedostępny → baner na s01, bez sesji.
- **Logowanie e-mail:** dobre dane, 401 (ten sam komunikat dla złego hasła i nieznanego e-maila), 429, offline.
- **Rejestracja:** sukces, 409 (ogólny komunikat), błędy pól z serwera, 429, offline.
- **Allowlista:** usuń/przywróć Oliwię. Rola zmienia się od razu, także w trakcie sesji (s06 → s07).
- **Wygaś sesję:** sesja traktowana jak wylogowanie; na ekranie chronionym → s08.
- **Trasa:** `/mentee`, `/mentor`, `/operator`. „Otwórz trasę” (jako zalogowany: zła rola → s07) albo
  „Wyloguj i otwórz” (głęboki link → s08, po logowaniu ląduje na tej trasie, jeśli rola ją ma).

## Ograniczenia symulacji
- Nic nie jest prawdziwe: GitHub OAuth, sprawdzanie haseł, tworzenie kont, sesje, cookie, limity prób, kody 401/403/409/429
  — to stan w pamięci strony. Odświeżenie zeruje wszystko (poza komentarzami w `localStorage`).
- Nie wpisuj prawdziwych haseł ani danych. E-maile i nazwy są fikcyjne (`example.com`). Zegar demo: `2026-11-04T10:00:00Z`.
- s03 i s08 to w produkcie przekierowania bez ekranu; prototyp je pokazuje (SPEC-2, SPEC-4).
- Zaproszenie (s09) nie ma tokenu ani ważności; konto mentora nadaje konto demo, nie zaproszenie (E02-S01).
- Przycisk Back wraca też do ekranów, które bramka od razu odrzuca (silnik zapisuje je w historii).
- Brak ciemnego motywu. Wylogowanie z menu Account nie działa z klawiatury (luka DS-6 w mapie); „Wygaś sesję” je zastępuje.
- Treść komunikatu 429 i brak blokady przycisku to propozycje (SPEC-3, DS-3).
- Napisy produktu są po angielsku (jak design system); napisy paska przeglądu po polsku.

## Luki w design systemie (szczegóły w mapie)
DS-1 (panel rejestracji), DS-3 (wynik 429), DS-5 (odrzuć / nie mam zaproszenia), DS-6 (klawiatura w menu).

## Pliki
`src/app/prototype.model.ts` (ekrany, konta, scenariusze, notatki) · `prototype-state.service.ts` (sesja, bramki, scenariusze) ·
`*-screens.component.ts` (ekrany) · `root.component.ts` (pasek przeglądu) · `src/review/` (silnik: `prototype.css`, własny `mostek.css`) ·
`public/` (`prototype.js`, `comments.js`) · `navigation.spec.ts` (testy).
