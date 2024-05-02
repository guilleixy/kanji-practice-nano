"use client"
import React, { useState, useEffect } from 'react';
import { sampleSize, sample } from 'lodash';
import { Toaster, toast } from 'sonner'
import {Checkbox} from "@nextui-org/checkbox";

interface Kanji {
  key: number;
  kanji: string;
  onyomi: string;
  kunyomi: string;
  translation: string;
}

export default function Home() {
  const [allKanji, setAllKanji] = useState<Kanji[]>([]);
  const [randomKanji, setRandomKanji] = useState<Kanji | null>(null);
  const [options, setOptions] = useState<Kanji[]>([]);
  const [onyomiChecked, setOnyomiChecked] = useState(true);
  const [kunyomiChecked, setKunyomiChecked] = useState(true);
  const [translationChecked, setTranslationChecked] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('kanjis.json') // Replace with the actual path to kanjis.json
      .then(response => response.json())
      .then(data => {
        setAllKanji(data.kanjis);
        generateOptions(data.kanjis);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching kanjis:', error);
        setIsLoading(false);
      });
  }, []);

  const generateOptions = (kanjis: Kanji[]) => {
    const sampledKanjis = sampleSize(kanjis, 3);
    setOptions(sampledKanjis);
    setRandomKanji(sample(sampledKanjis) as Kanji);
  };

  const checkAnswer = (option: Kanji) => {
    if (option.key === randomKanji?.key) {
      toast.success(option.kanji + ' は "' + option.translation + '" です!');
      generateOptions( allKanji );
    } else {
      toast.error(option.kanji + ' は "' + option.translation + '" ではありません!');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div className='flex flex-wrap justify-center absolute top-3'>
        <Checkbox className='mx-3' size='md' isSelected={onyomiChecked} checked={onyomiChecked} onChange={() => setOnyomiChecked(!onyomiChecked)}>
          おんよみ
        </Checkbox>
        <Checkbox className='mx-3' size='md' isSelected={kunyomiChecked} checked={kunyomiChecked} onChange={() => setKunyomiChecked(!kunyomiChecked)}>
          くんよみ
        </Checkbox>
        <Checkbox className='mx-3' size='md' isSelected={translationChecked} checked={translationChecked} onChange={() => setTranslationChecked(!translationChecked)}>
          いみ
        </Checkbox>
      </div>
      <Toaster richColors/>
      <p className='text-8xl border-white border-solid rounded-md border-2 p-11 mb-5'>{randomKanji?.kanji}</p>
      <div className='flex flex-wrap justify-center'>
        {options.map((option, index) => (
          <button className='border-white border-solid rounded-md border-2 p-4 m-2' key={index} onClick={() => checkAnswer(option)}>
            {[onyomiChecked ? option.onyomi : '', kunyomiChecked ? option.kunyomi : '', translationChecked ? option.translation : ''].filter(Boolean).join(' / ')}
          </button>
        ))}        
      </div>

    </div>
  );
}