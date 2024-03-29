import { TextLoader } from 'langchain/document_loaders/fs/text';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  AIMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from 'langchain/prompts';
import { BufferMemory } from 'langchain/memory';
import { RunnableSequence } from 'langchain/schema/runnable';
import { StringOutputParser } from 'langchain/schema/output_parser';
import { formatDocumentsAsString } from 'langchain/util/document';
import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/hf_transformers';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

import chalk from 'chalk';
import path from 'path';
import fs from 'fs';

export class AI {
  private model: ChatOpenAI;
  private vectorStore: any;
  private memory: BufferMemory;

  constructor(apiKey: string) {
    this.model = new ChatOpenAI({
      openAIApiKey: apiKey,
    });
    this.vectorStore = null;
    this.memory = new BufferMemory({
      returnMessages: true,
      memoryKey: 'chat_history',
    });
  }

  async load(filename: string): Promise<void> {
    if (fs.existsSync(this.getVectorStoreFileName(filename))) {
      console.log(chalk.yellow('\nFound vector store from cache...\n'));
      this.vectorStore = await HNSWLib.load(
        path.join(
          __dirname,
          '..',
          'assets',
          'store',
          path.basename(filename).split('.')[0],
        ),
        new HuggingFaceTransformersEmbeddings({
          modelName: 'Xenova/all-MiniLM-L6-v2',
        }),
      );
    } else {
      console.log(chalk.yellow('\nLoading VectorStore...\n'));
      const loader = new TextLoader(filename);
      let docs = await loader.load();
      const text_splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 2000,
        chunkOverlap: 200,
      });

      docs = await text_splitter.splitDocuments(docs);

      this.vectorStore = await HNSWLib.fromDocuments(
        docs,
        new HuggingFaceTransformersEmbeddings({
          modelName: 'Xenova/all-MiniLM-L6-v2',
        }),
      );

      console.log(chalk.yellow('\nSaving VectorStore...\n'));

      await this.vectorStore.save(this.getVectorStoreFileName(filename));
    }
    this.vectorStore = this.vectorStore.asRetriever({
      searchKwargs: { fetchK: 5 },
    });
  }

  getVectorStoreFileName(filename: string) {
    return path.join(
      __dirname,
      '..',
      'assets',
      'store',
      path.basename(filename).split('.')[0],
    );
  }

  async ask(question: string): Promise<string> {
    const questionGeneratorTemplate = ChatPromptTemplate.fromMessages([
      AIMessagePromptTemplate.fromTemplate(
        'Given the following conversation about a transcript and a follow up question, rephrase the follow up question to be a standalone question.',
      ),
      new MessagesPlaceholder('chat_history'),
      AIMessagePromptTemplate.fromTemplate(
        `Follow Up Input: {question}\nStandalone question:`,
      ),
    ]);

    const combineDocumentsPrompt = ChatPromptTemplate.fromMessages([
      AIMessagePromptTemplate.fromTemplate(
        "Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.\n\n{context}\n\n",
      ),
      new MessagesPlaceholder('chat_history'),
      HumanMessagePromptTemplate.fromTemplate('Question: {question}'),
    ]);

    const combineDocumentsChain = RunnableSequence.from([
      {
        question: (output: string) => output,
        chat_history: async () => {
          const { chat_history } = await this.memory.loadMemoryVariables({});
          return chat_history;
        },
        context: async (output: string) => {
          const relevantDocs = await this.vectorStore.getRelevantDocuments(
            output,
          );
          return formatDocumentsAsString(relevantDocs);
        },
      },
      combineDocumentsPrompt,
      this.model,
      new StringOutputParser(),
    ]);

    const conversationalQaChain = RunnableSequence.from([
      {
        question: (i: { question: string }) => i.question,
        chat_history: async () => {
          const { chat_history } = await this.memory.loadMemoryVariables({});
          return chat_history;
        },
      },
      questionGeneratorTemplate,
      this.model,
      new StringOutputParser(),
      combineDocumentsChain,
    ]);

    const result = await conversationalQaChain.invoke({
      question,
    });

    await this.memory.saveContext(
      {
        input: question,
      },
      {
        output: result,
      },
    );

    return result;
  }
}
