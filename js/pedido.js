//variables globales
let todosPedidos = document.querySelector('#todos-Pedidos');


document.addEventListener('DOMContentLoaded', function() {
    let username = null;
    let userRole = null;
    
    // Ocultar todo el contenido inicialmente (respaldo por si el CSS no funcionó)
    const menuContainer = document.getElementById('menu');
    if (menuContainer) {
        menuContainer.style.display = 'none';
    }
    
    // Intentar obtener el nombre y rol desde userData (JSON)
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
        try {
            const userData = JSON.parse(userDataString);
            username = userData.name;
            userRole = userData.rol;
        } catch (error) {}
    }
    
    // Redireccionar según el rol
    if (userRole === "cajero") {
        // El cajero puede ver esta página
        if (menuContainer) {
            menuContainer.style.display = 'block'; // Mostrar el contenido solo para cajeros
            
            // Cargar los pedidos inicialmente
            cargarTodosPedidos();
            
            // Refrescar los datos cada 30 segundos
            setInterval(cargarTodosPedidos, 30000);
        }
    } else if (userRole === "mesero") {
        // Mostrar alerta y luego redirigir
        alert("Usted tiene rol de mesero. Redirigiendo a la página correspondiente...");
        setTimeout(function() {
            window.location.href = "mesero.html";
        }, 500); // Esperar 500ms para asegurar que el alert sea visible
        return; // Detener ejecución
    } else if (userRole === "chef") {
        // Mostrar alerta y luego redirigir
        alert("Usted tiene rol de chef. Redirigiendo a la página correspondiente...");
        setTimeout(function() {
            window.location.href = "chef.html";
        }, 500); // Esperar 500ms para asegurar que el alert sea visible
        return; // Detener ejecución
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
        return; // Detener ejecución
    }
    
    // Si no se encontró username, intentar con otras claves
    if (!username) {
        username = localStorage.getItem('name') || 
                   localStorage.getItem('username') || 
                   localStorage.getItem('usuario') || 
                   localStorage.getItem('nombre');
    }
    
    // Actualizar el span con el nombre de usuario
    const userSpan = document.querySelector('span.fw-bold');
    if (userSpan) {
        userSpan.textContent = username || "Usuario no identificado";
    }
});

// Función para cargar todos los pedidos
function cargarTodosPedidos() {
    fetch('http://localhost:3005/pedidos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los pedidos: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            // Obtener la tabla y su cuerpo
            const tabla = document.querySelector('#todos-Pedidos table');
            const tbody = tabla.querySelector('tbody');
            
            // Limpiar tabla
            tbody.innerHTML = '';
            
            // Asegurarse de que el encabezado de la tabla tenga todas las columnas
            const thead = tabla.querySelector('thead tr');
            thead.innerHTML = `
                <th>Platillo</th>
                <th>Cantidad</th>
                <th>Cliente</th>
                <th>Estado</th>
            `;
            
            // Agregar filas a la tabla
            data.forEach(pedido => {
                const tr = document.createElement('tr');
                
                // Aplicar clases de color según el estado
                if (pedido.estado === 'pendiente') {
                    tr.classList.add('table-warning');
                } else if (pedido.estado === 'en preparación') {
                    tr.classList.add('table-primary');
                } else if (pedido.estado === 'listo para entregar') {
                    tr.classList.add('table-success');
                } else if (pedido.estado === 'entregado') {
                    tr.classList.add('table-secondary');
                }
                
                tr.innerHTML = `
                    <td>${pedido.platillo}</td>
                    <td>${pedido.cantidad}</td>
                    <td>${pedido.cliente}</td>
                    <td>${pedido.estado}</td>
                `;
                
                tbody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            const tbody = document.querySelector('#todos-Pedidos table tbody');
            tbody.innerHTML = `<tr><td colspan="4" class="text-danger">Error al cargar los pedidos: ${error.message}</td></tr>`;
        });
}