import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";

export type Medication = {
  id: string;
  title: string;
  dose?: string;
  startDate: string;
  days?: string;
  interval?: string;
  color?: string;
  iconId: string;
  status?: "pending" | "taken" | "missed";
};

type MedicinesContextType = {
  medicines: Medication[];
  setMedicines: React.Dispatch<React.SetStateAction<Medication[]>>;
  loadMedicines: () => void;
};

export const MedicinesContext = createContext<MedicinesContextType>({
  medicines: [],
  setMedicines: () => {},
  loadMedicines: () => {},
});

export const MedicinesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [medicines, setMedicines] = useState<Medication[]>([]);

  const loadMedicines = async () => {
    try {
      const saved = await AsyncStorage.getItem("medicines");
      if (!saved) return;
      const meds: Medication[] = JSON.parse(saved);

      setMedicines(meds);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadMedicines();
  }, []);

  return (
    <MedicinesContext.Provider value={{ medicines, setMedicines, loadMedicines }}>
      {children}
    </MedicinesContext.Provider>
  );
};
