/* eslint-disable camelcase */
import React, { useState, useEffect, useCallback } from 'react';

import { FaShieldAlt, FaEye } from 'react-icons/fa';
import { FiChevronRight, FiChevronDown } from 'react-icons/fi';

import {
  Container,
  AddonTitle,
  AddonLevel,
  AddonSubtitle,
  AddonDescription,
  Division,
  AddonShields,
  AddonShield,
  AddonRequirement,
  AddonReqTitle,
  AddonReqDesc,
  AddonLabel,
  SubDivision,
  DetailsButton,
} from './styles';

export interface IAddonDetails {
  name: string;
  level: number;
  description: string;
  defense: number;
  surveillance: number;
  req_background: string | null;
  req_merit: string | null;
  req_influence: string | null;
  req_other: string | null;
  req_addon_1: string | null;
  req_addon_2: string | null;
  req_addon_3: string | null;
  ability: string;
  ability_qty: number;
  influence: string;
  influence_qty: number;
  time_qty: number;
  time_type: string;
}

export interface IAddon {
  location_id: string;
  addon_name: string;
  addon_level: number;
  temp_ability: number;
  temp_influence: number;
  currentAddon: IAddonDetails | null;
  nextAddon: IAddonDetails | null;
}

const AddonCard: React.FC<IAddon> = (myAddon: IAddon) => {
  const [addonData, setAddonData] = useState<IAddon>({} as IAddon);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const handleShowDetails = useCallback(() => {
    setShowDetails(!showDetails);
  }, [showDetails]);

  useEffect(() => {
    setAddonData(myAddon);
  }, [myAddon]);

  return (
    <Container>
      {addonData.currentAddon && addonData.currentAddon !== null && (
        <AddonShields>
          <AddonShield title="Defesa">
            <FaShieldAlt />
            <span>{`+${addonData.currentAddon.defense}`}</span>
          </AddonShield>
          <AddonShield title="Vigilância">
            <FaEye />
            <span>{`+${addonData.currentAddon.surveillance}`}</span>
          </AddonShield>
        </AddonShields>
      )}

      {addonData.nextAddon && addonData.nextAddon !== null ? (
        <DetailsButton
          level={addonData.addon_level}
          onClick={handleShowDetails}
        >
          <AddonTitle level={addonData.addon_level}>
            {addonData.addon_name}
          </AddonTitle>
          {showDetails ? <FiChevronDown /> : <FiChevronRight />}
        </DetailsButton>
      ) : (
        <AddonTitle level={addonData.addon_level}>
          {addonData.addon_name}
        </AddonTitle>
      )}

      <AddonLevel level={addonData.addon_level}>
        {`Nível ${addonData.addon_level}`}
      </AddonLevel>

      {addonData.currentAddon && addonData.currentAddon !== null && (
        <>
          <Division />
          <AddonDescription>
            {addonData.currentAddon.description}
          </AddonDescription>
        </>
      )}

      {showDetails && addonData.nextAddon && addonData.nextAddon !== null && (
        <>
          <Division />
          <AddonSubtitle>
            {`Próximo Nível: ${addonData.addon_level + 1}`}
          </AddonSubtitle>

          <SubDivision />
          <AddonLabel>Requisitos</AddonLabel>
          <AddonRequirement>
            <AddonReqTitle>{`Habilidades chaves (${addonData.nextAddon.ability_qty}):`}</AddonReqTitle>
            <AddonReqDesc>{addonData.nextAddon.ability}</AddonReqDesc>
          </AddonRequirement>

          <AddonRequirement>
            <AddonReqTitle>{`Influências chaves (${addonData.nextAddon.influence_qty}):`}</AddonReqTitle>
            <AddonReqDesc>{addonData.nextAddon.influence}</AddonReqDesc>
          </AddonRequirement>

          <AddonRequirement>
            <AddonReqTitle>Tempo Necessário:</AddonReqTitle>
            <AddonReqDesc>{`${addonData.nextAddon.time_qty} ${addonData.nextAddon.time_type}`}</AddonReqDesc>
          </AddonRequirement>

          {(addonData.nextAddon.req_merit !== null ||
            addonData.nextAddon.req_background !== null ||
            addonData.nextAddon.req_influence !== null ||
            addonData.nextAddon.req_addon_1 !== null) && (
            <>
              {addonData.nextAddon.req_merit !== null && (
                <AddonRequirement>
                  <AddonReqTitle>Qualidades:</AddonReqTitle>
                  <AddonReqDesc>{addonData.nextAddon.req_merit}</AddonReqDesc>
                </AddonRequirement>
              )}

              {addonData.nextAddon.req_background !== null && (
                <AddonRequirement>
                  <AddonReqTitle>Antecedentes:</AddonReqTitle>
                  <AddonReqDesc>
                    {addonData.nextAddon.req_background}
                  </AddonReqDesc>
                </AddonRequirement>
              )}

              {addonData.nextAddon.req_influence !== null && (
                <AddonRequirement>
                  <AddonReqTitle>Influências:</AddonReqTitle>
                  <AddonReqDesc>
                    {addonData.nextAddon.req_influence}
                  </AddonReqDesc>
                </AddonRequirement>
              )}

              {addonData.nextAddon.req_addon_1 !== null && (
                <AddonRequirement>
                  <AddonReqTitle>Addons:</AddonReqTitle>
                  <AddonReqDesc>
                    {`${addonData.nextAddon.req_addon_1}${
                      addonData.nextAddon.req_addon_2 !== null
                        ? `, ${addonData.nextAddon.req_addon_2}`
                        : ''
                    }${
                      addonData.nextAddon.req_addon_3 !== null
                        ? `, ${addonData.nextAddon.req_addon_3}`
                        : ''
                    }`}
                  </AddonReqDesc>
                </AddonRequirement>
              )}
            </>
          )}
        </>
      )}
      <Division />
    </Container>
  );
};

export default AddonCard;
