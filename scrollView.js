 'use strict';

import { supabase } from "./supabaseClient.js";


const loginSection = document.querySelector('#login');
console.log(loginSection);
const aboutUsSection = document.querySelector('#about');
const homeSection = document.querySelector('#home');


    //create function to navigate between pages
    export const navigateToSection = async function() {

        //TRYING 
        // const hash = window.location.hash;
        // const { data: { session } } = await supabase.auth.getSession();
    
        // // Hide all sections first
        // document.querySelector('.logRegPage').classList.add('hide');
        // document.querySelector('.aboutUs').classList.add('hidden');
        // document.querySelector('.main-page').classList.add('hide');
        // document.querySelector('#login').classList.add('hide');
    
        // // Handle navigation based on auth state and hash
        // if (session) {
        //     // Authenticated user
        //     if (hash === '#about') {
        //         document.querySelector('.aboutUs').classList.remove('hidden');
        //     } else {
        //         // Default to home for authenticated users
        //         document.querySelector('.main-page').classList.remove('hide');
        //         if (!hash) window.history.replaceState(null, '', '#home');
        //     }
        // } else {
        //     // Unauthenticated user
        //     if (hash === '#about') {
        //         document.querySelector('.aboutUs').classList.remove('hidden');
        //     } else {
        //         // Default to login for unauthenticated users
        //         document.querySelector('#login').classList.remove('hide');
        //         if (!hash || hash === '#home') window.history.replaceState(null, '', '#login');
        //     }
        // }


        const hash = window.location.hash;

        //hide all sections
        loginSection.classList.add('hide');
        aboutUsSection.classList.add('hidden');
        homeSection.classList.add('hide');

        //check auth state --RESTORE IF
        const { data: { session }, error } = await supabase.auth.getSession();

        // if(session){
        //     if(hash === '#about'){
        //         aboutUsSection.classList.remove('hidden');
        //     }else{
        //         homeSection.classList.remove('hide');
        //        if(!hash) window.history.replaceState(null, '', '#home');
        //     }
        // }else{
        //     if(hash === '#about'){
        //         aboutUsSection.classList.remove('hidden');
        //     }else{
        //         loginSection.classList.remove('hide');
        //         if(!hash) window.history.replaceState(null, '', '#login');
        //     }
        // }

        if(hash === '#about'){
            aboutUsSection.classList.remove('hidden');
            // loginSection.classList.add('hide');
            // aboutUsSection.classList.remove('hidden');
            // homeSection.classList.add('hide');
            aboutUsSection.scrollIntoView({ behavior: 'smooth' });
            
            console.log(hash);
            
                // regLogWrapper.classList.add('hide');
                // targetSection.classList.remove('hidden');

                // targetSection.scrollIntoView({ behavior: 'smooth' });
                // console.log(hash);
            
        }else if(hash === '#home'){
            if(session){
                homeSection.classList.remove('hide');
                console.log(session);
                console.log(hash);
            }else{
                loginSection.classList.remove('hide');
                window.history.replaceState(null, '', '#login');
            }
            // loginSection.classList.add('hide');
            // homeSection.classList.remove('hide');
                
            

        
            // aboutUsSection.classList.add('hide');
            // loginSection.classList.add('hide');
            // homeSection.classList.remove('hidden');
            
            
            // targetSection.classList.add('hide');
            // homeSection.classList.remove('hidden');
            // homeSection.scrollIntoView({ behavior: 'smooth' });
            // console.log(hash);
        }else if(!hash || hash === '#login'){
            loginSection.classList.remove('hide');
            loginSection.style.display = 'block'; // Fallback to ensure visibility
            window.history.replaceState(null, '', '#login');
            // window.history.replaceState(null, '', '#login');
            console.log('navigation to login');
            console.log(hash);

        }else{
            if(session){
                homeSection.classList.remove('hide');
                if(!hash) window.history.replaceState(null, '', '#home');
            }else{
                loginSection.classList.remove('hide');
                if(!hash) window.history.replaceState(null, '', '#login');
            }
            // loginSection.classList.remove('hide');
            // aboutUsSection.classList.add('hide');
            // homeSection.classList.add('hide');
            // loginSection.classList.remove('hide');
            // loginSection.scrollIntoView({ behavior: 'smooth' });
            
            // targetSection.classList.add('hide');
            // loginSection.classList.remove('hidden');
            // loginSection.scrollIntoView({ behavior: 'smooth' });
            // console.log(hash);
        }
}
 

 