export interface AccountProfile {
  id: string;
  name: string;
  profileImageUrl?: string | null;
  pinHash?: string | null;
  accountId: string;
}
