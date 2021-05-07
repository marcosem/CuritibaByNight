/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable camelcase */

import React, { createContext, useCallback, useState, useContext } from 'react';
import ICharacter from '../components/CharacterList/ICharacter';

interface ISelectionContextData {
  char: ICharacter | undefined;
  setChar(char: ICharacter): void;
}

const SelectionContext = createContext<ISelectionContextData>(
  {} as ISelectionContextData,
);

const SelectionProvider: React.FC = ({ children }) => {
  const [selChar, setSelChar] = useState<ICharacter>();

  const setChar = useCallback((char: ICharacter) => {
    setSelChar(char);
  }, []);

  return (
    <SelectionContext.Provider
      value={{
        char: selChar,
        setChar,
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
};

function useSelection(): ISelectionContextData {
  const context = useContext(SelectionContext);

  if (!context) {
    throw new Error('useSelection must be used within an SelectionProvider');
  }

  return context;
}

export { SelectionProvider, useSelection };
