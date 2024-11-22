// Configurar la fecha mínima y máxima para el input de fecha
function goBackToHome() {
    // Reiniciar el formulario
    const formulario = document.getElementById('form-recordatorios');
    formulario.reset(); // Limpia todos los campos del formulario

    window.location.href = "recordatorios.html";
}

// Configurar la fecha mínima y máxima para el input de fecha
window.onload = function () {
    const fechaInput = document.getElementById('fecha');
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;

    fechaInput.setAttribute('min', currentDate);

    const futureDate = `${year + 20}-${month}-${day}`;
    fechaInput.setAttribute('max', futureDate);
};

// Llenar el select con datos de la API
fetch('/categorias')
    .then(response => response.json())
    .then(data => {
        const select = document.getElementById('id_categoria');
        data.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.id; // ID de la categoría
            option.textContent = categoria.nombre; // Nombre de la categoría
            select.appendChild(option);
        });
    }).catch(error => console.error('Error al cargar las categorías:', error));

    // Validar formulario antes de enviarlo
const form = document.getElementById('form-recordatorios');
form.addEventListener('submit', function (event) {
    const alerta = document.getElementById('alerta');
    alerta.style.display = 'none'; // Ocultar alerta por defecto
    alerta.textContent = ''; // Limpiar mensajes previos

    const concepto = document.getElementById('concepto');
    const categoria = document.getElementById('id_categoria');
    const fecha = document.getElementById('fecha');

    let isValid = true;
    let messages = [];

    // Validar concepto
    if (!concepto.value || concepto.value.length < 3 || !/^[A-Za-z\s]+$/.test(concepto.value)) {
        isValid = false;
        messages.push('El concepto debe tener al menos 3 caracteres y solo puede contener letras y espacios.');
    }

    // Validar categoría
    if (!categoria.value) {
        isValid = false;
        messages.push('Seleccione una categoría.');
    }

    // Validar fecha
    if (!fecha.value) {
        isValid = false;
        messages.push('Seleccione una fecha válida.');
    }

    // Mostrar errores si los hay
    if (!isValid) {
        event.preventDefault(); // Evitar envío del formulario
        alerta.style.display = 'block'; // Mostrar el contenedor de alerta
        alerta.innerHTML = messages.join('<br>'); // Mostrar mensajes de error con salto de línea
    }
});