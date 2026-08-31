import "./AppLayout.css";

interface Props {
  children: React.ReactNode;
}

export default function AppLayout({ children }: Props) {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>Spotify AutoEQ</h2>

        <nav>
          <button className="active">Dashboard</button>
          <button>Presets</button>
          <button>Library</button>
          <button>Settings</button>
        </nav>

        <div className="version">v0.1.0</div>
      </aside>

      <section className="content">{children}</section>
    </div>
  );
}
