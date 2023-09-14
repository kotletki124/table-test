import React from 'react';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import { IconButton } from '@mui/material';
import Popover from '@mui/material/Popover';
import FilterForm from './FilterFormComponent';

function Filter() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <FilterListRoundedIcon />
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={handleClose}
      >
        <FilterForm onSubmit={handleClose} />
      </Popover>
    </>
  );
}

export default Filter;
