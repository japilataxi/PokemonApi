export const PokemonView = {
  suggestionsEl: document.getElementById('suggestions'),
  detailsEl: document.getElementById('details'),
  listEl: document.getElementById('list'),

  renderSuggestions(items){
    this.suggestionsEl.innerHTML = items.map(i => `<div class="sugg" data-id="${i.name}">${i.name}</div>`).join('');
  },

  renderDetails(p){
    this.detailsEl.innerHTML = `
      <div class="pokemon-card">
        <img src="${p.sprites?.front_default || ''}" alt="${p.name}">
        <div>
          <h3>${p.name} (id: ${p.id})</h3>
          <p>Altura: ${p.height} • Peso: ${p.weight}</p>
          <p>${p.types?.map(t=>t.type.name).join(', ')}</p>
        </div>
      </div>`;
  },

  renderList(list){
    this.listEl.innerHTML = list.results.map(r => `<div>${r.name}</div>`).join('');
  }
};
