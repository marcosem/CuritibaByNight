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
  GiMinions,
  GiOrganigram,
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
    stOnly: true,
    // stOnly: false,
  },
  {
    name: 'Meus personagens',
    Icon: GiOrganigram,
    link: '/mycharacters',
    stOnly: true,
    // stOnly: false,
  },
  {
    name: 'Jogadores',
    Icon: GiDarkSquad,
    link: '/players',
    stOnly: true,
  },
  {
    name: 'PCs',
    Icon: GiVampireDracula,
    link: '',
    stOnly: true,
    items: [
      {
        name: 'Todos PCs',
        link: '/characters/pc',
        stOnly: true,
      },
      {
        name: 'Adicionar um PC',
        link: '/addchar/pc',
        stOnly: true,
      },
      {
        name: 'Atualizar um PC',
        link: '/updatechar/pc',
        stOnly: true,
      },
      {
        name: 'Atualizar vários PCs',
        link: '/updatemultichars/pc',
        stOnly: true,
      },
    ],
  },
  {
    name: 'NPCs',
    Icon: GiMinions,
    link: '',
    stOnly: true,
    items: [
      {
        name: 'Todos NPCs',
        link: '/characters/npc',
        stOnly: true,
      },
      {
        name: 'Adicionar um NPC',
        link: '/addchar/npc',
        stOnly: true,
      },
      {
        name: 'Atualizar um NPC',
        link: '/updatechar/npc',
        stOnly: true,
      },
      {
        name: 'Atualizar vários NPCs',
        link: '/updatemultichars/npc',
        stOnly: true,
      },
    ],
  },
  {
    name: 'Mapa',
    Icon: FaMap,
    link: '/locals',
    // BLOCK ADDED
    // stOnly: false,
    stOnly: true,
  },
  {
    name: 'Locais',
    Icon: GiPositionMarker,
    link: '',
    stOnly: true,
    items: [
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
    // BLOCK ADDED
    // stOnly: false,
    stOnly: true,
    items: [
      {
        name: 'Minhas ações',
        link: '/actions',
        // BLOCK ADDED
        // stOnly: false,
        stOnly: true,
      },
      {
        name: 'Revisar ações',
        link: '/actionsreview',
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
    name: 'Regras',
    Icon: GiStabbedNote,
    link: '/rules',
    // BLOCK ADDED
    // stOnly: false,
    stOnly: true,
  },
  {
    name: 'Influências',
    Icon: GiStoneTower,
    link: '',
    // BLOCK ADDED
    // stOnly: false,
    stOnly: true,
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
];
