// JavaScript for Cybersecurity Tools

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all tools on page load immediately
    initPasswordGenerator();
    initHashGenerator();
    initPasswordStrengthChecker();
    initDnsLookup();
    initPortScanner();
    initBase64Tool();
    initUrlTool();
    initSslChecker();
    initPasswordPatternAnalyzer();
    initNetworkLatencyTester();
    initFileHashCalculator();
    initAIPasswordStrength();
    initAIRiskAssessment();
    initAIMalwareDetection();
    // Force the IP scanner to initialize right away
    const ipScanResult = document.getElementById('ip-scan-result');
    const ipScanBtn = document.getElementById('ip-scan-btn');
    if (ipScanBtn && !ipScanResult) {
        ipScanBtn.click(); // Auto-trigger the scan on page load
    }
});

// Password Generator Tool
function initPasswordGenerator() {
    const passwordGenBtn = document.getElementById('password-gen-btn');
    const passwordResult = document.getElementById('password-result');
    const passwordLength = document.getElementById('password-length');
    const lengthValue = document.getElementById('length-value');
    const useUppercase = document.getElementById('use-uppercase');
    const useNumbers = document.getElementById('use-numbers');
    const useSymbols = document.getElementById('use-symbols');
    const copyPasswordBtn = document.getElementById('copy-password');
    
    if (!passwordGenBtn || !passwordResult) return;
    
    // Update length display when slider moves
    if (passwordLength && lengthValue) {
        passwordLength.addEventListener('input', function() {
            lengthValue.textContent = this.value;
        });
    }
    
    // Generate password on button click
    passwordGenBtn.addEventListener('click', function() {
        const length = passwordLength ? parseInt(passwordLength.value) : 16;
        const options = {
            uppercase: useUppercase ? useUppercase.checked : true,
            numbers: useNumbers ? useNumbers.checked : true,
            symbols: useSymbols ? useSymbols.checked : true
        };
        
        const password = generatePassword(length, options);
        passwordResult.textContent = password;
        passwordResult.style.display = 'block';
        
        if (copyPasswordBtn) {
            copyPasswordBtn.style.display = 'block';
        }
    });
    
    // Copy password button
    if (copyPasswordBtn) {
        copyPasswordBtn.addEventListener('click', function() {
            const password = passwordResult.textContent;
            if (password) {
                // Create a temporary input element
                const tempInput = document.createElement('input');
                tempInput.value = password;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                
                // Show copied feedback
                const originalText = this.textContent;
                this.textContent = 'Copied!';
                setTimeout(() => {
                    this.textContent = originalText;
                }, 2000);
            }
        });
    }
    
    // Auto-generate a password on load
    setTimeout(() => {
        if (passwordGenBtn && !passwordResult.textContent) {
            passwordGenBtn.click();
        }
    }, 500);
}

