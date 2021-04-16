import cardAssamite from '../../assets/cards/card_assamite.png';
import cardBaali from '../../assets/cards/card_baali.png';
import cardBrujah from '../../assets/cards/card_brujah.png';
import cardBrujahAt from '../../assets/cards/card_brujahantitribu.png';
import cardCaitiff from '../../assets/cards/card_caitiff.png';
import cardDaughter from '../../assets/cards/card_daughterofcacophony.png';
import cardSetite from '../../assets/cards/card_followerofset.png';
import cardGangrel from '../../assets/cards/card_gangrel.png';
import cardGangrelAt from '../../assets/cards/card_gangrelantitribu.png';
import cardGargoyles from '../../assets/cards/card_gargoyles.png';
import cardGiovanni from '../../assets/cards/card_giovanni.png';
import cardHarbinger from '../../assets/cards/card_harbingerofskulls.png';
import cardLasombra from '../../assets/cards/card_lasombra.png';
import cardMalkavian from '../../assets/cards/card_malkavian.png';
import cardMalkavianAt from '../../assets/cards/card_malkavianantitribu.png';
import cardNosferatu from '../../assets/cards/card_nosferatu.png';
import cardNosferatuAt from '../../assets/cards/card_nosferatuantitribu.png';
import cardPander from '../../assets/cards/card_pander.png';
import cardRavnos from '../../assets/cards/card_ravnos.png';
import cardSalubriAt from '../../assets/cards/card_salubriantitribu.png';
import cardSamedi from '../../assets/cards/card_samedi.png';
import cardToreador from '../../assets/cards/card_toreador.png';
import cardToreadorAt from '../../assets/cards/card_toreadorantitribu.png';
import cardTremere from '../../assets/cards/card_tremere.png';
import cardTzimisce from '../../assets/cards/card_tzimisce.png';
import cardVentrue from '../../assets/cards/card_ventrue.png';
import cardVentrueAt from '../../assets/cards/card_ventrueantitribu.png';

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
    case 'Gargoyles':
      cardImg = cardGargoyles;
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
