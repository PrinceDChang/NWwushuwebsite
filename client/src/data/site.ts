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
      heroImageSrc: '/images/location-seattle-skyline.png',
      heroImageAlt: 'Seattle skyline with the Space Needle at sunset',
      heroImagePosition: 'center 25%',
      spaceTitle: 'Our Training Space',
      season: 'October – April',
      tips: [
        {
          title: 'Parking',
          text: 'Free street parking is often available nearby. Paid garages near Seattle Center are an option on busy days.',
        },
        {
          title: 'Getting here',
          text: 'Seattle Center Monorail from Westlake Center (connects to Link 1 Line at Westlake Station). Metro buses 1, 2, 4, 8, 13, 24, 33, and RapidRide D Line stop near Seattle Center; RapidRide E Line and routes 5 and 28 run along Aurora Ave N. Allow extra time during events.',
          logos: [
            { src: '/images/transit/monorail.svg', alt: 'Seattle Center Monorail' },
            { src: '/images/transit/link.svg', alt: 'Link light rail' },
            { src: '/images/transit/metro.svg', alt: 'King County Metro' },
            { src: '/images/transit/rapidride.svg', alt: 'RapidRide' },
          ],
        },
        {
          title: 'When you arrive',
          text: 'Meet your coach at the front of the building and follow studio rules (e.g. shoes off the mats).',
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
      heroImageSrc: '/images/location-jefferson-park-hero.jpg',
      heroImageAlt: 'Jefferson Park overlooking Lake Washington on a sunny day',
      heroImagePosition: 'center 40%',
      spaceTitle: 'Summer Training Space',
      season: 'June – September',
      tips: [
        {
          title: 'Parking',
          text: 'Street parking is typically available around Jefferson Park and along Beacon Avenue South.',
        },
        {
          title: 'Getting here',
          text: 'Link 1 Line to Beacon Hill Station (about a 15-minute walk or short ride south on Beacon Ave). Metro Route 36 stops along Beacon Ave S at Jefferson Park; routes 50, 60, and 107 also serve the Beacon Hill corridor. Rideshare drop-off is available at the park.',
          logos: [
            { src: '/images/transit/link.svg', alt: 'Link light rail' },
            { src: '/images/transit/metro.svg', alt: 'King County Metro' },
          ],
        },
        {
          title: 'When you arrive',
          text: 'Meet your coach by the parking lot to go together to the designated outdoor training area. Bring water, sun protection, and check for weather updates.',
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
