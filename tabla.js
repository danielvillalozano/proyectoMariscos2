import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getDatabase, ref as refS, onValue } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';

const firebaseConfig = {
  apiKey: "AIzaSyDcMGluQIQWb4KaopAagG3NtOH0huq4jpo",
  authDomain: "mariscosproyecto.firebaseapp.com",
  databaseURL: "https://mariscosproyecto-default-rtdb.firebaseio.com",
  projectId: "mariscosproyecto",
  storageBucket: "mariscosproyecto.firebasestorage.app",
  messagingSenderId: "708491546938",
  appId: "1:708491546938:web:e3fdb32d77bf08b72b0003",
  measurementId: "G-NHBMN57ZTF"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function listarProductos() {
  const dbref = refS(db, 'Productos');
  const tabla = document.getElementById('tabla-productos');
  const tbody = tabla.querySelector('tbody') || document.createElement('tbody');
  tbody.innerHTML = '';

  onValue(dbref, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      const fila = document.createElement('tr');

      const celdaId = document.createElement('td');
      celdaId.textContent = data.idProducto;
      fila.appendChild(celdaId);

      const celdaNombre = document.createElement('td');
      celdaNombre.textContent = data.nombre;
      fila.appendChild(celdaNombre);

      const celdaDescripcion = document.createElement('td');
      celdaDescripcion.textContent = data.descripcion;
      fila.appendChild(celdaDescripcion);

      const celdaCategoria = document.createElement('td');
      celdaCategoria.textContent = data.categoria;
      fila.appendChild(celdaCategoria);

      const celdaPrecio = document.createElement('td');
      celdaPrecio.textContent = data.precio;
      fila.appendChild(celdaPrecio);

      const celdaImagen = document.createElement('td');
      const imagen = document.createElement('img');
      imagen.src = data.urlImag;
      imagen.width = 100;
      celdaImagen.appendChild(imagen);
      fila.appendChild(celdaImagen);

      tbody.appendChild(fila);
    });
    tabla.appendChild(tbody);
  }, { onlyOnce: true });
}

listarProductos();
