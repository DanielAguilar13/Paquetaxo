// Función para volver a la página de inicio
function goBackToHome() {
    const formulario = document.getElementById('form-ahorro');
    formulario.reset();
    window.location.href = "ahorro.html"; 
}

// Función para inicializar fecha mínima y máxima
window.onload = function () {
    const fechaInput = document.getElementById('fecha');
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;

    fechaInput.setAttribute('min', currentDate);

    const futureDate = `${year + 5}-${month}-${day}`;
    fechaInput.setAttribute('max', futureDate);

    // Llenar el select con datos de la API
    fetch('/movimiento')
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('concepto');
            data.forEach(concepto => {
                const option = document.createElement('option');
                option.value = concepto.id; // ID del concepto
                option.textContent = concepto.concepto; // Nombre del concepto
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar los conceptos:', error));
};

// Validar formulario antes de enviarlo
const form = document.getElementById('form-ahorro');
form.addEventListener('submit', function (event) {
    const alerta = document.getElementById('alerta');
    alerta.style.display = 'none';
    alerta.textContent = '';

    const cantidad = document.getElementById('cantidad');
    const limiteGasto = document.getElementById('limite_gasto');
    const concepto = document.getElementById('concepto');
    const fecha = document.getElementById('fecha');

    let isValid = true;
    let messages = [];

    // Validar cantidad
    if (!cantidad.value || !/^\d+(\.\d{1,2})?$/.test(cantidad.value)) {
        isValid = false;
        messages.push('Ingrese una cantidad válida (e.g., 9.17 o 199).');
    }

    // Validar concepto
    if (!concepto.value) {
        isValid = false;
        messages.push('Seleccione un concepto.');
    }

    // Validar límite de gasto
    if (!limiteGasto.value || !/^\d+(\.\d{1,2})?$/.test(limiteGasto.value)) {
        isValid = false;
        messages.push('Ingrese un límite de gasto válido (e.g., 9.17 o 199).');
    }

    // Validar fecha
    if (!fecha.value) {
        isValid = false;
        messages.push('Seleccione una fecha.');
    }

    // Mostrar errores si hay
    if (!isValid) {
        event.preventDefault();
        alerta.style.display = 'block';
        alerta.innerHTML = messages.join('<br>'); // Mostrar mensajes de error con salto de línea
    }
});