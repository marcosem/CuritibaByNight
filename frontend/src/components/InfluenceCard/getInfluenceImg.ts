import bureaucracy from '../../assets/influences/bureaucracy.jpg';
import church from '../../assets/influences/church.jpg';
import finances from '../../assets/influences/finances.jpg';
import health from '../../assets/influences/health.jpg';
import highsociety from '../../assets/influences/highsociety.jpg';
import industry from '../../assets/influences/industry.jpg';
import legal from '../../assets/influences/legal.jpg';
import media from '../../assets/influences/media.jpg';
import occult from '../../assets/influences/occult.jpg';
import police from '../../assets/influences/police.jpg';
import politics from '../../assets/influences/politics.jpg';
import streets from '../../assets/influences/streets.jpg';
import transportation from '../../assets/influences/transportation.jpg';
import underground from '../../assets/influences/underground.jpg';
import univercity from '../../assets/influences/university.jpg';

export default function getInfluenceImg(influence: string): string {
  let infImg: string;

  switch (influence) {
    case 'Alta Sociedade':
      infImg = highsociety;
      break;

    case 'Burocracia':
      infImg = bureaucracy;
      break;

    case 'Finanças':
      infImg = finances;
      break;

    case 'Igreja':
      infImg = church;
      break;

    case 'Indústria':
      infImg = industry;
      break;

    case 'Legal':
      infImg = legal;
      break;

    case 'Mídia':
      infImg = media;
      break;

    case 'Ocultismo':
      infImg = occult;
      break;

    case 'Polícia':
      infImg = police;
      break;

    case 'Política':
      infImg = politics;
      break;

    case 'Ruas':
      infImg = streets;
      break;

    case 'Saúde':
      infImg = health;
      break;

    case 'Submundo':
      infImg = underground;
      break;

    case 'Transporte':
      infImg = transportation;
      break;

    case 'Universidade':
      infImg = univercity;
      break;

    default:
      infImg = '';
  }

  return infImg;
}
