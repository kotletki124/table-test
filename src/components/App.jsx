import React from 'react';
import { GlobalStyles, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Table from './TableComponents/TableComponent';
import { FilterContextProvider } from '../contexts/FilterContext';
import { TableContextProvider } from '../contexts/TableContext';

const globalStyles = {
  '*': {
    boxSizing: 'border-box',
    padding: 0,
    margin: 0,
  },

  '#root': {
    display: 'flex',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#f86600',
    },
  },
});

// eslint-disable-next-line no-undef
export default function App({ data = __serverData }) {
  return (
    <FilterContextProvider initialData={{ column: data.columns[0] }}>
      <TableContextProvider initialData={data}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <GlobalStyles styles={globalStyles} />
          <Table />
        </ThemeProvider>
      </TableContextProvider>
    </FilterContextProvider>
  );
}
