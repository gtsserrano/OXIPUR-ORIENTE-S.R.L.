import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import {
  Activity,
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
  ChevronDown,
  ClipboardList,
  ContactRound,
  Edit3,
  Eye,
  Gauge,
  LayoutDashboard,
  Banknote,
  Package,
  Plus,
  Printer,
  RefreshCw,
  Trash2,
  UserRound,
  Users,
  Warehouse,
  X
} from "lucide-react";
import "./styles.css";

const BRAND_NAME = "OXIPUR ORIENTE S.R.L.";
const BRAND_OWNER_NAME = "OXIPUR";
const MAIN_WAREHOUSE = "PLANTA";
const SESSION_KEY = "oxipur_iam_session";
const LAST_ACTIVITY_KEY = "oxipur_last_activity";
const AUTH_EXPIRED_EVENT = "oxipur_auth_expired";
const INACTIVITY_TIMEOUT_MS = 60 * 60 * 1000;
const PRESENCE_HEARTBEAT_MS = 30000;
const PROFILE_REFRESH_MS = 30000;
const PROFILE_EDITOR_CLOSE_MS = 180;
const CYLINDER_EDITOR_CLOSE_MS = 180;
const DETAIL_MODAL_CLOSE_MS = 180;
const SALE_NOTE_TEMPLATE_URL = "/formato-nota-entrega.pdf";
const SALE_NOTE_TEMPLATE_PAGE_INDEX = 1;
const SALE_NOTE_ROWS_PER_PAGE = 16;

