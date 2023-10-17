$(document).ready(function (){
    cardapio.eventos.init();
})
var cardapio = {};

var MEU_CARRINHO =[];



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

        cardapio.metodos.obterItensCardapio(ativo,true);

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

               cardapio.metodos.mensagem('Item adicionado ao carrinho')
                $("#qntd-" + id).text(0);

                cardapio.metodos.atualizarBadgeTotal();



            }
        }
    },

    // atualiza o badge de torais dos botoes "Meu carrinho"
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

    mensagem:(texto,cor ='red',tempo = 3500) => {

        $("#container-mensagens").append(texto)
    }
   


}


cardapio.templates = {

    item:   `
    <div class="col-12 col-lg-3 col-md-3 col-sm-6 mb-5 animated fadeInUp">
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
        <span class="btn btn-remove no-mobile" onclick="cardapio.metodos.removerItemCarrinho('\${id}')"><i class="fa fa-times"></i></span>
    </div>
</div>
`,

}
