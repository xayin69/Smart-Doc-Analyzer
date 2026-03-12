export interface UserProfile {
  email: string;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  sex: "male" | "female" | null;
  date_of_birth: string | null;
  country: string | null;
  profile_image: string | null;
}

export interface UserProfilePayload {
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  sex: "male" | "female" | null;
  date_of_birth: string | null;
  country: string | null;
  profile_image: string | null;
}