const navItems = [
  { id: "dashboard", label: "Centro operativo", icon: LayoutDashboard },
  { id: "inventory", label: "Inventario", icon: Boxes },
  { id: "clients", label: "Clientes", icon: ContactRound },
  {
    id: "sales",
    label: "Notas de venta",
    icon: ClipboardList,
    children: [
      { id: "sales-create", label: "Crear nota de venta" },
      { id: "sales-registered", label: "Notas de venta registradas" }
    ]
  },
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
  cylinderEditor: {
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
    utilitiesSummary: null,
    utilitiesLoading: false,
    utilitiesError: "",
    loading: true,
    message: ""
  });
  const [filters, setFilters] = useState({ locationType: "", customerName: "", serialNumber: "" });
  const [forms, setForms] = useState(emptyForm);
  const [profileEditorClosing, setProfileEditorClosing] = useState(false);
  const [cylinderEditorClosing, setCylinderEditorClosing] = useState(false);
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
    function handleAuthExpired() {
      localStorage.removeItem(LAST_ACTIVITY_KEY);
      setSession(null);
      setWelcomeVisible(false);
      setActive("dashboard");
      setState((value) => ({ ...value, loading: false, message: "" }));
    }

    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
  }, []);

  useEffect(() => {
    if (!session) return undefined;
    let timeoutId;

    function expireSessionByInactivity() {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(LAST_ACTIVITY_KEY);
      setSession(null);
      setWelcomeVisible(false);
      setActive("dashboard");
      setLoginForm(emptyLoginForm);
      setLoginError("Sesión finalizada por inactividad. Ingresa nuevamente.");
      setState((value) => ({ ...value, loading: false, message: "" }));
    }

    function resetInactivityTimer() {
      localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(expireSessionByInactivity, INACTIVITY_TIMEOUT_MS);
    }

    function handleButtonActivity(event) {
      if (event.target instanceof Element && event.target.closest("button")) {
        resetInactivityTimer();
      }
    }

    const lastActivity = readLastActivityAt();
    const inactiveMs = Date.now() - lastActivity;
    if (inactiveMs >= INACTIVITY_TIMEOUT_MS) {
      expireSessionByInactivity();
      return undefined;
    }

    localStorage.setItem(LAST_ACTIVITY_KEY, String(lastActivity));
    timeoutId = window.setTimeout(expireSessionByInactivity, INACTIVITY_TIMEOUT_MS - inactiveMs);
    window.addEventListener("click", handleButtonActivity, true);
    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("click", handleButtonActivity, true);
    };
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
      await api("/api/cylinders", {
        method: "POST",
        body: {
          serialNumber: form.serialNumber,
          capacityM3: Number(form.capacityM3),
          owner: uppercaseCustomerName(form.owner),
          price: form.price === "" ? null : Number(form.price),
          ownerType: form.ownerType
        }
      });
      setForms((value) => ({ ...value, cylinder: { ...emptyForm.cylinder } }));
      await loadAll();
      notify("Cilindro creado correctamente.");
    });
  }

  async function updateCylinder(event) {
    event.preventDefault();
    const form = forms.cylinderEditor;
    await runAction(async () => {
      await api(`/api/cylinders/${form.id}`, {
        method: "PATCH",
        body: {
          serialNumber: form.serialNumber,
          capacityM3: Number(form.capacityM3),
          owner: uppercaseCustomerName(form.owner),
          price: form.price === "" ? null : Number(form.price),
          ownerType: form.ownerType
        }
      });
      await loadAll();
      notify("Cilindro actualizado correctamente.");
      closeCylinderEditor();
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
      localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
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
    localStorage.removeItem(LAST_ACTIVITY_KEY);
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
            customerName: uppercaseCustomerName(form.customerName),
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

    const deliveredLines = (form.deliveredCylinders || []).filter(saleLineHasAnyValue);
    const collectedLines = (form.collectedCylinders || []).filter(saleLineHasAnyValue);
    const missingCylinder = [...deliveredLines, ...collectedLines].some((line) => !line.cylinderNumber);
    if (missingCylinder) {
      notify("Completa el número de cilindro en cada línea usada.");
      return;
    }
    const missingDeliveredProduct = deliveredLines.some((line) => !line.productId);
    if (missingDeliveredProduct) {
      notify("Selecciona el producto para cada cilindro entregado.");
      return;
    }

    const deliveredCylinders = deliveredLines
      .map((line) => {
        const cylinder = findCylinderByNumber(state.cylinders, line.cylinderNumber);
        return {
          cylinderId: cylinder?.id,
          productId: Number(line.productId),
          capacityM3: line.capacityM3 === "" ? cylinder?.capacityM3 ?? null : Number(line.capacityM3),
          ownerName: line.ownerName || saleCylinderOwnerName(cylinder) || null,
          observations: line.observations || null
        };
      });
    const collectedCylinders = collectedLines
      .map((line) => {
        const cylinder = findCylinderByNumber(state.cylinders, line.cylinderNumber);
        return {
          cylinderId: cylinder?.id,
          productId: line.productId ? Number(line.productId) : null,
          capacityM3: line.capacityM3 === "" ? cylinder?.capacityM3 ?? null : Number(line.capacityM3),
          ownerName: line.ownerName || saleCylinderOwnerName(cylinder) || null,
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
          customerName: uppercaseCustomerName(form.customerName),
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
    setCylinderEditorClosing(false);
    setForms((value) => ({
      ...value,
      cylinderEditor: {
        id: cylinder.id,
        serialNumber: cylinder.serialNumber,
        capacityM3: cylinder.capacityM3,
        owner: cylinder.owner,
        price: cylinder.price ?? "",
        ownerType: cylinder.ownerType
      }
    }));
  }

  function closeCylinderEditor() {
    if (!forms.cylinderEditor.id || cylinderEditorClosing) return;
    setCylinderEditorClosing(true);
    window.setTimeout(() => {
      setForms((value) => ({ ...value, cylinderEditor: { ...emptyForm.cylinderEditor } }));
      setCylinderEditorClosing(false);
    }, CYLINDER_EDITOR_CLOSE_MS);
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
    setActive("sales-create");
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

  const pageKey = active === "sales" ? "sales-create" : active;
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
        cylinders={state.cylinders}
      />
    ),
    clients: <ClientsView initialInventory={state.inventory} />,
    "sales-create": (
      <SalesView
        mode="create"
        forms={forms}
        setForms={setForms}
        createSale={createSale}
        cylinders={state.cylinders}
        products={state.products}
        inventory={state.inventory}
        salesNotes={state.salesNotes}
        editSale={editSale}
        cancelSale={cancelSale}
        salesDateFilter={salesDateFilter}
        setSalesDateFilter={setSalesDateFilter}
        searchSalesNotes={searchSalesNotes}
      />
    ),
    "sales-registered": (
      <SalesView
        mode="registered"
        forms={forms}
        setForms={setForms}
        createSale={createSale}
        cylinders={state.cylinders}
        products={state.products}
        inventory={state.inventory}
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
    cylinders: <CylindersView forms={forms} setForms={setForms} createCylinder={createCylinder} updateCylinder={updateCylinder} cylinders={state.cylinders} editCylinder={editCylinder} closeCylinderEditor={closeCylinderEditor} cylinderEditorClosing={cylinderEditorClosing} deleteCylinder={deleteCylinder} />,
    products: <ProductsView forms={forms} setForms={setForms} createProduct={createProduct} products={state.products} editProduct={editProduct} deleteProduct={deleteProduct} />,
    profiles: <ProfilesView forms={forms} setForms={setForms} createProfile={createProfile} updateProfile={updateProfile} profiles={state.profiles} loadProfiles={loadProfiles} editProfile={editProfile} closeProfileEditor={closeProfileEditor} profileEditorClosing={profileEditorClosing} deleteProfile={deleteProfile} />,
    printing: <PrintingView salesNotes={state.salesNotes} selectedPrintNoteId={selectedPrintNoteId} setSelectedPrintNoteId={setSelectedPrintNoteId} printSaleNote={printSaleNote} />,
    profile: <ProfileView />
  }[pageKey];

  const activeMeta = findNavItem(navItems, pageKey) || navItems[0];

  return (
    <div className="appShell">
      <Sidebar active={pageKey} setActive={setActive} />
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
  const [expandedGroups, setExpandedGroups] = useState({});

  useEffect(() => {
    const parent = findNavParent(navItems, active);
    if (parent) {
      setExpandedGroups((value) => ({ ...value, [parent.id]: true }));
    }
  }, [active]);

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
          const hasChildren = Boolean(item.children?.length);
          const childActive = hasChildren && item.children.some((child) => child.id === active);
          const expanded = hasChildren && Boolean(expandedGroups[item.id]);

          if (hasChildren) {
            return (
              <div className="navGroup" key={item.id}>
                <button
                  className={childActive ? "navItem navParent active" : "navItem navParent"}
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => {
                    setExpandedGroups((value) => ({ ...value, [item.id]: !expanded }));
                    if (!childActive) {
                      setActive(item.children[0].id);
                    }
                  }}
                >
                  <span className="navDot" />
                  <Icon size={16} />
                  <span className="navLabel">{item.label}</span>
                  <ChevronDown className={expanded ? "navChevron open" : "navChevron"} size={16} />
                </button>
                <div className={expanded ? "navChildren open" : "navChildren"}>
                  {item.children.map((child) => (
                    <button
                      key={child.id}
                      type="button"
                      className={active === child.id ? "navChild active" : "navChild"}
                      onClick={() => setActive(child.id)}
                    >
                      <span className="navBranchLine" />
                      {child.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <button key={item.id} type="button" className={active === item.id ? "navItem active" : "navItem"} onClick={() => setActive(item.id)}>
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

function findNavItem(items, id) {
  for (const item of items) {
    if (item.id === id) return item;
    const child = item.children?.find((entry) => entry.id === id);
    if (child) return child;
  }
  return null;
}

function findNavParent(items, id) {
  return items.find((item) => item.children?.some((child) => child.id === id)) || null;
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

function InventoryView({ filters, setFilters, searchInventory, inventory, cylinders = [] }) {
  const [selectedCylinder, setSelectedCylinder] = useState(null);
  const cylinderRegistry = useMemo(() => {
    const byId = new Map();
    const bySerial = new Map();
    (cylinders || []).forEach((cylinder) => {
      byId.set(String(cylinder.id), cylinder);
      bySerial.set(normalizeCylinderNumberKey(cylinder.serialNumber), cylinder);
    });
    return { byId, bySerial };
  }, [cylinders]);
  const enrichedInventory = useMemo(() => (inventory || []).map((item) => {
    const registered = cylinderRegistry.byId.get(String(item.cylinderId)) || cylinderRegistry.bySerial.get(normalizeCylinderNumberKey(item.serialNumber));
    return {
      ...item,
      owner: item.owner || registered?.owner || "",
      ownerType: item.ownerType || registered?.ownerType || null
    };
  }), [inventory, cylinderRegistry]);

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
      <Card title="Cilindros encontrados">
        {enrichedInventory.length ? (
          <div className="clientListPanel">
            <div className="clientListHeader">
              <strong>Cilindros</strong>
              <span>{enrichedInventory.length}</span>
            </div>
            <div className="clientList">
              {enrichedInventory.map((item) => (
                <button
                  type="button"
                  key={item.cylinderId}
                  className="clientListButton inventoryListButton"
                  onClick={() => setSelectedCylinder(item)}
                >
                  <span>
                    <strong>{item.serialNumber}</strong>
                    <em>{inventoryCylinderSubtitle(item)}</em>
                  </span>
                  <b>{formatCapacity(item.capacityM3)} m3</b>
                  <span className="clientOpenIcon" aria-hidden="true"><Eye size={16} /></span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState title="Sin registros" text="Sin cilindros para los filtros seleccionados" />
        )}
      </Card>
      {selectedCylinder && (
        <DetailModal eyebrow="CILINDRO" title={`Cilindro ${selectedCylinder.serialNumber}`} onClose={() => setSelectedCylinder(null)}>
          <div className="detailGrid">
            <div><span>Serie</span><strong>{selectedCylinder.serialNumber}</strong></div>
            <div><span>Capacidad</span><strong>{formatCapacity(selectedCylinder.capacityM3)} m3</strong></div>
            <div><span>Propietario</span><strong>{selectedCylinder.owner || "-"}</strong></div>
            <div><span>Ubicación actual</span><strong>{selectedCylinder.currentLocationType || "-"}</strong></div>
            <div><span>Cliente actual</span><strong>{selectedCylinder.currentCustomerName || "-"}</strong></div>
            <div><span>Última nota</span><strong>{selectedCylinder.lastDeliveryNoteNumber || "-"}</strong></div>
            <div><span>Fecha</span><strong>{selectedCylinder.lastDeliveryDate || selectedCylinder.locationDate || "-"}</strong></div>
          </div>
          {selectedCylinder.locationObservation && (
            <div className="detailNote">
              <span>Observación</span>
              <p>{selectedCylinder.locationObservation}</p>
            </div>
          )}
        </DetailModal>
      )}
    </>
  );
}

function ClientsView({ initialInventory = [] }) {
  const [inventory, setInventory] = useState(initialInventory);
  const [detailClient, setDetailClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadClientInventory() {
    setLoading(true);
    setError("");
    try {
      const nextInventory = await api("/api/inventory/cylinders?locationType=CLIENTE");
      setInventory(nextInventory);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const nextInventory = await api("/api/inventory/cylinders?locationType=CLIENTE");
        if (!cancelled) {
          setInventory(nextInventory);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const clients = useMemo(() => buildCustomerGroups(inventory), [inventory]);

  const totalCylinders = clients.reduce((total, client) => total + client.cylinders.length, 0);
  const totalCapacity = clients.reduce((total, client) => total + client.totalCapacity, 0);

  return (
    <>
      <PageIntro eyebrow="CLIENTES" title="Clientes con cilindros" subtitle="Consulta la posesión actual de cilindros por cliente." />
      <Card title="Cilindros en posesión de clientes">
        <div className="clientsToolbar">
          <div>
            <span>Clientes activos</span>
            <strong>{clients.length}</strong>
          </div>
          <div>
            <span>Cilindros fuera de planta</span>
            <strong>{totalCylinders}</strong>
          </div>
          <div>
            <span>Capacidad total</span>
            <strong>{formatCapacity(totalCapacity)} m3</strong>
          </div>
          <button type="button" className="secondaryBtn iconTextBtn" onClick={loadClientInventory} disabled={loading}>
            <RefreshCw size={16} /> Actualizar
          </button>
        </div>

        {error && <div className="notice dangerNotice">{error}</div>}

        {loading && !clients.length ? (
          <Skeleton />
        ) : clients.length ? (
          <>
            <div className="clientListPanel">
              <div className="clientListHeader">
                <strong>Clientes</strong>
                <span>{clients.length}</span>
              </div>
              <div className="clientList">
                {clients.map((client) => (
                  <button
                    type="button"
                    key={client.name}
                    className="clientListButton"
                    onClick={() => setDetailClient(client)}
                  >
                    <span>
                      <strong>{client.name}</strong>
                      <em>{formatCapacity(client.totalCapacity)} m3</em>
                    </span>
                    <b>{client.cylinders.length}</b>
                    <span className="clientOpenIcon" aria-hidden="true"><Eye size={16} /></span>
                  </button>
                ))}
              </div>
            </div>
            {detailClient && (
              <DetailModal eyebrow="CLIENTE" title={detailClient.name} onClose={() => setDetailClient(null)}>
                <div className="detailGrid compact">
                  <div><span>Cilindros en posesión</span><strong>{detailClient.cylinders.length}</strong></div>
                  <div><span>Capacidad total</span><strong>{formatCapacity(detailClient.totalCapacity)} m3</strong></div>
                </div>
                <DataTable
                  columns={["Cilindro", "Capacidad"]}
                  rows={detailClient.cylinders.map((cylinder) => [
                    cylinder.serialNumber,
                    `${formatCapacity(cylinder.capacityM3)} m3`
                  ])}
                  empty="Este cliente no tiene cilindros en posesión."
                />
              </DetailModal>
            )}
          </>
        ) : (
          <EmptyState title="Sin clientes con cilindros" text="No hay cilindros ubicados actualmente en clientes." />
        )}
      </Card>
    </>
  );
}

function SalesView({ mode = "create", forms, setForms, createSale, cylinders, products, inventory = [], salesNotes, editSale, cancelSale, salesDateFilter, setSalesDateFilter, searchSalesNotes }) {
  const form = forms.sale;
  const activeCylinders = cylinders.filter((item) => item.active !== false);
  const activeProducts = products.filter((item) => item.active !== false);
  const showingCreation = mode === "create";
  const existingCustomerNames = useMemo(() => new Set(buildCustomerGroups(inventory).map((client) => normalizeCustomerNameKey(client.name))), [inventory]);
  const ownerNameSuggestions = useMemo(() => {
    const suggestions = new Map();
    const addSuggestion = (name) => {
      const normalizedName = uppercaseCustomerName(name).trim();
      const key = normalizeCustomerNameKey(normalizedName);
      if (key) {
        suggestions.set(key, normalizedName);
      }
    };

    addSuggestion(BRAND_OWNER_NAME);
    buildCustomerGroups(inventory).forEach((client) => addSuggestion(client.name));
    (cylinders || []).forEach((cylinder) => addSuggestion(cylinder.owner));

    return Array.from(suggestions.values()).sort((left, right) => left.localeCompare(right, "es-BO"));
  }, [inventory, cylinders]);
  const ownerNameSuggestion = (value) => findOwnerNameSuggestion(ownerNameSuggestions, value);
  const customerNameKey = normalizeCustomerNameKey(form.customerName);
  const customerExists = customerNameKey ? existingCustomerNames.has(customerNameKey) : false;
  const existingCylinderNumbers = useMemo(() => new Set((cylinders || []).map((cylinder) => normalizeCylinderNumberKey(cylinder.serialNumber)).filter(Boolean)), [cylinders]);
  const cylinderHint = (value) => {
    const cylinderKey = normalizeCylinderNumberKey(value);
    if (!cylinderKey) return null;
    const cylinderExists = existingCylinderNumbers.has(cylinderKey);
    return (
      <span className={cylinderExists ? "customerHint customerHintSuccess" : "customerHint customerHintWarning"}>
        {cylinderExists ? "Cilindro ya existe en el apartado Cilindros." : "Cilindro no detectado en el apartado Cilindros."}
      </span>
    );
  };
  const ownershipHint = (value) => {
    const ownerNameKey = normalizeCustomerNameKey(value);
    if (!ownerNameKey) return null;
    if (ownerNameKey === normalizeCustomerNameKey(BRAND_OWNER_NAME)) {
      return (
        <span className="customerHint customerHintSuccess">
          Propiedad de la empresa.
        </span>
      );
    }
    const ownerExists = existingCustomerNames.has(ownerNameKey);
    return (
      <span className={ownerExists ? "customerHint customerHintSuccess" : "customerHint customerHintWarning"}>
        {ownerExists ? "Propietario ya existe en el apartado Clientes." : "Propietario no detectado en el apartado Clientes."}
      </span>
    );
  };
  return (
    <>
      <PageIntro
        eyebrow="VENTAS"
        title={showingCreation ? "Crear nota de venta" : "Notas de venta registradas"}
        subtitle={showingCreation ? "Registra entregas y recojos; el backend genera los movimientos." : "Consulta, edita o anula las notas de venta ya registradas."}
      />
      {showingCreation && (
      <Card title={form.id ? "Editar nota" : "Nueva nota"}>
        <div className="salesComposer">
          <form onSubmit={createSale}>
            <div className="formGrid five">
              <Field label="Número">
                <input required disabled={Boolean(form.id)} value={form.noteNumber} onChange={(event) => setNested(setForms, "sale", "noteNumber", event.target.value)} placeholder="NV-001" />
              </Field>
              <Field label="Cliente" className="floatingHintField">
                {customerNameKey && (
                  <span className={customerExists ? "customerHint customerHintSuccess" : "customerHint customerHintWarning"}>
                    {customerExists ? "Cliente ya existe en el apartado Clientes." : "Cliente no detectado en el apartado Clientes."}
                  </span>
                )}
                <input required value={form.customerName} onChange={(event) => setNested(setForms, "sale", "customerName", uppercaseCustomerName(event.target.value))} placeholder="Cliente" />
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
                    const selected = findCylinderByNumber(activeCylinders, line.cylinderNumber);
                    const started = saleLineHasAnyValue(line);
                    return (
                      <div className="lineGrid deliveredLine" key={index}>
                        <Field label="Nro. cilindro" className="floatingHintField">
                          {cylinderHint(line.cylinderNumber)}
                          <input required={started} value={line.cylinderNumber} onChange={(event) => {
                            const selectedCylinder = findCylinderByNumber(activeCylinders, event.target.value);
                            updateSaleLine(setForms, "deliveredCylinders", index, "cylinderNumber", event.target.value, {
                              capacityM3: selectedCylinder?.capacityM3 ?? "",
                              ownerName: selectedCylinder ? saleCylinderOwnerName(selectedCylinder) : ""
                            });
                          }} placeholder="1001" />
                        </Field>
                        <Field label="Producto">
                          <select required={started} value={line.productId} onChange={(event) => updateSaleLine(setForms, "deliveredCylinders", index, "productId", event.target.value)}>
                            <option value="">Seleccionar</option>
                            {activeProducts.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                          </select>
                        </Field>
                        <Field label="Capacidad (m3)">
                          <input type="number" min="0.01" step="0.01" value={line.capacityM3} onChange={(event) => updateSaleLine(setForms, "deliveredCylinders", index, "capacityM3", event.target.value)} placeholder={selected ? String(selected.capacityM3) : "0.00"} />
                        </Field>
                        <Field label="Propiedad" className="floatingHintField">
                          {ownershipHint(line.ownerName)}
                          <AutocompleteInput
                            value={line.ownerName}
                            suggestion={ownerNameSuggestion(line.ownerName)}
                            onChange={(event) => updateSaleLine(setForms, "deliveredCylinders", index, "ownerName", uppercaseCustomerName(event.target.value))}
                            onSuggestionAccept={(suggestion) => updateSaleLine(setForms, "deliveredCylinders", index, "ownerName", suggestion)}
                            placeholder={selected ? saleCylinderOwnerName(selected) || "Dueño del cilindro" : "Dueño del cilindro"}
                          />
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
                    const selected = findCylinderByNumber(activeCylinders, line.cylinderNumber);
                    const started = saleLineHasAnyValue(line);
                    return (
                      <div className="lineGrid collectedLine" key={index}>
                        <Field label="Nro. cilindro" className="floatingHintField">
                          {cylinderHint(line.cylinderNumber)}
                          <input required={started} value={line.cylinderNumber} onChange={(event) => {
                            const selectedCylinder = findCylinderByNumber(activeCylinders, event.target.value);
                            updateSaleLine(setForms, "collectedCylinders", index, "cylinderNumber", event.target.value, {
                              capacityM3: selectedCylinder?.capacityM3 ?? "",
                              ownerName: selectedCylinder ? saleCylinderOwnerName(selectedCylinder) : ""
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
                          <input type="number" min="0.01" step="0.01" value={line.capacityM3} onChange={(event) => updateSaleLine(setForms, "collectedCylinders", index, "capacityM3", event.target.value)} placeholder={selected ? String(selected.capacityM3) : "0.00"} />
                        </Field>
                        <Field label="Propiedad" className="floatingHintField">
                          {ownershipHint(line.ownerName)}
                          <AutocompleteInput
                            value={line.ownerName}
                            suggestion={ownerNameSuggestion(line.ownerName)}
                            onChange={(event) => updateSaleLine(setForms, "collectedCylinders", index, "ownerName", uppercaseCustomerName(event.target.value))}
                            onSuggestionAccept={(suggestion) => updateSaleLine(setForms, "collectedCylinders", index, "ownerName", suggestion)}
                            placeholder={selected ? saleCylinderOwnerName(selected) || "Dueño del cilindro" : "Dueño del cilindro"}
                          />
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
      )}
      {!showingCreation && (
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
      )}
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

function CylinderFields({ form, group, setForms }) {
  return (
    <div className="formGrid four">
      <Field label="Serie">
        <input required value={form.serialNumber} onChange={(event) => setNested(setForms, group, "serialNumber", event.target.value)} placeholder="CYL-001" />
      </Field>
      <Field label="Capacidad m3">
        <input required type="number" min="0.01" step="0.01" value={form.capacityM3} onChange={(event) => setNested(setForms, group, "capacityM3", event.target.value)} placeholder="6.00" />
      </Field>
      <Field label="Propietario">
        <input required value={form.owner} onChange={(event) => setNested(setForms, group, "owner", uppercaseCustomerName(event.target.value))} />
      </Field>
      <Field label="Valor interno">
        <input type="number" min="0" step="0.01" value={form.price} onChange={(event) => setNested(setForms, group, "price", event.target.value)} placeholder="Opcional" />
      </Field>
    </div>
  );
}

function CylindersView({ forms, setForms, createCylinder, updateCylinder, cylinders, editCylinder, closeCylinderEditor, cylinderEditorClosing, deleteCylinder }) {
  const form = forms.cylinder;
  const editor = forms.cylinderEditor;
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
              <input required value={form.owner} onChange={(event) => setNested(setForms, "cylinder", "owner", uppercaseCustomerName(event.target.value))} />
            </Field>
            <Field label="Valor interno">
              <input type="number" min="0" step="0.01" value={form.price} onChange={(event) => setNested(setForms, "cylinder", "price", event.target.value)} placeholder="Opcional" />
            </Field>
          </div>
          <div className="actionBar">
            <button className="primaryBtn">Crear cilindro</button>
          </div>
        </form>
      </Card>
      <Card title="Cilindros registrados">
        <DataTable
          columns={["Serie", "m3", "Propietario", "Estado", "Ubicación", "Cliente actual", "Valor", "Acciones"]}
          rows={cylinders.map((item) => [
            item.serialNumber,
            item.capacityM3,
            item.owner,
            item.status,
            item.currentLocationType || "-",
            item.currentCustomerName || "-",
            money(item.price),
            <div className="rowActions">
              <IconButton title="Editar cilindro" onClick={() => editCylinder(item)} icon={Edit3} />
              <IconButton title="Eliminar cilindro" onClick={() => deleteCylinder(item)} icon={Trash2} />
            </div>
          ])}
          onRowClick={(index) => editCylinder(cylinders[index])}
          empty="Sin cilindros registrados"
        />
      </Card>
      {editor.id && (
        <div className={`modalOverlay ${cylinderEditorClosing ? "closing" : "open"}`} onMouseDown={closeCylinderEditor}>
          <section className="cylinderEditModal" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modalHeader">
              <div>
                <span>CILINDRO</span>
                <h3>Editar cilindro {editor.serialNumber}</h3>
              </div>
              <IconButton title="Cerrar" onClick={closeCylinderEditor} icon={X} />
            </div>
            <form onSubmit={updateCylinder}>
              <CylinderFields form={editor} group="cylinderEditor" setForms={setForms} />
              <div className="actionBar modalActions">
                <button className="primaryBtn">Guardar cambios</button>
                <button type="button" className="secondaryBtn" onClick={closeCylinderEditor}>Cancelar</button>
              </div>
            </form>
          </section>
        </div>
      )}
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

function Field({ label, children, className = "" }) {
  return (
    <label className={`field ${className}`.trim()}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function AutocompleteInput({ value, suggestion, onChange, onSuggestionAccept, placeholder }) {
  const handleKeyDown = (event) => {
    if (!suggestion || !onSuggestionAccept) return;
    if (event.key === "Tab" || event.key === "ArrowRight") {
      event.preventDefault();
      onSuggestionAccept(suggestion);
    }
  };

  return (
    <div className="autocompleteInput">
      {suggestion && <span className="autocompleteGhost">{suggestion}</span>}
      <input
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
      />
    </div>
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
  const visibleLines = (lines || []).length ? lines : [{}];

  return (
    <div className="lineSection">
      <div className="lineSectionHead">
        <PanelTitle icon={Icon} title={title} />
        <button type="button" className="addLineBtn iconTextBtn" onClick={onAdd}><Plus size={16} /> Agregar</button>
      </div>
      <div className="lineList">
        {visibleLines.map((line, index) => children(line, index))}
      </div>
    </div>
  );
}

function IconButton({ title, onClick, icon: Icon, disabled = false }) {
  return (
    <button type="button" className="iconBtn" title={title} onClick={(event) => {
      event.stopPropagation();
      onClick?.(event);
    }} disabled={disabled}>
      <Icon size={16} />
    </button>
  );
}

function DetailModal({ eyebrow, title, children, onClose }) {
  const [closing, setClosing] = useState(false);

  function requestClose() {
    if (closing) return;
    setClosing(true);
    window.setTimeout(onClose, DETAIL_MODAL_CLOSE_MS);
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        requestClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div className={closing ? "modalOverlay closing" : "modalOverlay"} onMouseDown={(event) => {
      if (event.target === event.currentTarget) {
        requestClose();
      }
    }}>
      <section className="detailModal" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modalHeader">
          <div>
            <span>{eyebrow}</span>
            <h3>{title}</h3>
          </div>
          <IconButton title="Cerrar" onClick={requestClose} icon={X} />
        </div>
        {children}
      </section>
    </div>
  );
}

function DataTable({ columns, rows, empty, onRowClick }) {
  if (!rows.length) {
    return <EmptyState title="Sin registros" text={empty} />;
  }
  const rowProps = (index) => {
    if (!onRowClick) return {};
    return {
      className: "clickableTableRow",
      role: "button",
      tabIndex: 0,
      onClick: () => onRowClick(index),
      onKeyDown: (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onRowClick(index);
        }
      }
    };
  };

  return (
    <div className="tableWrap">
      <table>
        <thead>
          <tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} {...rowProps(index)}>
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

function saleLineHasAnyValue(line) {
  return ["cylinderNumber", "productId", "capacityM3", "ownerName", "observations"].some((key) => String(line?.[key] || "").trim());
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
        ownerName: line.ownerName || saleCylinderOwnerName(cylinder) || "",
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
        ownerName: line.ownerName || saleCylinderOwnerName(cylinder) || "",
        observations: line.observations
      };
    })
    .filter((line) => line.serialNumber || line.productName || line.observations);
}

function findById(items, id) {
  return items.find((item) => String(item.id) === String(id));
}

function findCylinderByNumber(items, number) {
  const normalized = normalizeCylinderNumberKey(number);
  if (!normalized) return undefined;
  return items.find((item) => normalizeCylinderNumberKey(item.serialNumber) === normalized || String(item.id) === normalized);
}

function saleCylinderOwnerName(cylinder) {
  return uppercaseCustomerName(cylinder?.owner || "");
}

function findOwnerNameSuggestion(suggestions, value) {
  const currentValue = uppercaseCustomerName(value).trim();
  const currentKey = normalizeCustomerNameKey(currentValue);
  if (!currentKey) return "";

  return suggestions.find((name) => {
    const suggestionKey = normalizeCustomerNameKey(name);
    return suggestionKey.startsWith(currentKey) && suggestionKey !== currentKey;
  }) || "";
}

function sameText(left, right) {
  return String(left || "").trim().toLowerCase() === String(right || "").trim().toLowerCase();
}

function sumCapacity(lines) {
  return lines.reduce((total, line) => total + Number(line.capacityM3 || 0), 0);
}

function inventoryCylinderSubtitle(item) {
  const location = item.currentLocationType || "Sin ubicación";
  const customer = item.currentCustomerName ? `Cliente: ${item.currentCustomerName}` : "Sin cliente";
  const owner = item.owner ? `Propietario: ${item.owner}` : "Sin propietario";
  const note = item.lastDeliveryNoteNumber ? `Nota: ${item.lastDeliveryNoteNumber}` : "Sin nota";
  return `${location} · ${customer} · ${owner} · ${note}`;
}

function buildCustomerGroups(inventory) {
  const groups = new Map();
  (inventory || [])
    .filter((item) => item.currentLocationType === "CLIENTE" && String(item.currentCustomerName || "").trim())
    .forEach((item) => {
      const name = uppercaseCustomerName(item.currentCustomerName);
      const key = name.toLocaleLowerCase("es-BO");
      if (!groups.has(key)) {
        groups.set(key, { name, cylinders: [], totalCapacity: 0 });
      }
      const group = groups.get(key);
      group.cylinders.push(item);
      group.totalCapacity += Number(item.capacityM3 || 0);
    });

  return Array.from(groups.values())
    .map((group) => ({
      ...group,
      cylinders: group.cylinders.sort((left, right) =>
        String(left.serialNumber || "").localeCompare(String(right.serialNumber || ""), "es", { numeric: true })
      )
    }))
    .sort((left, right) => left.name.localeCompare(right.name, "es", { sensitivity: "base" }));
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

async function printSaleNote(note) {
  const printWindow = window.open("", "_blank", "width=900,height=1100");
  if (!printWindow) {
    window.alert("El navegador bloqueó la ventana de impresión. Habilita ventanas emergentes para este sitio.");
    return;
  }

  printWindow.document.write("<!doctype html><title>Generando nota...</title><body style=\"font-family: Arial, sans-serif; padding: 24px;\">Generando nota de entrega...</body>");
  printWindow.document.close();

  try {
    const pdfBytes = await buildSaleNotePdf(note);
    const pdfUrl = URL.createObjectURL(new Blob([pdfBytes], { type: "application/pdf" }));
    printWindow.location.href = pdfUrl;
    window.setTimeout(() => {
      try {
        printWindow.focus();
        printWindow.print();
      } catch {
        // The built-in PDF viewer may own the print flow; the tab still opens with the generated PDF.
      }
    }, 1200);
    window.setTimeout(() => URL.revokeObjectURL(pdfUrl), 60000);
  } catch (error) {
    printWindow.close();
    window.alert(`No se pudo generar la nota de entrega: ${error.message}`);
  }
}

async function buildSaleNotePdf(note) {
  const response = await fetch(SALE_NOTE_TEMPLATE_URL);
  if (!response.ok) {
    throw new Error("No se encontró la plantilla PDF.");
  }

  const templateBytes = await response.arrayBuffer();
  const template = await PDFDocument.load(templateBytes);
  const output = await PDFDocument.create();
  const regularFont = await output.embedFont(StandardFonts.Helvetica);
  const boldFont = await output.embedFont(StandardFonts.HelveticaBold);
  const templatePageIndex = Math.min(SALE_NOTE_TEMPLATE_PAGE_INDEX, template.getPageCount() - 1);
  const rows = saleNotePdfRows(note);
  const pages = chunkRows(rows.length ? rows : [], SALE_NOTE_ROWS_PER_PAGE);
  const printablePages = pages.length ? pages : [[]];

  for (const pageRows of printablePages) {
    const [page] = await output.copyPages(template, [templatePageIndex]);
    output.addPage(page);
    drawSaleNotePage(page, note, pageRows, rows, regularFont, boldFont);
  }

  return output.save();
}

function drawSaleNotePage(page, note, pageRows, allRows, regularFont, boldFont) {
  const black = rgb(0, 0, 0);
  const red = rgb(1, 0, 0);
  const white = rgb(1, 1, 1);
  const deliveredCount = (note.deliveredCylinders || []).length;
  const collectedCount = (note.collectedCylinders || []).length;

  coverPdfText(page, 474.2, 651.5, 66, 18, white);
  drawPdfText(page, note.noteNumber || "", 475.9, 655.9, {
    font: boldFont,
    size: 13.68,
    color: red,
    maxWidth: 64
  });
  drawPdfText(page, uppercaseCustomerName(note.customerName || ""), 129.5, 612.46, {
    font: regularFont,
    size: 8.76,
    color: black,
    maxWidth: 205
  });
  drawPdfText(page, formatSaleNoteDateForPdf(note.noteDate), 124.5, 594.46, {
    font: regularFont,
    size: 8.76,
    color: black,
    maxWidth: 200
  });
  drawCenteredPdfText(page, String(allRows.length), 372, 601.06, 22, {
    font: regularFont,
    size: 8.76,
    color: black
  });
  drawCenteredPdfText(page, String(deliveredCount), 437.5, 601.06, 22, {
    font: regularFont,
    size: 8.76,
    color: black
  });
  drawCenteredPdfText(page, String(collectedCount), 505.18, 601.06, 22, {
    font: regularFont,
    size: 8.76,
    color: black
  });

  pageRows.forEach((line, index) => drawSaleNotePdfRow(page, line, index, regularFont, black));

  coverPdfText(page, 407, 334.5, 122, 15, white);
  drawPdfText(page, `Bs ${formatMoneyPlain(note.utilityAmount)}`, 410, 337.73, {
    font: regularFont,
    size: 8.76,
    color: black,
    maxWidth: 118
  });
}

function drawSaleNotePdfRow(page, line, index, font, color) {
  const y = 551.47 - index * 12;
  const detailY = y - 1.44;

  drawPdfText(page, String(index + 1), index < 9 ? 83.4 : 81.48, y, { font, size: 7.44, color, maxWidth: 18 });
  drawPdfText(page, line.serialNumber, 130.1, y, { font, size: 7.44, color, maxWidth: 70 });
  drawPdfText(page, line.capacityM3, 220.01, y, { font, size: 7.44, color, maxWidth: 34 });
  drawPdfText(page, line.ownerName, 286.13, detailY, { font, size: 7.44, color, maxWidth: 62 });
  drawPdfText(page, line.status, 360.67, detailY, { font, size: 7.44, color, maxWidth: 52 });
  drawPdfText(page, line.amount, 438.22, detailY, { font, size: 7.44, color, maxWidth: 38 });
  drawPdfText(page, line.observations, 495.22, detailY, { font, size: 7.44, color, maxWidth: 42 });
}

function saleNotePdfRows(note) {
  const delivered = (note.deliveredCylinders || []).map((line) => saleNotePdfRow(line, "Entregado"));
  const collected = (note.collectedCylinders || []).map((line) => saleNotePdfRow(line, "Recibido"));
  return [...delivered, ...collected];
}

function saleNotePdfRow(line, status) {
  return {
    serialNumber: String(line.serialNumber || line.cylinderId || ""),
    capacityM3: formatCapacity(line.capacityM3),
    ownerName: line.ownerName || "",
    status,
    amount: line.amount ? formatMoneyPlain(line.amount) : "",
    observations: line.observations || ""
  };
}

function drawPdfText(page, text, x, y, options) {
  const value = fitPdfText(String(text || ""), options.font, options.size, options.maxWidth);
  if (!value) return;
  page.drawText(value, {
    x,
    y,
    size: options.size,
    font: options.font,
    color: options.color
  });
}

function drawCenteredPdfText(page, text, x, y, width, options) {
  const value = fitPdfText(String(text || ""), options.font, options.size, width);
  const textWidth = options.font.widthOfTextAtSize(value, options.size);
  page.drawText(value, {
    x: x + (width - textWidth) / 2,
    y,
    size: options.size,
    font: options.font,
    color: options.color
  });
}

function coverPdfText(page, x, y, width, height, color) {
  page.drawRectangle({ x, y, width, height, color, borderWidth: 0 });
}

function fitPdfText(text, font, size, maxWidth = Number.POSITIVE_INFINITY) {
  const normalized = String(text || "").trim();
  if (!normalized || font.widthOfTextAtSize(normalized, size) <= maxWidth) {
    return normalized;
  }

  let next = normalized;
  while (next.length > 1 && font.widthOfTextAtSize(`${next}...`, size) > maxWidth) {
    next = next.slice(0, -1);
  }
  return `${next}...`;
}

function chunkRows(rows, size) {
  const chunks = [];
  for (let index = 0; index < rows.length; index += size) {
    chunks.push(rows.slice(index, index + size));
  }
  return chunks;
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
    const error = new Error(readErrorMessage(text, response.status));
    error.status = response.status;
    if (response.status === 401 && path !== "/api/iam/login") {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(LAST_ACTIVITY_KEY);
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }
    throw error;
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

function readLastActivityAt() {
  const stored = Number(localStorage.getItem(LAST_ACTIVITY_KEY));
  return Number.isFinite(stored) && stored > 0 ? stored : Date.now();
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

function formatSaleNoteDateForPdf(value) {
  if (!value) return "";
  const [date = "", time = ""] = String(value).split("T");
  const [year, month, day] = date.split("-");
  return [day, month, year].every(Boolean) ? `${day}/${month}/${year} ${time.slice(0, 5)}`.trim() : formatDateTime(value);
}

function moneyInputValue(value) {
  if (value === null || value === undefined || value === "") return 0;
  return Number(value);
}

function uppercaseCustomerName(value) {
  return String(value || "").trimStart().toLocaleUpperCase("es-BO");
}

function normalizeCustomerNameKey(value) {
  return uppercaseCustomerName(value).trim().toLocaleLowerCase("es-BO");
}

function normalizeCylinderNumberKey(value) {
  return String(value || "").trim().toLocaleUpperCase("es-BO");
}

function money(value) {
  if (value === null || value === undefined || value === "") return "-";
  return Number(value).toLocaleString("es-BO", { style: "currency", currency: "BOB" });
}

function formatMoneyPlain(value) {
  if (value === null || value === undefined || value === "") return "0,00";
  return Number(value).toLocaleString("es-BO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
