document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let additionalCharges = [];

    // Form elements
    const calculatorForm = document.getElementById('calculatorForm');
    const addChargeBtn = document.getElementById('addChargeBtn');
    const resetBtn = document.getElementById('resetBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const resultsCard = document.getElementById('resultsCard');

    // Add additional charge
    addChargeBtn.addEventListener('click', () => {
        const charge = {
            id: Date.now(),
            description: '',
            amount: 0
        };
        additionalCharges.push(charge);
        renderCharges();
    });

    // Render additional charges
    function renderCharges() {
        const container = document.getElementById('chargesContainer');
        container.innerHTML = additionalCharges.map((charge, index) => `
            <div class="charge mb-3 p-3 border rounded">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="mb-0">Charge #${index + 1}</h6>
                    <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeCharge(${charge.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-2">
                        <input type="text" class="form-control" placeholder="Description" 
                            onchange="updateCharge(${charge.id}, 'description', this.value)">
                    </div>
                    <div class="col-md-6 mb-2">
                        <div class="input-group">
                            <span class="input-group-text">$</span>
                            <input type="number" class="form-control" placeholder="Amount" min="0" step="0.01"
                                onchange="updateCharge(${charge.id}, 'amount', this.value)">
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Update charge
    window.updateCharge = function(id, field, value) {
        const charge = additionalCharges.find(charge => charge.id === id);
        if (charge) {
            charge[field] = value;
        }
    };

    // Remove charge
    window.removeCharge = function(id) {
        additionalCharges = additionalCharges.filter(charge => charge.id !== id);
        renderCharges();
    };

    // Form submission
    calculatorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateBill();
    });

    // Calculate bill
    function calculateBill() {
        const usage = parseFloat(document.getElementById('usage').value);
        const rate = parseFloat(document.getElementById('rate').value);
        const billingPeriod = document.getElementById('billingPeriod').value;

        // Calculate energy cost
        const energyCost = usage * rate;

        // Calculate total additional charges
        const totalAdditionalCharges = additionalCharges.reduce((sum, charge) => sum + parseFloat(charge.amount || 0), 0);

        // Calculate total bill
        const totalBill = energyCost + totalAdditionalCharges;

        // Update results
        document.getElementById('energyCost').textContent = formatCurrency(energyCost);
        document.getElementById('additionalCharges').textContent = formatCurrency(totalAdditionalCharges);
        document.getElementById('totalBill').textContent = formatCurrency(totalBill);

        // Show results card
        resultsCard.style.display = 'block';
    }

    // Format currency
    function formatCurrency(amount) {
        return '$' + amount.toFixed(2);
    }

    // Download report
    downloadBtn.addEventListener('click', function() {
        const element = document.getElementById('resultsCard');
        const opt = {
            margin: 1,
            filename: 'electric-bill-report.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    });

    // Reset form
    resetBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to reset the form? All data will be lost.')) {
            calculatorForm.reset();
            additionalCharges = [];
            renderCharges();
            resultsCard.style.display = 'none';
        }
    });

    // Initialize
    renderCharges();
}); 