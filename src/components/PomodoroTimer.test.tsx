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
    __esModule: true,
    ...actual,
    useToast: () => mockToast
  };
});

const renderWithChakra = (ui: React.ReactElement) => {
  return render(
    <ChakraProvider>{ui}</ChakraProvider>
  );
};

describe('PomodoroTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockToast.mockClear();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  describe('Initial Render', () => {
    it('renders the main heading', () => {
      renderWithChakra(<PomodoroTimer />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Pomodoro Timer');
      const computedStyle = window.getComputedStyle(heading);
      expect(computedStyle.color).toBe('rgb(34, 139, 34)'); // forestgreen
    });

    it('displays initial time of 00:00', () => {
      renderWithChakra(<PomodoroTimer />);
      const timer = screen.getByRole('timer');
      expect(timer).toHaveTextContent('00:00');
    });

    it('renders all control buttons', () => {
      renderWithChakra(<PomodoroTimer />);
      expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
    });
  });

  describe('Timer Controls', () => {
    it('toggles between Start and Pause button text', async () => {
      renderWithChakra(<PomodoroTimer />);
      const user = userEvent.setup({ delay: null });
      const toggleButton = screen.getByRole('button', { name: /start/i });
      
      await user.click(toggleButton);
      expect(toggleButton).toHaveTextContent('Pause');
      expect(toggleButton).toHaveAttribute('aria-label', 'Pause timer');
      
      await user.click(toggleButton);
      expect(toggleButton).toHaveTextContent('Start');
      expect(toggleButton).toHaveAttribute('aria-label', 'Start timer');
    });

    it('counts down when running', async () => {
      renderWithChakra(<PomodoroTimer />);
      const user = userEvent.setup({ delay: null });
      
      // Set custom time to 5 seconds first
      const minutesInput = screen.getByLabelText('Minutes input');
      const secondsInput = screen.getByLabelText('Seconds input');
      const updateButton = screen.getByRole('button', { name: /update/i });
      
      await act(async () => {
        fireEvent.change(minutesInput, { target: { value: '0' } });
        fireEvent.change(secondsInput, { target: { value: '5' } });
        fireEvent.click(updateButton);
      });

      const startButton = screen.getByRole('button', { name: /start/i });
      
      await user.click(startButton);
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      const timer = screen.getByRole('timer');
      expect(timer).toHaveTextContent('00:04');
    });

    it('resets timer when Reset button is clicked', async () => {
      renderWithChakra(<PomodoroTimer />);
      const user = userEvent.setup({ delay: null });
      const startButton = screen.getByRole('button', { name: /start/i });
      const resetButton = screen.getByRole('button', { name: /reset/i });
      
      // Start and advance timer
      await user.click(startButton);
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      // Reset
      await user.click(resetButton);

      const timer = screen.getByRole('timer');
      expect(timer).toHaveTextContent('00:00');
    });
  });

  describe('Custom Time Input', () => {
    it('allows setting custom minutes', () => {
      renderWithChakra(<PomodoroTimer />);
      const minutesInput = screen.getByLabelText('Minutes input');
      
      fireEvent.change(minutesInput, { target: { value: '5' } });
      expect(minutesInput).toHaveValue(5);
    });

    it('allows setting custom seconds', () => {
      renderWithChakra(<PomodoroTimer />);
      const secondsInput = screen.getByLabelText('Seconds input');
      
      fireEvent.change(secondsInput, { target: { value: '45' } });
      expect(secondsInput).toHaveValue(45);
    });

    it('updates timer with custom values when Update Timer is clicked', async () => {
      renderWithChakra(<PomodoroTimer />);
      const minutesInput = screen.getByLabelText('Minutes input');
      const secondsInput = screen.getByLabelText('Seconds input');
      const updateButton = screen.getByRole('button', { name: /update/i });

      await act(async () => {
        fireEvent.change(minutesInput, { target: { value: '5' } });
        fireEvent.change(secondsInput, { target: { value: '45' } });
        fireEvent.click(updateButton);
      });

      const timer = screen.getByRole('timer');
      expect(timer).toHaveTextContent('05:45');
    });

    it('prevents invalid time inputs', () => {
      renderWithChakra(<PomodoroTimer />);
      const minutesInput = screen.getByLabelText('Minutes input');
      const secondsInput = screen.getByLabelText('Seconds input');

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
      renderWithChakra(<PomodoroTimer />);
      
      expect(screen.getByRole('button', { name: /start/i })).toHaveAttribute('aria-label', 'Start timer');
      expect(screen.getByRole('button', { name: /reset/i })).toHaveAttribute('aria-label', 'Reset timer');
      expect(screen.getByLabelText('Minutes input')).toBeInTheDocument();
      expect(screen.getByLabelText('Seconds input')).toBeInTheDocument();
    });

    it('has proper heading hierarchy', () => {
      renderWithChakra(<PomodoroTimer />);
      
      const h1 = screen.getByRole('heading', { level: 1 });
      const h2 = screen.getByRole('heading', { level: 2 });
      
      expect(h1).toHaveTextContent('Pomodoro Timer');
      expect(h2).toHaveTextContent('Set Custom Time');
      const computedStyle = window.getComputedStyle(h2);
      expect(computedStyle.color).toBe('rgb(65, 105, 225)'); // royalblue
    });

    it('has ARIA live region for timer updates', () => {
      renderWithChakra(<PomodoroTimer />);
      const liveRegion = screen.getByRole('status');
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    });

    it('supports double-click selection in input fields', async () => {
      renderWithChakra(<PomodoroTimer />);
      const user = userEvent.setup({ delay: null });
      const minutesInput = screen.getByLabelText('Minutes input');
      
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
    // Set timeout for all tests in this describe block
    jest.setTimeout(30000);

    const advanceTimer = async (seconds: number) => {
      await act(async () => {
        jest.advanceTimersByTime(seconds * 1000);
        // Wait for effects to complete
        await Promise.resolve();
        await Promise.resolve();
      });
    };

    beforeEach(() => {
      mockToast.mockClear();
    });

    it('shows countdown notifications at appropriate thresholds', async () => {
      renderWithChakra(<PomodoroTimer />);
      const user = userEvent.setup({ delay: null });
      
      // Set custom time to 15 seconds first
      const minutesInput = screen.getByLabelText('Minutes input');
      const secondsInput = screen.getByLabelText('Seconds input');
      const updateButton = screen.getByRole('button', { name: /update/i });
      
      await act(async () => {
        fireEvent.change(minutesInput, { target: { value: '0' } });
        fireEvent.change(secondsInput, { target: { value: '15' } });
        fireEvent.click(updateButton);
      });

      const startButton = screen.getByRole('button', { name: /start/i });
      
      // Start timer
      await user.click(startButton);
      
      // Clear any previous toast calls
      mockToast.mockClear();

      // Advance to 10 seconds remaining
      await act(async () => {
        jest.advanceTimersByTime(5000); // 5 seconds, so 10 remain
        await Promise.resolve();
        await Promise.resolve();
      });

      // Verify timer state
      expect(screen.getByRole('timer')).toHaveTextContent('00:10');

      // Verify the toast was called
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          position: 'top',
          duration: 800,
          isClosable: true,
          containerStyle: expect.objectContaining({
            marginTop: '100px'
          }),
          render: expect.any(Function)
        })
      );

      // Verify the rendered content
      const renderFn = mockToast.mock.calls[0][0].render;
      const renderedContent = renderFn();
      expect(renderedContent.props.children).toContain('10 seconds remaining');
    });

    it('shows completion notification when timer ends', async () => {
      renderWithChakra(<PomodoroTimer />);
      const user = userEvent.setup({ delay: null });
      
      // Set custom time to 5 seconds first to avoid the 3-second countdown notification
      const minutesInput = screen.getByLabelText('Minutes input');
      const secondsInput = screen.getByLabelText('Seconds input');
      const updateButton = screen.getByRole('button', { name: /update/i });
      
      await act(async () => {
        fireEvent.change(minutesInput, { target: { value: '0' } });
        fireEvent.change(secondsInput, { target: { value: '5' } });
        fireEvent.click(updateButton);
      });

      const startButton = screen.getByRole('button', { name: /start/i });
      
      // Start timer and advance to completion
      await user.click(startButton);
      
      // Clear any countdown notifications first
      mockToast.mockClear();
      
      await advanceTimer(5);

      // Verify completion toast was called (should be the last call)
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          position: 'top',
          duration: 5000,
          isClosable: true
        })
      );
    });
  });
}); 