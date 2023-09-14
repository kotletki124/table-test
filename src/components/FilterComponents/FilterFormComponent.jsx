import React, { useContext } from 'react';
import { styled, Button } from '@mui/material';
import DateField from './DateFieldComponent';
import StringField from './StringFieldComponent';
import IntField from './IntFieldComponent';
import ColumnSelect from './ColumnSelectComponent';
import ConditionSelect from './ConditionSelectComponent';
import { TableContext } from '../../contexts/TableContext';
import { FilterContext } from '../../contexts/FilterContext';

const FormContainer = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: 15,
  flexWrap: 'nowrap',
  width: 250,
  padding: 15,
});

function FilterForm({ onSubmit }) {
  const { applyFilter, clearFilter } = useContext(TableContext);
  const {
    currFilter,
    isCurrFilterApplied,
    isAnyFilterApplied,
    isValueValid,
    updateFilterState,
  } = useContext(FilterContext);

  const handleSubmit = async event => {
    event.preventDefault();
    if (isValueValid) {
      updateFilterState({ isAnyFilterApplied: true });
      if (onSubmit) onSubmit();
      await applyFilter();
    }
  };

  return (
    <FormContainer autoComplete="off" onSubmit={handleSubmit}>
      <ColumnSelect />
      <ConditionSelect />
      {currFilter.column.type === 'date' && <DateField />}
      {currFilter.column.type === 'string' && <StringField />}
      {currFilter.column.type === 'int' && <IntField />}
      <Button disabled={isCurrFilterApplied} type="submit">
        Отфильтровать
      </Button>
      <Button
        disabled={!isAnyFilterApplied}
        color="secondary"
        onClick={clearFilter}
      >
        Сбросить фильтр
      </Button>
    </FormContainer>
  );
}

export default FilterForm;
