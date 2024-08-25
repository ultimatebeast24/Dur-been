import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AboutUs = () => {
  const companyNameRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    // Animate company name from left
    gsap.fromTo(
      companyNameRef.current,
      { x: '-100%', opacity: 0 },
      { x: '0%', opacity: 1, duration: 1.5, ease: 'power3.out' }
    );

    // Animate cards
    cardsRef.current.forEach((card, index) => {
      gsap.fromTo(
        card,
        { y: '50px', opacity: 0 },
        {
          y: '0',
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom-=100',
            end: 'bottom center',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    // Smooth scrolling
    gsap.to(window, { duration: 0, scrollBehavior: 'smooth' });
  }, []);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const moveX = clientX - window.innerWidth / 2;
    const moveY = clientY - window.innerHeight / 2;
    gsap.to(companyNameRef.current, {
      x: moveX * 0.05,
      y: moveY * 0.05,
      duration: 0.5,
    });
  };

  const cardData = [
    { 
      title: 'Smart Bin Monitoring System', 
      description: 'This component involves using hardware such as the Arduino Uno, ultrasonic sensors, and the ESP32 module to monitor the waste levels in bins. The system tracks the fill level of each bin and sends real-time data to a central server. The collected data is then used to alert users if a bin is full and needs to be emptied. This cost-effective system is designed to be implemented across city bins for efficient waste management.',
      image: 'https://hackster.imgix.net/uploads/attachments/360840/fill-level-sensor_Vsdbc9ErZr.png?auto=compress&w=900&h=675&fit=min&fm=jpg'
    },
    { 
      title: 'Optimized Route Planning for Waste Collection', 
      description: 'This component focuses on optimizing the routes for waste collection trucks. By utilizing the data from the Smart Bin Monitoring System, the software calculates the shortest and most efficient path for the trucks based on the current waste levels in the bins. This ensures that only the bins that are nearing capacity are serviced, saving time and reducing fuel consumption.',
      image: 'https://risanb.com/code/colorful-google-maps-marker/default-marker.jpg'
    },
    { 
      title: 'User Interface for Nearest Bin Location', 
      description: 'The system provides a user-friendly interface where users can easily find the nearest bin locations. This feature helps users locate the closest bin to dispose of their waste and informs them if the bin is full or available. The interface is designed to enhance convenience and encourage proper waste disposal practices among the public.',
      image: 'https://media.licdn.com/dms/image/D5612AQE4yCRHQM7cWQ/article-cover_image-shrink_720_1280/0/1671560612527?e=2147483647&v=beta&t=9jovS6yOCpU3dSMY8kyzGFW_NAIsW_tXR8Jzd54pFPE'
    },
    { 
      title: 'Waste Segregation and Data Analysis', 
      description: 'This key component involves integrating a camera inside each bin to capture images of the waste. The captured images are processed to segregate waste based on predefined categories. The data gathered from this process is valuable for companies as it provides insights into waste generation patterns, which can be used for sales and marketing strategies. This feature adds a significant layer of intelligence to the waste management system.',
      image: 'https://th-i.thgim.com/public/news/cities/mumbai/7c5dzq/article52590490.ece/alternates/FREE_1200/Mumbai%20Matters%203jpg1'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
      <h1
        ref={companyNameRef}
        onMouseMove={handleMouseMove}
        className="text-6xl font-bold text-gray-800 mb-12 cursor-default"
      >
        Door-Bin
      </h1>
      <div className="space-y-8">
        {cardData.map((card, index) => (
          <div
            key={index}
            ref={(el) => (cardsRef.current[index] = el)}
            className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2"
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{card.title}</h2>
                <p className="text-gray-600">{card.description}</p>
              </div>
              <div className="md:w-1/2 bg-gray-100 h-64 md:h-auto flex items-center justify-center overflow-hidden">
                <img
                  src={card.image}
                  alt={`${card.title} image`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;