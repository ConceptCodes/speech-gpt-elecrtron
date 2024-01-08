export type ISpeech = {
  id: string;
  title: string;
  text: string;
  date: string;
};

export type State = {
  speeches: Array<ISpeech> | null;
  currentSpeech: ISpeech | null;
  apiKey: string;
};
