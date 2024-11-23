document.getElementById("form-recordatorios").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

    const id = document.getElementById("id").value || 0; // Si no tiene id, es creación
    const concepto = document.getElementById("concepto").value;
    const id_categoria = document.getElementById("id_categoria").value;
    const fecha = document.getElementById("fecha").value;

    const data = {
        id: id, // Si es `0`, se creará un nuevo registro
        concepto: concepto,
        id_categoria: id_categoria,
        fecha: fecha,
    };

    // Enviar los datos a la API con `POST`
    fetch("/api/recordatorios", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error en la operación");
            }
            return response.json();
        })
        .then((result) => {
            alert("Operación exitosa");
            window.location.href = "/recordatorios.html"; // Redirigir después del éxito
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("Hubo un error al procesar la solicitud");
        });
});



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