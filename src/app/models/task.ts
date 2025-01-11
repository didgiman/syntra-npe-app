export interface Task {
  // Task object as it is used in the Angular application
  id: number;
  created_at: Date | null;
  user_id: number;
  title: string;
  feeling: number | string;
  estimate: number;
  deadline: Date | null;
  started_at: Date | null;
  ended_at: Date | null;
}

export interface RawTask {
  // Task object as it is recieved from and expected by the API
  id: number;
  created_at: string;
  user_id: number;
  title: string;
  feeling: number;
  estimate: number;
  deadline: string;
  started_at: string;
  ended_at: string;
}
