const LOGIN_URL = "login.html"; 
const apiUrl = 'http://localhost:3000/users'; 

var db_usuarios = []; 


var usuarioCorrente = {};

function generateUUID() { 
    var d = new Date().getTime(); // Timestamp
    var d2 = (performance && performance.now && (performance.now()*1000)) || 0; 
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16; 
        if(d > 0){ 
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else { 
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function initLoginApp () {
    
    const usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
    if (usuarioCorrenteJSON && usuarioCorrenteJSON !== '{}') { 
        usuarioCorrente = JSON.parse (usuarioCorrenteJSON);
    } else {
        usuarioCorrente = {}; 
    }

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) { 
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            db_usuarios = data;
            console.log("Usuários carregados do JSON Server:", db_usuarios);
        })
        .catch(error => {
            console.error('Erro ao ler usuários via API JSONServer:', error);
            alert("Erro ao carregar usuários. Verifique se o JSON Server está rodando.");
        });
}

/**
 * Verifica se o login do usuário está ok.
 * Se positivo, carrega o usuário corrente e salva no sessionStorage.
 * @param {string} login - O nome de usuário (ou email, dependendo da sua validação).
 * @param {string} senha - A senha do usuário.
 * @returns {boolean} True se o login for bem-sucedido, false caso contrário.
 */
function loginUser (login, senha) {

    for (var i = 0; i < db_usuarios.length; i++) {
        var usuario = db_usuarios[i];

        if (login === usuario.email && senha === usuario.password) { 
            usuarioCorrente.id = usuario.id;
            usuarioCorrente.login = usuario.email; 
            usuarioCorrente.email = usuario.email;
            usuarioCorrente.name = usuario.name; 

            sessionStorage.setItem ('usuarioCorrente', JSON.stringify (usuarioCorrente));

            return true;
        }
    }

    return false;
}

function logoutUser () {
    usuarioCorrente = {};
    sessionStorage.setItem ('usuarioCorrente', JSON.stringify (usuarioCorrente));
    window.location.href = LOGIN_URL; 
}

/**
 * Adiciona um novo usuário ao JSON Server.
 * @param {string} name - Nome completo do usuário.
 * @param {string} login - Nome de usuário (ou email).
 * @param {string} password - Senha do usuário.
 * @param {string} email - Email do usuário.
 */
function addUser (name, login, password, email) {

    let newId = generateUUID ();
    let usuario = { "id": newId, "email": email, "password": password, "name": name }; 

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        db_usuarios.push (usuario);
        alert("Usuário inserido com sucesso! Você pode fazer login agora.");
        console.log("Novo usuário adicionado:", data);
        window.location.href = LOGIN_URL;
    })
    .catch(error => {
        console.error('Erro ao inserir usuário via API JSONServer:', error);
        alert("Erro ao inserir usuário. Verifique o console para mais detalhes."); 
    });
}

initLoginApp();

function loginUser (login, senha) {
    for (var i = 0; i < db_usuarios.length; i++) {
        var usuario = db_usuarios[i];
        if (login === usuario.email && senha === usuario.password) {
            usuarioCorrente.id = usuario.id;
            usuarioCorrente.login = usuario.email;
            usuarioCorrente.email = usuario.email;
            usuarioCorrente.name = usuario.name;

            sessionStorage.setItem ('usuarioCorrente', JSON.stringify (usuarioCorrente));

            window.location.href = 'index.html';
            return true;
        }
    }
    return false;
}
