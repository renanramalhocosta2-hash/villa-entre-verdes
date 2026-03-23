# Como colocar o site no ar

## 1. Instalar Node.js (uma vez só)

Acesse https://nodejs.org e baixe a versão **LTS** (botão verde).
Instale normalmente. Após instalar, reinicie o terminal.

---

## 2. Instalar dependências e testar localmente

Abra o terminal dentro da pasta `villa-site` e rode:

```bash
npm install
npm run dev
```

Abra http://localhost:5173 no navegador para ver o site.

---

## 3. Gerar o build final

```bash
npm run build
```

Isso cria a pasta `dist/` com todos os arquivos prontos.

---

## 4. Deploy no Netlify (gratuito e simples)

### Opção A — Arrastar e soltar (mais fácil)

1. Acesse https://app.netlify.com
2. Crie uma conta gratuita (pode usar Google ou GitHub)
3. Na tela inicial, arraste a pasta `dist/` para a área "drag and drop"
4. O site vai ao ar em segundos com uma URL automática

> **Atenção:** Para que o calendário funcione (proxy do iCal), use a **Opção B** abaixo.
> O drag & drop não suporta as funções serverless necessárias para buscar o Airbnb.

### Opção B — GitHub + Netlify (recomendado para o calendário funcionar)

1. Crie uma conta em https://github.com (grátis)
2. Crie um repositório novo e suba os arquivos da pasta `villa-site`
3. No Netlify, clique em "Import from Git" e conecte o repositório
4. O Netlify detecta o `netlify.toml` automaticamente e faz tudo sozinho
5. A função `/api/ical` estará disponível e o calendário vai funcionar

---

## 5. Domínio personalizado (opcional)

No painel do Netlify: **Domain settings → Add custom domain**
Digite `villaentreverdes.com.br` (ou o domínio que tiver) e siga as instruções de DNS.

---

## Resumo do que está pronto no site

- ✅ Calendário de disponibilidade sincronizado com Airbnb (iCal)
- ✅ Seleção de datas com envio automático para WhatsApp
- ✅ Todos os botões de orçamento direcionam para WhatsApp
- ✅ Botão flutuante de WhatsApp em todas as páginas
- ✅ Menu mobile responsivo
- ✅ SEO básico configurado
- ✅ Deploy automático no Netlify via netlify.toml
