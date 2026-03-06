import React from 'react'
import './PathCard.css'


const PathCard = (props) => {
  return (
    <div className='path-card'>
        <div className="path-card-icon-container">
          {props.icon}
        </div>

        <div className="path-header">
          <span className="path-question">{props.question}</span>
                                <h3>{props.header}</h3>
        </div>

        <p>{props.paragraph}</p>

        <button className="path-card-btn">{props.btntext}</button>
    </div>
  )
}

export default PathCard