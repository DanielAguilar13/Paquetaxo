async function actualizarEstado() {
    try {
        const saldoResponse = await fetch('/saldo');
        if (!saldoResponse.ok) throw new Error('Error al obtener el saldo');
        const saldoData = await saldoResponse.json();
        const limiteGastos = saldoData[0]?.saldo || 0;

        const gastoResponse = await fetch('/gasto');
        if (!gastoResponse.ok) throw new Error('Error al obtener los gastos');
        const gastoData = await gastoResponse.json();
        const gastosActuales = gastoData[0]?.gasto || 0;

        // Verifica si los elementos del DOM existen
        const estadoCarita = document.getElementById("estadoCarita");
        if (!estadoCarita) {
            console.error("Elemento 'estadoCarita' no encontrado en el DOM");
            return; // Detenemos aquí si no existe
        }

        const porcentaje = limiteGastos > 0 ? (gastosActuales / limiteGastos) * 100 : 0;

        if (porcentaje < 50) {
            estadoCarita.src = "./img/cara_verde.png";
            estadoCarita.alt = "Todo bajo control";
        } else if (porcentaje >= 50 && porcentaje < 80) {
            estadoCarita.src = "./img/cara_amarillo.png";
            estadoCarita.alt = "Alerta: alcanzaste la mitad";
        } else if (porcentaje >= 80) {
            estadoCarita.src = "./img/cara_rojo.png";
            estadoCarita.alt = "Cuidado: límite alcanzado o superado";
        } else {
            estadoCarita.src = "./img/cara_neutral.png";
            estadoCarita.alt = "Límite no establecido";
        }
    } catch (error) {
        console.error("Error al actualizar el estado:", error);
        alert('Hubo un problema al obtener los datos. Por favor, intenta más tarde.');
    }
}

// Ejecutar la función actualizarEstado al cargar la página
document.addEventListener("DOMContentLoaded", actualizarEstado);
