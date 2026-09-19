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
  Hash,
  History,
  Layers,
  LayoutDashboard,
  Banknote,
  CheckCircle2,
  CircleX,
  Package,
  Plus,
  Printer,
  RefreshCw,
  Search,
  LoaderCircle,
  Trash2,
  UserRound,
  Users,
  Warehouse,
  X
} from "lucide-react";
import "./styles.navy.css";

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
const RECENT_NOTES_LIMIT = 20;

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
      { id: "sales-registered", label: "Notas de venta registradas" },
      { id: "sales-export", label: "Exportar movimientos" }
    ]
  },
  { id: "printing", label: "Impresión", icon: Printer },
  { id: "utilities", label: "Utilidades", icon: Banknote },
  { id: "cylinders", label: "Cilindros", icon: Gauge },
  { id: "products", label: "Productos", icon: Package },
  { id: "profiles", label: "Perfiles", icon: Users },
  { id: "audit", label: "Auditoría", icon: History },
  { id: "profile", label: "Perfil", icon: UserRound }
];

const PERMISSIONS = {
  MANAGE_CATALOGS: "MANAGE_CATALOGS",
  MANAGE_PROFILES: "MANAGE_PROFILES",
  VIEW_UTILITIES: "VIEW_UTILITIES",
  VIEW_AUDIT: "VIEW_AUDIT"
};

const ROLE_PERMISSIONS = {
  ADMINISTRADOR: new Set([
    PERMISSIONS.MANAGE_CATALOGS,
    PERMISSIONS.MANAGE_PROFILES,
    PERMISSIONS.VIEW_UTILITIES,
    PERMISSIONS.VIEW_AUDIT
  ]),
  OPERADOR: new Set()
};

const PAGE_PERMISSIONS = {
  utilities: PERMISSIONS.VIEW_UTILITIES,
  products: PERMISSIONS.MANAGE_CATALOGS,
  profiles: PERMISSIONS.MANAGE_PROFILES,
  audit: PERMISSIONS.VIEW_AUDIT
};

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

