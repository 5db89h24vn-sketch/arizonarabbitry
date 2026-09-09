/* ══════════════════════════════════════════════════════════════════════
   ARIZONA RABBITS — YOUR RABBIT LIST

   This is the ONLY file you edit day to day. Never touch index.html.

   These are your real rabbits. Everything the site says about them comes from here.

   ── THE RECORD ON EVERY LISTING ──
      8 Sept 2026. Everything dated about a rabbit is now printed as ONE
      block in its listing, oldest first, each line against its own label:

        BORN       28 Jul 2026      <- the date opens that litter's page
        READY      22 Sept
        RESERVED   28 Aug 2026
        SOLD        7 Sep 2026
        WENT HOME  14 Sep 2026
        EAR NUMBER AR-24
        WEIGHT     3 lb 4 oz · 8 Sep 2026

      You do not build that block; it builds itself out of the fields
      below. A field you leave out prints NOTHING — no gap, no blank
      line, no "unknown" — and a rabbit with nothing on record shows no
      block at all. Nothing in it is ever guessed: every date there is a
      date you typed.

   ── THE READY DATE ──
      ready: "22 Sept"  is the date you expect that rabbit to be ready.
      It is printed as typed, on the Ready line, in an AVAILABLE
      rabbit's listing only. There is no fixed go-home age on the site (your
      call, kit by kit, some at eight weeks and some sooner), so leave
      it out for a rabbit you have not dated and the site says nothing.
      The card under each photo shows how old the rabbit is today,
      worked out from dob on every visit, so it is never stale.

   ── TO MARK ONE RESERVED ──
      change   status: "available"
      to       status: "reserved"
      and set  reservedOn: "2026-08-28"  (today's date, YYYY-MM-DD)
      The date shows beside Reserved on the litter tiles and on the
      Reserved line of the record — a dated record reads as a live one.
      Leave it out and the site just says Reserved; it never guesses.

   ── TO MARK ONE SOLD (paid in full, still here) ──
      change   status: "reserved"  (or "available")
      to       status: "sold"
      and set  soldOn: "2026-08-29"      (the day it was paid for)
      The rabbit STAYS on the site, growing week by week under a
      dated Sold label, until the day it actually goes home.

   ── IF A SOLD RABBIT IS NO LONGER HERE ──
      add      departed: true
      It comes off the front page at once. A listing on the rail tells
      people the rabbit is in the nursery, and the site must not say
      what isn't so. Its litter tile and archive entry keep the dated
      record ("Sold 29 Aug 2026", photo dimmed) and its link keeps
      opening. Do NOT set wentHome unless it is the real day the
      rabbit left — this site never prints a date that didn't happen.

   ── TO MARK ONE PICKED UP (it actually went home) ──
      change   status: "sold"  (or whatever it was)
      to       status: "adopted"
      and set  wentHome: "2026-09-22"    (the day it actually left)
      Only ever the REAL day it left. The build refuses a went-home
      date before the rabbit was four weeks old, because nothing is
      reserved before four weeks, so an earlier date can only be a typo.
      It stays up as proof for 7 days, then disappears on its own.

   ── THE PEDIGREE FIELDS: EAR NUMBER AND WEIGHT ──
      8 Sept 2026, William: "I want this website to paint the full timeline,
      it's more help for when we need to start making pedigrees." A pedigree
      is three generations, and ARBA wants a NAME, an EAR NUMBER, a VARIETY
      and a WEIGHT for every animal on it. The site already holds the name,
      the variety (colour) and the birth date. These two are the rest:

        ear: "AR-24",
        weights: [ { on: "2026-09-08", lb: 3, oz: 4 } ],

      ear      the tattoo in the left ear, exactly as it is written there.
      weights  every time you weigh the rabbit, add a line: the date, and
               the pounds and ounces off the scale. Oldest first. The
               listing shows the latest one with the day you took it, and
               the whole list is the record a pedigree draws on later.

      Both are optional. Leave them out and nothing prints, no gap, no
      placeholder. Start filling them in as you tattoo and weigh, and by
      the time the purebred lines are here the habit is already in place.
      One thing to know now: an ARBA pedigree needs every animal on it to
      be the SAME BREED as the rabbit being registered, so the Holland Lop
      crosses can never carry one. Their record here is still worth keeping,
      and it is what a buyer is actually asking for.

   ── TO ADD A NEW RABBIT ──
      Copy any block between { and }, including the comma at the end,
      paste it in, and change the details.

   ── TO REMOVE ONE NOW ──
      Delete its whole block, from { to },

   ── RULES THE SITE HANDLES FOR YOU ──
      • Cards sort themselves: available rabbits first, then reserved,
        then sold, most expensive first within each group. Don't
        reorder them yourself; the order in this file doesn't matter.
      • The "X of Y still available" counter updates itself.
      • Sold rabbits with departed: true never show on the front page.
      • Adopted rabbits vanish 7 days after the day they went home.

   ── THE FRONT-PAGE HERO ──
      The big photo at the top of the site is the FEATURED rabbit, and
      clicking it opens that rabbit's listing.
      • Put   feature: true   on the rabbit you want up there. Only
        AVAILABLE rabbits are ever featured — reserve or sell the
        featured one and the hero switches to the next available rabbit
        by itself. Nobody available = the classic brick photo, linking
        to the waitlist with a "Next litter" chip.
      • Optional  hero: "img/....jpg"  uses a nicer photo than the
        card photo for the hero only (that is how Butterscotch uses the
        brick shot). Optional  heroPos: "50% 40%"  nudges the crop if a
        face gets cut on tall screens.
      • Hero photos carry the welfare bar: settled, ground level,
        unrestrained, nothing to explain away.
      • Leave photo: "" and the site draws its own rabbit illustration.
        When you have a real photo, put the file next to index.html and
        write  photo:  "photos/clover.jpg"

   ── REPLACING A "COMING SOON" SLOT ──
      Every rabbit currently lists five placeholder frames after its real
      photo, so the card opens a photo view with the shots still to come.
      When you take one, do two things:

        1. Put the file next to index.html in the photos folder, named
           after the rabbit and the shot:  photos/teddy-hands.jpg
           (Your phone's date is stripped out when photos travel through
           chat, so I cannot read it off the file. Type it in yourself.)
        2. In that rabbit's photos list, swap the placeholder line's src
           for yours and add the date you took it:

             { src: "photos/teddy-hands.jpg", date: "2026-09-02",
               note: "In my hands, so you can see how big she really is." }

      Dated photos sort oldest first and the undated placeholders drop to
      the end by themselves, so the set always reads as the rabbit growing
      up with the gaps trailing behind. When the last placeholder is gone,
      delete nothing else. It just works.

      A NOTE ON THE COUNTER: the little badge on each card counts frames,
      so today it says 6 when only one is a real photograph. Anyone who
      taps it finds five Coming soon cards. That is a promise the page is
      making on your behalf, so the sooner those slots are filled the
      better. Five photos of four rabbits is about twenty minutes.

   ── ADDING MORE THAN ONE PHOTO ──
      Add a photos: [ ] list and the card becomes tappable: it opens a
      bigger view with all of them, dates included. Two or more photos
      turns it on by itself. One photo or none and nothing changes.

        photos: [
          { src: "photos/clover-1.jpg", date: "2026-08-05" },
          { src: "photos/clover-2.jpg", date: "2026-08-19", note: "First time out on the rug" }
        ],

      THE DATE IS WORTH FILLING IN. Whatever date you put on a photo gets
      stamped in the corner of that photo along with how old the rabbit was
      that day, worked out from its dob. So "date: 2026-08-24" on a rabbit
      born 28 July shows as

          24 Aug 2026 · 3 weeks, 6 days old

      A photo with no date falls back to "Born 28 Jul 2026", which is still
      true but says less. Nobody has to count weeks on their fingers, and
      the growing-up sequence explains itself.

      date is optional, note is optional. Dates show as "5 Aug" under
      the photo, and the list is sorted oldest first so it reads as the
      rabbit growing up.

      HOW MANY: five or six. Not because more angles are more charming,
      but because each photo should retire one question a person would
      otherwise have to ask you, or decide on without an answer. Once the
      questions are answered, another photo is just another slow thing on
      the page.

      Baymard Institute's usability testing is the source worth trusting
      here: 56% of people start exploring the images the moment a product
      page loads, before they read anything, and only about 25% of shops
      give them enough to decide on. Underphotographing is the common
      failure, not overphotographing.

      WHAT TO SHOOT — each of these does a job:
        1. Face on, eyes visible. This is the one that stops the scroll.
        2. Full body from the side, standing. Shape, proportion, coat.
        3. In someone's hands. Scale. "How big is this actually" is the
           question people are worst at answering from a photo alone.
        4. Ears and head close up. For a lop this is the breed
           trait people are buying, and yours are still setting.
        5. Doing something ordinary -- eating, mid-hop, sitting in the
           run. Temperament reads from behaviour, never from a portrait.
        6. Optional: alongside a littermate, for colour comparison.

      Even light, plain background, and shoot at the rabbit's eye level
      rather than from standing height. Down-angled phone photos make any
      animal look smaller and further away.

      Photograph what is actually there. Your own FAQ offers a refund if a
      rabbit is not as described, so a flattering photo is a refund you
      pay for later, plus a person who tells people about it.

   ── THE PARENTS ──
      Every rabbit names its mother and its father, and every listing shows
      them: two small photos under the birth date, one tap opens the parent's
      own view with its photos and every kit of theirs on the site, and
      Back returns to the rabbit. The parents live in PARENTS below, keyed
      by a short handle. To add a parent (a purebred line's doe or buck):

        newdoe: { role: "mother", breed: "Netherland Dwarf",
                  photos: [ { src: "photos/newdoe.jpg" } ] },

      and on each of its kits:   mother: "newdoe",   father: "somebuck",
      The build refuses a rabbit whose parents are not both here, and a
      parent with no photo. Names are optional (name: "..."); without one
      the site says "The mother" and "The father", which is what William
      chose on 6 Sept 2026. Nothing about a parent is printed that is not
      typed here: no colour, no age, no line about temperament.

   ── VIDEO ──
      A frame in any photos list can be a video instead of a photo:

        { video: "videos/teddy-hop.mp4", poster: "photos/teddy-hop-video.jpg",
          date: "2026-09-12", note: "First time out on the patio." },

      Drop the clip from your phone into the videos/ folder under a short
      name and push it. The build (video.py) does the rest. It steadies the
      camera, measures where the rabbit is in every frame and cuts a window
      of the viewer's own shape around it, so the clip fills the same frame
      the photographs fill instead of sitting in a black box. It grades the
      clip to the same numbers polish.py gives every photograph. It puts it
      into the one form every browser plays (H.264, under 12 MB and under
      2.5 Mbit a second, whatever the length; a clip over 25 MB cannot be
      uploaded to Cloudflare at all). It keeps your original untouched in the
      work folder, and cuts the poster from the best framed moment: the
      poster name above is always the clip's name plus "-video.jpg" in
      photos/, and you type it here so the page knows it before any script
      runs.

      FILMING. A clip is cut to the same shape as that rabbit's PHOTOGRAPHS,
      automatically, so the listing does not change size when somebody steps
      from a photo to the video. Film it the way you photograph that rabbit —
      upright if the photos are upright — and the crop will be small. Get
      close and keep the rabbit in the middle of the screen either way: the
      window is chosen once for the whole clip and it never zooms in.

   ── PHOTOGRAPHING ──
      Shoot it however it looks best. Sideways, upright, square — the big
      picture in a listing takes the shape of YOUR photograph, so it always
      fills the frame edge to edge with nothing cropped, nothing blurred and
      no bars. There is nothing to match and nothing to set.

      ONE THING ONLY: keep a rabbit's photos the same way up as each other.
      All of Teddy's sideways, or all of them upright. The listing is the shape
      of the first one, so a mix would make the box resize as somebody steps
      through them. Different rabbits can be different — that is fine.

      A video frame shows its poster in the listing with a play badge, and
      plays when the visitor presses play, sound on, never on its own. The
      date is the day it was filmed (the build reads it off the clip when the
      phone kept it; otherwise the day it arrived). To replace a clip, give
      the new file a NEW name: the old one is cached for a day.

   ── THE ONLY WAY TO BREAK THIS ──
      Every line inside a { } block ends with a comma, except the last.
      Every block ends with },
      Keep the "quotes" around text. Numbers like price have no quotes.
      If the rabbits disappear from your site, you deleted a bracket.
      Undo the change in GitHub and it comes straight back.
   ══════════════════════════════════════════════════════════════════════ */

