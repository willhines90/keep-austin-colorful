# Logo brief, and the unsolved problem

The current mark is the letters **ATX**, filled edge to edge with the six-stripe
Pride flag. It is in the site header and it works. This document is about the
one thing that does not.

## The open problem: incorporating the trans flag

Three attempts are in `tools/build-logos.js`, all marked as unresolved
experiments. None of them is good enough to ship, and it is worth writing down
exactly why, because the next attempt should not rediscover it.

**1. Letters filled with the trans flag.** The trans flag's middle stripe is
white. Inside letterforms on a pale background, the heart of every letter
disappears — the A becomes two legs, the T loses its stem. The only fix was to
put the mark on a dark tile, which "works" but makes the trans version
conditional on a container the Pride version does not need. Two marks with two
different construction rules is not a system.

**2. Progress Pride chevron inside the letters.** At the size the header
actually renders (52px wide), five chevron bands across roughly a third of the
mark compress to under two pixels each. It reads as a grey smear with a dark
edge. The chevron is also a *diagonal* form clipped inside *vertical* stems, so
it fights the letterforms rather than sitting in them.

**3. Progress Pride as a knockout tile.** The chevron reads at this size, but
the tile is 40% wider than the primary mark, and the black band at the outer
edge reads as a hole punched in the corner rather than as a stripe.

**The underlying issue is not technical.** It is that a 52px monogram is being
asked to carry two flags at once. The Pride flag already occupies the whole
mark; the trans flag has to either displace it, shrink inside it, or sit beside
it. Every one of those is a design decision about emphasis, not a rendering
problem, and it is the reason none of the three attempts feels right.

Directions that have **not** been tried and look more promising:

- The trans flag somewhere other than the monogram — the hairline rule at the
  top of each section, the footer bar, or a second mark used only where the
  campaign speaks specifically to trans Austinites
- A two-mark system: Pride ATX as the wordmark, a trans-flag device as a
  companion, never merged
- The trans colors as the site's *secondary* palette rather than inside the logo
- Losing the monogram entirely and letting the flag be the mark, with the
  wordmark set in type beside it

## Constraints, whatever the direction

| | |
|---|---|
| **Renders at** | 52px wide in the header, 18px in a favicon, and up to a 1200px share card |
| **Grounds** | `#f8f7f4` paper and `#141019` near-black. Must work on both, unmodified |
| **Format** | Flat vector. No gradients, no shadows, no bevels, no texture — it has to become clean SVG |
| **Colors** | Pride: `#e40303 #ff8c00 #ffd500 #008026 #24408e #732982`. Trans: `#5BCEFA #F5A9B8 #FFFFFF` |
| **Tone** | Warm, civic, hand-made. An invitation, not a protest placard. The site's whole strategy is being something a city can say yes to |
| **Type** | Poppins for display. The monogram is custom, geometric, heavy |

---

# AI image-generation prompt

Image tools cannot draw accurate lettering, and they cannot produce SVG. Use
them for **direction only** — silhouette, composition, colour behaviour — then
redraw the winner as vector in `tools/build-logos.js`. Judge the thumbnails, not
the letterforms.

## The master prompt

> Flat vector logo design sheet, 9 variations in a 3×3 grid on a warm off-white
> background `#f8f7f4`, each variation in its own bordered cell with generous
> whitespace.
>
> Subject: a wordmark for a civic campaign in Austin, Texas called **Keep Austin
> Colorful**, which asks the city to paint a rainbow sidewalk on a corner where
> a rainbow crosswalk was removed. The mark is the three letters **ATX** in a
> heavy geometric sans, and it carries the LGBTQ+ Pride flag and the transgender
> flag together.
>
> Explore nine different ways to combine the letters with the two flags: stripes
> inside the letters; letters reversed out of a striped field; a striped rule or
> bar beside the letters; the letters half one flag and half the other; a small
> companion device sitting next to the wordmark; a painted-sidewalk or
> crosswalk-bar motif reading as stripes; letters built from paint strokes;
> a badge or tile lockup; stripes running diagonally through the letters.
>
> Colours, exactly: Pride red `#e40303`, orange `#ff8c00`, yellow `#ffd500`,
> green `#008026`, blue `#24408e`, purple `#732982`; trans light blue `#5BCEFA`,
> trans pink `#F5A9B8`, white.
>
> Style: flat 2D vector, solid fills only, crisp geometric edges, high contrast,
> the confident simplicity of a municipal identity system or a screen-printed
> civic poster. Warm and welcoming rather than militant.
>
> Every variation must stay legible as a small silhouette, roughly 50 pixels
> wide, and must read on both a pale and a near-black background.
>
> No gradients, no drop shadows, no 3D, no bevels, no glow, no photographic
> texture, no paper grain, no mockups, no hands, no people, no rainbow arcs, no
> emoji, no clip art, no extra words or taglines beyond the letters ATX.

## Nine directions worth running individually

Run the grid first, then take the two or three that survive and run each on its
own for a cleaner result. Reuse the constraints paragraph each time.

1. **Split field.** ATX where the upper half of the letters carries the Pride
   stripes and the lower half the trans stripes, divided by one clean horizontal.
2. **Companion device.** Pride-filled ATX with a small separate trans-flag
   shape — a square, a rounded tab, a slab — locked beside it at the baseline.
3. **Underline.** Solid dark ATX sitting on a thick trans-flag rule, the way a
   painted street stripe sits under a kerb.
4. **Crosswalk bars.** The letters constructed from the parallel bars of a
   painted crosswalk, alternating Pride and trans colours.
5. **Diagonal.** Stripes running at roughly 30 degrees through the letterforms,
   so the two flags read as one continuous sweep rather than two stacks.
6. **Knockout tile.** A rounded tile of Pride stripes with ATX cut out of it,
   and a trans-flag edge or spine along one side.
7. **Paint stroke.** Letters that look brushed or rolled on, with visible flat
   stroke ends, in both palettes.
8. **Capitol silhouette.** The Texas Capitol dome reduced to a simple geometric
   shape, striped, sitting inside or beside the letters.
9. **Sidewalk perspective.** The stripes in one-point perspective, as if painted
   on a pavement receding from the viewer, with ATX reading across them.

## Per-tool notes

- **Midjourney** — append `--ar 1:1 --style raw --v 7`. Add `--no gradient,
  shadow, 3d, texture, photo` if the negatives above are ignored. For a single
  direction, `--ar 3:2` gives the mark more room.
- **GPT Image / DALL·E** — paste the master prompt as-is; it handles the grid
  instruction and the hex codes better than most. Ask it to "keep the letters
  ATX identical in every cell" to isolate the treatment variable.
- **Ideogram** — the best of the current tools at legible lettering, so this is
  the one to trust for anything where ATX must be readable. Use Design mode.
- **Firefly** — choose Vector / Graphic as the content type; its output is
  closest to something you can actually trace.
- **Stable Diffusion** — add `flat vector, logo, sticker, simple` to the prompt
  and `photorealistic, 3d, gradient, noise, blurry, watermark, text` to the
  negative prompt.

## How to judge the output

Shrink every candidate to 52 pixels wide before deciding anything. Most will
fail there, and that is the only test that matters for a header mark. Then check
it on `#141019`. Then check whether the trans flag is still legible as *the
trans flag* rather than as some pink and blue.

Anything that survives all three gets redrawn as vector. Nothing generated
should ship directly.
