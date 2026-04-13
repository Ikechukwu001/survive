import { useState } from "react";
import ChatPanel from "../Components/ChatPanel";
import DashboardLoadingState from "../Components/Dashboard/DashboardLoadingState";
import InstallerDashboardHeader from "../Components/Dashboard/InstallerDashboardHeader";
import InstallerStatsGrid from "../Components/Dashboard/InstallerStatsGrid";
import InstallerInviteCard from "../Components/Dashboard/InstallerInviteCard";
import InstallerDashboardTabs from "../Components/Dashboard/InstallerDashboardTabs";
import { useInstallerDashboardData } from "../hooks/useInstallerDashboardData";

export default function InstallerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedClient, setSelectedClient] = useState(null);

  const {
    loading,
    currentUser,
    logout,
    clients,
    tickets,
    guides,
    inviteCode,
    stats,
    copyInviteCode,
  } = useInstallerDashboardData();

  if (loading) return <DashboardLoadingState />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <InstallerDashboardHeader onLogout={logout} />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <InstallerStatsGrid
          stats={stats}
          onOpenClients={() => setActiveTab("clients")}
          onOpenTickets={() => setActiveTab("tickets")}
          onOpenGuides={() => setActiveTab("guides")}
        />

        <InstallerInviteCard
          inviteCode={inviteCode}
          onCopyInviteCode={copyInviteCode}
        />

        <InstallerDashboardTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          clients={clients}
          tickets={tickets}
          guides={guides}
          installerId={currentUser?.uid}
          onSelectClient={setSelectedClient}
        />
      </div>

      {selectedClient && (
        <ChatPanel
          recipientId={selectedClient.id}
          recipientName={selectedClient.fullName}
          recipientRole="client"
        />
      )}
    </div>
  );
}