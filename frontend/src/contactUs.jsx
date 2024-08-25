import React, { useEffect } from 'react';
import { gsap } from 'gsap';

const ContactUs = () => {
  useEffect(() => {
    // GSAP animation for dropping elements on page load
    gsap.from('.contact-item', {
      y: -50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'bounce.out',
    });

    // Cursor movement effect
    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;
      const container = document.querySelector('.contact-container');

      const moveX = (clientX / window.innerWidth) * 30 - 15;
      const moveY = (clientY / window.innerHeight) * 30 - 15;

      gsap.to(container, {
        x: moveX,
        y: moveY,
        duration: 0.5,
        ease: 'power3.out',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="p-8 bg-gradient-to-r from-blue-500 to-purple-500 min-h-screen flex items-center justify-center">
      <div className="contact-container bg-white bg-opacity-20 p-10 rounded-lg shadow-xl backdrop-blur-sm">
        <h1 className="text-3xl font-extrabold mb-8 text-white tracking-wide">Contact Us</h1>
        <p className="text-white text-lg mb-6">If you have any questions or need assistance, please reach out to us using the contact details below:</p>
        <div className="mt-4 contact-item">
          <p className="font-semibold text-white text-xl">Email:</p>
          <p className="text-white mb-4">
            <a href="mailto:btech10544.22@bitmesra.ac.in" className="underline hover:text-yellow-300">
              btech10544.22@bitmesra.ac.in
            </a>
          </p>
        </div>
        <div className="mt-4 contact-item">
          <p className="font-semibold text-white text-xl">Phone:</p>
          <p className="text-white mb-4">9424054035</p>
        </div>
        <div className="mt-4 contact-item">
          <p className="font-semibold text-white text-xl">Address:</p>
          <p className="text-white">BIt Mesra Ranchi, Jharkhand</p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
