// Obtener movimientos y configurar tabla y gráfica
fetch('/movimientos')
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener los datos: ' + response.statusText);
        }
        return response.json();
    })
    .then(movimientos => {
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
                movimientos.forEach(item => {
                    const fila = document.createElement('tr');
                    fila.innerHTML = `
                        <td>${item.fecha}</td>
                        <td>${item.concepto}</td>
                        <td>${categoriasMap[item.id_categoria] || 'Sin categoría'}</td>
                        <td>${item.cantidad}</td>
                    `;
                    tabla.appendChild(fila);
                });

                // Configurar gráfica con los movimientos
                configurarGrafica(movimientos.map(mov => ({
                    ...mov,
                    categoria: categoriasMap[mov.id_categoria] || 'Sin categoría'
                })));

                // Hacer los datos accesibles globalmente
                window.gastos = movimientos.map(mov => ({
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
        labels: gastos.map(gasto => gasto.categoria), // Mostrar las categorías en lugar de conceptos
        datasets: [{
            label: 'Gastos Mensuales',
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

// Generación del PDF con la gráfica y tabla
function generatePDF() {
    const chartElement = document.getElementById('expenseChart');
    html2canvas(chartElement, { scale: 2 }).then(canvas => {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();

        // Reducir el tamaño de la gráfica en el PDF
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 100;
        const imgHeight = canvas.height * imgWidth / canvas.width;

        pdf.addImage(imgData, 'PNG', 20, 15, imgWidth, imgHeight);

        // Establecer el título en el PDF
        pdf.setFontSize(16);
        pdf.text("Movimientos de Gastos:", 15, imgHeight + 20);

        // Generar la tabla de gastos en el PDF
        if (window.gastos && window.gastos.length > 0) {
            pdf.autoTable({
                startY: imgHeight + 30,
                head: [['Fecha', 'Concepto', 'Categoría', 'Monto']],
                body: window.gastos.map(gasto => [
                    gasto.fecha, 
                    gasto.concepto, 
                    gasto.categoria, 
                    `$${gasto.cantidad}`
                ]),
                theme: 'grid',
                headStyles: { fillColor: [63, 81, 181], textColor: [255, 255, 255] },
                styles: { fontSize: 12, cellPadding: 3 }
            });
        } else {
            pdf.text("No hay datos disponibles para mostrar.", 15, imgHeight + 40);
        }

        // Descargar el PDF
        pdf.save("reporte_gastos.pdf");
    }).catch(error => {
        console.error('Error al generar el PDF:', error);
        alert('No se pudo generar el PDF.');
    });
}
