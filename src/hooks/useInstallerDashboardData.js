import { useCallback, useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "../Components/ToastProvider";

export function useInstallerDashboardData() {
  const { currentUser, logout } = useAuth();

  const [clients, setClients] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [guides, setGuides] = useState([]);
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClients: 0,
    pendingTickets: 0,
    totalGuides: 0,
  });

  const fetchOrCreateInviteCode = useCallback(async () => {
    if (!currentUser?.uid) return;

    try {
      const codeRef = doc(db, "inviteCodes", currentUser.uid);
      const codeDoc = await getDoc(codeRef);

      if (!codeDoc.exists()) {
        await setDoc(codeRef, {
          installerId: currentUser.uid,
          createdAt: new Date().toISOString(),
        });
      }

      setInviteCode(currentUser.uid);
    } catch (error) {
      console.error("Error with invite code:", error);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser?.uid) return;

    let clientsFirstLoad = true;
    let ticketsFirstLoad = true;

    fetchOrCreateInviteCode();

    const clientsQuery = query(
      collection(db, "users"),
      where("installerId", "==", currentUser.uid),
      where("role", "==", "client")
    );

    const ticketsQuery = query(
      collection(db, "tickets"),
      where("installerId", "==", currentUser.uid)
    );

    const guidesQuery = query(
      collection(db, "guides"),
      where("installerId", "==", currentUser.uid)
    );

    const unsubscribeClients = onSnapshot(clientsQuery, (snapshot) => {
      const clientsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (!clientsFirstLoad) {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const client = change.doc.data();
            toast.success("New Client Joined!", {
              description: `${client.fullName} is now connected`,
              duration: 5000,
            });
          }
        });
      }

      setClients(clientsData);
      setStats((prev) => ({
        ...prev,
        totalClients: clientsData.length,
      }));
      clientsFirstLoad = false;
    });

    const unsubscribeTickets = onSnapshot(ticketsQuery, (snapshot) => {
      const ticketsData = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      if (!ticketsFirstLoad) {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const ticket = change.doc.data();
            toast.info("New Support Ticket!", {
              description: `${ticket.clientName}: ${ticket.title}`,
              duration: 6000,
            });
          }
        });
      }

      setTickets(ticketsData);
      setStats((prev) => ({
        ...prev,
        pendingTickets: ticketsData.filter((t) => t.status === "pending").length,
      }));
      ticketsFirstLoad = false;
    });

    const unsubscribeGuides = onSnapshot(guidesQuery, (snapshot) => {
      const guidesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setGuides(guidesData);
      setStats((prev) => ({
        ...prev,
        totalGuides: guidesData.length,
      }));
    });

    const timer = setTimeout(() => setLoading(false), 1000);

    return () => {
      unsubscribeClients();
      unsubscribeTickets();
      unsubscribeGuides();
      clearTimeout(timer);
    };
  }, [currentUser, fetchOrCreateInviteCode]);

  const copyInviteCode = useCallback(async () => {
    if (!inviteCode) return;

    try {
      await navigator.clipboard.writeText(inviteCode);
      toast.success("Invite code copied!", {
        description: "Share this code with your clients",
      });
    } catch (error) {
      console.error("Failed to copy invite code:", error);
      toast.error("Failed to copy invite code");
    }
  }, [inviteCode]);

  return {
    loading,
    currentUser,
    logout,
    clients,
    tickets,
    guides,
    inviteCode,
    stats,
    copyInviteCode,
  };
}