// Función para volver a la página de inicio
function goBackToHome() {
    const formulario = document.getElementById('form-tarjetas');
    formulario.reset(); // Limpia todos los campos del formulario
    window.location.href = "tarjetas.html"; // Redirigir a la página principal de tarjetas
}

// Validar formulario antes de enviarlo
const form = document.getElementById('form-tarjetas');
form.addEventListener('submit', function (event) {
    const alerta = document.getElementById('alerta');
    alerta.style.display = 'none'; // Ocultar alerta por defecto
    alerta.textContent = ''; // Limpiar mensajes previos

    // Obtener los valores de los campos
    const nombre = document.getElementById('nombre');
    const ultimosDigitos = document.getElementById('ultimos_digitos');
    const limiteCredito = document.getElementById('limite_credito');
    const diaCorte = document.getElementById('dia_corte');
    const saldo = document.getElementById('saldo');
    const mesVencimiento = document.getElementById('mes_vencimiento');
    const anioVencimiento = document.getElementById('anio_vencimiento');

    let isValid = true;
    let messages = [];

    // Validar nombre
    if (!nombre.value || nombre.value.length < 3) {
        isValid = false;
        messages.push('El nombre de la tarjeta debe tener al menos 3 caracteres.');
    }

    // Validar últimos 4 dígitos
    if (!ultimosDigitos.value || !/^\d{4}$/.test(ultimosDigitos.value)) {
        isValid = false;
        messages.push('Los últimos 4 dígitos deben ser un número de 4 cifras.');
    }

    // Validar límite de crédito
    if (!limiteCredito.value || parseFloat(limiteCredito.value) <= 0) {
        isValid = false;
        messages.push('El límite de crédito debe ser un número positivo.');
    }

    // Validar día de corte
    if (!diaCorte.value || parseInt(diaCorte.value) < 1 || parseInt(diaCorte.value) > 31) {
        isValid = false;
        messages.push('El día de corte debe ser un número entre 1 y 31.');
    }

    // Validar saldo
    if (!saldo.value || parseFloat(saldo.value) < 0) {
        isValid = false;
        messages.push('El saldo debe ser un número positivo.');
    }

    // Validar mes de vencimiento y año de vencimiento
    const mes = parseInt(mesVencimiento.value);
    const anio = parseInt(anioVencimiento.value);

    if (!anioVencimiento.value || anio < 24 || anio > 50) {
        isValid = false;
        messages.push('El año de vencimiento debe estar entre 24 y 50.');
    }

    if (anio === 24 && (mes != 12)) {
        isValid = false;
        messages.push('Para el año 24, el mes de vencimiento debe ser 12.');
    }

    if (!mesVencimiento.value || mes < 1 || mes > 12) {
        isValid = false;
        messages.push('El mes de vencimiento debe ser un número entre 1 y 12.');
    }

    // Mostrar errores si los hay
    if (!isValid) {
        event.preventDefault(); // Evitar envío del formulario
        alerta.style.display = 'block'; // Mostrar contenedor de alerta
        alerta.style.color = 'red'; // Estilizar el mensaje
        alerta.innerHTML = messages.join('<br>'); // Mostrar mensajes con saltos de línea
    }
});
