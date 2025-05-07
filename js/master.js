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

  // Initialize sharing functionality
  initSharing();
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

  // Project card preview functionality
  const previewModal = document.getElementById('preview-modal');
  const previewFrame = document.getElementById('preview-frame');
  const previewLaunch = document.getElementById('preview-launch');
  const previewClose = document.querySelector('.preview-close');
  const previewTitle = document.querySelector('.preview-title');

  projectCards.forEach(card => {
    const launchBtn = card.querySelector('.btn.primary');
    const projectTitle = card.querySelector('h3').textContent;
    const projectUrl = launchBtn.href;

    // Remove target="_blank" from the launch button
    launchBtn.removeAttribute('target');
    
    launchBtn.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent default navigation
      previewTitle.textContent = projectTitle;
      previewFrame.src = projectUrl;
      previewLaunch.href = projectUrl;
      previewModal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
      playClickSound();
    });
  });

  // Close preview modal
  previewClose.addEventListener('click', () => {
    previewModal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
    previewFrame.src = ''; // Clear iframe source
    playClickSound();
  });

  // Close preview modal when clicking outside
  previewModal.addEventListener('click', (e) => {
    if (e.target === previewModal) {
      previewModal.classList.remove('active');
      document.body.style.overflow = '';
      previewFrame.src = '';
      playClickSound();
    }
  });

  // Close preview modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && previewModal.classList.contains('active')) {
      previewModal.classList.remove('active');
      document.body.style.overflow = '';
      previewFrame.src = '';
      playClickSound();
    }
  });
}

