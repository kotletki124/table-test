import { Select, MenuItem, Typography, Stack } from '@mui/material';
import React, { useContext } from 'react';
import { styled } from '@mui/system';
import { TableContext } from '../../contexts/TableContext';

const Container = styled(Stack)({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
  marginLeft: 'auto',
  marginRight: 50,
});

function RowsPerPageSelect() {
  const { limit, changeRowsPerPage } = useContext(TableContext);

  const handleChange = event => {
    changeRowsPerPage({ limit: event.target.value });
  };

  return (
    <Container>
      <Typography>Позиций на странице: </Typography>
      <Select size="small" value={limit} onChange={handleChange}>
        <MenuItem value={10}>10</MenuItem>
        <MenuItem value={30}>30</MenuItem>
        <MenuItem value={50}>50</MenuItem>
      </Select>
    </Container>
  );
}

export default RowsPerPageSelect;
