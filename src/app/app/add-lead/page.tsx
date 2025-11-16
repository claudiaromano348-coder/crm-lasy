"use client";

import { useState } from "react";
import { addLead } from "@/lib/leads";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AddLeadPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    empresa: "",
    origem: "",
    status: "Novo",
    observacoes: "",
  });

  async function handleSubmit(e: any) {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    await addLead({
      ...form,
      user_id: user?.id,
    });

    router.push("/app");
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Adicionar Lead</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">

        {Object.keys(form).map((field) => (
          <input
            key={field}
            required={field === "nome"}
            placeholder={field}
            className="border p-2 rounded"
            value={(form as any)[field]}
            onChange={(e) =>
              setForm({ ...form, [field]: e.target.value })
            }
          />
        ))}

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded"
        >
          Salvar Lead
        </button>
      </form>
    </div>
  );
}
