// Animations JavaScript for CyberSecurity Hub

// Ensure animations start immediately
window.onload = function() {
    // Forcefully remove loading screen after a short delay
    setTimeout(function() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.transition = 'opacity 0.5s ease';
            
            setTimeout(function() {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 800); // Shorter delay for better user experience
};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize matrix animation
    createMatrixAnimation();
    
    // Add floating animation to certain elements
    const floatingElements = document.querySelectorAll('.ai-icon, .card-icon, .tool-icon');
    floatingElements.forEach(element => {
        element.classList.add('floating');
    });
    
    // Add glitch effect to security-related elements
    addGlitchEffect();
    
    // Network nodes animation
    initNetworkNodes();
    
    // Initialize custom cursor effect
    initCustomCursor();
    
    // Add particle effects
    addParticleEffect();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Create some pre-loaded particles for instant visual feedback
    createInitialParticles();
});

// Add glitch effect to elements
function addGlitchEffect() {
    const securityElements = document.querySelectorAll('.hero h1, .scanner-tool, h3');
    
    // Immediately apply glitch to one element
    if (securityElements.length > 0) {
        const randomIndex = Math.floor(Math.random() * securityElements.length);
        const element = securityElements[randomIndex];
        element.classList.add('glitch-effect');
        
        setTimeout(() => {
            element.classList.remove('glitch-effect');
        }, 1000);
    }
    
    // Continue with random glitch effects
    setInterval(() => {
        if (securityElements.length > 0) {
            const randomElement = securityElements[Math.floor(Math.random() * securityElements.length)];
            randomElement.classList.add('glitch-effect');
            
            setTimeout(() => {
                randomElement.classList.remove('glitch-effect');
            }, 1000);
        }
    }, 5000);
}

// Create some initial particles for instant visual appeal
function createInitialParticles() {
    const mainContainer = document.querySelector('body');
    if (!mainContainer) return;
    
    // Create particles at strategic positions
    const positions = [
        { x: window.innerWidth * 0.2, y: window.innerHeight * 0.3 },
        { x: window.innerWidth * 0.8, y: window.innerHeight * 0.2 },
        { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 },
        { x: window.innerWidth * 0.3, y: window.innerHeight * 0.7 },
        { x: window.innerWidth * 0.7, y: window.innerHeight * 0.6 }
    ];
    
    positions.forEach(pos => {
        createParticles(pos.x, pos.y);
    });
}

// Initialize scroll animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    // Function to check if elements are in view
    const checkIfInView = function() {
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('is-visible');
            }
        });
    };
    
    // Run on initial load
    checkIfInView();
    
    // Run on scroll
    window.addEventListener('scroll', checkIfInView);
}

// Create Matrix-like animation in the background
function createMatrixAnimation() {
    const matrixContainer = document.querySelector('.hero');
    
    if (!matrixContainer) return;
    
    const matrixAnimation = document.createElement('div');
    matrixAnimation.className = 'matrix-animation';
    matrixContainer.appendChild(matrixAnimation);
    
    const canvas = document.createElement('canvas');
    matrixAnimation.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = matrixAnimation.offsetWidth || window.innerWidth;
    canvas.height = matrixAnimation.offsetHeight || 300;
    
    // Characters for the matrix effect
    const chars = '01';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    
    // Position for each column
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }
    
    // Drawing the matrix effect
    function drawMatrix() {
        ctx.fillStyle = 'rgba(10, 25, 47, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#64ffda';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            drops[i]++;
        }
    }
    
    // Animation loop
    setInterval(drawMatrix, 120);
    
    // Resize handler
    window.addEventListener('resize', function() {
        canvas.width = matrixAnimation.offsetWidth || window.innerWidth;
        canvas.height = matrixAnimation.offsetHeight || 300;
    });
}

// Initialize network nodes animation
function initNetworkNodes() {
    const networkContainer = document.querySelector('.network-animation');
    
    if (!networkContainer) return;
    
    // Create nodes
    const nodeCount = 30;
    for (let i = 0; i < nodeCount; i++) {
        createNode(networkContainer);
    }
    
    // Create connections between nodes
    const nodes = document.querySelectorAll('.network-node');
    createConnections(nodes, networkContainer);
}

// Create a network node
function createNode(container) {
    const node = document.createElement('div');
    node.className = 'network-node';
    
    // Random position
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    
    node.style.left = `${posX}%`;
    node.style.top = `${posY}%`;
    
    // Random size
    const size = 4 + Math.random() * 4;
    node.style.width = `${size}px`;
    node.style.height = `${size}px`;
    
    // Apply styles
    node.style.position = 'absolute';
    node.style.backgroundColor = 'rgba(100, 255, 218, 0.7)';
    node.style.borderRadius = '50%';
    node.style.boxShadow = '0 0 5px rgba(100, 255, 218, 0.7)';
    
    // Store position data
    node.dataset.x = posX;
    node.dataset.y = posY;
    
    container.appendChild(node);
    
    // Add floating animation
    const duration = 10 + Math.random() * 10;
    node.style.animation = `float ${duration}s ease-in-out infinite`;
    node.style.animationDelay = `${Math.random() * 5}s`;
}

