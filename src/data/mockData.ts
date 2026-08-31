// ============================================================
// Mock Data - Schema theo cơ sở dữ liệu hệ thống học tiếng Việt
// ============================================================

// Schema khớp với bảng nguoi_dung trong MySQL
export interface User {
  id: number
  ten_dang_nhap: string  // tên đăng nhập
  ho_ten: string         // họ tên đầy đủ
  doi_tuong: string      // vai trò / đối tượng (VD: 'Học viên', 'Giáo viên', 'Admin')
}

export interface BaiHoc {
  id: number
  tieu_de: string
  mo_ta: string
  cap_do: 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
  loai_ky_nang: string
  thoi_luong: string
  ngay_tao: string
  trang_thai: 'active' | 'inactive'
}

export interface TuVung {
  id: number
  tu: string
  phien_am: string
  nghia: string
  cap_do: string
  chu_de: string
  vi_du: string
  trang_thai: 'active' | 'inactive'
}

export interface NguPhap {
  id: number
  tieu_de: string
  mo_ta: string
  cap_do: string
  quy_tac: string
  vi_du: string
  trang_thai: 'active' | 'inactive'
}

export interface BaiKiemTra {
  id: number
  tieu_de: string
  loai: string
  thoi_gian: number
  so_cau: number
  diem_dat: number
  cap_do: string
  trang_thai: 'active' | 'inactive'
}

export interface KetQua {
  id: number
  nguoi_dung: string
  bai_kiem_tra: string
  diem: number
  thoi_gian_lam: string
  ngay_thi: string
  ket_qua: 'Đạt' | 'Không đạt'
}

// ===== DATA =====
// Dữ liệu users sẽ được fetch từ API /api/users (bảng nguoi_dung)
// Mảng này chỉ là fallback / placeholder
export const users: User[] = []

export const baiHocList: BaiHoc[] = [
  { id: 1, tieu_de: 'Chào hỏi cơ bản', mo_ta: 'Học cách chào hỏi trong tiếng Việt', cap_do: 'A1', loai_ky_nang: 'Tập đọc', thoi_luong: '20 phút', ngay_tao: '2024-01-10', trang_thai: 'active' },
  { id: 2, tieu_de: 'Viết bảng chữ cái', mo_ta: 'Luyện tập viết các chữ cái tiếng Việt', cap_do: 'A1', loai_ky_nang: 'Tập viết', thoi_luong: '30 phút', ngay_tao: '2024-01-15', trang_thai: 'active' },
  { id: 3, tieu_de: 'Nghe hội thoại hằng ngày', mo_ta: 'Nghe và hiểu các hội thoại đời thường', cap_do: 'A2', loai_ky_nang: 'Nghe hiểu', thoi_luong: '25 phút', ngay_tao: '2024-01-20', trang_thai: 'active' },
  { id: 4, tieu_de: 'Phát âm thanh điệu', mo_ta: 'Luyện phát âm 6 thanh điệu tiếng Việt', cap_do: 'A1', loai_ky_nang: 'Nói', thoi_luong: '35 phút', ngay_tao: '2024-02-01', trang_thai: 'active' },
  { id: 5, tieu_de: 'Từ vựng gia đình', mo_ta: 'Học từ vựng về gia đình và quan hệ họ hàng', cap_do: 'A1', loai_ky_nang: 'Từ vựng', thoi_luong: '20 phút', ngay_tao: '2024-02-10', trang_thai: 'active' },
  { id: 6, tieu_de: 'Câu đơn cơ bản', mo_ta: 'Cấu trúc câu đơn trong tiếng Việt', cap_do: 'A2', loai_ky_nang: 'Ngữ pháp', thoi_luong: '40 phút', ngay_tao: '2024-02-15', trang_thai: 'active' },
  { id: 7, tieu_de: 'Đọc văn bản ngắn', mo_ta: 'Đọc và hiểu các đoạn văn ngắn', cap_do: 'B1', loai_ky_nang: 'Tập đọc', thoi_luong: '30 phút', ngay_tao: '2024-03-01', trang_thai: 'active' },
  { id: 8, tieu_de: 'Viết đoạn văn', mo_ta: 'Luyện tập viết đoạn văn hoàn chỉnh', cap_do: 'B1', loai_ky_nang: 'Tập viết', thoi_luong: '45 phút', ngay_tao: '2024-03-10', trang_thai: 'inactive' },
]

