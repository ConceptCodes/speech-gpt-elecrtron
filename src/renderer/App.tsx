import Home from '$renderer/pages/home';
import useStore from './hooks/useState';

const App = () => {
  const { currentSpeech } = useStore();

  return currentSpeech ? <p>hello world</p> : <Home />;
};

export default App;
