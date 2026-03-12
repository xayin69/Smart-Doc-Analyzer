import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

import { useAuthStore } from "../../store/authStore";
import { useModelStore } from "../../store/modelStore";
import api from "../../api/axios";
import type { UserProfile } from "../../types/profile";

const MODEL_DESCRIPTIONS: Record<string, string> = {
  "kwangsuklee/gemma-3-12b-it-Q4_K_M:latest":
    "Swiss Army Knife for high-end consumer hardware. A 12B multimodal model optimized with 4-bit Q4_K_M quantization for local efficiency.\n\nWhat it can do:\n- High-resolution visual parsing up to 896x896 (great for OCR and dense document details).\n- Unified multimodal reasoning (text + images in one reasoning stream).\n- Large 128k context for long manuals/books.\n- Runs locally around ~8GB VRAM class setups with strong quality.",
  "gpt-oss:120b-cloud":
    "Heavyweight reasoning engine using MoE architecture (117B total params, ~5B active per request).\n\nWhat it can do:\n- Adjustable reasoning effort (low/medium/high) for deeper chain-of-thought style reasoning.\n- Strong function-calling/tool orchestration for agent workflows.\n- High-throughput cloud stability for RAG and long-context synthesis.\n- Open-weight deployment model suited for private cloud data control.",
  "qwen3-vl:8b":
    "Advanced compact vision-agent model focused on actionable visual understanding.\n\nWhat it can do:\n- GUI navigation from screenshots/screens.\n- Long video understanding with timestamp-level grounding.\n- Visual-to-code generation (UI screenshot -> HTML/Tailwind/React style output).\n- Better spatial/scene grounding useful for embodied/robotics workflows.",
};

export default function RightPanel() {
  const { user, logout } = useAuthStore();
  const { models, setModels, selectedModel, setSelectedModel } = useModelStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [typedDescription, setTypedDescription] = useState("");
  const navigate = useNavigate();

  const currentDescription = selectedModel
    ? MODEL_DESCRIPTIONS[selectedModel] ??
      "No description available for this model yet."
    : "Select a model to see details.";

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await api.get("/models");
        setModels(res.data);

        if (res.data.length > 0) {
          setSelectedModel(res.data[0].name);
        }
      } catch (err) {
        console.error("Failed to fetch models:", err);
      }
    };

    fetchModels();
  }, [setModels, setSelectedModel]);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await api.get<UserProfile>("/profile/me");
        setProfile(res.data);
      } catch {
        setProfile(null);
      }
    };

    fetchProfile();
  }, [user]);

  useEffect(() => {
    let cursor = 0;
    setTypedDescription("");

    const intervalId = window.setInterval(() => {
      cursor += 3; // fast typewriter speed
      setTypedDescription(currentDescription.slice(0, cursor));

      if (cursor >= currentDescription.length) {
        window.clearInterval(intervalId);
      }
    }, 10);

    return () => window.clearInterval(intervalId);
  }, [currentDescription]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (email: string) => {
    const parts = email.split("@")[0].split(".");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };

  const fullName = `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`.trim();

  return (
    <div className="h-full p-6 flex flex-col gap-6 inter">
      {user ? (
        <div className="flex flex-col items-center pb-6 border-b border-[#30363D]">
          <Link to="/profile" title="View Profile" className="block mb-3">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#238636] to-[#1f6feb] flex items-center justify-center text-white text-2xl font-bold border border-[#30363D] overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-400/60 transition-all duration-200">
              {profile?.profile_image ? (
                <img src={profile.profile_image} alt="User profile" className="w-full h-full object-cover" />
              ) : (
                getInitials(user.email)
              )}
            </div>
          </Link>

          <div className="text-lg text-[#E6EDF3] mb-1 alyamama">{fullName || `User #${user.id}`}</div>
          <div className="text-sm text-[#8B949E] mb-4 inter">{user.email}</div>

          <button
            onClick={handleLogout}
            className="w-full py-2 px-4 bg-[#DA3633] text-white rounded-xl hover:bg-[#F85149] transition"
          >
            Log Out
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 pb-6 border-b border-[#30363D]">
          <Link
            to="/login"
            className="w-full text-center px-4 py-2 rounded-xl bg-[#161B22] border border-[#30363D] text-[#E6EDF3] hover:bg-[#1C2128] transition"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="w-full text-center px-4 py-2 rounded-xl bg-[#1F6FEB] text-white hover:bg-[#388BFD] transition"
          >
            Sign Up
          </Link>
        </div>
      )}

      <div className="pt-4">
        <h3 className="text-[#E6EDF3] mb-3 text-sm tracking-wide alyamama">
        Choose Model
        </h3>

        <div className="relative">
          <select
            value={selectedModel ?? ""}
            onClick={() => setIsModelOpen(true)}
            onMouseDown={() => setIsModelOpen(true)}
            onFocus={() => setIsModelOpen(true)}
            onBlur={() => setIsModelOpen(false)}
            onChange={(e) => {
              setSelectedModel(e.target.value);
              setIsModelOpen(false);
            }}
            className="w-full bg-[#0D1117] border border-[#30363D] rounded-none px-3 py-2 pr-9 text-[#E6EDF3] text-sm focus:outline-none focus:border-[#58A6FF] appearance-none"
          >
            {models.map((model) => (
              <option key={model.name} value={model.name} className="bg-[#0D1117]">
                {model.name}
              </option>
            ))}
          </select>

          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B949E] pointer-events-none">
            {isModelOpen ? (
              <ChevronDown className="w-4 h-4 animate-iconPop" />
            ) : (
              <ChevronUp className="w-4 h-4 animate-iconPop" />
            )}
          </div>
        </div>

        <div className="mt-4">
          <div className="notepad-description">
            <div className="notepad-body text-sm whitespace-pre-line inter">
              <span className="notepad-inline-title alyamama">DESCRIPTION</span>
              {"\n\n"}
              {typedDescription}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
