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

  // Función para agregar al carrito
  function agregarAlCarrito(nombre, precio, imagen, talle) {
    const productoExistente = carrito.find(item => item.nombre === nombre && item.talle === talle);
    if (productoExistente) {
      productoExistente.cantidad++;
    } else {
      carrito.push({ nombre, precio, imagen, talle, cantidad: 1 });
    }
    console.log("Carrito actualizado:", carrito);
    actualizarCarrito();
    guardarCarrito();
    abrirCarrito();
  }

  // Función para actualizar el carrito
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

  // Guardar el carrito en localStorage
  function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }

  // Cargar el carrito desde localStorage
  function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      carrito = JSON.parse(carritoGuardado);
      actualizarCarrito();
    }
  }

  // Función para abrir el carrito
  function abrirCarrito() {
    menuCarrito.classList.add('show');
  }

  // Función para cerrar el carrito
  function cerrarCarrito() {
    menuCarrito.classList.remove('show');
  }

  // Cargar productos desde el archivo JSON
  function cargarProductos() {
    fetch('../data/productos.json')
      .then(response => response.json())
      .then(data => {
        productos = data.productos;
        console.log('Productos cargados:', productos);
        if (Array.isArray(productos)) {
          filtrarProductosPorCategoria();
          mostrarProductos(productos);  // Mostrar productos cargados
        } else {
          console.error('Los productos no son un array');
        }
      })
      .catch(error => {
        console.error('Error al cargar los productos:', error);
      });
  }

  // Filtrar productos por categoría
  function filtrarProductosPorCategoria() {
    if (!Array.isArray(productos)) {
      console.error('Productos no es un array');
      return;
    }

    const pathname = window.location.pathname;
    let categoriaSeleccionada = '';

    if (pathname.includes('accesorios.html')) {
      categoriaSeleccionada = 'Accesorios';
    } else if (pathname.includes('carteras.html')) {
      categoriaSeleccionada = 'Carteras';
    } else if (pathname.includes('ropaInterior.html')) {
      categoriaSeleccionada = 'Ropa Interior';
    }

    if (categoriaSeleccionada) {
      productos = productos.filter(producto => producto.categoria === categoriaSeleccionada);
      console.log('Productos filtrados por categoría:', productos);
    }
  }

  // Función para mostrar productos, con orden de precio y filtro por talle
  function mostrarProductos(productosMostrar, ordenarPorPrecio = 'asc', talleSeleccionado = '') {
    const contenedorProductos = document.querySelector('.row-cols-1');
    if (!contenedorProductos) {
      console.error('El contenedor de productos no se encontró.');
      return;
    }

    contenedorProductos.innerHTML = '';

    // Filtrar productos por talle
    if (talleSeleccionado && talleSeleccionado !== 'todos') {
      productosMostrar = productosMostrar.filter(producto => producto.talle === talleSeleccionado);
    }

    // Ordenar productos por precio
    if (ordenarPorPrecio === 'asc') {
      productosMostrar.sort((a, b) => a.precio - b.precio);
    } else if (ordenarPorPrecio === 'desc') {
      productosMostrar.sort((a, b) => b.precio - a.precio);
    }

    contenedorProductos.innerHTML = productosMostrar.map(producto => `
    <div class="col">
      <div class="card text-center" data-talle="${producto.talle}">
        <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}" />
        <div class="card-body">
          <h5 class="card-title">${producto.nombre}</h5>
          <p class="card-text">
            ${producto.descripcion} <br />
            Talle: ${producto.talle}<br />
            $ ${producto.precio.toFixed(2)} 
          </p>
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

    // Asignar el evento a los botones de agregar al carrito
    document.querySelectorAll('.agregar-al-carrito').forEach(button => {
      button.addEventListener('click', agregarAlCarritoHandler);
    });
  }

  // Event Listener para el filtro de precio
  filtroPrecio.addEventListener('change', function (e) {
    const ordenSeleccionado = e.target.value;
    mostrarProductos(productos, ordenSeleccionado, filtroTalle.value);  // Pasar el talle seleccionado también
  });

  // Event Listener para el filtro de talle
  filtroTalle.addEventListener('change', function (e) {
    const talleSeleccionado = e.target.value;
    mostrarProductos(productos, filtroPrecio.value, talleSeleccionado);  // Pasar el precio seleccionado también
  });


  // Función para manejar el evento de agregar al carrito
  function agregarAlCarritoHandler(e) {
    const button = e.currentTarget;
    const nombre = button.dataset.nombre;
    const precio = parseFloat(button.dataset.precio);
    const imagen = button.dataset.imagen;
    const talle = button.dataset.talle;
    agregarAlCarrito(nombre, precio, imagen, talle);
  }

  // Inicialización
  cargarCarrito();
  cargarProductos();
});
