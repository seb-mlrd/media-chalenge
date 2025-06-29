"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1rem' }}>
      <span style={{ fontSize: '1.2rem' }}>🌙</span>
      <label style={{ position: 'relative', display: 'inline-block', width: 48, height: 24 }}>
        <input
          type="checkbox"
          checked={resolvedTheme === "dark"}
          onChange={e => setTheme(e.target.checked ? "dark" : "light")}
          style={{ opacity: 0, width: 0, height: 0 }}
          aria-label="Basculer le mode sombre"
        />
        <span
          style={{
            position: 'absolute',
            cursor: 'pointer',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: resolvedTheme === "dark" ? '#222' : '#eee',
            borderRadius: 24,
            transition: 'background 0.2s',
            boxShadow: '0 0 2px #888',
          }}
        >
          <span
            style={{
              position: 'absolute',
              left: resolvedTheme === "dark" ? 24 : 2,
              top: 2,
              width: 20,
              height: 20,
              background: resolvedTheme === "dark" ? '#fff' : '#222',
              borderRadius: '50%',
              transition: 'left 0.2s, background 0.2s',
              boxShadow: '0 1px 4px #0002',
            }}
          />
        </span>
      </label>
      <span style={{ fontSize: '1.2rem' }}>☀️</span>
    </div>
  );
}