/* THE PARENTS of every litter so far: the same pair. The mother is the Holland
   Lop, the father the Satin Angora (William, 6 Sept 2026). Their photos went
   through polish.py first, like every other picture, and studio.py then cut
   each rabbit out and set it on the site's plain backdrop: the rabbit is the
   photograph's own; the room behind it is not (PHOTO-SYSTEM.md, "The studio"). */
const PARENTS = {
  lop: {
    role:   "mother",
    name:   "Cinnamony",
    breed:  "Holland Lop",
    photos: [
      /* DATED THE DAY THEY ARRIVED (9 Sept 2026). William, on Frederick's
         listing: "so you have a date on the video, but not on this picture??"
         The video carried its own time stamp and these two carried none -- a
         phone photo sent through a chat has its metadata stripped, so there
         was no capture time to read, and an undated frame prints no stamp.
         Asked what date they should carry, he chose the day he sent them,
         which is the rule the litter photos already follow. */
      { src: "photos/mother.jpg", date: "2026-09-06" },
      { src: "photos/mother-2.jpg", date: "2026-09-06" }
    ]
  },
  angora: {
    role:   "father",
    name:   "Frederick",
    breed:  "Satin Angora",
    photos: [
      /* 7 Sept 2026: his portrait on the brick ledge, the same ledge the kits
         are photographed on, sent with the words "This is the dad!"; the
         studio frame from the day before stays as a second view */
      { src: "photos/father-2.jpg", date: "2026-09-07" },
      /* 8 Sept 2026: the studio cut-out of him came off ("remove that middle
         picture where the background is cropped out"). The mother keeps hers
         for now, as a placeholder until there is a real photograph of her. */
      /* the first video on the site (7 Sept 2026, William: "let's have video
         support for our website now for more views on how our rabbits look").
         The clip carried its own time stamp, 7 Sept 2026, 10:11 Tucson. */
      { video: "videos/father.mp4", poster: "photos/father-video.jpg", date: "2026-09-07",
        note: "Twenty seconds in a planter, nibbling." }
    ]
  }
};

