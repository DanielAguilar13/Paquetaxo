// Datos de gastos
const controlador = require('../../controllers/movimientos/index.js')

const gastos = [
    { fecha: '2023-11-01', descripcion: 'Despensa de la semana', categoria: 'Alimentación', monto: 200 },
    { fecha: '2023-11-02', descripcion: 'Taxi al trabajo', categoria: 'Transporte', monto: 150 },
    { fecha: '2023-11-03', descripcion: 'Pago de renta', categoria: 'Hogar', monto: 200 },
    { fecha: '2023-11-04', descripcion: 'Cine y cena', categoria: 'Entretenimiento', monto: 100 },
    { fecha: '2023-11-05', descripcion: 'Compras varias', categoria: 'Otros', monto: 250 }
];

// Configuración de la gráfica
const data = {
    labels: gastos.map(gasto => gasto.categoria),
    datasets: [{
        label: 'Gastos Mensuales',
        data: gastos.map(gasto => gasto.monto),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        hoverOffset: 4
    }]
};

const config = {
    type: 'bar',
    data: data,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 12
                    },
                    color: '#000000'
                }
            },
            tooltip: {
                enabled: true
            }
        }
    }
};

// Renderización de la gráfica y lista de gastos en el HTML
window.onload = function() {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    new Chart(ctx, config);

    const expenseList = document.getElementById('expenseList');
    gastos.forEach(gasto => {
        const item = document.createElement('p');
        item.textContent = `${gasto.fecha} - ${gasto.descripcion} - ${gasto.categoria}: $${gasto.monto}`;
        expenseList.appendChild(item);
    });
};

// Función para generar el PDF con tabla
function generatePDF() {
    const chartElement = document.getElementById('expenseChart');
    
    html2canvas(chartElement, { scale: 2 }).then(canvas => {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        
        // Reducir el tamaño de la gráfica en el PDF
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 80;
        const imgHeight = canvas.height * imgWidth / canvas.width;

        pdf.addImage(imgData, 'PNG', 10, 5, imgWidth, imgHeight);

        // Establecer el título en el PDF
        pdf.setFontSize(16);
        pdf.text("Movimientos de Gastos:", 15, imgHeight + 20);

        // Generar la tabla de gastos en el PDF
        pdf.autoTable({
            startY: imgHeight + 30,
            head: [['Fecha', 'Descripción', 'Categoría', 'Monto']],
            body: gastos.map(gasto => [gasto.fecha, gasto.descripcion, gasto.categoria, `$${gasto.monto}`]),
            theme: 'grid',
            
            // Cambiar el color del encabezado
            headStyles: { 
                fillColor: [63, 81, 181], // Color de fondo del encabezado (azul)
                textColor: [255, 255, 255] // Color del texto en el encabezado (blanco)
            },
            
            // Otros estilos opcionales para la tabla
            styles: { fontSize: 12, cellPadding: 3 }
        });

        // Descargar el PDF
        pdf.save("reporte_gastos.pdf");
    });
}
