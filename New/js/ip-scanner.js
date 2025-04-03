// IP Scanner Tool for CyberSecurity Hub

document.addEventListener('DOMContentLoaded', function() {
    // Initialize IP scanner
    const ipScanner = document.getElementById('ip-scanner');
    const ipResult = document.getElementById('ip-result');
    const ipScanBtn = document.getElementById('ip-scan-btn');
    
    // Function to get user's IP address - simplified to always work offline
    async function getUserIP() {
        // For demo purposes, always return a simulated IP
        // This ensures functionality even without internet
        return simulateIP();
    }
    
    // Function to simulate an IP address
    function simulateIP() {
        const octets = [];
        for (let i = 0; i < 4; i++) {
            octets.push(Math.floor(Math.random() * 256));
        }
        return octets.join('.');
    }
    
    // Function to display IP with a typing effect
    function displayIP(ip) {
        if (ipResult) {
            ipResult.textContent = ip;
            // Add a small animation when complete
            ipResult.classList.add('pulse');
            setTimeout(() => {
                ipResult.classList.remove('pulse');
            }, 1000);
        }
    }
    
    // Scan IP when the scanner tool is clicked
    if (ipScanner) {
        ipScanner.addEventListener('click', async function() {
            ipResult.textContent = 'Scanning...';
            const ip = await getUserIP();
            displayIP(ip);
        });
    }
    
    // Also handle the scan button in the tools section
    if (ipScanBtn) {
        ipScanBtn.addEventListener('click', async function() {
            let toolResult = document.getElementById('ip-scan-result');
            
            if (!toolResult) {
                const newResult = document.createElement('div');
                newResult.className = 'tool-result';
                newResult.id = 'ip-scan-result';
                this.parentElement.appendChild(newResult);
                toolResult = newResult;
            }
            
            toolResult.textContent = 'Scanning...';
            toolResult.style.display = 'block';
            
            const ip = await getUserIP();
            const ipInfo = analyzeIP(ip);
            
            // Display detailed results
            let resultHTML = `<div class="ip-info">
                <p><strong>Your IP:</strong> ${ip}</p>
                <p><strong>Classification:</strong> ${ipInfo.classification}</p>
                <p><strong>Segments:</strong> ${ipInfo.segments.join('.')}</p>
                <p><strong>Binary:</strong> ${ipInfo.segments.map(s => parseInt(s).toString(2).padStart(8, '0')).join('.')}</p>
                <p><strong>Note:</strong> This is a simulated IP for demonstration purposes.</p>
            </div>`;
            
            toolResult.innerHTML = resultHTML;
        });
    }
    
    // Initialize IP scan on page load immediately
    setTimeout(async function() {
        if (ipResult) {
            const ip = await getUserIP();
            displayIP(ip);
        }
    }, 500);
});

// Additional IP information functions
function analyzeIP(ip) {
    // Parse the IP address segments
    const segments = ip.split('.');
    let classification = 'Unknown';
    
    if (segments.length === 4) {
        const firstOctet = parseInt(segments[0]);
        
        if (firstOctet === 10 || 
            (firstOctet === 172 && parseInt(segments[1]) >= 16 && parseInt(segments[1]) <= 31) ||
            (firstOctet === 192 && parseInt(segments[1]) === 168)) {
            classification = 'Private IP';
        } else if (firstOctet === 127) {
            classification = 'Localhost';
        } else {
            classification = 'Public IP';
        }
    }
    
    return {
        classification: classification,
        segments: segments,
        timestamp: new Date().toISOString(),
        scanId: Math.random().toString(36).substring(2, 15)
    };
}
