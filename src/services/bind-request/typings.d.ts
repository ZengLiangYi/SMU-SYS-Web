// -------- 绑定请求 --------
export type BindRequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface BindRequestItem {
  id: string;
  patient_id: string;
  doctor_id: string;
  status: BindRequestStatus;
  note: string | null;
  created_at: string;
  responded_at: string | null;
}

export interface BindRequestListParams {
  offset?: number;
  limit?: number;
  status?: BindRequestStatus;
}

export interface BindRequestListResult {
  total: number;
  offset: number;
  limit: number;
  items: BindRequestItem[];
}

export interface BindRequestCreateRequest {
  patient_id: string;
  note?: string | null;
}
