// Mostrar nombre del usuario logueado
document.addEventListener('DOMContentLoaded', function() {
    // Obtener los datos del usuario del localStorage
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    // Verificar si existe información del usuario
    if (userData && userData.name) {
        // Buscar el elemento con la clase fw-bold donde mostraremos el nombre
        const userNameElement = document.querySelector('.fw-bold');
        
        if (userNameElement) {
            // Mostrar el nombre del usuario
            userNameElement.textContent = userData.name;
        }
    } else {
        // Si no hay datos de usuario, redirigir al login
        console.error('No se encontraron datos de usuario');
        alert('Sesión no iniciada. Redirigiendo al login...');
        window.location.href = 'index.html';
    }
});