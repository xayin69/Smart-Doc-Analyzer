import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import "../styles/profile-setup.css";

type SexOption = "male" | "female" | "";

export default function ProfileSetupPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const email = useMemo(() => params.get("email")?.trim() ?? "", [params]);

  const [profileImage, setProfileImage] = useState<string>("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [sex, setSex] = useState<SexOption>("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [country, setCountry] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfileImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Missing signup email. Please sign up again.");
      return;
    }

    try {
      setSaving(true);
      await api.post("/profile/setup", {
        email,
        first_name: firstName || null,
        last_name: lastName || null,
        bio: bio || null,
        sex: sex || null,
        date_of_birth: dateOfBirth || null,
        country: country || null,
        profile_image: profileImage || null,
      });
      navigate("/");
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Could not save profile setup.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="psu-root">
      <div className="psu-bg">
        <div className="psu-bg__orb psu-bg__orb--1" />
        <div className="psu-bg__orb psu-bg__orb--2" />
        <div className="psu-bg__orb psu-bg__orb--3" />
        <div className="psu-bg__grid" />
      </div>

      <div className="psu-shell">
        <div className="psu-glow" />

        <div className="psu-card">
          <div className="psu-header">
            <div className="psu-header__icon" aria-hidden="true">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h1 className="psu-header__title">Welcome!</h1>
            <p className="psu-header__sub">Let's set up your profile (all optional)</p>
          </div>

          <div className="psu-divider" />

          <form onSubmit={handleSubmit} className="psu-form">
            <div className="psu-avatar-section">
              <div className="psu-avatar-ring">
                <label htmlFor="psu-profile-image" className="psu-avatar">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile preview"
                      className="psu-avatar__img"
                    />
                  ) : (
                    <svg
                      className="psu-avatar__placeholder"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}

                  <div className="psu-avatar__overlay" aria-hidden="true">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </label>
              </div>

              <label htmlFor="psu-profile-image" className="psu-upload-btn">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Upload Photo
              </label>

              <input
                id="psu-profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            <div className="psu-row">
              <div className="psu-field">
                <label className="psu-label" htmlFor="psu-first-name">
                  First Name
                </label>
                <input
                  id="psu-first-name"
                  className="psu-input"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className="psu-field">
                <label className="psu-label" htmlFor="psu-last-name">
                  Last Name
                </label>
                <input
                  id="psu-last-name"
                  className="psu-input"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="psu-field">
              <label className="psu-label psu-label--between" htmlFor="psu-bio">
                <span>About You</span>
                <span className="psu-label__count">{bio.length}/100</span>
              </label>
              <textarea
                id="psu-bio"
                className="psu-textarea"
                placeholder="Tell us about yourself..."
                maxLength={100}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
              />
            </div>

            <div className="psu-field">
              <span className="psu-label">Gender</span>
              <div className="psu-gender">
                <label
                  className={`psu-gender__btn ${sex === "male" ? "psu-gender__btn--male" : ""}`}
                >
                  <input
                    type="radio"
                    name="sex"
                    checked={sex === "male"}
                    onChange={() => setSex("male")}
                    className="hidden"
                  />
                  <svg fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                  </svg>
                  Male
                </label>

                <label
                  className={`psu-gender__btn ${sex === "female" ? "psu-gender__btn--female" : ""}`}
                >
                  <input
                    type="radio"
                    name="sex"
                    checked={sex === "female"}
                    onChange={() => setSex("female")}
                    className="hidden"
                  />
                  <svg fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                  </svg>
                  Female
                </label>
              </div>
            </div>

            <div className="psu-row">
              <div className="psu-field">
                <label className="psu-label" htmlFor="psu-date-of-birth">
                  Date of Birth
                </label>
                <input
                  id="psu-date-of-birth"
                  type="date"
                  className="psu-input"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </div>

              <div className="psu-field">
                <label className="psu-label" htmlFor="psu-country">
                  Country
                </label>
                <input
                  id="psu-country"
                  className="psu-input"
                  placeholder="United States"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="psu-error">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="psu-actions">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="psu-btn-skip"
              >
                Skip for now
              </button>

              <div className="psu-submit-wrap">
                <div className="psu-submit-glow" />
                <button
                  type="submit"
                  disabled={saving}
                  className="psu-btn-submit"
                >
                  {saving ? (
                    <>
                      <span className="psu-spinner" />
                      Saving...
                    </>
                  ) : (
                    "Complete Setup"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="psu-particles" aria-hidden="true">
        <span className="psu-particle psu-particle--1" />
        <span className="psu-particle psu-particle--2" />
        <span className="psu-particle psu-particle--3" />
      </div>
    </div>
  );
}
