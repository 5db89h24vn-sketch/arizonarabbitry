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
      rabbit's listing only. The site says eight weeks is what you AIM
      for (your words, 22 Sept 2026) and that the readiness test decides,
      kit by kit; it promises no age, so leave the date out for a rabbit
      you have not dated and the site says nothing.
      The card under each photo shows how old the rabbit is today,
      worked out from dob on every visit, so it is never stale.

   ── TO RUN A PRICE DROP THAT PEOPLE CAN SEE (19 Sept 2026) ──
      set      price:    300          (what they pay now)
      add      wasPrice: 375          (what it was: struck through beside
                                       the price on the card and the listing)
      add      dealNote: "Instagram hit 100 followers"   (why, in your words:
                                       the listing prints it with the saving,
                                       "Instagram hit 100 followers, so $75 off.")
      add      dealTag:  "Instagram hit 100"   (a few words for the card's
                                       one line; optional)
      add      dealOn:   "2026-09-19"  (the day it began, for the record)
      Only an AVAILABLE rabbit shows a drop. To end it: delete wasPrice
      (and the three lines with it) and set price back, or leave price
      where it is; the site never prints an end date you did not give.

      A DROP WITH A LAST DAY (24 Sept 2026, Butterscotch at 250 followers):
      add      dealEnds: "2026-09-28"  (the day it is over; you said "ending
                                       on Monday ... reserve before Monday")
      The card says "$250 until Monday", the listing "$50 off until Monday
      28 September" with three numbered steps under it (message me before
      Monday, and a tap on "Message me" opens three pills, Instagram
      first (your preference, said under them), Text and Email, the last
      two opening the reader's own app with the message written; $50
      holds her at $250; the rest at pickup), the hero chip says the
      reason and the price, the SALE mark
      wears a flame, and the time left is counted on the hero's mark
      ("SALE · 3 DAYS, 14 HOURS LEFT") and as the first line of the
      listing's steps box ("3 days, 14 hours, 27 minutes left"; never
      seconds). All of it is worked out from the date, so nothing typed
      can go stale. The
      morning of that day the page puts wasPrice back as the price, with
      no strike, by itself; the next build writes that into this file
      (price: wasPrice, the drop lines gone, a comment left) and the
      calendar asks you what she is now.
      A DROP THAT STAYS (the August six, the same day: "make that the
      official new price ... a new standard, especially for this line"):
      add      dealStays: true
      The listing says "$25 off. That's the new price for this line, not
      a sale", the card "Instagram hit 250 · the new price", and no SALE
      mark, because a price is not a sale. The old price stays struck
      beside the new one for as long as wasPrice is here; the calendar
      asks after two weeks whether to take the strike down (delete
      wasPrice and the deal lines: $350 then simply stands). Never both
      dealEnds and dealStays on one rabbit: the build refuses it.
      A DROP THAT IS ONE RABBIT'S OWN (5 Oct 2026, Biscuit's ear): a price
      lowered for a reason that belongs to that rabbit, not to its line:
      add      dealScope: "rabbit"
      with dealStays: true. The listing then says "That's the new price for
      this rabbit, not a sale." instead of "for this line"; everything else
      is the same (the struck old price, the reason with the saving worked
      out, no SALE mark). Leave it out for a line-wide price.

   ── TO CHANGE A PRICE, WITH NO STRIKE (17 Oct 2026, Marshmallow) ──
      set      price:    350          (the new price: the card and the
                                       listing show it alone)
      add      repriced: [ { on: "2026-10-17", was: 375 } ]
                                      (the day it changed and what it
                                       was until then; a later change adds
                                       one more { on, was } to the list)
      The News page's change log keeps the day the rabbit was listed at
      the price of that day, and says each change on its own day:
      "Marshmallow $375 → $350." Without it the log would rewrite the
      listing day with today's price. For a drop people should see struck
      through, use the price drop above instead.

   ── A MARK ON THE RABBIT, SAID AND SHOWN (5 Oct 2026) ──
      A cosmetic mark a buyer should see before they ask (Biscuit's ear):

        mark: { src: "photos/biscuit-ear.jpg",
                lead: "The nick is cosmetic.",
                text: "A small piece is missing from the edge of one ear. ..." },

      The listing prints a small box right under the price's reason: the
      photograph at thumbnail size and your words, the lead in bold. Say
      what it is, what you think caused it, what it is not, and that the
      care is the same. The photograph belongs in the photos list too, with
      its date, so the strip carries the record. Dateless words only (no
      "now", "still", "today": the sweep refuses them, as in every note),
      because the box is read for as long as the rabbit is listed.
      A PAIR, ON EVERY LISTING (26 Sept 2026): nothing to add here. Every
      AVAILABLE rabbit's listing shows a pair box by itself: its available
      littermates (the same dob) as chips with their prices, or, when it
      has none, the other rabbits available; the saving, 20% of the
      cheaper of the two; your 48-hour rule (a second bought, or $50 put
      on it, within 48 hours of the first going home, keeps the 20%); and
      the RSPCA's words on company, linked. The hold rules (a $50 hold
      keeps the pair price for a month, another $50 renews it, every $50
      comes off the price, one switch free and a switch does not extend
      the month) live in the FAQ's pair answer and on the terms sheet. A
      sold or reserved rabbit shows no box.
      A DROP THAT IS STILL COMING (a milestone not yet reached) is written
      the other way round, and the site prints it as a promise: keep price
      where it is and add dealTo (the price it will drop to), dealWhen
      (the condition, in words that finish "the day ..."), dealTag (the
      card's short form, a | where it may split) and, if you like,
      dealLink + dealLinkText (one tap to the place the reader can help).
      Never write a milestone as reached before it is: the site is checked.

   ── NEW, FOR THREE DAYS (19 Sept 2026) ──
      listedOn: "2026-09-19"   is the day the rabbit went up on the site.
      For three days from it an available rabbit's card and listing wear a
      NEW mark on the photograph ("whenever we have a new posting on our
      website, I want you to have a (new) marking on it for three days").
      The build writes it the first time it sees a record without one (the
      day it builds), so type it yourself when you add a rabbit by phone
      and want the three days to start that day. Never on a reserved or
      sold rabbit.

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
      SOLD STRAIGHT FROM AVAILABLE (7 Oct 2026, your rule): paid in full
      with no reservation first is paid outright, and that counts as a
      reservation the same day, so reservedOn is the sold date too.
      Type it, or leave it out and the build writes it in for you. A
      reservation date you did give stays exactly as you typed it.
      The rabbit stays on the rail under a dated Sold label for THREE
      DAYS after that date (19 Sept 2026, your rule: "disappear into the
      archive after X amount of time after it's sold, like three days"),
      then leaves the front page on its own. Its litter tile, its archive
      entry and its link (index.html#r-<name>) keep the dated record.

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
      It leaves the rail three days after the sold date (or after this
      date, when there was no sold date), the same rule as Sold.

   ── TO MARK ONE ON A PAYMENT PLAN (17 Oct 2026, your rule; called
      "payment plan" since 18 Oct, the name people know; the badge says
      PAYING since 19 Oct, an action like RESERVED and SOLD) ──
      set      partsFrom: "2026-10-10"   (the day the first payment came in)
      Its card wears a PAYING badge on the photograph (Sold's amber, a
      dashed border: not finished yet, with the house and its clock) and
      says "Paying since 10 Oct" under the price; its tile on the litters
      page says "Paying since 10 Oct 2026", and its record says
      "Payments started 10 Oct 2026" in place of Reserved. No amount and
      no name, ever: only the words and the days.
      HOW FAR ALONG (19 Oct 2026, your words: "a percentage of completion
      for the payment without additional details on when payments have
      been paid"):
      set      planPct: 43        the share of the price received so far,
                                  a whole number from 0 to 100; the record
                                  says "Paid so far 43%". Leave it out and
                                  the record says nothing of it.
      THE DAY IT SHOULD END ("tie in a projected completion payment date"):
      set      planDue: "2026-12-10"   the day you expect the last payment;
                                  the record says "Paid off by 10 Dec
                                  2026". Empty, nothing is said.
      Both are yours to type and yours to keep current; both leave the
      record the day the plan is paid off.
      When the last payment comes in, set  paidOff: "2026-12-01"
      and the record says "Paid off 1 Dec 2026"; the card goes back to
      its state's badge (SOLD or WENT HOME, with the house) and keeps the
      plan's line under the price, "Paid off 1 Dec". Its status follows
      the rabbit, as for any sale:
        still here, being paid for:  status "reserved" (the card says
          PAYING alone, never "Reserved": a payment plan is not a
          reservation; the News says "On a payment plan: Pecan." and
          the log "Pecan, payments started.")
        paid off, still here:  status "sold", soldOn: the payoff day
          (sold means paid for and still here: "Sold 1 Dec" with the
          house, over "Paid off 1 Dec")
        gone home:  status "adopted", wentHome: the day it left (while
          the plan runs the card still says PAYING; the record says
          "Went home 16 Oct 2026")
      A rabbit on a plan stays on the front page until it is paid off,
      then three days, like a sale.

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

   ── A WOOLLY COAT (4 Oct 2026) ──
      A rabbit whose coat is long and wavy gets one line:

        coat:   "woolly",

      and its listing prints "A woolly coat needs daily grooming.", with the
      grooming answer one tap away, so a buyer who is weighing the work sees
      it on the rabbit and not only in the FAQ. Leave it out on a short coat.

   ── TO ADD A NEW RABBIT ──
      Copy any block between { and }, including the comma at the end,
      paste it in, and change the details.

   ── TO REMOVE ONE NOW ──
      Delete its whole block, from { to },

   ── RULES THE SITE HANDLES FOR YOU ──
      • Cards sort themselves: available rabbits first, then reserved,
        then sold, most expensive first within each group. Don't
        reorder them yourself; the order in this file doesn't matter.
      • The "6 available" counter updates itself.
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

   ── THE "COMING SOON" LINES ARE YOUR SHOT LIST, NOT PICTURES ──
      Each rabbit's photos list ends with five coming-soon lines, one per
      photo still to take, with the shot described in its note. NOBODY SEES
      THEM: the page filters every coming-soon frame out of the card, the
      badge, the photo view and the share page, so a rabbit with one real
      photo shows one photo and no badge. (Early on the badge counted them,
      said 6, and a tap found five apologies; that was fixed, and this note
      went on saying the opposite, which is how an outside review on 11 Sept
      2026 came to report placeholders that no visitor can reach.)
      The weekly calendar reads these lines to ask you for the photos.

      When you take one, do two things:

        1. Put the file next to index.html in the photos folder, named
           after the rabbit and the shot:  photos/teddy-hands.jpg
           (Your phone's date is stripped out when photos travel through
           chat, so I cannot read it off the file. Type it in yourself.)
        2. In that rabbit's photos list, swap the placeholder line's src
           for yours and add the date you took it:

             { src: "photos/teddy-hands.jpg", date: "2026-09-02",
               note: "In my hands, so you can see how big she really is." }

      Dated photos sort oldest first. When the last placeholder line is
      gone, delete nothing else. It just works.

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
      Its own address is #p-newdoe (5 Oct 2026: a second pair arrived, so
      every parent is addressed by its handle; #p-mother and #p-father still
      open the first of each, Cinnamony and Frederick). The litters page's
      tiles link the same address with data-parent="newdoe".
      The build refuses a rabbit whose parents are not both here, and a
      parent with no photo. Names are optional (name: "..."); without one
      the site says "The mother" and "The father", which is what William
      chose on 6 Sept 2026. Nothing about a parent is printed that is not
      typed here: no colour, no age, no line about temperament. A PARENT'S
      PAPERS (4 Oct 2026, Tango's pedigree card): variety, ear, dob and
      pedigreed (true when its card is in hand) are optional too, and print
      as the parent's record under the breed line, the way a kit's ear number
      and weight print in its own, so a pedigreed parent reads as one; the
      litters page prints the same facts under the parent's tile (sweep.py
      parent-facts). Leave out what the card leaves blank.

   ── A REEL IS A FRAME THAT OPENS INSTAGRAM (23 Sept 2026) ──
      Every reel you post of a rabbit belongs in that rabbit's photos list
      as a frame: a still from the reel in the strip with the play badge, the
      "Filmed <date> · <age that day>" pill in the corner, and over the
      picture the one button, "Watch on Instagram", which opens the reel
      itself (your words: "I much rather it just be a direct link to
      Instagram, because I'm never going to delete any of my videos"). The
      site hosts no copy of the reel and embeds nothing from Instagram. Five
      reels are five thumbnails in date order with the photographs, which is
      the timeline. Two facts from you per reel: a still and the link.

        { src: "photos/butterscotch-bumble.jpg",
          insta: "https://www.instagram.com/reel/Ddm45DLPAhr/",
          note: "Meet the bumblebunny" },

      src     a still from the reel: a screenshot of it playing (the build
              cuts it to the listing's shape), or a photo from the same day.
              Named after the rabbit and the reel, in photos/.
      insta   the reel's link: open the reel, tap the three dots, Copy link.
      note    a few words on what it shows (optional).
      date    OPTIONAL. The day the reel went up is inside every Instagram
              link (the letters after /reel/ spell the post's ID, and the ID
              carries the moment it was created), so the build reads it and
              writes  date: "2026-09-22"  in here with a note. Type your own
              date: only to say a different day, such as the day you filmed.

      A line with the link and no still yet prints nothing (a frame with no
      picture is dropped), and the weekly calendar asks you for the still.
      A clip of your own that is ALSO a reel keeps the VIDEO form below
      (video: + poster:) and adds insta: — it plays here and the caption
      gains "On Instagram". No like or view count is printed: a count typed
      here is stale within the hour, and the reel itself has the live one.

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
  },
  /* TANGO, the second purebred pair's doe (4 Oct 2026, evening). William, with
     two photos of her beside the nest box and of the box: "Liter of six,
     however, two of them haven't made it so far ... a new mom bred with the
     same buck as the previous litter ... the second [litter] for Holland lop
     purebred ... broken orange, if that's what it's called, and that's the
     doe". An hour later, her pedigree card (a screenshot): the registered
     name carries her breeder's prefix, and his word is "use this name for
     her, but remove the LMB part", so the site says Tango; "include her ear
     tattoo, since it's official, and make it look like an official pedigreed
     rabbit": the card's own facts print as her record, variety, ear number,
     birth date, exactly as the card has them, and nothing it leaves blank
     (registration, grand champion, legs, weight) is printed or implied. The
     breeder's name on the card is theirs and stays off the site. Her photo is
     dated the day it arrived, the rule since 9 Sept. 8 OCT 2026: none of her
     first litter lived (litters.html, its article), so the note says only what
     stays true, "Pedigreed.", like the other parents'; "This is her first
     litter" read as a litter still in the nest. */
  tango: {
    role:    "mother",
    name:    "Tango",
    breed:   "Holland Lop",
    variety: "Broken orange",
    ear:     "RJ1T",
    dob:     "2025-08-20",
    pedigreed: true,
    sire:    "rubberbandman",        /* the father, in ANCESTORS below */
    dam:     "jenny",
    note:    "Pedigreed.",
    photos: [
      { src: "photos/mother-orange.jpg", date: "2026-10-04" }
    ]
  },
  /* ROOT BEER, the purebred Holland Lop buck, father of both purebred litters.
     Called Copper on the site from 21 Sept (a name Claude picked at William's
     request) until 4 Oct 2026, 9:27pm, when his pedigree card arrived ("This
     is the pedigree name for the buck. Do the exact same thing for him"): the
     registered name carries his breeder's prefix, dropped at William's word
     as for Tango, so the site says Root Beer. The card's own facts print as
     his record (Tortoise, Ear # TA4T, DOB July 26, 2025, Sex Buck); what it
     leaves blank (registration, grand champion, legs, weight) is not printed
     or implied, and the breeder's name on it stays off the site. Two photos
     sent the same evening ("This is the father for that litter"): the side
     view at the bars, then his face; dated the day they arrived. */
  rootbeer: {
    role:    "father",
    name:    "Root Beer",
    breed:   "Holland Lop",
    variety: "Tortoise",
    ear:     "TA4T",
    dob:     "2025-07-26",
    pedigreed: true,
    sire:    "tinytim",        /* the father, in ANCESTORS below */
    dam:     "goldie",
    note:    "Pedigreed.",
    photos: [
      { src: "photos/father-copper.jpg", date: "2026-10-04" },
      { src: "photos/father-copper-2.jpg", date: "2026-10-04" }
    ]
  },
  /* S'MORRI, the purebred Holland Lop doe, mother of the first purebred
     litter, three born 18 Sept 2026, with Root Beer ("she also mated to the
     same buck", 4 Oct). Called Catalina on the site from 21 Sept (a name
     picked here at William's request) until 4 Oct 2026, 9:27pm, when her
     pedigree card arrived ("this is the sable point that had the babies in
     September. Same thing for her as well"): the registered name without
     the breeder's prefix, as for the other two. The card's own facts print
     as her record (Sable Point, Ear # SB1T, DOB August 2, 2025, Sex Doe);
     what it leaves blank is not printed or implied; the breeder's name and
     number on it stay off the site. Her photo: a screenshot of his phone's
     photo library sent 4 Oct, whose own caption reads "September 18 11:41",
     so the frame is dated the day his phone says it was taken; the photo
     itself never arrived (the 21 Sept copies reached a phone chat, not the
     archive). */
  smorri: {
    role:    "mother",
    name:    "S'Morri",
    breed:   "Holland Lop",
    variety: "Sable point",
    ear:     "SB1T",
    dob:     "2025-08-02",
    pedigreed: true,
    sire:    "mrstealyogirl",        /* the father, in ANCESTORS below */
    dam:     "blackbird",
    note:    "Pedigreed.",
    photos: [
      { src: "photos/mother-catalina.jpg", date: "2026-09-18" }
    ]
  },
  /* BAKALAKI, the purebred Netherland Dwarf doe, mother of the first
     Netherland Dwarf litter (born 6 Oct 2026). From her pedigree card: Opal,
     born 21 June 2025, ear number BAKALAKI; her name without her breeder's
     prefix, as for Tango and Root Beer. What her card leaves blank is not
     printed. Two photos, dated the day they arrived: in the nest box, and
     close up on the cage floor beside the fur she pulled. */
  bakalaki: {
    role:    "mother",
    name:    "Bakalaki",
    breed:   "Netherland Dwarf",
    variety: "Opal",
    ear:     "BAKALAKI",
    dob:     "2025-06-21",
    pedigreed: true,
    note:    "Pedigreed. Hand-picked for me by her breeder, who has been breeding for more than 30 years. Both her parents are Grand Champions.",
    gcParents: true,   /* the label "Grand Champion parents" (21 Oct 2026), from the note's own words */
    photos: [
      { src: "photos/mother-bakalaki-2.jpg", date: "2026-10-06" },
      { src: "photos/mother-bakalaki.jpg", date: "2026-10-06" }
    ]
  }
};

/* THE PEDIGREES (21 Oct 2026). William, with the three pedigree cards (Tango,
   Root Beer, S'Morri): "I want people to be able to click on a rabbit and
   automatically see its pedigree ... interactive to where they can click on a
   rabbit that is in our website ... a direct redirect to that rabbit so they
   can read all about it ... an effort for increased transparency on our lines
   ... it also needs to be printable as well, since I will give people a paper
   copy for every rabbit." And: "this is your foundation".

   Every rabbit on the three cards is here once, by a short key, with the
   facts its card prints for it, and its own father and mother by key: sire is
   the father, dam the mother (the pedigree's own words, kept to this file;
   the page says Father and Mother). A parent in PARENTS names its two the
   same way (sire, dam), and a baby names its parents as it always has
   (mother, father), so every pedigree on the site is worked out from here:
   three generations back from the rabbit, the depth ARBA asks for. A baby's
   three generations reach Root Beer's and S'Morri's grandparents; the cards'
   oldest row shows on the parents' own pedigrees.

   THE CARDS' FACTS AND NOTHING ELSE. Names as he asked for Tango on 4 Oct
   ("remove the LMB part"): no rabbitry's name in front of any rabbit's, no
   breeder's name, town or number. What a card leaves blank is left out here,
   and the page never prints or implies it. The one registration number on the
   cards, Cream Puff's, is carried (reg): ARBA asks for a registered ancestor's
   number on a pedigree. Every rabbit on the cards is a Holland Lop.
     variety  the colour as the card has it, written plainly
              ("Tort. - Blue" is "Blue tortoise")
     ear      the ear number (tattoo)
     lb, oz   the weight
     legs     show wins toward a Grand Champion title, as the card counts them
     wins     the card's show awards, in words, with the day
     reg      the ARBA registration number, where the card has one
     dob      the birth date (the cards print one for the first two rows only)
   Two left off on purpose: Cylindrical's name on the card goes on with a slur,
   and her ear number spells it, so both stop here; Jazz's weight reads
   "35 lb" on both cards that carry it, a typing slip, so it is not printed.
   Jenny and Goldie carry the same ear number on their cards, CJ2S, printed as
   the cards have it.

   TO ADD A CARD: one line per rabbit, its key in lowercase letters, and its
   father and mother by their keys (add them too, or leave sire/dam out where
   the card ends). Then give the parent in PARENTS its sire and dam. */
const ANCESTORS = {
  /* Tango's father's side */
  rubberbandman:     { name: "Rubber Band Man", variety: "Orange", ear: "QA3S", legs: 1, dob: "2024-04-24", sire: "quety", dam: "eeyore" },
  quety:             { name: "Quety", variety: "Orange", ear: "CP22CT", lb: 3, oz: 2, legs: 3, dob: "2022-04-11", sire: "creampuff", dam: "frostedflakes" },
  creampuff:         { name: "Cream Puff", variety: "Frosty", ear: "TVC1", lb: 3, oz: 8, legs: 2, reg: "N712R" },
  frostedflakes:     { name: "Frosted Flakes", variety: "Frosty", ear: "FF1", lb: 2 },
  eeyore:            { name: "Eeyore", variety: "Blue tortoise", ear: "BFEE", lb: 4, oz: 8, dob: "2023-07-17", sire: "indiana", dam: "fedora" },
  indiana:           { name: "Indiana", variety: "Tortoise", ear: "INA", legs: 3 },
  fedora:            { name: "Fedora", variety: "Black tortoise", ear: "FD" },
  /* Tango's mother's side (her card leaves Jenny's colour blank) */
  jenny:             { name: "Jenny", ear: "CJ2S", dob: "2024-06-07", sire: "chimnickchonga", dam: "gem" },
  chimnickchonga:    { name: "Chimnickchonga", variety: "Tortoise", ear: "CHIM", lb: 3, legs: 14, dob: "2018-11-18",
                       wins: [ { award: "Best in Show", on: "2020-01-18" }, { award: "Best Reserve in Show", on: "2020-01-18" },
                               { award: "Best Opposite Sex", on: "2020-01-18" }, { award: "Best of Breed", on: "2019-07-26" } ],
                       sire: "martin", dam: "lyzza" },
  martin:            { name: "Martin", variety: "Black tortoise", ear: "X23", lb: 3, legs: 6 },
  lyzza:             { name: "Lyzza", variety: "Black tortoise", ear: "RZLZ", lb: 3, oz: 4, legs: 1 },
  gem:               { name: "Gem", variety: "Broken", ear: "LFT1", dob: "2020-11-12", sire: "bruce", dam: "corona" },
  bruce:             { name: "Bruce", variety: "Broken", ear: "FTBF", lb: 3, oz: 12, legs: 8 },
  corona:            { name: "Corona", variety: "Black tortoise", ear: "CORONA" },
  /* Root Beer's father's side */
  tinytim:           { name: "Tiny Tim", variety: "Black tortoise", ear: "KM4S", dob: "2024-05-04", sire: "kilo", dam: "may" },
  kilo:              { name: "Kilo", variety: "Black", ear: "KILO", lb: 3, dob: "2023-02-14", sire: "chimnickchonga", dam: "jazz" },
  jazz:              { name: "Jazz", variety: "Broken black", ear: "JAZ", legs: 7 },
  may:               { name: "May", variety: "Orange", ear: "MAY", lb: 3, dob: "2020-06-01", sire: "creampuff", dam: "june" },
  june:              { name: "June", variety: "Blue tortoise", ear: "JUNE", lb: 4 },
  /* Root Beer's mother's side */
  goldie:            { name: "Goldie", variety: "Orange", ear: "CJ2S", dob: "2024-03-04", sire: "chimnickchonga", dam: "cylindrical" },
  cylindrical:       { name: "Cylindrical", variety: "Broken chinchilla", lb: 2, dob: "2020-09-09", sire: "jefferson", dam: "applejuice" },
  jefferson:         { name: "Jefferson", variety: "Broken black", ear: "JEFF", lb: 3, legs: 6 },
  applejuice:        { name: "Apple Juice", variety: "Broken black tortoise", ear: "APL" },
  /* S'Morri's father's side */
  mrstealyogirl:     { name: "Mr Steal Yo Girl", variety: "Tortoise", ear: "CR4S", dob: "2024-03-11", sire: "thad", dam: "rose" },
  thad:              { name: "Thad", variety: "Orange", ear: "TH", dob: "2022-06-27", sire: "heavenlystarlight", dam: "tequilasunrise" },
  heavenlystarlight: { name: "Heavenly Starlight", variety: "Chestnut agouti", ear: "HN2", lb: 3, oz: 13 },
  tequilasunrise:    { name: "Tequila Sunrise", variety: "Orange", ear: "TS" },
  rose:              { name: "Rose", variety: "Tortoise", ear: "ROSE", lb: 4, dob: "2022-11-23", sire: "jacques", dam: "cw" },
  jacques:           { name: "Jacques", variety: "Black tortoise", ear: "JC" },
  cw:                { name: "CW", variety: "Black tortoise" },
  /* S'Morri's mother's side (Kilo above is her grandfather too) */
  blackbird:         { name: "Black Bird", variety: "Broken", ear: "KC4S", dob: "2024-06-04", sire: "kilo", dam: "applejack" },
  applejack:         { name: "Apple Jack", variety: "Broken", ear: "CA2", dob: "2023-02-01", sire: "chimnickchonga", dam: "appletini" },
  appletini:         { name: "Appletini", variety: "Broken black", ear: "APLN", lb: 3 }
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
   ("... waiting on the first Netherland Dwarf litter").
   born: (optional) the day its litter was born, once it has been but its
   article is not on the litters page yet (2 Oct 2026: the first purebred
   Holland Lops, born 18 Sept, photos to come). The pill stays, and its
   promise becomes "before they go on sale" instead of "when it's born". */
const PLANNED = [
  /* "holland-lop" (the first purebred Holland Lops, born 18 Sept) came off
     4 Oct 2026, the day its article went on the litters page; the people who
     asked for it stay on the waitlist page under that name.
     "netherland-dwarf" (the first Netherland Dwarf litter, born 6 Oct) came
     off 6 Oct 2026 the same way; its people stay on the waitlist page under
     "the first Netherland Dwarf litter". */
];

/* WHERE THEY ENDED UP -- the homes the rabbits went to, in the owners' own
   words (11 Sept 2026). This is the one thing the site could not say for
   itself: somebody other than William confirming that a rabbit from here was
   what he said it was. An outside critique put it plainly: "The copy asserts
   it. Nobody else on the page confirms it." Nothing here is written by
   William, and nothing is shown without the owner's permission.

   THE RULES, and the page enforces the first two:
     1. permission is REQUIRED. The day the owner said the site could use their
        words (and photo, if any). A text saying "happy for you to put this on
        the site" is enough; keep it. No permission date, nothing is shown.
     2. said is THEIR words, unedited. Trimming for length is fine; rewriting
        is not. Specific beats praise: "she flopped over on my lap the first
        evening" is worth ten of "great breeder, highly recommend".
     3. No stars, no ratings, no "5/5" anywhere. Not on this site.
     4. A photo is optional and worth more than a paragraph: drop it in photos/
        under a short name; it gets the same finish as every other picture.
     5. who is a first name, or a first name and initial, as THEY want it.

   The front page shows the newest three under the rabbits for sale, hidden
   entirely while this list is empty -- an empty proof section is worse than
   none. Fields:
     who: "Maya"  where: "Tucson"  rabbit: "Teddy"  when: "2026-09"
     said: "..."  photo: "photos/home-teddy.jpg" (or "")  permission: "2026-09-12"
     gift: ""  -- if you gave them ANYTHING for the note (hay, a discount, a
               treat), name it here and the page says so beside their words.
               The FTC's reviews rule requires it, and it must never depend on
               what they wrote. Blank when nothing was given, which is the norm.
   when is the month they took the rabbit home (YYYY-MM). The rabbit's name
   becomes a link to its listing when it matches a rabbit on this list. */
const HOMES = [
];

/* CHECKED -- the last day William confirmed the listing without changing it
   (11 Sept 2026). The "current as of" stamp under the rabbits is written by
   sweep.py from the latest date anywhere in a rabbit's record: a status
   change, a weighing, a dated photograph. When nothing has changed for a
   fortnight the weekly calendar asks "is it still Teddy reserved, Butterscotch
   available?", and a "yes" is itself a fact about the listing with no record
   to carry it, so it goes here, as the day it was said (YYYY-MM-DD). The stamp
   is then the later of this and the record. Never in the future, never typed
   without William's yes, and blank means the record alone speaks.
   FROM YOUR PHONE: this is the one line to edit after you have looked at the
   pens and nothing has changed. Set it to today's date, commit, and the
   stamp on the live site moves within a minute -- the page reads it, no
   build needed. (Since 11 Sept 2026; the weekly calendar asks after 7 days.) */
const CHECKED = "";

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
    listedOn: "2026-08-24",
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
      /* HER REEL (23 Sept 2026, William: "the bumble bunny is butterscotch";
         then "I much rather it just be a direct link to Instagram"). A still
         from the reel (his screenshot, cut to 4:3 around her and the reel's
         own caption), the day it went up read from the link, and the link:
         the frame's tap opens the reel on Instagram. */
      { src: "photos/butterscotch-bumble.jpg",
        insta: "https://www.instagram.com/reel/Ddm45DLPAhr/",
        date: "2026-09-22",   /* the day it went up, read from the reel's own link by the build; type your own to say a different day */
        note: "Meet the bumblebunny" },
      { src: "photos/coming-soon-2.png", note: "Full body from the side, standing." },
      { src: "photos/coming-soon-3.png", note: "In my hands, so you can see how big she really is." },
      { src: "photos/coming-soon-4.png", note: "Ears and head close up." },
      { src: "photos/coming-soon-5.png", note: "Eating, mid-hop, or sitting in the run." },
      { src: "photos/coming-soon-6.png", note: "Next to a littermate, for colour comparison." }
    ],
    /* HER PRICE is $300, printed plain. How it got there (the follower-milestone
       drops of 19 to 28 Sept 2026) is in RABBITS-HISTORY.md on the Desktop: this
       file is public, so its notes say how to edit it, never why a price moved. */
    /* Listed again on 28 Sept 2026; an available rabbit prints no dates. THIS FILE
       IS PUBLIC (anyone can open arizonarabbits.com/rabbits.js), so nothing about
       any buyer, and no price decision, is ever written in it, not even in a
       note; that history lives in RABBITS-HISTORY.md. */
    price:  300,
    breed:  "Holland Lop cross",
    mother: "lop",
    father: "angora",
    sex:    "Doe",
    colour: "Fawn",
    dob:    "2026-07-28",
    listedOn: "2026-09-28",                    /* relisted the day she came back (first listed 24 Aug 2026); the NEW mark says she is a fresh posting for three days */
    /* ready: "22 Sept" came off on relisting: the day he expected has passed and
       she is past eight weeks, so the growth row says her age and the record
       says no date. His to give again if he wants one printed. */
    status: "available",
    ear:    "",
    weights: [],
    photo:  "photos/butterscotch.jpg",
    hero:   "img/hero-brick.jpg",              /* the brick shot that led the site from June to 27 Sept 2026; feature: true moved to Marshmallow with the sale */
    note:   "Same fawn as her sister Teddy, but a shade deeper in the sun. One ear up and one ear down in the 23 August photo, which is exactly how the lop starts."
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
    listedOn: "2026-08-24",
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
    listedOn: "2026-08-24",
    ready:  "22 Sept",
    status: "sold",
    reservedOn: "2026-08-25",
    soldOn: "2026-08-29",
    ear:    "",
    weights: [],
    departed: true,
    photo:  "photos/cloud.jpg",
    note:   "The palest of the litter and the other sable point. Same darker ears and nose as his brother, just a lighter body behind them."
  },

  /* THE AUGUST FIVE: born 27 August 2026, the third litter; five of the six,
     all fawn; the names are Claude's at his request. The sexes are not stated
     yet (sex: "" prints nothing and the pronoun is "its"), and the FAQ's
     four-week rule stands. Photographed on a brick wall on 18 September (his
     word); no capture date travels through a chat, so a photo's date is the
     day he says, else the day it arrived; the site's day is Tucson's, never
     the builder's UTC clock. Their price history is in RABBITS-HISTORY.md. */
  {
    name:   "Honey",
    photos: [
      { src: "photos/honey.jpg", date: "2026-09-18" },
      { src: "photos/coming-soon-2.png", note: "Full body from the side, standing." },
      { src: "photos/coming-soon-3.png", note: "In my hands, so you can see how big it really is." },
      { src: "photos/coming-soon-4.png", note: "Ears and head close up." },
      { src: "photos/coming-soon-5.png", note: "Eating, mid-hop, or sitting in the run." },
      { src: "photos/coming-soon-6.png", note: "Next to a littermate, for colour comparison." }
    ],
    price:  350,
    breed:  "Holland Lop cross",
    mother: "lop",
    father: "angora",
    sex:    "",
    colour: "Fawn",
    dob:    "2026-08-27",
    listedOn: "2026-09-19",
    ready:  "",
    status: "adopted",
    reservedOn: "2026-10-10",                  /* his word, 10 Oct 2026, 2:25pm Tucson: "Mark honey as reserved" */
    soldOn: "",
    wentHome: "2026-10-16",                    /* his word, 16 Oct 2026, 8:10pm Tucson: picked up "around the middle of the day" that day */
    partsFrom: "2026-10-10",                   /* paying in parts since the first payment (his word, 17 Oct 2026: "just ... say paying in parts", "a payment start date"); no amount, no name */
    paidOff: "",                               /* the day the last payment comes in: then "Paid off <date>" in its record */
    planPct: 43,                               /* the share of her price received so far (19 Oct 2026, his rule: a percentage, no amounts and no days) */
    planDue: "",                               /* the day he expects the last payment; he gives it, the record prints it */
    ear:    "",
    weights: [],
    photo:  "photos/honey.jpg",
    note:   "The one under my hand in the 18 September photo, flat to the brick and happy to stay there. Fawn all over, short coat, one ear up that day."
  },
  {
    name:   "Biscuit",
    photos: [
      { src: "photos/biscuit.jpg", date: "2026-09-18" },
      { src: "photos/biscuit-car.jpg", date: "2026-10-05" },
      { src: "photos/biscuit-ear.jpg", date: "2026-10-05", note: "The nick in one ear, from behind." },
      { src: "photos/biscuit-ear-2.jpg", date: "2026-10-05", note: "The same ear from the inside." },
      { src: "photos/coming-soon-3.png", note: "In my hands, so you can see how big it really is." },
      { src: "photos/coming-soon-5.png", note: "Eating, mid-hop, or sitting in the run." },
      { src: "photos/coming-soon-6.png", note: "Next to a littermate, for colour comparison." }
    ],
    /* William, 5 Oct 2026: "discount biscuit by $100 ... I'm not sure how the
       ear got like that, but my guess is that one of its litter mates or
       potentially the mom was grooming this rabbit and nicked a part of its
       ear out. It is all simply cosmetic ... because it's not a perfect
       rabbit, I can't have a perfect price ... all the discounts on the
       website can still be applied ... it received the same amount of care
       that every other rabbit has received ... as the rabbit gets bigger, the
       ear will also get bigger, so the bite mark will actually be less and
       less noticeable." The price is its own (dealScope), said under the
       price with the saving worked out, and the ear is shown and explained
       in the mark block right under that, in his words. */
    price:  250,
    wasPrice: 350,
    dealNote: "One ear has a small nick",
    dealTag:  "A nick in one ear",
    dealOn:   "2026-10-05",
    dealStays: true,
    dealScope: "rabbit",
    mark: {
      src:  "photos/biscuit-ear.jpg",
      lead: "The nick is cosmetic.",
      text: "A small piece is missing from the edge of one ear. I don't know how it happened; my guess is that a littermate or its mother nicked it while grooming. It is not a health problem. As it grows, so does the ear, and the nick shows less and less. It had the same care as every rabbit here and gets the same care at this price as at any price. Every discount on the site applies to it."
    },
    breed:  "Holland Lop cross",
    mother: "lop",
    father: "angora",
    sex:    "",
    colour: "Fawn",
    coat:   "woolly",
    dob:    "2026-08-27",
    listedOn: "2026-09-19",
    ready:  "",
    status: "sold",                            /* William, 6 Oct 2026: "Mark biscuit as sold", paid for that day (his answer) */
    reservedOn: "2026-10-06",                  /* no reservation date was given: sold outright, which counts as reserved the same day (his rule, 7 Oct 2026); written by the build */
    soldOn: "2026-10-06",
    ear:    "",
    weights: [],
    departed: true,
    photo:  "photos/biscuit-car.jpg",
    note:   "The fluffiest coat of the fawn ones, already wavy at three weeks. Sat up on the brick for the 18 September photo with both ears up; on the 5 October one, out in the car."
  },
  {
    name:   "Toffee",
    photos: [
      { src: "photos/toffee.jpg", date: "2026-09-18" },
      { src: "photos/coming-soon-2.png", note: "Full body from the side, standing." },
      { src: "photos/coming-soon-3.png", note: "In my hands, so you can see how big it really is." },
      { src: "photos/coming-soon-4.png", note: "Ears and head close up." },
      { src: "photos/coming-soon-5.png", note: "Eating, mid-hop, or sitting in the run." },
      { src: "photos/coming-soon-6.png", note: "Next to a littermate, for colour comparison." }
    ],
    price:  350,
    breed:  "Holland Lop cross",
    mother: "lop",
    father: "angora",
    sex:    "",
    colour: "Fawn",
    dob:    "2026-08-27",
    listedOn: "2026-09-19",
    ready:  "",
    status: "sold",                            /* William, 4 Oct 2026: "Mark toffee as both sold and reserved today" */
    reservedOn: "2026-10-04",
    soldOn: "2026-10-04",
    ear:    "",
    weights: [],
    photo:  "photos/toffee.jpg",
    note:   "The sleekest coat in the litter, short and close. Tucked up on the brick like a loaf for the 18 September photo, ears up and back."
  },
  {
    name:   "Maple",
    photos: [
      { src: "photos/maple.jpg", date: "2026-09-18" },
      { src: "photos/coming-soon-2.png", note: "Full body from the side, standing." },
      { src: "photos/coming-soon-3.png", note: "In my hands, so you can see how big it really is." },
      { src: "photos/coming-soon-4.png", note: "Ears and head close up." },
      { src: "photos/coming-soon-5.png", note: "Eating, mid-hop, or sitting in the run." },
      { src: "photos/coming-soon-6.png", note: "Next to a littermate, for colour comparison." }
    ],
    price:  350,
    breed:  "Holland Lop cross",
    mother: "lop",
    father: "angora",
    sex:    "",
    colour: "Fawn",
    dob:    "2026-08-27",
    listedOn: "2026-09-19",
    ready:  "",
    status: "sold",                            /* William, 27 Sept 2026: "sold today, and it was reserved 1 day ago" */
    reservedOn: "2026-09-26",
    soldOn: "2026-09-27",
    ear:    "",
    weights: [],
    photo:  "photos/maple.jpg",
    note:   "A fluffy coat and a shade darker across the back than the others. Ears laid back along the body in the 18 September photo."
  },
  {
    name:   "Pecan",
    photos: [
      { src: "photos/pecan.jpg", date: "2026-09-18" },
      { src: "photos/coming-soon-2.png", note: "Full body from the side, standing." },
      { src: "photos/coming-soon-3.png", note: "In my hands, so you can see how big it really is." },
      { src: "photos/coming-soon-4.png", note: "Ears and head close up." },
      { src: "photos/coming-soon-5.png", note: "Eating, mid-hop, or sitting in the run." },
      { src: "photos/coming-soon-6.png", note: "Next to a littermate, for colour comparison." }
    ],
    price:  350,
    breed:  "Holland Lop cross",
    mother: "lop",
    father: "angora",
    sex:    "",
    colour: "Fawn",
    coat:   "woolly",
    dob:    "2026-08-27",
    listedOn: "2026-09-19",
    ready:  "",
    status: "reserved",
    reservedOn: "2026-10-12",                  /* his word, 12 Oct 2026, about 8:55pm Tucson: "make sure you mark pecan as reserved today!!" */
    partsFrom: "2026-10-13",                   /* his word, 20 Oct 2026, 7:40am: "the first 50 was done on 13 October" (until then the plan was dated from her reservation day, 12 Oct, by his earlier rule; his word, 17 Oct, about 9:30pm: "pecan is also being paid in parts, but it hasn't been taken home yet ... it's being paid in parts, which is different from a reservation") */
    paidOff: "",
    planPct: 43,                               /* the share of her price received so far (20 Oct 2026, from his word that morning; his rule: a percentage, no amounts and no days) */
    planDue: "",                               /* the day he expects the last payment; he gives it, the record prints it */
    soldOn: "",
    ear:    "",
    weights: [],
    photo:  "photos/pecan.jpg",
    note:   "Long wavy coat, the woolliest of the fawn ones. Ears up and forward in the 18 September photo, chin down on the brick."
  },

  /* MARSHMALLOW, the sixth, listed 19 Sept 2026. Two photographs from the same
     wall, same day; the sitting one is the card. "White" is his word; the eyes
     and nose are described as the photographs show them. */
  {
    name:   "Marshmallow",
    photos: [
      { src: "photos/marshmallow.jpg", date: "2026-09-18" },
      { src: "photos/marshmallow-2.jpg", date: "2026-09-18", note: "Flat out on the brick, eyes shut." },
      { src: "photos/coming-soon-3.png", note: "In my hands, so you can see how big it really is." },
      { src: "photos/coming-soon-4.png", note: "Ears and head close up." },
      { src: "photos/coming-soon-5.png", note: "Eating, mid-hop, or sitting in the run." },
      { src: "photos/coming-soon-6.png", note: "Next to a littermate, for colour comparison." }
    ],
    price:  350,                               /* his word, 17 Oct 2026, evening: "make marshmallow 350" (was 375) */
    repriced: [ { on: "2026-10-17", was: 375 } ],  /* listed at $375 on 19 Sep: the News log keeps that day, and says "Marshmallow $375 → $350" on 17 Oct */
    breed:  "Holland Lop cross",
    mother: "lop",
    father: "angora",
    sex:    "",
    colour: "White",
    dob:    "2026-08-27",
    listedOn: "2026-09-19",
    ready:  "",
    status: "available",
    soldOn: "",
    ear:    "",
    weights: [],
    photo:  "photos/marshmallow.jpg",
    feature: true,                             /* the hero since 27 Sept 2026, when Butterscotch sold: the dearest rabbit available, first on the rail, settled on the brick with nothing holding her */
    note:   "The white one of the six, with a pink nose and ruby eyes. Both ears down in the 18 September photos, sitting up for one and flat out on the brick with eyes shut for the other."
  },

  /* THE FIRST PUREBREDS, listed 15 Oct 2026: S'Morri and Root Beer's three,
     born 18 Sept. William, with ten photographs from the brick by the fountain:
     "Post these two bunnies on the website. This is from the pure line. Sable
     point and tort", then the third ("I had to separate it because he looks
     like his twin brother"), then "correction, there's no gender": so no sex
     is printed. The names and the lines are Claude's, from the photographs,
     as for the August six. Each photograph is cut the way the August ones
     were (listingphoto.py, the 4:3 window slid down the frame so the whole
     rabbit and the ledge are in; Marshmallow's framing the reference, his
     ask). Dated the day they arrived. The varieties are the parents' card
     words: Sable point (S'Morri's), Tortoise (Root Beer's). */
  {
    name:   "Latte",
    photos: [
      { src: "photos/latte.jpg", date: "2026-10-15" },
      { src: "photos/latte-2.jpg", date: "2026-10-15", note: "From the side, one eye open, flat on the brick." },
      { src: "photos/latte-3.jpg", date: "2026-10-15", note: "Flat out, eyes shut." },
      { src: "photos/latte-4.jpg", date: "2026-10-15", note: "Face down on the brick, eyes shut, both ears down." },
      { src: "photos/coming-soon-3.png", note: "In my hands, so you can see how big it really is." },
      { src: "photos/coming-soon-4.png", note: "Ears and head close up." },
      { src: "photos/coming-soon-5.png", note: "Eating, mid-hop, or sitting in the run." },
      { src: "photos/coming-soon-6.png", note: "Next to a littermate, for colour comparison." }
    ],
    price:  450,
    breed:  "Holland Lop",
    mother: "smorri",
    father: "rootbeer",
    sex:    "",
    colour: "Sable point",
    dob:    "2026-09-18",
    listedOn: "2026-10-15",
    ready:  "",
    status: "sold",
    reservedOn: "2026-10-15",                  /* his word, 15 Oct 2026, evening: "latte was reserved on the 15th. so make sure you mark that" */
    soldOn: "2026-10-17",                      /* his word, 17 Oct 2026, early afternoon: "Mark latte as sold" (no day given: the day he said it) */
    ear:    "",
    weights: [],
    photo:  "photos/latte.jpg",
    note:   "The pale one of the three: a cream coat with the ears, nose and feet shaded grey-brown, which is what sable point means. Both ears down in the 15 October photos, settled on the brick by the fountain, flat out with eyes shut in two of them."
  },

  {
    name:   "Mocha",
    photos: [
      { src: "photos/mocha.jpg", date: "2026-10-15" },
      { src: "photos/mocha-2.jpg", date: "2026-10-15", note: "Face on, eyes shut, both ears down." },
      { src: "photos/mocha-3.jpg", date: "2026-10-15", note: "Flat out on the brick, eyes shut, the fountain behind." },
      { src: "photos/coming-soon-3.png", note: "In my hands, so you can see how big it really is." },
      { src: "photos/coming-soon-4.png", note: "Ears and head close up." },
      { src: "photos/coming-soon-5.png", note: "Eating, mid-hop, or sitting in the run." },
      { src: "photos/coming-soon-6.png", note: "Next to a littermate, for colour comparison." }
    ],
    price:  400,
    breed:  "Holland Lop",
    mother: "smorri",
    father: "rootbeer",
    sex:    "",
    colour: "Tortoise",
    dob:    "2026-09-18",
    listedOn: "2026-10-15",
    ready:  "",
    status: "sold",
    reservedOn: "2026-10-16",                  /* sold outright, so reserved the same day (his rule, 7 Oct 2026) */
    soldOn: "2026-10-16",                      /* his word, 16 Oct 2026, afternoon: "Mocha has just been sold!! I'm delivering it right now" */
    ear:    "",
    weights: [],
    departed: true,                            /* delivered the day it was sold, so off the rail at once; no went-home date is printed */
    photo:  "photos/mocha.jpg",
    note:   "Tortoise: a warm brown coat with smoky grey-brown on the face, the ears and the haunches, the darker of the two torts. Both ears down in the 15 October photos, settled on the brick, eyes shut for the face-on one."
  },

  {
    name:   "Nutmeg",
    photos: [
      { src: "photos/nutmeg.jpg", date: "2026-10-15" },
      { src: "photos/nutmeg-2.jpg", date: "2026-10-15", note: "Face on, eyes shut, both ears out to the sides." },
      { src: "photos/nutmeg-3.jpg", date: "2026-10-15", note: "From the side, one eye open, the fountain behind." },
      { src: "photos/coming-soon-3.png", note: "In my hands, so you can see how big it really is." },
      { src: "photos/coming-soon-4.png", note: "Ears and head close up." },
      { src: "photos/coming-soon-5.png", note: "Eating, mid-hop, or sitting in the run." },
      { src: "photos/coming-soon-6.png", note: "Next to a littermate, for colour comparison." }
    ],
    price:  400,
    breed:  "Holland Lop",
    mother: "smorri",
    father: "rootbeer",
    sex:    "",
    colour: "Tortoise",
    dob:    "2026-09-18",
    listedOn: "2026-10-15",
    ready:  "",
    status: "reserved",
    reservedOn: "2026-10-16",                  /* his word, 16 Oct 2026, 10:07am Tucson: "On the website, I want you to mark nutmeg as reserved" (no date given: the day he said it, as for Honey) */
    soldOn: "",
    ear:    "",
    weights: [],
    photo:  "photos/nutmeg.jpg",
    note:   "Tortoise like Mocha, and the two are hard to tell apart: a shade warmer and fluffier in the 15 October photos, one ear down and one out to the side in two of them, sitting up on the brick by the fountain."
  }

];
