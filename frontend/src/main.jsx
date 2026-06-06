import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
  ClipboardList,
  Edit3,
  Eye,
  Gauge,
  LayoutDashboard,
  Banknote,
  Package,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Trash2,
  UserRound,
  Users,
  Warehouse,
  X
} from "lucide-react";
import "./styles.css";

const BRAND_NAME = "OXIPUR ORIENTE S.R.L.";
const MAIN_WAREHOUSE = "PLANTA";
const SESSION_KEY = "oxipur_iam_session";
const PRESENCE_HEARTBEAT_MS = 30000;
const PROFILE_REFRESH_MS = 30000;
const PROFILE_EDITOR_CLOSE_MS = 180;

const navItems = [
  { id: "dashboard", label: "Centro operativo", icon: LayoutDashboard },
  { id: "inventory", label: "Inventario", icon: Boxes },
  { id: "sales", label: "Notas de venta", icon: ClipboardList },
  { id: "printing", label: "Impresión", icon: Printer },
  { id: "utilities", label: "Utilidades", icon: Banknote },
  { id: "cylinders", label: "Cilindros", icon: Gauge },
  { id: "products", label: "Productos", icon: Package },
  { id: "profiles", label: "Perfiles", icon: Users },
  { id: "profile", label: "Perfil", icon: UserRound }
];

const monthOptions = [
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" }
];

const emptyDeliveredLine = { cylinderNumber: "", productId: "", capacityM3: "", ownerName: "", observations: "" };
const emptyCollectedLine = { cylinderNumber: "", productId: "", capacityM3: "", ownerName: "", observations: "" };
const emptyLoginForm = { username: "", password: "" };

const emptyForm = {
  cylinder: {
    id: null,
    serialNumber: "",
    capacityM3: "",
    owner: "OXIPUR",
    price: "",
    ownerType: "COMPANY"
  },
  product: { id: null, code: "", name: "", description: "" },
  profile: { id: null, fullName: "", username: "", password: "", roleName: "OPERADOR", active: true },
  profileEditor: { id: null, fullName: "", username: "", password: "", roleName: "OPERADOR", active: true },
  sale: {
    id: null,
    noteNumber: "",
    customerName: "",
    noteDate: new Date().toISOString().slice(0, 16),
    observations: "",
    utilityAmount: "",
    deliveredCylinders: [{ ...emptyDeliveredLine }],
    collectedCylinders: [{ ...emptyCollectedLine }]
  }
};

