import React, { useEffect } from 'react';
import { TextField } from '@mui/material';
import { FilterContext } from '../../contexts/FilterContext';

function StringField() {
  const { updateFilterState, currFilter } = React.useContext(FilterContext);

  useEffect(() => {
    updateFilterState({ isValueValid: true });
  }, [currFilter.column]);

  const handleChange = event => {
    const { value } = event.target;

    updateFilterState(state => ({
      isCurrFilterApplied: false,
      currFilter: { ...state.currFilter, value },
    }));
  };

  return (
    <TextField
      value={currFilter.value}
      label="Значение"
      onChange={handleChange}
      required
    />
  );
}

export default StringField;
