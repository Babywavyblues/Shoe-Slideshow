'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Photo = { id: string; name: string; url: string };
type Process = { id: string; name: string; photos: Photo[] };
type ShoeModel = { id: string; name: string; processes: Process[] };
type Screen = 'loading' | 'models' | 'processes' | 'slides' | 'error';

const SLIDE_INTERVAL_MS = 5000;

export default function Home() {
  const [screen, setScreen] = useState<Screen>('loading');
  const [models, setModels] = useState<ShoeModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<ShoeModel | null>(null);
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [message, setMessage] = useState('');
  const wakeLock = useRef<WakeLockSentinel | null>(null);

  const photos = selectedProcess?.photos ?? [];
  const currentPhoto = photos[index];

  const loadCatalog = useCallback(async () => {
    setScreen('loading');
    try {
      const response = await fetch('/api/catalog');
      const data = await response.json() as { models?: ShoeModel[]; error?: string };
      if (!response.ok) throw new Error(data.error ?? 'Data Google Drive tidak dapat dimuat.');
      setModels(data.models ?? []);
      setScreen('models');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Terjadi kesalahan.');
      setScreen('error');
    }
  }, []);

  useEffect(() => { void loadCatalog(); }, [loadCatalog]);

  useEffect(() => {
    if (screen !== 'slides' || paused || photos.length < 2) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % photos.length), SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [screen, paused, photos.length]);

  useEffect(() => {
    const requestWakeLock = async () => {
      try { wakeLock.current = await navigator.wakeLock?.request('screen') ?? null; } catch { /* browser may deny */ }
    };
    if (screen === 'slides') void requestWakeLock();
    return () => { void wakeLock.current?.release(); wakeLock.current = null; };
  }, [screen]);

  const title = useMemo(() => selectedProcess ? `${selectedModel?.name} · ${selectedProcess.name}` : 'Shoe Slideshow', [selectedModel, selectedProcess]);

  const startSlides = (process: Process) => {
    setSelectedProcess(process); setIndex(0); setPaused(false); setScreen('slides');
  };

  if (screen === 'slides' && currentPhoto) return (
    <main className="slideshow" onClick={() => setPaused((value) => !value)}>
      <img className="slide-image" src={currentPhoto.url} alt={currentPhoto.name} />
      <header className="slide-header" onClick={(event) => event.stopPropagation()}>
        <button className="back-button" onClick={() => setScreen('processes')} aria-label="Kembali ke proses">← Kembali</button>
        <div className="slide-title"><strong>{title}</strong><span>{index + 1} / {photos.length}</span></div>
        <button className="fullscreen-button" onClick={() => void document.documentElement.requestFullscreen?.()} aria-label="Layar penuh">⛶</button>
      </header>
      <div className="slide-footer"><span className={paused ? 'status paused' : 'status'}>{paused ? 'Ⅱ DIJEDA' : '▶ BERJALAN'}</span><span>Tap foto untuk {paused ? 'lanjut' : 'jeda'}</span></div>
    </main>
  );

  if (screen === 'slides') return <main className="center-state"><p>Folder ini belum memiliki foto.</p><button onClick={() => setScreen('processes')}>Kembali ke proses</button></main>;

  return <main className="app-shell">
    <header className="app-header"><div className="brand-mark">S</div><div><p className="eyebrow">INSTRUKSI PRODUKSI</p><h1>{screen === 'processes' ? selectedModel?.name : 'Shoe Slideshow'}</h1></div></header>
    {screen === 'loading' && <section className="center-state"><div className="spinner" /><p>Mengambil folder foto dari Google Drive…</p></section>}
    {screen === 'error' && <section className="center-state"><p className="error">{message}</p><button onClick={() => void loadCatalog()}>Coba lagi</button></section>}
    {screen === 'models' && <section className="choice-area"><p className="instruction">Pilih model sepatu</p><div className="choice-grid">{models.map((model) => <button className="choice-card" key={model.id} onClick={() => { setSelectedModel(model); setScreen('processes'); }}>{model.name}<span>{model.processes.length} proses tersedia</span></button>)}</div>{models.length === 0 && <p className="empty">Belum ada folder model di Google Drive.</p>}</section>}
    {screen === 'processes' && <section className="choice-area"><button className="text-back" onClick={() => setScreen('models')}>← Pilih model lain</button><p className="instruction">Pilih proses</p><div className="choice-grid">{selectedModel?.processes.map((process) => <button className="choice-card" key={process.id} onClick={() => startSlides(process)}>{process.name}<span>{process.photos.length} foto</span></button>)}</div></section>}
  </main>;
}
