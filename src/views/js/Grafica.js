// Obtener movimientos y configurar tabla y gráfica
fetch('/movimiento')
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener los datos: ' + response.statusText);
        }
        return response.json();
    })
    .then(movimientos => {
        // Filtrar movimientos del mes actual
        const fechaActual = new Date();
        const mesActual = fechaActual.getMonth();
        const anioActual = fechaActual.getFullYear();
        const movimientosMesActual = movimientos.filter(mov => {
            const fecha = new Date(mov.fecha);
            return fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual;
        });

        // Tomar los últimos 5 movimientos del mes
        const movimientosRecientesMes = movimientosMesActual.slice(-5);

        // Obtener categorías y hacer el mapeo
        fetch('/categorias')
            .then(response => response.json())
            .then(categorias => {
                // Crear un mapa para encontrar los nombres por el ID de categoría
                const categoriasMap = categorias.reduce((map, categoria) => {
                    map[categoria.id] = categoria.nombre;
                    return map;
                }, {});

                // Actualizar la tabla debajo de la gráfica
                const tabla = document.getElementById('tabla-datos');
                tabla.innerHTML = ''; // Limpiar contenido anterior
                movimientosRecientesMes.forEach(item => {
                    const fecha = new Date(item.fecha);
                    const fechaFormateada = `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getFullYear()}`;
                    const fila = document.createElement('tr');
                    fila.innerHTML = `
                        <td>${fechaFormateada}</td>
                        <td>${item.concepto}</td>
                        <td>${categoriasMap[item.id_categoria] || 'Sin categoría'}</td>
                        <td>${item.cantidad.toFixed(2)}</td>
                    `;
                    tabla.appendChild(fila);
                });

                // Configurar gráfica con los últimos 5 movimientos del mes
                configurarGrafica(movimientosRecientesMes.map(mov => ({
                    ...mov,
                    categoria: categoriasMap[mov.id_categoria] || 'Sin categoría'
                })));

                // Hacer los movimientos del mes accesibles globalmente
                window.movimientosMesActual = movimientosMesActual.map(mov => ({
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
            label: 'Últimos 5 Movimientos del Mes',
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

// Generación del PDF con bordes en la tabla
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    // Título del reporte
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(40, 40, 40);
    pdf.text("Reporte de Movimientos del Mes Actual", 15, 20);

    // Generar la tabla con estilo mejorado
    if (window.movimientosMesActual && window.movimientosMesActual.length > 0) {
        pdf.autoTable({
            startY: 30,
            head: [['Fecha', 'Concepto', 'Categoría', 'Monto']],
            body: window.movimientosMesActual.map(gasto => [
                formatDate(gasto.fecha),
                gasto.concepto,
                gasto.categoria,
                `$${gasto.cantidad.toFixed(2)}`
            ]),
            theme: 'striped', // Tema básico, luego se ajustan los estilos
            headStyles: {
                fillColor: [0, 123, 255], // Azul moderno
                textColor: [255, 255, 255], // Texto blanco
                fontSize: 12,
                fontStyle: 'bold',
                halign: 'center'
            },
            bodyStyles: {
                fontSize: 10,
                lineColor: [200, 200, 200], // Bordes grises suaves
                lineWidth: 0.5
            },
            alternateRowStyles: { fillColor: [245, 245, 245] }, // Color claro para filas alternas
            columnStyles: {
                0: { halign: 'center' }, // Fecha alineada al centro
                1: { halign: 'left' },   // Concepto alineado a la izquierda
                2: { halign: 'left' },   // Categoría alineada a la izquierda
                3: { halign: 'right' }   // Monto alineado a la derecha
            },
            margin: { top: 25, left: 15, right: 15 },
            styles: { overflow: 'linebreak', cellPadding: 6 } // Mejor espaciado
        });
    } else {
        pdf.setFontSize(14);
        pdf.text("No hay datos disponibles para mostrar.", 15, 40);
    }

    // Descargar el PDF
    pdf.save("reporte_movimientos_mes_actual.pdf");
}

// Función para formatear la fecha
function formatDate(date) {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
}

