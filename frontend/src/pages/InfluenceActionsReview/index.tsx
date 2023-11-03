/* eslint-disable camelcase */
import React, { useEffect, useState, useCallback } from 'react';

import Skeleton from '@material-ui/lab/Skeleton';
import {
  FaEnvelope,
  FaEnvelopeOpenText,
  FaFileSignature,
  FaCheckCircle,
  FaInfoCircle,
  FaTimesCircle,
  FaClock,
} from 'react-icons/fa';
import { format } from 'date-fns';
import api from '../../services/api';

import {
  Container,
  TitleBox,
  PeriodContainer,
  StyledDatePicker,
  TableWrapper,
  TableTitleRow,
  SearchBox,
  StyledTableContainer,
  StyledTable,
  StyledTableHead,
  StyledTableRow,
  StyledTableCell,
  IconBox,
  StyledTableBody,
} from './styles';

import SearchField from '../../components/SearchField';
import { useHeader } from '../../hooks/header';
import { useToast } from '../../hooks/toast';

import influencesAbilities from '../Influences/influencesAbilities.json';

interface IAction {
  id?: string;
  title: string;
  action_period: string;
  backgrounds: string;
  influence: string;
  influence_level: number;
  influence_effective_level: number;
  ability: string;
  ability_level: number;
  action_owner_id: string;
  endeavor: 'attack' | 'defend' | 'combine' | 'raise capital' | 'other';
  character_id: string;
  storyteller_id?: string;
  action: string;
  action_force?: number;
  status?: 'sent' | 'read' | 'replied';
  st_reply?: string;
  news?: string;
  result?: 'success' | 'partial' | 'fail' | 'not evaluated';
  created_at?: Date;
  updated_at?: Date;
  characterId?: {
    id: string;
    name: string;
  };
  ownerId?: {
    id: string;
    name: string;
  };
  storytellerId?: {
    id: string;
    name: string;
  };
}

