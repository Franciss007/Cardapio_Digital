const menuItems = [
    { id: 1, name: "Coca Cola 1 litro", price: 8 },
    { id: 2, name: "Guaraná 1 litro", price: 7 },
    { id: 3, name: "Coca Lata", price: 5 },
    { id: 4, name: "Fanta Lata", price: 5 },
    { id: 5, name: "Jesus Lata", price: 5 },
    { id: 6, name: "Espeto de Carne", price: 18, image: "https://sakura.com.br/wp-content/uploads/2020/07/Espetinho_Receita_Sakura.jpg"},
    { id: 7, name: "Espeto de Frango", price: 18, image: "https://as1.ftcdn.net/v2/jpg/03/51/38/64/1000_F_351386458_8zCQnfDdvLp25fdBvH56WmRbjclBPOSO.jpg" },
    { id: 8, name: "Espeto Misto", price: 18, image: "caminho/para/imagem_misto.jpg" },
    { id: 9, name: "Batata Frita P", price: 7 },
    { id: 10, name: "Batata Frita G", price: 10 },
    { id: 11, name: "Espeto", price: 10, observacao: "Não tem acompanhamentos, apenas o espeto", image: "caminho/para/imagem_espeto.jpg" },
];

function criarElementoMenu(item) {
    const menuItem = document.createElement("div");
    menuItem.className = "menu-item";

    const imagemEspeto = item.image ? `<div class="item-imagem"><img src="${item.image}" alt="${item.name}" class="imagem-espeto" /></div>` : "";

    menuItem.innerHTML = `<p>${item.name} - R$${item.price.toFixed(2)}</p>
                          <label>Observação:
                            <input type="text" id="observacao-${item.id}" placeholder="Digite aqui">
                          </label>
                          ${item.id >= 6 && item.id <= 8 ? criarOpcoesEspeto(item.id) : ""}
                          <button onclick="adicionarAoPedido(${item.id})">Adicionar</button>
                          <button onclick="removerDoPedido(${item.id})">Remover</button>
                          <span id="quantidade-${item.id}">0</span>
                          ${imagemEspeto}`;

    return menuItem;
}

// Restante do código permanece inalterado

let pedido = [];

function renderizarMenu() {
    const menuContainer = document.getElementById("menu-items");
    const pedidoResumo = document.getElementById("pedido-resumo");

    if (!menuContainer || !pedidoResumo) {
        console.error("Elementos não encontrados.");
        return;
    }

    // Renderiza itens do menu
    menuItems.forEach(item => {
        const menuItem = criarElementoMenu(item);
        menuContainer.appendChild(menuItem);
    });

    // Inicializa o pedidoResumo
    pedidoResumo.innerHTML = "<h2>Resumo do Pedido</h2>";
}


function criarOpcoesEspeto(itemId) {
    return `<div>
              <label>Bem Passado
                <input type="radio" name="opcoes-${itemId}" value="bem-passado"> 
              </label>
              <label>Ao Ponto
                <input type="radio" name="opcoes-${itemId}" value="ao-ponto"> 
              </label>
              <label>Mal Passada
                <input type="radio" name="opcoes-${itemId}" value="mal-passada"> 
              </label>
            </div>`;
}

function adicionarAoPedido(itemId) {
    const itemSelecionado = menuItems.find(item => item.id === itemId);
    const quantidade = 1;
    const ponto = obterPontoEspeto(itemId);
    const observacao = document.getElementById(`observacao-${itemId}`).value;
    const itemClone = { ...itemSelecionado, ponto, observacao };

    for (let i = 0; i < quantidade; i++) {
        pedido.push(itemClone);
    }

    atualizarResumoPedido();
}

function obterPontoEspeto(itemId) {
    const opcoesPonto = document.querySelectorAll(`input[name="opcoes-${itemId}"]`);
    for (const opcao of opcoesPonto) {
        if (opcao.checked) {
            return opcao.value;
        }
    }
    return "";
}

