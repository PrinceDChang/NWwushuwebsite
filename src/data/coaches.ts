export interface Coach {
  name: string;
  role?: string;
  bio: string;
  image?: string;
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
    'Sifu Li began her Chinese Martial Arts (Wushu) training at age 8 with a daily regiment of 4–6 hours. At age 11 she became Wushu champion for her province in China, then moved into one of China\'s most prestigious Wushu Academies.\n\nShe became a 3-time Chinese National Champion, retired as a professional athlete, and went on to teach at the Yokohama Chinese Wushu Association.',
};

export const featuredCoachSlides: CoachFeatureSlide[] = [
  {
    aspect: 'Early training & championship career',
    image: '/images/coach-li-portrait.png',
    imageAlt: 'Tianyuan Li in traditional wushu uniform holding a straight sword',
    paragraphs: [
      'Sifu Li began her Chinese Martial Arts (Wushu) training at age 8 with a daily regiment of 4–6 hours. At age 11 she became Wushu champion for her province in China, then moved into one of China\'s most prestigious Wushu Academies.',
      'She became a 3-time Chinese National Champion, retired as a professional athlete, and went on to teach at the Yokohama Chinese Wushu Association.',
    ],
  },
  {
    aspect: 'Northwest Wushu & SIMAC',
    image: '/images/coach-li-competition.png',
    imageAlt: 'Tianyuan Li performing a wushu sword form on a competition mat',
    paragraphs: [
      'She moved to Seattle soon after and opened Northwest Wushu in 2008. Teaching students of all ages and skill level, she continue passing down her skills to the next generation.',
      'Along with performance all across Seattle, she also started her own wushu competition in Seattle called the Seattle International Martial Arts Championship (SIMAC) which has been running strong for more than 10 years.',
    ],
  },
  {
    aspect: 'Fun fact: Soul Calibur motion capture',
    image: '/images/coach-soul-calibur.png',
    imageAlt: 'Soul Calibur character Xianghua, one of the characters Master Li motion-captured',
    paragraphs: [
      'Fun Fact about Master Li is that while in Japan, she partnered with Namco to serve as a motion capture model for 4 characters in the hit game "Soul Calibur."',
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=pnvCNkmq548',
  },
];

export const coaches: Coach[] = [
  {
    name: 'Jim Kirk',
    role: 'Coach',
    bio:
      "Jim was one of Master Li's first students when she started her school in Yokohama, Japan. Now based in Seattle, Jim continues Master Li's legacy and passes down traditional Wushu techniques to a new generation.",
    image: '/images/coach-jim.jpg',
  },
];
