import React, { useEffect } from 'react';
import { TextField } from '@mui/material';
import { FilterContext } from '../../contexts/FilterContext';

function validate(value) {
  return /^\d*$/.test(value);
}

function IntField() {
  const { updateFilterState, currFilter, isValueValid } =
    React.useContext(FilterContext);

  useEffect(() => {
    updateFilterState({ isValueValid: validate(currFilter.value) });
  }, [currFilter.column]);

  const handleChange = event => {
    const { value } = event.target;

    updateFilterState(state => ({
      isValueValid: validate(value),
      isCurrFilterApplied: false,
      currFilter: { ...state.currFilter, value },
    }));
  };

  const handleBlur = event => {
    const { value } = event.target;

    updateFilterState({ isValueValid: validate(value) });
  };

  const handleFocus = () => {
    updateFilterState({
      isValueValid: true,
    });
  };

  return (
    <TextField
      value={currFilter.value}
      label="Значение"
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      error={!isValueValid}
      helperText={
        !isValueValid ? 'Только целочисленные неотрицательные значения' : ''
      }
      required
    />
  );
}

export default IntField;
