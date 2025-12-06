# Sistema de Reserva de Citas Médicas

Sistema completo de gestión de citas médicas con API REST, frontend en React y pruebas E2E automatizadas.

## Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Ejecución](#ejecución)
- [Pruebas E2E](#pruebas-e2e)
- [Casos de Prueba](#casos-de-prueba)
- [CI/CD](#cicd)
- [Estructura del Proyecto](#estructura-del-proyecto)

---

## Características

### Backend (API REST)
- Registro de pacientes con validación de email y teléfono
- Gestión de doctores y especialidades
- Agendamiento de citas con validación de horarios
- Prevención de solapamiento de citas
- Cancelación de citas
- Consulta de horarios disponibles

### Frontend (React)
- Formulario de registro de pacientes
- Formulario de agendamiento de citas
- Visualización de horarios disponibles
- Lista de citas con opción de cancelar
- Validaciones en tiempo real
- Interfaz responsive

### Pruebas E2E (Playwright)
- 6 casos de prueba automatizados
- Validaciones de datos
- Flujos completos
- Manejo de errores

---

## Tecnologías

**Backend:**
- Node.js + Express
- PostgreSQL
- Validator.js

**Frontend:**
- React 18
- Axios
- CSS3

**Pruebas:**
- Playwright
- GitHub Actions

---

## Requisitos Previos

- Node.js 18 o superior
- PostgreSQL 15 o superior
- Git

---

## Instalación

### 1. Clonar el repositorio
```bash
git clone <tu-repo>
cd medical-appointment-system
```

### 2. Configurar PostgreSQL

Crear la base de datos:
```sql
CREATE DATABASE medical_appointments;
```

### 3. Instalar dependencias

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

**Pruebas E2E:**
```bash
cd e2e-tests
npm install
npx playwright install chromium
```

### 4. Configurar variables de entorno

**Backend** - Crear `backend/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=medical_appointments
DB_USER=postgres
DB_PASSWORD=postgres
```

**Frontend** - Crear `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Ejecución

### Backend
```bash
cd backend
npm start
```

El servidor estará disponible en `http://localhost:5000`

### Frontend
```bash
cd frontend
npm start
```

La aplicación estará disponible en `http://localhost:3000`

---

## Pruebas E2E

### Ejecutar todas las pruebas

**IMPORTANTE:** Antes de ejecutar las pruebas, asegúrese de que tanto el backend como el frontend estén corriendo en terminales separadas.
```bash
cd e2e-tests
npm test
```

### Ejecutar con interfaz visual
```bash
npm run test:headed
```

### Ver reporte
```bash
npm run test:report
```

---

## Casos de Prueba

### 1. Flujo exitoso de registro y citas
**Objetivo:** Verificar el flujo completo desde registro hasta visualización de citas  
**Técnica:** Flujo de usuario completo  
**Datos de Prueba:**
- Nombre: "Juan Pérez"
- Email: generado dinámicamente
- Teléfono: "3001234567"

**Resultado Esperado:** Usuario puede registrarse, ver formularios y navegar entre secciones

---

### 2. Validación de selección de doctor y fecha
**Objetivo:** Verificar que se pueden seleccionar doctores y fechas, y que se muestran horarios disponibles  
**Técnica:** Particiones de equivalencia  
**Datos de Prueba:**
- Doctor válido (ID: 1)
- Fecha futura (día siguiente)

**Resultado Esperado:** Se muestran horarios disponibles después de seleccionar doctor y fecha

---

### 3. Formulario de registro completo
**Objetivo:** Verificar que existen todos los campos requeridos en el formulario de registro  
**Técnica:** Verificación de elementos de interfaz  
**Resultado Esperado:** Todos los campos (nombre, email, teléfono) son visibles y accesibles

---

### 4. Validación de teléfono con valores límite
**Objetivo:** Validar que el sistema rechaza teléfonos con menos de 10 dígitos  
**Técnica:** Valores límite  
**Datos de Prueba:**
- Teléfono: "123" (3 dígitos - valor por debajo del límite)
- Límite esperado: 10 dígitos

**Resultado Esperado:** Muestra mensaje de error indicando que el teléfono debe tener 10 dígitos

**Análisis de Valores Límite:**
- Valor inválido: < 10 dígitos
- Valor límite inferior: 10 dígitos
- Valor válido: 10 dígitos

---

### 5. Validación de campos vacíos
**Objetivo:** Verificar validación de campos obligatorios  
**Técnica:** Particiones de equivalencia (clase de datos inválidos - campos vacíos)  
**Datos de Prueba:** Formulario sin llenar ningún campo  
**Resultado Esperado:** Se muestran 3 mensajes de error (uno por cada campo requerido: nombre, email, teléfono)

**Particiones de Equivalencia:**
- Partición 1: Todos los campos vacíos (inválido)
- Partición 2: Todos los campos llenos con datos válidos (válido)
- Partición 3: Algunos campos vacíos (inválido)

---

### 6. Email con formato válido
**Objetivo:** Verificar que emails con formato válido permiten el envío del formulario  
**Técnica:** Particiones de equivalencia (clase de datos válidos)  
**Datos de Prueba:**
- Email válido: "valido@example.com"
- Nombre: "Usuario Válido"
- Teléfono válido: "3001234567"

**Resultado Esperado:** Botón de envío habilitado y formulario aceptado

**Particiones de Equivalencia para Email:**
- Partición válida: formato correcto (usuario@dominio.com)
- Partición inválida: sin @ (usuario.dominio.com)
- Partición inválida: sin dominio (usuario@)
- Partición inválida: formato incorrecto (usuario@dominio)

---

## Justificación de Técnicas de Prueba

### Valores Límite
Se aplicó en la validación de teléfono porque el sistema tiene un requisito específico de exactamente 10 dígitos. Esta técnica es ideal para detectar errores en los límites de entrada.

### Particiones de Equivalencia
Se aplicó en:
- Validación de campos vacíos: dividiendo entradas en clases de "todos vacíos", "algunos vacíos" y "todos llenos"
- Validación de email: dividiendo en "formato válido" e "formato inválido"
- Selección de doctor y fecha: dividiendo en "datos completos" y "datos incompletos"

Esta técnica permite reducir el número de casos de prueba mientras se mantiene una cobertura efectiva.

### Datos Válidos e Inválidos
Se probaron ambos tipos de datos en todos los formularios para asegurar que:
- El sistema acepta correctamente datos válidos
- El sistema rechaza y muestra errores apropiados para datos inválidos

---

## CI/CD

El proyecto incluye un workflow de GitHub Actions que:

1. Levanta un contenedor PostgreSQL
2. Instala dependencias del backend, frontend y pruebas
3. Inicia el servidor backend
4. Inicia la aplicación frontend
5. Ejecuta las pruebas E2E con Playwright
6. Imprime "OK" en la consola si todas las pruebas pasan exitosamente
7. Sube reportes y screenshots en caso de fallo

**Ubicación:** `.github/workflows/e2e-tests.yml`

Para ejecutarlo, haz push a las ramas `main` o `master`:
```bash
git add .
git commit -m "Add E2E tests"
git push origin main
```

---

## Estructura del Proyecto
```
medical-appointment-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── patientController.js
│   │   │   ├── doctorController.js
│   │   │   └── appointmentController.js
│   │   ├── models/
│   │   │   ├── Patient.js
│   │   │   ├── Doctor.js
│   │   │   └── Appointment.js
│   │   ├── routes/
│   │   │   ├── patientRoutes.js
│   │   │   ├── doctorRoutes.js
│   │   │   └── appointmentRoutes.js
│   │   └── app.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PatientForm.js
│   │   │   ├── AppointmentForm.js
│   │   │   └── AppointmentsList.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── App.css
│   │   └── App.js
│   ├── package.json
│   └── .env
├── e2e-tests/
│   ├── tests/
│   │   ├── complete-flow.spec.js
│   │   └── validations.spec.js
│   ├── playwright.config.js
│   └── package.json
├── .github/
│   └── workflows/
│       └── e2e-tests.yml
└── README.md
```

---

## Endpoints de la API

### Pacientes
- `POST /api/patients` - Registrar nuevo paciente
- `GET /api/patients` - Obtener todos los pacientes
- `GET /api/patients/:id` - Obtener paciente por ID
- `GET /api/patients/by-email?email=xxx` - Obtener paciente por email
- `DELETE /api/patients/:id` - Eliminar paciente

### Doctores
- `GET /api/doctors` - Obtener todos los doctores
- `GET /api/doctors/:id` - Obtener doctor por ID

### Citas
- `POST /api/appointments` - Crear nueva cita
- `GET /api/appointments` - Obtener todas las citas
- `GET /api/appointments/:id` - Obtener cita por ID
- `GET /api/appointments/patient/:patientId` - Obtener citas de un paciente
- `GET /api/appointments/available-slots?doctorId=X&date=YYYY-MM-DD` - Obtener horarios disponibles
- `PUT /api/appointments/:id/cancel` - Cancelar cita
