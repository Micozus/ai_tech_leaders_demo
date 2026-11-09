# Walkthrough: mentor onboarding, `.ai/prototypes/discovery/mentor-onboarding/revision-001/index.html`, 2026-11-09

All four personas left at the first screen of the prototype, and every one of them named the same cause: the invitation asks for a two-week publishing commitment and then tells the invitee that DevMentor "follows up with the people who didn't". The next real check is a short interview with invited seniors on exactly that sentence and on whether they know who else is in the batch. Every finding below is `[SYNTHETIC]`, a hypothesis from a panel built on two interview notes, and none of it satisfies the Definition of Ready.

Stance: validate (chosen by the requester; the brief's mode `own` would have defaulted to adversary)
Panel: 2 runs × 2 personas; run 1 = P01, P02; run 2 = P03, P04
Basis: `.ai/specs/product-brief.md` (Target group, Key flows, Business rules, Riskiest assumptions), `2026-08-22-interview-mentor.md` `[INTERVIEW]`, `2026-09-03-interview-senior-python-meetups.md` `[INTERVIEW]`, `2026-09-02-miro-board-vpc-mentor.md` `[ASSUMPTION]` (founders' canvas), `2026-09-04-mentor-list-note.md` `[DOCUMENT]`. Evidence tiers: two `[INTERVIEW]` notes (one person each) plus founders' documents. Not assumption-only, but thin.
Panel snapshot: `personas.md` in this session directory (every panel used, with source tags)
Session: `.ai/specs/research/walkthroughs/2026-11-09-mentor-onboarding-session-001/`; subject `.ai/prototypes/discovery/mentor-onboarding/revision-001/index.html`; flow "mentor onboarding" (brief Key flow "Future state, mentor onboarding (1.0), decided steps")
Composition: assumed. The brief gives no proportions for mentor segments; seat 1 is an engaged mentor, seat 2 barely engaged. One sourced segment per seat, one interview note per segment.
Saturation: not reached by the rule (13 of 38 topics in the last three interviews were new, almost all from the first python-note instance); run 2 added 1 new topic out of 24 (P03 and P04), so more runs on the same two notes would repeat, not add. That says the material is exhausted, not that the problem is.
Parity: 7 of 11 themes of the held-out note raised by the panel counting partial matches, 4 of 11 strict; held out: `2026-09-03-interview-staff-engineer-declined-before.md`; one real interviewee only. See Parity below and `calibration.md`.
Elapsed: not timed to the minute. Interviews: four persona runs of about 14 s each. Walks: about eight lockstep rounds per persona (one browser session per persona), each reply 1 to 3.5 minutes; total wall clock for the session roughly an hour. Consolidation and parity: a few minutes.
Not askable of this panel: A01, A02, A04, A06 (mentee side), A05 and A07 (segment existence and beachhead demand), Q03 (provenance of the data file). A03 (invited seniors accept and publish) is askable and is the assumption this walk bears on.

## 🎯 Scope and limits

- Flow: invitation → sign-in → mentor page → pricing → slots → share link → Stripe Connect → done, plus the failure and postponed branches. Medium: static HTML prototype from `om-mockup-prototype`, opened with `agent-browser`. Role: an invited mentor, no credentials typed; only fictitious values were entered.
- The prototype is neutral and low-fi; judged for its declared flow and states, not visual fidelity. Its prices ($40–$120, $70–$200), batch number and the generated share-link name ("jordan-…") are simulated values with no source.
- **Natural walk ended at step 1 for all four personas.** Steps 2 to 8 are a *pushed-through* walk: each persona was asked to suppose it clicked Accept anyway to see later screens. Those reactions show friction on later screens, not that the persona would have reached them. P03 left again at step 5 (slots) and never saw the payout screen, so steps 6 to 8 are P01, P02 and P04 only.
- Not walked: the failed-Connect branch (the review-only "Simulate a failed Connect verification" checkbox was left unchecked), the decline and "I don't have an invitation" screens, the not-found screen, Back navigation, narrow viewport, keyboard use. Nothing about the mentee side.
- Homogeneity flag: each segment has one note, so run 2's personas are the same voice as run 1's (P03 ≈ P01, P04 ≈ P02, almost sentence for sentence in the interviews). That is itself a finding about the material. The python note also says its "paste doc" line echoes the first mentor "almost word for word, unprompted", so the two sources may not be independent.
- Blind spot by construction: the one note that would speak for a mentor who declined an earlier invitation was held out for the parity check, so the panel has no persona built from a decliner's perspective.

## 🔍 Barriers that repeated (worst first, ties marked)

### 1. The invitation reads as a deadline plus surveillance, so the invitee leaves before the product is seen.

[SYNTHETIC]

Weight: 4; spread: ±0 (2 personas per run, both runs); personas: P01, P02 (run 1), P03, P04 (run 2). Ranked above every item with weight 2; tied with M2 (4) and, within the error bar, with M4 and M6 (3).
Step 1 (`screenshots/run1-p01-s01-invitation.png`, `run1-p02-s01-invitation.png`, `run2-p03-s01-invitation.png`, `run2-p04-s01-invitation.png`). Fast reactions: "It's pushy" (P01, guarded, moderate); wary and annoyed (P02, moderate; "reads as pressure and tracking"); "another platform wanting something from me" (P03, sceptical, moderate; "feels like a threat"); wary, moderate irritation (P04). The trigger each time: "publish at least one bookable session within two weeks" together with "If fewer than 5 engineers in this batch publish in that window, DevMentor pauses further invitations and follows up with the people who didn't." The persona lines behind it: P02/P04 asked "is this a sales thing?" and want to see who is asking; P01/P03 had earlier attempts that failed. Considered: none would commit on a skim; all four stopped at step 1.
Consequence: the sentence discloses the founders' own stop rule (brief D18: fewer than 5 of the first 20 stops further invitations) to the invitee, where it reads as monitoring. It touches R17 and D18, and A03 (invited seniors accept and publish), which the brief already calls weak. The prototype's README records the whole R17/D18 line as preserved text, so this is a wording and placement question, not a change of rule.
Real check: interview invited seniors from the warm-contact part of the mentor list (29 of the 50, per the list note) with the invitation shown cold: what they read as the commitment, what they make of the follow-up sentence, and what they would do next. Settles A03's first half (do they accept).

## 📋 Missing cases that repeated

### M2. Nothing says what GitHub access sign-in asks for.

[SYNTHETIC]

Weight: 4; spread: ±0; personas: P01, P02 (run 1), P03, P04 (run 2); tied with barrier 1. Step 2 (pushed-through; `…-s02-sign-in.png`). P01: "doesn't say which GitHub permissions it asks for"; P02: GitHub "hands over my identity before I know who is asking"; P03: "I don't know what access GitHub sign-in asks for"; P04: "can't see what it reads or whether my name gets used anywhere". Touches R06/D07 (GitHub first). Real check: usability test of the sign-in step with invited seniors; ask what they expect GitHub to share and what would stop them; settles nothing in the brief's assumption table, but is a precondition for A03.

### M4. The 20% platform fee first appears at the payout step, after prices are set.

[SYNTHETIC]

Weight: 3; spread: ±1 (run 1: P01, P02; run 2: P04; P03 left before step 7); tied with M6 and, within the error bar, with the items above and below. Step 7 (`…-s07-connect.png`). P01: "the 20% cut is a surprise"; P02: "A 20% cut was never shown at pricing. I'd have priced differently"; P04: "stated only now, after I set prices". Touches R10/D11 (20%) and R08/D09 (the mentor sets prices). Open from the same persona lines: whether the 20% comes out of the price or on top (P02). Real check: show invitees the pricing and payout screens in either order and ask what they would have entered; settles R08's price-setting design, not demand.

### M6. Setup time is never stated.

[SYNTHETIC]

Weight: 3; spread: ±1 (run 1: P01, P02; run 2: P03; P04 did not raise it in the walk); tied with M4. Steps 1, 2, 4, 5, 7. P01 and P02 said so at several screens; P03: "I don't know how much setup is involved". The prototype shows "Step n of 8", so the count is there; the persona material wants minutes (P02's source line sets about twenty minutes as the limit). No brief claim touches it. Real check: time a real invitee through the flow and ask when they would have quit.

### M1. Who else is in the invited batch, and who is asking, is not shown.

[SYNTHETIC]

Weight: 2; spread: ±0; personas: P02 (run 1), P04 (run 2), both from the barely engaged seat. Step 1. P02: names of the other invitees, who the founders are; P04: "I can't tell whether I know anyone in the batch… I'd decline twenty strangers". Touches R17 (batches of 20), R16/D24 (beachhead pool) and D18's A03 check. The held-out real note also lists "who else is in" as a condition to publish (see Parity). Real check: ask invited seniors which of the other invitees they would need to know before accepting, and whether a list or just the count would do.

### M3. Who can see the page, whether the link can be turned off, and a link name the persona never chose.

[SYNTHETIC]

Weight: 2; spread: ±0; personas: P02 (run 1), P04 (run 2). Steps 3, 6, 8. P02: "who sees the link to my talks", "page is already public without my say" at "is live"; P04: "a name I never typed" in a link, "sore point". Caveat: the "jordan-…" slug is simulated data in the prototype, so the reaction to *that name* is partly an artifact; the questions about visibility, indexing and unpublishing are not. Touches R04/N02 (link to public work), R13 (share link), D21. The held-out note asks for a way to take a published thing down. Real check: usability test of the page and share-link screens asking what they think is public and how they would remove it.

### M5. No-show, prepayment and "see and refuse a booking before it is confirmed".

[SYNTHETIC]

Weight: 2; spread: ±0; personas: P02 (run 1), P04 (run 2). Steps 5, 7, 8. P02: "what happens on a no-show. Whether I can approve a booking first"; P04: "a way to see and refuse a request before it's confirmed… what happens if the mentee doesn't show up". Touches R09/D10 (cancellation, which the brief states from the mentee side) and R14 (two-hour rule). The brief defines no mentor-side approval or no-show rule; the persona wants one. Real check: ask invitees what they need to see about a booking before it lands and what no-show terms they assume; the held-out note also wants to see the question first.

### M7. No view of what other mentors charge.

[SYNTHETIC]

Weight: 2; spread: ±0; personas: P02 (run 1), P04 (run 2). Step 4. Both wanted to price "a little under" others and entered the bottom of each range ($40 and $70 in P02's run, $45 and $75 in P04's); the numbers are the prototype's own simulated bounds. Touches R08/D09. Real check: ask invitees how they would decide a price and what they would look at first.

## ⚠️ Contradictions with the brief

### C1. The flow sells live sessions; two personas' stated reason to mentor is notes that earn without a call.

[SYNTHETIC]

Weight: 2; spread: ±0; personas: P01 (run 1), P03 (run 2), the engaged seat. P01 raised it at steps 1, 3, 4, 5, 6 and 8 ("the call is only the delivery… my notes are the product"); P03 at steps 1, 3, 4 and 5 and stopped at slots: "it looks like Codementor, where the call is the offer and nothing survives it" (sceptical, moderate). After the whole walk P01 still would not have accepted ("The flow sells calls"), and P03 said one line on the first screen saying notes earn without a call, under their name, would have changed their mind. This is not an error in the prototype: the brief puts the vault outside 1.0 (D05, D13; later scope only if E00-T03 passes on 2026-11-30). It is a conflict between 1.0's supply offer and the reason this kind of mentor would join, which the brief already flags for A03 ("weak, and partly against: Codementor 'transactional, nothing survives the call'"). Real check: invite 3 to 5 mentors like the 2026-08-22 interviewee to react to the 1.0 offer with and without a one-line notes promise; settles A03 and the D12/D14 wording.

## 🔍 Outliers

- P03 (run 2) is the only persona that left mid-flow for a product reason (step 5, slots) instead of at the invitation. It left at the live-slot screen for the same reason as C1; P01, who shares P03's source, went on to the end. The difference is the entry state (tired and sceptical vs hopeful but guarded), so a state of mind at entry was enough to move where this voice left. That is worth a real check on invitation timing, not a rank.
- P02's reaction that the page is "live before I chose to publish" came only from P02 and only at step 8 (see Seen once).

## 🔁 Seen once, not reported as a finding

- P01 (run 1): operator-set bounds "feel a little controlling" (pricing step).
- P01 (run 1, step 3), P03 (run 2, step 3, "unsure which tag fits"): a single forced stack tag does not fit work spanning more than one. P03 had no view, so this does not count as repeating.
- P02 (run 1): the page went live before they chose to publish (step 8). P04 (run 2) reacted to a page going live "under a name I never typed", which is counted in M3.
- P02 and P04: the header says "Invitation accepted" before sign-in, which both found irritating. This is an artifact of the pushed-through exercise (they clicked Accept only to look), not a finding.
- Interview slips, not findings: P01's answer to the bank-details pressure went beyond its lines ("no view on bank details").

## 🧪 To confirm with real users

| # | Hypothesis | Persona ids / runs | Settles | Who to recruit | How |
|---|---|---|---|---|---|
| 1 | The "follows up with the people who didn't" sentence and the two-week deadline make invitees leave | P01, P02 (1); P03, P04 (2) | A03; R17/D18 wording | invited seniors, warm-contact part of the list (29 of 50) | show the invitation cold; ask what they read as the commitment and what they would do next |
| 2 | GitHub sign-in without a stated scope stops invitees | P01, P02 (1); P03, P04 (2) | precondition for A03; R06/D07 | same | usability test of step 2; what do they expect GitHub to share |
| 3 | A 20% fee shown only at payout changes what mentors would have priced | P01, P02 (1); P04 (2) | R08/D09, R10/D11 | same | show pricing and payout in both orders; ask what they would enter |
| 4 | Not knowing the setup time makes invitees quit | P01, P02 (1); P03 (2) | none in the brief | same | time a real invitee through the flow; ask when they would have stopped |
| 5 | Invitees need to know who else is in the batch before accepting | P02 (1); P04 (2) | R17, R16/D24, A03 | same | ask which invitees they would need to recognise; list or count |
| 6 | Invitees fear a public page they did not choose to publish and want a way to unpublish | P02 (1); P04 (2) | R04/N02, R13, D21 | same | usability test of steps 3, 6, 8: what they think is public and how they would remove it |
| 7 | Mentors want to see and refuse a booking, and need no-show terms | P02 (1); P04 (2) | R09/D10, R14 | same | ask what they must see before a booking lands |
| 8 | Mentors want to know what others charge before setting a price | P02 (1); P04 (2) | R08/D09 | same | ask how they would choose a price |
| 9 | Mentors who value notes will not join for live sessions alone | P01 (1); P03 (2) | A03, D05/D13, D12/D14 | 3 to 5 mentors like the 2026-08-22 interviewee | react to the 1.0 offer with and without a one-line notes promise |

## 📝 Interviews

Transcripts, one per persona and run: `transcripts/run-1-P01.md`, `run-1-P02.md`, `run-2-P03.md`, `run-2-P04.md`. Each carries the interview, the pressured decisions with their effect, the step records, topics raised, and the interviewer's grounding notes.

- Story vs choice (the point of the pressures): every persona said it was hopeful or interested in its interview, and every persona declined at the invitation under the 90-second pressure (D1); the walk then showed the same exit at step 1. P02 and P04 also set a second condition in D4 (no bank details before a first booking), which the prototype met only by offering "I'll do this later" at step 7: both used it.
- Acquiescence measure (four past-behaviour yes/no questions per persona): 10 of 12 answered were yes (83%); 4 were "no basis". The yeses rest on persona lines (answered unpaid, kept a doc, and for P01/P03 the earlier platform); P02 and P04 answered no on charging. So the yeses are sourced, not agreeable, but the set is easy to say yes to; the measure is reported, not scored.
- Known biases checked: over-positivity was not present (the opposite: every persona declined at the invitation, which may be over-refusal driven by two objection-heavy source notes); the same tool proposed by everyone, none; same place or kind of company, not checkable (no company data); equally engaged, no (seat 2 was barely engaged), but P03 and P04 repeat P01 and P02, so the panel is homogeneous within each run's corner of the note. Homogeneity is flagged and is itself a finding about the material.
- Grounding: several answers retold passage quotes as the persona's own words (P01 and P03 on Q2, Q4); flagged in each transcript. No persona mentioned documents or research. No stated-preference question was asked.

## 🔍 Parity with real interviews

Held out and opened only now: `2026-09-03-interview-staff-engineer-declined-before.md` (a staff engineer who declined an earlier mentoring invitation). Eleven themes extracted from it; the panel raised 7 counting partial matches and 4 strictly (about 64% and 36% of one person's themes; a trend to watch in `calibration.md`, not a score).

- In both: no ratings (both against, concretely); wanting to see the question or who asks before accepting (P02, P04); wanting to know who else is in before joining ("who else is there" in the real note; "who the other nineteen are" in the panel); a published note carries their name and needs the mentee's agreement; being told before anything is turned into "AI answers from my notes" (P02, P04). Sentiment aligns, and the panel is generic where the real interviewee is specific: she names a way to take published notes down and a condition ("first booking from someone I know"); the panel only asks "can I unpublish".
- Real-only (the panel's blind spots; each names material to gather): wanting a one-off text answer instead of a relationship; a high price as a filter ("I don't need money, I need not to lose time"); a month of silence means she forgets it exists; weekend contact; first booking from someone known as the trigger to publish availability. Persona lines for a mentor who declines on the relationship model are missing; a second note of this kind is the material to add.
- Panel-only (questions for the next real interview, not findings): the follow-up sentence read as surveillance; GitHub permissions; setup time; bank details before a first booking; 20% shown late; page live without a publish choice; no-show terms; notes earning without a call. The real note does not contradict any of them, and it did not ask about several (fee order, GitHub scope).

## 📸 Evidence

Screenshots, one per judged screen per persona, in `screenshots/` (names `run1-p01-s01-invitation.png` … `run2-p04-s08-complete.png`; P03 stops at `run2-p03-s05-slots.png`). The prototype's own evidence is in its `evidence/` folder and was not used.

## Quality gate

Critical items checked: persona lines sourced and tagged (1); no names, ages or biographies (2); no stated-preference question (5); every finding survived both runs with weight and spread (9); every finding tagged `[SYNTHETIC]` with a real check (10); no persona-stated number leaves this report as a share of users (11: the only figures are the prototype's own simulated prices and the 29-of-50 from the list note); "would", never "validated" (12); parity used held-out notes only (15); acquiescence measured, 10 of 12 yes (16). Not-critical items: homogeneity flagged; one-note segments disclosed.
