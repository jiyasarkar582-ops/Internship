"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Trash2, Save, ChevronDown, ChevronRight, Loader2,
  CheckCircle, AlertCircle, Settings, Database, Palette, Globe
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Field {
  name: string;
  label: string;
  type: string;
  required: boolean;
  default?: string;
  options?: string[];
}

interface Entity {
  name: string;
  slug: string;
  icon: string;
  fields: Field[];
}

interface AppConfig {
  appName: string;
  theme: { primaryColor: string; mode: "light" | "dark" };
  auth: { enabled: boolean; providers: string[] };
  language: string;
  translations: Record<string, Record<string, string>>;
  entities: Entity[];
}

const FIELD_TYPES = ["string", "text", "email", "number", "date", "select", "boolean"];
const ENTITY_ICONS = ["Database", "Users", "CheckSquare", "Package", "Briefcase", "FileText", "ShoppingCart", "Star"];

const defaultField = (): Field => ({
  name: "",
  label: "",
  type: "string",
  required: false,
});

const defaultEntity = (): Entity => ({
  name: "",
  slug: "",
  icon: "Database",
  fields: [{ ...defaultField() }],
});

function toSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

// ─── Sub-Components ───────────────────────────────────────────────────────────

function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
        {icon}
      </div>
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
      </div>
    </div>
  );
}

