import { useState, useRef } from 'react';
import { useTimer } from 'react-timer-hook';
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
  const [customMinutes, setCustomMinutes] = useState(3);
  const [customSeconds, setCustomSeconds] = useState(30);
  const toast = useToast();
  const [isCountingDown, setIsCountingDown] = useState(false);
  const ariaLiveRef = useRef<HTMLDivElement>(null);
  const lastAnnouncedSecond = useRef<number | null>(null);

  const getExpiryTimestamp = (minutes: number, seconds: number) => {
    const time = new Date();
    time.setMinutes(time.getMinutes() + minutes);
    time.setSeconds(time.getSeconds() + seconds);
    return time;
  };

  const announceTimeLeft = (timeLeft: number) => {
    // Only announce if this second hasn't been announced yet
    if (lastAnnouncedSecond.current !== timeLeft) {
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
    }
  };

  const handleTimerUpdate = (totalSeconds: number) => {
    if (!isRunning) return;

    const isShortTimer = totalSeconds < 60;
    const countdownThreshold = isShortTimer ? 3 : 10;

    if (totalSeconds <= countdownThreshold && totalSeconds > 0) {
      if (!isCountingDown) {
        setIsCountingDown(true);
      }
      announceTimeLeft(totalSeconds);
    } else if (totalSeconds === 0) {
      setIsCountingDown(false);
      lastAnnouncedSecond.current = null;
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
    }
  };

  const {
    seconds,
    minutes,
    isRunning,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp: getExpiryTimestamp(3, 30),
    onExpire: () => console.log('Timer expired!'),
    autoStart: false,
  });

  // Watch for timer changes
  const totalSeconds = minutes * 60 + seconds;
  if (isRunning) {
    handleTimerUpdate(totalSeconds);
  }

  const handleReset = () => {
    const time = getExpiryTimestamp(customMinutes, customSeconds);
    restart(time, false);
    pause();
    setIsCountingDown(false);
    lastAnnouncedSecond.current = null;
  };

  const handleUpdateTime = () => {
    const time = getExpiryTimestamp(customMinutes, customSeconds);
    restart(time, false);
    pause();
    setIsCountingDown(false);
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
            onClick={isRunning ? pause : resume} 
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