// Main JavaScript for CyberSecurity Hub

document.addEventListener('DOMContentLoaded', function() {
    // Remove loading screen after page loads
    setTimeout(function() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.transition = 'opacity 0.5s ease';
            
            setTimeout(function() {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 1500);

    // Initialize all tools from the homepage
    initHomePageTools();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize AI Security system if on homepage
    if (document.querySelector('.ai-features')) {
        const securityAI = new SecurityAI();
        securityAI.initialize();
    }
});

// Initialize tools on the homepage
function initHomePageTools() {
    // Password Generator Tool
    const passwordGenBtn = document.getElementById('password-gen-btn');
    const passwordResult = document.getElementById('password-result');

    if (passwordGenBtn && passwordResult) {
        passwordGenBtn.addEventListener('click', function() {
            const length = 16;
            const options = {
                uppercase: true,
                numbers: true,
                symbols: true
            };
            const password = generatePassword(length, options);
            passwordResult.textContent = password;
            passwordResult.style.display = 'block';
        });
    }

    // Hash Generator Tool
    const hashBtn = document.getElementById('hash-btn');
    const hashInput = document.getElementById('hash-input');
    const hashResult = document.getElementById('hash-result');

    if (hashBtn && hashInput && hashResult) {
        hashBtn.addEventListener('click', function() {
            const text = hashInput.value.trim();
            if (text === '') {
                alert('Please enter text to hash');
                return;
            }

            // Simple hash function for demo purposes
            const hash = simpleSHA256(text);
            hashResult.textContent = hash;
            hashResult.style.display = 'block';
        });
    }
}

// Initialize scroll animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if (animatedElements.length === 0) return;
    
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

// Generate a secure random password
function generatePassword(length, options) {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~`|}{[]\\:;?><,./-=';
    
    let charset = lowercase;
    if (options && options.uppercase) charset += uppercase;
    if (options && options.numbers) charset += numbers;
    if (options && options.symbols) charset += symbols;
    
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    
    return password;
}

// Simple hash functions for demo purposes
function simpleSHA256(text) {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        const char = text.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return 'sha256_' + Math.abs(hash).toString(16).padStart(16, '0');
}

// AI Features functionality
class SecurityAI {
    constructor() {
        this.securityLevel = 'moderate';
        this.initialized = false;
        this.aiElements = document.querySelectorAll('.ai-item');
        this.riskFactors = [
            { pattern: 'password', risk: 'high' },
            { pattern: '123456', risk: 'high' },
            { pattern: 'qwerty', risk: 'high' },
            { pattern: 'admin', risk: 'high' },
            { pattern: 'login', risk: 'medium' },
            { pattern: 'user', risk: 'medium' }
        ];
    }
    
    initialize() {
        console.log('AI Security System Initializing...');
        
        // Add pulse animation to AI elements
        if (this.aiElements.length > 0) {
            this.aiElements.forEach(element => {
                element.querySelector('.ai-icon').classList.add('pulse');
            });
        }
        
        // Initialize threat detection simulation
        this.initThreatDetection();
        
        setTimeout(() => {
            console.log('AI Security System Ready');
            this.initialized = true;
            
            // Show AI ready status on the page
            const aiSection = document.querySelector('.ai-features');
            if (aiSection) {
                const statusElement = document.createElement('div');
                statusElement.className = 'ai-status';
                statusElement.innerHTML = `
                    <div class="status-indicator active"></div>
                    <span>AI System Active</span>
                `;
                statusElement.style.textAlign = 'center';
                statusElement.style.marginTop = '20px';
                statusElement.style.padding = '10px';
                statusElement.style.backgroundColor = 'rgba(100, 255, 218, 0.1)';
                statusElement.style.borderRadius = '5px';
                statusElement.style.display = 'inline-block';
                
                // Style for status indicator
                const style = document.createElement('style');
                style.textContent = `
                    .status-indicator {
                        display: inline-block;
                        width: 10px;
                        height: 10px;
                        background-color: #64ffda;
                        border-radius: 50%;
                        margin-right: 10px;
                        animation: pulse 2s infinite;
                    }
                    @keyframes pulse {
                        0% { box-shadow: 0 0 0 0 rgba(100, 255, 218, 0.7); }
                        70% { box-shadow: 0 0 0 10px rgba(100, 255, 218, 0); }
                        100% { box-shadow: 0 0 0 0 rgba(100, 255, 218, 0); }
                    }
                `;
                document.head.appendChild(style);
                
                // Insert status at the beginning of the AI section
                aiSection.insertBefore(statusElement, aiSection.firstChild.nextSibling);
            }
        }, 2000);
    }
    
    initThreatDetection() {
        // Add interactive elements to threat detection AI item
        const threatDetectionItem = document.querySelector('.ai-item:first-child');
        if (threatDetectionItem) {
            const demoInterface = document.createElement('div');
            demoInterface.className = 'ai-demo-interface';
            demoInterface.innerHTML = `
                <input type="text" id="threat-input" placeholder="Enter text to analyze...">
                <button id="analyze-btn">Analyze</button>
                <div id="analysis-result" class="analysis-result"></div>
            `;
            demoInterface.style.marginTop = '15px';
            demoInterface.style.padding = '10px';
            demoInterface.style.backgroundColor = 'rgba(17, 34, 64, 0.6)';
            demoInterface.style.borderRadius = '5px';
            
            // Style for input and button
            demoInterface.querySelector('input').style.width = '100%';
            demoInterface.querySelector('input').style.padding = '8px';
            demoInterface.querySelector('input').style.marginBottom = '10px';
            demoInterface.querySelector('input').style.backgroundColor = 'var(--primary-color)';
            demoInterface.querySelector('input').style.border = '1px solid var(--secondary-color)';
            demoInterface.querySelector('input').style.color = 'var(--text-color)';
            demoInterface.querySelector('input').style.borderRadius = '4px';
            
            demoInterface.querySelector('button').style.backgroundColor = 'var(--secondary-color)';
            demoInterface.querySelector('button').style.color = 'var(--primary-color)';
            demoInterface.querySelector('button').style.border = 'none';
            demoInterface.querySelector('button').style.padding = '8px 15px';
            demoInterface.querySelector('button').style.borderRadius = '4px';
            demoInterface.querySelector('button').style.cursor = 'pointer';
            demoInterface.querySelector('button').style.fontWeight = 'bold';
            
            demoInterface.querySelector('.analysis-result').style.marginTop = '10px';
            demoInterface.querySelector('.analysis-result').style.display = 'none';
            demoInterface.querySelector('.analysis-result').style.padding = '10px';
            demoInterface.querySelector('.analysis-result').style.backgroundColor = 'var(--primary-color)';
            demoInterface.querySelector('.analysis-result').style.borderRadius = '4px';
            
            threatDetectionItem.appendChild(demoInterface);
            
            // Add event listener to the analyze button
            demoInterface.querySelector('#analyze-btn').addEventListener('click', () => {
                const input = demoInterface.querySelector('#threat-input').value.trim();
                if (input) {
                    const result = this.analyzeRisk(input);
                    const resultElement = demoInterface.querySelector('#analysis-result');
                    resultElement.textContent = result;
                    resultElement.style.display = 'block';
                    
                    // Apply appropriate color based on risk level
                    if (result.includes('High')) {
                        resultElement.style.color = '#ff6b6b';
                    } else if (result.includes('Medium')) {
                        resultElement.style.color = '#ffc107';
                    } else {
                        resultElement.style.color = '#64ffda';
                    }
                }
            });
        }
    }
    
    analyzeRisk(input) {
        if (!this.initialized) {
            this.initialize();
            return 'System initializing, please try again.';
        }
        
        // Check for known risk patterns
        let highestRisk = 'Low';
        let detectedPatterns = [];
        
        for (const factor of this.riskFactors) {
            if (input.toLowerCase().includes(factor.pattern)) {
                detectedPatterns.push(factor.pattern);
                if (factor.risk === 'high' && highestRisk !== 'high') {
                    highestRisk = 'High';
                } else if (factor.risk === 'medium' && highestRisk === 'Low') {
                    highestRisk = 'Medium';
                }
            }
        }
        
        // Generate the risk assessment message
        let result = `Risk Assessment: ${highestRisk}`;
        
        if (detectedPatterns.length > 0) {
            result += `\nDetected patterns: ${detectedPatterns.join(', ')}`;
            if (highestRisk === 'High') {
                result += '\nRecommendation: Avoid using common terms or patterns that could be easily guessed.';
            } else if (highestRisk === 'Medium') {
                result += '\nRecommendation: Consider using more unique identifiers for better security.';
            }
        } else {
            result += '\nNo concerning patterns detected.';
        }
        
        return result;
    }
}
