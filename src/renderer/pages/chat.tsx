import { useEffect, useRef, useState } from 'react';
import useStore from '$renderer/hooks/useStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Bot, Loader2, UserIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Alert, AlertDescription } from '$renderer/components/ui/alert';
import { Button } from '$renderer/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '$renderer/components/ui/form';
import { Input } from '$renderer/components/ui/input';
import { useToast } from '$renderer/hooks/useToast';

interface ChatInteraction {
  isBot: boolean;
  message: string;
}

export function Chat() {
  const { toast } = useToast();
  const [aiPlay, setAiPlay] = useState(false);

  const [processing, setProcessing] = useState(false);
  const [chatInteractions, setChatInteractions] = useState<ChatInteraction[]>([
    {
      message: `Hello, I'm Speech Gpt. I'm here to help you better understand the content.`,
      isBot: true,
    },
  ]);
  const [latestCommand, setLatestCommand] = useState('');

  const formSchema = z.object({
    question: z.string().min(1).describe('question'),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
    },
  });

  useEffect(() => {
    if (aiPlay) {
      onAskQuestion('/opponent');
      setAiPlay(false);
    }
  }, [aiPlay, setAiPlay]);

  const onAskQuestion = async (question: string) => {
    setChatInteractions((previousInteractions) => [
      ...previousInteractions,
      { isBot: false, message: question },
    ]);

    setProcessing(true);
    const result = ''; // here is where we ask the questions
    setProcessing(false);

    if (!result) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
      return;
    }

    setChatInteractions((previousInteractions) => [
      ...previousInteractions,
      { isBot: true, message: result },
    ]);
  };

  const interactionsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (interactionsRef?.current?.lastElementChild) {
      interactionsRef.current.lastElementChild.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
  }, [chatInteractions]);

  const onSubmit = async ({ question }: z.infer<typeof formSchema>) => {
    setLatestCommand(question);
    await onAskQuestion(question);
  };

  return (
    <div className='w-full rounded-lg'>
      <div
        ref={interactionsRef}
        className='flex h-[450px] flex-col gap-2 overflow-scroll rounded-lg bg-secondary p-2'
      >
        {chatInteractions.map((i, index) => (
          <Alert key={index}>
            {i.isBot ? (
              <Bot className='h-4 w-4' />
            ) : (
              <UserIcon className='h-4 w-4' />
            )}
            <AlertDescription className='flex justify-between'>
              <div>{i.message}</div>
            </AlertDescription>
          </Alert>
        ))}

        {processing && (
          <Alert key='processing' className='animate-pulse'>
            <Bot className='h-4 w-4' />
            <AlertDescription>...</AlertDescription>
          </Alert>
        )}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='mt-2 flex min-w-full flex-row gap-2'
        >
          <FormField
            control={form.control}
            name='question'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    disabled={processing}
                    type='text'
                    {...field}
                    placeholder='Ask any question'
                    onChangeCapture={field.onChange}
                    defaultValue={field.value}
                    className='w-[560px]'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type='submit'
            disabled={processing || aiPlay}
            className='min-w-[80px]'
          >
            {processing ? <Loader2 className='h-4 w-4 animate-spin' /> : 'Ask'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
