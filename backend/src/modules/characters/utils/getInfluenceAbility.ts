export default function getInfluenceAbility(influence: string): string {
  let ability: string;

  switch (influence) {
    case 'Bureaucracy':
      ability = 'Bureaucracy';
      break;
    case 'Church':
      ability = 'Theology';
      break;
    case 'Finance':
      ability = 'Finance';
      break;
    case 'Health':
      ability = 'Medicine';
      break;
    case 'High Society':
      ability = 'Etiquette';
      break;
    case 'Industry':
      ability = 'Crafts:';
      break;
    case 'Legal':
      ability = 'Law';
      break;
    case 'Media':
      ability = 'Performance:';
      break;
    case 'Occult':
      ability = 'Occult';
      break;
    case 'Police':
      ability = 'Investigation';
      break;
    case 'Politics':
      ability = 'Politics';
      break;
    case 'Street':
      ability = 'Streetwise';
      break;
    case 'Transportation':
      ability = 'Drive';
      break;
    case 'Underworld':
      ability = 'Intimidation';
      break;
    case 'University':
      ability = 'Academics';
      break;
    default:
      ability = '';
  }

  return ability;
}
