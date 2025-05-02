document.addEventListener('DOMContentLoaded', function() {
    const loanAmount = document.getElementById('loan-amount');
    const interestRate = document.getElementById('interest-rate');
    const loanTerm = document.getElementById('loan-term');
    const startDate = document.getElementById('start-date');
    const calculateBtn = document.getElementById('calculate');
    const resultContainer = document.getElementById('result-container');
    const amortizationTable = document.getElementById('amortization-table');
    const pieChart = document.getElementById('pie-chart');

    calculateBtn.addEventListener('click', calculateEMI);

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

        displayResults(emi, totalPayment, totalInterest, time, schedule);
        updatePieChart(principal, totalInterest);
    }

    function generateAmortizationSchedule(principal, rate, time, emi, start) {
        let balance = principal;
        const schedule = [];

        for (let i = 1; i <= time; i++) {
            const interest = balance * rate;
            const principalPayment = emi - interest;
            balance -= principalPayment;

            const paymentDate = new Date(start);
            paymentDate.setMonth(start.getMonth() + i);

            schedule.push({
                month: i,
                date: paymentDate,
                payment: emi,
                principal: principalPayment,
                interest: interest,
                balance: Math.max(0, balance)
            });
        }

        return schedule;
    }

    function displayResults(emi, totalPayment, totalInterest, time, schedule) {
        resultContainer.innerHTML = `
            <div class="row">
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Monthly Payment</h5>
                            <p class="display-4">$${emi.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Total Payment</h5>
                            <p class="display-4">$${totalPayment.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Total Interest</h5>
                            <p class="display-4">$${totalInterest.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Loan Term</h5>
                            <p class="display-4">${time} months</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Display amortization schedule
        amortizationTable.innerHTML = `
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Month</th>
                        <th>Payment Date</th>
                        <th>Payment</th>
                        <th>Principal</th>
                        <th>Interest</th>
                        <th>Balance</th>
                    </tr>
                </thead>
                <tbody>
                    ${schedule.map(payment => `
                        <tr>
                            <td>${payment.month}</td>
                            <td>${payment.date.toLocaleDateString()}</td>
                            <td>$${payment.payment.toFixed(2)}</td>
                            <td>$${payment.principal.toFixed(2)}</td>
                            <td>$${payment.interest.toFixed(2)}</td>
                            <td>$${payment.balance.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    function updatePieChart(principal, totalInterest) {
        const total = principal + totalInterest;
        const principalPercentage = (principal / total) * 100;
        const interestPercentage = (totalInterest / total) * 100;

        pieChart.innerHTML = `
            <div class="pie-chart">
                <div class="pie-slice principal" style="--percentage: ${principalPercentage}%">
                    <span class="pie-label">Principal: $${principal.toFixed(2)}</span>
                </div>
                <div class="pie-slice interest" style="--percentage: ${interestPercentage}%">
                    <span class="pie-label">Interest: $${totalInterest.toFixed(2)}</span>
                </div>
            </div>
            <div class="pie-legend">
                <div class="legend-item">
                    <span class="legend-color principal"></span>
                    <span class="legend-label">Principal (${principalPercentage.toFixed(1)}%)</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color interest"></span>
                    <span class="legend-label">Interest (${interestPercentage.toFixed(1)}%)</span>
                </div>
            </div>
        `;
    }

    function showError(message) {
        resultContainer.innerHTML = `
            <div class="alert alert-danger">
                ${message}
            </div>
        `;
        amortizationTable.innerHTML = '';
        pieChart.innerHTML = '';
    }
}); 