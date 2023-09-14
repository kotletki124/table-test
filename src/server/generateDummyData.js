import { faker } from '@faker-js/faker';
import { tableName, executeQuery } from './dbHelper';

async function createTableIfNotExists() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        date TIMESTAMP NOT NULL,
        quantity INTEGER CHECK (quantity >= 0),
        distance INTEGER CHECK (quantity >= 0)
      )
    `;
    await executeQuery(query);

    console.log(`Created the ${tableName} table if it did not exist.`);
  } catch (error) {
    console.error(`Error creating the ${tableName} table:`, error);
  }
}

function generateDummyData() {
  const name = faker.commerce.productName();
  const date = faker.date.past();
  const quantity = faker.number.int({ min: 0, max: 1000 });
  const distance = faker.number.int({ min: 0, max: 500 });

  return [name, date, quantity, distance];
}

async function clearTable() {
  try {
    const query = `DELETE FROM ${tableName}`;
    await executeQuery(query);

    console.log(`Cleared data from the ${tableName} table.`);
  } catch (error) {
    console.error('Error clearing the table:', error);
  }
}

async function insertDummyData(numRecords = 250) {
  try {
    await createTableIfNotExists();
    await clearTable();

    const insertionPromises = [];

    for (let i = 0; i < numRecords; i += 1) {
      const data = generateDummyData();
      const query = `INSERT INTO ${tableName} (name, date, quantity, distance) VALUES ($1, $2, $3, $4)`;
      const insertionPromise = executeQuery(query, data);
      insertionPromises.push(insertionPromise);
    }

    await Promise.all(insertionPromises);

    console.log(`Inserted ${numRecords} records into the ${tableName} table.`);
  } catch (error) {
    console.error('Error inserting dummy data:', error);
  }
}

insertDummyData();