const emptyDeliveredLine = { cylinderNumber: "", productId: "", capacityM3: "", amount: "", ownerName: "", observations: "" };
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
  customerEditor: { id: null, name: "", active: true },
  profile: { id: null, fullName: "", username: "", password: "", roleName: "OPERADOR", active: true },
  profileEditor: { id: null, fullName: "", username: "", password: "", roleName: "OPERADOR", active: true },
  sale: {
    id: null,
    noteType: null,
    noteNumber: "",
    customerName: "",
    noteDate: localDateTimeInputValue(),
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
    customers: [],
    profiles: [],
    inventory: [],
    movements: [],
    salesNotes: [],
    recentSalesNotes: [],
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
  const [customerEditorClosing, setCustomerEditorClosing] = useState(false);
  const [salesDateFilter, setSalesDateFilter] = useState(createSalesNoteFilter());
  const [movementDateFilter, setMovementDateFilter] = useState(createDateFilter("MONTH"));
  const [utilityDateFilter, setUtilityDateFilter] = useState(createDateFilter("MONTH"));
  const [selectedPrintNoteId, setSelectedPrintNoteId] = useState("");
  const [printingFilter, setPrintingFilter] = useState(createPrintingNoteFilter(false));
  const [printingNotes, setPrintingNotes] = useState([]);
  const [recentPrintingNotes, setRecentPrintingNotes] = useState([]);
  const [printingLoading, setPrintingLoading] = useState(false);
  const [missingCylinderDialog, setMissingCylinderDialog] = useState(null);
  const visibleNavItems = useMemo(() => filterNavItemsForSession(navItems, session), [session?.profile?.roleName]);

  async function loadAll() {
    setState((value) => ({ ...value, loading: true }));
    try {
      const canManageProfiles = hasPermission(session, PERMISSIONS.MANAGE_PROFILES);
      const canViewUtilities = hasPermission(session, PERMISSIONS.VIEW_UTILITIES);
      const hasSalesNoteFilter = salesNoteFilterIsActive(salesDateFilter);
      const salesDateQuery = buildSalesNoteQuery(salesDateFilter);
      const movementDateQuery = buildDateQuery(movementDateFilter);
      const utilityDateQuery = buildDateQuery(utilityDateFilter);
      const [cylinders, products, customers, inventory, movements, salesNotes, recentSalesNotes, operationalAlerts, profiles, utilitiesSummary] = await Promise.all([
        api("/api/cylinders"),
        api("/api/products"),
        api("/api/customers"),
        api("/api/inventory/cylinders"),
        api(`/api/inventory-movements${movementDateQuery}`),
        hasSalesNoteFilter ? api(`/api/sales-notes${salesDateQuery}`) : Promise.resolve([]),
        api(`/api/sales-notes/recent?limit=${RECENT_NOTES_LIMIT}`),
        api("/api/operational-alerts"),
        canManageProfiles ? api("/api/profiles") : Promise.resolve([]),
        canViewUtilities ? api(`/api/utilities/summary${utilityDateQuery}`) : Promise.resolve(null)
      ]);
      setState((value) => ({
        ...value,
        cylinders,
        products,
        customers,
        profiles,
        inventory,
        movements,
        salesNotes,
        recentSalesNotes,
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
    if (!session || active !== "sales-create" || forms.sale.id) return;
    loadNextSalesNoteNumber().catch((error) => notify(error.message));
  }, [session?.accessToken, active, forms.sale.id]);

  useEffect(() => {
    if (!session || active !== "sales-registered") return;
    loadRecentSalesNotes();
  }, [session?.accessToken, active]);

  useEffect(() => {
    if (!session || active !== "printing") return;
    loadRecentPrintingNotes();
  }, [session?.accessToken, active]);

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
    const canManageProfiles = hasPermission(session, PERMISSIONS.MANAGE_PROFILES);

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
        if (refreshProfiles && canManageProfiles) {
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
      if (!canManageProfiles) return;
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
    const profileRefresh = canManageProfiles ? window.setInterval(refreshProfilePresence, PROFILE_REFRESH_MS) : null;
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
      if (profileRefresh) {
        window.clearInterval(profileRefresh);
      }
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [session?.profile?.id, session?.profile?.roleName]);

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
    const activeFilter = exclusiveFilterKey(nextFilters, ["locationType", "customerName", "serialNumber"]);
    if (activeFilter) params.set(activeFilter, nextFilters[activeFilter]);
    const inventory = await api(`/api/inventory/cylinders${params.toString() ? `?${params}` : ""}`);
    setState((value) => ({ ...value, inventory }));
  }

  async function loadRecentSalesNotes() {
    try {
      const recentSalesNotes = await api(`/api/sales-notes/recent?limit=${RECENT_NOTES_LIMIT}`);
      setState((value) => ({ ...value, recentSalesNotes }));
    } catch (error) {
      notify(error.message);
    }
  }

  async function searchSalesNotes(nextFilter = salesDateFilter) {
    if (!exclusiveFilterKey(nextFilter, ["dateFilterType", "noteNumber", "customerName"])) {
      setState((value) => ({ ...value, salesNotes: [] }));
      return;
    }
    const salesNotes = await api(`/api/sales-notes${buildSalesNoteQuery(nextFilter)}`);
    setState((value) => ({ ...value, salesNotes }));
  }

  async function searchPrintingNotes(nextFilter = printingFilter) {
    if (!printingFilterState(nextFilter).isActive) {
      setPrintingNotes([]);
      return;
    }
    setPrintingLoading(true);
    try {
      const notes = await api(`/api/sales-notes${buildPrintingNoteQuery(nextFilter)}`);
      setPrintingNotes(notes);
    } catch (error) {
      notify(error.message);
    } finally {
      setPrintingLoading(false);
    }
  }

  async function loadRecentPrintingNotes() {
    try {
      const notes = await api(`/api/sales-notes/recent?limit=${RECENT_NOTES_LIMIT}`);
      setRecentPrintingNotes(notes);
    } catch (error) {
      notify(error.message);
    }
  }

  async function loadNextSalesNoteNumber() {
    const response = await api("/api/sales-notes/next-number");
    setForms((value) => {
      if (value.sale.id) return value;
      return { ...value, sale: { ...value.sale, noteNumber: response.noteNumber } };
    });
  }

  async function searchMovements(nextFilter = movementDateFilter) {
    const movements = await api(`/api/inventory-movements${buildDateQuery(nextFilter)}`);
    setState((value) => ({ ...value, movements }));
  }

  async function loadUtilities(nextFilter = utilityDateFilter) {
    if (!hasPermission(session, PERMISSIONS.VIEW_UTILITIES)) {
      setState((value) => ({ ...value, utilitiesError: "No tienes permiso para ver utilidades." }));
      return;
    }
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

  function editCustomer(customer) {
    if (!customer.id) return;
    setCustomerEditorClosing(false);
    setForms((value) => ({
      ...value,
      customerEditor: {
        id: customer.id,
        name: customer.name,
        active: customer.active !== false
      }
    }));
  }

  function closeCustomerEditor() {
    if (!forms.customerEditor.id || customerEditorClosing) return;
    setCustomerEditorClosing(true);
    window.setTimeout(() => {
      setForms((value) => ({ ...value, customerEditor: { ...emptyForm.customerEditor } }));
      setCustomerEditorClosing(false);
    }, CYLINDER_EDITOR_CLOSE_MS);
  }

  async function updateCustomer(event) {
    event.preventDefault();
    const form = forms.customerEditor;
    await runAction(async () => {
      await api(`/api/customers/${form.id}`, {
        method: "PATCH",
        body: {
          name: uppercaseCustomerName(form.name),
          active: form.active !== false
        }
      });
      await loadAll();
      notify("Cliente actualizado correctamente.");
      closeCustomerEditor();
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
    if (!hasPermission(session, PERMISSIONS.MANAGE_PROFILES)) return;
    const profiles = await api("/api/profiles");
    setState((value) => ({ ...value, profiles }));
  }

  async function submitNewSale(payload, { showToast = true } = {}) {
    await api("/api/sales-notes", {
      method: "POST",
      body: payload
    });
    setForms((value) => ({ ...value, sale: newSaleForm() }));
    await loadAll();
    await loadNextSalesNoteNumber();
    await loadUtilities(utilityDateFilter);
    if (showToast) {
      notify("Nota de venta registrada.");
    }
  }

  function requestAddSaleCylinderLine(field, template) {
    const lines = forms.sale[field] || [];
    const line = lines[lines.length - 1];
    const serialNumber = String(line?.cylinderNumber || "").trim();
    const registeredCylinder = findCylinderByNumber(state.cylinders, serialNumber);

    if (!serialNumber || registeredCylinder) {
      addSaleLine(setForms, field, template);
      return;
    }

    if (line.capacityM3 === "" || Number(line.capacityM3) <= 0 || !String(line.ownerName || "").trim()) {
      notify(`Completa la capacidad y la propiedad del cilindro nuevo ${serialNumber}.`);
      return;
    }

    setMissingCylinderDialog({
      status: "confirm",
      action: "add-line",
      lineField: field,
      cylinder: {
        serialNumber,
        capacityM3: Number(line.capacityM3),
        ownerName: uppercaseCustomerName(line.ownerName)
      },
      cylinders: [{
        movementType: field === "deliveredCylinders" ? "ENTREGADO" : "RECIBIDO",
        serialNumber,
        productName: findById(state.products, line.productId)?.name || "-",
        capacityM3: Number(line.capacityM3),
        ownerName: uppercaseCustomerName(line.ownerName),
        amount: field === "deliveredCylinders" && line.amount !== "" ? Number(line.amount) : null
      }],
      error: ""
    });
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
            observations: form.observations || null
          }
        });
        setForms((value) => ({ ...value, sale: newSaleForm() }));
        await loadAll();
        notify("Nota actualizada correctamente.");
      });
      return;
    }

    if (!form.noteType) {
      notify("Selecciona el tipo de nota antes de continuar.");
      return;
    }

    const deliveredLines = form.noteType === "RECEPCION" ? [] : (form.deliveredCylinders || []).filter(saleLineHasAnyValue);
    const collectedLines = form.noteType === "ENTREGA" ? [] : (form.collectedCylinders || []).filter(saleLineHasAnyValue);
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
    const incompleteNewCylinder = [...deliveredLines, ...collectedLines].find((line) => {
      const cylinder = findCylinderByNumber(state.cylinders, line.cylinderNumber);
      return !cylinder && (line.capacityM3 === "" || !String(line.ownerName || "").trim());
    });
    if (incompleteNewCylinder) {
      notify(`Completa la capacidad y la propiedad del cilindro nuevo ${incompleteNewCylinder.cylinderNumber}.`);
      return;
    }

    const deliveredCylinders = deliveredLines
      .map((line) => {
        const cylinder = findCylinderByNumber(state.cylinders, line.cylinderNumber);
        return {
          cylinderId: cylinder?.id,
          serialNumber: line.cylinderNumber.trim(),
          productId: Number(line.productId),
          capacityM3: line.capacityM3 === "" ? cylinder?.capacityM3 ?? null : Number(line.capacityM3),
          amount: line.amount === "" ? null : Number(line.amount),
          ownerName: line.ownerName || saleCylinderOwnerName(cylinder) || null,
          observations: line.observations || null
        };
      });
    const collectedCylinders = collectedLines
      .map((line) => {
        const cylinder = findCylinderByNumber(state.cylinders, line.cylinderNumber);
        return {
          cylinderId: cylinder?.id,
          serialNumber: line.cylinderNumber.trim(),
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
    const repeated = findRepeatedCylinder([...deliveredCylinders, ...collectedCylinders]);
    if (repeated) {
      notify(`El cilindro ${repeated} está repetido en la nota.`);
      return;
    }
    const payload = {
      noteNumber: null,
      customerName: uppercaseCustomerName(form.customerName),
      noteDate: form.noteDate,
      observations: form.observations || null,
      utilityAmount: saleUtilityAmount(form),
      registerMissingCylinders: false,
      deliveredCylinders,
      collectedCylinders
    };
    const missingCylinders = [
      ...deliveredLines.map((line) => ({
        movementType: "ENTREGADO",
        serialNumber: line.cylinderNumber.trim(),
        productName: findById(state.products, line.productId)?.name || "-",
        capacityM3: Number(line.capacityM3),
        ownerName: uppercaseCustomerName(line.ownerName),
        amount: line.amount === "" ? null : Number(line.amount)
      })),
      ...collectedLines.map((line) => ({
        movementType: "RECIBIDO",
        serialNumber: line.cylinderNumber.trim(),
        productName: findById(state.products, line.productId)?.name || "-",
        capacityM3: Number(line.capacityM3),
        ownerName: uppercaseCustomerName(line.ownerName),
        amount: null
      }))
    ].filter((line) => !findCylinderByNumber(state.cylinders, line.serialNumber));

    if (missingCylinders.length) {
      setMissingCylinderDialog({
        status: "confirm",
        cylinders: missingCylinders,
        payload,
        error: ""
      });
      return;
    }

    await runAction(() => submitNewSale(payload));
  }

  async function confirmMissingCylinderRegistration() {
    if (!missingCylinderDialog || missingCylinderDialog.status === "processing") return;
    const pendingDialog = missingCylinderDialog;
    setMissingCylinderDialog({ ...pendingDialog, status: "processing", error: "" });
    try {
      if (pendingDialog.action === "add-line") {
        const registeredCylinder = await api("/api/cylinders", {
          method: "POST",
          body: {
            serialNumber: pendingDialog.cylinder.serialNumber,
            capacityM3: pendingDialog.cylinder.capacityM3,
            owner: pendingDialog.cylinder.ownerName,
            price: null,
            ownerType: isCompanyCylinderOwner(pendingDialog.cylinder.ownerName) ? "COMPANY" : "CUSTOMER"
          }
        });
        setState((current) => ({
          ...current,
          cylinders: [
            ...current.cylinders.filter((item) => normalizeCylinderNumberKey(item.serialNumber) !== normalizeCylinderNumberKey(registeredCylinder.serialNumber)),
            registeredCylinder
          ]
        }));
        addSaleLine(
          setForms,
          pendingDialog.lineField,
          pendingDialog.lineField === "deliveredCylinders" ? emptyDeliveredLine : emptyCollectedLine
        );
        setMissingCylinderDialog({ ...pendingDialog, status: "success", error: "" });
        window.setTimeout(() => setMissingCylinderDialog(null), 2200);
        return;
      }

      if (!pendingDialog.payload) return;
      await submitNewSale(
        { ...pendingDialog.payload, registerMissingCylinders: true },
        { showToast: false }
      );
      setMissingCylinderDialog({ ...pendingDialog, status: "success", error: "" });
      window.setTimeout(() => setMissingCylinderDialog(null), 2200);
    } catch (error) {
      setMissingCylinderDialog({
        ...pendingDialog,
        status: "error",
        error: error.message || "No se pudo registrar el cilindro."
      });
    }
  }

  function rejectMissingCylinderRegistration() {
    if (!missingCylinderDialog || missingCylinderDialog.status === "processing") return;
    setMissingCylinderDialog((current) => current ? { ...current, status: "rejected", error: "" } : current);
    window.setTimeout(() => setMissingCylinderDialog(null), 2200);
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
        noteDate: note.noteDate?.slice(0, 16) || localDateTimeInputValue(),
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

  const requestedPageKey = active === "sales" ? "sales-create" : active;
  const pageKey = canAccessPage(session, requestedPageKey) ? requestedPageKey : "dashboard";
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
        customers={state.customers}
      />
    ),
    clients: (
      <ClientsView
        customers={state.customers}
        initialInventory={state.inventory}
        forms={forms}
        setForms={setForms}
        editCustomer={editCustomer}
        closeCustomerEditor={closeCustomerEditor}
        customerEditorClosing={customerEditorClosing}
        updateCustomer={updateCustomer}
      />
    ),
    "sales-create": (
      <SalesView
        mode="create"
        forms={forms}
        setForms={setForms}
        createSale={createSale}
        cylinders={state.cylinders}
        products={state.products}
        customers={state.customers}
        inventory={state.inventory}
        salesNotes={state.salesNotes}
        editSale={editSale}
        cancelSale={cancelSale}
        salesDateFilter={salesDateFilter}
        setSalesDateFilter={setSalesDateFilter}
        searchSalesNotes={searchSalesNotes}
        requestAddSaleCylinderLine={requestAddSaleCylinderLine}
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
        customers={state.customers}
        inventory={state.inventory}
        salesNotes={state.salesNotes}
        recentSalesNotes={state.recentSalesNotes}
        editSale={editSale}
        cancelSale={cancelSale}
        salesDateFilter={salesDateFilter}
        setSalesDateFilter={setSalesDateFilter}
        searchSalesNotes={searchSalesNotes}
        requestAddSaleCylinderLine={requestAddSaleCylinderLine}
      />
    ),
    "sales-export": <SalesMovementExportView />,
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
    audit: <AuditView />,
    printing: (
      <PrintingView
        salesNotes={printingNotes}
        recentNotes={recentPrintingNotes}
        customers={state.customers}
        selectedPrintNoteId={selectedPrintNoteId}
        setSelectedPrintNoteId={setSelectedPrintNoteId}
        printSaleNote={printSaleNote}
        filter={printingFilter}
        setFilter={setPrintingFilter}
        searchNotes={searchPrintingNotes}
        loading={printingLoading}
      />
    ),
    profile: <ProfileView session={session} />
  }[pageKey];

  const activeMeta = findNavItem(visibleNavItems, pageKey) || visibleNavItems[0] || navItems[0];

  return (
    <div className="appShell">
      <Sidebar active={pageKey} setActive={setActive} navItems={visibleNavItems} />
      <main className="mainPane">
        <Topbar title={activeMeta.label} session={session} onLogout={logout} />
        <section className="workspace">
          {state.message && <div className="toast">{state.message}</div>}
          {state.loading ? <Skeleton /> : page}
        </section>
      </main>
      {missingCylinderDialog && (
        <MissingCylinderDialog
          dialog={missingCylinderDialog}
          onConfirm={confirmMissingCylinderRegistration}
          onReject={rejectMissingCylinderRegistration}
          onClose={() => setMissingCylinderDialog(null)}
        />
      )}
    </div>
  );
}

function Sidebar({ active, setActive, navItems }) {
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

function filterNavItemsForSession(items, session) {
  return items
    .map((item) => {
      if (!canAccessPage(session, item.id)) return null;
      if (!item.children?.length) return item;
      const children = item.children.filter((child) => canAccessPage(session, child.id));
      return children.length ? { ...item, children } : null;
    })
    .filter(Boolean);
}

function canAccessPage(session, pageId) {
  const permission = PAGE_PERMISSIONS[pageId];
  return !permission || hasPermission(session, permission);
}

function hasPermission(session, permission) {
  const role = normalizeRoleName(session?.profile?.roleName);
  return Boolean(role && ROLE_PERMISSIONS[role]?.has(permission));
}

function normalizeRoleName(roleName) {
  const normalized = String(roleName || "").trim().toUpperCase();
  return normalized === "ADMIN" ? "ADMINISTRADOR" : normalized;
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
              <strong>{normalizeRoleName(profile?.roleName) || "IAM"}</strong>
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
      <div className="splitGrid dashboardGrid">
        <Card title="Alertas operativas">
          <StatusRow label="Cilindros de OXIPUR" value={operationalAlerts?.oxipurCylinderCount ?? 0} state="OK" />
          <StatusRow label="Cilindros fuera de planta" value={metrics.inCustomer} state={metrics.inCustomer > 0 ? "EN CURSO" : "OK"} />
          <StatusRow label="Cilindros sin ubicación" value={inventory.filter((item) => !item.currentLocationType).length} state="REVISAR" />
          <StatusRow label="Movimientos registrados" value={movements.length} state="OK" />
        </Card>
        <Card title="Movimientos recientes" className="recentMovementsCard">
          <DatePeriodFilter
            value={movementDateFilter}
            onChange={setMovementDateFilter}
            onApply={searchMovements}
            onClear={searchMovements}
          />
          <DataTable
            columns={["Tipo", "Cilindro", "Cliente", "Fecha"]}
            rows={latest.map((movement) => [
              formatMovementType(movement.movementType),
              movement.cylinderId,
              movement.destinationCustomerName || movement.originCustomerName || "-",
              formatDateTime(movement.movementDate)
            ])}
            empty="Sin movimientos registrados"
            className="recentMovementsTable"
          />
        </Card>
      </div>
    </>
  );
}

function InventoryView({ filters, setFilters, searchInventory, inventory, cylinders = [], customers = [] }) {
  const [selectedCylinder, setSelectedCylinder] = useState(null);
  const activeFilter = exclusiveFilterKey(filters, ["locationType", "customerName", "serialNumber"]);
  const activeFilterLabel = {
    locationType: "Ubicación",
    customerName: "Cliente",
    serialNumber: "Serie"
  }[activeFilter];
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
        <ExclusiveFilterNotice activeFilterLabel={activeFilterLabel} />
        <div className="formGrid four">
          <Field label="Ubicación">
            <select
              value={filters.locationType}
              onChange={(event) => setFilters({ ...filters, locationType: event.target.value })}
              disabled={Boolean(activeFilter && activeFilter !== "locationType")}
            >
              <option value="">Todas</option>
              <option value={MAIN_WAREHOUSE}>{MAIN_WAREHOUSE}</option>
              <option value="CLIENTE">CLIENTE</option>
            </select>
          </Field>
          <Field label="Cliente">
            <CustomerFilterSelect
              customers={customers}
              value={filters.customerName}
              onChange={(customerName) => setFilters({ ...filters, customerName })}
              disabled={Boolean(activeFilter && activeFilter !== "customerName")}
            />
          </Field>
          <Field label="Serie">
            <input
              value={filters.serialNumber}
              onChange={(event) => setFilters({ ...filters, serialNumber: event.target.value })}
              placeholder="CYL-001"
              disabled={Boolean(activeFilter && activeFilter !== "serialNumber")}
            />
          </Field>
          <div className="buttonField">
            <div className="dateFilterActions">
              <button className="primaryBtn" onClick={() => searchInventory()} disabled={!activeFilter}>Buscar</button>
              <button type="button" className="secondaryBtn" onClick={() => {
                const emptyFilters = { locationType: "", customerName: "", serialNumber: "" };
                setFilters(emptyFilters);
                searchInventory(emptyFilters);
              }} disabled={!activeFilter}>Limpiar</button>
            </div>
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

function ClientsView({ customers = [], initialInventory = [], forms, setForms, editCustomer, closeCustomerEditor, customerEditorClosing, updateCustomer }) {
  const editor = forms.customerEditor;
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

  const clients = useMemo(() => buildCustomerDirectory(customers, inventory), [customers, inventory]);

  const totalCylinders = clients.reduce((total, client) => total + client.cylinders.length, 0);
  const totalCapacity = clients.reduce((total, client) => total + client.totalCapacity, 0);

  return (
    <>
      <PageIntro eyebrow="CLIENTES" title="Clientes" subtitle="Consulta todos los clientes registrados y la posesión actual de cilindros." />
      <Card title="Directorio de clientes">
        <div className="clientsToolbar">
          <div>
            <span>Clientes registrados</span>
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
                  <div
                    key={client.name}
                    className="clientListButton clientListButtonEditable"
                    role="button"
                    tabIndex={0}
                    onClick={() => setDetailClient(client)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setDetailClient(client);
                      }
                    }}
                  >
                    <span>
                      <strong>{client.name}</strong>
                      <em>{formatCapacity(client.totalCapacity)} m3</em>
                    </span>
                    <b>{client.cylinders.length}</b>
                    <IconButton
                      title={client.id ? "Editar cliente" : "Este cliente aún no está registrado en el catálogo"}
                      onClick={() => editCustomer(client)}
                      icon={Edit3}
                      disabled={!client.id}
                    />
                    <span className="clientOpenIcon" aria-hidden="true"><Eye size={16} /></span>
                  </div>
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
          <EmptyState title="Sin clientes registrados" text="No hay clientes disponibles en la base de datos." />
        )}
      </Card>
      {editor.id && (
        <div className={`modalOverlay ${customerEditorClosing ? "closing" : "open"}`} onMouseDown={closeCustomerEditor}>
          <section className="customerEditModal" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modalHeader">
              <div>
                <span>CLIENTE</span>
                <h3>Editar cliente {editor.name}</h3>
              </div>
              <IconButton title="Cerrar" onClick={closeCustomerEditor} icon={X} />
            </div>
            <form onSubmit={updateCustomer}>
              <div className="formGrid two">
                <Field label="Nombre">
                  <input required value={editor.name} onChange={(event) => setNested(setForms, "customerEditor", "name", uppercaseCustomerName(event.target.value))} />
                </Field>
                <Field label="Estado">
                  <select value={editor.active ? "true" : "false"} onChange={(event) => setNested(setForms, "customerEditor", "active", event.target.value === "true")}>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </Field>
              </div>
              <div className="actionBar modalActions">
                <button className="primaryBtn">Guardar cambios</button>
                <button type="button" className="secondaryBtn" onClick={closeCustomerEditor}>Cancelar</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}

function SalesView({ mode = "create", forms, setForms, createSale, cylinders, products, customers = [], inventory = [], salesNotes, recentSalesNotes = [], editSale, cancelSale, salesDateFilter, setSalesDateFilter, searchSalesNotes, requestAddSaleCylinderLine }) {
  const form = forms.sale;
  const [detailNote, setDetailNote] = useState(null);
  const activeCylinders = cylinders.filter((item) => item.active !== false);
  const activeProducts = products.filter((item) => item.active !== false);
  const showingCreation = mode === "create";
  const requiresTypeSelection = showingCreation && !form.id && !form.noteType;
  const showUtilityField = Boolean(form.id) || form.noteType !== "RECEPCION";
  const salesFilterHasNoteNumber = salesNoteFilterHasNoteNumber(salesDateFilter);
  const salesFilterHasDateOrCustomer = salesNoteFilterHasDate(salesDateFilter) || salesNoteFilterHasCustomerName(salesDateFilter);
  const hasAnySalesFilter = salesFilterHasNoteNumber || salesFilterHasDateOrCustomer;
  const SALES_NOTE_COLUMNS = ["Número", "Cliente", "Fecha", "Total venta", "Estado", "Acciones"];
  const salesNoteRow = (note) => [
    note.noteNumber,
    note.customerName,
    formatDateTime(note.noteDate),
    money(note.totalAmount),
    note.status === "CANCELLED" ? <span className="dangerBadge">ANULADA</span> : "REGISTRADO",
    <div className="rowActions">
      <IconButton title="Ver detalle" onClick={() => setDetailNote(note)} icon={Eye} />
      <IconButton title="Editar datos generales" onClick={() => editSale(note)} icon={Edit3} disabled={note.status === "CANCELLED"} />
      <IconButton title="Anular nota" onClick={() => cancelSale(note)} icon={Trash2} disabled={note.status === "CANCELLED"} />
    </div>
  ];
  const customerNameSuggestions = useMemo(
    () => customers.map((customer) => uppercaseCustomerName(customer.name)).sort((left, right) => left.localeCompare(right, "es-BO")),
    [customers]
  );
  const existingCustomerNames = useMemo(
    () => new Set(customerNameSuggestions.map((name) => normalizeCustomerNameKey(name))),
    [customerNameSuggestions]
  );
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
    customerNameSuggestions.forEach(addSuggestion);
    buildCustomerGroups(inventory).forEach((client) => addSuggestion(client.name));
    (cylinders || []).forEach((cylinder) => addSuggestion(cylinder.owner));

    return Array.from(suggestions.values()).sort((left, right) => left.localeCompare(right, "es-BO"));
  }, [customerNameSuggestions, inventory, cylinders]);
  const ownerNameSuggestion = (value) => findOwnerNameSuggestion(ownerNameSuggestions, value);
  const cylinderNumberSuggestions = useMemo(
    () => activeCylinders.map((cylinder) => cylinder.serialNumber).sort((left, right) => left.localeCompare(right, "es-BO", { numeric: true })),
    [activeCylinders]
  );
  const cylinderNumberSuggestion = (value) => findOwnerNameSuggestion(cylinderNumberSuggestions, value);
  const customerNameSuggestion = findOwnerNameSuggestion(customerNameSuggestions, form.customerName);
  const customerNameKey = normalizeCustomerNameKey(form.customerName);
  const customerExists = customerNameKey ? existingCustomerNames.has(customerNameKey) : false;
  const existingCylinderNumbers = useMemo(() => new Set((cylinders || []).map((cylinder) => normalizeCylinderNumberKey(cylinder.serialNumber)).filter(Boolean)), [cylinders]);
  const cylinderHint = (value) => {
    const cylinderKey = normalizeCylinderNumberKey(value);
    if (!cylinderKey || existingCylinderNumbers.has(cylinderKey)) return null;
    return (
      <span className="customerHint customerHintWarning">
        Este cilindro no existe en la base de datos. Se solicitará confirmación antes de registrarlo.
      </span>
    );
  };
  const cylinderIsRegistered = (value) => {
    const cylinderKey = normalizeCylinderNumberKey(value);
    return Boolean(cylinderKey) && existingCylinderNumbers.has(cylinderKey);
  };
  const ownershipHint = (value) => {
    const ownerNameKey = normalizeCustomerNameKey(value);
    if (!ownerNameKey || ownerNameKey === normalizeCustomerNameKey(BRAND_OWNER_NAME)) return null;
    if (existingCustomerNames.has(ownerNameKey)) return null;
    return (
      <span className="customerHint customerHintWarning">
        Propietario no detectado en el apartado Clientes.
      </span>
    );
  };
  const ownerNameIsValid = (value) => {
    const ownerNameKey = normalizeCustomerNameKey(value);
    if (!ownerNameKey) return false;
    return ownerNameKey === normalizeCustomerNameKey(BRAND_OWNER_NAME) || existingCustomerNames.has(ownerNameKey);
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
        {requiresTypeSelection ? (
          <SaleTypePrompt onSelect={(noteType) => setNested(setForms, "sale", "noteType", noteType)} />
        ) : (
        <>
        <div className="salesComposer">
          <form onSubmit={createSale}>
            {!form.id && (
              <div className="saleTypeBadge">
                <span>Tipo de nota: <strong>{form.noteType === "ENTREGA" ? "Nota de entrega" : "Nota de recepción"}</strong></span>
                <button type="button" className="secondaryBtn" onClick={() => resetSaleType(setForms)}>Cambiar tipo</button>
              </div>
            )}
            <div className={showUtilityField ? "formGrid five" : "formGrid four"}>
              <Field label="Número">
                <input required disabled value={form.noteNumber} placeholder="Se asignará automáticamente" />
              </Field>
              <Field label="Cliente" className="floatingHintField">
                {customerNameKey && !customerExists && (
                  <span className="customerHint customerHintWarning">
                    Cliente no detectado en el apartado Clientes.
                  </span>
                )}
                <AutocompleteInput
                  required
                  list="sales-customer-suggestions"
                  value={form.customerName}
                  suggestion={customerNameSuggestion}
                  onChange={(event) => setNested(setForms, "sale", "customerName", uppercaseCustomerName(event.target.value))}
                  onSuggestionAccept={(suggestion) => setNested(setForms, "sale", "customerName", suggestion)}
                  placeholder="Cliente"
                  showCheck={customerExists}
                />
                <datalist id="sales-customer-suggestions">
                  {customerNameSuggestions.map((name) => <option key={name} value={name} />)}
                </datalist>
              </Field>
              <Field label="Fecha">
                <input required type="datetime-local" value={form.noteDate} onChange={(event) => setNested(setForms, "sale", "noteDate", event.target.value)} />
              </Field>
              {showUtilityField && (
                <Field label="Utilidad (Bs)">
                  <input readOnly value={saleUtilityAmount(form).toFixed(2)} title="Se calcula con los precios de los cilindros entregados" />
                </Field>
              )}
              <Field label="Observación">
                <input value={form.observations} onChange={(event) => setNested(setForms, "sale", "observations", event.target.value)} placeholder="Detalle opcional" />
              </Field>
            </div>
            {form.id ? (
              <div className="notice">Editando datos generales. Para corregir cilindros, anula la nota y registra una nueva.</div>
            ) : form.noteType === "ENTREGA" ? (
                <LineSection
                  title="Cilindros entregados"
                  icon={ArrowUpFromLine}
                  lines={form.deliveredCylinders}
                  onAdd={() => requestAddSaleCylinderLine("deliveredCylinders", emptyDeliveredLine)}
                  headerLabels={["Nro. cilindro", "Producto", "Capacidad (m3)", "Monto (Bs)", "Propiedad", "Observación", ""]}
                  rowClassName="deliveredLine"
                >
                  {(line, index) => {
                    const selected = findCylinderByNumber(activeCylinders, line.cylinderNumber);
                    const started = saleLineHasAnyValue(line);
                    return (
                      <div className="lineGrid deliveredLine" key={index}>
                        <Field label="Nro. cilindro" className="floatingHintField">
                          {cylinderHint(line.cylinderNumber)}
                          <AutocompleteInput
                            required={started}
                            value={line.cylinderNumber}
                            suggestion={cylinderNumberSuggestion(line.cylinderNumber)}
                            onChange={(event) => {
                              const selectedCylinder = findCylinderByNumber(activeCylinders, event.target.value);
                              updateSaleLine(setForms, "deliveredCylinders", index, "cylinderNumber", event.target.value, {
                                capacityM3: selectedCylinder?.capacityM3 ?? "",
                                ownerName: selectedCylinder ? saleCylinderOwnerName(selectedCylinder) : ""
                              });
                            }}
                            onSuggestionAccept={(suggestion) => {
                              const selectedCylinder = findCylinderByNumber(activeCylinders, suggestion);
                              updateSaleLine(setForms, "deliveredCylinders", index, "cylinderNumber", suggestion, {
                                capacityM3: selectedCylinder?.capacityM3 ?? "",
                                ownerName: selectedCylinder ? saleCylinderOwnerName(selectedCylinder) : ""
                              });
                            }}
                            placeholder="1001"
                            showCheck={cylinderIsRegistered(line.cylinderNumber)}
                          />
                        </Field>
                        <Field label="Producto">
                          <select required={started} value={line.productId} onChange={(event) => updateSaleLine(setForms, "deliveredCylinders", index, "productId", event.target.value)}>
                            <option value="">Seleccionar</option>
                            {activeProducts.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                          </select>
                        </Field>
                        <Field label="Capacidad (m3)">
                          <input required={started && !selected} type="number" min="0.01" step="0.01" value={line.capacityM3} onChange={(event) => updateSaleLine(setForms, "deliveredCylinders", index, "capacityM3", event.target.value)} placeholder={selected ? String(selected.capacityM3) : "0.00"} />
                        </Field>
                        <Field label="Monto (Bs)">
                          <input type="number" min="0" step="0.01" value={line.amount} onChange={(event) => updateSaleLine(setForms, "deliveredCylinders", index, "amount", event.target.value)} placeholder="0.00" />
                        </Field>
                        <Field label="Propiedad" className="floatingHintField">
                          {ownershipHint(line.ownerName)}
                          <AutocompleteInput
                            required={started && !selected}
                            value={line.ownerName}
                            suggestion={ownerNameSuggestion(line.ownerName)}
                            onChange={(event) => updateSaleLine(setForms, "deliveredCylinders", index, "ownerName", uppercaseCustomerName(event.target.value))}
                            onSuggestionAccept={(suggestion) => updateSaleLine(setForms, "deliveredCylinders", index, "ownerName", suggestion)}
                            placeholder={selected ? saleCylinderOwnerName(selected) || "Dueño del cilindro" : "Dueño del cilindro"}
                            showCheck={ownerNameIsValid(line.ownerName)}
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
            ) : (
                <LineSection
                  title="Cilindros recogidos"
                  icon={ArrowDownToLine}
                  lines={form.collectedCylinders}
                  onAdd={() => requestAddSaleCylinderLine("collectedCylinders", emptyCollectedLine)}
                  headerLabels={["Nro. cilindro", "Producto", "Capacidad (m3)", "Propiedad", "Observación", ""]}
                  rowClassName="collectedLine"
                >
                  {(line, index) => {
                    const selected = findCylinderByNumber(activeCylinders, line.cylinderNumber);
                    const started = saleLineHasAnyValue(line);
                    return (
                      <div className="lineGrid collectedLine" key={index}>
                        <Field label="Nro. cilindro" className="floatingHintField">
                          {cylinderHint(line.cylinderNumber)}
                          <AutocompleteInput
                            required={started}
                            value={line.cylinderNumber}
                            suggestion={cylinderNumberSuggestion(line.cylinderNumber)}
                            onChange={(event) => {
                              const selectedCylinder = findCylinderByNumber(activeCylinders, event.target.value);
                              updateSaleLine(setForms, "collectedCylinders", index, "cylinderNumber", event.target.value, {
                                capacityM3: selectedCylinder?.capacityM3 ?? "",
                                ownerName: selectedCylinder ? saleCylinderOwnerName(selectedCylinder) : ""
                              });
                            }}
                            onSuggestionAccept={(suggestion) => {
                              const selectedCylinder = findCylinderByNumber(activeCylinders, suggestion);
                              updateSaleLine(setForms, "collectedCylinders", index, "cylinderNumber", suggestion, {
                                capacityM3: selectedCylinder?.capacityM3 ?? "",
                                ownerName: selectedCylinder ? saleCylinderOwnerName(selectedCylinder) : ""
                              });
                            }}
                            placeholder="1001"
                            showCheck={cylinderIsRegistered(line.cylinderNumber)}
                          />
                        </Field>
                        <Field label="Producto">
                          <select value={line.productId} onChange={(event) => updateSaleLine(setForms, "collectedCylinders", index, "productId", event.target.value)}>
                            <option value="">Seleccionar</option>
                            {activeProducts.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                          </select>
                        </Field>
                        <Field label="Capacidad (m3)">
                          <input required={started && !selected} type="number" min="0.01" step="0.01" value={line.capacityM3} onChange={(event) => updateSaleLine(setForms, "collectedCylinders", index, "capacityM3", event.target.value)} placeholder={selected ? String(selected.capacityM3) : "0.00"} />
                        </Field>
                        <Field label="Propiedad" className="floatingHintField">
                          {ownershipHint(line.ownerName)}
                          <AutocompleteInput
                            required={started && !selected}
                            value={line.ownerName}
                            suggestion={ownerNameSuggestion(line.ownerName)}
                            onChange={(event) => updateSaleLine(setForms, "collectedCylinders", index, "ownerName", uppercaseCustomerName(event.target.value))}
                            onSuggestionAccept={(suggestion) => updateSaleLine(setForms, "collectedCylinders", index, "ownerName", suggestion)}
                            placeholder={selected ? saleCylinderOwnerName(selected) || "Dueño del cilindro" : "Dueño del cilindro"}
                            showCheck={ownerNameIsValid(line.ownerName)}
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
            )}
            <div className="actionBar">
              <button className="primaryBtn">{form.id ? "Guardar cambios" : "Crear nota"}</button>
              {form.id && <button type="button" className="secondaryBtn" onClick={() => setForms((value) => ({ ...value, sale: newSaleForm() }))}>Cancelar edición</button>}
            </div>
          </form>
        </div>
        <SalePreview form={form} cylinders={cylinders} products={products} />
        </>
        )}
      </Card>
      )}
      {!showingCreation && (
      <Card title="Notas registradas">
        <DatePeriodFilter
          value={salesDateFilter}
          onChange={setSalesDateFilter}
          onApply={searchSalesNotes}
          onClear={searchSalesNotes}
          applyLabel="Buscar"
          applyDisabled={!hasAnySalesFilter}
          periodDisabled={salesFilterHasNoteNumber}
          clearValueFactory={createSalesNoteFilter}
          className="salesNotesFilter"
        >
          <Field label="Número de nota">
            <input
              value={salesDateFilter.noteNumber}
              onChange={(event) => setSalesDateFilter({
                ...salesDateFilter,
                noteNumber: event.target.value.toUpperCase()
              })}
              onKeyDown={(event) => {
                if (event.key === "Enter") searchSalesNotes(salesDateFilter);
              }}
              placeholder="NV-000123"
              disabled={salesFilterHasDateOrCustomer}
            />
          </Field>
          <Field label="Cliente">
            <CustomerFilterSelect
              customers={customers}
              value={salesDateFilter.customerName}
              onChange={(customerName) => setSalesDateFilter({ ...salesDateFilter, customerName })}
              disabled={salesFilterHasNoteNumber}
            />
          </Field>
        </DatePeriodFilter>
        {(hasAnySalesFilter || salesNotes.length > 0) && (
          <DataTable
            compact
            columns={SALES_NOTE_COLUMNS}
            rows={salesNotes.map(salesNoteRow)}
            empty="No se encontraron notas con el filtro indicado"
            onRowClick={(index) => setDetailNote(salesNotes[index])}
          />
        )}
      </Card>
      )}
      {!showingCreation && (
      <Card title="Últimas 20 notas registradas">
        <DataTable
          compact
          columns={SALES_NOTE_COLUMNS}
          rows={recentSalesNotes.map(salesNoteRow)}
          empty="Todavía no hay notas de venta registradas"
          onRowClick={(index) => setDetailNote(recentSalesNotes[index])}
        />
      </Card>
      )}
      {detailNote && (
        <DetailModal eyebrow="NOTA DE VENTA" title={detailNote.noteNumber} onClose={() => setDetailNote(null)}>
          <div className="detailGrid compact">
            <div><span>Cliente</span><strong>{detailNote.customerName}</strong></div>
            <div><span>Fecha</span><strong>{formatDateTime(detailNote.noteDate)}</strong></div>
            <div><span>Total venta</span><strong>{money(detailNote.totalAmount)}</strong></div>
            <div><span>Utilidad</span><strong>{money(detailNote.utilityAmount)}</strong></div>
            <div><span>Estado</span><strong>{detailNote.status === "CANCELLED" ? "ANULADA" : "REGISTRADA"}</strong></div>
            <div><span>Cantidad</span><strong>{(detailNote.deliveredCylinders || []).length + (detailNote.collectedCylinders || []).length}</strong></div>
          </div>
          <PreviewSection
            title="Cilindros entregados"
            empty="La nota no tiene cilindros entregados."
            columns={["N°", "Serie", "Producto", "Capacidad", "Propiedad", "Monto", "Observación"]}
            rows={(detailNote.deliveredCylinders || []).map((line, index) => [
              index + 1,
              line.serialNumber || line.cylinderId,
              line.productName || "-",
              `${formatCapacity(line.capacityM3)} m3`,
              line.ownerName || "-",
              line.amount == null ? "-" : money(line.amount),
              line.observations || "-"
            ])}
          />
          <PreviewSection
            title="Cilindros recibidos vacíos"
            empty="La nota no tiene cilindros recibidos."
            columns={["N°", "Serie", "Producto", "Capacidad", "Propiedad", "Observación"]}
            rows={(detailNote.collectedCylinders || []).map((line, index) => [
              index + 1,
              line.serialNumber || line.cylinderId,
              line.productName || "-",
              `${formatCapacity(line.capacityM3)} m3`,
              line.ownerName || "-",
              line.observations || "-"
            ])}
          />
        </DetailModal>
      )}
    </>
  );
}

function UtilitiesView({ summary, loading, error, dateFilter, setDateFilter, loadUtilities }) {
  const label = periodResultLabel(summary?.dateFilterType);
  return (
    <>
      <PageIntro eyebrow="UTILIDADES" title="Utilidades" subtitle="Resumen del monto recaudado por las notas de venta registradas." />
      <Card title="Filtros">
        <DatePeriodFilter
          value={dateFilter}
          onChange={setDateFilter}
          onApply={loadUtilities}
          onClear={loadUtilities}
        />
      </Card>
      <div className="metricGrid utilityMetrics">
        <Metric label={label} value={loading ? "..." : money(summary?.totalRevenue ?? 0)} icon={Activity} />
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

function SalesMovementExportView() {
  const [dateFilter, setDateFilter] = useState(createDateFilter("MONTH"));
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function generateExcel(nextFilter = dateFilter) {
    setExporting(true);
    setError("");
    setResult(null);
    try {
      const exported = await downloadSalesMovementWorkbook(nextFilter);
      setResult(exported);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setExporting(false);
    }
  }

  return (
    <>
      <PageIntro
        eyebrow="EXCEL"
        title="Exportar movimientos"
        subtitle="Genera el detalle de cilindros entregados y recibidos de las notas de venta del periodo seleccionado."
      />
      <Card title="Periodo de las notas de venta">
        <DatePeriodFilter
          value={dateFilter}
          onChange={setDateFilter}
          onApply={generateExcel}
          onClear={() => setResult(null)}
          applyLabel={exporting ? "Generando..." : "Generar Excel"}
          applyDisabled={exporting}
        />
        {error && <div className="notice dangerNotice">{error}</div>}
        {result && (
          <div className="notice successNotice">
            Archivo generado: {result.fileName} ({result.movementCount} movimientos).
          </div>
        )}
      </Card>
      <Card title="Formato del archivo">
        <div className="excelFormatPanel">
          <div className="excelFormatIcon"><ArrowDownToLine size={22} /></div>
          <div>
            <strong>DetalleMovimientos</strong>
            <span>Una fila por cilindro entregado o recibido, compatible con el formato proporcionado.</span>
          </div>
        </div>
        <div className="excelColumns" aria-label="Columnas incluidas">
          {["Boleta", "Fecha", "Serie", "Tamano (m³)", "Producto", "Propietario", "Cliente Nota", "Cliente", "Estado", "Monto (BOB)", "Observaciones"]
            .map((column) => <span key={column}>{column}</span>)}
        </div>
      </Card>
    </>
  );
}

function AuditView() {
  const [result, setResult] = useState({ content: [], page: 0, size: 50, totalElements: 0, totalPages: 0 });
  const [selectedLog, setSelectedLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPage(page = 0) {
    setLoading(true);
    setError("");
    try {
      const nextResult = await api(`/api/audit-logs?page=${Math.max(page, 0)}&size=50`);
      setResult(nextResult);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPage(0);
  }, []);

  const logs = result.content || [];
  const actorsOnPage = new Set(logs.map((log) => log.actorUsername || "SISTEMA")).size;

  return (
    <>
      <PageIntro
        eyebrow="CONTROL ADMINISTRATIVO"
        title="Auditoría"
        subtitle="Consulta quién registró, modificó, anuló o desactivó información en el sistema."
      />
      <div className="metricGrid auditMetrics">
        <Metric label="Eventos registrados" value={result.totalElements || 0} icon={History} />
        <Metric label="Usuarios en esta página" value={actorsOnPage} icon={Users} />
        <Metric label="Página actual" value={result.totalPages ? `${result.page + 1} / ${result.totalPages}` : "0 / 0"} icon={ClipboardList} />
      </div>
      <Card title="Historial de cambios">
        <div className="auditToolbar">
          <div>
            <strong>Trazabilidad protegida</strong>
            <span>Disponible exclusivamente para perfiles con rol Administrador.</span>
          </div>
          <button type="button" className="secondaryBtn iconTextBtn" onClick={() => loadPage(result.page)} disabled={loading}>
            <RefreshCw size={16} className={loading ? "spinIcon" : ""} /> Actualizar
          </button>
        </div>
        {error && <div className="notice dangerNotice">{error}</div>}
        {loading && !logs.length ? (
          <Skeleton />
        ) : (
          logs.length ? (
            <div className="auditEventList">
              {logs.map((log) => {
                const eventDate = formatAuditDateParts(log.createdAt);
                return (
                  <article
                    className="auditEventCard"
                    key={log.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedLog(log)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedLog(log);
                      }
                    }}
                  >
                    <div className="auditEventDate">
                      <History size={18} />
                      <strong>{eventDate.date}</strong>
                      <span>{eventDate.time}</span>
                    </div>
                    <div className="auditEventBody">
                      <div className="auditEventHeading">
                        <div className="auditActor">
                          <UserRound size={17} />
                          <span>Realizado por</span>
                          <strong>{log.actorUsername || "SISTEMA"}</strong>
                        </div>
                        <span className={`auditActionBadge ${String(log.action || "").toLowerCase()}`}>{auditActionLabel(log.action)}</span>
                      </div>
                      <strong className="auditEventSummary">{auditEventSummary(log)}</strong>
                      <div className="auditEventMeta">
                        <span><b>Módulo:</b> {auditEntityLabel(log.entityType)}</span>
                        <span><b>Registro:</b> #{log.entityId}</span>
                        <span><b>Origen:</b> {auditSourceLabel(log.sourceType)}</span>
                      </div>
                    </div>
                    <button type="button" className="auditOpenButton" onClick={(event) => {
                      event.stopPropagation();
                      setSelectedLog(log);
                    }}>
                      Ver detalle <Eye size={16} />
                    </button>
                  </article>
                );
              })}
            </div>
          ) : (
            <EmptyState title="Sin eventos" text="Todavía no hay eventos de auditoría registrados" />
          )
        )}
        <div className="auditPagination">
          <button type="button" className="secondaryBtn" onClick={() => loadPage(result.page - 1)} disabled={loading || result.page <= 0}>Anterior</button>
          <span>{result.totalPages ? `Página ${result.page + 1} de ${result.totalPages}` : "Sin páginas"}</span>
          <button type="button" className="secondaryBtn" onClick={() => loadPage(result.page + 1)} disabled={loading || result.page + 1 >= result.totalPages}>Siguiente</button>
        </div>
      </Card>
      {selectedLog && (
        <DetailModal
          eyebrow="EVENTO DE AUDITORÍA"
          title={`${auditActionLabel(selectedLog.action)} · ${auditEntityLabel(selectedLog.entityType)}`}
          onClose={() => setSelectedLog(null)}
        >
          <div className="detailGrid compact auditDetailMeta">
            <div><span>Usuario</span><strong>{selectedLog.actorUsername || "SISTEMA"}</strong></div>
            <div><span>Fecha y hora</span><strong>{formatAuditDateTime(selectedLog.createdAt)}</strong></div>
            <div><span>Registro</span><strong>{selectedLog.entityId}</strong></div>
            <div><span>Origen</span><strong>{auditSourceLabel(selectedLog.sourceType)}</strong></div>
            <div><span>Solicitud</span><strong>{[selectedLog.requestMethod, selectedLog.requestPath].filter(Boolean).join(" ") || "-"}</strong></div>
            <div><span>Dirección IP</span><strong>{selectedLog.ipAddress || "-"}</strong></div>
          </div>
          <AuditChanges log={selectedLog} />
        </DetailModal>
      )}
    </>
  );
}

function AuditChanges({ log }) {
  const rows = auditChangeRows(log);
  return (
    <div className="auditChanges">
      <h4>Cambios registrados</h4>
      {rows.length ? (
        <div className="auditChangeList">
          {rows.map((row) => (
            <section className="auditChangeItem" key={row.field}>
              <strong className="auditChangeField">{auditFieldLabel(row.field)}</strong>
              <div className="auditChangeComparison">
                <div className="auditBeforeValue">
                  <span>Antes</span>
                  <code className="auditValue">{auditValueText(row.previous)}</code>
                </div>
                <div className="auditAfterValue">
                  <span>Después</span>
                  <code className="auditValue">{auditValueText(row.next)}</code>
                </div>
              </div>
            </section>
          ))}
        </div>
      ) : (
        <EmptyState title="Sin diferencias" text="El evento no contiene valores comparables" />
      )}
    </div>
  );
}

function PrintingView({ salesNotes, recentNotes, customers = [], selectedPrintNoteId, setSelectedPrintNoteId, printSaleNote, filter, setFilter, searchNotes, loading }) {
  const selectedNote = [...recentNotes, ...salesNotes].find((note) => String(note.id) === String(selectedPrintNoteId));
  const filterState = printingFilterState(filter);

  function submitSearch(event) {
    event.preventDefault();
    searchNotes(filter);
  }

  function clearSearch() {
    const nextFilter = createPrintingNoteFilter(false);
    setFilter(nextFilter);
    searchNotes(nextFilter);
  }

  return (
    <>
      <PageIntro eyebrow="IMPRESIÓN" title="Impresión" subtitle="Selecciona una de las últimas notas registradas o busca otra nota con un solo filtro a la vez." />
      <Card title="Buscar otra nota">
        <PrintingFilterGuide filterState={filterState} />
        <form className="printingSearch" onSubmit={submitSearch}>
          <Field label="Fecha de la nota">
            <input
              type="date"
              value={filter.date}
              onChange={(event) => setFilter({ ...filter, date: event.target.value })}
              disabled={filterState.lockDateAndCustomer}
            />
          </Field>
          <Field label="Cliente">
            <CustomerFilterSelect
              customers={customers}
              value={filter.customerName}
              onChange={(customerName) => setFilter({ ...filter, customerName })}
              disabled={filterState.lockDateAndCustomer}
            />
          </Field>
          <Field label="Número de nota">
            <input
              value={filter.noteNumber}
              onChange={(event) => setFilter({ ...filter, noteNumber: event.target.value.toUpperCase() })}
              placeholder="NV-000123"
              disabled={filterState.lockNoteNumber}
            />
          </Field>
          <div className="dateFilterActions">
            <button type="submit" className="primaryBtn iconTextBtn" disabled={loading || !filterState.isActive}>
              {loading ? <><LoaderCircle className="spinIcon" size={16} /> Buscando...</> : "Buscar"}
            </button>
            <button type="button" className="secondaryBtn" onClick={clearSearch} disabled={loading}>Limpiar</button>
          </div>
        </form>
        {(filterState.isActive || salesNotes.length > 0 || loading) && (
          <DataTable
            columns={PRINTING_NOTE_COLUMNS}
            rows={salesNotes.map((note) => printingNoteRow(note, selectedPrintNoteId, setSelectedPrintNoteId))}
            empty={loading ? "Buscando notas de venta..." : "No se encontraron notas con el filtro indicado"}
          />
        )}
      </Card>
      <Card title="Últimas 20 notas registradas">
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
          columns={PRINTING_NOTE_COLUMNS}
          rows={recentNotes.map((note) => printingNoteRow(note, selectedPrintNoteId, setSelectedPrintNoteId))}
          empty="Todavía no hay notas de venta registradas"
        />
      </Card>
    </>
  );
}

// Filtro de cliente: solo permite elegir entre los clientes ya registrados.
function CustomerFilterSelect({ customers = [], value, onChange, disabled }) {
  const names = useMemo(
    () => [...new Set(customers.map((customer) => String(customer.name || "").trim()).filter(Boolean))]
      .sort((left, right) => left.localeCompare(right, "es-BO")),
    [customers]
  );
  const hasStaleValue = Boolean(value) && !names.includes(value);
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled || (!names.length && !value)}
    >
      <option value="">{names.length ? "Todos los clientes" : "Sin clientes registrados"}</option>
      {hasStaleValue && <option value={value}>{value}</option>}
      {names.map((name) => <option key={name} value={name}>{name}</option>)}
    </select>
  );
}

function PrintingFilterGuide({ filterState }) {
  const status = filterState.hasNoteNumber
    ? "Buscando por número de nota. Vacíalo o pulsa Limpiar para usar Fecha y Cliente."
    : filterState.hasDate && filterState.hasCustomer
      ? "Combinando Fecha y Cliente."
      : filterState.hasDate || filterState.hasCustomer
        ? "Puedes sumar el otro filtro para acotar más la búsqueda. Número de nota queda bloqueado."
        : "";

  return (
    <div className="filterGuide" role="note">
      <div className="filterGuideHeader">
        <Search size={18} />
        <div>
          <strong>Cómo buscar una nota</strong>
          <span>Elige una de estas dos formas de búsqueda:</span>
        </div>
      </div>
      <div className="filterGuideOptions">
        <div className={`filterGuideOption${filterState.hasDate || filterState.hasCustomer ? " active" : ""}`}>
          <Layers size={18} />
          <div>
            <strong>Fecha + Cliente</strong>
            <span>Se pueden usar juntos o por separado. Ideal para ver las notas de un cliente en un día.</span>
          </div>
        </div>
        <div className={`filterGuideOption${filterState.hasNoteNumber ? " active" : ""}`}>
          <Hash size={18} />
          <div>
            <strong>Número de nota</strong>
            <span>Identifica una sola nota, por eso se usa solo, sin combinarlo.</span>
          </div>
        </div>
      </div>
      {status && <p className="filterGuideStatus">{status}</p>}
    </div>
  );
}

const PRINTING_NOTE_COLUMNS =["Seleccionar", "Número", "Cliente", "Fecha", "Importe total", "Estado"];

function printingNoteRow(note, selectedPrintNoteId, setSelectedPrintNoteId) {
  return [
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
    money(note.totalAmount),
    note.status === "CANCELLED" ? <span className="dangerBadge">ANULADA</span> : "REGISTERED"
  ];
}

function SaleTypePrompt({ onSelect }) {
  return (
    <div className="saleTypePrompt">
      <p className="saleTypePromptText">Selecciona el tipo de nota antes de continuar. No podrás combinar entregas y recepciones en la misma nota.</p>
      <div className="saleTypeOptions">
        <button type="button" className="saleTypeOption" onClick={() => onSelect("ENTREGA")}>
          <ArrowUpFromLine size={22} />
          <strong>Nota de entrega</strong>
          <span>Entrega cilindros llenos a un cliente.</span>
        </button>
        <button type="button" className="saleTypeOption" onClick={() => onSelect("RECEPCION")}>
          <ArrowDownToLine size={22} />
          <strong>Nota de recepción</strong>
          <span>Recibe cilindros vacíos de un cliente.</span>
        </button>
      </div>
    </div>
  );
}

function resetSaleType(setForms) {
  setForms((current) => ({
    ...current,
    sale: {
      ...current.sale,
      noteType: null,
      deliveredCylinders: [{ ...emptyDeliveredLine }],
      collectedCylinders: [{ ...emptyCollectedLine }]
    }
  }));
}

function SalePreview({ form, cylinders, products }) {
  const delivered = previewDeliveredLines(form.deliveredCylinders, cylinders, products);
  const collected = previewCollectedLines(form.collectedCylinders, cylinders, products);
  const showDelivered = Boolean(form.id) || form.noteType !== "RECEPCION";
  const showCollected = Boolean(form.id) || form.noteType !== "ENTREGA";
  const deliveredCapacity = sumCapacity(delivered);
  const collectedCapacity = sumCapacity(collected);
  const totalAmount = delivered.reduce((total, line) => total + Number(line.amount || 0), 0);
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
          <span>Total venta</span>
          <strong>{money(totalAmount)}</strong>
        </div>
        {showDelivered && (
          <div className="previewBlock">
            <span>Utilidad</span>
            <strong>{money(saleUtilityAmount(form))}</strong>
          </div>
        )}
        <div className="previewBlock full">
          <span>Observación general</span>
          <p>{form.observations || "Sin observación general"}</p>
        </div>
      </div>
      {showDelivered && (
        <PreviewSection
          title="Cilindros entregados"
          empty="Aún no se agregaron cilindros entregados."
          rows={delivered.map((line, index) => [index + 1, line.serialNumber, line.productName, line.capacityM3 ? `${line.capacityM3} m3` : "-", line.ownerName || "-", line.amount === "" || line.amount == null ? "-" : money(line.amount), line.observations || "-"])}
          columns={["Nro.", "Número de serie", "Producto", "Capacidad (m3)", "Propiedad", "Monto", "Observación"]}
        />
      )}
      {showCollected && (
        <PreviewSection
          title="Cilindros recogidos"
          empty="Aún no se agregaron cilindros recogidos."
          rows={collected.map((line, index) => [index + 1, line.serialNumber, line.productName, line.capacityM3 ? `${line.capacityM3} m3` : "-", line.ownerName || "-", line.observations || "-"])}
          columns={["Nro.", "Número de serie", "Producto", "Capacidad (m3)", "Propiedad", "Observación"]}
        />
      )}
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

function DatePeriodFilter({ value, onChange, onApply, onClear, applyLabel = "Aplicar", applyDisabled = false, periodDisabled = false, clearValueFactory = createDateFilter, className = "", children = null }) {
  function update(field, fieldValue) {
    onChange({ ...value, [field]: fieldValue });
  }

  function clear() {
    const next = clearValueFactory();
    onChange(next);
    onClear(next);
  }

  return (
    <div className={`dateFilter${className ? ` ${className}` : ""}`}>
      <Field label="Tipo de fecha">
        <select value={value.dateFilterType} onChange={(event) => update("dateFilterType", event.target.value)} disabled={periodDisabled}>
          <option value="">Sin filtro</option>
          <option value="DAY">Día</option>
          <option value="MONTH">Mes</option>
          <option value="YEAR">Año</option>
        </select>
      </Field>
      {value.dateFilterType === "DAY" && (
        <Field label="Fecha">
          <input type="date" value={value.date} onChange={(event) => update("date", event.target.value)} disabled={periodDisabled} />
        </Field>
      )}
      {value.dateFilterType === "MONTH" && (
        <>
          <Field label="Mes">
            <select value={value.month} onChange={(event) => update("month", Number(event.target.value))} disabled={periodDisabled}>
              {monthOptions.map((month) => <option key={month.value} value={month.value}>{month.label}</option>)}
            </select>
          </Field>
          <Field label="Año">
            <input type="number" min="2000" max="2100" value={value.year} onChange={(event) => update("year", Number(event.target.value))} disabled={periodDisabled} />
          </Field>
        </>
      )}
      {value.dateFilterType === "YEAR" && (
        <Field label="Año">
          <input type="number" min="2000" max="2100" value={value.year} onChange={(event) => update("year", Number(event.target.value))} disabled={periodDisabled} />
        </Field>
      )}
      {children}
      <div className="dateFilterActions">
        <button type="button" className="primaryBtn" onClick={() => onApply(value)} disabled={applyDisabled}>{applyLabel}</button>
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
          compact
          className="cylindersTable"
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

function ProfileView({ session }) {
  const profile = session?.profile;
  return (
    <>
      <PageIntro eyebrow="SESIÓN" title="Perfil" subtitle="Datos de trabajo para el MVP local." />
      <Card title="Contexto operativo">
        <div className="profileGrid">
          <div><span>Empresa</span><strong>{BRAND_NAME}</strong></div>
          <div><span>Rol</span><strong>{normalizeRoleName(profile?.roleName) || "-"}</strong></div>
          <div><span>Usuario</span><strong>{profile?.username || "-"}</strong></div>
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

function Card({ title, children, className = "" }) {
  return (
    <section className={`card${className ? ` ${className}` : ""}`}>
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

function ExclusiveFilterNotice({ activeFilterLabel }) {
  return (
    <div className="notice exclusiveFilterNotice" role="note">
      <strong>Solo se permite un filtro a la vez.</strong>
      <span>
        {activeFilterLabel
          ? ` Filtro activo: ${activeFilterLabel}. Vacíalo o pulsa Limpiar para habilitar los demás.`
          : " Al comenzar a completar uno, los demás quedarán bloqueados."}
      </span>
    </div>
  );
}

function AutocompleteInput({ value, suggestion, onChange, onSuggestionAccept, placeholder, required = false, list, showCheck = false }) {
  const handleKeyDown = (event) => {
    if (!suggestion || !onSuggestionAccept) return;
    if (event.key === "Tab" || event.key === "ArrowRight") {
      event.preventDefault();
      onSuggestionAccept(suggestion);
    }
  };

  return (
    <div className={showCheck ? "autocompleteInput hasCheck" : "autocompleteInput"}>
      {showCheck && <span className="autocompleteCheck" aria-hidden="true" />}
      {suggestion && (
        <span className="autocompleteGhost">
          <span className="autocompleteGhostPrefix">{value}</span>
          <span>{suggestion.slice(value.length)}</span>
        </span>
      )}
      <input
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        required={required}
        list={list}
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

function LineSection({ title, icon: Icon, lines, onAdd, headerLabels, rowClassName, children }) {
  const visibleLines = (lines || []).length ? lines : [{}];

  return (
    <div className="lineSection">
      <div className="lineSectionHead">
        <PanelTitle icon={Icon} title={title} />
      </div>
      {headerLabels && (
        <div className={`lineGrid lineGridHeader ${rowClassName || ""}`.trim()}>
          {headerLabels.map((label, index) => <span key={index}>{label}</span>)}
        </div>
      )}
      <div className="lineList">
        {visibleLines.map((line, index) => children(line, index))}
      </div>
      <div className="lineSectionFoot">
        <button type="button" className="addLineBtn iconTextBtn" onClick={onAdd}><Plus size={16} /> Añadir</button>
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

function MissingCylinderDialog({ dialog, onConfirm, onReject, onClose }) {
  const count = dialog.cylinders?.length || 0;
  const isLineAdd = dialog.action === "add-line";
  const isConfirming = dialog.status === "confirm";
  const isProcessing = dialog.status === "processing";
  const isSuccess = dialog.status === "success";
  const isRejected = dialog.status === "rejected";
  const isError = dialog.status === "error";

  return (
    <div className="modalOverlay" role="presentation">
      <section className={`missingCylinderModal ${dialog.status}`} role="dialog" aria-modal="true" aria-labelledby="missing-cylinder-title">
        {(isConfirming || isProcessing) && (
          <>
            <div className="missingCylinderHeader">
              <div className="missingCylinderStatusIcon warning"><Gauge size={28} /></div>
              <div>
                <span>VALIDACIÓN DE CILINDROS</span>
                <h3 id="missing-cylinder-title">
                  {count === 1 ? "El cilindro no está registrado" : "Hay cilindros sin registrar"}
                </h3>
              </div>
            </div>
            <p className="missingCylinderQuestion">
              {isLineAdd
                ? "Este cilindro no existe en la base de datos. ¿Deseas agregarlo al módulo de Cilindros?"
                : count === 1
                ? "Este cilindro no existe en la base de datos actual. ¿Quieres agregarlo antes de crear la nota de venta?"
                : `Estos ${count} cilindros no existen en la base de datos actual. ¿Quieres agregarlos antes de crear la nota de venta?`}
            </p>
            <div className="missingCylinderPreview">
              <div className="missingCylinderPreviewTitle">Vista previa de la información</div>
              <DataTable
                columns={["Movimiento", "Cilindro", "Producto", "Capacidad", "Propiedad", "Monto"]}
                rows={(dialog.cylinders || []).map((cylinder) => [
                  cylinder.movementType,
                  cylinder.serialNumber,
                  cylinder.productName,
                  `${formatCapacity(cylinder.capacityM3)} m3`,
                  cylinder.ownerName,
                  cylinder.amount == null ? "-" : money(cylinder.amount)
                ])}
                empty="No hay cilindros pendientes."
              />
            </div>
            <div className="missingCylinderActions">
              <button type="button" className="primaryBtn" onClick={onConfirm} disabled={isProcessing}>
                {isProcessing
                  ? <><LoaderCircle className="spinIcon" size={17} /> Registrando...</>
                  : isLineAdd ? "Sí, registrar cilindro" : "Sí, agregar y crear nota"}
              </button>
              <button type="button" className="secondaryBtn dangerSecondaryBtn" onClick={onReject} disabled={isProcessing}>
                {isLineAdd ? "No, no añadir" : "No, cancelar"}
              </button>
            </div>
          </>
        )}
        {isSuccess && (
          <div className="cylinderDecisionResult success" role="status">
            <CheckCircle2 size={74} />
            <h3 id="missing-cylinder-title">{count === 1 ? "¡Cilindro registrado!" : "¡Cilindros registrados!"}</h3>
            <p>
              {count === 1
                ? isLineAdd
                  ? "El cilindro fue agregado al módulo de Cilindros y quedará disponible para las siguientes notas de venta."
                  : "El cilindro fue agregado a la base de datos y la nota de venta se creó correctamente."
                : `Los ${count} cilindros fueron agregados a la base de datos y la nota de venta se creó correctamente.`}
            </p>
          </div>
        )}
        {(isRejected || isError) && (
          <div className="cylinderDecisionResult rejected" role="alert">
            <CircleX size={74} />
            <h3 id="missing-cylinder-title">{isRejected ? "Cilindro no agregado" : "No se pudo completar la operación"}</h3>
            <p>
              {isRejected
                ? isLineAdd
                  ? "No se agregó el cilindro ni se añadió una nueva línea. Corrige o elimina la línea para continuar."
                  : "No se agregó el cilindro y la nota de venta no fue creada. Corrige o elimina la línea para continuar."
                : dialog.error}
            </p>
            {isError && <button type="button" className="secondaryBtn" onClick={onClose}>Volver a la nota</button>}
          </div>
        )}
      </section>
    </div>
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

function DataTable({ columns, rows, empty, onRowClick, compact = false, className = "" }) {
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

  if (compact) {
    return (
      <div className={`tableWrap compactTable${className ? ` ${className}` : ""}`} role="table">
        <div className="compactTableGrid">
          <div className="compactTableRow compactTableHeader" role="row">
            {columns.map((column) => <div className="compactTableCell" role="columnheader" key={column}>{column}</div>)}
          </div>
          <div role="rowgroup">
            {rows.map((row, index) => {
              const interactionProps = rowProps(index);
              return (
                <div
                  key={index}
                  {...interactionProps}
                  className={`compactTableRow${interactionProps.className ? ` ${interactionProps.className}` : ""}`}
                  role="row"
                >
                  {row.map((cell, cellIndex) => <div className="compactTableCell" role="cell" key={cellIndex}>{cell}</div>)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`tableWrap${className ? ` ${className}` : ""}`}>
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
    noteDate: localDateTimeInputValue(),
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
  return ["cylinderNumber", "productId", "capacityM3", "amount", "ownerName", "observations"].some((key) => String(line?.[key] || "").trim());
}

function createDateFilter(dateFilterType = "") {
  const now = new Date();
  return {
    dateFilterType,
    date: todayDate(),
    month: now.getMonth() + 1,
    year: now.getFullYear()
  };
}

function createSalesNoteFilter(dateFilterType = "") {
  return {
    ...createDateFilter(dateFilterType),
    noteNumber: "",
    customerName: ""
  };
}

function createPrintingNoteFilter(useToday = true) {
  return {
    date: useToday ? todayDate() : "",
    customerName: "",
    noteNumber: ""
  };
}

// El número de nota identifica una sola nota, por eso no se combina con Fecha ni Cliente.
// Fecha y Cliente sí se pueden combinar entre sí.
function printingFilterState(filter) {
  const hasNoteNumber = String(filter?.noteNumber ?? "").trim() !== "";
  const hasDate = String(filter?.date ?? "").trim() !== "";
  const hasCustomer = String(filter?.customerName ?? "").trim() !== "";
  return {
    hasNoteNumber,
    hasDate,
    hasCustomer,
    isActive: hasNoteNumber || hasDate || hasCustomer,
    lockNoteNumber: hasDate || hasCustomer,
    lockDateAndCustomer: hasNoteNumber
  };
}

function exclusiveFilterKey(filter, keys) {
  return keys.find((key) => String(filter?.[key] ?? "").trim() !== "") || "";
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

function salesNoteFilterHasNoteNumber(filter) {
  return Boolean(String(filter?.noteNumber || "").trim());
}

function salesNoteFilterHasCustomerName(filter) {
  return Boolean(String(filter?.customerName || "").trim());
}

function salesNoteFilterHasDate(filter) {
  return Boolean(filter?.dateFilterType);
}

function salesNoteFilterIsActive(filter) {
  return salesNoteFilterHasNoteNumber(filter) || salesNoteFilterHasDate(filter) || salesNoteFilterHasCustomerName(filter);
}

function buildSalesNoteQuery(filter) {
  const noteNumber = String(filter?.noteNumber || "").trim();
  if (noteNumber) {
    const params = new URLSearchParams();
    params.set("noteNumber", noteNumber);
    return `?${params.toString()}`;
  }

  const params = new URLSearchParams();
  if (filter?.dateFilterType) {
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
  }
  const customerName = String(filter?.customerName || "").trim();
  if (customerName) {
    params.set("customerName", customerName);
  }
  return params.toString() ? `?${params.toString()}` : "";
}

function buildPrintingNoteQuery(filter) {
  const params = new URLSearchParams();
  const date = String(filter?.date || "").trim();
  const customerName = String(filter?.customerName || "").trim();
  const noteNumber = String(filter?.noteNumber || "").trim();
  if (noteNumber) {
    params.set("noteNumber", noteNumber);
    return `?${params.toString()}`;
  }
  if (date) {
    params.set("dateFilterType", "DAY");
    params.set("date", date);
  }
  if (customerName) params.set("customerName", customerName);
  return params.toString() ? `?${params.toString()}` : "";
}

function findRepeatedCylinder(lines) {
  const seen = new Set();
  for (const line of lines) {
    const serialNumber = normalizeCylinderNumberKey(line.serialNumber);
    const key = line.cylinderId ? `id:${line.cylinderId}` : `serial:${serialNumber}`;
    if (seen.has(key)) return line.serialNumber || line.cylinderId;
    seen.add(key);
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
        amount: line.amount,
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
  // Solo por número de serie: comparar con el id interno hacía que "77" tomara el cilindro con id 77.
  return items.find((item) => normalizeCylinderNumberKey(item.serialNumber) === normalized);
}

function saleCylinderOwnerName(cylinder) {
  return uppercaseCustomerName(cylinder?.owner || "");
}

function isCompanyCylinderOwner(ownerName) {
  return uppercaseCustomerName(ownerName).trim().startsWith(BRAND_OWNER_NAME);
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
      const key = normalizeCustomerNameKey(name);
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

function buildCustomerDirectory(customers, inventory) {
  const possessionGroups = buildCustomerGroups(inventory);
  const possessionByName = new Map(
    possessionGroups.map((group) => [normalizeCustomerNameKey(group.name), group])
  );
  const directory = new Map();

  (customers || []).forEach((customer) => {
    const key = normalizeCustomerNameKey(customer.name);
    const possession = possessionByName.get(key);
    directory.set(key, {
      id: customer.id,
      name: customer.name,
      active: customer.active !== false,
      cylinders: possession?.cylinders || [],
      totalCapacity: possession?.totalCapacity || 0
    });
  });

  possessionGroups.forEach((possession) => {
    const key = normalizeCustomerNameKey(possession.name);
    if (!directory.has(key)) {
      directory.set(key, {
        id: null,
        name: possession.name,
        active: true,
        cylinders: possession.cylinders,
        totalCapacity: possession.totalCapacity
      });
    }
  });

  return Array.from(directory.values())
    .sort((left, right) => left.name.localeCompare(right.name, "es", { sensitivity: "base" }));
}

function formatLineSummary(lines = []) {
  if (!lines.length) return "0";
  return lines
    .map((line) => `${line.serialNumber || line.cylinderId} (${line.capacityM3 || "-"} m3, ${line.ownerName || "sin propiedad"})`)
    .join(", ");
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
    const completeNote = note?.id ? await api(`/api/sales-notes/${note.id}?usage=PRINT`) : note;
    const pdfBytes = await buildSaleNotePdf(completeNote);
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

  for (let pageIndex = 0; pageIndex < printablePages.length; pageIndex += 1) {
    const pageRows = printablePages[pageIndex];
    const [page] = await output.copyPages(template, [templatePageIndex]);
    output.addPage(page);
    drawSaleNotePage(
      page,
      note,
      pageRows,
      rows,
      pageIndex,
      regularFont,
      boldFont
    );
  }

  return output.save();
}

function drawSaleNotePage(page, note, pageRows, allRows, pageIndex, regularFont, boldFont) {
  const black = rgb(0, 0, 0);
  const red = rgb(1, 0, 0);
  const white = rgb(1, 1, 1);

  coverPdfText(page, 343, 591.2, 198, 48.5, white);
  drawSaleNoteTableHeader(page, boldFont, black, white);
  coverPdfText(page, 474.2, 651.5, 66, 18, white);
  drawPdfText(page, formatSaleNoteNumberForPdf(note.noteNumber), 475.9, 655.9, {
    font: boldFont,
    size: 12,
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

  pageRows.forEach((line, index) => drawSaleNotePdfRow(
    page,
    line,
    index,
    pageIndex * SALE_NOTE_ROWS_PER_PAGE + index + 1,
    regularFont,
    black
  ));

  coverPdfText(page, 407, 334.5, 122, 15, white);
  drawPdfText(page, `Bs ${formatMoneyPlain(calculateSaleNoteTotalAmount(note))}`, 410, 337.73, {
    font: regularFont,
    size: 8.76,
    color: black,
    maxWidth: 118
  });
}

const SALE_NOTE_PDF_COLUMNS = [
  { key: "number", header: "No.", x: 73, width: 24 },
  { key: "serialNumber", header: "NUMERO DE SERIE", x: 97, width: 68 },
  { key: "capacityM3", header: "CAP. (M3)", x: 165, width: 43 },
  { key: "gasType", header: "TIPO DE GAS", x: 208, width: 75 },
  { key: "ownerName", header: "PROPIETARIO", x: 283, width: 62 },
  { key: "status", header: "ESTADO", x: 345, width: 61 },
  { key: "amount", header: "MONTO EN BS.", x: 406, width: 60 },
  { key: "observations", header: "OBSERVACIONES", x: 466, width: 74 }
];

function drawSaleNoteTableHeader(page, font, color, background) {
  coverPdfText(page, 72, 560.3, 467.5, 21.7, background);
  SALE_NOTE_PDF_COLUMNS.forEach((column) => {
    drawCenteredPdfText(page, column.header, column.x, 569.02, column.width, {
      font,
      size: 7.44,
      color
    });
  });
}

function drawSaleNotePdfRow(page, line, index, rowNumber, font, color) {
  const y = 551.47 - index * 12;
  const detailY = y - 1.44;
  const values = { ...line, number: String(rowNumber) };

  SALE_NOTE_PDF_COLUMNS.forEach((column) => {
    drawCenteredPdfText(page, values[column.key], column.x, ["number", "serialNumber", "capacityM3"].includes(column.key) ? y : detailY, column.width - 4, {
      font,
      size: 7.44,
      color
    });
  });
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
    gasType: line.productName || "",
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

function formatSaleNoteNumberForPdf(value) {
  const normalized = String(value || "").trim().toUpperCase();
  const numericMatch = normalized.match(/^(?:NV-)?(\d+)$/);
  if (!numericMatch) {
    return normalized;
  }
  return `NV-${numericMatch[1].padStart(6, "0")}`;
}

function chunkRows(rows, size) {
  const chunks = [];
  for (let index = 0; index < rows.length; index += size) {
    chunks.push(rows.slice(index, index + size));
  }
  return chunks;
}

function calculateSaleNoteTotalAmount(note) {
  return (note?.deliveredCylinders || []).reduce(
    (total, line) => total + Number(line.amount || 0),
    0
  );
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
    headers.Authorization = `Bearer ${session.accessToken}`;
  }
  let response;
  try {
    response = await fetch(path, {
      method: options.method || "GET",
      headers: Object.keys(headers).length ? headers : undefined,
      body: options.body ? JSON.stringify(options.body) : undefined
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor. Verifica tu conexion e intenta nuevamente.");
  }
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

async function downloadSalesMovementWorkbook(filter) {
  const path = `/api/sales-notes/movements.xlsx${buildDateQuery(filter)}`;
  const session = readStoredSession();
  const headers = session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : undefined;
  const response = await fetch(path, { headers });

  if (!response.ok) {
    const text = await response.text();
    const error = new Error(readErrorMessage(text, response.status));
    error.status = response.status;
    if (response.status === 401) {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(LAST_ACTIVITY_KEY);
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }
    throw error;
  }

  const disposition = response.headers.get("Content-Disposition") || "";
  const fileNameMatch = disposition.match(/filename="?([^";]+)"?/i);
  const fileName = fileNameMatch?.[1] || "oxipur_detallemovimientos.xlsx";
  const movementCount = Number(response.headers.get("X-Movement-Count") || 0);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  return { fileName, movementCount };
}

function readStoredSession() {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    const session = stored ? JSON.parse(stored) : null;
    if (!isStoredSessionValid(session)) {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(LAST_ACTIVITY_KEY);
      return null;
    }
    return session;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(LAST_ACTIVITY_KEY);
    return null;
  }
}

function isStoredSessionValid(session) {
  if (!session?.accessToken || !session?.profile) return false;
  if (!session.expiresAt) return true;
  return new Date(session.expiresAt).getTime() > Date.now();
}

function readLastActivityAt() {
  const stored = Number(localStorage.getItem(LAST_ACTIVITY_KEY));
  return Number.isFinite(stored) && stored > 0 ? stored : Date.now();
}

function readErrorMessage(text, status) {
  if (status === 401) return "Sesion expirada o no autenticada. Ingresa nuevamente.";
  if (status === 403) return "No tienes permiso para realizar esta accion.";
  if (status >= 500 && !isJsonBody(text)) {
    return "No se pudo conectar con el servidor. Verifica que el backend este iniciado e intenta nuevamente.";
  }
  if (!text) return `Error ${status}`;
  try {
    const parsed = JSON.parse(text);
    return parsed.error || parsed.message || `Error ${status}`;
  } catch {
    return `Error ${status}`;
  }
}

function isJsonBody(text) {
  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
}

function todayDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function localDateTimeInputValue() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${todayDate()}T${hours}:${minutes}`;
}

function formatDateTime(value) {
  if (!value) return "-";
  return value.replace("T", " ").slice(0, 16);
}

function formatAuditDateTime(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("es-BO", {
    dateStyle: "medium",
    timeStyle: "medium",
    timeZone: "America/La_Paz"
  }).format(new Date(value));
}

function formatAuditDateParts(value) {
  if (!value) return { date: "Sin fecha", time: "-" };
  const date = new Date(value);
  return {
    date: new Intl.DateTimeFormat("es-BO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "America/La_Paz"
    }).format(date),
    time: new Intl.DateTimeFormat("es-BO", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "America/La_Paz"
    }).format(date)
  };
}

function auditEventSummary(log) {
  const entity = auditEntityLabel(log?.entityType).toLowerCase();
  const action = {
    LOGIN: "Inició sesión en el sistema",
    LOGIN_FAILED: "Intentó iniciar sesión sin éxito",
    LOGOUT: "Cerró su sesión",
    VIEW: `Consultó ${entity}`,
    SEARCH: `Realizó una búsqueda en ${entity}`,
    PRINT: `Imprimió ${entity}`,
    EXPORT: `Exportó información de ${entity}`,
    ACCESS_DENIED: `Intentó acceder sin permiso a ${entity}`,
    OPERATION_FAILED: `Intentó una operación que no pudo completarse en ${entity}`,
    CREATE: `Registró un nuevo ${entity}`,
    UPDATE: `Modificó un ${entity}`,
    DELETE: `Eliminó un ${entity}`,
    DEACTIVATE: `Desactivó un ${entity}`,
    MERGE: `Unificó registros de ${entity}`,
    CANCEL: `Anuló un ${entity}`,
    IMPORT: `Importó registros de ${entity}`
  }[log?.action];
  return action || `Realizó una operación sobre ${entity}`;
}

function auditActionLabel(action) {
  return {
    LOGIN: "Inicio de sesión",
    LOGIN_FAILED: "Acceso rechazado",
    LOGOUT: "Cierre de sesión",
    VIEW: "Consulta",
    SEARCH: "Búsqueda",
    PRINT: "Impresión",
    EXPORT: "Exportación",
    ACCESS_DENIED: "Acceso denegado",
    OPERATION_FAILED: "Operación fallida",
    CREATE: "Creación",
    UPDATE: "Modificación",
    DELETE: "Eliminación",
    DEACTIVATE: "Desactivación",
    MERGE: "Unificación",
    CANCEL: "Anulación",
    IMPORT: "Importación"
  }[action] || action || "Evento";
}

function auditEntityLabel(entityType) {
  return {
    SESSION: "Sesión",
    AUDIT_LOG: "Auditoría",
    INVENTORY: "Inventario",
    UTILITY: "Utilidades",
    OPERATIONAL_ALERT: "Alerta operativa",
    SECURITY: "Seguridad",
    SALES_NOTE: "Nota de venta",
    CYLINDER: "Cilindro",
    PRODUCT: "Producto",
    CUSTOMER: "Cliente",
    USER_PROFILE: "Perfil de usuario",
    WAREHOUSE: "Almacén",
    INVENTORY_MOVEMENT: "Movimiento de inventario"
  }[entityType] || String(entityType || "Registro").replaceAll("_", " ");
}

function auditSourceLabel(sourceType) {
  return { USER: "USUARIO", SYSTEM: "SISTEMA", IMPORT: "IMPORTACIÓN" }[sourceType] || sourceType || "SISTEMA";
}

function auditChangeRows(log) {
  const previous = parseAuditData(log?.previousData);
  const next = parseAuditData(log?.newData);
  const fields = Array.from(new Set([...Object.keys(previous), ...Object.keys(next)]));
  return fields
    .filter((field) => JSON.stringify(previous[field]) !== JSON.stringify(next[field]))
    .map((field) => ({ field, previous: previous[field], next: next[field] }));
}

function parseAuditData(value) {
  if (value == null || value === "") return {};
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
    return { detail: parsed };
  } catch {
    return { detail: value };
  }
}

function auditFieldLabel(field) {
  const labels = {
    id: "Identificador",
    noteNumber: "Número de nota",
    customerName: "Cliente",
    noteDate: "Fecha de la nota",
    observations: "Observaciones",
    utilityAmount: "Utilidad",
    totalAmount: "Importe total",
    status: "Estado",
    sourceType: "Origen",
    serialNumber: "Número de cilindro",
    capacityM3: "Capacidad (m3)",
    owner: "Propietario",
    ownerType: "Tipo de propietario",
    currentLocationType: "Ubicación actual",
    currentCustomerName: "Cliente actual",
    code: "Código",
    name: "Nombre",
    description: "Descripción",
    fullName: "Nombre completo",
    username: "Usuario",
    roleName: "Rol",
    active: "Activo",
    deliveredCylinders: "Cilindros entregados",
    collectedCylinders: "Cilindros recogidos",
    movements: "Movimientos",
    detail: "Detalle"
  };
  if (labels[field]) return labels[field];
  return String(field)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replaceAll("_", " ")
    .replace(/^./, (letter) => letter.toUpperCase());
}

function auditValueText(value) {
  if (value === undefined || value === null || value === "") return "-";
  if (typeof value === "boolean") return value ? "Sí" : "No";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}

function formatMovementType(value) {
  if (value === "PLANTA_A_CLIENTE") return "Entrega";
  if (value === "CLIENTE_A_PLANTA") return "Recogida";
  return value || "-";
}

function formatSaleNoteDateForPdf(value) {
  if (!value) return "";
  const [date = "", time = ""] = String(value).split("T");
  const [year, month, day] = date.split("-");
  return [day, month, year].every(Boolean) ? `${day}/${month}/${year} ${time.slice(0, 5)}`.trim() : formatDateTime(value);
}

// Al crear una nota, la utilidad es la suma de los precios asignados a los cilindros entregados.
// Al editar una nota existente el formulario no carga los cilindros, así que se conserva el valor guardado.
function saleUtilityAmount(form) {
  if (form.id) return moneyInputValue(form.utilityAmount);
  if (form.noteType === "RECEPCION") return 0;
  const total = (form.deliveredCylinders || []).reduce((sum, line) => sum + (Number(line.amount) || 0), 0);
  return Math.round(total * 100) / 100;
}

function moneyInputValue(value) {
  if (value === null || value === undefined || value === "") return 0;
  return Number(value);
}

function uppercaseCustomerName(value) {
  return String(value || "").trimStart().toLocaleUpperCase("es-BO");
}

function normalizeCustomerNameKey(value) {
  return uppercaseCustomerName(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("es-BO");
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
  if (type === "DAY") return "Total recaudado el día seleccionado";
  if (type === "MONTH") return "Total recaudado en el mes seleccionado";
  if (type === "YEAR") return "Total recaudado en el año seleccionado";
  return "Total recaudado";
}

createRoot(document.getElementById("root")).render(<App />);
