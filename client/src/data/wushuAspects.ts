export type WushuAspect = {
  id: string;
  label: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  paragraphs: string[];
};

export const wushuAspects: WushuAspect[] = [
  {
    id: 'overview',
    label: 'Overview',
    title: 'What is Wushu',
    imageSrc: '/images/about-studio-group.jpg',
    imageAlt: 'Northwest Wushu students and coaches posing together in the Seattle Armory training studio',
    paragraphs: [
      'Wushu is a modern, standardized form of Chinese martial arts that combines traditional combat techniques with athletic movement and acrobatics. Students develop strength, flexibility, coordination, and discipline.',
      'Whether you are exploring martial arts for fitness, culture, or competition, here at Northwest Wushu Academy, we train kids, teens, and adults of all levels and bring them into our supportive community.',
    ],
  },
  {
    id: 'flexibility',
    label: 'Flexibility',
    title: 'Flexibility',
    imageSrc: '/images/class-teens-adults.jpg',
    imageAlt: 'Northwest Wushu students stretching together in a circle on the studio mats',
    paragraphs: [
      'Flexibility is a foundation of wushu. Controlled stretching, kicks, and holds build the range of motion needed for high kicks, deep stances, and clean lines in every form.',
      'At Northwest Wushu, we train flexibility progressively and safely so students of every age can improve mobility, reduce injury risk, and move with greater power and ease.',
    ],
  },
  {
    id: 'forms',
    label: 'Forms',
    title: 'Forms',
    imageSrc: '/images/wushu-forms.jpg',
    imageAlt: 'Wushu athlete holding a balanced empty-hand form pose on stage',
    paragraphs: [
      'Forms (taolu) are choreographed sequences that express traditional techniques through rhythm, balance, and expression. They train body awareness, timing, and the connection between strength and grace.',
      'Students learn empty-hand routines that grow with their level—from foundational basics to competition-ready sets—always with coaching that emphasizes clarity, control, and personal progress.',
    ],
  },
  {
    id: 'weapons',
    label: 'Weapons',
    title: 'Weapons',
    imageSrc: '/images/wushu-weapons.jpg',
    imageAlt: 'Wushu athlete leaping with a straight sword during a weapons performance',
    paragraphs: [
      'Weapons training extends form work into sword, spear, staff, and other traditional tools. Each weapon develops different timing, coordination, and spatial awareness.',
      'We introduce weapons when students are ready, focusing on safe handling, precise technique, and the unique character of each weapon within the wushu curriculum.',
    ],
  },
  {
    id: 'nandu',
    label: 'Nandu',
    title: 'Nandu',
    imageSrc: '/images/wushu-nandu.jpg',
    imageAlt: 'Wushu athlete performing a mid-air nandu jump over a competition mat',
    paragraphs: [
      'Nandu are the difficulty elements of modern competitive wushu—jumps, flips, and aerial techniques that demand explosiveness, timing, and strong foundations.',
      'We build toward nandu step by step. Students strengthen basics first, then progress into advanced tumbling and aerial work with coaching that prioritizes safety and solid landing mechanics.',
    ],
  },
];
