export default function Layout({ children }) {
  return (
    <div className="layout">
      <header className="layout__header">
        <div className="layout__badge">Clip</div>
        <p className="layout__tagline">Capture, curate, and reuse your favorite snippets.</p>
      </header>
      <main className="layout__content">{children}</main>
      <style jsx>{`
        .layout {
          max-width: 960px;
          margin: 0 auto;
          padding: 64px 24px 80px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .layout__header {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .layout__badge {
          font-size: 40px;
          font-weight: 700;
          letter-spacing: -1px;
        }
        .layout__tagline {
          margin: 0;
          font-size: 18px;
          max-width: 520px;
          color: rgba(226, 232, 240, 0.85);
        }
        .layout__content {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        @media (max-width: 600px) {
          .layout {
            padding-top: 48px;
          }
          .layout__badge {
            font-size: 32px;
          }
          .layout__tagline {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}
