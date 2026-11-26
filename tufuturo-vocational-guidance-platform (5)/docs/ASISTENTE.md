# Asistente TuFuturo — plan de integración (versión posterior)

**Estado**: arquitectura lista, sin proveedor de IA conectado. Ruta reservada: `POST /api/assistant` (responde 501). Código base: `src/lib/assistant/index.ts`.

## Diseño
1. **Recuperación determinista** (`retrieveContext`): detecta carreras/denominaciones mencionadas y arma hechos citables del catálogo (descripción, qué se estudia, programas **verificados** con fuente y fecha). Ampliable con búsqueda de texto de PostgreSQL (`tsvector`) o `pgvector`.
2. **Proveedor intercambiable** (`AssistantProvider`): puede ser un modelo local/gratuito (p. ej. Ollama en un servidor propio), una API con capa gratuita o uno de pago *solo con autorización*. La plataforma no depende de él.
3. **Reglas anti-invención**: el prompt de sistema obliga a responder solo con el contexto; si `facts` está vacío, responde «no tengo información verificada» y sugiere consultar la fuente oficial. Cada respuesta incluye `sources` y se marca `grounded`.
4. **Seguridad y privacidad**: límite de tasa por IP, validación de longitud, sin guardar conversaciones por defecto, sin datos personales.
5. **Casos de uso**: explicar resultados del test (se envía el resumen de resultados, no las respuestas), comparar carreras, consultar universidades/modalidades.

## Pasos para activarlo
1. Implementar `AssistantProvider` y el cuerpo de `src/app/api/assistant/route.ts` (validar `AssistantRequest`, llamar `retrieveContext`, aplicar límites).
2. Añadir un componente de chat (botón flotante) que consuma la ruta con streaming.
3. Pruebas: respuestas sin contexto deben rechazar; respuestas con contexto deben citar fuentes.