// Create connections between nodes
function createConnections(nodes, container) {
    if (!nodes.length) return;
    
    // Create SVG for connections
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('network-connections');
    svg.style.position = 'absolute';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.pointerEvents = 'none';
    container.appendChild(svg);
    
    // Connect some nodes
    for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        
        // Connect to 1-3 other nodes
        const connectionCount = 1 + Math.floor(Math.random() * 3);
        
        for (let j = 0; j < connectionCount; j++) {
            // Find a random node to connect to
            const nodeB = nodes[Math.floor(Math.random() * nodes.length)];
            
            if (nodeA !== nodeB) {
                const x1 = parseFloat(nodeA.dataset.x);
                const y1 = parseFloat(nodeA.dataset.y);
                const x2 = parseFloat(nodeB.dataset.x);
                const y2 = parseFloat(nodeB.dataset.y);
                
                // Calculate distance
                const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                
                // Only connect if within reasonable distance
                if (distance < 30) {
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', `${x1}%`);
                    line.setAttribute('y1', `${y1}%`);
                    line.setAttribute('x2', `${x2}%`);
                    line.setAttribute('y2', `${y2}%`);
                    line.setAttribute('stroke', 'rgba(100, 255, 218, 0.2)');
                    line.setAttribute('stroke-width', '1');
                    
                    svg.appendChild(line);
                }
            }
        }
    }
}

// Add custom cursor effect
function initCustomCursor() {
    // Create cursor elements
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.position = 'fixed';
    cursor.style.width = '30px';
    cursor.style.height = '30px';
    cursor.style.borderRadius = '50%';
    cursor.style.border = '2px solid var(--secondary-color)';
    cursor.style.pointerEvents = 'none';
    cursor.style.transform = 'translate(-50%, -50%)';
    cursor.style.zIndex = '9999';
    cursor.style.transition = 'width 0.2s, height 0.2s, background-color 0.2s';
    document.body.appendChild(cursor);
    
    const cursorInner = document.createElement('div');
    cursorInner.className = 'cursor-inner';
    cursorInner.style.position = 'absolute';
    cursorInner.style.width = '5px';
    cursorInner.style.height = '5px';
    cursorInner.style.borderRadius = '50%';
    cursorInner.style.backgroundColor = 'var(--secondary-color)';
    cursorInner.style.top = '50%';
    cursorInner.style.left = '50%';
    cursorInner.style.transform = 'translate(-50%, -50%)';
    cursor.appendChild(cursorInner);
    
    // Track mouse movement
    document.addEventListener('mousemove', function(e) {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        cursor.style.opacity = '1';
    });
    
    // Add hover effect
    const hoverElements = document.querySelectorAll('a, button, .card, .tool-item, .tool-box, .tool-btn');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            cursor.style.width = '50px';
            cursor.style.height = '50px';
            cursor.style.backgroundColor = 'rgba(100, 255, 218, 0.1)';
        });
        
        element.addEventListener('mouseleave', function() {
            cursor.style.width = '30px';
            cursor.style.height = '30px';
            cursor.style.backgroundColor = 'transparent';
        });
    });
    
    // Add click effect
    document.addEventListener('mousedown', function() {
        cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px) scale(0.9)`;
    });
    
    document.addEventListener('mouseup', function() {
        cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px) scale(1)`;
    });
    
    // Hide cursor when mouse leaves window
    document.addEventListener('mouseleave', function() {
        cursor.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', function() {
        cursor.style.opacity = '1';
    });
}

// Add particle effect for interactive elements
function addParticleEffect() {
    const interactiveElements = document.querySelectorAll('.btn, .card, .tool-btn');
    
    interactiveElements.forEach(element => {
        element.addEventListener('click', function(e) {
            createParticles(e.clientX, e.clientY);
        });
    });
}

// Create particles at coordinates
function createParticles(x, y) {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    particleContainer.style.position = 'fixed';
    particleContainer.style.left = `${x}px`;
    particleContainer.style.top = `${y}px`;
    particleContainer.style.pointerEvents = 'none';
    particleContainer.style.zIndex = '9998';
    document.body.appendChild(particleContainer);
    
    // Create particles
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position offset
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 3;
        const size = 5 + Math.random() * 5;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = '#64ffda';
        particle.style.borderRadius = '50%';
        particle.style.position = 'absolute';
        particle.style.left = '0';
        particle.style.top = '0';
        particle.style.opacity = '1';
        particle.style.transform = 'translate(-50%, -50%)';
        
        particleContainer.appendChild(particle);
        
        // Animate the particle
        const deltaX = Math.cos(angle) * speed;
        const deltaY = Math.sin(angle) * speed;
        
        let posX = 0;
        let posY = 0;
        let opacity = 1;
        let frame = 0;
        
        function animateParticle() {
            frame++;
            posX += deltaX;
            posY += deltaY;
            opacity -= 0.02;
            
            if (opacity <= 0) {
                particle.remove();
                if (particleContainer.childElementCount === 0) {
                    particleContainer.remove();
                }
                return;
            }
            
            particle.style.transform = `translate(${posX}px, ${posY}px) scale(${1 - frame/60})`;
            particle.style.opacity = opacity;
            
            requestAnimationFrame(animateParticle);
        }
        
        requestAnimationFrame(animateParticle);
    }
}
