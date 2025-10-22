export const PokemonModel = {
  token: () => localStorage.getItem('token'),

  async autocomplete(q){
    const res = await fetch(`/api/pokemon/autocomplete?q=${encodeURIComponent(q)}`, {
      headers: { Authorization: 'Bearer ' + this.token() }
    });
    return res.ok ? res.json() : [];
  },

  async getPokemon(idOrName){
    const res = await fetch(`/api/pokemon/${encodeURIComponent(idOrName)}`, {
      headers: { Authorization: 'Bearer ' + this.token() }
    });
    return res.json();
  },

  async getList(page=1, limit=20){
    const res = await fetch(`/api/pokemons?page=${page}&limit=${limit}`, {
      headers: { Authorization: 'Bearer ' + this.token() }
    });
    return res.json();
  }
};
