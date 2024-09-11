import { createRoot } from 'react-dom/client';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
  <ChakraProvider>
    <App />
  </ChakraProvider>,
);

// calling IPC exposed from preload script
window.electron.electronAPI.once('ipc-example', (arg: string) => {
  console.log(arg);
});

window.electron.electronAPI.send('ipc-example', ['ping']);
