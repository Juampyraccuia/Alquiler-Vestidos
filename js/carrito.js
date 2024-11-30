document.addEventListener('DOMContentLoaded', () => {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  const btnCarrito = document.getElementById('btn-carrito');
  const menuCarrito = document.getElementById('menu-carrito');
  const cerrarCarrito = document.getElementById('cerrar-carrito');
  const listaCarrito = document.getElementById('lista-carrito');
  const totalCarrito = document.getElementById('total-carrito');
  const carritoContador = document.getElementById('carrito-contador');
  const vaciarCarritoBtn = document.createElement('button');

  vaciarCarritoBtn.textContent = 'Vaciar carrito';
  vaciarCarritoBtn.classList.add('btn', 'btn-danger');
  vaciarCarritoBtn.id = 'vaciar-carrito';
  vaciarCarritoBtn.style.marginTop = '10px';

  // Obtén el archivo actual y asigna la categoría
  const archivoActual = window.location.pathname.split('/').pop();
  let categoriaActual = '';

  if (archivoActual === 'carteras.html') {
    categoriaActual = 'carteras';
  } else if (archivoActual === 'ropaInterior.html') {
    categoriaActual = 'ropa interior';
  } else if (archivoActual === 'accesorios.html') {
    categoriaActual = 'accesorios';
  }

  const actualizarCarrito = () => {
    listaCarrito.innerHTML = '';
    let total = 0;

    carrito.forEach((producto, index) => {
      const li = document.createElement('li');
      li.classList.add('carrito-item', 'mb-3');
      li.innerHTML = `
      <div class="d-flex align-items-center">
        <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 50px; height: 50px; object-fit: cover;" class="me-3">
        <div>
          <span class="product-name d-block">${producto.nombre} (Talle: ${producto.talle})</span>
          <div class="cantidad-control mt-2">
            <button class="btn btn-secondary btn-disminuir" data-nombre="${producto.nombre}" data-talle="${producto.talle}">-</button>
            <input type="text" class="quantity-input mx-2" value="${producto.cantidad}" readonly style="width: 40px; text-align: center;">
            <button class="btn btn-secondary btn-aumentar" data-nombre="${producto.nombre}" data-talle="${producto.talle}">+</button>
          </div>
        </div>
        <button class="btn btn-danger ms-auto btn-eliminar" data-nombre="${producto.nombre}" data-talle="${producto.talle}">X</button>
      </div>
    `;
      listaCarrito.appendChild(li);
      total += producto.precio * producto.cantidad;
    });

    carritoContador.textContent = carrito.length;
    totalCarrito.textContent = `Total: $${total.toFixed(2)}`;

    if (carrito.length > 0) {
      if (!document.getElementById('vaciar-carrito')) {
        menuCarrito.appendChild(vaciarCarritoBtn);
      }
    } else {
      if (document.getElementById('vaciar-carrito')) {
        menuCarrito.removeChild(vaciarCarritoBtn);
      }
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
  };

  const vaciarCarrito = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esto eliminará todos los productos del carrito.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, vaciar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        carrito = [];
        actualizarCarrito();
        Swal.fire({
          title: 'Carrito vacío',
          text: 'Tu carrito ha sido vaciado.',
          icon: 'success',
          showConfirmButton: false,
          timer: 800
        });
      }
    });
  };


  const agregarAlCarrito = (producto) => {
    const productoCopia = { ...producto };
    const productoEnCarrito = carrito.find(item => item.id === productoCopia.id);

    if (productoEnCarrito) {
      productoEnCarrito.cantidad++;
    } else {
      productoCopia.cantidad = 1;
      carrito.push(productoCopia);
    }

    // Notificación con SweetAlert2
    Swal.fire({
      title: '¡Producto agregado!',
      text: `${producto.nombre} ha sido añadido al carrito.`,
      icon: 'success',
      showConfirmButton: false,
      timer: 800
    });

    actualizarCarrito();
  };


  fetch('../data/productos.json')
    .then(response => response.json())
    .then(data => {
      let productos = data.productos;

      // Filtrar productos según la categoría actual
      if (categoriaActual) {
        productos = productos.filter(producto => producto.categoria.toLowerCase() === categoriaActual);
      }

      const mostrarProductos = (productos) => {
        const contenedorProductos = document.querySelector('.venta-productos .row');
        contenedorProductos.innerHTML = '';

        productos.forEach(producto => {
          const productoCard = document.createElement('div');
          productoCard.classList.add('col', 'mb-4');
          productoCard.innerHTML = `
            <div class="card">
              <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
              <div class="card-body">
                <h5 class="card-title">${producto.nombre}</h5>
                <p class="card-text">${producto.descripcion}</p>
                <p class="card-text">$${producto.precio}</p>
                <button class="btn btn-primary">Agregar al carrito</button>
              </div>
            </div>
          `;

          const botonAgregar = productoCard.querySelector('button');
          botonAgregar.addEventListener('click', () => {
            agregarAlCarrito(producto);
          });

          contenedorProductos.appendChild(productoCard);
        });
      };

      mostrarProductos(productos);

      const filtroPrecio = document.getElementById('filtro-precio');
      filtroPrecio.addEventListener('change', () => {
        let productosOrdenados;
        if (filtroPrecio.value === 'asc') {
          productosOrdenados = productos.sort((a, b) => a.precio - b.precio);
        } else if (filtroPrecio.value === 'desc') {
          productosOrdenados = productos.sort((a, b) => b.precio - a.precio);
        } else {
          productosOrdenados = productos;
        }
        mostrarProductos(productosOrdenados);
      });

      const filtroTalle = document.getElementById('filtro-talle');
      filtroTalle.addEventListener('change', () => {
        const tallaSeleccionada = filtroTalle.value;
        const productosFiltradosPorTalle = productos.filter(producto => {
          return tallaSeleccionada === 'todos' || producto.talle === tallaSeleccionada;
        });
        mostrarProductos(productosFiltradosPorTalle);
      });

      const buscadorProductos = document.getElementById('buscador-productos');
      buscadorProductos.addEventListener('input', (e) => {
        const textoBusqueda = e.target.value.toLowerCase();
        const productosFiltradosPorBusqueda = productos.filter(producto =>
          producto.nombre.toLowerCase().includes(textoBusqueda) ||
          producto.descripcion.toLowerCase().includes(textoBusqueda)
        );
        mostrarProductos(productosFiltradosPorBusqueda);
      });
    })
    .catch(error => console.error('Error al cargar los productos:', error));

  listaCarrito.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-eliminar')) {
      const nombre = e.target.dataset.nombre;
      const talle = e.target.dataset.talle;

      Swal.fire({
        title: '¿Eliminar producto?',
        text: `¿Deseas eliminar ${nombre} (Talle: ${talle}) del carrito?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          carrito = carrito.filter(item => item.nombre !== nombre || item.talle !== talle);
          actualizarCarrito();

          Swal.fire({
            title: 'Producto eliminado',
            text: `${nombre} ha sido eliminado del carrito.`,
            icon: 'success',
            showConfirmButton: false,
            timer: 800
          });
        }
      });
    }
  });


  listaCarrito.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-disminuir')) {
      const nombre = e.target.dataset.nombre;
      const talle = e.target.dataset.talle;
      const producto = carrito.find(item => item.nombre === nombre && item.talle === talle);
      if (producto && producto.cantidad > 1) {
        producto.cantidad--;
        actualizarCarrito();
      }
    }
  });

  listaCarrito.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-aumentar')) {
      const nombre = e.target.dataset.nombre;
      const talle = e.target.dataset.talle;
      const producto = carrito.find(item => item.nombre === nombre && item.talle === talle);
      if (producto) {
        producto.cantidad++;
        actualizarCarrito();
      }
    }
  });

  btnCarrito.addEventListener('click', () => {
    menuCarrito.classList.toggle('show');
  });
  cerrarCarrito.addEventListener('click', () => {
    menuCarrito.classList.remove('show');
  });
  vaciarCarritoBtn.addEventListener('click', vaciarCarrito);

  actualizarCarrito();
});
