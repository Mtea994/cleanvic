import type { Service } from "../types";

export const services: Service[] = [
  {
    slug: "carpet-cleaning",
    name: "Carpet Cleaning",
    shortDescription:
      "Hot-water extraction carpet cleaning that lifts ground-in dirt, allergens, and stains.",
    longDescription:
      "Our carpet cleaning combines pre-treatment of high-traffic lanes with truck-mount or portable hot-water extraction, lifting embedded soil and most stains in a single visit. We test for fibre type and colourfastness before any treatment, treat pet odours at the source rather than masking them, and groom pile so carpets dry faster and look their best.",
    whatsIncluded: [
      "Pre-vacuum and high-traffic lane pre-treatment",
      "Hot-water extraction with eco-conscious detergent",
      "Spot treatment on common stains (food, beverages, mud)",
      "Pet-odour neutraliser on request",
      "Pile grooming and air-mover assist for faster drying",
    ],
    process: [
      "Inspect fibre, padding, and any pre-existing damage with you on site",
      "Pre-vacuum and apply targeted pre-treatment to traffic lanes",
      "Hot-water extract section by section",
      "Spot-treat stains and re-extract",
      "Groom pile, place corner protectors, and walk you through drying time",
    ],
    faq: [
      {
        q: "How long does carpet take to dry?",
        a: "Most jobs are walkable in 2–4 hours and fully dry in 6–10 hours. Air movers and good ventilation cut that further.",
      },
      {
        q: "Will you remove every stain?",
        a: "We get most stains out — food, beverages, dirt. Permanent dye stains, bleach damage, and very old set-in stains may not fully lift; we'll tell you on inspection.",
      },
      {
        q: "Is the cleaning solution safe for kids and pets?",
        a: "Yes. We use low-VOC, eco-conscious products and rinse extract so no sticky residue is left behind.",
      },
    ],
    heroImage: "/images/hero-carpet-cleaning.jpg",
    iconName: "carpet",
    priceFrom: null,
  },
  {
    slug: "upholstery-cleaning",
    name: "Upholstery Cleaning",
    shortDescription:
      "Sofa, armchair, and dining-chair fabric cleaning with safe-for-fabric methods.",
    longDescription:
      "Upholstery is fibre-tested first — wool, linen, cotton, polyester, and microfibre each demand a different approach. We choose between hot-water extraction and low-moisture encapsulation based on the fabric, and treat odours at the source rather than masking them.",
    whatsIncluded: [
      "Pre-vacuum and dry-soil removal",
      "Fibre identification and method selection",
      "Pre-treatment of stains and traffic areas",
      "Cleaning by hot-water extraction or low-moisture encapsulation",
      "Deodorise and quick-dry pass",
    ],
    process: [
      "Inspect each piece, test for colourfastness and fibre",
      "Pre-vacuum and pre-treat",
      "Clean using the appropriate method",
      "Spot-treat any remaining marks",
      "Confirm dry time with you (typically 2–6 hours)",
    ],
    faq: [
      {
        q: "Will my couch be wet for long?",
        a: "Most couches are touch-dry in 2–4 hours. We open windows and run an air mover where it helps.",
      },
    ],
    heroImage: "/images/hero-upholstery-cleaning.jpg",
    iconName: "upholstery",
    priceFrom: null,
  },
  {
    slug: "mattress-cleaning",
    name: "Mattress Cleaning",
    shortDescription:
      "Hot-water extraction mattress cleaning with allergen and dust-mite focus.",
    longDescription:
      "Mattress cleaning targets the dust, dust mites, dead skin, and sweat that accumulate over the years. We use a UV pre-pass, hot-water extraction, and a low-moisture finish so the mattress is sleepable the same night.",
    whatsIncluded: [
      "UV pre-pass to expose biological build-up",
      "Hot-water extraction with allergen-targeted detergent",
      "Spot treatment of stains where possible",
      "Low-moisture finishing pass",
      "Dust-mite control treatment on request",
    ],
    process: [
      "Strip and inspect both sides of the mattress",
      "UV pre-pass and dry-soil removal",
      "Hot-water extract both sides",
      "Spot-treat marks",
      "Quick-dry finish — most mattresses are sleepable that night",
    ],
    faq: [
      {
        q: "Can I sleep on it the same night?",
        a: "Usually yes. Allow 4–6 hours after we finish, and most mattresses are dry to the touch.",
      },
    ],
    heroImage: "/images/hero-mattress-cleaning.jpg",
    iconName: "mattress",
    priceFrom: null,
  },
  {
    slug: "rug-cleaning",
    name: "Rug Cleaning",
    shortDescription:
      "Wool, silk, and synthetic rug cleaning — in-home or pickup-and-return.",
    longDescription:
      "Rugs are tested for fibre and colourfastness before any wet treatment. Wool and silk get gentler hand-cleaning; synthetic and cotton rugs handle hot-water extraction. We can clean in-home or pick up, clean off-site, and return.",
    whatsIncluded: [
      "Fibre and colourfastness testing",
      "Pre-vacuum (both sides where possible)",
      "Cleaning method matched to fibre",
      "Spot treatment",
      "Pickup and return option",
    ],
    process: [
      "Inspect on site or at pickup",
      "Pre-vacuum, pre-treat",
      "Clean using the method matched to the rug",
      "Dry flat or hung",
      "Return clean and groomed",
    ],
    faq: [
      {
        q: "Is in-home cleaning the same quality as off-site?",
        a: "For most synthetic and cotton rugs, yes. Wool and silk benefit from off-site flat-drying.",
      },
    ],
    heroImage: "/images/hero-rug-cleaning.jpg",
    iconName: "rug",
    priceFrom: null,
  },
  {
    slug: "tile-and-grout-cleaning",
    name: "Tile & Grout Cleaning",
    shortDescription:
      "Restorative tile and grout cleaning — bathrooms, kitchens, and tiled living areas.",
    longDescription:
      "Tile cleaning is fast; grout is the work. We rotary-scrub grout lines, then high-pressure rinse and extract. Optional grout-colour seal for bathrooms where the grout has discoloured permanently.",
    whatsIncluded: [
      "Tile and grout rotary scrub",
      "High-pressure rinse and extraction",
      "Optional sealer (penetrating or colour seal)",
      "Bathroom grout and shower glass at the same visit on request",
    ],
    process: [
      "Inspect grout condition — staining, cracking, missing grout",
      "Rotary scrub with appropriate alkaline cleaner",
      "Pressure-rinse and extract",
      "Optional sealer applied after a 24-hour dry time",
    ],
    faq: [
      {
        q: "Will sealing change the look of my tile?",
        a: "Penetrating sealers are invisible; colour-seal recolours the grout to a chosen tone. We'll show samples before sealing.",
      },
    ],
    heroImage: "/images/hero-tile-grout.jpg",
    iconName: "tile",
    priceFrom: null,
  },
  {
    slug: "deep-cleaning",
    name: "Deep Cleaning",
    shortDescription:
      "Top-to-bottom intensive cleaning for homes that need more than a regular tidy-up.",
    longDescription:
      "Deep cleaning covers the surfaces that regular cleaning skips: skirting boards, behind appliances, inside cupboards on request, light fittings, vents, and built-up bathroom soap-scum. It's the right choice before a special event, after renovations, or when you want a clean slate before starting a regular schedule.",
    whatsIncluded: [
      "Full kitchen including inside oven, microwave, and rangehood filter",
      "Full bathroom including grout, glass, and tap heads",
      "Skirting boards, light switches, and door tops",
      "Vents, ceiling fans, and accessible light fittings",
      "Inside cupboards (on request — please let us know in advance)",
    ],
    process: [
      "Walk through with you and confirm priority rooms and special requests",
      "Clear surfaces and pre-treat heavily soiled areas (oven, grout, shower)",
      "Top-down clean — fans, vents, walls, then surfaces, then floors",
      "Detail clean fixtures, fittings, switches, skirtings",
      "Final walkthrough with you before we leave",
    ],
    faq: [
      {
        q: "How is deep cleaning different from regular cleaning?",
        a: "Regular cleaning maintains; deep cleaning resets. We tackle the build-up — oven, grout, vents, skirtings — that doesn't get done weekly.",
      },
      {
        q: "Do I need to be home?",
        a: "Not required, but we recommend a brief walkthrough at the start and end so you can flag priority rooms.",
      },
    ],
    heroImage: "/images/hero-deep-cleaning.jpg",
    iconName: "deep",
    priceFrom: null,
  },
  {
    slug: "end-of-lease-cleaning",
    name: "End of Lease Cleaning",
    shortDescription:
      "Bond-back end-of-lease cleaning that meets agent and landlord inspection standards.",
    longDescription:
      "End-of-lease cleaning is a top-to-bottom reset of an empty property aimed at returning your full bond. We work to a detailed checklist agents recognise: kitchens (including inside oven and rangehood), bathrooms (grout, glass, tap heads), inside cupboards and drawers, walls spot-cleaned, skirtings, tracks, and floors. If anything is flagged on the inspection report, we come back and fix it within the agreed window.",
    whatsIncluded: [
      "Full kitchen — inside oven, rangehood, microwave, cupboards, drawers",
      "Full bathroom — grout, glass, tap heads, exhaust fan, mirror",
      "Inside cupboards, drawers, and wardrobes",
      "Walls spot-cleaned, skirtings, switches, door tops, tracks",
      "Floors vacuumed and mopped throughout",
      "Bond-back guarantee — we return to fix anything flagged on the inspection",
    ],
    process: [
      "Walkthrough on arrival to confirm scope, condition, and any flagged areas",
      "Top-down clean — ceilings/vents, walls, then surfaces, then floors",
      "Detail kitchen and bathrooms with extra time on grout, oven, glass",
      "Final walkthrough and photo record before handover",
      "Return visit if your agent flags anything in the inspection report",
    ],
    faq: [
      {
        q: "Do you guarantee my bond back?",
        a: "We guarantee our work — if your agent flags any cleaning issue on the inspection, we come back and fix it at no extra charge within the agreed window.",
      },
      {
        q: "Does it include carpet steam cleaning?",
        a: "Carpet steam cleaning is often required by lease agreements but priced separately. Tell us when you book and we'll bundle both visits.",
      },
      {
        q: "Do I need to be there?",
        a: "Not required. Most clients leave keys with us or the agent. We'll send photos and a checklist on completion.",
      },
    ],
    heroImage: "/images/hero-deep-cleaning.jpg",
    iconName: "lease",
    priceFrom: null,
  },
  {
    slug: "chimney-cleaning",
    name: "Chimney Cleaning",
    shortDescription:
      "Chimney sweeping for open fireplaces, wood heaters, and flues — sealed, HEPA-vacuumed, no soot in your room.",
    longDescription:
      "Our chimney sweeps clear the creosote, soot, and debris that build up in a flue over a season of burning — the build-up behind most chimney fires and poor draw. We work on open fireplaces, wood heaters and combustion stoves, pellet heaters, wood-fired pizza ovens, and the flues on gas log fireplaces, space heaters, and wall furnaces. Every job is sealed at the opening and swept under a HEPA vacuum, so the soot leaves in our machine rather than settling on your carpet. We sweep from inside the appliance or down from the roof, whichever the flue calls for, and finish with a draw test and a plain-English report on anything we found.",
    whatsIncluded: [
      "Full flue sweep — rods and brushes, creosote, soot, and debris removed",
      "Firebox, baffle plates, flue damper, and glass cleaned",
      "Opening sealed and swept under HEPA vacuum — no soot in the room",
      "Unoccupied bird and possum nest removal, plus debris clearing",
      "Bird/possum guard cowl or rain cap supplied and fitted on request",
      "Draw test and written condition report on the flue and appliance",
    ],
    process: [
      "Inspect the appliance and flue with you, and agree whether we sweep from inside or from the roof",
      "Seal the opening, lay drop sheets, and set the HEPA vacuum running under negative pressure",
      "Sweep the full length of the flue with rods and brushes sized to your liner",
      "Vacuum out the firebox, baffles, and damper, then clean the glass",
      "Draw test, walk you through the condition report, and fit a cowl if one is needed",
    ],
    faq: [
      {
        q: "How often should a chimney be swept?",
        a: "Once a year for anything you burn regularly — or after roughly a tonne of wood, whichever comes first. Heavy winter users and anyone burning unseasoned wood should sweep before every season, since wet wood lays down creosote far faster.",
      },
      {
        q: "Will you make a mess in my living room?",
        a: "No. We seal the fireplace opening, lay drop sheets over the hearth and surrounds, and sweep with a HEPA vacuum running so the flue is under negative pressure. The soot goes into our machine, not into your room.",
      },
      {
        q: "Do you do wood heaters and combustion stoves, or just open fireplaces?",
        a: "Both. Open fireplaces and masonry flues, freestanding and inbuilt wood heaters, combustion stoves, pellet heaters, and backyard wood-fired pizza ovens. Wood heaters need the baffle plates pulled to sweep properly, which is included.",
      },
      {
        q: "Can you clean a gas log fireplace or wall furnace?",
        a: "We clean the flue, firebox, and glass on gas log fireplaces, gas space heaters, and wall furnaces. Servicing the burner or any gas fitting itself is licensed gas work in Victoria — we refer that to our licensed gasfitter rather than touching it ourselves.",
      },
      {
        q: "There's a bird or a possum in my chimney — can you remove it?",
        a: "We remove unoccupied nests and debris, and fit a guard cowl so it doesn't happen again. If the animal is still living in the flue, Victorian wildlife law requires an authorised wildlife controller to remove it — we'll put you onto one, then come back and sweep and cap the flue.",
      },
      {
        q: "How long does a chimney sweep take?",
        a: "A standard single-flue sweep runs 45–90 minutes. Heavy creosote build-up, nest removal, or a two-storey roof-access job can push it past two hours. We'll tell you on inspection before we start.",
      },
      {
        q: "Is there any point sweeping in summer?",
        a: "Plenty — it's the easiest time to book, and a flue left full of creosote over summer draws moisture and starts corroding the liner. Sweeping in the off-season also means you're not waiting for an appointment on the first cold snap.",
      },
    ],
    // TODO: swap to /images/hero-chimney-cleaning.jpg once the real photo lands
    // (tracked in issue 0022 and public/images/CREDITS.md).
    heroImage: "/images/hero-house-cleaning.jpg",
    iconName: "chimney",
    priceFrom: null,
  },
  {
    slug: "emergency-flood-restoration",
    name: "Emergency Flood Restoration",
    shortDescription:
      "Cleanup and drying of flood-affected carpets, upholstery, and rooms after a leak or storm.",
    longDescription:
      "If a burst pipe or storm has soaked your carpet or upholstery, we extract the water, set up air movers and dehumidifiers, and clean and treat the affected area. This is cleanup work, not active emergency response — for live flooding, call a 24/7 emergency restoration provider first; we can come in once the source is stopped.",
    whatsIncluded: [
      "Water extraction from carpet and underlay",
      "Air mover and dehumidifier setup",
      "Anti-microbial treatment of affected area",
      "Carpet and upholstery cleaning once dry",
      "Honest assessment of what is and isn't salvageable",
    ],
    process: [
      "Confirm water source is stopped and area is electrically safe",
      "Extract standing water from carpet and accessible underlay",
      "Set air movers and dehumidifiers; monitor moisture",
      "Anti-microbial treatment",
      "Clean and treat carpet/upholstery once moisture levels are normal",
    ],
    faq: [
      {
        q: "Is this an emergency 24/7 service?",
        a: "No. We're a cleaning company that can help with cleanup after the active flooding has stopped. For an emergency, call a dedicated 24/7 restoration provider.",
      },
      {
        q: "Will my carpet definitely be saved?",
        a: "Sometimes the underlay and the carpet have to be replaced. We'll give you an honest assessment rather than promising a save we can't deliver.",
      },
    ],
    heroImage: "/images/hero-water-damage.jpg",
    iconName: "water",
    priceFrom: null,
  },
  {
    slug: "house-cleaning",
    name: "House Cleaning",
    shortDescription:
      "Reliable regular and one-off house cleaning — weekly, fortnightly, or monthly schedules.",
    longDescription:
      "Same cleaner each visit where possible, a checklist tailored to your home, and friendly police-checked staff. Whether you want a weekly maintenance clean or a one-off pre-event tidy, we keep the work consistent, on-time, and easy to manage.",
    whatsIncluded: [
      "Kitchen — surfaces, sink, stovetop, exterior of appliances",
      "Bathrooms — toilet, basin, shower, mirror, floor",
      "Living areas — dust, vacuum, mop, surfaces",
      "Bedrooms — dust, vacuum, mop, bed-making on request",
      "Bins emptied, recycling sorted",
    ],
    process: [
      "Walkthrough on the first visit to capture preferences and priorities",
      "Top-down clean room by room",
      "Quality check at the end of every visit",
      "Optional photo update for absent owners",
      "Adjust the checklist any time as your needs change",
    ],
    faq: [
      {
        q: "Will I get the same cleaner every time?",
        a: "Where possible, yes. Continuity matters — your cleaner learns your home and preferences. We'll let you know in advance if a substitute is needed.",
      },
      {
        q: "Do I need to provide products?",
        a: "We bring everything. If you prefer specific products (sensitivities, eco preferences), tell us and we'll use yours.",
      },
    ],
    heroImage: "/images/hero-house-cleaning.jpg",
    iconName: "house",
    priceFrom: null,
  },
  {
    slug: "commercial-cleaning",
    name: "Commercial Cleaning",
    shortDescription:
      "After-hours and daytime commercial cleaning for offices, retail, and small business.",
    longDescription:
      "Commercial cleaning tailored to your operating hours — most clients prefer after-hours so the workspace is fresh before the day begins. We handle reception, workstations, kitchens, restrooms, meeting rooms, and high-touch surfaces with consumables-restock as part of the visit.",
    whatsIncluded: [
      "Reception and entry — vacuum, mop, surfaces, glass",
      "Workstations — desk wipe (on request), bins, cable-tidy",
      "Kitchens and break rooms — dishes, surfaces, appliances exterior",
      "Restrooms — full disinfect, restock paper and soap",
      "Meeting rooms — surfaces, glass, whiteboards (on request)",
    ],
    process: [
      "Site walk and brief to scope frequency, priority zones, and access",
      "Schedule visits to your operating hours (after-hours preferred)",
      "Detailed checklist signed off each visit",
      "Monthly review and adjustment based on feedback",
      "Quarterly deep-clean option available",
    ],
    faq: [
      {
        q: "Do you carry public liability insurance?",
        a: "Yes. We carry public liability and can provide a certificate of currency on request before any commercial engagement.",
      },
      {
        q: "Can you start out-of-hours?",
        a: "Yes. Most of our commercial work is after 6pm or before 7am.",
      },
    ],
    heroImage: "/images/hero-commercial-cleaning.jpg",
    iconName: "commercial",
    priceFrom: null,
  },
  {
    slug: "window-cleaning",
    name: "Window Cleaning",
    shortDescription:
      "Streak-free interior and exterior window cleaning — single-storey and accessible upper levels.",
    longDescription:
      "Squeegee finish on the inside, water-fed pole on the outside for ground-floor and accessible upper-floor windows. Tracks vacuumed and wiped, sills wiped, screens dusted on request. We do not undertake high-rise abseil work.",
    whatsIncluded: [
      "Interior window glass — streak-free squeegee finish",
      "Exterior window glass — water-fed pole or hand-wash",
      "Tracks — vacuum and wipe",
      "Sills and frames — wipe",
      "Screens — dust on request",
    ],
    process: [
      "Walk the property and count windows / count panes",
      "Internal first, exterior after",
      "Touch-up sills and tracks",
      "Final walkthrough — any streaks called out and fixed on the spot",
    ],
    faq: [
      {
        q: "Do you do high-rise windows?",
        a: "No. We work safely from ground level using water-fed poles and from interior access. High-rise abseil work is outside our scope.",
      },
    ],
    heroImage: "/images/hero-window-cleaning.jpg",
    iconName: "window",
    priceFrom: null,
  },
  {
    slug: "oven-cleaning",
    name: "Oven Cleaning",
    shortDescription:
      "Detail oven cleaning — racks, glass, fan, and rangehood filters.",
    longDescription:
      "We strip out racks, trays, and the fan; soak everything in a heated dip tank in our van; and deep-clean the cavity by hand. Glass is taken back to clear. Most ovens are returned to as-new condition in under 90 minutes.",
    whatsIncluded: [
      "Inside cavity — hand-cleaned",
      "Racks and trays — dip-tank soak",
      "Inner and outer glass — restored to clear",
      "Fan housing and fan blade",
      "Rangehood filters (on request)",
    ],
    process: [
      "Cool oven and disconnect power if necessary",
      "Remove racks, trays, fan; soak in our dip tank",
      "Hand-clean the cavity",
      "Reassemble; clean exterior",
      "Confirm with you before leaving",
    ],
    faq: [
      {
        q: "Are the chemicals safe around food?",
        a: "We rinse fully. Once we hand the oven back, it's safe to use immediately.",
      },
    ],
    heroImage: "/images/hero-oven-cleaning.jpg",
    iconName: "oven",
    priceFrom: null,
  },
];
