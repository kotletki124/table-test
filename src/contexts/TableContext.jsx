import React, {
  createContext,
  useCallback,
  useMemo,
  useContext,
  useState,
} from 'react';
import { FilterContext } from './FilterContext';
import useAsync from '../hooks/useAsync';

const initialState = {
  sortedBy: null,
  sortType: 'asc',
  limit: 10,
  offset: 0,
};

export const TableContext = createContext();

export function TableContextProvider({
  children,
  initialData: {
    columns = [],
    rows: rowsInit = [],
    itemsCount: countInit = 0,
    ...initialStateProps
  },
}) {
  const {
    updateFilterState,
    resetFilterState,
    appliedFilter,
    currFilter,
    emptyFilter,
  } = useContext(FilterContext);

  const [state, setState] = useState({
    ...initialState,
    ...initialStateProps,
    sortedBy: columns && columns[0].id,
  });
  // eslint-disable-next-line no-unused-vars
  const [{ rows, itemsCount }, loading, _, run] = useAsync({
    deferFn: fetchRows,
    initValue: { rows: rowsInit, itemsCount: countInit },
  });

  async function fetchRows(filterQuery, abortSignal) {
    const response = await fetch('/api/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: filterQuery,
      ...abortSignal,
    });

    return response.json();
  }

  const prepareQuery = (filter, overrides = {}, currState = state) =>
    JSON.stringify({
      ...currState,
      ...filter,
      column: filter.column.id,
      condition: filter.condition.id,
      ...overrides,
    });

  const updateRows = async (
    filter,
    { toFirstPage = true, isRecountRequired = true },
    overridesArg
  ) => {
    setState(currState => {
      let stateOverrides = { ...overridesArg };
      if (toFirstPage) stateOverrides = { ...stateOverrides, offset: 0 };

      let queryOverrides = { ...stateOverrides };
      if (!isRecountRequired)
        queryOverrides = { ...queryOverrides, itemsCount };

      const query = prepareQuery(filter, queryOverrides, currState);
      run(query);

      return { ...currState, ...stateOverrides };
    });
  };

  const changeSortParams = useCallback(
    overrides =>
      updateRows(
        appliedFilter,
        {
          toFirstPage: true,
          isRecountRequired: false,
        },
        overrides
      ),
    [appliedFilter, itemsCount]
  );

  const changePage = useCallback(
    overrides =>
      updateRows(
        appliedFilter,
        {
          toFirstPage: false,
          isRecountRequired: false,
        },
        overrides
      ),
    [appliedFilter, itemsCount]
  );

  const changeRowsPerPage = useCallback(
    overrides =>
      updateRows(
        appliedFilter,
        {
          toFirstPage: true,
          isRecountRequired: false,
        },
        overrides
      ),
    [appliedFilter, itemsCount]
  );

  const applyFilter = useCallback(
    filterOverrides => {
      const newFilter = { ...currFilter, ...filterOverrides };

      updateFilterState({
        isCurrFilterApplied: true,
        appliedFilter: newFilter,
      });

      return updateRows(newFilter, {
        toFirstPage: true,
        isRecountRequired: true,
      });
    },
    [currFilter]
  );

  const clearFilter = useCallback(() => {
    resetFilterState();
    return updateRows(emptyFilter, {
      toFirstPage: true,
      isRecountRequired: true,
    });
  }, [emptyFilter]);

  const contextValue = {
    columns,
    rows,
    itemsCount,
    loading,
    sortType: state.sortType,
    sortedBy: state.sortedBy,
    offset: state.offset,
    limit: state.limit,
    changeSortParams,
    changePage,
    changeRowsPerPage,
    applyFilter,
    clearFilter,
  };

  const memoizedContextValue = useMemo(
    () => contextValue,
    [Object.values(contextValue)]
  );

  return (
    <TableContext.Provider value={memoizedContextValue}>
      {children}
    </TableContext.Provider>
  );
}
