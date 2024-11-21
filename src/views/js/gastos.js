function verificarGasto() {
  // Obtener los valores de los campos
  const cantidad = document.getElementById('cantidad').value.trim();
  const concepto = document.getElementById('concepto').value.trim();
  const limiteGasto = document.getElementById('limite_gasto').value.trim();
  const fecha = document.getElementById('fecha').value.trim();

  // Validar campo "Cantidad"
  if (cantidad === '' || isNaN(cantidad) || parseFloat(cantidad) <= 0) {
      mostrarAlerta("Por favor, ingresa una cantidad válida (número mayor a 0).", "alert-error");
      return;
  }

  // Validar campo "Concepto"
  if (concepto === '') {
      mostrarAlerta("El campo concepto no puede estar vacío.", "alert-error");
      return;
  }

  // Validar campo "Límite de Gasto"
  if (limiteGasto === '' || isNaN(limiteGasto) || parseFloat(limiteGasto) <= 0) {
      mostrarAlerta("Por favor, ingresa un límite de gasto válido (número mayor a 0).", "alert-error");
      return;
  }

  // Validar campo "Fecha"
  if (fecha === '') {
      mostrarAlerta("Por favor, selecciona una fecha válida.", "alert-error");
      return;
  }

  // Si todas las validaciones pasan
  mostrarAlerta("Gasto registrado correctamente.", "alert-success");
}

function mostrarAlerta(mensaje, tipo) {
  const modal = document.getElementById('modal-alerta');
  const mensajeModal = document.getElementById('modal-mensaje');

  // Establecer el mensaje y estilos según el tipo
  mensajeModal.textContent = mensaje;
  if (tipo === "alert-error") {
      mensajeModal.style.color = "#721c24";
  } else if (tipo === "alert-success") {
      mensajeModal.style.color = "#155724";
  }

  // Mostrar el modal
  modal.style.display = "block";
}

// Función para cerrar el modal
function cerrarModal() {
  const modal = document.getElementById('modal-alerta');
  modal.style.display = "none";
}

// Cerrar el modal al hacer clic fuera del contenido
window.onclick = function(event) {
  const modal = document.getElementById('modal-alerta');
  if (event.target === modal) {
      modal.style.display = "none";
  }
};
function cancelarYRedirigir() {
  // Reiniciar el formulario
  const formulario = document.getElementById('form-recordatorios');
  formulario.reset(); // Limpia todos los campos del formulario

  // Redirigir a otra página
  window.location.href = "ahorro.html"; 
};