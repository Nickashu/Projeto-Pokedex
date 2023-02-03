let body = window.document.querySelector("body");
let flag = true;

let btn_cor = window.document.querySelector(".btn-cor");
btn_cor.addEventListener("click", function(){
    if(flag)
        tela_escura();
    else
        tela_clara();
    flag = !flag;
});

$(document).on("click", ".img-pokemon", function(){
    let img_aux = $(this).attr("src");
    $(this).attr("src", $(this).attr("img2"));
    $(this).attr("img2", img_aux);
    console.log("aaaa");
})

window.onload = function(){
    carregar_pokedex();
}


async function carregar_pokedex(){
    let url = "";
    let card_original = $("#card-pokemon-principal");
    let div_lista = $("#lista-pokemon");

    for(let num=1; num<810; num++){
        url = "https://pokeapi.co/api/v2/pokemon/" + num;
        showLoader(true);  //Fazendo a tela de carregamento aparecer
        let chamadaPrincipal = await fetch(url)    //Fazendo as chamadas de forma síncrona
        .then(response => {
            if (!response.ok)
                throw new Error('Erro de rede.');
            return response.json();
        })
        .then(data => {
            console.log(data);
            let card_copia = $(card_original).clone();
            $(card_copia).removeAttr("id");
            $(card_copia).find(".nome-pokemon").text(data.id + " - " + capitalize(data.name));   //Adicionando o nome do pokémon
            $(card_copia).find(".img-pokemon").attr("src", data.sprites.front_default).attr("alt", "Imagem-" + capitalize(data.name)).attr("img2", data.sprites.back_default);  //Adicionando a imagem
            //Adicionando os nomes dos tipos:
            let tiposHTML = "";
            let tiposTxt = "";
            $(data.types).each(function(index, element){
                tiposTxt += element.type.name + " ";
                tiposHTML += htmlTipos(capitalize(element.type.name)); 
            });
            $(card_copia).find(".detalhes-pokemon .conteudo-tipo").html(tiposHTML);
            //Adicionando os atributos necessário para os filtros:
            let geracao = getGeracaoId(num);
            $(card_copia).attr("nome", data.name).attr("num", data.id).attr("tipos", tiposTxt.trim()).attr("gen", geracao);
            $(card_copia).show();
            $(div_lista).append(card_copia);
            //Pegando a entrada da pokedex:
            let url_specie = "https://pokeapi.co/api/v2/pokemon-species/" + num;
            fetch(url_specie)    //Fazendo as chamadas de forma síncrona
            .then(response => {
                if (!response.ok)
                    throw new Error('Erro de rede.');
                return response.json();
            })
            .then(data => {
                let descricao = "";
                for(let i=0; i<data.flavor_text_entries.length; i++){
                    if(data.flavor_text_entries[i].language.name == "en"){  //Se a descrição estiver em inglês
                        if(descricaoValida(data.flavor_text_entries[i].flavor_text) != false){
                            descricao = descricaoValida(data.flavor_text_entries[i].flavor_text);
                            break;
                        }
                    }
                }
                $(card_copia).find(".div-descricao .conteudo-descricao").text(descricao);
            })
            .catch(error => {
                console.error('Ocorreu um erro:', error);
            });
        })
        .catch(error => {
            console.error('Ocorreu um erro:', error);
        });
    }
    $("#lista-pokemon").show();
    showLoader(false);  //Fazendo a tela de carregamento desaparecer
}

function tela_escura(){
    setTimeout(function(){
        $(body).css("background", "#5f6060");
        let textos = document.querySelectorAll(".texto-tela-clara");
        for(let i=0; i<textos.length; i++){
            textos[i].classList.add("texto-tela-escura");
            textos[i].classList.remove("texto-tela-clara");
        }
        let cards = document.querySelectorAll(".card-pokemon");
        for(let i=0; i<cards.length; i++){
            cards[i].classList.add("card-tela-escura");
            cards[i].classList.remove("card-tela-clara");
        }
        $(".btn-cor").find(".img-sol-lua").attr("src", "imgs/sun.svg").attr("alt", "Imagem-Sol");
    }, 500);
}

function tela_clara(){
    setTimeout(function(){
        $(body).css("background", "#f7ffff");
        let textos = document.querySelectorAll(".texto-tela-escura");
        for(let i=0; i<textos.length; i++){
            textos[i].classList.add("texto-tela-clara");
            textos[i].classList.remove("texto-tela-escura");
        }
        let cards = document.querySelectorAll(".card-pokemon");
        for(let i=0; i<cards.length; i++){
            cards[i].classList.add("card-tela-clara");
            cards[i].classList.remove("card-tela-escura");
        }
        $(".btn-cor").find(".img-sol-lua").attr("src", "imgs/moon.svg").attr("alt", "Imagem-Lua");
    }, 500);
}