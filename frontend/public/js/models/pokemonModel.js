// 🔗 URL base del backend (ajústala si el puerto cambia)
const API_URL = window.API_URL || "http://localhost:3000";

export const PokemonModel = {
  token: () => localStorage.getItem('token'),

  async autocomplete(q){
    const res = await fetch(`${API_URL}/api/pokemon/autocomplete?q=${encodeURIComponent(q)}`, {
      headers: { Authorization: 'Bearer ' + this.token() }
    });
    return res.ok ? res.json() : [];
  },

  async getPokemon(idOrName){
    const res = await fetch(`${API_URL}/api/pokemon/${encodeURIComponent(idOrName)}`, {
      headers: { Authorization: 'Bearer ' + this.token() }
    });
    return res.json();
  },

  async getList(page=1, limit=20){
    const res = await fetch(`${API_URL}/api/pokemons?page=${page}&limit=${limit}`, {
      headers: { Authorization: 'Bearer ' + this.token() }
    });
    return res.json();
  }
};
