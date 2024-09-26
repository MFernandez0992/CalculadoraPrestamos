document.addEventListener('DOMContentLoaded', function () {

    /* Selectores */
    const mortgageAmount = document.querySelector('#mortgageAmount');
    const mortgageTerm = document.querySelector('#mortgageTerm');
    const interestRate = document.querySelector('#interestRate');
    const monthly = document.querySelector('#monthly');
    const total = document.querySelector('#total');
    const submitBtn = document.querySelector('button[type=submit]');
    const totalText = document.querySelector('#totalText');
    const monthlyText = document.querySelector('#monthlyText');
    const emptyInfo = document.querySelector('#emptyInfo');
    const resultsInfo = document.querySelector('#resultsInfo');
    const resetBtn = document.querySelector('#reset');
    const errorMessage = document.querySelector('#errorMessage');

    // Inicializar eventos
    initEventListeners();

    function initEventListeners() {
        mortgageAmount.addEventListener('blur', validateField);
        mortgageTerm.addEventListener('blur', validateField);
        interestRate.addEventListener('blur', validateField);
        submitBtn.addEventListener('click', calcularIntereses);
        resetBtn.addEventListener('click', resetForm);
    }

    function validateField(e) {
        const field = e.target;
        const errorElement = document.querySelector(`#error-${field.id}`);

        // Remover el mensaje de error anterior
        errorElement.classList.add('hidden');
        errorElement.textContent = '';

        // Si el campo está vacío, mostrar el mensaje de error
        if (field.value.trim() === '') {
            showError(field, 'Campo requerido');
        }
    }

    function showError(field, message) {
        const errorElement = document.querySelector(`#error-${field.id}`);
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }

    function calcularIntereses(e) {
        e.preventDefault();

        // Obtener el valor del radio button seleccionado
        const selectedRadio = document.querySelector('input[name="mortgageType"]:checked');
        
        // Validar campos de entrada
        if (!validateInputs()) return;

        // Convertir valores a números
        const amount = parseFloat(mortgageAmount.value.trim());
        const term = parseFloat(mortgageTerm.value.trim());
        const interest = parseFloat(interestRate.value.trim());

        // Calcular intereses
        const interesesCalculados = amount * (interest / 100);

        if (selectedRadio.value === 'repayment') {
            calculateRepayment(amount, interest, term);
        } else if (selectedRadio.value === 'interestOnly') {
            calculateInterestOnly(interesesCalculados, term);
        }

        // Actualizar la visualización de resultados
        updateResultsVisibility();
    }

    function validateInputs() {
        const amountValue = mortgageAmount.value.trim();
        const termValue = mortgageTerm.value.trim();
        const interestValue = interestRate.value.trim();

        const inputs = [amountValue, termValue, interestValue];
        const isValid = inputs.every(value => value !== '' && !isNaN(value));
        
        // Manejar mensajes de error
        if (!isValid) {
            errorMessage.textContent = 'Por favor, completa todos los campos con valores numéricos.';
            errorMessage.classList.remove('hidden');
            toggleResultVisibility(false);
        } else {
            errorMessage.classList.add('hidden');
        }

        return isValid;
    }

    function calculateRepayment(amount, interest, term) {
        const tasaInteresMensual = interest / (12 * 100);
        const numeroPagos = term * 12;
        const cuotaMensual = amount * (tasaInteresMensual * Math.pow(1 + tasaInteresMensual, numeroPagos)) / 
                             (Math.pow(1 + tasaInteresMensual, numeroPagos) - 1);
        const repagoTotal = cuotaMensual * numeroPagos;

        monthlyText.textContent = 'Cuota mensual';
        monthly.textContent = `$ ${cuotaMensual.toFixed(2)}`;
        totalText.textContent = 'Repago Total';
        total.textContent = `$ ${repagoTotal.toFixed(2)}`;
    }

    function calculateInterestOnly(interesesCalculados, term) {
        const interesMensualPromedio = interesesCalculados / (term * 12);
        
        monthlyText.textContent = 'Intereses mensuales';
        monthly.textContent = `$ ${interesMensualPromedio.toFixed(2)}`;
        totalText.textContent = 'Intereses totales';
        total.textContent = `$ ${interesesCalculados.toFixed(2)}`;
    }

    function updateResultsVisibility() {
        emptyInfo.classList.add('hidden');
        resultsInfo.classList.remove('hidden');
        resultsInfo.classList.add('flex');
    }

    function toggleResultVisibility(showResults) {
        if (showResults) {
            emptyInfo.classList.add('hidden');
            resultsInfo.classList.remove('hidden');
            resultsInfo.classList.add('flex');
        } else {
            resultsInfo.classList.remove('flex');
            resultsInfo.classList.add('hidden');
            emptyInfo.classList.remove('hidden');
            emptyInfo.classList.add('flex');
        }
    }

    function resetForm() {
        // Limpiar valores de los inputs
        mortgageAmount.value = '';
        interestRate.value = '';
        mortgageTerm.value = '';

        // Ocultar los resultados
        toggleResultVisibility(false);

        // Limpiar todos los mensajes de error
        clearErrorMessages();
    }

    function clearErrorMessages() {
        // Obtener todos los elementos de error
        const errorElements = document.querySelectorAll('.text-red');
        
        // Remover el texto y ocultar cada uno
        errorElements.forEach(errorElement => {
            errorElement.textContent = '';
            errorElement.classList.add('hidden');
        });
        
        // Ocultar el mensaje general de error
        errorMessage.classList.add('hidden');
    }
});
