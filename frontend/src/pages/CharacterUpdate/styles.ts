import styled from 'styled-components';
import { shade } from 'polished';
import bgImg from '../../assets/yellow-old-paper.jpg';

export const Container = styled.div`
  height: 100vh;
`;

export const Content = styled.main`
  min-width: 340px;
  max-width: 1012px;
  margin: 0 auto;
  background: url(${bgImg}) repeat;
  display: flex;
  flex-direction: row;
  border-radius: 4px;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
`;

export const TitleBox = styled.div`
  min-width: 340px;
  max-width: 1012px;
  position: relative;

  display: flex;
  flex-direction: space-between;
  padding: 10px;

  margin: 5px auto 10px auto;

  border-radius: 10px;
  background: rgba(0, 0, 0, 0.2);
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);

  > strong {
    color: #eee;
    text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
    font-size: 14px;
    font-weight: 500;
    margin: auto 0;
  }
`;

export const Select = styled.select`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: none;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

  width: 250px;
  margin-left: auto;

  background: #111;
  border-radius: 4px;
  border: 0;
  padding: 0 8px;
  font-size: 14px;
  font-weight: 500;
  color: #888;
`;

export const CharCardContainer = styled.div`
  padding: 16px;
`;

export const CharacterFormContainer = styled.div`
  width: 100%;
  margin: 20px;

  display: flex;
  flex-direction: column;

  form {
    margin-top: 10px;
    border-top: 2px solid #333;
    padding-top: 10px;
  }
`;

export const CharacterDataRow = styled.div`
  display: flex;
  width: 100%;
  flex-direction: space-between;

  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);

  margin-bottom: 5px;

  h1 {
    font-size: 24px;
    font-weight: 500;
    color: #333;
    margin-bottom: 16px;

    &:not(:first-child) {
      margin-left: auto;
    }
  }

  strong {
    font-size: 18px;
    font-weight: 500;
    color: #333;
  }

  span {
    font-size: 18px;
    font-weight: 400;
    color: #333;
    margin-left: 10px;
  }
`;

export const SelectSituation = styled.select`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: none;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

  width: 100px;
  margin-left: 10px;

  background: #222;
  border-radius: 4px;
  border: 0;
  padding: 0 8px;
  font-size: 14px;
  font-weight: 500;
  color: #ccc;
  text-align: center;
`;

export const InputBox = styled.div`
  margin: 5px 0 24px;
  max-width: 340px;
`;

export const InputFileBox = styled.div`
  margin: 5px 0 24px;
  width: 100%;

  label {
    max-width: 340px;
    position: relative;
    background: #1f533b; //#860209;
    padding: 16px;
    font-size: 16px;
    font-weight: 500;
    color: #eee;
    // text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);

    border-radius: 10px;
    margin: 16px 0;
    border: 0;
    width: 100%;

    transition: background-color 0.2s;

    &:hover {
      background: ${shade(0.2, '#1f533b')};
      cursor: pointer;
    }

    svg {
      height: 20px;
      width: 20px;
      margin: auto 16px auto auto;
    }

    input {
      display: none;
    }
  }

  strong {
    font-size: 14px;
    font-weight: 500;
    color: #333;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    margin: 0 5px 0 10px;
  }

  span {
    font-size: 12px;
    font-weight: 400;
    color: #333;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  }
`;

export const ButtonBox = styled.div`
  margin: 50px auto 0 auto;
  max-width: 340px;
`;
