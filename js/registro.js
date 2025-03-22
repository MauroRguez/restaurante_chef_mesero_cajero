//variables globales
let userInput =document.getElementById('user'); // Corregido: eliminé el #
let nameInput = document.getElementById('name'); // Corregido: eliminé el #
let rolInput = document.getElementById('rol'); // Corregido: eliminé el #
let passInput = document.getElementById('password'); // Corregido: eliminé el #
let btnregister = document.getElementById('btn-guardar'); // Corregido: eliminé el .

//evento al boton registrar
btnregister.addEventListener('click', function () {
    // Capturar los valores de los inputs
    let user = userInput.value;
    let name = nameInput.value;
    let rol = rolInput.value;
    let password = passInput.value;

    // Crear un objeto con los datos
    let data = {
        user: user,
        name: name,
        rol: rol,
        password: password
    };

    // Enviar los datos al backend usando fetch
    fetch('http://localhost:3005/register', { // Cambia la URL según tu backend
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            alert('Usuario registrado con éxito');
            return response.json();
        } else {
            console.log('Error al registrar el usuario');
            throw new Error('Error al registrar el usuario');
        }
    })
    .then(data => {
        console.log(data);
        
        // Redireccionar según el rol seleccionado
        switch(rolInput.value.toLowerCase()) {
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
                // Si el rol no coincide con ninguno de los anteriores
                console.log('Rol no reconocido para redirección');
                break;
        }
    })
    .catch(error => {
        console.log(error);
    });
});
