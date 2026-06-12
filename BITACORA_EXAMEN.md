# Bitácora de examen — Módulo de reporte de fraudes

**Curso:** Programación IV / Desarrollo Web  
**Valor:** 100 puntos  
**Modalidad:** Individual / Parejas  
**Estudiante(s):** _[Completar nombre(s)]_  
**Fecha:** 11 de junio de 2026  

---

## Datos de entrega

| Campo | Valor |
|-------|--------|
| **Repositorio Frontend** | https://github.com/Wuipy/ExamenFinalFrontend |
| **Rama Frontend** | `examen/reporte-fraudes` |
| **Repositorio Backend** | https://github.com/Wuipy/ExamenFinalBackend |
| **Rama Backend** | `Wuipy` |
| **URL Frontend publicado** | _[Netlify — completar al desplegar]_ |
| **URL API publicada** | _[Railway — completar al desplegar]_ |

---

## Propósito del módulo

Desarrollar e integrar un módulo público para **reportar fraudes**, conectando un Frontend (React + Vite) con un Backend (.NET + EF Core) y PostgreSQL en **Supabase**. La solución permite registrar reportes, consultarlos en `/reportes` y demostrar el flujo en ambiente desplegado, **sin autenticación**.

---

## Parte 1. Preparación de repositorios y ejecución local (10 pts)

### Actividades realizadas

| Actividad | Puntos | Estado | Evidencia |
|-----------|--------|--------|-----------|
| Repositorios propios Frontend y Backend | 2 | ✅ | Fork/clon de `labcibe-home` y `LibrariesApiTest` |
| Instalar dependencias y ejecutar Frontend | 2 | ✅ | `npm install` → `npm run dev` → http://localhost:5173 |
| Ejecutar Backend y verificar configuración | 2 | ✅ | `dotnet run` → http://localhost:5219/swagger |
| Rama `examen/reporte-fraudes` en Backend | 2 | ⚠️ | Rama activa: `Wuipy` _(considerar merge a rama del examen)_ |
| Rama `examen/reporte-fraudes` en Frontend | 2 | ✅ | Rama `examen/reporte-fraudes` en ExamenFinalFrontend |

### Notas técnicas

- **Frontend:** React 19, TypeScript, Vite, Tailwind, react-router-dom.
- **Backend:** .NET 8, EF Core, Npgsql, Swagger, CORS habilitado.
- **Secrets locales:** `Supabase:ConnectionString` en user secrets (Backend); `.env` con `VITE_API_URL` (Frontend, en `.gitignore`).

### Evidencia sugerida (capturas)

1. Repositorios en GitHub con ramas visibles.  
2. Terminal con `npm run dev` y sitio en localhost:5173.  
3. Terminal con `dotnet run` y Swagger en localhost:5219.  

---

## Parte 2. Backend API en .NET con Entity Framework (30 pts)

### Actividades realizadas

| Actividad | Puntos | Estado | Archivo / ubicación |
|-----------|--------|--------|---------------------|
| Entidad `Fraud` (Id, ImpostorDetails, ContactInfo, Comments, CreatedAt) | 5 | ✅ | `Data/LibraryContext.cs` |
| `DbSet<Fraud> Frauds` en DbContext | 4 | ✅ | `Data/LibraryContext.cs` |
| `IFraudService` / `FraudService` | 6 | ✅ | `Services/FraudService.cs` |
| `FraudsController` POST + GET | 8 | ✅ | `Controllers/FraudsController.cs` |
| Registro DI, DbContext, CORS, Swagger | 4 | ✅ | `Startup.cs`, `Program.cs` |
| HTTP 200/201, 400 con mensajes claros | 3 | ✅ | Controlador + validaciones en servicio |

### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/frauds` | Crea reporte. Body JSON: `impostorDetails`, `contactInfo`, `comments` |
| `GET` | `/api/frauds` | Lista todos los reportes (ordenados por fecha descendente) |

### DTO

- `DTO/FraudForm.cs` con `[JsonProperty]` en camelCase alineado al Frontend.

### Evidencia sugerida

1. Swagger: POST exitoso (201) y GET (200).  
2. Captura de código: entidad, servicio y controlador.  
3. POST inválido → respuesta 400 con mensaje en español.  

