export interface Coach {
  name: string;
  role?: string;
  bio: string;
  image?: string;
  comingSoon?: boolean;
}

export interface CoachFeatureSlide {
  aspect: string;
  image: string;
  imageAlt: string;
  paragraphs: string[];
  /** Full YouTube URL or video ID — leave empty until the link is ready */
  youtubeUrl?: string;
}

export const featuredCoach: Coach = {
  name: 'Tianyuan Li',
  role: 'Grandmaster & Founder',
  bio:
    'Sifu Li began her Wushu training at the age of 8 with a daily regiment of 4–6 hours a day. When she was 11, she became a Wushu champion and moved onto one of China\'s most prestigious Wushu Academies.\n\nShe became a 3-time Chinese National Champion, retired as a professional athlete, and went on to teach at the Yokohama Chinese Wushu Association.',
};

export const featuredCoachSlides: CoachFeatureSlide[] = [
  {
    aspect: 'Early training & championship career',
    image: '/images/coach-li-portrait.png',
    imageAlt: 'Tianyuan Li in traditional wushu uniform holding a straight sword',
    paragraphs: [
      'Sifu Li began her Wushu training at the age of 8 with a daily regiment of 4–6 hours a day. When she was 11, she became a Wushu champion and moved onto one of China\'s most prestigious Wushu Academies.',
      'She became a 3-time Chinese National Champion, retired as a professional athlete, and went on to teach at the Yokohama Chinese Wushu Association.',
    ],
  },
  {
    aspect: 'Northwest Wushu & SIMAC',
    image: '/images/coach-li-competition.png',
    imageAlt: 'Tianyuan Li performing a wushu sword form on a competition mat',
    paragraphs: [
      'She moved to Seattle in 2008 and opened her school, Northwest Wushu. Teaching students of all ages and skill level, she continue passing down her skills to the next generation.',
      'Along with performance all across Seattle, she also started her own wushu competition in Seattle called the Seattle International Martial Arts Championship (SIMAC) which has been running strong for more than 10 years.',
    ],
  },
  {
    aspect: 'Fun Fact:',
    image: '/images/coach-soul-calibur.png',
    imageAlt: 'Soul Calibur character Xianghua, one of the characters Master Li motion-captured',
    paragraphs: [
      'Master Li, while in Japan, partnered with Bandai Namco Entertainment to serve as a motion capture model for 4 characters in the hit game "Soul Calibur."',
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=pnvCNkmq548',
  },
];

export const coaches: Coach[] = [
  {
    name: 'Jim Kirk',
    role: 'Coach',
    bio:
      "Jim was one of Master Li's first students when she started her school in Yokohama, Japan. Now based in Seattle, Jim continues Master Li's legacy and passes down traditional Wushu techniques to the next generation.",
    image: '/images/coach-jim.jpg',
  },
  {
    name: 'Coming Soon',
    role: 'Assistant Coach',
    bio: 'We are preparing to welcome a new assistant coach to Northwest Wushu. Check back soon for an introduction.',
    comingSoon: true,
  },
];
