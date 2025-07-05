document.addEventListener('DOMContentLoaded', function() {
    // Global variables
    let currentLoanType = 'home';
    let isRecording = false;
    let pieChart = null;
    let lineChart = null;
    let trendChart = null;
    let currentCalculation = null;
    let currentCurrency = 'USD';
    let currentCurrencySymbol = '$';

    // Elements
    const loanAmount = document.getElementById('loan-amount');
    const interestRate = document.getElementById('interest-rate');
    const loanTerm = document.getElementById('loan-term');
    const startDate = document.getElementById('start-date');
    const calculateBtn = document.getElementById('calculate');
    const resultContainer = document.getElementById('result-container');
    const amortizationTable = document.getElementById('amortization-table');

    // Loan type configurations
    const loanTypes = {
        home: {
            name: 'Home Loan',
            icon: '🏠',
            defaultRate: 6.5,
            maxTerm: 360,
            tips: [
                'Consider a 20% down payment to avoid PMI',
                'Compare rates from multiple lenders',
                'Factor in property taxes and insurance'
            ]
        },
        car: {
            name: 'Car Loan',
            icon: '🚗',
            defaultRate: 4.5,
            maxTerm: 84,
            tips: [
                'Shorter terms usually have lower rates',
                'Consider total cost, not just monthly payment',
                'Check for manufacturer incentives'
            ]
        },
        personal: {
            name: 'Personal Loan',
            icon: '💳',
            defaultRate: 9.5,
            maxTerm: 60,
            tips: [
                'Use for debt consolidation if rate is lower',
                'Avoid using for discretionary spending',
                'Check for origination fees'
            ]
        },
        business: {
            name: 'Business Loan',
            icon: '🏢',
            defaultRate: 7.5,
            maxTerm: 120,
            tips: [
                'Have a solid business plan ready',
                'Consider SBA loans for better terms',
                'Prepare financial statements'
            ]
        },
        education: {
            name: 'Education Loan',
            icon: '🎓',
            defaultRate: 5.5,
            maxTerm: 120,
            tips: [
                'Exhaust federal loan options first',
                'Consider income-driven repayment plans',
                'Look into loan forgiveness programs'
            ]
        }
    };

    // Initialize
    initializeEventListeners();
    initializeLoanTypeSelector();
    setDefaultValues();
    initializeCharts();

    // Event Listeners
    function initializeEventListeners() {
        calculateBtn.addEventListener('click', calculateEMI);
        
        // Auto-calculate on input change
        [loanAmount, interestRate, loanTerm].forEach(input => {
            input.addEventListener('input', () => {
                if (loanAmount.value && interestRate.value && loanTerm.value) {
                    calculateEMI();
                }
            });
        });

        // Set default date
        if (startDate) {
            startDate.value = new Date().toISOString().split('T')[0];
        }

        // Prepayment type selector
        const prepaymentType = document.getElementById('prepayment-type');
        if (prepaymentType) {
            prepaymentType.addEventListener('change', function() {
                const amountInput = document.getElementById('prepayment-amount');
                const percentageContainer = document.getElementById('prepayment-percentage-container');
                const prepaymentLabel = document.getElementById('prepayment-label');
                
                if (this.value === 'percentage') {
                    amountInput.style.display = 'none';
                    percentageContainer.style.display = 'block';
                    prepaymentLabel.textContent = 'Prepayment Percentage';
                    console.log('Switched to percentage mode');
                } else {
                    amountInput.style.display = 'block';
                    percentageContainer.style.display = 'none';
                    prepaymentLabel.textContent = 'Prepayment Amount';
                    console.log('Switched to amount mode');
                }
            });
        }

        // Currency selector
        const currencySelector = document.getElementById('currency-selector');
        if (currencySelector) {
            currencySelector.addEventListener('change', function() {
                const selectedOption = this.options[this.selectedIndex];
                currentCurrency = this.value;
                currentCurrencySymbol = selectedOption.getAttribute('data-symbol');
                
                // Update currency symbol in loan amount input
                const currencySymbol = document.getElementById('currency-symbol');
                if (currencySymbol) {
                    currencySymbol.textContent = currentCurrencySymbol;
                }
                
                // Recalculate if we have values
                if (loanAmount.value && interestRate.value && loanTerm.value) {
                    calculateEMI();
                }
                
                showNotification(`Currency changed to ${currentCurrency}`, 'info');
            });
        }
    }

    // Loan Type Selector
    function initializeLoanTypeSelector() {
        const loanTypeBtns = document.querySelectorAll('.loan-type-btn');
        loanTypeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                loanTypeBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentLoanType = this.dataset.type;
                updateLoanTypeDefaults();
                showNotification(`Switched to ${loanTypes[currentLoanType].name}`, 'info');
            });
        });
    }

    function updateLoanTypeDefaults() {
        const loanType = loanTypes[currentLoanType];
        if (!interestRate.value) {
            interestRate.value = loanType.defaultRate;
        }
        if (!loanTerm.value) {
            loanTerm.value = Math.min(loanType.maxTerm, 60);
        }
        updateSmartTips();
    }

    function setDefaultValues() {
        if (!interestRate.value) {
            interestRate.value = loanTypes[currentLoanType].defaultRate;
        }
        if (!loanTerm.value) {
            loanTerm.value = 60;
        }
    }

    // AI Suggestions
    window.generateAISuggestions = function() {
        const amount = parseFloat(loanAmount.value) || 200000;
        const income = parseFloat(document.getElementById('monthly-income')?.value) || 5000;
        
        const suggestions = [
            {
                title: 'Optimal Loan Amount',
                suggestion: `Based on your income, consider a loan amount around ${currentCurrencySymbol}${Math.round(amount * 0.8).toLocaleString()}`,
                reason: 'This keeps your debt-to-income ratio below 40%'
            },
            {
                title: 'Interest Rate Optimization',
                suggestion: 'Shop around for rates - even 0.5% difference can save thousands',
                reason: `On a ${currentCurrencySymbol}200k loan, 0.5% lower rate saves ~${currentCurrencySymbol}20k over 30 years`
            },
            {
                title: 'Loan Term Recommendation',
                suggestion: 'Consider a 15-year term if you can afford higher payments',
                reason: 'You\'ll pay significantly less interest overall'
            }
        ];

        const suggestionsHtml = suggestions.map(s => `
            <div class="alert alert-info">
                <h6><i class="fas fa-lightbulb me-2"></i>${s.title}</h6>
                <p class="mb-1"><strong>${s.suggestion}</strong></p>
                <small class="text-muted">${s.reason}</small>
            </div>
        `).join('');

        document.getElementById('aiSuggestions').innerHTML = `
            <h5><i class="fas fa-magic me-2"></i>AI-Powered Loan Suggestions</h5>
            ${suggestionsHtml}
            <button class="btn btn-light btn-sm" onclick="generateAISuggestions()">
                <i class="fas fa-sync"></i> Refresh Suggestions
            </button>
        `;

        showNotification('AI suggestions generated!', 'success');
    };

    // Voice Input
    window.startVoiceInput = function(targetId) {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            showNotification('Voice input not supported in this browser', 'error');
            return;
        }

        const targetInput = document.getElementById(targetId);
        const voiceBtn = targetInput.parentNode.querySelector('.voice-input-btn');
        
        if (isRecording) {
            stopVoiceInput();
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = function() {
            isRecording = true;
            if (voiceBtn) {
                voiceBtn.classList.add('recording');
                voiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
            }
            showNotification('Listening... Speak the amount!', 'info');
        };

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            const number = extractNumber(transcript);
            if (number) {
                targetInput.value = number;
                showNotification(`Voice input: ${number}`, 'success');
                if (loanAmount.value && interestRate.value && loanTerm.value) {
                    calculateEMI();
                }
            } else {
                showNotification('Could not understand the number. Please try again.', 'error');
            }
        };

        recognition.onerror = function(event) {
            showNotification('Voice input error: ' + event.error, 'error');
        };

        recognition.onend = function() {
            isRecording = false;
            if (voiceBtn) {
                voiceBtn.classList.remove('recording');
                voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            }
        };

        recognition.start();
    };

    function extractNumber(text) {
        const numbers = text.match(/\d+/g);
        if (numbers) {
            return numbers.join('');
        }
        return null;
    }

    function stopVoiceInput() {
        isRecording = false;
        const voiceBtn = document.querySelector('.voice-input-btn.recording');
        if (voiceBtn) {
            voiceBtn.classList.remove('recording');
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        }
    }

    // Main EMI Calculation
    function calculateEMI() {
        const principal = parseFloat(loanAmount.value);
        const rate = parseFloat(interestRate.value) / 100 / 12; // Monthly interest rate
        const time = parseInt(loanTerm.value);
        const start = new Date(startDate.value);

        if (isNaN(principal) || isNaN(rate) || isNaN(time) || isNaN(start.getTime())) {
            showError('Please enter valid values for all fields');
            return;
        }

        // Calculate EMI
        const emi = principal * rate * Math.pow(1 + rate, time) / (Math.pow(1 + rate, time) - 1);
        const totalPayment = emi * time;
        const totalInterest = totalPayment - principal;

        // Generate amortization schedule
        const schedule = generateAmortizationSchedule(principal, rate, time, emi, start);

        // Store current calculation
        currentCalculation = {
            emi, totalPayment, totalInterest, time, schedule, principal, rate
        };

        displayResults(emi, totalPayment, totalInterest, time, schedule);
        updateCharts(principal, totalInterest, schedule);
        updateFinancialAnalysis();
        showNotification('EMI calculated successfully!', 'success');
    }

    function generateAmortizationSchedule(principal, rate, time, emi, start) {
        let balance = principal;
        let totalInterestPaid = 0;
        const schedule = [];

        for (let i = 1; i <= time; i++) {
            const interest = balance * rate;
            const principalPayment = emi - interest;
            balance -= principalPayment;
            totalInterestPaid += interest;

            const paymentDate = new Date(start);
            paymentDate.setMonth(start.getMonth() + i);

            schedule.push({
                month: i,
                date: paymentDate,
                payment: emi,
                principal: principalPayment,
                interest: interest,
                balance: Math.max(0, balance),
                totalInterestPaid: totalInterestPaid
            });
        }

        return schedule;
    }

    function displayResults(emi, totalPayment, totalInterest, time, schedule) {
        resultContainer.innerHTML = `
            <div class="emi-display">${currentCurrencySymbol}${emi.toFixed(2)}</div>
            <div class="summary-grid">
                <div class="summary-item">
                    <div class="summary-value">${currentCurrencySymbol}${totalPayment.toFixed(2)}</div>
                    <div class="summary-label">Total Payment</div>
                </div>
                <div class="summary-item">
                    <div class="summary-value">${currentCurrencySymbol}${totalInterest.toFixed(2)}</div>
                    <div class="summary-label">Total Interest</div>
                </div>
                <div class="summary-item">
                    <div class="summary-value">${time}</div>
                    <div class="summary-label">Loan Term (months)</div>
                </div>
                <div class="summary-item">
                    <div class="summary-value">${((totalInterest / totalPayment) * 100).toFixed(1)}%</div>
                    <div class="summary-label">Interest Percentage</div>
                </div>
            </div>
        `;

        // Display amortization schedule
        const tbody = amortizationTable.querySelector('tbody');
        tbody.innerHTML = schedule.map(payment => `
            <tr>
                <td>${payment.month}</td>
                <td>${payment.date.toLocaleDateString()}</td>
                <td>${currentCurrencySymbol}${payment.payment.toFixed(2)}</td>
                <td>${currentCurrencySymbol}${payment.principal.toFixed(2)}</td>
                <td>${currentCurrencySymbol}${payment.interest.toFixed(2)}</td>
                <td>${currentCurrencySymbol}${payment.balance.toFixed(2)}</td>
                <td>${currentCurrencySymbol}${payment.totalInterestPaid.toFixed(2)}</td>
                <td></td>
            </tr>
        `).join('');
    }

    // Charts
    function initializeCharts() {
        // Initialize Chart.js charts
        const pieCtx = document.getElementById('pieChart')?.getContext('2d');
        const lineCtx = document.getElementById('lineChart')?.getContext('2d');
        const trendCtx = document.getElementById('trendChart')?.getContext('2d');

        if (pieCtx) {
            pieChart = new Chart(pieCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Principal', 'Interest'],
                    datasets: [{
                        data: [0, 0],
                        backgroundColor: ['#2563eb', '#7c3aed']
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        if (lineCtx) {
            lineChart = new Chart(lineCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Principal',
                        data: [],
                        borderColor: '#2563eb',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)'
                    }, {
                        label: 'Interest',
                        data: [],
                        borderColor: '#7c3aed',
                        backgroundColor: 'rgba(124, 58, 237, 0.1)'
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        if (trendCtx) {
            trendChart = new Chart(trendCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Balance',
                        data: [],
                        borderColor: '#059669',
                        backgroundColor: 'rgba(5, 150, 105, 0.1)'
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    }

    function updateCharts(principal, totalInterest, schedule) {
        if (pieChart) {
            pieChart.data.datasets[0].data = [principal, totalInterest];
            pieChart.update();
        }

        if (lineChart && schedule.length > 0) {
            const labels = schedule.slice(0, 12).map(p => `Month ${p.month}`);
            const principalData = schedule.slice(0, 12).map(p => p.principal);
            const interestData = schedule.slice(0, 12).map(p => p.interest);

            lineChart.data.labels = labels;
            lineChart.data.datasets[0].data = principalData;
            lineChart.data.datasets[1].data = interestData;
            lineChart.update();
        }

        if (trendChart && schedule.length > 0) {
            const labels = schedule.map(p => `Month ${p.month}`);
            const balanceData = schedule.map(p => p.balance);

            trendChart.data.labels = labels;
            trendChart.data.datasets[0].data = balanceData;
            trendChart.update();
        }
    }

    // Loan Comparison
    window.compareLoans = function() {
        const amountA = parseFloat(document.getElementById('compare-amount-a').value);
        const rateA = parseFloat(document.getElementById('compare-rate-a').value);
        const termA = parseInt(document.getElementById('compare-term-a').value);

        const amountB = parseFloat(document.getElementById('compare-amount-b').value);
        const rateB = parseFloat(document.getElementById('compare-rate-b').value);
        const termB = parseInt(document.getElementById('compare-term-b').value);

        if (!amountA || !rateA || !termA || !amountB || !rateB || !termB) {
            showNotification('Please fill all comparison fields', 'error');
            return;
        }

        const emiA = calculateEMIForComparison(amountA, rateA, termA);
        const emiB = calculateEMIForComparison(amountB, rateB, termB);
        const totalA = emiA * termA;
        const totalB = emiB * termB;

        const comparisonResults = document.getElementById('comparison-results');
        comparisonResults.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Scenario A</h6>
                    <p>EMI: ${currentCurrencySymbol}${emiA.toFixed(2)}</p>
                    <p>Total: ${currentCurrencySymbol}${totalA.toFixed(2)}</p>
                </div>
                <div class="col-md-6">
                    <h6>Scenario B</h6>
                    <p>EMI: ${currentCurrencySymbol}${emiB.toFixed(2)}</p>
                    <p>Total: ${currentCurrencySymbol}${totalB.toFixed(2)}</p>
                </div>
            </div>
            <div class="mt-3">
                <strong>Difference:</strong> ${currentCurrencySymbol}${Math.abs(totalA - totalB).toFixed(2)} 
                (${totalA > totalB ? 'Scenario B saves' : 'Scenario A saves'})
            </div>
        `;

        showNotification('Loan comparison completed!', 'success');
    };

    function calculateEMIForComparison(principal, rate, time) {
        const monthlyRate = rate / 100 / 12;
        return principal * monthlyRate * Math.pow(1 + monthlyRate, time) / (Math.pow(1 + monthlyRate, time) - 1);
    }

    // Prepayment Calculator
    window.calculatePrepayment = function() {
        if (!currentCalculation) {
            showNotification('Please calculate EMI first', 'error');
            return;
        }

        const prepaymentType = document.getElementById('prepayment-type').value;
        const prepaymentMonth = parseInt(document.getElementById('prepayment-month').value);
        
        let prepaymentAmount = 0;
        
        if (prepaymentType === 'amount') {
            prepaymentAmount = parseFloat(document.getElementById('prepayment-amount').value);
        } else if (prepaymentType === 'percentage') {
            const percentage = parseFloat(document.getElementById('prepayment-percentage').value);
            if (!percentage || percentage <= 0 || percentage > 100) {
                showNotification('Please enter a valid percentage (1-100)', 'error');
                return;
            }
            const { schedule } = currentCalculation;
            const remainingBalance = schedule[prepaymentMonth - 1]?.balance || currentCalculation.principal;
            prepaymentAmount = (remainingBalance * percentage) / 100;
        }

        if (!prepaymentAmount || !prepaymentMonth) {
            showNotification('Please enter prepayment details', 'error');
            return;
        }

        const { principal, rate, time, schedule } = currentCalculation;
        const remainingBalance = schedule[prepaymentMonth - 1]?.balance || principal;
        const newBalance = remainingBalance - prepaymentAmount;

        if (newBalance <= 0) {
            showNotification('Prepayment amount exceeds remaining balance', 'error');
            return;
        }

        // Calculate new EMI with reduced balance
        const remainingMonths = time - prepaymentMonth + 1;
        const newEMI = newBalance * rate * Math.pow(1 + rate, remainingMonths) / (Math.pow(1 + rate, remainingMonths) - 1);
        const originalEMI = currentCalculation.emi;
        const savings = (originalEMI - newEMI) * remainingMonths;

        // Generate new amortization schedule after prepayment
        const newSchedule = generateAmortizationScheduleAfterPrepayment(
            newBalance, 
            rate, 
            remainingMonths, 
            newEMI, 
            schedule[prepaymentMonth - 1].date,
            prepaymentMonth
        );

        const prepaymentResults = document.getElementById('prepayment-results');
        const prepaymentTypeText = prepaymentType === 'percentage' ? 
            `${document.getElementById('prepayment-percentage').value}% of balance` : 
            `${currentCurrencySymbol}${prepaymentAmount.toFixed(2)}`;

        prepaymentResults.innerHTML = `
            <div class="alert alert-success">
                <h6>Prepayment Analysis</h6>
                <p><strong>Prepayment:</strong> ${prepaymentTypeText}</p>
                <p><strong>Remaining Balance:</strong> ${currentCurrencySymbol}${remainingBalance.toFixed(2)}</p>
                <p><strong>New Balance:</strong> ${currentCurrencySymbol}${newBalance.toFixed(2)}</p>
                <p><strong>New EMI:</strong> ${currentCurrencySymbol}${newEMI.toFixed(2)} (was ${currentCurrencySymbol}${originalEMI.toFixed(2)})</p>
                <p><strong>Monthly Savings:</strong> ${currentCurrencySymbol}${(originalEMI - newEMI).toFixed(2)}</p>
                <p><strong>Total Savings:</strong> ${currentCurrencySymbol}${savings.toFixed(2)}</p>
                <p><strong>New Loan Term:</strong> ${remainingMonths} months</p>
                <p><strong>Interest Saved:</strong> ${currentCurrencySymbol}${(currentCalculation.totalInterest - (newEMI * remainingMonths - newBalance)).toFixed(2)}</p>
            </div>
        `;

        // Update amortization schedule with new schedule
        updateAmortizationSchedule(newSchedule, prepaymentMonth);

        showNotification('Prepayment calculation completed!', 'success');
    };

    // Generate new amortization schedule after prepayment
    function generateAmortizationScheduleAfterPrepayment(newBalance, rate, remainingMonths, newEMI, startDate, prepaymentMonth) {
        let balance = newBalance;
        let totalInterestPaid = 0;
        const schedule = [];

        for (let i = 1; i <= remainingMonths; i++) {
            const interest = balance * rate;
            const principalPayment = newEMI - interest;
            balance -= principalPayment;
            totalInterestPaid += interest;

            const paymentDate = new Date(startDate);
            paymentDate.setMonth(startDate.getMonth() + i);

            schedule.push({
                month: prepaymentMonth + i - 1, // Continue from prepayment month
                date: paymentDate,
                payment: newEMI,
                principal: principalPayment,
                interest: interest,
                balance: Math.max(0, balance),
                totalInterestPaid: totalInterestPaid,
                isAfterPrepayment: true
            });
        }

        return schedule;
    }

    // Update amortization schedule display
    function updateAmortizationSchedule(newSchedule, prepaymentMonth) {
        const tbody = amortizationTable.querySelector('tbody');
        
        // Get original schedule up to prepayment month
        const originalSchedule = currentCalculation.schedule.slice(0, prepaymentMonth - 1);
        
        // Combine original schedule with new schedule
        const combinedSchedule = [...originalSchedule, ...newSchedule];
        
        tbody.innerHTML = combinedSchedule.map(payment => `
            <tr class="${payment.isAfterPrepayment ? 'table-warning' : ''}">
                <td>${payment.month}</td>
                <td>${payment.date.toLocaleDateString()}</td>
                <td>${currentCurrencySymbol}${payment.payment.toFixed(2)}</td>
                <td>${currentCurrencySymbol}${payment.principal.toFixed(2)}</td>
                <td>${currentCurrencySymbol}${payment.interest.toFixed(2)}</td>
                <td>${currentCurrencySymbol}${payment.balance.toFixed(2)}</td>
                <td>${currentCurrencySymbol}${payment.totalInterestPaid.toFixed(2)}</td>
                ${payment.isAfterPrepayment ? '<td><span class="badge bg-warning">After Prepayment</span></td>' : '<td></td>'}
            </tr>
        `).join('');
    }

    // Affordability Calculator
    window.calculateAffordability = function() {
        const monthlyIncome = parseFloat(document.getElementById('monthly-income').value);
        const monthlyExpenses = parseFloat(document.getElementById('monthly-expenses').value);
        const downPayment = parseFloat(document.getElementById('down-payment').value);

        if (!monthlyIncome || !monthlyExpenses) {
            showNotification('Please enter income and expenses', 'error');
            return;
        }

        const disposableIncome = monthlyIncome - monthlyExpenses;
        const maxEMI = disposableIncome * 0.4; // 40% rule
        const maxLoanAmount = calculateMaxLoanAmount(maxEMI, 6.5, 360); // Assuming 6.5% rate, 30 years

        const affordabilityResults = document.getElementById('affordability-results');
        affordabilityResults.innerHTML = `
            <div class="alert alert-info">
                <h6>Affordability Analysis</h6>
                <p><strong>Disposable Income:</strong> ${currentCurrencySymbol}${disposableIncome.toFixed(2)}</p>
                <p><strong>Maximum EMI (40% rule):</strong> ${currentCurrencySymbol}${maxEMI.toFixed(2)}</p>
                <p><strong>Maximum Loan Amount:</strong> ${currentCurrencySymbol}${maxLoanAmount.toFixed(2)}</p>
                <p><strong>Maximum Property Value:</strong> ${currentCurrencySymbol}${(maxLoanAmount + (downPayment || 0)).toFixed(2)}</p>
            </div>
        `;
    }
});
