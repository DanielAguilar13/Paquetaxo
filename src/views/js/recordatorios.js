document.addEventListener("DOMContentLoaded", () => {
    const modalContainer = document.createElement("div");
    modalContainer.id = "modal-container";
    modalContainer.classList.add("modal-container");
    document.body.appendChild(modalContainer);

    // Función para obtener la fecha actual en formato 'YYYY-MM-DD'
    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Mes (0 indexado)
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Ejemplo de datos de recordatorios; reemplázalo con datos reales.
    const recordatorios = [
        { concepto: "Pagar alquiler", fecha: "2024-11-24", tipo: "Finanzas" },
        { concepto: "Revisar proyecto", fecha: "2024-11-25", tipo: "Trabajo" },
    ];

    // Función para verificar si hay recordatorios para hoy
    const verificarRecordatorios = () => {
        const fechaActual = getCurrentDate();
        const recordatoriosHoy = recordatorios.filter(r => r.fecha === fechaActual);

        if (recordatoriosHoy.length > 0) {
            const modalContent = document.createElement("div");
            modalContent.classList.add("modal-content");

            // Agregar contenido de recordatorios al modal
            const closeButton = document.createElement("button");
            closeButton.textContent = "Cerrar";
            closeButton.classList.add("modal-close");
            closeButton.addEventListener("click", () => {
                modalContainer.style.display = "none";
            });

            const header = document.createElement("h2");
            header.textContent = "Recordatorios para hoy:";
            modalContent.appendChild(header);

            recordatoriosHoy.forEach(recordatorio => {
                const recordatorioElement = document.createElement("p");
                recordatorioElement.innerHTML = `
                    <strong>${recordatorio.concepto}</strong><br>
                    Tipo: ${recordatorio.tipo}
                `;
                modalContent.appendChild(recordatorioElement);
            });

            modalContent.appendChild(closeButton);
            modalContainer.appendChild(modalContent);

            // Mostrar el modal
            modalContainer.style.display = "block";
        }
    };

    verificarRecordatorios();
});
