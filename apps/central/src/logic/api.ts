export const serverUrl = import.meta.env.VITE_SERVER_URL;

export async function getProfileData(): Promise<CentralProfile> {
  return await fetch(`${serverUrl}/api/v1/authentication/profile`).then((v) => {
    if (v.status !== 200) throw new Error("Cannot succeed.");
    return v.json();
  });
}

export type CentralProfile = {
  sub: string;
  name: string;
  picture?: string;
};
