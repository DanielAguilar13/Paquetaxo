// Seleccionamos el formulario y el elemento donde se mostrarán los mensajes de advertencia
const form = document.getElementById('form-recordatorios');
const warningsElement = document.getElementById('warnings');

// Función para validar el formulario
form.addEventListener('submit', (event) => {
    // Prevenimos el envío del formulario
    event.preventDefault();

    // Obtenemos los valores de los campos
    const recordatorio = document.getElementById('concepto').value.trim();
    const tipo = document.getElementById('id_categoria').value.trim();
    const fecha = document.getElementById('fecha').value.trim();

    // Inicializamos la variable de advertencias
    let warnings = '';
    let error = false;

    // Validación del campo "Recordatorio"
    if (recordatorio === '') {
        warnings += 'Por favor, ingresa el recordatorio.<br>';
        error = true;
    } else if (recordatorio.length < 6) {
        warnings += 'El recordatorio debe tener al menos 6 letras.<br>';
        error = true;
    }

    // Validación del campo "Tipo"
    if (tipo === '') {
        warnings += 'Por favor, ingresa el tipo.<br>';
        error = true;
    }

    // Validación del campo "Fecha"
    if (fecha === '') {
        warnings += 'Por favor, selecciona una fecha.<br>';
        error = true;
    }

    // Si hay errores, mostramos las advertencias
    if (error) {
        warningsElement.innerHTML = warnings;
        warningsElement.style.color = 'red'; // Color rojo para advertencias
    } else {
        warningsElement.innerHTML = 'Formulario enviado correctamente.';
        warningsElement.style.color = 'green'; // Color verde para éxito

        // Opcional: Puedes agregar lógica para enviar el formulario por AJAX o similar
        setTimeout(() => form.submit(), 1000); // Envía el formulario tras un breve retraso
    }
});
