import React from 'react'
import { PlusAbout, PlusAchivments, PlusDevHero, PlusDevTeam, PlusHero, PlusTeam } from './_components'
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect'

const HelwanPlusPage = () => {
    // we need to use here the BackgroundRippleEffect so the page be more modern and attractive   
    return (
        <div className="relative min-h-screen w-full overflow-hidden !bg-white">
            <BackgroundRippleEffect
                rows={6}
                cols={20}
                cellSize={60}
                lightMode={true}
            />
            <div className="relative z-10">
                <div id='helwan_plus'>
                    <PlusHero />
                    <PlusAbout />
                    <PlusTeam />
                    <PlusAchivments />
                </div>
                <div id='dev_team'>
                    <PlusDevHero />
                    <PlusDevTeam />
                </div>
            </div>
        </div>
    )
}

export default HelwanPlusPage