document.addEventListener('DOMContentLoaded', function() {
    const quizSlides = document.querySelectorAll('.quiz-slide');
    let currentSlide = 0;
    
    // Show first slide
    showSlide(currentSlide);
    
    // Auto-advance functionality for questions
    document.querySelectorAll('.auto-next').forEach(radio => {
        radio.addEventListener('change', function() {
            setTimeout(() => {
                currentSlide++;
                showSlide(currentSlide);
            }, 500);
        });
    });
    
    // Next button functionality for reward slides
    document.querySelectorAll('.next-btn').forEach(button => {
        button.addEventListener('click', function() {
            currentSlide++;
            showSlide(currentSlide);
        });
    });
    
    function showSlide(n) {
        // Hide all slides
        quizSlides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Show current slide
        quizSlides[n].classList.add('active');
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const burgerBtn = document.querySelector('.burger-btn');
    const headerMenu = document.querySelector('.header-menu');
    const introBack = document.querySelector('.intro');
    const headerContainer = document.querySelector('.header-container');
    const styleElement = document.createElement('style');
    document.head.appendChild(styleElement);
    
    burgerBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        headerMenu.classList.toggle('active');
        
        
        if (headerMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
            introBack.style.background = 'rgba(165, 157, 227, 1)';
            headerContainer.style.background = 'white';
            styleElement.innerHTML = '.intro::after { display: none !important; }';
        } else {
            document.body.style.overflow = '';
            styleElement.innerHTML = '.intro::after { display: block !important; }';
            introBack.style.background = 'rgba(243, 243, 243, 1)';
            headerContainer.style.background = 'rgba(165, 157, 227, 1)';
          }
    });
    
    
    const menuItems = document.querySelectorAll('.header-menu__item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            burgerBtn.classList.remove('active');
            headerMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
});



