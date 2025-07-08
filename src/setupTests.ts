import '@testing-library/jest-dom';

// Enable fake timers globally
jest.useFakeTimers();

// Setup test environment
beforeEach(() => {
  // Clear all mocks and timers before each test
  jest.clearAllMocks();
  jest.clearAllTimers();
});

afterEach(() => {
  // Cleanup after each test
  jest.clearAllTimers();
}); 