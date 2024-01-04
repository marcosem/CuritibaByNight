import { IconType } from 'react-icons';
import { FaHome, FaUser, FaMap } from 'react-icons/fa';
import {
  GiPositionMarker,
  GiSwordSpade,
  GiDarkSquad,
  GiVampireDracula,
  GiSpikedHalo,
  GiStoneTower,
  GiStabbedNote,
} from 'react-icons/gi';
import { FiFlag } from 'react-icons/fi';

export interface ISubMenuItem {
  name: string;
  link: string;
  stOnly: boolean;
}

export interface IMenuItem {
  name: string;
  Icon: IconType;
  link: string;
  stOnly: boolean;
  items?: ISubMenuItem[];
}

export const menuItems: IMenuItem[] = [
  {
    name: 'Home',
    Icon: FaHome,
    link: '/dashboard',
    stOnly: false,
  },
  {
    name: 'Perfil',
    Icon: FaUser,
    link: '/profile',
    stOnly: false,
  },
  {
    name: 'Mapa',
    Icon: FaMap,
    link: '/locals',
    stOnly: false,
  },
  {
    name: 'Locais',
    Icon: GiPositionMarker,
    link: '',
    stOnly: false,
    items: [
      {
        name: 'Locais conhecidos',
        link: '',
        stOnly: false,
      },
      {
        name: 'Adicionar local',
        link: '/addlocal',
        stOnly: true,
      },
      {
        name: 'Editar local',
        link: '/updatelocal',
        stOnly: true,
      },
      {
        name: 'Definir conhecido',
        link: '/localchars',
        stOnly: true,
      },
    ],
  },
  {
    name: 'Territórios',
    link: '/territories',
    Icon: FiFlag,
    stOnly: true,
  },
  {
    name: 'Ações',
    Icon: GiSwordSpade,
    link: '',
    stOnly: false,
    items: [
      {
        name: 'Minhas ações',
        link: '/actions',
        stOnly: false,
      },
      {
        name: 'Revisar ações',
        link: '/actionsreview',
        stOnly: true,
      },
    ],
  },
  {
    name: 'Jogadores',
    Icon: GiDarkSquad,
    link: '/players',
    stOnly: true,
  },
  {
    name: 'Personagens',
    Icon: GiVampireDracula,
    link: '',
    stOnly: true,
    items: [
      {
        name: 'PCs',
        link: '/characters/pc',
        stOnly: true,
      },
      {
        name: 'NPCs',
        link: '/characters/npc',
        stOnly: true,
      },
    ],
  },
  {
    name: 'Poderes',
    Icon: GiSpikedHalo,
    link: '/powers',
    stOnly: true,
  },
  {
    name: 'Influências',
    Icon: GiStoneTower,
    link: '',
    stOnly: false,
    items: [
      {
        name: 'Descrições',
        link: '/influences',
        stOnly: false,
      },
      {
        name: 'Estatísticas',
        link: '/influences/stat',
        stOnly: true,
      },
    ],
  },
  {
    name: 'Regras',
    Icon: GiStabbedNote,
    link: '/rules',
    stOnly: false,
  },
];
