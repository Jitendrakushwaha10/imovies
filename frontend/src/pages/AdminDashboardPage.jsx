import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ConfirmModal } from '../components/common/ConfirmModal';
import {
  Film,
  Building2,
  Calendar,
  Ticket,
  DollarSign,
  Plus,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  Users
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Tab Data States
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [shows, setShows] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Modals & Forms
  const [showAddMovieModal, setShowAddMovieModal] = useState(false);
  const [showAddTheatreModal, setShowAddTheatreModal] = useState(false);
  const [showAddShowModal, setShowAddShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Filters
  const [bookingStatusFilter, setBookingStatusFilter] = useState('ALL');
  const [bookingSearch, setBookingSearch] = useState('');

  const { success, error: toastError } = useToast();

  const fetchStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const res = await api.getAdminStats();
      if (res.success) {
        setStats(res.stats);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const fetchTabData = useCallback(async () => {
    try {
      if (activeTab === 'movies') {
        const res = await api.getMovies();
        if (res.success) setMovies(res.movies || []);
      } else if (activeTab === 'theatres') {
        const res = await api.getTheatres();
        if (res.success) setTheatres(res.theatres || []);
      } else if (activeTab === 'shows') {
        const res = await api.getShows();
        if (res.success) setShows(res.shows || []);
      } else if (activeTab === 'bookings') {
        const res = await api.getAdminBookings({
          status: bookingStatusFilter,
          search: bookingSearch
        });
        if (res.success) setBookings(res.bookings || []);
      }
    } catch (err) {
      console.error('Failed to load tab data:', err);
    }
  }, [activeTab, bookingStatusFilter, bookingSearch]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchTabData();
  }, [fetchTabData]);

  // Handle Add Movie Form Submit
  const handleAddMovie = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const movieData = {
      title: fd.get('title'),
      overview: fd.get('overview'),
      posterUrl: fd.get('posterUrl'),
      backdropUrl: fd.get('backdropUrl'),
      genres: fd.get('genres').split(',').map((g) => g.trim()),
      durationMinutes: Number(fd.get('durationMinutes')),
      rating: Number(fd.get('rating')),
      director: fd.get('director'),
      cast: fd.get('cast').split(',').map((c) => c.trim()),
      language: fd.get('language') || 'English'
    };

    try {
      const res = await api.createMovie(movieData);
      if (res.success) {
        success('Movie created successfully.');
        setShowAddMovieModal(false);
        fetchStats();
        fetchTabData();
      }
    } catch (err) {
      toastError(err.message || 'Failed to add movie.');
    }
  };

  // Handle Add Theatre Form Submit
  const handleAddTheatre = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const theatreData = {
      name: fd.get('name'),
      city: fd.get('city') || 'Indore',
      address: fd.get('address'),
      screens: Number(fd.get('screens')) || 4
    };

    try {
      const res = await api.createTheatre(theatreData);
      if (res.success) {
        success('Theatre added successfully.');
        setShowAddTheatreModal(false);
        fetchStats();
        fetchTabData();
      }
    } catch (err) {
      toastError(err.message || 'Failed to add theatre.');
    }
  };

  // Handle Add Show Form Submit
  const handleAddShow = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const showData = {
      movieId: fd.get('movieId'),
      theatreId: fd.get('theatreId'),
      showTime: new Date(fd.get('showTime')).toISOString(),
      ticketPrice: Number(fd.get('ticketPrice'))
    };

    try {
      const res = await api.createShow(showData);
      if (res.success) {
        success('Showtime created successfully.');
        setShowAddShowModal(false);
        fetchStats();
        fetchTabData();
      }
    } catch (err) {
      toastError(err.message || 'Failed to add showtime.');
    }
  };

  // Handle Delete Confirmation
  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    try {
      if (itemToDelete.type === 'movie') {
        await api.deleteMovie(itemToDelete.id);
        success('Movie deleted successfully.');
      } else if (itemToDelete.type === 'theatre') {
        await api.deleteTheatre(itemToDelete.id);
        success('Theatre deleted successfully.');
      } else if (itemToDelete.type === 'show') {
        await api.deleteShow(itemToDelete.id);
        success('Showtime deleted successfully.');
      }
      setItemToDelete(null);
      fetchStats();
      fetchTabData();
    } catch (err) {
      toastError(err.message || 'Delete operation failed.');
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem', minHeight: '80vh' }}>
      {/* Admin Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h1 style={{ fontSize: '1.85rem', color: '#F8FAFC' }}>Administrator Console</h1>
            <span className="badge badge-primary">SuperAdmin Access</span>
          </div>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Live control panel for Indore theatres, screening schedules, and customer bookings.
          </p>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem'
        }}
      >
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem' }}>Total Movies</span>
            <Film size={20} color="#3B82F6" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F8FAFC' }}>
            {stats ? stats.totalMovies : '...'}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem' }}>Indore Theatres</span>
            <Building2 size={20} color="#38BDF8" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F8FAFC' }}>
            {stats ? stats.totalTheatres : '...'}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem' }}>Active Shows</span>
            <Calendar size={20} color="#F59E0B" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F8FAFC' }}>
            {stats ? stats.totalShows : '...'}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem' }}>Bookings Confirmed</span>
            <Ticket size={20} color="#22C55E" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F8FAFC' }}>
            {stats ? stats.totalBookings : '...'}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem' }}>Total Revenue</span>
            <DollarSign size={20} color="#10B981" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10B981' }}>
            ₹{stats ? stats.totalRevenue.toLocaleString() : '0'}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--color-border)',
          marginBottom: '2rem',
          overflowX: 'auto'
        }}
      >
        {[
          { id: 'overview', label: 'Recent Activity', icon: CheckCircle },
          { id: 'movies', label: 'Manage Movies', icon: Film },
          { id: 'theatres', label: 'Indore Theatres', icon: Building2 },
          { id: 'shows', label: 'Showtimes', icon: Calendar },
          { id: 'bookings', label: 'Customer Bookings', icon: Ticket }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                borderBottom: isActive ? '2px solid #38BDF8' : '2px solid transparent',
                color: isActive ? '#38BDF8' : '#94A3B8',
                background: 'transparent',
                fontWeight: 600,
                fontSize: '0.9rem',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview & Recent Activity */}
      {activeTab === 'overview' && (
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#F8FAFC', marginBottom: '1rem' }}>
            Latest Customer Bookings
          </h3>
          {stats?.recentBookings?.length === 0 ? (
            <p style={{ color: '#94A3B8' }}>No customer bookings recorded yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: '#94A3B8' }}>
                    <th style={{ padding: '0.75rem' }}>Reference</th>
                    <th style={{ padding: '0.75rem' }}>Customer</th>
                    <th style={{ padding: '0.75rem' }}>Movie</th>
                    <th style={{ padding: '0.75rem' }}>Theatre</th>
                    <th style={{ padding: '0.75rem' }}>Seats</th>
                    <th style={{ padding: '0.75rem' }}>Amount</th>
                    <th style={{ padding: '0.75rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentBookings?.map((b) => (
                    <tr key={b._id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.08)' }}>
                      <td style={{ padding: '0.75rem', fontFamily: 'monospace', color: '#38BDF8' }}>
                        {b.bookingReference}
                      </td>
                      <td style={{ padding: '0.75rem', color: '#F8FAFC' }}>{b.user?.name || 'Customer'}</td>
                      <td style={{ padding: '0.75rem', color: '#F8FAFC' }}>{b.movie?.title}</td>
                      <td style={{ padding: '0.75rem', color: '#94A3B8' }}>{b.theatre?.name}</td>
                      <td style={{ padding: '0.75rem', color: '#F8FAFC', fontWeight: 600 }}>
                        {b.seats?.join(', ')}
                      </td>
                      <td style={{ padding: '0.75rem', color: '#22C55E', fontWeight: 700 }}>
                        ₹{b.totalAmount}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={`badge ${b.status === 'CONFIRMED' ? 'badge-success' : 'badge-danger'}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Manage Movies */}
      {activeTab === 'movies' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#F8FAFC' }}>Movies Catalog ({movies.length})</h3>
            <button onClick={() => setShowAddMovieModal(true)} className="btn btn-primary btn-sm">
              <Plus size={16} />
              Add New Movie
            </button>
          </div>

          <div className="glass-card" style={{ overflowX: 'auto', padding: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: '#94A3B8' }}>
                  <th style={{ padding: '0.75rem' }}>Poster</th>
                  <th style={{ padding: '0.75rem' }}>Title</th>
                  <th style={{ padding: '0.75rem' }}>Genres</th>
                  <th style={{ padding: '0.75rem' }}>Duration</th>
                  <th style={{ padding: '0.75rem' }}>Rating</th>
                  <th style={{ padding: '0.75rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((m) => (
                  <tr key={m._id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.08)' }}>
                    <td style={{ padding: '0.75rem' }}>
                      <img
                        src={m.posterUrl}
                        alt={m.title}
                        style={{ width: '38px', height: '52px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    </td>
                    <td style={{ padding: '0.75rem', color: '#F8FAFC', fontWeight: 600 }}>{m.title}</td>
                    <td style={{ padding: '0.75rem', color: '#94A3B8' }}>{m.genres?.join(', ')}</td>
                    <td style={{ padding: '0.75rem', color: '#94A3B8' }}>{m.durationMinutes}m</td>
                    <td style={{ padding: '0.75rem', color: '#F59E0B', fontWeight: 700 }}>★ {m.rating}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <button
                        onClick={() => setItemToDelete({ type: 'movie', id: m._id, name: m.title })}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '0.3rem 0.5rem' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Indore Theatres */}
      {activeTab === 'theatres' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#F8FAFC' }}>Indore Multiplexes ({theatres.length})</h3>
            <button onClick={() => setShowAddTheatreModal(true)} className="btn btn-primary btn-sm">
              <Plus size={16} />
              Add Theatre
            </button>
          </div>

          <div className="glass-card" style={{ overflowX: 'auto', padding: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: '#94A3B8' }}>
                  <th style={{ padding: '0.75rem' }}>Name</th>
                  <th style={{ padding: '0.75rem' }}>City</th>
                  <th style={{ padding: '0.75rem' }}>Address</th>
                  <th style={{ padding: '0.75rem' }}>Screens</th>
                  <th style={{ padding: '0.75rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {theatres.map((t) => (
                  <tr key={t._id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.08)' }}>
                    <td style={{ padding: '0.75rem', color: '#F8FAFC', fontWeight: 600 }}>{t.name}</td>
                    <td style={{ padding: '0.75rem', color: '#38BDF8' }}>{t.city}</td>
                    <td style={{ padding: '0.75rem', color: '#94A3B8' }}>{t.address}</td>
                    <td style={{ padding: '0.75rem', color: '#F8FAFC' }}>{t.screens} Screens</td>
                    <td style={{ padding: '0.75rem' }}>
                      <button
                        onClick={() => setItemToDelete({ type: 'theatre', id: t._id, name: t.name })}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '0.3rem 0.5rem' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Showtimes */}
      {activeTab === 'shows' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#F8FAFC' }}>Scheduled Showtimes ({shows.length})</h3>
            <button
              onClick={async () => {
                const [mRes, tRes] = await Promise.all([api.getMovies(), api.getTheatres()]);
                if (mRes.success) setMovies(mRes.movies || []);
                if (tRes.success) setTheatres(tRes.theatres || []);
                setShowAddShowModal(true);
              }}
              className="btn btn-primary btn-sm"
            >
              <Plus size={16} />
              Schedule Show
            </button>
          </div>

          <div className="glass-card" style={{ overflowX: 'auto', padding: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: '#94A3B8' }}>
                  <th style={{ padding: '0.75rem' }}>Movie</th>
                  <th style={{ padding: '0.75rem' }}>Theatre</th>
                  <th style={{ padding: '0.75rem' }}>Time & Date</th>
                  <th style={{ padding: '0.75rem' }}>Price</th>
                  <th style={{ padding: '0.75rem' }}>Booked Seats</th>
                  <th style={{ padding: '0.75rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {shows.map((s) => (
                  <tr key={s._id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.08)' }}>
                    <td style={{ padding: '0.75rem', color: '#F8FAFC', fontWeight: 600 }}>{s.movie?.title}</td>
                    <td style={{ padding: '0.75rem', color: '#94A3B8' }}>{s.theatre?.name}</td>
                    <td style={{ padding: '0.75rem', color: '#38BDF8' }}>
                      {new Date(s.showTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td style={{ padding: '0.75rem', color: '#F8FAFC' }}>₹{s.ticketPrice}</td>
                    <td style={{ padding: '0.75rem', color: '#F59E0B' }}>
                      {s.bookedSeats?.length || 0} / {s.totalSeats || 80}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <button
                        onClick={() =>
                          setItemToDelete({
                            type: 'show',
                            id: s._id,
                            name: `${s.movie?.title} at ${s.theatre?.name}`
                          })
                        }
                        className="btn btn-danger btn-sm"
                        style={{ padding: '0.3rem 0.5rem' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Customer Bookings */}
      {activeTab === 'bookings' && (
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#F8FAFC' }}>Customer Bookings ({bookings.length})</h3>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <select
                value={bookingStatusFilter}
                onChange={(e) => setBookingStatusFilter(e.target.value)}
                className="form-control"
                style={{ width: 'auto', padding: '0.4rem 1rem', fontSize: '0.85rem' }}
              >
                <option value="ALL">All Statuses</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="glass-card" style={{ overflowX: 'auto', padding: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: '#94A3B8' }}>
                  <th style={{ padding: '0.75rem' }}>Reference</th>
                  <th style={{ padding: '0.75rem' }}>User</th>
                  <th style={{ padding: '0.75rem' }}>Movie</th>
                  <th style={{ padding: '0.75rem' }}>Theatre</th>
                  <th style={{ padding: '0.75rem' }}>Seats</th>
                  <th style={{ padding: '0.75rem' }}>Amount</th>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.08)' }}>
                    <td style={{ padding: '0.75rem', fontFamily: 'monospace', color: '#38BDF8' }}>
                      {b.bookingReference}
                    </td>
                    <td style={{ padding: '0.75rem', color: '#F8FAFC' }}>
                      {b.user?.name}
                      <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>
                        {b.user?.email}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', color: '#F8FAFC' }}>{b.movie?.title}</td>
                    <td style={{ padding: '0.75rem', color: '#94A3B8' }}>{b.theatre?.name}</td>
                    <td style={{ padding: '0.75rem', color: '#F8FAFC', fontWeight: 600 }}>
                      {b.seats?.join(', ')}
                    </td>
                    <td style={{ padding: '0.75rem', color: '#22C55E', fontWeight: 700 }}>
                      ₹{b.totalAmount}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className={`badge ${b.status === 'CONFIRMED' ? 'badge-success' : 'badge-danger'}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Movie Modal */}
      {showAddMovieModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(3, 7, 18, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
        >
          <div
            className="glass-card"
            style={{ width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}
          >
            <h3 style={{ fontSize: '1.25rem', color: '#F8FAFC', marginBottom: '1.25rem' }}>
              Add New Movie
            </h3>
            <form onSubmit={handleAddMovie}>
              <div className="form-group">
                <label className="form-label">Movie Title</label>
                <input name="title" required className="form-control" placeholder="e.g. Gladiator II" />
              </div>
              <div className="form-group">
                <label className="form-label">Overview / Synopsis</label>
                <textarea name="overview" required rows={3} className="form-control" placeholder="Movie synopsis..." />
              </div>
              <div className="form-group">
                <label className="form-label">Poster Image URL</label>
                <input name="posterUrl" required className="form-control" placeholder="https://..." />
              </div>
              <div className="form-group">
                <label className="form-label">Backdrop Image URL (optional)</label>
                <input name="backdropUrl" className="form-control" placeholder="https://..." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Genres (comma separated)</label>
                  <input name="genres" required className="form-control" placeholder="Action, Sci-Fi" />
                </div>
                <div className="form-group">
                  <label className="form-label">Duration (Minutes)</label>
                  <input name="durationMinutes" type="number" required defaultValue={135} className="form-control" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Rating (0 - 10)</label>
                  <input name="rating" type="number" step="0.1" defaultValue={8.2} className="form-control" />
                </div>
                <div className="form-group">
                  <label className="form-label">Language</label>
                  <input name="language" defaultValue="English" className="form-control" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Director</label>
                <input name="director" className="form-control" placeholder="Ridley Scott" />
              </div>
              <div className="form-group">
                <label className="form-label">Cast (comma separated)</label>
                <input name="cast" className="form-control" placeholder="Paul Mescal, Pedro Pascal" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowAddMovieModal(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Movie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Theatre Modal */}
      {showAddTheatreModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(3, 7, 18, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
        >
          <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#F8FAFC', marginBottom: '1.25rem' }}>
              Add Theatre (Indore)
            </h3>
            <form onSubmit={handleAddTheatre}>
              <div className="form-group">
                <label className="form-label">Theatre Name</label>
                <input name="name" required className="form-control" placeholder="e.g. INOX: Velocity Mall" />
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input name="city" defaultValue="Indore" className="form-control" />
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input name="address" required className="form-control" placeholder="Ring Road, Indore, MP" />
              </div>
              <div className="form-group">
                <label className="form-label">Screen Count</label>
                <input name="screens" type="number" defaultValue={4} className="form-control" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowAddTheatreModal(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Theatre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Show Modal */}
      {showAddShowModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(3, 7, 18, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
        >
          <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#F8FAFC', marginBottom: '1.25rem' }}>
              Schedule New Show
            </h3>
            <form onSubmit={handleAddShow}>
              <div className="form-group">
                <label className="form-label">Select Movie</label>
                <select name="movieId" required className="form-control">
                  {movies.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Select Theatre</label>
                <select name="theatreId" required className="form-control">
                  {theatres.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name} ({t.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Show Date & Time</label>
                <input
                  name="showTime"
                  type="datetime-local"
                  required
                  defaultValue={new Date(Date.now() + 86400000).toISOString().slice(0, 16)}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Ticket Base Price (₹)</label>
                <input name="ticketPrice" type="number" required defaultValue={240} className="form-control" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowAddShowModal(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Create Show
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Item Confirmation Modal */}
      <ConfirmModal
        isOpen={!!itemToDelete}
        danger={true}
        title={`Delete ${itemToDelete?.type}`}
        message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be reversed.`}
        confirmText="Delete"
        onConfirm={handleDeleteItem}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
};
