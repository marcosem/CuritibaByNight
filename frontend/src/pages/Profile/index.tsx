import React, { useCallback, useRef, useEffect } from 'react';
import { FiUser, FiMail, FiLock, FiArrowLeft, FiCamera } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErrors';

import { Container, Content, AvatarInput } from './styles';

import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../hooks/auth';
import { useHeader } from '../../hooks/header';
import { useImageCrop } from '../../hooks/imageCrop';
import imgProfile from '../../assets/profile.jpg';

interface IFormData {
  name: string;
  email: string;
  phone: string;
  oldPassword: string;
  password: string;
  passwordConfirm: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const { setCurrentPage } = useHeader();
  const history = useHistory();

  const { user, updateUser } = useAuth();
  const { showImageCrop, getImage, isImageSelected } = useImageCrop();

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
          oldPassword: Yup.string().when('password', {
            is: val => !!val.length,
            then: Yup.string().required('Necessário entrar a senha atual'),
            otherwise: Yup.string(),
          }),
          password: Yup.string().test('min', 'Mínimo 6 caracteres', val => {
            if (val) {
              return val.length >= 6;
            }

            return true;
          }),
          passwordConfirm: Yup.string().oneOf(
            [Yup.ref('password'), undefined],
            'Confirmação não combina',
          ),
        });

        await schema.validate(data, { abortEarly: false });

        const formData = {
          profile_id: user.id,
          name: data.name,
          email: data.email.toLowerCase(),
          phone: data.phone,
          storyteller: user.storyteller,
          ...(data.password
            ? {
                old_password: data.oldPassword,
                password: data.password,
                password_confirmation: data.passwordConfirm,
              }
            : {}),
        };

        const response = await api.put('/profile/update', formData);

        updateUser(response.data);

        history.goBack();

        addToast({
          type: 'success',
          title: 'Perfil atualizado!',
          description: 'Suas informações foram atualizada com sucesso!',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na atualização',
          description: 'Erro ao atualizar o perfil, tente novamente.',
        });
      }
    },
    [user.id, user.storyteller, updateUser, history, addToast],
  );

  /*
  const handleAvatarChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData();

        data.append('avatar', e.target.files[0]);

        await api.patch('/users/avatar', data).then(response => {
          updateUser(response.data);

          addToast({
            type: 'success',
            title: 'Avatar Atualizado!',
          });
        });
      }
    },
    [addToast, updateUser],
  );
  */

  const handleAvatarChange = useCallback(async () => {
    showImageCrop(186, 186, true);
  }, [showImageCrop]);

  const setNewImage = useCallback(
    async (newImage: File) => {
      try {
        const data = new FormData();

        data.append('avatar', newImage);

        await api.patch('/users/avatar', data).then(response => {
          updateUser(response.data);

          addToast({
            type: 'success',
            title: 'Avatar Atualizado!',
          });
        });
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro na atualização',
          description: 'Erro ao atualizar o Avatar.',
        });
      }
    },
    [addToast, updateUser],
  );

  useEffect(() => {
    if (isImageSelected) {
      const newImage = getImage();

      if (newImage) {
        setNewImage(newImage);
      }
    }
  }, [getImage, isImageSelected, setNewImage]);

  const handleGoBackClick = useCallback(() => {
    history.goBack();
  }, [history]);

  useEffect(() => {
    setCurrentPage('profile', true);
  }, [setCurrentPage]);

  return (
    <Container>
      <header>
        <div>
          <button type="button" onClick={handleGoBackClick}>
            <FiArrowLeft />
          </button>
        </div>
      </header>

      <Content>
        <Form
          onSubmit={handleSubmit}
          ref={formRef}
          initialData={{
            name: user.name,
            email: user.email,
            phone: user.phone,
          }}
        >
          <AvatarInput>
            <img
              src={
                user.avatar_url || imgProfile
                // `https://api.adorable.io/avatars/186/${user.name}@adorable.png`
              }
              alt=""
            />

            <label htmlFor="avatar" onClick={handleAvatarChange}>
              <FiCamera />
              {/*
              <input
                type="file"
                name=""
                id="avatar"
                onChange={handleAvatarChange}
              />
              */}
            </label>
          </AvatarInput>

          <h1>Meu Perfil</h1>
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
            containerStyle={{ marginTop: 24 }}
            name="oldPassword"
            icon={FiLock}
            type="password"
            mask=""
            placeholder="Senha Atual"
          />

          <Input
            name="password"
            icon={FiLock}
            type="password"
            mask=""
            placeholder="Nova Senha"
          />
          <Input
            name="passwordConfirm"
            icon={FiLock}
            type="password"
            mask=""
            placeholder="Confirme a Senha"
          />

          <Button type="submit">Confirmar Alterações</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