/* THE LITTERS YOU ARE PLANNING (7 Sept 2026). William: "an option to be alerted
   for an individual litter that's coming up", and, asked whether the two
   purebred lines he is planning should be choices before they are born, "add
   the two purebred lines now". Each entry becomes a pill on the front page's
   waitlist ("The first purebred Holland Lop litter") and a list of its own
   in the waitlist counter, so somebody can ask to hear about that one litter
   and nothing else. No date is printed anywhere: the plan's window is his
   own sentence on the About, and a pill promises only an email when the
   litter is born.
   TO REMOVE ONE: when that litter is born and its article is on the litters
   page, delete its entry here. The people who asked for it stay on William's
   waitlist page under the plan's name, ready to copy for the email.
   key: letters, digits and hyphens only; it is the list's name in the counter
   (P<key>) and must not change once people are on it.
   name: the pill's words, lowercase first letter, as it reads in a sentence
   ("... waiting on the first Netherland Dwarf litter"). */
const PLANNED = [
  { key: "holland-lop",      name: "the first purebred Holland Lop litter" },
  { key: "netherland-dwarf", name: "the first Netherland Dwarf litter" }
];

const RABBITS = [

  {
    name:   "Teddy",
    photos: [
      { src: "photos/teddy.jpg", date: "2026-08-23" },
      { src: "photos/coming-soon-2.png", note: "Full body from the side, standing." },
      { src: "photos/coming-soon-3.png", note: "In my hands, so you can see how big she really is." },
      { src: "photos/coming-soon-4.png", note: "Ears and head close up." },
      { src: "photos/coming-soon-5.png", note: "Eating, mid-hop, or sitting in the run." },
      { src: "photos/coming-soon-6.png", note: "Next to a littermate, for colour comparison." }
    ],
    price:  375,
    breed:  "Holland Lop cross",
    mother: "lop",
    father: "angora",
    sex:    "Doe",
    colour: "Fawn",
    dob:    "2026-07-28",
    ready:  "22 Sept",
    status: "sold",
    reservedOn: "2026-08-28",
    soldOn: "2026-09-07",
    ear:    "",
    weights: [],
    photo:  "photos/teddy.jpg",
    /* EARS: DESCRIBE, DO NOT PROMISE. This said "They lop on their own over the
       next few weeks", which is a guarantee about how an individual animal's body
       will develop. Ear carriage in a young lop is not certain, and a buyer who is
       told it will happen and then finds it did not has been misled about the one
       feature the breed is named for. Say what is true today and what is usual. */
    note:   "Solid fawn all over, like a little bear. In the 23 August photo both ears stand up. Most lop over the following weeks, and I only ever describe what the dated photo shows."
  },

  {
    name:   "Butterscotch",
    photos: [
      { src: "photos/butterscotch.jpg", date: "2026-08-23" },
      { src: "photos/coming-soon-2.png", note: "Full body from the side, standing." },
      { src: "photos/coming-soon-3.png", note: "In my hands, so you can see how big she really is." },
      { src: "photos/coming-soon-4.png", note: "Ears and head close up." },
      { src: "photos/coming-soon-5.png", note: "Eating, mid-hop, or sitting in the run." },
      { src: "photos/coming-soon-6.png", note: "Next to a littermate, for colour comparison." }
    ],
    price:  375,
    breed:  "Holland Lop cross",
    mother: "lop",
    father: "angora",
    sex:    "Doe",
    colour: "Fawn",
    dob:    "2026-07-28",
    ready:  "22 Sept",
    status: "available",
    soldOn: "",
    ear:    "",
    weights: [],
    photo:  "photos/butterscotch.jpg",
    feature: true,
    hero:   "img/hero-brick.jpg",
    note:   "Same fawn as her sister but a shade deeper in the sun. One ear up and one ear down in the 23 August photo, which is exactly how the lop starts."
  },

  {
    name:   "Sundae",
    photos: [
      { src: "photos/sundae.jpg", date: "2026-08-23" },
      { src: "photos/coming-soon-2.png", note: "Full body from the side, standing." },
      { src: "photos/coming-soon-3.png", note: "In my hands, so you can see how big he really is." },
      { src: "photos/coming-soon-4.png", note: "Ears and head close up." },
      { src: "photos/coming-soon-5.png", note: "Eating, mid-hop, or sitting in the run." },
      { src: "photos/coming-soon-6.png", note: "Next to a littermate, for colour comparison." }
    ],
    price:  350,
    breed:  "Holland Lop cross",
    mother: "lop",
    father: "angora",
    sex:    "Buck",
    colour: "Sable point",
    dob:    "2026-07-28",
    ready:  "22 Sept",
    status: "sold",
    reservedOn: "2026-08-25",
    soldOn: "2026-08-29",
    ear:    "",
    weights: [],
    departed: true,
    photo:  "photos/sundae.jpg",
    note:   "A sable point, so the cream body carries darker ears and nose. Those points keep deepening as he grows. First of the four with both ears fully lopped."
  },

  {
    name:   "Cloud",
    photos: [
      { src: "photos/cloud.jpg", date: "2026-08-23" },
      { src: "photos/coming-soon-2.png", note: "Full body from the side, standing." },
      { src: "photos/coming-soon-3.png", note: "In my hands, so you can see how big he really is." },
      { src: "photos/coming-soon-4.png", note: "Ears and head close up." },
      { src: "photos/coming-soon-5.png", note: "Eating, mid-hop, or sitting in the run." },
      { src: "photos/coming-soon-6.png", note: "Next to a littermate, for colour comparison." }
    ],
    price:  350,
    breed:  "Holland Lop cross",
    mother: "lop",
    father: "angora",
    sex:    "Buck",
    colour: "Sable point",
    dob:    "2026-07-28",
    ready:  "22 Sept",
    status: "sold",
    reservedOn: "2026-08-25",
    soldOn: "2026-08-29",
    ear:    "",
    weights: [],
    departed: true,
    photo:  "photos/cloud.jpg",
    note:   "The palest of the litter and the other sable point. Same darker ears and nose as his brother, just a lighter body behind them."
  }

];
