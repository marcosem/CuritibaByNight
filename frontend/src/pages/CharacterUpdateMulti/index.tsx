import React, {
  useState,
  useCallback,
  useEffect,
  ChangeEvent,
  useRef,
} from 'react';
import { Form } from '@unform/web';
import { useParams } from 'react-router-dom';
import { FiMessageSquare, FiUpload, FiTrash2 } from 'react-icons/fi';
// import { FaSpinner } from 'react-icons/fa';
import api from '../../services/api';

import {
  Container,
  TitleBox,
  InputContainer,
  InputBox,
  InputFileBox,
  TableWrapper,
  Table,
  TableCell,
  RemoveButton,
  ButtonBox,
} from './styles';

import Input from '../../components/Input';
import Button from '../../components/Button';
import Loading from '../../components/Loading';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import { useHeader } from '../../hooks/header';
import ICharacter from '../../components/CharacterList/ICharacter';

interface ICharacterFile {
  character: ICharacter;
  file?: File;
  filename: string;
}

interface IRouteParams {
  filter: string;
}

const CharacterUpdateMulti: React.FC = () => {
  const { filter } = useParams<IRouteParams>();
  const [charList, setCharList] = useState<ICharacter[]>([]);
  const [selChars, setSelChars] = useState<ICharacterFile[]>([]);
  const [isBusy, setBusy] = useState(true);
  const [isScrollOn, setIsScrollOn] = useState<boolean>(false);
  const { addToast } = useToast();
  const { signOut } = useAuth();
  const { setCurrentPage } = useHeader();
  const tableRowRef = useRef<HTMLTableRowElement>(null);
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);

  const loadCharacters = useCallback(async () => {
    setBusy(true);

    const characterType = filter === 'npc' ? 'NPCs' : 'personagens';

    try {
      await api.get('characters/list/all').then(response => {
        const res = response.data;
        const fullList: ICharacter[] = res;

        const filteredList = fullList.filter(ch =>
          filter === 'npc' ? ch.npc : !ch.npc,
        );

        setCharList(filteredList);
      });
    } catch (error) {
      if (error.response) {
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
            title: `Erro ao tentar listar ${characterType}`,
            description: `Erro: '${message}'`,
          });
        }
      }
    }
    setBusy(false);
  }, [addToast, filter, signOut]);

  const updateFilesList = useCallback(
    (files: FileList) => {
      if (files.length > 0) {
        const newCharFileList: ICharacterFile[] = [];

        let numCharsFound = 0;

        for (let i = 0; i < files.length; i += 1) {
          const myFile = files[i];
          const myFilename = myFile.name;
          let fileFound = false;

          if (
            myFilename.toLowerCase().indexOf('.pdf') !==
            myFilename.length - 4
          ) {
            const newCharFile: ICharacterFile = {
              character: {
                id: `Invalid[${i}]`,
                name: 'Arquivo Inválida',
              } as ICharacter,
              filename: myFilename,
            };

            newCharFileList.push(newCharFile);
          } else {
            // eslint-disable-next-line no-loop-func
            charList.some(myChar => {
              let noRegnantFilename: string;

              if (myFilename.indexOf(' - ') >= 0) {
                const newFilename = myFilename.split(' - ');
                // eslint-disable-next-line prefer-destructuring
                noRegnantFilename = newFilename[1].replace(/[`]/gi, '"');
              } else {
                noRegnantFilename = myFilename.replace(/[`]/gi, '"');
              }

              if (noRegnantFilename.indexOf(myChar.name) >= 0) {
                const newCharFile: ICharacterFile = {
                  character: myChar,
                  file: myFile,
                  filename: myFilename,
                };

                newCharFileList.push(newCharFile);
                numCharsFound += 1;
                fileFound = true;
                return fileFound;
              }
              return false;
            });

            if (!fileFound) {
              const newCharFile: ICharacterFile = {
                character: {
                  id: `Notfound[${i}]`,
                  name: 'Não Encontrado',
                } as ICharacter,
                filename: myFilename,
              };

              newCharFileList.push(newCharFile);
            }
          }
        }

        if (numCharsFound === files.length) {
          addToast({
            type: 'success',
            title: 'Personagens Encontrados',
            description:
              'Todos as fichas encontraram seus personagens correspondentes!',
          });
        } else if (numCharsFound > 0) {
          addToast({
            type: 'error',
            title: 'Alguns Personagens não Encontrados',
            description: `Você selecionou ${files.length} fichas, mas somente ${numCharsFound} encontraram correspondência!`,
          });
        } else {
          addToast({
            type: 'error',
            title: 'Nenhum Personagem Encontrado',
            description:
              'Nenhum personagem encontrado, verifique o nome dos arquivos',
          });
        }

        setSelChars(newCharFileList);
      }
    },
    [addToast, charList],
  );

  const handleSelectFiles = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        updateFilesList(e.target.files);
      }
    },
    [updateFilesList],
  );

  const handleConfirm = useCallback(() => {
    // Todo
  }, []);

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
  }, [selChars]);

  useEffect(() => {
    setCurrentPage('updatemultichar');
    loadCharacters();
  }, [loadCharacters, setCurrentPage]);

  return (
    <Container>
      <TitleBox>
        {charList.length > 0 || isBusy ? (
          <>
            <strong>
              {filter === 'npc'
                ? 'Atualizar Multiplos NPCs'
                : 'Atualizar Multiplos Personagens'}
            </strong>
          </>
        ) : (
          <strong>
            {filter === 'npc'
              ? 'Não foi encontrado nenhum NPC na base de dados.'
              : 'Não foi encontrado nenhum Personagem na base de dados.'}
          </strong>
        )}
      </TitleBox>
      {isBusy ? (
        <Loading />
      ) : (
        <Form onSubmit={handleConfirm}>
          <InputContainer>
            {filter !== 'npc' && (
              <InputBox>
                <Input
                  name="comments"
                  icon={FiMessageSquare}
                  mask=""
                  placeholder="Motivo das Atualizações"
                  // onChange={handleSelectFiles}
                  // readOnly={uploading}
                />
              </InputBox>
            )}

            <InputFileBox>
              <label htmlFor="sheets">
                <FiUpload />
                Selecionar as fichas em .pdf...
                <input
                  type="file"
                  name="sheets"
                  id="sheets"
                  multiple
                  onChange={handleSelectFiles}
                  // readOnly={uploading}
                />
              </label>
            </InputFileBox>
          </InputContainer>

          <TableWrapper>
            <Table empty={selChars.length === 0} isScrollOn={isScrollOn}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Personagem</th>
                  <th>Ficha</th>
                  <th title="Remover Correspondência?">Remover?</th>
                </tr>
              </thead>

              <tbody ref={tableBodyRef}>
                {selChars.length > 0 ? (
                  <>
                    {selChars.map((selChar, index) => (
                      <tr
                        key={selChar.character.id}
                        ref={index === 0 ? tableRowRef : undefined}
                      >
                        <td>
                          <TableCell
                            centered
                            invalid={
                              selChar.character.name === 'Ficha Inválida' ||
                              selChar.character.name === 'Não Encontrado'
                            }
                          >
                            <strong>{index + 1}</strong>
                          </TableCell>
                        </td>
                        <td>
                          <TableCell
                            invalid={
                              selChar.character.name === 'Ficha Inválida' ||
                              selChar.character.name === 'Não Encontrado'
                            }
                          >
                            <strong>{selChar.character.name}</strong>
                          </TableCell>
                        </td>
                        <td>
                          <TableCell
                            invalid={
                              selChar.character.name === 'Ficha Inválida' ||
                              selChar.character.name === 'Não Encontrado'
                            }
                          >
                            <span>{selChar.filename}</span>
                          </TableCell>
                        </td>
                        <td>
                          {selChar.character.name !== 'Ficha Inválida' &&
                            selChar.character.name !== 'Não Encontrado' && (
                              <RemoveButton
                                id={selChar.character.id}
                                type="button"
                                // onClick={handleRemoveButton}
                                // disabled={saving}
                                title="Remover Correspondência"
                              >
                                <FiTrash2 />
                              </RemoveButton>
                            )}
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <tr>
                    <td>
                      <TableCell centered invalid>
                        <strong>0</strong>
                      </TableCell>
                    </td>

                    <td>
                      <TableCell centered invalid>
                        <strong>Nenhuma Ficha Selecionada</strong>
                      </TableCell>
                    </td>
                    <td />
                  </tr>
                )}
              </tbody>
            </Table>
          </TableWrapper>

          {selChars.length > 0 && (
            <ButtonBox>
              <Button
                type="submit"
                // loading={uploading}
                loadingMessage="Enviando Arquivos..."
              >
                Confirmar Alterações
              </Button>
            </ButtonBox>
          )}
        </Form>
      )}
    </Container>
  );
};

export default CharacterUpdateMulti;
