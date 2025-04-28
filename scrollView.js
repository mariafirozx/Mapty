 'use strict';

//  const about_us_page = document.querySelector('.aboutUs');
//  const regLogWrapper = document.querySelector('.wrapper');
const loginSection = document.querySelector('#login');
const aboutUsSection = document.querySelector('#about');



    //create function to navigate between pages
    export const navigateToSection = function() {
        const hash = window.location.hash;
        if(hash == '#about'){
            loginSection.classList.add('hide');
            aboutUsSection.classList.remove('hidden');
            aboutUsSection.scrollIntoView({ behavior: 'smooth' });
            
            
                // regLogWrapper.classList.add('hide');
                // targetSection.classList.remove('hidden');

                // targetSection.scrollIntoView({ behavior: 'smooth' });
                // console.log(hash);
            
        }else{
            aboutUsSection.classList.add('hidden');
            loginSection.classList.remove('hide');
            loginSection.scrollIntoView({ behavior: 'smooth' });
            
            // targetSection.classList.add('hide');
            // loginSection.classList.remove('hidden');
            // loginSection.scrollIntoView({ behavior: 'smooth' });
            // console.log(hash);
        }
    }
    // window.addEventListener('hashchange', navigateToSection);
    

 

 