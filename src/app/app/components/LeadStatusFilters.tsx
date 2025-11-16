import React from "react";

type Props = {
  statusFilter: string;
  onChangeStatus: (value: string) => void;
};

const OPTIONS = [
  "Todos",
  "Novo",
  "Contato feito",
  "Proposta enviada",
  "Fechado",
  "Perdido",
];

export default function LeadStatusFilters({ statusFilter, onChangeStatus }: Props) {
  return (
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-3">
      <p className="text-xs text-zinc-400 mb-2">Filtrar por status</p>
      <div className="flex gap-2 text-xs overflow-x-auto">
        {OPTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChangeStatus(s)}
            className={`px-3 py-1 rounded border whitespace-nowrap ${
              statusFilter === s
                ? "bg-blue-600 border-blue-600 text-white"
                : "border-zinc-600 text-zinc-300"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
