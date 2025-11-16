import React from "react";
import type { Lead } from "@/lib/leads";
import type { deleteLeadAction as DeleteFn } from "@/lib/leads";

type Props = {
  selectedLead: Lead | null;
  onEdit: (lead: Lead) => void;
  onClear: () => void;
  deleteLeadAction: typeof DeleteFn;
  getStatusBadgeClasses: (stage: string | null | undefined) => string;
};

export default function LeadDetails({
  selectedLead,
  onEdit,
  onClear,
  deleteLeadAction,
  getStatusBadgeClasses,
}: Props) {
  if (!selectedLead) {
    return (
      <p className="text-zinc-500 text-sm">
        Selecione um lead na lista para ver detalhes.
      </p>
    );
  }

  return (
    <>
      <div className="flex justify-between items-start gap-3 mb-3">
        <div>
          <h2 className="text-lg font-semibold">{selectedLead.name}</h2>
          <p className="text-[11px] text-zinc-400">
            Detalhes completos do lead
          </p>
        </div>
        <span
          className={`text-[11px] px-2 py-0.5 rounded-full border ${getStatusBadgeClasses(
            selectedLead.stage
          )}`}
        >
          {selectedLead.stage || "Sem status"}
        </span>
      </div>

      <div className="mt-2 space-y-2 text-sm">
        <p>Email: {selectedLead.email || "-"}</p>
        <p>Telefone: {selectedLead.phone || "-"}</p>
        <p>Empresa: {selectedLead.company || "-"}</p>
        <p>Origem: {selectedLead.source || "-"}</p>
        <p>
          Data:{" "}
          {selectedLead.created_at
            ? new Date(selectedLead.created_at).toLocaleDateString("pt-BR")
            : "-"}
        </p>
        <p>Obs: {selectedLead.notes || "-"}</p>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          type="button"
          onClick={() => onEdit(selectedLead)}
          className="px-3 py-2 text-xs rounded bg-yellow-500 text-black"
        >
          Editar
        </button>

        <form action={deleteLeadAction}>
          <input type="hidden" name="id" value={selectedLead.id} />
          <button
            type="submit"
            className="px-3 py-2 text-xs rounded bg-red-600"
          >
            Excluir
          </button>
        </form>

        <button
          type="button"
          onClick={onClear}
          className="px-3 py-2 text-xs rounded border border-zinc-600"
        >
          Fechar detalhes
        </button>
      </div>
    </>
  );
}
