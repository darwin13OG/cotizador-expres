# Catálogo de Servicios y Materiales Frecuentes

Permite a los usuarios guardar y gestionar una lista de servicios y materiales frecuentes (con descripción, precio unitario sugerido y categoría) para insertarlos con un solo clic al crear cotizaciones, ahorrando tiempo de tipeo repetitivo.

### Decisiones Críticas y Resumen de Preferencias

> [!IMPORTANT]
> El usuario confirmó que la funcionalidad de mayor valor es el **Catálogo de servicios y materiales frecuentes** y que **no requiere exportación adicional (Excel/CSV/JSON)** para mantener la aplicación ligera y concisa.

- **Ubicación de Gestión del Catálogo**: En **Ajustes** (pestaña dedicada "Catálogo"), manteniendo la pantalla principal limpia y sin saturación.
- **Uso al Cotizar**: En el creador de cotizaciones, un botón limpio y minimalista `+ Desde catálogo` que despliega un selector rápido para insertar el ítem sin recargar la pantalla.
- **Persistencia**: LocalStorage seguro (`cp_v7_catalog`) para funcionamiento 100% offline y sin consumo de cuota ni APIs externas.

---

## 1. Visión General & Concepto Clave

- **Qué hace**: Permite precargar o crear ítems recurrentes (ej. *"Mano de obra técnica"*, *"Punto eléctrico"*, *"Mantenimiento preventivo"*, *"Cableado estructurado"*, *"Visita técnica"*). Al crear una cotización, el usuario puede pulsar un botón rápido y seleccionar cualquier ítem para que su descripción y precio se agreguen automáticamente con formato de miles y cálculo instantáneo.
- **Para quién es**: Técnicos, instaladores, profesionales independientes y pequeños talleres que ofrecen servicios o materiales con tarifas fijas o repetitivas.
- **Valor agregado**: Reduce el tiempo de confección de un presupuesto de 2 minutos a menos de 30 segundos, evitando errores al ingresar descripciones y montos.

---

## 2. Experiencia de Usuario & Flujos de Navegación

### Flujo 1: Administración del Catálogo (en Ajustes)
1. El usuario entra a **Ajustes** y selecciona la nueva pestaña **"Catálogo"**.
2. Visualiza la lista de servicios/materiales guardados con su precio formateado con puntos de mil.
3. Puede agregar un nuevo ítem (Nombre/Descripción, Precio sugerido, Tipo: Servicio o Material) o eliminar ítems existentes.
4. Se incluyen ejemplos iniciales por defecto (editables o eliminables) para que no comience vacío.

### Flujo 2: Inserción Rápida en la Cotización
1. En la vista **Crear Presupuesto**, al lado de `+ AGREGAR OTRO CONCEPTO`, se incluye un botón discreto `+ DESDE CATÁLOGO`.
2. Al tocarlo, se abre un selector modal limpio con búsqueda rápida o selección directa.
3. Al elegir un ítem del catálogo, se añade inmediatamente como una fila de concepto con su precio y cantidad = 1 prellenados, listos para editarse si se requiere.
4. Se mantiene el formateo automático con puntos de mil y el cálculo en tiempo real.

```
┌─────────────────────────────────────────────────────────────────┐
│                     CREAR PRESUPUESTO                           │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Datos del Cliente (Nombre, WhatsApp con prefijo)            │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─ Ítem #1 ───────────────────────────────────────────────────┐ │
│ │ Mantenimiento de aire acondicionado       Subtotal: 120.000 │ │
│ │ Cantidad: 1                     Precio c/u: 120.000         │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│   [ + AGREGAR CONCEPTO ]        [ ⚡ DESDE CATÁLOGO ]            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Decisiones Técnicas & Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                      ESTADO DE LA APLICACIÓN                    │
│                                                                 │
│  techData (Negocio, Teléfono, Moneda, Logo, Plantilla WhatsApp) │
│  currentQuote (Cliente, Ítems, Moneda, Desglose)                │
│  history (Presupuestos anteriores guardados)                    │
│  catalog [ { id, title, defaultPrice, type } ]  <-- NUEVO       │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                     ALMACENAMIENTO LOCAL                        │
│  localStorage: cp_v7_catalog (Offline-first, sin backend)       │
└─────────────────────────────────────────────────────────────────┘
```

- **Estructura del Ítem del Catálogo**:
  - `id`: timestamp único.
  - `name`: Nombre o descripción del trabajo / material.
  - `price`: Número entero o decimal.
  - `category`: 'servicio' o 'material'.
- **Sin saturación de pantalla**: El catálogo reside en Ajustes para su configuración y se invoca bajo demanda en la cotización mediante un popup modal ligero.
- **Rendimiento**: Cero dependencias externas adicionales; utiliza los métodos existentes de Vue 3 (`formatDots`, `formatCurrency`, etc.).

---

## 4. Plan de Ejecución Paso a Paso

1. **Estado y Persistencia (`index.html`)**:
   - Agregar `catalog: []` en `data()` de Vue 3.
   - Cargar y sincronizar con `localStorage.getItem('cp_v7_catalog')`.
   - Inicializar con 2-3 ítems modelo comunes si está vacío.
2. **Pestaña en Ajustes**:
   - Añadir la pestaña `Catálogo` en el menú de navegación de Ajustes.
   - Formulario compacto para crear ítems (nombre y precio con input formateado con puntos de mil).
   - Lista con botón para borrar o editar ítems.
3. **Selector Rápido en Creador de Cotización**:
   - Botón `+ Desde Catálogo` en la sección de conceptos.
   - Modal minimalista emergente con filtro/búsqueda y botón de agregar directo.
4. **Verificación y Pruebas**:
   - Comprobar adición de ítem desde catálogo y recálculo automático del total y PDF.
   - Verificar guardado en `localStorage`.
   - Comprobar que en móviles y computadores se visualice correctamente sin barras de scroll invasivas ni saturación.