---

## Parte 3. Base de datos PostgreSQL en Supabase (15 pts)

### Actividades realizadas

| Actividad | Puntos | Estado | Detalle |
|-----------|--------|--------|---------|
| Base de datos propia en Supabase | 4 | ✅ | Proyecto Supabase configurado |
| ConnectionString segura (no en código) | 4 | ✅ | `Supabase:ConnectionString` en user secrets / Railway |
| Tabla de fraudes (migración EF) | 4 | ✅ | Migración `CreateFraudsTable`; tabla `Fraudes` |
| Persistencia demostrada | 3 | ✅ | Reportes visibles en Supabase Table Editor y vía GET API |

### Configuración de conexión

- **Local:** user secrets (`labcibe-libraries-api-dev`).  
- **Producción:** variable `Supabase__ConnectionString` en Railway.  
- **Resolución flexible:** `Data/DatabaseConnection.cs` (Npgsql o `DATABASE_URL`).

### Evidencia sugerida

1. Supabase → Tablas → `Fraudes` con filas registradas.  
2. GET `/api/frauds` mostrando los mismos datos.  
3. _(Opcional)_ Script SQL o carpeta `Migrations/`.  

---

## Parte 4. Frontend: formulario y consulta pública (25 pts)

### Actividades realizadas

| Actividad | Puntos | Estado | Archivo / ruta |
|-----------|--------|--------|----------------|
| Reemplazar “Proyecto en construcción” | 5 | ✅ | `pages/ReportFraud.tsx`, ruta `/reportar-estafa` |
| Campos: impostor, contacto, comentarios | 5 | ✅ | `components/report/FraudReportForm.tsx` |
| Validaciones campos obligatorios | 4 | ✅ | `validateForm()` + mensajes por campo |
| Consumir POST del Backend | 4 | ✅ | `lib/fraudReportService.ts` → `createFraudReport()` |
| Ruta `/reportes` con GET | 5 | ✅ | `pages/FraudReportsPage.tsx`, `FraudReportsList.tsx` |
| Mensajes carga, éxito y error | 2 | ✅ | Estados en formulario y listado |

### Servicio Frontend

```env
VITE_API_URL=http://localhost:5219   # local
VITE_API_URL=https://[api-railway]     # producción
```

### Rutas

| Ruta | Función |
|------|---------|
| `/reportar-estafa` | Formulario de reporte |
| `/reportes` | Listado de reportes desde API |

### Evidencia sugerida

1. Formulario completo antes de enviar.  
2. Mensaje de éxito tras enviar.  
3. Página `/reportes` con tarjetas de reportes.  
4. Network tab (F12): POST y GET a `/api/frauds`.  

---

## Parte 5. Publicación y verificación en ambiente desplegado (15 pts)

### Actividades realizadas

| Actividad | Puntos | Estado | Plataforma |
|-----------|--------|--------|------------|
| Publicar Backend | 5 | 🔄 | **Railway** (alternativa a Monster ASP.NET) |
| Publicar Frontend | 4 | 🔄 | **Netlify** (configurado: `netlify.toml`, build OK) |
| `VITE_API_URL` apuntando al API público | 2 | 🔄 | Variable en Netlify al desplegar |
| CORS Frontend ↔ Backend | 2 | ✅ | `AllowAnyOrigin` en `Startup.cs` |
| Flujo completo en URL pública | 2 | 🔄 | Pendiente confirmar tras deploy exitoso |

### Backend — Railway

- Rama: `Wuipy`  
- Root directory: `HackerRank1`  
- Build: **Dockerfile** (.NET 8 oficial)  
- Variable: `Supabase__ConnectionString`  
- Health check: `/api/frauds`  

### Frontend — Netlify

- Build: `npm run build`  
- Publish: `dist`  
- SPA redirect en `netlify.toml`  
- Variable: `VITE_API_URL=https://[tu-api].railway.app`  

### Evidencia sugerida

1. Panel Railway con deploy **Success**.  
2. Panel Netlify con sitio activo.  
3. URL pública: enviar reporte → ver en `/reportes`.  
4. Misma fila en Supabase.  

---

## Parte 6. Calidad del código, Git y entrega final (5 pts)

### Actividades realizadas

