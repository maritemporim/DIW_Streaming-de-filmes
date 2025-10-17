const API_URL = 'http://localhost:3000/usuarios';

async function fazerLogin(email, senha) {
    try {
        const response = await fetch(`${API_URL}?email=${email}`);
        const usuarios = await response.json();
        
        if (usuarios.length === 0 || usuarios[0].senha !== senha) {
            return { success: false, message: 'Email ou senha incorretos!' };
        }

        sessionStorage.setItem('usuario', JSON.stringify(usuarios[0]));
        return { success: true };
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        return { success: false, message: 'Erro ao conectar com o servidor' };
    }
}

async function registrarUsuario(usuario) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        });
        return response.ok;
    } catch (error) {
        console.error('Erro ao registrar:', error);
        return false;
    }
}


document.addEventListener('DOMContentLoaded', function() {
    if (sessionStorage.getItem('usuario')) {
        window.location.href = 'index.html';
    }

    document.getElementById('loginForm')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const senha = document.getElementById('password').value;
        
        const resultado = await fazerLogin(email, senha);
        if (resultado.success) {
            window.location.href = 'index.html';
        } else {
            alert(resultado.message);
        }
    });

    document.getElementById('registerForm')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const novoUsuario = {
            nome: document.getElementById('regName').value,
            email: document.getElementById('regEmail').value,
            senha: document.getElementById('regPassword').value
        };

        if (await registrarUsuario(novoUsuario)) {
            alert('Conta criada com sucesso! Faça login.');
            bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
        } else {
            alert('Erro ao criar conta. Tente novamente.');
        }
    });
});