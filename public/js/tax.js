document.addEventListener("DOMContentLoaded", function() {
    const invoiceElement = document.querySelector('.invoice');
    const invPrice = parseFloat(invoiceElement.getAttribute('data-inv-price'));
    const tax = parseFloat(invoiceElement.getAttribute('data-tax'));
    const total = parseFloat(invoiceElement.getAttribute('data-total'));

    function formatCurrency(value) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    }

    document.getElementById('item-price').innerText = formatCurrency(invPrice);
    document.getElementById('tax').innerText = formatCurrency(tax);
    document.getElementById('total').innerText = formatCurrency(total);
});
