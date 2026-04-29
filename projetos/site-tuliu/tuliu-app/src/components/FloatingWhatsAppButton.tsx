export default function FloatingWhatsAppButton() {
  const whatsappUrl = 'https://wa.me/554840426597';

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-whatsapp-btn"
      aria-label="Chat no WhatsApp"
      title="Chat no WhatsApp"
    >
      <i className="fab fa-whatsapp"></i>
    </a>
  );
}
