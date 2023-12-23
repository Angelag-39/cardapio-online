$(document).ready(function (){
    cardapio.eventos.init();
})
var cardapio = {};

var MEU_CARRINHO = [];
var MEU_ENDERECO = null;

var VALOR_CARRINHO = 0;
var VALOR_ENTREGA = 5;

var CELULAR_EMPRESA = '5511986565453';

cardapio.eventos = {

    init:() => {
        cardapio.metodos.obterItensCardapio();
    }
}
cardapio.metodos = {
    //obtem a lista de itens do carpadio
    obterItensCardapio: (categoria = 'burgers' , vermais = false) => {

        var filtro = MENU[categoria];
        console.log(filtro);

        if (!vermais) {
            $("#itensCardapio").html('');
            $("#btnVerMais").removeClass('hidden');

        }

       

        $.each(filtro,(i,e) => {

            let temp = cardapio.templates.item.replace(/\${img}/g,e.img)
            .replace(/\${nome}/g,e.name) 
            .replace(/\${preco}/g, e.price.toFixed(2).replace('.' , ','))
            .replace(/\${id}/g,e.id) 
        

            //botão ver mais foi clicado (12 itens)
            if(vermais && i >= 8 && i < 12){
                $("#itensCardapio").append(temp)
            }

            //paginação inicial (8 itens)
            if(!vermais && i < 8){
                $("#itensCardapio").append(temp)
            }
           

        })

        // remove o ative
        $(".container-menu a").removeClass('active');

    // seta o menu para activo
        $("#menu-" + categoria).addClass('active')
    },

    //clique no botão de ver mais
    verMais: () =>{
        var ativo = $(".container-menu a.active").attr('id').split('menu-')[1]; // [menu] [burgers]

        cardapio.metodos.obterItensCardapio(ativo, true);

        $("#btnVerMais").addClass('hidden');
    },
    //diminuir a quantidade do iten no cardapio

    diminuirQuantidade:(id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0) {
            $("#qntd-" + id).text(qntdAtual - 1)
        }
    },
    // aumentar a quantidade do iten no cardapio
    aumentarQuantidade: (id) =>{

        let qntdAtual = parseInt($("#qntd-" + id).text());
        $("#qntd-" + id).text(qntdAtual + 1)
    },

    // adicionar ao carrinho o item do cardapio
    adicionarAoCarrinho:(id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0) {

            //obter a categoria ativa
            var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];

            // obter a lista de itens
            let filtro = MENU[categoria];

            //obter o item
            let item = $.grep(filtro,(e,i)  => {return e.id == id });

            if (item.length > 0) {

                //validar se ja existe esse iten no carrinho
                let existe =$.grep(MEU_CARRINHO,(elem,index)  => {return elem.id == id});

                //caso ja exista  o iten no carrinho, so altera a  quantidade
                if (existe.length > 0 ) {
                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;
                }

                // caso no exista o item no carrinho adiciona ele
                else {
                    item[0].qntd = qntdAtual;
                    MEU_CARRINHO.push(item[0])
                }

               cardapio.metodos.mensagem('Item adicionado ao carrinho','green')
                $("#qntd-" + id).text(0);

                cardapio.metodos.atualizarBadgeTotal();

            }
        }
    },

    // atualiza o badge de todos os botoes "Meu carrinho"
    atualizarBadgeTotal:() => {

        var total = 0;

        $.each(MEU_CARRINHO,(i,e) => {
            total += e.qntd
         })

         if (total > 0) {
            $(".botao-carrinho").removeClass('hidden');
            $(".container-total-carrinho").removeClass('hidden');
         }
         else {
            $(".botao-carrinho").addClass('hidden');
            $(".container-total-carrinho").addClass('hidden');
         }
            $(".badge-total-carrinho").html(total);
    },

    // abrir a modal do carrinho
    abrirCarrinho:(abrir) =>{

        if(abrir){
            $("#modalCarrinho").removeClass('hidden');
            cardapio.metodos.carregarCarrinho();
        }
        else {
            $("#modalCarrinho").addClass('hidden');
        }
    },

    //altera os textos y exibe os botoes das etapas
    carregarEtapa:(etapa)=> {

        if (etapa == 1){
            $("#lblTituloEtapa").text('Seu carrinho:');
            $("#itensCarrinho").removeClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").addClass('hidden');


            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');

            $("#btnEtapaPedido").removeClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnVoltar").addClass('hidden');
        
        }
        if (etapa == 2){
            $("#lblTituloEtapa").text('Endereço de entrega:');
            $("#itensCarrinho").addClass('hidden');
            $("#localEntrega").removeClass('hidden');
            $("#resumoCarrinho").addClass('hidden');


            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").removeClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnVoltar").removeClass('hidden');
        }
        if (etapa == 3){
            $("#lblTituloEtapa").text('Resumo do pedido:');
            $("#itensCarrinho").addClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").removeClass('hidden');


            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');
            $(".etapa3").addClass('active');

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").removeClass('hidden');
            $("#btnVoltar").removeClass('hidden');

        }
    },

    //botão de voltar etapa
    voltarEtapa: () => {

        let etapa =$(".etapa.active").length;
        cardapio.metodos.carregarEtapa(etapa - 1);
    },


    //carrega a lista de itens do carrinho
    carregarCarrinho: ()=>{
        cardapio.metodos.carregarEtapa(1);

        if(MEU_CARRINHO.length > 0) {

        $("#itensCarrinho").html('');

        $.each(MEU_CARRINHO,(i,e)=>{

            let temp = cardapio.templates.itemCarrinho.replace(/\${img}/g,e.img)
            .replace(/\${nome}/g, e.name) 
            .replace(/\${preco}/g, e.price.toFixed(2).replace('.' , ','))
            .replace(/\${id}/g,e.id) 
            .replace(/\${qntd}/g,e.qntd) 

            $("#itensCarrinho").append(temp);

            //ultimo item
          if ((i + 1) == MEU_CARRINHO.length){
                cardapio.metodos.carregarValores();
          }

            })

        

        }
        else {
            $("#itensCarrinho").html('<p class="carrinho-vazio"><i class="fa fa-shopping-bag"></i> Seu carrinho está vazio.</p>');
            cardapio.metodos.carregarValores();

        }
    },
