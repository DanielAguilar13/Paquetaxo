document.addEventListener("DOMContentLoaded", function () {
    let allRecords = []; // Almacenará todos los recordatorios
    let categoriasMap = {}; // Mapa de categorías

    // Cargar las categorías y los recordatorios
    obtenerCategoriasYMapear()
        .then((map) => {
            categoriasMap = map;
            console.log("Categorías mapeadas:", categoriasMap);
            cargarRecordatorios(); // Cargar recordatorios después de obtener las categorías
        })
        .catch((error) =>
            console.error("Error al obtener las categorías:", error)
        );

    // Función para obtener y mapear las categorías
    function obtenerCategoriasYMapear() {
        return fetch("/categorias")
            .then((response) => response.json())
            .then((data) => {
                const categoriasMap = data.reduce((map, categoria) => {
                    map[categoria.id] = categoria.nombre; // Guardamos el nombre de la categoría con su id
                    return map;
                }, {});
                return categoriasMap;
            })
            .catch((error) => {
                console.error("Error al cargar las categorías:", error);
                throw error;
            });
    }

    // Función para cargar y mostrar los recordatorios
    function cargarRecordatorios() {
        fetch("/recordatorios")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        "Error al obtener los datos: " + response.statusText
                    );
                }
                return response.json();
            })
            .then((data) => {
                allRecords = data; // Guardamos los recordatorios
                mostrarAlertasParaHoy(data); // Mostrar alertas para los recordatorios del día
                renderTable(); // Renderizamos la tabla
            })
            .catch((error) =>
                console.error("Error al obtener los recordatorios:", error)
            );
    }

    // Función para mostrar alertas de recordatorios para el día actual
    function mostrarAlertasParaHoy(recordatorios) {
        const fechaActual = new Date();
        const diaActual = fechaActual.getDate();
        const mesActual = fechaActual.getMonth();
        const anioActual = fechaActual.getFullYear();

        const recordatoriosHoy = recordatorios.filter((r) => {
            const fecha = new Date(r.fecha);
            console.log("Fecha del recordatorio:", fecha); // Depuración
            return (
                fecha.getDate() === diaActual &&
                fecha.getMonth() === mesActual &&
                fecha.getFullYear() === anioActual
            );
        });

        if (recordatoriosHoy.length > 0) {
            console.log("Mostrando recordatorios:", recordatoriosHoy); // Depuración

            // Crear el modal
            const modalContainer = document.createElement("div");
            modalContainer.id = "modal-container";
            modalContainer.classList.add("modal-container");
            document.body.appendChild(modalContainer);

            const modalContent = document.createElement("div");
            modalContent.classList.add("modal-content");

            // Crear el encabezado del modal
            const header = document.createElement("h2");
            header.textContent = "Recordatorios para hoy:";
            modalContent.appendChild(header);

            // Añadir los recordatorios al modal
            recordatoriosHoy.forEach((recordatorio) => {
                const tipoCategoria =
                    categoriasMap[recordatorio.id_categoria] || "Sin categoría";
                const recordatorioElement = document.createElement("p");
                recordatorioElement.innerHTML = `
                    <strong>${recordatorio.concepto}</strong><br>
                    Categoría: ${tipoCategoria}
                `;
                modalContent.appendChild(recordatorioElement);
            });

            // Crear el botón de cerrar
            const closeButton = document.createElement("button");
            closeButton.textContent = "Cerrar";
            closeButton.classList.add("modal-close");
            closeButton.addEventListener("click", () => {
                modalContainer.style.display = "none";
            });

            modalContent.appendChild(closeButton);
            modalContainer.appendChild(modalContent);

            // Mostrar el modal
            modalContainer.style.display = "block";
        } else {
            console.log("No hay recordatorios para hoy");
        }
    }

});
