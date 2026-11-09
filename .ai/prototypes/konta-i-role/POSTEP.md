# POSTEP — prototyp konta-i-role

Źródła: `.ai/prototypes/konta-i-role/` (Angular 21, importuje `@org/ui`).
Budowanie: `cd .ai/prototypes/konta-i-role && npx ng build`. Wynik trafia do
`libs/ui/.storybook/public/prototypes/konta-i-role/` (wpis w `.gitignore`, nie commitować).
Podgląd: Storybook na porcie 3000 → `/prototypes/konta-i-role/index.html`.
Mapa: `lekcja-07/mapa-ekranow.md`. Specyfikacja: `.ai/specs/2026-10-18-auth-and-roles.md`.

## Decyzje
- Silnik przeglądu: pliki luzem z `lekcja-07/` (prototype.js, prototype.css, comments.js skopiowane;
  `mostek.css` napisany od nowa pod tokeny DevMentora w `src/review/mostek.css`). Brak
  `silnik-przegladu/README.md`; kontrakt wzięty z kodu: `.screen` > `.frame`, `.doc-toolbar`,
  `data-prototype-id`, `window.__PROTOTYPE_START__`, nawigacja zdarzeniem `prototype:navigate`.
- Technologia: Angular + `@org/ui`. Zaproszenie dodane do mapy jako s09. Napisy produktu po angielsku
  (jak design system), napisy paska przeglądu po polsku.
- Design system jest tylko jasny (decyzja 2026-10-22): przełącznik motywu jest wyłączony z dopiskiem.

## Etapy
- [x] Etap 0 — plan
- [x] Etap 1 — szkielet i ścieżka bez błędów (zrobiony, czeka na „dalej”)
- [x] Etap 2 — stany, role, scenariusze (zrobiony, czeka na „dalej”)
- [x] Etap 3 — uczciwość i sprawdzenie (zrobiony, raport końcowy w rozmowie)

## Etap 1: co jest
Szkielet, pasek przeglądu, silnik, ekrany s01–s09, ścieżki bez błędów (patrz historia w git/run log).

## Etap 2: co jest
- Pasek „Scenariusze" (osobno od nawigacji produktu): wynik GitHuba (nowy mentee / mentor / operator / odmowa /
  niedostępny), wynik logowania mailem (ok / 401 / 429 / offline), wynik rejestracji (ok / 409 / błędy pól / 429 / offline),
  allowlista operatora (usuń/przywróć), wygaś sesję, trasa chroniona + „otwórz jako zalogowany” / „wyloguj i otwórz”.
- Konta demo: Ada (mentee, GitHub), Grace (mentee, e-mail), Linus (mentor), Oliwia (operator; po usunięciu z allowlisty mentee).
- Bramki w `PrototypeState.#gate`: niezalogowany na s03–s06 → s08 z `returnTo`; zła rola → s07; zalogowany na s01/s02 → s03.
  Po logowaniu s03 kieruje na `returnTo` (jeśli rola go posiada) albo do domu roli.
- Usunięcie z allowlisty działa natychmiast w trakcie sesji (s06 → s07); wygaszenie sesji na chronionym ekranie → s08.
- Dane zostają po błędzie (s01 panel DS, s02 sygnały). 401 i 429 pokazane przez `fieldErrors['form']` (obejście luki DS-3).
- Sprawdzone ręcznie w agent-browser: deep link → s08 → logowanie → trasa; odmowa GitHuba (baner); 401/429/offline z zachowanymi
  wartościami; rejestracja 409/400/429/offline; operator → usunięcie z allowlisty → s07; zdemotowany w resolverze → s04;
  zalogowany na s01 → dom roli.

## Znane niedoskonałości (Etap 3)
- Back wraca do ekranów, które bramka natychmiast odrzuca (s03, stare s04–s06 po wylogowaniu): silnik zapisuje je w historii.
- Treść komunikatu 429 jest propozycją (SPEC-3). Przycisk nie blokuje się na czas limitu (SPEC-3).
- Etap 3 do zrobienia: notatki per ekran, README, testy nawigacji, sprawdzenie 320/1440 px i klawiatury, każdy przycisk.

## Etap 3: co jest
- Notatki pod każdym ekranem (historie / symulacja / czego nie rozstrzyga), widoczne po wyłączeniu Presentation.
- README, testy nawigacji (20, `nav.vitest.mts`), sprawdzenie w przeglądarce 320 i 1440 px (jasny motyw), klawiatury, wszystkich przycisków i kontrolek.
- Luka DS-6 (klawiatura w menu) dopisana do mapy.
