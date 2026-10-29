import "expo-sqlite/localStorage/install";

export const armazenamento = {
  getItem(chave: string): string | null {
    return localStorage.getItem(chave);
  },

  setItem(chave: string, valor: string): void {
    localStorage.setItem(chave, valor);
  },

  removeItem(chave: string): void {
    localStorage.removeItem(chave);
  },
};