import { useState } from 'react'
import {
  MapPin, Users, Home, Star, Phone, Mail, Car, Waves, TreePine,
  Camera, MessageCircle, Heart, Briefcase, Utensils, Wifi, Wind,
  Tv, Shield, ChefHat, Music, Calendar, Clock, PartyPopper,
  Dumbbell, Sparkles, Menu, X, Award, Bike, Microscope, Leaf,
  BedDouble, Flame, Bath, Activity, Gamepad2, Thermometer,
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

const WA_DEFAULT = waLink('Olá! Gostaria de saber mais sobre a Villa Entre Verdes.')

function waPacote(nome: string) {
  return waLink(`Olá! Tenho interesse no pacote "${nome}" da Villa Entre Verdes. Pode me enviar mais informações e disponibilidade?`)
}

function waEvento(tipo: string) {
  return waLink(`Olá! Gostaria de saber mais sobre o "${tipo}" da Villa Entre Verdes. Pode me enviar valores e disponibilidade?`)
}

const WA_ORCAMENTO = waLink('Olá! Gostaria de solicitar um orçamento para a Villa Entre Verdes.')

// ── Data ──────────────────────────────────────────────────────────────────────

const features = [
  { icon: Users, title: 'Até 60 convidados', description: 'Para eventos de 1 dia' },
  { icon: Home, title: '22 pessoas com pernoite', description: 'Suítes e acomodações de luxo' },
  { icon: Waves, title: 'Riviera de São Lourenço', description: 'Localização privilegiada' },
  { icon: TreePine, title: 'Estrutura completa', description: 'Piscina, quadra, área gourmet e salões' },
]

const villaPackages = [
  {
    icon: Heart,
    title: 'Wellness Experience',
    subtitle: 'Relaxamento, bem-estar e reconexão com a natureza',
    features: [
      'Hospedagem completa na Villa Entre Verdes',
      'Acesso à sauna, jacuzzi e piscina aquecida',
      'Sessão de yoga ou meditação guiada (1x por dia)',
      'Menu saudável (opcional, sob encomenda)',
      'Espaço zen com aromaterapia e música ambiente',
    ],
    target: 'Grupos de mulheres, retiros, casais, eventos de autocuidado',
    gradient: 'from-green-50 to-emerald-50',
  },
  {
    icon: Dumbbell,
    title: 'Fitness Retreat',
    subtitle: 'Performance, energia e rotina saudável',
    features: [
      'Hospedagem completa na Villa',
      'Treinos funcionais ou beach tennis com instrutor',
      'Acesso à sauna, piscina e quadra de areia',
      'Alimentação balanceada (opcional)',
      'Espaço para workshops de saúde e nutrição',
    ],
    target: 'Academias, grupos esportivos, empresas e influenciadores fitness',
    gradient: 'from-amber-50 to-orange-50',
  },
  {
    icon: PartyPopper,
    title: 'Party & Celebration',
    subtitle: 'Comemorações inesquecíveis e experiências sociais',
    features: [
      'Hospedagem completa na Villa',
      'Estrutura para festas, aniversários e mini weddings',
      'Espaço gourmet, bar e som ambiente',
      'Decoração personalizada e parceiros de eventos opcionais',
      'Concierge de apoio e limpeza durante o evento',
    ],
    target: 'Aniversários, casamentos íntimos, eventos corporativos',
    gradient: 'from-rose-50 to-pink-50',
    featured: true,
  },
]

const eventPackages = [
  {
    title: 'Evento de 1 dia',
    subtitle: 'Sem pernoite',
    capacity: 'Até 60 convidados',
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
  { name: 'Café da Manhã Completo', price: 'Por pessoa/dia' },
  { name: 'Chef exclusivo para almoço/jantar', price: 'Sob consulta' },
  { name: 'BarMan & Coquetelaria', price: 'Por hora' },
  { name: 'Massagem e Spa Relax', price: 'Sob consulta' },
  { name: 'Decoração temática', price: 'Sob consulta' },
  { name: 'Equipe de fotografia e vídeo', price: 'Sob consulta' },
  { name: 'Serviço de limpeza durante o evento', price: 'Por hora' },
]

const faqItems = [
  {
    question: 'Qual a diferença entre evento de 1 dia e com pernoite?',
    answer: 'Eventos de 1 dia comportam até 60 pessoas e incluem uso das áreas comuns. Com pernoite, acomodamos até 22 pessoas em suítes de luxo.',
  },
  {
    question: 'Os valores dos pacotes incluem quais serviços?',
    answer: 'Cada pacote tem inclusões específicas. Entre em contato para detalhamento completo dos valores e serviços inclusos.',
  },
  {
    question: 'É possível personalizar os pacotes?',
    answer: 'Sim! Oferecemos diversos serviços extras e podemos criar um pacote sob medida para seu evento.',
  },
  {
    question: 'Como fazer a reserva?',
    answer: 'Entre em contato via WhatsApp. Verificamos disponibilidade e enviamos proposta personalizada com valores atualizados.',
  },
  {
    question: 'Qual a antecedência mínima para reservas?',
    answer: 'Recomendamos reservar com pelo menos 30 dias de antecedência, especialmente para finais de semana e feriados.',
  },
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function Index() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#FAFAF7]">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative h-screen overflow-hidden">

        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-30">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div>
              <span className="text-white text-2xl font-garamond font-semibold drop-shadow-lg tracking-wide">
                Villa Entre Verdes
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-white">
              {[['#sobre', 'A VILLA'], ['#disponibilidade', 'DISPONIBILIDADE'], ['#pacotes', 'PACOTES'], ['#contato', 'CONTATO']].map(([href, label]) => (
                <a key={href} href={href} className="text-sm font-medium hover:opacity-75 transition-opacity tracking-wide">
                  {label}
                </a>
              ))}
            </nav>

            <button
              className="md:hidden text-white p-2"
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Menu"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden bg-black/90 backdrop-blur-sm px-6 py-4 flex flex-col gap-4">
              {[['#sobre', 'A VILLA'], ['#disponibilidade', 'DISPONIBILIDADE'], ['#pacotes', 'PACOTES'], ['#contato', 'CONTATO']].map(([href, label]) => (
                <a key={href} href={href} className="text-white text-sm font-medium tracking-wide" onClick={() => setMenuOpen(false)}>
                  {label}
                </a>
              ))}
            </div>
          )}
        </header>

        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/Foto capa.jpeg"
            alt="Villa Entre Verdes – casa de aluguel de temporada para grupos em Riviera de São Lourenço, Bertioga/SP"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 z-10" />

        {/* Hero text */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
          <p className="text-white/80 text-sm uppercase tracking-[0.3em] mb-4">Riviera de São Lourenço · Bertioga · SP</p>
          <h1 className="text-white text-5xl md:text-7xl font-garamond font-semibold mb-6 leading-tight drop-shadow-lg">
            Villa Entre Verdes
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-xl mb-8">
            Aluguel de temporada para grupos em Riviera de São Lourenço. Até 22 hóspedes, piscina privativa, área verde e experiência de alto padrão a 120 km de São Paulo.
          </p>
          <a href="#disponibilidade">
            <Button size="lg" className="bg-white text-[#2D5016] hover:bg-white/90 font-semibold px-8 py-6 text-base rounded-full shadow-luxury">
              Ver Disponibilidade
            </Button>
          </a>
        </div>

        {/* Bottom booking bar */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-full max-w-4xl px-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-luxury overflow-hidden">
            {/* Mobile: botão único */}
            <div className="flex sm:hidden flex-col">
              <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
                <a href="#disponibilidade" className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors">
                  <Calendar className="h-4 w-4 text-[#2D5016] shrink-0" />
                  <span className="text-xs text-gray-600 leading-tight">Verificar datas</span>
                </a>
                <a href="#disponibilidade" className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors">
                  <Users className="h-4 w-4 text-[#2D5016] shrink-0" />
                  <span className="text-xs text-gray-600 leading-tight">Até 22 hóspedes</span>
                </a>
              </div>
              <a href="#disponibilidade" className="block">
                <Button className="w-full bg-[#2D5016] hover:bg-[#2D5016]/90 text-white rounded-none py-4 font-medium text-sm">
                  Solicitar Orçamento
                </Button>
              </a>
            </div>
            {/* Desktop: layout horizontal */}
            <div className="hidden sm:flex items-stretch divide-x divide-gray-200">
              <a href="#disponibilidade" className="flex-1 px-6 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                <Calendar className="h-5 w-5 text-[#2D5016] shrink-0" />
                <span className="text-sm text-gray-600">Verificar datas disponíveis</span>
              </a>
              <a href="#disponibilidade" className="flex-1 px-6 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                <Users className="h-5 w-5 text-[#2D5016] shrink-0" />
                <span className="text-sm text-gray-600">Até 22 hóspedes / 60 convidados</span>
              </a>
              <a href="#disponibilidade" className="flex-1 px-6 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                <PartyPopper className="h-5 w-5 text-[#2D5016] shrink-0" />
                <span className="text-sm text-gray-600">Ver pacotes e eventos</span>
              </a>
              <a href="#disponibilidade" className="shrink-0">
                <Button className="h-full bg-[#2D5016] hover:bg-[#2D5016]/90 text-white rounded-none px-8 font-medium">
                  Solicitar Orçamento
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
              { icon: BedDouble,      label: '8 Quartos' },
              { icon: Bath,           label: '11 Banheiros' },
              { icon: Users,          label: 'Até 22 hóspedes' },
              { icon: Waves,          label: 'Piscina aquecida' },
              { icon: Thermometer,    label: 'Sauna e Jacuzzi' },
              { icon: Activity,       label: 'Quadra de Beach Tennis' },
              { icon: Gamepad2,       label: 'Sinuca' },
              { icon: Flame,          label: 'Churrasqueira' },
              { icon: Car,            label: 'Estacionamento' },
              { icon: Shield,         label: 'Segurança 24h' },
              { icon: Wifi,           label: 'Wi-Fi' },
              { icon: ChefHat,        label: 'Cozinha completa' },
            ].map(({ icon: Icon, label }, i) => (
              <div key={i} className="flex flex-col items-center gap-2 shrink-0">
                <Icon className="h-7 w-7 text-[#2D5016]" strokeWidth={1.5} />
                <span className="text-[11px] text-gray-500 font-medium text-center whitespace-nowrap">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Apresentação ─────────────────────────────────────────────────── */}
      <section id="sobre" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-garamond font-bold text-[#2D5016] mb-4">A melhor casa para grupos grandes no litoral paulista</h2>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto">
              A Villa Entre Verdes é a escolha ideal para quem busca aluguel de temporada em Riviera de São Lourenço com privacidade, exclusividade e estrutura de alto padrão. Espaço completo para famílias numerosas, confraternizações e retiros corporativos em Bertioga/SP.
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

      {/* ── Estrutura fotos ───────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-garamond font-bold text-[#2D5016] mb-4">Estrutura completa para até 22 hóspedes e 50 pessoas em eventos</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Espaços únicos integrados à natureza na Riviera de São Lourenço — ideais para grupos grandes, famílias e confraternizações em Bertioga/SP.
            </p>
          </div>
          {/* Linha 1: 3 fotos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <img src="/Piscina+jardim.jpeg" alt="Piscina aquecida e área gourmet da Villa Entre Verdes em Riviera de São Lourenço"
              className="rounded-2xl shadow-card w-full h-64 object-cover object-center hover:shadow-luxury transition-shadow duration-300" />
            <img src="/JARDIM.jpeg" alt="Jardim tropical preservado da Villa Entre Verdes em Bertioga SP"
              className="rounded-2xl shadow-card w-full h-64 object-cover object-center hover:shadow-luxury transition-shadow duration-300" />
            <img src="/Quadrabeach.jpeg" alt="Quadra de beach tennis iluminada para grupos na Riviera de São Lourenço"
              className="rounded-2xl shadow-card w-full h-64 object-cover object-center hover:shadow-luxury transition-shadow duration-300" />
          </div>
          {/* Linha 2: 3 fotos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <img src="/SalaTV1.jpeg" alt="Sala de estar de alto padrão da Villa Entre Verdes em Bertioga"
              className="rounded-2xl shadow-card w-full h-64 object-cover hover:shadow-luxury transition-shadow duration-300" style={{ objectPosition: 'center 60%' }} />
            <img src="/salaodejogos.jpg" alt="Salão de jogos com sinuca – Villa Entre Verdes, Riviera de São Lourenço"
              className="rounded-2xl shadow-card w-full h-64 object-cover object-center hover:shadow-luxury transition-shadow duration-300" />
            <img src="/Sauna+Jacuzzi.jpeg" alt="Sauna e jacuzzi privativa da Villa Entre Verdes em Riviera de São Lourenço"
              className="rounded-2xl shadow-card w-full h-64 object-cover hover:shadow-luxury transition-shadow duration-300" style={{ objectPosition: 'center 60%' }} />
          </div>
        </div>
      </section>

      {/* ── Tour em Vídeo ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-garamond font-bold text-[#2D5016] mb-4">Tour pela Villa</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Explore cada espaço da Villa Entre Verdes antes de chegar
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-garamond font-bold text-[#2D5016] mb-4">8 quartos para grupos grandes com privacidade e alto padrão</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              7 suítes e 1 quarto com banheiro privativo — cada espaço com nome, personalidade e conforto próprios. Ideal para famílias numerosas e grupos em aluguel de temporada na Riviera de São Lourenço.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { src: '/Villa Stories - 20.jpg', nome: 'Suíte Paraíso',        desc: 'Cama queen, banheiro renovado, ar-condicionado e vista privilegiada para a natureza.',              alt: 'Suíte Paraíso – acomodação de luxo na Villa Entre Verdes, Riviera de São Lourenço' },
              { src: '/Villa Stories - 21.jpg', nome: 'Quarto Praiamar',       desc: 'Cama de casal, banheiro externo privativo, ar-condicionado, espaçoso e luminoso.',                alt: 'Quarto Praiamar com cama de casal – Villa Entre Verdes, Bertioga SP' },
              { src: '/Villa Stories - 22.jpg', nome: 'Suíte Horizonte Azul',  desc: '3 bicamas (6 camas de solteiro), ar-condicionado e ambiente sereno inspirado nas cores do mar.',  alt: 'Suíte Horizonte Azul para grupos – aluguel de temporada Riviera de São Lourenço' },
              { src: '/Villa Stories - 23.jpg', nome: 'Suíte Horizonte Verde', desc: '2 bicamas (4 camas de solteiro), ar-condicionado e sacada com vista para a área de lazer.',      alt: 'Suíte Horizonte Verde com sacada – Villa Entre Verdes, Riviera de São Lourenço' },
              { src: '/Villa Stories - 24.jpg', nome: 'Suíte Horizonte Rosa',  desc: '2 bicamas (4 camas de solteiro), ar-condicionado e sacada com vista para a área de lazer.',      alt: 'Suíte Horizonte Rosa com sacada – Villa Entre Verdes, Riviera de São Lourenço' },
              { src: '/Villa Stories - 25.jpg', nome: 'Suíte Pôr do Sol',      desc: '2 bicamas (4 camas de solteiro), ar-condicionado, vista encantadora para a natureza e banheiro reformado.', alt: 'Suíte Pôr do Sol – quarto com vista para natureza, Villa Entre Verdes Bertioga' },
              { src: '/Villa Stories - 26.jpg', nome: 'Suíte Araucária',       desc: '2 bicamas (4 camas de solteiro), ar-condicionado e banheiro privativo.',                          alt: 'Suíte Araucária com banheiro privativo – Villa Entre Verdes, Riviera de São Lourenço' },
              { src: '/Villa Stories - 27.jpg', nome: 'Suíte Terra',           desc: '2 bicamas (4 camas de solteiro), ar-condicionado e banheiro privativo.',                          alt: 'Suíte Terra – acomodação para grupos na Villa Entre Verdes, Bertioga SP' },
            ].map((q, i) => (
              <div key={i} className="rounded-2xl overflow-hidden shadow-card hover:shadow-luxury transition-all duration-300 hover:-translate-y-1 bg-[#FAFAF7]">
                <img src={q.src} alt={q.alt} className="w-full h-72 object-cover object-center" />
                <div className="p-5">
                  <h3 className="font-garamond font-bold text-lg text-[#2D5016] mb-1">{q.nome}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{q.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Serviços Extras ───────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-garamond font-bold text-[#2D5016] mb-4">Serviços Extras</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Personalize ainda mais sua estadia com nossos serviços adicionais
            </p>
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

      {/* ── Localização ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-garamond font-bold text-[#2D5016] mb-4">Localização Privilegiada</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Riviera de São Lourenço, um dos destinos mais exclusivos do litoral paulista
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: MapPin, color: '#B8860B', title: '500m da praia', desc: 'Acesso fácil e rápido às praias da Riviera' },
              { icon: TreePine, color: '#2D5016', title: 'Área verde', desc: 'Cercada por vegetação preservada' },
              { icon: Clock, color: '#B8860B', title: '1h30 de São Paulo', desc: 'Acesso rápido pela Rodovia Rio-Santos' },
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

      {/* ── Riviera de São Lourenço ───────────────────────────────────────── */}
      <section className="py-20 bg-[#F4F1EB]">
        <div className="container mx-auto px-4">

          {/* Cabeçalho */}
          <div className="text-center mb-4">
            <span className="inline-flex items-center gap-2 bg-[#2D5016] text-white text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
              <Award className="h-3.5 w-3.5" /> ISO 14001 — Certificação Mundial
            </span>
            <h2 className="text-4xl md:text-5xl font-garamond font-bold text-[#2D5016] mb-4">
              A Riviera de São Lourenço
            </h2>
            <p className="text-xl text-[#B8860B] font-garamond italic mb-4">
              Mais do que uma praia. Um projeto único no mundo.
            </p>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              O bairro mais especial do litoral brasileiro — e a Villa Entre Verdes está no coração dele.
            </p>
          </div>

          {/* Grid de diferenciais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
            {[
              {
                icon: Leaf,
                color: '#2D5016',
                bg: 'bg-green-50',
                title: 'Pioneirismo Mundial em Sustentabilidade',
                text: 'Em 2000, a Riviera se tornou o primeiro projeto de desenvolvimento urbano do mundo a receber a certificação ISO 14001 de gestão ambiental — renovada ininterruptamente por mais de 23 anos.',
              },
              {
                icon: Shield,
                color: '#2D5016',
                bg: 'bg-green-50',
                title: 'Segurança de Alto Nível',
                text: 'Acesso controlado 24h, câmeras em toda a extensão do bairro — inclusive na orla e na areia da praia — e cerca de 250 profissionais de segurança privada em parceria com as polícias Civil, Militar e Corpo de Bombeiros.',
              },
              {
                icon: Waves,
                color: '#2D5016',
                bg: 'bg-green-50',
                title: '4,5 km de Praia Pristina',
                text: 'Maior projeto de desenvolvimento urbano do litoral brasileiro: 9 milhões de m² de área planejada, areia branca, bandeira verde da CETESB, mar calmo e sem poluição.',
              },
              {
                icon: TreePine,
                color: '#2D5016',
                bg: 'bg-green-50',
                title: '80% de Natureza Preservada',
                text: 'Mata Atlântica, trilhas e áreas verdes cobrem 80% do território. Mais de 45 mil mudas de espécies nativas plantadas nos últimos anos. Um bairro dentro da floresta.',
              },
              {
                icon: Microscope,
                color: '#2D5016',
                bg: 'bg-green-50',
                title: 'Tecnologia e Infraestrutura de Excelência',
                text: 'Sistema de tratamento de esgoto desenvolvido em parceria com o MIT (EUA), com capacidade de 12 mil m³/dia. Em mais de 40 anos, a Riviera nunca sofreu falta d\'água, enchentes ou poluição da praia.',
              },
              {
                icon: Bike,
                color: '#2D5016',
                bg: 'bg-green-50',
                title: 'Qualidade de Vida Completa',
                text: '7+ km de ciclovias, restaurantes, Riviera Shopping, escolas, clínicas 24h, beach tennis, hipismo, golfe, surf e muito mais — a apenas 120 km de São Paulo.',
              },
            ].map((item, i) => (
              <Card key={i} className={`${item.bg} border-0 shadow-card hover:shadow-luxury transition-all duration-300 hover:-translate-y-1`}>
                <CardContent className="p-7">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-white rounded-full p-2 shadow-sm">
                      <item.icon className="h-6 w-6" style={{ color: item.color }} />
                    </div>
                    <h3 className="font-garamond font-bold text-lg text-[#1A1A1A] leading-tight">{item.title}</h3>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Frase de encerramento */}
          <div className="mt-14 text-center">
            <p className="text-2xl font-garamond italic text-[#2D5016] max-w-2xl mx-auto leading-relaxed">
              "Hospedar-se na Villa Entre Verdes é viver tudo isso de dentro."
            </p>
          </div>

        </div>
      </section>

      {/* ── Disponibilidade ───────────────────────────────────────────────── */}
      <section id="disponibilidade" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-garamond font-bold text-[#2D5016] mb-4">Confira a Disponibilidade</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Selecione as datas de entrada e saída para enviar sua solicitação diretamente pelo WhatsApp.
              O calendário é sincronizado automaticamente com o Airbnb.
            </p>
          </div>
          <AvailabilityCalendar />
        </div>
      </section>

      {/* ── Pacotes Villa ─────────────────────────────────────────────────── */}
      <section id="pacotes" className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Sparkles className="h-12 w-12 text-[#B8860B] mx-auto mb-4" />
            <h2 className="text-4xl md:text-5xl font-garamond font-bold text-[#2D5016] mb-4">
              Pacotes Villa Entre Verdes
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Experiências únicas pensadas para diferentes momentos da sua vida
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {villaPackages.map((pkg, i) => (
              <Card
                key={i}
                className={`overflow-hidden shadow-card hover:shadow-luxury transition-all duration-300 hover:-translate-y-2 ${pkg.featured ? 'ring-2 ring-[#B8860B]' : ''}`}
              >
                <div className={`bg-gradient-to-br ${pkg.gradient} p-8 text-center border-b border-gray-100`}>
                  <pkg.icon className="h-16 w-16 text-[#2D5016] mx-auto mb-4" />
                  <h3 className="text-2xl font-garamond font-bold text-[#1A1A1A] mb-2">{pkg.title}</h3>
                  <p className="text-sm text-gray-500 italic">{pkg.subtitle}</p>
                </div>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h4 className="font-semibold text-[#2D5016] mb-3 flex items-center gap-2">
                      <Star className="h-4 w-4" /> O que inclui:
                    </h4>
                    <ul className="space-y-2">
                      {pkg.features.map((f, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm">
                          <span className="text-[#B8860B] mt-1">•</span>
                          <span className="text-gray-500">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400 mb-3">
                      <Users className="h-3 w-3 inline mr-1" />{pkg.target}
                    </p>
                    <a href={waPacote(pkg.title)} target="_blank" rel="noopener noreferrer" className="block">
                      <Button className="w-full bg-[#2D5016] hover:bg-[#2D5016]/90 text-white font-semibold" size="lg">
                        Faça seu orçamento
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Event packages */}
          <div className="mt-16">
            <h3 className="text-3xl font-garamond font-bold text-[#2D5016] text-center mb-10">Formatos de Evento</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {eventPackages.map((pkg, i) => (
                <Card
                  key={i}
                  className={`shadow-card hover:shadow-luxury transition-all duration-300 hover:-translate-y-2 ${pkg.featured ? 'ring-2 ring-[#B8860B]' : ''}`}
                >
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
        </div>
      </section>

      {/* ── Depoimentos ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#F4F1EB]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-[#B8860B] text-[#B8860B]" />
              ))}
            </div>
            <h2 className="text-4xl font-garamond font-bold text-[#2D5016] mb-4">O que dizem nossos hóspedes</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Avaliações reais do Airbnb — de hóspedes que viveram a experiência Villa Entre Verdes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Martin',
                period: '2 semanas atrás · Airbnb',
                stars: 5,
                text: 'Nossa estadia foi simplesmente impecável! A casa é maravilhosa, extremamente espaçosa, muito bem cuidada e ainda mais bonita pessoalmente do que nas fotos. Foi uma experiência realmente especial, que proporciona momentos inesquecíveis. Dá para sentir o cuidado em cada detalhe. Sem dúvida, uma das melhores experiências que já tivemos. Recomendo de olhos fechados!',
              },
              {
                name: 'Thais',
                period: 'Outubro de 2025 · Airbnb',
                stars: 5,
                text: 'Anfitriões super acessíveis e amáveis, a propriedade é incrível, com uma área de lazer com sauna, piscina aquecida, jacuzzi, quadra de areia e mesa de sinuca. Pegamos dois dias chuvosos, mas a casa é tão boa que a chuva nem atrapalhou. O acesso à praia é tranquilo, uns 450m de caminhada.',
              },
              {
                name: 'Caio',
                period: 'Agosto de 2025 · Airbnb',
                stars: 5,
                text: 'Atendimento a nível VIP feito pela Erica e pelo Gustavo. Estadia excelente, casa incrível e com o melhor suporte que se pode oferecer. Uma menção honrosa para dona Lucia, caseira do lugar e cozinheira durante nossa estadia, que nos fez ter uma experiência de hotel 5 estrelas.',
              },
              {
                name: 'Aloisio',
                period: 'Julho de 2025 · Airbnb',
                stars: 5,
                text: 'A casa é muito legal e bem equipada e acomodou muito bem nossa família de 18. A Lúcia foi muito atenciosa e estava sempre pronta para nos ajudar. Recomendamos 100% e vamos voltar com certeza. Muito obrigado!',
              },
              {
                name: 'Dario',
                period: 'Outubro de 2025 · Airbnb',
                stars: 5,
                text: 'Os anfitriões foram perfeitos desde o início da reserva até o check-out. A casa é maravilhosa, a cozinha é muito bem equipada e as indicações dadas foram perfeitas. Voltaremos mais vezes, com certeza. Recomendamos muito.',
              },
              {
                name: 'Gabriel',
                period: 'Novembro de 2024 · Airbnb',
                stars: 5,
                text: 'A casa é toda nova e possui uma área de lazer dificilmente encontrada em outros imóveis, que vai desde piscina com sauna a uma quadra de beach tênis. Acomodou muito bem nosso grupo de cerca de 20 pessoas. Recomendo.',
              },
            ].map((review, i) => (
              <Card key={i} className="bg-white border-0 shadow-card hover:shadow-luxury transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-7 flex flex-col gap-4">
                  {/* Estrelas */}
                  <div className="flex gap-0.5">
                    {[...Array(review.stars)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-[#B8860B] text-[#B8860B]" />
                    ))}
                  </div>
                  {/* Texto */}
                  <p className="text-gray-600 text-sm leading-relaxed flex-1">
                    "{review.text}"
                  </p>
                  {/* Autor */}
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

          <div className="text-center mt-10">
            <a href={WA_ORCAMENTO} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-[#2D5016] hover:bg-[#2D5016]/90 text-white rounded-full px-10 py-4 font-semibold">
                Quero viver essa experiência
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-garamond font-bold text-[#2D5016] mb-4">Perguntas Frequentes</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Tire suas dúvidas e planeje sua estadia perfeita na Villa Entre Verdes
            </p>
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
          <div className="max-w-4xl mx-auto">
            <PartyPopper className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-4xl font-garamond font-bold mb-6">Reserve agora e garanta sua data!</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Finais de semana de alta temporada e feriados esgotam rápido.
              Entre em contato e transforme seu evento em uma experiência inesquecível.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <a href={WA_ORCAMENTO} target="_blank" rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-6 transition-colors block">
                <Phone className="h-8 w-8 mx-auto mb-3" />
                <p className="font-semibold mb-1">WhatsApp</p>
                <p className="text-sm opacity-90">(11) 99022-2000</p>
              </a>
              <a href="mailto:villaentreverdes@hotmail.com"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-6 transition-colors block">
                <Mail className="h-8 w-8 mx-auto mb-3" />
                <p className="font-semibold mb-1">E-mail</p>
                <p className="text-sm opacity-90">villaentreverdes@hotmail.com</p>
              </a>
              <a href="https://instagram.com/villaentreverdes" target="_blank" rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-6 transition-colors block">
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

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-garamond font-bold text-[#2D5016] mb-4">Villa Entre Verdes</h3>
          <p className="text-gray-400 mb-6">Riviera de São Lourenço — Bertioga/SP</p>
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} Villa Entre Verdes. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* ── WhatsApp float ────────────────────────────────────────────────── */}
      <a
        href={WA_ORCAMENTO}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-luxury transition-all duration-300 hover:scale-110"
        aria-label="Falar no WhatsApp"
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  )
}