// ===== SCROLL FUNCTIONS =====
let lastScrollTop = 0; // Move this outside the function to persist between scroll events

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
  if (scrollPosition > 200) {
    if (scrollPosition > lastScrollTop) {
      // Scrolling down
      header.classList.add('hide');
    } else {
      // Scrolling up
      header.classList.remove('hide');
    }
  } else {
    // Near the top of the page
    header.classList.remove('hide');
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
  const terminal = document.querySelector('.terminal');
  const terminalBody = document.querySelector('.terminal-body');
  const commandHistory = [];
  let historyIndex = -1;
  let currentInput = null;

  // Clear existing content
  terminalBody.innerHTML = '';

  // Add welcome message and instructions
  addLine('<span class="status-ok">Welcome to Ayman\'s Terminal</span>');
  addLine('');

  // Add initial system check
  addLine(`<span class="prompt">ayman@hub:~$</span> <span class="command">running system_check.sh</span>`);
  addLine('Analyzing system components...');
  addLine('HTML5 ............... <span class="status-ok">OK</span>');
  addLine('CSS3 ................ <span class="status-ok">OK</span>');
  addLine('JavaScript .......... <span class="status-ok">OK</span>');
  addLine('Responsive Design ... <span class="status-ok">OK</span>');
  addLine('SEO Optimization .... <span class="status-ok">OK</span>');
  addLine(`<span class="prompt">ayman@hub:~$</span> <span class="command">echo $USER_STATUS</span>`);
  addLine('<span class="status-ok">ONLINE AND READY FOR PROJECTS</span>');

  // Focus the input when clicking anywhere in the terminal
  terminal.addEventListener('click', () => {
    if (currentInput) {
      currentInput.input.focus();
      terminal.classList.add('active');
    }
  });

  // Handle input
  terminalBody.addEventListener('keydown', (e) => {
    if (!currentInput) return;
    
    const { input, commandInput } = currentInput;
    
    if (e.key === 'Enter') {
      const command = input.value.trim();
      if (command) {
        // Add command to history
        commandHistory.push(command);
        historyIndex = commandHistory.length;

        // Process the command
        processCommand(command);
        
        // Clear input
        input.value = '';
        commandInput.textContent = '';
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        input.value = commandHistory[historyIndex];
        commandInput.textContent = commandHistory[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        input.value = commandHistory[historyIndex];
        commandInput.textContent = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        input.value = '';
        commandInput.textContent = '';
      }
    }
  });

  // Process commands
  function processCommand(command) {
    const commands = {
      help: () => {
        addLine('Available commands:');
        addLine('  help     - Show this help message');
        addLine('  about    - Display information about me');
        addLine('  skills   - List my technical skills');
        addLine('  contact  - Show contact information');
        addLine('  clear    - Clear the terminal');
        addLine('  exit     - Close the terminal');
        addLine('  scan     - Scan system for vulnerabilities');
        addLine('  backup   - Create system backup');
        addLine('  update   - Check for system updates');
        addLine('  profile  - View user profile');
        addLine('  access   - Request elevated permissions');
        currentInput = addInputLine();
      },
      about: () => {
        addLine('I am Ayman M. Khair, a web developer passionate about creating');
        addLine('interactive and user-friendly web experiences.');
        addLine('Currently focused on front-end development and UI/UX design.');
        currentInput = addInputLine();
      },
      skills: () => {
        addLine('💻 Web Development');
        addLine('  • HTML, CSS, JavaScript');
        addLine('  • Responsive Design');
        addLine('  • Tailwind CSS, Bootstrap');
        addLine('  • React, Vue (basic/needs refresh)');
        addLine('');
        addLine('🛠 Tools & Version Control');
        addLine('  • Git & GitHub');
        addLine('  • GitHub Pages');
        addLine('  • Browser DevTools');
        addLine('');
        addLine('🎨 Design & Media');
        addLine('  • Canva');
        addLine('  • Photoshop (intermediate)');
        addLine('  • Figma, Illustrator (basic)');
        addLine('  • DaVinci Resolve (beginner)');
        addLine('  • Adobe Suite (general knowledge)');
        addLine('');
        addLine('🔒 Cybersecurity & Networking');
        addLine('  • Cybersecurity fundamentals');
        addLine('  • Networking basics');
        addLine('  • Nmap (basic usage)');
        addLine('');
        addLine('🧱 Engineering & CAD Software');
        addLine('  • Tekla (learning)');
        addLine('  • AutoCAD (planned)');
        currentInput = addInputLine();
      },
      contact: () => {
        addLine('Contact Information:');
        addLine('  Email: ayman.yaman77777@gmail.com');
        addLine('  Phone: +966502758880');
        addLine('  GitHub: github.com/ayman-121');
        currentInput = addInputLine();
      },
      scan: () => {
        addLine('Initiating system scan...');
        addLine('Requesting permission to access system files...');
        addLine('Type "yes" to grant permission:');
        
        const handleScanResponse = (response) => {
          if (response.toLowerCase() === 'yes') {
            addLine('Permission granted. Starting scan...');
            setTimeout(() => {
              addLine('Scanning system components...');
              setTimeout(() => {
                addLine('Checking file integrity...');
                setTimeout(() => {
                  addLine('Analyzing network connections...');
                  setTimeout(() => {
                    addLine('Scan complete!');
                    addLine('Status: <span class="status-ok">SECURE</span>');
                    addLine('No vulnerabilities detected.');
                    currentInput = addInputLine();
                  }, 1000);
                }, 1000);
              }, 1000);
            }, 1000);
          } else {
            addLine('Permission denied. Scan aborted.');
            currentInput = addInputLine();
          }
        };
        
        currentInput = addInputLine(handleScanResponse);
      },
      backup: () => {
        addLine('Preparing system backup...');
        addLine('This will create a backup of all system files.');
        addLine('Type "confirm" to proceed:');
        
        const handleBackupResponse = (response) => {
          if (response.toLowerCase() === 'confirm') {
            addLine('Backup initiated...');
            setTimeout(() => {
              addLine('Collecting system files...');
              setTimeout(() => {
                addLine('Compressing data...');
                setTimeout(() => {
                  addLine('Creating backup archive...');
                  setTimeout(() => {
                    addLine('Backup complete!');
                    addLine('Backup location: /backups/system_backup_' + new Date().toISOString().slice(0,10));
                    currentInput = addInputLine();
                  }, 1000);
                }, 1000);
              }, 1000);
            }, 1000);
          } else {
            addLine('Backup cancelled.');
            currentInput = addInputLine();
          }
        };
        
        currentInput = addInputLine(handleBackupResponse);
      },
      update: () => {
        addLine('Checking for system updates...');
        setTimeout(() => {
          addLine('Current version: 2.1.0');
          addLine('Checking update servers...');
          setTimeout(() => {
            addLine('New version available: 2.2.0');
            addLine('Type "update" to install:');
            
            const handleUpdateResponse = (response) => {
              if (response.toLowerCase() === 'update') {
                addLine('Starting update process...');
                setTimeout(() => {
                  addLine('Downloading updates...');
                  setTimeout(() => {
                    addLine('Installing updates...');
                    setTimeout(() => {
                      addLine('Update complete! System is now running version 2.2.0');
                      currentInput = addInputLine();
                    }, 1000);
                  }, 1000);
                }, 1000);
              } else {
                addLine('Update cancelled.');
                currentInput = addInputLine();
              }
            };
            
            currentInput = addInputLine(handleUpdateResponse);
          }, 1000);
        }, 1000);
      },
      profile: () => {
        addLine('Accessing user profile...');
        addLine('Requesting permission to view profile data...');
        addLine('Type "allow" to proceed:');
        
        const handleProfileResponse = (response) => {
          if (response.toLowerCase() === 'allow') {
            addLine('Permission granted. Loading profile...');
            setTimeout(() => {
              addLine('User Profile:');
              addLine('  Name: Ayman M. Khair');
              addLine('  Role: Web Developer');
              addLine('  Experience: 2+ years');
              addLine('  Location: Saudi Arabia');
              addLine('  Status: Active');
              addLine('  Last Login: ' + new Date().toLocaleString());
              currentInput = addInputLine();
            }, 1000);
          } else {
            addLine('Access denied.');
            currentInput = addInputLine();
          }
        };
        
        currentInput = addInputLine(handleProfileResponse);
      },
      access: () => {
        addLine('Requesting elevated permissions...');
        addLine('This will grant temporary admin access.');
        addLine('Type "sudo" to proceed:');
        
        const handleAccessResponse = (response) => {
          if (response.toLowerCase() === 'sudo') {
            addLine('Verifying credentials...');
            setTimeout(() => {
              addLine('Access granted!');
              addLine('Elevated permissions active for 5 minutes.');
              addLine('Type "exit" to return to normal mode.');
              currentInput = addInputLine();
            }, 1000);
          } else {
            addLine('Access denied. Invalid credentials.');
            currentInput = addInputLine();
          }
        };
        
        currentInput = addInputLine(handleAccessResponse);
      },
      clear: () => {
        terminalBody.innerHTML = '';
        currentInput = addInputLine();
      },
      exit: () => {
        addLine('Closing terminal...');
        setTimeout(() => {
          terminal.style.display = 'none';
        }, 1000);
      }
    };

    // Add the command to the terminal
    addLine(`<span class="prompt">ayman@hub:~$</span> <span class="command">${command}</span>`);

    // Process the command
    if (commands[command]) {
      commands[command]();
    } else {
      addLine(`Command not found: ${command}`);
      addLine('Type "help" for available commands');
      currentInput = addInputLine();
    }
  }

  // Add a line to the terminal
  function addLine(content) {
    const line = document.createElement('div');
    line.className = 'line';
    line.innerHTML = content;
    terminalBody.appendChild(line);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  // Add input line with response handler
  function addInputLine(responseHandler) {
    // Remove any existing input line
    const existingInput = terminalBody.querySelector('.terminal-input');
    if (existingInput) {
      existingInput.parentElement.remove();
    }

    const line = document.createElement('div');
    line.className = 'line';
    line.innerHTML = `
      <span class="prompt">ayman@hub:~$</span>
      <span class="command-input"></span>
      <input type="text" class="terminal-input" autofocus>
    `;
    terminalBody.appendChild(line);
    terminalBody.scrollTop = terminalBody.scrollHeight;
    
    const input = line.querySelector('.terminal-input');
    const commandInput = line.querySelector('.command-input');
    
    // Focus and show cursor immediately
    input.focus();
    terminal.classList.add('active');
    
    // Handle input
    input.addEventListener('input', (e) => {
      commandInput.textContent = e.target.value;
      // Update cursor position
      const cursor = commandInput.querySelector('::after');
      if (cursor) {
        cursor.style.left = `${commandInput.offsetWidth}px`;
      }
    });

    // Handle focus/blur
    input.addEventListener('focus', () => {
      terminal.classList.add('active');
    });

    input.addEventListener('blur', () => {
      if (!terminal.matches(':hover')) {
        terminal.classList.remove('active');
      }
    });

    // Handle response if provided
    if (responseHandler) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          responseHandler(input.value);
          input.value = '';
          commandInput.textContent = '';
        }
      });
    } else {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const command = input.value.trim();
          if (command) {
            commandHistory.push(command);
            historyIndex = commandHistory.length;
            processCommand(command);
            input.value = '';
            commandInput.textContent = '';
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (historyIndex > 0) {
            historyIndex--;
            input.value = commandHistory[historyIndex];
            commandInput.textContent = commandHistory[historyIndex];
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            input.value = commandHistory[historyIndex];
            commandInput.textContent = commandHistory[historyIndex];
          } else {
            historyIndex = commandHistory.length;
            input.value = '';
            commandInput.textContent = '';
          }
        }
      });
    }
    
    return { input, commandInput };
  }

  // Initial input line
  currentInput = addInputLine();
}

