// Selección de elementos
const sidebar = document.querySelector('.sidebar');
const openBtn = document.querySelector('.open-btn');
const closeBtn = document.querySelector('.close-btn');
const addBtn = document.querySelector('.btn-add');
const paginationButtons = document.querySelectorAll('.pagination button');

// Función para abrir la barra lateral
openBtn.addEventListener('click', () => {
  sidebar.classList.add('sidebar-open');
});

// Función para cerrar la barra lateral
closeBtn.addEventListener('click', () => {
  sidebar.classList.remove('sidebar-open');
});

// Animación de botón de añadir
addBtn.addEventListener('mouseover', () => {
  addBtn.style.transform = 'scale(1.05)';
});
addBtn.addEventListener('mouseout', () => {
  addBtn.style.transform = 'scale(1)';
});

// Animación para botones de paginación
paginationButtons.forEach(button => {
  button.addEventListener('mouseover', () => {
    button.style.transform = 'scale(1.1)';
  });
  button.addEventListener('mouseout', () => {
    button.style.transform = 'scale(1)';
  });
  button.addEventListener('click', () => {
    paginationButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
  });
});