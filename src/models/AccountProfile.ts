export interface AccountProfile {
  id: string;
  name: string;
  profile_image_url?: string | null;
  pin_hash?: string | null;
  account_id: string;
}
