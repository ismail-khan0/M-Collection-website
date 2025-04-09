'use client';
import React from "react";
import Image from "next/image";

export default function AdBanner() {
    return (
      <div className="flex flex-col md:flex-row items-center bg-gray-100 p-0 md:p-6 rounded-lg">
        <Image
          src="/Image/kid.webp"
          alt="Innerwear Ad"
          className="w-full h-40 md:h-auto md:w-full rounded-lg"
          width={500}
          height={300}
        />
      </div>
    );
  }
  