export type GoogleProfileDto = {
  provider: 'google';
  providerId: string;
  email?: string | null;
  name: string | null;
  picture: string | null;
};
