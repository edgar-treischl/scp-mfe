/**
 * Application initialization utilities
 * Handles one-time setup tasks like database initialization
 */

import { initializeWithMockData } from './database';

/**
 * Flag to track if the app has been initialized
 */
let isInitialized = false;

/**
 * Initialize the application (runs only once)
 * Currently initializes the database with mock data
 */
export async function initializeApp(): Promise<void> {
  if (isInitialized) {
    return;
  }

  try {
    await initializeWithMockData();
    isInitialized = true;
  } catch (error) {
    console.error('Failed to initialize application:', error);
  }
}
