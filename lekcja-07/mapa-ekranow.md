# Mapa ekranów — Epik 01, konta i role

Status: do zatwierdzenia przez właściciela produktu. Nic z design systemu lub aplikacji nie zostało
zmienione przy pisaniu tej mapy — to wyłącznie plan.

## Materiały, które faktycznie wybrałem

Polecenie podawało ścieżki z paczki kursowej „DevMentor"; w tym repozytorium część z nich nie
istnieje albo nazywa się inaczej. Wybrałem:

- **Brief:** `.ai/specs/product-brief.md`.
- **Backlog:** `.ai/specs/backlog.md`. Epik 01 to issue **#11** ("Accounts and roles"), nie ma
  osobnych historii pod numerami #12/#13/#14 z polecenia — te numery w tym repo należą do epików
  E02/E03/E04. Właściwe historie Epiku 01: **E01-S01 (#17)** logowanie GitHubem, **E01-S02 (#18)**
  logowanie mailem i hasłem, **E01-S03 (#19)** ekrany ograniczone rolą i operator z allowlisty.
- **Specyfikacja Epiku 01:** `.ai/specs/2026-10-18-auth-and-roles.md` (plik
  `.ai/specs/2026-09-04-accounts-and-roles.md` z polecenia nie istnieje; to jest jedyna specyfikacja
  pokrywająca #17/#18/#19).
- **Persony i badania:** `personas.md` nie istnieje w `.ai/specs/research/`. Użyłem wywiadów
  (`2026-08-20-interview-working-dev.md`, `2026-08-22-interview-mentor.md`) i rekordów decyzji
  (`decisions/D07-login.md`, `D19-operator.md`, `D08-invite-only.md`) zamiast person.
- **Design system:** `packages/ui` nie istnieje w tym repozytorium (Angular/Nx, nie React). Użyłem
  `libs/ui/src/lib/product/accounts/` (komponenty), `libs/ui/src/screens/e01-accounts.stories.ts`
  (istniejący, częściowy ekran Epiku 01) i `libs/ui/.storybook/` (Storybook). Zasady dla agentów:
  `AGENTS.md` w katalogu głównym.
- **Stan aplikacji:** `apps/shell/src/app/app.routes.ts` ma dziś tylko `/` (lista zadań demo) i
  `/admin`; żadnej trasy kont/ról nie ma — zgodne ze specyfikacją ("DevMentor has no accounts
  today"). Backlog oznacza E01-S01..S03 jako `Adopted: no`. Ta mapa planuje ekrany, które jeszcze
  nie istnieją w aplikacji (część już istnieje jako przykłady w Storybooku, patrz kolumna DS).

## Historie i kryteria tego przepływu

| Historia      | Podsumowanie                                       | Kluczowe kryteria z `.ai/specs/2026-10-18-auth-and-roles.md`                                                                                                                                                                        |
| ------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| E01-S01 (#17) | Logowanie GitHubem, lądowanie w domu swojej roli   | pierwsze logowanie GitHubem tworzy `mentee` (nigdy `mentor`, R07); błąd/odmowa GitHuba → `/sign-in?error=github`, bez sesji; `/home` kieruje do domu roli                                                                           |
| E01-S02 (#18) | Logowanie mailem i hasłem (fallback)               | rejestracja tylko `mentee`; błędny e-mail/hasło i nieznany e-mail dają identyczny komunikat `401`; e-mail już istnieje → `409` ogólny; limit `429` po 5 próbach/15 min                                                              |
| E01-S03 (#19) | Ekrany ograniczone rolą; operator = dwaj founderzy | zalogowany użytkownik otwierający trasę innej roli widzi `403`; niezalogowany otwierający chronioną trasę jest wysyłany na `/sign-in?returnTo=`; rola `operator` tylko przez allowlistę `OPERATOR_GITHUB_IDS`, bez ścieżki w UI/API |

## 1. Tabela ekranów

| ID  | Ekran                                                                         | Rola                                                           | Stany                                                                                                                                                                                                                            | Historia / kryterium                                                                                                                                                                                                   | Komponenty DS                                                                                                                                                                                                             |
| --- | ----------------------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| s01 | Sign in (`/sign-in`)                                                          | niezalogowany (zalogowany jest przekierowany na `/home`)       | domyślny · wysyłanie · błędy pól (format e-maila, wymagane hasło) · błąd logowania (401, ten sam komunikat dla złego hasła i nieznanego e-maila) · baner błędu GitHuba (`?error=github`) · limit prób (429) · offline/błąd sieci | #17 (przycisk GitHub) · #18 (formularz e-mail/hasło) · spec UI/UX "idle, submitting, field errors, generic credential error, GitHub error banner" · edge case "Brute force" (429)                                      | `ui-card`, `ui-alert`, `button[ui-button]`, `ui-field`, `input[ui-text-field]` — wszystko już w `SignInPanelComponent`                                                                                                    |
| s02 | Utwórz konto mailem (ten sam `/sign-in`, przełączony widok, nie osobny adres) | niezalogowany                                                  | domyślny · wysyłanie · błędy pól (e-mail, hasło 12–128 znaków, nazwa 1–120 znaków) · konflikt — e-mail już istnieje (409 ogólny) · limit prób (429) · offline/błąd sieci · sukces → przekierowanie do `/home`                    | #18, spec API `POST /api/auth/register`, spec UI/UX "link to 'Create account with email' (mentee)"                                                                                                                     | **brakuje** — patrz luka DS-1                                                                                                                                                                                             |
| s03 | Dom roli — resolver (`/home`)                                                 | każda zalogowana rola (przejściowy ekran, bez własnego widoku) | ustalanie roli i przekierowanie · niezalogowany → przekierowanie na `/sign-in?returnTo=/home`                                                                                                                                    | #17 "lands in their role's home" · spec "`/home` resolves by role to `/mentee`, `/mentor`, `/operator`"                                                                                                                | brak własnego UI (czysty redirect)                                                                                                                                                                                        |
| s04 | Dom mentee (`/mentee`)                                                        | mentee                                                         | domyślny (nagłówek, nazwa zalogowanej osoby, wyloguj) — pełna wersja z listą sesji należy do E03/E04, poza tym epikiem                                                                                                           | #17, spec "each a minimal placeholder home (heading, signed-in name, sign-out)"                                                                                                                                        | `ui-app-header` (ma już "Sign out" w menu), `ui-page-header`; pełniejsza wersja (`ui-tabs`, `ui-async-region`, `ui-session-row`) już istnieje w `e01-accounts.stories.ts` jako `MenteeHome`, ale to zakres E03/E04        |
| s05 | Dom mentora (`/mentor`)                                                       | mentor                                                         | domyślny (placeholder jak s04)                                                                                                                                                                                                   | #19, spec "Phase 3 adds the per-role guards" i role homes                                                                                                                                                              | `ui-app-header` (rola już obsłużona: `userRole="mentor"`), `ui-page-header` — **brakuje** osobnej historii/ekranu w Storybooku, patrz luka DS-2                                                                           |
| s06 | Dom operatora (`/operator`)                                                   | operator                                                       | domyślny (placeholder jak s04)                                                                                                                                                                                                   | #19                                                                                                                                                                                                                    | jak s05 — **brakuje** historii w Storybooku, luka DS-2                                                                                                                                                                    |
| s07 | Brak dostępu — inna rola (403)                                                | zalogowany, zła rola                                           | domyślny                                                                                                                                                                                                                         | #19 "a signed-in user opening a route of another role sees a 403"                                                                                                                                                      | `ui-access-denied` (`reason="no-access"`), `ui-app-header` — już w `e01-accounts.stories.ts` jako `AccessDenied`                                                                                                          |
| s08 | Niezalogowany na chronionej trasie                                            | niezalogowany                                                  | przekierowanie na `/sign-in?returnTo=<trasa>`                                                                                                                                                                                    | #19 "a signed-out visitor opening a protected route is sent to `/sign-in?returnTo=<route>`"                                                                                                                            | spec mówi o przekierowaniu, nie o ekranie; `ui-access-denied` (`reason="signed-out"`) istnieje w `e01-accounts.stories.ts` jako `SignedOutVisitorSentToSignIn`, ale to może być niezgodne z kryterium — patrz luka SPEC-1 |
| s09 | Zaproszenie mentora (`/invite`, dodany po zatwierdzeniu mapy)                 | zaproszony mentor, jeszcze niezalogowany                       | domyślny (przyjmij / odrzuć / „nie mam zaproszenia”) · odrzucone · wyjaśnienie „tylko z zaproszeniem” (R07/D08, bez formularza rejestracji)                                                                                      | Szary prototyp `#invitation`, `#declined`, `#no-invite`; R07/D08, R17/D18. **Poza historiami #17–#19** (zaproszenia to E02-S01) — dodany na decyzję właściciela produktu, żeby prototyp pokazał wejście mentora do s01 | `ui-invitation-accept-panel` (akcja „przyjmij”) · „odrzuć” i „nie mam zaproszenia” **brakuje** — luka DS-5                                                                                                                |

Ekran s02 nie ma własnego identyfikatora adresu — zgodnie ze specyfikacją ("link to 'Create
account with email'" i implementacją "Email form and registration form on `/sign-in`") to inny
widok tej samej trasy `/sign-in`, nie nowa trasa.

## 2. Scenariusze do przełączania w prototypie

Kontrolki prototypu (nie funkcje produktu):

1. Wynik logowania GitHubem: sukces (nowy mentee) / sukces (istniejący mentor) / sukces (istniejący
   operator, id na allowliście) / odmowa użytkownika / GitHub niedostępny (5xx/sieć) — wpływa na s01.
2. Wynik logowania mailem: dobre dane / złe hasło albo nieznany e-mail (401) / limit prób (429) /
   offline — wpływa na s01.
3. Wynik rejestracji: sukces / e-mail już istnieje (409) / błędy pól / limit prób (429) / offline —
   wpływa na s02.
4. Rola konta użytego w demo: mentee / mentor / operator — decyduje, dokąd `/home` (s03) kieruje
   (s04/s05/s06).
5. Operator usunięty z allowlisty między żądaniami (spec: "a founder removed from the list is
   demoted... immediately for existing sessions") — pokazuje przejście s06 → s07 w trakcie trwania
   sesji, bez wylogowania.
6. Sesja wygasła albo nieznana — spec: "treated as signed out, cookie cleared" — wpływa na
   dowolny ekran chroniony, efekt jak s08.
7. Próba otwarcia trasy innej roli przez zalogowaną osobę — wpływa na s07.
8. Bezpośrednie wejście niezalogowanej osoby na chronioną trasę (głęboki link, np. `/mentor`) —
   wpływa na s08, z `returnTo` wskazującym tę trasę.

## 3. Konta i dane demo

Produkt nie pozwala jednej osobie mieć więcej niż jedną rolę i nie łączy tożsamości GitHub/e-mail
w jednym koncie w 1.0 (D19, Q7 w specyfikacji) — więc nie ma konta "łączącego role". Zamiast tego:
jedno konto na rolę plus jedno na drugą metodę logowania, żeby dało się przełączyć też s02/logowanie
mailem.

| Konto                                     | Rola                  | Metoda                                                 | Użycie                                      |
| ----------------------------------------- | --------------------- | ------------------------------------------------------ | ------------------------------------------- |
| Ada Lovelace                              | mentee                | GitHub                                                 | ścieżka główna s01→s03→s04                  |
| Grace Hopper                              | mentee                | e-mail i hasło                                         | s02 (rejestracja) i logowanie mailem na s01 |
| Linus Torvalds                            | mentor                | GitHub (już zaproszony — zaproszenie poza tym epikiem) | s01→s03→s05                                 |
| (founder A, Oliwia)                       | operator              | GitHub, id na `OPERATOR_GITHUB_IDS`                    | s01→s03→s06                                 |
| (ta sama osoba po usunięciu z allowlisty) | zdemotowany do mentee | GitHub                                                 | scenariusz 5 — s06→s07                      |

Imiona mentorów/mentee (Ada Lovelace, Grace Hopper, Linus Torvalds) są te już użyte w
`libs/ui/.storybook/blocks/sample-data.ts`, żeby prototyp tego epiku był spójny z resztą
Storybooka. Stały zegar demo: `NOW = '2026-11-04T10:00:00Z'` — ta sama wartość co w
`sample-data.ts`, z tego samego powodu.

## 4. Luki w specyfikacji

- **SPEC-1 (sprzeczność, najważniejsza):** polecenie do tej mapy wymienia "weryfikację maila" jako
  część przepływu (razem z logowaniem i rejestracją). Specyfikacja `2026-10-18-auth-and-roles.md`
  wprost **wyklucza** weryfikację maila z zakresu 1.0 (sekcja "Resolved assumptions", Q6: "email
  verification and password reset deferred; founders recover by hand"). Nie dodałem ekranu
  weryfikacji maila (reguła 9: nie wymyślać funkcji poza materiałami). **Pytanie do właściciela
  produktu:** czy ta mapa powinna zawierać weryfikację maila jako przyszły zakres (i czy spec ma
  zostać rozszerzona), czy opis przepływu w poleceniu jest nieaktualny względem decyzji Q6?
- **SPEC-2:** specyfikacja mówi, że niezalogowana osoba na chronionej trasie jest **przekierowana**
  na `/sign-in?returnTo=` (kod `302`/`401` po stronie SSR), nie że widzi osobny ekran. Design system
  ma jednak gotowy, samodzielny ekran na ten wypadek (`AccessDeniedComponent` z
  `reason="signed-out"`, historia `SignedOutVisitorSentToSignIn`). **Pytanie:** czy ten ekran ma się
  w ogóle kiedykolwiek wyrenderować (np. krótko po stronie klienta przed przekierowaniem, albo gdy
  JS się nie załadował), czy to tylko zapasowy widok, który w praktyce nigdy nie jest pokazywany?
  Jeśli nigdy, czy komponent `ui-access-denied(reason="signed-out")` powinien zostać oznaczony jako
  nieużywany w tym przepływie?
- **SPEC-3:** limit prób (429) jest zdefiniowany w kontrakcie API (`spec, API Contracts`, 5
  prób/15 min), ale sekcja UI/UX nie opisuje żadnego tekstu ani stanu ekranu dla tego przypadku —
  tylko "idle, submitting, field errors, generic credential error, GitHub error banner". **Pytanie:**
  jaki ma być komunikat dla 429 (inny niż ogólny błąd serwera), i czy przycisk logowania/rejestracji
  ma się na ten czas blokować?
- **SPEC-4:** żadna historia czy kryterium nie mówi, co widzi osoba na `/home` w momencie samego
  ustalania roli (s03) — czy to natychmiastowy redirect po stronie SSR (bez migającego ekranu), czy
  może być krótki stan "ładowanie" po stronie klienta. **Pytanie:** czy `/home` jest zawsze
  rozwiązywany server-side (SSR), więc klient nigdy nie renderuje tego ekranu?
- **SPEC-5:** rejestracja wymaga `displayName` (1–120 znaków), ale żadne kryterium nie mówi, co się
  dzieje przy GitHub bez nazwy ("GitHub profile with no `name`: falls back to login" — to jest
  opisane, ale tylko dla GitHuba). Dla rejestracji mailem nazwa jest wymagana explicite, więc to nie
  jest luka — tylko potwierdzenie, że s02 zawsze ma pole `displayName`.

## 5. Luki w design systemie

- **DS-1 (brakujący komponent):** nie istnieje żaden komponent/ekran na rejestrację mailem (s02).
  `SignInPanelComponent` ma tylko logowanie (e-mail + hasło), bez pola `displayName`, bez trybu
  "Utwórz konto" i bez przełącznika między logowaniem i rejestracją. Najbliższy punkt odniesienia:
  wzorzec `Patterns/Form` (stany idle/validation/waiting/field error/server error/offline/success)
  już pokazuje, jak ma wyglądać walidacja i obsługa błędów — ale nie ma gotowego panelu do
  skopiowania dla tego konkretnego formularza.
- **DS-2 (brakujący stan/ekran):** nie ma żadnej historii Storybooka dla domu mentora (s05) albo
  domu operatora (s06), mimo że potrzebne komponenty (`ui-app-header` z `userRole="mentor"` albo
  `"operator"`, `ui-page-header`) już istnieją i są przetestowane dla mentee. To różnica tylko w
  przykładzie, nie w komponencie.
- **DS-3 (brakująca reguła):** `SubmitOutcome` (`libs/ui/src/lib/helpers/submit-outcome.helper.ts`)
  rozróżnia tylko `ok`, `field-errors`, `server-error`, `offline` — nie ma odrębnego rodzaju wyniku
  dla limitu prób (429). Dziś odpowiedź 429 bez `fieldErrors` trafia do `server-error` i pokazuje
  ogólny komunikat "Something went wrong on our side..." — nieprawdziwy dla tego przypadku (to nie
  błąd serwera, to limit). Potrzebny nowy wariant, np. `{ kind: 'rate-limited' }`, z własnym
  komunikatem, zanim s01/s02 da się w pełni zbudować.
- **DS-5 (częściowa luka):** `ui-invitation-accept-panel` istnieje (stany ready/loading/invalid, akcja „przyjmij”), ale nie ma w nim akcji „odrzuć” ani wyjaśnienia „nie mam zaproszenia” (R07/D08). Prototyp składa te dwa widoki z `ui-card`, `ui-alert` i `button[ui-button]` i oznacza je jako lukę.
- **DS-6 (do sprawdzenia, klawiatura):** menu `ui-menu` (użyte w `ui-app-header` do „Sign out”) otwiera się klawiaturą, ale w prototypie strzałki ani Enter nie aktywowały pozycji (`aria-activedescendant` pozostaje puste), choć komentarz komponentu to obiecuje. Wylogowanie klawiaturą jest możliwe tylko przez kontrolkę „Wygaś sesję” w pasku przeglądu. Do potwierdzenia na Storybooku, bo sprawdzałem tylko w prototypie.
- **DS-4 (niejasna dokumentacja):** `e01-accounts.stories.ts` nazywa ekran domu mentee `MenteeHome`
  i pokazuje już listę sesji (zakres E03/E04) razem z kartami zakładek — nie jest jasne z samego
  Storybooka, które części tego ekranu należą do Epiku 01 (nagłówek, nazwa, wyloguj) a które do
  późniejszych epików (zakładki, lista sesji). Żadna luka w kodzie, tylko w opisie — warto dopisać
  do dokumentacji ekranu, która jego część jest z której historii.

## 6. Liczby

- Ekrany: **9** (s01–s09; s02 współdzieli trasę z s01, s03 nie ma własnego UI).
- Stany łącznie we wszystkich ekranach: **24** (licząc każdy wypisany stan z kolumny "Stany" w
  tabeli ekranów, łącznie z przejściowymi/redirect: s01 i s02 po 7, s03 ma 2, s04–s08 po 1, s09 ma 3).
- Luki: **11** — 5 w specyfikacji (SPEC-1…SPEC-5), 6 w design systemie (DS-1…DS-6).

---

Zatrzymuję się tutaj. Czekam na zatwierdzenie tej mapy, zanim ktokolwiek zacznie budować klikalny
prototyp na jej podstawie.
