// Variables globales
const userInput = document.getElementById('user');
const passwordInput = document.getElementById('password');
const loginButton = document.querySelector('.btn-iniciar');

// Agregar evento al botón de inicio de sesión
loginButton.addEventListener('click', function() {
    // Capturar los valores de los inputs
    const user = userInput.value;
    const password = passwordInput.value;
    
    // Validar que los campos no estén vacíos
    if (!user || !password) {
        alert('Por favor, complete todos los campos');
        return;
    }

    // Crear objeto con los datos
    const data = {
        user: user,
        password: password
    };

    // Enviar los datos al backend usando fetch
    fetch('http://localhost:3005/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Error en la autenticación');
        }
    })
    .then(data => {
        // Comprobar si data es null o undefined
        if (!data) {
            alert('Error: Respuesta del servidor inválida');
            return;
        }
        
        // Verificar si la contraseña proporcionada coincide con la contraseña almacenada
        if (data.rol && data.user && data.password === password) {
            // Guardar datos del usuario en localStorage (sin incluir la contraseña por seguridad)
            const userData = {
                id: data.id,
                user: data.user,
                name: data.name,
                rol: data.rol
            };
            localStorage.setItem('userData', JSON.stringify(userData));
            
            alert('Inicio de sesión exitoso');
            
            // Redirección según el rol
            const rol = data.rol.toLowerCase();
            switch(rol) {
                case 'cajero':
                    window.location.href = 'cajero.html';
                    break;
                case 'mesero':
                    window.location.href = 'mesero.html';
                    break;
                case 'chef':
                    window.location.href = 'chef.html';
                    break;
                default:
                    alert('Rol no reconocido. Contacte al administrador.');
                    break;
            }
        } else {
            alert('Usuario o contraseña incorrectos');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al intentar iniciar sesión');
    });
});