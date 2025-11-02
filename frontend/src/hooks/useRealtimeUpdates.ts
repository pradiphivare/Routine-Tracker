import { useEffect } from "react";
import { supabase } from "../supabaseClient";

export const useRealtimeUpdates = (onDataChange: () => void) => {
  useEffect(() => {
    const tables = ["habits", "habit_completions", "user_badges", "user_stats"];

    // Create one channel to listen to multiple tables
    const channels = tables.map((table) =>
      supabase
        .channel(`public:${table}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table },
          (payload) => {
            console.log(`[Realtime] ${table} changed:`, payload);
            onDataChange(); // trigger refresh when any table changes
          }
        )
        .subscribe()
    );

    // Cleanup all channels on unmount
    return () => {
      channels.forEach((ch) => supabase.removeChannel(ch));
    };
  }, [onDataChange]);
};
