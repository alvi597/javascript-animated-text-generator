const textInput = document.getElementById('text-input');
        const animationStyleSelect = document.getElementById('animation-style');
        const fontSizeInput = document.getElementById('font-size');
        const textColorInput = document.getElementById('text-color');
        const durationInput = document.getElementById('duration');
        const staggerInput = document.getElementById('stagger');
        const animateButton = document.getElementById('animate-button');
        const animationCanvas = document.getElementById('animation-canvas');
        const messageBox = document.getElementById('message-box');
        let messageTimeout;

        function showMessage(message, isError = true, duration = 3000) {
            messageBox.textContent = message;
            messageBox.classList.remove('bg-green-500', 'bg-red-600');
            messageBox.classList.add(isError ? 'bg-red-600' : 'bg-green-500');
            
            messageBox.classList.remove('message-enter');
            messageBox.classList.add('message-visible');

            clearTimeout(messageTimeout);
            messageTimeout = setTimeout(() => {
                messageBox.classList.remove('message-visible');
                messageBox.classList.add('message-enter');
            }, duration);
        }

        const decoderChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789*&%$#@!';
        function getRandomChar() {
            return decoderChars[Math.floor(Math.random() * decoderChars.length)];
        }

        function animateText() {
            const text = textInput.value;
            const animationStyle = animationStyleSelect.value;
            const fontSize = fontSizeInput.value + 'px';
            const textColor = textColorInput.value;
            const charDuration = parseInt(durationInput.value) || 500;
            const staggerDelay = parseInt(staggerInput.value) || 80;

            if (!text.trim()) {
                showMessage('Please enter some text to animate.', true);
                return;
            }

            animationCanvas.innerHTML = ''; 
            animationCanvas.style.fontSize = fontSize;
            animationCanvas.style.color = textColor;

            const characters = text.split('');

            characters.forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char;
                if (char === ' ') {
                    span.innerHTML = '&nbsp;'; 
                }
                span.style.opacity = 0; 
                animationCanvas.appendChild(span);

                const delay = index * staggerDelay;

                switch (animationStyle) {
                    case 'fadeInUp':
                        span.animate([
                            { opacity: 0, transform: `translateY(${parseInt(fontSizeInput.value) * 0.5}px)` },
                            { opacity: 1, transform: 'translateY(0px)' }
                        ], {
                            duration: charDuration,
                            delay: delay,
                            fill: 'forwards',
                            easing: 'ease-out'
                        });
                        break;
                    case 'flyInLeft':
                        span.animate([
                            { opacity: 0, transform: `translateX(-${parseInt(fontSizeInput.value) * 0.75}px)` },
                            { opacity: 1, transform: 'translateX(0px)' }
                        ], {
                            duration: charDuration,
                            delay: delay,
                            fill: 'forwards',
                            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                        });
                        break;
                    case 'decoder':
                        span.style.opacity = 1;
                        let cycles = 0;
                        const totalCycles = Math.max(5, Math.floor(charDuration / 80)); 
                        const cycleIntervalTime = charDuration / totalCycles / 1.5; 

                        setTimeout(() => { 
                            const intervalId = setInterval(() => {
                                span.textContent = getRandomChar();
                                cycles++;
                                if (cycles >= totalCycles) {
                                    clearInterval(intervalId);
                                    span.textContent = char === ' ' ? '&nbsp;' : char; 
                                }
                            }, cycleIntervalTime);
                        }, delay);
                        break;
                    case 'typewriter':
                        span.animate([
                            { opacity: 0 },
                            { opacity: 1 }
                        ], {
                            duration: 50,
                            delay: delay,
                            fill: 'forwards',
                            easing: 'step-start'
                        });
                        break;
                    case 'zoomIn':
                        span.animate([
                            { opacity: 0, transform: 'scale(0.5)' },
                            { opacity: 1, transform: 'scale(1)' }
                        ], {
                            duration: charDuration,
                            delay: delay,
                            fill: 'forwards',
                            easing: 'ease-out'
                        });
                        break;
                }
            });
        }

        animateButton.addEventListener('click', animateText);