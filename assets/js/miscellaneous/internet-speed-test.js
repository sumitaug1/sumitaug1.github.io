document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const serverSelect = document.getElementById('serverSelect');
    const downloadSpeed = document.getElementById('downloadSpeed');
    const uploadSpeed = document.getElementById('uploadSpeed');
    const pingValue = document.getElementById('pingValue');
    const testProgress = document.getElementById('testProgress');
    const startTestBtn = document.getElementById('startTest');
    const historyTable = document.getElementById('historyTable').getElementsByTagName('tbody')[0];

    // Test configuration
    const testConfig = {
        downloadSize: 25 * 1024 * 1024, // 25MB
        uploadSize: 5 * 1024 * 1024,    // 5MB
        testDuration: 10000,            // 10 seconds
        progressInterval: 100           // Update progress every 100ms
    };

    // Server endpoints (simulated)
    const servers = {
        'auto': 'https://speedtest.auto',
        'us-east': 'https://speedtest.us-east',
        'us-west': 'https://speedtest.us-west',
        'eu-central': 'https://speedtest.eu-central',
        'asia-pacific': 'https://speedtest.asia-pacific'
    };

    // Test state
    let isTesting = false;
    let testStartTime;
    let progressInterval;
    let testHistory = JSON.parse(localStorage.getItem('speedTestHistory') || '[]');

    // Initialize
    loadTestHistory();

    // Start speed test
    function startSpeedTest() {
        if (isTesting) return;
        
        isTesting = true;
        startTestBtn.disabled = true;
        startTestBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Testing...';
        
        // Reset values
        downloadSpeed.textContent = '--';
        uploadSpeed.textContent = '--';
        pingValue.textContent = '--';
        testProgress.style.width = '0%';
        
        // Start test sequence
        testStartTime = Date.now();
        progressInterval = setInterval(updateProgress, testConfig.progressInterval);
        
        // Simulate ping test
        simulatePingTest().then(() => {
            // Simulate download test
            simulateDownloadTest().then(() => {
                // Simulate upload test
                simulateUploadTest().then(() => {
                    // Complete test
                    completeTest();
                });
            });
        });
    }

    // Simulate ping test
    function simulatePingTest() {
        return new Promise(resolve => {
            setTimeout(() => {
                const ping = Math.floor(Math.random() * 50) + 10; // Random ping between 10-60ms
                pingValue.textContent = ping;
                resolve();
            }, 1000);
        });
    }

    // Simulate download test
    function simulateDownloadTest() {
        return new Promise(resolve => {
            let downloaded = 0;
            const interval = setInterval(() => {
                downloaded += testConfig.downloadSize / 10;
                const speed = (downloaded / (Date.now() - testStartTime)) * 8 / 1000000; // Convert to Mbps
                downloadSpeed.textContent = speed.toFixed(2);
                
                if (downloaded >= testConfig.downloadSize) {
                    clearInterval(interval);
                    resolve();
                }
            }, 1000);
        });
    }

    // Simulate upload test
    function simulateUploadTest() {
        return new Promise(resolve => {
            let uploaded = 0;
            const interval = setInterval(() => {
                uploaded += testConfig.uploadSize / 10;
                const speed = (uploaded / (Date.now() - testStartTime)) * 8 / 1000000; // Convert to Mbps
                uploadSpeed.textContent = speed.toFixed(2);
                
                if (uploaded >= testConfig.uploadSize) {
                    clearInterval(interval);
                    resolve();
                }
            }, 1000);
        });
    }

    // Update progress bar
    function updateProgress() {
        const elapsed = Date.now() - testStartTime;
        const progress = Math.min((elapsed / testConfig.testDuration) * 100, 100);
        testProgress.style.width = `${progress}%`;
    }

    // Complete test
    function completeTest() {
        clearInterval(progressInterval);
        isTesting = false;
        startTestBtn.disabled = false;
        startTestBtn.innerHTML = '<i class="fas fa-play me-2"></i>Start Test';
        testProgress.style.width = '100%';
        
        // Save test results
        saveTestResults();
    }

    // Save test results
    function saveTestResults() {
        const results = {
            date: new Date().toLocaleString(),
            download: parseFloat(downloadSpeed.textContent),
            upload: parseFloat(uploadSpeed.textContent),
            ping: parseInt(pingValue.textContent),
            server: serverSelect.value
        };
        
        testHistory.unshift(results);
        if (testHistory.length > 10) testHistory.pop();
        
        localStorage.setItem('speedTestHistory', JSON.stringify(testHistory));
        loadTestHistory();
    }

    // Load test history
    function loadTestHistory() {
        historyTable.innerHTML = '';
        testHistory.forEach(result => {
            const row = historyTable.insertRow();
            row.innerHTML = `
                <td>${result.date}</td>
                <td>${result.download.toFixed(2)} Mbps</td>
                <td>${result.upload.toFixed(2)} Mbps</td>
                <td>${result.ping} ms</td>
                <td>${result.server}</td>
            `;
        });
    }

    // Event listeners
    startTestBtn.addEventListener('click', startSpeedTest);
}); 