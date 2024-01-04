import whisper from 'whisper-node';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

export class AudioParser {
  private filePath: string;
  private script: string;
  private fileName: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.script = '';
    this.fileName = path.basename(this.filePath).split('.')[0];
  }

  async convertFileToWav() {
    const output = this.getOutputPath();

    const command = `ffmpeg -i ${this.filePath} -ar 16000 ${output}`;

    exec(command, (error, stdout, _) => {
      if (error) {
        throw error;
      }
      console.log(stdout);
    });

    this.filePath = output;
  }

  async transcribe() {
    if (!fs.existsSync(this.filePath)) throw new Error('File does not exist');

    if (fs.existsSync(this.getOutputPath())) {
      this.filePath = this.getOutputPath();
    } else {
      await this.convertFileToWav();
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    const options = {
      modelName: 'tiny.en',
      whisperOptions: {
        word_timestamps: false,
      },
    };

    const transcript = await whisper(this.filePath, options);

    this.script = transcript
      .map(
        (line: { start: number; end: number; speech: string }) => line.speech,
      )
      .join('\n');
  }

  async save(filePath: string) {
    await fs.promises.writeFile(filePath, this.script);
  }

  getFileName() {
    return this.fileName;
  }

  getOutputPath() {
    return path.join(
      __dirname,
      '..',
      'assets',
      'output',
      `${this.fileName}.wav`,
    );
  }

  convertTime(millis: number) {
    const minutes = Math.floor(millis / 60000);
    const seconds = Number(((millis % 60000) / 1000).toFixed(0));
    return seconds == 60
      ? minutes + 1 + ':00'
      : minutes + 'm ' + (seconds < 10 ? '0' : '') + seconds + 's';
  }
}
