import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getDatabase, ref as refS, onValue } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';

const firebaseConfig = {
  apiKey: "AIzaSyDcMGluQIQWb4KaopAagG3NtOH0huq4jpo",
  authDomain: "mariscosproyecto.firebaseapp.com",
  databaseURL: "https://mariscosproyecto-default-rtdb.firebaseio.com",
  projectId: "mariscosproyecto",
  storageBucket: "mariscosproyecto.firebasestorage.app",
  messagingSenderId: "708491546938",
  appId: "1:708491546938:web:e3fdb32d77bf08b72b0003"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const contenedor = document.getElementById('lista-platillos');
const formBusqueda = document.querySelector('form');
const inputBusqueda = formBusqueda.querySelector('input[name="nombre"]');
const cardBusqueda = document.querySelector('.card.text-center');
const imgBusqueda = cardBusqueda.querySelector('img');
const tituloBusqueda = cardBusqueda.querySelector('h5');
const descBusqueda = cardBusqueda.querySelector('p:not(.fw-bold)');
const precioBusqueda = cardBusqueda.querySelector('p.fw-bold');

const formatoMXN = (n) =>
  typeof n === 'number'
    ? n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 })
    : '$0.00';

let cacheProductos = [];

onValue(refS(db, 'Productos'), (snapshot) => {
  contenedor.innerHTML = '';
  cacheProductos = [];
  snapshot.forEach((childSnapshot) => {
    const data = childSnapshot.val();
    cacheProductos.push(data);
    const card = document.createElement('div');
    card.className = 'col-md-4 mb-4';
    card.innerHTML = `
      <div class="card shadow-sm h-100">
        <img src="${data.urlimagen || 'platillo.jpg'}" class="card-img-top" alt="${data.nombre}">
        <div class="card-body text-center">
          <h5 class="card-title text-primary">${data.nombre}</h5>
          <p class="card-text">${data.descripcion}</p>
          <p class="fw-bold text-success">${formatoMXN(Number(data.precio) || 0)}</p>
        </div>
      </div>
    `;
    contenedor.appendChild(card);
  });

  if (cacheProductos.length > 0) {
    mostrarPlatilloAleatorio();
  }
});

function mostrarPlatilloAleatorio() {
  const randomProd = cacheProductos[Math.floor(Math.random() * cacheProductos.length)];
  imgBusqueda.src = randomProd.urlimagen || 'platillo.jpg';
  tituloBusqueda.textContent = randomProd.nombre;
  descBusqueda.textContent = randomProd.descripcion;
  precioBusqueda.textContent = formatoMXN(Number(randomProd.precio) || 0);
}

formBusqueda.addEventListener('submit', (e) => {
  e.preventDefault();
  const busqueda = inputBusqueda.value.trim().toLowerCase();
  if (!busqueda) return;

  const resultado = cacheProductos.find(p => (p.nombre || '').toLowerCase().includes(busqueda));

  if (resultado) {
    imgBusqueda.src = resultado.urlimagen || 'platillo.jpg';
    tituloBusqueda.textContent = resultado.nombre;
    descBusqueda.textContent = resultado.descripcion;
    precioBusqueda.textContent = formatoMXN(Number(resultado.precio) || 0);
  } else {
    mostrarPlatilloAleatorio();
  }
});
