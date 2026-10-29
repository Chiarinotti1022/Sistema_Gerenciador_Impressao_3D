export const armazenamento = {
  getItem(chave: string): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(chave);
  },

  setItem(chave: string, valor: string): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(chave, valor);
  },

  removeItem(chave: string): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(chave);
  },
};