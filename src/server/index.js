/* eslint-disable react/jsx-filename-extension */
import http from 'http';
import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from '../components/App';
import { columns, initQueryObj } from './initialData';
import { executeQuery } from './dbHelper';
import { generateSelectQuery, generateSelectCountAllQuery } from './sqlHelper';
import { processDataForSql, processDataForUI } from './util';
import 'dotenv/config';

async function handleRequest(req, res) {
  if (req.url === '/') homeRouteHandler(req, res);
  else if (req.url.startsWith('/public/')) publicRouteHandler(req, res);
  else if (req.url.startsWith('/api/query') && req.method === 'POST')
    apiQueryRouteHandler(req, res);
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
}

async function homeRouteHandler(req, res) {
  const initQuery = generateSelectQuery(initQueryObj);
  const initCountQuery = generateSelectCountAllQuery(initQueryObj);

  try {
    const rows = processDataForUI(await executeQuery(initQuery));
    const itemsCount = (await executeQuery(initCountQuery))[0].count;

    const initData = { rows, columns, itemsCount };
    const html = ReactDOMServer.renderToString(<App data={initData} />);

    fs.readFile('dist/public/index.html', 'utf8', (err, data) => {
      if (err) throw err;

      const document = data.replace(
        /<div id="root"><\/div>/,
        `<div id="root">${html}</div>
          <script>
            const __serverData = ${JSON.stringify(initData)}
          </script>`
      );

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(document);
    });
  } catch (error) {
    console.error('Error:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
}

function publicRouteHandler(req, res) {
  const filePath = path.join(__dirname, req.url);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
      return;
    }

    res.writeHead(200);
    res.end(data);
  });
}

function apiQueryRouteHandler(req, res) {
  let requestBody = '';
  let result = { rows: [], itemsCount: 0 };

  req.on('data', chunk => {
    requestBody += chunk.toString();
  });

  req.on('end', async () => {
    try {
      const requestData = JSON.parse(requestBody);
      const data = processDataForSql(requestData);

      const sqlQuery = generateSelectQuery(data);
      const queryResult = await executeQuery(sqlQuery);

      let { itemsCount } = data;
      if (!itemsCount && itemsCount !== 0) {
        const sqlCountQuery = generateSelectCountAllQuery(data);
        itemsCount = (await executeQuery(sqlCountQuery))[0].count;
      }

      result = {
        rows: processDataForUI(queryResult),
        itemsCount,
      };
    } catch (error) {
      console.error('Error handling API request:', error);
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
  });
}

const server = http.createServer(handleRequest);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
