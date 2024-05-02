"use client"
import React, { useState, useEffect } from 'react';
import { sampleSize, sample } from 'lodash';
import { Toaster, toast } from 'sonner'

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
      toast.success(option.kanji +  ' es correcto!');
      generateOptions( allKanji );
    } else {
      toast.error(option.kanji +  ' es incorrecto!');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Toaster richColors/>
      <p className='text-8xl border-white border-solid rounded-md border-2 p-11'>{randomKanji?.kanji}</p>
      <div>
        <label>
          <input type="checkbox" checked={onyomiChecked} onChange={() => setOnyomiChecked(!onyomiChecked)} />
          おんよみ
        </label>
        <label>
          <input type="checkbox" checked={kunyomiChecked} onChange={() => setKunyomiChecked(!kunyomiChecked)} />
          くんよみ 
        </label>
        <label>
          <input type="checkbox" checked={translationChecked} onChange={() => setTranslationChecked(!translationChecked)} />
          いみ
        </label>
      </div>
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