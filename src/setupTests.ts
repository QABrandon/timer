import '@testing-library/jest-dom';

// Configure test environment
beforeEach(() => {
  // Enable fake timers and clear any previous state
  jest.useFakeTimers();
  jest.clearAllMocks();
  jest.clearAllTimers();
});

afterEach(() => {
  // Reset timers to real timers and cleanup
  jest.useRealTimers();
}); 