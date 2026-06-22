import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Sparkles, Check } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gerador de Conta Netflix" },
      { name: "description", content: "Gere logins e senhas aleatórios estilo Netflix com um clique." },
      { property: "og:title", content: "Gerador de Conta Netflix" },
      { property: "og:description", content: "Gere logins e senhas aleatórios estilo Netflix com um clique." },
    ],
  }),
  component: Index,
});

const FIRST = ["joao", "maria", "lucas", "ana", "pedro", "carla", "bruno", "julia", "rafa", "leo", "fer", "gabi", "thi", "bea", "rod", "marcos", "nat", "vini"];
const LAST = ["silva", "souza", "lima", "costa", "rocha", "alves", "melo", "dias", "ramos", "pinto", "neves", "cruz"];
const DOMAINS = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com", "icloud.com"];
const SYMBOLS = "!@#$%&*?";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateEmail() {
  return `${pick(FIRST)}.${pick(LAST)}${Math.floor(Math.random() * 9999)}@${pick(DOMAINS)}`;
}

function generatePassword() {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnpqrstuvwxyz";
  const nums = "23456789";
  const all = upper + lower + nums + SYMBOLS;
  let pwd = pick(upper.split("")) + pick(lower.split("")) + pick(nums.split("")) + pick(SYMBOLS.split(""));
  for (let i = 0; i < 8; i++) pwd += pick(all.split(""));
  return pwd.split("").sort(() => Math.random() - 0.5).join("");
}

const PLANS = ["Básico", "Padrão", "Premium 4K"];

function Index() {
  const [account, setAccount] = useState<{ email: string; password: string; plan: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const generate = () => {
    setLoading(true);
    setAccount(null);
    setTimeout(() => {
      setAccount({
        email: generateEmail(),
        password: generatePassword(),
        plan: pick(PLANS),
      });
      setLoading(false);
    }, 900);
  };

  const copy = (label: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="min-h-screen bg-netflix-bg text-netflix-text flex flex-col">
      <header className="px-6 py-5">
        <h1 className="text-netflix-red font-black text-3xl tracking-tighter">NETFLAKE</h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <div className="text-center max-w-2xl mb-10">
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-4">
            Gere sua conta <span className="text-netflix-red">Netflix</span>
          </h2>
          <p className="text-netflix-muted text-lg">
            Clique no botão e nosso algoritmo cria um login e senha aleatórios na hora.
          </p>
          <p className="text-xs text-netflix-muted/70 mt-3">
            * Apenas demonstração — credenciais fictícias geradas localmente.
          </p>
        </div>

        <Button variant="netflix" size="xl" onClick={generate} disabled={loading}>
          <Sparkles className="mr-2 h-5 w-5" />
          {loading ? "Gerando..." : "Gerar Netflix"}
        </Button>

        {(loading || account) && (
          <Card className="mt-10 w-full max-w-lg bg-netflix-card border-netflix-border p-6">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-netflix-border rounded w-1/3" />
                <div className="h-10 bg-netflix-border rounded" />
                <div className="h-4 bg-netflix-border rounded w-1/3" />
                <div className="h-10 bg-netflix-border rounded" />
              </div>
            ) : account ? (
              <div className="space-y-5">
                <Field label="E-mail" value={account.email} copied={copied === "email"} onCopy={() => copy("email", account.email)} />
                <Field label="Senha" value={account.password} copied={copied === "password"} onCopy={() => copy("password", account.password)} mono />
                <div className="flex items-center justify-between pt-3 border-t border-netflix-border">
                  <span className="text-sm text-netflix-muted">Plano</span>
                  <span className="text-sm font-semibold text-white">{account.plan}</span>
                </div>
              </div>
            ) : null}
          </Card>
        )}
      </main>

      <footer className="text-center text-xs text-netflix-muted/60 pb-6 px-6">
        Feito para fins recreativos. Sem afiliação com a Netflix.
      </footer>
    </div>
  );
}

function Field({ label, value, copied, onCopy, mono }: { label: string; value: string; copied: boolean; onCopy: () => void; mono?: boolean }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-netflix-muted mb-2">{label}</div>
      <div className="flex items-center gap-2 bg-netflix-bg border border-netflix-border rounded-md px-3 py-2">
        <span className={`flex-1 truncate text-white ${mono ? "font-mono" : ""}`}>{value}</span>
        <button onClick={onCopy} className="text-netflix-muted hover:text-netflix-text transition-colors p-1" aria-label={`Copiar ${label}`}>
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
