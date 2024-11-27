// Configurar la fecha mínima y máxima para el input de fecha
function goBackToHome() {
    // Reiniciar el formulario
    const formulario = document.getElementById('form-tarjetas');
    formulario.reset(); // Limpia todos los campos del formulario

    window.location.href = "tarjetas.html";
}

document.addEventListener("DOMContentLoaded", function () {
    // Referencias a los elementos del DOM
    const form = document.getElementById("form-tarjetas");
    const tipoTarjeta = document.getElementById("tipo_tarjeta");
    const camposCredito = document.getElementById("campos_credito");
    const alerta = document.getElementById("alerta");

    // Constantes de validación
    const decimalRegex = /^\d+(\.\d{1,2})?$/;
    const ultimosDigitosRegex = /^\d{4}$/;
    const ANIO_MIN = 24;
    const ANIO_MAX = 50;

    // Mostrar u ocultar campos según el tipo de tarjeta
    tipoTarjeta.addEventListener("change", function () {
        if (this.value === "credito") {
            camposCredito.classList.remove("hidden");
        } else {
            camposCredito.classList.add("hidden");
        }
    });

    // Ocultar alertas dinámicamente al cambiar valores
    form.addEventListener("input", function () {
        alerta.style.display = "none";
        alerta.textContent = "";
    });

    // Validar formulario antes de enviarlo
    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevenir el envío por defecto
        let isValid = true;
        const messages = [];

        // Campos del formulario
        const nombre = document.getElementById("nombre");
        const ultimosDigitos = document.getElementById("ultimos_digitos");
        const limiteCredito = document.getElementById("limite_credito");
        const diaCorte = document.getElementById("dia_corte");
        const saldo = document.getElementById("saldo");
        const mesVencimiento = document.getElementById("mes_vencimiento");
        const anioVencimiento = document.getElementById("anio_vencimiento");

        // Validaciones generales
        if (!tipoTarjeta.value) {
            isValid = false;
            messages.push("Debe seleccionar un tipo de tarjeta: débito o crédito.");
        }

        if (!nombre.value || nombre.value.trim().length < 3) {
            isValid = false;
            messages.push("El nombre de la tarjeta debe tener al menos 3 caracteres.");
        }

        if (!ultimosDigitos.value || !ultimosDigitosRegex.test(ultimosDigitos.value)) {
            isValid = false;
            messages.push("Los últimos 4 dígitos deben ser un número de 4 cifras.");
        }

        if (!saldo.value || !decimalRegex.test(saldo.value) || parseFloat(saldo.value) < 0) {
            isValid = false;
            messages.push("El saldo debe ser un número positivo con hasta 2 decimales.");
        }

        // Validaciones específicas para tarjeta de crédito
        if (tipoTarjeta.value === "credito") {
            if (!limiteCredito.value || !decimalRegex.test(limiteCredito.value) || parseFloat(limiteCredito.value) <= 0) {
                isValid = false;
                messages.push("El límite de crédito debe ser un número positivo con hasta 2 decimales.");
            }

            if (!diaCorte.value || parseInt(diaCorte.value) < 1 || parseInt(diaCorte.value) > 31) {
                isValid = false;
                messages.push("El día de corte debe ser un número entre 1 y 31.");
            }
        }

        // Validar mes y año de vencimiento
        const mes = parseInt(mesVencimiento.value);
        const anio = parseInt(anioVencimiento.value);

        if (!anioVencimiento.value || anio < ANIO_MIN || anio > ANIO_MAX) {
            isValid = false;
            messages.push(`El año de vencimiento debe estar entre ${ANIO_MIN} y ${ANIO_MAX}.`);
        }

        if (anio === ANIO_MIN && mes !== 12) {
            isValid = false;
            messages.push("Para el año 24, el mes de vencimiento debe ser 12.");
        }

        if (!mesVencimiento.value || mes < 1 || mes > 12) {
            isValid = false;
            messages.push("El mes de vencimiento debe ser un número entre 1 y 12.");
        }

        // Mostrar errores si los hay
        if (!isValid) {
            alerta.style.display = "block";
            alerta.style.color = "red";
            alerta.innerHTML = messages.join("<br>");
            return; // Detener el envío
        }

        // Preparar datos para la API
        const id = document.getElementById("id").value || 0;
        const data = {
            id,
            nombre: nombre.value.trim(),
            ultimos_digitos: ultimosDigitos.value,
            saldo: parseFloat(saldo.value),
            mes_vencimiento: mes,
            anio_vencimiento: anio,
        };

        if (tipoTarjeta.value === "credito") {
            data.limite_credito = parseFloat(limiteCredito.value);
            data.dia_corte = parseInt(diaCorte.value);
        }

        // Enviar datos a la API
        try {
            const response = await fetch("/api/tarjeta", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Error en la operación");
            }

            const result = await response.json();
            alert("Operación exitosa");
            window.location.href = "/tarjetas.html";
        } catch (error) {
            console.error("Error:", error);
            alert("Hubo un error al procesar la solicitud");
        }
    });
});