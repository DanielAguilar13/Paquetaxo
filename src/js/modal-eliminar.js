// Seleccionar elementos del DOM
const deleteModal = document.getElementById("deleteModal");
const confirmDelete = document.getElementById("confirmDelete");
const cancelDelete = document.getElementById("cancelDelete");
const closeModal = document.querySelector(".close-modal");

// Variable para almacenar la fila seleccionada
let rowToDelete = null;

// Función para cerrar el modal
const closeModalFunction = () => {
    deleteModal.style.display = "none"; // Ocultar el modal
    rowToDelete = null; // Resetear la fila seleccionada
};

// Asegurarse de que el modal esté cerrado al iniciar la página
document.addEventListener("DOMContentLoaded", () => {
    deleteModal.style.display = "none"; // Modal oculto al cargar la página
});

// Mostrar el modal al hacer clic en el botón "Eliminar"
document.querySelectorAll(".btn-delete").forEach((button) => {
    button.addEventListener("click", (e) => {
        rowToDelete = e.target.closest("tr"); // Guardar la fila seleccionada
        deleteModal.style.display = "flex"; // Mostrar el modal
    });
});

// Cerrar el modal con los botones o haciendo clic fuera de él
closeModal.addEventListener("click", closeModalFunction);
cancelDelete.addEventListener("click", closeModalFunction);

// Confirmar eliminación
confirmDelete.addEventListener("click", () => {
    if (rowToDelete) {
        rowToDelete.remove(); // Eliminar la fila seleccionada
    }
    closeModalFunction(); // Cerrar el modal
});

// Cerrar el modal al hacer clic fuera del contenido del modal
window.addEventListener("click", (e) => {
    if (e.target === deleteModal) {
        closeModalFunction(); // Cerrar el modal si se hace clic fuera del contenido
    }
});