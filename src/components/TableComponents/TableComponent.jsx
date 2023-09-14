import { styled } from '@mui/system';
import { CircularProgress, Paper, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { TableContext } from '../../contexts/TableContext';
import Filter from '../FilterComponents/FilterComponent';
import Pagination from './PaginationComponent';
import SortControl from './SortControl';

const TableContainer = styled(Paper)(({ theme }) => ({
  minWidth: 'fit-content',
  overflowX: 'auto',
  padding: theme.spacing(3),
}));

const Header = styled('div')(({ theme }) => ({
  display: 'grid',
  alignItems: 'center',
  justifyContent: 'space-between',
  gridTemplateColumns: '1fr auto',
  gap: theme.spacing(2),
  marginBottom: 20,
}));

const RowsContainer = styled('div')({
  height: 460,
  overflowY: 'scroll',
  width: '100%',
  display: 'grid',
  gridTemplateRows: '55px repeat(auto-fill, minmax(40px, auto))',
  borderRadius: 4,
});

const Row = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '300px repeat(auto-fill, 120px)',
  gridAutoFlow: 'column',
  textAlign: 'right',
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const HeadRow = styled(Row)(({ theme }) => ({
  alignItems: 'center',
  position: 'sticky',
  top: 0,
  background: theme.palette.primary.dark,
}));

const Cell = styled('div')(({ theme }) => ({
  '&:first-of-type': {
    textAlign: 'left',
  },
  padding: theme.spacing(1),
}));

function Table() {
  const { columns, rows, loading } = useContext(TableContext);

  return (
    <TableContainer>
      <Header>
        <Typography variant="h4" marginLeft={2}>
          Товары
        </Typography>
        <Filter />
      </Header>
      <RowsContainer>
        <HeadRow>
          {columns.map(column => (
            <Cell key={column.id}>
              <SortControl column={column} />
            </Cell>
          ))}
        </HeadRow>
        {!loading &&
          rows &&
          rows.map(row => (
            <Row key={row.id}>
              {columns.map(column => (
                <Cell key={column.id}>
                  <Typography>{row[column.id]}</Typography>
                </Cell>
              ))}
            </Row>
          ))}
        {loading && <CircularProgress sx={{ margin: '50px auto' }} size={50} />}
      </RowsContainer>
      <Pagination />
    </TableContainer>
  );
}

export default Table;
