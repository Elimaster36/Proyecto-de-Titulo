export interface Agenda {
  id?: number;
  title: string;
  content: string;
  datetime: string;
  notification?: boolean;
  idToken?: string;
}
