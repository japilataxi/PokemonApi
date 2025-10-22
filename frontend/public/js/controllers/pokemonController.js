import { PokemonModel } from '../models/pokemonModel.js';
import { PokemonView } from '../views/pokemonView.js';

export const PokemonController = {
  init(){
    const input = document.getElementById('search');
    let timeout = null;

    input.addEventListener('input', (e) => {
      const q = e.target.value.trim();
      clearTimeout(timeout);
      if(!q) { PokemonView.renderSuggestions([]); return; }
      timeout = setTimeout(async ()=>{
        const results = await PokemonModel.autocomplete(q);
        PokemonView.renderSuggestions(results);
      }, 250);
    });

    PokemonView.suggestionsEl.addEventListener('click', async (e)=>{
      const id = e.target.dataset.id;
      if(!id) return;
      const p = await PokemonModel.getPokemon(id);
      PokemonView.renderDetails(p);

      // Guardar búsqueda
      fetch('/api/searches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + PokemonModel.token()
        },
        body: JSON.stringify({ q: id })
      }).catch(err=>console.error(err));
    });

    (async ()=>{
      const list = await PokemonModel.getList(1,20);
      PokemonView.renderList(list);
    })();
  }
};
