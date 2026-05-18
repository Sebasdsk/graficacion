// Convierte JSON de ReactFlow a texto legible para el agente
interface Nodo {
  id: string;
  type: string;
  data: any;
  groupId?: string;
  points?: { x: number; y: number }[];
}

interface Arista {
  source: string;
  target: string;
  data?: { label?: string };
  points?: { x: number; y: number }[];
}

interface Diagrama {
  nodes: Nodo[];
  edges: Arista[];
}

function procesarDiagramaClase(diagrama: Diagrama): string {
  const { nodes: nodos, edges: aristas } = diagrama;
  let contenido = '';
  const mapaNodos = new Map<string, Nodo>();

  for (const nodo of nodos) mapaNodos.set(nodo.id, nodo);

  for (const nodo of nodos) {
    const { type, data } = nodo;
    if (!['diagramaClase', 'diagramaInterfaz', 'diagramaEnum'].includes(type)) continue;

    switch (type) {
      case 'diagramaClase':   contenido += `Clase: ${data.nombre}`; break;
      case 'diagramaInterfaz': contenido += `Interfaz ${data.nombre}`; break;
      case 'diagramaEnum':    contenido += `Enum ${data.nombre}`; break;
    }

    if (data.atributos?.length > 0) {
      contenido += `\nAtributos\n`;
      for (const atributo of data.atributos) contenido += `${atributo}\n`;
    }

    if (data.metodos?.length > 0) {
      contenido += `\nMétodos\n`;
      for (const metodo of data.metodos) contenido += `${metodo}\n`;
    }

    const relaciones = aristas.filter(a => a.source === nodo.id || a.target === nodo.id);
    if (relaciones.length > 0) {
      contenido += `\nRelaciones:\n`;
      for (const rel of relaciones) {
        const origen = mapaNodos.get(rel.source);
        const destino = mapaNodos.get(rel.target);
        if (!origen || !destino) continue;
        const esOrigen = rel.source === nodo.id;
        if (esOrigen) {
          contenido += `- ${origen.data.nombre} -> ${destino.data.nombre}\n`;
        } else {
          contenido += `- ${destino.data.nombre} -> ${origen.data.nombre}\n`;
        }
      }
    }
    contenido += '\n';
  }
  return contenido;
}

function procesarDiagramaCasosUso(diagrama: Diagrama): string {
  const { nodes: nodos, edges: aristas } = diagrama;
  let contenido = 'Diagrama de casos de uso\n\n';
  const mapaNodos = new Map<string, Nodo>();

  for (const nodo of nodos) mapaNodos.set(nodo.id, nodo);

  const boundary = nodos.find(n => n.type === 'boundary');
  if (boundary) contenido += `Sistema: ${boundary.data.nombreBoundary}\n\n`;

  const actores = nodos.filter(n => n.type === 'actor');
  if (actores.length > 0) {
    contenido += `Actores:\n`;
    for (const actor of actores) contenido += `- ${actor.data.textoActor}\n`;
    contenido += '\n';
  }

  const casosUso = nodos.filter(n => n.type === 'casoUso');
  if (casosUso.length > 0) {
    contenido += `Casos de uso:\n`;
    for (const caso of casosUso) contenido += `- ${caso.data.textoCasoUso}\n`;
    contenido += '\n';
  }

  if (aristas.length > 0) {
    contenido += `Relaciones:\n`;
    for (const arista of aristas) {
      const origen = mapaNodos.get(arista.source);
      const destino = mapaNodos.get(arista.target);
      if (!origen || !destino) continue;
      const nombreOrigen = origen.type === 'actor' ? origen.data.textoActor : origen.data.textoCasoUso;
      const nombreDestino = destino.type === 'actor' ? destino.data.textoActor : destino.data.textoCasoUso;
      contenido += `- ${nombreOrigen} interactúa con ${nombreDestino}\n`;
    }
  }
  return contenido + '\n';
}

function procesarDiagramaPaquetes(diagrama: Diagrama): string {
  const { nodes: nodos, edges: aristas } = diagrama;
  let contenido = 'Diagrama de paquetes\n\n';
  const mapaNodos = new Map<string, Nodo>();

  for (const nodo of nodos) mapaNodos.set(nodo.id, nodo);

  const paquetes = nodos.filter(n => n.type === 'paquete' || n.type === 'paquete_v2');

  if (paquetes.length > 0) {
    contenido += `Paquetes:\n`;
    for (const p of paquetes) contenido += `- ${p.data.nombrePaquete}\n`;
    contenido += '\n';
  }

  if (aristas.length > 0) {
    contenido += `Dependencias:\n`;
    for (const arista of aristas) {
      const origen = mapaNodos.get(arista.source);
      const destino = mapaNodos.get(arista.target);
      if (!origen || !destino) continue;
      contenido += `- ${origen.data.nombrePaquete} depende de ${destino.data.nombrePaquete}\n`;
    }
    contenido += '\n';
  }

  const paquetesPadre = paquetes.filter(p => !p.groupId);
  if (paquetesPadre.length > 0) {
    contenido += `Jerarquía de paquetes:\n`;
    for (const padre of paquetesPadre) {
      const hijos = paquetes.filter(p => p.groupId === padre.id);
      if (hijos.length === 0) continue;
      contenido += `\n${padre.data.nombrePaquete}\n`;
      for (const hijo of hijos) contenido += `- ${hijo.data.nombrePaquete}\n`;
    }
  }
  return contenido + '\n';
}

function procesarDiagramaSecuencia(diagrama: Diagrama): string {
  const { nodes: nodos, edges: aristas } = diagrama;
  const lifelines = new Map<string, string>();

  for (const nodo of nodos) {
    if (nodo.type === 'lineaVida' || nodo.type === 'actorSecuencia') {
      lifelines.set(nodo.id, nodo.data.nombreParticipante);
    }
  }

  const activacionAParticipante = new Map<string, string>();
  for (const nodo of nodos) {
    if (nodo.type === 'activacion') {
      const participante = lifelines.get(nodo.groupId ?? '');
      if (participante) activacionAParticipante.set(nodo.id, participante);
    }
  }

  const aristasOrdenadas = [...aristas].sort(
    (a, b) => (a.points?.[0]?.y ?? 0) - (b.points?.[0]?.y ?? 0)
  );

  const lineas = aristasOrdenadas.map(arista => {
    const origen = activacionAParticipante.get(arista.source) ?? arista.source;
    const destino = activacionAParticipante.get(arista.target) ?? arista.target;
    return `${origen} -> ${destino}: ${arista.data?.label ?? ''}`;
  });

  return lineas.join('\n') + '\n';
}

const procesadores: Record<string, (d: Diagrama) => string> = {
  clase: procesarDiagramaClase,
  casos_uso: procesarDiagramaCasosUso,
  paquetes: procesarDiagramaPaquetes,
  secuencia: procesarDiagramaSecuencia,
};

export function procesarDiagrama(tipo: string, jsonDiagrama: string): string {
  try {
    const diagrama = JSON.parse(jsonDiagrama) as Diagrama;
    const procesador = procesadores[tipo];
    if (!procesador) return `(Tipo de diagrama "${tipo}" no soportado)\n`;
    return procesador(diagrama);
  } catch {
    return `(Error al procesar diagrama de tipo "${tipo}")\n`;
  }
}