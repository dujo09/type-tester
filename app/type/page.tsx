import React from 'react';
import TypeTester from '@/app/ui/type-tester'
import { fetchRandomTextEntry } from '@/app/lib/data';


const Page: React.FC = async () => {

  const randomTextEntry = await fetchRandomTextEntry();

  return (
    <TypeTester title={randomTextEntry.title} text={randomTextEntry.text} />
  )
}

export default Page;
