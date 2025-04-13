 'use strict';

 const about_us_page = document.querySelector('.aboutUs');
 const regLogWrapper = document.querySelector('.wrapper');



    //create function to navigate between pages
    export const navigateToSection = function() {
        const hash = window.location.hash;
        if(hash){
            const targetSection = document.querySelector(hash);
            if(targetSection){
                regLogWrapper.classList.add('hide');
                targetSection.classList.remove('hidden');

                targetSection.scrollIntoView({ behavior: 'smooth' });
                console.log(hash);
            }
        }
    }
    // window.addEventListener('hashchange', navigateToSection);
    

 

 