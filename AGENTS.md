# 🤖 AGENTS.MD — Guía Operativa y Directrices para ROOM911

Bienvenido al repositorio **ROOM911**. Este documento define las reglas de desarrollo, arquitectura, contexto técnico, estándares de calidad y directrices operativas que **todos los agentes de IA y desarrolladores** deben seguir para garantizar consistencia, seguridad y eficiencia.

---

## 🏛️ 1. Contexto del Proyecto y Arquitectura

ROOM911 es un sistema integral de **Control de Acceso Físico, Gestión de Personal y Auditoría de Seguridad** para entornos industriales y farmacéuticos.

### 📦 Estructura del Monorepo

```
/
├── backend_911/
│   └── backend/                # API REST Spring Boot 3 (Java 17)
│       ├── src/main/java/com/room911/
│       │   ├── config/         # Configuración de Seguridad, CORS y Beans
│       │   ├── controller/     # Endpoints REST (/api/...)
│       │   ├── dto/            # Data Transfer Objects (Request / Response)
│       │   ├── entity/         # Entidades JPA / Hibernate
│       │   ├── exception/      # Manejador global de excepciones
│       │   ├── mapper/         # Mapeadores Entity <-> DTO
│       │   ├── repository/     # Interfaces Spring Data JPA
│       │   └── service/        # Interfaces y lógica de negocio (impl/)
│       └── src/main/resources/ # application.properties y configuraciones
│
├── room911-frontend/           # SPA React 18 + TypeScript + Vite + TailwindCSS
│   ├── src/
│   │   ├── components/         # Componentes UI (Shadcn/UI, comunes, modales)
│   │   ├── context/            # Contextos de React (Auth, Theme, etc.)
│   │   ├── pages/              # Vistas principales (Dashboard, Empleados, etc.)
│   │   ├── routes/             # Enrutador (React Router DOM)
│   │   ├── services/           # Clientes HTTP Axios y adaptadores de API
│   │   └── types/              # Interfaces y contratos TypeScript
│
├── README.md                   # Guía de inicio rápido y despliegue
├── TRAZABILIDAD.md             # Registro cronológico de cambios y trazabilidad
├── AGENTS.md                   # Este documento de directrices y gobernanza
└── .env.example                # Plantilla de variables de entorno globales
```

---

## 🛡️ 2. Reglas Fundamentales para Agentes

### 🚫 2.1 Cero Hardcoding
* **Nunca** hardcodear credenciales, contraseñas, secretos JWT, URLs de servicios o cadenas de conexión en el código fuente.
* Usar siempre variables de entorno con valores por defecto seguros para desarrollo local (`${ENV_VAR:default_value}`).
* Mantener siempre actualizados los archivos `.env.example`.

### 📦 2.2 Gestor de Paquetes: Exclusivamente `pnpm`
* **Obligatorio:** Utilizar **únicamente `pnpm`** (`pnpm install`, `pnpm dev`, `pnpm build`, `pnpm test`, etc.).
* **Estrictamente Prohibido:** Ejecutar `npm`, `yarn`, `npx` o generar archivos `package-lock.json` / `yarn.lock`.

### 🛠️ 2.3 Buenas Prácticas de Operación de Agentes y Uso de Tools
* **Prohibido `cat << EOF` o scripts de terminal para manipular archivos:** No utilizar comandos de terminal concatenados con heredocs (`cat << 'EOF'`) ni trucos de bash para crear o editar código.
* **Uso Apropiado de Herramientas Nativas:**
  - Para modificar código existente: usar herramientas dedicadas de edición diferencial (`replace_file_content`).
  - Para inspeccionar el código: usar `view_file`, `grep_search`, `find_by_name` y `list_dir`.
  - Para ejecutar comandos en terminal: usar `run_command` **únicamente** para tareas legítimas de compilación, ejecución de tests, arranque de servicios o comprobación de builds (`pnpm build`, `./mvnw compile`).

### 🔄 2.4 Integridad del Contrato API (Frontend <-> Backend)
* **Prohibido el "Mock Silencioso Desalineado":** Al implementar o modificar servicios en el frontend, nunca enmascarar errores de contrato con datos mockeados si estos no coinciden con los DTOs reales de Spring Boot.
* Todo DTO del backend debe tener su interfaz TypeScript equivalente y exacta en `room911-frontend/src/types/`.
* Comprobar siempre los nombres de campos (ej. `correo` vs `email`, `documento` vs `documentoIdentidad`, `accesoPermitido` vs `acceso`).

