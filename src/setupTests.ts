import '@testing-library/jest-dom';

// Setup test environment
beforeEach(() => {
  // Clear all mocks and timers before each test
  jest.clearAllMocks();
  jest.clearAllTimers();
  jest.useFakeTimers();
});

afterEach(() => {
  // Cleanup after each test
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
}); 