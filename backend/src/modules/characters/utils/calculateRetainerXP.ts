interface IRequestDTO {
  regnantXP: number;
  retainerLevel: number;
}

export default function calculateRetainerXP({
  regnantXP,
  retainerLevel,
}: IRequestDTO): number {
  let newXP: number;

  const parsedRetainerLevel = Math.round(retainerLevel);

  switch (parsedRetainerLevel) {
    case 1:
      newXP = regnantXP * 0.05;
      break;
    case 2:
    case 10:
      newXP = regnantXP * 0.1;
      break;
    case 3:
      newXP = regnantXP * 0.15;
      break;
    case 4:
    case 20:
      newXP = regnantXP * 0.2;
      break;
    case 5:
      newXP = regnantXP * 0.25;
      break;
    case 6:
    case 30:
      newXP = regnantXP * 0.3;
      break;
    case 40:
      newXP = regnantXP * 0.4;
      break;
    case 50:
      newXP = regnantXP * 0.5;
      break;
    case 60:
      newXP = regnantXP * 0.6;
      break;
    default:
      newXP = 0;
  }

  return Math.round(newXP);
}
