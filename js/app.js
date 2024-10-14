// Usuarios de prueba
const users = [
  { username: "testuser", password: "testpass" },
  { username: "admin", password: "admin" }
];

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


