import React, { useContext } from 'react';
import { styled } from '@mui/system';
import { IconButton, Typography } from '@mui/material';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import { TableContext } from '../../contexts/TableContext';
import RowsPerPageSelect from './RowsPerPageSelectComponent';

const PaginationContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  margin: '10px 0',
});

const PaginationControls = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
});

function Pagination() {
  const { itemsCount, offset, limit, changePage, loading } =
    useContext(TableContext);
  const endIndex = offset + limit;

  const handlePreviousClick = () => {
    if (offset > 0) {
      changePage({ offset: offset - limit });
    }
  };

  const handleNextClick = () => {
    if (endIndex < itemsCount) {
      changePage({ offset: offset + limit });
    }
  };

  return (
    <PaginationContainer>
      <Typography>{`${itemsCount > 0 ? offset + 1 : 0}-${
        endIndex < itemsCount ? endIndex : itemsCount
      } из ${itemsCount}`}</Typography>
      <RowsPerPageSelect />
      <PaginationControls>
        <IconButton
          onClick={handlePreviousClick}
          disabled={offset === 0 || loading}
          aria-label="Previous Page"
        >
          <KeyboardArrowLeftRoundedIcon />
        </IconButton>
        <IconButton
          onClick={handleNextClick}
          disabled={endIndex >= itemsCount || loading}
          aria-label="Next Page"
        >
          <KeyboardArrowRightRoundedIcon />
        </IconButton>
      </PaginationControls>
    </PaginationContainer>
  );
}

export default Pagination;
