const gastos = [
    { fecha: '2023-11-01', descripcion: 'Despensa de la semana', categoria: 'Alimentación', monto: 200 },
    { fecha: '2023-11-02', descripcion: 'Taxi al trabajo', categoria: 'Transporte', monto: 150 },
    { fecha: '2023-11-03', descripcion: 'Pago de renta', categoria: 'Hogar', monto: 200 },
    { fecha: '2023-11-04', descripcion: 'Cine y cena', categoria: 'Entretenimiento', monto: 100 },
    { fecha: '2023-11-05', descripcion: 'Compras varias', categoria: 'Otros', monto: 250 }
];

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
    type: 'pie',
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
                    color: '#333'
                }
            },
            tooltip: {
                enabled: true
            }
        }
    }
};

// Renderiza la gráfica y los datos de ejemplo
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

// Función para generar el PDF
function generatePDF() {
    const chartElement = document.getElementById('expenseChart');
    
    // Escala más alta para mejor resolución en PDF
    html2canvas(chartElement, { scale: 3 }).then(canvas => {
        const pdf = new jsPDF();
        
        // Ajuste del tamaño de la gráfica en el PDF
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 180; // Ajusta este valor para que se vea proporcionada
        const imgHeight = canvas.height * imgWidth / canvas.width; // Mantener proporción

        pdf.addImage(imgData, 'PNG', 3, 2, imgWidth, imgHeight);

        // Estilos para los textos de movimientos de gastos
        pdf.setFontSize(16);
        pdf.text("Movimientos de Gastos:", 15, imgHeight + 40);
        
        pdf.setFontSize(12);
        let yOffset = imgHeight + 50;

        // Espaciado y alineación para los detalles de los movimientos
        gastos.forEach(gasto => {
            pdf.text(`${gasto.fecha} - ${gasto.descripcion} - ${gasto.categoria}: $${gasto.monto}`, 15, yOffset);
            yOffset += 10; // Ajusta el espaciado entre líneas
        });

        // Descargar el PDF
        pdf.save("reporte_gastos.pdf");
    });
}