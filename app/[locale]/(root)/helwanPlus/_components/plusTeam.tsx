"use client"
import React from 'react'
import { DirectionAwareHover } from '@/components/ui/direction-aware-hover'
import Image from 'next/image'

const plusTeamData = {
  persone_1: {
    image: "/person.png",
    name: "Hashem mahmoud",
    descirption: "hello im hasdm and here ill write something avout me",
    roleNum: 2,// is the head
    roleName: "head of helwan Plus Team",
  },
  persone_2: {
    image: "/person.png",
    name: "Ammar ahmed",
    descirption: "hello im hasdm and here ill write something avout me",
    roleNum: 1,// is the head
    roleName: "member of helwan plus team",
  },
  persone_3: {
    image: "/person.png",
    name: "maged Ahmed",
    descirption: "hello im hasdm and here ill write something avout me",
    roleNum: 1,// is the head
    roleName: "member of helwan plus team",
  }
}

const plusTeam = () => {
  // this page will have a grid of 3 cards with the image of the team 
  // the card will have a roleNumber the role number will know from it whether its a member or a head 
  // the head card will have margin botton 40 over the other cards
  // the cards will use ths DirectionAwareHover when we use this component effect it wil  display the profile of the person 
  // the profile will have the name a description and roleName 

  const teamMembers = [
    plusTeamData.persone_1,
    plusTeamData.persone_2,
    plusTeamData.persone_3
  ];

  return (
    <section id="team" className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#354eab] mb-6">
            Meet Our Team
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Get to know the passionate individuals behind Helwan Plus
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className={`relative ${member.roleNum === 2 ? 'md:col-span-2 lg:col-span-1 lg:mb-10' : ''}`}
            >
              <DirectionAwareHover imageUrl={member.image}>
                <div className="space-y-2">
                  <h3 className="font-bold text-xl text-white">{member.name}</h3>
                  <p className="font-normal text-sm text-gray-200">{member.roleName}</p>
                  <p className="font-normal text-sm text-gray-300 mt-2">{member.descirption}</p>
                </div>
              </DirectionAwareHover>

              {/* Role Badge */}
              <div className="absolute -top-2 -right-2 z-10">
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${member.roleNum === 2
                  ? 'bg-[#ffce00] text-black'
                  : 'bg-[#354eab] text-white'
                  }`}>
                  {member.roleNum === 2 ? 'Team Lead' : 'Member'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default plusTeam