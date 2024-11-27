document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form-recordatorios");
    const alerta = document.getElementById("alerta");
    const fechaInput = document.getElementById("fecha");
    const selectCategoria = document.getElementById("id_categoria");

    // Configurar la fecha mínima y máxima para el input de fecha
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;
    const futureDate = `${year + 20}-${month}-${day}`;

    fechaInput.setAttribute('min', currentDate);
    fechaInput.setAttribute('max', futureDate);

    // Llenar el select con datos de la API
    fetch('/categorias')
        .then(response => response.json())
        .then(data => {
            data.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria.id; // ID de la categoría
                option.textContent = categoria.nombre; // Nombre de la categoría
                selectCategoria.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar las categorías:', error));

    // Validar formulario antes de enviarlo
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevenir el envío del formulario por defecto

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
            alerta.style.display = 'block'; // Mostrar el contenedor de alerta
            alerta.innerHTML = messages.join('<br>'); // Mostrar mensajes de error con salto de línea
            return; // Detener el proceso de envío
        }

        // Preparar datos para la API
        const id = document.getElementById("id").value || 0; // Si no tiene id, es creación
        const data = {
            id: id, // Si es 0, se creará un nuevo registro
            concepto: concepto.value,
            id_categoria: categoria.value,
            fecha: fecha.value,
        };

        // Enviar los datos a la API con POST
        fetch("/api/recordatorios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error en la operación");
                }
                return response.json();
            })
            .then(result => {
                alert("Operación exitosa");
                window.location.href = "/recordatorios.html"; // Redirigir después del éxito
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Hubo un error al procesar la solicitud");
            });
    });

    // Función para regresar al inicio
    document.getElementById("go-back").addEventListener("click", function () {
        form.reset(); // Limpiar todos los campos del formulario
        window.location.href = "recordatorios.html"; // Redirigir al inicio
    });
});