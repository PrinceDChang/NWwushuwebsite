export const site = {
  name: 'Northwest Wushu Academy',
  shortName: 'Northwest Wushu',
  tagline: 'Master the art of wushu',
  description:
    'Seattle’s home for traditional Chinese martial arts since 2008. All levels welcome — kids, teens, and adults.',
  email: 'northwestwushu.2008@gmail.com',
  instagram: 'https://www.instagram.com/northwestwushu/',
  instagramHandle: '@northwestwushu',
  discord: 'https://discord.gg/4PrbsZTfH',
  youtube: 'https://www.youtube.com/channel/UCG1h4jxhNG5Fqjy8IydpqqQ',
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
  locations: {
    regular: {
      id: 'regular',
      label: 'Regular',
      name: 'Seattle Armory',
      street: '305 Harrison St',
      city: 'Seattle',
      state: 'WA',
      zip: '98109',
      full: 'Seattle Armory, 305 Harrison St, Seattle, WA 98109',
      mapsTitle: 'Map to Seattle Armory',
      mapsEmbed:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2689.589!2d-122.350!3d47.621!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54901545d8808c69%3A0x7c8f5f5f5f5f5f5f!2s305%20Harrison%20St%2C%20Seattle%2C%20WA%2098109!5e0!3m2!1sen!2sus!4v1',
      mapsLink: 'https://maps.google.com/?q=Seattle+Armory+305+Harrison+St+Seattle+WA+98109',
      imageSrc: '/images/location-studio-interior.jpg',
      imageAlt:
        'Northwest Wushu training studio at the Seattle Armory with open floor space and mirrors',
      spaceTitle: 'Our Training Space',
      season: '',
      tips: [
        {
          title: 'Parking',
          text: 'Free street parking is often available nearby. Paid garages near Seattle Center are an option on busy days.',
        },
        {
          title: 'Getting here',
          text: 'The Armory is in the Seattle Center area, accessible by Monorail, bus, and rideshare. Allow extra time during events.',
        },
        {
          title: 'When you arrive',
          text: 'Check in with your coach and follow posted studio rules (e.g. shoes off the mats).',
        },
      ],
    },
    summer: {
      id: 'summer',
      label: 'Summer',
      name: 'Jefferson Park',
      street: '3801 Beacon Ave S',
      city: 'Seattle',
      state: 'WA',
      zip: '98108',
      full: 'Jefferson Park, 3801 Beacon Ave S, Seattle, WA 98108',
      mapsTitle: 'Map to Jefferson Park',
      mapsEmbed:
        'https://www.google.com/maps?q=3801+Beacon+Ave+S,+Seattle,+WA+98108&hl=en&z=16&output=embed',
      mapsLink: 'https://maps.google.com/?q=Jefferson+Park+3801+Beacon+Ave+S+Seattle+WA+98108',
      imageSrc: '/images/location-jefferson-park.png',
      imageAlt: 'Jefferson Park in Seattle, with playground, spray park, and open lawns on Beacon Hill',
      spaceTitle: 'Summer Training Space',
      season: 'June – September',
      tips: [
        {
          title: 'Parking',
          text: 'Street parking is typically available around Jefferson Park and along Beacon Avenue South.',
        },
        {
          title: 'Getting here',
          text: 'Jefferson Park is on Beacon Hill, near Link light rail, bus routes, and rideshare drop-off.',
        },
        {
          title: 'When you arrive',
          text: 'Meet your coach at the designated outdoor training area. Bring water, sun protection, and check for weather updates.',
        },
      ],
    },
  },
} as const;

export const trialBanner = {
  text: 'Sign up for your free trial class',
  buttonText: 'Free trial',
  href: '/trial/',
} as const;
