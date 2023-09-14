import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import React, { useContext } from 'react';
import { FilterContext } from '../../contexts/FilterContext';
import { canUseWithColumnType, conditions } from '../../conditions';

export default function ConditionSelect() {
  const { currFilter, updateFilterState } = useContext(FilterContext);

  const handleChange = event => {
    const condition = conditions.find(cond => cond.id === event.target.value);

    updateFilterState(state => ({
      isCurrFilterApplied: false,
      currFilter: { ...state.currFilter, condition },
    }));
  };

  return (
    <FormControl>
      <InputLabel id="condition-select">Условие</InputLabel>
      <Select
        name="condition"
        labelId="condition-select"
        label="Условие"
        value={currFilter.condition.id}
        onChange={handleChange}
        required
      >
        {conditions.map(
          condition =>
            canUseWithColumnType(condition, currFilter.column.type) && (
              <MenuItem key={condition.id} value={condition.id}>
                {condition.label}
              </MenuItem>
            )
        )}
      </Select>
    </FormControl>
  );
}
