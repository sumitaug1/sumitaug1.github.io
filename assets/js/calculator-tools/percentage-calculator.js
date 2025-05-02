document.addEventListener('DOMContentLoaded', function() {
    const modeSelect = document.getElementById('mode');
    const inputContainer = document.getElementById('input-container');
    const resultContainer = document.getElementById('result-container');
    const calculateBtn = document.getElementById('calculate');
    const result = document.getElementById('result');

    // Update input fields based on selected mode
    modeSelect.addEventListener('change', updateInputFields);

    // Calculate button click handler
    calculateBtn.addEventListener('click', calculate);

    function updateInputFields() {
        const mode = modeSelect.value;
        inputContainer.innerHTML = '';

        switch(mode) {
            case 'what-is-x-of-y':
                inputContainer.innerHTML = `
                    <div class="mb-3">
                        <label for="x" class="form-label">X (%)</label>
                        <input type="number" class="form-control" id="x" required>
                    </div>
                    <div class="mb-3">
                        <label for="y" class="form-label">Y</label>
                        <input type="number" class="form-control" id="y" required>
                    </div>
                `;
                break;
            case 'x-is-what-of-y':
                inputContainer.innerHTML = `
                    <div class="mb-3">
                        <label for="x" class="form-label">X</label>
                        <input type="number" class="form-control" id="x" required>
                    </div>
                    <div class="mb-3">
                        <label for="y" class="form-label">Y</label>
                        <input type="number" class="form-control" id="y" required>
                    </div>
                `;
                break;
            case 'increase-by':
                inputContainer.innerHTML = `
                    <div class="mb-3">
                        <label for="x" class="form-label">X</label>
                        <input type="number" class="form-control" id="x" required>
                    </div>
                    <div class="mb-3">
                        <label for="y" class="form-label">Y (%)</label>
                        <input type="number" class="form-control" id="y" required>
                    </div>
                `;
                break;
            case 'decrease-by':
                inputContainer.innerHTML = `
                    <div class="mb-3">
                        <label for="x" class="form-label">X</label>
                        <input type="number" class="form-control" id="x" required>
                    </div>
                    <div class="mb-3">
                        <label for="y" class="form-label">Y (%)</label>
                        <input type="number" class="form-control" id="y" required>
                    </div>
                `;
                break;
            case 'percentage-change':
                inputContainer.innerHTML = `
                    <div class="mb-3">
                        <label for="x" class="form-label">From X</label>
                        <input type="number" class="form-control" id="x" required>
                    </div>
                    <div class="mb-3">
                        <label for="y" class="form-label">To Y</label>
                        <input type="number" class="form-control" id="y" required>
                    </div>
                `;
                break;
        }
    }

    function calculate() {
        const mode = modeSelect.value;
        const x = parseFloat(document.getElementById('x').value);
        const y = parseFloat(document.getElementById('y').value);

        if (isNaN(x) || isNaN(y)) {
            result.textContent = 'Please enter valid numbers';
            return;
        }

        let calculation;
        switch(mode) {
            case 'what-is-x-of-y':
                calculation = (x / 100) * y;
                result.textContent = `${x}% of ${y} = ${calculation}`;
                break;
            case 'x-is-what-of-y':
                calculation = (x / y) * 100;
                result.textContent = `${x} is ${calculation}% of ${y}`;
                break;
            case 'increase-by':
                calculation = x * (1 + y/100);
                result.textContent = `${x} increased by ${y}% = ${calculation}`;
                break;
            case 'decrease-by':
                calculation = x * (1 - y/100);
                result.textContent = `${x} decreased by ${y}% = ${calculation}`;
                break;
            case 'percentage-change':
                calculation = ((y - x) / x) * 100;
                result.textContent = `Percentage change from ${x} to ${y} = ${calculation}%`;
                break;
        }
    }

    // Initialize input fields
    updateInputFields();
}); 