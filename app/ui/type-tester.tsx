'use client'


import React, { useEffect, useState } from 'react';
import clsx from 'clsx';


interface TypeTesterProps {
  text: string;

}

const TypeTester: React.FC<TypeTesterProps> = ({ text }) => {
  const [remainingWords, setRemainingWords] = useState<string[]>([]);
  const [completedWords, setCompletedWords] = useState<string[]>([]);
  const [currentWordInput, setCurrentWordInput] = useState<string>("");
  const [elapsedTimeSec, setElapsedTimeSec] = useState<number>(0);
  const [wpm, setWpm] = useState<number>(0);
  const [mistakesCount, setMistakesCount] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(0.0);
  

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsedTimeMiliseconds = Date.now() - startTime;
      setElapsedTimeSec(elapsedTimeMiliseconds / 1000);
    }, 1000);

    setRemainingWords(text.split(" "));

    return () => clearInterval(interval);
  }, []);

  
  useEffect(() => {
    const elapsedTimeMin = elapsedTimeSec / 60;
    const wpm = completedWords.length / elapsedTimeMin;
    
    if (isNaN(wpm)) {
      setWpm(0);
    } else {
      setWpm(wpm);
    }  
  }, [elapsedTimeSec, completedWords])


  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentWordInput(e.target.value);
  };
  
  useEffect(() => {
    const indexOfCurrentInput = currentWordInput.length - 1;
    if (indexOfCurrentInput < 0) {
      return;
    }
    
    const currentWord = remainingWords[0];

    // const AVERAGE_WORD_LENGTH = 5;
    // const totalNumberOfCharacters = completedWords.length * AVERAGE_WORD_LENGTH + currentWordInput.length;
    // setAccuracy((totalNumberOfCharacters - mistakesCount) / totalNumberOfCharacters);

    if (currentWordInput[indexOfCurrentInput] != " ") {
      return;
    }

    if (currentWordInput.trim() === currentWord) {
      setCompletedWords([...completedWords, currentWord]);
      setRemainingWords(remainingWords.slice(1));

      setCurrentWordInput("");
    }
  }, [currentWordInput]);


  
  return (
    <div className="flex flex-row flex-wrap justify-center">
      <div className="flex flex-row justify-center items-center">
        <h1 className="p-5">WPM: { wpm }</h1>
        <h1 className="p-5">ACC: { accuracy } </h1>
        <h1 className="p-5">Elapsed time: { elapsedTimeSec }</h1>
      </div>

      <div className="p-20 px-50 flex flex-row flex-wrap justify-left align-center">
        {text.split(" ").map((word, wordIndex) => {
          const isCurrentWord = wordIndex === completedWords.length;
          
          return (
            <span 
              className={clsx(
                'mr-1',
                {
                  'underline underline-offset-8 decoration-2 decoration-sky-400': isCurrentWord,
                },
              )}
              key={ wordIndex }>

              {word.split("").map((letter, letterIndex) => {
                const isCurrentLetter = isCurrentWord && letterIndex === currentWordInput.length;
                const isIncorrectInput = isCurrentWord && currentWordInput[letterIndex] && letter !== currentWordInput[letterIndex];

                return (<span
                        className={clsx(
                          'text-lg',
                          {
                            'bg-sky-400 text-black': isCurrentLetter,
                            'bg-red-400': isIncorrectInput,
                          },
                        )}
                        key={ wordIndex + letterIndex }
                        >
                          { letter }
                        </span>)
              })}
            </span>
          );
        })}
        </div>
      
      <input
        className="text-black"
        name="current-word-input"
        type="text"
        onChange={handleInput}
        value={currentWordInput}
        autoFocus={true}
      />
    </div>
  );
}

export default TypeTester;