const InfluenceActionsReview: React.FC = () => {
  const { setCurrentPage } = useHeader();
  const [period, setPeriod] = useState<Date | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const [actionsList, setActionsList] = useState<IAction[]>([]);
  const [showActionsList, setShowActionsList] = useState<IAction[]>([]);

  const { addToast } = useToast();

  const getInfluencePT = useCallback((influence): string => {
    const infAbility = influencesAbilities.influences.find(
      infAbi => infAbi.influence === influence,
    );

    if (infAbility) {
      return infAbility.influence_PT;
    }

    return '';
  }, []);

  const getStatusPT = useCallback((status): string => {
    let statusPT: string;

    switch (status) {
      case 'sent':
        statusPT = 'Enviado';
        break;
      case 'read':
        statusPT = 'Lido';
        break;
      case 'replied':
        statusPT = 'Respondido';
        break;
      default:
        statusPT = '';
    }

    return statusPT;
  }, []);

  const getStatusIcon = useCallback(status => {
    let MyIcon;

    switch (status) {
      case 'sent':
        MyIcon = <FaEnvelope />;
        break;
      case 'read':
        MyIcon = <FaEnvelopeOpenText />;
        break;
      case 'replied':
        MyIcon = <FaFileSignature />;
        break;
      default:
        MyIcon = null;
    }

    return MyIcon;
  }, []);

  const getResultColor = useCallback(result => {
    let resultColor: string;

    switch (result) {
      case 'success':
        resultColor = 'positive';
        break;
      case 'partial':
        resultColor = 'partial';
        break;
      case 'fail':
        resultColor = 'negative';
        break;
      case 'not evaluated':
      default:
        resultColor = 'weak';
    }

    return resultColor;
  }, []);

  const getResultPT = useCallback(result => {
    let resultPT: string;

    switch (result) {
      case 'success':
        resultPT = 'Sucesso';
        break;
      case 'partial':
        resultPT = 'Parcial';
        break;
      case 'fail':
        resultPT = 'Falhou';
        break;
      case 'not evaluated':
        resultPT = 'Não avaliada';
        break;
      default:
        resultPT = '';
    }

    return resultPT;
  }, []);

  const getResultIcon = useCallback(result => {
    let MyIcon;

    switch (result) {
      case 'success':
        MyIcon = <FaCheckCircle />;
        break;
      case 'partial':
        MyIcon = <FaInfoCircle />;
        break;
      case 'fail':
        MyIcon = <FaTimesCircle />;
        break;
      case 'not evaluated':
        MyIcon = <FaClock />;
        break;
      default:
        MyIcon = null;
    }

    return MyIcon;
  }, []);

  const setActionMonth = useCallback(currentMonth => {
    const newPeriod = `${currentMonth}-02`;
    setPeriod(new Date(newPeriod));
  }, []);

  const loadCurrentActionMonth = useCallback(async () => {
    try {
      await api.get('/influenceactions/currentMonth').then(response => {
        const res: string = response.data.action_month;

        setActionMonth(res);
      });
    } catch (error) {
      const parsedError: any = error;

      if (parsedError.response) {
        const { message } = parsedError.response.data;

        if (parsedError.response.status !== 401) {
          addToast({
            type: 'error',
            title: 'Erro ao tentar recuperar o período atual',
            description: `Erro: '${message}'`,
          });
        }
      }
    }
  }, [addToast, setActionMonth]);

  const updateCurrentActionMonth = useCallback(
    async actionMonth => {
      try {
        await api.patch('/influenceactions/setCurrentMonth', {
          action_month: actionMonth,
        });

        addToast({
          type: 'success',
          title: 'Período atualizado',
          description: `Período atualizado para [${actionMonth}] com sucesso!`,
        });
      } catch (error) {
        const parsedError: any = error;

        if (parsedError.response) {
          const { message } = parsedError.response.data;

          if (parsedError.response.status !== 401) {
            addToast({
              type: 'error',
              title: 'Erro ao tentar atualizar o período atual',
              description: `Erro: '${message}'`,
            });
          }
        }
      }
    },
    [addToast],
  );

  const loadActions = useCallback(async () => {
    setIsBusy(true);

    try {
      await api.post('/influenceactions/list', {}).then(response => {
        const res: IAction[] = response.data;

        const newActionsList = res.sort(
          (actionA: IAction, actionB: IAction) => {
            const actA = actionA.status === 'replied' ? 'B' : 'A';
            const actB = actionB.status === 'replied' ? 'B' : 'A';

            if (actA > actB) return 1;
            if (actA < actB) return -1;
            return 0;
          },
        );

        setActionsList(newActionsList);
        setShowActionsList(newActionsList);
      });
    } catch (error) {
      const parsedError: any = error;

      if (parsedError.response) {
        const { message } = parsedError.response.data;

        if (parsedError.response.status !== 401) {
          addToast({
            type: 'error',
            title: 'Erro ao tentar recuperar a lista de ações',
            description: `Erro: '${message}'`,
          });
        }
      }
    }

    setIsBusy(false);
  }, [addToast]);

  const getPendingActionsList = useCallback(() => {
    return actionsList.filter(action => action.status !== 'replied');
  }, [actionsList]);

  const updateActionMonth = useCallback(
    newPeriod => {
      const newActionMonth = format(newPeriod, 'yyyy-MM');

      const actionsListPending = getPendingActionsList();

      if (actionsListPending.length > 0) {
        addToast({
          type: 'error',
          title: 'Erro ao tentar atualizar o período atual',
          description: `Ainda existem ${actionsListPending.length} ações não revisadas, por favor revise estas ações.`,
        });
      } else {
        updateCurrentActionMonth(newActionMonth);
        setPeriod(newPeriod);
      }
    },
    [addToast, getPendingActionsList, updateCurrentActionMonth],
  );

  const GetActionsList = useCallback(() => {
    if (showActionsList.length === 0) {
      return (
        <StyledTableRow>
          <StyledTableCell align="left">
            Nenhuma ação encontrada
          </StyledTableCell>
          <StyledTableCell align="center" />
          <StyledTableCell align="left" />
          <StyledTableCell align="center" />
          <StyledTableCell align="center" />
          <StyledTableCell align="center" />
          <StyledTableCell align="center" />
        </StyledTableRow>
      );
    }

    return showActionsList.map(action => (
      <StyledTableRow key={action.id}>
        <StyledTableCell align="left">
          {action.characterId?.name}
        </StyledTableCell>
        <StyledTableCell align="center">
          {getInfluencePT(action.influence)}
        </StyledTableCell>
        <StyledTableCell align="left">{action.title}</StyledTableCell>
        <StyledTableCell align="center">
          <IconBox
            colorInterface={
              action.status === 'replied' ? 'positive' : 'neutral'
            }
            title={
              action.status === 'replied' && action.storytellerId?.name
                ? `${getStatusPT(action.status)} por ${
                    action.storytellerId?.name
                  }`
                : getStatusPT(action.status)
            }
          >
            {getStatusIcon(action.status)}
          </IconBox>
        </StyledTableCell>
        <StyledTableCell align="center">
          <IconBox
            colorInterface={getResultColor(action.result)}
            title={getResultPT(action.result)}
          >
            {getResultIcon(action.result)}
          </IconBox>
        </StyledTableCell>
        <StyledTableCell align="center">{action.action_period}</StyledTableCell>
        <StyledTableCell align="center">
          {/* <ActionsContainer>
              {action.status === 'replied' ? (
                <ActionButton
                  title="Visualizar"
                  onClick={() => handleViewAction(action)}
                >
                  <FiEye />
                </ActionButton>
              ) : (
                <>
                  <ActionButton
                    title="Editar"
                    onClick={() => handleEditAction(action)}
                  >
                    <FiEdit />
                  </ActionButton>
                  <ActionButton title="Remover">
                    <FiTrash2 />
                  </ActionButton>
                </>
              )}
            </ActionsContainer>
              */}
        </StyledTableCell>
      </StyledTableRow>
    ));
  }, [
    getInfluencePT,
    getResultColor,
    getResultIcon,
    getResultPT,
    getStatusIcon,
    getStatusPT,
    showActionsList,
  ]);

  const handleSearchChange = useCallback(
    event => {
      const inputText = event.target.value;
      let newShowActionsList: IAction[];

      if (inputText === '') {
        newShowActionsList = [...actionsList];
      } else {
        newShowActionsList = actionsList.filter(action => {
          if (
            action.title.toLowerCase().indexOf(inputText.toLowerCase()) >= 0 ||
            action.action_period.indexOf(inputText) >= 0 ||
            getInfluencePT(action.influence)
              .toLowerCase()
              .indexOf(inputText.toLowerCase()) >= 0 ||
            getStatusPT(action.status)
              .toLowerCase()
              .indexOf(inputText.toLowerCase()) >= 0 ||
            getResultPT(action.result)
              .toLowerCase()
              .indexOf(inputText.toLowerCase()) >= 0 ||
            (action.characterId?.name !== undefined &&
              action.characterId.name.indexOf(inputText) >= 0)
          )
            return true;

          return false;
        });
      }

      setShowActionsList(newShowActionsList);
    },
    [actionsList, getInfluencePT, getResultPT, getStatusPT],
  );

  useEffect(() => {
    setCurrentPage('actionsreview');

    loadCurrentActionMonth();
    loadActions();
  }, [loadActions, loadCurrentActionMonth, setCurrentPage]);

  return (
    <Container isMobile={false}>
      <TitleBox>
        <strong>Revisar Ações de Influências e Downtime</strong>
        <PeriodContainer>
          <span>Período:</span>
          <StyledDatePicker
            dateFormat="yyyy-MM"
            showMonthYearPicker
            selected={period}
            onChange={date => updateActionMonth(date as Date | null)}
          />
        </PeriodContainer>
      </TitleBox>

      <TableWrapper>
        <TableTitleRow>
          <h2>Ações Enviadas</h2>
          <SearchBox>
            {isBusy ? (
              <Skeleton variant="rect" width={340} height={51} />
            ) : (
              <SearchField
                id="searching"
                label="Procurar..."
                placeholder="Procurar..."
                onChange={e => handleSearchChange(e)}
              />
            )}
          </SearchBox>
        </TableTitleRow>
        <StyledTableContainer>
          <StyledTable stickyHeader>
            <StyledTableHead>
              <StyledTableRow>
                <StyledTableCell>Personagem</StyledTableCell>
                <StyledTableCell>Influência</StyledTableCell>
                <StyledTableCell>Ação</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Resultado</StyledTableCell>
                <StyledTableCell>Período</StyledTableCell>
                <StyledTableCell>Ações</StyledTableCell>
              </StyledTableRow>
            </StyledTableHead>
            <StyledTableBody>
              {isBusy ? (
                <StyledTableRow>
                  <StyledTableCell align="left">
                    <Skeleton />
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Skeleton />
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Skeleton />
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Skeleton />
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Skeleton />
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Skeleton />
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                GetActionsList()
              )}
            </StyledTableBody>
          </StyledTable>
        </StyledTableContainer>
      </TableWrapper>
    </Container>
  );
};

export default InfluenceActionsReview;
