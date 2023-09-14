export const columns = [
  { id: 'name', label: 'Название', sortable: true, type: 'string' },
  { id: 'date', label: 'Дата', sortable: false, type: 'date' },
  { id: 'quantity', label: 'Количество', sortable: true, type: 'int' },
  { id: 'distance', label: 'Расстояние', sortable: true, type: 'int' },
];

export const initQueryObj = {
  sortedBy: columns[0].id,
  sortType: 'asc',
  limit: 10,
  offset: 0,
};
