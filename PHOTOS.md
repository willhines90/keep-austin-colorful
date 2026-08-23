# Photographs

The site currently has none. Everything visual is drawn in SVG, which is clean and scales, but a photograph of that grey corner would out-persuade all of it. This is the highest-value thing on the project that code cannot do.

Below is what to get and where it can legally come from.

## What I cannot do

I cannot licence images. The photographs you have already seen of the removal and of San Antonio's rainbow sidewalks belong to the Texas Tribune, KUT, the San Antonio Report and KENS5. Using them without permission would be infringement, and on a site whose entire credibility rests on being scrupulous, that is not a trade worth making.

## The four shots worth having, in order

**1. The corner as it is now.** West 4th and Colorado, grey. Shoot it from the northeast so both crossings are visible, at mid-morning or late afternoon when the light is low enough to show texture in the asphalt. This is the single most valuable image and it costs you a ten-minute walk.

**2. The same corner, same angle, with the mural in frame.** The June mural on 4th Street is real evidence that the city responded. Showing it makes the ask read as "build on this" rather than "you did nothing," which is the whole tone of the campaign.

**3. San Antonio's rainbow sidewalks.** North Main Avenue between Laurel and Park. This is the proof image: the thing you are asking for, existing, in Texas, ninety miles away. Worth the drive, and worth doing on a clear day.

**4. People at the corner.** Harder, and needs consent, but a photograph with humans in it will always outperform an empty streetscape.

## If you would rather not shoot them

**Ask the outlets.** Local newsrooms will often licence a single image to a non-commercial community campaign for a modest fee, sometimes nothing, especially if you credit prominently. Email the photo desk, say exactly which frame and where it will appear. The San Antonio Report is a nonprofit newsroom and the most likely to say yes.

**Wikimedia Commons.** Search for San Antonio Pride Cultural Heritage District and Austin 4th Street. Check the specific licence on each file, not the category. CC BY-SA requires you to credit and to share adaptations alike.

**Openverse** (openverse.org) aggregates CC-licensed images across sources and lets you filter by licence type. Filter to "modification allowed" and "commercial use allowed" so you never have to think about it again.

**Unsplash and Pexels** are unlikely to have this specific corner but do have generic Austin streetscapes if you want atmosphere rather than evidence.

**The city itself.** Photographs produced by the City of Austin are often public records. A Public Information Act request can obtain them, and the site already has a request template on the Take action page.

## Getting them into the site

Drop files into `public/img/`, keep them under about 300KB each, and use `<picture>` with a WebP source and a JPEG fallback. Then:

```bash
npm run build
```

The CSP currently allows `img-src 'self' data:`, so **self-hosted images work with no change**. If you ever hotlink from another domain you must add it to `img-src` or the browser will silently refuse to load it.

Always write real alt text. "The corner of 4th and Colorado, its crosswalk scraped back to grey asphalt" beats "photo of intersection", and on this site the alt text is part of the argument.

## Credit

Put the credit in the caption, visibly, not buried in a file name. If someone licenses you a photograph on goodwill, visible credit is the thing that makes the next person say yes too.
