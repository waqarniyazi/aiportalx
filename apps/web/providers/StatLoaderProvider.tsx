"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
//port type { LoadTinybirdEmailsResponse } from "@/app/api/user/stats/tinybird/load/route";
//port type { LoadTinybirdEmailsBody } from "@/app/api/user/stats/tinybird/load/validation";
import { toastError, toastSuccess } from "@/components/Toast";
//port { postRequest } from "@/utils/api";
import { isError } from "@/utils/error";

type Context = {
  isLoading: boolean;
  onLoad: (options: {
    loadBefore: boolean;
    showToast: boolean;
  }) => Promise<void>;
};

const StatLoaderContext = createContext<Context>({
  isLoading: false,
  onLoad: async () => {},
});

export const useStatLoader = () => useContext(StatLoaderContext);

class StatLoader {
  #isLoading = false;

  async loadStats(options: { loadBefore: boolean; showToast: boolean }) {
    if (this.#isLoading) return;

    this.#isLoading = true;

    //nst res = await postRequest<
     //oadTinybirdEmailsResponse,
     //oadTinybirdEmailsBody
   //("/api/user/stats/tinybird/load", {
      loadBefore: options.loadBefore,
   //);

    // (options.showToast) {
     //f (isError(res)) {
        toastError({ description: "Error loading stats." });
     // else {
        toastSuccess({ description: "Stats loaded!" });
      }
    }

    //is.#isLoading = false;
  //
//

const statLoader = new StatLoader();

export function StatLoaderProvider(props: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  const onLoad = useCallback(
    async (options: { loadBefore: boolean; showToast: boolean }) => {
      setIsLoading(true);
      await statLoader.loadStats(options);
      setIsLoading(false);
    },
    [],
  );

  return (
    <StatLoaderContext.Provider value={{ isLoading, onLoad }}>
      {props.children}
    </StatLoaderContext.Provider>
  );
}

export function LoadStats(props: { loadBefore: boolean; showToast: boolean }) {
  const { onLoad } = useStatLoader();

  useEffect(() => {
    onLoad(props);
  }, [onLoad, props]);

  return null;
}
