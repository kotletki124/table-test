import { tableName } from './dbHelper';

function generateWhereClause(column, condition, value) {
  const conditionMap = {
    equals: '=',
    contains: 'LIKE',
    greaterThan: '>',
    lessThan: '<',
  };

  const operator = conditionMap[condition] || '=';
  let whereClause = '';

  if (column && condition && value)
    whereClause = `WHERE ${column} ${operator} ${
      condition === 'contains' ? `'%${value}%'` : `'${value}'`
    }`;

  return whereClause;
}

function generateSortClause(sortedBy, sortType) {
  let sortClause = '';

  if (sortedBy && sortType) {
    const sortOrder = sortType === 'desc' ? 'DESC' : 'ASC';
    sortClause = `ORDER BY ${sortedBy} ${sortOrder}`;
  }

  return sortClause;
}

export function generateSelectQuery({
  column,
  condition,
  value,
  sortedBy,
  sortType,
  offset,
  limit,
}) {
  const whereClause = generateWhereClause(column, condition, value);
  const sortClause = generateSortClause(sortedBy, sortType);

  const limitClause =
    limit && (offset || offset === 0) ? `LIMIT ${limit} OFFSET ${offset}` : '';

  const query = `
      SELECT * 
      FROM ${tableName}
      ${whereClause}
      ${sortClause}
      ${limitClause}
    `;

  return query;
}

export function generateSelectCountAllQuery({ column, condition, value }) {
  const whereClause = generateWhereClause(column, condition, value);

  const query = `
      SELECT COUNT(*)
      FROM ${tableName}
      ${whereClause}
    `;

  return query;
}
