'use client'


import React, { useEffect, useState } from 'react';
import clsx from 'clsx';


interface TypeTesterProps {
  inputText: string;

}

const TypeTester: React.FC<TypeTesterProps> = ({ inputText }) => {
  const [text, setText] = useState<string>("");
  const [remainingWords, setRemainingWords] = useState<string[]>([]);
  const [completedWords, setCompletedWords] = useState<string[]>([]);
  const [currentWordInput, setCurrentWordInput] = useState<string>("");
  
  useEffect(() => {
    setText(inputText);
    setRemainingWords(inputText.split(" "));
  }, []);

  useEffect(() => {
    const currentInput = currentWordInput.substring(currentWordInput.length - 1);
    if (currentInput != " ") {
      return;
    }

    const currentWord = remainingWords[0];
    if (currentWordInput.trim() === currentWord) {
      setCompletedWords([...completedWords, currentWord]);
      setRemainingWords(remainingWords.slice(1));

      setCurrentWordInput("");
    }


  }, [currentWordInput]);

  useEffect(() => {
    console.log("Remaining words: " + remainingWords.length);
    console.log("Completed words: " + completedWords.length);
  }, [remainingWords, completedWords]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentWordInput(e.target.value);
  };
  
  return (
    <div className="flex flex-row flex-wrap justify-center">
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
