// Função para exibir a tela de cadastro
function mostrarCadastro() {
    document.getElementById("telaLogin").style.display = "none";
    document.getElementById("telaCadastro").style.display = "block";
}

// Função para exibir a tela de login
function mostrarLogin() {
    document.getElementById("telaCadastro").style.display = "none";
    document.getElementById("telaLogin").style.display = "block";
}

// Função para cadastrar um novo usuário
function cadastrarUsuario() {
    let usuario = document.getElementById("novoUsuario").value;
    let senha = document.getElementById("novaSenha").value;

    if (usuario === "" || senha === "") {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    // Verifica se o usuário já existe no localStorage
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    let existente = usuarios.find(u => u.usuario === usuario);

    if (existente) {
        alert("Esse nome de usuário já está cadastrado!");
        return;
    }

    // Adiciona o novo usuário
    usuarios.push({ usuario: usuario, senha: senha });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Cadastro realizado com sucesso!");
    mostrarLogin();
}

// Função para entrar no sistema
function entrarSistema() {
    let usuario = document.getElementById("usuarioLogin").value;
    let senha = document.getElementById("senhaLogin").value;

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    let valido = usuarios.find(u => u.usuario === usuario && u.senha === senha);

    if (valido) {
        alert("Bem-vindo, " + usuario + "!");
localStorage.setItem("usuarioAtual", usuario);
window.location.href = "menu.html";
} else {
        alert("Usuário ou senha incorretos!");
    }
}
// ===================== MENU PRINCIPAL =====================

// Exibe o nome do usuário logado
document.addEventListener("DOMContentLoaded", function() {
    const usuarioAtual = localStorage.getItem("usuarioAtual");
    const campoUsuario = document.getElementById("usuarioLogado");
    if (campoUsuario && usuarioAtual) {
        campoUsuario.textContent = "Usuário logado: " + usuarioAtual;
    }
});

// Função para abrir a tela de aulas de um instrumento
function abrirInstrumento(tipo) {
    localStorage.setItem("instrumentoSelecionado", tipo);
    window.location.href = "aulas.html";
}

// Função para sair do sistema
function sair() {
    localStorage.removeItem("usuarioAtual");
    window.location.href = "index.html";
} 
// ===================== TELA DE AULAS =====================

// Exibe o nome do instrumento atual
document.addEventListener("DOMContentLoaded", function() {
    const tipo = localStorage.getItem("instrumentoSelecionado");
    const usuario = localStorage.getItem("usuarioAtual");
    const titulo = document.getElementById("tituloInstrumento");

    if (titulo && tipo) {
        let nomeInstrumento = "";
        switch (tipo) {
            case "reto": nomeInstrumento = "Sax Reto"; break;
            case "alto": nomeInstrumento = "Sax Alto"; break;
            case "tenor": nomeInstrumento = "Sax Tenor"; break;
            case "baritono": nomeInstrumento = "Sax Barítono"; break;
        }
        titulo.textContent = `🎷 Aulas de ${nomeInstrumento}`;
    }

    mostrarAulas();
});

// Função para salvar uma nova aula
function salvarAula() {
    const titulo = document.getElementById("tituloAula").value;
    const descricao = document.getElementById("descricaoAula").value;
    const imagem = document.getElementById("imagemAula").files[0];
    const video = document.getElementById("videoAula").files[0];
    const audio = document.getElementById("audioAula").files[0];
    const tipo = localStorage.getItem("instrumentoSelecionado");
    const usuario = localStorage.getItem("usuarioAtual");

    if (!titulo || !descricao) {
        alert("Por favor, preencha o título e a descrição da aula.");
        return;
    }

    // Lê os arquivos e converte em base64
    const leitor = new FileReader();
    const novaAula = { titulo, descricao, imagem: "", video: "", audio: "", tipo, usuario };

    const processarArquivo = (arquivo, tipo, callback) => {
        if (!arquivo) return callback("");
        const reader = new FileReader();
        reader.onload = e => callback(e.target.result);
        reader.readAsDataURL(arquivo);
    };

    processarArquivo(imagem, "imagem", imgData => {
        novaAula.imagem = imgData;
        processarArquivo(video, "video", vidData => {
            novaAula.video = vidData;
            processarArquivo(audio, "audio", audData => {
                novaAula.audio = audData;

                let aulas = JSON.parse(localStorage.getItem("aulas")) || [];
                aulas.push(novaAula);
                localStorage.setItem("aulas", JSON.stringify(aulas));

                alert("Aula salva com sucesso!");
                mostrarAulas();
                limparCampos();
            });
        });
    });
}

// Função para exibir as aulas cadastradas
function mostrarAulas() {
    const lista = document.getElementById("listaAulas");
    const aulas = JSON.parse(localStorage.getItem("aulas")) || [];
    const tipo = localStorage.getItem("instrumentoSelecionado");
    const usuario = localStorage.getItem("usuarioAtual");

    if (!lista) return;

    lista.innerHTML = "";

    const aulasFiltradas = aulas.filter(a => a.tipo === tipo && a.usuario === usuario);

    if (aulasFiltradas.length === 0) {
        lista.innerHTML = "<p>Nenhuma aula cadastrada ainda.</p>";
        return;
    }

    aulasFiltradas.forEach(aula => {
        const div = document.createElement("div");
        div.className = "aula";
        div.innerHTML = `
            <h3>${aula.titulo}</h3>
            <p>${aula.descricao}</p>
            ${aula.imagem ? `<img src="${aula.imagem}" width="100%">` : ""}
            ${aula.video ? `<video src="${aula.video}" controls width="100%"></video>` : ""}
            ${aula.audio ? `<audio src="${aula.audio}" controls></audio>` : ""}
        `;
        lista.appendChild(div);
    });
}

// Limpa os campos após salvar
function limparCampos() {
    document.getElementById("tituloAula").value = "";
    document.getElementById("descricaoAula").value = "";
    document.getElementById("imagemAula").value = "";
    document.getElementById("videoAula").value = "";
    document.getElementById("audioAula").value = "";
}

// Voltar ao menu principal
function voltarMenu() {
    window.location.href = "menu.html";
}
