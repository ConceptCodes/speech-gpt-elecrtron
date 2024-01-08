import Home from '$renderer/pages/home';
import useStore from '$renderer/hooks/useStore';
import { Chat } from '$renderer/pages/chat';
import { ToastProvider } from './components/ui/toast';

const App = () => {
  const { currentSpeech } = useStore();

  return <ToastProvider>
    {currentSpeech ? <Chat /> : <Home />}
    </ToastProvider>;
};

export default App;
