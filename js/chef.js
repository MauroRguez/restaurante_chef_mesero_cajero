// Variables globales
let porPreparar = document.querySelector('#por-preparar');
let preparando = document.querySelector('#preparando');

// Inicialización cuando se carga el documento
document.addEventListener('DOMContentLoaded', function () {
    // Verificar usuario logueado
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (userData && userData.name) {
        const userNameElement = document.querySelector('.fw-bold');
        if (userNameElement) {
            userNameElement.textContent = userData.name;
        }
    } else {
        console.error('No se encontraron datos de usuario');
        alert('Sesión no iniciada. Redirigiendo al login...');
        window.location.href = 'index.html';
    }

    // Cargar los pedidos
    cargarPedidosPorPreparar();
    cargarPedidosEnPreparacion();

    // Actualizar datos cada 30 segundos
    setInterval(function () {
        cargarPedidosPorPreparar();
        cargarPedidosEnPreparacion();
    }, 30000);
});

// Función para cargar los pedidos por preparar
function cargarPedidosPorPreparar() {
    fetch('http://localhost:3005/pedidos')
        .then(response => {
            if (!response.ok) throw new Error('Error al obtener los pedidos');
            return response.json();
        })
        .then(pedidos => {
            const pedidosPorPreparar = pedidos.filter(pedido => pedido.estado === "por preparar");

            const tbody = porPreparar.querySelector('tbody');
            tbody.innerHTML = '';

            if (pedidosPorPreparar.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay pedidos por preparar</td></tr>';
                return;
            }

            pedidosPorPreparar.forEach(pedido => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${pedido.platillo}</td>
                    <td>${pedido.cantidad}</td>
                    <td>${pedido.cliente}</td>
                    <td>${pedido.observaciones || '-'}</td>
                    <td>
                        <button class="btn btn-danger btn-sm fs-2 preparar-pedido" data-id="${pedido.id}">
                            Preparar
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            // Agregar listeners a los botones "Preparar"
            document.querySelectorAll('.preparar-pedido').forEach(btn => {
                btn.addEventListener('click', function () {
                    const idPedido = this.getAttribute('data-id');
                    marcarComoPreparando(idPedido);
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
            porPreparar.querySelector('tbody').innerHTML =
                '<tr><td colspan="5" class="text-center text-danger">Error al cargar los pedidos</td></tr>';
        });
}

// Función para marcar un pedido como "preparando"
function marcarComoPreparando(id) {
    fetch(`http://localhost:3005/preparando/${id}`, {
        method: 'PUT'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al actualizar el pedido');
            }
            return response.text();
        })
        .then(data => {
            console.log('Pedido actualizado a preparando');
            cargarPedidosPorPreparar();
            cargarPedidosEnPreparacion();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al cambiar el estado del pedido');
        });
}

// Función para cargar pedidos en preparación
function cargarPedidosEnPreparacion() {
    fetch('http://localhost:3005/pedidos')
        .then(response => {
            if (!response.ok) throw new Error('Error al obtener los pedidos');
            return response.json();
        })
        .then(pedidos => {
            const pedidosPreparando = pedidos.filter(pedido => pedido.estado === "preparando");

            const tbody = preparando.querySelector('tbody');
            tbody.innerHTML = '';

            if (pedidosPreparando.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" class="text-center">No hay pedidos en preparación</td></tr>';
                return;
            }

            pedidosPreparando.forEach(pedido => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${pedido.platillo}</td>
                    <td>${pedido.cantidad}</td>
                    <td>${pedido.cliente}</td>
                    <td>
                        <button class="btn btn-warning btn-sm fs-2 listo-pedido" data-id="${pedido.id}">
                            Listo
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            // Agregar listeners a los botones "Listo"
            document.querySelectorAll('.listo-pedido').forEach(btn => {
                btn.addEventListener('click', function () {
                    const idPedido = this.getAttribute('data-id');
                    marcarComoListo(idPedido);
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
            preparando.querySelector('tbody').innerHTML =
                '<tr><td colspan="4" class="text-center text-danger">Error al cargar los pedidos</td></tr>';
        });
}

// Función para marcar un pedido como "listo"
function marcarComoListo(id) {
    fetch(`http://localhost:3005/listo/${id}`, {
        method: 'PUT'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al actualizar el pedido');
            }
            return response.text();
        })
        .then(data => {
            console.log('Pedido actualizado a listo');
            cargarPedidosEnPreparacion();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al cambiar el estado del pedido');
        });
}