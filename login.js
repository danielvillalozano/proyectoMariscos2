    import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getDatabase, ref as refS, get } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';

// Configuración correcta de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDcMGluQIQWb4KaopAagG3NtOH0huq4jpo",
  authDomain: "mariscosproyecto.firebaseapp.com",
  databaseURL: "https://mariscosproyecto-default-rtdb.firebaseio.com/",
  projectId: "mariscosproyecto",
  storageBucket: "mariscosproyecto.firebasestorage.app",
  messagingSenderId: "708491546938",
  appId: "1:708491546938:web:e3fdb32d77bf08b72b0003"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Elementos del formulario
const form = document.getElementById('loginForm');
const inputUsuario = document.getElementById('username');
const inputPassword = document.getElementById('password');
const divMensaje = document.getElementById('mensaje');

function mostrarMensaje(m) {
  divMensaje.textContent = m;
}

// Evento de envío del formulario
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombreUsuario = inputUsuario.value.trim();
  const password = inputPassword.value.trim();

  if (!nombreUsuario || !password) {
    mostrarMensaje('Por favor, complete todos los campos.');
    return;
  }

  try {
    const snap = await get(refS(db, 'Usuarios'));
    if (!snap.exists()) {
      mostrarMensaje('No hay usuarios registrados.');
      return;
    }

    const usuarios = snap.val();
    let usuarioEncontrado = null;

    for (const u of Object.values(usuarios)) {
      if (u.nombre === nombreUsuario) {
        usuarioEncontrado = u;
        break;
      }
    }

    if (!usuarioEncontrado) {
      mostrarMensaje(`El usuario con nombre ${nombreUsuario} no existe.`);
      return;
    }

    if (usuarioEncontrado.contraseña === password) {
      mostrarMensaje(`Inicio de sesión exitoso. Bienvenido, ${usuarioEncontrado.nombre}`);
      sessionStorage.setItem('usuario', usuarioEncontrado.nombre);
      window.location.href = 'productos.html';
    } else {
      mostrarMensaje('Contraseña incorrecta.');
    }
  } catch (err) {
    mostrarMensaje('Error al verificar el usuario: ' + err.message);
  }
});
