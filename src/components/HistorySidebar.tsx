import React from "react";
import { HistoryItem } from "../types";
import { History, Trash2, Clock, Calendar, ChevronRight } from "lucide-react";

interface HistorySidebarProps {
  items: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
  currentActiveId?: string;
}

export default function HistorySidebar({
  items,
  onSelectItem,
  onDeleteItem,
  onClearAll,
  currentActiveId
}: HistorySidebarProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 space-y-6" id="history-sidebar-comp">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-700" />
          <h3 className="text-sm font-bold text-stone-700 tracking-tight">Consultation Log</h3>
        </div>

        {items.length > 0 && (
          <button
            onClick={onClearAll}
            id="btn-clear-all-history"
            className="text-[11px] font-semibold text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-6 px-4 bg-stone-50 rounded-xl border border-dashed border-stone-200">
          <Clock className="w-5 h-5 text-stone-300 mx-auto mb-2" />
          <p className="text-xs text-stone-500 font-medium">No previous consultations</p>
          <p className="text-[10px] text-stone-400 mt-1">Your generated health plans will appear here</p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin">
          {items.map((item) => {
            const isActive = currentActiveId === item.id;
            const date = new Date(item.timestamp);
            const dateStr = date.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            });

            return (
              <div
                key={item.id}
                id={`history-item-${item.id}`}
                className={`group flex items-center justify-between p-3 rounded-xl border transition-all ${
                  isActive
                    ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                    : "bg-stone-50/50 hover:bg-stone-50 border-stone-100 text-stone-600 hover:border-stone-200"
                }`}
              >
                <button
                  onClick={() => onSelectItem(item)}
                  className="flex-1 text-left cursor-pointer mr-2"
                >
                  <p className="text-xs font-bold truncate max-w-[170px] sm:max-w-xs block">
                    {item.plan.disease}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] text-stone-400 mt-1">
                    <Calendar className="w-3 h-3 text-stone-300" />
                    <span>{dateStr}</span>
                  </div>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    id={`btn-delete-${item.id}`}
                    className="p-1.5 text-stone-300 hover:text-red-600 rounded-md hover:bg-white transition-all cursor-pointer opacity-80 group-hover:opacity-100"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onSelectItem(item)}
                    className={`p-1 rounded-md transition-colors ${
                      isActive ? "bg-emerald-100 text-emerald-800" : "text-stone-300 group-hover:text-stone-500"
                    }`}
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
