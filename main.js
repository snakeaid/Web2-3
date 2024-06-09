window.onload = function () {
    seedValues();
}

function seedValues() {
    createProductItem("Помідори");
    createProductItem("Печиво");
    createProductItem("Сир");
}

const container = document.getElementById('container');

container.onclick = function (event) {
    let amount;
    let amountText;
    let minusButton;
    let productLabel;

    if (event.target.className === 'product-delete') {
        event.target.closest('.product-item').remove();
    }

    if (event.target.classList.contains('minus-button')) {
        amountText = event.target.nextElementSibling;
        amount = parseInt(amountText.textContent);
        if (amount > 1) {
            amountText.textContent = amount - 1;
        }
        if (amountText.textContent == 1) {
            event.target.classList.add('semi-transparent');
        }
    }

    if (event.target.classList.contains('plus-button')) {
        amountText = event.target.previousElementSibling;
        amount = parseInt(amountText.textContent);
        amountText.textContent = amount + 1;

        minusButton = amountText.previousElementSibling;

        minusButton.classList.remove('semi-transparent');
    }

    if (event.target.classList.contains('product-state')) {
        const stateButton = event.target;
        const productItem = stateButton.closest('.product-item');
        productLabel = productItem.querySelector('.product-label');
        minusButton = productItem.querySelector('.minus-button');
        const plusButton = productItem.querySelector('.plus-button');
        const deleteButton = productItem.querySelector('.product-delete');

        if (stateButton.textContent === 'Не куплено') {
            stateButton.textContent = 'Куплено';
            productLabel.classList.add('crossed-out');
            minusButton.style.display = 'none';
            plusButton.style.display = 'none';
            deleteButton.style.display = 'none';
        } else {
            stateButton.textContent = 'Не куплено';
            productLabel.classList.remove('crossed-out');
            minusButton.style.display = '';
            plusButton.style.display = '';
            deleteButton.style.display = '';
        }
    }

    if (event.target.classList.contains('product-label')) {
        productLabel = event.target;
        const productName = productLabel.textContent;

        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.value = productName;

        const productLabelWidth = parseFloat(window.getComputedStyle(productLabel).width);
        const adjustedWidth = productLabelWidth - 8;
        inputField.style.width = adjustedWidth + 'px';

        productLabel.replaceWith(inputField);

        inputField.focus();

        inputField.addEventListener('focusout', function () {
            const updatedProductName = inputField.value;

            inputField.replaceWith(productLabel);
            productLabel.textContent = updatedProductName;
        });
    }

    updateStats();
};

function createProductItem(productName, amount = 1, isBought = false) {
    const newListItem = document.createElement('li');

    newListItem.className = 'product-item';

    newListItem.innerHTML = `
        <p class="product-label">${productName}</p>
        <div class="product-amount">
            <button class="minus-button round-button semi-transparent" data-tooltip="Зменшити кількість">-</button>
            <p class="amount-text">${amount}</p>
            <button class="plus-button round-button" data-tooltip="Збільшити кількість">+</button>
        </div>
        <div class="product-control">
            <button class="product-state" data-tooltip="Статус">${isBought ? "Куплено" : "Не куплено"}</button>
            <button class="product-delete" data-tooltip="Видалити продукт">×</button>
        </div>
    `;

    document.querySelector('.product-list').appendChild(newListItem);

    updateStats();
}

document.addEventListener('keydown', function(event){
    if(event.key === 'Enter' && document.getElementById('product-name') === document.activeElement) {
        addNewProduct();
    }
});
document.getElementById('add-product-button').onclick = addNewProduct;

function addNewProduct() {
    const productName = document.getElementById('product-name');
    if(productName.value === '') {
        alert('Введіть назву продукту');
        return;
    }
    createProductItem(productName.value);
    productName.value = '';
    productName.focus();
}

function updateStats() {
    updateLeftStats();
    updateBoughtStats();
}

function updateLeftStats() {
    const toBuyStats = document.querySelector('.left-summary');
    toBuyStats.innerHTML = ''; // Clear the current stats

    const productItems = document.querySelectorAll('.product-item');
    productItems.forEach(function(productItem) {
        const stateButton = productItem.querySelector('.product-state');
        if(stateButton.textContent === 'Не куплено') {
            const productName = productItem.querySelector('.product-label').textContent;
            const productQuantity = productItem.querySelector('.amount-text').textContent;

            const summary = document.createElement('div');
            summary.className = 'product-summary';
            summary.innerHTML = `<p class="summary-text">${productName}</p><p class="summary-amount">${productQuantity}</p>`;
            toBuyStats.appendChild(summary);
        }
    });
}

function updateBoughtStats() {
    const boughtStats = document.querySelector('.bought-summary');
    boughtStats.innerHTML = ''; // Clear the current stats

    const productItems = document.querySelectorAll('.product-item');
    productItems.forEach(function(productItem) {
        const stateButton = productItem.querySelector('.product-state');
        if(stateButton.textContent === 'Куплено') {
            const productName = productItem.querySelector('.product-label').textContent;
            const productQuantity = productItem.querySelector('.amount-text').textContent;

            const summary = document.createElement('div');
            summary.className = 'product-summary crossed-out';
            summary.innerHTML = `<p class="summary-text">${productName}</p><p class="summary-amount">${productQuantity}</p>`;
            boughtStats.appendChild(summary);
        }
    });
}