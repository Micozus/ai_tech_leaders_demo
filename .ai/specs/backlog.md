# Backlogs

## .ai/specs/product-brief.md
Backlog source: .ai/specs/product-brief.md
Last filed: 2026-10-18
Tracker: https://github.com/Micozus/ai_tech_leaders_demo (GitHub). Filed by `om-backlog`; the tracker is the authority and this file maps tree ids to issue numbers. Ids are kept from the earlier record of this source (issues #7–#34 in `open-mercato/ai_techleaders_project`, not accessible from here and not adopted); those numbers are retired and the ids were re-filed here as #10–#45.

| Id | Issue | Title | Epic | Depends on | Adopted | Iteration |
|---|---|---|---|---|---|---|
| E00 | [#10](https://github.com/Micozus/ai_tech_leaders_demo/issues/10) | Discovery |  |  | no |  |
| E00-T01 | [#40](https://github.com/Micozus/ai_tech_leaders_demo/issues/40) | Benchmark the five named references | #10 |  | no |  |
| E00-T02 | [#41](https://github.com/Micozus/ai_tech_leaders_demo/issues/41) | Mentee interviews (A02, A04, A07) | #10 |  | no |  |
| E00-T03 | [#42](https://github.com/Micozus/ai_tech_leaders_demo/issues/42) | Ten developer interviews on A01 | #10 |  | no |  |
| E00-T04 | [#43](https://github.com/Micozus/ai_tech_leaders_demo/issues/43) | Real data on frequency and cost | #10 |  | no |  |
| E00-T05 | [#44](https://github.com/Micozus/ai_tech_leaders_demo/issues/44) | Interview mentors who did not publish | #10 |  | no |  |
| E00-T06 | [#45](https://github.com/Micozus/ai_tech_leaders_demo/issues/45) | Test the N02 hypothesis | #10 |  | no |  |
| E01 | [#11](https://github.com/Micozus/ai_tech_leaders_demo/issues/11) | Accounts and roles |  |  | no |  |
| E01-S01 | [#17](https://github.com/Micozus/ai_tech_leaders_demo/issues/17) | A developer or invited mentor signs in with GitHub and lands in their role's home | #11 |  | no | first (D13) |
| E01-S02 | [#18](https://github.com/Micozus/ai_tech_leaders_demo/issues/18) | A user without GitHub signs in with email and password | #11 | E01-S01 (#17) | no | first (D13) |
| E01-S03 | [#19](https://github.com/Micozus/ai_tech_leaders_demo/issues/19) | A signed-in user sees only their role's screens; the operator role belongs to the two founders | #11 | E01-S01 (#17) | no | first (D13) |
| E02 | [#12](https://github.com/Micozus/ai_tech_leaders_demo/issues/12) | Mentors become bookable |  |  | no |  |
| E02-S01 | [#20](https://github.com/Micozus/ai_tech_leaders_demo/issues/20) | An invited senior engineer accepts the invitation and gets a mentor account; there is no open registration | #12 | E01-S01 (#17) | no | first (D13) |
| E02-S02 | [#21](https://github.com/Micozus/ai_tech_leaders_demo/issues/21) | A mentor fills the mentor page (public-work link, description, stack tags) and gets a share link; no ratings | #12 | E02-S01 (#20) | no | first (D13) |
| E02-S03 | [#22](https://github.com/Micozus/ai_tech_leaders_demo/issues/22) | A mentor publishes slots and sees them taken as they are booked | #12 | E02-S01 (#20) | no | first (D13) |
| E02-S04 | [#23](https://github.com/Micozus/ai_tech_leaders_demo/issues/23) | A mentor sets 25- and 50-minute prices within the operator's bounds | #12 | E02-S01 (#20) | no | first (D13) |
| E02-S05 | [#24](https://github.com/Micozus/ai_tech_leaders_demo/issues/24) | A mentor completes Stripe Connect onboarding and sees whether payouts are enabled | #12 | E01-S01 (#17) | no | 1.1 (D13) |
| E02-S05-T01 | [#39](https://github.com/Micozus/ai_tech_leaders_demo/issues/39) | Stripe Connect integration | #24 | E03-S03-T01 (#38) | no | 1.1 (D13) |
| E03 | [#13](https://github.com/Micozus/ai_tech_leaders_demo/issues/13) | Booking and payment |  |  | no |  |
| E03-S01 | [#25](https://github.com/Micozus/ai_tech_leaders_demo/issues/25) | A mentee finds a mentor in a list filtered by stack tag, ordered by most recent published availability; no search, no ranking | #13 | E02-S02 (#21), E02-S03 (#22) | no | 1.1 (D13) |
| E03-S02 | [#26](https://github.com/Micozus/ai_tech_leaders_demo/issues/26) | A mentee picks a slot that starts at least two hours ahead and a 25- or 50-minute length at the mentor's price | #13 | E02-S03 (#22), E02-S04 (#23), E01-S01 (#17) | no | first (D13) |
| E03-S03 | [#27](https://github.com/Micozus/ai_tech_leaders_demo/issues/27) | A mentee pays through Stripe Checkout; the booking is confirmed only after payment; booking-to-start is recorded | #13 | E03-S02 (#26) | no | first (D13) |
| E03-S03-T01 | [#38](https://github.com/Micozus/ai_tech_leaders_demo/issues/38) | Stripe Checkout integration | #27 |  | no | first (D13) |
| E03-S04 | [#28](https://github.com/Micozus/ai_tech_leaders_demo/issues/28) | The mentor and the mentee are told about a confirmed booking and each sees their upcoming sessions | #13 | E03-S03 (#27) | no | first (D13) |
| E03-S05 | [#29](https://github.com/Micozus/ai_tech_leaders_demo/issues/29) | A mentee cancels free up to 24 hours before a session; a later cancellation forfeits the fee | #13 | E03-S03 (#27) | no | 1.1 (D13) |
| E03-S06 | [#30](https://github.com/Micozus/ai_tech_leaders_demo/issues/30) | DevMentor keeps 20% of a paid session and the mentor's share is paid out through Stripe Connect | #13 | E03-S03 (#27), E02-S05 (#24) | no | 1.1 (D13) |
| E04 | [#14](https://github.com/Micozus/ai_tech_leaders_demo/issues/14) | Session, written answer, and note |  |  | no |  |
| E04-S01 | [#31](https://github.com/Micozus/ai_tech_leaders_demo/issues/31) | At the slot's start the mentee and the mentor hold a 25- or 50-minute text session in DevMentor; every session screen says sessions are text | #14 | E03-S03 (#27) | no | first (D13) |
| E04-S02 | [#32](https://github.com/Micozus/ai_tech_leaders_demo/issues/32) | The mentor gives the written answer and the mentee sees it after the session | #14 | E04-S01 (#31) | no | first (D13) |
| E04-S03 | [#33](https://github.com/Micozus/ai_tech_leaders_demo/issues/33) | The mentor drafts a session note and the mentee sees it awaiting approval | #14 | E04-S02 (#32) | no | first (D13) |
| E04-S04 | [#34](https://github.com/Micozus/ai_tech_leaders_demo/issues/34) | The mentee approves the note in full or declines it with a comment; an approved note is kept privately by both; nothing is published | #14 | E04-S03 (#33) | no | first (D13) |
| E05 | [#15](https://github.com/Micozus/ai_tech_leaders_demo/issues/15) | Operator functions in 1.0 |  |  | no |  |
| E05-S01 | [#35](https://github.com/Micozus/ai_tech_leaders_demo/issues/35) | The operator invites a senior engineer from the beachhead pool in a batch of 20 and sees who published a slot within two weeks | #15 | E01-S03 (#19) | no | 1.1 (D13) |
| E05-S02 | [#36](https://github.com/Micozus/ai_tech_leaders_demo/issues/36) | The operator sets the price bounds and the platform fee | #15 | E01-S03 (#19) | no | 1.1 (D13) |
| E05-S03 | [#37](https://github.com/Micozus/ai_tech_leaders_demo/issues/37) | The operator resolves a quality dispute and records the outcome; no automatic refund | #15 | E03-S03 (#27) | no | 1.1 (D13) |
| E06 | [#16](https://github.com/Micozus/ai_tech_leaders_demo/issues/16) | Later (parked) |  |  | no |  |

For the three tasks (`E02-S05-T01`, `E03-S03-T01`) the Epic column holds the parent story; research tasks sit under E00.

## Not filed
- Ideas with no decision behind them (membership, Mentor Pro, session packs, featured placement, premium vault-plus-AI tier) are listed in E06's body as ideas, not stories. Non-goals N01 and N02 bound everything.

## Dedupe
- The repository held one unrelated issue (#8, installer); no DevMentor issue existed, nothing adopted.

## Open questions carried on issues
- Q18 on E04-S01 ([#31](https://github.com/Micozus/ai_tech_leaders_demo/issues/31)), Q19 on E02-S05 ([#24](https://github.com/Micozus/ai_tech_leaders_demo/issues/24)) and E03-S06 ([#30](https://github.com/Micozus/ai_tech_leaders_demo/issues/30)), Q20 on E03-S01 ([#25](https://github.com/Micozus/ai_tech_leaders_demo/issues/25)); mentee vs `student` naming on E01-S01 ([#17](https://github.com/Micozus/ai_tech_leaders_demo/issues/17)).

## Notes
- Brief used: the existing `product-brief.md` (older than the research corpus in commit 21dc89f); E00 tasks flag that part of that material may already exist.
- Issues were created with the GitHub REST API following `om-prepare-issue` conventions (title, labels, rationale comment), not by invoking the skill 36 times.
