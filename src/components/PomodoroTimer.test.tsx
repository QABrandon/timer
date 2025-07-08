import { render, screen, fireEvent, act } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import PomodoroTimer from './PomodoroTimer';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

// Mock Chakra toast
const mockToast = jest.fn();
jest.mock('@chakra-ui/react', () => {
  const actual = jest.requireActual('@chakra-ui/react');
  return {
    ...actual,
    useToast: () => ((props: any) => {
      mockToast(props);
      return {
        close: jest.fn(),
        closeAll: jest.fn(),
        update: jest.fn(),
        isActive: jest.fn(() => false),
      };
    })
  };
});

// Mock react-timer-hook
const mockTimerHook = {
  seconds: 30,
  minutes: 3,
  isRunning: false,
  pause: jest.fn(),
  resume: jest.fn(),
  restart: jest.fn((expiryTimestamp: Date, autoStart = true) => {
    const now = new Date();
    const diff = Math.floor((expiryTimestamp.getTime() - now.getTime()) / 1000);
    mockTimerHook.minutes = Math.floor(diff / 60);
    mockTimerHook.seconds = diff % 60;
    mockTimerHook.isRunning = autoStart;
  }),
};

jest.mock('react-timer-hook', () => ({
  useTimer: () => mockTimerHook
}));

// Mock console.log to prevent noise in test output
console.log = jest.fn();

