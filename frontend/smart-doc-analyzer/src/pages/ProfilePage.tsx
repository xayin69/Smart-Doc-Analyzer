import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import PublicPageLayout from "../home/PublicPageLayout";
import api from "../api/axios";
import { useAuthStore } from "../store/authStore";
import type { UserProfile, UserProfilePayload } from "../types/profile";
import "../styles/signup-animations.css";

const emptyProfile: UserProfile = {
  email: "",
  first_name: null,
  last_name: null,
  bio: null,
  sex: null,
  date_of_birth: null,
  country: null,
  profile_image: null,
};

export default function ProfilePage() {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>(emptyProfile);
  const [form, setForm] = useState<UserProfilePayload>({
    first_name: null,
    last_name: null,
    bio: null,
    sex: null,
    date_of_birth: null,
    country: null,
    profile_image: null,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  // kept for potential future use
  const _fullName = useMemo(() => {
    const f = form.first_name ?? profile.first_name ?? "";
    const l = form.last_name ?? profile.last_name ?? "";
    return `${f} ${l}`.trim();
  }, [form.first_name, form.last_name, profile.first_name, profile.last_name]);
  void _fullName;

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get<UserProfile>("/profile/me");
        setProfile(res.data);
        setForm({
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          bio: res.data.bio,
          sex: res.data.sex,
          date_of_birth: res.data.date_of_birth,
          country: res.data.country,
          profile_image: res.data.profile_image,
        });
      } catch (err: any) {
        const detail = err?.response?.data?.detail;
        setError(typeof detail === "string" ? detail : "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [isAuthenticated]);

  const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const imageData = reader.result;
      if (typeof imageData === "string") {
        setForm((prev) => ({ ...prev, profile_image: imageData }));
      }
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      setError("");
      const res = await api.put("/profile/me", form);
      setProfile(res.data.profile);
      setEditing(false);
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <PublicPageLayout>
        <main className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
          {/* Beautiful Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
          </div>
          
          {/* Message */}
          <div className="relative z-10 text-center">
            <div className="mb-6 flex justify-center">
              <svg className="w-24 h-24 text-blue-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4 animate-fadeInUp">
              Log in to see your profile!
            </h1>
            <p className="text-gray-400 text-lg">Sign in to view and manage your account</p>
          </div>
        </main>
      </PublicPageLayout>
    );
  }

  return (
    <PublicPageLayout>
      <main className="min-h-screen flex items-center justify-center px-6 py-24 relative overflow-hidden">
        {/* Beautiful Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        </div>
        
        {/* Profile Card */}
        <div className="relative z-10 w-full max-w-[30rem]">
          {/* Bold Glow Border */}
          <div className={`absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl blur-xl opacity-60 transition-opacity duration-300 ${editing ? 'animate-pulse-glow opacity-75' : ''}`}></div>
          
          {/* Card */}
          <div className="relative bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-800">

            {/* Header */}
            <div className="!px-8 !pt-8 !pb-6 border-b border-gray-800/50">
              <div className="flex items-center justify-between">
                <h2 className="!m-0 text-3xl font-bold leading-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Your Profile
                </h2>
                <button
                  onClick={() => setEditing((prev) => !prev)}
                  className={`shrink-0 !px-5 !py-2.5 rounded-xl font-medium leading-none transition-all duration-200 ${
                    editing 
                      ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-500/30" 
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/30"
                  }`}
                >
                  {editing ? "Cancel" : "Edit"}
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="p-16 text-center">
                <svg className="animate-spin h-12 w-12 text-blue-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-400">Loading profile...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="p-4 m-8 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3 animate-shake">
                <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Profile Content */}
            {!loading && (
              <div className="!p-8 space-y-6">

                {/* ── Profile Image Section ── */}
                <div className="flex flex-col items-center gap-4 pb-6 border-b border-gray-800/50">
                  <div className="relative group">
                    <div className={`absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 ${editing ? 'group-hover:opacity-60' : ''} blur transition duration-300`}></div>
                    
                    <div className={`relative w-40 h-40 rounded-full border-4 ${editing ? 'border-blue-500' : 'border-gray-700'} overflow-hidden bg-gray-800 flex items-center justify-center transition-all duration-300 ${editing ? 'cursor-pointer group-hover:scale-105' : ''}`}>
                      {(editing ? form.profile_image : profile.profile_image) ? (
                        <img
                          src={(editing ? form.profile_image : profile.profile_image) ?? ""}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg className="w-20 h-20 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      )}
                      
                      {editing && (
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Change Photo Button — more padding so content doesn't crowd the edges */}
                  <label className={editing ? "cursor-pointer" : "cursor-not-allowed"}>
                    <span
                      style={{ padding: '10px 28px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                      className={`rounded-xl transition-all duration-200 shadow-lg font-semibold text-sm ${
                        editing
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-blue-500/30"
                          : "bg-gray-700/70 text-gray-300 shadow-gray-900/20"
                      }`}
                    >
                      <svg style={{ width: '16px', height: '16px', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Change Photo
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onImageChange}
                      disabled={!editing}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* ── Name Fields ── */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                    <input
                      disabled={!editing}
                      className={`w-full !px-4 !py-3.5 rounded-xl text-base leading-6 text-white placeholder-gray-500 transition-all duration-200 ${
                        editing 
                          ? "bg-gray-800/80 border-2 border-blue-500/50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/20" 
                          : "bg-gray-800/40 border-2 border-gray-700/50 text-gray-300"
                      }`}
                      placeholder="First Name"
                      value={editing ? form.first_name ?? "" : profile.first_name ?? ""}
                      onChange={(e) => setForm((prev) => ({ ...prev, first_name: e.target.value || null }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                    <input
                      disabled={!editing}
                      className={`w-full !px-4 !py-3.5 rounded-xl text-base leading-6 text-white placeholder-gray-500 transition-all duration-200 ${
                        editing 
                          ? "bg-gray-800/80 border-2 border-blue-500/50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/20" 
                          : "bg-gray-800/40 border-2 border-gray-700/50 text-gray-300"
                      }`}
                      placeholder="Last Name"
                      value={editing ? form.last_name ?? "" : profile.last_name ?? ""}
                      onChange={(e) => setForm((prev) => ({ ...prev, last_name: e.target.value || null }))}
                    />
                  </div>
                </div>

                {/* ── Email ── */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                  <div className="flex items-center gap-3 !px-4 !py-3.5 bg-gray-800/40 border-2 border-gray-700/50 rounded-xl">
                    <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="flex-1 text-white truncate">{profile.email || user?.email}</span>
                    <button
                      onClick={() => navigate("/signup")}
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors px-3 py-1 rounded-lg hover:bg-blue-500/10"
                      type="button"
                    >
                      Change
                    </button>
                  </div>
                </div>

                {/* ── Bio ── */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-400">About</label>
                    <span className="text-xs text-gray-500">{(form.bio ?? "").length}/100</span>
                  </div>
                  <textarea
                    disabled={!editing}
                    maxLength={100}
                    className={`w-full !px-4 !py-3.5 rounded-xl text-base leading-6 text-white placeholder-gray-500 transition-all duration-200 resize-none ${
                      editing 
                        ? "bg-gray-800/80 border-2 border-blue-500/50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/20" 
                        : "bg-gray-800/40 border-2 border-gray-700/50 text-gray-300"
                    }`}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    value={editing ? form.bio ?? "" : profile.bio ?? ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value || null }))}
                  />
                </div>

                {/* ── Gender ── */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-3">Gender</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`flex items-center justify-center gap-3 px-5 py-4 rounded-xl border-2 transition-all duration-200 ${
                      !editing 
                        ? "cursor-not-allowed opacity-60" 
                        : "cursor-pointer hover:border-blue-400/50"
                    } ${
                      (editing ? form.sex : profile.sex) === "male" 
                        ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/50" 
                        : "bg-gray-800/40 border-gray-700/50 text-gray-300"
                    }`}>
                      <input
                        type="radio"
                        disabled={!editing}
                        checked={(editing ? form.sex : profile.sex) === "male"}
                        onChange={() => setForm((prev) => ({ ...prev, sex: "male" }))}
                        className="hidden"
                      />
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/>
                      </svg>
                      <span className="font-medium">Male</span>
                    </label>
                    <label className={`flex items-center justify-center gap-3 px-5 py-4 rounded-xl border-2 transition-all duration-200 ${
                      !editing 
                        ? "cursor-not-allowed opacity-60" 
                        : "cursor-pointer hover:border-purple-400/50"
                    } ${
                      (editing ? form.sex : profile.sex) === "female" 
                        ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/50" 
                        : "bg-gray-800/40 border-gray-700/50 text-gray-300"
                    }`}>
                      <input
                        type="radio"
                        disabled={!editing}
                        checked={(editing ? form.sex : profile.sex) === "female"}
                        onChange={() => setForm((prev) => ({ ...prev, sex: "female" }))}
                        className="hidden"
                      />
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/>
                      </svg>
                      <span className="font-medium">Female</span>
                    </label>
                  </div>
                </div>

                {/* ── Birth Date & Country ── */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Birth Date</label>
                    <input
                      type="date"
                      disabled={!editing}
                      className={`w-full !px-4 !py-3.5 rounded-xl text-base leading-6 text-white transition-all duration-200 ${
                        editing 
                          ? "bg-gray-800/80 border-2 border-blue-500/50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/20" 
                          : "bg-gray-800/40 border-2 border-gray-700/50 text-gray-300"
                      }`}
                      value={editing ? form.date_of_birth ?? "" : profile.date_of_birth ?? ""}
                      onChange={(e) => setForm((prev) => ({ ...prev, date_of_birth: e.target.value || null }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Country</label>
                    <input
                      disabled={!editing}
                      className={`w-full !px-4 !py-3.5 rounded-xl text-base leading-6 text-white placeholder-gray-500 transition-all duration-200 ${
                        editing 
                          ? "bg-gray-800/80 border-2 border-blue-500/50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/20" 
                          : "bg-gray-800/40 border-2 border-gray-700/50 text-gray-300"
                      }`}
                      placeholder="Country"
                      value={editing ? form.country ?? "" : profile.country ?? ""}
                      onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value || null }))}
                    />
                  </div>
                </div>

              </div>
            )}

            {/* ── Save Changes — sits OUTSIDE space-y-6, with guaranteed spacing ── */}
            {!loading && editing && (
              <div style={{ padding: '0 2rem 2rem', marginTop: '0.5rem' }}>
                <div style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  paddingTop: '1.5rem',
                }}>
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-60 transition duration-300 group-hover:opacity-100"></div>
                    <button
                      onClick={saveProfile}
                      disabled={saving}
                      style={{ width: '100%' }}
                      className="relative py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                      type="button"
                    >
                      {saving ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving Changes...
                        </span>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>{/* end Card */}
        </div>{/* end profile card wrapper */}
      </main>
    </PublicPageLayout>
  );
}
