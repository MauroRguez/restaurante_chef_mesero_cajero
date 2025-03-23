// variables globales
let porEntregar= document.querySelector('#por-entregar');
let entregado= document.querySelector('#entregado');

// Mostrar nombre del usuario logueado y verificar permisos
document.addEventListener('DOMContentLoaded', function() {
    // Ocultar contenido inicialmente
    const contenidoPagina = document.querySelector('.w3-container.w3-black.w3-padding-64');
    if (contenidoPagina) {
        contenidoPagina.style.display = 'none';
    }
    
    // Obtener los datos del usuario del localStorage
    const userDataString = localStorage.getItem('userData');
    
    if (!userDataString) {
        // Si no hay datos de usuario, redirigir al login
        console.error('No se encontraron datos de usuario');
        alert('Sesión no iniciada. Redirigiendo al login...');
        window.location.href = 'index.html';
        return;
    }
    
    try {
        const userData = JSON.parse(userDataString);
        const username = userData.name;
        const userRole = userData.rol;
        
        // Verificar el rol de usuario
        if (userRole === "mesero" || userRole === "cajero") {
            // El mesero o cajero pueden ver esta página
            if (contenidoPagina) {
                contenidoPagina.style.display = 'block';
            }
            
            // Mostrar el nombre del usuario
            const userNameElement = document.querySelector('.fw-bold');
            if (userNameElement) {
                userNameElement.textContent = username;
            }
            
            // Cargar los pedidos al inicio
            cargarPedidosPorEntregar();
            cargarPedidosEntregados();
            
            // Refrescar los datos cada 30 segundos
            setInterval(function() {
                cargarPedidosPorEntregar();
                cargarPedidosEntregados();
            }, 30000);
            
        } else if (userRole === "chef") {
            // Mostrar alerta y luego redirigir
            alert("Usted tiene rol de chef. Redirigiendo a la página correspondiente...");
            setTimeout(function() {
                window.location.href = "chef.html";
            }, 500);
            return;
        } else {
            // Rol desconocido o sin rol, mostrar acceso denegado
            alert("No tiene autorización para entrar a este módulo");
            
            // Mostrar mensaje de acceso denegado
            const body = document.body;
            const denyMessage = document.createElement('div');
            denyMessage.className = 'w3-container w3-center w3-padding-64 w3-xxlarge';
            denyMessage.innerHTML = '<h1 class="w3-jumbo w3-text-red">Acceso Denegado</h1>' +
                                   '<p>No tiene los permisos necesarios para acceder a este módulo.</p>' +
                                   '<a href="index.html" class="w3-button w3-red w3-large">Volver al Inicio</a>';
            body.appendChild(denyMessage);
            return;
        }
    } catch (error) {
        console.error('Error al procesar datos de usuario:', error);
        alert('Error en los datos de sesión. Redirigiendo al login...');
        window.location.href = 'index.html';
    }
});

// Función para cargar los pedidos por entregar
function cargarPedidosPorEntregar() {
    fetch('http://localhost:3005/pedidos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los pedidos');
            }
            return response.json();
        })
        .then(data => {
            // Filtrar solo los pedidos con estado "listo" (por entregar)
            const pedidosPorEntregar = data.filter(pedido => pedido.estado === 'por entregar');
            
            // Obtener referencia al tbody
            const tbody = porEntregar.querySelector('tbody');
            tbody.innerHTML = '';
            
            // Verificar si hay pedidos por entregar
            if (pedidosPorEntregar.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay pedidos por entregar</td></tr>';
                return;
            }
            
            // Crear filas para cada pedido
            pedidosPorEntregar.forEach(pedido => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${pedido.platillo}</td>
                    <td>${pedido.cantidad}</td>
                    <td>${pedido.cliente}</td>
                    <td>
                        <button class="btn btn-success entregar-btn px-3 py-2 fs-3" data-id="${pedido.id}">
                            <i class="fas fa-check-circle me-1"></i> Entregar
                        </button>
                    </td>
                `;
                tbody.appendChild(row); // IMPORTANTE: Añadimos al tbody, no al elemento porEntregar
            });
            
            // Agregar event listeners a los botones de entregar
            document.querySelectorAll('.entregar-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const pedidoId = this.getAttribute('data-id');
                    marcarComoEntregado(pedidoId);
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
            const tbody = porEntregar.querySelector('tbody');
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">Error al cargar los pedidos</td></tr>';
        });
}

// Función para marcar un pedido como entregado
function marcarComoEntregado(id) {
    fetch(`http://localhost:3005/entregado/${id}`, {
        method: 'PUT'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al actualizar el pedido');
        }
        return response.text();
    })
    .then(data => {
        console.log(data);
        cargarPedidosPorEntregar(); // Recargar la lista de pedidos
        cargarPedidosEntregados(); // Actualizar también los pedidos entregados
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al actualizar el estado del pedido');
    });
}

// Función para cargar los pedidos entregados (necesaria para marcarComoEntregado)
function cargarPedidosEntregados() {
    fetch('http://localhost:3005/pedidos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los pedidos');
            }
            return response.json();
        })
        .then(data => {
            // Filtrar solo los pedidos con estado "entregado"
            const pedidosEntregados = data.filter(pedido => pedido.estado === 'entregado');
            
            // Obtener referencia al tbody
            const tbody = entregado.querySelector('tbody');
            tbody.innerHTML = '';
            
            // Verificar si hay pedidos entregados
            if (pedidosEntregados.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay pedidos entregados</td></tr>';
                return;
            }
            
            // Crear filas para cada pedido
            pedidosEntregados.forEach(pedido => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${pedido.platillo}</td>
                   
                    <td>${pedido.cliente}</td>
                    <td>${pedido.estado}</td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            const tbody = entregado.querySelector('tbody');
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">Error al cargar los pedidos</td></tr>';
        });
}