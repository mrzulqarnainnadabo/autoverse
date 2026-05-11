import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { Car, MOCK_CARS } from "@/constants/data";

interface ListingsContextValue {
  cars: Car[];
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const ListingsContext = createContext<ListingsContextValue>({
  cars: MOCK_CARS,
  favorites: [],
  toggleFavorite: () => {},
  isFavorite: () => false,
});

const FAVS_KEY = "@autoverse_favs";

export function ListingsProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(FAVS_KEY).then((raw) => {
      if (raw) setFavorites(JSON.parse(raw));
    });
  }, []);

  const toggleFavorite = useCallback(
    (id: string) => {
      setFavorites((prev) => {
        const next = prev.includes(id)
          ? prev.filter((f) => f !== id)
          : [...prev, id];
        AsyncStorage.setItem(FAVS_KEY, JSON.stringify(next));
        return next;
      });
    },
    [],
  );

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites],
  );

  return (
    <ListingsContext.Provider
      value={{ cars: MOCK_CARS, favorites, toggleFavorite, isFavorite }}
    >
      {children}
    </ListingsContext.Provider>
  );
}

export function useListings() {
  return useContext(ListingsContext);
}
