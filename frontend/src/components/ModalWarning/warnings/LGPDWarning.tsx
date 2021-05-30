/* eslint-disable import/no-duplicates */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import api from '../../../services/api';

import { useAuth } from '../../../hooks/auth';
import { useToast } from '../../../hooks/toast';
import { useModalBox } from '../../../hooks/modalBox';
import { useUserNotification } from '../../../hooks/userNotification';

import { AggrementContainer, ButtonBox } from './styles';
import Checkbox from '../../Checkbox';
import Button from '../../Button';

interface ILGPDWarning {
  setOpenDlg: (openDlg: boolean) => void;
}

const LGPDWarning: React.FC<ILGPDWarning> = ({ setOpenDlg }: ILGPDWarning) => {
  const { user, signOut, updateUser } = useAuth();
  const [accepted, setAccepted] = useState<boolean>(false);
  const [currDate, setCurrDate] = useState<string>('');
  const { showModal } = useModalBox();
  const { closeWarning } = useUserNotification();
  const { addToast } = useToast();

  const handleAcceptance = useCallback(() => {
    setAccepted(!accepted);
  }, [accepted]);

  const updateUserAgreement = useCallback(async () => {
    try {
      const formData = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        lgpd_acceptance: accepted,
      };

      const response = await api.put('/profile/update', formData);

      if (accepted) {
        updateUser(response.data);
        addToast({
          type: 'success',
          title: 'Perfil atualizado!',
          description: 'Suas informações foram atualizada com sucesso!',
        });
      }
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro na atualização',
        description:
          'Erro ao atualizar o acordo, tente novamente ou contate a Narração.',
      });
    }
  }, [accepted, addToast, updateUser, user.email, user.name, user.phone]);

  const closeDialog = useCallback(async () => {
    setOpenDlg(false);
    setTimeout(async () => {
      closeWarning();

      await updateUserAgreement();

      if (!accepted) {
        signOut();
      }
    }, 150);
  }, [accepted, closeWarning, setOpenDlg, signOut, updateUserAgreement]);

  const handleConfirmAcceptance = useCallback(async () => {
    if (accepted) {
      await closeDialog();
    } else {
      showModal({
        type: 'error',
        title: 'Cofirme sua decisão',
        description:
          'Ao não aceitar o contrato sua conta no site será cancelada e seus dados excluídos em 30 dias.',
        btn1Title: 'Sim - Exclua',
        btn1Function: async () => closeDialog(),
        btn2Title: 'Não',
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        btn2Function: () => {},
      });
    }
  }, [accepted, closeDialog, showModal]);

  useEffect(() => {
    const myDate = format(new Date(), "dd 'de' MMMM 'de' yyyy", {
      locale: ptBR,
    });
    setCurrDate(myDate);
  }, []);

  return (
    <>
      <h1>LEI GERAL DE PROTEÇÃO DE DADOS PESSOAIS – LGPD</h1>

      <p>
        Estimado jogador, seguindo o que de lei é requerido para todos os sites
        de internet no Brasil, o projeto <strong>Curitiba By Night</strong>,
        apresenta o seguinte contrato, onde define como seus dados serão
        utilizados e guardados pelo projeto. <br />
        Para que o jogador possa participar desta ferramenta é importante o
        aceite, somente assim, poderá desfrutar de suas funcionalidades. <br />
        Caso opte por não aceitar o contrato, isto não o impedirá de participar
        dos jogos, mas não teremos ferramentas para disponibilizar as
        informações ao jogador, tais como fichas de personagens, localizações
        conhecidas, e outras informações pertinentes ao jogo, e ficará a
        critério do jogador decidir continuar a jogar desta maneira ou não.
      </p>
      <p>
        Leia o documento até o final onde haverá um caixa de checagem para
        concordar ou não.
      </p>

      <p>
        <strong>Muito obrigado!</strong>
        <br />
        <strong>Atenciosamente,</strong>
        <br />
        <strong>A Narração do Projeto Curitiba By Night.</strong>
      </p>

      <h1>Contrato LGPD - Curitiba By Night</h1>

      <p>
        Através do presente instrumento, eu <strong>{user.name}</strong> aqui
        denominado (a) como TITULAR, venho por meio deste, autorizar que o
        projeto <strong>Curitiba By Night</strong>, aqui denominada como
        CONTROLADORA, participante da organização mundial One World By Night
        (OWbN), para única e exclusivamente para fins participação dos jogos por
        ela organizada, disponha dos meus dados pessoais e dados pessoais
        sensíveis, de acordo com os artigos 7° e 11 da Lei n° 13.709/2018,
        conforme disposto neste termo:
      </p>
      <h2>CLÁUSULA PRIMEIRA</h2>
      <h3>Dados Pessoais</h3>
      <p>
        O Titular autoriza a Controladora a realizar o tratamento, ou seja, a
        utilizar os seguintes dados pessoais, para os fins que serão
        relacionados na cláusula segunda:
      </p>

      <p>– Nome completo;</p>
      <p>– Números de telefone, WhatsApp e endereços de e-mail;</p>
      <p>– Fotografias;</p>
      <p>
        – Nome de usuário e senha específicos para uso dos serviços da
        Controladora;
      </p>

      <h2>CLÁUSULA SEGUNDA</h2>
      <h3>Finalidade do Tratamento dos Dados</h3>
      <p>
        O Titular autoriza que a Controladora utilize os dados pessoais e dados
        pessoais sensíveis listados neste termo para as seguintes finalidades:
      </p>
      <p>
        – Permitir que a Controladora identifique e entre em contato com o
        titular, em razão dos eventos por ele participados;
      </p>
      <p>
        – Permitir que o titular possa usufrir da aplicação disponibilizada pela
        Controladora em forma de website na internet, aqui identificada como{' '}
        <strong>www.curitibabynight.com</strong> e{' '}
        <strong>www.curitibabynight.com.br</strong>.
      </p>

      <h2>CLÁUSULA TERCEIRA</h2>
      <h3>Compartilhamento de Dados</h3>
      <p>
        A Controladora fica autorizada a compartilhar os dados pessoais do
        Titular com qualquer outros agentes de tratamento de dados com outros
        agentes de tratamento de dados, caso seja necessário para as finalidades
        listadas neste instrumento, desde que, sejam respeitados os princípios
        da boa-fé, finalidade, adequação, necessidade, livre acesso, qualidade
        dos dados, transparência, segurança, prevenção, não discriminação e
        responsabilização e prestação de contas.
      </p>

      <h2>CLÁUSULA QUARTA</h2>
      <h3>Responsabilidade pela Segurança dos Dados</h3>
      <p>
        A Controladora se responsabiliza por manter medidas de segurança,
        técnicas e administrativas suficientes a proteger os dados pessoais do
        Titular e à Autoridade Nacional de Proteção de Dados (ANPD), comunicando
        ao Titular, caso ocorra algum incidente de segurança que possa acarretar
        risco ou dano relevante, conforme artigo 48 da Lei n° 13.709/2020.
      </p>

      <h2>CLÁUSULA QUINTA</h2>
      <h3>Término do Tratamento dos Dados</h3>
      <p>
        À Controladora, é permitido manter e utilizar os dados pessoais do
        Titular durante todo o período contratualmente firmado para as
        finalidades relacionadas nesse termo e ainda após o término da
        contratação para cumprimento de obrigação legal ou impostas por órgãos
        de fiscalização, nos termos do artigo 16 da Lei n° 13.709/2018.
      </p>

      <h2>CLÁUSULA SEXTA</h2>
      <h3>Direito de Revogação do Consentimento</h3>
      <p>
        O Titular poderá revogar seu consentimento, a qualquer tempo, por e-mail
        ou por carta escrita, conforme o artigo 8°, § 5°, da Lei n° 13.709/2020.
      </p>

      <h2>CLÁUSULA SÉTIMA</h2>
      <h3>Vazamento de Dados ou Acessos Não Autorizados – Penalidades</h3>
      <p>
        As partes poderão entrar em acordo, quanto aos eventuais danos causados,
        caso exista o vazamento de dados pessoais ou acessos não autorizados, e
        caso não haja acordo, a Controladora tem ciência que estará sujeita às
        penalidades previstas no artigo 52 da Lei n° 13.709/2018:
      </p>

      <p>
        <br />
        <br />
        Curitiba, {currDate}.
      </p>
      <AggrementContainer>
        <Checkbox
          name="aggrement"
          id="aggrement"
          checked={accepted}
          onChange={handleAcceptance}
        >
          Eu, {user.name} concordo e aceito os termos acima.
        </Checkbox>
        <ButtonBox>
          <Button
            type="button"
            title="Fechar"
            onClick={handleConfirmAcceptance}
          >
            Fechar
          </Button>
        </ButtonBox>
      </AggrementContainer>
    </>
  );
};

export default LGPDWarning;
