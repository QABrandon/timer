import { ChakraProvider, Container, Stack, extendTheme } from '@chakra-ui/react'
import PomodoroTimer from './components/PomodoroTimer'

const theme = extendTheme({
  fonts: {
    heading: 'Roboto, sans-serif',
    body: 'Roboto, sans-serif',
  },
})

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Container maxW="container.md" centerContent py={8}>
        <Stack direction="column" gap={8} w="100%">
          <PomodoroTimer />
        </Stack>
      </Container>
    </ChakraProvider>
  )
}

export default App