describe('PomodoroTimer', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    mockTimerHook.isRunning = false;
    mockTimerHook.minutes = 3;
    mockTimerHook.seconds = 30;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Helper function to render component with ChakraProvider
  const renderTimer = () => {
    return render(
      <ChakraProvider>
        <PomodoroTimer />
      </ChakraProvider>
    );
  };

  describe('Initial Render', () => {
    it('renders the main heading', () => {
      renderTimer();
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Pomodoro Timer');
      expect(heading).toHaveStyle({ color: expect.stringMatching(/forestgreen|rgb\(34, 139, 34\)/) });
    });

    it('displays initial time of 03:30', () => {
      renderTimer();
      const timer = screen.getByRole('timer');
      expect(timer).toHaveTextContent('03:30');
    });

    it('renders all control buttons', () => {
      renderTimer();
      expect(screen.getByRole('button', { name: /start timer/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /reset timer/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /update timer with custom time/i })).toBeInTheDocument();
    });
  });

  describe('Timer Controls', () => {
    it('toggles between Start and Pause button text', async () => {
      renderTimer();
      const user = userEvent.setup();
      const toggleButton = screen.getByRole('button', { name: /start timer/i });
      
      // Start timer
      await act(async () => {
        mockTimerHook.isRunning = true;
        await user.click(toggleButton);
      });
      expect(mockTimerHook.resume).toHaveBeenCalled();
      expect(toggleButton).toHaveTextContent('Pause');
      expect(toggleButton).toHaveAttribute('aria-label', 'Pause timer');
      
      // Pause timer
      await act(async () => {
        mockTimerHook.isRunning = false;
        await user.click(toggleButton);
      });
      expect(mockTimerHook.pause).toHaveBeenCalled();
      expect(toggleButton).toHaveTextContent('Start');
      expect(toggleButton).toHaveAttribute('aria-label', 'Start timer');
    });

    it('resets timer when Reset button is clicked', () => {
      renderTimer();
      const resetButton = screen.getByRole('button', { name: /reset timer/i });
      
      fireEvent.click(resetButton);
      expect(mockTimerHook.restart).toHaveBeenCalled();
      expect(mockTimerHook.pause).toHaveBeenCalled();
    });
  });

  describe('Custom Time Input', () => {
    it('allows setting custom minutes', () => {
      renderTimer();
      const minutesInput = screen.getByRole('spinbutton', { name: /minutes input/i });
      
      fireEvent.change(minutesInput, { target: { value: '5' } });
      expect(minutesInput).toHaveValue(5);
    });

    it('allows setting custom seconds', () => {
      renderTimer();
      const secondsInput = screen.getByRole('spinbutton', { name: /seconds input/i });
      
      fireEvent.change(secondsInput, { target: { value: '45' } });
      expect(secondsInput).toHaveValue(45);
    });

    it('updates timer with custom values when Update Timer is clicked', () => {
      renderTimer();
      const minutesInput = screen.getByRole('spinbutton', { name: /minutes input/i });
      const secondsInput = screen.getByRole('spinbutton', { name: /seconds input/i });
      const updateButton = screen.getByRole('button', { name: /update timer with custom time/i });

      fireEvent.change(minutesInput, { target: { value: '5' } });
      fireEvent.change(secondsInput, { target: { value: '45' } });
      fireEvent.click(updateButton);

      expect(mockTimerHook.restart).toHaveBeenCalled();
      expect(mockTimerHook.pause).toHaveBeenCalled();
    });

    it('prevents invalid time inputs', () => {
      renderTimer();
      const minutesInput = screen.getByRole('spinbutton', { name: /minutes input/i });
      const secondsInput = screen.getByRole('spinbutton', { name: /seconds input/i });

      // Test upper bounds
      fireEvent.change(minutesInput, { target: { value: '60' } });
      expect(minutesInput).toHaveAttribute('max', '59');

      fireEvent.change(secondsInput, { target: { value: '60' } });
      expect(secondsInput).toHaveAttribute('max', '59');

      // Test lower bounds
      fireEvent.change(minutesInput, { target: { value: '-1' } });
      expect(minutesInput).toHaveAttribute('min', '0');

      fireEvent.change(secondsInput, { target: { value: '-1' } });
      expect(secondsInput).toHaveAttribute('min', '0');
    });
  });

  describe('Accessibility Features', () => {
    it('has proper ARIA labels on all interactive elements', () => {
      renderTimer();
      
      expect(screen.getByRole('button', { name: /start timer/i })).toHaveAttribute('aria-label', 'Start timer');
      expect(screen.getByRole('button', { name: /reset timer/i })).toHaveAttribute('aria-label', 'Reset timer');
      expect(screen.getByRole('button', { name: /update timer with custom time/i })).toHaveAttribute('aria-label', 'Update timer with custom time');
      expect(screen.getByRole('spinbutton', { name: /minutes input/i })).toHaveAttribute('aria-label', 'Minutes input');
      expect(screen.getByRole('spinbutton', { name: /seconds input/i })).toHaveAttribute('aria-label', 'Seconds input');
    });

    it('has proper heading hierarchy', () => {
      renderTimer();
      
      const h1 = screen.getByRole('heading', { level: 1 });
      const h2 = screen.getByRole('heading', { level: 2 });
      
      expect(h1).toHaveTextContent('Pomodoro Timer');
      expect(h2).toHaveTextContent('Set Custom Time');
      expect(h2).toHaveStyle({ color: expect.stringMatching(/royalblue|rgb\(65, 105, 225\)/) });
    });

    it('has ARIA live region for timer updates', () => {
      renderTimer();
      const liveRegion = screen.getByRole('status');
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    });

    it('supports double-click selection in input fields', async () => {
      renderTimer();
      const user = userEvent.setup();
      const minutesInput = screen.getByRole('spinbutton', { name: /minutes input/i });
      
      // Set initial value
      fireEvent.change(minutesInput, { target: { value: '5' } });
      
      // Simulate double click
      await act(async () => {
        await user.dblClick(minutesInput);
      });
      
      expect(minutesInput).toHaveFocus();
      expect(document.activeElement).toBe(minutesInput);
      
      // Verify the input value remains unchanged
      expect(minutesInput).toHaveValue(5);
    });
  });

  describe('Toast Notifications', () => {
    it('shows countdown notifications at appropriate thresholds', async () => {
      renderTimer();
      const user = userEvent.setup();
      const startButton = screen.getByRole('button', { name: /start timer/i });
      
      // Start timer and simulate countdown
      await act(async () => {
        await user.click(startButton);
        mockTimerHook.isRunning = true;
        mockTimerHook.minutes = 0;
        mockTimerHook.seconds = 10;
        // Force a re-render to trigger the handleTimerUpdate
        jest.runOnlyPendingTimers();
      });

      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        render: expect.any(Function),
        position: 'top',
        duration: 800,
        isClosable: true,
        containerStyle: expect.objectContaining({
          marginTop: '100px'
        })
      }));
    });

    it('shows completion notification when timer ends', async () => {
      renderTimer();
      const user = userEvent.setup();
      const startButton = screen.getByRole('button', { name: /start timer/i });
      
      // Start timer and simulate completion
      await act(async () => {
        await user.click(startButton);
        mockTimerHook.isRunning = true;
        mockTimerHook.minutes = 0;
        mockTimerHook.seconds = 0;
        // Force a re-render to trigger the handleTimerUpdate
        jest.runOnlyPendingTimers();
      });

      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        render: expect.any(Function),
        position: 'top',
        duration: 5000,
        isClosable: true,
        containerStyle: expect.objectContaining({
          marginTop: '100px'
        })
      }));
    });
  });
}); 