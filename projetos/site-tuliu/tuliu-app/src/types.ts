export interface KanbanColumn {
  id: string;
  name: string;
  order_index: number;
  created_at: string;
}

export interface KanbanCard {
  id: string;
  column_id: string;
  client_id: string;
  title: string;
  description?: string;
  category_tag?: string;
  due_date?: string;
  assignee?: string;
  order_index: number;
  archived_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CardComment {
  id: string;
  card_id: string;
  client_id: string;
  content: string;
  author_name: string;
  author_role: 'client' | 'admin';
  created_at: string;
}
