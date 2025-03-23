// Variables globales
let platillo = "";

// Función para actualizar el valor de platillo según el menú activo
function actualizarValorPlatillo() {
    const pizzaMenu = document.getElementById('Pizza');
    const pastaMenu = document.getElementById('Pasta');
    const starterMenu = document.getElementById('Starter');
    
    if (pizzaMenu && pizzaMenu.style.display !== "none") {
        platillo = document.getElementById("TipoPizza").value;
        console.log("Pizza seleccionada:", platillo);
    } else if (pastaMenu && pastaMenu.style.display !== "none") {
        platillo = document.getElementById("TipoPastaSelect").value;
        console.log("Pasta seleccionada:", platillo);
    } else if (starterMenu && starterMenu.style.display !== "none") {
        platillo = document.getElementById("TipoSopaSelect").value;
        console.log("Starter seleccionado:", platillo);
    }
    
    return platillo;
}

// Función para obtener el precio del platillo seleccionado
function obtenerPrecioPlatillo() {
    let precio = 0;
    
    const pizzaMenu = document.getElementById('Pizza');
    const pastaMenu = document.getElementById('Pasta');
    const starterMenu = document.getElementById('Starter');
    
    if (pizzaMenu && pizzaMenu.style.display !== "none") {
        const precioPizzaElement = document.querySelector(".precioPizza");
        if (precioPizzaElement) {
            precio = parseFloat(precioPizzaElement.textContent.replace('$', '').replace('.', ''));
        }
    } else if (pastaMenu && pastaMenu.style.display !== "none") {
        const precioPastaElement = document.querySelector(".precioPasta");
        if (precioPastaElement) {
            precio = parseFloat(precioPastaElement.textContent.replace('$', '').replace('.', ''));
        }
    } else if (starterMenu && starterMenu.style.display !== "none") {
        const precioStarterElement = document.querySelector(".precioStarter");
        if (precioStarterElement) {
            precio = parseFloat(precioStarterElement.textContent.replace('$', '').replace('.', ''));
        }
    }
    
    return precio || 0;
}

// Función para obtener los elementos del formulario activo
function obtenerElementosFormularioActivo() {
    const pizzaMenu = document.getElementById('Pizza');
    const pastaMenu = document.getElementById('Pasta');
    const starterMenu = document.getElementById('Starter');
    
    let formContainer;
    
    if (pizzaMenu && pizzaMenu.style.display !== "none") {
        formContainer = pizzaMenu;
    } else if (pastaMenu && pastaMenu.style.display !== "none") {
        formContainer = pastaMenu;
    } else if (starterMenu && starterMenu.style.display !== "none") {
        formContainer = starterMenu;
    }
    
    if (formContainer) {
        return {
            cliente: formContainer.querySelector(".cliente"),
            cantidad: formContainer.querySelector(".cantidad"),
            fecha: formContainer.querySelector(".fecha"),
            observaciones: formContainer.querySelector(".observaciones")
        };
    }
    
    return {
        cliente: null,
        cantidad: null,
        fecha: null,
        observaciones: null
    };
}

// Función para enviar el pedido a la base de datos
function enviarPedido() {
    actualizarValorPlatillo();
    
    const elementos = obtenerElementosFormularioActivo();
    
    // Validar campos
    if (!platillo) {
        alert("Debe seleccionar un platillo");
        return;
    }
    
    if (!elementos.cliente || !elementos.cliente.value) {
        alert("Debe ingresar el nombre del cliente");
        return;
    }
    
    if (!elementos.cantidad || !elementos.cantidad.value || elementos.cantidad.value <= 0) {
        alert("Debe ingresar una cantidad válida");
        return;
    }
    
    if (!elementos.fecha || !elementos.fecha.value) {
        alert("Debe seleccionar una fecha");
        return;
    }
    
    // Crear objeto con datos del pedido
    const pedidoData = {
        platillo: platillo,
        cliente: elementos.cliente.value,
        cantidad: parseInt(elementos.cantidad.value),
        fecha: elementos.fecha.value,
        observaciones: elementos.observaciones ? elementos.observaciones.value : "",
        precio: obtenerPrecioPlatillo(),
        estado: "por preparar"
    };
    
    const apiUrl = "http://localhost:3005/pedido";
    
    // Enviar datos mediante fetch
    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(pedidoData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al guardar el pedido");
        }
        
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return response.json();
        } else {
            return response.text().then(text => {
                return { message: text };
            });
        }
    })
    .then(data => {
        alert("Pedido realizado con éxito");
        console.log("Respuesta del servidor:", data);
        
        // Limpieza de campos después de guardar - CORREGIDO
        // Usamos elementos en lugar de las variables globales
        if (elementos.cliente) elementos.cliente.value = "";
        if (elementos.cantidad) elementos.cantidad.value = "";
        if (elementos.fecha) elementos.fecha.value = "2025-11-16T20:00"; // O el valor predeterminado que prefieras
        if (elementos.observaciones) elementos.observaciones.value = "";
    })
    .catch(error => {
        alert("Error al realizar el pedido: " + error.message);
    });
}

// Inicialización cuando se carga el documento
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(actualizarValorPlatillo, 100);
    
    // Event listeners para los selectores
    const pizzaSelect = document.getElementById("TipoPizza");
    const pastaSelect = document.getElementById("TipoPastaSelect");
    const sopaSelect = document.getElementById("TipoSopaSelect");
    
    if (pizzaSelect) pizzaSelect.addEventListener("change", actualizarValorPlatillo);
    if (pastaSelect) pastaSelect.addEventListener("change", actualizarValorPlatillo);
    if (sopaSelect) sopaSelect.addEventListener("change", actualizarValorPlatillo);
    
    // Event listeners para los botones de pedido
    const btnsPedido = document.querySelectorAll(".btn-pedido");
    btnsPedido.forEach(btn => {
        btn.addEventListener("click", enviarPedido);
    });
    
    // Verificar login
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
});