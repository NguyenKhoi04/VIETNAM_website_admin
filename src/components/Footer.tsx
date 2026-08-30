export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <span className="footer-name">🇻🇳 Vietnam Language Learning</span>
        <span className="footer-address">Số 06, Trần Văn Ơn, Phường Phú Lợi, Thành phố Hồ Chí Minh</span>
      </div>

      <nav className="footer-nav">
        <span className="footer-link" id="footer-help">Trợ giúp</span>
        <span className="footer-link" id="footer-contact">Liên hệ</span>
        <span className="footer-link" id="footer-terms">Điều khoản</span>
        <span className="footer-link" id="footer-privacy">Bảo mật</span>
      </nav>

      <div className="footer-copy">
        © 2026 Vietnam Admin. All rights reserved.
      </div>
    </footer>
  )
}
