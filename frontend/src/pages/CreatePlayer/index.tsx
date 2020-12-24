import React, { useCallback, useRef, useState } from 'react';
import { FiUser, FiMail, FiArrowLeft } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErrors';

import { Container, Content, Avatar } from './styles';

import Input from '../../components/Input';
import Button from '../../components/Button';
import imgProfile from '../../assets/profile.jpg';

interface FormData {
  name: string;
  email: string;
  phone: string;
}

const CreatePlayer: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (data: FormData) => {
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
          name: data.name,
          email: data.email.toLowerCase(),
          phone: data.phone ? data.phone : undefined,
        };

        await api.post('/users/create', formData);

        setLoading(false);
        history.goBack();

        addToast({
          type: 'success',
          title: 'Jogador criado!',
          description: 'Perfil de Jogador criado com sucesso!',
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

      setLoading(false);
    },
    [history, addToast],
  );

  const handleGoBackClick = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <Container>
      <header>
        <div>
          <button type="button" onClick={handleGoBackClick}>
            <FiArrowLeft />
          </button>
          <h1>Criar Perfil de Jogador</h1>
        </div>
      </header>

      <Content>
        <Form onSubmit={handleSubmit} ref={formRef}>
          <Avatar>
            <img src={imgProfile} alt="" />
          </Avatar>

          <h1>Cadastre o Novo Jogador</h1>
          <Input
            name="name"
            icon={FiUser}
            mask=""
            placeholder="Nome do Jogador"
            readOnly={isLoading}
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
            mask="99-9999tt999?"
            formatChars={{ '9': '[0-9]', t: '[0-9-]', '?': '[0-9 ]' }}
            maskChar={null}
            placeholder="Celular"
            readOnly={isLoading}
          />

          <Button
            type="submit"
            loading={isLoading}
            loadingMessage="Salvando..."
          >
            Criar Perfil
          </Button>
        </Form>
      </Content>
    </Container>
  );
};

export default CreatePlayer;
