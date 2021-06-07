/* eslint-disable react/jsx-curly-newline */
/* eslint-disable camelcase */
import React, {
  useState,
  useCallback,
  useEffect,
  MouseEvent,
  useRef,
} from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiAlertTriangle } from 'react-icons/fi';
import { FaSortAlphaDown, FaSortAlphaUpAlt } from 'react-icons/fa';
import colorSet from './colorSet';
import api from '../../services/api';

import {
  Container,
  TitleBox,
  TableWrapper,
  Table,
  TableColumnHeader,
  TableCellHeader,
  TableColumn,
  TableCell,
  GoBackButton,
  ReturnButton,
  PieChartContainer,
} from './styles';

import Loading from '../../components/Loading';

import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';
import { useHeader } from '../../hooks/header';

import influencesAbilities from '../Influences/influencesAbilities.json';

interface IInfluenceCapacityDTO {
  name: string;
  total: number;
  leader_level: number;
  leaders: [
    {
      id: string;
      name: string;
    },
  ];
}

interface IInfluenceCharDTO {
  name: string;
  level_perm: number;
  level_temp: number;
  ability: string;
  ability_level: number;
  defense_passive: number;
  defense_active: number;
}

interface ICharInfluenceDTO {
  character: {
    id: string;
    name: string;
    creature_type: string;
    clan: string;
    sect: string;
    situation: string;
    npc: boolean;
    morality: string;
    morality_level: number;
    retainers_level_perm: number;
    retainers_level_temp: number;
    attributes: number;
    influence_capacity: number;
    actions: number;
  };
  influences?: IInfluenceCharDTO[];
}

interface ICharactersInfluencesDTO {
  domain_capacity: number;
  influence_capacity: IInfluenceCapacityDTO[];
  list: ICharInfluenceDTO[];
}

interface ISortOrder {
  column: string;
  orderAZ: boolean;
}

interface IStatsPie {
  title: string;
  value: number;
  color: string;
}

interface IStats {
  total: number;
  pieStats: IStatsPie[];
}

