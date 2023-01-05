import React, { useState, useEffect } from 'react';
import { Dialog, DialogProps, Slide } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import Button from '../Button';

import { ButtonBox } from './styles';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface IPowerSimple {
  id: string;
  name: string;
  level: number;
  type: string;
  included: string;
  show: boolean;
}

interface DialogPropsEx extends DialogProps {
  selectedPower: IPowerSimple;
  handleSave: () => void;
  handleClose: () => void;
}

const AddPower: React.FC<DialogPropsEx> = ({
  selectedPower,
  handleSave,
  handleClose,
  ...rest
}) => {
  const [power, setPower] = useState<IPowerSimple>({} as IPowerSimple);

  useEffect(() => {
    setPower(selectedPower);
  }, [selectedPower]);

  return (
    <Dialog TransitionComponent={Transition} {...rest}>
      <span>
        {power.name} - {power.level}
      </span>
      <ButtonBox>
        <Button onClick={handleClose}>Cancelar</Button>
      </ButtonBox>
    </Dialog>
  );
};

export default AddPower;
