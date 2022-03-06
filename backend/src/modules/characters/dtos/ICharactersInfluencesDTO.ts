interface IInfluenceCapacityDTO {
  name: string;
  total: number;
  leader_level: number;
  leaders: [
    {
      id: string;
      name: string;
    },
  ];
}

interface IInfluenceCharDTO {
  name: string;
  level_perm: number;
  level_temp: number;
  ability: string;
  ability_level: number;
  defense_passive: number;
  defense_active: number;
}

interface ICharInfluenceDTO {
  character: {
    id: string;
    name: string;
    creature_type: string;
    clan: string;
    sect: string;
    situation: string;
    npc: boolean;
    morality: string;
    morality_level: number;
    retainers_level_perm: number;
    retainers_level_temp: number;
    attributes: number;
    influence_capacity: number;
    actions: number;
  };
  influences?: IInfluenceCharDTO[];
}

interface ICharactersInfluencesDTO {
  domain_capacity: number;
  influence_capacity: IInfluenceCapacityDTO[];
  list: ICharInfluenceDTO[];
  processed?: string[];
  processed2?: string[];
}

export {
  IInfluenceCapacityDTO,
  IInfluenceCharDTO,
  ICharInfluenceDTO,
  ICharactersInfluencesDTO,
};
