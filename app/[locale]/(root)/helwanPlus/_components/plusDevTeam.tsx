"use client"
import React from 'react'
import { DirectionAwareHover } from '@/components/ui/direction-aware-hover'

const devTeamData = {
  developer_1: {
    image: "/person.png",
    name: "Ahmed Hassan",
    description: "Full-stack developer with expertise in React, Node.js, and cloud technologies",
    roleNum: 2, // is the lead
    roleName: "Lead Developer",
    skills: ["React", "Node.js", "AWS", "TypeScript"]
  },
  developer_2: {
    image: "/person.png",
    name: "Sarah Mohamed",
    description: "Frontend specialist passionate about creating beautiful and intuitive user experiences",
    roleNum: 1,
    roleName: "Frontend Developer",
    skills: ["React", "Vue.js", "UI/UX", "CSS"]
  },
  developer_3: {
    image: "/person.png",
    name: "Omar Ali",
    description: "Backend engineer focused on scalable architecture and database optimization",
    roleNum: 1,
    roleName: "Backend Developer",
    skills: ["Python", "PostgreSQL", "Docker", "API Design"]
  }
}

const plusDevTeam = () => {
  // this page will have a grid of 3 cards with the image of the team 
  // the card will have a roleNumber the role number will know from it whether its a member or a head 
  // the head card will have margin botton 40 over the other cards
  // the cards will use ths DirectionAwareHover when we use this component effect it wil  display the profile of the person 
  // the profile will have the name a description and roleName 

  const developers = [
    devTeamData.developer_1,
    devTeamData.developer_2,
    devTeamData.developer_3
  ];

  return (
    <section className="py-20 px-4 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#354eab] mb-6">
            Development Team
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            The talented developers behind our innovative solutions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {developers.map((developer, index) => (
            <div
              key={index}
              className={`relative ${developer.roleNum === 2 ? 'md:col-span-2 lg:col-span-1 lg:mb-10' : ''}`}
            >
              <DirectionAwareHover imageUrl={developer.image}>
                <div className="space-y-3">
                  <h3 className="font-bold text-xl text-white">{developer.name}</h3>
                  <p className="font-normal text-sm text-gray-200">{developer.roleName}</p>
                  <p className="font-normal text-sm text-gray-300 mt-2">{developer.description}</p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {developer.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-2 py-1 bg-white/20 text-white text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </DirectionAwareHover>

              {/* Role Badge */}
              <div className="absolute -top-2 -right-2 z-10">
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${developer.roleNum === 2
                  ? 'bg-[#ffce00] text-black'
                  : 'bg-[#354eab] text-white'
                  }`}>
                  {developer.roleNum === 2 ? 'Lead Dev' : 'Developer'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default plusDevTeam