function App() {
  const [active, setActive] = useState("dashboard");
  const [session, setSession] = useState(readStoredSession);
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [loginForm, setLoginForm] = useState(emptyLoginForm);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [state, setState] = useState({
    cylinders: [],
    products: [],
    profiles: [],
    inventory: [],
    movements: [],
    salesNotes: [],
    operationalAlerts: null,
    customerSummary: null,
    utilitiesSummary: null,
    utilitiesLoading: false,
    utilitiesError: "",
    loading: true,
    message: ""
  });
  const [filters, setFilters] = useState({ locationType: "", customerName: "", serialNumber: "" });
  const [customerQuery, setCustomerQuery] = useState("");
  const [forms, setForms] = useState(emptyForm);
  const [profileEditorClosing, setProfileEditorClosing] = useState(false);
  const [salesDateFilter, setSalesDateFilter] = useState(createDateFilter());
  const [movementDateFilter, setMovementDateFilter] = useState(createDateFilter());
  const [utilityDateFilter, setUtilityDateFilter] = useState(createDateFilter());
  const [selectedPrintNoteId, setSelectedPrintNoteId] = useState("");

  async function loadAll() {
    setState((value) => ({ ...value, loading: true }));
    try {
      const [cylinders, products, profiles, inventory, movements, salesNotes, operationalAlerts, utilitiesSummary] = await Promise.all([
        api("/api/cylinders"),
        api("/api/products"),
        api("/api/profiles"),
        api("/api/inventory/cylinders"),
        api("/api/inventory-movements"),
        api("/api/sales-notes"),
        api("/api/operational-alerts"),
        api("/api/utilities/summary")
      ]);
      setState((value) => ({
        ...value,
        cylinders,
        products,
        profiles,
        inventory,
        movements,
        salesNotes,
        operationalAlerts,
        utilitiesSummary,
        loading: false,
        utilitiesError: ""
      }));
    } catch (error) {
      setState((value) => ({ ...value, loading: false, message: error.message }));
    }
  }

  useEffect(() => {
    if (session) {
      loadAll();
    }
  }, [session?.accessToken]);

  useEffect(() => {
    if (!session?.profile?.id) return undefined;
    let cancelled = false;

    async function markCurrentProfileActive(refreshProfiles = false) {
      try {
        const updated = await api(`/api/profiles/${session.profile.id}/activity`, { method: "PATCH" });
        if (cancelled) return;
        setSession((current) => {
          if (!current || current.profile?.id !== updated.id) return current;
          const nextSession = { ...current, profile: updated };
          localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
          return nextSession;
        });
        setState((value) => ({
          ...value,
          profiles: value.profiles.map((profile) => (profile.id === updated.id ? updated : profile))
        }));
        if (refreshProfiles) {
          const profiles = await api("/api/profiles");
          if (!cancelled) {
            setState((value) => ({ ...value, profiles }));
          }
        }
      } catch {
        // Presence is best-effort; ordinary work should not be interrupted by a missed heartbeat.
      }
    }

    async function refreshProfilePresence() {
      try {
        const profiles = await api("/api/profiles");
        if (!cancelled) {
          setState((value) => ({ ...value, profiles }));
        }
      } catch {
        // The next heartbeat or manual page refresh will recover the activity list.
      }
    }

    markCurrentProfileActive(true);
    const heartbeat = window.setInterval(() => markCurrentProfileActive(false), PRESENCE_HEARTBEAT_MS);
    const profileRefresh = window.setInterval(refreshProfilePresence, PROFILE_REFRESH_MS);
    const handleFocus = () => markCurrentProfileActive(true);
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        markCurrentProfileActive(true);
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      cancelled = true;
      window.clearInterval(heartbeat);
      window.clearInterval(profileRefresh);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [session?.profile?.id]);

  useEffect(() => {
    if (!welcomeVisible) return undefined;
    const timeout = window.setTimeout(() => setWelcomeVisible(false), 2600);
    return () => window.clearTimeout(timeout);
  }, [welcomeVisible]);

  const metrics = useMemo(() => {
    const inPlant = state.inventory.filter((item) => item.currentLocationType === MAIN_WAREHOUSE).length;
    const inCustomer = state.inventory.filter((item) => item.currentLocationType === "CLIENTE").length;
    const customers = new Set(
      state.inventory
        .filter((item) => item.currentLocationType === "CLIENTE" && item.currentCustomerName)
        .map((item) => item.currentCustomerName.toLowerCase())
    ).size;
    return { inPlant, inCustomer, customers, products: state.products.length };
  }, [state.inventory, state.products]);

  async function searchInventory(nextFilters = filters) {
    const params = new URLSearchParams();
    Object.entries(nextFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    const inventory = await api(`/api/inventory/cylinders${params.toString() ? `?${params}` : ""}`);
    setState((value) => ({ ...value, inventory }));
  }

  async function searchCustomer() {
    if (!customerQuery.trim()) return;
    const customerSummary = await api(`/api/inventory/customers/${encodeURIComponent(customerQuery.trim())}/cylinders`);
    setState((value) => ({ ...value, customerSummary }));
  }

  async function searchSalesNotes(nextFilter = salesDateFilter) {
    const salesNotes = await api(`/api/sales-notes${buildDateQuery(nextFilter)}`);
    setState((value) => ({ ...value, salesNotes }));
  }

  async function searchMovements(nextFilter = movementDateFilter) {
    const movements = await api(`/api/inventory-movements${buildDateQuery(nextFilter)}`);
    setState((value) => ({ ...value, movements }));
  }

  async function loadUtilities(nextFilter = utilityDateFilter) {
    setState((value) => ({ ...value, utilitiesLoading: true, utilitiesError: "" }));
    try {
      const utilitiesSummary = await api(`/api/utilities/summary${buildDateQuery(nextFilter)}`);
      setState((value) => ({ ...value, utilitiesSummary, utilitiesLoading: false }));
    } catch (error) {
      setState((value) => ({ ...value, utilitiesLoading: false, utilitiesError: error.message }));
    }
  }

  async function createCylinder(event) {
    event.preventDefault();
    const form = forms.cylinder;
    await runAction(async () => {
      await api(form.id ? `/api/cylinders/${form.id}` : "/api/cylinders", {
        method: form.id ? "PATCH" : "POST",
        body: {
          serialNumber: form.serialNumber,
          capacityM3: Number(form.capacityM3),
          owner: form.owner,
          price: form.price === "" ? null : Number(form.price),
          ownerType: form.ownerType
        }
      });
      setForms((value) => ({ ...value, cylinder: { ...emptyForm.cylinder } }));
      await loadAll();
      notify(form.id ? "Cilindro actualizado correctamente." : "Cilindro creado correctamente.");
    });
  }

  async function createProduct(event) {
    event.preventDefault();
    const form = forms.product;
    await runAction(async () => {
      await api(form.id ? `/api/products/${form.id}` : "/api/products", {
        method: form.id ? "PATCH" : "POST",
        body: {
          code: form.code,
          name: form.name,
          description: form.description || null
        }
      });
      setForms((value) => ({ ...value, product: emptyForm.product }));
      await loadAll();
      notify(form.id ? "Producto actualizado correctamente." : "Producto creado correctamente.");
    });
  }

  async function createProfile(event) {
    event.preventDefault();
    const form = forms.profile;
    await runAction(async () => {
      await api("/api/profiles", {
        method: "POST",
        body: {
          fullName: form.fullName,
          username: form.username,
          password: form.password,
          roleName: form.roleName,
          active: form.active !== false
        }
      });
      setForms((value) => ({ ...value, profile: { ...emptyForm.profile } }));
      await loadProfiles();
      notify("Perfil creado correctamente.");
    });
  }

  async function updateProfile(event) {
    event.preventDefault();
    const form = forms.profileEditor;
    await runAction(async () => {
      const savedProfile = await api(`/api/profiles/${form.id}`, {
        method: "PUT",
        body: {
          fullName: form.fullName,
          username: form.username,
          password: form.password,
          roleName: form.roleName,
          active: form.active !== false
        }
      });
      if (session?.profile?.id === savedProfile.id) {
        const nextSession = { ...session, profile: savedProfile };
        localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
        setSession(nextSession);
      }
      await loadProfiles();
      notify("Perfil actualizado correctamente.");
      closeProfileEditor();
    });
  }

  async function login(event) {
    event.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const nextSession = await api("/api/iam/login", {
        method: "POST",
        body: loginForm
      });
      localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
      setSession(nextSession);
      setWelcomeVisible(true);
      setLoginForm(emptyLoginForm);
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setLoginLoading(false);
    }
  }

  function logout() {
    if (session?.profile?.id) {
      api(`/api/profiles/${session.profile.id}/offline`, { method: "PATCH" }).catch(() => {});
    }
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
    setWelcomeVisible(false);
    setActive("dashboard");
    setState((value) => ({ ...value, loading: true, message: "" }));
  }

  async function loadProfiles() {
    const profiles = await api("/api/profiles");
    setState((value) => ({ ...value, profiles }));
  }

  async function createSale(event) {
    event.preventDefault();
    const form = forms.sale;
    if (form.id) {
      await runAction(async () => {
        await api(`/api/sales-notes/${form.id}`, {
          method: "PATCH",
          body: {
            customerName: form.customerName,
            noteDate: form.noteDate,
            observations: form.observations || null,
            utilityAmount: moneyInputValue(form.utilityAmount)
          }
        });
        setForms((value) => ({ ...value, sale: newSaleForm() }));
        await loadAll();
        notify("Nota actualizada correctamente.");
      });
      return;
    }

    const deliveredCylinders = (form.deliveredCylinders || [])
      .filter((line) => line.cylinderNumber && line.productId)
      .map((line) => {
        const cylinder = findCylinderByNumber(state.cylinders, line.cylinderNumber);
        return {
          cylinderId: cylinder?.id,
          productId: Number(line.productId),
          capacityM3: line.capacityM3 === "" ? cylinder?.capacityM3 ?? null : Number(line.capacityM3),
          ownerName: line.ownerName || cylinder?.owner || null,
          observations: line.observations || null
        };
      });
    const collectedCylinders = (form.collectedCylinders || [])
      .filter((line) => line.cylinderNumber && line.productId)
      .map((line) => {
        const cylinder = findCylinderByNumber(state.cylinders, line.cylinderNumber);
        return {
          cylinderId: cylinder?.id,
          productId: Number(line.productId),
          capacityM3: line.capacityM3 === "" ? cylinder?.capacityM3 ?? null : Number(line.capacityM3),
          ownerName: line.ownerName || cylinder?.owner || null,
          observations: line.observations || null
        };
      });
    if (!deliveredCylinders.length && !collectedCylinders.length) {
      notify("La nota debe tener al menos un cilindro entregado o recogido.");
      return;
    }
    const unresolved = [...deliveredCylinders, ...collectedCylinders].some((line) => !line.cylinderId);
    if (unresolved) {
      notify("Uno o más números de cilindro no existen en el registro.");
      return;
    }
    const repeated = findRepeatedCylinder([...deliveredCylinders, ...collectedCylinders]);
    if (repeated) {
      notify(`El cilindro ${repeated} está repetido en la nota.`);
      return;
    }
    await runAction(async () => {
      await api("/api/sales-notes", {
        method: "POST",
        body: {
          noteNumber: form.noteNumber,
          customerName: form.customerName,
          noteDate: form.noteDate,
          observations: form.observations || null,
          utilityAmount: moneyInputValue(form.utilityAmount),
          deliveredCylinders,
          collectedCylinders
        }
      });
      setForms((value) => ({ ...value, sale: newSaleForm() }));
        await loadAll();
      await loadUtilities(utilityDateFilter);
      notify("Nota de venta registrada.");
    });
  }

  async function deleteProduct(product) {
    if (!window.confirm(`¿Eliminar producto ${product.name}? Se desactivará para nuevas operaciones.`)) return;
    await runAction(async () => {
      await api(`/api/products/${product.id}`, { method: "DELETE" });
      await loadAll();
      notify("Producto eliminado correctamente.");
    });
  }

  async function deleteCylinder(cylinder) {
    if (!window.confirm(`¿Eliminar cilindro ${cylinder.serialNumber}? Se desactivará para nuevas operaciones.`)) return;
    await runAction(async () => {
      await api(`/api/cylinders/${cylinder.id}`, { method: "DELETE" });
      await loadAll();
      notify("Cilindro eliminado correctamente.");
    });
  }

  async function deleteProfile(profile) {
    if (session?.profile?.id === profile.id) {
      notify("No puedes eliminar el perfil de la sesión actual.");
      return;
    }
    if (!window.confirm(`¿Eliminar perfil ${profile.fullName}?`)) return;
    await runAction(async () => {
      await api(`/api/profiles/${profile.id}`, { method: "DELETE" });
      setForms((value) => ({
        ...value,
        profileEditor: value.profileEditor.id === profile.id ? { ...emptyForm.profileEditor } : value.profileEditor
      }));
      await loadProfiles();
      notify("Perfil eliminado correctamente.");
    });
  }

  async function cancelSale(note) {
    if (!window.confirm("Esta nota generó movimientos de inventario. Al anularla se registrarán movimientos inversos.")) return;
    await runAction(async () => {
      await api(`/api/sales-notes/${note.id}/cancel`, { method: "PATCH" });
      await loadAll();
      await loadUtilities(utilityDateFilter);
      notify("Nota anulada correctamente.");
    });
  }

  function editProduct(product) {
    setForms((value) => ({ ...value, product: { id: product.id, code: product.code, name: product.name, description: product.description || "" } }));
  }

  function editCylinder(cylinder) {
    setForms((value) => ({
      ...value,
      cylinder: {
        id: cylinder.id,
        serialNumber: cylinder.serialNumber,
        capacityM3: cylinder.capacityM3,
        owner: cylinder.owner,
        price: cylinder.price ?? "",
        ownerType: cylinder.ownerType
      }
    }));
  }

  function editProfile(profile) {
    setProfileEditorClosing(false);
    setForms((value) => ({
      ...value,
      profileEditor: {
        id: profile.id,
        fullName: profile.fullName,
        username: profile.username || "",
        password: "",
        roleName: profile.roleName || "OPERADOR",
        active: profile.active !== false
      }
    }));
  }

  function closeProfileEditor() {
    if (!forms.profileEditor.id || profileEditorClosing) return;
    setProfileEditorClosing(true);
    window.setTimeout(() => {
      setForms((value) => ({ ...value, profileEditor: { ...emptyForm.profileEditor } }));
      setProfileEditorClosing(false);
    }, PROFILE_EDITOR_CLOSE_MS);
  }

  function editSale(note) {
    if (note.status === "CANCELLED") {
      notify("No se puede editar una nota anulada.");
      return;
    }
    setForms((value) => ({
      ...value,
      sale: {
        id: note.id,
        noteNumber: note.noteNumber,
        customerName: note.customerName,
        noteDate: note.noteDate?.slice(0, 16) || new Date().toISOString().slice(0, 16),
        observations: note.observations || "",
        utilityAmount: note.utilityAmount ?? "",
        deliveredCylinders: [{ ...emptyDeliveredLine }],
        collectedCylinders: [{ ...emptyCollectedLine }]
      }
    }));
  }

  async function runAction(action) {
    try {
      await action();
    } catch (error) {
      notify(error.message);
    }
  }

  function notify(message) {
    setState((value) => ({ ...value, message }));
    window.setTimeout(() => setState((value) => ({ ...value, message: "" })), 3000);
  }

  if (!session) {
    return (
      <LoginView
        form={loginForm}
        setForm={setLoginForm}
        onSubmit={login}
        loading={loginLoading}
        error={loginError}
      />
    );
  }

  if (welcomeVisible) {
    return <WelcomeScreen name={session?.profile?.fullName || session?.profile?.username || "usuario"} />;
  }

  const page = {
    dashboard: (
      <Dashboard
        metrics={metrics}
        inventory={state.inventory}
        movements={state.movements}
        operationalAlerts={state.operationalAlerts}
        movementDateFilter={movementDateFilter}
        setMovementDateFilter={setMovementDateFilter}
        searchMovements={searchMovements}
      />
    ),
    inventory: (
      <InventoryView
        filters={filters}
        setFilters={setFilters}
        searchInventory={searchInventory}
        inventory={state.inventory}
        customerQuery={customerQuery}
        setCustomerQuery={setCustomerQuery}
        searchCustomer={searchCustomer}
        customerSummary={state.customerSummary}
      />
    ),
    sales: (
      <SalesView
        forms={forms}
        setForms={setForms}
        createSale={createSale}
        cylinders={state.cylinders}
        products={state.products}
        salesNotes={state.salesNotes}
        editSale={editSale}
        cancelSale={cancelSale}
        salesDateFilter={salesDateFilter}
        setSalesDateFilter={setSalesDateFilter}
        searchSalesNotes={searchSalesNotes}
      />
    ),
    utilities: (
      <UtilitiesView
        summary={state.utilitiesSummary}
        loading={state.utilitiesLoading}
        error={state.utilitiesError}
        dateFilter={utilityDateFilter}
        setDateFilter={setUtilityDateFilter}
        loadUtilities={loadUtilities}
      />
    ),
    cylinders: <CylindersView forms={forms} setForms={setForms} createCylinder={createCylinder} cylinders={state.cylinders} editCylinder={editCylinder} deleteCylinder={deleteCylinder} />,
    products: <ProductsView forms={forms} setForms={setForms} createProduct={createProduct} products={state.products} editProduct={editProduct} deleteProduct={deleteProduct} />,
    profiles: <ProfilesView forms={forms} setForms={setForms} createProfile={createProfile} updateProfile={updateProfile} profiles={state.profiles} loadProfiles={loadProfiles} editProfile={editProfile} closeProfileEditor={closeProfileEditor} profileEditorClosing={profileEditorClosing} deleteProfile={deleteProfile} />,
    printing: <PrintingView salesNotes={state.salesNotes} selectedPrintNoteId={selectedPrintNoteId} setSelectedPrintNoteId={setSelectedPrintNoteId} printSaleNote={printSaleNote} />,
    profile: <ProfileView />
  }[active];

  const activeMeta = navItems.find((item) => item.id === active);

  return (
    <div className="appShell">
      <Sidebar active={active} setActive={setActive} />
      <main className="mainPane">
        <Topbar title={activeMeta.label} session={session} onLogout={logout} />
        <section className="workspace">
          {state.message && <div className="toast">{state.message}</div>}
          {state.loading ? <Skeleton /> : page}
        </section>
      </main>
    </div>
  );
}

function Sidebar({ active, setActive }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <img className="sidebarLogo" src="/oxipur-sidebar-logo.png" alt={BRAND_NAME} />
        <div>
          <strong>{BRAND_NAME}</strong>
          <span>Inventario operativo</span>
        </div>
      </div>
      <nav className="navList">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.id} className={active === item.id ? "navItem active" : "navItem"} onClick={() => setActive(item.id)}>
              <span className="navDot" />
              <Icon size={16} />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="sidebarFoot">
        <span>Empresa: {BRAND_NAME}</span>
        <span>Almacén: {MAIN_WAREHOUSE}</span>
      </div>
    </aside>
  );
}

