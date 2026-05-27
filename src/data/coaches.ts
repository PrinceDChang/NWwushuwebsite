export interface Coach {
  name: string;
  role?: string;
  bio: string;
  image?: string;
}

export const featuredCoach: Coach = {
  name: 'Tianyuan Li',
  role: 'Head Coach',
  bio:
    'Tianyuan brings competitive and traditional wushu experience to Northwest Wushu Academy, guiding students from first steps through advanced forms and weapons. (Bio placeholder — update with approved text.)',
};

export const coaches: Coach[] = [
  {
    name: 'Jim Kirk',
    bio:
      'Jim supports students across fundamentals and traditional training. (Bio placeholder — update with approved text.)',
    image: '/images/coach-jim.jpg',
  },
  {
    name: 'Dan',
    bio:
      'Dan helps teen and adult students build strength, form, and confidence. (Bio placeholder — update with approved text.)',
  },
];
