"use client";

import { useState, ChangeEvent, useMemo } from "react";
import type { Lead } from "@/lib/leads";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const STATUS_COLORS: Record<string, string> = {
  Novo: "#3b82f6",
  "Contato feito": "#f59e0b",
  "Proposta enviada": "#a855f7",
  Fechado: "#22c55e",
  Perdido: "#ef4444",
  "Sem status": "#a1a1aa",
};

type Props = {
  leads: Lead[];
  createLeadAction: (formData: FormData) => Promise<void>;
  updateLeadAction: (formData: FormData) => Promise<void>;
  deleteLeadAction: (formData: FormData) => Promise<void>;
};

function getStatusBadgeClasses(stage: string | null | undefined) {
  switch (stage) {
    case "Novo":
      return "bg-blue-500/20 text-blue-300 border-blue-500/40";
    case "Contato feito":
      return "bg-yellow-500/20 text-yellow-300 border-yellow-500/40";
    case "Proposta enviada":
      return "bg-purple-500/20 text-purple-300 border-purple-500/40";
    case "Fechado":
      return "bg-green-500/20 text-green-300 border-green-500/40";
    case "Perdido":
      return "bg-red-500/20 text-red-300 border-red-500/40";
    default:
      return "bg-zinc-700/40 text-zinc-200 border-zinc-500/40";
  }
}