export const tuVungList: TuVung[] = [
  { id: 1, tu: 'xin chào', phien_am: 'xin tʃào', nghia: 'Hello / Hi', cap_do: 'A1', chu_de: 'Chào hỏi', vi_du: 'Xin chào, tôi là Lan.', trang_thai: 'active' },
  { id: 2, tu: 'cảm ơn', phien_am: 'kảm ɤn', nghia: 'Thank you', cap_do: 'A1', chu_de: 'Lịch sự', vi_du: 'Cảm ơn bạn rất nhiều!', trang_thai: 'active' },
  { id: 3, tu: 'gia đình', phien_am: 'za ɗiŋ', nghia: 'Family', cap_do: 'A1', chu_de: 'Gia đình', vi_du: 'Gia đình tôi có 4 người.', trang_thai: 'active' },
  { id: 4, tu: 'học sinh', phien_am: 'hɔk ʂiŋ', nghia: 'Student', cap_do: 'A1', chu_de: 'Trường học', vi_du: 'Em ấy là học sinh giỏi.', trang_thai: 'active' },
  { id: 5, tu: 'thú vị', phien_am: 'tʰú vi', nghia: 'Interesting', cap_do: 'A2', chu_de: 'Cảm xúc', vi_du: 'Bài học này rất thú vị.', trang_thai: 'active' },
  { id: 6, tu: 'công việc', phien_am: 'koŋ viək', nghia: 'Work / Job', cap_do: 'A2', chu_de: 'Nghề nghiệp', vi_du: 'Công việc của anh ấy rất bận.', trang_thai: 'active' },
]

export const nguPhapList: NguPhap[] = [
  { id: 1, tieu_de: 'Câu khẳng định đơn giản', mo_ta: 'Cấu trúc câu khẳng định cơ bản', cap_do: 'A1', quy_tac: 'Chủ ngữ + Vị ngữ + Bổ ngữ', vi_du: 'Tôi học tiếng Việt.', trang_thai: 'active' },
  { id: 2, tieu_de: 'Câu phủ định với "không"', mo_ta: 'Cách phủ định câu trong tiếng Việt', cap_do: 'A1', quy_tac: 'Chủ ngữ + không + Vị ngữ', vi_du: 'Tôi không hiểu.', trang_thai: 'active' },
  { id: 3, tieu_de: 'Câu hỏi với "có...không"', mo_ta: 'Đặt câu hỏi dạng yes/no', cap_do: 'A2', quy_tac: 'Có + Chủ ngữ + Vị ngữ + không?', vi_du: 'Bạn có thích cơm không?', trang_thai: 'active' },
  { id: 4, tieu_de: 'Từ chỉ thời gian', mo_ta: 'Hôm nay, hôm qua, ngày mai...', cap_do: 'A1', quy_tac: 'Thời gian + Chủ ngữ + Vị ngữ', vi_du: 'Hôm nay tôi đi học.', trang_thai: 'active' },
]

