// Manejo del formulario al enviar
document.getElementById("form-movimientos").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

    const id = document.getElementById("id").value || 0; // Si no tiene id, es creación
    const concepto = document.getElementById("concepto").value;
    const cantidad = document.getElementById("cantidad").value;
    const id_categoria = document.getElementById("id_categoria").value;
    const id_tipo = document.getElementById("id_tipo").value;
    const id_tarjeta = document.getElementById("id_tarjeta").value;
    const fecha = document.getElementById("fecha").value;

    const data = {
        id: id, // Si es `0`, se creará un nuevo registro
        concepto: concepto,
        cantidad: cantidad,
        id_categoria: id_categoria,
        id_tipo: id_tipo,
        id_tarjeta: id_tarjeta,
        fecha: fecha,
    };

    // Validar formulario antes de enviarlo
    const alerta = document.getElementById("alerta");
    alerta.style.display = "none"; // Ocultar mensaje de alerta por defecto
    alerta.textContent = ""; // Limpiar mensaje de alerta

    let isValid = true;
    let messages = [];

    // Validar concepto
    if (!concepto || concepto.length < 3 || !/^[A-Za-z\s]+$/.test(concepto)) {
        isValid = false;
        messages.push("El concepto debe tener al menos 3 caracteres y solo puede contener letras y espacios.");
    }

    // Validar cantidad
    if (!cantidad || !/^\d+(\.\d{1,2})?$/.test(cantidad)) {
        isValid = false;
        messages.push("La cantidad debe ser un número positivo con hasta dos decimales (e.g., 9.17 o 199).");
    }

    // Validar categoría
    if (!id_categoria) {
        isValid = false;
        messages.push("Seleccione una categoría.");
    }

    // Validar tipo de pago
    if (!id_tipo) {
        isValid = false;
        messages.push("Seleccione un tipo de pago.");
    }

    // Validar tarjeta
    if (!id_tarjeta) {
        isValid = false;
        messages.push("Seleccione una tarjeta.");
    }

    // Validar fecha
    if (!fecha) {
        isValid = false;
        messages.push("Seleccione una fecha.");
    }

    // Mostrar errores si hay
    if (!isValid) {
        alerta.style.display = "block"; // Mostrar el contenedor de alerta
        alerta.innerHTML = messages.join("<br>"); // Mostrar mensajes de error con salto de línea
        return;
    }

    // Enviar los datos a la API con `POST`
    fetch("/api/movimientos", {
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
        .then(() => {
            // Redirigir después del éxito
            window.location.href = "/movimientos.html";
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("Hubo un error al procesar la solicitud");
        });
});

// Función para volver a la página de inicio
function goBackToHome() {
    const formulario = document.getElementById("form-movimientos");
    formulario.reset(); // Limpiar todos los campos del formulario
    window.location.href = "movimientos.html";
}

// Configuración de rango de fechas
window.onload = function () {
    const fechaInput = document.getElementById("fecha");
    const today = new Date();

    // Calcular la fecha de dos semanas atrás
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 14);

    // Calcular la fecha de dos semanas adelante
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 14);

    // Formatear las fechas en formato YYYY-MM-DD
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    fechaInput.setAttribute("min", formatDate(pastDate)); // Dos semanas atrás
    fechaInput.setAttribute("max", formatDate(futureDate)); // Dos semanas adelante

    // Cargar las categorías desde la API
    fetch("/categorias")
        .then((response) => response.json())
        .then((data) => {
            const select = document.getElementById("id_categoria");
            data.forEach((categoria) => {
                const option = document.createElement("option");
                option.value = categoria.id; // ID de la categoría
                option.textContent = categoria.nombre; // Nombre de la categoría
                select.appendChild(option);
            });
        })
        .catch((error) => console.error("Error al cargar las categorías:", error));

    // Cargar los tipos de pago desde la API
    fetch("/tipo_de_pago")
        .then((response) => response.json())
        .then((data) => {
            const select = document.getElementById("id_tipo");
            data.forEach((tipo) => {
                const option = document.createElement("option");
                option.value = tipo.id; // ID del tipo de pago
                option.textContent = tipo.nombre; // Nombre del tipo de pago
                select.appendChild(option);
            });
        })
        .catch((error) => console.error("Error al cargar los tipos de pago:", error));

    // Cargar las tarjetas desde la API
    fetch("/tarjetas")
        .then((response) => response.json())
        .then((data) => {
            const select = document.getElementById("id_tarjeta");
            data.forEach((tarjeta) => {
                const option = document.createElement("option");
                option.value = tarjeta.id; // ID de la tarjeta
                option.textContent = tarjeta.nombre; // Nombre de la tarjeta
                select.appendChild(option);
            });
        })
        .catch((error) => console.error("Error al cargar las tarjetas:", error));
};
