export interface News {
  id: number;
  title: string;
  description?: string;
  url: string;
  source_id?: string;
  pub_date?: Date;
}
