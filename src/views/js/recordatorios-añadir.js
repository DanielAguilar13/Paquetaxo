// Configurar la fecha mínima y máxima para el input de fecha
window.onload = function() {
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
})
.catch(error => console.error('Error al cargar las categorías:', error));

function goBackToHome() {
    window.location.href = "recordatorios.html";
}

// Validar la entrada de caracteres no validos
const conceptoInput = document.getElementById('concepto');
conceptoInput.addEventListener('input', () => {
    // Permitir solo caracteres válidos
    const regex = /^[a-zA-Z0-9 .,]*$/;
    if (!regex.test(conceptoInput.value)) {
        conceptoInput.setCustomValidity('Solo se permiten letras, números, espacios, y los caracteres ".", ",".');
    } else {
        conceptoInput.setCustomValidity(''); // Restablecer validez si cumple
    }
});

// Validación del formulario (evitar envío si hay campos vacíos)
const form = document.getElementById('form-recordatorios');
form.addEventListener('submit', (event) => {
    if (!form.checkValidity()) {
        // Evitar el envío si algún campo no es válido
        event.preventDefault();
        form.reportValidity(); // Forzar mostrar los mensajes de validación
    }
});