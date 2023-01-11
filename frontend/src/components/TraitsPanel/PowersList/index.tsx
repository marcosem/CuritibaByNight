/* eslint-disable camelcase */
import React, { useState, useEffect, useCallback, HTMLAttributes } from 'react';

import { TypeContainer } from '../styles'; // from TraitsPanel
import { PowerContainer, PowerTitle } from './styles';

import api from '../../../services/api';

import { useToast } from '../../../hooks/toast';
import { useMobile } from '../../../hooks/mobile';
import { useAuth } from '../../../hooks/auth';

import ICharacter from '../../CharacterList/ICharacter';

interface IPowerResponse {
  id: string;
  long_name: string;
  short_name: string;
  level: number;
  type: string;
  origin?: string;
  requirements?: string;
  description?: string;
  system?: string;
  cost?: number | string;
  source?: string;
}

interface IPower {
  id: string;
  long_name: string;
  short_name: string;
  level: number;
  type: string;
  origin: string;
  requirements: string;
  description: string[];
  system: string[];
  cost: number | string;
  source: string;
}

type IPanelProps = HTMLAttributes<HTMLDivElement> & {
  myChar: ICharacter;
};

const powersTypes: string[] = [
  'discipline',
  'ritual',
  'gift',
  'arcanoi',
  'spheres',
  'routes',
  'combination',
  'other',
];

const PowersList: React.FC<IPanelProps> = ({ myChar }) => {
  const [powersList, setPowersList] = useState<IPower[]>([]);
  const [powersTypesFound, setPowersTypesFound] = useState<string[]>([]);

  const [isBusy, setBusy] = useState(true);

  const { signOut } = useAuth();
  const { addToast } = useToast();
  const { isMobileVersion } = useMobile();

  const loadPowers = useCallback(async () => {
    if (myChar === undefined) {
      return;
    }

    setBusy(true);
    try {
      await api.get(`/powers/list/${myChar.id}`).then(response => {
        const res = response.data;

        // Discard all not included powers
        const validPowers = res.filter((power: IPowerResponse) => !!power.id);

        const validPowerTypes: string[] = [];
        const newArray: IPower[] = validPowers.map((power: IPowerResponse) => {
          if (validPowerTypes.indexOf(power.type) === -1) {
            validPowerTypes.push(power.type);
          }

          let parsedDescription: string[] = [''];
          let parsedSystem: string[] = [];

          if (power.description) {
            parsedDescription = power.description
              .replaceAll('\t', '')
              .split('\n');
          }

          if (power.system) {
            parsedSystem = power.system.replaceAll('\t', '').split('\n');
          }

          const newPower: IPower = {
            id: power.id,
            long_name: power.long_name,
            short_name: power.short_name,
            level: Number(power.level),
            type: power.type,
            origin: power.origin || '',
            requirements: power.requirements || '',
            description: parsedDescription,
            system: parsedSystem,
            cost: power.cost || 0,
            source: power.source || '',
          };

          return newPower;
        });

        const newPowerTypes = powersTypes.filter(ptype =>
          validPowerTypes.includes(ptype),
        );

        setPowersTypesFound(newPowerTypes);
        setPowersList(newArray);
      });
    } catch (error) {
      const parsedError: any = error;

      if (parsedError.response) {
        const { message } = parsedError.response.data;

        if (
          message?.indexOf('token') > 0 &&
          parsedError.response.status === 401
        ) {
          addToast({
            type: 'error',
            title: 'Sessão Expirada',
            description: 'Sessão de usuário expirada, faça o login novamente!',
          });

          signOut();
        } else {
          addToast({
            type: 'error',
            title: 'Erro ao tentar listar os poderes',
            description: `Erro: '${message}'`,
          });
        }
      }
    }
    setBusy(false);
  }, [addToast, myChar, signOut]);

  const getPowerTypeTitle = useCallback(type => {
    let title;

    switch (type) {
      case 'discipline':
        title = 'Disiplinas';
        break;
      case 'ritual':
        title = 'Rituais';
        break;
      case 'gift':
        title = 'Dons';
        break;
      case 'arcanoi':
        title = 'Arcanois';
        break;
      case 'spheres':
        title = 'Esferas';
        break;
      case 'routes':
        title = 'Rotinas';
        break;
      case 'combination':
        title = 'Combos';
        break;
      default:
        title = 'Outros Poderes';
        break;
    }

    return title;
  }, []);

  const getLevelLabel = useCallback((level: number, type: string) => {
    const typeWithLabel = ['ritual', 'rituals', 'gift', 'routes'];
    const labels = [
      '',
      'Básico',
      'Intermediário',
      'Avançado',
      'Ancião',
      'Mestre',
      'Ancestral',
      'Matusalém',
    ];

    let label;
    if (level === 0) {
      label = labels[level];
    } else if (typeWithLabel.includes(type)) {
      label = ` (${labels[level]})`;
    } else {
      label = ` x${level}`;
    }

    return label;
  }, []);

  useEffect(() => {
    loadPowers();
  }, [loadPowers]);

  return (
    <>
      {!isBusy && powersList.length > 0 && (
        <TypeContainer borderTop isMobile={isMobileVersion}>
          <h1>Descrição dos Poderes</h1>

          {powersTypesFound.map(myType => (
            <div key={myType}>
              <PowerTitle isMobile={isMobileVersion}>
                <h1>{getPowerTypeTitle(myType)}</h1>
              </PowerTitle>
              {powersList
                .filter(filteredPower => filteredPower.type === myType)
                .map((power, index) => (
                  <PowerContainer
                    key={power.id}
                    isMobile={isMobileVersion}
                    isFirst={index === 0}
                    id={`power-${power.long_name}`}
                  >
                    <h2>
                      {`${power.long_name}${
                        power.level !== 0
                          ? `${getLevelLabel(power.level, power.type)}`
                          : ''
                      }`}
                    </h2>
                    {power.short_name !== power.long_name && (
                      <h3>{power.short_name}</h3>
                    )}
                    {power.origin && (
                      <p>
                        <strong>Origem: </strong>
                        {power.origin}
                      </p>
                    )}
                    {power.requirements && power.cost > 0 && (
                      <p>
                        <strong>Requisitos: </strong>
                        {`${power.cost}xp - ${power.requirements}`}
                      </p>
                    )}

                    {power.description.map((desc, ind) => (
                      <p key={`${power.short_name}-desc-${Number(ind)}`}>
                        &emsp;{desc}
                      </p>
                    ))}

                    {power.system.length > 0 && (
                      <>
                        <h4>System</h4>
                        {power.system.map((syst, ind) => (
                          <p key={`${power.short_name}-sys-${Number(ind)}`}>
                            &emsp;{syst}
                          </p>
                        ))}
                      </>
                    )}
                    {power.source && (
                      <p>
                        <strong>Fonte:</strong> {power.source}
                      </p>
                    )}
                    <p>
                      <a href={`#power-trait-${power.long_name}`}>
                        <strong>Voltar ao topo</strong>
                      </a>
                    </p>
                  </PowerContainer>
                ))}
            </div>
          ))}
        </TypeContainer>
      )}
    </>
  );
};

export default PowersList;