// diminiur quantidade do item no carrinho
    diminuirQuantidadeCarrinho :(id) => {
        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());

        if (qntdAtual > 1) {
            $("#qntd-carrinho-" + id).text(qntdAtual - 1);
            cardapio.metodos.atualizarCarrinho(id,qntdAtual - 1);

        }
        else{
            cardapio.metodos.removerItemCarrinho(id)
        }
    },
// aumentar quantidade do item no carrinho
    aumentarQuantidadeCarrinho : (id) => {
        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());
        $("#qntd-carrinho-" + id).text(qntdAtual + 1);
        cardapio.metodos.atualizarCarrinho(id,qntdAtual + 1);
    },
//botao remover itens do carrinho
    removerItemCarrinho :(id) => {
        MEU_CARRINHO = $.grep(MEU_CARRINHO,(e,i) => {return e.id != id});
        cardapio.metodos.carregarCarrinho();

   //atualiza o botao carrinho com a quantidade actual
   cardapio.metodos.atualizarBadgeTotal();
      
    },

    //atualiza o carrinho  com a quantidade atual
    atualizarCarrinho:(id,qntd) =>{

        let objIndex = MEU_CARRINHO.findIndex((obj =>obj.id == id));
        MEU_CARRINHO[objIndex].qntd = qntd;

        //atualiza o botao carrinho com a quantidade actual
        cardapio.metodos.atualizarBadgeTotal();

        //atualiza os valores(R$) totais do carrinho
        cardapio.metodos.carregarValores();
},

