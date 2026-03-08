import React from 'react'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Banner = () => {

    const settings = {
        fade: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,        // Enable autoplay
        autoplaySpeed: 2000, 
        arrows:false
      };

  return (
    <div style={{marginTop:"10px"}}>
        <div className='class2' style={{marginLeft:"260px"}}>
    <Slider {...settings} >
      <div>
      <img
            src="https://www.oyorooms.com/blog/wp-content/uploads/2017/10/Feature-Image-min-2-1.jpg"
            alt="First slide"
            style={{ width: '1000px', height: '350px',marginBottom:"10px" }}
          />
      </div>
      <div>
      <img
            src="https://d2al04l58v9bun.cloudfront.net/blog/wp-content/uploads/2022/07/20122054/Indian-Temple-Architecture-With-The-Most-Amazing-Stories.jpg"
            alt="Second slide"
            style={{ width: '1000px', height: '350px',marginBottom:"10px"  }}
          />
      </div>
      <div>
      <img
            src="https://blogs.revv.co.in/blogs/wp-content/uploads/2020/11/Somnath-Temple.jpg"
            alt="Third slide"
            style={{ width: '1000px', height: '350px',marginBottom:"10px" }}
          />
      </div>
      <div>
      <img
            src="https://img.veenaworld.com/wp-content/uploads/2021/02/10-Famous-South-Indian-Temples-You-Should-Not-Miss.jpg"
            alt="Third slide"
            style={{ width: '1000px', height: '350px',marginBottom:"10px"  }}
          />
      </div>
      
      {/* Add more slides as needed */}
    </Slider>
    </div>
    <div className='class3'>
    <div className="marquee-container">
      <div className="marquee-text">
        <p>Book your tickets for Temple Darshan now! Limited slots available. Don't miss the divine experience.</p>
      </div>
    
    </div>
    </div>
    </div>
  )
}

export default Banner