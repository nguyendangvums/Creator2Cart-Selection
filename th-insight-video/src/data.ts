// Content distilled from "[TH] YouTube Creator Content Insight 2026".
// Copy is trimmed for video: one idea per beat, short labels, no sales asks.

export type Stat = {value: string; label: string};
export type Item = {icon: string; title: string; desc?: string};
export type Moment = {date: string; label: string};
export type Creator = {name: string; subs: string};

export type Section = {
  num: string;
  short: string; // pill label
  pre: string;
  title: string;
  desc: string;
  icon: string;
  cover: string;
  fact: {stat: string; headline: string; soWhat: string; icon: string; source: string};
  proof: {
    headline: string;
    sub: string;
    chart?: {label: string; value: number; display: string}[];
    stats: Stat[];
    source: string;
  };
  play: {headline: string; formats: Item[]; moments: Moment[]};
  brand: {categories: Item[]; ideas: Item[]};
  creators: {headline: string; sub: string; list: Creator[]; avatarPage: string};
};

export const sections: Section[] = [
  {
    num: '01',
    short: 'Series Nation',
    pre: 'The pull of',
    title: 'Series Nation',
    desc: "Lakorn, BL series and variety: Thailand's TV now lives on YouTube.",
    icon: 'p04_028',
    cover: 'cover05',
    fact: {
      stat: 'Top 3',
      headline: "Thailand's three most-subscribed channels are *TV channels*, not creators",
      soWhat: 'Thai families made YouTube their TV guide.',
      icon: 'p06_044',
      source: 'Social Blade, Thailand channel ranks (Sep 2026)',
    },
    proof: {
      headline: "Thai TV is YouTube's *biggest show*",
      sub: 'Subscribers, millions',
      chart: [
        {label: 'one31', value: 45.1, display: '45.1M'},
        {label: 'Workpoint', value: 44, display: '44M'},
        {label: 'Ch3Thailand', value: 37, display: '37M'},
        {label: 'GMMTV', value: 20.9, display: '20.9M'},
        {label: 'Ch7HD', value: 19.7, display: '19.7M'},
      ],
      stats: [
        {value: '฿4.9B+', label: 'BL & GL series industry, growing ~17% a year'},
        {value: '44.7B', label: "lifetime views on Workpoint's channel"},
      ],
      source: 'Social Blade (Sep 2026); Nation Thailand (Jun 2026); The Geekiary (Nov 2025)',
    },
    play: {
      headline: 'Every episode, every clip, *every screen*',
      formats: [
        {icon: 'p08_046', title: 'Full episodes'},
        {icon: 'p08_048', title: 'Highlights & scenes'},
        {icon: 'p08_050', title: 'BL & GL fandom'},
        {icon: 'p08_052', title: 'Variety & game shows'},
      ],
      moments: [
        {date: 'Late Nov 2026', label: 'GMMTV 2027 lineup reveal'},
        {date: 'Q4 2026', label: 'New prime-time lakorn season'},
        {date: '31 Dec 2026', label: 'New Year countdown specials'},
        {date: 'Always-on', label: 'Daily clips after broadcast'},
      ],
    },
    brand: {
      categories: [
        {icon: 'p09_062', title: 'FMCG & Household'},
        {icon: 'p09_064', title: 'Beauty & Skincare'},
        {icon: 'p09_066', title: 'Telco & Devices'},
        {icon: 'p09_068', title: 'Banking & Insurance'},
      ],
      ideas: [
        {icon: 'p09_070', title: 'In-series placement', desc: "Your product in the story, in the cast's voice"},
        {icon: 'p09_072', title: 'Fandom partner', desc: 'Fan meets, behind the scenes, couple content'},
        {icon: 'p09_074', title: 'Own the highlights', desc: "Every clip of the week's big episode"},
      ],
    },
    creators: {
      headline: 'Creators: series & TV',
      sub: 'Networks and series studios',
      avatarPage: 's10',
      list: [
        {name: 'one31', subs: '45.1M'},
        {name: 'WorkpointOfficial', subs: '44M'},
        {name: 'Ch3Thailand', subs: '37M'},
        {name: 'GMMTV OFFICIAL', subs: '20.9M'},
        {name: 'Ch7HD', subs: '19.7M'},
        {name: 'Thai Ch8', subs: '17.7M'},
        {name: 'GMM25Thailand', subs: '16.4M'},
        {name: 'ZENSE MORE', subs: '8.38M'},
        {name: 'GDH', subs: '1.73M'},
      ],
    },
  },
  {
    num: '02',
    short: 'Luk Thung x Rap',
    pre: 'The sound of',
    title: 'Luk Thung x Rap',
    desc: 'Country roots met rap, and Thai artists took every spot on the chart.',
    icon: 'p04_030',
    cover: 'cover13',
    fact: {
      stat: '554M',
      headline: "views made a *51-year-old mor lam singer* Thailand's #1 artist on YouTube in 2024",
      soWhat: 'Country music is not niche. Speak Isan, reach the biggest music crowd.',
      icon: 'p14_138',
      source: 'YouTube Charts Thailand 2024, via Nation Thailand (Jan 2025)',
    },
    proof: {
      headline: 'Every top music video in Thailand *is Thai*',
      sub: '',
      stats: [
        {value: '10 of 10', label: 'top music videos of 2025 were Thai'},
        {value: '22.3M', label: 'subscribers for Grammy Gold, a luk thung label'},
        {value: '27M+', label: 'views for "Bangkok City" by Kradaeng Arsayam'},
      ],
      source: 'YouTube Thailand year-end lists (Dec 2025); Social Blade (Sep 2026); Google (Sep 2026)',
    },
    play: {
      headline: "Fans don't just listen. They *sing, dance and join in*",
      formats: [
        {icon: 'p16_148', title: 'Music videos'},
        {icon: 'p16_150', title: 'Live & festival cuts'},
        {icon: 'p16_152', title: 'Dance & cover Shorts'},
        {icon: 'p16_154', title: 'Collabs & features'},
      ],
      moments: [
        {date: '24 Nov 2026', label: 'Loy Krathong festival stages'},
        {date: '12 to 13 Dec 2026', label: 'Big Mountain, Khao Yai'},
        {date: 'Dec 2026', label: 'Year-end charts and recaps'},
        {date: '13 to 15 Apr 2027', label: 'Songkran party season'},
      ],
    },
    brand: {
      categories: [
        {icon: 'p17_164', title: 'Beverages & Snacks'},
        {icon: 'p17_166', title: 'Mobile & Telco'},
        {icon: 'p17_168', title: 'Motorbikes & Auto'},
        {icon: 'p17_170', title: 'E-wallets & Banking'},
      ],
      ideas: [
        {icon: 'p17_172', title: 'Artist feature', desc: 'A brand-backed collab track or live session'},
        {icon: 'p17_174', title: 'Festival partner', desc: 'Own the stage cuts, Loy Krathong to Songkran'},
        {icon: 'p17_176', title: 'Cover challenge', desc: 'Fans cover the hook in Shorts'},
      ],
    },
    creators: {
      headline: 'Creators: luk thung, rap & pop',
      sub: 'Labels and artists fans replay',
      avatarPage: 's18',
      list: [
        {name: 'GMM GRAMMY OFFICIAL', subs: '26.1M'},
        {name: 'GRAMMY GOLD OFFICIAL', subs: '22.3M'},
        {name: 'RsiamMusic', subs: '20.5M'},
        {name: 'Genierock', subs: '17.3M'},
        {name: 'welovekamikaze', subs: '10.2M'},
        {name: 'LLOUD Official', subs: '9.17M'},
        {name: 'Grammy Big', subs: '8.18M'},
        {name: 'Illslick thelegandary', subs: '7.4M'},
        {name: 'FHERO Official', subs: '1.16M'},
      ],
    },
  },
  {
    num: '03',
    short: 'Ghost Stories',
    pre: 'The thrill of',
    title: 'Ghost Stories',
    desc: 'Call-in horror shows, karma tales and ghost hunts, watched late into the night.',
    icon: 'p04_032',
    cover: 'cover21',
    fact: {
      stat: '2 of 10',
      headline: "Two of YouTube Thailand's top 10 creators of 2025 *tell ghost stories*",
      soWhat: 'Horror is mainstream prime time, with long late-night sessions.',
      icon: 'p22_240',
      source: 'YouTube Thailand year-end lists, top creators (Dec 2025)',
    },
    proof: {
      headline: 'Thai horror fills *radios, cinemas and screens*',
      sub: '',
      stats: [
        {value: '6.3B', label: 'lifetime views for The Ghost Radio'},
        {value: '฿465M', label: 'for Death Whisperer 3 at the box office'},
        {value: '฿31.5M', label: 'opening week for a film born from a Ghost Radio story'},
      ],
      source: 'Social Blade (Sep 2026); Death Whisperer 3 (Oct 2025); Thairath (Dec 2025)',
    },
    play: {
      headline: 'Stories told in the dark, *watched on repeat*',
      formats: [
        {icon: 'p24_250', title: 'Call-in ghost shows'},
        {icon: 'p24_252', title: 'Karma & folk tales'},
        {icon: 'p24_254', title: 'Ghost hunts'},
        {icon: 'p24_256', title: 'Longplay compilations'},
      ],
      moments: [
        {date: '31 Oct 2026', label: 'Halloween, the peak horror week'},
        {date: '1st & 3rd Tuesday', label: 'Prime-time radio ghost show'},
        {date: 'Q4 2026', label: 'Thai horror film releases'},
        {date: 'Always-on', label: 'Late-night story drops'},
      ],
    },
    brand: {
      categories: [
        {icon: 'p25_266', title: 'Energy Drinks & Coffee'},
        {icon: 'p25_268', title: 'Snacks'},
        {icon: 'p25_270', title: 'Telco & Internet'},
        {icon: 'p25_272', title: 'Insurance'},
      ],
      ideas: [
        {icon: 'p25_274', title: 'Host-read segment', desc: "A mention in the host's own voice"},
        {icon: 'p25_276', title: 'Horror night special', desc: 'A branded Halloween episode'},
        {icon: 'p25_278', title: 'Film tie-in', desc: 'Stories and hunts around a horror release'},
      ],
    },
    creators: {
      headline: 'Creators: ghost stories',
      sub: 'Storytellers, radio shows and ghost hunters',
      avatarPage: 's26',
      list: [
        {name: 'Epic Time', subs: '8.41M'},
        {name: 'The Ghost Radio', subs: '8.3M'},
        {name: 'Ajarn Yod', subs: '7.9M'},
        {name: 'Lhon Diary', subs: '7.21M'},
        {name: 'The Shock Radio', subs: '2.04M'},
        {name: 'nuenglc', subs: '2M'},
        {name: 'ATIME Do Dee', subs: '640K'},
        {name: 'Lao Pai Lhon Pai', subs: '382K'},
      ],
    },
  },
  {
    num: '04',
    short: 'Talk of the Town',
    pre: 'The voice of',
    title: 'Talk of the Town',
    desc: "Business, tech, history and life: Thailand's podcasts are watched, not just heard.",
    icon: 'p04_034',
    cover: 'cover29',
    fact: {
      stat: '94%',
      headline: 'of Thai Gen Z say YouTube has *the best podcast content*',
      soWhat: 'Long-form talk is where young Thais learn, decide and trust.',
      icon: 'p30_338',
      source: 'Google & Kantar (2026), via The Story Thailand (Sep 2026)',
    },
    proof: {
      headline: 'Thailand watches *long conversations*',
      sub: 'Subscribers, millions',
      chart: [
        {label: 'GoodDayOfficial', value: 3.95, display: '3.95M'},
        {label: '9arm', value: 1.61, display: '1.61M'},
        {label: 'Mission To The Moon', value: 1.38, display: '1.38M'},
        {label: 'FAROSE', value: 0.996, display: '996K'},
        {label: 'CK Cheong', value: 0.775, display: '775K'},
      ],
      stats: [
        {value: '+50%', label: 'year-on-year growth in podcast viewing'},
        {value: '87%', label: 'of Gen Z buy with more confidence thanks to YouTube'},
      ],
      source: 'Social Blade (Sep 2026); Google via RAiNMaker (Jun 2026); Google & Kantar (2026)',
    },
    play: {
      headline: 'Hour-long talk, *watched to the end*',
      formats: [
        {icon: 'p32_340', title: 'Celebrity interviews'},
        {icon: 'p32_342', title: 'Explainers'},
        {icon: 'p32_344', title: 'Money & career talk'},
        {icon: 'p32_346', title: 'Health & life'},
      ],
      moments: [
        {date: 'Nov to Dec 2026', label: 'Year-end tax and investing'},
        {date: 'Dec 2026', label: 'Year-in-review episodes'},
        {date: 'Jan 2027', label: 'New Year goals, self-growth'},
        {date: 'Weekly', label: 'Appointment episodes'},
      ],
    },
    brand: {
      categories: [
        {icon: 'p33_356', title: 'Banking & Investment'},
        {icon: 'p33_358', title: 'Tech & Devices'},
        {icon: 'p33_360', title: 'Health & Insurance'},
        {icon: 'p33_362', title: 'Beauty & Personal care'},
      ],
      ideas: [
        {icon: 'p33_364', title: 'Presenting partner', desc: "A season sponsor, in the host's own voice"},
        {icon: 'p33_366', title: 'Branded episode', desc: 'A conversation built on your theme'},
        {icon: 'p33_368', title: 'Clips to Shorts', desc: 'The best moments, cut and boosted'},
      ],
    },
    creators: {
      headline: 'Creators: podcasts & talk',
      sub: 'Hosts people listen to for an hour',
      avatarPage: 's34',
      list: [
        {name: 'GoodDayOfficial', subs: '3.95M'},
        {name: '9arm', subs: '1.61M'},
        {name: 'Mission To The Moon', subs: '1.38M'},
        {name: 'FAROSE', subs: '996K'},
        {name: 'CK Cheong', subs: '775K'},
        {name: 'Katanyu Tonight', subs: '597K'},
        {name: 'Salmon Podcast', subs: '478K'},
        {name: 'Koendanai', subs: '450K'},
        {name: 'Zerosick', subs: '397K'},
      ],
    },
  },
  {
    num: '05',
    short: 'Eat & Travel Thai',
    pre: 'The taste of',
    title: 'Eat & Travel Thai',
    desc: 'Street food, big bowls and weekend escapes: the trips Thais plan on YouTube.',
    icon: 'p04_036',
    cover: 'cover37',
    fact: {
      stat: '#2',
      headline: "Thailand's #2 trending search of 2025 was a *domestic travel deal*",
      soWhat: 'Thais are hungry to travel at home. Ride the planning wave.',
      icon: 'p38_432',
      source: 'Google Year in Search 2025 Thailand (Dec 2025)',
    },
    proof: {
      headline: 'Thailand *eats and travels* on YouTube',
      sub: 'Subscribers, millions',
      chart: [
        {label: 'BANKII', value: 10.6, display: '10.6M'},
        {label: 'Jack Pap Ho', value: 9, display: '9M'},
        {label: 'Mom Tanad Daek', value: 4.96, display: '4.96M'},
        {label: 'JIMSURIYA V.2', value: 3.24, display: '3.24M'},
        {label: 'Jamsai JS', value: 2.01, display: '2.01M'},
      ],
      stats: [
        {value: '75%', label: "of Go Went Go's views come from the TV screen"},
        {value: '1M', label: 'domestic travel vouchers, from November 2026'},
      ],
      source: 'Social Blade (Sep 2026); Google (Sep 2026); Thansettakij (Sep 2026)',
    },
    play: {
      headline: 'From street stall to *weekend escape*',
      formats: [
        {icon: 'p40_434', title: 'Street food hunts'},
        {icon: 'p40_436', title: 'Food challenges'},
        {icon: 'p40_438', title: 'Secondary-city trips'},
        {icon: 'p40_440', title: 'Home cooking'},
      ],
      moments: [
        {date: 'Nov 2026 to Feb 2027', label: 'Travel scheme and high season'},
        {date: '24 Nov 2026', label: 'Loy Krathong trips'},
        {date: '31 Dec 2026', label: 'New Year trips and feasts'},
        {date: '14 Feb 2027', label: "Valentine's food finds"},
      ],
    },
    brand: {
      categories: [
        {icon: 'p41_450', title: 'Seasoning & Sauces'},
        {icon: 'p41_452', title: 'Beverages'},
        {icon: 'p41_454', title: 'Auto & Travel'},
        {icon: 'p41_456', title: 'Cards & E-wallets'},
      ],
      ideas: [
        {icon: 'p41_458', title: 'Food trip sponsor', desc: 'A branded route through one province'},
        {icon: 'p41_460', title: 'Challenge prop', desc: 'Your product is the ingredient or prize'},
        {icon: 'p41_462', title: 'Shoppable trip', desc: 'Product tags turn the trip into a cart'},
      ],
    },
    creators: {
      headline: 'Creators: eat & travel',
      sub: 'Food hunters and weekend explorers',
      avatarPage: 's42',
      list: [
        {name: 'BANKII', subs: '10.6M'},
        {name: 'Jack Pap Ho', subs: '9M'},
        {name: 'Mom Tanad Daek', subs: '4.96M'},
        {name: 'JIMSURIYA V.2', subs: '3.24M'},
        {name: 'Jamsai JS', subs: '2.01M'},
        {name: 'Go Went Go', subs: '1.97M'},
        {name: 'TheGaijinTrips', subs: '1.26M'},
        {name: 'Starvingtime', subs: '446K'},
      ],
    },
  },
  {
    num: '06',
    short: 'Game On',
    pre: 'The rush of',
    title: 'Game On',
    desc: "Gaming creators are some of Thailand's biggest stars, and RoV nights fill living rooms.",
    icon: 'p04_038',
    cover: 'cover45',
    fact: {
      stat: '22M',
      headline: 'One Thai gamer has *more subscribers than a national TV channel*',
      soWhat: 'Gaming creators are TV channels in their own right.',
      icon: 'p46_522',
      source: 'Social Blade (Sep 2026); YouTube Thailand top creators (Dec 2025)',
    },
    proof: {
      headline: 'Thailand plays together, *on the big screen*',
      sub: '',
      stats: [
        {value: '7 of 50', label: 'most-subscribed Thai channels are gaming'},
        {value: '122K', label: 'peak viewers, RoV Pro League 2026 Summer'},
        {value: '4 days', label: 'of Thailand Game Show in Bangkok'},
      ],
      source: 'HypeAuditor (Sep 2026); Esports Charts (2026); Thailand Game Show (2026)',
    },
    play: {
      headline: 'Play, watch, *replay*',
      formats: [
        {icon: 'p48_532', title: "Let's Plays"},
        {icon: 'p48_534', title: 'RoV & Free Fire'},
        {icon: 'p48_536', title: 'Live streams'},
        {icon: 'p48_538', title: 'Esports broadcasts'},
      ],
      moments: [
        {date: '29 Oct to 1 Nov 2026', label: 'Thailand Game Show'},
        {date: '9 Jan 2027', label: "Children's Day family gaming"},
        {date: 'Mar to May 2027', label: 'School holidays, peak play'},
        {date: 'Always-on', label: "Daily Let's Plays and streams"},
      ],
    },
    brand: {
      categories: [
        {icon: 'p49_548', title: 'Mobile & Telco'},
        {icon: 'p49_550', title: 'Snacks & Drinks'},
        {icon: 'p49_552', title: 'Gaming Gear'},
        {icon: 'p49_554', title: 'E-wallets & Top-ups'},
      ],
      ideas: [
        {icon: 'p49_556', title: 'Creator challenge', desc: 'A branded game night or in-game quest'},
        {icon: 'p49_558', title: 'Tournament partner', desc: 'Own a community cup or league segment'},
        {icon: 'p49_560', title: 'Own the replays', desc: 'The highlights after every big match'},
      ],
    },
    creators: {
      headline: 'Creators: gaming & esports',
      sub: 'Gamers, streamers and leagues',
      avatarPage: 's50',
      list: [
        {name: 'zbing z.', subs: '22M'},
        {name: 'RUOK', subs: '10.7M'},
        {name: 'HEARTROCKER', subs: '9.67M'},
        {name: 'PojzPlaza', subs: '9.63M'},
        {name: 'PRIMKUNG', subs: '8.72M'},
        {name: 'LowGrade', subs: '8.29M'},
        {name: 'Garena Free Fire TH', subs: '5.67M'},
        {name: 'Garena RoV Thailand', subs: '3.9M'},
      ],
    },
  },
];

export const shining: (Stat & {kicker: string; icon: string})[] = [
  {kicker: 'Longevity', icon: 'p02_012', value: '40%', label: 'of views happen 1+ month after upload'},
  {kicker: 'Scale', icon: 'p02_014', value: '1,300', label: 'Thai channels with 1M+ subscribers'},
  {kicker: 'Trust', icon: 'p02_016', value: '90%', label: 'rate YouTube the most trusted video platform'},
  {kicker: 'Return', icon: 'p02_018', value: '1.71x', label: 'higher marketing ROI than TV'},
];

export const screens: (Stat & {kicker: string; icon: string})[] = [
  {kicker: 'Connected TV', icon: 'p03_020', value: '75%', label: "of Go Went Go's views come from the TV"},
  {kicker: 'Podcasts', icon: 'p03_022', value: '+50%', label: 'year-on-year growth in podcast viewing'},
  {kicker: 'Shorts', icon: 'p03_024', value: '+85%', label: 'year-on-year growth in Shorts uploads'},
  {kicker: 'Live', icon: 'p03_026', value: '122K', label: 'peak live viewers for RoV Pro League'},
];