export const baiKiemTraList: BaiKiemTra[] = [
  { id: 1, tieu_de: 'Kiểm tra A1 - Bài 1', loai: 'Trắc nghiệm', thoi_gian: 30, so_cau: 20, diem_dat: 60, cap_do: 'A1', trang_thai: 'active' },
  { id: 2, tieu_de: 'Kiểm tra Nghe A2', loai: 'Nghe hiểu', thoi_gian: 45, so_cau: 15, diem_dat: 65, cap_do: 'A2', trang_thai: 'active' },
  { id: 3, tieu_de: 'Kiểm tra Đọc hiểu B1', loai: 'Đọc hiểu', thoi_gian: 60, so_cau: 25, diem_dat: 70, cap_do: 'B1', trang_thai: 'active' },
  { id: 4, tieu_de: 'Bài thi tổng hợp A1-A2', loai: 'Tổng hợp', thoi_gian: 90, so_cau: 40, diem_dat: 60, cap_do: 'A2', trang_thai: 'inactive' },
]

export const ketQuaList: KetQua[] = [
  { id: 1, nguoi_dung: 'Nguyễn Thị Lan', bai_kiem_tra: 'Kiểm tra A1 - Bài 1', diem: 85, thoi_gian_lam: '24 phút', ngay_thi: '2024-04-10', ket_qua: 'Đạt' },
  { id: 2, nguoi_dung: 'Trần Văn Minh', bai_kiem_tra: 'Kiểm tra Nghe A2', diem: 72, thoi_gian_lam: '40 phút', ngay_thi: '2024-04-11', ket_qua: 'Đạt' },
  { id: 3, nguoi_dung: 'Phạm Đức Cường', bai_kiem_tra: 'Kiểm tra A1 - Bài 1', diem: 45, thoi_gian_lam: '28 phút', ngay_thi: '2024-04-12', ket_qua: 'Không đạt' },
  { id: 4, nguoi_dung: 'Hoàng Mai Linh', bai_kiem_tra: 'Kiểm tra Đọc hiểu B1', diem: 90, thoi_gian_lam: '55 phút', ngay_thi: '2024-04-13', ket_qua: 'Đạt' },
  { id: 5, nguoi_dung: 'Đỗ Ngọc Hùng', bai_kiem_tra: 'Bài thi tổng hợp A1-A2', diem: 68, thoi_gian_lam: '85 phút', ngay_thi: '2024-04-14', ket_qua: 'Đạt' },
]

// ===== SIDEBAR MENU =====
export interface SidebarItem {
  id: string
  label: string
  icon: string
  children?: SidebarItem[]
}

export const sidebarMenu: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Tổng quan',
    icon: '📊',
  },
  {
    id: 'users',
    label: 'Người dùng',
    icon: '👥',
  },
  {
    id: 'bai-hoc',
    label: 'Bài học',
    icon: '📚',
    children: [
      { id: 'tap-doc', label: 'Tập đọc', icon: '📖' },
      { id: 'tap-viet', label: 'Tập viết', icon: '✏️' },
      { id: 'nghe-hieu', label: 'Nghe hiểu', icon: '🎧' },
      { id: 'noi', label: 'Nói', icon: '🎤' },
      { id: 'tu-vung', label: 'Từ vựng', icon: '📝' },
      { id: 'ngu-phap', label: 'Ngữ pháp', icon: '📋' },
    ],
  },
  {
    id: 'tu-vung',
    label: 'Từ vựng',
    icon: '🔤',
  },
  {
    id: 'ngu-phap',
    label: 'Ngữ pháp',
    icon: '📋',
  },
  {
    id: 'bai-kiem-tra',
    label: 'Bài kiểm tra',
    icon: '📝',
  },
  {
    id: 'ket-qua',
    label: 'Kết quả',
    icon: '🏆',
  },
]

// ===== STATS =====
export const dashboardStats = [
  { icon: '👥', value: '1,248', label: 'Học viên' },
  { icon: '📚', value: '86', label: 'Bài học' },
  { icon: '🔤', value: '3,540', label: 'Từ vựng' },
  { icon: '📝', value: '24', label: 'Bài kiểm tra' },
  { icon: '🏆', value: '5,621', label: 'Lượt thi' },
  { icon: '📊', value: '78%', label: 'Tỷ lệ đạt' },
]
