"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

const plusAboutData = {
  title: 'About Us',
  description: 'Helwan Plus is a team of developers who are passionate about building innovative solutions for the Helwan community.',
  imageUrl: '/images/gallery/2.jpg',
  button: {
    label: 'Meet Our Team',
    href: '#team',
  },
}

const plusAbout = () => {
  // this page will have two colms with the 50% hight of the screen the right colm is the pic and in the left col we will have about it 
  // based on the local the image will be on the left or on the right 
  // the content will has a title and a description and we will have action button for meet our team 

  return (
    <section id="about" className="py-20 px-4 bg-white ">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[50vh]">
          {/* Content Column */}
          <div className="space-y-8 order-2 lg:order-1">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-[#354eab] leading-tight">
                {plusAboutData.title}
              </h2>
              <p className="text-lg md:text-xl text-black! leading-relaxed">
                {plusAboutData.description}
              </p>
            </div>

            <div className="pt-4">
              <Button
                size="lg"
                className="bg-[#ffce00] hover:bg-[#ffce00]/90 text-black font-semibold px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105"
                onClick={() => {
                  const element = document.querySelector(plusAboutData.button.href);
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {plusAboutData.button.label}
              </Button>
            </div>
          </div>

          {/* Image Column */}
          <div className="order-1 lg:order-2">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-[4/3] relative">
                <Image
                  src={plusAboutData.imageUrl}
                  alt="Helwan Plus Team"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default plusAbout