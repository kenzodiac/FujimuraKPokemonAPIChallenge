import { saveFavoriteToLocalStorage, getLocalStorage, removeFromLocalStorage} from "./localStorage.js"

//Variables for linking HTML elements to JS
let searchField = document.getElementById("searchField");
let searchField2 = document.getElementById("searchField2");
let searchBtn = document.getElementById("searchBtn");
let pokeImgBtn = document.getElementById("pokeImgBtn");
let pokeImgBtn2 = document.getElementById("pokeImgBtn2");
let searchRndBtn = document.getElementById("searchRndBtn");
let searchRndBtn2 = document.getElementById("searchRndBtn2");
let PokeNameField = document.getElementById("PokeNameField");
let PokeImgField = document.getElementById("PokeImgField");
let elemField = document.getElementById("ElemField");
let LocField = document.getElementById("LocField");
let MovesField = document.getElementById("MovesField");
let AbilitiesField = document.getElementById("AbilitiesField");
let EvoField = document.getElementById("EvoField");
let FavoritesField = document.getElementById("FavoritesField");
let giovanni = document.getElementById("giovanni");
let giovanni2 = document.getElementById("giovanni2");
let favoritesListBtn = document.getElementById("favoritesListBtn");
let addFavsBtn = document.getElementById("addFavsBtn");
let addFavsBtn2 = document.getElementById("addFavsBtn2");


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

//API calls
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
    ConsiderPokeColor(currentPokeSpeciesInfo.color.name, pokeImgBtn);
    ConsiderPokeColor(currentPokeSpeciesInfo.color.name, pokeImgBtn2);
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
    pokeImgBtn2.src = pokePortrait;
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

const ConsiderPokeColor = (input, pokeImgPassThru) => {
    if (input == 'black'){
        pokeImgPassThru.style.backgroundColor = "";
    } else if (input == 'blue'){
        pokeImgPassThru.style.backgroundColor = "#0000FF";
    } else if (input == 'brown'){
        pokeImgPassThru.style.backgroundColor = "#964B00";
    } else if (input == 'gray'){
        pokeImgPassThru.style.backgroundColor = "#808080";
    } else if (input == 'green'){
        pokeImgPassThru.style.backgroundColor = "#FF5733";
    } else if (input == 'pink'){
        pokeImgPassThru.style.backgroundColor = "#FFC0CB";
    } else if (input == 'purple'){
        pokeImgPassThru.style.backgroundColor = "#A020F0";
    } else if (input == 'red'){
        pokeImgPassThru.style.backgroundColor = "#FF0000";
    } else if (input == 'white'){
        pokeImgPassThru.style.backgroundColor = "#FFFFFF";
    } else if (input == 'yellow'){
        pokeImgPassThru.style.backgroundColor = "#FFFF00";
    }
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

searchField.addEventListener('keydown', (event) => {
    if (event.key === 'Enter'){
        PokemonAPICall(searchField.value.toLowerCase());
        PokemonSpeciesAPICall(searchField.value.toLowerCase());
        giovanni.textContent = "";
    }
});

searchField2.addEventListener('keydown', (event) => {
    if (event.key === 'Enter'){
        PokemonAPICall(searchField2.value.toLowerCase());
        PokemonSpeciesAPICall(searchField2.value.toLowerCase());
        giovanni2.textContent = "";
    }
});

searchRndBtn.addEventListener('click', function(){
    let randomInt = getRandomInt(1, 1008);
    PokemonAPICall(randomInt);
    PokemonSpeciesAPICall(randomInt);
    giovanni.textContent = "";
});

searchRndBtn2.addEventListener('click', function(){
    let randomInt = getRandomInt(1, 1008);
    PokemonAPICall(randomInt);
    PokemonSpeciesAPICall(randomInt);
    giovanni2.textContent = "";
});

pokeImgBtn.addEventListener('click', function(){
    if (pokeImgBtn.src == pokePortrait) {
        pokeImgBtn.src = shinyPokePortrait;
    } else {
        pokeImgBtn.src = pokePortrait;
    }
});

pokeImgBtn2.addEventListener('click', function(){
    if (pokeImgBtn2.src == pokePortrait) {
        pokeImgBtn2.src = shinyPokePortrait;
    } else {
        pokeImgBtn2.src = pokePortrait;
    }
});

favoritesListBtn.addEventListener("click", function(){
    FavoritesField.innerHTML = "";
    let localStorageData = getLocalStorage();
    CreateElements();
});

addFavsBtn.addEventListener("click", function(){
    AddFavsActions();
});

addFavsBtn2.addEventListener("click", function(){
    AddFavsActions();
});

function AddFavsActions(){
    let pokemon = {name: CapitalizeFirstLetters(currentPokeSpeciesInfo.name), id: currentPokeSpeciesInfo.id};
    saveFavoriteToLocalStorage(pokemon);
    if (FavoritesField.innerHTML != ""){
        FavoritesField.innerHTML = "";
        CreateElements();
    }
}

//function for creating/displaying favorite's list
function CreateElements(){
    let favorites = getLocalStorage();
    //.map to create all of the buttons from the array of data in localStorage
    favorites.map(pokemon => {

        //creating the buttons showing all of the locations stored in localStorage
        let pokeBtn = document.createElement('button');
        pokeBtn.className = 'fav-btn';
        pokeBtn.textContent = "#" + pokemon.id + ": " + pokemon.name;
        pokeBtn.type = 'button'
        pokeBtn.style = 'border-radius: 10px 0px 0px 10px; background-color: #434343;';
        pokeBtn.addEventListener('click', function(){
            PokemonAPICall(pokemon.id);
            PokemonSpeciesAPICall(pokemon.id);
            giovanni.textContent = "";
            giovanni2.textContent = "";
        });

        //creating the delete buttons to remove items from localStorage
        let deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-fav-btn';
        deleteBtn.textContent = 'X';
        deleteBtn.type = 'button';
        deleteBtn.style = 'width: 10%; border-radius: 0px 10px 10px 0px; background-color: rgb(220, 53, 69);';
        deleteBtn.addEventListener('click', function(){
            removeFromLocalStorage(pokemon);
            FavoritesField.innerHTML = "";
            CreateElements();
        });

        //creating the divs to put the buttons into
        let outsideDiv = document.createElement("div");
        outsideDiv.style = 'margin-bottom: 1rem;';
        outsideDiv.className = '';

        outsideDiv.appendChild(pokeBtn);
        outsideDiv.appendChild(deleteBtn);

        FavoritesField.appendChild(outsideDiv);
    });
};