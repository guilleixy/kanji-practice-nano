"use client"
import React, { useState, useEffect } from 'react';
import { sampleSize, sample } from 'lodash';
import { Toaster, toast } from 'sonner'
import {Switch} from "@nextui-org/switch";
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
  const [order, setOrder] = useState(false);

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
      toast.success(option.kanji + ' は "' + randomKanji.translation + '" です!');
      generateOptions( allKanji );
    } else {
      toast.error(option.kanji + ' は "' + randomKanji?.translation + '" ではありません!');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='relative' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        {/* <Switch color='success' className='text-center' isSelected={order} onValueChange={setOrder}>
          Kanji - Traducción / Traducción - Kanji
        </Switch> */}
        <div className='absolute bottom-5 flex justify-center items-center'>
          <span className='mx-2'>Kanji - Traducción</span>
          <label className="switch">
            <input type="checkbox" onChange={() => setOrder(!order)}/>
            <span className="slider"></span>
          </label>   
          <span className='mx-2'>Traducción - Kanji</span>       
        </div>

        <div className='flex flex-wrap justify-center top-3 absolute'>
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
      <p className={`${order ? 'text-2xl p-8 text-center' : 'text-8xl p-11'} border-white border-solid rounded-md border-2 mb-5`}>
        {order ?
          (onyomiChecked && randomKanji?.onyomi ? randomKanji.onyomi : '') + 
          (kunyomiChecked && randomKanji?.kunyomi ? ' / ' + randomKanji.kunyomi : '') + 
          (translationChecked && randomKanji?.translation ? ' / ' + randomKanji.translation : '') 
          :
          randomKanji?.kanji 
        }
      </p>
      <div className='flex flex-wrap justify-center'>
        {options.map((option, index) => (
          <button className={`border-white border-solid rounded-md border-2 p-4 m-2 ${order ? 'text-6xl' : ''}`} key={index} onClick={() => checkAnswer(option)}>
            {order?
              option.kanji
              :
              (onyomiChecked && option?.onyomi ? option.onyomi : '') + 
              (kunyomiChecked && option?.kunyomi ? ' / ' + option.kunyomi : '') + 
              (translationChecked && option?.translation ? ' / ' + option.translation : '') 
            }
          </button>
        ))}        
      </div>

    </div>
  );
}