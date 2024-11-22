// Llenar el select de categorías con datos de la API
fetch('/categorias')
    .then(response => response.json())
    .then(data => {
        const select = document.getElementById('id_categoria');
        data.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.id; // ID de la categoría
            option.textContent = categoria.nombre; // Nombre de la categoría
            select.appendChild(option);
        });
    })
    .catch(error => console.error('Error al cargar las categorías:', error));

// Llenar el select de tipos de pago con datos de la API
fetch('/tipo_de_pago')
    .then(response => response.json())
    .then(data => {
        const select = document.getElementById('id_tipo');
        data.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo.id; // ID del tipo de pago
            option.textContent = tipo.nombre; // Nombre del tipo de pago
            select.appendChild(option);
        });
    })
    .catch(error => console.error('Error al cargar los tipos de pago:', error));

// Llenar el select de tarjetas con datos de la API
fetch('/tarjetas')
    .then(response => response.json())
    .then(data => {
        const select = document.getElementById('id_tarjeta');
        data.forEach(tarjeta => {
            const option = document.createElement('option');
            option.value = tarjeta.id; // ID de la tarjeta
            option.textContent = tarjeta.nombre; // Nombre de la tarjeta
            select.appendChild(option);
        });
    })
    .catch(error => console.error('Error al cargar las tarjetas:', error));

// Función para volver a la página de inicio
function goBackToHome() {
    window.location.href = "recordatorios.html";
}
