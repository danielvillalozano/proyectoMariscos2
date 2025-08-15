import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getDatabase, ref as refS, set, child, get, onValue, update, remove } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';
import { getStorage, ref as refStorage, uploadBytesResumable, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js';

const firebaseConfig = {
  apiKey: "AIzaSyDcMGluQIQWb4KaopAagG3NtOH0huq4jpo",
  authDomain: "mariscosproyecto.firebaseapp.com",
  databaseURL: "https://mariscosproyecto-default-rtdb.firebaseio.com",
  projectId: "mariscosproyecto",
  storageBucket: "gs://mariscosproyecto.firebasestorage.app",
  messagingSenderId: "708491546938",
  appId: "1:708491546938:web:e3fdb32d77bf08b72b0003",
  measurementId: "G-NHBMN57ZTF"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

const imageInput = document.getElementById("imagenInput");
const uploadButton = document.getElementById("btnSubir");
const progressDiv = document.getElementById("progress");
const txtUrlInput = document.getElementById("txtUrl");

let id = '';
let nombre = '';
let descripcion = '';
let precio = 0.0;
let urlimagen = '';

function leerInputs() {
  id = document.getElementById('txtIdProducto').value.trim();
  nombre = document.getElementById('txtNombre').value.trim();
  descripcion = document.getElementById('txtDescripcion').value.trim();
  const precioInput = document.getElementById('txtPrecio').value;
  precio = precioInput ? parseFloat(precioInput) : NaN;
  urlimagen = document.getElementById('txtUrl').value.trim();
}

function mostrarMensaje(mensaje) {
  const mensajeElement = document.getElementById('mensaje');
  mensajeElement.textContent = mensaje;
  setTimeout(() => { mensajeElement.textContent = ""; }, 2000);
}

function limpiarInputs() {
  document.getElementById('txtIdProducto').value = "";
  document.getElementById('txtNombre').value = "";
  document.getElementById('txtDescripcion').value = "";
  document.getElementById('txtPrecio').value = "";
  document.getElementById('txtUrl').value = "";
  document.getElementById('imagenInput').value = "";
}

function escribirInputs() {
  document.getElementById('txtIdProducto').value = id;
  document.getElementById('txtNombre').value = nombre;
  document.getElementById('txtDescripcion').value = descripcion;
  document.getElementById('txtPrecio').value = precio;
  document.getElementById('txtUrl').value = urlimagen;
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnAgregar').addEventListener('click', insertarProducto);
  document.getElementById('btnBuscar').addEventListener('click', buscarProducto);
  document.getElementById('btnActualizar').addEventListener('click', actualizarProducto);
  document.getElementById('btnBorrar').addEventListener('click', borrarProducto);
  listarProductos();
});

function insertarProducto() {
  leerInputs();
  if (id === '' || nombre === '' || descripcion === '' || isNaN(precio) || urlimagen === '') {
    mostrarMensaje('Faltaron datos por capturar');
    return;
  }
  const nuevoProducto = { id, nombre, descripcion, urlimagen, precio };
  set(refS(db, 'Productos/' + id), nuevoProducto)
    .then(() => { mostrarMensaje('Se agregó con éxito'); limpiarInputs(); listarProductos(); })
    .catch(() => { mostrarMensaje('Ocurrió un error al agregar el producto'); });
}

function buscarProducto() {
  const numProd = document.getElementById("txtIdProducto").value.trim();
  if (numProd === "") { mostrarMensaje("No se ingresó el ID del producto"); return; }
  const dbref = refS(db);
  get(child(dbref, 'Productos/' + numProd))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        id = data.id || '';
        nombre = data.nombre || '';
        descripcion = data.descripcion || '';
        precio = data.precio ?? '';
        urlimagen = data.urlimagen || '';
        txtUrlInput.value = urlimagen;
        escribirInputs();
      } else {
        limpiarInputs();
        mostrarMensaje("El producto con ID " + numProd + " no existe.");
      }
    })
    .catch(() => { mostrarMensaje("Ocurrió un error al buscar el producto"); });
}

function listarProductos() {
  const dbref = refS(db, 'Productos');
  const tabla = document.getElementById('tabla-productos');
  const tbody = tabla.querySelector('tbody') || document.createElement('tbody');
  tbody.innerHTML = '';
  onValue(dbref, (snapshot) => {
    tbody.innerHTML = '';
    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      const fila = document.createElement('tr');

      const cId = document.createElement('td'); cId.textContent = data.id; fila.appendChild(cId);
      const cNombre = document.createElement('td'); cNombre.textContent = data.nombre; fila.appendChild(cNombre);
      const cDesc = document.createElement('td'); cDesc.textContent = data.descripcion; fila.appendChild(cDesc);
      const cPrecio = document.createElement('td'); cPrecio.textContent = data.precio; fila.appendChild(cPrecio);
      const cImg = document.createElement('td');
      const img = document.createElement('img'); img.src = data.urlimagen; img.width = 100;
      cImg.appendChild(img); fila.appendChild(cImg);

      tbody.appendChild(fila);
    });
    if (!tabla.querySelector('tbody')) tabla.appendChild(tbody);
  }, { onlyOnce: true });
}

function actualizarProducto() {
  leerInputs();
  if (id === '' || nombre === '' || descripcion === '' || isNaN(precio)) {
    mostrarMensaje('Faltaron datos por capturar');
    return;
  }
  update(refS(db, "Productos/" + id), {
    id, nombre, descripcion, precio, urlimagen: txtUrlInput.value.trim()
  })
    .then(() => { mostrarMensaje("Se actualizó con éxito"); limpiarInputs(); listarProductos(); })
    .catch((error) => { mostrarMensaje("Ocurrió un error: " + error); });
}

function borrarProducto() {
  const delId = document.getElementById("txtIdProducto").value.trim();
  if (delId === "") { mostrarMensaje("No se ingresó ID de producto"); return; }
  get(child(refS(db), "Productos/" + delId))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const confirmacion = confirm("¿Eliminar el producto con ID " + delId + "?");
        if (confirmacion) {
          remove(refS(db, "Productos/" + delId))
            .then(() => { mostrarMensaje("Producto eliminado con éxito"); limpiarInputs(); listarProductos(); })
            .catch((error) => { mostrarMensaje("Ocurrió un error: " + error); });
        } else {
          mostrarMensaje("Operación cancelada");
        }
      } else {
        mostrarMensaje("El producto con ID " + delId + " no existe.");
      }
    })
    .catch((error) => { mostrarMensaje("Ocurrió un error al verificar el producto: " + error); });
}

uploadButton.addEventListener("click", (event) => {
  event.preventDefault();
  const file = imageInput.files[0];
  if (!file) { 
    alert("Por favor selecciona un archivo."); 
    return; 
  }

  const storageRef = refStorage(storage, file.name); // ← corregido
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      progressDiv.textContent = `Subida en progreso: ${progress.toFixed(2)}%`;
      setTimeout(() => { progressDiv.textContent = ""; }, 1000);
    },
    (error) => {
      progressDiv.textContent = "Error al subir:" + error;
      alert(`Error al subir: ${error.message}`);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref)
        .then((url) => { txtUrlInput.value = url; })
        .catch(() => {});
    }
  );
});


document.addEventListener("DOMContentLoaded", () => {
  const usuarioLogueado = sessionStorage.getItem("usuario");
  if (!usuarioLogueado) {
    alert("No estás autenticado. Redirigiéndote al login.");
    window.location.href = "login.html";
  }
});

document.getElementById("btnLogout").addEventListener("click", () => {
  sessionStorage.clear();
  localStorage.clear();
  window.location.href = "/admin/login.html";
});