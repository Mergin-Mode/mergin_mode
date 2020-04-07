import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
 
export default function Slider (props) {
    const onClick = (e,src) => {
        e.stopPropagation();
        props.onClick(src)
    }
        return (
            <Carousel centerMode centerSlidePercentage={33} emulateTouch>
                {
                    props.slides.map(slide=>{
                        return (
                            <div>
                                <img src={slide.src} className="mm-image mm-slider-img"/>
                                <p className="legend mm-btn" onClick={e=>onClick(e,slide.src)}>Use {slide.legend}</p>
                            </div>
                        )
                    })
                }
                

            </Carousel>
        );
};