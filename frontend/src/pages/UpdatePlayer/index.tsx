/* eslint-disable camelcase */
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  ChangeEvent,
} from 'react';
import { useParams } from 'react-router';
import { FiUser, FiMail, FiArrowLeft } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErrors';

import { Container, Content, Avatar } from './styles';

import Input from '../../components/Input';
import Button from '../../components/Button';
import Checkbox from '../../components/Checkbox';
import imgProfile from '../../assets/profile.jpg';

interface FormData {
  email: string;
}

interface IPlayer {
  id: string;
  name: string;
  email: string;
  phone: string;
  active: boolean;
  storyteller: boolean;
  avatar_url: string;
  lastLogin_at: string;
}

interface IRouteParams {
  id: string;
}

const UpdatePlayer: React.FC = () => {
  const { id } = useParams<IRouteParams>();
  const [player, setPlayer] = useState<IPlayer>();
  const [st, setSt] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const { signOut } = useAuth();
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);

  const loadPlayer = useCallback(async () => {
    setLoading(true);

    try {
      await api.post('/profile', { profile_id: id }).then(response => {
        const res: IPlayer = response.data;

        setSt(res.storyteller);
        setActive(res.active);

        setPlayer(res);
      });
    } catch (error) {
      if (error.response) {
        const { message } = error.response.data;

        if (message.indexOf('token') > 0 && error.response.status === 401) {
          addToast({
            type: 'error',
            title: 'Sessão Expirada',
            description: 'Sessão de usuário expirada, faça o login novamente!',
          });

          signOut();
        } else {
          addToast({
            type: 'error',
            title: 'Erro ao carregar o jogador',
            description: `Erro: '${message}'`,
          });
        }
      }
    }

    setLoading(false);
  }, [addToast, id, signOut]);

  const handleSubmit = useCallback(
    async (data: FormData) => {
      if (!player) {
        return;
      }

      setLoading(true);
      try {
        formRef.current?.setErrors({});
        const phoneRegExp = /^$|(\d{2}-\d{4,5}-\d{4})$/;

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-Mail obrigatório')
            .email('E-Mail inválido'),
          phone: Yup.string().matches(
            phoneRegExp,
            'Entre com o formato: xx-xxxxx-xxxx',
          ),
        });

        await schema.validate(data, { abortEarly: false });

        const formData = {
          profile_id: player.id,
          name: player.name,
          email: data.email.toLowerCase(),
          phone: player.phone,
          storyteller: st,
          active,
        };

        await api.put('/profile/update', formData);

        setLoading(false);
        history.goBack();

        addToast({
          type: 'success',
          title: 'Jogador atualizado!',
          description: 'Perfil de Jogador atualizado com sucesso!',
        });
      } catch (err) {
        setLoading(false);
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na criação',
          description: 'Erro ao criar o perfil, tente novamente.',
        });
      }
    },
    [active, addToast, history, player, st],
  );

  const handleStorytellerChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSt(e.target.checked);
    },
    [],
  );

  const handleActiveChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setActive(e.target.checked);
  }, []);

  const handleGoBackClick = useCallback(() => {
    history.goBack();
  }, [history]);

  useEffect(() => {
    loadPlayer();
  }, [id, loadPlayer]);

  return (
    <Container>
      <header>
        <div>
          <button type="button" onClick={handleGoBackClick}>
            <FiArrowLeft />
          </button>
          <h1>Atualizar Perfil de Jogador</h1>
        </div>
      </header>

      <Content>
        <Form
          onSubmit={handleSubmit}
          ref={formRef}
          initialData={{
            name: player?.name,
            email: player?.email,
            phone: player?.phone,
          }}
        >
          <Avatar>
            <img
              src={player ? player.avatar_url || imgProfile : imgProfile}
              alt=""
            />
          </Avatar>

          <h1>Atualize o Perfil do Jogador</h1>
          <Input
            name="name"
            icon={FiUser}
            mask=""
            placeholder="Nome do Jogador"
            readOnly
          />
          <Input
            name="email"
            icon={FiMail}
            mask=""
            placeholder="E-Mail do Jogador"
            readOnly={isLoading}
          />
          <Input
            name="phone"
            icon={FaWhatsapp}
            mask=""
            placeholder="Celular"
            readOnly
          />

          <div>
            <Checkbox
              name="storyteller"
              id="storyteller"
              checked={st}
              onChange={handleStorytellerChange}
            >
              Narrador
            </Checkbox>

            <Checkbox
              name="active"
              id="active"
              checked={active}
              onChange={handleActiveChange}
            >
              Ativo
            </Checkbox>
          </div>
          {!player?.lastLogin_at && (
            <span>* Esta conta não foi ativada pelo jogador!</span>
          )}

          <Button
            type="submit"
            loading={isLoading}
            loadingMessage="Salvando..."
          >
            Atualizar Perfil
          </Button>
        </Form>
      </Content>
    </Container>
  );
};

export default UpdatePlayer;
