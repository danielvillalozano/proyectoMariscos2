import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getDatabase, ref as refS, set, child, get, onValue, update, remove } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';
import { getStorage, ref as refStorage, uploadBytesResumable, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js';

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
const storage = getStorage(app);

const imageInput = document.getElementById("imagenInput");
const uploadButton = document.getElementById("btnSubir");
const progressDiv = document.getElementById("progress");
const txtUrlInput = document.getElementById("txtUrl");

let idProducto = '';
let nombre = '';
let descripcion = '';
let categoria = '';
let precio = 0.0;
let urlImag = "";

function leerInputs() {
  idProducto = document.getElementById('txtIdProducto').value.trim();
  nombre = document.getElementById('txtNombre').value.trim();
  descripcion = document.getElementById('txtDescripcion').value.trim();
  categoria = document.getElementById('txtCategoria').value;
  const precioInput = document.getElementById('txtPrecio').value;
  precio = precioInput ? parseFloat(precioInput) : NaN;
  urlImag = document.getElementById("txtUrl").value;
}

function mostrarMensaje(mensaje) {
  const mensajeElement = document.getElementById('mensaje');
  mensajeElement.textContent = mensaje;
  setTimeout(() => {
    mensajeElement.textContent = "";
  }, 2000);
}

function limpiarInputs() {
  document.getElementById('txtIdProducto').value = "";
  document.getElementById('txtNombre').value = "";
  document.getElementById('txtDescripcion').value = "";
  document.getElementById('txtPrecio').value = "";
  document.getElementById('txtUrl').value = "";
  document.getElementById("imagenInput").value = "";
}

function escribirInputs() {
  document.getElementById('txtIdProducto').value = idProducto;
  document.getElementById('txtNombre').value = nombre;
  document.getElementById('txtDescripcion').value = descripcion;
  document.getElementById('txtCategoria').value = categoria;
  document.getElementById('txtPrecio').value = precio;
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
  if (nombre === '' || descripcion === '' || idProducto === '' || isNaN(precio) || urlImag === '') {
    mostrarMensaje('Faltaron datos por capturar');
    return;
  }
  const nuevoProducto = {
    idProducto: idProducto,
    nombre: nombre,
    descripcion: descripcion,
    categoria: categoria,
    precio: precio,
    urlImag: urlImag
  };
  set(refS(db, 'Productos/' + idProducto), nuevoProducto)
    .then(() => {
      mostrarMensaje('Se agregó con éxito');
      limpiarInputs();
      listarProductos();
    })
    .catch((error) => {
      console.error('Error al agregar el producto:', error);
      mostrarMensaje('Ocurrió un error al agregar el producto');
    });
}

function buscarProducto() {
  const numProd = document.getElementById("txtIdProducto").value.trim();
  if (numProd === "") {
    mostrarMensaje("No se ingresó el ID del producto");
    return;
  }
  const dbref = refS(db);
  get(child(dbref, 'Productos/' + numProd))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        idProducto = data.idProducto;
        nombre = data.nombre;
        descripcion = data.descripcion;
        categoria = data.categoria;
        precio = data.precio;
        txtUrlInput.value = data.urlImag || '';
        escribirInputs();
      } else {
        limpiarInputs();
        mostrarMensaje("El producto con ID " + numProd + " no existe.");
      }
    })
    .catch((error) => {
      console.error("Error al buscar el producto:", error);
      mostrarMensaje("Ocurrió un error al buscar el producto");
    });
}

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

function actualizarProducto() {
  leerInputs();
  if (nombre === '' || descripcion === '' || idProducto === '' || isNaN(precio)) {
    mostrarMensaje('Faltaron datos por capturar');
    return;
  }
  update(refS(db, "Productos/" + idProducto), {
    idProducto: idProducto,
    nombre: nombre,
    descripcion: descripcion,
    categoria: categoria,
    precio: precio,
    urlImag: txtUrlInput.value
  }).then(() => {
    mostrarMensaje("Se actualizó con éxito");
    limpiarInputs();
    listarProductos();
  }).catch((error) => {
    mostrarMensaje("Ocurrió un error: " + error);
  });
}

function borrarProducto() {
  const idProducto = document.getElementById("txtIdProducto").value.trim();
  if (idProducto === "") {
    mostrarMensaje("No se ingresó ID de producto");
    return;
  }
  get(child(refS(db), "Productos/" + idProducto))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const confirmacion = confirm("¿Estás seguro de que deseas eliminar el producto con ID " + idProducto + "?");
        if (confirmacion) {
          remove(refS(db, "Productos/" + idProducto))
            .then(() => {
              mostrarMensaje("Producto eliminado con éxito");
              limpiarInputs();
              listarProductos();
            })
            .catch((error) => {
              mostrarMensaje("Ocurrió un error: " + error);
            });
        } else {
          mostrarMensaje("Operación cancelada");
        }
      } else {
        mostrarMensaje("El producto con ID " + idProducto + " no existe.");
      }
    })
    .catch((error) => {
      mostrarMensaje("Ocurrió un error al verificar el producto: " + error);
    });
}

uploadButton.addEventListener("click", (event) => {
  event.preventDefault();
  const file = document.getElementById("imagenInput").files[0];
  if (!file) {
    alert("Por favor selecciona un archivo.");
    return;
  }
  const storageRef = refStorage(storage, file.name);
  const uploadTask = uploadBytesResumable(storageRef, file);
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      progressDiv.textContent = `Subida en progreso: ${progress.toFixed(2)}%`;
      setTimeout(() => {
        progressDiv.textContent = "";
      }, 1000);
    },
    (error) => {
      progressDiv.textContent = "Error al subir:" + error;
      alert(`Error al subir: ${error.message}`);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref)
        .then((url) => {
          txtUrlInput.value = url;
        })
        .catch((error) => {
          console.error("Error al obtener la URL:", error);
        });
    }
  );
});

document.addEventListener("DOMContentLoaded", () => {
  const usuarioLogueado = sessionStorage.getItem("usuario");
  if (!usuarioLogueado) {
    alert("No estás autenticado. Redirigiéndote al login.");
    window.location.href = "login.html";
  } else {
    console.log("Bienvenido, " + usuarioLogueado);
  }
});

document.getElementById("btnLogout").addEventListener("click", () => {
  sessionStorage.clear();
  localStorage.clear();
  window.location.href = "/admin/login.html";
});
