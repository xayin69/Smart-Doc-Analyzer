import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import { useAuthStore } from "../../store/authStore";
import { useModelStore } from "../../store/modelStore";
import api from "../../api/axios";
import type { UserProfile } from "../../types/profile";
import "./WorkSpacestyles/right-panel.css";

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

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/", { replace: true });
    }
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
    <div className="right-panel-container">
      {user ? (
        <div className="profile-section">
          <Link to="/profile" title="View Profile" className="profile-avatar-link">
            <div className="profile-avatar">
              {profile?.profile_image ? (
                <img src={profile.profile_image} alt="Profile" className="profile-avatar-image" />
              ) : (
                getInitials(user.email)
              )}
            </div>
          </Link>

          <div className="profile-name alyamama">{fullName || `User #${user.id}`}</div>
          <div className="profile-email inter">{user.email}</div>

          <button
            onClick={handleLogout}
            className="profile-logout-btn inter"
          >
            Log Out
          </button>
        </div>
      ) : (
        <div className="auth-buttons">
          <Link
            to="/login"
            className="auth-btn auth-btn-login inter"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="auth-btn auth-btn-signup inter"
          >
            Sign Up
          </Link>
        </div>
      )}

      <div className="model-selector-section">
        <h3 className="model-selector-title alyamama">Choose Model</h3>

        <div className="model-select-wrapper">
          <select
            value={selectedModel ?? ""}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="model-select inter"
          >
            {models.map((model) => (
              <option key={model.name} value={model.name}>
                {model.name}
              </option>
            ))}
          </select>

          <ChevronDown className="model-select-icon" />
        </div>

        <div className="model-description-wrapper">
          <div className="model-description">
            <div className="model-description-body inter">
              <span className="model-description-title alyamama">DESCRIPTION</span>
              {"\n\n"}
              {typedDescription}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
