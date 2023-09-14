import SwitchLeftRoundedIcon from '@mui/icons-material/SwitchLeftRounded';
import { Typography, IconButton } from '@mui/material';
import React, { useContext } from 'react';
import { TableContext } from '../../contexts/TableContext';

function toggleSortType(type) {
  return type === 'asc' ? 'desc' : 'asc';
}

export default function SortControl({ column }) {
  const { changeSortParams, sortType, sortedBy, loading } =
    useContext(TableContext);

  const selected = sortedBy === column.id;

  const handleClick = () => {
    if (column.sortable)
      if (selected) {
        const newSortType = toggleSortType(sortType);
        changeSortParams({ sortType: newSortType });
      } else {
        changeSortParams({
          sortedBy: column.id,
          sortType: 'asc',
        });
      }
  };

  return (
    <IconButton
      size="small"
      disabled={!column.sortable || loading}
      onClick={handleClick}
      sx={{
        '&:hover': {
          background: 'transparent',
        },
        '&:hover .MuiSvgIcon-root': {
          opacity: selected ? 1 : 0.5,
        },
        borderRadius: 10,
      }}
    >
      <SwitchLeftRoundedIcon
        sx={{
          opacity: selected ? 1 : 0,
          fontSize: 'small',
          transform: `rotate(${sortType === 'asc' ? '-' : ''}90deg)`,
        }}
      />
      <Typography>{column.label}</Typography>
    </IconButton>
  );
}
