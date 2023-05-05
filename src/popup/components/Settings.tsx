import { Config, DEFAULT_CONFIG, getConfig, setConfig } from 'popup/hooks';
import React, { useContext, useEffect, useRef, useState } from 'react';
import 'popup/style/Settings.css';
import { AppContext } from 'popup/App';

const THEMES = [
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'garden',
  'forest',
  'aqua',
  'lofi',
  'pastel',
  'fantasy',
  'wireframe',
  'black',
  'luxury',
  'dracula',
  'cmyk',
  'autumn',
  'business',
  'acid',
  'lemonade',
  'night',
  'coffee',
  'winter',
];

export function Settings() {
  const APIKeyInput = useRef<HTMLInputElement>(null);
  const ctx = useContext(AppContext);
  const [editingConfig, setEditingConfig] = useState<Config>(DEFAULT_CONFIG);

  useEffect(() => {
    (async () => {
      setEditingConfig((await getConfig()) ?? DEFAULT_CONFIG);
    })();
  }, []);

  const handleSubmit = () => {
    setConfig(editingConfig);
  };

  return (
    <section id="settings" className="view">
      <div id="topbar">
        <h1>Settings</h1>

        <button onClick={() => ctx.goTo('auto')}>
          <svg
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
            />
          </svg>
        </button>
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">API Key</span>
        </label>
        <p className="label-desc">
          Before starting to use this extension, you need to
          <a href="https://platform.openai.com/account/api-keys">
            generate an OpenAI API Secret Key
          </a>
        </p>
        <input
          type="text"
          placeholder="OpenAI Secret Key"
          onChange={(e) =>
            setEditingConfig((v) => ({ ...v, apiKey: e.target.value }))
          }
          value={editingConfig.apiKey}
        />
        <label className="label">
          <span className="label-text">Theme</span>
        </label>
        <select
          placeholder="Pick a theme"
          onChange={(e) =>
            setEditingConfig((v) => ({ ...v, theme: e.target.value }))
          }
          value={editingConfig.theme}
        >
          <option disabled selected>
            Pick your favorite Theme
          </option>
          {THEMES.map((theme) => (
            <option key={theme} value={theme}>
              {theme[0].toUpperCase() + theme.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <button className="submit" onClick={() => handleSubmit()}>
        Save
      </button>
    </section>
  );
}
