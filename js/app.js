// Usuarios de prueba
const users = [
  { username: "testuser", password: "testpass" },
  { username: "admin", password: "admin" }
];

// Manejo del inicio de sesión
document.getElementById('loginForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('loginPassword').value;

  const user = users.find(user => user.username === username && user.password === password);
  if (user) {
    alert('Inicio de sesión exitoso');
  } else {
    alert('Credenciales incorrectas. Inténtalo de nuevo.');
  }
});

// Manejo del registro de usuarios
document.getElementById('registerForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const username = document.getElementById('registerUsername').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('registerConfirmPassword').value;

  if (password !== confirmPassword) {
    alert('Las contraseñas no coinciden.');
    return;
  }

  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    alert('El nombre de usuario ya está en uso. Elige otro.');
    return;
  }

  users.push({ username: username, password: password });
  alert('Registro exitoso. Ahora puedes iniciar sesión.');
  document.getElementById('registerForm').reset();
});

// Manejo del simulador de alquiler
document.addEventListener("DOMContentLoaded", function () {
  const simuladorForm = document.getElementById("simuladorForm");
  const simuladorResultado = document.getElementById("simuladorResultado");

  simuladorForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Evita el envío del formulario
    const diasAlquiler = parseInt(document.getElementById("diasAlquiler").value);
    const precioPorDia = parseFloat(document.getElementById("precioPorDia").value);

    const total = diasAlquiler * precioPorDia;

    simuladorResultado.innerHTML = `<strong>Total a Pagar: $${total.toLocaleString()}</strong>`;
  });
});

// Manejo del carrito de compras
const listaCarrito = document.getElementById('lista-carrito');
const totalCarrito = document.getElementById('total-carrito');
const btnCarrito = document.getElementById('btn-carrito');
const menuCarrito = document.getElementById('menu-carrito');
const cerrarCarrito = document.getElementById('cerrar-carrito');

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function agregarAlCarrito(nombre, precio, imagen) {
  const producto = { nombre, precio: parseFloat(precio), imagen };
  carrito.push(producto);
  actualizarCarrito();
}

function actualizarCarrito() {
  listaCarrito.innerHTML = '';
  carrito.forEach((producto, index) => {
    const item = document.createElement('li');
    item.className = 'carrito-item';
    item.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}" width="50">
      <span>${producto.nombre} - $${producto.precio.toFixed(2)}</span>
      <button onclick="eliminarDelCarrito(${index})" class="btn btn-sm btn-danger">Eliminar</button>
    `;
    listaCarrito.appendChild(item);
  });
  const total = carrito.reduce((sum, producto) => sum + producto.precio, 0);
  totalCarrito.innerText = `Total: $${total.toFixed(2)}`;
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
}

btnCarrito.addEventListener('click', () => {
  menuCarrito.classList.toggle('activo');
});

cerrarCarrito.addEventListener('click', () => {
  menuCarrito.classList.remove('activo');
});

document.addEventListener('DOMContentLoaded', actualizarCarrito);
