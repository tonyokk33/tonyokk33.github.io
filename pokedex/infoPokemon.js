const typeIcons = {
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
};

const formatName = (name) => name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const escapeHtml = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

async function getPokemon() {
    const pokemonContainer = document.getElementById('pokemon-info-container');
    const pokemonId = new URLSearchParams(window.location.search).get('id');

    try {
        if (!pokemonId) {
            throw new Error('No se indicó ningún Pokémon');
        }

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(pokemonId)}`);
        if (!response.ok) {
            throw new Error('No se pudo encontrar el Pokémon');
        }

        displayPokemonInfo(await response.json());
    } catch (error) {
        pokemonContainer.innerHTML = '<p class="pokemon-error">No se pudo encontrar el Pokémon.</p>';
        console.error(error);
    }
}

function displayPokemonInfo(pokemon) {
    const pokemonContainer = document.getElementById('pokemon-info-container');
    const pokemonName = formatName(pokemon.name);
    const sprites = [
        pokemon.sprites.front_default,
        pokemon.sprites.back_default,
        pokemon.sprites.front_shiny,
        pokemon.sprites.back_shiny,
        pokemon.sprites.other?.['official-artwork']?.front_default,
    ].filter(Boolean);
    const types = pokemon.types.map(({ type }) => `
        <span class="pokemon-type">
            <img class="type-icon" src="${typeIcons[type.name]}" alt="" aria-hidden="true">
            <span>${escapeHtml(formatName(type.name))}</span>
        </span>
    `).join('');
    const abilities = pokemon.abilities.map(({ ability, is_hidden }) => `
        <tr>
            <td>${escapeHtml(formatName(ability.name))}</td>
            <td>${is_hidden ? 'Oculta' : 'Normal'}</td>
        </tr>
    `).join('');
    const moves = pokemon.moves.map(({ move }) => `
        <tr><td>${escapeHtml(formatName(move.name))}</td></tr>
    `).join('');

    pokemonContainer.innerHTML = `
        <main class="pokemon-detail" aria-labelledby="pokemon-title">
            <div class="pokemon-detail__top">
                <section class="pokemon-visual" aria-label="Sprites de ${escapeHtml(pokemonName)}">
                    <div class="pokemon-visual__disc">
                        <img id="pokemon-sprite" src="${sprites[0]}" alt="${escapeHtml(pokemonName)}">
                    </div>
                    <div class="sprite-controls" aria-label="Controles de sprite">
                        <button type="button" class="sprite-button" id="previous-sprite" aria-label="Previous sprite">&#8249;</button>
                        <span id="sprite-counter">1 / ${sprites.length}</span>
                        <button type="button" class="sprite-button" id="next-sprite" aria-label="Next sprite">&#8250;</button>
                    </div>
                </section>

                <section class="pokemon-summary">
                    <div class="pokemon-heading">
                        <span class="pokemon-id">#${String(pokemon.id).padStart(3, '0')}</span>
                        <h1 id="pokemon-title">${escapeHtml(pokemonName)}</h1>
                    </div>
                    <div class="pokemon-types">${types}</div>
                    <div class="pokemon-measurements">
                        <div class="measurement-card">
                            <span class="measurement-label">height</span>
                            <strong>${pokemon.height / 10} m</strong>
                        </div>
                        <div class="measurement-card">
                            <span class="measurement-label">weight</span>
                            <strong>${pokemon.weight / 10} kg</strong>
                        </div>
                    </div>
                </section>
            </div>

            <div class="pokemon-lists">
                <section class="pokemon-panel">
                    <h2>Habilities</h2>
                    <div class="pokemon-table-wrapper">
                        <table>
                            <thead><tr><th>Hability</th><th>Type</th></tr></thead>
                            <tbody>${abilities}</tbody>
                        </table>
                    </div>
                </section>
                <section class="pokemon-panel">
                    <h2>Movements</h2>
                    <div class="pokemon-table-wrapper">
                        <table>
                            <thead><tr><th>Movement</th></tr></thead>
                            <tbody>${moves}</tbody>
                        </table>
                    </div>
                </section>
            </div>
        </main>
    `;

    let spriteIndex = 0;
    const spriteImage = document.getElementById('pokemon-sprite');
    const counter = document.getElementById('sprite-counter');
    const showSprite = (nextIndex) => {
        spriteIndex = (nextIndex + sprites.length) % sprites.length;
        spriteImage.src = sprites[spriteIndex];
        counter.textContent = `${spriteIndex + 1} / ${sprites.length}`;
    };

    document.getElementById('previous-sprite').addEventListener('click', () => showSprite(spriteIndex - 1));
    document.getElementById('next-sprite').addEventListener('click', () => showSprite(spriteIndex + 1));
    if (sprites.length > 1) {
        window.setInterval(() => showSprite(spriteIndex + 1), 3500);
    }
}

getPokemon();