### 🔐 2.5 Seguridad y Criptografía
* **Contraseñas:** Siempre deben ser cifradas usando `BCryptPasswordEncoder` antes de guardarse en base de datos.
* **Autenticación:** Las sesiones administrativas deben validar credenciales contra base de datos y emitir tokens JWT válidos.
* **Control de Acceso:** Los endpoints críticos deben protegerse según el rol (`ADMIN`, `OPERADOR`, `AUDITOR`).
* **Manejo de Excepciones:** No retornar códigos HTTP 404 para errores 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden) o 500 (Internal Error).

---

## 🛠️ 3. Estándares de Código

### ☕ Backend (Java / Spring Boot)
1. **Inyección de Dependencias:** Usar inyección por constructor mediante `@RequiredArgsConstructor` de Lombok.
2. **Validación:** Validar los DTOs de entrada con `@Valid` y anotaciones `jakarta.validation` (`@NotBlank`, `@Email`, `@NotNull`).
3. **Capa de Negocio:** Toda la lógica de negocio debe residir en `service.impl.*ServiceImpl`, no en los controladores.
4. **Mapeo:** Usar mappers estáticos o MapStruct para desacoplar entidades JPA de los DTOs de respuesta.
5. **Transaccionalidad:** Anotar con `@Transactional` los métodos de servicio que realicen operaciones de escritura múltiples.
6. **Logging:** Usar `@Slf4j` de Lombok en lugar de `System.out.println`.

### ⚛️ Frontend (React / TypeScript)
1. **Tipado Estricto:** Evitar el uso de `any`. Definir interfaces claras en `types/`.
2. **Cliente HTTP:** Centralizar todas las peticiones a través de la instancia Axios en `services/api.ts` para que se apliquen los interceptores de token JWT.
3. **Estilos:** Utilizar Tailwind CSS siguiendo el sistema de diseño oscuro/industrial definido (paleta `slate`, `zinc`, `emerald`, `rose`, `amber`).
4. **Accesibilidad:** Mantener compatibilidad con lectores de pantalla, contrastes adecuados y soporte para atajos de teclado.
5. **Diseño Responsivo y Control de Desbordamiento:**
   - Toda vista debe adaptarse fluidamente a diferentes resoluciones (móvil, tablet, escritorio) mediante clases responsivas (`grid-cols-1 md:grid-cols-2 lg:grid-cols-...`).
   - Los contenedores de eventos en vivo, logs o historiales dinámicos deben contar con scroll interno acotado (`max-h-[...] overflow-y-auto`) para evitar provocar scroll-down descontrolado en la página completa.
   - Las listas e historiales deben mostrar siempre un estado vacío (*empty state*) elegante e informativo antes de registrar interacción.

---

## 🚀 4. Portabilidad y Ejecución

Cualquier agente que proponga cambios en infraestructura o dependencias debe asegurar que el proyecto se pueda levantar con:

```bash
# 1. Ejecución con Docker (Recomendado)
docker compose up -d --build

# 2. Ejecución local manual
# Backend:
cd backend_911/backend && ./mvnw spring-boot:run

# Frontend:
cd room911-frontend && pnpm install && pnpm dev
```

---

## 📋 5. Flujo de Trabajo para Tareas

Antes de marcar una tarea como completada, el agente debe:
1. ✅ Verificar que no se hayan roto los contratos entre el backend y frontend.
2. ✅ Confirmar que la compilación de Maven (`mvn compile`) y el build de TypeScript (`pnpm build`) pasen sin errores.
3. ✅ Asegurar que cualquier nueva variable de entorno esté documentada en `.env.example`.
4. ✅ No dejar código muerto ni imports innecesarios.

---

## 🗣️ 6. Protocolo Obligatorio de Comunicación con el Usuario

Al finalizar **cada intervención o respuesta**, el agente/LLM debe estructurar obligatoriamente el cierre con los siguientes tres bloques claros y concisos:

1. **📌 Qué se hizo:** Resumen ejecutivo de las acciones y archivos modificados.
2. **🤔 Qué necesito de ti:** Decisiones técnicas, confirmaciones o entradas requeridas del usuario. Si no se necesita nada, indicarlo explícitamente.
3. **⏩ Qué paso sigue:** La siguiente acción concreta, tarea o fase del plan de trabajo.
