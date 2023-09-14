export function processDataForSql(data) {
  return {
    column: escapeIdentifier(data.column),
    condition: data.condition,
    value:
      data.column === 'date'
        ? convertDateToISO(data.value)
        : escapeLiteral(data.value),
    sortedBy: escapeIdentifier(data.sortedBy),
    sortType: data.sortType,
    offset: escapeLiteral(data.offset),
    limit: escapeLiteral(data.limit),
  };
}

export function processDataForUI(rows) {
  return rows.map(row => {
    if (row.date) {
      // eslint-disable-next-line no-param-reassign
      row.date = convertDateForUI(row.date);
    }
    return row;
  });
}

function convertDateForUI(timestamp) {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

function convertDateToISO(dateStringUI) {
  const [day, month, year] = dateStringUI.split('.');

  const dateObject = new Date(`${year}-${month}-${day}`);
  const isoDate = dateObject.toISOString();

  return isoDate;
}

function escapeIdentifier(str) {
  if (typeof str !== 'string') return str;
  return `"${str.replace(/"/g, '""')}"`;
}

function escapeLiteral(val) {
  if (typeof val !== 'string') return val;

  // eslint-disable-next-line no-control-regex
  const res = val.replace(/[\0\n\r\b\t\\'"\x1a]/g, s => {
    switch (s) {
      case '\0':
        return '\\0';
      case '\n':
        return '\\n';
      case '\r':
        return '\\r';
      case '\b':
        return '\\b';
      case '\t':
        return '\\t';
      case '\x1a':
        return '\\Z';
      case "'":
        return "''";
      case '"':
        return '""';
      default:
        return `"\\"${s}`;
    }
  });

  return res;
}
