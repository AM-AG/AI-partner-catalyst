import { Theme } from "@/types/types";
import { DarkLight } from "@/services/parameters";

const Partners_List = [
  "Cloud Infrastructure Providers",
  "AI Research Labs",
  "Hardware Acceleration Vendors",
  "Enterprise Data Platforms",
];

export const Partners = ({ theme }: { theme: Theme }) => {
  const isDark = DarkLight(theme);

  return (
    <section className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <p className="text-sm opacity-70 leading-relaxed">
          VOXPACT collaborates with a small group of trusted partners across
          cloud infrastructure, hardware acceleration, and applied AI research.
        </p>
      </div>

      {/* Partner List */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Partners_List.map((partner, index) => (
          <li
            key={partner}
            className={`rounded-xl border p-4 text-sm transition ${
              isDark
                ? "bg-white/5 border-white/10 hover:bg-white/10"
                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono opacity-40">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-medium">{partner}</span>
            </div>
          </li>
        ))}
      </ul>

      {/* Contact */}
      <div
        className={`rounded-xl border p-4 text-sm ${
          isDark
            ? "bg-white/5 border-white/10"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        <p className="opacity-70">
          Interested in partnering with VOXPACT?
        </p>
        <p className="mt-1 font-mono">
          Contact:{" "}
          <span
            className={isDark ? "text-[#66FCF1]" : "text-[#007AFF]"}
          >
            partners@voxpact.local
          </span>
        </p>
      </div>
    </section>
  );
};
