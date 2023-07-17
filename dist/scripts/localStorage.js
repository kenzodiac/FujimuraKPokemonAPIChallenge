function saveFavoriteToLocalStorage(pokemon){
    let favorites = getLocalStorage();
    let checker = false;
    for (let i = 0; i < favorites.length; i++){
        if (favorites[i].name == pokemon.name && favorites[i].id == pokemon.id){
            checker = true;
        }
    }

    if (checker == false && favorites[7] == null) {
        favorites.push(pokemon);
    }

    localStorage.setItem('Favorites', JSON.stringify(favorites));
}

function getLocalStorage(){
    let localStorageData = localStorage.getItem('Favorites');

    if(localStorageData === null){
        return [];
    }
    return JSON.parse(localStorageData);
}

function removeFromLocalStorage(pokemon){
    let favorites = getLocalStorage();

    for (let i = 0; i < favorites.length; i++){
        if (favorites[i].name == pokemon.name && favorites[i].id == pokemon.id){
            favorites.splice(i, 1);
        }
    }

    localStorage.setItem('Favorites', JSON.stringify(favorites))
}

export { saveFavoriteToLocalStorage, getLocalStorage, removeFromLocalStorage };