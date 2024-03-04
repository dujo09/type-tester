'use client'


import React, { KeyboardEventHandler, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';


interface TypeTesterProps {
  title: string;
  text: string;

}

const TypeTester: React.FC<TypeTesterProps> = ({ title, text }) => {
  const [remainingWords, setRemainingWords] = useState<string[]>(text.split(" "));
  const [completedWords, setCompletedWords] = useState<string[]>([]);
  const [lastWordInput, setLastWordInput] = useState<string>("");
  
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null); 
  const [elapsedTimeSec, setElapsedTimeSec] = useState<number>(0);

  const [wpm, setWpm] = useState<number>(0);
  const [mistakesCount, setMistakesCount] = useState<number>(0);
  const [accuracyPercentage, setAccuracyPercentage] = useState<number>(0.0);


  const startTimerInterval = () => {
    const startTime = Date.now();
    timerIntervalRef.current = setInterval(() => {
      const elapsedTimeMiliseconds = Date.now() - startTime;
      setElapsedTimeSec(elapsedTimeMiliseconds / 1000);
    }, 1000);
  };


  const stopTimerInterval = () => {
    if (timerIntervalRef.current !== null) {
      clearInterval(timerIntervalRef.current);
    }
  };

  
  useEffect(() => {
    const elapsedTimeMin = elapsedTimeSec / 60;
    const wpm = completedWords.length / elapsedTimeMin;
    
    if (isNaN(wpm)) {
      setWpm(0);
    } else {
      setWpm(wpm);
    }  
  }, [elapsedTimeSec, completedWords])


  useEffect(() => {
    const AVERAGE_WORD_LENGTH = 5;
    const totalInputedCharacters = completedWords.length * AVERAGE_WORD_LENGTH + lastWordInput.length;

    if (totalInputedCharacters == 0) {
      setAccuracyPercentage(0);
      return;
    }

    const accuracy = Math.max(0, (totalInputedCharacters - mistakesCount) / totalInputedCharacters);
    setAccuracyPercentage(accuracy * 100);
  }, [mistakesCount, completedWords]);
  

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (remainingWords.length <= 0) {
      stopTimerInterval();
      return;
    }
    
    if (timerIntervalRef.current == null) {
      startTimerInterval();
    }
    
    const currentWordInput = e.target.value;

    if (currentWordInput.length <= lastWordInput.length) {
      setLastWordInput(currentWordInput);
      return;
    }

    const currentWordInText = remainingWords[0];
    const indexOfNewCharacter = e.target.selectionStart ? e.target.selectionStart - 1 : 0;

    if (currentWordInput[indexOfNewCharacter] == " " && currentWordInput.trim() === currentWordInText) {
      const newRemainingWords = [...remainingWords.slice(1)]
      setRemainingWords(newRemainingWords);
      setCompletedWords([...completedWords, currentWordInText]);
      setLastWordInput("");

      if (newRemainingWords.length == 0) {
        stopTimerInterval();
      }
      return;
    }

    if (currentWordInText[indexOfNewCharacter] != currentWordInput[indexOfNewCharacter]) {
      setMistakesCount(mistakesCount + 1);
    }
    
    setLastWordInput(currentWordInput);
  };


  return (
    <div className="flex h-screen items-center justify-center bg-sky-300">
      <div className="w-full max-w-3xl rounded-md bg-white p-6 shadow-md">

      <div className="flex flex-row justify-between items-start">   

        <div className="flex flex-col items-start grow justify-between">
          <h1 className="mb-4 text-2xl font-semibold">{ title }</h1>

          <div className="flex flex-row justify-start gap-x-4">
            <h1 className="text-m text-gray-600">WPM: { wpm.toFixed(0) }</h1>
            <h1 className="text-m text-gray-600">ACC: { accuracyPercentage.toFixed(0) }%</h1>
          </div>
        </div>

        <h1 className="text-m text-gray-600">Elapsed time: { elapsedTimeSec.toFixed(0) }s</h1>
      </div>


        <div className="my-4 w-full flex flex-wrap px-3 py-2">
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
                key={ wordIndex }
              >

                {word.split("").map((letter, letterIndex) => {
                  const isCurrentLetter = isCurrentWord && letterIndex === lastWordInput.length;
                  const isIncorrectInput = isCurrentWord && lastWordInput[letterIndex] && letter !== lastWordInput[letterIndex];

                  return (
                    <span
                      className={clsx(
                        'text-xl',
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

        <div className="mt-4">
          <label htmlFor="typedText" className="text-gray-600">Type here:</label>
          <input 
            className="w-full text-xl rounded-md border px-3 py-2 bg-sky-200 focus:border-blue-400 focus:outline-none"
            type="text" 
            id="typedText"
            autoFocus={true}
            onChange={handleInput}
            value={lastWordInput}
          />
        </div>
      </div>
    </div>
  );
}

export default TypeTester;
