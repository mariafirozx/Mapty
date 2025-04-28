'use strict';

document.addEventListener('DOMContentLoaded', function () {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry=>{
            if(entry.isIntersecting){
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }


        });
    }, {
        threshold: 0.1
    });
    document.querySelectorAll('.scroll-animate').forEach((element) => {
        observer.observe(element);
    });

});