// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the page after a short delay to allow for animations
  setTimeout(() => {
    document.body.classList.add('loaded');
    playBootSound();
  }, 2000);
  
  // Update current year in footer
  document.getElementById('current-year').textContent = new Date().getFullYear();
  
  // Set up all event listeners
  setupEventListeners();
  
  // Initialize terminal effects
  initTerminal();
});

// ===== AUDIO FUNCTIONS =====
function playBootSound() {
  const bootSound = document.getElementById('boot-sound');
  bootSound.volume = 0.3;
  bootSound.play().catch(e => console.log('Audio play prevented: ', e));
}

function playClickSound() {
  const clickSound = document.getElementById('click-sound');
  clickSound.volume = 0.2;
  clickSound.currentTime = 0;
  clickSound.play().catch(e => console.log('Audio play prevented: ', e));
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
  // Navigation toggle for mobile
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    playClickSound();
  });
  
  // Close mobile menu when clicking on a link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
      playClickSound();
    });
  });
  
  // Theme toggle functionality
  const themeSwitch = document.getElementById('theme-switch');
  themeSwitch.addEventListener('click', toggleTheme);
  
  // Project card sound effects
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', playClickSound);
  });
  
  // Button sound effects
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('click', playClickSound);
  });
  
  // Form focus effects
  const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
  formInputs.forEach(input => {
    // Set placeholder to empty string to allow label animation
    input.setAttribute('placeholder', ' ');
    
    // Handle label animation for pre-filled inputs
    if (input.value !== '') {
      input.parentElement.querySelector('label').classList.add('active');
    }
    
    input.addEventListener('focus', () => {
      input.parentElement.querySelector('label').classList.add('active');
    });
    
    input.addEventListener('blur', () => {
      if (input.value === '') {
        input.parentElement.querySelector('label').classList.remove('active');
      }
    });
  });
  
  // Form submission
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Here you would normally handle form submission via AJAX
      // For demo purposes, we'll just show a success message
      const formElements = contactForm.elements;
      for (let i = 0; i < formElements.length; i++) {
        if (formElements[i].type !== 'submit') {
          formElements[i].value = '';
          formElements[i].blur();
        }
      }
      
      // Show success message
      const formSuccess = document.createElement('div');
      formSuccess.className = 'form-success';
      formSuccess.textContent = 'Message sent successfully!';
      contactForm.appendChild(formSuccess);
      
      // Remove success message after 3 seconds
      setTimeout(() => {
        formSuccess.remove();
      }, 3000);
    });
  }
  
  // Easter egg trigger
  const easterEggTrigger = document.getElementById('easter-egg-trigger');
  const easterEgg = document.getElementById('easter-egg');
  const secretButtons = document.querySelectorAll('.secret-buttons button');
  
  easterEggTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    easterEgg.classList.add('active');
    playClickSound();
  });
  
  // Close easter egg when clicking outside
  document.addEventListener('click', (e) => {
    if (easterEgg.classList.contains('active') && 
        !easterEgg.contains(e.target) && 
        e.target !== easterEggTrigger) {
      easterEgg.classList.remove('active');
    }
  });
  
  // Secret button functionality
  secretButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      playClickSound();
      
      switch(index) {
        case 0: // Matrix mode
          toggleMatrixEffect();
          break;
        case 1: // Glitch effect
          triggerGlitchEffect();
          break;
        case 2: // Secret sound
          playSecretSound();
          break;
      }
    });
  });
  
  // Mobile Easter Egg: Shake Detection
  if (window.DeviceMotionEvent) {
    let shakeThreshold = 15;
    let lastUpdate = 0;
    let lastX, lastY, lastZ;
    let moveCounter = 0;
    
    window.addEventListener('devicemotion', (e) => {
      let current = e.accelerationIncludingGravity;
      let currentTime = new Date().getTime();
      
      if ((currentTime - lastUpdate) > 100) {
        let diffTime = currentTime - lastUpdate;
        lastUpdate = currentTime;
        
        if (lastX !== undefined) {
          let deltaX = Math.abs(current.x - lastX);
          let deltaY = Math.abs(current.y - lastY);
          let deltaZ = Math.abs(current.z - lastZ);
          
          if (((deltaX > shakeThreshold && deltaY > shakeThreshold) || 
               (deltaX > shakeThreshold && deltaZ > shakeThreshold) || 
               (deltaY > shakeThreshold && deltaZ > shakeThreshold)) && 
              moveCounter < 1) {
            
            moveCounter++;
            
            if (moveCounter >= 1) {
              easterEgg.classList.add('active');
              playClickSound();
              moveCounter = 0;
            }
          }
        }
        
        lastX = current.x;
        lastY = current.y;
        lastZ = current.z;
      }
    });
  }
  
  // Header scroll effects
  window.addEventListener('scroll', handleScroll);
}

