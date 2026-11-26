import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacidad y ubicación", description: "Cómo protege TuFuturo tus datos: sin cuentas, respuestas en tu navegador y ubicación solo con tu consentimiento." };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-14 leading-relaxed text-ink/80 sm:px-6">
      <h1 className="text-4xl font-extrabold tracking-tight text-ink">Privacidad y ubicación</h1>
      <p>TuFuturo está diseñada para funcionar sin recopilar datos personales.</p>
      <h2 className="text-2xl font-extrabold text-ink">Qué guardamos</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li><strong>Respuestas del test:</strong> se guardan únicamente en el almacenamiento local de tu navegador para que no pierdas tu avance. Para calcular resultados se envían a nuestro servidor, que las procesa y responde sin almacenarlas ni registrarlas.</li>
        <li><strong>Cuentas:</strong> no existen. No pedimos nombre, correo ni teléfono.</li>
        <li><strong>Publicidad y rastreo:</strong> no usamos cookies publicitarias ni herramientas de seguimiento de terceros.</li>
      </ul>
      <h2 className="text-2xl font-extrabold text-ink">Ubicación</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>Solo se solicita si pulsas «Usar mi ubicación actual» y aceptas el aviso de consentimiento; además, tu navegador pedirá su propia confirmación.</li>
        <li>Las coordenadas se usan en tu dispositivo para calcular distancias y <strong>no se envían ni se guardan</strong> en nuestros servidores.</li>
        <li>Siempre puedes buscar por municipio o código postal, o usar el punto de partida por defecto (centro de Puebla).</li>
      </ul>
      <h2 className="text-2xl font-extrabold text-ink">Servicios externos</h2>
      <p>El mapa carga teselas de OpenStreetMap cuando abres la vista de mapa; esa conexión ocurre entre tu navegador y OpenStreetMap. Los enlaces a sitios universitarios se abren en pestañas nuevas y se rigen por las políticas de cada institución.</p>
      <h2 className="text-2xl font-extrabold text-ink">Borrar tus datos</h2>
      <p>Puedes eliminar tu avance en cualquier momento pulsando «Reiniciar» en el test o limpiando los datos del sitio en tu navegador.</p>
    </div>
  );
}
