import React, {
  useState,
  useCallback,
  useEffect,
  ChangeEvent,
  useRef,
  MouseEvent,
} from 'react';
import { Form } from '@unform/web';
import { useParams } from 'react-router-dom';
import {
  FiMessageSquare,
  FiUpload,
  FiTrash2,
  FiX,
  FiCheck,
} from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';
import { PieChart } from 'react-minimal-pie-chart';
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
  ModalOverlay,
  ModalContainer,
  CloseModalButton,
  ModalLabelContainer,
} from './styles';

import Input from '../../components/Input';
import Button from '../../components/Button';
import Loading from '../../components/Loading';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import { useHeader } from '../../hooks/header';
import { useModalBox } from '../../hooks/modalBox';
import ICharacter from '../../components/CharacterList/ICharacter';

interface ICharacterFile {
  character: ICharacter;
  file?: File;
  filename: string;
  uploaded: boolean;
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
  const [uploading, setUploading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(true);
  const [currUploadIndex, setCurrUploadIndex] = useState<number>(-1);
  const [uploadComments, setUploadComments] = useState<string>('');
  const [currUploadChar, setCurrUploadChar] = useState<ICharacter>(
    {} as ICharacter,
  );
  const [uploadingReveal, setUploadingReveal] = useState<number>(0);
  const { addToast } = useToast();
  const { signOut } = useAuth();
  const { showModal } = useModalBox();
  const { setCurrentPage } = useHeader();
  const cancelUpload = useRef<boolean>(false);
  const uploadingIndex = useRef<number>(-1);
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
    } catch (error: any) {
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
                id: `Removed[${i}]`,
                name: 'Arquivo Inválido',
              } as ICharacter,
              filename: myFilename,
              uploaded: false,
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
                  uploaded: false,
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
                  id: `Removed[${i}]`,
                  name: 'Não Encontrado',
                } as ICharacter,
                filename: myFilename,
                uploaded: false,
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

  const handleRemoveMatch = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      const charId = e.currentTarget.id;

      if (charId === undefined) {
        return;
      }

      const newSelChars = selChars.map((myChar, index) => {
        if (myChar.character.id === charId) {
          const removedChar: ICharacter = {
            id: `Removed[${index}]`,
            name: 'Correspondência Removida',
          } as ICharacter;

          const remChar = myChar;
          remChar.character = removedChar;
          return remChar;
        }

        return myChar;
      });

      setSelChars(newSelChars);
    },
    [selChars],
  );

  const handleSelectFiles = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        updateFilesList(e.target.files);
      }
    },
    [updateFilesList],
  );

  const handleCancelUpload = useCallback(() => {
    cancelUpload.current = true;
  }, []);

  const handleSingleUpload = useCallback(
    async (index: number) => {
      uploadingIndex.current = index;
      const myChar = selChars[index];

      setCurrUploadChar(myChar.character);
      const currentReveal = Number(((index + 1) * 100) / selChars.length);
      setUploadingReveal(currentReveal);

      if (
        myChar.character.id.indexOf('Removed[') === -1 &&
        myChar.file &&
        !myChar.uploaded
      ) {
        try {
          const formData = new FormData();
          formData.append('character_id', myChar.character.id);
          if (uploadComments) {
            formData.append('comments', uploadComments);
          }
          if (myChar.character.npc) {
            formData.append('is_npc', 'true');
          }
          formData.append('situation', myChar.character.situation);
          if (myChar.character.regnant) {
            formData.append('regnant_id', myChar.character.regnant);
          } else {
            formData.append('regnant_id', '');
          }

          formData.append('sheet', myChar.file);

          // eslint-disable-next-line no-await-in-loop
          await api.patch('/character/update', formData);
          // eslint-disable-next-line no-await-in-loop
          await api.patch('/character/updateretainers', {
            character_id: myChar.character.id,
          });

          const newSelChars: ICharacterFile[] = selChars.map(mySelChar => {
            if (mySelChar.character.id === myChar.character.id) {
              const newSelChar = mySelChar;
              newSelChar.uploaded = true;
              return newSelChar;
            }
            return mySelChar;
          });

          setSelChars(newSelChars);
        } catch (err: any) {
          addToast({
            type: 'error',
            title: 'Erro na atualização',
            description: err.response.data.message
              ? err.response.data.message
              : `Erro ao atualizar o persongem ${myChar.character.name}, tente novamente.`,
          });
        }
      }

      if (index === selChars.length - 1) {
        setTimeout(() => {
          setOpenModal(false);
          setUploading(false);
          cancelUpload.current = false;
          uploadingIndex.current = -1;
        }, 1000);
      } else {
        setTimeout(() => {
          setCurrUploadIndex(index + 1);
        }, 200);
      }
    },
    [addToast, selChars, uploadComments],
  );

  const handleUpload = useCallback(
    async ({ comments }) => {
      if (selChars.length > 0) {
        let hasValid = false;

        selChars.some(myChar => {
          if (myChar.character.id.indexOf('Removed[') === -1) {
            hasValid = true;
            return hasValid;
          }
          return false;
        });

        if (!hasValid) {
          addToast({
            type: 'error',
            title: 'Nenhuma correspondência',
            description:
              'Nenhuma correspondência valida foi encontrada, selecione fichas válidas e tente novamente.',
          });

          return;
        }

        setUploadComments(comments);
        setUploading(true);
        setOpenModal(true);
        setCurrUploadIndex(0);
      }
    },
    [addToast, selChars],
  );

  const handleConfirm = useCallback(
    ({ comments }) => {
      if (filter !== 'npc' && comments === '') {
        addToast({
          type: 'error',
          title: 'Motivo das Atualizações',
          description:
            'Motivo das Atualização está em branco, preencha e tente novamente!',
        });

        return;
      }

      showModal({
        type: 'warning',
        title: 'Confirmar atualizações',
        description:
          'Você está prestes a atualizar diversos personagens, você confirma esta atualização?',
        btn1Title: 'Sim',
        btn1Function: () => handleUpload({ comments }),
        btn2Title: 'Não',
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        btn2Function: () => {},
      });
    },
    [addToast, filter, handleUpload, showModal],
  );

  useEffect(() => {
    if (openModal && currUploadIndex >= 0) {
      if (!cancelUpload.current) {
        if (currUploadIndex !== uploadingIndex.current) {
          handleSingleUpload(currUploadIndex);
        }
      } else {
        setCurrUploadIndex(-1);
        setOpenModal(false);
        setUploading(false);
        uploadingIndex.current = -1;
        cancelUpload.current = false;
      }
    }
  }, [currUploadIndex, handleSingleUpload, openModal]);

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
                  readOnly={uploading}
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
                  readOnly={uploading}
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
                              selChar.character.id.indexOf('Removed[') >= 0
                            }
                          >
                            {selChar.uploaded ? (
                              <FiCheck />
                            ) : (
                              <strong>{index + 1}</strong>
                            )}
                          </TableCell>
                        </td>
                        <td>
                          <TableCell
                            invalid={
                              selChar.character.id.indexOf('Removed[') >= 0
                            }
                          >
                            <strong>{selChar.character.name}</strong>
                          </TableCell>
                        </td>
                        <td>
                          <TableCell
                            invalid={
                              selChar.character.id.indexOf('Removed[') >= 0
                            }
                          >
                            <span>{selChar.filename}</span>
                          </TableCell>
                        </td>
                        <td>
                          {selChar.character.id.indexOf('Removed[') === -1 &&
                            !selChar.uploaded && (
                              <RemoveButton
                                id={selChar.character.id}
                                onClick={handleRemoveMatch}
                                disabled={uploading}
                                title="Remover Correspondência"
                              >
                                {uploading ? <FaSpinner /> : <FiTrash2 />}
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
                loading={uploading}
                loadingMessage="Enviando Arquivos..."
              >
                Confirmar Alterações
              </Button>
            </ButtonBox>
          )}
        </Form>
      )}

      {uploading && (
        <ModalOverlay>
          <ModalContainer openClose={openModal}>
            <ModalLabelContainer invalid={false}>
              <strong>Aguarde...</strong>
            </ModalLabelContainer>
            <PieChart
              data={[{ value: 1, key: 1, color: '#e38627' }]}
              label={() => `${currUploadIndex + 1}/${selChars.length}`}
              labelStyle={() => ({
                fill: '#e38627',
                fontSize: '10px',
              })}
              labelPosition={0}
              background="#bfbfbf"
              reveal={uploadingReveal}
              lineWidth={20}
              radius={35}
              rounded
              animate
            />
            {currUploadIndex >= 0 && currUploadChar.id !== undefined && (
              <ModalLabelContainer
                invalid={currUploadChar.id.indexOf('Removed[') >= 0}
              >
                <strong>
                  {`${
                    currUploadChar.id.indexOf('Removed[') >= 0
                      ? `Ignorando...`
                      : `Enviando a ficha de...`
                  }`}
                </strong>
                <span>{currUploadChar.name}</span>
              </ModalLabelContainer>
            )}

            <CloseModalButton onClick={handleCancelUpload} title="Cancelar">
              <FiX />
            </CloseModalButton>
          </ModalContainer>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default CharacterUpdateMulti;
