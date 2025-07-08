import { ChakraProvider, Container, Stack, extendTheme } from '@chakra-ui/react'
import PomodoroTimer from './components/PomodoroTimer'

const theme = extendTheme({
  fonts: {
    heading: '"Roboto", system-ui, -apple-system, sans-serif',
    body: '"Roboto", system-ui, -apple-system, sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
      },
    },
  },
})

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Container 
        maxW="container.md" 
        centerContent 
        py={8}
        minH="100vh"
        display="flex"
        alignItems="center"
      >
        <Stack 
          direction="column" 
          spacing={8} 
          w="100%" 
          align="center"
          bg="white"
          p={8}
          borderRadius="xl"
          boxShadow="lg"
        >
          <PomodoroTimer />
        </Stack>
      </Container>
    </ChakraProvider>
  )
}

export default App
