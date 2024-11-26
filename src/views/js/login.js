document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const usernameInput = form.querySelector('input[type="text"]');
    const imageInputs = form.querySelectorAll('input[type="radio"]');
    const alertBox = document.createElement('div'); // Crear elemento para mostrar alertas
    alertBox.classList.add('alert'); // Añadir clase .alert
    form.insertBefore(alertBox, form.firstChild); // Insertar la alerta al inicio del formulario

    // Escuchar el evento submit del formulario
    form.addEventListener('submit', (e) => {
        // Evitar el envío por defecto
        e.preventDefault();

        // Resetear mensaje de alerta
        alertBox.style.display = 'none';
        alertBox.textContent = '';

        // Validaciones
        const username = usernameInput.value.trim();
        const imageSelected = Array.from(imageInputs).find(input => input.checked);
        let messages = []; // Acumular mensajes de error

        // Validar el nombre de usuario
        if (!/^[a-zA-Z0-9]{3,15}$/.test(username)) {
            messages.push("El nombre de usuario debe tener entre 3 y 15 caracteres alfanuméricos.");
        }

        // Validar si se seleccionó una imagen
        if (!imageSelected) {
            messages.push("Por favor, selecciona una imagen de usuario.");
        }

        // Mostrar errores si existen
        if (messages.length > 0) {
            mostrarAlerta(messages.join('\n')); // Unir mensajes con salto de línea
            return;
        }

        // Si todas las validaciones pasan, enviar el formulario
        mostrarAlerta("Formulario enviado correctamente.", true);
        setTimeout(() => {
            form.submit(); // Enviar formulario después de mostrar el mensaje
        }, 1000);
    });

    // Función para mostrar alertas
    function mostrarAlerta(mensaje, success = false) {
        alertBox.textContent = mensaje;
        alertBox.style.display = 'block';
        alertBox.style.color = success ? 'green' : 'red';
        alertBox.style.borderColor = success ? 'green' : 'red';
        alertBox.style.whiteSpace = 'pre-line'; // Respetar saltos de línea
    }
});
document.getElementById("form-usuario").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
    
    const id = document.getElementById("id").value || 0;
    const nombre = document.getElementById("nombre").value;
    const id_imagen = document.querySelector('input[name="id_imagen"]:checked')?.value;;

    const data = {
        id: id, // Si es `0`, se creará un nuevo registro
        nombre: nombre,
        id_imagen: id_imagen,
    };

    // Enviar los datos a la API con `POST`
    fetch("/api/usuario", {
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
            
            window.location.href = "/homepage.html"; // Redirigir después del éxito
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("Hubo un error al procesar la solicitud");
        });
});
