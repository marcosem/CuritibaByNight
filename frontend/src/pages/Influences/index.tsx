/* eslint-disable camelcase */
import React, { useState, useCallback, useEffect } from 'react';
import { FiCopy, FiArrowLeft } from 'react-icons/fi';
import Header from '../../components/Header';
import HeaderMobile from '../../components/HeaderMobile';
import InfluenceCard from '../../components/InfluenceCard';

import { influences } from './influences.json';

import {
  Container,
  InfluenceContainer,
  InfluenceCardContainer,
  TitleBox,
  TableWrapper,
  Table,
  TableCell,
  TableLevelsWrapper,
  TableLevels,
  TableLevelsCell,
  GoBackButton,
} from './styles';
import { useMobile } from '../../hooks/mobile';
import { useToast } from '../../hooks/toast';

interface IInfluence {
  influence: string;
  key_ability: string;
  description: string;
  levels: string[];
  notes: string;
}

const Influences: React.FC = () => {
  const [influencesList, setInfluencesList] = useState<IInfluence[]>([]);
  const [selInfluence, setSelInfluence] = useState<IInfluence>();
  const { addToast } = useToast();
  const { isMobileVersion } = useMobile();
  // const isMobileVersion = true;

  const loadInfluences = useCallback(() => {
    const infList: IInfluence[] = influences.map(inf => {
      const parsedInfluence: IInfluence = {
        influence: inf.influence,
        key_ability: inf.key_ability,
        description: inf.description,
        levels: inf.levels,
        notes: inf.notes,
      };

      return parsedInfluence;
    });

    setInfluencesList(infList);
  }, []);

  const handleShowDetails = useCallback((influence: IInfluence) => {
    const newInfluence = influence;

    setSelInfluence(newInfluence);
  }, []);

  const handleCopyToClipboard = useCallback(
    (textId: string) => {
      const spanText = document.getElementById(textId);
      const textArea = document.createElement('textarea');
      textArea.value = spanText?.textContent ? spanText.textContent : '';

      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');

      textArea.remove();

      addToast({
        type: 'success',
        title: 'Texto Copiado',
        description: 'Texto Copiado para Área de Transferência!',
      });
    },
    [addToast],
  );

  const handleGoBack = useCallback(() => {
    setSelInfluence(undefined);
  }, []);

  useEffect(() => {
    loadInfluences();
  }, [loadInfluences]);

  return (
    <Container>
      {isMobileVersion ? (
        <HeaderMobile page="influences" />
      ) : (
        <Header page="influences" />
      )}
      <TitleBox>
        <strong>Influências</strong>
      </TitleBox>
      {selInfluence !== undefined ? (
        <InfluenceContainer isMobile={isMobileVersion}>
          <InfluenceCardContainer isMobile={isMobileVersion}>
            <strong>{`Influência em ${selInfluence.influence}`}</strong>
            <InfluenceCard
              influence={selInfluence.influence}
              key_ability={selInfluence.key_ability}
            />
          </InfluenceCardContainer>

          <TableLevelsWrapper>
            {!isMobileVersion && (
              <div>
                <strong>{`Habilidade Chave: ${selInfluence.key_ability}`}</strong>
              </div>
            )}

            <TableLevels>
              <thead>
                <tr>
                  <th>Nível</th>
                  <th>Descrição</th>
                </tr>
              </thead>
              <tbody>
                {selInfluence.levels.map((level, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <tr key={`${selInfluence.influence}-${index}`}>
                    <td>
                      <TableLevelsCell>
                        <strong>{index + 1}</strong>
                      </TableLevelsCell>
                    </td>

                    <td
                      onClick={
                        () =>
                          handleCopyToClipboard(
                            `text-${selInfluence.influence}-${index}`,
                          )
                        // eslint-disable-next-line react/jsx-curly-newline
                      }
                    >
                      <TableLevelsCell title="Copiar Texto">
                        <span id={`text-${selInfluence.influence}-${index}`}>
                          {level}
                        </span>
                        <FiCopy />
                      </TableLevelsCell>
                    </td>
                  </tr>
                ))}
              </tbody>
            </TableLevels>
            {selInfluence.notes !== '' && (
              <span>{`*** ${selInfluence.notes} ***`}</span>
            )}
          </TableLevelsWrapper>
          <GoBackButton type="button" onClick={handleGoBack} title="Retornar">
            <FiArrowLeft />
          </GoBackButton>
        </InfluenceContainer>
      ) : (
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th>Influência</th>
                <th>Descrição</th>
              </tr>
            </thead>
            <tbody>
              {influencesList.map(influence => (
                <tr
                  key={influence.influence}
                  onClick={() => handleShowDetails(influence)}
                >
                  <td>
                    <TableCell>
                      <strong>{influence.influence}</strong>
                    </TableCell>
                  </td>

                  <td>
                    <TableCell>{influence.description}</TableCell>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      )}
    </Container>
  );
};

export default Influences;
