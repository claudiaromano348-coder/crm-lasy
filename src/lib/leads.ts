"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient(url, key);
}

export type Lead = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  source: string | null;
  stage: string | null;
  notes: string | null;
  created_at: string;
};

export async function getLeads(): Promise<Lead[]> {
  const supabase = getClient();

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar leads:", error);
    return [];
  }

  return (data as Lead[]) ?? [];
}

export async function createLeadAction(formData: FormData) {
  const supabase = getClient();

  const lead = {
    name: (formData.get("name") || "").toString(),
    email: (formData.get("email") || null) as string | null,
    phone: (formData.get("phone") || null) as string | null,
    company: (formData.get("company") || null) as string | null,
    source: (formData.get("source") || null) as string | null,
    stage: (formData.get("stage") || "Novo") as string,
    notes: (formData.get("notes") || null) as string | null,
  };

  if (!lead.name) {
    console.error("Nome é obrigatório");
    return;
  }

  const { error } = await supabase.from("leads").insert(lead);

  if (error) {
    console.error("Erro ao criar lead:", error);
  }

  revalidatePath("/app");
}

export async function updateLeadAction(formData: FormData) {
  const supabase = getClient();

  const id = formData.get("id")?.toString();
  if (!id) {
    console.error("ID do lead não informado");
    return;
  }

  const lead = {
    name: (formData.get("name") || "").toString(),
    email: (formData.get("email") || null) as string | null,
    phone: (formData.get("phone") || null) as string | null,
    company: (formData.get("company") || null) as string | null,
    source: (formData.get("source") || null) as string | null,
    stage: (formData.get("stage") || "Novo") as string,
    notes: (formData.get("notes") || null) as string | null,
  };

  if (!lead.name) {
    console.error("Nome é obrigatório");
    return;
  }

  const { error } = await supabase
    .from("leads")
    .update(lead)
    .eq("id", id);

  if (error) {
    console.error("Erro ao atualizar lead:", error);
  }

  revalidatePath("/app");
}

export async function deleteLeadAction(formData: FormData) {
  const supabase = getClient();

  const id = formData.get("id")?.toString();
  if (!id) {
    console.error("ID do lead não informado");
    return;
  }

  const { error } = await supabase.from("leads").delete().eq("id", id);

  if (error) {
    console.error("Erro ao deletar lead:", error);
  }

  revalidatePath("/app");
}
