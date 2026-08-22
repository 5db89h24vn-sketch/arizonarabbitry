/* ══════════════════════════════════════════════════════════════════════
   ARIZONA RABBITRY — YOUR RABBIT LIST

   This is the ONLY file you edit day to day. Never touch index.html.

   ⚠ THE SIX BELOW ARE SAMPLES so you can see the layout working.
     Replace the names, colours, dates and notes with your real rabbits
     before you launch. Nothing here describes an actual animal.

   ── TO MARK ONE RESERVED ──
      change   status: "available"
      to       status: "reserved"

   ── TO MARK ONE SOLD ──
      change   status: "available"
      to       status: "adopted"
      and set  soldOn: "2026-08-20"      (today's date, YYYY-MM-DD)
      It stays up as proof for 3 days, then disappears on its own.

   ── TO ADD A NEW RABBIT ──
      Copy any block between { and }, including the comma at the end,
      paste it in, and change the details.

   ── TO REMOVE ONE NOW ──
      Delete its whole block, from { to },

   ── RULES THE SITE HANDLES FOR YOU ──
      • Cards are sorted most expensive first, automatically. Don't
        reorder them yourself; the order in this file doesn't matter.
      • The "X of Y still available" counter updates itself.
      • Adopted rabbits vanish 3 days after their soldOn date.
      • Leave photo: "" and the site draws its own rabbit illustration.
        When you have a real photo, put the file next to index.html and
        write  photo:  "photos/clover.jpg"

   ── ADDING MORE THAN ONE PHOTO ──
      Add a photos: [ ] list and the card becomes tappable: it opens a
      bigger view with all of them, dates included. Two or more photos
      turns it on by itself. One photo or none and nothing changes.

        photos: [
          { src: "photos/clover-1.jpg", date: "2026-08-05" },
          { src: "photos/clover-2.jpg", date: "2026-08-19", note: "First time out on the rug" }
        ],

      date is optional, note is optional. Dates show as "5 Aug" under
      the photo, and the list is sorted oldest first so it reads as the
      rabbit growing up.

      HOW MANY: four to six is the sweet spot. Testing across 240+ shops
      found each photo up to about six adds roughly 5-8% to the odds of a
      sale, and past six most of that stops. Nine is the practical ceiling
      for a considered purchase like this. There's no hard limit in the
      code, but photos are the slowest thing on any page, and slower pages
      sell less, so more is not free.

      WHAT TO SHOOT: hold one back for scale (a hand, or next to something
      familiar). 71% of people who return an online purchase say the item
      didn't match the photos, and for you that's the "not as described"
      refund in the FAQ. Photos that show the truth cost you less than
      refunds do.

   ── THE ONLY WAY TO BREAK THIS ──
      Every line inside a { } block ends with a comma, except the last.
      Every block ends with },
      Keep the "quotes" around text. Numbers like price have no quotes.
      If the rabbits disappear from your site, you deleted a bracket.
      Undo the change in GitHub and it comes straight back.
   ══════════════════════════════════════════════════════════════════════ */

const RABBITS = [

  {
    name:   "Marshmallow",
    price:  400,
    breed:  "Holland Lop",
    sex:    "Doe",
    colour: "Blue-eyed white",
    ready:  "5 Sept",
    status: "available",
    soldOn: "",
    photo:  "",
    note:   "The rarest colour in this litter, and the calmest of the six. Settles in your arms within seconds."
  },

  {
    name:   "Clover",
    price:  375,
    breed:  "Holland Lop",
    sex:    "Doe",
    colour: "Broken tort",
    ready:  "5 Sept",
    status: "available",
    soldOn: "",
    photo:  "",
    note:   "First to the front of the pen every single time. Nosy in the best way."
  },

  {
    name:   "Waffles",
    price:  375,
    breed:  "Holland Lop",
    sex:    "Buck",
    colour: "Sable point",
    ready:  "12 Sept",
    status: "available",
    soldOn: "",
    photo:  "",
    note:   "Flops over the moment you start on his ears. Completely unbothered by noise."
  },

  {
    name:   "Hazel",
    price:  350,
    breed:  "Holland Lop",
    sex:    "Doe",
    colour: "Chestnut",
    ready:  "12 Sept",
    status: "available",
    soldOn: "",
    photo:  "",
    note:   "Quietest of the litter and very steady. A good first rabbit for a calmer house."
  },

  {
    name:   "Mochi",
    price:  350,
    breed:  "Holland Lop",
    sex:    "Doe",
    colour: "Blue otter",
    ready:  "",
    status: "reserved",
    soldOn: "",
    photo:  "",
    note:   "Reserved. Keeping sold and reserved rabbits visible is deliberate: it shows these prices are what people actually paid."
  },

  {
    name:   "Barley",
    price:  350,
    breed:  "Holland Lop",
    sex:    "Buck",
    colour: "Broken black",
    ready:  "",
    status: "adopted",
    soldOn: "2099-01-01",
    photo:  "",
    note:   "Dated 2099 on purpose so he stays visible while you build. Put a real date here and he retires himself after 3 days."
  }

];
