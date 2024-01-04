// Say something
console.log('[EVite] : preload executed');

import { contextBridge, ipcRenderer } from 'electron';
import path from 'node:path';

contextBridge.exposeInMainWorld('electron', {
  startDrag: (fileName: string) => {
    ipcRenderer.send('ondragstart', path.join(process.cwd(), fileName));
  },
});
