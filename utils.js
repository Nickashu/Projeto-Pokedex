const limitesGeracoes = {
    gen1: 151,
    gen2: 251,
    gen3: 386,
    gen4: 494,
    gen5: 649,
    gen6: 721,
    gen7: 810
};


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
            cor_tipo = "#e4e4ef";
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
        let descricaoFormatada;
        let modeloLetra = /[a-z]/;
        let stringSeparada = desc.toLowerCase().split(".");
        for(let i=0; i<stringSeparada.length; i++){
            for(let j=0; j<stringSeparada[i].length; j++){
                if(modeloLetra.test(stringSeparada[i][j])){
                    stringSeparada[i] = " " + stringSeparada[i][j].toUpperCase() + stringSeparada[i].substr(j+1);
                    break;
                }
            }
        }
        descricaoFormatada = stringSeparada.join(".");

        return descricaoFormatada;
    }
    return false;
}

function showLoader(ativo){
    if(ativo)
        $("#loader").show();
    else
        $("#loader").hide();
}

function getGeracaoId(num){
    let gen = 0;
    if(num >=0 && num <= limitesGeracoes.gen1)
        gen = 1;
    else if(num >= limitesGeracoes.gen1+1 && num <= limitesGeracoes.gen2)
        gen = 2;
    else if(num >= limitesGeracoes.gen2+1 && num <= limitesGeracoes.gen3)
        gen = 3;
    else if(num >= limitesGeracoes.gen3+1 && num <= limitesGeracoes.gen4)
        gen = 4;
    else if(num >= limitesGeracoes.gen4+1 && num <= limitesGeracoes.gen5)
        gen = 5;
    else if(num >= limitesGeracoes.gen5+1 && num <= limitesGeracoes.gen6)
        gen = 6;
    else if(num >= limitesGeracoes.gen6+1 && num <= limitesGeracoes.gen7)
        gen = 7;

    return gen;
}