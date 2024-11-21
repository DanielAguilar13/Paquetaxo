// Selección del formulario y el modal
const form = document.getElementById('form-recordatorios');
const modal = document.createElement('div'); // Creamos dinámicamente el modal
modal.className = 'modal'; // Clase CSS del modal
document.body.appendChild(modal); // Agregamos el modal al body

// Función para crear y mostrar el contenido del modal
function mostrarModal(mensaje) {
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-button" onclick="cerrarModal()">&times;</span>
            <p>${mensaje}</p>
        </div>
    `;
    modal.style.display = 'block'; // Mostramos el modal
}

// Función para cerrar el modal
function cerrarModal() {
    modal.style.display = 'none';
}

// Cerrar el modal al hacer clic fuera de su contenido
window.onclick = function (event) {
    if (event.target === modal) {
        cerrarModal();
    }
};

// Validación del formulario
form.addEventListener('submit', (event) => {
    // Prevenir envío del formulario
    event.preventDefault();

    // Obtener valores de los campos
    const recordatorio = document.getElementById('concepto').value.trim();
    const tipo = document.getElementById('id_categoria').value.trim();
    const fecha = document.getElementById('fecha').value.trim();

    // Inicializar mensajes de advertencia
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

    // Si hay errores, mostrar advertencias en el modal
    if (error) {
        mostrarModal(warnings);
    } else {
        mostrarModal('Formulario enviado correctamente.');
        setTimeout(() => form.submit(), 1500); // Opcional: enviar el formulario tras un breve retraso
    }
});

