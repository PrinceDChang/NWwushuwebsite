export type ClassType = 'kids' | 'adult';

export interface WushuClass {
  id: ClassType;
  title: string;
  ages: string;
  description: string;
  day: string;
  time: string;
  priceNote: string;
  signupHref: string;
}

export const classes: WushuClass[] = [
  {
    id: 'kids',
    title: 'Kids Wushu',
    ages: 'Ages 6–12',
    description:
      'Foundational movements, flexibility, coordination, and discipline through fun exercises.',
    day: 'Saturday',
    time: '10:00 AM – 11:00 AM',
    priceNote: 'Monthly rates available — ask at your trial',
    signupHref: '/trial/?class=kids',
  },
  {
    id: 'adult',
    title: 'Teen & Adult Wushu',
    ages: 'Ages 13+',
    description:
      'Traditional forms, weapons training, and conditioning for all skill levels.',
    day: 'Saturday',
    time: '11:00 AM – 1:00 PM',
    priceNote: 'Monthly rates available — ask at your trial',
    signupHref: '/trial/?class=adult',
  },
];

export const trialSlots = {
  kids: { label: 'Kids Wushu', time: '10:00 AM – 11:00 AM' },
  adult: { label: 'Teen & Adult Wushu', time: '11:00 AM – 1:00 PM' },
} as const;
