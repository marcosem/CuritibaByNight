/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable camelcase */

import React, { createContext, useCallback, useState, useContext } from 'react';
import ICharacter from '../components/CharacterList/ICharacter';
import api from '../services/api';
import { useAuth } from './auth';

interface ICharInfo {
  char_id: string;
  npc: boolean;
  situation: string;
}

interface ISelectionContextData {
  char: ICharacter | undefined;
  setChar(char: ICharacter): void;
  charInfoList: ICharInfo[];
  initializeCharInfoList(refresh?: boolean): void;
  getNextCharInfo(char_id: string): string;
  getPreviewsCharInfo(char_id: string): string;
}

const SelectionContext = createContext<ISelectionContextData>(
  {} as ISelectionContextData,
);

const SelectionProvider: React.FC = ({ children }) => {
  const [selChar, setSelChar] = useState<ICharacter>();
  const [charList, setCharList] = useState<ICharInfo[]>([]);
  const { signOut } = useAuth();

  const setChar = useCallback((char: ICharacter) => {
    setSelChar(char);
  }, []);

  const getNextCharInfo = useCallback(
    (char_id: string): string => {
      const filteredChar = charList.filter(
        myChar => myChar.char_id === char_id,
      );

      if (filteredChar.length === 0) {
        return char_id;
      }

      const filteredList = charList.filter(
        myChar =>
          myChar.npc === filteredChar[0].npc && myChar.situation === 'active',
      );
      const charIndex = filteredList
        .map(myChar => myChar.char_id)
        .indexOf(char_id);

      if (charIndex + 1 === filteredList.length) {
        return char_id;
      }

      const nextCharId = filteredList[charIndex + 1].char_id;

      return nextCharId;
    },
    [charList],
  );

  const getPreviewsCharInfo = useCallback(
    (char_id: string) => {
      const filteredChar = charList.filter(
        myChar => myChar.char_id === char_id,
      );

      if (filteredChar.length === 0) {
        return char_id;
      }

      const filteredList = charList.filter(
        myChar =>
          myChar.npc === filteredChar[0].npc && myChar.situation === 'active',
      );
      const charIndex = filteredList
        .map(myChar => myChar.char_id)
        .indexOf(char_id);

      if (charIndex === 0) {
        return char_id;
      }

      const nextCharId = filteredList[charIndex - 1].char_id;

      return nextCharId;
    },
    [charList],
  );

  const initializeCharInfoList = useCallback(
    async (refresh = false) => {
      if (refresh === false && charList.length > 0) {
        return;
      }

      try {
        await api.get('characters/list/all').then(response => {
          const res = response.data;

          // Get list of clan
          const myCharList = res.map((char: ICharacter) => {
            const charInfo: ICharInfo = {
              char_id: char.id,
              npc: char.npc,
              situation: char.situation,
            };

            return charInfo;
          });

          setCharList(myCharList);
        });
      } catch (error) {
        if (error.response) {
          const { message } = error.response.data;

          if (message?.indexOf('token') > 0 && error.response.status === 401) {
            signOut();
          }
        }
      }
    },
    [charList.length, signOut],
  );

  return (
    <SelectionContext.Provider
      value={{
        char: selChar,
        setChar,
        charInfoList: charList,
        initializeCharInfoList,
        getNextCharInfo,
        getPreviewsCharInfo,
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
