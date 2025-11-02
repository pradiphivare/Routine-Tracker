import { useState, useCallback, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useRealtimeUpdates } from "../hooks/useRealtimeUpdates";

export default function Dashboard() {
  const [habits, setHabits] = useState<any[]>([]);
  const [completions, setCompletions] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    const { data: habitData } = await supabase.from("habits").select("*");
    const { data: completionData } = await supabase.from("habit_completions").select("*");
    setHabits(habitData || []);
    setCompletions(completionData || []);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 👇 Auto-refresh on any database change
  useRealtimeUpdates(fetchData);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-3">Your Habits</h2>
      <ul className="space-y-2">
        {habits.map((h) => (
          <li key={h.id} className="bg-white p-3 rounded shadow">
            {h.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