| Actividad | Puntos | Estado |
|-----------|--------|--------|
| Estructura clara y nombres coherentes | 2 | ✅ |
| Commits con mensajes descriptivos | 1 | ✅ |
| Enlaces y evidencia de funcionamiento | 2 | 🔄 Completar URLs y capturas en Word |

### Estructura Frontend (`src/`)

```
components/report/   → FraudReportForm, FraudReportsList
pages/               → ReportFraud, FraudReportsPage
lib/                 → fraudReportService.ts, config.ts
types/               → fraud.ts
```

### Estructura Backend (`HackerRank1/`)

```
Controllers/         → FraudsController.cs
Services/            → FraudService.cs
Data/                → LibraryContext.cs, DatabaseConnection.cs
DTO/                 → FraudForm.cs
Migrations/          → CreateFraudsTable
```

### Seguridad

- ✅ `.env` en `.gitignore` (Frontend)  
- ✅ ConnectionString fuera del código (user secrets / Railway)  
- ✅ `appsettings.example.json` con placeholders (sin credenciales reales)  

---

## Rúbrica resumen — autovaloración

| Criterio | Puntos máx. | Avance estimado |
|----------|-------------|-----------------|
| Preparación del proyecto | 10 | 8–10 |
| Backend API .NET | 30 | 30 |
| Base de datos | 15 | 15 |
| Frontend | 25 | 25 |
| Despliegue | 15 | 10–15 _(según deploy final)_ |
| Calidad y entrega | 5 | 3–5 |
| **Total** | **100** | **91–100** _(ajustar tras deploy)_ |

---

## Criterios mínimos de aceptación

| Criterio | Cumple |
|----------|--------|
| Formulario registra reportes sin datos quemados | ✅ |
| `/reportes` muestra datos del Backend | ✅ |
| Reportes persisten en PostgreSQL/Supabase | ✅ |
| Solución publicada con flujo completo | 🔄 Pendiente URLs finales |
| No expone credenciales en el repositorio | ✅ |

---

## Flujo completo (para defensa oral)

```
Usuario → /reportar-estafa (Frontend)
       → Validación de campos
       → POST /api/frauds (JSON camelCase)
       → FraudsController → FraudService
       → LibraryContext → Supabase (tabla Fraudes)
       → Respuesta 201 → mensaje de éxito

Usuario → /reportes (Frontend)
       → GET /api/frauds
       → Listado en tarjetas (impostor, contacto, comentarios, fecha)
```

---

## Registro de incidencias y soluciones (durante el desarrollo)

| Fecha | Problema | Solución |
|-------|----------|----------|
| Jun 2026 | Puerto 7098 en uso (Backend duplicado) | Detener procesos `HackerRank1` y ejecutar una sola instancia |
| Jun 2026 | `Host can't be null` en Railway | Configurar `Supabase__ConnectionString` |
| Jun 2026 | JwtBearer / Npgsql duplicado en build | Limpiar `csproj` y agregar paquete JwtBearer |
| Jun 2026 | NETSDK1045 / SDK incompatible en Nixpacks | Migrar deploy a **Dockerfile** con imagen oficial .NET 8 |
| Jun 2026 | CORS en local | Política `FrontendCors` con `AllowAnyOrigin` |

---

## Anexo — Comandos útiles

### Local

```powershell
# Backend
cd HackerRank1
dotnet run
# → http://localhost:5219/swagger

# Frontend
cd labcibe-home
npm run dev
# → http://localhost:5173/reportar-estafa
```

### Verificación API

```powershell
Invoke-RestMethod http://localhost:5219/api/frauds
```

---

## Espacio para evidencias (adjuntar al documento Word)

_Pegar capturas debajo de cada parte según indicaciones del examen:_

- **Parte 1:** Repos, ramas, ejecución local  
- **Parte 2:** Swagger POST/GET  
- **Parte 3:** Supabase tabla `Fraudes`  
- **Parte 4:** Formulario, éxito, `/reportes`  
- **Parte 5:** Railway + Netlify + flujo en URL pública  

---

_Bitácora generada con base en el documento «Examen_Programacion_Reporte_Fraudes_100pts_refinado» y el desarrollo realizado en el proyecto LabCIBE-UNA._
