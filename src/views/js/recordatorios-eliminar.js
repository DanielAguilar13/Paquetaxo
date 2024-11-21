// modal-eliminar.js

let recordatorioId = null; // Variable global para almacenar el ID del recordatorio a eliminar

// Abrir el modal de confirmación
function openDeleteModal(id) {
    recordatorioId = id; // Guardar el ID del recordatorio que se desea eliminar
    const modal = document.getElementById('deleteModal');
    modal.style.display = 'block'; // Mostrar el modal
}

// Cerrar el modal
function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    modal.style.display = 'none'; // Ocultar el modal
}

// Eliminar el recordatorio
function eliminarRecordatorio(id) {
    // Abrir el modal y pasar el ID del recordatorio
    openDeleteModal(id);
}

// Confirmar la eliminación
document.getElementById('confirmDelete').addEventListener('click', () => {
    // Realizar la solicitud DELETE a la API
    fetch(`/recordatorios/${recordatorioId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar el recordatorio: ' + response.statusText);
        }
        // Si la eliminación es exitosa, recargar la página o eliminar la fila de la tabla
        document.getElementById(`recordatorio-${recordatorioId}`).remove(); // Eliminar la fila de la tabla
        closeDeleteModal(); // Cerrar el modal
    })
    .catch(error => {
        console.error('Error al eliminar el recordatorio:', error);
        closeDeleteModal(); // Cerrar el modal en caso de error
    });
});

// Cancelar la eliminación
document.getElementById('cancelDelete').addEventListener('click', closeDeleteModal);

// Cerrar el modal al hacer clic en la X
document.querySelector('.close-modal').addEventListener('click', closeDeleteModal);

// Función para que el modal cierre si se hace clic fuera de él
window.onclick = function(event) {
    const modal = document.getElementById('deleteModal');
    if (event.target == modal) {
        closeDeleteModal();
    }
};
