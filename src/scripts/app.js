//Variables for linking HTML elements to JS
let searchField = document.getElementById("searchField");
let searchBtn = document.getElementById("searchBtn");
let pokeImgBtn = document.getElementById("pokeImgBtn");
let searchRndBtn = document.getElementById("searchRndBtn");
let PokeNameField = document.getElementById("PokeNameField");
let PokeImgField = document.getElementById("PokeImgField");
let elemField = document.getElementById("ElemField");
let LocField = document.getElementById("LocField");
let MovesField = document.getElementById("MovesField");
let AbilitiesField = document.getElementById("AbilitiesField");
let EvoField = document.getElementById("EvoField");
let FavoritesField = document.getElementById("FavoritesField");

//global variables for storing called Pokemon information
//raw json data from api calls
let currentPokeInfo;
let currentPokeSpeciesInfo;
let currentEvoChainInfo;
let currentLocInfo;

//storing urls for pokemon images
let pokePortrait;
let shinyPokePortrait;
let pokeColor;

//storing pokemon name
let pokeNum;
let pokeName;

//storing pokemon location
let pokeLoc;
let pokeRegion;

//storing pokemon element/type
let pokeType = [];

//storing pokemon abilities
let pokeAbilites = [];

//storing pokemon moves
let pokeMoves = [];

//storing pokemon evolution chain information
let pokeEvoChain = [];

//API call 
async function PokemonAPICall(input){
    let PokemonAPIURL = `https://pokeapi.co/api/v2/pokemon/${input}/`
    const promise = await fetch(PokemonAPIURL);
    const data = await promise.json();
    currentPokeInfo = data;
    console.log("current poke info:");
    console.log(currentPokeInfo);
    GetPokeImgURL();
    LocationAPICall(currentPokeInfo.location_area_encounters);
    DisplayPokeElement();
    DisplayPokeAbilities();
    DisplayPokeMoves();
    GetPokeImgURL();
};

async function PokemonSpeciesAPICall(input){
    let PokemonSpeciesAPIURL = `https://pokeapi.co/api/v2/pokemon-species/${input}/`
    const promise = await fetch(PokemonSpeciesAPIURL);
    const data = await promise.json();
    currentPokeSpeciesInfo = data;
    console.log("current poke species info:");
    console.log(currentPokeSpeciesInfo);
    DisplayPokeName();
    if (currentPokeSpeciesInfo.evolution_chain == null){
        pokeEvoChain = [];
        pokeEvoChain.push("N/A");
        EvoField.textContent = pokeEvoChain[0];
    } else {
        EvolutionChainAPICall(currentPokeSpeciesInfo.evolution_chain.url);
    }
};

async function EvolutionChainAPICall(input){
    pokeEvoChain = [];
    let EvolutionChainAPIURL = input;
    const promise = await fetch(EvolutionChainAPIURL);
    const data = await promise.json();
    currentEvoChainInfo = data;
    console.log("current poke evolution chain:");
    console.log(currentEvoChainInfo);

    pokeEvoChain.push(currentEvoChainInfo.chain.species.name);
    if (currentEvoChainInfo.chain.evolves_to != undefined) {
        currentEvoChainInfo.chain.evolves_to.map(element => pokeEvoChain.push(element.species.name));
        if (currentEvoChainInfo.chain.evolves_to.length != 0 && currentEvoChainInfo.chain.evolves_to[0].evolves_to.length != 0){
            currentEvoChainInfo.chain.evolves_to[0].evolves_to.map(element => pokeEvoChain.push(element.species.name));
        }
    }
    console.log(pokeEvoChain);
    for (let i = 0; i < pokeEvoChain.length; i++){
        pokeEvoChain[i] = CapitalizeFirstLetters(pokeEvoChain[i]);
    }
    EvoField.textContent = pokeEvoChain.join(', ');
};

async function LocationAPICall(input){
    const promise = await fetch(input);
    const data = await promise.json();
    currentLocInfo = data;
    //console.log(currentLocInfo);
    if (data.length == 0){
        pokeLoc = "N/A";
        LocField.textContent = pokeLoc;
    } else {
        LocationNameAPICall(currentLocInfo[0].location_area.url);
    }
};

