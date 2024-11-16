// Función para redirigir cuando se presiona "Cancelar"
function cancelarYRedirigir() {
  window.location.href = "/src/views/ahorro.html"; // Cambia "index.html" por la ruta de la página a la que quieras redirigir
}

// Validación del límite de gastos
function establecerLimite() {
  const limiteInput = document.getElementById('limite-gasto');
  const alerta = document.getElementById('alerta');

  // Validar si el campo está vacío
  if (!limiteInput.value.trim()) {
      mostrarAlerta("Por favor, ingresa un límite de gasto válido.", "alert-error");
      return;
  }

  // Convertir el valor a número y validar que sea mayor a 0
  limiteGasto = parseFloat(limiteInput.value);

  if (isNaN(limiteGasto) || limiteGasto <= 0) {
      mostrarAlerta("El límite debe ser un número mayor a 0.", "alert-error");
  } else {
      mostrarAlerta("Límite de gasto guardado: $" + limiteGasto.toFixed(2), "alert-success");
      limiteInput.disabled = true; // Deshabilitar el campo después de configurar
  }
}

// Mostrar alertas en la página
function mostrarAlerta(mensaje, tipo) {
  const alerta = document.getElementById('alerta');
  alerta.textContent = mensaje;
  alerta.className = "alert " + tipo;
  alerta.style.display = "block";

  // Ocultar automáticamente después de 3 segundos
  setTimeout(() => {
      alerta.style.display = "none";
  }, 3000);
}

// Evento para validar el límite al salir del campo de entrada
document.getElementById('limite-gasto').addEventListener('blur', establecerLimite);
