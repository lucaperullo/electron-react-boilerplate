import { createRoot } from 'react-dom/client';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import { GlobalStateProvider } from './context/GlobalStateProvider'; // Import the GlobalStateProvider

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
  <ChakraProvider>
    <GlobalStateProvider>
      {' '}
      {/* Wrap App with GlobalStateProvider */}
      <App />
    </GlobalStateProvider>
  </ChakraProvider>,
);

// calling IPC exposed from preload script
window.electron.electronAPI.once('ipc-example', (...args: unknown[]) => {
  const [arg] = args as [string]; // Type assertion for the argument
  console.log(arg);
});

window.electron.electronAPI.sendMessage('ipc-example', ['ping']);
