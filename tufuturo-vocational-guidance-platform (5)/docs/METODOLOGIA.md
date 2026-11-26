# Metodología del test vocacional

Implementación: `src/lib/scoring.ts` · preguntas: `src/data/quiz.ts` · perfiles de carrera: `src/data/careers-*.ts` · pruebas: `tests/platform.test.ts`.

## Dimensiones
- **Intereses (10)**: ciencias, tecnología, salud, arte, negocios, educación, sociedad, naturaleza, construcción, comunicación.
- **Materias y habilidades (11)**: matemáticas, física, química, biología, historia, literatura, idiomas, programación, dibujo, comunicación, resolución de problemas.
- **Preferencias de trabajo (12)**: personas, tecnología, investigar, crear, organizar, resolver problemas, aire libre, laboratorio, hospital, oficina, enseñar, emprender.

## Cálculo
1. Cada opción elegida suma puntos (`effects`) a dimensiones; «preferiría evitar» resta.
2. Normalización por familia: `u_d = puntos_d / máx(puntos positivos de la familia)`, acotado a [-1, 1].
3. Cada carrera define `c_d ∈ {1,2,3}` (`profile`, p. ej. `sa3 bio3 per3`). Por familia: `S_g = Σ c_d·u_d / Σ c_d` (en el denominador se omiten las dimensiones con `c_d = 1` sobre las que el estudiante no dio señal, para no penalizar perfiles de carrera más amplios).
4. `Afinidad = Σ W_g·S_g / Σ W_g`, con W: intereses 0.45, preferencias de trabajo 0.30, habilidades 0.25. Bono de +0.06 si el área fue marcada por el estudiante (pregunta «áreas»). Resultado acotado a [0, 1] → porcentaje.
5. Selección: orden por afinidad (desempate por slug), máximo 4 carreras por área en el top 8; 3 «descubrimientos» de áreas no presentes en el top.
6. Explicación: se listan las dimensiones con `u_d ≥ 0.5` y mayor peso; los retos incluyen las actividades que el estudiante quiso evitar (`u_d ≤ -0.5`, `c_d ≥ 2`) y el reto propio de la carrera.

## Interpretación
El porcentaje es **coincidencia con las respuestas**, no probabilidad de éxito. Determinista y sin IA externa. Las respuestas no se almacenan en el servidor.

## Limitaciones
Los perfiles de carrera son juicios editoriales de TuFuturo y deben revisarse con orientadores vocacionales. Se recomienda calibrar pesos con datos reales de uso.
