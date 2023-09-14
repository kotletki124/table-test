import React, { createContext, useState, useCallback, useMemo } from 'react';
import { canUseWithColumnType, findFirstValidCondition } from '../conditions';

const initialFilter = {
  column: {
    id: '',
  },
  condition: {
    id: '',
  },
  value: '',
};

const initialState = {
  currFilter: initialFilter,
  appliedFilter: initialFilter,
  isValueValid: true,
  isCurrFilterApplied: false,
  isAnyFilterApplied: false,
};

export const FilterContext = createContext();

export function FilterContextProvider({ children, initialData }) {
  const [state, setState] = useState({
    ...initialState,
    currFilter: initializeFilter(),
  });

  function initializeFilter() {
    const { column, condition } = initialData;

    if (column)
      return {
        ...initialFilter,
        ...initialData,
        condition: canUseWithColumnType(condition, column.type)
          ? condition
          : findFirstValidCondition(column.type),
      };

    return initialFilter;
  }

  const updateFilterState = useCallback(arg => {
    setState(stateArg => {
      if (typeof arg === 'function') {
        return { ...stateArg, ...arg(stateArg) };
      }
      return { ...stateArg, ...arg };
    });
  }, []);

  const resetFilterState = useCallback(() => {
    setState({
      ...initialState,
      currFilter: initializeFilter(),
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      currFilter: state.currFilter,
      appliedFilter: state.appliedFilter,
      emptyFilter: initialFilter,
      isValueValid: state.isValueValid,
      isCurrFilterApplied: state.isCurrFilterApplied,
      isAnyFilterApplied: state.isAnyFilterApplied,
      updateFilterState,
      resetFilterState,
    }),
    [
      state.currFilter,
      state.appliedFilter,
      state.isValueValid,
      state.isCurrFilterApplied,
      state.isAnyFilterApplied,
    ]
  );

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
}
