document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let items = [];

    // Form elements
    const invoiceForm = document.getElementById('invoiceForm');
    const addItemBtn = document.getElementById('addItemBtn');
    const resetBtn = document.getElementById('resetBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const previewModal = new bootstrap.Modal(document.getElementById('previewModal'));

    // Add item
    addItemBtn.addEventListener('click', () => {
        const item = {
            id: Date.now(),
            description: '',
            quantity: 1,
            price: 0,
            total: 0
        };
        items.push(item);
        renderItems();
    });

    // Render items
    function renderItems() {
        const container = document.getElementById('itemsContainer');
        container.innerHTML = items.map((item, index) => `
            <div class="item-form">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="mb-0">Item #${index + 1}</h6>
                    <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeItem(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-2">
                        <input type="text" class="form-control" placeholder="Description" 
                            onchange="updateItem(${item.id}, 'description', this.value)">
                    </div>
                    <div class="col-md-2 mb-2">
                        <input type="number" class="form-control" placeholder="Qty" min="1" value="1"
                            onchange="updateItem(${item.id}, 'quantity', this.value)">
                    </div>
                    <div class="col-md-2 mb-2">
                        <input type="number" class="form-control" placeholder="Price" min="0" step="0.01" value="0"
                            onchange="updateItem(${item.id}, 'price', this.value)">
                    </div>
                    <div class="col-md-2 mb-2">
                        <input type="text" class="form-control" placeholder="Total" readonly
                            value="${(item.quantity * item.price).toFixed(2)}">
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Update item
    window.updateItem = function(id, field, value) {
        const item = items.find(item => item.id === id);
        if (item) {
            item[field] = value;
            if (field === 'quantity' || field === 'price') {
                item.total = item.quantity * item.price;
            }
            renderItems();
        }
    };

    // Remove item
    window.removeItem = function(id) {
        items = items.filter(item => item.id !== id);
        renderItems();
    };

    // Calculate totals
    function calculateTotals() {
        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        const tax = subtotal * 0.1; // 10% tax
        const total = subtotal + tax;
        return { subtotal, tax, total };
    }

    // Form submission
    invoiceForm.addEventListener('submit', function(e) {
        e.preventDefault();
        generateInvoice();
        previewModal.show();
    });

    // Generate invoice
    function generateInvoice() {
        const companyInfo = {
            name: document.getElementById('companyName').value,
            logo: document.getElementById('companyLogo').value,
            address: document.getElementById('companyAddress').value,
            contact: document.getElementById('companyContact').value
        };

        const clientInfo = {
            name: document.getElementById('clientName').value,
            email: document.getElementById('clientEmail').value,
            address: document.getElementById('clientAddress').value,
            phone: document.getElementById('clientPhone').value
        };

        const invoiceInfo = {
            number: document.getElementById('invoiceNumber').value,
            date: document.getElementById('invoiceDate').value,
            dueDate: document.getElementById('dueDate').value
        };

        const additionalInfo = {
            notes: document.getElementById('notes').value,
            paymentTerms: document.getElementById('paymentTerms').value
        };

        const totals = calculateTotals();

        renderInvoicePreview({
            companyInfo,
            clientInfo,
            invoiceInfo,
            items,
            totals,
            additionalInfo
        });
    }

    // Render invoice preview
    function renderInvoicePreview(data) {
        const preview = document.getElementById('invoicePreview');
        preview.innerHTML = `
            <div class="invoice-preview">
                <div class="invoice-header">
                    <div class="company-info">
                        ${data.companyInfo.logo ? `<img src="${data.companyInfo.logo}" alt="Company Logo" class="logo">` : ''}
                        <h1>${data.companyInfo.name}</h1>
                        <p>${data.companyInfo.address}</p>
                        <p>${data.companyInfo.contact}</p>
                    </div>
                    <div class="invoice-info">
                        <h2>INVOICE</h2>
                        <p><strong>Invoice #:</strong> ${data.invoiceInfo.number}</p>
                        <p><strong>Date:</strong> ${new Date(data.invoiceInfo.date).toLocaleDateString()}</p>
                        <p><strong>Due Date:</strong> ${new Date(data.invoiceInfo.dueDate).toLocaleDateString()}</p>
                    </div>
                </div>

                <div class="invoice-details">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="client-info">
                                <h3>Bill To:</h3>
                                <p><strong>${data.clientInfo.name}</strong></p>
                                <p>${data.clientInfo.address}</p>
                                <p>Email: ${data.clientInfo.email}</p>
                                ${data.clientInfo.phone ? `<p>Phone: ${data.clientInfo.phone}</p>` : ''}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="invoice-items">
                    <table>
                        <thead>
                            <tr>
                                <th class="item-description">Description</th>
                                <th class="item-quantity">Quantity</th>
                                <th class="item-price">Price</th>
                                <th class="item-total">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.items.map(item => `
                                <tr>
                                    <td>${item.description}</td>
                                    <td class="text-end">${item.quantity}</td>
                                    <td class="text-end">$${item.price.toFixed(2)}</td>
                                    <td class="text-end">$${item.total.toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <div class="invoice-totals">
                    <table>
                        <tr>
                            <td class="total-label">Subtotal:</td>
                            <td class="total-value">$${data.totals.subtotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td class="total-label">Tax (10%):</td>
                            <td class="total-value">$${data.totals.tax.toFixed(2)}</td>
                        </tr>
                        <tr class="total-row">
                            <td class="total-label">Total:</td>
                            <td class="total-value">$${data.totals.total.toFixed(2)}</td>
                        </tr>
                    </table>
                </div>

                <div class="invoice-footer">
                    ${data.additionalInfo.notes ? `
                        <div class="notes">
                            <h3>Notes:</h3>
                            <p>${data.additionalInfo.notes}</p>
                        </div>
                    ` : ''}
                    ${data.additionalInfo.paymentTerms ? `
                        <div class="payment-terms">
                            <h3>Payment Terms:</h3>
                            <p>${data.additionalInfo.paymentTerms}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // Download PDF
    downloadBtn.addEventListener('click', function() {
        const element = document.getElementById('invoicePreview');
        const opt = {
            margin: 1,
            filename: 'invoice.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    });

    // Reset form
    resetBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to reset the form? All data will be lost.')) {
            invoiceForm.reset();
            items = [];
            renderItems();
        }
    });

    // Initialize items
    renderItems();
}); 