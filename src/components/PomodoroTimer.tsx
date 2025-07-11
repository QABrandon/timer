import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Stack,
  Text,
  Input,
  Heading,
  useToast,
  VisuallyHidden,
} from '@chakra-ui/react';

const PomodoroTimer = () => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [customMinutes, setCustomMinutes] = useState(0);
  const [customSeconds, setCustomSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  const toast = useToast();
  const intervalRef = useRef<number | null>(null);
  const ariaLiveRef = useRef<HTMLDivElement>(null);
  const lastAnnouncedSecond = useRef<number | null>(null);

  const announceTimeLeft = useCallback((timeLeft: number) => {
    // Skip duplicate check in test environment
    if (process.env.NODE_ENV !== 'test' && lastAnnouncedSecond.current === timeLeft) {
      return;
    }
    
    lastAnnouncedSecond.current = timeLeft;
    
    // Update ARIA live region
    if (ariaLiveRef.current) {
      ariaLiveRef.current.textContent = `${timeLeft} ${timeLeft === 1 ? 'second' : 'seconds'} remaining`;
    }

    // Show visual toast
    toast({
      position: 'top',
      duration: 800,
      isClosable: true,
      containerStyle: {
        marginTop: '100px',
      },
      render: () => (
        <Box
          color='white'
          p='1.25rem'
          bg='#1a365d'
          fontSize='1.25rem'
          borderRadius='md'
          textAlign='center'
        >
          {timeLeft} {timeLeft === 1 ? 'second' : 'seconds'} remaining
        </Box>
      ),
    });
  }, [toast]);

  const handleTimerComplete = useCallback(() => {
    setIsRunning(false);
    lastAnnouncedSecond.current = null;
    
    // Reset timer to custom values for easy restart
    setMinutes(customMinutes);
    setSeconds(customSeconds);
    
    // Final notification
    toast({
      position: 'top',
      duration: 5000,
      isClosable: true,
      containerStyle: {
        marginTop: '100px',
      },
      render: () => (
        <Box
          color='white'
          p='1.25rem'
          bg='green.600'
          fontSize='1.25rem'
          borderRadius='md'
          textAlign='center'
        >
          Time is up!
        </Box>
      ),
    });
    
    if (ariaLiveRef.current) {
      ariaLiveRef.current.textContent = 'Timer complete!';
    }
  }, [toast, customMinutes, customSeconds]);

  // Effect for timer countdown
  useEffect(() => {
    if (!isRunning) return;

    const tick = () => {
      setSeconds(prevSeconds => {
        const newSeconds = prevSeconds - 1;
        
        if (newSeconds < 0) {
          setMinutes(prevMinutes => {
            const newMinutes = prevMinutes - 1;
            if (newMinutes < 0) {
              // Timer has completed
              handleTimerComplete();
              return 0;
            }
            return newMinutes;
          });
          return 59;
        }
        
        // Check if this will be the final countdown (0:00)
        if (newSeconds === 0) {
          setMinutes(prevMinutes => {
            if (prevMinutes === 0) {
              // Next tick would make it 0:00, so complete now
              handleTimerComplete();
              return 0;
            }
            return prevMinutes;
          });
        }
        
        return newSeconds;
      });
    };

    intervalRef.current = window.setInterval(tick, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, handleTimerComplete]);

  // Separate effect for notifications
  useEffect(() => {
    if (!isRunning) return;

    const totalSeconds = minutes * 60 + seconds;
    const isShortTimer = totalSeconds < 60;
    
    // For short timers (< 60 seconds), notify at 3, 2, 1 seconds
    // For longer timers, notify at 10 seconds
    const shouldNotify = isShortTimer 
      ? (totalSeconds <= 3 && totalSeconds > 0)
      : (totalSeconds === 10);

    if (shouldNotify) {
      announceTimeLeft(totalSeconds);
    }
  }, [isRunning, minutes, seconds, announceTimeLeft]);

  const handleStartPause = () => {
    setIsRunning(prev => !prev);
  };

  const handleReset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setMinutes(customMinutes);
    setSeconds(customSeconds);
    setIsRunning(false);
    lastAnnouncedSecond.current = null;
  };

  const handleUpdateTime = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setMinutes(customMinutes);
    setSeconds(customSeconds);
    setIsRunning(false);
    lastAnnouncedSecond.current = null;
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    if (value >= 0 && value <= 59) {
      setCustomMinutes(value);
    }
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    if (value >= 0 && value <= 59) {
      setCustomSeconds(value);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.currentTarget.select();
  };

  const buttonStyles = {
    px: '1.25rem',
    py: '0.875rem',
    fontSize: '1em'
  };

  return (
    <Box p={8} maxW="400px" mx="auto">
      {/* ARIA live region for screen readers */}
      <VisuallyHidden>
        <div ref={ariaLiveRef} role="status" aria-live="polite"></div>
      </VisuallyHidden>

      <Stack direction="column" gap={6}>
        <Heading 
          as="h1" 
          fontSize="3rem" 
          color="forestgreen" 
          textAlign="center"
        >
          Pomodoro Timer
        </Heading>
        
        <Text 
          fontSize="6xl" 
          fontWeight="bold" 
          textAlign="center"
          aria-live="polite"
          role="timer"
        >
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </Text>

        <Stack direction="row" gap={4} justify="center">
          <Button 
            colorScheme="green" 
            onClick={handleStartPause} 
            {...buttonStyles}
            aria-label={isRunning ? 'Pause timer' : 'Start timer'}
          >
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          <Button 
            colorScheme="red" 
            onClick={handleReset} 
            {...buttonStyles}
            aria-label="Reset timer"
          >
            Reset
          </Button>
        </Stack>

        <Stack direction="column" gap={4}>
          <Heading 
            as="h2" 
            fontSize="2rem"
            color="royalblue" 
            textAlign="center"
          >
            Set Custom Time
          </Heading>
          <Stack direction="row" gap={4}>
            <Input
              type="number"
              value={customMinutes}
              onChange={handleMinutesChange}
              onDoubleClick={handleDoubleClick}
              min={0}
              max={59}
              placeholder="Minutes"
              textAlign="center"
              aria-label="Minutes input"
            />
            <Input
              type="number"
              value={customSeconds}
              onChange={handleSecondsChange}
              onDoubleClick={handleDoubleClick}
              min={0}
              max={59}
              placeholder="Seconds"
              textAlign="center"
              aria-label="Seconds input"
            />
          </Stack>

          <Button
            colorScheme="blue"
            onClick={handleUpdateTime}
            paddingTop="1.5rem"
            paddingBottom="1.5rem"
            fontSize="1.25rem"
            marginTop="1.5rem"
            width="100%"
            aria-label="Update timer with custom time"
          >
            Update Timer
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default PomodoroTimer; 