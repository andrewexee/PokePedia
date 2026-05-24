import jsPDF from 'jspdf'

// Convierte una URL de imagen a base64 via canvas
async function imageUrlToBase64(url) {
  try {
    const res    = await fetch(url)
    const blob   = await res.blob()
    return await new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

// Tipo más frecuente entre los favoritos
function tipoMasFrecuente(pokemons) {
  const conteo = {}
  pokemons.forEach(p => p.types.forEach(t => { conteo[t] = (conteo[t] || 0) + 1 }))
  if (Object.keys(conteo).length === 0) return '—'
  const top = Object.entries(conteo).sort((a, b) => b[1] - a[1])[0][0]
  const TIPOS_ES = {
    fire:'Fuego', water:'Agua', grass:'Planta', electric:'Eléctrico',
    ice:'Hielo', fighting:'Lucha', poison:'Veneno', ground:'Tierra',
    flying:'Volador', psychic:'Psíquico', bug:'Bicho', rock:'Roca',
    ghost:'Fantasma', dragon:'Dragón', dark:'Siniestro', steel:'Acero',
    fairy:'Hada', normal:'Normal',
  }
  return TIPOS_ES[top] || top
}

// Porcentaje de la Pokédex completada como favoritos
function porcentajePokedex(total) {
  return ((total / 1025) * 100).toFixed(1)
}

// Colores RGB por tipo
const TIPO_COLOR = {
  fire:[255,100,0], water:[59,130,246], grass:[34,197,94],
  electric:[234,179,8], ice:[34,211,238], fighting:[185,28,28],
  poison:[168,85,247], ground:[202,138,4], flying:[99,102,241],
  psychic:[236,72,153], bug:[132,204,22], rock:[120,53,15],
  ghost:[67,56,202], dragon:[79,70,229], dark:[55,65,81],
  steel:[156,163,175], fairy:[249,168,212], normal:[156,163,175],
}

const TIPO_ES = {
  fire:'FUEGO', water:'AGUA', grass:'PLANTA', electric:'ELÉCTRICO',
  ice:'HIELO', fighting:'LUCHA', poison:'VENENO', ground:'TIERRA',
  flying:'VOLADOR', psychic:'PSÍQUICO', bug:'BICHO', rock:'ROCA',
  ghost:'FANTASMA', dragon:'DRAGÓN', dark:'SINIESTRO', steel:'ACERO',
  fairy:'HADA', normal:'NORMAL',
}

export async function generarInforme(usuario, favoritosList) {
  const doc  = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const W    = 210
  const rojo = [220, 38, 38]
  const gris = [243, 244, 246]
  const oscuro = [31, 41, 55]

  // ── CABECERA ──────────────────────────────────────────────────
  doc.setFillColor(...rojo)
  doc.rect(0, 0, W, 42, 'F')

  // Círculo decorativo fondo
  doc.setFillColor(255, 255, 255, 0.05)
  doc.setDrawColor(255, 255, 255)
  doc.setLineWidth(0.3)
  doc.circle(175, 8, 28, 'S')
  doc.circle(175, 8, 20, 'S')

  // Título PokePedia
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.text('PokePedia', 14, 20)

  // Subtítulo
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text('Informe de Pokémon Favoritos', 14, 30)

  // Fecha
  const fecha = new Date().toLocaleDateString('es-ES', {
    day: '2-digit', month: 'long', year: 'numeric'
  })
  doc.setFontSize(9)
  doc.text(`Generado el ${fecha}`, 14, 38)

  // ── TARJETA USUARIO ───────────────────────────────────────────
  let y = 52

  doc.setFillColor(...gris)
  doc.roundedRect(14, y, W - 28, 32, 3, 3, 'F')

  doc.setTextColor(...oscuro)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('ENTRENADOR', 22, y + 9)

  doc.setFontSize(14)
  doc.text(usuario.nombre || 'Usuario', 22, y + 18)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 116, 139)
  doc.text(usuario.email || '', 22, y + 25)

  // Badge rol
  const rol = usuario.rol || 'USER'
  doc.setFillColor(...rojo)
  doc.roundedRect(W - 42, y + 8, 22, 8, 2, 2, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  doc.text(rol, W - 39, y + 13.5)

  // ── CAMPOS CALCULADOS ─────────────────────────────────────────
  y += 42

  doc.setTextColor(...oscuro)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('ESTADÍSTICAS', 14, y)

  y += 5

  const totalFavs   = favoritosList.length
  const tipoTop     = tipoMasFrecuente(favoritosList)
  const pct         = porcentajePokedex(totalFavs)
  const stats = [
    { label: 'Total favoritos',          valor: String(totalFavs),   color: rojo },
    { label: 'Tipo más frecuente',        valor: tipoTop,             color: [79, 70, 229] },
    { label: '% Pokédex completada',      valor: `${pct}%`,           color: [16, 185, 129] },
  ]

  const cardW = (W - 28 - 8) / 3
  stats.forEach((s, i) => {
    const x = 14 + i * (cardW + 4)
    doc.setFillColor(...gris)
    doc.roundedRect(x, y, cardW, 22, 3, 3, 'F')

    // Barra de color superior
    doc.setFillColor(...s.color)
    doc.roundedRect(x, y, cardW, 3, 1, 1, 'F')

    doc.setTextColor(...s.color)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(s.valor, x + cardW / 2, y + 14, { align: 'center' })

    doc.setTextColor(100, 116, 139)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.text(s.label, x + cardW / 2, y + 20, { align: 'center' })
  })

  // ── POKÉMON DESTACADOS ────────────────────────────────────────
  y += 32

  doc.setTextColor(...oscuro)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('POKÉMON DESTACADOS', 14, y)

  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 116, 139)
  doc.text('Selección aleatoria de tus favoritos', 14, y + 6)

  y += 12

  // Seleccionar 5 pokémon aleatorios
  const shuffled = [...favoritosList].sort(() => Math.random() - 0.5)
  const muestra  = shuffled.slice(0, Math.min(5, shuffled.length))

  const pW = (W - 28 - 16) / 5  // ancho de cada card pokémon

  for (let i = 0; i < muestra.length; i++) {
    const p  = muestra[i]
    const px = 14 + i * (pW + 4)

    // Card fondo
    doc.setFillColor(...gris)
    doc.roundedRect(px, y, pW, 52, 3, 3, 'F')

    // Sprite
    const base64 = await imageUrlToBase64(p.sprite)
    if (base64) {
      const imgSize = pW - 6
      doc.addImage(base64, 'PNG', px + 3, y + 3, imgSize, imgSize)
    }

    // Número pokédex
    doc.setTextColor(148, 163, 184)
    doc.setFontSize(6)
    doc.setFont('helvetica', 'normal')
    const num = `Nº${String(p.id).padStart(4, '0')}`
    doc.text(num, px + pW / 2, y + pW - 1, { align: 'center' })

    // Nombre
    doc.setTextColor(...oscuro)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    const nombre = p.name.charAt(0).toUpperCase() + p.name.slice(1)
    doc.text(nombre, px + pW / 2, y + pW + 4, { align: 'center' })

    // Tipos
    p.types.forEach((tipo, ti) => {
      const color  = TIPO_COLOR[tipo] || [156, 163, 175]
      const etiq   = TIPO_ES[tipo]    || tipo.toUpperCase()
      const badgeW = pW - 4
      const by     = y + pW + 7 + ti * 6
      doc.setFillColor(...color)
      doc.roundedRect(px + 2, by, badgeW, 5, 1, 1, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(5.5)
      doc.setFont('helvetica', 'bold')
      doc.text(etiq, px + pW / 2, by + 3.5, { align: 'center' })
    })
  }

  // ── FOOTER ────────────────────────────────────────────────────
  y = 285
  doc.setFillColor(...rojo)
  doc.rect(0, y, W, 12, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('PokePedia v1.4 — github.com/andrewexee', W / 2, y + 7.5, { align: 'center' })

  // ── GUARDAR ───────────────────────────────────────────────────
  const nombreArchivo = `pokepedia-informe-${usuario.nombre?.replace(/\s+/g, '-').toLowerCase() || 'usuario'}.pdf`
  doc.save(nombreArchivo)
}