async function LocationNameAPICall(input){
    const promise = await fetch(input);
    const data = await promise.json();
    //console.log(data);
    //console.log(data.names[0].name);
    pokeLoc = data.names[0].name;
    LocField.textContent = pokeLoc;
    LocationName2APICall(data.location.url);
};

async function LocationName2APICall(input){
    const promise = await fetch(input);
    const data = await promise.json();
    //console.log(data);
    RegionNameAPICall(data.region.url);
};

async function RegionNameAPICall(input){
    const promise = await fetch(input);
    const data = await promise.json();
    //console.log(data.names[5].name);
    pokeRegion = data.names[5].name;
    LocField.textContent += (", " + pokeRegion);
};

//functions processing information
const GetPokeImgURL = () => {
    pokePortrait = currentPokeInfo.sprites.other["official-artwork"].front_default;
    shinyPokePortrait = currentPokeInfo.sprites.other["official-artwork"].front_shiny;
    pokeImgBtn.src = pokePortrait;
};

const DisplayPokeName = () => {
    pokeName = CapitalizeFirstLetters(currentPokeSpeciesInfo.name);
    pokeNum = currentPokeSpeciesInfo.id;
    pokeColor = currentPokeSpeciesInfo.color.name;
    //console.log(pokeColor);
    PokeNameField.textContent = "#" + pokeNum + ": " + pokeName;
    //console.log(pokeName);
};

const DisplayPokeElement = () => {
    //console.log(currentPokeInfo.types[0].type.name);
    pokeType = [];
    currentPokeInfo.types.map(element => pokeType.push(element.type.name));
    //console.log(pokeType);
    for (let i = 0; i < pokeType.length; i++){
        pokeType[i] = CapitalizeFirstLetters(pokeType[i]);
    }
    elemField.textContent = pokeType.join(', ');
};

const DisplayPokeAbilities = () => {
    //console.log(currentPokeInfo.abilities[0].ability.name);
    pokeAbilites = [];
    currentPokeInfo.abilities.map(element => pokeAbilites.push(element.ability.name));
    for (let i = 0; i < pokeAbilites.length; i++){
        pokeAbilites[i] = CapitalizeFirstLetters(pokeAbilites[i]);
    }
    AbilitiesField.textContent = pokeAbilites.join('; ');
}

const DisplayPokeMoves = () => {
    //console.log(currentPokeInfo.moves[0].move.name);
    pokeMoves = [];
    currentPokeInfo.moves.map(element => pokeMoves.push(element.move.name));
    for (let i = 0; i < pokeMoves.length; i++){
        pokeMoves[i] = CapitalizeFirstLetters(pokeMoves[i]);
    }
    MovesField.textContent = pokeMoves.join('; ');
}

const DisplayEvolutionaryPaths = (input) => {

}

const CapitalizeFirstLetters = (input) => {
    let tempArray = RemoveDashesInPhrases(input).split('');
    tempArray[0] = tempArray[0].toUpperCase();
    for (let i = 0; i < tempArray.length; i++){
        if (tempArray[i] == ' '){
            tempArray[i+1] = tempArray[i+1].toUpperCase();
        }
    }
    return tempArray.join('');
}

const RemoveDashesInPhrases = (input) => {
    let tempArray = input.split('-');
    return tempArray.join(' ');
}

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

searchBtn.addEventListener("click", function(){
    PokemonAPICall(searchField.value);
    PokemonSpeciesAPICall(searchField.value);
});

searchRndBtn.addEventListener('click', function(){
    let randomInt = getRandomInt(1, 1008);
    PokemonAPICall(randomInt);
    PokemonSpeciesAPICall(randomInt);
});

pokeImgBtn.addEventListener('click', function(){
    if (pokeImgBtn.src == pokePortrait) {
        pokeImgBtn.src = shinyPokePortrait;
    } else {
        pokeImgBtn.src = pokePortrait;
    }
});