//carrega os valores sub total
carregarValores:()=>{

    VALOR_CARRINHO = 0;

    $("#lblSubTotal").text('R$ 0,00');
    $("#lblValorEntrega").text('+ R$ 0,00');
    $("#lblValorTotal").text('R$ 0,00');

    $.each(MEU_CARRINHO,(i,e)=> {

        VALOR_CARRINHO += parseFloat(e.price * e.qntd);

        if((i + 1) == MEU_CARRINHO.length){
            $("#lblSubTotal").text(`R$ ${VALOR_CARRINHO.toFixed(2).replace('.',',')}`);
            $("#lblValorEntrega").text(`R$ ${VALOR_ENTREGA.toFixed(2).replace('.',',')}`);
            $("#lblValorTotal").text(`R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.',',')}`);
        }
    })
},

//carregar a etapa endereços
carregarEndereco:() => {
    if (MEU_CARRINHO.length <= 0 ){
        cardapio.metodos.mensagem('Seu carrinho está vazio.')
        return;
    }

    cardapio.metodos.carregarEtapa(2);
},

//Api viaCep
buscarCep :() =>{
    
    //cria a variavel com o valor do cep
    var cep =$("#txtCEP").val().trim().replace(/\D/g,'');

    //verifica se o CEP possui valor
    if(cep != ""){
        
        //Expresao regular para validar cep
        var validacep = /^[0-9]{8}$/;

        if(validacep.test(cep)){
            
            $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?",function(dados){
                if (!("erro" in dados)){

                    //Atualizar os campos com os valores informados
                        $("#txtEndereco").val(dados.logradouro);
                        $("#txtBairro").val(dados.bairro);
                        $("#txtCidade").val(dados.localidade);
                        $("#ddlUf").val(dados.uf);
                        $("#txtNumero").focus();
                }
                else {
                    cardapio.metodos.mensagem('CEP não encontrado. Preencha as informações manualmente.');
                    $("#txtEndereco").focus();
                }
            })
        }
        else {
            cardapio.metodos.mensagem('Formato do CEP inválido. Preencha as informações manualmente.');
            $("#txtEndereco").focus();
        }

     }
    else {
        cardapio.metodos.mensagem('Informe o CEP,por favor.');
        $("#txtCEP").focus();
    }
},

//validação antes de prosseguir para etapa 3
resumoPedido : ()=> {
     
    let cep = $("#txtCEP").val().trim();
    let endereco = $("#txtEndereco").val().trim();
    let bairro = $("#txtBairro").val().trim();
    let cidade = $("#txtCidade").val().trim();
    let uf = $("#ddlUf").val().trim();
    let numero = $("#txtNumero").val().trim();
    let complemento = $("#txtComplemento").val().trim();

   if (cep.length <= 0){
    cardapio.metodos.mensagem('Informe o CEP, por favor.')
    $("#txtCEP").focus();
    return;
   }

   if (endereco.length <= 0){
    cardapio.metodos.mensagem('Informe o Endereco, por favor.')
    $("#txtEndereco").focus();
    return;
   }


   if (bairro.length <= 0){
    cardapio.metodos.mensagem('Informe o Bairro, por favor.')
    $("#txtBairro").focus();
    return;
   }

   

   if (cidade.length <= 0){
    cardapio.metodos.mensagem('Informe a  Cidade, por favor.')
    $("#txtCidade").focus();
    return;
   }

   if (uf == "-1"){
    cardapio.metodos.mensagem('Informe a  Uf, por favor.')
    $("#ddlUf").focus();
    return;
   }

   if (numero.length <= 0){
    cardapio.metodos.mensagem('Informe o  Numero, por favor.')
    $("#txtNumero").focus();
    return;
   }

  MEU_ENDERECO = {
    cep:cep,
    endereco:endereco,
    bairro:bairro,
    cidade:cidade,
    uf:uf,
    numero:numero,
    complemento:complemento
  }

  cardapio.metodos.carregarEtapa(3);
  cardapio.metodos.carregarResumo();
},

// carrega a etapa 
carregarResumo:() => {
    $("#listaItensResumo").html('');
    
    $.each(MEU_CARRINHO,(i,e) => {
        let temp = cardapio.templates.itemResumo.replace(/\${img}/g,e.img)
        .replace(/\${nome}/g, e.name) 
        .replace(/\${preco}/g, e.price.toFixed(2).replace('.' , ','))
        .replace(/\${qntd}/g, e.qntd) 

        $("#listaItensResumo").append(temp);
        
    });

    $("#resumoEndereco").html(`${MEU_ENDERECO.endereco},${MEU_ENDERECO.numero},${MEU_ENDERECO.bairro}`);
    $("#cidadeEndereco").html(`${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} /  
    ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`);
    
    cardapio.metodos.finalizarPedido();
},

