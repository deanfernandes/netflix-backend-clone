import { startTestServer, stopTestServer } from "./server";
import { mockAccounts, mockMemberships, mockProfiles } from "./mocks";

let baseUrl: string;

beforeAll(async () => {
  const res = await startTestServer();
  baseUrl = res.url;
});

afterAll(async () => {
  await stopTestServer();
});

describe("Accounts Query", () => {
  test("accounts all fields", async () => {
    const query = `
    query {
      accounts {
        email
        createdAt
        id
        mobileNumber
      }
    }
  `;

    const response = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    const { data, errors } = await response.json();

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(data.accounts).toHaveLength(mockAccounts.length);
    expect(data.accounts[0].email).toBe(mockAccounts[0].email);
  });

  describe("field resolvers", () => {
    test("accounts profiles", async () => {
      const query = `
    query {
      accounts {
        id
        profiles {
          id
          name
          profileImageUrl
          hasPin
        }
      }
    }
  `;

      const response = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const { data, errors } = await response.json();

      expect(errors).toBeUndefined();
      expect(data).toBeDefined();
      expect(data.accounts).toBeDefined();
      expect(Array.isArray(data.accounts)).toBe(true);
      expect(data.accounts.length).toBeGreaterThan(0);

      data.accounts.forEach((account: any) => {
        expect(account.id).toBe(
          mockAccounts.find((acc) => acc.id === account.id)?.id
        );
        expect(account.profiles).toBeDefined();
        expect(Array.isArray(account.profiles)).toBe(true);

        account.profiles.forEach((profile: any) => {
          const correspondingProfile = mockProfiles.find(
            (p) => p.id === profile.id && p.accountId === account.id
          );
          expect(correspondingProfile).toBeDefined();
          expect(profile.id).toBe(correspondingProfile?.id);
          expect(profile.name).toBe(correspondingProfile?.name);
          expect(profile.profileImageUrl).toBe(
            correspondingProfile?.profileImageUrl
          );
          expect(typeof profile.hasPin).toBe("boolean");
        });
      });
    });

    test("accounts memberships", async () => {
      const query = `
    query {
      accounts {
        id
        memberships {
          id
          status
          startDate
          endDate
          accountMembershipPrice
          autoRenew
        }
      }
    }
  `;

      const response = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const { data, errors } = await response.json();

      expect(errors).toBeUndefined();
      expect(data).toBeDefined();
      expect(data.accounts).toBeDefined();
      expect(Array.isArray(data.accounts)).toBe(true);
      expect(data.accounts.length).toBeGreaterThan(0);

      data.accounts.forEach((account: any) => {
        expect(account.memberships).toBeDefined();
        expect(Array.isArray(account.memberships)).toBe(true);

        const accountMemberships = mockMemberships.filter(
          (m) => m.accountId === account.id
        );

        expect(account.memberships.length).toBe(accountMemberships.length);

        account.memberships.forEach((membership: any) => {
          const correspondingMembership = accountMemberships.find(
            (m) => m.id === membership.id
          );
          expect(correspondingMembership).not.toBeUndefined();
          if (correspondingMembership) {
            expect(membership.id).toBe(correspondingMembership.id);
            expect(membership.status).toBe(correspondingMembership.status);
            expect(membership.accountMembershipPrice).toBe(
              correspondingMembership.accountMembershipPrice
            );
            expect(membership.startDate).toBe(
              correspondingMembership.startDate
            );
            expect(membership.endDate).toBe(correspondingMembership.endDate);
            expect(membership.autoRenew).toBe(
              correspondingMembership.autoRenew
            );
          }
        });
      });
    });
  });
});
