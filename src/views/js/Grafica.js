// Obtener movimientos y configurar tabla y gráfica
fetch('/movimiento')
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener los datos: ' + response.statusText);
        }
        return response.json();
    })
    .then(movimientos => {
        // Obtener los movimientos del mes actual
        const fechaActual = new Date();
        const mesActual = fechaActual.getMonth();
        const anioActual = fechaActual.getFullYear();
        const movimientosMesActual = movimientos.filter(mov => {
            const fecha = new Date(mov.fecha);
            return fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual;
        });

        // Tomar los últimos 5 movimientos agregados
        const movimientosRecientes = movimientos.slice(-5);

        // Obtener categorías y hacer el mapeo
        fetch('/categorias')
            .then(response => response.json())
            .then(categorias => {
                // Crear un mapa para encontrar los nombres por el ID de categoría
                const categoriasMap = categorias.reduce((map, categoria) => {
                    map[categoria.id] = categoria.nombre;
                    return map;
                }, {});

                // Actualizar la tabla con los nombres de categorías
                const tabla = document.getElementById('tabla-datos');
                tabla.innerHTML = '';
                movimientosRecientes.forEach(item => {
                    const fila = document.createElement('tr');
                    fila.innerHTML = `
                        <td>${item.fecha}</td>
                        <td>${item.concepto}</td>
                        <td>${categoriasMap[item.id_categoria] || 'Sin categoría'}</td>
                        <td>${item.cantidad}</td>
                    `;
                    tabla.appendChild(fila);
                });

                // Configurar gráfica con los movimientos recientes
                configurarGrafica(movimientosRecientes.map(mov => ({
                    ...mov,
                    categoria: categoriasMap[mov.id_categoria] || 'Sin categoría'
                })));

                // Hacer accesibles globalmente los movimientos del mes actual para el PDF
                window.gastosMesActual = movimientosMesActual.map(mov => ({
                    ...mov,
                    categoria: categoriasMap[mov.id_categoria] || 'Sin categoría'
                }));
            })
            .catch(error => console.error('Error al cargar las categorías:', error));
    })
    .catch(error => {
        console.error('Error al cargar los movimientos:', error);
        alert('Hubo un problema al cargar los datos.');
    });

function configurarGrafica(gastos) {
    const chartData = {
        labels: gastos.map(gasto => gasto.categoria),
        datasets: [{
            label: 'Gastos Recientes',
            data: gastos.map(gasto => gasto.cantidad),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            hoverOffset: 4
        }]
    };

    const chartConfig = {
        type: 'bar',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: { size: 14 },
                        color: '#000000'
                    }
                },
                tooltip: { enabled: true }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: { size: 14 }
                    }
                },
                x: {
                    ticks: {
                        font: { size: 14 }
                    }
                }
            }
        }
    };
    const ctx = document.getElementById('expenseChart').getContext('2d');
    new Chart(ctx, chartConfig);
}

function generatePDF() {
    // Crear un contenedor oculto para el canvas temporal si no existe
    let container = document.getElementById('canvas-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'canvas-container';
        container.style.display = 'none'; // Oculto
        document.body.appendChild(container);
    }

    // Crear un canvas temporal dentro del contenedor
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 800; // Dimensiones estándar para gráficos
    tempCanvas.height = 400;
    container.appendChild(tempCanvas);

    // Configurar el gráfico en el canvas temporal (esta parte se elimina ya que no se quiere mostrar el gráfico)
    const ctxMes = tempCanvas.getContext('2d');
    const chartDataMes = {
        labels: window.gastosMesActual.map(gasto => gasto.categoria),
        datasets: [{
            label: 'Gastos del Mes',
            data: window.gastosMesActual.map(gasto => gasto.cantidad),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            hoverOffset: 4
        }]
    };

    // Crear el gráfico en el canvas pero no lo agregamos al PDF
    const chart = new Chart(ctxMes, {
        type: 'bar',
        data: chartDataMes,
        options: {
            responsive: false, // Importante para canvas estático
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: { size: 14 },
                        color: '#000000'
                    }
                },
                tooltip: { enabled: true }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: { size: 14 }
                    }
                },
                x: {
                    ticks: {
                        font: { size: 14 }
                    }
                }
            }
        }
    });

    // Esperar un poco para asegurar que el gráfico esté completamente renderizado
    setTimeout(() => {
        try {
            // Verificar si el canvas tiene algún contenido antes de intentar capturar
            if (!tempCanvas.width || !tempCanvas.height) {
                throw new Error("El canvas está vacío o no tiene dimensiones válidas.");
            }

            // Crear solo el PDF sin incluir la imagen del gráfico
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF();

            // Añadir el título del reporte y la tabla
            pdf.setFontSize(16);
            pdf.text("Reporte de Gastos (Mes Completo):", 10, 10);

            if (window.gastosMesActual && window.gastosMesActual.length > 0) {
                // Crear una tabla más estilizada
                pdf.autoTable({
                    startY: 20, // Ajusta la posición de inicio de la tabla
                    head: [['Fecha', 'Concepto', 'Categoría', 'Monto']],
                    body: window.gastosMesActual.map(gasto => [
                        formatDate(gasto.fecha), // Formatear la fecha
                        gasto.concepto,
                        gasto.categoria,
                        `$${gasto.cantidad}`
                    ]),
                    theme: 'striped', // Uso de filas alternadas para un efecto de rayas
                    headStyles: {
                        fillColor: [63, 81, 181],  // Color de fondo para el encabezado
                        textColor: [255, 255, 255], // Color del texto del encabezado
                        fontSize: 12, // Tamaño de la fuente del encabezado
                        halign: 'center', // Centrado del texto en el encabezado
                        valign: 'middle' // Alineación vertical en el encabezado
                    },
                    styles: {
                        fontSize: 10, // Tamaño de la fuente
                        cellPadding: 6, // Espaciado dentro de las celdas
                        lineWidth: 0.5, // Grosor de las líneas
                        lineColor: [200, 200, 200], // Color de las líneas
                        halign: 'center', // Centrado del texto
                        valign: 'middle', // Alineación vertical
                    },
                    columnStyles: {
                        0: { cellWidth: 30 }, // Establecer el ancho de la primera columna (Fecha)
                        1: { cellWidth: 50 }, // Establecer el ancho de la segunda columna (Concepto)
                        2: { cellWidth: 50 }, // Establecer el ancho de la tercera columna (Categoría)
                        3: { cellWidth: 30 }, // Establecer el ancho de la cuarta columna (Monto)
                    },
                    margin: { top: 10 }, // Márgenes adicionales
                    showHead: 'everyPage', // Mostrar encabezado en todas las páginas
                });
            } else {
                pdf.text("No hay datos disponibles para mostrar del mes actual.", 10, 40);
            }

            // Guardar el PDF
            pdf.save("reporte_gastos_mes_completo.pdf");

        } catch (error) {
            console.error('Error durante la generación del PDF:', error);
            alert('Hubo un error al preparar el PDF.');
        } finally {
            // Eliminar el canvas temporal y destruir el gráfico
            chart.destroy(); // Importante para liberar memoria
            tempCanvas.remove();
        }
    }, 1000); // Esperar 1 segundo para asegurar la renderización del gráfico
}

// Función para formatear la fecha (quitar la parte de la hora)
function formatDate(date) {
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // Formato YYYY-MM-DD
}

