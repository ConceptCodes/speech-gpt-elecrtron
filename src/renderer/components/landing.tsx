import { Speeches } from './speeches';
import { Button } from './ui/button';

const Landing = () => {
  const handleUpload = () => {};

  return (
    <section className='flex flex-col gap-10 px-4 py-6 md:px-8 md:py-12'>
      <div className='flex flex-row-reverse items-center gap-4'>
        <Button onClick={handleUpload}>Upload</Button>
      </div>
      <main className='flex flex-col gap-10 md:gap-20'>
        <div className='flex flex-col gap-4 md:gap-6'>
          <h1 className='text-4xl md:text-5xl font-bold'>Speech GPT</h1>
          <p className='text-lg md:text-xl text-gray-500 dark:text-gray-400'>
            Create and manage lists of gear for various activities such as
            camping, hiking, travel, and more. Customize your lists by adding
            notes, quantities, and checking off items as you pack them.
          </p>
        </div>
        <Speeches speeches={[]} />
      </main>
    </section>
  );
};

export default Landing;