function FieldRow({
  field, index, onUpdate, onRemove, canRemove,
}: {
  field: Field; index: number; onUpdate: (i: number, f: Field) => void; onRemove: (i: number) => void; canRemove: boolean;
}) {
  const set = (key: keyof Field, val: unknown) => onUpdate(index, { ...field, [key]: val });
  return (
    <div className="grid grid-cols-12 gap-2 items-start p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
      <input
        className="col-span-3 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Field name"
        value={field.name}
        onChange={(e) => { set("name", e.target.value); set("label", e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)); }}
      />
      <input
        className="col-span-3 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Label"
        value={field.label}
        onChange={(e) => set("label", e.target.value)}
      />
      <select
        className="col-span-2 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={field.type}
        onChange={(e) => set("type", e.target.value)}
      >
        {FIELD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      {field.type === "select" ? (
        <input
          className="col-span-3 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Options (comma-sep)"
          value={(field.options || []).join(",")}
          onChange={(e) => set("options", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
        />
      ) : (
        <input
          className="col-span-3 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Default value"
          value={field.default ?? ""}
          onChange={(e) => set("default", e.target.value)}
        />
      )}
      <div className="col-span-1 flex items-center justify-center gap-1 pt-2">
        <label className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 cursor-pointer">
          <input type="checkbox" checked={field.required} onChange={e => set("required", e.target.checked)} className="rounded" />
          Req
        </label>
      </div>
      <button
        onClick={() => onRemove(index)}
        disabled={!canRemove}
        className="col-span-1 pt-2 flex justify-center text-gray-400 hover:text-red-500 disabled:opacity-30 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

function EntityCard({
  entity, index, onUpdate, onRemove, canRemove,
}: {
  entity: Entity; index: number; onUpdate: (i: number, e: Entity) => void; onRemove: (i: number) => void; canRemove: boolean;
}) {
  const [expanded, setExpanded] = useState(true);
  const set = (key: keyof Entity, val: unknown) => onUpdate(index, { ...entity, [key]: val });

  const updateField = useCallback((fi: number, f: Field) => {
    const newFields = [...entity.fields];
    newFields[fi] = f;
    set("fields", newFields);
  }, [entity]);

  const removeField = useCallback((fi: number) => {
    set("fields", entity.fields.filter((_, i) => i !== fi));
  }, [entity]);

  const addField = () => set("fields", [...entity.fields, defaultField()]);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
      {/* Entity Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
        <button onClick={() => setExpanded(v => !v)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
          {expanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
        <div className="flex-1 grid grid-cols-3 gap-3 items-center">
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Entity Name</label>
            <input
              className="w-full px-3 py-1.5 text-sm font-semibold rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Invoice"
              value={entity.name}
              onChange={(e) => {
                set("name", e.target.value);
                set("slug", toSlug(e.target.value) + "s");
              }}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">URL Slug</label>
            <input
              className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. invoices"
              value={entity.slug}
              onChange={(e) => set("slug", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Icon</label>
            <select
              className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={entity.icon}
              onChange={(e) => set("icon", e.target.value)}
            >
              {ENTITY_ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
            </select>
          </div>
        </div>
        {canRemove && (
          <button onClick={() => onRemove(index)} className="text-gray-400 hover:text-red-500 transition-colors ml-2">
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Fields */}
      {expanded && (
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-12 gap-2 px-3 mb-1">
            <span className="col-span-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</span>
            <span className="col-span-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Label</span>
            <span className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</span>
            <span className="col-span-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Default / Options</span>
            <span className="col-span-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Req</span>
          </div>
          {entity.fields.map((field, fi) => (
            <FieldRow
              key={fi}
              field={field}
              index={fi}
              onUpdate={updateField}
              onRemove={removeField}
              canRemove={entity.fields.length > 1}
            />
          ))}
          <button
            onClick={addField}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mt-2"
          >
            <Plus className="w-4 h-4" /> Add Field
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Builder Page ────────────────────────────────────────────────────────

export default function BuilderPage() {
  const router = useRouter();
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetch("/api/config")
      .then(r => r.json())
      .then(data => { setConfig(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const updateEntity = useCallback((i: number, e: Entity) => {
    setConfig(prev => {
      if (!prev) return prev;
      const entities = [...prev.entities];
      entities[i] = e;
      return { ...prev, entities };
    });
  }, []);

  const removeEntity = useCallback((i: number) => {
    setConfig(prev => {
      if (!prev) return prev;
      return { ...prev, entities: prev.entities.filter((_, idx) => idx !== i) };
    });
  }, []);

  const addEntity = () => {
    setConfig(prev => {
      if (!prev) return prev;
      return { ...prev, entities: [...prev.entities, defaultEntity()] };
    });
  };

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setStatus({ type: "success", message: data.warning || "Configuration saved! Refreshing app…" });
      setTimeout(() => {
        window.location.href = "/";
      }, 1200);
    } catch (err: any) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!config) {
    return <div className="text-red-500 p-8">Failed to load configuration.</div>;
  }

  return (
    <div className="space-y-10 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">App Builder</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">
            Configure your app visually — entities, fields, and theme — then hit <strong>Save</strong> to deploy instantly.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl shadow-md hover:bg-blue-700 disabled:opacity-60 transition-all hover:shadow-lg"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving…" : "Save & Deploy"}
        </button>
      </div>

      {/* Status Toast */}
      {status && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-medium ${
          status.type === "success"
            ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300"
            : "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300"
        }`}>
          {status.type === "success"
            ? <CheckCircle className="w-5 h-5 flex-shrink-0" />
            : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          {status.message}
        </div>
      )}

      {/* ── Section 1: App Settings ────────────────────────────────── */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <SectionHeader
          icon={<Settings className="w-5 h-5" />}
          title="App Settings"
          subtitle="Set the application name and visual theme"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">App Name</label>
            <input
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={config.appName}
              onChange={e => setConfig({ ...config, appName: e.target.value })}
              placeholder="My App"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Primary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer bg-transparent"
                value={config.theme?.primaryColor ?? "#3b82f6"}
                onChange={e => setConfig({ ...config, theme: { ...config.theme, primaryColor: e.target.value } })}
              />
              <input
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                value={config.theme?.primaryColor ?? "#3b82f6"}
                onChange={e => setConfig({ ...config, theme: { ...config.theme, primaryColor: e.target.value } })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme Mode</label>
            <div className="flex gap-3">
              {(["light", "dark"] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setConfig({ ...config, theme: { ...config.theme, mode } })}
                  className={`flex-1 py-2.5 px-4 rounded-xl border text-sm font-medium capitalize transition-all ${
                    config.theme?.mode === mode
                      ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                      : "border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-300"
                  }`}
                >
                  {mode === "light" ? "☀️ Light" : "🌙 Dark"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Entities ────────────────────────────────────── */}
      <section>
        <SectionHeader
          icon={<Database className="w-5 h-5" />}
          title="Entities & Fields"
          subtitle="Define your data models — each entity becomes a database table with a full CRUD interface"
        />
        <div className="space-y-4">
          {config.entities.map((entity, i) => (
            <EntityCard
              key={i}
              entity={entity}
              index={i}
              onUpdate={updateEntity}
              onRemove={removeEntity}
              canRemove={config.entities.length > 1}
            />
          ))}
          <button
            onClick={addEntity}
            className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/10"
          >
            <Plus className="w-5 h-5" /> Add New Entity
          </button>
        </div>
      </section>

      {/* ── Section 3: Language ───────────────────────────────────── */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <SectionHeader
          icon={<Globe className="w-5 h-5" />}
          title="Default Language"
          subtitle="The language shown when no preference is set"
        />
        <div className="flex gap-3 flex-wrap">
          {Object.keys(config.translations || {}).map(lang => (
            <button
              key={lang}
              onClick={() => setConfig({ ...config, language: lang })}
              className={`px-5 py-2 rounded-xl border text-sm font-semibold uppercase tracking-wider transition-all ${
                config.language === lang
                  ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                  : "border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-300"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </section>

      {/* Bottom save */}
      <div className="flex justify-end pb-10">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white text-sm font-semibold rounded-xl shadow-md hover:bg-blue-700 disabled:opacity-60 transition-all hover:shadow-lg"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving…" : "Save & Deploy"}
        </button>
      </div>
    </div>
  );
}
