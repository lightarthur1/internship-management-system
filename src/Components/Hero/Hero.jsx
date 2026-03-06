import React from 'react'
import './Hero.css'
import {ArrowRight} from 'lucide-react'

const Hero = () => {
  return (
    <div className='hero'>
      <div className='hero-content'>
        <h1 className='hero-title'>Empowering the next generation of 
          <span> Professionals</span>
        </h1>

         <p className='hero-subtitle'>
                       A scalable platform for managing internships.
                        Connect students, supervisors, and administrators with ease.
         </p>

         <div className='hero-buttons'>
           <button className='btn btn-primary'>Get Started <span><ArrowRight color="#fff"/></span></button>
           <button className='btn btn-secondary'>Sign in</button>
         </div>
      </div>

    </div>
  )
}

export default Hero