export default function LeadsPageClient({
  leads,
  createLeadAction,
  updateLeadAction,
  deleteLeadAction,
}: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const [showSearch, setShowSearch] = useState(false);
  const [searchField, setSearchField] = useState<"name" | "email" | "phone">(
    "name"
  );
  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] = useState("Todos");

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);

  const handleSearchFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchField(e.target.value as "name" | "email" | "phone");
    setSearchTerm("");
  };

  const searchPlaceholder =
    searchField === "name"
      ? "Digite o nome..."
      : searchField === "email"
      ? "Digite o email..."
      : "Digite o telefone (apenas números)...";

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const term = searchTerm.trim().toLowerCase();

      const matchesSearch =
        !term ||
        (searchField === "name" &&
          lead.name.toLowerCase().includes(term)) ||
        (searchField === "email" &&
          (lead.email ?? "").toLowerCase().includes(term)) ||
        (searchField === "phone" &&
          (lead.phone ?? "").replace(/\D/g, "").includes(term.replace(/\D/g, "")));

      const matchesStatus =
        statusFilter === "Todos" || lead.stage === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [leads, searchField, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const total = leads.length;
    const fechados = leads.filter((l) => l.stage === "Fechado").length;
    const novos = leads.filter((l) => l.stage === "Novo").length;
    const emAndamento = leads.filter((l) =>
      ["Contato feito", "Proposta enviada"].includes(l.stage || "")
    ).length;

    return { total, fechados, novos, emAndamento };
  }, [leads]);

  const stageChartData = useMemo(
    () =>
      Object.entries(
        leads.reduce<Record<string, number>>((acc, lead) => {
          const key = lead.stage || "Sem status";
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {})
      ).map(([name, value]) => ({
        name,
        value,
        color: STATUS_COLORS[name] ?? STATUS_COLORS["Sem status"],
      })),
    [leads]
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mini CRM – Lasy</h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-md">
              Lead = pessoa ou empresa interessada. Aqui você controla o funil.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowSearch((p) => !p)}
              className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-zinc-600 bg-zinc-900/60"
            >
              🔍 Fazer busca
            </button>

            <button
              onClick={() => {
                setEditingLead(null);
                setShowForm(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 text-sm font-semibold"
            >
              Novo lead
            </button>
          </div>
        </header>

        {/* CARDS + GRÁFICO */}
        <section className="grid grid-cols-1 md:grid-cols-[1.7fr,1.1fr] gap-4 items-stretch">
          <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
            <div className="rounded-xl border border-zinc-700 bg-zinc-900/70 px-3 py-3">
              <p className="text-[11px] text-zinc-400 uppercase">Leads totais</p>
              <p className="text-2xl font-semibold mt-1">{stats.total}</p>
            </div>
            <div className="rounded-xl border border-blue-600/50 bg-blue-950/40 px-3 py-3">
              <p className="text-[11px] text-blue-200 uppercase">Novos</p>
              <p className="text-2xl font-semibold mt-1">{stats.novos}</p>
            </div>
            <div className="rounded-xl border border-amber-500/60 bg-amber-950/30 px-3 py-3">
              <p className="text-[11px] text-amber-200 uppercase">Em andamento</p>
              <p className="text-2xl font-semibold mt-1">{stats.emAndamento}</p>
            </div>
            <div className="rounded-xl border border-emerald-500/60 bg-emerald-950/30 px-3 py-3">
              <p className="text-[11px] text-emerald-200 uppercase">Fechados</p>
              <p className="text-2xl font-semibold mt-1">{stats.fechados}</p>
            </div>
          </div>

          {/* Gráfico */}
          <div className="rounded-xl border border-zinc-700 bg-zinc-900/80 px-4 py-3">
            <p className="text-[11px] text-zinc-400 uppercase mb-2">
              Distribuição por status
            </p>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stageChartData}
                    dataKey="value"
                    innerRadius={40}
                    outerRadius={60}
                  >
                    {stageChartData.map((e) => (
                      <Cell key={e.name} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <main className="grid grid-cols-1 md:grid-cols-[1.1fr,1.4fr] gap-6">
          {/* COLUNA ESQUERDA */}
          <section className="space-y-4">
            {showSearch && (
              <div className="bg-zinc-900/80 border border-zinc-700 rounded-xl p-4 space-y-3">
                <p className="text-[11px] text-zinc-400">Buscar por:</p>
                <div className="flex gap-4 text-xs">
                  <label>
                    <input
                      type="radio"
                      value="name"
                      checked={searchField === "name"}
                      onChange={handleSearchFieldChange}
                    />
                    Nome
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="email"
                      checked={searchField === "email"}
                      onChange={handleSearchFieldChange}
                    />
                    Email
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="phone"
                      checked={searchField === "phone"}
                      onChange={handleSearchFieldChange}
                    />
                    Telefone
                  </label>
                </div>

                <input
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2"
                />
              </div>
            )}

            {/* FILTROS */}
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-3">
              <p className="text-xs text-zinc-400 mb-2">Filtrar por status</p>
              <div className="flex gap-2 text-xs">
                {[
                  "Todos",
                  "Novo",
                  "Contato feito",
                  "Proposta enviada",
                  "Fechado",
                  "Perdido",
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1 rounded border ${
                      statusFilter === s
                        ? "bg-blue-600 border-blue-600"
                        : "border-zinc-600"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* LISTA */}
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl">
              <div className="px-4 py-3 border-b border-zinc-800 text-sm">
                Leads ({filteredLeads.length})
              </div>

              <ul className="max-h-[440px] overflow-y-auto divide-y divide-zinc-800">
                {filteredLeads.map((lead) => (
                  <li key={lead.id}>
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="w-full text-left px-4 py-3 hover:bg-zinc-900"
                    >
                      <div className="flex justify-between">
                        <span className="font-semibold">{lead.name}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border ${getStatusBadgeClasses(
                            lead.stage
                          )}`}
                        >
                          {lead.stage}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400">{lead.email}</p>
                      <p className="text-xs text-zinc-500">{lead.phone}</p>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* COLUNA DIREITA — DETALHES */}
          <section className="bg-zinc-900/80 border border-zinc-700 rounded-xl p-5 min-h-[260px]">
            {selectedLead ? (
              <>
                <h2 className="text-lg font-semibold">{selectedLead.name}</h2>

                <div className="mt-4 space-y-3 text-sm">
                  <p>Email: {selectedLead.email}</p>
                  <p>Telefone: {selectedLead.phone}</p>
                  <p>Empresa: {selectedLead.company}</p>
                  <p>Origem: {selectedLead.source}</p>
                  <p>Status: {selectedLead.stage}</p>
                  <p>
                    Data:{" "}
                    {new Date(selectedLead.created_at).toLocaleDateString(
                      "pt-BR"
                    )}
                  </p>
                  <p>Obs: {selectedLead.notes}</p>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => {
                      setEditingLead(selectedLead);
                      setShowForm(true);
                    }}
                    className="px-3 py-2 text-xs rounded bg-yellow-500 text-black"
                  >
                    Editar
                  </button>

                  <form action={deleteLeadAction}>
                    <input type="hidden" name="id" value={selectedLead.id} />
                    <button className="px-3 py-2 text-xs rounded bg-red-600">
                      Excluir
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <p className="text-zinc-500 text-sm">
                Selecione um lead na lista para ver detalhes.
              </p>
            )}
          </section>
        </main>
      </div>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-zinc-950 border border-zinc-700 rounded-lg w-full max-w-xl p-4">
            <div className="flex justify-between">
              <h2 className="text-lg font-semibold">
                {editingLead ? "Editar lead" : "Novo lead"}
              </h2>
              <button
                onClick={() => {
                  setEditingLead(null);
                  setShowForm(false);
                }}
              >
                ✕
              </button>
            </div>

            <form
              action={editingLead ? updateLeadAction : createLeadAction}
              className="mt-4 flex flex-col gap-3"
              onSubmit={() => {
                setEditingLead(null);
                setShowForm(false);
              }}
            >
              {editingLead && (
                <input type="hidden" name="id" value={editingLead.id} />
              )}

              <input
                name="name"
                placeholder="Nome"
                defaultValue={editingLead?.name}
                className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
              />
              <input
                name="email"
                placeholder="Email"
                defaultValue={editingLead?.email}
                className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
              />
              <input
                name="phone"
                placeholder="Telefone"
                defaultValue={editingLead?.phone}
                className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
              />
              <input
                name="company"
                placeholder="Empresa"
                defaultValue={editingLead?.company}
                className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
              />
              <input
                name="source"
                placeholder="Origem"
                defaultValue={editingLead?.source}
                className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
              />

              <select
                name="stage"
                defaultValue={editingLead?.stage ?? "Novo"}
                className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
              >
                <option>Novo</option>
                <option>Contato feito</option>
                <option>Proposta enviada</option>
                <option>Fechado</option>
                <option>Perdido</option>
              </select>

              <textarea
                name="notes"
                placeholder="Observações"
                defaultValue={editingLead?.notes}
                className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingLead(null);
                    setShowForm(false);
                  }}
                  className="px-3 py-2 text-xs rounded border border-zinc-600"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 text-xs rounded bg-blue-600"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
