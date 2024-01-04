import { Card, CardContent, CardDescription, CardHeader } from './ui/card';

export type ISpeech = {
  id: string;
  title: string;
  text: string;
  date: string;
};

interface ISpeechesProps {
  speeches: Array<ISpeech>;
}

export const Speeches = (props: ISpeechesProps) => {
  if (props.speeches.length === 0) {
    return (
      <div className='flex h-[300px] w-full flex-col items-center justify-center gap-4 rounded-lg border border-dashed'>
        <h2 className='text-xl font-bold'>No Speeches Found</h2>
        <p className='max-w-sm text-center text-base text-muted-foreground'>
          Upload your audio by clicking the upload button above.
        </p>
      </div>
    );
  }

  return (
    <section className='grid grid-cols-1 md:grid-cols-2 gap-8'>
      {props.speeches.map((speech) => (
        <Card key={speech.id}>
          <CardHeader>{speech.title}</CardHeader>
          <CardContent className='flex flex-col gap-2'>
            <CardDescription className='text-gray-500 dark:text-gray-400'>
              {speech.text}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </section>
  );
};
