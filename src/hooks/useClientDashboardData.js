import { useCallback, useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";

export function useClientDashboardData() {
  const { currentUser, logout } = useAuth();

  const [guides, setGuides] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [installerInfo, setInstallerInfo] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    if (!currentUser?.uid) {
      setLoading(false);
      return;
    }

    try {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setLoading(false);
        return;
      }

      const data = {
        uid: currentUser.uid,
        ...userSnap.data(),
      };

      setUserData(data);

      if (data.installerId) {
        const installerRef = doc(db, "users", data.installerId);
        const installerSnap = await getDoc(installerRef);

        if (installerSnap.exists()) {
          setInstallerInfo(installerSnap.data());
        }
      }
    } catch (error) {
      console.error("Failed to fetch dashboard user data:", error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (!userData?.installerId || !currentUser?.uid) return;

    const guidesQuery = query(
      collection(db, "guides"),
      where("installerId", "==", userData.installerId)
    );

    const ticketsQuery = query(
      collection(db, "tickets"),
      where("clientId", "==", currentUser.uid)
    );

    const unsubscribeGuides = onSnapshot(guidesQuery, (snapshot) => {
      const guidesData = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));
      setGuides(guidesData);
    });

    const unsubscribeTickets = onSnapshot(ticketsQuery, (snapshot) => {
      const ticketsData = snapshot.docs
        .map((item) => ({
          id: item.id,
          ...item.data(),
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setTickets(ticketsData);
    });

    return () => {
      unsubscribeGuides();
      unsubscribeTickets();
    };
  }, [userData?.installerId, currentUser?.uid]);

  return {
    loading,
    userData,
    guides,
    tickets,
    installerInfo,
    logout,
  };
}