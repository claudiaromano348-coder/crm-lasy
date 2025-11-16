"use client";

import { useState, useMemo, ChangeEvent } from "react";
import type { Lead } from "@/lib/leads";
import type {
  createLeadAction as CreateFn,
  updateLeadAction as UpdateFn,
  deleteLeadAction as DeleteFn,
} from "@/lib/leads";

import LeadStats from "./components/LeadStats";
import LeadChart from "./components/LeadChart";
import LeadSearch from "./components/LeadSearch";
import LeadStatusFilters from "./components/LeadStatusFilters";
import LeadList from "./components/LeadList";
import LeadDetails from "./components/LeadDetails";
import LeadFormModal from "./components/LeadFormModal";

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
  createLeadAction: typeof CreateFn;
  updateLeadAction: typeof UpdateFn;
  deleteLeadAction: typeof DeleteFn;
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

  const handleSearchFieldChange = (field: "name" | "email" | "phone") => {
    setSearchField(field);
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
          (lead.phone ?? "")
            .replace(/\D/g, "")
            .includes(term.replace(/\D/g, "")));

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
              type="button"
              onClick={() => setShowSearch((p) => !p)}
              className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-zinc-600 bg-zinc-900/60 hover:border-zinc-300"
            >
              🔍 Fazer busca
            </button>

            <button
              type="button"
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
          <LeadStats stats={stats} />
          <LeadChart data={stageChartData} />
        </section>

        <main className="grid grid-cols-1 md:grid-cols-[1.1fr,1.4fr] gap-6">
          {/* COLUNA ESQUERDA */}
          <section className="space-y-4">
            <LeadSearch
              showSearch={showSearch}
              searchField={searchField}
              searchTerm={searchTerm}
              onSearchFieldChange={handleSearchFieldChange}
              onSearchTermChange={(v) => setSearchTerm(v)}
              placeholder={searchPlaceholder}
            />

            <LeadStatusFilters
              statusFilter={statusFilter}
              onChangeStatus={setStatusFilter}
            />

            <LeadList
              leads={filteredLeads}
              selectedLead={selectedLead}
              onSelectLead={setSelectedLead}
              getStatusBadgeClasses={getStatusBadgeClasses}
            />
          </section>

          {/* COLUNA DIREITA */}
          <section className="bg-zinc-900/80 border border-zinc-700 rounded-xl p-5 min-h-[260px]">
            <LeadDetails
              selectedLead={selectedLead}
              onEdit={(lead) => {
                setEditingLead(lead);
                setShowForm(true);
              }}
              onClear={() => setSelectedLead(null)}
              deleteLeadAction={deleteLeadAction}
              getStatusBadgeClasses={getStatusBadgeClasses}
            />
          </section>
        </main>
      </div>

      {/* MODAL */}
      <LeadFormModal
        showForm={showForm}
        editingLead={editingLead}
        onClose={() => {
          setEditingLead(null);
          setShowForm(false);
        }}
        createLeadAction={createLeadAction}
        updateLeadAction={updateLeadAction}
      />
    </div>
  );
}
