import { Settings } from 'lucide-react';

import { Button } from '$renderer/components/ui/button';
import {
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogContent,
  Dialog,
} from '$renderer/components/ui/dialog';
import { Label } from '$renderer/components/ui/label';
import { Input } from '$renderer/components/ui/input';
import useStore from '$renderer/hooks/useStore';
import { useToast } from '$renderer/hooks/useToast';

export default function SettingsModal() {
  const { setApiKey, apiKey } = useStore();
  const { toast } = useToast();

  const handleSave = (val: string) => {
    setApiKey(val);
    toast({
      title: 'API Key Saved',
      description: 'Your API key has been saved.',
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Settings />
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Enter your API key below and click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <Label htmlFor='api_key'>OpenAi API Key</Label>
            <Input
              id='api_key'
              type='text'
              value={apiKey}
              onChange={(e) => handleSave(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type='submit'>Save</Button>
          <div>
            <Button variant='outline'>Cancel</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
