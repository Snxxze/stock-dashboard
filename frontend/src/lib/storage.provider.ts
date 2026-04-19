import type { IStorageService } from "./storage.service";
import { LocalStorageAdapter } from "./storage.local";

// ค่อยมาทำต่อตอนจะไปทำ backend

// ============================================================
// Storage Provider — จุดเดียวที่เลือก adapter
//
// ตอนนี้: ใช้ LocalStorageAdapter
// อนาคต:  import BackendAdapter แล้ว switch ที่นี่ที่เดียว
//
// ตัวอย่างเมื่อมี backend:
//   import { BackendAdapter } from "./storage.backend";
//   const USE_BACKEND = process.env.NEXT_PUBLIC_USE_BACKEND === "true";
//   export const storage: IStorageService = USE_BACKEND
//     ? new BackendAdapter()
//     : new LocalStorageAdapter();
// ============================================================

export const storage: IStorageService = new LocalStorageAdapter();
