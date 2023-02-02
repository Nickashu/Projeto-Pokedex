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

window.onload = carregar_pokedex();


async function carregar_pokedex(){
    let url = "";
    let card_original = $("#card-pokemon-principal");
    let div_lista = $(".lista-pokemon");

    for(let num=1; num<700; num++){
        url = "https://pokeapi.co/api/v2/pokemon/" + num;
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
            //$(card_copia).find(".conteudo-numero").text(data.id);
            //Adicionando os nomes dos tipos:
            let tipos = "";
            $(data.types).each(function(index, element){
                tipos += htmlTipos(capitalize(element.type.name)); 
            });
            $(card_copia).find(".detalhes-pokemon .conteudo-tipo").html(tipos);
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
                        if(descricaoValida(data.flavor_text_entries[i].flavor_text)){
                            descricao = data.flavor_text_entries[i].flavor_text;
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


function capitalize(string){
    let string_format="";

    let string_cortada_espaco = string.split(" ");
    for (let i = 0; i < string_cortada_espaco.length; i++) {
        string_cortada_espaco[i] = string_cortada_espaco[i][0].toUpperCase() + string_cortada_espaco[i].substr(1);
    }
    string_format = string_cortada_espaco.join(" ");
    let string_cortada_hifen = string_format.split("-");
    for (let i = 0; i < string_cortada_hifen.length; i++) {
        string_cortada_hifen[i] = string_cortada_hifen[i][0].toUpperCase() + string_cortada_hifen[i].substr(1);
    }
    string_format = string_cortada_hifen.join("-");

    return string_format;
}

function htmlTipos(tipo){
    let cor_tipo = "#f7f7f9";   //Cor normal
    let cor_fonte = "#322e2e";  //Fonte normal
    switch(tipo.toLowerCase()){
        case "bug":
            cor_tipo = "#3d853d";
            cor_fonte = "#efefef";
            break;
        case "fire":
            cor_tipo = "#ef7777";
            break;
        case "water":
            cor_tipo = "#88d4f1";
            break;
        case "grass":
            cor_tipo = "#73ed73";
            break;
        case "dark":
            cor_tipo = "#4d4e52";
            cor_fonte = "#efefef";
            break;
        case "flying":
            cor_tipo = "#c9c9ef";
            break;
        case "ghost":
            cor_tipo = "#782978";
            cor_fonte = "#efefef";
            break;
        case "fairy":
            cor_tipo = "#ff6fff";
            break;
        case "steel":
            cor_tipo = "#b2bbb8";
            break;
        case "rock":
            cor_tipo = "#856833";
            cor_fonte = "#efefef";
            break;
        case "ground":
            cor_tipo = "#e99853";
            break;
        case "psychic":
            cor_tipo = "#f9cad2";
            break;
        case "fighting":
            cor_tipo = "#bda012";
            break;
        case "poison":
            cor_tipo = "#f748f7";
            break;
        case "electric":
            cor_tipo = "#f1fd8a";
            break;
        case "normal":
            cor_tipo = "#f7f7f9";
            break;
        case "ice":
            cor_tipo = "#a5e9fd";
            break;
        case "dragon":
            cor_tipo = "#34a9b5";
            break;
    }

    let html = "<div class='nome-tipo' style='background-color: " + cor_tipo + "; color: " + cor_fonte + "'>" + tipo + "</div>";

    return html;
}


function descricaoValida(desc){
    let modelo = /[]/;
    if(modelo.test(desc) == false){   //Se a descrição não tiver nenhuma caractere inválido
        
    }
    return false;
}