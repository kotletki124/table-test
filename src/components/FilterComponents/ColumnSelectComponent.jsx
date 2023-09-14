import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import React, { useContext } from 'react';
import { TableContext } from '../../contexts/TableContext';
import { FilterContext } from '../../contexts/FilterContext';
import {
  canUseWithColumnType,
  findFirstValidCondition,
} from '../../conditions';

export default function ColumnSelect() {
  const { columns } = useContext(TableContext);
  const { currFilter, updateFilterState } = useContext(FilterContext);

  const handleChange = event => {
    const column = columns.find(col => col.id === event.target.value);

    updateFilterState(state => ({
      isCurrFilterApplied: false,
      currFilter: {
        ...state.currFilter,
        column,
        condition: canUseWithColumnType(currFilter.condition, column.type)
          ? currFilter.condition
          : findFirstValidCondition(column.type),
      },
    }));
  };

  return (
    <FormControl>
      <InputLabel id="column-select">Колонка</InputLabel>
      <Select
        name="column"
        labelId="column-select"
        label="Колонка"
        value={currFilter.column.id}
        onChange={handleChange}
        required
      >
        {columns.map(column => (
          <MenuItem key={column.id} value={column.id}>
            {column.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
