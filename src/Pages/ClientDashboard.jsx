import { useState } from "react";
import DashboardHeader from "../Components/Dashboard/DashboardHeader";
import DashboardLoadingState from "../Components/Dashboard/DashboardLoadingState";
import InstallerProfileCard from "../Components/Dashboard/InstallerProfileCard";
import DashboardStats from "../Components/Dashboard/DashboardStatsGrid";
import DashboardTabs from "../Components/Dashboard/DashboardTabs";
import { useClientDashboardData } from "../hooks/useClientDashboardData";

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const {
    loading,
    userData,
    installerInfo,
    guides,
    tickets,
    currentUser,
    logout,
  } = useClientDashboardData();

  if (loading) return <DashboardLoadingState />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader
        userData={userData}
        onLogout={logout}
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <InstallerProfileCard installerInfo={installerInfo} />

        <DashboardStats
          guides={guides}
          tickets={tickets}
          onOpenAI={() => setActiveTab("ai-assistant")}
        />

        <DashboardTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          guides={guides}
          tickets={tickets}
          installerInfo={installerInfo}
          currentUserId={currentUser?.uid}
          clientName={userData?.fullName}
          installerId={userData?.installerId}
        />
      </div>
    </div>
  );
}