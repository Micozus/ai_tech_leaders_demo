# Transcript — run 2, P04 (stance: validate; every line [SYNTHETIC])

Passages attached per question and the persona lines used are in the interview prompt (see personas.md for the persona's sourced lines). Interviewer note: the persona agent received no tags or source keys.

## Interview

(Same source note and passages as P02; different state of mind at entry. Interviewer note: same voice as P02.)

### Q1
- Fast: "Honestly, it's the usual stuff. Someone DMed me about async and memory in pandas, again." Feeling: mild irritation.
- Considered: reads the DM, answers if in the mood, ten minutes, pastes from the doc; if not in the mood it sits.

### Q2
- Fast: "Ten minutes most evenings, and nobody has ever paid me." Feeling: mild tiredness.
- Considered: costs evening time, not money; never charged; asking would feel odd; no invoices. "This topic barely matters to me. It's a favour when I feel like it, not a need." **Grounding flag:** states the persona's own salience line aloud.

### Q3 — no passage. "I have no story for that." (no basis)

### Q4
- Fast: "It's gone if something else handles the money and the no-shows." Feeling: mild interest, tempered by wariness.
- Considered: under twenty minutes; see who is asking before accepting; no bank details before a booking; published text carries the name; still wants money for no-shows (prepayment). **Grounding flag:** list from the passage.

### Q5 — video, ratings, a bare scheduling tool. Feeling: moderate dislike of ratings (freelancing sites). Rather nothing than a rating.

### QA — "I have no story for that." Nearest: speaking at meetups twice a year, "not a regular commitment". Feeling: neutral.

### Past-behaviour yes/no
- Y1 yes. Y2 yes. Y3 no. Y4 no basis.

### Decisions under pressure
- D1, 90 seconds: does nothing, leaves it unanswered ("not something I accept in a hurry from a cold email"). All evening: checks who the other nineteen are; joins if known, declines if twenty strangers; looks at how the name and anything published is handled first.
- D2 setup, time not stated: starts (GitHub sign-in, page, tags), watches the clock, stops at about twenty minutes; stops for certain at payout onboarding.
- D3 price: looks at what others charge, enters a little less; no number in mind; will not discuss earnings. Range shown up front: same, faster, less annoyed at hitting a hidden limit.
- D4 bank details before a booking: stops, leaves the profile unfinished; after a first booking would do it "since someone would have booked me and I could see who it was".
- Story vs choice: "mild interest" in the story; pressure to act on a cold email → nothing.

### Topics raised
control of name and work after a repost without asking; setup ≤ twenty minutes; no bank details before a booking; see who is asking; no juniors' homework; prepayment for no-shows; against ratings; join only if the other invitees are known; tell me right away if anything goes to an AI; published text carries name and mentee agreed; bring own people only if income; a favour not a need; no invoices; avoid saying what they earn.


## Walk of the prototype (stance validate)

Subject: .ai/prototypes/discovery/mentor-onboarding/revision-001/index.html (revision 001, opened with agent-browser, file://). Step 1 is the persona's natural walk; steps 2 onward are a PUSHED-THROUGH walk: after the persona stopped (or would have stopped) at step 1, it was asked to suppose it clicked Accept anyway, to see later screens. Pushed-through reactions show friction on later screens; they do not show that the persona would have got there. The prototype's "TEST STATE" checkbox on the payout screen was left unchecked and not shown to the persona.

### Step 1 — Invitation (natural walk)  📸 screenshots/run2-p04-s01-invitation.png
- First three noticed: (1) "20 senior engineers", the batch size; (2) "If fewer than 5 publish… follows up with the people who didn't"; (3) "publish within two weeks".
- Expects: a plain invitation saying who is asking; the other invitees. Gets: a deadline and follow-up; nothing about who the other nineteen are.
- Fast reaction: wary; moderate irritation; trigger: "follows up with the people who didn't" (pressure).
- Friction: tracked against a commitment before agreeing; cannot tell whether they know anyone in the batch ("I'd decline twenty strangers"); nothing on name or work.
- Missing case: list of invitees, who is asking, how name and published work are handled.
- Outcome: STOP — will not accept or decline until they know who is in the batch.
### Step 2 — Sign in (PUSHED-THROUGH)  📸 run2-p04-s02-sign-in.png
- Noticed: (1) "Invitation accepted" in the header; (2) "Continue with GitHub"; (3) email option. Fast reaction: mild annoyance; trigger: "accepted" appears before they knew who else is in the batch.
- Friction: GitHub would hand over identity/access; cannot see what it reads or whether the name is used. Missing: GitHub access requested, other invitees. Action: Continue with GitHub.
### Step 3 — Mentor page (PUSHED-THROUGH)  📸 run2-p04-s03-page-setup.png
- Noticed: (1) "don't carry ratings or reviews"; (2) "Link to your public work"; (3) stack-tag radios. Fast reaction: mild relief (against ratings).
- Friction: cannot tell who sees the page or whether it is public; the hint's "a talk" touches a sore point; wants to link only what they choose, with their name. Missing: who can see the page; whether content gets reposted or fed to an AI.
- Step 3 continued: filled description, chose Python, Continue. Reaction: mild reluctance; still no word on who sees the page; will finish to see whether payout comes up.
### Step 4 — Pricing (PUSHED-THROUGH)  📸 run2-p04-s04-pricing.png
- Noticed: (1) the bounds; (2) the price fields; (3) "The operator sets bounds". Fast reaction: mild discomfort; naming a price feels odd (never charged).
- Friction: no number in mind; "won't say what I earn"; nothing shows what others charge. Missing: what other mentors charge. Entered 45 / 75 ("a low value inside the bounds").
### Step 5 — Slots (PUSHED-THROUGH)  📸 run2-p04-s05-slots.png
- Noticed: (1) "No slots published yet."; (2) Date and Start time; (3) "at least two hours after booking". Fast reaction: mild wariness; "a stranger could book me on short notice".
- Friction: cannot see who is asking before a booking lands; two hours "too short for an evening favour". Missing: a way to see and refuse a request before it is confirmed; what happens if the mentee does not show up.
### Step 6 — Share link (PUSHED-THROUGH)  📸 run2-p04-s06-share-link.png
- Noticed: (1) "Mentees can also reach you directly"; (2) the link containing "jordan-python" ("a name I never typed"); (3) "Copy link". Fast reaction: moderate unease; a name in a link they never entered, in a flow where their name is a sore point.
- Friction: reachable outside the list; would share only with their Discord people if there is income in it, otherwise stay with DMs. Missing: whether they can pick the link; who else can see it.
### Step 7 — Payouts (PUSHED-THROUGH)  📸 run2-p04-s07-connect.png
- Noticed: (1) "Complete Stripe Connect onboarding before your first payout"; (2) "DevMentor keeps 20%"; (3) "I'll do this later". Fast reaction: mild relief; trigger: "I'll do this later" because nobody has booked them yet.
- Friction: the 20% is stated only now, after prices were set; would defer bank details until a first booking. Missing: whether prepayment covers no-shows; whether they see who booked before payout. Action: "I'll do this later".
### Step 8 — Done (PUSHED-THROUGH)  📸 run2-p04-s08-complete.png
- Noticed: (1) "Your mentor page is live"; (2) "payouts aren't set up yet"; (3) the share link with "jordan-python". Fast reaction: mild unease; a page going live under a name they never typed, with no say on who sees it.
- Friction: live before payout is set up means a stranger could book them with no prepayment protection for no-shows; never saw who else is in the batch; nothing about their name on published work or AI. Missing: who sees the page; whether a booking can be approved first.
- Story vs choice: would not have accepted: "I never saw who the other nineteen were… this was only a walk-through for the exercise, not my choice."

## Interviewer's notes
- Grounding: Q4 list from the passage; Q2 states the salience line aloud. D1 added "check who the other nineteen are" — derived from the passage rule, reasonable.
- Homogeneity: answers repeat P02's almost sentence for sentence; one real voice twice.
