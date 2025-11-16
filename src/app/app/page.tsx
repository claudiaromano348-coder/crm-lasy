import {
  getLeads,
  createLeadAction,
  updateLeadAction,
  deleteLeadAction,
} from "@/lib/leads";
import LeadsPageClient from "./LeadsPageClient";

export default async function AppPage() {
  const leads = await getLeads();

  return (
    <LeadsPageClient
      leads={leads}
      createLeadAction={createLeadAction}
      updateLeadAction={updateLeadAction}
      deleteLeadAction={deleteLeadAction}
    />
  );
}
