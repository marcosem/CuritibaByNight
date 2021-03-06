import React, { useCallback, useRef, useState, useEffect } from 'react';
import { FiUser, FiMail, FiLock, FiArrowLeft } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useToast } from '../../hooks/toast';
import { useHeader } from '../../hooks/header';
import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErrors';

import { Container, Content, AnimationContainer, Background } from './styles';

import Loading from '../../components/Loading';
import Logo from '../../components/Logo';
import Input from '../../components/Input';
import Button from '../../components/Button';

interface IFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirm: string;
}

interface IInitialUserData {
  name: string;
  email?: string;
  phone?: string;
}

interface IRouteParams {
  id: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { id } = useParams<IRouteParams>();
  const [isBusy, setBusy] = useState(true);
  const [userData, setUserData] = useState<IInitialUserData>(
    {} as IInitialUserData,
  );
  const { addToast } = useToast();
  const { setCurrentPage } = useHeader();
  const history = useHistory();

  useEffect(() => {
    async function getUserData(): Promise<void> {
      setBusy(true);
      try {
        const response = await api.get(`users/complete/${id}`);
        const user = response.data;

        if (user) {
          setUserData({
            name: user.name,
            email: user.email,
            phone: user.phone,
          });
        }
      } catch (err) {
        history.push('/');

        addToast({
          type: 'error',
          title: 'Token Inválido',
          description: 'Token inválido ou vencido, solicite outo ao narrador.',
        });
      }
      setBusy(false);
    }

    getUserData();
  }, [id, addToast, history]);

  const handleSubmit = useCallback(
    async (data: IFormData) => {
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
          password: Yup.string()
            .min(6, 'Mínimo 6 caracteres')
            .required('Senha Obrigatória'),
          passwordConfirm: Yup.string().oneOf(
            [Yup.ref('password'), undefined],
            'Confirmação não combina',
          ),
        });

        await schema.validate(data, { abortEarly: false });

        await api.post('/users/complete', {
          name: data.name,
          email: data.email.toLowerCase(),
          phone: data.phone,
          password: data.password,
          password_confirmation: data.passwordConfirm,
          secret: id,
        });

        history.push('/');

        addToast({
          type: 'success',
          title: 'Cadastro efetuado!',
          description: 'Você já pode fazer seu login no Curitiba By Night',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description: 'Erro ao realizar o cadastro, tente novamente.',
        });
      }
    },
    [history, addToast, id],
  );

  useEffect(() => {
    setCurrentPage('signup', true);
  }, [setCurrentPage]);

  return (
    <Container>
      <Background />

      <Content>
        {isBusy ? (
          <Loading />
        ) : (
          userData.name && (
            <AnimationContainer>
              <Logo />

              <Form
                onSubmit={handleSubmit}
                ref={formRef}
                initialData={userData}
              >
                <h1>Faça seu Cadastro</h1>
                <Input
                  name="name"
                  icon={FiUser}
                  mask=""
                  placeholder="Nome do Jogador"
                />
                <Input
                  name="email"
                  icon={FiMail}
                  mask=""
                  placeholder="E-Mail do Jogador"
                />
                <Input
                  name="phone"
                  icon={FaWhatsapp}
                  mask="99-9999tt999?"
                  formatChars={{ '9': '[0-9]', t: '[0-9-]', '?': '[0-9 ]' }}
                  maskChar={null}
                  placeholder="Celular"
                />

                <Input
                  name="password"
                  icon={FiLock}
                  type="password"
                  mask=""
                  placeholder="Senha"
                />
                <Input
                  name="passwordConfirm"
                  icon={FiLock}
                  type="password"
                  mask=""
                  placeholder="Confirme a Senha"
                />

                <Button type="submit">Cadastrar</Button>
              </Form>
              <Link to="/">
                <FiArrowLeft />
                Voltar para Login
              </Link>
            </AnimationContainer>
          )
        )}
      </Content>
    </Container>
  );
};

export default SignUp;
