document.addEventListener('DOMContentLoaded', function () {
  let carrito = [];
  let productos = [];
  const listaCarrito = document.getElementById('lista-carrito');
  const totalCarrito = document.getElementById('total-carrito');
  const btnCarrito = document.getElementById('btn-carrito');
  const menuCarrito = document.getElementById('menu-carrito');
  const btnCerrarCarrito = document.getElementById('cerrar-carrito');
  const contadorCarrito = document.getElementById('carrito-contador');
  const buscadorProductos = document.getElementById('buscador-productos');
  const filtroPrecio = document.getElementById('filtro-precio');
  const filtroTalle = document.getElementById('filtro-talle');

  function agregarAlCarrito(nombre, precio, imagen, talle) {
    const productoExistente = carrito.find(item => item.nombre === nombre && item.talle === talle);
    if (productoExistente) {
      productoExistente.cantidad++;
    } else {
      carrito.push({ nombre, precio, imagen, talle, cantidad: 1 });
    }
    actualizarCarrito();
    guardarCarrito();
    abrirCarrito();
  }

  function actualizarCarrito() {
    listaCarrito.innerHTML = '';
    const total = carrito.reduce((sum, item) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <img src="${item.imagen}" alt="${item.nombre}" width="50">
        <div>
          <h6>${item.nombre} (Talle: ${item.talle})</h6>
          <p>$${item.precio} x ${item.cantidad}</p>
          <button class="btn-disminuir" data-nombre="${item.nombre}" data-talle="${item.talle}">-</button>
          <span>${item.cantidad}</span>
          <button class="btn-aumentar" data-nombre="${item.nombre}" data-talle="${item.talle}">+</button>
        </div>
        <button class="btn-eliminar" data-nombre="${item.nombre}" data-talle="${item.talle}">X</button>
      `;
      listaCarrito.appendChild(li);
      return sum + item.precio * item.cantidad;
    }, 0);
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
  }

  function cerrarCarrito() {
    menuCarrito.classList.remove('show');
  }

  function cargarProductos() {
    const cards = document.querySelectorAll('.card');
    productos = Array.from(cards).map(card => {
      const nombre = card.querySelector('.card-title').textContent;
      const precio = parseFloat(card.querySelector('.card-text').textContent.match(/\d+(\.\d+)?/)[0]);
      const imagen = card.querySelector('img').src;
      const talle = card.dataset.talle || 'Único';
      return { nombre, precio, imagen, talle };
    });
    mostrarProductos(productos); // Mostrar todos los productos al cargar
  }

  function filtrarProductos() {
    const busqueda = buscadorProductos.value.toLowerCase();
    const ordenPrecio = filtroPrecio.value;
    const talleSeleccionado = filtroTalle.value;

    let productosFiltrados = productos.filter(producto =>
      producto.nombre.toLowerCase().includes(busqueda) &&
      (talleSeleccionado === 'todos' || producto.talle === talleSeleccionado)
    );

    if (ordenPrecio === 'asc') {
      productosFiltrados.sort((a, b) => a.precio - b.precio);
    } else if (ordenPrecio === 'desc') {
      productosFiltrados.sort((a, b) => b.precio - a.precio);
    }

    mostrarProductos(productosFiltrados);
  }

  function mostrarProductos(productosMostrar) {
    const contenedorProductos = document.querySelector('venta-productos');
    if (!contenedorProductos) {
      console.error('El contenedor de productos no se encontró.');
      return; // Salir de la función si no se encuentra el contenedor
    }

    // Limpiar el contenedor antes de agregar nuevos productos
    contenedorProductos.innerHTML = productosMostrar.map(producto => `
      <div class="col">
        <div class="card text-center" data-talle="${producto.talle}">
          <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}" />
          <div class="card-body">
            <h5 class="card-title">${producto.nombre}</h5>
            <p class="card-text">
              Perfecto para la fiesta de tus sueños. <br />
              $ ${producto.precio.toFixed(2)}
            </p>
            <p>Talle: ${producto.talle}</p>
            <button class="btn btn-primary agregar-al-carrito" 
              data-nombre="${producto.nombre}" 
              data-precio="${producto.precio}" 
              data-imagen="${producto.imagen}"
              data-talle="${producto.talle}">
              Agregar al Carrito
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Volver a agregar los event listeners a los nuevos botones
    document.querySelectorAll('.agregar-al-carrito').forEach(button => {
      button.removeEventListener('click', agregarAlCarritoHandler); // Eliminar listener previo
      button.addEventListener('click', agregarAlCarritoHandler);
    });
  }

  // Función para manejar el evento de agregar al carrito
  function agregarAlCarritoHandler(e) {
    const button = e.currentTarget;
    const nombre = button.dataset.nombre;
    const precio = parseFloat(button.dataset.precio);
    const imagen = button.dataset.imagen;
    const talle = button.dataset.talle;
    agregarAlCarrito(nombre, precio, imagen, talle);
  }

  // Event Listeners
  listaCarrito.addEventListener('click', function (e) {
    const nombre = e.target.dataset.nombre;
    const talle = e.target.dataset.talle;
    if (e.target.classList.contains('btn-eliminar')) {
      carrito = carrito.filter(item => !(item.nombre === nombre && item.talle === talle));
    } else if (e.target.classList.contains('btn-disminuir')) {
      const item = carrito.find(item => item.nombre === nombre && item.talle === talle);
      if (item && item.cantidad > 1) {
        item.cantidad--;
      } else {
        carrito = carrito.filter(item => !(item.nombre === nombre && item.talle === talle));
      }
    } else if (e.target.classList.contains('btn-aumentar')) {
      const item = carrito.find(item => item.nombre === nombre && item.talle === talle);
      if (item) {
        item.cantidad++;
      }
    }
    actualizarCarrito();
    guardarCarrito();
  });

  btnCarrito.addEventListener('click', function (e) {
    e.preventDefault();
    abrirCarrito();
  });

  btnCerrarCarrito.addEventListener('click', function (e) {
    e.preventDefault();
    cerrarCarrito();
  });

  buscadorProductos.addEventListener('input', filtrarProductos);
  filtroPrecio.addEventListener('change', filtrarProductos);
  filtroTalle.addEventListener('change', filtrarProductos);

  // Inicialización
  cargarCarrito();
  cargarProductos();
});