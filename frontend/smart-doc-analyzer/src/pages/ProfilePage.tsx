import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import PublicPageLayout from "../home/PublicPageLayout";
import api from "../api/axios";
import { useAuthStore } from "../store/authStore";
import type { UserProfile, UserProfilePayload } from "../types/profile";
import "../styles/signup-login.css";
import "../styles/ProfilePage.css";

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
  const { isAuthenticated, user, logout } = useAuthStore();
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
        <main className="pp-main">
          <div className="pp-bg">
            <div className="pp-bg__orb pp-bg__orb--1" />
            <div className="pp-bg__orb pp-bg__orb--2" />
            <div className="pp-bg__orb pp-bg__orb--3" />
            <div className="pp-bg__grid" />
            <div className="pp-bg__noise" />
          </div>
          <div className="pp-locked">
            <div className="pp-locked__icon-wrap">
              <svg className="pp-locked__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="pp-locked__title">Sign in to view your profile</h1>
            <p className="pp-locked__sub">Your personal space awaits</p>
          </div>
        </main>
      </PublicPageLayout>
    );
  }

  const displayImage = editing ? form.profile_image : profile.profile_image;
  const displayName = `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() || "Your Name";

  return (
    <PublicPageLayout>
      <main className="pp-main">
        {/* Background */}
        <div className="pp-bg">
          <div className="pp-bg__orb pp-bg__orb--1" />
          <div className="pp-bg__orb pp-bg__orb--2" />
          <div className="pp-bg__orb pp-bg__orb--3" />
          <div className="pp-bg__orb pp-bg__orb--4" />
          <div className="pp-bg__grid" />
          <div className="pp-bg__noise" />
          <div className="pp-bg__scan" />
        </div>

        {/* Card Shell */}
        <div className="pp-shell">
          <div className={`pp-glow ${editing ? "pp-glow--active" : ""}`} />

          <div className="pp-card">

            {/* ── Hero Banner ── */}
            <div className="pp-hero">
              <div className="pp-hero__gradient" />
              <div className="pp-hero__dots" />

              {/* Status chip top-right */}
              <div className="pp-hero__chips">
                <span className={`pp-chip ${editing ? "pp-chip--editing" : "pp-chip--view"}`}>
                  <span className="pp-chip__dot" />
                  {editing ? "Editing" : "Viewing"}
                </span>
              </div>

              {/* Avatar — overlapping the hero */}
              <div className="pp-avatar-wrap">
                <div className={`pp-avatar-ring ${editing ? "pp-avatar-ring--edit" : ""}`}>
                  <div className="pp-avatar">
                    {displayImage ? (
                      <img src={displayImage} alt="Profile" className="pp-avatar__img" />
                    ) : (
                      <svg className="pp-avatar__placeholder" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    )}
                    {editing && (
                      <label className="pp-avatar__overlay" htmlFor="pp-photo-input">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Change</span>
                        <input id="pp-photo-input" type="file" accept="image/*" onChange={onImageChange} disabled={!editing} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>
                {!editing && (
                  <div className="pp-avatar__name">{displayName}</div>
                )}
                {!editing && profile.email && (
                  <div className="pp-avatar__email">{profile.email}</div>
                )}
              </div>
            </div>

            {/* ── Header Row ── */}
            <div className="pp-header">
              <div className="pp-header__left">
                <h2 className="pp-header__title">Your Profile</h2>
                <p className="pp-header__sub">Manage your personal information</p>
              </div>
              <div className="pp-header__actions">
                <button
                  onClick={() => setEditing((prev) => !prev)}
                  className={`pp-btn-toggle ${editing ? "pp-btn-toggle--cancel" : "pp-btn-toggle--edit"}`}
                  type="button"
                >
                  {editing ? (
                    <>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </>
                  ) : (
                    <>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Profile
                    </>
                  )}
                </button>
                {!editing && (
                  <button
                    onClick={() => { logout(); navigate("/login"); }}
                    className="pp-btn-logout"
                    type="button"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Log Out
                  </button>
                )}
              </div>
            </div>

            {/* ── Divider ── */}
            <div className="pp-divider" />

            {/* ── Loading ── */}
            {loading && (
              <div className="pp-loading">
                <div className="pp-spinner" />
                <span>Loading profile...</span>
              </div>
            )}

            {/* ── Error ── */}
            {error && (
              <div className="pp-error animate-shake">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* ── Form Body ── */}
            {!loading && (
              <div className="pp-body">

                {/* Name Row */}
                <div className="pp-row pp-row--2col">
                  <div className="pp-field">
                    <label className="pp-label">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      First Name
                    </label>
                    <input
                      disabled={!editing}
                      className={`pp-input ${editing ? "pp-input--active" : "pp-input--static"}`}
                      placeholder="First Name"
                      value={editing ? form.first_name ?? "" : profile.first_name ?? ""}
                      onChange={(e) => setForm((prev) => ({ ...prev, first_name: e.target.value || null }))}
                    />
                  </div>
                  <div className="pp-field">
                    <label className="pp-label">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Last Name
                    </label>
                    <input
                      disabled={!editing}
                      className={`pp-input ${editing ? "pp-input--active" : "pp-input--static"}`}
                      placeholder="Last Name"
                      value={editing ? form.last_name ?? "" : profile.last_name ?? ""}
                      onChange={(e) => setForm((prev) => ({ ...prev, last_name: e.target.value || null }))}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="pp-field">
                  <label className="pp-label">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email Address
                  </label>
                  <div className="pp-email-row">
                    <div className="pp-input pp-input--static pp-email-row__val">
                      {profile.email || user?.email}
                    </div>
                    <button
                      onClick={() => navigate("/signup")}
                      className="pp-btn-change"
                      type="button"
                    >
                      Change
                    </button>
                  </div>
                </div>

                {/* Bio */}
                <div className="pp-field">
                  <label className="pp-label pp-label--between">
                    <span className="pp-label__left">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                      About
                    </span>
                    <span className="pp-label__count">{(editing ? form.bio ?? "" : profile.bio ?? "").length}/100</span>
                  </label>
                  <textarea
                    disabled={!editing}
                    maxLength={100}
                    className={`pp-textarea ${editing ? "pp-input--active" : "pp-input--static"}`}
                    placeholder="Tell us about yourself..."
                    rows={3}
                    value={editing ? form.bio ?? "" : profile.bio ?? ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value || null }))}
                  />
                </div>

                {/* Gender */}
                <div className="pp-field">
                  <label className="pp-label">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Gender
                  </label>
                  <div className="pp-gender">
                    <label className={`pp-gender__btn ${(editing ? form.sex : profile.sex) === "male" ? "pp-gender__btn--male-active" : ""} ${!editing ? "pp-gender__btn--disabled" : ""}`}>
                      <input
                        type="radio"
                        disabled={!editing}
                        checked={(editing ? form.sex : profile.sex) === "male"}
                        onChange={() => setForm((prev) => ({ ...prev, sex: "male" }))}
                        className="hidden"
                      />
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Male
                    </label>
                    <label className={`pp-gender__btn ${(editing ? form.sex : profile.sex) === "female" ? "pp-gender__btn--female-active" : ""} ${!editing ? "pp-gender__btn--disabled" : ""}`}>
                      <input
                        type="radio"
                        disabled={!editing}
                        checked={(editing ? form.sex : profile.sex) === "female"}
                        onChange={() => setForm((prev) => ({ ...prev, sex: "female" }))}
                        className="hidden"
                      />
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Female
                    </label>
                  </div>
                </div>

                {/* Birth Date & Country */}
                <div className="pp-row pp-row--2col">
                  <div className="pp-field">
                    <label className="pp-label">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Birth Date
                    </label>
                    <input
                      type="date"
                      disabled={!editing}
                      className={`pp-input ${editing ? "pp-input--active" : "pp-input--static"}`}
                      value={editing ? form.date_of_birth ?? "" : profile.date_of_birth ?? ""}
                      onChange={(e) => setForm((prev) => ({ ...prev, date_of_birth: e.target.value || null }))}
                    />
                  </div>
                  <div className="pp-field">
                    <label className="pp-label">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Country
                    </label>
                    <input
                      disabled={!editing}
                      className={`pp-input ${editing ? "pp-input--active" : "pp-input--static"}`}
                      placeholder="Country"
                      value={editing ? form.country ?? "" : profile.country ?? ""}
                      onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value || null }))}
                    />
                  </div>
                </div>

              </div>
            )}

            {/* ── Save Footer ── */}
            {!loading && editing && (
              <div className="pp-footer">
                <div className="pp-footer__inner">
                  <div className="pp-save-wrap">
                    <div className="pp-save-glow" />
                    <button
                      onClick={saveProfile}
                      disabled={saving}
                      className="pp-btn-save"
                      type="button"
                    >
                      {saving ? (
                        <>
                          <div className="pp-spinner pp-spinner--sm" />
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>{/* end pp-card */}
        </div>{/* end pp-shell */}
      </main>
    </PublicPageLayout>
  );
}
