import { useState, useEffect, useRef } from 'react'
import {
  MapPin, Users, Home, Star, Phone, Mail, Car, Waves, TreePine,
  Camera, MessageCircle, Briefcase, Utensils, Wifi, Wind,
  Tv, Shield, ChefHat, Music, Calendar, Clock, PartyPopper,
  Footprints, Sparkles, Menu, X, Award, Bike, Microscope, Leaf,
  BedDouble, Flame, Bath, Activity, Gamepad2, Thermometer,
  ChevronLeft, ChevronRight, ZoomIn,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { AvailabilityCalendar } from '@/components/AvailabilityCalendar'

// ── WhatsApp helpers ──────────────────────────────────────────────────────────

const WA_BASE = 'https://wa.me/5511990222000?text='

function waLink(msg: string) {
  return WA_BASE + encodeURIComponent(msg)
}

function waExperiencia(nome: string) {
  return waLink(`Olá! Tenho interesse na experiência "${nome}" da Villa Entre Verdes. Pode me enviar mais informações e disponibilidade?`)
}

const WA_SUGESTAO = waLink('Olá! Gostaria de sugerir/indicar uma experiência para a Villa Entre Verdes.')

function waEvento(tipo: string) {
  return waLink(`Olá! Gostaria de saber mais sobre o "${tipo}" da Villa Entre Verdes. Pode me enviar valores e disponibilidade?`)
}

const WA_ORCAMENTO = waLink('Olá! Gostaria de solicitar um orçamento para a Villa Entre Verdes.')

// ── Data ──────────────────────────────────────────────────────────────────────

const features = [
  { icon: Users,    title: 'Até 50 convidados',        description: 'Para eventos de 1 dia' },
  { icon: Home,     title: '22 pessoas com pernoite',   description: 'Suítes e acomodações de luxo' },
  { icon: Waves,    title: 'Riviera de São Lourenço',   description: 'Localização privilegiada' },
  { icon: TreePine, title: 'Estrutura completa',        description: 'Piscina, quadra, área gourmet e salões' },
]

// ── [V3] Experiências exclusivas — atividades para cuidar do corpo e da mente ─
const experiences = [
  {
    icon: Activity,
    title: 'Aula de Beach Tênis',
    duracao: '2 horas',
    participantes: '10 pessoas',
    detalhe: 'Com professor de referência',
    valor: 'R$ 900,00',
    gradient: 'from-amber-50 to-orange-50',
  },
  {
    icon: Footprints,
    title: 'Grupo de Corrida',
    duracao: '1 hora e 30 minutos',
    participantes: '10 pessoas',
    detalhe: 'Treino orientado para grupos',
    valor: 'R$ 900,00',
    gradient: 'from-sky-50 to-cyan-50',
  },
  {
    icon: Leaf,
    title: 'Aula de Yoga',
    duracao: '1 hora e 30 minutos',
    participantes: '10 pessoas',
    detalhe: 'Aula conduzida por instrutor especializado',
    valor: 'R$ 1.200,00',
    gradient: 'from-green-50 to-emerald-50',
    featured: true,
  },
]

const eventPackages = [
  {
    title: 'Evento de 1 dia',
    subtitle: 'Sem pernoite',
    capacity: 'Até 50 convidados',
    features: [
      'Uso exclusivo da Villa',
      'Piscina aquecida',
      'Quadra de areia',
      'Área gourmet',
      'Dois salões integrados à natureza',
    ],
    icon: Calendar,
  },
  {
    title: 'Final de Semana Completo',
    subtitle: 'Com pernoite',
    capacity: 'Até 22 pessoas',
    features: [
      '2 noites de hospedagem',
      'Uso completo da estrutura',
      'Perfeito para celebrações especiais',
      'Acesso a todas as comodidades',
    ],
    icon: Home,
    featured: true,
  },
  {
    title: 'Evento Corporativo Premium',
    subtitle: 'Para empresas',
    capacity: 'Até 22 pessoas',
    features: [
      '2 noites de hospedagem',
      'Café da manhã incluído',
      'Espaços para palestras e dinâmicas',
      'Staff de apoio',
      'Ambiente inspirador para team building',
    ],
    icon: Briefcase,
  },
]

const extraServices = [
  { name: 'Café da Manhã Completo',              price: 'Por pessoa/dia' },
  { name: 'Chef exclusivo para almoço/jantar',   price: 'Sob consulta' },
  { name: 'BarMan & Coquetelaria',               price: 'Por hora' },
  { name: 'Massagem e Spa Relax',                price: 'Sob consulta' },
  { name: 'Decoração temática',                  price: 'Sob consulta' },
  { name: 'Equipe de fotografia e vídeo',        price: 'Sob consulta' },
  { name: 'Serviço de limpeza durante o evento', price: 'Por hora' },
]

// ── [V2] FAQ com respostas mais úteis ────────────────────────────────────────
const faqItems = [
  {
    question: 'Qual a diferença entre evento de 1 dia e com pernoite?',
    answer: 'Eventos de 1 dia comportam até 50 pessoas e incluem uso das áreas comuns sem dormida. Com pernoite, acomodamos até 22 pessoas em 8 suítes de luxo por 1 ou mais noites: você tem a casa inteira para o grupo, do jantar ao café da manhã.',
  },
  {
    question: 'Qual é o valor da diária? Como funciona o preço?',
    answer: 'O valor varia conforme a temporada, número de noites e data. Nosso modelo é simples: você aluga a villa inteira, não paga por quarto. Dividido entre um grupo de 16 a 22 pessoas, o custo por pessoa fica muito abaixo de um hotel de mesmo padrão. Entre em contato com suas datas e te enviamos o valor exato em minutos.',
  },
  {
    question: 'Qual é a política de cancelamento?',
    answer: 'Trabalhamos com política de cancelamento flexível: reembolso integral até 7 dias antes do check-in, e parcial até 48h antes. Todas as condições ficam registradas na proposta que enviamos antes da confirmação. Sem surpresas.',
  },
  {
    question: 'É possível personalizar os pacotes?',
    answer: 'Sim. Além dos pacotes prontos, criamos propostas sob medida. Quer chef exclusivo? Decoração temática? Instrutor de beach tennis? Só avisar, temos parceiros para tudo.',
  },
  {
    question: 'Como fazer a reserva?',
    answer: 'Fale com a gente via WhatsApp com suas datas e número de pessoas. Checamos disponibilidade em tempo real e enviamos uma proposta personalizada com valores, o que está incluso e condições de pagamento. Em geral respondemos em menos de 1 hora.',
  },
  {
    question: 'Qual a antecedência mínima para reservas?',
    answer: 'Aceitamos reservas com qualquer antecedência, mas finais de semana de alta temporada e feriados costumam ser reservados com 60 a 90 dias de antecedência. Se sua data é próxima, vale perguntar, às vezes temos disponibilidade de última hora.',
  },
]

// ── Hero images ───────────────────────────────────────────────────────────────

const heroImages = [
  { src: '/Foto Capa 3.jpeg',         alt: 'Vista aérea da piscina orgânica da Villa Entre Verdes rodeada pelo jardim tropical em Riviera de São Lourenço' },
  { src: '/11052026-DSCF0009-2.jpeg', alt: 'Espreguiçadeiras e fogueira acesa à beira da piscina ao entardecer – Villa Entre Verdes, Riviera de São Lourenço' },
  { src: '/12052026-DSCF0601.jpeg',   alt: 'Jardim com chuveiro externo de madeira, espreguiçadeiras e fachada da Villa Entre Verdes' },
  { src: '/12052026-DSCF0806.jpeg',   alt: 'Villa Entre Verdes iluminada ao entardecer com reflexo na piscina – Riviera de São Lourenço' },
  { src: '/Foto Capa1.jpeg',          alt: 'Villa Entre Verdes – fachada completa com piscina privativa, espreguiçadeiras e jardim em Riviera de São Lourenço' },
]

// ── [V2] Galeria como array para lightbox ────────────────────────────────────

const galleryImages = [
  { src: '/Piscina+jardim.jpeg',                          alt: 'Piscina aquecida e área gourmet da Villa Entre Verdes em Riviera de São Lourenço' },
  { src: '/JARDIM.jpeg',                                  alt: 'Jardim tropical preservado da Villa Entre Verdes em Bertioga SP' },
  { src: '/Quadrabeach.jpeg',                             alt: 'Quadra de beach tennis iluminada para grupos na Riviera de São Lourenço' },
  { src: '/SalaTV1.jpeg',                                 alt: 'Sala de estar de alto padrão da Villa Entre Verdes em Bertioga', style: { objectPosition: 'center 60%' } },
  { src: '/salaodejogos.jpg',                             alt: 'Salão de jogos com sinuca – Villa Entre Verdes, Riviera de São Lourenço' },
  { src: '/Sauna+Jacuzzi.jpeg',                           alt: 'Sauna e jacuzzi privativa da Villa Entre Verdes em Riviera de São Lourenço', style: { objectPosition: 'center 60%' } },
  { src: '/sala tv.jpeg',                                 alt: 'Sala de TV da Villa Entre Verdes – ambiente de cinema para grupos em Bertioga' },
  { src: '/piscina noite.jpeg',                           alt: 'Piscina da Villa Entre Verdes iluminada à noite em Riviera de São Lourenço', style: { objectPosition: 'center 80%' } },
  { src: '/Piscinasauna noite.jpeg',                      alt: 'Área da piscina e sauna iluminadas à noite – Villa Entre Verdes, Bertioga SP', style: { objectPosition: 'center 80%' } },
  { src: '/12052026-DSCF0534.jpeg',                       alt: 'Fachada completa da Villa Entre Verdes com piscina, espreguiçadeiras e hammock em Riviera de São Lourenço' },
  { src: '/12052026-DSCF0563.jpeg',                       alt: 'Villa Entre Verdes vista do jardim com piscina em primeiro plano e vegetação tropical' },
  { src: '/12052026-DSCF0501.jpeg',                       alt: 'Fachada lateral da Villa Entre Verdes com jardim, espreguiçadeiras e quadra de areia ao fundo' },
  { src: '/12052026-DSCF0084.jpeg',                       alt: 'Espreguiçadeira à beira da piscina com coco verde e livro – Villa Entre Verdes, Riviera de São Lourenço' },
  { src: '/12052026-DSCF0095.jpeg',                       alt: 'Hóspede relaxando na espreguiçadeira à beira da piscina rodeada por jardim tropical – Villa Entre Verdes' },
  { src: '/11052026-DSCF0022-2.jpeg',                     alt: 'Sauna com parede de vidro iluminada à noite ao lado da piscina – Villa Entre Verdes' },
  { src: '/11052026-DSCF0019-2.jpeg',                     alt: 'Espreguiçadeira e fogueira ao lado da piscina iluminada à noite – Villa Entre Verdes, Bertioga SP' },
  { src: '/12052026-DJI_20260512110956_0928_D.jpeg',      alt: 'Vista aérea de drone da Villa Entre Verdes mostrando piscina, quadra de areia e jardim em Riviera de São Lourenço' },
  { src: '/12052026-DSCF0667.jpeg',                       alt: 'Fachada lateral da Villa Entre Verdes com jardim tropical e coqueiros em Bertioga SP' },
  { src: '/12052026-DSCF0363-HDR.jpeg',                   alt: 'Café da manhã completo servido ao ar livre com mesa farta e piscina ao fundo – Villa Entre Verdes' },
  { src: '/12052026-DSCF0070.jpeg',                       alt: 'Café sendo servido na xícara com frutas frescas na mesa ao ar livre – Villa Entre Verdes' },
  { src: '/12052026-DSCF0180.jpeg',                       alt: 'Chuveiro externo de madeira com espreguiçadeiras no jardim – Villa Entre Verdes, Riviera de São Lourenço' },
  { src: '/12052026-DSCF0390.jpeg',                       alt: 'Sala de estar integrada com TV, sofá e escada de madeira – Villa Entre Verdes' },
  { src: '/12052026-DSCF0396.jpeg',                       alt: 'Hall de entrada com escada de madeira, plantas e integração com o jardim – Villa Entre Verdes' },
  { src: '/12052026-DSCF0709.jpeg',                       alt: 'Cozinha gourmet completa com dois refrigeradores e bancada de granito – Villa Entre Verdes' },
  { src: '/11052026-DSCF0007.jpeg',                       alt: 'Suíte com cama de casal, cabeceira de madeira e vista para o jardim – Villa Entre Verdes' },
  { src: '/11052026-DSCF0210.jpeg',                       alt: 'Quarto com duas camas de solteiro, decoração artística e porta de vidro com vista para jardim – Villa Entre Verdes' },
  { src: '/12052026-DSCF0431.jpeg',                       alt: 'Quarto com camas de solteiro em tons rosé e decoração com arte folhagem – Villa Entre Verdes' },
  { src: '/11052026-DSCF0099.jpeg',                       alt: 'Salão de jogos com mesa de sinuca e cozinha gourmet integrada à área externa – Villa Entre Verdes' },
  { src: '/12052026-DSCF0638.jpeg',                       alt: 'Interior da sauna revestida com azulejo verde e porta de vidro com vista para o jardim – Villa Entre Verdes' },
  { src: '/11052026-DSCF0085.jpeg',                       alt: 'Banheiro moderno com acabamento clean, box de vidro e cuba esculpida – Villa Entre Verdes' },
]

// ── [V3] Eyebrow: rótulo editorial acima dos títulos de seção ───────────────

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="text-[#B8860B] text-[11px] font-semibold uppercase tracking-[0.3em] mb-3">
      {children}
    </p>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function IndexV2() {
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [heroIndex, setHeroIndex] = useState(0)
  const [lightbox,  setLightbox]  = useState<number | null>(null)
  const [heroReady, setHeroReady] = useState(false)   // [V3] adia download das fotos 2-5 do hero
  const [showBar,   setShowBar]   = useState(false)   // [V3] barra sticky de CTA no mobile
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function startInterval() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setHeroIndex(i => (i + 1) % heroImages.length)
    }, 7000)
  }

  useEffect(() => {
    startInterval()
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  // [V3] Libera as demais fotos do hero após o first paint
  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 1500)
    return () => clearTimeout(t)
  }, [])

  // [V3] Barra sticky de CTA aparece no mobile após sair do hero
  useEffect(() => {
    function onScroll() { setShowBar(window.scrollY > window.innerHeight * 0.7) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // [V3] Scroll reveal: observa blocos marcados com data-reveal
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible')
          obs.unobserve(entry.target)
        }
      })
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' })
    els.forEach(el => { el.classList.add('reveal'); obs.observe(el) })
    return () => obs.disconnect()
  }, [])

  function heroPrev() { setHeroIndex(i => (i - 1 + heroImages.length) % heroImages.length); startInterval() }
  function heroNext() { setHeroIndex(i => (i + 1) % heroImages.length); startInterval() }
  function heroGoto(i: number) { setHeroIndex(i); startInterval() }

  function openLightbox(i: number) { setLightbox(i) }
  function closeLightbox() { setLightbox(null) }
  function lightboxPrev() { setLightbox(i => i !== null ? (i - 1 + galleryImages.length) % galleryImages.length : 0) }
  function lightboxNext() { setLightbox(i => i !== null ? (i + 1) % galleryImages.length : 0) }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (lightbox === null) return
      if (e.key === 'ArrowLeft')  lightboxPrev()
      if (e.key === 'ArrowRight') lightboxNext()
      if (e.key === 'Escape')     closeLightbox()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  return (
    <div className="min-h-screen bg-[#FAFAF7]">

      {/* ── [V2] Lightbox overlay ──────────────────────────────────────── */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
            aria-label="Fechar"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            onClick={e => { e.stopPropagation(); lightboxPrev() }}
            className="absolute left-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>

          <img
            src={galleryImages[lightbox].src}
            alt={galleryImages[lightbox].alt}
            className="max-h-[88vh] max-w-[88vw] object-contain rounded-lg shadow-2xl"
            onClick={e => e.stopPropagation()}
          />

          <button
            onClick={e => { e.stopPropagation(); lightboxNext() }}
            className="absolute right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
            aria-label="Próxima"
          >
            <ChevronRight className="h-7 w-7" />
          </button>

          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-xs">
            {lightbox + 1} / {galleryImages.length} · ESC para fechar
          </p>
        </div>
      )}

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative h-screen overflow-hidden">

        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-30">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <span className="text-white text-2xl font-garamond font-semibold drop-shadow-lg tracking-wide">
              Villa Entre Verdes
            </span>
            <nav className="hidden md:flex items-center gap-6 text-white">
              {[
                ['#quartos',        'QUARTOS'],
                ['#experiencias',   'EXPERIÊNCIAS'],
                ['#tour',           'TOUR VIRTUAL'],
                ['#riviera',        'A RIVIERA'],
                ['#localizacao',    'LOCALIZAÇÃO'],
                ['#depoimentos',    'DEPOIMENTOS'],
                ['#disponibilidade','DISPONIBILIDADE'],
                ['#contato',        'CONTATO'],
              ].map(([href, label]) => (
                <a key={href} href={href} className="text-xs font-medium hover:opacity-75 transition-opacity tracking-wide">
                  {label}
                </a>
              ))}
            </nav>
            <button className="md:hidden text-white p-2" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
          {menuOpen && (
            <div className="md:hidden bg-black/90 backdrop-blur-sm px-6 py-4 flex flex-col gap-4">
              {[
                ['#quartos',        'QUARTOS'],
                ['#experiencias',   'EXPERIÊNCIAS'],
                ['#tour',           'TOUR VIRTUAL'],
                ['#riviera',        'A RIVIERA'],
                ['#localizacao',    'LOCALIZAÇÃO'],
                ['#depoimentos',    'DEPOIMENTOS'],
                ['#disponibilidade','DISPONIBILIDADE'],
                ['#contato',        'CONTATO'],
              ].map(([href, label]) => (
                <a key={href} href={href} className="text-white text-sm font-medium tracking-wide" onClick={() => setMenuOpen(false)}>
                  {label}
                </a>
              ))}
            </div>
          )}
        </header>

        {/* Background carousel — [V3] 1ª foto prioritária, demais adiadas, Ken Burns na ativa */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((img, i) => (
            <div key={i} className={`absolute inset-0 overflow-hidden transition-opacity duration-700 ${i === heroIndex ? 'opacity-100' : 'opacity-0'}`}>
              {(i === 0 || heroReady) && (
                <img
                  src={img.src}
                  alt={img.alt}
                  decoding={i === 0 ? undefined : 'async'}
                  className={`w-full h-full object-cover object-center ${i === heroIndex ? 'animate-kenburns' : ''}`}
                  {...(i === 0 ? ({ fetchpriority: 'high' } as Record<string, string>) : {})}
                />
              )}
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/60 z-10" />

        {/* Carousel arrows */}
        <button onClick={heroPrev} className="absolute left-4 top-1/2 -translate-y-1/2 z-40 bg-black/30 hover:bg-black/50 text-white rounded-full p-3 transition-colors" aria-label="Foto anterior">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button onClick={heroNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-40 bg-black/30 hover:bg-black/50 text-white rounded-full p-3 transition-colors" aria-label="Próxima foto">
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Dot indicators — mobile: bottom-6, desktop: bottom-28 */}
        <div className="absolute bottom-6 md:bottom-28 left-1/2 -translate-x-1/2 z-40 flex gap-2 items-center">
          {heroImages.map((_, i) => (
            <button key={i} onClick={() => heroGoto(i)} className={`h-2 rounded-full transition-all duration-300 ${i === heroIndex ? 'bg-white w-6' : 'bg-white/50 w-2'}`} aria-label={`Foto ${i + 1}`} />
          ))}
        </div>

        {/* Hero text — centralizado em todas as telas */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">

          {/* Badge de prova social — oculto no mobile */}
          <div className="hidden md:flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 mb-6">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />)}
            </div>
            <span className="text-white text-xs font-medium">5,0 · Superhost no Airbnb · +40 grupos hospedados</span>
          </div>

          {/* Localização — mobile e desktop */}
          <p className="text-white/80 text-xs md:text-sm uppercase tracking-[0.3em] mb-2 md:mb-4">Riviera de São Lourenço · Bertioga · SP</p>

          {/* Prova social — mobile only, discreta */}
          <p className="md:hidden text-white/60 text-[11px] mb-3 flex items-center justify-center gap-1">
            <span>⭐ Superhost · Preferido dos hóspedes no Airbnb</span>
          </p>

          {/* H1 */}
          <h1 className="text-white text-4xl md:text-7xl font-garamond font-semibold mb-3 md:mb-4 leading-tight drop-shadow-lg">
            Uma vila inteira.<br /> Só para você.
          </h1>

          {/* Frase curta — visível no mobile, oculta no desktop (que tem o parágrafo completo) */}
          <p className="md:hidden text-white/80 text-sm mb-6 tracking-wide">
            22 pessoas, lazer completo.
          </p>

          {/* Parágrafo descritivo — oculto no mobile */}
          <p className="hidden md:block text-white/90 text-lg md:text-xl max-w-2xl mb-3 leading-relaxed">
            8 suítes, piscina aquecida, sauna, quadra e área gourmet.<br />
            Tudo exclusivo para você e seu grupo, até 22 pessoas. A 120 km de São Paulo.
          </p>

          {/* Âncora de valor — oculta no mobile */}
          <p className="hidden md:block text-white/65 text-sm mb-8 tracking-wide">
            Dividido entre vocês, sai mais barato do que um hotel de mesmo padrão. Com muito mais liberdade.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <a href="#disponibilidade">
              <Button size="lg" className="bg-white text-[#2D5016] hover:bg-white/90 font-semibold px-8 py-6 text-base rounded-full shadow-luxury">
                Fazer orçamento agora →
              </Button>
            </a>
            {/* Segundo botão — oculto no mobile para não conflitar; leva à galeria de fotos */}
            <a href="#galeria" className="hidden sm:block">
              <Button size="lg" variant="outline" className="border-white/60 text-white hover:bg-white/15 font-medium px-8 py-6 text-base rounded-full backdrop-blur-sm">
                Ver a Villa por dentro
              </Button>
            </a>
          </div>
        </div>

        {/* Bottom booking bar — oculta no mobile, visível no desktop */}
        <div className="hidden sm:block absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-full max-w-4xl px-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-luxury overflow-hidden">
            <div className="flex items-stretch divide-x divide-gray-200">
              <a href="#disponibilidade" className="flex-1 px-6 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                <Calendar className="h-5 w-5 text-[#2D5016] shrink-0" />
                <span className="text-sm text-gray-600">Verificar datas disponíveis</span>
              </a>
              <a href="#disponibilidade" className="flex-1 px-6 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                <Users className="h-5 w-5 text-[#2D5016] shrink-0" />
                <span className="text-sm text-gray-600">Até 22 hóspedes / 50 convidados</span>
              </a>
              <a href="#experiencias" className="flex-1 px-6 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                <PartyPopper className="h-5 w-5 text-[#2D5016] shrink-0" />
                <span className="text-sm text-gray-600">Ver experiências e eventos</span>
              </a>
              <a href={WA_ORCAMENTO} target="_blank" rel="noopener noreferrer" className="shrink-0">
                <Button className="h-full bg-[#2D5016] hover:bg-[#2D5016]/90 text-white rounded-none px-8 font-medium">
                  Consultar valor
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Atrativos strip ──────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-start md:justify-center gap-6 md:gap-10 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {[
              { icon: BedDouble,   label: '8 Quartos' },
              { icon: Bath,        label: '11 Banheiros' },
              { icon: Users,       label: 'Até 22 hóspedes' },
              { icon: Waves,       label: 'Piscina aquecida' },
              { icon: Thermometer, label: 'Sauna e Jacuzzi' },
              { icon: Activity,    label: 'Quadra de Beach Tennis' },
              { icon: Gamepad2,    label: 'Sinuca' },
              { icon: Flame,       label: 'Churrasqueira' },
              { icon: Car,         label: 'Estacionamento' },
              { icon: Shield,      label: 'Segurança 24h' },
              { icon: Wifi,        label: 'Wi-Fi' },
              { icon: ChefHat,     label: 'Cozinha completa' },
            ].map(({ icon: Icon, label }, i) => (
              <div key={i} className="flex flex-col items-center gap-2 shrink-0">
                <Icon className="h-7 w-7 text-[#2D5016]" strokeWidth={1.5} />
                <span className="text-[11px] text-gray-500 font-medium text-center whitespace-nowrap">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── [V2] Disponibilidade SUBIU — agora é a 2ª seção ─────────────── */}
      <section id="disponibilidade" className="py-16 bg-[#F4F1EB]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10" data-reveal>
            <Eyebrow>Disponibilidade</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-garamond font-bold text-[#2D5016] mb-3">Sua data está disponível?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Confira em tempo real. Calendário sincronizado com o Airbnb.
              Selecione as datas e envie sua solicitação direto pelo WhatsApp.
            </p>
          </div>
          <AvailabilityCalendar />

        </div>
      </section>

      {/* ── Apresentação ─────────────────────────────────────────────────── */}
      <section id="sobre" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16" data-reveal>
            <Eyebrow>A Villa</Eyebrow>
            {/* [V2] Headline mais direta ao ponto */}
            <h2 className="text-4xl font-garamond font-bold text-[#2D5016] mb-4">
              A casa que você aluga inteira, sem dividir com desconhecidos.
            </h2>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto">
              Na Villa Entre Verdes, você e seu grupo têm a propriedade completa: piscina aquecida, sauna, jacuzzi,
              quadra de beach tennis, área gourmet e 8 suítes. Sem lobby compartilhado, sem horário de
              silêncio, sem regras de hotel. Do seu jeito, no seu ritmo, a 120 km de São Paulo.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <Card key={i} className="text-center shadow-card hover:shadow-luxury transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8">
                  <f.icon className="h-12 w-12 text-[#2D5016] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                  <p className="text-gray-500">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── [V2] Galeria com lightbox ─────────────────────────────────────── */}
      <section id="galeria" className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12" data-reveal>
            <Eyebrow>Galeria</Eyebrow>
            <h2 className="text-4xl font-garamond font-bold text-[#2D5016] mb-4">
              Estrutura completa para até 22 hóspedes e 50 pessoas em eventos
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-2">
              Espaços únicos integrados à natureza na Riviera de São Lourenço.
            </p>
            {/* [V2] Instrução de clique */}
            <p className="text-sm text-gray-400 flex items-center justify-center gap-1.5">
              <ZoomIn className="h-4 w-4" /> Clique em qualquer foto para ampliar
            </p>
          </div>

          {/* [V3] Grid editorial: 1ª foto em destaque duplo, todas com lazy loading */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            {galleryImages.map((img, i) => (
              <div
                key={i}
                className={`relative group cursor-zoom-in rounded-2xl overflow-hidden shadow-card hover:shadow-luxury transition-all duration-300 ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
                onClick={() => openLightbox(i)}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  decoding="async"
                  className={`w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ${i === 0 ? 'h-[26.75rem] md:h-[33.5rem]' : 'h-52 md:h-64'}`}
                  style={(img as any).style}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tour em Vídeo ─────────────────────────────────────────────────── */}
      <section id="tour" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16" data-reveal>
            <Eyebrow>Tour em vídeo</Eyebrow>
            <h2 className="text-4xl font-garamond font-bold text-[#2D5016] mb-4">Tour pela Villa</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Explore cada espaço antes de chegar
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
            {[
              { code: 'DWB4WZTEhGT', label: 'Área externa' },
              { code: 'DWEi6jrEmlm', label: 'Casa principal' },
              { code: 'DWHDnVLEj_u', label: 'Salão de jogos + Suítes' },
            ].map(({ code, label }) => (
              <div key={code} className="flex flex-col items-center gap-3 w-full max-w-[340px]">
                <iframe
                  src={`https://www.instagram.com/reel/${code}/embed/`}
                  width="340"
                  height="600"
                  loading="lazy"
                  frameBorder="0"
                  scrolling="no"
                  allowTransparency={true}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  className="rounded-2xl shadow-card w-full"
                  title={`Tour Villa Entre Verdes — ${label}`}
                />
                <p className="text-sm font-medium text-[#2D5016]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Suítes ────────────────────────────────────────────────────────── */}
      <section id="quartos" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16" data-reveal>
            <Eyebrow>Suítes</Eyebrow>
            <h2 className="text-4xl font-garamond font-bold text-[#2D5016] mb-4">
              8 quartos para grupos grandes com privacidade e alto padrão
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              7 suítes e 1 quarto com banheiro privativo, cada espaço com nome, personalidade e conforto próprios.
              Ideal para famílias numerosas e grupos em aluguel de temporada na Riviera de São Lourenço.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { src: '/Villa Stories - 20.jpg', bath: '/banheiro paraiso.jpeg',                  nome: 'Suíte Paraíso',        desc: 'Cama queen, banheiro renovado, ar-condicionado e vista privilegiada para a natureza.',                                                                                                       alt: 'Suíte Paraíso – acomodação de luxo na Villa Entre Verdes, Riviera de São Lourenço',                    acessivel: false },
              { src: '/Villa Stories - 21.jpg', bath: '/banheiro praiamar.jpeg',                  nome: 'Quarto Praiamar',       desc: 'Cama de casal, banheiro externo privativo, ar-condicionado, espaçoso e luminoso.',                                                                                                          alt: 'Quarto Praiamar com cama de casal – Villa Entre Verdes, Bertioga SP',                                   acessivel: false },
              { src: '/Villa Stories - 22.jpg', bath: '/Banheiro horizonte azul.jpeg',            nome: 'Suíte Horizonte Azul',  desc: '3 bicamas (6 camas de solteiro), ar-condicionado e ambiente sereno inspirado nas cores do mar.',                                                                                          alt: 'Suíte Horizonte Azul para grupos – aluguel de temporada Riviera de São Lourenço',                       acessivel: false },
              { src: '/Villa Stories - 23.jpg', bath: '/banheiro horizonte verde.jpeg',           nome: 'Suíte Horizonte Verde', desc: '2 bicamas (4 camas de solteiro), ar-condicionado e sacada com vista para a área de lazer.',                                                                                              alt: 'Suíte Horizonte Verde com sacada – Villa Entre Verdes, Riviera de São Lourenço',                        acessivel: false },
              { src: '/Villa Stories - 24.jpg', bath: '/banheiro horizonte rosa.jpeg',            nome: 'Suíte Horizonte Rosa',  desc: '2 bicamas (4 camas de solteiro), ar-condicionado e sacada com vista para a área de lazer.',                                                                                              alt: 'Suíte Horizonte Rosa com sacada – Villa Entre Verdes, Riviera de São Lourenço',                         acessivel: false },
              { src: '/Villa Stories - 25.jpg', bath: '/banheiro pordosol.jpeg',                  nome: 'Suíte Pôr do Sol',      desc: '2 bicamas (4 camas de solteiro), ar-condicionado, vista encantadora para a natureza e banheiro reformado.',                                                                              alt: 'Suíte Pôr do Sol – quarto com vista para natureza, Villa Entre Verdes Bertioga',                        acessivel: false },
              { src: '/Villa Stories - 26.jpg', bath: '/banheiro araucaria acessivel idoso.jpeg', nome: 'Suíte Araucária',       desc: '2 bicamas (4 camas de solteiro), ar-condicionado, térreo. Banheiro adaptado com corrimão no box e na privada, ideal para idosos e pessoas com mobilidade reduzida.',                   alt: 'Suíte Araucária acessível com banheiro adaptado – Villa Entre Verdes, Riviera de São Lourenço',         acessivel: true },
              { src: '/Villa Stories - 27.jpg', bath: '/banheiro terra.jpeg',                     nome: 'Suíte Terra',           desc: '2 bicamas (4 camas de solteiro), ar-condicionado e banheiro privativo.',                                                                                                                alt: 'Suíte Terra – acomodação para grupos na Villa Entre Verdes, Bertioga SP',                               acessivel: false },
            ].map((q, i) => (
              <div key={i} className="rounded-2xl overflow-hidden shadow-card hover:shadow-luxury transition-all duration-300 hover:-translate-y-1 bg-[#FAFAF7]">
                {/* [V3] Quarto com 60% do card, banheiro 40% */}
                <div className="grid grid-cols-[3fr_2fr] h-56">
                  <div className="relative overflow-hidden">
                    <img src={q.src} alt={q.alt} loading="lazy" decoding="async" className="w-full h-full object-cover object-center" />
                    <span className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">Quarto</span>
                  </div>
                  <div className="relative overflow-hidden border-l border-white/20">
                    <img src={q.bath} alt={`Banheiro – ${q.nome}`} loading="lazy" decoding="async" className="w-full h-full object-cover object-center" />
                    <span className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">Banheiro</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-garamond font-bold text-lg text-[#2D5016]">{q.nome}</h3>
                    {q.acessivel && (
                      <span className="text-[10px] bg-[#2D5016]/10 text-[#2D5016] border border-[#2D5016]/30 rounded-full px-2 py-0.5 font-medium whitespace-nowrap">
                        ♿ Acessível
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed">{q.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <h3 className="font-garamond font-bold text-2xl text-[#2D5016] mb-6 text-center">Banheiros da Área da Piscina</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="rounded-2xl overflow-hidden shadow-card hover:shadow-luxury transition-all duration-300">
                <img src="/Banheiro Piscina1.jpg" alt="Banheiro da piscina – Villa Entre Verdes" loading="lazy" decoding="async" className="w-full h-64 object-cover object-center" />
                <div className="p-4 bg-[#FAFAF7]">
                  <p className="text-gray-500 text-xs">Banheiro da piscina, amplo e bem equipado para o conforto dos hóspedes durante o lazer.</p>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-card hover:shadow-luxury transition-all duration-300">
                <img src="/Banheiro Piscina 2 c chuveiro.jpg" alt="Banheiro da piscina com chuveiro – Villa Entre Verdes" loading="lazy" decoding="async" className="w-full h-64 object-cover object-center" />
                <div className="p-4 bg-[#FAFAF7]">
                  <p className="text-gray-500 text-xs">Banheiro da piscina com box e chuveiro, ideal para se refrescar sem sair da área de lazer.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Riviera de São Lourenço ───────────────────────────────────────── */}
      <section id="riviera" className="py-20 bg-[#F4F1EB]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-4" data-reveal>
            <span className="inline-flex items-center gap-2 bg-[#2D5016] text-white text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
              <Award className="h-3.5 w-3.5" /> ISO 14001 · Certificação Mundial
            </span>
            <h2 className="text-4xl md:text-5xl font-garamond font-bold text-[#2D5016] mb-4">A Riviera de São Lourenço</h2>
            <p className="text-xl text-[#B8860B] font-garamond italic mb-4">Mais do que uma praia. Um projeto único no mundo.</p>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">O bairro mais especial do litoral brasileiro. A Villa Entre Verdes está no coração dele.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
            {[
              { icon: Leaf,       title: 'Pioneirismo Mundial em Sustentabilidade', text: 'Em 2000, a Riviera se tornou o primeiro projeto de desenvolvimento urbano do mundo a receber a certificação ISO 14001 de gestão ambiental, renovada ininterruptamente por mais de 23 anos.' },
              { icon: Shield,     title: 'Segurança de Alto Nível',                 text: 'Acesso controlado 24h, câmeras em toda a extensão do bairro, inclusive na orla e na areia da praia, com cerca de 250 profissionais de segurança privada em parceria com as polícias Civil, Militar e Corpo de Bombeiros.' },
              { icon: Waves,      title: '4,5 km de Praia Pristina',                text: 'Maior projeto de desenvolvimento urbano do litoral brasileiro: 9 milhões de m² de área planejada, areia branca, bandeira verde da CETESB, mar calmo e sem poluição.' },
              { icon: TreePine,   title: '80% de Natureza Preservada',              text: 'Mata Atlântica, trilhas e áreas verdes cobrem 80% do território. Mais de 45 mil mudas de espécies nativas plantadas nos últimos anos. Um bairro dentro da floresta.' },
              { icon: Microscope, title: 'Tecnologia e Infraestrutura de Excelência', text: "Sistema de tratamento de esgoto desenvolvido em parceria com o MIT (EUA), com capacidade de 12 mil m³/dia. Em mais de 40 anos, a Riviera nunca sofreu falta d'água, enchentes ou poluição da praia." },
              { icon: Bike,       title: 'Qualidade de Vida Completa',              text: '7+ km de ciclovias, restaurantes, Riviera Shopping, escolas, clínicas 24h, beach tennis, hipismo, golfe, surf e muito mais. Tudo a apenas 120 km de São Paulo.' },
            ].map((item, i) => (
              <Card key={i} className="bg-green-50 border-0 shadow-card hover:shadow-luxury transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-7">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-white rounded-full p-2 shadow-sm">
                      <item.icon className="h-6 w-6 text-[#2D5016]" />
                    </div>
                    <h3 className="font-garamond font-bold text-lg text-[#1A1A1A] leading-tight">{item.title}</h3>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-14 text-center">
            <p className="text-2xl font-garamond italic text-[#2D5016] max-w-2xl mx-auto leading-relaxed">
              "Hospedar-se na Villa Entre Verdes é viver tudo isso de dentro."
            </p>
          </div>
        </div>
      </section>

      {/* ── Serviços Extras ───────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16" data-reveal>
            <Eyebrow>Sob medida</Eyebrow>
            <h2 className="text-4xl font-garamond font-bold text-[#2D5016] mb-4">Serviços Extras</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Personalize ainda mais sua estadia com nossos serviços adicionais</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {extraServices.map((s, i) => (
              <Card key={i} className="shadow-card hover:shadow-luxury transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold flex-1">{s.name}</h3>
                    <span className="text-[#B8860B] font-medium text-sm ml-2">{s.price}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <a href={waLink('Olá! Gostaria de saber mais sobre os serviços extras da Villa Entre Verdes.')} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="border-[#2D5016] text-[#2D5016] hover:bg-[#2D5016] hover:text-white">
                Perguntar sobre serviços extras
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── [V3] Experiências Villa Entre Verdes ──────────────────────────── */}
      <section id="experiencias" className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16" data-reveal>
            <Sparkles className="h-12 w-12 text-[#B8860B] mx-auto mb-4" />
            <Eyebrow>Exclusivas</Eyebrow>
            <h2 className="text-4xl md:text-5xl font-garamond font-bold text-[#2D5016] mb-4">Experiências Villa Entre Verdes</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Atividades especiais para cuidar do corpo e da mente, conduzidas por profissionais, sem sair da Villa.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {experiences.map((exp, i) => (
              <Card key={i} className={`overflow-hidden shadow-card hover:shadow-luxury transition-all duration-300 hover:-translate-y-2 ${exp.featured ? 'ring-2 ring-[#B8860B]' : ''}`}>
                <div className={`bg-gradient-to-br ${exp.gradient} p-8 text-center border-b border-gray-100`}>
                  <div className="bg-[#2D5016] rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <exp.icon className="h-8 w-8 text-white" strokeWidth={1.75} />
                  </div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-1">Experiência</p>
                  <h3 className="text-2xl font-garamond font-bold text-[#1A1A1A]">{exp.title}</h3>
                </div>
                <CardContent className="p-6 space-y-5">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-[#2D5016] shrink-0" />
                      <span className="text-gray-500"><strong className="text-[#1A1A1A] font-semibold">Duração:</strong> {exp.duracao}</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-[#2D5016] shrink-0" />
                      <span className="text-gray-500"><strong className="text-[#1A1A1A] font-semibold">Participantes:</strong> {exp.participantes}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Award className="h-4 w-4 text-[#2D5016] shrink-0 mt-0.5" />
                      <span className="text-gray-500">{exp.detalhe}</span>
                    </li>
                  </ul>
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-0.5">Valor</p>
                    <p className="text-[#B8860B] font-semibold text-xl mb-4">{exp.valor}</p>
                    <a href={waExperiencia(exp.title)} target="_blank" rel="noopener noreferrer" className="block">
                      <Button className="w-full bg-[#2D5016] hover:bg-[#2D5016]/90 text-white font-semibold" size="lg">
                        Quero essa experiência
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Observação sobre grupos maiores */}
          <div className="max-w-3xl mx-auto mb-12 bg-[#F4F1EB] border border-[#E5E5DC] rounded-2xl p-6 flex items-start gap-4">
            <div className="bg-[#2D5016] rounded-full p-2 shrink-0">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-[#2D5016] mb-1">Informações importantes</p>
              <p className="text-sm text-gray-500 leading-relaxed">
                Para grupos acima de 10 pessoas, será cobrado o valor adicional de <strong className="text-[#1A1A1A]">R$ 100,00 por pessoa</strong>.
                Todas as experiências são agendadas previamente conforme a disponibilidade dos profissionais.
              </p>
            </div>
          </div>
          <div className="mt-16">
            <h3 className="text-3xl font-garamond font-bold text-[#2D5016] text-center mb-10">Formatos de Evento</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {eventPackages.map((pkg, i) => (
                <Card key={i} className={`shadow-card hover:shadow-luxury transition-all duration-300 hover:-translate-y-2 ${pkg.featured ? 'ring-2 ring-[#B8860B]' : ''}`}>
                  <CardContent className="p-8">
                    <pkg.icon className="h-10 w-10 text-[#2D5016] mb-4" />
                    <h3 className="text-xl font-bold mb-1">{pkg.title}</h3>
                    <p className="text-sm text-gray-400 mb-1">{pkg.subtitle}</p>
                    <p className="text-[#B8860B] font-semibold text-sm mb-4">{pkg.capacity}</p>
                    <ul className="space-y-2 mb-6">
                      {pkg.features.map((f, j) => (
                        <li key={j} className="text-sm text-gray-500 flex items-start gap-2">
                          <span className="text-[#2D5016] mt-0.5">✓</span>{f}
                        </li>
                      ))}
                    </ul>
                    <a href={waEvento(pkg.title)} target="_blank" rel="noopener noreferrer" className="block">
                      <Button variant="outline" className="w-full border-[#2D5016] text-[#2D5016] hover:bg-[#2D5016] hover:text-white">
                        Consultar disponibilidade
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* [V3] Experiências complementares + convite a sugestões */}
          <div className="mt-16 max-w-3xl mx-auto text-center bg-white rounded-2xl shadow-card p-10" data-reveal>
            <MessageCircle className="h-10 w-10 text-[#B8860B] mx-auto mb-4" strokeWidth={1.5} />
            <h3 className="text-2xl md:text-3xl font-garamond font-bold text-[#2D5016] mb-3">
              Novas experiências chegando à Villa
            </h3>
            <p className="text-gray-500 leading-relaxed mb-3">
              Estamos sempre ampliando o que a Villa oferece: massagem e spa, chef exclusivo, coquetelaria,
              passeios pela Riviera, aulas de surf e muito mais, sempre com profissionais de confiança.
            </p>
            <p className="text-gray-500 leading-relaxed mb-8">
              Tem alguma experiência em mente ou quer indicar um profissional? Vamos adorar receber sua
              sugestão e montar algo sob medida para o seu grupo.
            </p>
            <a href={WA_SUGESTAO} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full px-8">
                <MessageCircle className="h-5 w-5 mr-2" />
                Enviar sugestão pelo WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── Depoimentos ───────────────────────────────────────────────────── */}
      <section id="depoimentos" className="py-20 bg-[#F4F1EB]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16" data-reveal>
            <Eyebrow>Depoimentos</Eyebrow>
            {/* [V2] Rating + contagem de avaliações */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-[#B8860B] text-[#B8860B]" />)}
              </div>
              <span className="text-2xl font-garamond font-bold text-[#2D5016]">5,0</span>
              <span className="text-gray-400 text-sm">· +40 avaliações verificadas no Airbnb</span>
            </div>
            <h2 className="text-4xl font-garamond font-bold text-[#2D5016] mb-4">O que dizem nossos hóspedes</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Avaliações reais de hóspedes verificados, copiadas diretamente do Airbnb.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Martin',  period: '2 semanas atrás · Airbnb',     stars: 5, text: 'Nossa estadia foi simplesmente impecável! A casa é maravilhosa, extremamente espaçosa, muito bem cuidada e ainda mais bonita pessoalmente do que nas fotos. Foi uma experiência realmente especial, que proporciona momentos inesquecíveis. Dá para sentir o cuidado em cada detalhe. Sem dúvida, uma das melhores experiências que já tivemos. Recomendo de olhos fechados!' },
              { name: 'Thais',   period: 'Outubro de 2025 · Airbnb',     stars: 5, text: 'Anfitriões super acessíveis e amáveis, a propriedade é incrível, com uma área de lazer com sauna, piscina aquecida, jacuzzi, quadra de areia e mesa de sinuca. Pegamos dois dias chuvosos, mas a casa é tão boa que a chuva nem atrapalhou. O acesso à praia é tranquilo, uns 450m de caminhada.' },
              { name: 'Caio',    period: 'Agosto de 2025 · Airbnb',      stars: 5, text: 'Atendimento a nível VIP feito pela Erica e pelo Gustavo. Estadia excelente, casa incrível e com o melhor suporte que se pode oferecer. Uma menção honrosa para dona Lucia, caseira do lugar e cozinheira durante nossa estadia, que nos fez ter uma experiência de hotel 5 estrelas.' },
              { name: 'Aloisio', period: 'Julho de 2025 · Airbnb',       stars: 5, text: 'A casa é muito legal e bem equipada e acomodou muito bem nossa família de 18. A Lúcia foi muito atenciosa e estava sempre pronta para nos ajudar. Recomendamos 100% e vamos voltar com certeza. Muito obrigado!' },
              { name: 'Dario',   period: 'Outubro de 2025 · Airbnb',     stars: 5, text: 'Os anfitriões foram perfeitos desde o início da reserva até o check-out. A casa é maravilhosa, a cozinha é muito bem equipada e as indicações dadas foram perfeitas. Voltaremos mais vezes, com certeza. Recomendamos muito.' },
              { name: 'Gabriel', period: 'Novembro de 2024 · Airbnb',    stars: 5, text: 'A casa é toda nova e possui uma área de lazer dificilmente encontrada em outros imóveis, que vai desde piscina com sauna a uma quadra de beach tênis. Acomodou muito bem nosso grupo de cerca de 20 pessoas. Recomendo.' },
            ].map((review, i) => (
              <Card key={i} className="bg-white border-0 shadow-card hover:shadow-luxury transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-7 flex flex-col gap-4">
                  <div className="flex gap-0.5">
                    {[...Array(review.stars)].map((_, j) => <Star key={j} className="h-4 w-4 fill-[#B8860B] text-[#B8860B]" />)}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed flex-1">"{review.text}"</p>
                  <div className="border-t border-gray-100 pt-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#2D5016]/10 flex items-center justify-center text-[#2D5016] font-bold text-sm shrink-0">
                      {review.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-[#1A1A1A] text-sm">{review.name}</p>
                      <p className="text-xs text-gray-400">{review.period}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* [V2] Link verificável para o Airbnb */}
          <div className="text-center mt-8">
            <a href="https://www.airbnb.com.br/rooms/1136990082264714793" target="_blank" rel="noopener noreferrer"
              className="text-sm text-[#2D5016] underline underline-offset-2 hover:opacity-70 transition-opacity">
              Ver todas as avaliações no Airbnb →
            </a>
          </div>
          <div className="text-center mt-8">
            <a href={WA_ORCAMENTO} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-[#2D5016] hover:bg-[#2D5016]/90 text-white rounded-full px-10 py-4 font-semibold">
                Quero viver essa experiência
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── Localização ───────────────────────────────────────────────────── */}
      <section id="localizacao" className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16" data-reveal>
            <Eyebrow>Localização</Eyebrow>
            <h2 className="text-4xl font-garamond font-bold text-[#2D5016] mb-4">Localização Privilegiada</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Riviera de São Lourenço, um dos destinos mais exclusivos do litoral paulista</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: MapPin,   color: '#B8860B', title: '500m da praia', desc: 'Acesso fácil e rápido às praias da Riviera' },
              { icon: TreePine, color: '#2D5016', title: 'Área verde',    desc: 'Cercada por vegetação preservada' },
              { icon: Clock,    color: '#B8860B', title: '1h30 de São Paulo', desc: 'Acesso rápido pela Rodovia Rio-Santos' },
            ].map((item, i) => (
              <Card key={i} className="text-center shadow-card">
                <CardContent className="p-8">
                  <item.icon className="h-12 w-12 mx-auto mb-4" style={{ color: item.color }} />
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-500">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16" data-reveal>
            <Eyebrow>Dúvidas</Eyebrow>
            <h2 className="text-4xl font-garamond font-bold text-[#2D5016] mb-4">Perguntas Frequentes</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Tire suas dúvidas e planeje sua estadia perfeita</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible>
              {faqItems.map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-gray-500">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ── Contato / CTA ────────────────────────────────────────────────── */}
      <section id="contato" className="py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto" data-reveal>
            {/* [V3] Sparkles no lugar do PartyPopper — tom mais sóbrio e premium */}
            <Sparkles className="h-12 w-12 mx-auto mb-6 opacity-80" />
            <h2 className="text-4xl font-garamond font-bold mb-6">Reserve agora e garanta sua data!</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Finais de semana de alta temporada e feriados esgotam rápido.
              Entre em contato e transforme seu evento em uma experiência inesquecível.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <a href={WA_ORCAMENTO} target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-6 transition-colors block">
                <Phone className="h-8 w-8 mx-auto mb-3" />
                <p className="font-semibold mb-1">WhatsApp</p>
                <p className="text-sm opacity-90">(11) 99022-2000</p>
              </a>
              <a href="mailto:villaentreverdes@hotmail.com" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-6 transition-colors block">
                <Mail className="h-8 w-8 mx-auto mb-3" />
                <p className="font-semibold mb-1">E-mail</p>
                <p className="text-sm opacity-90">villaentreverdes@hotmail.com</p>
              </a>
              <a href="https://instagram.com/villaentreverdes" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-6 transition-colors block">
                <Camera className="h-8 w-8 mx-auto mb-3" />
                <p className="font-semibold mb-1">Instagram</p>
                <p className="text-sm opacity-90">@villaentreverdes</p>
              </a>
            </div>
            <a href={WA_ORCAMENTO} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="secondary" className="text-lg px-10 py-6 text-[#2D5016] font-bold rounded-full shadow-luxury">
                Solicitar Orçamento via WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── [V3] Footer completo ──────────────────────────────────────────── */}
      <footer className="bg-[#1E3A0E] text-white py-14 pb-24 md:pb-14">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10 text-center md:text-left">

            {/* Marca */}
            <div>
              <h3 className="text-2xl font-garamond font-semibold mb-3">Villa Entre Verdes</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-4">
                Casa de alto padrão para grupos de até 22 hóspedes e eventos de até 50 pessoas,
                na Riviera de São Lourenço, Bertioga/SP.
              </p>
              <p className="text-white/70 text-sm flex items-center justify-center md:justify-start gap-1.5">
                <Star className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />
                5,0 · Superhost no Airbnb · +40 avaliações
              </p>
            </div>

            {/* Navegação */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37] mb-4">Navegue</p>
              <nav className="flex flex-col gap-2.5 text-sm text-white/70">
                <a href="#disponibilidade" className="hover:text-white transition-colors">Disponibilidade</a>
                <a href="#quartos" className="hover:text-white transition-colors">Suítes</a>
                <a href="#tour" className="hover:text-white transition-colors">Tour em vídeo</a>
                <a href="#experiencias" className="hover:text-white transition-colors">Experiências e eventos</a>
                <a href="#depoimentos" className="hover:text-white transition-colors">Depoimentos</a>
                <a href="#riviera" className="hover:text-white transition-colors">A Riviera</a>
              </nav>
            </div>

            {/* Contato */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37] mb-4">Contato</p>
              <div className="flex flex-col gap-2.5 text-sm text-white/70">
                <a href={WA_ORCAMENTO} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center justify-center md:justify-start gap-2">
                  <Phone className="h-4 w-4" /> (11) 99022-2000
                </a>
                <a href="mailto:villaentreverdes@hotmail.com" className="hover:text-white transition-colors flex items-center justify-center md:justify-start gap-2">
                  <Mail className="h-4 w-4" /> villaentreverdes@hotmail.com
                </a>
                <a href="https://instagram.com/villaentreverdes" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center justify-center md:justify-start gap-2">
                  <Camera className="h-4 w-4" /> @villaentreverdes
                </a>
                <p className="flex items-center justify-center md:justify-start gap-2 text-white/50">
                  <MapPin className="h-4 w-4" /> Riviera de São Lourenço, Bertioga/SP
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 text-center">
            <p className="text-xs text-white/40">© {new Date().getFullYear()} Villa Entre Verdes. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* ── [V3] Barra sticky de CTA — só mobile, após sair do hero ───────── */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-3 py-2.5 flex gap-2 shadow-[0_-4px_20px_rgba(0,0,0,0.10)] transition-transform duration-300 ${showBar ? 'translate-y-0' : 'translate-y-full'}`}>
        <a href="#disponibilidade" className="flex-1">
          <Button variant="outline" className="w-full border-[#2D5016] text-[#2D5016] font-semibold text-sm py-5 rounded-xl">
            <Calendar className="h-4 w-4 mr-1.5" /> Ver datas
          </Button>
        </a>
        <a href={WA_ORCAMENTO} target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-sm py-5 rounded-xl">
            <MessageCircle className="h-4 w-4 mr-1.5" /> WhatsApp
          </Button>
        </a>
      </div>

      {/* ── WhatsApp float — no mobile some quando a barra sticky aparece ─── */}
      <a href={WA_ORCAMENTO} target="_blank" rel="noopener noreferrer"
        className={`fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-luxury transition-all duration-300 hover:scale-110 ${showBar ? 'hidden md:block' : ''}`}
        aria-label="Falar no WhatsApp"
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  )
}
