/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';

import { FaShieldAlt, FaEye } from 'react-icons/fa';

import {
  Container,
  AddonTitle,
  AddonLevel,
  AddonDescription,
  Division,
  AddonShields,
  AddonShield,
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

      <AddonTitle level={addonData.addon_level}>
        {addonData.addon_name}
      </AddonTitle>

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
      <Division />
    </Container>
  );
};

export default AddonCard;
