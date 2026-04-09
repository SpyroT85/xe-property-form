import { useEffect, useState } from 'react';
import { Trash2, X, AlertTriangle } from 'lucide-react';
import type { Ad } from '../types';

interface AdListProps {
  refreshKey: number;
}

export function AdList({ refreshKey }: AdListProps) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  useEffect(() => {
    const fetchAds = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/ads');
        if (!response.ok) throw new Error('Failed to fetch ads');
        const data: Ad[] = await response.json();
        setAds(data);
      } catch (err) {
        setError('Could not load ads. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAds();
  }, [refreshKey]);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    setConfirmId(null);

    try {
      const response = await fetch(`/api/ads/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete ad');
      // Remove from local state instead of refetching everything
      setAds(prev => prev.filter(ad => ad.id !== id));
    } catch (err) {
      setError('Could not delete ad. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const adToDelete = ads.find(ad => ad.id === confirmId);

  if (isLoading) return <p className="list-status">Loading ads...</p>;
  if (error) return <p className="list-status list-status--error">{error}</p>;
  if (ads.length === 0) return <p className="list-status">No ads yet.</p>;

  return (
    <>
      <section className="ad-list">
        <h2 className="list-title">Property Listings</h2>
        <ul className="ad-cards">
          {ads.map(ad => (
            <li key={ad.id} className="ad-card">
              <div className="ad-card__header">
                <span className="ad-card__type">
                  {ad.type.charAt(0).toUpperCase() + ad.type.slice(1)}
                </span>
                <span className="ad-card__price">€{Number(ad.price).toLocaleString()}</span>
              </div>
              <h3 className="ad-card__title">{ad.title}</h3>
              <p className="ad-card__area">{ad.area_main_text}, {ad.area_secondary_text}</p>
              {ad.description && (
                <p className="ad-card__description">{ad.description}</p>
              )}
              <div className="ad-card__footer">
                <time className="ad-card__date">
                  {new Date(ad.created_at).toLocaleDateString('el-GR')}
                </time>
                <button
                  className="ad-card__delete"
                  onClick={() => setConfirmId(ad.id)}
                  disabled={deletingId === ad.id}
                  aria-label={`Delete ad: ${ad.title}`}
                >
                  <Trash2 size={13} />
                  {deletingId === ad.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {confirmId !== null && adToDelete && (
        <div className="modal-overlay" onClick={() => setConfirmId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button
              className="modal__close"
              onClick={() => setConfirmId(null)}
              aria-label="Cancel"
            >
              <X size={18} />
            </button>

            <div className="modal__icon">
              <AlertTriangle size={28} />
            </div>

            <h3 className="modal__title">Delete listing?</h3>
            <p className="modal__body">
              <strong>{adToDelete.title}</strong> will be permanently removed.
            </p>

            <div className="modal__actions">
              <button className="modal__cancel" onClick={() => setConfirmId(null)}>
                Cancel
              </button>
              <button
                className="modal__confirm"
                onClick={() => handleDelete(confirmId)}
                disabled={deletingId === confirmId}
              >
                <Trash2 size={14} />
                {deletingId === confirmId ? 'Deleting...' : 'Yes, delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}