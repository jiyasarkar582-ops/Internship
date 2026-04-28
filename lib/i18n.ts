export const dictionaries = {
  en: {
    dashboard: "Dashboard",
    entities: "Entities",
    signOut: "Sign Out",
    welcome: "Welcome to",
    quickLinks: "Quick Links",
    manage: "Manage",
    addNew: "Add New",
    importCsv: "Import CSV",
    refresh: "Refresh",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
  },
  es: {
    dashboard: "Panel de Control",
    entities: "Entidades",
    signOut: "Cerrar sesión",
    welcome: "Bienvenido a",
    quickLinks: "Enlaces rápidos",
    manage: "Gestionar",
    addNew: "Añadir nuevo",
    importCsv: "Importar CSV",
    refresh: "Actualizar",
    actions: "Acciones",
    edit: "Editar",
    delete: "Eliminar",
    save: "Guardar",
    cancel: "Cancelar",
  }
};

export type Locale = keyof typeof dictionaries;

// In a real app, you would get this from context or next-intl
export function useTranslations(locale: Locale = 'en') {
  return dictionaries[locale] || dictionaries.en;
}