function Topbar({ title, session, onLogout }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profile = session?.profile;
  const displayName = profile?.fullName || profile?.username || "Perfil";

  return (
    <header className="topbar">
      <div>
        <h1>{title}</h1>
        <p>Sistema de gestión de inventario</p>
      </div>
      <div className="sessionActions">
        <div className="profileMenu">
          <button
            className="profileMenuButton"
            type="button"
            onClick={() => setProfileOpen((value) => !value)}
            aria-expanded={profileOpen}
            aria-label="Ver informacion del perfil"
            title="Perfil"
          >
            <span className="onlineDot" />
            <UserRound size={18} />
            <span className="profileButtonName">{displayName}</span>
          </button>
          <div className={`profilePopover ${profileOpen ? "open" : ""}`} aria-hidden={!profileOpen}>
            <div className="profilePopoverHeader">
              <strong>{profile?.fullName || "Perfil"}</strong>
              <span>{profile?.online ? "En linea" : "Fuera de linea"}</span>
            </div>
            <div className="profilePopoverGrid">
              <span>Rol</span>
              <strong>{profile?.roleName || "IAM"}</strong>
              <span>Usuario</span>
              <strong>{profile?.username || "-"}</strong>
              <span>Empresa</span>
              <strong>{BRAND_NAME}</strong>
              <span>Ultima actividad</span>
              <strong>{formatDateTime(profile?.lastActivityAt)}</strong>
            </div>
          </div>
        </div>
        <button className="logout" type="button" onClick={onLogout}>Salir</button>
      </div>
    </header>
  );
}

function WelcomeScreen({ name }) {
  return (
    <main className="welcomeShell" role="status" aria-live="polite">
      <section className="welcomePanel">
        <img className="welcomeLogo" src="/oxipur-logo.png" alt={BRAND_NAME} />
        <span>Bienvenido,</span>
        <strong>{name}</strong>
      </section>
    </main>
  );
}

function LoginView({ form, setForm, onSubmit, loading, error }) {
  return (
    <main className="loginShell">
      <section className="loginPanel">
        <div className="loginBrand">
          <img className="loginLogo" src="/oxipur-logo.png" alt={BRAND_NAME} />
          <div>
            <strong>{BRAND_NAME}</strong>
            <span>Inventario operativo</span>
          </div>
        </div>
        <div className="loginIntro">
          <span>IAM SERVICE</span>
          <h1>Acceso al sistema</h1>
          <p>Ingresa con el usuario asignado para administrar inventario, notas de venta y utilidades.</p>
        </div>
        <form className="loginForm" onSubmit={onSubmit}>
          <Field label="Usuario">
            <input required value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} autoComplete="username" />
          </Field>
          <Field label="Contraseña">
            <input required type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} autoComplete="current-password" />
          </Field>
          {error && <div className="loginError">{error}</div>}
          <button className="primaryBtn loginButton" disabled={loading}>{loading ? "Validando..." : "Ingresar"}</button>
        </form>
      </section>
    </main>
  );
}

function Dashboard({ metrics, inventory, movements, operationalAlerts, movementDateFilter, setMovementDateFilter, searchMovements }) {
  const latest = movements.slice(-5).reverse();
  return (
    <>
      <PageIntro eyebrow="OPERACIÓN" title="Centro operativo" subtitle="Monitoreo de cilindros, clientes y movimientos recientes." />
      <div className="metricGrid">
        <Metric label={`En ${MAIN_WAREHOUSE}`} value={metrics.inPlant} icon={Warehouse} />
        <Metric label="En clientes" value={metrics.inCustomer} icon={ArrowUpFromLine} />
        <Metric label="Clientes con cilindros" value={metrics.customers} icon={UserRound} />
        <Metric label="Productos activos" value={metrics.products} icon={Package} />
      </div>
      <div className="splitGrid">
        <Card title="Alertas operativas">
          <StatusRow label="Cilindros de OXIPUR" value={operationalAlerts?.oxipurCylinderCount ?? 0} state="OK" />
          <StatusRow label="Cilindros fuera de planta" value={metrics.inCustomer} state={metrics.inCustomer > 0 ? "EN CURSO" : "OK"} />
          <StatusRow label="Cilindros sin ubicación" value={inventory.filter((item) => !item.currentLocationType).length} state="REVISAR" />
          <StatusRow label="Movimientos registrados" value={movements.length} state="OK" />
        </Card>
        <Card title="Movimientos recientes">
          <DatePeriodFilter
            value={movementDateFilter}
            onChange={setMovementDateFilter}
            onApply={searchMovements}
            onClear={searchMovements}
          />
          <DataTable
            columns={["Tipo", "Cilindro", "Cliente", "Fecha"]}
            rows={latest.map((movement) => [
              movement.movementType,
              movement.cylinderId,
              movement.destinationCustomerName || movement.originCustomerName || "-",
              movement.movementDate
            ])}
            empty="Sin movimientos registrados"
          />
        </Card>
      </div>
    </>
  );
}

