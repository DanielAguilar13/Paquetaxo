document.addEventListener('DOMContentLoaded', function () {
    const recordsPerPage = 8;  // Número de elementos por página
    let currentPage = 1;  // Página actual
    let totalPages = 0;  // Total de páginas
    let allRecords = [];  // Almacenará todos los recordatorios
    let categoriasMap = {};  // Mapa de categorías

    // Cargar las categorías y los recordatorios
    obtenerCategoriasYMapear()
        .then(map => {
            categoriasMap = map;
            console.log('Categorías mapeadas:', categoriasMap);
            cargarRecordatorios();  // Cargar recordatorios después de obtener las categorías
        })
        .catch(error => console.error('Error al obtener las categorías:', error));

    // Función para obtener y mapear las categorías
    function obtenerCategoriasYMapear() {
        return fetch('/categorias')
            .then(response => response.json())
            .then(data => {
                const categoriasMap = data.reduce((map, categoria) => {
                    map[categoria.id] = categoria.nombre; // Guardamos el nombre de la categoría con su id
                    return map;
                }, {});
                return categoriasMap;
            })
            .catch(error => {
                console.error('Error al cargar las categorías:', error);
                throw error;
            });
    }

    // Función para cargar y mostrar los recordatorios
    function cargarRecordatorios() {
        fetch('/recordatorios')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los datos: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                allRecords = data;  // Guardamos los recordatorios
                totalPages = Math.ceil(allRecords.length / recordsPerPage);  // Calculamos el total de páginas
                renderPagination();  // Renderizamos los botones de paginación
                renderTable();  // Renderizamos la primera página de la tabla
            })
            .catch(error => console.error('Error al obtener los recordatorios:', error));
    }

    // Función para mostrar la tabla con los recordatorios
    function renderTable() {
        const start = (currentPage - 1) * recordsPerPage;
        const end = start + recordsPerPage;
        const pageRecords = allRecords.slice(start, end);

        const tabla = document.getElementById('tabla-datos');
        tabla.innerHTML = '';  // Limpiamos la tabla antes de agregar los nuevos datos

        pageRecords.forEach(item => {
            const fecha = new Date(item.fecha);
            const fechaFormateada = `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getFullYear()}`;
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${item.concepto}</td>
                <td>${categoriasMap[item.id_categoria] || 'Categoría no encontrada'}</td>  <!-- Mostrar el nombre de la categoría -->
                <td>${fechaFormateada}</td>
                <td class="actions">
                    <button class="btn btn-edit" onclick="editarRecordatorio(${item.id})">✏</button>
                    <button class="btn btn-delete" onclick="eliminarRecordatorio(${item.id})">🗑</button>
                </td>
            `;
            tabla.appendChild(fila);
        });
    }

    // Función para actualizar los botones de paginación
    function renderPagination() {
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';  // Limpiamos la paginación

        // Botón anterior
        const prevButton = document.createElement('button');
        prevButton.classList.add('prev');
        prevButton.innerText = '«';
        prevButton.disabled = currentPage === 1;  // Deshabilitamos si estamos en la primera página
        prevButton.addEventListener('click', () => changePage(currentPage - 1));
        pagination.appendChild(prevButton);

        // Generar botones para cada página
        const pageButtons = generatePageButtons(totalPages);
        pageButtons.forEach(button => {
            pagination.appendChild(button);
        });

        // Botón siguiente
        const nextButton = document.createElement('button');
        nextButton.classList.add('next');
        nextButton.innerText = '»';
        nextButton.disabled = currentPage === totalPages;  // Deshabilitamos si estamos en la última página
        nextButton.addEventListener('click', () => changePage(currentPage + 1));
        pagination.appendChild(nextButton);
    }

    // Función para generar los botones de las páginas
    function generatePageButtons(totalPages) {
        const buttons = [];
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.classList.add('page');
            pageButton.innerText = i;
            pageButton.setAttribute('data-page', i);
            pageButton.addEventListener('click', () => changePage(i));
            if (i === currentPage) {
                pageButton.classList.add('active');  // Resaltamos la página actual
            }
            buttons.push(pageButton);
        }
        return buttons;
    }

    // Función para cambiar de página
    function changePage(page) {
        if (page < 1 || page > totalPages) return;  // Validamos que la página esté dentro del rango
        currentPage = page;  // Actualizamos la página actual
        renderTable();  // Renderizamos la tabla
        renderPagination();  // Actualizamos los botones de paginación
    }
});
