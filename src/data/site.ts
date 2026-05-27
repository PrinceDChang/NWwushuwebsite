export const site = {
  name: 'Northwest Wushu Academy',
  shortName: 'Northwest Wushu',
  tagline: 'Master the art of wushu',
  description:
    'Seattle’s home for traditional Chinese martial arts since 2008. All levels welcome — kids, teens, and adults.',
  email: 'northwestwushu.2008@gmail.com',
  instagram: 'https://www.instagram.com/northwestwushu/',
  instagramHandle: '@northwestwushu',
  discord: 'https://discord.com/',
  youtube: 'https://www.youtube.com/',
  replyTime: '1–2 business days',
  address: {
    name: 'Seattle Armory',
    street: '305 Harrison St',
    city: 'Seattle',
    state: 'WA',
    zip: '98109',
    full: 'Seattle Armory, 305 Harrison St, Seattle, WA 98109',
  },
  mapsEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2689.8!2d-122.3501!3d47.6205!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54901545c4c8b8c1%3A0x305Harrison!2sSeattle%20Center%20Armory!5e0!3m2!1sen!2sus!4v1',
  mapsLink: 'https://maps.google.com/?q=Seattle+Armory+305+Harrison+St+Seattle+WA+98109',
  maxClassSize: 25,
} as const;

export const trialBanner = {
  text: 'Sign up for your free trial class',
  href: '/trial/',
} as const;