function InventoryView({ filters, setFilters, searchInventory, inventory, customerQuery, setCustomerQuery, searchCustomer, customerSummary }) {
  return (
    <>
      <PageIntro eyebrow="INVENTARIO" title="Ubicación de cilindros" subtitle="Busca cilindros por planta, cliente o número de serie." />
      <Card title="Filtros de búsqueda">
        <div className="formGrid four">
          <Field label="Ubicación">
            <select value={filters.locationType} onChange={(event) => setFilters({ ...filters, locationType: event.target.value })}>
              <option value="">Todas</option>
              <option value={MAIN_WAREHOUSE}>{MAIN_WAREHOUSE}</option>
              <option value="CLIENTE">CLIENTE</option>
            </select>
          </Field>
          <Field label="Cliente">
            <input value={filters.customerName} onChange={(event) => setFilters({ ...filters, customerName: event.target.value })} placeholder="Nombre del cliente" />
          </Field>
          <Field label="Serie">
            <input value={filters.serialNumber} onChange={(event) => setFilters({ ...filters, serialNumber: event.target.value })} placeholder="CYL-001" />
          </Field>
          <div className="buttonField">
            <button className="primaryBtn" onClick={() => searchInventory()}>Buscar</button>
          </div>
        </div>
      </Card>
      <div className="splitGrid">
        <Card title="Cilindros encontrados">
          <DataTable
            columns={["Serie", "m3", "Ubicación", "Cliente", "Última nota", "Fecha"]}
            rows={inventory.map((item) => [
              item.serialNumber,
              item.capacityM3,
              item.currentLocationType || "-",
              item.currentCustomerName || "-",
              item.lastDeliveryNoteNumber || "-",
              item.lastDeliveryDate || item.locationDate || "-"
            ])}
            empty="Sin cilindros para los filtros seleccionados"
          />
        </Card>
        <Card title="Resumen por cliente">
          <div className="inlineSearch">
            <Search size={18} />
            <input value={customerQuery} onChange={(event) => setCustomerQuery(event.target.value)} placeholder="Buscar cliente exacto" />
            <button className="secondaryBtn" onClick={searchCustomer}>Consultar</button>
          </div>
          {customerSummary ? (
            <div className="customerSummary">
              <div>
                <span>Cliente</span>
                <strong>{customerSummary.customerName}</strong>
              </div>
              <div>
                <span>Cilindros en poder</span>
                <strong>{customerSummary.totalCylinders}</strong>
              </div>
              <DataTable
                columns={["Serie", "m3", "Entregado", "Nota"]}
                rows={customerSummary.cylinders.map((item) => [item.serialNumber, item.capacityM3, item.deliveredAt || "-", item.salesNoteNumber || "-"])}
                empty="Este cliente no tiene cilindros registrados"
              />
            </div>
          ) : (
            <EmptyState title="Sin consulta" text="Ingresa un cliente para ver sus cilindros actuales." />
          )}
        </Card>
      </div>
    </>
  );
}