// ===== SCROLL FUNCTIONS =====
function handleScroll() {
  const header = document.querySelector('header');
  const scrollPosition = window.scrollY;
  
  // Add scrolled class to header when scrolled
  if (scrollPosition > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  // Auto-hide header when scrolling down
  let lastScrollTop = 0;
  
  if (scrollPosition > 200) {
    if (scrollPosition > lastScrollTop) {
      header.classList.add('hide');
    } else {
      header.classList.remove('hide');
    }
  }
  
  lastScrollTop = scrollPosition <= 0 ? 0 : scrollPosition;
}

// ===== THEME TOGGLE =====
function toggleTheme() {
  const html = document.documentElement;
  
  if (html.getAttribute('data-theme') === 'light') {
    html.removeAttribute('data-theme');
    localStorage.setItem('theme', 'dark');
  } else {
    html.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }
  
  playClickSound();
}

// Check for saved theme preference
function checkThemePreference() {
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  }
}

// Initialize theme on page load
checkThemePreference();

// ===== TERMINAL EFFECTS =====
function initTerminal() {
  const terminalBody = document.querySelector('.terminal-body');
  if (!terminalBody) return;
  
  // Add blinking cursor effect
  const typingLine = document.querySelector('.typing');
  
  // Simulate typing effect
  let commandText = ' echo "Ready to explore more projects?"';
  let charIndex = 0;
  
  function typeCommand() {
    if (charIndex < commandText.length) {
      const currentText = typingLine.textContent;
      typingLine.textContent = currentText + commandText.charAt(charIndex);
      charIndex++;
      setTimeout(typeCommand, Math.random() * 100 + 50);
    } else {
      // After typing completes, add the response
      setTimeout(() => {
        const responseLine = document.createElement('div');
        responseLine.className = 'line';
        responseLine.innerHTML = 'Ready to explore more projects?';
        terminalBody.insertBefore(responseLine, typingLine);
        
        // Start new command line
        setTimeout(() => {
          typingLine.textContent = '$ ';
          charIndex = 0;
          commandText = ' ';
        }, 1000);
      }, 500);
    }
  }
  
  // Start typing effect after a delay
  setTimeout(typeCommand, 2000);
}

// ===== EASTER EGG FUNCTIONS =====
function toggleMatrixEffect() {
  if (document.body.classList.contains('matrix-mode')) {
    document.body.classList.remove('matrix-mode');
    const canvas = document.getElementById('matrix-canvas');
    if (canvas) canvas.remove();
  } else {
    document.body.classList.add('matrix-mode');
    createMatrixCanvas();
  }
}

function createMatrixCanvas() {
  const canvas = document.createElement('canvas');
  canvas.id = 'matrix-canvas';
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  // Matrix characters
  const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
  const columns = canvas.width / 15;
  const drops = [];
  
  // Initialize the drops
  for (let i = 0; i < columns; i++) {
    drops[i] = 1;
  }
  
  // Matrix animation
  function drawMatrix() {
    if (!document.body.classList.contains('matrix-mode')) return;
    
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "#00bcd4";
    ctx.font = "15px monospace";
    
    for (let i = 0; i < drops.length; i++) {
      const text = characters.charAt(Math.floor(Math.random() * characters.length));
      ctx.fillText(text, i * 15, drops[i] * 15);
      
      if (drops[i] * 15 > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      
      drops[i]++;
    }
    
    requestAnimationFrame(drawMatrix);
  }
  
  drawMatrix();
}

function triggerGlitchEffect() {
  document.body.classList.add('glitch-effect');
  
  setTimeout(() => {
    document.body.classList.remove('glitch-effect');
  }, 2000);
}

function playSecretSound() {
  const audio = new Audio('https://cdn.freesound.org/previews/527/527933_6992075-lq.mp3');
  audio.volume = 0.3;
  audio.play().catch(e => console.log('Audio play prevented: ', e));
}

// Mobile detection function
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Special treatment for mobile devices
if (isMobile()) {
  // Add double-tap functionality for certain elements
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    let lastTap = 0;
    
    card.addEventListener('touchend', function(e) {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;
      
      if (tapLength < 300 && tapLength > 0) {
        // Double tap detected
        const randomColors = [
          '#00bcd4', '#ff4081', '#ffeb3b', '#4caf50', '#9c27b0'
        ];
        
        const randomColor = randomColors[Math.floor(Math.random() * randomColors.length)];
        card.style.boxShadow = `0 0 20px ${randomColor}`;
        
        setTimeout(() => {
          card.style.boxShadow = '';
        }, 1000);
        
        e.preventDefault();
      }
      
      lastTap = currentTime;
    });
  });
}