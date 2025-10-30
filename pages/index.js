import { useEffect, useMemo, useRef, useState } from "react";
import Layout from "@/components/Layout";
import ClipCard from "@/components/ClipCard";
import { loadClips, saveClips } from "@/lib/storage";

const TAGS = ["Idea", "Code", "Meeting", "Personal", "Draft"];

export default function Home() {
  const [clips, setClips] = useState([]);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("All");
  const [statusMessage, setStatusMessage] = useState("");
  const [selectedClip, setSelectedClip] = useState(null);
  const contentRef = useRef(null);
  const tagRef = useRef(null);

  useEffect(() => {
    setClips(loadClips());
  }, []);

  useEffect(() => {
    saveClips(clips);
  }, [clips]);

  useEffect(() => {
    if (!statusMessage) return;
    const timeout = setTimeout(() => setStatusMessage(""), 2500);
    return () => clearTimeout(timeout);
  }, [statusMessage]);

  const filteredClips = useMemo(() => {
    const lowerSearch = search.trim().toLowerCase();
    return clips.filter((clip) => {
      const matchesTag = tagFilter === "All" || clip.tag === tagFilter;
      const matchesSearch =
        !lowerSearch ||
        clip.content.toLowerCase().includes(lowerSearch) ||
        (clip.tag || "").toLowerCase().includes(lowerSearch);
      return matchesTag && matchesSearch;
    });
  }, [clips, search, tagFilter]);

  function handleCreateClip(event) {
    event.preventDefault();
    const content = contentRef.current?.value.trim();
    const tag = tagRef.current?.value.trim();
    if (!content) {
      setStatusMessage("Add some content before saving.");
      return;
    }
    const now = new Date().toISOString();
    const newClip = {
      id: crypto.randomUUID(),
      content,
      tag: tag || null,
      createdAt: now,
      updatedAt: now
    };
    setClips((prev) => [newClip, ...prev]);
    setStatusMessage("Clip saved.");
    if (contentRef.current) contentRef.current.value = "";
    if (tagRef.current) tagRef.current.value = "";
  }

  async function handleCopyClip(clip) {
    try {
      await navigator.clipboard.writeText(clip.content);
      setStatusMessage("Copied to clipboard.");
      setSelectedClip(clip.id);
    } catch (error) {
      console.error(error);
      setStatusMessage("Clipboard access denied.");
    }
  }

  function handleDeleteClip(id) {
    setClips((prev) => prev.filter((clip) => clip.id !== id));
    setStatusMessage("Clip removed.");
  }

  function handleUpdateClip(nextClip) {
    setClips((prev) => prev.map((clip) => (clip.id === nextClip.id ? nextClip : clip)));
    setStatusMessage("Clip updated.");
  }

  return (
    <Layout>
      <section className="composer">
        <div className="composer__header">
          <h2>Quick Capture</h2>
          <p>Drop in snippets, commands, quotes, anything worth keeping at hand.</p>
        </div>
        <form className="composer__form" onSubmit={handleCreateClip}>
          <textarea ref={contentRef} placeholder="Write or paste something worth keeping…" />
          <div className="composer__controls">
            <div className="composer__tag">
              <label htmlFor="tag">Tag</label>
              <input id="tag" ref={tagRef} list="clip-tags" placeholder="Optional" />
              <datalist id="clip-tags">
                {TAGS.map((tag) => (
                  <option key={tag} value={tag} />
                ))}
              </datalist>
            </div>
            <button type="submit">Save Clip</button>
          </div>
        </form>
        {statusMessage ? <div className="composer__status">{statusMessage}</div> : null}
      </section>

      <section className="filters">
        <div className="filters__search">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            placeholder="Search clips by content or tag"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="filters__tags">
          {["All", ...TAGS].map((tag) => (
            <button
              key={tag}
              className={`filters__tag ${tagFilter === tag ? "filters__tag--active" : ""}`}
              onClick={() => setTagFilter(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      <section className="grid">
        {filteredClips.length ? (
          filteredClips.map((clip) => (
            <ClipCard
              key={clip.id}
              clip={clip}
              onCopy={handleCopyClip}
              onDelete={handleDeleteClip}
              onUpdate={handleUpdateClip}
              isActive={clip.id === selectedClip}
            />
          ))
        ) : (
          <div className="grid__empty">
            <h3>No clips yet</h3>
            <p>Add your first snippet using the form above. Everything stays local to your browser.</p>
          </div>
        )}
      </section>

      <style jsx>{`
        .composer {
          background: rgba(15, 23, 42, 0.75);
          border: 1px solid rgba(148, 163, 184, 0.22);
          border-radius: 24px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .composer__header h2 {
          margin: 0;
          font-size: 24px;
        }
        .composer__header p {
          margin: 8px 0 0;
          color: rgba(148, 163, 184, 0.8);
        }
        .composer__form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .composer__form textarea {
          min-height: 160px;
          border-radius: 16px;
          padding: 18px;
          font-size: 16px;
          border: 1px solid rgba(148, 163, 184, 0.3);
          background: rgba(2, 6, 23, 0.9);
          color: #e2e8f0;
          resize: vertical;
        }
        .composer__form textarea:focus {
          outline: none;
          border-color: rgba(34, 211, 238, 0.6);
        }
        .composer__controls {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          align-items: flex-end;
        }
        .composer__tag {
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-width: 180px;
        }
        .composer__tag label {
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: rgba(148, 163, 184, 0.75);
        }
        .composer__tag input {
          border-radius: 12px;
          border: 1px solid rgba(148, 163, 184, 0.3);
          padding: 10px 14px;
          background: rgba(2, 6, 23, 0.85);
          color: #e2e8f0;
        }
        .composer__tag input:focus {
          outline: none;
          border-color: rgba(34, 211, 238, 0.6);
        }
        .composer__controls button {
          border: none;
          border-radius: 14px;
          padding: 12px 24px;
          background: linear-gradient(120deg, rgba(34, 211, 238, 0.85), rgba(59, 130, 246, 0.85));
          color: #0f172a;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .composer__controls button:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 24px rgba(34, 211, 238, 0.2);
        }
        .composer__status {
          font-size: 14px;
          color: rgba(94, 234, 212, 0.85);
        }
        .filters {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          align-items: flex-end;
          justify-content: space-between;
        }
        .filters__search {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
          min-width: 260px;
        }
        .filters__search label {
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: rgba(148, 163, 184, 0.75);
        }
        .filters__search input {
          border-radius: 12px;
          border: 1px solid rgba(148, 163, 184, 0.3);
          padding: 10px 14px;
          background: rgba(15, 23, 42, 0.7);
          color: #e2e8f0;
        }
        .filters__search input:focus {
          outline: none;
          border-color: rgba(94, 234, 212, 0.6);
        }
        .filters__tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .filters__tag {
          border: 1px solid rgba(148, 163, 184, 0.3);
          border-radius: 999px;
          padding: 8px 18px;
          background: rgba(15, 23, 42, 0.45);
          color: #e2e8f0;
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .filters__tag--active {
          background: rgba(34, 211, 238, 0.2);
          border-color: rgba(34, 211, 238, 0.5);
          color: rgba(94, 234, 212, 0.95);
        }
        .grid {
          display: grid;
          gap: 20px;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }
        .grid__empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 48px;
          border-radius: 20px;
          background: rgba(15, 23, 42, 0.6);
          border: 1px dashed rgba(148, 163, 184, 0.4);
        }
        .grid__empty h3 {
          margin: 0;
        }
        .grid__empty p {
          margin: 12px 0 0;
          color: rgba(148, 163, 184, 0.75);
        }
        @media (max-width: 720px) {
          .composer {
            padding: 24px;
          }
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </Layout>
  );
}