function SalesView({ forms, setForms, createSale, cylinders, products, salesNotes, editSale, cancelSale, salesDateFilter, setSalesDateFilter, searchSalesNotes }) {
  const form = forms.sale;
  const plantCylinders = cylinders.filter((item) => item.currentLocationType === MAIN_WAREHOUSE);
  const customerCylinders = cylinders.filter(
    (item) => form.customerName.trim() && item.currentLocationType === "CLIENTE" && sameText(item.currentCustomerName, form.customerName)
  );
  const activeProducts = products.filter((item) => item.active !== false);
  return (
    <>
      <PageIntro eyebrow="VENTAS" title="Notas de venta" subtitle="Registra entregas y recojos; el backend genera los movimientos." />
      <Card title={form.id ? "Editar nota" : "Nueva nota"}>
        <div className="salesComposer">
          <form onSubmit={createSale}>
            <div className="formGrid five">
              <Field label="Número">
                <input required disabled={Boolean(form.id)} value={form.noteNumber} onChange={(event) => setNested(setForms, "sale", "noteNumber", event.target.value)} placeholder="NV-001" />
              </Field>
              <Field label="Cliente">
                <input required value={form.customerName} onChange={(event) => setNested(setForms, "sale", "customerName", event.target.value)} placeholder="Cliente" />
              </Field>
              <Field label="Fecha">
                <input required type="datetime-local" value={form.noteDate} onChange={(event) => setNested(setForms, "sale", "noteDate", event.target.value)} />
              </Field>
              <Field label="Utilidad (Bs)">
                <input type="number" min="0" step="0.01" value={form.utilityAmount} onChange={(event) => setNested(setForms, "sale", "utilityAmount", event.target.value)} placeholder="0.00" />
              </Field>
              <Field label="Observación">
                <input value={form.observations} onChange={(event) => setNested(setForms, "sale", "observations", event.target.value)} placeholder="Detalle opcional" />
              </Field>
            </div>
            {form.id ? (
              <div className="notice">Editando datos generales. Para corregir cilindros, anula la nota y registra una nueva.</div>
            ) : (
              <>
                <LineSection title="Cilindros entregados" icon={ArrowUpFromLine} lines={form.deliveredCylinders} onAdd={() => addSaleLine(setForms, "deliveredCylinders", emptyDeliveredLine)}>
                  {(line, index) => {
                    const selected = findCylinderByNumber(plantCylinders, line.cylinderNumber);
                    return (
                      <div className="lineGrid deliveredLine" key={index}>
                        <Field label="Nro. cilindro">
                          <input required type="number" min="1" step="1" value={line.cylinderNumber} onChange={(event) => {
                            const selectedCylinder = findCylinderByNumber(plantCylinders, event.target.value);
                            updateSaleLine(setForms, "deliveredCylinders", index, "cylinderNumber", event.target.value, {
                              capacityM3: selectedCylinder?.capacityM3 ?? "",
                              ownerName: selectedCylinder?.owner ?? line.ownerName
                            });
                          }} placeholder="1001" />
                        </Field>
                        <Field label="Producto">
                          <select value={line.productId} onChange={(event) => updateSaleLine(setForms, "deliveredCylinders", index, "productId", event.target.value)}>
                            <option value="">Seleccionar</option>
                            {activeProducts.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                          </select>
                        </Field>
                        <Field label="Capacidad (m3)">
                          <input required type="number" min="0.01" step="0.01" value={line.capacityM3} onChange={(event) => updateSaleLine(setForms, "deliveredCylinders", index, "capacityM3", event.target.value)} placeholder={selected ? String(selected.capacityM3) : "0.00"} />
                        </Field>
                        <Field label="Propiedad">
                          <input required value={line.ownerName} onChange={(event) => updateSaleLine(setForms, "deliveredCylinders", index, "ownerName", event.target.value)} placeholder={selected?.owner || "Dueño del cilindro"} />
                        </Field>
                        <Field label="Observación">
                          <input value={line.observations} onChange={(event) => updateSaleLine(setForms, "deliveredCylinders", index, "observations", event.target.value)} />
                        </Field>
                        <IconButton title="Quitar línea" onClick={() => removeSaleLine(setForms, "deliveredCylinders", index, emptyDeliveredLine)} icon={X} />
                      </div>
                    );
                  }}
                </LineSection>
                <LineSection title="Cilindros recogidos" icon={ArrowDownToLine} lines={form.collectedCylinders} onAdd={() => addSaleLine(setForms, "collectedCylinders", emptyCollectedLine)}>
                  {(line, index) => {
                    const selected = findCylinderByNumber(customerCylinders, line.cylinderNumber);
                    return (
                      <div className="lineGrid collectedLine" key={index}>
                        <Field label="Nro. cilindro">
                          <input required type="number" min="1" step="1" value={line.cylinderNumber} onChange={(event) => {
                            const selectedCylinder = findCylinderByNumber(customerCylinders, event.target.value);
                            updateSaleLine(setForms, "collectedCylinders", index, "cylinderNumber", event.target.value, {
                              capacityM3: selectedCylinder?.capacityM3 ?? "",
                              ownerName: selectedCylinder?.owner ?? line.ownerName
                            });
                          }} placeholder="1001" />
                        </Field>
                        <Field label="Producto">
                          <select value={line.productId} onChange={(event) => updateSaleLine(setForms, "collectedCylinders", index, "productId", event.target.value)}>
                            <option value="">Seleccionar</option>
                            {activeProducts.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                          </select>
                        </Field>
                        <Field label="Capacidad (m3)">
                          <input required type="number" min="0.01" step="0.01" value={line.capacityM3} onChange={(event) => updateSaleLine(setForms, "collectedCylinders", index, "capacityM3", event.target.value)} placeholder={selected ? String(selected.capacityM3) : "0.00"} />
                        </Field>
                        <Field label="Propiedad">
                          <input required value={line.ownerName} onChange={(event) => updateSaleLine(setForms, "collectedCylinders", index, "ownerName", event.target.value)} placeholder={selected?.owner || "Dueño del cilindro"} />
                        </Field>
                        <Field label="Observación">
                          <input value={line.observations} onChange={(event) => updateSaleLine(setForms, "collectedCylinders", index, "observations", event.target.value)} />
                        </Field>
                        <IconButton title="Quitar línea" onClick={() => removeSaleLine(setForms, "collectedCylinders", index, emptyCollectedLine)} icon={X} />
                      </div>
                    );
                  }}
                </LineSection>
              </>
            )}
            <div className="actionBar">
              <button className="primaryBtn">{form.id ? "Guardar cambios" : "Crear nota"}</button>
              {form.id && <button type="button" className="secondaryBtn" onClick={() => setForms((value) => ({ ...value, sale: newSaleForm() }))}>Cancelar edición</button>}
            </div>
          </form>
        </div>
        <SalePreview form={form} cylinders={cylinders} products={products} />
      </Card>
      <Card title="Notas registradas">
        <DatePeriodFilter
          value={salesDateFilter}
          onChange={setSalesDateFilter}
          onApply={searchSalesNotes}
          onClear={searchSalesNotes}
        />
        <DataTable
          columns={["Número", "Cliente", "Fecha", "Utilidad", "Estado", "Entregados", "Recogidos", "Acciones"]}
          rows={salesNotes.map((note) => [
            note.noteNumber,
            note.customerName,
            formatDateTime(note.noteDate),
            money(note.utilityAmount),
            note.status === "CANCELLED" ? <span className="dangerBadge">ANULADA</span> : "REGISTERED",
            formatLineSummary(note.deliveredCylinders),
            formatLineSummary(note.collectedCylinders),
            <div className="rowActions">
              <IconButton title="Ver detalle" onClick={() => showSaleDetail(note)} icon={Eye} />
              <IconButton title="Editar datos generales" onClick={() => editSale(note)} icon={Edit3} disabled={note.status === "CANCELLED"} />
              <IconButton title="Anular nota" onClick={() => cancelSale(note)} icon={Trash2} disabled={note.status === "CANCELLED"} />
            </div>
          ])}
          empty="Sin notas registradas"
        />
      </Card>
    </>
  );
}

function UtilitiesView({ summary, loading, error, dateFilter, setDateFilter, loadUtilities }) {
  const label = periodResultLabel(summary?.dateFilterType);
  return (
    <>
      <PageIntro eyebrow="UTILIDADES" title="Utilidades" subtitle="Resumen de utilidad generada por notas de venta registradas." />
      <Card title="Filtros">
        <DatePeriodFilter
          value={dateFilter}
          onChange={setDateFilter}
          onApply={loadUtilities}
          onClear={loadUtilities}
        />
      </Card>
      <div className="metricGrid utilityMetrics">
        <Metric label={label} value={loading ? "..." : money(summary?.totalUtility ?? 0)} icon={Activity} />
        <Metric label="Notas consideradas" value={summary?.salesNotesCount ?? 0} icon={ClipboardList} />
        <Metric label="Moneda" value={summary?.currency || "Bs"} icon={Package} />
      </div>
      {error && <div className="notice dangerNotice">{error}</div>}
      <Card title="Detalle del periodo">
        {loading ? (
          <Skeleton />
        ) : summary ? (
          <div className="utilityDetail">
            <StatusRow label="Desde" value={summary.fromDate ? formatDateTime(summary.fromDate) : "Sin filtro"} state="INFO" />
            <StatusRow label="Hasta" value={summary.toDate ? formatDateTime(summary.toDate) : "Sin filtro"} state="INFO" />
            <StatusRow label="Notas de venta activas" value={summary.salesNotesCount} state={summary.salesNotesCount > 0 ? "OK" : "SIN DATOS"} />
          </div>
        ) : (
          <EmptyState title="Sin datos" text="No hay resumen de utilidades disponible." />
        )}
      </Card>
    </>
  );
}

function PrintingView({ salesNotes, selectedPrintNoteId, setSelectedPrintNoteId, printSaleNote }) {
  const selectedNote = salesNotes.find((note) => String(note.id) === String(selectedPrintNoteId));
  return (
    <>
      <PageIntro eyebrow="IMPRESIÓN" title="Impresión" subtitle="Selecciona una nota de venta registrada para imprimirla." />
      <Card title="Notas disponibles">
        <div className="printingToolbar">
          <div>
            <span>Nota seleccionada</span>
            <strong>{selectedNote ? `${selectedNote.noteNumber} - ${selectedNote.customerName}` : "Ninguna"}</strong>
          </div>
          <button
            type="button"
            className="primaryBtn iconTextBtn"
            onClick={() => selectedNote && printSaleNote(selectedNote)}
            disabled={!selectedNote}
          >
            <Printer size={16} /> Imprimir nota
          </button>
        </div>
        <DataTable
          columns={["Seleccionar", "Número", "Cliente", "Fecha", "Estado", "Entregados", "Recogidos"]}
          rows={salesNotes.map((note) => [
            <label className="printSelect">
              <input
                type="radio"
                name="print-note"
                checked={String(selectedPrintNoteId) === String(note.id)}
                onChange={() => setSelectedPrintNoteId(String(note.id))}
              />
              <span />
            </label>,
            note.noteNumber,
            note.customerName,
            formatDateTime(note.noteDate),
            note.status === "CANCELLED" ? <span className="dangerBadge">ANULADA</span> : "REGISTERED",
            formatLineSummary(note.deliveredCylinders),
            formatLineSummary(note.collectedCylinders)
          ])}
          empty="Sin notas registradas para imprimir"
        />
      </Card>
    </>
  );
}

function SalePreview({ form, cylinders, products }) {
  const delivered = previewDeliveredLines(form.deliveredCylinders, cylinders, products);
  const collected = previewCollectedLines(form.collectedCylinders, cylinders, products);
  const deliveredCapacity = sumCapacity(delivered);
  const collectedCapacity = sumCapacity(collected);
  return (
    <aside className="salePreview">
      <h3>Vista previa de nota de venta</h3>
      <div className="previewMetaGrid">
        <div className="previewBlock">
          <span>Nota</span>
          <strong>{form.noteNumber || "Sin número"}</strong>
        </div>
        <div className="previewBlock">
          <span>Cliente</span>
          <strong>{form.customerName || "Cliente no seleccionado."}</strong>
        </div>
        <div className="previewBlock">
          <span>Fecha</span>
          <strong>{formatDateTime(form.noteDate) || "-"}</strong>
        </div>
        <div className="previewBlock">
          <span>Utilidad</span>
          <strong>{money(moneyInputValue(form.utilityAmount))}</strong>
        </div>
        <div className="previewBlock full">
          <span>Observación general</span>
          <p>{form.observations || "Sin observación general"}</p>
        </div>
      </div>
      <PreviewSection
        title="Cilindros entregados"
        empty="Aún no se agregaron cilindros entregados."
        rows={delivered.map((line, index) => [index + 1, line.serialNumber, line.productName, line.capacityM3 ? `${line.capacityM3} m3` : "-", line.ownerName || "-", line.observations || "-"])}
        columns={["Nro.", "Número de serie", "Producto", "Capacidad (m3)", "Propiedad", "Observación"]}
      />
      <PreviewSection
        title="Cilindros recogidos"
        empty="Aún no se agregaron cilindros recogidos."
        rows={collected.map((line, index) => [index + 1, line.serialNumber, line.productName, line.capacityM3 ? `${line.capacityM3} m3` : "-", line.ownerName || "-", line.observations || "-"])}
        columns={["Nro.", "Número de serie", "Producto", "Capacidad (m3)", "Propiedad", "Observación"]}
      />
      <div className="previewSummary">
        <span>Entregados: <strong>{delivered.length}</strong></span>
        <span>Recogidos: <strong>{collected.length}</strong></span>
        <span>Total cilindros: <strong>{delivered.length + collected.length}</strong></span>
        <span>Capacidad entregada: <strong>{formatNumber(deliveredCapacity)} m3</strong></span>
        <span>Capacidad recogida: <strong>{formatNumber(collectedCapacity)} m3</strong></span>
      </div>
    </aside>
  );
}

function PreviewSection({ title, columns, rows, empty }) {
  return (
    <div className="previewSection">
      <h4>{title}</h4>
      {rows.length ? <DataTable columns={columns} rows={rows} empty={empty} /> : <EmptyState title="Sin registros" text={empty} />}
    </div>
  );
}

function DatePeriodFilter({ value, onChange, onApply, onClear }) {
  function update(field, fieldValue) {
    onChange({ ...value, [field]: fieldValue });
  }

  function clear() {
    const next = createDateFilter();
    onChange(next);
    onClear(next);
  }

  return (
    <div className="dateFilter">
      <Field label="Tipo de fecha">
        <select value={value.dateFilterType} onChange={(event) => update("dateFilterType", event.target.value)}>
          <option value="">Sin filtro</option>
          <option value="DAY">Día</option>
          <option value="MONTH">Mes</option>
          <option value="YEAR">Año</option>
        </select>
      </Field>
      {value.dateFilterType === "DAY" && (
        <Field label="Fecha">
          <input type="date" value={value.date} onChange={(event) => update("date", event.target.value)} />
        </Field>
      )}
      {value.dateFilterType === "MONTH" && (
        <>
          <Field label="Mes">
            <select value={value.month} onChange={(event) => update("month", Number(event.target.value))}>
              {monthOptions.map((month) => <option key={month.value} value={month.value}>{month.label}</option>)}
            </select>
          </Field>
          <Field label="Año">
            <input type="number" min="2000" max="2100" value={value.year} onChange={(event) => update("year", Number(event.target.value))} />
          </Field>
        </>
      )}
      {value.dateFilterType === "YEAR" && (
        <Field label="Año">
          <input type="number" min="2000" max="2100" value={value.year} onChange={(event) => update("year", Number(event.target.value))} />
        </Field>
      )}
      <div className="dateFilterActions">
        <button type="button" className="primaryBtn" onClick={() => onApply(value)}>Aplicar</button>
        <button type="button" className="secondaryBtn" onClick={clear}>Limpiar</button>
      </div>
    </div>
  );
}

function CylindersView({ forms, setForms, createCylinder, cylinders, editCylinder, deleteCylinder }) {
  const form = forms.cylinder;
  return (
    <>
      <PageIntro eyebrow="CILINDROS" title="Cilindros" subtitle="Registra cilindros físicos y consulta su ubicación actual." />
      <Card title="Nuevo cilindro">
        <form onSubmit={createCylinder}>
          <div className="formGrid four">
            <Field label="Serie">
              <input required value={form.serialNumber} onChange={(event) => setNested(setForms, "cylinder", "serialNumber", event.target.value)} placeholder="CYL-001" />
            </Field>
            <Field label="Capacidad m3">
              <input required type="number" min="0.01" step="0.01" value={form.capacityM3} onChange={(event) => setNested(setForms, "cylinder", "capacityM3", event.target.value)} placeholder="6.00" />
            </Field>
            <Field label="Propietario">
              <input required value={form.owner} onChange={(event) => setNested(setForms, "cylinder", "owner", event.target.value)} />
            </Field>
            <Field label="Valor interno">
              <input type="number" min="0" step="0.01" value={form.price} onChange={(event) => setNested(setForms, "cylinder", "price", event.target.value)} placeholder="Opcional" />
            </Field>
          </div>
          <div className="actionBar">
            <button className="primaryBtn">{form.id ? "Guardar cilindro" : "Crear cilindro"}</button>
            {form.id && <button type="button" className="secondaryBtn" onClick={() => setForms((value) => ({ ...value, cylinder: { ...emptyForm.cylinder } }))}>Cancelar edición</button>}
          </div>
        </form>
      </Card>
      <Card title="Cilindros registrados">
        <DataTable
          columns={["Serie", "m3", "Estado", "Ubicación", "Cliente", "Valor", "Acciones"]}
          rows={cylinders.map((item) => [
            item.serialNumber,
            item.capacityM3,
            item.status,
            item.currentLocationType || "-",
            item.currentCustomerName || "-",
            money(item.price),
            <div className="rowActions">
              <IconButton title="Editar cilindro" onClick={() => editCylinder(item)} icon={Edit3} />
              <IconButton title="Eliminar cilindro" onClick={() => deleteCylinder(item)} icon={Trash2} />
            </div>
          ])}
          empty="Sin cilindros registrados"
        />
      </Card>
    </>
  );
}

function ProductsView({ forms, setForms, createProduct, products, editProduct, deleteProduct }) {
  const form = forms.product;
  return (
    <>
      <PageIntro eyebrow="CATÁLOGO" title="Productos" subtitle="Define los productos que se entregan dentro de los cilindros." />
      <Card title="Nuevo producto">
        <form onSubmit={createProduct}>
          <div className="formGrid three">
            <Field label="Código">
              <input required value={form.code} onChange={(event) => setNested(setForms, "product", "code", event.target.value)} placeholder="OX-MED" />
            </Field>
            <Field label="Nombre">
              <input required value={form.name} onChange={(event) => setNested(setForms, "product", "name", event.target.value)} placeholder="Oxígeno medicinal" />
            </Field>
            <Field label="Descripción">
              <input value={form.description} onChange={(event) => setNested(setForms, "product", "description", event.target.value)} placeholder="Detalle opcional" />
            </Field>
          </div>
          <div className="actionBar">
            <button className="primaryBtn">{form.id ? "Guardar producto" : "Crear producto"}</button>
            {form.id && <button type="button" className="secondaryBtn" onClick={() => setForms((value) => ({ ...value, product: emptyForm.product }))}>Cancelar edición</button>}
          </div>
        </form>
      </Card>
      <Card title="Productos registrados">
        <DataTable
          columns={["Código", "Nombre", "Descripción", "Estado", "Acciones"]}
          rows={products.map((item) => [
            item.code,
            item.name,
            item.description || "-",
            item.active ? "Activo" : "Inactivo",
            <div className="rowActions">
              <IconButton title="Editar producto" onClick={() => editProduct(item)} icon={Edit3} />
              <IconButton title="Eliminar producto" onClick={() => deleteProduct(item)} icon={Trash2} />
            </div>
          ])}
          empty="Sin productos registrados"
        />
      </Card>
    </>
  );
}

function ProfilesView({ forms, setForms, createProfile, updateProfile, profiles, loadProfiles, editProfile, closeProfileEditor, profileEditorClosing, deleteProfile }) {
  const form = forms.profile;
  const editor = forms.profileEditor;
  return (
    <>
      <PageIntro eyebrow="ADMIN" title="Perfiles" subtitle="Administración de perfiles y actividad reciente." />
      <Card title="Nuevo perfil">
        <form onSubmit={createProfile}>
          <div className="formGrid five">
            <Field label="Nombre">
              <input required value={form.fullName} onChange={(event) => setNested(setForms, "profile", "fullName", event.target.value)} placeholder="Nombre completo" />
            </Field>
            <Field label="Usuario">
              <input required value={form.username} onChange={(event) => setNested(setForms, "profile", "username", event.target.value)} placeholder="usuario" />
            </Field>
            <Field label="Contraseña">
              <input required type="password" value={form.password} onChange={(event) => setNested(setForms, "profile", "password", event.target.value)} placeholder="Temporal" />
            </Field>
            <Field label="Rol">
              <select required value={form.roleName} onChange={(event) => setNested(setForms, "profile", "roleName", event.target.value)}>
                <option value="ADMINISTRADOR">Administrador</option>
                <option value="OPERADOR">Operador</option>
              </select>
            </Field>
            <div className="buttonField">
              <button className="primaryBtn">Crear perfil</button>
            </div>
          </div>
        </form>
      </Card>
      <Card title="Actividad de perfiles">
        <div className="actionBar tableActionBar">
          <button type="button" className="secondaryBtn iconTextBtn" onClick={loadProfiles}><RefreshCw size={16} /> Actualizar</button>
        </div>
        <DataTable
          columns={["Nombre", "Usuario", "Rol", "Última actividad", "Estado", "Acciones"]}
          rows={profiles.map((profile) => [
            profile.fullName,
            profile.username || "-",
            profile.roleName,
            formatDateTime(profile.lastActivityAt),
            profile.online ? <span className="onlineBadge">EN LINEA</span> : <span className="offlineBadge">FUERA DE LINEA</span>,
            <div className="rowActions">
              <IconButton title="Editar perfil" onClick={() => editProfile(profile)} icon={Edit3} />
              <IconButton title="Eliminar perfil" onClick={() => deleteProfile(profile)} icon={Trash2} />
            </div>
          ])}
          empty="Sin perfiles registrados"
        />
      </Card>
      {editor.id && (
        <div className={`modalOverlay ${profileEditorClosing ? "closing" : "open"}`} onMouseDown={closeProfileEditor}>
          <section className="profileEditModal" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modalHeader">
              <div>
                <span>PERFIL</span>
                <h3>Editar perfil</h3>
              </div>
              <IconButton title="Cerrar" onClick={closeProfileEditor} icon={X} />
            </div>
            <form onSubmit={updateProfile}>
              <div className="formGrid two">
                <Field label="Nombre">
                  <input required value={editor.fullName} onChange={(event) => setNested(setForms, "profileEditor", "fullName", event.target.value)} placeholder="Nombre completo" />
                </Field>
                <Field label="Usuario">
                  <input required value={editor.username} onChange={(event) => setNested(setForms, "profileEditor", "username", event.target.value)} placeholder="usuario" />
                </Field>
                <Field label="Contraseña">
                  <input type="password" value={editor.password} onChange={(event) => setNested(setForms, "profileEditor", "password", event.target.value)} placeholder="Mantener actual" />
                </Field>
                <Field label="Rol">
                  <select required value={editor.roleName} onChange={(event) => setNested(setForms, "profileEditor", "roleName", event.target.value)}>
                    <option value="ADMINISTRADOR">Administrador</option>
                    <option value="OPERADOR">Operador</option>
                  </select>
                </Field>
              </div>
              <div className="actionBar modalActions">
                <button className="primaryBtn">Guardar cambios</button>
                <button type="button" className="secondaryBtn" onClick={closeProfileEditor}>Cancelar</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}

function ProfileView() {
  return (
    <>
      <PageIntro eyebrow="SESIÓN" title="Perfil" subtitle="Datos de trabajo para el MVP local." />
      <Card title="Contexto operativo">
        <div className="profileGrid">
          <div><span>Empresa</span><strong>{BRAND_NAME}</strong></div>
          <div><span>Rol</span><strong>ADMIN</strong></div>
          <div><span>Almacén</span><strong>{MAIN_WAREHOUSE}</strong></div>
          <div><span>API</span><strong>/api</strong></div>
        </div>
      </Card>
    </>
  );
}

function Metric({ label, value, icon: Icon }) {
  return (
    <div className="metricCard">
      <div className="metricIcon"><Icon size={16} /></div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function PageIntro({ eyebrow, title, subtitle }) {
  return (
    <div className="pageIntro">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <section className="card">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function PanelTitle({ icon: Icon, title }) {
  return (
    <div className="panelTitle">
      <Icon size={18} />
      <strong>{title}</strong>
    </div>
  );
}

function LineSection({ title, icon: Icon, lines, onAdd, children }) {
  const visibleIndex = Math.max((lines || []).length - 1, 0);
  const visibleLine = (lines || [])[visibleIndex];

  return (
    <div className="lineSection">
      <div className="lineSectionHead">
        <PanelTitle icon={Icon} title={title} />
        <button type="button" className="secondaryBtn iconTextBtn" onClick={onAdd}><Plus size={16} /> Agregar</button>
      </div>
      <div className="lineList">
        {visibleLine && children(visibleLine, visibleIndex)}
      </div>
    </div>
  );
}

function IconButton({ title, onClick, icon: Icon, disabled = false }) {
  return (
    <button type="button" className="iconBtn" title={title} onClick={onClick} disabled={disabled}>
      <Icon size={16} />
    </button>
  );
}

function DataTable({ columns, rows, empty }) {
  if (!rows.length) {
    return <EmptyState title="Sin registros" text={empty} />;
  }
  return (
    <div className="tableWrap">
      <table>
        <thead>
          <tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusRow({ label, value, state }) {
  return (
    <div className="statusRow">
      <div>
        <strong>{label}</strong>
        <span>Seguimiento operativo</span>
      </div>
      <b>{value}</b>
      <em>{state}</em>
    </div>
  );
}

function EmptyState({ title, text }) {
  return (
    <div className="emptyState">
      <span />
      <strong>{title}</strong>
      <p>{text}</p>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="skeletonGrid">
      <div />
      <div />
      <div />
    </div>
  );
}

function setNested(setForms, group, field, value) {
  setForms((current) => ({ ...current, [group]: { ...current[group], [field]: value } }));
}

function newSaleForm() {
  return {
    ...emptyForm.sale,
    noteNumber: "",
    noteDate: new Date().toISOString().slice(0, 16),
    deliveredCylinders: [{ ...emptyDeliveredLine }],
    collectedCylinders: [{ ...emptyCollectedLine }]
  };
}

function addSaleLine(setForms, field, template) {
  setForms((current) => ({
    ...current,
    sale: {
      ...current.sale,
      [field]: [...(current.sale[field] || []), { ...template }]
    }
  }));
}

function removeSaleLine(setForms, field, index, template) {
  setForms((current) => {
    const next = (current.sale[field] || []).filter((_, lineIndex) => lineIndex !== index);
    return {
      ...current,
      sale: {
        ...current.sale,
        [field]: next.length ? next : [{ ...template }]
      }
    };
  });
}

function updateSaleLine(setForms, field, index, key, value, extra = {}) {
  setForms((current) => {
    const next = [...(current.sale[field] || [])];
    next[index] = { ...next[index], [key]: value, ...extra };
    return { ...current, sale: { ...current.sale, [field]: next } };
  });
}

function createDateFilter() {
  const now = new Date();
  return {
    dateFilterType: "",
    date: todayDate(),
    month: now.getMonth() + 1,
    year: now.getFullYear()
  };
}

function buildDateQuery(filter) {
  if (!filter?.dateFilterType) return "";
  const params = new URLSearchParams();
  params.set("dateFilterType", filter.dateFilterType);
  if (filter.dateFilterType === "DAY") {
    params.set("date", filter.date);
  }
  if (filter.dateFilterType === "MONTH") {
    params.set("month", filter.month);
    params.set("year", filter.year);
  }
  if (filter.dateFilterType === "YEAR") {
    params.set("year", filter.year);
  }
  return `?${params.toString()}`;
}

function findRepeatedCylinder(lines) {
  const seen = new Set();
  for (const line of lines) {
    if (seen.has(line.cylinderId)) return line.cylinderId;
    seen.add(line.cylinderId);
  }
  return null;
}

function previewDeliveredLines(lines, cylinders, products) {
  return (lines || [])
    .map((line) => {
      const cylinder = findCylinderByNumber(cylinders, line.cylinderNumber);
      const product = findById(products, line.productId);
      return {
        serialNumber: line.cylinderNumber || cylinder?.serialNumber || "",
        productName: product?.name || "",
        capacityM3: Number(line.capacityM3 || cylinder?.capacityM3 || 0),
        ownerName: line.ownerName || cylinder?.owner || "",
        observations: line.observations
      };
    })
    .filter((line) => line.serialNumber || line.productName || line.observations);
}

function previewCollectedLines(lines, cylinders, products) {
  return (lines || [])
    .map((line) => {
      const cylinder = findCylinderByNumber(cylinders, line.cylinderNumber);
      const product = findById(products, line.productId);
      return {
        serialNumber: line.cylinderNumber || cylinder?.serialNumber || "",
        productName: product?.name || "",
        capacityM3: Number(line.capacityM3 || cylinder?.capacityM3 || 0),
        ownerName: line.ownerName || cylinder?.owner || "",
        observations: line.observations
      };
    })
    .filter((line) => line.serialNumber || line.productName || line.observations);
}

function findById(items, id) {
  return items.find((item) => String(item.id) === String(id));
}

function findCylinderByNumber(items, number) {
  const normalized = String(number || "").trim();
  if (!normalized) return undefined;
  return items.find((item) => String(item.serialNumber).trim() === normalized || String(item.id) === normalized);
}

function sameText(left, right) {
  return String(left || "").trim().toLowerCase() === String(right || "").trim().toLowerCase();
}

function sumCapacity(lines) {
  return lines.reduce((total, line) => total + Number(line.capacityM3 || 0), 0);
}

function formatLineSummary(lines = []) {
  if (!lines.length) return "0";
  return lines
    .map((line) => `${line.serialNumber || line.cylinderId} (${line.capacityM3 || "-"} m3, ${line.ownerName || "sin propiedad"})`)
    .join(", ");
}

function showSaleDetail(note) {
  const delivered = formatLineSummary(note.deliveredCylinders);
  const collected = formatLineSummary(note.collectedCylinders);
  const movements = (note.movements || []).map((movement) => movement.movementType).join(", ") || "Sin movimientos";
  window.alert(`Nota ${note.noteNumber}\nEstado: ${note.status}\nCliente: ${note.customerName}\nUtilidad: ${money(note.utilityAmount)}\n\nCilindros entregados: ${delivered}\nCilindros recogidos: ${collected}\n\nMovimientos: ${movements}`);
}

function printSaleNote(note) {
  const printWindow = window.open("", "_blank", "width=900,height=1100");
  if (!printWindow) {
    window.alert("El navegador bloqueó la ventana de impresión. Habilita ventanas emergentes para este sitio.");
    return;
  }

  const delivered = note.deliveredCylinders || [];
  const collected = note.collectedCylinders || [];
  const totalDeliveredCapacity = sumNoteCapacity(delivered);
  const totalCollectedCapacity = sumNoteCapacity(collected);
  const logoUrl = `${window.location.origin}/oxipur-sidebar-logo.png`;
  const statusText = note.status === "CANCELLED" ? "ANULADA" : "REGISTRADA";

  printWindow.document.open();
  printWindow.document.write(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Nota de entrega ${escapeHtml(note.noteNumber || "")}</title>
    <style>
      @page { size: letter; margin: 12mm; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        color: #111827;
        font-family: Arial, Helvetica, sans-serif;
        background: #f3f6f8;
      }
      .sheet {
        width: 190mm;
        min-height: 250mm;
        margin: 0 auto;
        padding: 12mm;
        background: #ffffff;
        border: 1px solid #cfdbe5;
      }
      .header {
        display: grid;
        grid-template-columns: 48mm 1fr 42mm;
        gap: 8mm;
        align-items: center;
        border-bottom: 2px solid #0b6d8e;
        padding-bottom: 7mm;
      }
      .logo {
        width: 42mm;
        height: auto;
      }
      h1 {
        margin: 0;
        text-align: center;
        color: #082f49;
        font-size: 22px;
        letter-spacing: 0;
      }
      .copy {
        margin-top: 2mm;
        text-align: center;
        color: #64748b;
        font-size: 11px;
        font-weight: 700;
      }
      .noteBox {
        border: 1px solid #94a3b8;
        border-radius: 4px;
        padding: 4mm;
        text-align: center;
      }
      .noteBox span,
      .field span,
      .summaryBox span {
        display: block;
        color: #64748b;
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
      }
      .noteBox strong {
        display: block;
        margin-top: 2mm;
        color: #0f172a;
        font-size: 18px;
      }
      .meta {
        display: grid;
        grid-template-columns: 1.5fr 1fr 0.8fr;
        gap: 4mm;
        margin-top: 8mm;
      }
      .field,
      .summaryBox {
        min-height: 16mm;
        border: 1px solid #cbd5e1;
        border-radius: 4px;
        padding: 3mm;
      }
      .field strong,
      .summaryBox strong {
        display: block;
        margin-top: 2mm;
        color: #111827;
        font-size: 13px;
      }
      .sectionTitle {
        margin: 8mm 0 3mm;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #082f49;
        font-size: 13px;
        font-weight: 800;
        text-transform: uppercase;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
        font-size: 11px;
      }
      th,
      td {
        border: 1px solid #94a3b8;
        padding: 2.2mm;
        vertical-align: top;
      }
      th {
        color: #0f172a;
        background: #eaf4f8;
        font-size: 10px;
        text-transform: uppercase;
      }
      td.empty {
        height: 12mm;
        color: #94a3b8;
        text-align: center;
      }
      .summary {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 4mm;
        margin-top: 8mm;
      }
      .observations {
        margin-top: 6mm;
        min-height: 20mm;
      }
      .signatures {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16mm;
        margin-top: 18mm;
      }
      .signature {
        padding-top: 14mm;
        border-top: 1px solid #111827;
        text-align: center;
        color: #334155;
        font-size: 11px;
        font-weight: 700;
      }
      .footer {
        margin-top: 8mm;
        border-top: 1px solid #cbd5e1;
        padding-top: 3mm;
        color: #64748b;
        font-size: 10px;
        text-align: center;
      }
      @media print {
        body { background: #ffffff; }
        .sheet { border: 0; width: auto; min-height: auto; margin: 0; padding: 0; }
      }
    </style>
  </head>
  <body>
    <main class="sheet">
      <header class="header">
        <img class="logo" src="${logoUrl}" alt="OXIPUR" />
        <div>
          <h1>NOTA DE ENTREGA</h1>
          <div class="copy">OXIPUR ORIENTE S.R.L.</div>
        </div>
        <div class="noteBox">
          <span>Nro. nota</span>
          <strong>${escapeHtml(note.noteNumber || "-")}</strong>
        </div>
      </header>
      <section class="meta">
        <div class="field"><span>Cliente</span><strong>${escapeHtml(note.customerName || "-")}</strong></div>
        <div class="field"><span>Fecha y hora</span><strong>${escapeHtml(formatDateTime(note.noteDate))}</strong></div>
        <div class="field"><span>Estado</span><strong>${escapeHtml(statusText)}</strong></div>
      </section>
      ${salePrintTable("Cilindros entregados", delivered)}
      ${salePrintTable("Cilindros recogidos", collected)}
      <section class="summary">
        <div class="summaryBox"><span>Total entregados</span><strong>${delivered.length}</strong></div>
        <div class="summaryBox"><span>Total recogidos</span><strong>${collected.length}</strong></div>
        <div class="summaryBox"><span>Capacidad total</span><strong>${formatCapacity(totalDeliveredCapacity + totalCollectedCapacity)} m3</strong></div>
      </section>
      <div class="field observations"><span>Observaciones</span><strong>${escapeHtml(note.observations || "-")}</strong></div>
      <section class="signatures">
        <div class="signature">Entregado por</div>
        <div class="signature">Recibido por</div>
      </section>
      <footer class="footer">Documento generado desde el sistema de gestión de inventario OXIPUR ORIENTE S.R.L.</footer>
    </main>
    <script>
      window.addEventListener("load", () => {
        window.setTimeout(() => {
          window.print();
        }, 350);
      });
    </script>
  </body>
</html>`);
  printWindow.document.close();
}

function salePrintTable(title, lines) {
  return `<section>
    <div class="sectionTitle">
      <span>${escapeHtml(title)}</span>
      <span>${lines.length} registro(s)</span>
    </div>
    <table>
      <thead>
        <tr>
          <th style="width: 10mm;">Nro.</th>
          <th style="width: 28mm;">Cilindro</th>
          <th>Producto</th>
          <th style="width: 24mm;">Capacidad</th>
          <th>Propiedad</th>
          <th>Observacion</th>
        </tr>
      </thead>
      <tbody>
        ${lines.length ? lines.map((line, index) => salePrintRow(line, index)).join("") : `<tr><td class="empty" colspan="6">Sin registros</td></tr>`}
      </tbody>
    </table>
  </section>`;
}

function salePrintRow(line, index) {
  return `<tr>
    <td>${index + 1}</td>
    <td>${escapeHtml(line.serialNumber || line.cylinderId || "-")}</td>
    <td>${escapeHtml(line.productName || line.productId || "-")}</td>
    <td>${escapeHtml(formatCapacity(line.capacityM3))} m3</td>
    <td>${escapeHtml(line.ownerName || "-")}</td>
    <td>${escapeHtml(line.observations || "-")}</td>
  </tr>`;
}

function sumNoteCapacity(lines) {
  return lines.reduce((total, line) => total + Number(line.capacityM3 || 0), 0);
}

function formatCapacity(value) {
  const number = Number(value || 0);
  return Number.isInteger(number) ? String(number) : number.toFixed(2);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function api(path, options = {}) {
  const session = readStoredSession();
  const headers = options.body ? { "Content-Type": "application/json" } : {};
  if (session?.accessToken) {
    headers.Authorization = `${session.tokenType || "Bearer"} ${session.accessToken}`;
  }
  const response = await fetch(path, {
    method: options.method || "GET",
    headers: Object.keys(headers).length ? headers : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(readErrorMessage(text, response.status));
  }
  if (response.status === 204) return null;
  return response.json();
}

function readStoredSession() {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function readErrorMessage(text, status) {
  if (!text) return `Error ${status}`;
  try {
    const parsed = JSON.parse(text);
    return parsed.error || parsed.message || `Error ${status}`;
  } catch {
    return `Error ${status}`;
  }
}

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

function formatDateTime(value) {
  if (!value) return "-";
  return value.replace("T", " ").slice(0, 16);
}

function moneyInputValue(value) {
  if (value === null || value === undefined || value === "") return 0;
  return Number(value);
}

function money(value) {
  if (value === null || value === undefined || value === "") return "-";
  return Number(value).toLocaleString("es-BO", { style: "currency", currency: "BOB" });
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString("es-BO", { maximumFractionDigits: 2 });
}

function periodResultLabel(type) {
  if (type === "DAY") return "Utilidad generada el día seleccionado";
  if (type === "MONTH") return "Utilidad generada en el mes seleccionado";
  if (type === "YEAR") return "Utilidad generada en el año seleccionado";
  return "Utilidad total generada";
}

createRoot(document.getElementById("root")).render(<App />);
