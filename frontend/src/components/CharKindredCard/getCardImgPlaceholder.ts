import cardAssamite from '../../assets/cardsplaceholder/card_assamite.png';
import cardBaali from '../../assets/cardsplaceholder/card_baali.png';
import cardBrujah from '../../assets/cardsplaceholder/card_brujah.png';
import cardBrujahAt from '../../assets/cardsplaceholder/card_brujahantitribu.png';
import cardCaitiff from '../../assets/cardsplaceholder/card_caitiff.png';
import cardDaughter from '../../assets/cardsplaceholder/card_daughterofcacophony.png';
import cardSetite from '../../assets/cardsplaceholder/card_followerofset.png';
import cardGangrel from '../../assets/cardsplaceholder/card_gangrel.png';
import cardGangrelAt from '../../assets/cardsplaceholder/card_gangrelantitribu.png';
import cardGargoyle from '../../assets/cardsplaceholder/card_gargoyle.png';
import cardGiovanni from '../../assets/cardsplaceholder/card_giovanni.png';
import cardHarbinger from '../../assets/cardsplaceholder/card_harbingerofskulls.png';
import cardLasombra from '../../assets/cardsplaceholder/card_lasombra.png';
import cardMalkavian from '../../assets/cardsplaceholder/card_malkavian.png';
import cardMalkavianAt from '../../assets/cardsplaceholder/card_malkavianantitribu.png';
import cardNosferatu from '../../assets/cardsplaceholder/card_nosferatu.png';
import cardNosferatuAt from '../../assets/cardsplaceholder/card_nosferatuantitribu.png';
import cardPander from '../../assets/cardsplaceholder/card_pander.png';
import cardRavnos from '../../assets/cardsplaceholder/card_ravnos.png';
import cardSalubriAt from '../../assets/cardsplaceholder/card_salubriantitribu.png';
import cardSamedi from '../../assets/cardsplaceholder/card_samedi.png';
import cardToreador from '../../assets/cardsplaceholder/card_toreador.png';
import cardToreadorAt from '../../assets/cardsplaceholder/card_toreadorantitribu.png';
import cardTremere from '../../assets/cardsplaceholder/card_tremere.png';
import cardTzimisce from '../../assets/cardsplaceholder/card_tzimisce.png';
import cardVentrue from '../../assets/cardsplaceholder/card_ventrue.png';
import cardVentrueAt from '../../assets/cardsplaceholder/card_ventrueantitribu.png';

export default function getCardImg(clan: string): string {
  let cardImg: string;

  switch (clan) {
    case 'Assamite':
    case 'Assamite Antitribu':
      cardImg = cardAssamite;
      break;
    case 'Baali':
      cardImg = cardBaali;
      break;
    case 'Brujah':
    case 'Brujah (Kairos Changed)':
      cardImg = cardBrujah;
      break;
    case 'Brujah Antitribu':
      cardImg = cardBrujahAt;
      break;
    case 'Daughters of Cacophony':
      cardImg = cardDaughter;
      break;
    case 'Followers of Set':
    case 'Tlacique':
    case 'Serpents of the Light':
      cardImg = cardSetite;
      break;
    case 'Gangrel':
      cardImg = cardGangrel;
      break;
    case 'City Gangrel':
    case 'Gangrel Antitribu':
      cardImg = cardGangrelAt;
      break;
    case 'Gargoyle':
      cardImg = cardGargoyle;
      break;
    case 'Giovanni':
      cardImg = cardGiovanni;
      break;
    case 'Harbingers of Skulls':
      cardImg = cardHarbinger;
      break;
    case 'Lasombra':
    case 'Lasombra Antitribu':
      cardImg = cardLasombra;
      break;
    case 'Malkavian':
      cardImg = cardMalkavian;
      break;
    case 'Malkavian Antitribu':
      cardImg = cardMalkavianAt;
      break;
    case 'Nosferatu':
      cardImg = cardNosferatu;
      break;
    case 'Nosferatu Antitribu':
      cardImg = cardNosferatuAt;
      break;
    case 'Panders':
      cardImg = cardPander;
      break;
    case 'Ravnos':
      cardImg = cardRavnos;
      break;
    case 'Salubri Antitribu':
      cardImg = cardSalubriAt;
      break;
    case 'Samedi':
      cardImg = cardSamedi;
      break;
    case 'Toreador':
      cardImg = cardToreador;
      break;
    case 'Toreador Antitribu':
      cardImg = cardToreadorAt;
      break;
    case 'Tremere':
      cardImg = cardTremere;
      break;
    case 'Tzimisce':
      cardImg = cardTzimisce;
      break;
    case 'Ventrue':
      cardImg = cardVentrue;
      break;
    case 'Ventrue Antitribu':
      cardImg = cardVentrueAt;
      break;
    case 'Caitiff':
    default:
      cardImg = cardCaitiff;
  }

  return cardImg;
}
