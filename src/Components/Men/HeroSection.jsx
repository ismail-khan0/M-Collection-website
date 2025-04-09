'use client';

import React from 'react';
import Image from 'next/image';


const HeroSection = ({ image1, image2 }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center mt-10">
      <div className="flex flex-col gap-4 w-full max-w-screen-xl">
        <div className="relative w-full h-[350px] overflow-hidden shadow-md">
          <Image src={image1} alt="Banner 1" fill className="object-cover" />
        </div>
        <div className="relative w-full h-[100px] overflow-hidden">
          <Image src={image2} alt="Banner 2" fill className="object-cover" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;


