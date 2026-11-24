# Radar behaviour, section by section

Shared rules for every radar:

- **Colours mean the same thing everywhere.** Dark green `#0E4A2F` is the brand in view (Brand X). Red `#D9573F` is the biggest competitor. Amber `#E3A33A` is the other competitor. Grey `#B9B0A3` is other vendors. Red is never used for anything but competitors.
- **The light.** A green wedge sweeps round once every 6 s. Dots pulse with a ring when it passes them (each ping is delayed to the exact moment the beam crosses that angle).
- **No overlapping labels.** Every label was checked at 1280 and 1440 px wide.
- **Hover or tap any dot** for a tooltip with its numbers. Dots are focusable for keyboard users.
- **Reduced motion:** sweep, pings and build-ups are switched off and the final state is shown.

## 1. Hero radar

One dot per brand, plus grey dots for other vendors, one per topic, near the rim. Distance from centre = 100 minus the share of sessions that named the brand; dot size = share picked first. The View-as switch changes which brand is dark green, and the dots move. Ring labels (25%, 50%, 75%, 0% named) run down the south axis.

## 2. Hero-to-session hand-off

As you scroll from the hero into "One session, slowed down", a copy of the hero radar travels and scales down into the session radar's position.

## 3. One session, slowed down (pinned, scroll-driven)

Follows the four steps on the right, and a pointer line runs from the session marker to the current step's node.

- **01 Ask:** the three phrasings (A, B, C) appear on the circle, coloured by who each one picked.
- **02 Watch:** the six pages read appear as soft plumes in reading order (01 to 06), joined by a trail, in sync with the right-hand list. Plume colour = page type; glow size = how many sessions read that type. Brand dots are hidden here to keep it clear.
- **03 Score:** rings become places in the answer (picked first, named 2nd, 3rd, 4th+, not seen) and each brand dot moves to where it landed in this session.
- **04 Fix:** a faint copy of Brand X slides from its ring to an outlined spot on the picked-first ring, with the line "The fix: move Brand X to picked first".

Background of this section: pastel sage `#E4ECDA`.

## 4. What agents read before they pick

Nine page types, one dot each at the type's angle. Distance from centre = share of sessions that opened it; dot size = number of reads; brightness = share cited. Labels with % sit inside the circle; ring labels on the north axis. Pointing at a dot stops the light and swings it onto that dot, shows its number badge and tooltip, and switches the readout on the left to that page type ("03 / 09 ..."). Moving away restarts the sweep.

## 5. Fix list

- **Mini radar per fix:** the same nine page-type dots, static, with the fix's type lit and the light parked on it.
- **Run 1 / Run 2:** drawn like the hero radar, static. Run 2 is an illustration: Brand X closer to the centre and larger, with a faint ghost at its Run 1 spot.

## 6. Method

Six topic slices round a dark centre. The light goes round three times as it scrolls into view: pass 1 lights one dot per question on the outer ring (centre counts to 48 questions); passes 2 and 3 fill the B and C phrasing rings (count goes to 144 sessions, "48 x 3"). Replays each time it enters the viewport; clicking the centre replays it too.

## 7. Field report plate

On dark green `#0A3322`. Five rings = where Brand X landed (picked first, named 2nd, 3rd, 4th or lower, not named). Each ring carries an arc whose length is that outcome's share of the 148 sessions; the five arcs sit end to end and close the full circle. A dot mid-arc shows the count, labelled with the %. Brand X greens only. Arcs draw, dots pop in and numbers count up on entry, then the light sweeps. Hover lists the sessions by topic.

## 8. Closing mark

A static "G": four concentric rings in a green gradient that open at the upper right, a crossbar from the centre to the rim, solid dark green centre. Centred in the space right of the headline.
