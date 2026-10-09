import { site } from './site';

export type ClassType = 'kids' | 'adult';

export interface WushuClass {
  id: ClassType;
  title: string;
  ages: string;
  instructor: string;
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
    instructor: 'Jim Kirk',
    description:
      'Foundational movements, flexibility, coordination, and discipline through fun exercises.',
    day: 'Sunday',
    time: '2:00 PM – 3:00 PM',
    priceNote: 'Monthly rates available — ask at your trial',
    signupHref: site.trialSignupUrl,
  },
  {
    id: 'adult',
    title: 'Teen & Adult Wushu',
    ages: 'Ages 13+',
    instructor: 'Jim Kirk',
    description:
      'Traditional forms, weapons training, and conditioning for all skill levels.',
    day: 'Sunday',
    time: '3:00 PM – 5:00 PM',
    priceNote: 'Monthly rates available — ask at your trial',
    signupHref: site.trialSignupUrl,
  },
];

export const trialSlots = {
  kids: { label: 'Kids Wushu', time: '2:00 PM – 3:00 PM' },
  adult: { label: 'Teen & Adult Wushu', time: '3:00 PM – 5:00 PM' },
} as const;
