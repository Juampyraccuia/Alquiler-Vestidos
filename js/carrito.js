document.addEventListener('DOMContentLoaded', function () {
  let carrito = [];
  const listaCarrito = document.getElementById('lista-carrito');
  const totalCarrito = document.getElementById('total-carrito');
  const btnCarrito = document.getElementById('btn-carrito');
  const menuCarrito = document.getElementById('menu-carrito');
  const btnCerrarCarrito = document.getElementById('cerrar-carrito');
  const contadorCarrito = document.getElementById('carrito-contador');

  function agregarAlCarrito(nombre, precio, imagen) {
    const productoExistente = carrito.find(item => item.nombre === nombre);
    if (productoExistente) {
      productoExistente.cantidad++;
    } else {
      carrito.push({ nombre, precio, imagen, cantidad: 1 });
    }
    actualizarCarrito();
    guardarCarrito();
    abrirCarrito();
  }

  function actualizarCarrito() {
    listaCarrito.innerHTML = '';
    let total = 0;
    carrito.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `
        <img src="${item.imagen}" alt="${item.nombre}" width="50">
        <div>
          <h6>${item.nombre}</h6>
          <p>$${item.precio} x ${item.cantidad}</p>
        </div>
        <button class="btn-eliminar" data-nombre="${item.nombre}">X</button>
      `;
      listaCarrito.appendChild(li);
      total += item.precio * item.cantidad;
    });
    totalCarrito.textContent = `Total: $${total.toFixed(2)}`;
    contadorCarrito.textContent = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  }

  function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }

  function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      carrito = JSON.parse(carritoGuardado);
      actualizarCarrito();
    }
  }

  function abrirCarrito() {
    menuCarrito.classList.add('show');
    console.log('Abriendo carrito');
  }

  function cerrarCarrito() {
    menuCarrito.classList.remove('show');
    console.log('Cerrando carrito');
  }

  document.querySelectorAll('.agregar-al-carrito').forEach(button => {
    button.addEventListener('click', function () {
      const nombre = this.dataset.nombre;
      const precio = parseFloat(this.dataset.precio);
      const imagen = this.dataset.imagen;
      agregarAlCarrito(nombre, precio, imagen);
    });
  });

  listaCarrito.addEventListener('click', function (e) {

    if (e.target.classList.contains('btn-eliminar')) {
      const nombre = e.target.dataset.nombre;
      carrito = carrito.filter(item => item.nombre !== nombre);
      actualizarCarrito();
      guardarCarrito();
    }
  });

  btnCarrito.addEventListener('click', function (e) {
    e.preventDefault();
    abrirCarrito();
  });

  btnCerrarCarrito.addEventListener('click', function (e) {
    e.preventDefault();
    cerrarCarrito();
  });

  cargarCarrito();
});