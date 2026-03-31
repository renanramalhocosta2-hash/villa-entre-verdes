import { useState } from 'react'
import {
  MapPin, Users, Home, Star, Phone, Mail, Car, Waves, TreePine,
  Camera, MessageCircle, Heart, Briefcase, Utensils, Wifi, Wind,
  Tv, Shield, ChefHat, Music, Calendar, Clock, PartyPopper,
  Dumbbell, Sparkles, Menu, X,
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
  { name: 'Massagem e Spa Relax', price: 'A partir de R$ 150 por pessoa' },
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
            alt="Villa Entre Verdes"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 z-10" />

        {/* Hero text */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
          <p className="text-white/80 text-sm uppercase tracking-[0.3em] mb-4">Riviera de São Lourenço · SP</p>
          <h1 className="text-white text-5xl md:text-7xl font-garamond font-semibold mb-6 leading-tight drop-shadow-lg">
            Villa Entre Verdes
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-xl mb-8">
            Exclusividade, conforto e natureza para experiências que você nunca vai esquecer.
          </p>
          <a href="#disponibilidade">
            <Button size="lg" className="bg-white text-[#2D5016] hover:bg-white/90 font-semibold px-8 py-6 text-base rounded-full shadow-luxury">
              Ver Disponibilidade
            </Button>
          </a>
        </div>

        {/* Bottom booking bar */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-full max-w-4xl px-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-full shadow-luxury p-2 flex flex-col sm:flex-row items-center gap-2 sm:gap-0">
            <a href="#disponibilidade" className="flex-1 px-6 py-3 flex items-center gap-3 border-b sm:border-b-0 sm:border-r border-gray-200 w-full sm:w-auto hover:bg-gray-50 rounded-full transition-colors">
              <Calendar className="h-5 w-5 text-[#2D5016]" />
              <span className="text-sm text-gray-600">Verificar datas disponíveis</span>
            </a>
            <a href="#disponibilidade" className="flex-1 px-6 py-3 flex items-center gap-3 border-b sm:border-b-0 sm:border-r border-gray-200 w-full sm:w-auto hover:bg-gray-50 rounded-full transition-colors">
              <Users className="h-5 w-5 text-[#2D5016]" />
              <span className="text-sm text-gray-600">Até 22 hóspedes / 60 convidados</span>
            </a>
            <a href="#disponibilidade" className="flex-1 px-6 py-3 flex items-center gap-3 w-full sm:w-auto hover:bg-gray-50 rounded-full transition-colors">
              <PartyPopper className="h-5 w-5 text-[#2D5016]" />
              <span className="text-sm text-gray-600">Ver pacotes e eventos</span>
            </a>
            <a href="#disponibilidade">
              <Button className="bg-[#2D5016] hover:bg-[#2D5016]/90 text-white rounded-full px-8 py-6 font-medium w-full sm:w-auto">
                Solicitar Orçamento
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── Apresentação ─────────────────────────────────────────────────── */}
      <section id="sobre" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-garamond font-bold text-[#2D5016] mb-4">Apresentação da Villa</h2>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto">
              Exclusividade, conforto e natureza em um só lugar. Estrutura completa para eventos inesquecíveis
              na Riviera de São Lourenço.
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
            <h2 className="text-4xl font-garamond font-bold text-[#2D5016] mb-4">Conheça Nossa Estrutura</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Espaços únicos integrados à natureza para eventos memoráveis
            </p>
          </div>
          {/* Linha 1: 3 fotos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <img src="/Piscina+jardim.jpeg" alt="Área gourmet e piscina"
              className="rounded-2xl shadow-card w-full h-64 object-cover object-center hover:shadow-luxury transition-shadow duration-300" />
            <img src="/JARDIM.jpeg" alt="Jardim tropical"
              className="rounded-2xl shadow-card w-full h-64 object-cover object-center hover:shadow-luxury transition-shadow duration-300" />
            <img src="/Quadrabeach.jpeg" alt="Quadra de areia iluminada"
              className="rounded-2xl shadow-card w-full h-64 object-cover object-center hover:shadow-luxury transition-shadow duration-300" />
          </div>
          {/* Linha 2: 3 fotos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <img src="/SalaTV1.jpeg" alt="Sala de estar"
              className="rounded-2xl shadow-card w-full h-64 object-cover hover:shadow-luxury transition-shadow duration-300" style={{ objectPosition: 'center 60%' }} />
            <img src="/salaodejogos.jpg" alt="Salão de jogos"
              className="rounded-2xl shadow-card w-full h-64 object-cover object-center hover:shadow-luxury transition-shadow duration-300" />
            <img src="/Sauna+Jacuzzi.jpeg" alt="Jacuzzi e sauna"
              className="rounded-2xl shadow-card w-full h-64 object-cover hover:shadow-luxury transition-shadow duration-300" style={{ objectPosition: 'center 60%' }} />
          </div>
        </div>
      </section>

      {/* ── Suítes ────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-garamond font-bold text-[#2D5016] mb-4">Acomodações</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              7 suítes e 1 quarto com banheiro privativo — cada espaço pensado para proporcionar conforto, leveza e tranquilidade.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-card hover:shadow-luxury transition-shadow duration-300">
              <img
                src="/Villa Stories - 20.jpg"
                alt="Suíte Paraíso"
                className="w-full h-80 object-cover"
              />
              <div className="p-6 bg-[#FAFAF7]">
                <h3 className="text-2xl font-garamond font-bold text-[#2D5016] mb-2">Suíte Paraíso</h3>
                <p className="text-gray-500 text-sm">
                  Recém-reformada, com vista privilegiada para a natureza, cama queen de alto padrão e banheiro totalmente novo. Cada detalhe pensado para proporcionar conforto e tranquilidade.
                </p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-card hover:shadow-luxury transition-shadow duration-300">
              <img
                src="/Villa Stories - 23.jpg"
                alt="Suíte Villa"
                className="w-full h-80 object-cover"
              />
              <div className="p-6 bg-[#FAFAF7]">
                <h3 className="text-2xl font-garamond font-bold text-[#2D5016] mb-2">Suítes da Villa</h3>
                <p className="text-gray-500 text-sm">
                  Ambientes aconchegantes com decoração autêntica, ar-condicionado e toda a infraestrutura para uma estadia inesquecível entre a natureza da Riviera.
                </p>
              </div>
            </div>
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
              <a href="mailto:contato@villaentreverdes.com"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-6 transition-colors block">
                <Mail className="h-8 w-8 mx-auto mb-3" />
                <p className="font-semibold mb-1">E-mail</p>
                <p className="text-sm opacity-90">contato@villaentreverdes.com</p>
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
