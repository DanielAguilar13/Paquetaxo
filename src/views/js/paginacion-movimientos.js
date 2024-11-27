document.addEventListener('DOMContentLoaded', function () {
    const recordsPerPage = 8; // Número de elementos por página
    let currentPage = 1; // Página actual
    let totalPages = 0; // Total de páginas
    let allRecords = []; // Almacenará todos los movimientos
    let categoriasMap = {}; // Mapa para almacenar categorías
    let tarjetasMap = {}; // Mapa para almacenar tipos de tarjeta
    let tiposPagoMap = {}; // Mapa para almacenar tipos de pago

    // Función para obtener y mapear las categorías
    function obtenerCategoriasYMapear() {
        return fetch('/categorias')
            .then(response => response.json())
            .then(categorias => {
                const categoriasMap = categorias.reduce((map, categoria) => {
                    map[categoria.id] = categoria.nombre;
                    return map;
                }, {});
                return categoriasMap;
            })
            .catch(error => {
                console.error('Error al cargar las categorías:', error);
                throw error;
            });
    }

    // Función para obtener y mapear las tarjetas
    function obtenerTarjetasYMapear() {
        return fetch('/tarjetas')
            .then(response => response.json())
            .then(tarjetas => {
                const tarjetasMap = tarjetas.reduce((map, tarjeta) => {
                    map[tarjeta.id] = tarjeta.nombre;
                    return map;
                }, {});
                return tarjetasMap;
            })
            .catch(error => {
                console.error('Error al cargar las tarjetas:', error);
                throw error;
            });
    }

    // Función para obtener y mapear los tipos de pago
    function obtenerTiposPagoYMapear() {
        return fetch('/tipo_de_pago')
            .then(response => response.json())
            .then(tiposPago => {
                const tiposPagoMap = tiposPago.reduce((map, tipo) => {
                    map[tipo.id] = tipo.nombre;
                    return map;
                }, {});
                return tiposPagoMap;
            })
            .catch(error => {
                console.error('Error al cargar los tipos de pago:', error);
                throw error;
            });
    }

    // Obtener y mapear las categorías, tarjetas y tipos de pago
    Promise.all([obtenerCategoriasYMapear(), obtenerTarjetasYMapear(), obtenerTiposPagoYMapear()])
        .then(([mapCategorias, mapTarjetas, mapTiposPago]) => {
            categoriasMap = mapCategorias;
            tarjetasMap = mapTarjetas;
            tiposPagoMap = mapTiposPago;
            console.log('Categorías mapeadas:', categoriasMap);
            console.log('Tarjetas mapeadas:', tarjetasMap);
            console.log('Tipos de pago mapeados:', tiposPagoMap);
            cargarMovimientos();
        })
        .catch(error => console.error('Error al obtener los datos iniciales:', error));

    // Función para cargar los movimientos
    function cargarMovimientos() {
        fetch('/movimiento')
            .then(response => response.json())
            .then(data => {
                allRecords = data;
                totalPages = Math.ceil(allRecords.length / recordsPerPage);
                renderPagination();
                renderTable();
            })
            .catch(error => console.error('Error al obtener los movimientos:', error));
    }

    // Función para mostrar la tabla con los movimientos
    function renderTable() {
        const start = (currentPage - 1) * recordsPerPage;
        const end = start + recordsPerPage;
        const pageRecords = allRecords.slice(start, end);

        const tabla = document.getElementById('tabla-datos');
        tabla.innerHTML = '';

        pageRecords.forEach(item => {
            const fecha = new Date(item.fecha);
            const fechaFormateada = `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getFullYear()}`;
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${item.concepto}</td>
                <td>${item.cantidad}</td>
                <td>${categoriasMap[item.id_categoria] || 'Sin categoría'}</td>
                <td>${tiposPagoMap[item.id_tipo] || 'Sin tipo de pago'}</td>
                <td>${tarjetasMap[item.id_tarjeta] || 'Sin tarjeta'}</td>
                <td>${fechaFormateada}</td>
                <td class="actions">
                    <button class="btn btn-edit" onclick="editarMovimiento(${item.id})">✏</button>
                    <button class="btn btn-delete" onclick="eliminarMovimiento(${item.id})">🗑</button>
                </td>
            `;
            tabla.appendChild(fila);
        });
    }

    // Función para actualizar los botones de paginación
    function renderPagination() {
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';

        // Botón anterior
        const prevButton = document.createElement('button');
        prevButton.classList.add('prev');
        prevButton.innerText = '«';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => changePage(currentPage - 1));
        pagination.appendChild(prevButton);

        // Generar botones para cada página
        const pageButtons = generatePageButtons(totalPages);
        pageButtons.forEach(button => pagination.appendChild(button));

        // Botón siguiente
        const nextButton = document.createElement('button');
        nextButton.classList.add('next');
        nextButton.innerText = '»';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => changePage(currentPage + 1));
        pagination.appendChild(nextButton);
    }

    // Función para generar los botones de las páginas
    function generatePageButtons(totalPages) {
        const buttons = [];
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.innerText = i;
            button.classList.add('page-btn');
            if (i === currentPage) button.classList.add('active');
            button.addEventListener('click', () => changePage(i));
            buttons.push(button);
        }
        return buttons;
    }

    // Función para cambiar la página
    function changePage(page) {
        if (page < 1 || page > totalPages) return;
        currentPage = page;
        renderPagination();
        renderTable();
    }

    // Función para eliminar un movimiento
    function eliminarMovimiento(id) {
        if (confirm('¿Estás seguro de que deseas eliminar este movimiento?')) {
            fetch(`/api/movimientos/${id}`, { method: 'DELETE' })
                .then(response => {
                    if (!response.ok) throw new Error('Error al eliminar el movimiento');
                    alert('Movimiento eliminado exitosamente');
                    location.reload();
                })
                .catch(error => {
                    console.error('Error al eliminar el movimiento:', error);
                    alert('No se pudo eliminar el movimiento. Por favor, inténtalo de nuevo.');
                });
        }
    }

    // Función para editar un movimiento
    function editarMovimiento(id) {
        console.log("ID recibido para editar:", id);
        fetch(`/movimientos/uno/${id}`)
            .then(response => response.json())
            .then(movimiento => {
                const url = new URL("movimientos-añadir.html", window.location.origin);
                url.searchParams.set("id", movimiento.id);
                window.location.href = url;
            })
            .catch(error => {
                console.error("Error al obtener el movimiento:", error);
                alert("No se pudo cargar el movimiento para editar.");
            });
    }
});
