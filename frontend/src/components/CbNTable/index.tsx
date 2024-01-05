import React, { useState, useEffect, useCallback } from 'react';
import { IconType } from 'react-icons';
import { Tooltip } from '@material-ui/core';

import Skeleton from '@material-ui/lab/Skeleton';
import {
  StyledTableContainer,
  StyledTable,
  StyledTableHead,
  StyledTableRow,
  StyledTableCell,
  StyledTableBody,
  ActionsContainer,
  ActionButton,
} from './styles';

export interface ICbNAction {
  title: string;
  Icon: IconType;
  onClick(): any;
}

export interface ICbNRow {
  id: string;
  title?: string;
  columns: any[];
  actions?: ICbNAction[];
  bold?: boolean;
  onClick?(): any;
}

export interface IHeaderData {
  title: string;
  align: 'left' | 'center' | 'right' | 'justify' | 'inherit' | undefined;
  onClick?(): any;
}

export interface ICbNTable {
  header: IHeaderData[];
  rows: ICbNRow[];
  haveActions: boolean;
  isBusy: boolean;
}

const CbNTable: React.FC<ICbNTable> = ({
  header,
  rows,
  haveActions,
  isBusy,
}) => {
  const [tableData, setTableData] = useState<ICbNTable>({
    header: [],
    rows: [],
    haveActions: false,
    isBusy: true,
  } as ICbNTable);

  useEffect(() => {
    const newTableData = {
      header,
      rows,
      haveActions,
      isBusy,
    };

    setTableData(newTableData);
  }, [haveActions, header, isBusy, rows]);

  const handleRowFunction = useCallback((row: ICbNRow) => {
    if (row.onClick !== undefined) row.onClick();
  }, []);

  const handleHeaderFunction = useCallback((myHeader: IHeaderData) => {
    if (myHeader.onClick !== undefined) myHeader.onClick();
  }, []);

  const handleActionFunction = useCallback((action: ICbNAction) => {
    action.onClick();
  }, []);

  const drawRows = useCallback(
    (data: ICbNTable) => {
      if (data.rows.length === 0) {
        return (
          <StyledTableRow>
            {data.header.map((col, index) => (
              <StyledTableCell align={col.align} key={col.title}>
                {index === 0 ? 'Nenhum dado encontrado' : ''}
              </StyledTableCell>
            ))}
          </StyledTableRow>
        );
      }

      return data.rows.map(row => (
        <StyledTableRow
          key={row.id}
          onClick={() => handleRowFunction(row)}
          $hasAction={!!row.onClick}
        >
          {row.columns.map((col, index) => (
            <StyledTableCell
              align={data.header[index].align}
              // eslint-disable-next-line react/no-array-index-key
              key={`id-${index}`}
              title={row.title}
              $bold={!!row.bold}
            >
              {col}
            </StyledTableCell>
          ))}
          {!!row.actions && (
            <StyledTableCell
              align={data.header[data.header.length - 1].align}
              $hasAction
            >
              <ActionsContainer>
                {row.actions.map(action => (
                  <Tooltip title={action.title} key={action.title} arrow>
                    <ActionButton onClick={() => handleActionFunction(action)}>
                      <action.Icon />
                    </ActionButton>
                  </Tooltip>
                ))}
              </ActionsContainer>
            </StyledTableCell>
          )}
        </StyledTableRow>
      ));
    },
    [handleActionFunction, handleRowFunction],
  );

  return (
    <>
      {tableData.header.length > 0 && (
        <StyledTableContainer>
          <StyledTable stickyHeader>
            <StyledTableHead>
              <StyledTableRow>
                {tableData.header.map(col => (
                  <StyledTableCell
                    key={col.title}
                    onClick={() => handleHeaderFunction(col)}
                    $hasAction={!!col.onClick}
                  >
                    {col.title}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            </StyledTableHead>
            <StyledTableBody>
              {tableData.isBusy
                ? tableData.header.map(col => (
                    // eslint-disable-next-line react/jsx-indent
                    <StyledTableCell align={col.align} key={`c-${col.title}`}>
                      <Skeleton />
                    </StyledTableCell>
                  ))
                : drawRows(tableData)}
            </StyledTableBody>
          </StyledTable>
        </StyledTableContainer>
      )}
    </>
  );
};

export default CbNTable;
