export const site = {
  name: 'Northwest Wushu Academy',
  shortName: 'Northwest Wushu',
  tagline: 'Master the art of wushu',
  description:
    'Seattle’s home for traditional Chinese martial arts since 2008. All levels welcome — kids, teens, and adults.',
  email: 'Contact@northwestwushu.com',
  instagram: 'https://www.instagram.com/northwestwushu/',
  instagramHandle: '@northwestwushu',
  discord: 'https://discord.gg/4PrbsZTfH',
  youtube: 'https://www.youtube.com/channel/UCG1h4jxhNG5Fqjy8IydpqqQ',
  replyTime: '1–2 business days',
  address: {
    name: 'Pacific Rim Center',
    street: '900 S. Jackson St., Unit 119',
    city: 'Seattle',
    state: 'WA',
    zip: '98104',
    full: 'Pacific Rim Center, 900 S. Jackson St., Unit 119, Seattle, WA 98104',
  },
  mapsEmbed:
    'https://www.google.com/maps?q=900+S+Jackson+St,+Seattle,+WA+98104&hl=en&z=17&output=embed',
  mapsLink:
    'https://www.google.com/maps/dir/?api=1&destination=900+S+Jackson+St%2C+Seattle%2C+WA+98104',
  googleFormEmbed:
    'https://docs.google.com/forms/d/e/1FAIpQLSczS5q4X5xu2F2GPzh3EwVN8wd1oSXSF235YwMK_93dY3eAwA/viewform?embedded=true',
  classSignupUrl: 'https://forms.gle/wwephbhZ6qP5r4mr8',
  maxClassSize: 25,
  location: {
    mapsTitle: 'Map to Pacific Rim Center',
    imageSrc: '/images/location-pacific-rim-center.png',
    imageAlt: 'Pacific Rim Center on S. Jackson Street in Seattle’s Chinatown–International District',
    heroImageSrc: '/images/location-seattle-skyline.png',
    heroImageAlt: 'Seattle skyline with the Space Needle at sunset',
    heroImagePosition: 'center 25%',
    spaceTitle: 'Our Training Space',
    neighborhood: 'Little Saigon · Chinatown–International District',
    tips: [
      {
        title: 'Parking',
        text: '2-hour parking is available in the building garage. The garage entrance is on the east side of the building (10th Avenue South).',
      },
      {
        title: 'Getting here',
        text: 'Link 1 Line and 2 Line to International District/Chinatown Station, then about an 8-minute walk east on S. Jackson St. First Hill Streetcar stops at 7th & Jackson and 12th & Jackson — both a short walk. Metro routes 7, 14, and 36 run along Jackson Street. King Street Station (Sounder and Amtrak) is about a 10-minute walk.',
        logos: [
          { src: '/images/transit/link.svg', alt: 'Link light rail' },
          { src: '/images/transit/metro.svg', alt: 'King County Metro' },
        ],
      },
      {
        title: 'When you arrive',
        text: 'We train in Unit 119 on the ground floor of Pacific Rim Center. Meet your coach at the unit and follow studio rules (e.g. shoes off the mats).',
      },
    ],
  },
} as const;

export const trialBanner = {
  text: 'Sign up for your free trial class',
  buttonText: 'Free trial',
  href: '/trial/',
} as const;
