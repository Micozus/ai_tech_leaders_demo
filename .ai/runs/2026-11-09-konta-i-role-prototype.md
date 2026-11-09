# Run: klikalny prototyp konta-i-role

- Cel: klikalny prototyp Epiku 01 z design systemu (`prompt-klikalny-prototyp.md`), etapy 0–3.
- Spec: `.ai/specs/2026-10-18-auth-and-roles.md`; mapa `lekcja-07/mapa-ekranow.md` (dodano s09 na decyzję właściciela).
- Decyzje: Angular + `@org/ui`; źródła w `.ai/prototypes/konta-i-role/`; silnik przeglądu z luźnych plików `lekcja-07/`.
- Etap 1: zrobiony. Pliki: `.ai/prototypes/konta-i-role/**`, `.gitignore` (+1 wpis), mapa (s09, DS-5).
- Sprawdzone: `npx ng build` OK; ręcznie w agent-browser: s09→s01→GitHub→s03→s05, e-mail→s04, rejestracja (walidacja + sukces)→s04, wylogowanie.
- Otwarte: brak README silnika; ciemny motyw niemożliwy (DS jest light-only).
- Etap 2: zrobiony. Scenariusze, konta, bramki (`prototype-state.service.ts`), pasek scenariuszy. `npx ng build` OK; przeklikane w agent-browser (zob. POSTEP.md).
- Etap 3: notatki, README, testy nawigacji (20 OK: `npx vitest run -c .ai/prototypes/konta-i-role/nav.vitest.mts`), sprawdzenie w agent-browser (320/1440, klawiatura, przyciski, komentarze). Znaleziono DS-6 (menu z klawiatury). Mapa: 11 luk.
- Panel syntetyczny (om-synthetic-users, stance validate, 2 przebiegi × 2 persony) na szarym prototypie mentor-onboarding: `.ai/specs/research/walkthroughs/2026-11-09-mentor-onboarding-session-001/report.md`; persony `.ai/specs/research/personas.md`; kalibracja `.ai/specs/research/calibration.md`. Wszystko `[SYNTHETIC]`, nie dowód.
