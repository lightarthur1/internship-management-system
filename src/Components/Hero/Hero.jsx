import React from 'react'
import './Hero.css'
import {ArrowRight} from 'lucide-react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

const Hero = () => {

  const navigate = useNavigate();

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

        
           <Link to={'/signup'}
           className='btn btn-primary'
           >Get Started <span><ArrowRight color="#fff"/></span></Link>
      

     
           <Link to={'/login'}
           className='btn btn-secondary'>Sign in
           </Link>
            
         </div>
     
      </div>

    </div>
  )
}

export default Hero