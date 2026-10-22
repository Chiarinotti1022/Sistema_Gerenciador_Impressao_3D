import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CHAVE, migrar, validarDados, vazio, type Dados } from "../lib/gestor";

type Contexto = {
  dados: Dados;
  carregando: boolean;
  erro: string;
  executar: (acao: (d: Dados) => Dados) => void;
};
const DadosContext = createContext<Contexto | null>(null);
export function DadosProvider({ children }: { children: ReactNode }) {
  const [dados, setDados] = useState<Dados>(vazio);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const atual = useRef<Dados>(dados);
  const pronto = useRef(false);
  useEffect(() => {
    function publicar(d: Dados) {
      atual.current = d;
      setDados(d);
    }
    try {
      if (typeof window === "undefined")
        throw new Error("Esta versão usa armazenamento no navegador.");
      const d = migrar((chave) => window.localStorage.getItem(chave));
      // Os cadastros antigos permanecem intactos nas chaves v1.
      if (!window.localStorage.getItem(CHAVE))
        window.localStorage.setItem(CHAVE, JSON.stringify(d));
      publicar(d);
      pronto.current = true;
    } catch (e) {
      setErro(
        e instanceof Error ? e.message : "Não foi possível carregar os dados.",
      );
    } finally {
      setCarregando(false);
    }
    function sincronizar(e: StorageEvent) {
      if (e.key !== CHAVE && e.key !== null) return;
      try {
        const texto = window.localStorage.getItem(CHAVE);
        if (!texto)
          throw new Error(
            "A base foi removida em outra aba. Recarregue a página.",
          );
        publicar(validarDados(JSON.parse(texto)));
        setErro("");
        pronto.current = true;
      } catch (e) {
        pronto.current = false;
        setErro(e instanceof Error ? e.message : "Erro de sincronização.");
      }
    }
    window.addEventListener("storage", sincronizar);
    return () => window.removeEventListener("storage", sincronizar);
  }, []);
  function executar(acao: (d: Dados) => Dados) {
    if (!pronto.current)
      throw new Error("O armazenamento ainda não está disponível.");
    const texto = window.localStorage.getItem(CHAVE);
    if (!texto) throw new Error("Base não encontrada. Recarregue a página.");
    const base = validarDados(JSON.parse(texto));
    if (base.revisao !== atual.current.revisao) {
      atual.current = base;
      setDados(base);
      throw new Error(
        "Os dados mudaram em outra aba. Confira as informações e tente novamente.",
      );
    }
    const novo = { ...acao(base), revisao: base.revisao + 1 };
    // Estoque e pedido são salvos juntos numa única gravação.
    window.localStorage.setItem(CHAVE, JSON.stringify(novo));
    atual.current = novo;
    setDados(novo);
  }
  return (
    <DadosContext.Provider value={{ dados, carregando, erro, executar }}>
      {children}
    </DadosContext.Provider>
  );
}
export function useDados() {
  const contexto = useContext(DadosContext);
  if (!contexto) throw new Error("DadosProvider precisa envolver as telas.");
  return contexto;
}
