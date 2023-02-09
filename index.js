//Evento de voltar ao topo da tela:
$(document).on("scroll", function(){
    let scrollTop = document.scrollingElement.scrollTop;
    if(scrollTop > 1000){
        $(".div-scroll-top").fadeIn(300);
    }
    else{
        $(".div-scroll-top").fadeOut(300);
    }
});
$(document).on("click", ".scroll-top", function(){
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
});

$(document).on("click", ".img-pokemon", function(){
    let img_aux = $(this).attr("src");
    $(this).attr("src", $(this).attr("img2"));
    $(this).attr("img2", img_aux);
});

$(document).on("change", ".filtro-geracao input, .filtro-tipos input", function(){    //Evento do filtro
    filtrarCards($(this));
});
$(document).on("keyup", "#input-pokemon", function(){    //Evento do filtro
    filtrarCards($(this));
});


window.onload = function(){
    carregarCards(comecoGeracoes.gen1, limitesGeracoes.gen1, true);   //Inicialmente, carregando apenas a primeira geração
}

async function carregarCards(comeco, final, isChamadaInicial){
    showLoader(true);  //Fazendo a tela de carregamento aparecer
    let url = "";
    let card_original = $("#card-pokemon-principal");
    let div_lista = $("#lista-pokemon")

    for(let num=comeco; num<=final; num++){
        url = "https://pokeapi.co/api/v2/pokemon/" + num;
        let chamadaPrincipal = await fetch(url)    //Fazendo as chamadas de forma síncrona
        .then(response => {
            if (!response.ok)
                throw new Error('Erro de rede.');
            return response.json();
        })
        .then(data => {
            let card_copia = $(card_original).clone();
            $(card_copia).removeAttr("id");
            $(card_copia).find(".div-numero").text("N°" + data.id);
            $(card_copia).find(".nome-pokemon").text(capitalize(data.name));   //Adicionando o nome do pokémon
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
            $(card_copia).attr("nome", data.name).attr("num", data.id).attr("tipos", tiposTxt.trim()).attr("gen", "gen" + geracao);
            if(geracao != 1){
                let pontoDePartida = 1;
                for(let i=geracao-1; i>=0; i--){
                    if($(".card-pokemon[gen='gen" + i +"']").length > 0){
                        pontoDePartida = i;
                        break;
                    }
                }
                if(num == comeco)
                    $(div_lista).find(".card-pokemon[gen='gen" + pontoDePartida +"']:last").after(card_copia);
                else
                    $(div_lista).find(".card-pokemon[gen='gen" + geracao +"']:last").after(card_copia);
            }
            else
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

            if(isChamadaInicial){
                if(num <= limitesGeracoes.gen1)
                    $(card_copia).show();
                if(num == 20){
                    $("#lista-pokemon").show();
                    $(".loading-filtros").show();
                    atualizarRegistros(true);
                    showLoader(false);  //Fazendo a tela de carregamento desaparecer
                }
            }
        })
        .catch(error => {
            console.error('Ocorreu um erro:', error);
        });
    }

    //Ao final de todo o carregamento:
    if(isChamadaInicial){
        $(".loading-filtros").remove();
        alerta("Filtros carregados com sucesso");
        $(".div-filtros").fadeIn(500);
    }
    else
        showLoader(false);
}

async function filtrarCards(elementoFiltro){
    const div_filtro_geral = $(".filtro-lista-pokemon");
    const divFiltro = $(elementoFiltro).closest("div");
    let novaGen = false;
    if($(divFiltro).hasClass("filtro-geracao")){   //Se for o filtro de geração:
        let marcando = $(elementoFiltro).prop("checked");
        if(marcando){
            if($(".card-pokemon[gen='gen" + $(elementoFiltro).attr("value") + "']").length == 0){  //Se não existirem cards de pokemon desta geração
                await carregarCards(comecoGeracoes["gen" + $(elementoFiltro).attr("value")], limitesGeracoes["gen" + $(elementoFiltro).attr("value")], false);
                novaGen = true;
            }
        }
    }

    let listaGeracoes = [];
    $(div_filtro_geral).find(".filtro-geracao").find("input").each(function(index, element){
        if($(element).prop("checked"))
            listaGeracoes.push("gen" + $(element).attr("value"));
    });

    let listaTiposDesmarcados = [];
    $(div_filtro_geral).find(".filtro-tipos").find("input").each(function(index, element){
        if(!$(element).prop("checked"))
        listaTiposDesmarcados.push($(element).attr("value"));
    });

    let textoInput = $("#input-pokemon").val().toLowerCase().trim();
    if($("#input-pokemon").val() === "")
        $(".div-icon-lupa").show();
    else
        $(".div-icon-lupa").hide();

    $(".card-pokemon").each(function(index, element){
        //Filtro geração:
        if(listaGeracoes.includes($(element).attr("gen"))){
            $(element).addClass("filtro-gen");
            if($(element).hasClass("filtro-nome-numero") && $(element).hasClass("filtro-tipo"))
                $(element).fadeIn(300);
        }
        else
            $(element).removeClass("filtro-gen").fadeOut(300);

        //Filtro tipo:
        if($(element).attr("tipos")){   //Se o card possuir o atributo "tipos"
            let tipos = $(element).attr("tipos").split(" ");
            let temTipoDesmarcado = false;
            for(let i=0; i<tipos.length; i++){
                if(listaTiposDesmarcados.includes(tipos[i])){
                    temTipoDesmarcado = true;
                    break;
                }
            }
            if(temTipoDesmarcado){
                $(element).removeClass("filtro-tipo").fadeOut(300);
            }
            else{
                $(element).addClass("filtro-tipo");
                if($(element).hasClass("filtro-nome-numero") && $(element).hasClass("filtro-gen"))
                    $(element).fadeIn(300);
            }
        }

        //Filtro nome/número:
        if($(element).attr("nome") || $(element).attr("num")){   //Se o card possuir o atributo "nome" ou o atributo "num"
            if($(element).attr("nome").includes(textoInput) || $(element).attr("num").includes(textoInput)){
                $(element).addClass("filtro-nome-numero");
                if($(element).hasClass("filtro-tipo") && $(element).hasClass("filtro-gen"))
                    $(element).show();
            }
            else {
                $(element).removeClass("filtro-nome-numero").hide();
            }
        }
    });

    if(novaGen)
        alerta("Registros carregados com sucesso");

    atualizarRegistros(false);
}

function atualizarRegistros(primeiraChamada){
    $(".msg-sem-registros").hide();
    if(primeiraChamada){
        $(".div-registros .registros").text(limitesGeracoes.gen1);
        $(".div-registros").show();
    }
    else{
        if($(".card-pokemon.filtro-tipo.filtro-gen.filtro-nome-numero").length > 0){   //Se tiver algum registro com todas as classes
            $(".div-registros .registros").fadeOut(200).fadeIn(200);
            $(".div-registros .registros").text($(".card-pokemon.filtro-tipo.filtro-gen.filtro-nome-numero").length);
            $(".div-registros").show();
        }
        else{
            $(".div-registros").hide();
            $(".msg-sem-registros").show();
        }
    }
}