import React, { useContext, useEffect } from 'react';
import { TextField } from '@mui/material';
import { FilterContext } from '../../contexts/FilterContext';

export function isValidDate(dateString) {
  const [day, month, year] = dateString.split('.').map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() + 1 === month &&
    date.getDate() === day
  );
}

function isPotentiallyValidDate(input) {
  const sampleDates = ['01.01.2022', '01.04.2022', '01.02.2022', '01.02.2024'];

  const validMergedDate = sampleDates.find(sampleDate => {
    const mergedDate = `${input}${sampleDate.substring(input.length, 10)}`;
    return isValidDate(mergedDate);
  });

  return !!validMergedDate;
}

function validate(value) {
  return (value.length === 10 && isValidDate(value)) || value.length === 0;
}

function DateField() {
  const { updateFilterState, currFilter, isValueValid } =
    useContext(FilterContext);

  useEffect(() => {
    updateFilterState({ isValueValid: validate(currFilter.value) });
  }, [currFilter.column]);

  const handleChange = event => {
    let { value } = event.target;
    const isPotentiallyValid = isPotentiallyValidDate(value);
    const newLength = event.target.value.length;

    if (
      isPotentiallyValid &&
      newLength > currFilter.value.length &&
      [2, 5].includes(newLength)
    )
      value += '.';

    if (newLength <= 10)
      updateFilterState(state => ({
        isValueValid: isPotentiallyValid,
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
      placeholder="DD.MM.YYYY"
      required
      error={!isValueValid}
      helperText={!isValueValid ? 'Неверный формат или дата не существует' : ''}
    />
  );
}

export default DateField;
