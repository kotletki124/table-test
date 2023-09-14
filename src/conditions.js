export const conditions = [
  { id: 'equals', label: 'Равно', types: ['string', 'date', 'int'] },
  { id: 'contains', label: 'Содержит', types: ['string'] },
  { id: 'greaterThan', label: 'Больше', types: ['date', 'int'] },
  { id: 'lessThan', label: 'Меньше', types: ['date', 'int'] },
];

export function canUseWithColumnType(condition, columnType) {
  return condition && condition.types.includes(columnType);
}

export function findFirstValidCondition(columnType) {
  return conditions.find(condition =>
    canUseWithColumnType(condition, columnType)
  );
}
