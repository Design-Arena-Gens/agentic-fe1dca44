import { useState } from "react";

export default function ClipCard({ clip, onCopy, onDelete, onUpdate, isActive }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(clip.content);

  function toggleEdit() {
    setIsEditing((prev) => !prev);
    setValue(clip.content);
  }

  function handleSave() {
    const next = value.trim();
    if (!next) return;
    onUpdate({ ...clip, content: next, updatedAt: new Date().toISOString() });
    setIsEditing(false);
  }

  return (
    <article className={`clip-card ${isActive ? "clip-card--active" : ""}`}>
      <div className="clip-card__meta">
        <span className="clip-card__tag">{clip.tag || "untagged"}</span>
        <time className="clip-card__time">
          {new Date(clip.updatedAt || clip.createdAt).toLocaleString()}
        </time>
      </div>
      {isEditing ? (
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="clip-card__textarea"
        />
      ) : (
        <pre className="clip-card__content">{clip.content}</pre>
      )}
      <footer className="clip-card__actions">
        <button className="clip-card__button" onClick={() => onCopy(clip)}>
          Copy
        </button>
        {isEditing ? (
          <>
            <button className="clip-card__button clip-card__button--primary" onClick={handleSave}>
              Save
            </button>
            <button className="clip-card__button" onClick={toggleEdit}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button className="clip-card__button" onClick={toggleEdit}>
              Edit
            </button>
            <button className="clip-card__button clip-card__button--danger" onClick={() => onDelete(clip.id)}>
              Delete
            </button>
          </>
        )}
      </footer>
      <style jsx>{`
        .clip-card {
          background: rgba(15, 23, 42, 0.75);
          border: 1px solid rgba(148, 163, 184, 0.22);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: border-color 0.2s ease, transform 0.2s ease;
        }
        .clip-card--active {
          border-color: rgba(34, 211, 238, 0.6);
          transform: translateY(-2px);
        }
        .clip-card__meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: rgba(148, 163, 184, 0.75);
        }
        .clip-card__tag {
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(34, 211, 238, 0.08);
          border: 1px solid rgba(34, 211, 238, 0.3);
          color: rgba(94, 234, 212, 0.9);
        }
        .clip-card__time {
          font-variant-numeric: tabular-nums;
        }
        .clip-card__content {
          white-space: pre-wrap;
          word-break: break-word;
          margin: 0;
          font-size: 16px;
          line-height: 1.5;
        }
        .clip-card__textarea {
          min-height: 160px;
          border: 1px solid rgba(94, 234, 212, 0.3);
          border-radius: 12px;
          padding: 16px;
          background: rgba(15, 23, 42, 0.9);
          color: #e2e8f0;
          font-family: inherit;
          font-size: 16px;
          resize: vertical;
        }
        .clip-card__textarea:focus {
          outline: none;
          border-color: rgba(94, 234, 212, 0.65);
        }
        .clip-card__actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .clip-card__button {
          background: rgba(148, 163, 184, 0.12);
          color: #e2e8f0;
          border: 1px solid transparent;
          border-radius: 12px;
          padding: 10px 18px;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .clip-card__button:hover {
          background: rgba(148, 163, 184, 0.24);
        }
        .clip-card__button--primary {
          background: linear-gradient(120deg, rgba(34, 211, 238, 0.85), rgba(59, 130, 246, 0.8));
        }
        .clip-card__button--primary:hover {
          border-color: rgba(34, 211, 238, 0.8);
        }
        .clip-card__button--danger {
          background: rgba(248, 113, 113, 0.2);
          color: #fecaca;
        }
        .clip-card__button--danger:hover {
          border-color: rgba(248, 113, 113, 0.6);
        }
      `}</style>
    </article>
  );
}
