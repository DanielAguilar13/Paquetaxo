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
  
      // Validar si se seleccionó una imagen
      const username = usernameInput.value.trim();
      const imageSelected = Array.from(imageInputs).find(input => input.checked);
  
      // Validar el nombre de usuario
      if (!/^[a-zA-Z0-9]{3,15}$/.test(username)) {
        mostrarAlerta("El nombre de usuario debe tener entre 3 y 15 caracteres alfanuméricos.");
        return;
      }
  
      // Validar si se seleccionó una imagen
      if (!imageSelected) {
        mostrarAlerta("Por favor, selecciona una imagen de usuario.");
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
    }
  });
  