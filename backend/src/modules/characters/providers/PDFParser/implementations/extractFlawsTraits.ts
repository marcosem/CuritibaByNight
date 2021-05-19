import CharacterTrait from '@modules/characters/infra/typeorm/entities/CharacterTrait';

export default function extractFlawsTraits(
  line: string,
  creatureType: string,
): CharacterTrait | undefined {
  let flaw: string;
  let flawTrait: CharacterTrait | undefined;

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
            shift = line.indexOf(')', derangementTag.length);
          }

          startLooking = derangementTag.length + shift;
        }

        // It have a merit in same row, skip it
        const doubleSpace = line.indexOf('  ');
        if (doubleSpace === 0) {
          startLooking = 1;
        } else if (doubleSpace === startLooking) {
          startLooking += 1;
        } else if (
          line.indexOf(')', startLooking) !==
          line.lastIndexOf(')', startLooking)
        ) {
          startLooking = line.indexOf(')', startLooking) + 1;
        }

        const startFlaw = line.indexOf(' ', startLooking) + 1;

        if (
          startFlaw !== line.indexOf('  ', startLooking) + 1 &&
          line.indexOf(' (', startFlaw) !== -1
        ) {
          const endFlaw = line.indexOf(' (', startFlaw);
          const startFlawPoints = line.indexOf('(', startFlaw) + 1;
          const endFlawPoints = startFlawPoints + 1;

          flaw = line.substring(startFlaw, endFlaw);
          const flawPoints = parseInt(
            line.substring(startFlawPoints, endFlawPoints),
            10,
          );
          let flawPts: number;

          if (!Number.isNaN(flawPoints)) {
            flawPts = flawPoints;
          } else {
            flawPts = 0;
          }

          switch (flaw) {
            case 'Allergic':
            case 'Clan Weakness':
            case 'Compulsion':
            case 'Distinguishing Characteristic':
            case 'Intolerance':
            case 'Obsession':
            case 'Phobia':
              {
                const startFlawDetail = line.indexOf(', ', startFlawPoints) + 2;
                const endFlawDetail = line.indexOf(')', startFlaw);
                if (startFlawDetail !== 1) {
                  const flawDetail = line.substring(
                    startFlawDetail,
                    endFlawDetail,
                  );
                  flaw = `${flaw}: ${flawDetail}`;
                }
              }
              break;
            default:
          }

          flawTrait = {
            trait: flaw,
            level: flawPts,
            type: 'flaws',
          } as CharacterTrait;
        } else {
          flawTrait = undefined;
        }
      }

      break;
    default: {
      const withMerit = line.indexOf(') ');
      const withoutMerit = line.indexOf(' ');
      const noFlaw = line.indexOf('  ');

      if (
        line.indexOf('(') >= 0 &&
        (withMerit >= 0 || withoutMerit === 0) &&
        withMerit !== noFlaw - 1
      ) {
        const startFlaw =
          withMerit >= 0 && withMerit !== line.length - 2
            ? withMerit + 2
            : withoutMerit + 1;
        const endFlaw = line.indexOf(' (', startFlaw);
        const startFlawPoints = line.indexOf('(', startFlaw) + 1;
        const endFlawPoints = startFlawPoints + 1;

        flaw = line.substring(startFlaw, endFlaw);
        const flawPoints = parseInt(
          line.substring(startFlawPoints, endFlawPoints),
          10,
        );
        let flawPts: number;

        if (!Number.isNaN(flawPoints)) {
          flawPts = flawPoints;
        } else {
          flawPts = 0;
        }

        switch (flaw) {
          case 'Allergic':
          case 'Compulsion':
          case 'Intolerance':
          case 'Obsession':
          case 'Phobia':
          case 'Prey Exclusion':
            {
              const startFlawDetail = line.indexOf(', ', startFlawPoints) + 2;
              const endFlawDetail = line.indexOf(')', startFlaw);
              if (startFlawDetail !== 1) {
                const flawDetail = line.substring(
                  startFlawDetail,
                  endFlawDetail,
                );
                flaw = `${flaw}: ${flawDetail}`;
              }
            }
            break;
          default:
        }

        flawTrait = {
          trait: flaw,
          level: flawPts,
          type: 'flaws',
        } as CharacterTrait;
      } else {
        flawTrait = undefined;
      }
    }
  }

  return flawTrait;
}
