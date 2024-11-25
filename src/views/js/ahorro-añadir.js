document.getElementById("form-ahorro").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

    const id = document.getElementById("id").value || 0; // Si no tiene id, es creación
    const cantidad = document.getElementById("cantidad").value;
    const concepto = document.getElementById("concepto").value;
    const limite_gasto = document.getElementById("limite_gasto").value;
    const fecha = document.getElementById("fecha").value;

    const data = {
        id: id, // Si es `0`, se creará un nuevo registro
        cantidad: cantidad,
        concepto: concepto,
        limite_gasto: limite_gasto,
        fecha: fecha,
    };

    // Enviar los datos a la API con `POST`
    fetch("/api/ahorro", {
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
            window.location.href = "/ahorro.html"; // Redirigir después del éxito
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("Hubo un error al procesar la solicitud");
        });
});
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