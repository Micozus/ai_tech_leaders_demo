# DevMentor style guide

The design system is documented in Storybook (`npm run storybook`, section **Foundations** and the `Primitives` pages). This file only points to the sources so there is one source of truth.

- Decisions and where they come from: `lekcja-06/referencje.md` (references R01, R02, anti-references A01–A05) and `lekcja-06/tokeny.md` (approved tokens, contrast, rules that are not tokens).
- Tokens (the only place for colour, spacing, radius, shadow, type, motion values): `libs/ui/src/lib/styles/tokens.css`, in three layers: raw → semantic → component.
- Check: `npm run tokens:lint` finds colour literals, Tailwind palette classes and arbitrary values outside the tokens file (`-- --all` also checks the app).
- Stage and open decisions: `libs/ui/POSTEP.md`.
- Light theme only; icons from PrimeIcons; font Inter, self-hosted.