//Atualiza o link do botao de whathapp
finalizarPedido:() =>{

    if(MEU_CARRINHO.length > 0 && MEU_ENDERECO != null) {

        var texto ='Ola gostaria de fazer um pedido:';
        texto += `\n*Itens do pedido:*\n\n\${itens}`;
        texto +=  '\n*Endereço de entrega:*';
        texto += `\n${MEU_ENDERECO.endereco},${MEU_ENDERECO.numero},${MEU_ENDERECO.bairro}`;
        texto += `\n${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep}  ${MEU_ENDERECO.complemento}`;
        texto += `\n\n*Total (com entrega):R$ ${(VALOR_CARRINHO +VALOR_ENTREGA).toFixed(2).replace('.',',')}*`;

      var itens = '';

      $.each(MEU_CARRINHO,(i,e) => {

        itens += `*${e.qntd}x* ${e.name}....... R$ ${e.price.toFixed(2).replace('.',',')} \n`;

            //ultimo item
        if((i + 1) == MEU_CARRINHO.length){

            texto = texto.replace(/\${itens}/g,itens);

            //Converte a url
            let encode =encodeURI(texto);
            let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

           $("#btnEtapaResumo").attr('href',URL);
        }

      })
     
    }               
},
  
    //mensagens
    mensagem:(texto,cor='red',tempo = 3500) => {
    
        let id = Math.floor(Date.now() * Math.random()).toString();

        let msg = ` <div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div> `;

        $("#container-mensagens").append(msg);

        setTimeout(() => {
            $("#msg-" + id).removeClass('fadeInDown');
            $("#msg-" + id).remove('fadeOutUp');
            setTimeout(() =>{
                $("#msg-" + id).remove();
            },800);
           
        }, tempo)
    }
   


},


cardapio.templates = {

    item:   `
    <div class = "col-12 col-lg-3 col-md-3 col-sm-6 mb-5 animated fadeInUp">
        <div class="card card-item" id="\${id}">
            <div class="img-produto">
                <img src="\${img}" />
            </div>
            <p class="title-produto text-center mt-4">
                <b>\${nome}</b>
            </p>
            <p class="price-produto text-center">
                <b>R$ \${preco}</b>
            </p>
            <div class="add-carrinho">
                <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
                <span class="add-numero-itens" id="qntd-\${id}">0</span>
                <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                <span class="btn btn-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')"><i class="fa fa-shopping-bag"></i></span>
            </div>
        </div>
    </div>
`,
itemCarrinho: `
<div class="col-12 item-carrinho">
    <div class="img-produto">
        <img src="\${img}" />
    </div>
    <div class="dados-produto">
        <p class="title-produto"><b>\${nome}</b></p>
        <p class="price-produto"><b>R$ \${preco}</b></p>
    </div>
    <div class="add-carrinho">
            <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}')"><i class="fas fa-minus"></i></span>
            <span class="add-numero-itens" id="qntd-carrinho-\${id}">\${qntd}</span>
            <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}')"><i class="fas fa-plus"></i></span>
            <span class="btn btn-remove" onclick="cardapio.metodos.removerItemCarrinho('\${id}')"><i class="fa fa-times"></i></span>
    </div>
</div>
    `,
    itemResumo: `
    <div class="col-12 item-carrinho resumo">
        <div class="img-produto-resumo">
            <img src="\${img}" />
        </div>
        <div class="dados-produto">
            <p class="title-produto-resumo">
                <b>\${nome}</b>
            </p>
            <p class="price-produto-resumo">
                <b>R$ \${preco}</b>
            </p>
        </div>
        <p class="quantidade-produto-resumo">
            x <b>\${qntd}</b>
        </p>
        </div>
`
,
}