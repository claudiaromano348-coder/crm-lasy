"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try {
      if (!email || !senha) {
        setErro("Preencha email e senha.");
        return;
      }

      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password: senha,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: senha,
        });
        if (error) throw error;
      }

      router.push("/app");
    } catch (err: any) {
      console.error(err);
      setErro(err.message ?? "Algo deu errado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <h1 className="text-xl font-semibold text-white mb-2 text-center">
          Mini CRM – Lasy
        </h1>
        <p className="text-sm text-slate-400 mb-4 text-center">
          {mode === "login"
            ? "Entre com sua conta"
            : "Crie uma conta para testar o CRM"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-slate-300 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">
              Senha
            </label>
            <input
              type="password"
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="********"
            />
          </div>

          {erro && (
            <p className="text-xs text-red-400 bg-red-950/40 border border-red-900 rounded-lg px-2 py-1">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium py-2 mt-1"
          >
            {loading
              ? "Enviando..."
              : mode === "login"
              ? "Entrar"
              : "Criar conta"}
          </button>
        </form>

        <button
          type="button"
          onClick={() =>
            setMode((prev) => (prev === "login" ? "signup" : "login"))
          }
          className="w-full text-xs text-slate-400 mt-3 hover:text-slate-200"
        >
          {mode === "login"
            ? "Ainda não tem conta? Criar uma."
            : "Já tem conta? Fazer login."}
        </button>
      </div>
    </div>
  );
}
