import CharacterTrait from '@modules/characters/infra/typeorm/entities/CharacterTrait';

export default function extractMeritsTraits(
  line: string,
  creatureType: string,
): CharacterTrait | undefined {
  let merit: string;
  let meritTrait: CharacterTrait | undefined;

  switch (creatureType) {
    case 'Mortal':
      {
        let derangementTag = '';

        const derangements = [
          'Acute Sanguinary Aversion',
          'Acute Stress Disorder',
          'Addiction',
          'Agoraphobia',
          'Amnesia',
          'Angelism',
          'Antisocial Disorder',
          'Asperger Syndrome',
          'Avoidant',
          'Berserk',
          'Bipolar Disorder',
          'Blood Addict',
          'Blood Sweats',
          'Blood Taste',
          'Bloodthirst',
          'Borderline',
          'Bulimia',
          'Charmed Life Complex',
          'Circadian Rhythm Sleep Disorder',
          'Compulsive Lying',
          'Compulsive-Aggressive Disorder',
          'Confusion',
          'Creation Memory',
          'Crimson Rage',
          'Delusional',
          'Delusional Identity',
          'Delusions of Disease',
          'Delusions of Grandeur',
          'Delusions of Guilt',
          'Delusions of Jealousy',
          'Delusions of Passivity',
          'Delusions of Persecution',
          'Delusions of Poverty',
          'Delusions of Reference',
          'Delusions of Thought-Control',
          'Demophobia',
          'Densensitization',
          'Dependent',
          'Depersonalization Disorder',
          'Depressive',
          'Dipsomania',
          'Disorganized Actions',
          'Disorganized Speech',
          'Dissociation',
          'Dissociative Amnesia',
          'Dissociative Blood-Spending',
          'Dissociative Fugue',
          'Dissociative Identity Disorder',
          'Dissociative Perceptions Syndrome',
          'Erotomantic Delusions',
          'Exhibitionism',
          'Factitious Disorder',
          'Fantasy',
          'Fugue',
          'Generalized Anxiety Disorder',
          'Gluttony',
          'Hallucinations',
          'Handler',
          'Hangover Helper',
          'Heirarchical Sociology Disorder',
          'Herbephrenia',
          'Histrionic',
          'Histrionics',
          'Hunger',
          'Hypersomnia',
          'Hypochondria',
          'Hysteria',
          'Ideology Fanatic',
          'Immortal Fear',
          'Immortal Terror',
          'Intellectualization',
          'Intermittent Explosive Disorder',
          'Kleptomania',
          'Lunacy',
          'Manic-Depression',
          'Masochism',
          'Megalomania',
          'Melancholia',
          'Memory Lapses',
          'Mercenary',
          'Multiple Personalities',
          'Narcissistic',
          'Narcolepsy',
          'Nightmare Disorder',
          'Obsession',
          'Obsessive-Compulsion',
          'Overcompensation',
          'Pack Feeding',
          'Panic Disorder',
          'Panzaism',
          'Paranoia',
          'Paranoid of Ancients',
          'Passion Player',
          'Path Lust',
          'Pathological Gambling',
          'Pedophilia',
          'Perfection',
          'Phobia',
          'Possession',
          'Post-Traumatic Stress Disorder',
          'Power Madness',
          'Power-Object Fixation',
          'Progenitor',
          'Promise',
          'Psychosis',
          'Puppeteerism',
          'Pyromania',
          'Quixotism',
          'Regression',
          'Ritual Freak',
          'Sadism',
          "Saint Vitus's Dance",
          'Sanguinary Animism',
          'Sanguinary Cryptography',
          'Schizoid',
          'Schizophrenia',
          'Schizotypal',
          'Sect Fanatic',
          'Self-Annihilation Impulse',
          'Sexual Dysfunction',
          'Sexual Masochism',
          'Sexual Sadism',
          'Sleep Terror Disorder',
          'Sleepwalking Disorder',
          'Social Phobia',
          'Somatic Delusions',
          'Strangler',
          'Syncophancy',
          'Synesthesia',
          'Thaumaturgical Glossolalia',
          'Trichotillomania',
          'Undying Remorse',
          'Vengeful',
          'Visions',
          'Voyeurism',
          'Wrist Slitter',
        ];

        derangements.some(der => {
          if (line.indexOf(der) === 0) {
            derangementTag = der;
            return true;
          }
          return false;
        });

        let startLooking = 0;
        if (derangementTag === '') {
          startLooking = 0;
        } else {
          let shift = 0;

          if (line.indexOf(' (') === derangementTag.length) {
            shift = 1;
          }

          startLooking = derangementTag.length + shift;
        }

        const startMerit = line.indexOf(' ', startLooking) + 1;

        if (
          startMerit !== line.indexOf('  ', startLooking) + 1 &&
          line.indexOf(' (', startMerit) !== -1
        ) {
          const endMerit = line.indexOf(' (', startMerit);
          const startMeritPoints = line.indexOf('(', startMerit) + 1;
          const endMeritPoints = startMeritPoints + 1;

          merit = line.substring(startMerit, endMerit);
          const meritPoints = parseInt(
            line.substring(startMeritPoints, endMeritPoints),
            10,
          );
          let meritPts: number;

          if (!Number.isNaN(meritPoints)) {
            meritPts = meritPoints;
          } else {
            meritPts = 0;
          }

          switch (merit) {
            case 'Ability Aptitude':
            case 'Additional Discipline':
              {
                const startMeritDetail =
                  line.indexOf(', ', startMeritPoints) + 2;
                const endMeritDetail = line.indexOf(')');
                if (startMeritDetail !== 1) {
                  const meritDetail = line.substring(
                    startMeritDetail,
                    endMeritDetail,
                  );
                  merit = `${merit}: ${meritDetail}`;
                }
              }
              break;
            default:
          }

          meritTrait = {
            trait: merit,
            level: meritPts,
            type: 'merits',
          } as CharacterTrait;
        } else {
          meritTrait = undefined;
        }
      }

      break;
    default:
      if (line.indexOf(' (') >= 0 && line.indexOf(' ') !== 0) {
        const startMerit = 0;
        const endMerit = line.indexOf(' (');
        const startMeritPoints = line.indexOf('(') + 1;
        const endMeritPoints = startMeritPoints + 1;

        merit = line.substring(startMerit, endMerit);
        const meritPoints = parseInt(
          line.substring(startMeritPoints, endMeritPoints),
          10,
        );
        let meritPts: number;

        if (!Number.isNaN(meritPoints)) {
          meritPts = meritPoints;
        } else {
          meritPts = 0;
        }

        switch (merit) {
          case 'Ability Aptitude':
          case 'Additional Discipline':
          case 'Discipline Prodigy':
          case 'Ventrue: Paragon':
            {
              const startMeritDetail = line.indexOf(', ', startMeritPoints) + 2;
              const endMeritDetail = line.indexOf(')');
              if (startMeritDetail !== 1) {
                const meritDetail = line.substring(
                  startMeritDetail,
                  endMeritDetail,
                );
                merit = `${merit}: ${meritDetail}`;
              }
            }
            break;
          default:
        }

        meritTrait = {
          trait: merit,
          level: meritPts,
          type: 'merits',
        } as CharacterTrait;
      } else {
        meritTrait = undefined;
      }
  }

  return meritTrait;
}
