const pokemonPerPage = 20;
let currentPage = 0;
let isShiny = false;
let searchQuery = '';
let generationStart = 1;
let generationEnd = 151;
let typePokemonList = null;

let typeIcons = {
    bug: './assets/type-icon/bug.svg',
    dark: './assets/type-icon/dark.svg',
    dragon: './assets/type-icon/dragon.svg',
    electric: './assets/type-icon/electric.svg',
    fairy: './assets/type-icon/fairy.svg',
    fighting: './assets/type-icon/fighting.svg',
    fire: './assets/type-icon/fire.svg',
    flying: './assets/type-icon/flying.svg',
    ghost: './assets/type-icon/ghost.svg',
    grass: './assets/type-icon/grass.svg',
    ground: './assets/type-icon/ground.svg',
    ice: './assets/type-icon/ice.svg',
    normal: './assets/type-icon/normal.svg',
    poison: './assets/type-icon/poison.svg',
    psychic: './assets/type-icon/psychic.svg',
    rock: './assets/type-icon/rock.svg',
    steel: './assets/type-icon/steel.svg',
    water: './assets/type-icon/water.svg',
}

async function getPokemonPage(page){
    const offset = generationStart - 1 + page * pokemonPerPage;
    const limit = Math.min(pokemonPerPage, generationEnd - offset);
    const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    );

    if (!response.ok) {
        throw new Error('No se pudieron cargar los Pokémon');
    }

    const pageData = await response.json();
    return Promise.all(
        pageData.results.map(async (pokemon) => {
            const response = await fetch(pokemon.url);
            return response.json();
        })
    );
}

function displayPokemon(pokemon){
    const pokemonContainer = document.getElementById('pokemon-container');
    const pokemonName = pokemon.name;
    const pokemonImage = isShiny
        ? (pokemon.sprites.front_shiny || pokemon.sprites.front_default)
        : pokemon.sprites.front_default;
    const pokemonId = pokemon.id;
    const pokemonTypes = pokemon.types.map(({ type }) => type.name);
    const pokemonTypeDetails = pokemonTypes.map((type) => `
        <span class="pokemon-type">
            <img class="type-icon" src="${typeIcons[type]}" alt="${type} type">
            ${type}
        </span>
    `).join('');

    const pokemonCard = document.createElement('div');
    pokemonCard.classList.add('pokemon-card');
    pokemonCard.innerHTML = `
        <div class="card pokemon-card__content text-center">
        <div class="pokemon-card__image">
            <img src="${pokemonImage}" alt="${pokemonName}${isShiny ? ' shiny' : ''}">
        </div>
        <h2>${pokemonName}</h2>
        <p class="pokemon-card__id">ID: ${pokemonId}</p>
        <p class="pokemon-types">Type: ${pokemonTypeDetails}</p>
        <a class="pokemon-card__link" href="infoPokemon.html?name=${pokemonName}&id=${pokemonId}">
            <button class="btn btn-primary" id="see-details">See Details</button>
        </a>
        </div>
    `;
    pokemonContainer.appendChild(pokemonCard);
}

async function displayPokemonPage(page){
    const pokemonContainer = document.getElementById('pokemon-container');
    const previousButton = document.getElementById('previous-button');
    const nextButton = document.getElementById('next-button');

    pokemonContainer.innerHTML = '<p class="text-center">Cargando...</p>';
    previousButton.disabled = true;
    nextButton.disabled = true;

    try {
        const pokemonList = await getPokemonPage(page);
        pokemonContainer.innerHTML = '';
        pokemonList.forEach(displayPokemon);
        currentPage = page;
        previousButton.disabled = currentPage === 0;
        const pageOffset = generationStart - 1 + page * pokemonPerPage;
        nextButton.disabled = pageOffset + pokemonList.length >= generationEnd;
    } catch (error) {
        pokemonContainer.innerHTML = '<p class="text-center text-danger">No se pudieron cargar los Pokémon.</p>';
        console.error(error);
    }

    
}

function displayTypePage(page) {
    const pokemonContainer = document.getElementById('pokemon-container');
    const previousButton = document.getElementById('previous-button');
    const nextButton = document.getElementById('next-button');
    const start = page * pokemonPerPage;
    const pokemonPage = typePokemonList.slice(start, start + pokemonPerPage);

    pokemonContainer.innerHTML = '';
    pokemonPage.forEach(displayPokemon);
    currentPage = page;
    previousButton.disabled = currentPage === 0;
    nextButton.disabled = start + pokemonPage.length >= typePokemonList.length;
}

function searchPokemonByNameOrId(query) {
    const pokemonContainer = document.getElementById('pokemon-container');
    pokemonContainer.innerHTML = '<p class="text-center">Cargando...</p>';

    fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo encontrar el Pokémon');
            }
            return response.json();
        })
        .then(pokemon => {
            pokemonContainer.innerHTML = '';
            displayPokemon(pokemon);
        })
        .catch(error => {
            pokemonContainer.innerHTML = '<p class="text-center text-danger">No se pudo encontrar el Pokémon.</p>';
            console.error(error);
        });
}

async function filterPokemonByType(type) {
    const pokemonContainer = document.getElementById('pokemon-container');
    const previousButton = document.getElementById('previous-button');
    const nextButton = document.getElementById('next-button');
    pokemonContainer.innerHTML = '<p class="text-center">Cargando...</p>';
    previousButton.disabled = true;
    nextButton.disabled = true;

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/type/${type.toLowerCase()}`);
        if (!response.ok) {
            throw new Error('No se pudo encontrar el tipo de Pokémon');
        }

        const typeData = await response.json();
        typePokemonList = await Promise.all(
            typeData.pokemon.map(async ({ pokemon }) => {
                const pokemonResponse = await fetch(pokemon.url);
                return pokemonResponse.json();
            })
        );

        currentPage = 0;
        displayTypePage(currentPage);
    } catch (error) {
        pokemonContainer.innerHTML = '<p class="text-center text-danger">No se pudo encontrar el tipo de Pokémon.</p>';
        console.error(error);
    }
}




document.getElementById('previous-button').addEventListener('click', () => {
    if (currentPage > 0) {
        if (typePokemonList) {
            displayTypePage(currentPage - 1);
        } else {
            displayPokemonPage(currentPage - 1);
        }
    }
});

document.getElementById('next-button').addEventListener('click', () => {
    if (typePokemonList) {
        displayTypePage(currentPage + 1);
    } else {
        displayPokemonPage(currentPage + 1);
    }
});

document.getElementById('shinydex-button').addEventListener('click', (event) => {
    event.preventDefault();
    isShiny = !isShiny;
    event.currentTarget.setAttribute('aria-pressed', isShiny);
    if (typePokemonList) {
        displayTypePage(currentPage);
    } else {
        displayPokemonPage(currentPage);
    }
});

document.querySelectorAll('.generation-option').forEach(option => {
    option.addEventListener('click', (event) => {
        event.preventDefault();
        generationStart = parseInt(event.currentTarget.getAttribute('data-start'));
        generationEnd = parseInt(event.currentTarget.getAttribute('data-end'));
        typePokemonList = null;
        currentPage = 0;
        displayPokemonPage(currentPage);
    });
});

document.getElementById('search-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const query = document.getElementById('search-input').value.trim();

    if (query) {
        searchPokemonByNameOrId(query);
    }
});

document.querySelectorAll('.type-option').forEach(option => {
    option.addEventListener('click', (event) => {
        event.preventDefault();
        const type = event.currentTarget.dataset.type;
        filterPokemonByType(type);
    });
});

displayPokemonPage(currentPage);
