/* eslint-disable camelcase */
import React, { useEffect } from 'react';
// import { Link, useHistory } from 'react-router-dom';
// import api from '../../services/api';

// import Loading from '../../components/Loading';

import {
  Container,
  TitleBox,
  TableWrapper,
  StyledTable,
  StyledTableHead,
  StyledTableBody,
  StyledTableRow,
  StyledTableCell,
} from './styles';

import { useMobile } from '../../hooks/mobile';
import { useHeader } from '../../hooks/header';

// using https://v4.mui.com/components
const Powers: React.FC = () => {
  const { isMobileVersion } = useMobile();
  const { setCurrentPage } = useHeader();

  useEffect(() => {
    setCurrentPage('powers');
  }, [setCurrentPage]);

  return (
    <Container isMobile={isMobileVersion}>
      <TitleBox>
        <strong>Lista de Poderes</strong>
      </TitleBox>
      <TableWrapper>
        <StyledTable>
          <StyledTableHead>
            <StyledTableRow>
              <StyledTableCell>Poder</StyledTableCell>
              <StyledTableCell>Nível</StyledTableCell>
              <StyledTableCell>Tipo</StyledTableCell>
              <StyledTableCell>Incluso?</StyledTableCell>
              <StyledTableCell>Ações</StyledTableCell>
            </StyledTableRow>
          </StyledTableHead>
          <StyledTableBody>
            <StyledTableRow>
              <StyledTableCell align="left">
                Accord: Rite of Cleansing
              </StyledTableCell>
              <StyledTableCell align="center">Básico</StyledTableCell>
              <StyledTableCell align="center">Ritual</StyledTableCell>
              <StyledTableCell align="center">Sim</StyledTableCell>
              <StyledTableCell align="center">x x x x</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell align="left">
                Ahroun: Falling Touch
              </StyledTableCell>
              <StyledTableCell align="center">1</StyledTableCell>
              <StyledTableCell align="center">Poder</StyledTableCell>
              <StyledTableCell align="center">Não</StyledTableCell>
              <StyledTableCell align="center">x x x x</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell align="left">Animalism</StyledTableCell>
              <StyledTableCell align="center">1</StyledTableCell>
              <StyledTableCell align="center">Disciplina</StyledTableCell>
              <StyledTableCell align="center">Sim</StyledTableCell>
              <StyledTableCell align="center">x x x x</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell align="left">Animalism</StyledTableCell>
              <StyledTableCell align="center">2</StyledTableCell>
              <StyledTableCell align="center">Poder</StyledTableCell>
              <StyledTableCell align="center">Não</StyledTableCell>
              <StyledTableCell align="center">x x x x</StyledTableCell>
            </StyledTableRow>
          </StyledTableBody>
        </StyledTable>
      </TableWrapper>
    </Container>
  );
};

export default Powers;
