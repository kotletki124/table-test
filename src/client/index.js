/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from '../components/App';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const container = document.getElementById('root');
hydrateRoot(container, <App />);
