# Audit: every case against the Death of a Bloodline floor (2026-11-11)

Death of a Bloodline (DoB) is hand-built: ~73 KB of case data, real search of places, six or more crucial clues, a unique enemy with its own rules,
NPCs with their own interviews (Charisma-limited), several ways to solve it, result-tiered endings.

Measured from the case data (steps counted: say / check / combat / converse / clue / end):

| Case | Size | Clues | Combat | Endings | Interviews | Enemy kinds |
|---|---|---|---|---|---|---|
| 23 other cases (all of them) | 7 to 18 KB | 3 to 5 | 1 (a few 2) | 1 (vacancy 3, a few 2) | 1 to 4, open question lists | 2 to 3, built from stock monsters |
| Death of a Bloodline | 73 KB | 6+ | several | result-tiered | limited by Charisma roll | unique |

## Finding
Every one of the 23 other cases falls below the floor on the same points:
- Investigation is a short chain of conversations leading to one fight, not a search of places for clues the players put together.
- One route to the end. No second way to solve it; endings are one text with a result stamp.
- Enemies are stock monsters with a name, not a creature with its own rules that the clues explain.
- Interviews were open lists with an automatic approach prompt; now limited by a Charisma roll (engine done) but the content does not use it yet.
- Secondary objectives are listed but carry no benefit (engine now supports `benefit`; no case uses it).
- Short: 20 to 35 spoken lines; a session of 20 minutes.

## What this means
None can be patched up to the floor; each needs a rewrite from its premise. The ones with a premise worth keeping
(Hour of the Fog, Trench Chorus, Last Picture Show, Night Train Aomori, Bread for the Dead, Bell of Saint-Remy) are rebuilt on the same idea;
the rest get fresh premises (Eldritch Horror style: a place, a wrongness, a rule that can be learned).

Plan: 1) add the four modules as written; 2) rebuild the keepers on the new case format; 3) replace the rest; 4) picture list v6.
