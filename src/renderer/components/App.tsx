import { useState } from 'react';
import Landing from './landing';
import { ISpeech } from './speeches';

const App = () => {
  const [currentSpeech, setCurrentSpeech] = useState<ISpeech | null>(null);

  if (!currentSpeech) {
    return <Landing />;
  }
};

export default App;
