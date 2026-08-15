# Image requests, ready to send

Four emails. The first two are the ones that matter; the fourth is free and you should send it regardless.

Send from whatever address you plan to publish on the site, so the reply lands somewhere you will see it.

---

## 1. San Antonio Report — the proof image

The most valuable photograph on the internet for this campaign is San Antonio's rainbow sidewalks. It is the thing you are asking for, existing, in Texas. The San Antonio Report is a **nonprofit newsroom**, which makes it by far the most likely to say yes.

> **Subject:** Image licence request, rainbow sidewalks on North Main
>
> Hello,
>
> I run a small non-commercial community project in Austin called Keep Austin Colorful. It makes the case that Austin could restore rainbow visibility at 4th and Colorado the way San Antonio did on North Main: by treating the sidewalk rather than the roadway, which sits outside the state's order.
>
> Your reporting is central to that argument, and I cite it throughout. I would like to ask about licensing a single photograph of the North Main rainbow sidewalks for use on the site.
>
> The site is non-commercial, has no budget and carries no advertising. It is open source and every claim on it links to its source. I would credit prominently in the caption, with a link to the original article, and I am happy to agree to any wording you prefer.
>
> If there is a fee I would like to know it, and if licensing is not something you do for projects like this I completely understand.
>
> The site: [URL]
> The article I am citing: https://sanantonioreport.org/san-antonio-installs-pride-district-sidewalk-art-after-crosswalk-removal/
>
> Thank you,
> [NAME]

---

## 2. KUT — the vigil

KUT covered the vigil at the corner. A photograph with seventy-five people in it does something no streetscape can.

KUT is a public radio station licensed to UT Austin, so it has an educational mission and a community remit. Worth asking.

> **Subject:** Image licence request, 4th Street vigil, 22 July
>
> Hello,
>
> I run a non-commercial community project in Austin called Keep Austin Colorful, making the case that the city can restore rainbow visibility at 4th and Colorado by treating the sidewalk, as San Antonio did.
>
> I cite your coverage of the vigil, and I would like to ask about licensing one photograph from it for the site. It is non-commercial, unfunded and carries no advertising. I would credit visibly in the caption and link to your article.
>
> If there is a fee, or if this is not something you licence, please just say and I will not press.
>
> The site: [URL]
> The article: https://www.kut.org/transportation/2026-07-22/austin-tx-lgbtq-vigil-rainbow-crosswalks-4th-street
>
> Thank you,
> [NAME]

---

## 3. Austin Pride Foundation — a partner, not just a source

Austin Pride has [a page about the crosswalk](https://austinpride.org/crosswalk/). They likely hold their own photographs, and unlike a newsroom they have an interest in this succeeding. This email is worth sending even if the images come to nothing.

> **Subject:** Photographs of the 4th Street crosswalk, and a project you might like
>
> Hello,
>
> I have built a small open-source site called Keep Austin Colorful, which makes the case that the city can restore rainbow visibility at 4th and Colorado by treating the sidewalk rather than the roadway. San Antonio did exactly that on North Main, legally, and it needed no council vote because that corridor holds Pride Cultural Heritage District status.
>
> Two things.
>
> First, if you hold photographs of the crosswalk, before or after, I would love to ask about using one, with credit.
>
> Second, and more importantly, if this is useful to you please take it. It is open source and free to adapt, and it would be far more effective coming from Austin Pride than from one neighbor.
>
> The site: [URL]
>
> Thank you,
> [NAME]

---

## 4. City of Austin — free, and you already have the template

Photographs taken by city staff are public records. The Take Action tab already has a Public Information Act request; this is a narrower version for images.

> **Subject:** Public Information Act request, photographs of 4th and Colorado
>
> To the City of Austin Public Information Office,
>
> Under the Texas Public Information Act, Chapter 552 of the Government Code, I request copies of the following:
>
> 1. Any photographs held by the City of the rainbow crosswalk at West 4th Street and Colorado Street, before, during or after its removal in July 2026.
> 2. Any photographs held by the City of the mural installed on West 4th Street in June 2026.
>
> I would prefer to receive these electronically. If fulfilling this request will exceed $40 in charges, please contact me with an estimate first.
>
> Thank you,
> [NAME]
> [EMAIL] / [ADDRESS]

Records obtained this way are generally free to reuse, though the city may assert rights in some circumstances. Ask about permitted use in the same message.

---

## The one that costs nothing and needs no permission

**Walk to the corner and photograph it yourself.** Ten minutes. You own the copyright outright, no email, no waiting, no fee, and it is the single most valuable image on the list. Everything above is for the photographs you cannot take.

Shoot from the northeast so both crossings are in frame, mid-morning or late afternoon for low light on the asphalt. Get the mural in a second frame. If you drive to San Antonio, North Main between Laurel and Park.

## Once you have one

Drop the file into `public/img/`, uncomment the entry in the `PHOTOS` array in `public/index.html`, fill in the alt text, caption and credit, then:

```bash
npm run build:meta && npm test
```

The slot is already built and hidden until an image exists. Self-hosted files need no CSP change.