// Generate password with options
function generatePassword(length, options) {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~`|}{[]\\:;?><,./-=';
    
    let charset = lowercase;
    if (options.uppercase) charset += uppercase;
    if (options.numbers) charset += numbers;
    if (options.symbols) charset += symbols;
    
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    
    return password;
}

// Hash Generator Tool
function initHashGenerator() {
    const hashBtn = document.getElementById('hash-btn');
    const hashInput = document.getElementById('hash-input');
    const hashResult = document.getElementById('hash-result');
    const hashAlgorithm = document.getElementById('hash-algorithm');
    
    if (!hashBtn || !hashInput || !hashResult) return;
    
    hashBtn.addEventListener('click', function() {
        const text = hashInput.value.trim();
        if (text === '') {
            alert('Please enter text to hash');
            return;
        }
        
        const algorithm = hashAlgorithm ? hashAlgorithm.value : 'sha256';
        
        // Generate a hash based on selected algorithm
        let hash = '';
        
        if (algorithm === 'md5') {
            hash = simpleMD5(text);
        } else if (algorithm === 'sha1') {
            hash = simpleSHA1(text);
        } else {
            hash = simpleSHA256(text);
        }
        
        hashResult.textContent = hash;
        hashResult.style.display = 'block';
    });
    
    // Auto-populate with sample text if empty
    if (hashInput && hashInput.value === '') {
        hashInput.value = 'Sample text to hash';
    }
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

function simpleMD5(text) {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        const char = text.charCodeAt(i);
        hash = ((hash << 3) - hash) + char;
        hash = hash & hash;
    }
    return 'md5_' + Math.abs(hash).toString(16).padStart(16, '0');
}

function simpleSHA1(text) {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        const char = text.charCodeAt(i);
        hash = ((hash << 4) - hash) + char;
        hash = hash & hash;
    }
    return 'sha1_' + Math.abs(hash).toString(16).padStart(16, '0');
}

// Password Strength Checker Tool
function initPasswordStrengthChecker() {
    const passwordCheckBtn = document.getElementById('password-check-btn');
    const passwordCheckInput = document.getElementById('password-check-input');
    const strengthIndicator = document.getElementById('strength-indicator');
    const strengthText = document.getElementById('strength-text');
    const passwordSuggestions = document.getElementById('password-suggestions');
    
    if (!passwordCheckBtn || !passwordCheckInput) return;
    
    passwordCheckBtn.addEventListener('click', function() {
        const password = passwordCheckInput.value;
        if (password === '') {
            alert('Please enter a password to check');
            return;
        }
        
        const strength = checkPasswordStrength(password);
        
        // Update strength meter
        if (strengthIndicator) {
            strengthIndicator.style.width = strength.score + '%';
            strengthIndicator.style.backgroundColor = strength.color;
        }
        
        if (strengthText) {
            strengthText.textContent = 'Strength: ' + strength.rating;
            strengthText.style.color = strength.color;
        }
        
        // Show suggestions
        if (passwordSuggestions) {
            passwordSuggestions.innerHTML = `
                <h4>Analysis:</h4>
                <ul>
                    ${strength.suggestions.map(s => `<li>${s}</li>`).join('')}
                </ul>
            `;
            passwordSuggestions.style.display = 'block';
        }
    });
    
    // Auto-fill with sample password
    if (passwordCheckInput && passwordCheckInput.value === '') {
        passwordCheckInput.value = 'Sample123!'; 
        // Trigger check after a delay
        setTimeout(() => {
            if (passwordCheckBtn) passwordCheckBtn.click();
        }, 800);
    }
}

function checkPasswordStrength(password) {
    let score = 0;
    const suggestions = [];
    
    // Length check
    if (password.length < 8) {
        suggestions.push('Password is too short. Use at least 8 characters.');
    } else if (password.length >= 12) {
        score += 25;
        suggestions.push('Good password length.');
    } else {
        score += 15;
    }
    
    // Complexity checks
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[^A-Za-z0-9]/.test(password);
    
    if (hasUppercase) score += 15;
    else suggestions.push('Add uppercase letters for better security.');
    
    if (hasLowercase) score += 10;
    else suggestions.push('Add lowercase letters for better security.');
    
    if (hasNumbers) score += 15;
    else suggestions.push('Add numbers for better security.');
    
    if (hasSpecialChars) score += 20;
    else suggestions.push('Add special characters for better security.');
    
    // Common patterns check
    if (/12345|qwerty|password|admin/i.test(password)) {
        score -= 30;
        suggestions.push('Your password contains common patterns that are easy to guess.');
    }
    
    // Repetition check
    if (/(.)(\1{2,})/.test(password)) {
        score -= 15;
        suggestions.push('Avoid repeating characters.');
    }
    
    // Ensure score is within bounds
    score = Math.max(0, Math.min(100, score));
    
    // Determine rating and color
    let rating, color;
    if (score >= 80) {
        rating = 'Very Strong';
        color = '#4CAF50';
        suggestions.push('Excellent password strength!');
    } else if (score >= 60) {
        rating = 'Strong';
        color = '#8BC34A';
        suggestions.push('Good password, but could be improved.');
    } else if (score >= 40) {
        rating = 'Moderate';
        color = '#FFC107';
        suggestions.push('Consider strengthening your password.');
    } else if (score >= 20) {
        rating = 'Weak';
        color = '#FF9800';
        suggestions.push('This password is vulnerable to attacks.');
    } else {
        rating = 'Very Weak';
        color = '#F44336';
        suggestions.push('This password is extremely vulnerable. Please create a stronger one.');
    }
    
    return { score, rating, color, suggestions };
}

// DNS Lookup Tool (Simulation)
function initDnsLookup() {
    const dnsLookupBtn = document.getElementById('dns-lookup-btn');
    const dnsInput = document.getElementById('dns-input');
    const dnsResult = document.getElementById('dns-result');
    
    if (!dnsLookupBtn || !dnsInput || !dnsResult) return;
    
    dnsLookupBtn.addEventListener('click', function() {
        const domain = dnsInput.value.trim();
        if (domain === '') {
            alert('Please enter a domain to lookup');
            return;
        }
        
        // Show loading state
        dnsResult.textContent = 'Looking up DNS records...';
        dnsResult.style.display = 'block';
        
        // Generate DNS records immediately rather than using setTimeout
        simulateDnsLookup(domain, dnsResult);
    });
    
    // Auto-populate with example domain
    if (dnsInput && dnsInput.value === '') {
        dnsInput.value = 'example.com';
        // Trigger lookup after a delay
        setTimeout(() => {
            if (dnsLookupBtn) dnsLookupBtn.click();
        }, 1000);
    }
}

function simulateDnsLookup(domain, resultElement) {
    // Generate simulated DNS records
    const ipv4Address = generateRandomIPv4();
    const ipv6Address = generateRandomIPv6();
    
    // Create simulated DNS records
    const dnsRecords = {
        A: [ipv4Address],
        AAAA: [ipv6Address],
        MX: [`10 mail.${domain}`, `20 mail2.${domain}`],
        NS: [`ns1.${domain}`, `ns2.${domain}`],
        TXT: [`"v=spf1 include:_spf.${domain} ~all"`]
    };
    
    // Display the results
    let resultHTML = `<div class="dns-records">
        <p><strong>DNS Records for ${domain}</strong></p>
        <div class="record-section">
            <p><strong>A Records:</strong></p>
            <ul>
                ${dnsRecords.A.map(r => `<li>${r}</li>`).join('')}
            </ul>
        </div>
        <div class="record-section">
            <p><strong>AAAA Records:</strong></p>
            <ul>
                ${dnsRecords.AAAA.map(r => `<li>${r}</li>`).join('')}
            </ul>
        </div>
        <div class="record-section">
            <p><strong>MX Records:</strong></p>
            <ul>
                ${dnsRecords.MX.map(r => `<li>${r}</li>`).join('')}
            </ul>
        </div>
        <div class="record-section">
            <p><strong>NS Records:</strong></p>
            <ul>
                ${dnsRecords.NS.map(r => `<li>${r}</li>`).join('')}
            </ul>
        </div>
        <div class="record-section">
            <p><strong>TXT Records:</strong></p>
            <ul>
                ${dnsRecords.TXT.map(r => `<li>${r}</li>`).join('')}
            </ul>
        </div>
        <p class="small-note">Note: This is a simulation for educational purposes.</p>
    </div>`;
    
    resultElement.innerHTML = resultHTML;
}

function generateRandomIPv4() {
    const octets = [];
    for (let i = 0; i < 4; i++) {
        octets.push(Math.floor(Math.random() * 256));
    }
    return octets.join('.');
}

function generateRandomIPv6() {
    const segments = [];
    for (let i = 0; i < 8; i++) {
        const segment = Math.floor(Math.random() * 65536).toString(16).padStart(4, '0');
        segments.push(segment);
    }
    return segments.join(':');
}

// Port Scanner Simulation
function initPortScanner() {
    const portScanBtn = document.getElementById('port-scan-btn');
    const portScanInput = document.getElementById('port-scan-input');
    const portStart = document.getElementById('port-start');
    const portEnd = document.getElementById('port-end');
    const portScanResult = document.getElementById('port-scan-result');
    
    if (!portScanBtn || !portScanInput || !portScanResult) return;
    
    portScanBtn.addEventListener('click', function() {
        const host = portScanInput.value.trim();
        if (host === '') {
            alert('Please enter a hostname or IP address');
            return;
        }
        
        const start = portStart ? parseInt(portStart.value) : 1;
        const end = portEnd ? parseInt(portEnd.value) : 100;
        
        if (start > end) {
            alert('Start port must be less than or equal to end port');
            return;
        }
        
        if (end - start > 100) {
            alert('Please scan no more than 100 ports at a time');
            return;
        }
        
        // Show scanning animation
        portScanResult.innerHTML = `<p>Scanning ${host} on ports ${start}-${end}...</p>`;
        portScanResult.style.display = 'block';
        
        // Simulate port scanning immediately instead of with delays
        performPortScan(host, start, end, portScanResult);
    });
    
    // Auto-populate with example host
    if (portScanInput && portScanInput.value === '') {
        portScanInput.value = 'localhost';
        // Trigger scan after a delay
        setTimeout(() => {
            if (portScanBtn) portScanBtn.click();
        }, 1200);
    }
}

function performPortScan(host, startPort, endPort, resultElement) {
    // Common services
    const commonServices = {
        21: 'FTP',
        22: 'SSH',
        23: 'Telnet',
        25: 'SMTP',
        53: 'DNS',
        80: 'HTTP',
        110: 'POP3',
        143: 'IMAP',
        443: 'HTTPS',
        3306: 'MySQL',
        3389: 'RDP',
        8080: 'HTTP Proxy'
    };
    
    // Generate a random set of open ports - faster and more reliable than the original
    const openPorts = [];
    const portCount = endPort - startPort + 1;
    
    // Select random ports to be "open"
    for (let port = startPort; port <= endPort; port++) {
        // Make common ports more likely to be "open"
        const isCommonPort = commonServices[port] !== undefined;
        const randomFactor = isCommonPort ? 0.8 : 0.1; // 80% chance for common ports, 10% for others
        
        if (Math.random() < randomFactor) {
            const serviceName = commonServices[port] || 'Unknown Service';
            openPorts.push({ port: port, service: serviceName });
        }
    }
    
    // Sort open ports
    openPorts.sort((a, b) => a.port - b.port);
    
    // Create results HTML
    let resultsHTML = `
        <div class="scan-results">
            <p><strong>Scan completed for ${host} on ports ${startPort}-${endPort}</strong></p>
    `;
    
    if (openPorts.length > 0) {
        resultsHTML += `
            <p><strong>Open Ports: ${openPorts.length}</strong></p>
            <table class="port-table">
                <tr>
                    <th>Port</th>
                    <th>Service</th>
                </tr>
                ${openPorts.map(p => `
                    <tr>
                        <td>${p.port}</td>
                        <td>${p.service}</td>
                    </tr>
                `).join('')}
            </table>
        `;
    } else {
        resultsHTML += `<p>No open ports found in the specified range.</p>`;
    }
    
    resultsHTML += `<p class="small-note">Note: This is a simulation for educational purposes only.</p></div>`;
    
    // Add some CSS for the table
    resultsHTML += `
        <style>
            .port-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
            }
            .port-table th, .port-table td {
                padding: 8px;
                text-align: left;
                border-bottom: 1px solid #30465e;
            }
            .port-table th {
                background-color: #1d3557;
            }
            .small-note {
                font-size: 0.8rem;
                color: #bac8de;
                margin-top: 15px;
            }
        </style>
    `;
    
    resultElement.innerHTML = resultsHTML;
}

// Initialize IP Scanner on the tools page
function initIpScannerOnToolsPage() {
    const ipScanBtn = document.getElementById('ip-scan-btn');
    const ipScanResult = document.getElementById('ip-scan-result');
    
    if (!ipScanBtn || !ipScanResult) return;
    
    ipScanBtn.addEventListener('click', async function() {
        ipScanResult.style.display = 'block';
        ipScanResult.textContent = 'Scanning your IP address...';
        
        try {
            // Fetch IP address from public API
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            const ip = data.ip;
            
            // Get more IP information
            const ipInfo = analyzeIP(ip);
            
            // Display results with a typing effect
            let resultHTML = `<div class="ip-info">
                <p><strong>Your IP:</strong> ${ip}</p>
                <p><strong>Classification:</strong> ${ipInfo.classification}</p>
                <p><strong>Note:</strong> For security reasons, detailed geolocation is not shown.</p>
            </div>`;
            
            setTimeout(() => {
                ipScanResult.innerHTML = resultHTML;
            }, 1000);
            
        } catch (error) {
            ipScanResult.textContent = 'Error scanning IP: ' + error.message;
        }
    });
    
    // Auto-trigger the IP scan on page load
    if (ipScanBtn) ipScanBtn.click();
}

// Base64 Encoder/Decoder Tool
function initBase64Tool() {
    const base64Input = document.getElementById('base64-input');
    const encodeBtn = document.getElementById('encode-base64');
    const decodeBtn = document.getElementById('decode-base64');
    const resultDiv = document.getElementById('base64-result');

    if (!base64Input || !encodeBtn || !decodeBtn || !resultDiv) return;

    encodeBtn.addEventListener('click', function() {
        try {
            const text = base64Input.value;
            const encoded = btoa(text);
            resultDiv.textContent = encoded;
            resultDiv.style.display = 'block';
        } catch (e) {
            resultDiv.textContent = 'Error: Invalid input for encoding';
            resultDiv.style.color = 'red';
        }
    });

    decodeBtn.addEventListener('click', function() {
        try {
            const text = base64Input.value;
            const decoded = atob(text);
            resultDiv.textContent = decoded;
            resultDiv.style.display = 'block';
        } catch (e) {
            resultDiv.textContent = 'Error: Invalid Base64 input';
            resultDiv.style.color = 'red';
        }
    });
}

// URL Encoder/Decoder Tool
function initUrlTool() {
    const urlInput = document.getElementById('url-input');
    const encodeBtn = document.getElementById('encode-url');
    const decodeBtn = document.getElementById('decode-url');
    const resultDiv = document.getElementById('url-result');

    if (!urlInput || !encodeBtn || !decodeBtn || !resultDiv) return;

    encodeBtn.addEventListener('click', function() {
        try {
            const text = urlInput.value;
            const encoded = encodeURIComponent(text);
            resultDiv.textContent = encoded;
            resultDiv.style.display = 'block';
            resultDiv.style.color = 'inherit';
        } catch (e) {
            resultDiv.textContent = 'Error: Invalid input for encoding';
            resultDiv.style.color = 'red';
        }
    });

    decodeBtn.addEventListener('click', function() {
        try {
            const text = urlInput.value;
            const decoded = decodeURIComponent(text);
            resultDiv.textContent = decoded;
            resultDiv.style.display = 'block';
            resultDiv.style.color = 'inherit';
        } catch (e) {
            resultDiv.textContent = 'Error: Invalid URL-encoded input';
            resultDiv.style.color = 'red';
        }
    });
}

// SSL Certificate Checker Tool (Simulation)
function initSslChecker() {
    const domainInput = document.getElementById('ssl-domain');
    const checkBtn = document.getElementById('check-ssl');
    const resultDiv = document.getElementById('ssl-result');

    if (!domainInput || !checkBtn || !resultDiv) return;

    checkBtn.addEventListener('click', function() {
        const domain = domainInput.value.trim();
        if (!domain) {
            resultDiv.innerHTML = 'Please enter a domain name';
            resultDiv.style.color = 'red';
            return;
        }

        // Simulate certificate check
        resultDiv.innerHTML = '<div class="scanning-animation">Checking certificate...</div>';
        setTimeout(() => {
            const isValid = Math.random() > 0.2; // 80% chance of valid certificate
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + Math.floor(Math.random() * 365)); // Random expiry within a year

            const result = isValid ? 
                `<div style="color: green;">
                    <i class="fas fa-check-circle"></i> Valid SSL Certificate<br>
                    Issuer: Let's Encrypt Authority X3<br>
                    Valid Until: ${expiryDate.toLocaleDateString()}<br>
                    Encryption: TLS 1.3<br>
                    Key Strength: 2048-bit
                </div>` :
                `<div style="color: red;">
                    <i class="fas fa-times-circle"></i> Invalid Certificate<br>
                    Issues Found:<br>
                    - Certificate expired or invalid<br>
                    - Domain mismatch<br>
                    Please check domain name and try again
                </div>`;

            resultDiv.innerHTML = result;
        }, 1500);
    });
}

// Password Pattern Analyzer Tool
function initPasswordPatternAnalyzer() {
    const patternInput = document.getElementById('pattern-input');
    const analyzeBtn = document.getElementById('analyze-pattern');
    const resultDiv = document.getElementById('pattern-result');

    if (!patternInput || !analyzeBtn || !resultDiv) return;

    analyzeBtn.addEventListener('click', function() {
        const password = patternInput.value;
        if (!password) {
            resultDiv.innerHTML = 'Please enter a password to analyze';
            return;
        }

        const analysis = analyzePasswordPattern(password);
        resultDiv.innerHTML = `
            <div class="pattern-results">
                <p><strong>Length:</strong> ${password.length} characters</p>
                <p><strong>Character Types:</strong></p>
                <ul>
                    <li>Uppercase: ${analysis.uppercase}</li>
                    <li>Lowercase: ${analysis.lowercase}</li>
                    <li>Numbers: ${analysis.numbers}</li>
                    <li>Symbols: ${analysis.symbols}</li>
                </ul>
                <p><strong>Common Patterns Found:</strong></p>
                <ul>
                    ${analysis.patterns.map(p => `<li>${p}</li>`).join('')}
                </ul>
                <p><strong>Substitutions Found:</strong></p>
                <ul>
                    ${analysis.substitutions.map(s => `<li>${s}</li>`).join('')}
                </ul>
            </div>
        `;
    });
}

function analyzePasswordPattern(password) {
    const analysis = {
        uppercase: (password.match(/[A-Z]/g) || []).length,
        lowercase: (password.match(/[a-z]/g) || []).length,
        numbers: (password.match(/[0-9]/g) || []).length,
        symbols: (password.match(/[^A-Za-z0-9]/g) || []).length,
        patterns: [],
        substitutions: []
    };

    // Check for common patterns
    if (/\d{4}$/.test(password)) analysis.patterns.push('Ends with 4 digits (possible year)');
    if (/^[A-Z][a-z]+\d+$/.test(password)) analysis.patterns.push('Capitalized word followed by numbers');
    if (/(.)\1{2,}/.test(password)) analysis.patterns.push('Character repetition');
    if (/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
        analysis.patterns.push('Follows common password policy pattern');
    }

    // Check for common substitutions
    const substitutions = {
        'a': '@',
        'i': '1',
        'e': '3',
        's': '$',
        'o': '0',
        'l': '1'
    };

    for (let [letter, sub] of Object.entries(substitutions)) {
        if (password.includes(sub)) {
            analysis.substitutions.push(`'${letter}' replaced with '${sub}'`);
        }
    }

    return analysis;
}

// Network Latency Tester Tool
function initNetworkLatencyTester() {
    const targetSelect = document.getElementById('latency-target');
    const testBtn = document.getElementById('test-latency');
    const resultDiv = document.getElementById('latency-result');
    const barsDiv = resultDiv.querySelector('.latency-bars');

    if (!targetSelect || !testBtn || !resultDiv) return;

    testBtn.addEventListener('click', async function() {
        barsDiv.innerHTML = '<div class="scanning-animation">Testing network latency...</div>';
        
        // Simulate multiple ping tests
        const results = [];
        const tests = 5;
        
        for (let i = 0; i < tests; i++) {
            // Simulate network latency with random delays
            const delay = Math.floor(Math.random() * 150) + 20; // 20-170ms
            await new Promise(resolve => setTimeout(resolve, delay));
            results.push(delay);
        }

        // Calculate statistics
        const avg = Math.floor(results.reduce((a, b) => a + b, 0) / results.length);
        const max = Math.max(...results);
        const min = Math.min(...results);

        // Create visual representation
        barsDiv.innerHTML = results.map((latency, index) => `
            <div class="latency-bar" style="width: ${(latency/max)*100}%">
                <span>Test ${index + 1}: ${latency}ms</span>
            </div>
        `).join('') + `
        <div style="margin-top: 10px">
            <strong>Average:</strong> ${avg}ms | 
            <strong>Min:</strong> ${min}ms | 
            <strong>Max:</strong> ${max}ms
        </div>`;
    });
}

// File Hash Calculator Tool
function initFileHashCalculator() {
    const fileInput = document.getElementById('hash-file-input');
    const calculateBtn = document.getElementById('calculate-hash');
    const resultDiv = document.getElementById('hash-file-result');
    const fileNameSpan = document.getElementById('selected-file-name');
    const md5Checkbox = document.getElementById('hash-md5');
    const sha1Checkbox = document.getElementById('hash-sha1');
    const sha256Checkbox = document.getElementById('hash-sha256');

    if (!fileInput || !calculateBtn || !resultDiv || !fileNameSpan) return;

    fileInput.addEventListener('change', function() {
        fileNameSpan.textContent = this.files[0] ? this.files[0].name : 'No file selected';
    });

    calculateBtn.addEventListener('click', async function() {
        if (!fileInput.files.length) {
            resultDiv.innerHTML = 'Please select a file first';
            return;
        }

        const file = fileInput.files[0];
        resultDiv.innerHTML = '<div class="scanning-animation">Calculating file hashes...</div>';

        try {
            const hashes = await calculateFileHashes(file, {
                md5: md5Checkbox.checked,
                sha1: sha1Checkbox.checked,
                sha256: sha256Checkbox.checked
            });

            let resultHtml = `<div class="hash-results">`;
            if (hashes.md5) resultHtml += `<div class="hash-result-item"><strong>MD5:</strong> ${hashes.md5}</div>`;
            if (hashes.sha1) resultHtml += `<div class="hash-result-item"><strong>SHA-1:</strong> ${hashes.sha1}</div>`;
            if (hashes.sha256) resultHtml += `<div class="hash-result-item"><strong>SHA-256:</strong> ${hashes.sha256}</div>`;
            resultHtml += '</div>';

            resultDiv.innerHTML = resultHtml;
        } catch (error) {
            resultDiv.innerHTML = `Error calculating hashes: ${error.message}`;
        }
    });
}

async function calculateFileHashes(file, options) {
    const hashes = {};
    
    // Simulate hash calculation with setTimeout
    if (options.md5) {
        await new Promise(resolve => setTimeout(resolve, 500));
        hashes.md5 = Array.from(crypto.getRandomValues(new Uint8Array(16)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }
    
    if (options.sha1) {
        await new Promise(resolve => setTimeout(resolve, 500));
        hashes.sha1 = Array.from(crypto.getRandomValues(new Uint8Array(20)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }
    
    if (options.sha256) {
        await new Promise(resolve => setTimeout(resolve, 500));
        hashes.sha256 = Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }
    
    return hashes;
}

// AI Password Strength Analyzer
function initAIPasswordStrength() {
    const passwordInput = document.getElementById('ai-password-input');
    const analyzeBtn = document.getElementById('analyze-ai-password');
    const resultDiv = document.getElementById('ai-password-result');
    const meterBar = document.querySelector('.meter-bar');

    if (!passwordInput || !analyzeBtn || !resultDiv || !meterBar) return;

    analyzeBtn.addEventListener('click', async function() {
        const password = passwordInput.value;
        if (!password) {
            resultDiv.innerHTML = 'Please enter a password to analyze';
            return;
        }

        // Show loading state
        resultDiv.innerHTML = '<div class="scanning-animation">Analyzing password with AI...</div>';
        meterBar.style.width = '0%';

        // Simulate AI analysis
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Calculate comprehensive strength score
        const lengthScore = Math.min(password.length * 5, 35);
        const varietyScore = calculateVarietyScore(password);
        const patternScore = calculatePatternScore(password);
        const totalScore = Math.min(lengthScore + varietyScore + patternScore, 100);

        // Update meter
        meterBar.style.background = getScoreColor(totalScore);
        meterBar.style.width = `${totalScore}%`;

        // Generate AI recommendations
        const recommendations = generateAIRecommendations(password, totalScore);
        
        resultDiv.innerHTML = `
            <div class="ai-analysis">
                <h4>AI Analysis Results</h4>
                <p><strong>Overall Strength:</strong> ${getStrengthLabel(totalScore)}</p>
                <p><strong>Score:</strong> ${totalScore}/100</p>
                
                <h4>Strength Breakdown:</h4>
                <ul>
                    <li>Length: ${lengthScore}/35</li>
                    <li>Character Variety: ${varietyScore}/35</li>
                    <li>Pattern Resistance: ${patternScore}/30</li>
                </ul>

                <h4>AI Recommendations:</h4>
                <ul class="recommendations">
                    ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
        `;
    });
}

function calculateVarietyScore(password) {
    let score = 0;
    if (/[A-Z]/.test(password)) score += 8;
    if (/[a-z]/.test(password)) score += 8;
    if (/[0-9]/.test(password)) score += 8;
    if (/[^A-Za-z0-9]/.test(password)) score += 11;
    return score;
}

function calculatePatternScore(password) {
    let score = 30;
    // Deduct points for common patterns
    if (/\d{4}$/.test(password)) score -= 10;
    if (/^[A-Z][a-z]+\d+$/.test(password)) score -= 10;
    if (/(.)\1{2,}/.test(password)) score -= 8;
    if (/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) score += 5;
    return Math.max(score, 0);
}

function getScoreColor(score) {
    if (score < 50) return '#ff4444';
    if (score < 70) return '#ffbb33';
    if (score < 90) return '#00C851';
    return '#007E33';
}

function getStrengthLabel(score) {
    if (score < 50) return 'Weak';
    if (score < 70) return 'Medium';
    if (score < 90) return 'Strong';
    return 'Very Strong';
}

function generateAIRecommendations(password, score) {
    const recommendations = [];
    
    if (password.length < 12) {
        recommendations.push('Increase password length to at least 12 characters');
    }
    if (!/[A-Z]/.test(password)) {
        recommendations.push('Add uppercase letters for better variety');
    }
    if (!/[0-9]/.test(password)) {
        recommendations.push('Include numbers to strengthen the password');
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
        recommendations.push('Add special characters to increase complexity');
    }
    if (/(.)\1{2,}/.test(password)) {
        recommendations.push('Avoid repeating characters');
    }
    if (/\d{4}$/.test(password)) {
        recommendations.push('Avoid ending with common year patterns');
    }
    
    if (score >= 90) {
        recommendations.push('Excellent password! Remember to change it periodically.');
    }
    
    return recommendations;
}

// AI Security Risk Assessment
function initAIRiskAssessment() {
    const startBtn = document.getElementById('start-risk-assessment');
    const resultDiv = document.getElementById('risk-assessment-result');
    const categories = document.querySelectorAll('.risk-categories input');

    if (!startBtn || !resultDiv) return;

    startBtn.addEventListener('click', async function() {
        const selectedCategories = Array.from(categories)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        if (selectedCategories.length === 0) {
            resultDiv.innerHTML = 'Please select at least one category to assess';
            return;
        }

        resultDiv.innerHTML = '<div class="scanning-animation">AI analyzing security risks...</div>';

        // Simulate AI analysis with delays
        await new Promise(resolve => setTimeout(resolve, 2000));

        const risks = generateSecurityRisks(selectedCategories);
        const riskScore = calculateRiskScore(risks);

        const summary = `
            <div class="risk-summary" style="background: ${getRiskBackground(riskScore)}">
                <h4>Risk Assessment Summary</h4>
                <p><strong>Overall Risk Level:</strong> ${getRiskLevel(riskScore)}</p>
                <p><strong>Risk Score:</strong> ${riskScore}/100</p>
                <p><strong>Categories Analyzed:</strong> ${selectedCategories.length}</p>
                <p><strong>Issues Found:</strong> ${risks.length}</p>
            </div>
        `;

        const details = `
            <div class="risk-details">
                ${risks.map(risk => `
                    <div class="risk-item ${risk.severity}">
                        <h4>${risk.title}</h4>
                        <p>${risk.description}</p>
                        <p><strong>Recommendation:</strong> ${risk.recommendation}</p>
                    </div>
                `).join('')}
            </div>
        `;

        resultDiv.innerHTML = summary + details;
    });
}

function generateSecurityRisks(categories) {
    const risks = [];
    
    if (categories.includes('network')) {
        risks.push(...[
            {
                title: 'Open Ports Detected',
                description: 'Several potentially vulnerable ports are accessible from the internet.',
                recommendation: 'Review and close unnecessary ports, implement firewall rules.',
                severity: 'high'
            },
            {
                title: 'Weak SSL Configuration',
                description: 'SSL configuration allows outdated protocols.',
                recommendation: 'Update SSL configuration to use only secure protocols (TLS 1.2+).',
                severity: 'medium'
            }
        ]);
    }

    if (categories.includes('password')) {
        risks.push(...[
            {
                title: 'Weak Password Policy',
                description: 'Current password policy does not meet security standards.',
                recommendation: 'Enforce stronger password requirements and regular updates.',
                severity: 'high'
            },
            {
                title: 'Password Storage',
                description: 'Potential issues with password hashing methods.',
                recommendation: 'Implement secure password hashing with salt.',
                severity: 'medium'
            }
        ]);
    }

    if (categories.includes('software')) {
        risks.push(...[
            {
                title: 'Outdated Software',
                description: 'Several critical updates are pending installation.',
                recommendation: 'Install all pending security updates.',
                severity: 'medium'
            },
            {
                title: 'Vulnerable Dependencies',
                description: 'Some third-party libraries have known vulnerabilities.',
                recommendation: 'Update dependencies to latest secure versions.',
                severity: 'high'
            }
        ]);
    }

    if (categories.includes('access')) {
        risks.push(...[
            {
                title: 'Excessive Permissions',
                description: 'Some users have unnecessary administrative access.',
                recommendation: 'Review and implement principle of least privilege.',
                severity: 'medium'
            },
            {
                title: 'Audit Logging',
                description: 'Insufficient logging of security events.',
                recommendation: 'Enable comprehensive security audit logging.',
                severity: 'low'
            }
        ]);
    }

    return risks;
}

function calculateRiskScore(risks) {
    const severityWeights = { high: 30, medium: 15, low: 5 };
    const totalWeight = risks.reduce((sum, risk) => sum + severityWeights[risk.severity], 0);
    return Math.max(0, 100 - totalWeight);
}

function getRiskLevel(score) {
    if (score < 60) return 'High Risk';
    if (score < 80) return 'Medium Risk';
    return 'Low Risk';
}

function getRiskBackground(score) {
    if (score < 60) return 'rgba(255, 68, 68, 0.1)';
    if (score < 80) return 'rgba(255, 187, 51, 0.1)';
    return 'rgba(0, 200, 81, 0.1)';
}

// AI Malware Detection Simulator
function initAIMalwareDetection() {
    const fileInput = document.getElementById('malware-file-input');
    const scanBtn = document.getElementById('start-malware-scan');
    const resultDiv = document.getElementById('malware-scan-result');
    const fileNameSpan = document.getElementById('malware-file-name');
    const deepScan = document.getElementById('deep-scan');
    const behaviorAnalysis = document.getElementById('behavior-analysis');
    const heuristicDetection = document.getElementById('heuristic-detection');

    if (!fileInput || !scanBtn || !resultDiv || !fileNameSpan) return;

    fileInput.addEventListener('change', function() {
        fileNameSpan.textContent = this.files[0] ? this.files[0].name : 'No file selected';
    });

    scanBtn.addEventListener('click', async function() {
        if (!fileInput.files.length) {
            resultDiv.innerHTML = 'Please select a file to scan';
            return;
        }

        const file = fileInput.files[0];
        const scanOptions = {
            deepScan: deepScan.checked,
            behaviorAnalysis: behaviorAnalysis.checked,
            heuristicDetection: heuristicDetection.checked
        };

        resultDiv.innerHTML = `
            <div class="scan-progress">
                <div class="scan-progress-bar"></div>
                <p class="scanning-animation">AI analyzing file for potential threats...</p>
            </div>
        `;

        const progressBar = resultDiv.querySelector('.scan-progress-bar');
        
        // Simulate scanning progress
        for (let progress = 0; progress <= 100; progress += 20) {
            progressBar.style.width = `${progress}%`;
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        const scanResults = await simulateAIMalwareScan(file, scanOptions);
        
        let resultHtml = `
            <div class="scan-summary">
                <h4>Scan Complete</h4>
                <p><strong>File:</strong> ${file.name}</p>
                <p><strong>Size:</strong> ${formatFileSize(file.size)}</p>
                <p><strong>Scan Type:</strong> AI-Powered ${scanOptions.deepScan ? 'Deep ' : ''}Scan</p>
                <p><strong>Threats Found:</strong> ${scanResults.threats.length}</p>
            </div>
        `;

        if (scanResults.threats.length > 0) {
            resultHtml += `
                <div class="threats-found">
                    <h4>Detected Threats:</h4>
                    ${scanResults.threats.map(threat => `
                        <div class="threat-item">
                            <div class="threat-icon">
                                <i class="fas ${getThreatIcon(threat.type)}"></i>
                            </div>
                            <div class="threat-details">
                                <h5>${threat.name}</h5>
                                <p>${threat.description}</p>
                                <p><strong>Recommendation:</strong> ${threat.recommendation}</p>
                            </div>
                            <span class="threat-level ${threat.severity}">${threat.severity}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            resultHtml += `
                <div class="no-threats">
                    <i class="fas fa-check-circle" style="color: #00C851; font-size: 24px;"></i>
                    <p>No threats detected. File appears to be safe.</p>
                </div>
            `;
        }

        resultDiv.innerHTML = resultHtml;
    });
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getThreatIcon(type) {
    const icons = {
        'virus': 'fa-virus',
        'trojan': 'fa-horse',
        'ransomware': 'fa-lock',
        'spyware': 'fa-eye',
        'malware': 'fa-bug'
    };
    return icons[type] || 'fa-exclamation-triangle';
}

async function simulateAIMalwareScan(file, options) {
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate random threats based on scan options
    const threats = [];
    const shouldAddThreat = Math.random() > 0.7; // 30% chance of finding threats

    if (shouldAddThreat) {
        if (options.deepScan) {
            threats.push({
                name: 'Suspicious Code Pattern',
                type: 'malware',
                description: 'AI detected potentially malicious code patterns.',
                recommendation: 'Quarantine file and run detailed analysis.',
                severity: 'high'
            });
        }

        if (options.behaviorAnalysis) {
            threats.push({
                name: 'Anomalous Behavior',
                type: 'trojan',
                description: 'Unusual system call patterns detected.',
                recommendation: 'Block file execution and investigate.',
                severity: 'medium'
            });
        }

        if (options.heuristicDetection) {
            threats.push({
                name: 'Unknown Variant',
                type: 'virus',
                description: 'Heuristic analysis suggests potential new malware variant.',
                recommendation: 'Submit to cloud analysis for further investigation.',
                severity: 'medium'
            });
        }
    }

    return { threats };
}