const InfluencesStat: React.FC = () => {
  const [influencesStat, setInfluencesStats] =
    useState<ICharactersInfluencesDTO>({} as ICharactersInfluencesDTO);
  const [selInfluence, setSelInfluence] = useState<string>('');
  const [influenceDetails, setInfluenceDetails] = useState<ICharInfluenceDTO[]>(
    [],
  );
  const [sortOrder, setSortOrder] = useState<ISortOrder>({
    column: 'level',
    orderAZ: true,
  });
  const [isScrollOn, setIsScrollOn] = useState<boolean>(false);
  const [isBusy, setBusy] = useState(false);
  const [statByCreature, setStatByCreature] = useState<IStats>({} as IStats);
  const [statByVampSect, setStatByVampSect] = useState<IStats>({} as IStats);
  const [statByVampClan, setStatByVampClan] = useState<IStats>({} as IStats);
  const [statByMembers, setStatByMembers] = useState<IStats>({} as IStats);
  const [statByVampRetainers, setStatByVampRetainers] = useState<IStats>(
    {} as IStats,
  );
  const { addToast } = useToast();
  const { signOut } = useAuth();
  const { setCurrentPage } = useHeader();
  const tableRowRef = useRef<HTMLTableRowElement>(null);
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);

  const getInfluencePortuguese = useCallback((influence): string => {
    const infAbility = influencesAbilities.influences.find(
      infAbi => infAbi.influence === influence,
    );

    if (infAbility) {
      return infAbility.influence_PT;
    }

    return '';
  }, []);

  const loadInfluencesStat = useCallback(async () => {
    setBusy(true);

    try {
      await api.get('characters/influences').then(response => {
        const res: ICharactersInfluencesDTO = response.data;

        // Sort influeces in portuguese
        const infCap: IInfluenceCapacityDTO[] = res.influence_capacity;

        infCap.sort(
          (infA: IInfluenceCapacityDTO, infB: IInfluenceCapacityDTO) => {
            const infA_PT = getInfluencePortuguese(infA.name);
            const infB_PT = getInfluencePortuguese(infB.name);

            if (infA_PT < infB_PT) return -1;
            if (infA_PT > infB_PT) return 1;

            return 0;
          },
        );

        res.list = res.list.map(charInf => {
          const newCharInf = charInf;

          if (newCharInf.character.clan) {
            const filteredClan = newCharInf.character.clan.split(' (');
            // eslint-disable-next-line prefer-destructuring
            newCharInf.character.clan = filteredClan[0];
          }

          return newCharInf;
        });

        res.influence_capacity = infCap;

        setInfluencesStats(res);
      });
    } catch (error) {
      const { message } = error.response.data;

      if (message?.indexOf('token') > 0 && error.response.status === 401) {
        addToast({
          type: 'error',
          title: 'Sessão Expirada',
          description: 'Sessão de usuário expirada, faça o login novamente!',
        });

        signOut();
      } else {
        addToast({
          type: 'error',
          title: 'Erro ao tentar listar as estatísticas das influências',
          description: `Erro: '${message}'`,
        });
      }
    }

    setBusy(false);
  }, [addToast, getInfluencePortuguese, signOut]);

  const sortList = useCallback(
    (
      list: ICharInfluenceDTO[],
      column: string,
      orderAZ: boolean,
    ): ICharInfluenceDTO[] => {
      const currSortOrder: ISortOrder = {
        column,
        orderAZ,
      };

      setSortOrder(currSortOrder);

      list.sort((infA: ICharInfluenceDTO, infB: ICharInfluenceDTO) => {
        let colA: string | number;
        let colB: string | number;
        let colALayer2 = '';
        let colBLayer2 = '';

        switch (column) {
          case 'character':
            colA = infA.character.name;
            colB = infB.character.name;
            break;
          case 'defense_passive':
            colA =
              infA.influences?.length === 1
                ? infA.influences[0].defense_passive
                : -1;
            colB =
              infB.influences?.length === 1
                ? infB.influences[0].defense_passive
                : -1;
            colALayer2 = infA.character.name;
            colBLayer2 = infB.character.name;
            break;
          case 'defense_active':
            colA =
              infA.influences?.length === 1
                ? infA.influences[0].defense_active
                : -1;
            colB =
              infB.influences?.length === 1
                ? infB.influences[0].defense_active
                : -1;
            colALayer2 = infA.character.name;
            colBLayer2 = infB.character.name;
            break;

          case 'creature_type':
            if (
              infA.character.creature_type === 'Mortal' &&
              infA.character.clan.indexOf('Ghoul') >= 0
            ) {
              colA = 'Ghoul';
            } else {
              colA = infA.character.creature_type;
            }

            if (
              infB.character.creature_type === 'Mortal' &&
              infB.character.clan.indexOf('Ghoul') >= 0
            ) {
              colB = 'Ghoul';
            } else {
              colB = infB.character.creature_type;
            }

            colALayer2 = infA.character.name;
            colBLayer2 = infB.character.name;
            break;

          case 'morality':
            if (
              infA.character.creature_type === 'Werewolf' ||
              infA.character.creature_type === 'Mage'
            ) {
              colA = 'A';
            } else {
              colA = infA.character.morality === 'Humanity' ? 'A' : 'Z';
            }

            if (
              infB.character.creature_type === 'Werewolf' ||
              infB.character.creature_type === 'Mage'
            ) {
              colB = 'A';
            } else {
              colB = infB.character.morality === 'Humanity' ? 'A' : 'Z';
            }

            colALayer2 = infA.character.name;
            colBLayer2 = infB.character.name;
            break;
          case 'retainer':
            if (
              infA.character.clan.indexOf('Ghoul') >= 0 ||
              infA.character.clan.indexOf('Mortal Retainer') >= 0
            ) {
              colA = 'A';
            } else {
              colA = 'Z';
            }

            if (
              infB.character.clan.indexOf('Ghoul') >= 0 ||
              infB.character.clan.indexOf('Mortal Retainer') >= 0
            ) {
              colB = 'A';
            } else {
              colB = 'Z';
            }
            colALayer2 = infA.character.name;
            colBLayer2 = infB.character.name;
            break;
          case 'level':
          default:
            colA =
              infA.influences?.length === 1
                ? infA.influences[0].level_perm
                : -1;
            colB =
              infB.influences?.length === 1
                ? infB.influences[0].level_perm
                : -1;
            colALayer2 = infA.character.name;
            colBLayer2 = infB.character.name;
            break;
        }

        if (colA < colB) return orderAZ ? -1 : 1;

        if (colA > colB) return orderAZ ? 1 : -1;

        if (colA === colB && (colALayer2 !== '' || colBLayer2 !== '')) {
          const layer2A = colALayer2
            .toUpperCase()
            .replace(/[ÁÀÃÂ]/gi, 'A')
            .replace(/[ÉÊ]/gi, 'E')
            .replace(/[Í]/gi, 'I')
            .replace(/[ÓÔÕ]/gi, 'O')
            .replace(/[Ú]/gi, 'U');

          const layer2B = colBLayer2
            .toUpperCase()
            .replace(/[ÁÀÃÂ]/gi, 'A')
            .replace(/[ÉÊ]/gi, 'E')
            .replace(/[Í]/gi, 'I')
            .replace(/[ÓÔÕ]/gi, 'O')
            .replace(/[Ú]/gi, 'U');

          if (layer2A < layer2B) return -1;

          if (layer2A > layer2B) return 1;
        }

        return 0;
      });

      return list;
    },
    [],
  );

  const generateStatistics = useCallback(() => {
    if (influencesStat?.list === undefined) {
      return;
    }

    const sourceList: ICharInfluenceDTO[] =
      selInfluence === '' ? influencesStat.list : influenceDetails;

    let newStatByCreature: IStatsPie[] = [];
    let totalStatByCreature = 0;
    let newStatByVampSect: IStatsPie[] = [];
    let totalStatByVampSect = 0;
    let newStatByVampClan: IStatsPie[] = [];
    let totalStatByVampClan = 0;
    const newStatByMembers: IStatsPie[] = [];
    let totalStatByMembers = 0;
    let newStatByVampRetainers: IStatsPie[] = [];
    let totalStatByVampRetainers = 0;

    let colorSetIndex = 0;
    sourceList.forEach((charInf: ICharInfluenceDTO) => {
      if (charInf.influences) {
        const color = colorSet[colorSetIndex];

        let value = 0;
        charInf.influences.forEach(inf => {
          value += inf.level_perm;
        });

        newStatByMembers.push({
          title: charInf.character.name,
          value,
          color,
        } as IStatsPie);
        totalStatByMembers += value;

        let creatureStat: IStatsPie | undefined = newStatByCreature.find(
          creat => creat.title === charInf.character.creature_type,
        );

        if (creatureStat === undefined) {
          creatureStat = {
            title: charInf.character.creature_type,
            value,
            color,
          } as IStatsPie;

          newStatByCreature.push(creatureStat);
        } else {
          creatureStat.value += value;

          newStatByCreature = newStatByCreature.map(creat =>
            creat.title === creatureStat?.title ? creatureStat : creat,
          );
        }
        totalStatByCreature += value;

        let creatureType = '';
        if (charInf.character.creature_type === 'Vampire') {
          creatureType = 'Vampire';

          let sectStat: IStatsPie | undefined = newStatByVampSect.find(
            sect => sect.title === charInf.character.sect,
          );

          if (sectStat === undefined) {
            sectStat = {
              title: charInf.character.sect,
              value,
              color,
            } as IStatsPie;

            newStatByVampSect.push(sectStat);
          } else {
            sectStat.value += value;

            newStatByVampSect = newStatByVampSect.map(sect =>
              sect.title === sectStat?.title ? sectStat : sect,
            );
          }

          totalStatByVampSect += value;

          let clanStat: IStatsPie | undefined = newStatByVampClan.find(
            sect => sect.title === charInf.character.clan,
          );

          if (clanStat === undefined) {
            clanStat = {
              title: charInf.character.clan,
              value,
              color,
            } as IStatsPie;

            newStatByVampClan.push(clanStat);
          } else {
            clanStat.value += value;

            newStatByVampClan = newStatByVampClan.map(clan =>
              clan.title === clanStat?.title ? clanStat : clan,
            );
          }

          totalStatByVampClan += value;
        } else if (
          charInf.character.clan.indexOf('Ghoul') >= 0 ||
          charInf.character.clan.indexOf('Mortal Retainer') >= 0
        ) {
          creatureType = 'Retainer';
        }

        if (creatureType !== '') {
          let vampRetStat: IStatsPie | undefined = newStatByVampRetainers.find(
            sect => sect.title === creatureType,
          );

          if (vampRetStat === undefined) {
            vampRetStat = {
              title: creatureType,
              value,
              color,
            } as IStatsPie;

            newStatByVampRetainers.push(vampRetStat);
          } else {
            vampRetStat.value += value;

            newStatByVampRetainers = newStatByVampRetainers.map(creat =>
              creat.title === vampRetStat?.title ? vampRetStat : creat,
            );
          }

          totalStatByVampRetainers += value;
        }

        colorSetIndex =
          colorSet.length === colorSetIndex + 1 ? 0 : colorSetIndex + 1;
      }
    });

    setStatByMembers({
      total: totalStatByMembers,
      pieStats: newStatByMembers,
    });
    setStatByCreature({
      total: totalStatByCreature,
      pieStats: newStatByCreature,
    });
    setStatByVampSect({
      total: totalStatByVampSect,
      pieStats: newStatByVampSect,
    });
    setStatByVampClan({
      total: totalStatByVampClan,
      pieStats: newStatByVampClan,
    });
    setStatByVampRetainers({
      total: totalStatByVampRetainers,
      pieStats: newStatByVampRetainers,
    });
  }, [influenceDetails, influencesStat, selInfluence]);

  const handleSortColumn = useCallback(
    (e: MouseEvent<HTMLTableHeaderCellElement>) => {
      const columnId = e.currentTarget.id;
      const mySortOrder =
        sortOrder.column === columnId ? !sortOrder.orderAZ : true;

      const myInfDetails = sortList(influenceDetails, columnId, mySortOrder);

      setInfluenceDetails(myInfDetails);
    },
    [influenceDetails, sortList, sortOrder.column, sortOrder.orderAZ],
  );

  const handleShowDetails = useCallback(
    (influence: string) => {
      const newInfluence = influence;

      if (newInfluence === '') {
        setInfluenceDetails([]);
        setSortOrder({
          column: 'level',
          orderAZ: true,
        });
      } else {
        const newInfluenceDetails = influencesStat.list
          .filter(
            infList =>
              infList.influences?.find(inf => inf.name === newInfluence) !==
              undefined,
          )
          .map(infDet => {
            const newInfDet: ICharInfluenceDTO = {
              character: infDet.character,
              influences: infDet.influences?.filter(
                myInf => myInf.name === newInfluence,
              ),
            };

            return newInfDet;
          });

        const sortedInfluenceDetails = sortList(
          newInfluenceDetails,
          'level',
          false,
        );

        setInfluenceDetails(sortedInfluenceDetails);
      }

      setSelInfluence(newInfluence);
    },
    [influencesStat.list, sortList],
  );

  useEffect(() => {
    generateStatistics();
  }, [generateStatistics, influenceDetails, influencesStat.list]);

  useEffect(() => {
    if (tableRowRef.current && tableBodyRef.current) {
      if (
        tableRowRef.current.offsetWidth === tableBodyRef.current.offsetWidth
      ) {
        setIsScrollOn(false);
      } else {
        setIsScrollOn(true);
      }
    }
  }, [selInfluence]);

  useEffect(() => {
    setCurrentPage('influences');
    loadInfluencesStat();
  }, [loadInfluencesStat, setCurrentPage]);

  return (
    <Container>
      {isBusy ? (
        <Loading />
      ) : (
        <>
          <TitleBox>
            <strong>
              {`Estatísticas de Influências${
                selInfluence !== ''
                  ? ` em ${getInfluencePortuguese(selInfluence)}`
                  : ''
              }`}
            </strong>
          </TitleBox>

          {selInfluence !== '' ? (
            <>
              <TableWrapper detailedTable>
                <Table detailedTable>
                  <thead>
                    <tr>
                      <TableColumnHeader
                        mySize="short"
                        id="level"
                        onClick={handleSortColumn}
                      >
                        <TableCellHeader
                          highlight={sortOrder.column === 'level'}
                        >
                          <span>Nível</span>
                          {sortOrder.column === 'level' ? (
                            <>
                              {sortOrder.orderAZ ? (
                                <FaSortAlphaDown />
                              ) : (
                                <FaSortAlphaUpAlt />
                              )}
                            </>
                          ) : (
                            <FaSortAlphaDown />
                          )}
                        </TableCellHeader>
                      </TableColumnHeader>
                      <TableColumnHeader
                        id="character"
                        onClick={handleSortColumn}
                      >
                        <TableCellHeader
                          highlight={sortOrder.column === 'character'}
                        >
                          <span>Personagem</span>
                          {sortOrder.column === 'character' ? (
                            <>
                              {sortOrder.orderAZ ? (
                                <FaSortAlphaDown />
                              ) : (
                                <FaSortAlphaUpAlt />
                              )}
                            </>
                          ) : (
                            <FaSortAlphaDown />
                          )}
                        </TableCellHeader>
                      </TableColumnHeader>
                      <TableColumnHeader
                        mySize="intermediate"
                        id="creature_type"
                        onClick={handleSortColumn}
                      >
                        <TableCellHeader
                          highlight={sortOrder.column === 'creature_type'}
                        >
                          <span>Tipo</span>
                          {sortOrder.column === 'creature_type' ? (
                            <>
                              {sortOrder.orderAZ ? (
                                <FaSortAlphaDown />
                              ) : (
                                <FaSortAlphaUpAlt />
                              )}
                            </>
                          ) : (
                            <FaSortAlphaDown />
                          )}
                        </TableCellHeader>
                      </TableColumnHeader>
                      <TableColumnHeader
                        mySize="intermediate"
                        id="defense_passive"
                        onClick={handleSortColumn}
                      >
                        <TableCellHeader
                          highlight={sortOrder.column === 'defense_passive'}
                        >
                          <span>Def.Passiva</span>
                          {sortOrder.column === 'defense_passive' ? (
                            <>
                              {sortOrder.orderAZ ? (
                                <FaSortAlphaDown />
                              ) : (
                                <FaSortAlphaUpAlt />
                              )}
                            </>
                          ) : (
                            <FaSortAlphaDown />
                          )}
                        </TableCellHeader>
                      </TableColumnHeader>
                      <TableColumnHeader
                        mySize="intermediate"
                        id="defense_active"
                        onClick={handleSortColumn}
                      >
                        <TableCellHeader
                          highlight={sortOrder.column === 'defense_active'}
                        >
                          <span>Def.Ativa</span>
                          {sortOrder.column === 'defense_active' ? (
                            <>
                              {sortOrder.orderAZ ? (
                                <FaSortAlphaDown />
                              ) : (
                                <FaSortAlphaUpAlt />
                              )}
                            </>
                          ) : (
                            <FaSortAlphaDown />
                          )}
                        </TableCellHeader>
                      </TableColumnHeader>
                      <TableColumnHeader
                        mySize="intermediate"
                        id="morality"
                        onClick={handleSortColumn}
                      >
                        <TableCellHeader
                          highlight={sortOrder.column === 'morality'}
                        >
                          <span>Humanidade</span>
                          {sortOrder.column === 'morality' ? (
                            <>
                              {sortOrder.orderAZ ? (
                                <FaSortAlphaDown />
                              ) : (
                                <FaSortAlphaUpAlt />
                              )}
                            </>
                          ) : (
                            <FaSortAlphaDown />
                          )}
                        </TableCellHeader>
                      </TableColumnHeader>
                      <TableColumnHeader
                        mySize="short"
                        id="retainer"
                        onClick={handleSortColumn}
                      >
                        <TableCellHeader
                          highlight={sortOrder.column === 'retainer'}
                        >
                          <span>Lacaio</span>
                          {sortOrder.column === 'retainer' ? (
                            <>
                              {sortOrder.orderAZ ? (
                                <FaSortAlphaDown />
                              ) : (
                                <FaSortAlphaUpAlt />
                              )}
                            </>
                          ) : (
                            <FaSortAlphaDown />
                          )}
                        </TableCellHeader>
                      </TableColumnHeader>
                    </tr>
                  </thead>
                  <tbody ref={tableBodyRef}>
                    {influenceDetails.length > 0 &&
                      influenceDetails.map((infDet, rowIndex) => (
                        <tr
                          key={infDet.character.id}
                          title={`${infDet.character.name} - ${
                            infDet.character.creature_type
                          }${
                            infDet.character.clan !== ''
                              ? ` - ${infDet.character.clan}`
                              : ''
                          }`}
                          ref={rowIndex === 0 ? tableRowRef : undefined}
                        >
                          <TableColumn mySize="short">
                            <TableCell mySize="short">
                              <strong>
                                {infDet.influences?.length === 1
                                  ? infDet.influences[0].level_perm
                                  : 0}
                              </strong>
                            </TableCell>
                          </TableColumn>
                          <TableColumn>
                            <TableCell>
                              <span>{infDet.character.name}</span>
                            </TableCell>
                          </TableColumn>

                          <TableColumn mySize="intermediate">
                            <TableCell mySize="intermediate">
                              <span>
                                {`${
                                  infDet.character.creature_type === 'Mortal' &&
                                  infDet.character.clan.indexOf('Ghoul') >= 0
                                    ? 'Ghoul'
                                    : infDet.character.creature_type
                                }`}
                              </span>
                            </TableCell>
                          </TableColumn>

                          <TableColumn mySize="intermediate">
                            <TableCell mySize="intermediate">
                              <strong>
                                {infDet.influences?.length === 1
                                  ? infDet.influences[0].defense_passive
                                  : 0}
                              </strong>
                            </TableCell>
                          </TableColumn>
                          <TableColumn mySize="intermediate">
                            <TableCell mySize="intermediate">
                              <strong>
                                {infDet.influences?.length === 1
                                  ? infDet.influences[0].defense_active
                                  : 0}
                              </strong>
                            </TableCell>
                          </TableColumn>
                          <TableColumn mySize="intermediate">
                            <TableCell mySize="intermediate">
                              <span>
                                {infDet.character.morality === 'Humanity'
                                  ? ''
                                  : `${
                                      infDet.character.creature_type ===
                                        'Werewolf' ||
                                      infDet.character.creature_type === 'Mage'
                                        ? ''
                                        : 'Não'
                                    }`}
                              </span>
                            </TableCell>
                          </TableColumn>
                          <TableColumn mySize="short" isScrollOn={isScrollOn}>
                            <TableCell mySize="short">
                              <span>
                                {infDet.character.clan.indexOf('Ghoul') >= 0 ||
                                infDet.character.clan.indexOf(
                                  'Mortal Retainer',
                                ) >= 0
                                  ? 'Sim'
                                  : ''}
                              </span>
                            </TableCell>
                          </TableColumn>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </TableWrapper>
              <GoBackButton
                type="button"
                onClick={() => handleShowDetails('')}
                title="Voltar às Estatísticas Gerais"
              >
                <FiArrowLeft />
              </GoBackButton>
            </>
          ) : (
            <>
              <TableWrapper>
                <Table>
                  <thead>
                    <tr>
                      <TableColumnHeader>Influência</TableColumnHeader>
                      <TableColumnHeader mySize="short">
                        Capacidade
                      </TableColumnHeader>
                      <TableColumnHeader>Líderes</TableColumnHeader>
                      <TableColumnHeader mySize="short">
                        Nível
                      </TableColumnHeader>
                    </tr>
                  </thead>
                  <tbody ref={tableBodyRef}>
                    {influencesStat.influence_capacity &&
                      influencesStat.influence_capacity.map(
                        (infCap, rowIndex) => (
                          <tr
                            key={infCap.name}
                            onClick={() => handleShowDetails(infCap.name)}
                            ref={rowIndex === 0 ? tableRowRef : undefined}
                          >
                            <TableColumn>
                              <TableCell>
                                <strong>
                                  {getInfluencePortuguese(infCap.name)}
                                </strong>
                              </TableCell>
                            </TableColumn>
                            <TableColumn mySize="short">
                              <TableCell
                                mySize="short"
                                highlight={
                                  infCap.total >= influencesStat.domain_capacity
                                }
                              >
                                <span
                                  title={
                                    infCap.total >
                                    influencesStat.domain_capacity
                                      ? 'Acima da Capacidade do Domínio'
                                      : ''
                                  }
                                >
                                  {infCap.total}
                                  {infCap.total >
                                    influencesStat.domain_capacity && (
                                    <FiAlertTriangle />
                                  )}
                                </span>
                              </TableCell>
                            </TableColumn>
                            <TableColumn>
                              <TableCell>
                                {infCap.leaders.map(leader => (
                                  <span key={leader.id}>{leader.name}</span>
                                ))}
                              </TableCell>
                            </TableColumn>
                            <TableColumn mySize="short" isScrollOn={isScrollOn}>
                              <TableCell mySize="short">
                                <strong>{infCap.leader_level}</strong>
                              </TableCell>
                            </TableColumn>
                          </tr>
                        ),
                      )}
                  </tbody>
                </Table>
              </TableWrapper>
              <ReturnButton>
                <Link to="/influences" title="Retornar">
                  <FiArrowLeft />
                </Link>
              </ReturnButton>
            </>
          )}
        </>
      )}
      <PieChartContainer>
        {statByCreature.pieStats?.length > 0 && (
          <>
            <h1>
              {`${
                selInfluence === ''
                  ? 'Influências/'
                  : `Influências em ${getInfluencePortuguese(selInfluence)}/`
              }Criaturas (${statByCreature.total})`}
            </h1>
            <PieChart
              data={statByCreature.pieStats}
              totalValue={statByCreature.total}
              label={({ dataEntry }) =>
                `${dataEntry.title} (${Math.round(dataEntry.percentage)}%)`
              }
              labelStyle={() => ({ fontSize: '5px' })}
              animate
              // segmentsShift={0.5} space between segments
              // lineWidth={20} hole in the middle
              // radius={50} size of the circle - 50 = 100%
            />
          </>
        )}

        {statByVampSect.pieStats?.length > 0 && (
          <>
            <h1>
              {`${
                selInfluence === ''
                  ? 'Influências/'
                  : `Influências em ${getInfluencePortuguese(selInfluence)}/`
              }Sectos de Vampiros (${statByVampSect.total})`}
            </h1>
            <PieChart
              data={statByVampSect.pieStats}
              totalValue={statByVampSect.total}
              label={({ dataEntry }) =>
                `${dataEntry.title} (${Math.round(dataEntry.percentage)}%)`
              }
              labelStyle={() => ({ fontSize: '5px' })}
              animate
            />
          </>
        )}

        {statByVampClan.pieStats?.length > 0 && (
          <>
            <h1>
              {`${
                selInfluence === ''
                  ? 'Influências/'
                  : `Influências em ${getInfluencePortuguese(selInfluence)}/`
              }Clãs de Vampiros (${statByVampClan.total})`}
            </h1>
            <PieChart
              data={statByVampClan.pieStats}
              totalValue={statByVampClan.total}
              label={({ dataEntry }) => `${Math.round(dataEntry.percentage)}%`}
              labelStyle={() => ({ fontSize: '5px' })}
              animate
            />
          </>
        )}

        {statByVampRetainers.pieStats?.length > 0 && (
          <>
            <h1>
              {`${
                selInfluence === ''
                  ? 'Influências/'
                  : `Influências em ${getInfluencePortuguese(selInfluence)}/`
              }Vampiros x Lacaios (${statByVampRetainers.total})`}
            </h1>
            <PieChart
              data={statByVampRetainers.pieStats}
              totalValue={statByVampRetainers.total}
              label={({ dataEntry }) =>
                `${dataEntry.title} (${Math.round(dataEntry.percentage)}%)`
              }
              labelStyle={() => ({ fontSize: '5px' })}
              animate
            />
          </>
        )}

        {statByMembers.pieStats?.length > 0 && (
          <>
            <h1>
              {`${
                selInfluence === ''
                  ? 'Influências/'
                  : `Influências em ${getInfluencePortuguese(selInfluence)}/`
              }Membros (${statByMembers.total})`}
            </h1>
            <PieChart
              data={statByMembers.pieStats}
              totalValue={statByMembers.total}
              label={({ dataEntry }) => `${Math.round(dataEntry.percentage)}%`}
              labelStyle={() => ({ fontSize: '5px' })}
              animate
            />
          </>
        )}
      </PieChartContainer>
    </Container>
  );
};

export default InfluencesStat;