function removerDoPedido(itemId) {
    const index = pedido.findIndex(item => item.id === itemId);
    if (index !== -1) {
        pedido.splice(index, 1);
    }
    atualizarResumoPedido();
}

function atualizarResumoPedido() {
    const pedidoResumo = document.getElementById("pedido-resumo");
    let totalPedido = 0;

    // Limpa o pedidoResumo
    pedidoResumo.innerHTML = "<h2>Resumo do Pedido</h2>";

    // Atualiza a quantidade de itens selecionados no menu
    menuItems.forEach(item => {
        const quantidadeElemento = document.getElementById(`quantidade-${item.id}`);
        const quantidade = pedido.filter(pedidoItem => pedidoItem.id === item.id).length;
        quantidadeElemento.textContent = quantidade.toString();
    });

    // Atualiza o resumo do pedido
    pedido.forEach(item => {
        pedidoResumo.innerHTML += `<p>${item.name} - R$${item.price.toFixed(2)}`;
        if (item.observacao) {
            pedidoResumo.innerHTML += ` (${item.observacao}`;
            if (item.ponto) {
                pedidoResumo.innerHTML += `, ${item.ponto})`;
            } else {
                pedidoResumo.innerHTML += `)`;
            }
        } else if (item.ponto) {
            pedidoResumo.innerHTML += ` (${item.ponto})`;
        } else {
            pedidoResumo.innerHTML += `</p>`;
        }
        totalPedido += item.price;
    });

    // Adiciona um título ao resumo
    pedidoResumo.innerHTML += "<h3>Dados do Pedido:</h3>";

    // Adiciona detalhes do pedido formatados
    pedido.forEach(item => {
        pedidoResumo.innerHTML += `<p><strong>${item.name}</strong> - R$${item.price.toFixed(2)}`;
        if (item.observacao) {
            pedidoResumo.innerHTML += ` (${item.observacao}`;
            if (item.ponto) {
                pedidoResumo.innerHTML += `, ${item.ponto})`;
            } else {
                pedidoResumo.innerHTML += `)`;
            }
        } else if (item.ponto) {
            pedidoResumo.innerHTML += ` (${item.ponto})`;
        } else {
            pedidoResumo.innerHTML += `</p>`;
        }
    });

    // Adiciona o total ao resumo
    pedidoResumo.innerHTML += `<strong>Total do Pedido: R$${totalPedido.toFixed(2)}</strong>`;
}

function finalizarPedido() {
    // Criar uma mensagem com os detalhes do pedido
    const mensagemPedido = criarMensagemPedido();

    // Substitua o número de telefone pelo número do WhatsApp desejado
    const numeroWhatsApp = "+98999928302";

    // Abre uma nova janela ou guia do navegador com o link do WhatsApp
    window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagemPedido)}`);

    // Exibe um alerta indicando que o pedido foi finalizado
    alert("Pedido finalizado! Detalhes enviados para o WhatsApp.");
}

function criarMensagemPedido() {
    let mensagem = "Novo Pedido:\n\n";

    // Adiciona detalhes do pedido formatados
    pedido.forEach(item => {
        mensagem += `${item.name} - R$${item.price.toFixed(2)}`;
        if (item.observacao) {
            mensagem += ` (${item.observacao}`;
            if (item.ponto) {
                mensagem += `, ${item.ponto})`;
            } else {
                mensagem += `)`;
            }
        } else if (item.ponto) {
            mensagem += ` (${item.ponto})`;
        }
        mensagem += '\n';
    });

    // Adiciona o total ao final da mensagem
    mensagem += `\nTotal do Pedido: R$${calcularTotalPedido().toFixed(2)}`;

    return mensagem;
}

function calcularTotalPedido() {
    return pedido.reduce((total, item) => total + item.price, 0);
}

window.onload = function () {
    renderizarMenu();
};