// Initialize terminal when the about section is in view
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      initTerminal();
      const terminal = document.querySelector('.terminal');
      const currentInput = document.querySelector('.terminal-input');
      if (terminal && currentInput) {
        terminal.classList.add('active');
        currentInput.focus();
      }
    } else {
      const terminal = document.querySelector('.terminal');
      if (terminal) {
        terminal.classList.remove('active');
      }
    }
  });
}, { threshold: 0.5 });

const aboutSection = document.querySelector('#about');
if (aboutSection) {
  observer.observe(aboutSection);
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

// ===== SHARING FUNCTIONALITY =====
function initSharing() {
    const shareButtons = document.querySelectorAll('.share-btn');
    const shareModal = document.getElementById('share-modal');
    const shareUrl = document.getElementById('share-url');
    const closeShare = document.querySelector('.close-share');
    const copyUrl = document.querySelector('.copy-url');
    const shareOptions = document.querySelectorAll('.share-option');

    // Open share modal with loading state
    shareButtons.forEach(button => {
        button.addEventListener('click', () => {
            const url = button.dataset.url;
            const project = button.dataset.project;
            const projectCard = button.closest('.project-card');
            const projectDesc = projectCard.querySelector('p').textContent;
            const projectImage = projectCard.querySelector('img').src;
            
            // Show loading state
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            // Update share URL with project info
            const shareData = {
                url: url,
                title: project,
                description: projectDesc,
                image: projectImage
            };
            
            shareUrl.value = url;
            shareUrl.dataset.shareData = JSON.stringify(shareData);
            shareModal.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Reset button after animation
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-share-alt"></i>';
            }, 500);
        });
    });

    // Close share modal with animation
    closeShare.addEventListener('click', () => {
        shareModal.classList.remove('active');
        setTimeout(() => {
            document.body.style.overflow = '';
        }, 300);
    });

    // Close on outside click with animation
    shareModal.addEventListener('click', (e) => {
        if (e.target === shareModal) {
            shareModal.classList.remove('active');
            setTimeout(() => {
                document.body.style.overflow = '';
            }, 300);
        }
    });

    // Enhanced copy URL with better feedback
    copyUrl.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(shareUrl.value);
            copyUrl.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyUrl.classList.add('success');
            
            // Show success tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'copy-tooltip';
            tooltip.textContent = 'URL copied to clipboard!';
            copyUrl.appendChild(tooltip);
            
            setTimeout(() => {
                copyUrl.innerHTML = '<i class="fas fa-copy"></i> Copy';
                copyUrl.classList.remove('success');
                tooltip.remove();
            }, 2000);
        } catch (err) {
            copyUrl.innerHTML = '<i class="fas fa-times"></i> Failed';
            copyUrl.classList.add('error');
            setTimeout(() => {
                copyUrl.innerHTML = '<i class="fas fa-copy"></i> Copy';
                copyUrl.classList.remove('error');
            }, 2000);
        }
    });

    // Enhanced social media sharing
    shareOptions.forEach(option => {
        option.addEventListener('click', async () => {
            const platform = option.dataset.platform;
            const shareData = JSON.parse(shareUrl.dataset.shareData);
            const { url, title, description, image } = shareData;
            
            // Show loading state
            const originalContent = option.innerHTML;
            option.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sharing...';
            option.disabled = true;

            try {
                // Create platform-specific share messages
                const shareMessages = {
                    twitter: `🚀 Check out "${title}"\n\n${description}\n\n${url}`,
                    facebook: `🌟 Discover "${title}"\n\n${description}\n\n${url}`,
                    linkedin: `💼 Professional Project: "${title}"\n\n${description}\n\n${url}`,
                    whatsapp: `📱 Take a look at "${title}"\n\n${description}\n\n${url}`,
                    telegram: `🔗 Check out "${title}"\n\n${description}\n\n${url}`
                };

                const shareMessage = shareMessages[platform] || `Check out "${title}" - ${description}\n\n${url}`;
                let shareUrl;

                switch (platform) {
                    case 'twitter':
                        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`;
                        break;
                    case 'facebook':
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(shareMessage)}`;
                        break;
                    case 'instagram':
                        // Enhanced Instagram sharing with better UI
                        const instagramText = `✨ ${title}\n\n${description}\n\n🔗 Visit: ${url}`;
                        try {
                            await navigator.clipboard.writeText(instagramText);
                            const instagramModal = document.createElement('div');
                            instagramModal.className = 'instagram-share-modal';
                            instagramModal.innerHTML = `
                                <div class="instagram-share-content">
                                    <h3><i class="fab fa-instagram"></i> Ready to Share on Instagram</h3>
                                    <p>The project details have been copied to your clipboard!</p>
                                    <div class="instagram-steps">
                                        <div class="step">
                                            <i class="fas fa-plus-circle"></i>
                                            <p>Create a new Instagram post</p>
                                        </div>
                                        <div class="step">
                                            <i class="fas fa-paste"></i>
                                            <p>Paste the copied text</p>
                                        </div>
                                        <div class="step">
                                            <i class="fas fa-image"></i>
                                            <p>Add a screenshot or image</p>
                                        </div>
                                        <div class="step">
                                            <i class="fas fa-share"></i>
                                            <p>Share with your followers</p>
                                        </div>
                                    </div>
                                    <button class="close-instagram-share">Got it!</button>
                                </div>
                            `;
                            document.body.appendChild(instagramModal);
                            setTimeout(() => instagramModal.classList.add('active'), 100);
                            
                            instagramModal.querySelector('.close-instagram-share').addEventListener('click', () => {
                                instagramModal.classList.remove('active');
                                setTimeout(() => instagramModal.remove(), 300);
                            });
                        } catch (err) {
                            console.error('Failed to copy text: ', err);
                            alert('Failed to copy text. Please try again.');
                        }
                        break;
                    case 'linkedin':
                        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`;
                        break;
                    case 'whatsapp':
                        shareUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
                        break;
                    case 'telegram':
                        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareMessage)}`;
                        break;
                }

                if (shareUrl) {
                    const shareWindow = window.open(shareUrl, '_blank', 'width=600,height=400');
                    
                    // Check if popup was blocked
                    if (!shareWindow) {
                        throw new Error('Popup blocked');
                    }
                }
            } catch (error) {
                console.error('Sharing failed:', error);
                // Show error state
                option.innerHTML = '<i class="fas fa-times"></i> Failed';
                option.classList.add('error');
                
                // Show error tooltip
                const tooltip = document.createElement('div');
                tooltip.className = 'share-tooltip';
                tooltip.textContent = 'Sharing failed. Please try again.';
                option.appendChild(tooltip);
                
                setTimeout(() => {
                    option.innerHTML = originalContent;
                    option.classList.remove('error');
                    tooltip.remove();
                    option.disabled = false;
                }, 2000);
            } finally {
                // Reset button state after a delay
                setTimeout(() => {
                    option.innerHTML = originalContent;
                    option.disabled = false;
                }, 1000);
            }
        });
    });
}