/* eslint-disable camelcase */
import React, { useState, useCallback, useEffect, ChangeEvent } from 'react';
// import { useParams } from 'react-router';
// import { FiUpload } from 'react-icons/fi';
import { FiHome, FiFileText, FiMapPin } from 'react-icons/fi';
import { Form } from '@unform/web';
// import { format } from 'date-fns';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useHistory } from 'react-router-dom';
// import api from '../../services/api';

import {
  Container,
  TitleBox,
  Content,
  LocationCardContainer,
  LocationFormContainer,
  InputBox,
  ButtonBox,
} from './styles';
import Header from '../../components/Header';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Loading from '../../components/Loading';
// import { useAuth } from '../../hooks/auth';
// import { useToast } from '../../hooks/toast';
import LocationCard from '../../components/LocationCard';

interface ILocationCardProps {
  locationId: string;
  name: string;
  description: string;
  address: string;
  elysium: boolean;
  type: string;
  property: string;
  responsibleId: string;
  responsibleName: string;
  clan: string;
  level: number;
  mysticalLevel: number;
}

const AddLocation: React.FC = () => {
  // const { addToast } = useToast();
  // const { signOut } = useAuth();
  const history = useHistory();
  const [isBusy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [locationData, setLocationData] = useState<ILocationCardProps>({
    locationId: '',
    name: '',
    description: '',
    address: '',
    elysium: false,
    type: 'other',
    property: 'private',
    responsibleId: '',
    responsibleName: '',
    clan: '',
    level: 1,
    mysticalLevel: 0,
  });

  const handleSubmit = useCallback(async () => {
    /*
    const characterType = filter === 'npc' ? 'NPC' : 'Personagem';

    try {
      if (!charSheet) {
        addToast({
          type: 'error',
          title: 'Ficha não selecionada',
          description: `Selecione uma Ficha de ${characterType} e tente novamente.`,
        });

        return;
      }

      if (filter !== 'npc' && selectedPlayer === undefined) {
        addToast({
          type: 'error',
          title: 'Jogador não selecionado',
          description: 'Selecione um Jogador e tente novamente.',
        });

        return;
      }

      const formData = new FormData();
      if (selectedPlayer !== undefined)
        formData.append('player_id', selectedPlayer.id);

      if (filter === 'npc') formData.append('is_npc', 'true');
      formData.append('sheet', charSheet);

      setUploading(true);

      await api.post('/character/add', formData).then(response => {
        const justSavedChar: ICharacter = response.data;

        justSavedChar.formatedDate = format(
          new Date(justSavedChar.updated_at),
          'dd/MM/yyyy',
        );

        setSavedChar(justSavedChar);
      });

      addToast({
        type: 'success',
        title: `${characterType} Adicionado!`,
        description: `${characterType} adicionado com sucesso!`,
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro na atualização',
        description: err.response.data.message
          ? err.response.data.message
          : `Erro ao adicionar o ${characterType}, tente novamente.`,
      });
    }
    setUploading(false);
    */
  }, []);

  const handleGoBack = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <Container>
      <Header page="addlocal" />

      <TitleBox>
        <strong>Adicionar uma nova Localização</strong>
      </TitleBox>
      <Content>
        {isBusy ? (
          <Loading />
        ) : (
          <>
            <LocationCardContainer>
              <LocationCard
                locationId={locationData.locationId}
                name={locationData.name}
                description={locationData.description}
                address={locationData.address}
                elysium={locationData.elysium}
                type={locationData.type}
                property={locationData.property}
                responsibleId={locationData.responsibleId}
                responsibleName={locationData.responsibleName}
                clan={locationData.clan}
                level={locationData.level}
                mysticalLevel={locationData.mysticalLevel}
                pictureUrl=""
                locked
              />
            </LocationCardContainer>
            <LocationFormContainer>
              <div>
                <h1>Entre com os dados da nova localização:</h1>
              </div>

              <Form onSubmit={handleSubmit}>
                <InputBox>
                  <Input
                    name="name"
                    icon={FiHome}
                    mask=""
                    placeholder="Nome"
                    readOnly={saving}
                  />
                  <Input
                    name="description"
                    icon={FiFileText}
                    mask=""
                    placeholder="Descrição"
                    readOnly={saving}
                  />
                </InputBox>

                <InputBox />

                <InputBox>
                  <Input
                    name="latitude"
                    icon={FiMapPin}
                    mask="S9ZZ9999999"
                    formatChars={{
                      '9': '[0-9]',
                      Z: '[0-9.]',
                      S: '[0-9-]',
                    }}
                    maskChar={null}
                    placeholder="Latitude"
                    readOnly={saving}
                  />
                  <Input
                    name="longitude"
                    icon={FiMapPin}
                    mask="S9ZZZ9999999"
                    formatChars={{
                      '9': '[0-9]',
                      Z: '[0-9.]',
                      S: '[0-9-]',
                    }}
                    maskChar={null}
                    placeholder="Longitude"
                    readOnly={saving}
                  />
                </InputBox>

                <input type="checkbox" name="elysium" id="elysium" />

                <ButtonBox>
                  <Button
                    type="submit"
                    loading={saving}
                    loadingMessage="Salvando Localização..."
                  >
                    Confirmar Inclusão
                  </Button>
                </ButtonBox>
              </Form>
            </LocationFormContainer>
          </>
        )}
      </Content>
    </Container>
  );
};

export default AddLocation;
