/* eslint-disable camelcase */
import React, { useState, useCallback, useEffect } from 'react';
import Header from '../../components/Header';
import HeaderMobile from '../../components/HeaderMobile';

import { documents } from './documents.json';

import { Container, TitleBox, TableWrapper, Table, TableCell } from './styles';
import { useMobile } from '../../hooks/mobile';

interface IDoc {
  title: string;
  type: string;
  url: string;
}

const Rules: React.FC = () => {
  const [docsList, setDocsList] = useState<IDoc[]>([]);
  const { isMobileVersion } = useMobile();

  const loadDocuments = useCallback(() => {
    const docs: IDoc[] = documents.map(doc => {
      const parsedDoc: IDoc = {
        title: doc.title,
        type: doc.type,
        url: doc.url,
      };
      return parsedDoc;
    });

    setDocsList(docs);
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  return (
    <Container>
      {isMobileVersion ? (
        <HeaderMobile page="rules" />
      ) : (
        <Header page="rules" />
      )}
      <TitleBox>
        <strong>Regras e Materiais de Referência</strong>
      </TitleBox>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Documento</th>
            </tr>
          </thead>
          <tbody>
            {docsList.map(doc => (
              <tr
                key={doc.title}
                // onClick={() => handleShowDetails(influence)}
              >
                <td>
                  <TableCell>
                    <strong>{doc.type}</strong>
                  </TableCell>
                </td>

                <td>
                  <TableCell>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Baixar Documento"
                    >
                      <span>{doc.title}</span>
                    </a>
                  </TableCell>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>
    </Container>
  );
};

export default Rules;
