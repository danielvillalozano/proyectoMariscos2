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

document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();

      const nombreUsuario = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (nombreUsuario === "" || password === "") {
        mostrarMensaje("Por favor, complete todos los campos.");
        return;
    }


 get(refS(db, "Usuarios"))
    .then((snapshot) => {
        if (snapshot.exists()) {
            const usuarios = snapshot.val();
            let usuarioEncontrado = null;

            Object.values(usuarios).forEach((usuario) => {
                if (usuario.nombre === nombreUsuario) {
                    usuarioEncontrado = usuario;
                }
            });

            if (usuarioEncontrado) {
                if (usuarioEncontrado.contraseña === password) {
                    mostrarMensaje("Inicio de sesión exitoso. Bienvenido, " + usuarioEncontrado.nombre);
                    sessionStorage.setItem("usuario", usuarioEncontrado.nombre); 
                    window.location.href = "/admin/editar-platillos.html"; 
                } else {
                    mostrarMensaje("Contraseña incorrecta.");
                }
            } else {
                mostrarMensaje("El usuario con nombre " + nombreUsuario + " no existe.");
            }
        } else {
            mostrarMensaje("No hay usuarios registrados.");
        }
    })
    .catch((error) => {
        mostrarMensaje("Error al verificar el usuario: " + error.message);
    });
});

function mostrarMensaje(mensaje) {
    document.getElementById("mensaje").textContent = mensaje;
}