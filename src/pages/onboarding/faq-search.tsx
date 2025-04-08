"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"

interface FAQ {
  question: string
  answer: string
  keywords?: string[]
}

export default function FAQSearch() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")

  const faqs: FAQ[] = [
    {
      question: t("Como faço para criar meu primeiro plano de vida?"),
      answer: t(
        "Para criar seu primeiro plano de vida, acesse a seção 'Plano de Vida' no menu lateral e clique no botão 'Criar Novo Plano'. Siga as instruções na tela para definir seu horizonte de planejamento e adicionar suas metas.",
      ),
      keywords: ["criar", "novo", "plano", "primeiro", "começar", "iniciar"],
    },
    {
      question: t("Posso ter mais de um plano de vida ao mesmo tempo?"),
      answer: t(
        "Sim, você pode criar múltiplos planos de vida para diferentes cenários ou objetivos. No plano básico, você pode ter até 3 planos simultâneos, enquanto nos planos premium e empresarial esse limite é maior.",
      ),
      keywords: ["múltiplos", "vários", "simultâneos", "diferentes", "cenários"],
    },
    {
      question: t("Como faço para alterar meu plano de assinatura?"),
      answer: t(
        "Para alterar seu plano, acesse a seção 'Planos' no menu lateral. Lá você poderá visualizar todos os planos disponíveis e fazer a alteração para o plano desejado.",
      ),
      keywords: ["alterar", "mudar", "assinatura", "upgrade", "downgrade", "plano"],
    },
    {
      question: t("É possível compartilhar meu plano de vida com outras pessoas?"),
      answer: t(
        "Sim, na seção 'Invite de Usuários' você pode convidar outras pessoas para visualizar ou colaborar com seu plano de vida. Cada plano tem diferentes limites de usuários convidados.",
      ),
      keywords: ["compartilhar", "convidar", "colaborar", "amigos", "família", "equipe"],
    },
    {
      question: t("Como faço para exportar meus dados?"),
      answer: t(
        "Você pode exportar seus dados em formato PDF ou CSV (dependendo do seu plano) através da opção 'Exportar' disponível na página do seu plano de vida ou na seção de gráficos.",
      ),
      keywords: ["exportar", "baixar", "pdf", "csv", "dados", "backup"],
    },
    {
      question: t("Posso acessar o sistema pelo celular?"),
      answer: t(
        "Sim, o sistema Plano de Vida é totalmente responsivo e pode ser acessado de qualquer dispositivo com acesso à internet, incluindo smartphones e tablets.",
      ),
      keywords: ["celular", "mobile", "smartphone", "tablet", "responsivo", "app"],
    },
    {
      question: t("Como recupero minha senha?"),
      answer: t(
        "Na tela de login, clique em 'Esqueci minha senha' e siga as instruções enviadas para seu e-mail cadastrado para criar uma nova senha.",
      ),
      keywords: ["senha", "recuperar", "esqueci", "reset", "login", "acesso"],
    },
    {
      question: t("Meus dados estão seguros?"),
      answer: t(
        "Sim, utilizamos criptografia de ponta a ponta e seguimos as melhores práticas de segurança para garantir que seus dados estejam sempre protegidos.",
      ),
      keywords: ["segurança", "dados", "privacidade", "criptografia", "proteção"],
    },
    {
      question: t("Posso cancelar minha assinatura a qualquer momento?"),
      answer: t(
        "Sim, você pode cancelar sua assinatura a qualquer momento através da seção 'Planos'. O acesso ao sistema continuará disponível até o final do período já pago.",
      ),
      keywords: ["cancelar", "assinatura", "encerrar", "contrato", "pagamento"],
    },
    {
      question: t("Como funciona o programa de indicação?"),
      answer: t(
        "Para cada amigo que se cadastrar usando seu link de indicação, você ganha pontos que podem ser trocados por meses grátis do seu plano atual. Acesse a seção 'Invite de Usuários' para mais detalhes.",
      ),
      keywords: ["indicação", "referral", "amigos", "pontos", "bônus", "grátis"],
    },
  ]

  const filteredFAQs =
    searchQuery.trim() === ""
      ? faqs
      : faqs.filter((faq) => {
          const searchLower = searchQuery.toLowerCase()
          return (
            faq.question.toLowerCase().includes(searchLower) ||
            faq.answer.toLowerCase().includes(searchLower) ||
            (faq.keywords && faq.keywords.some((keyword) => keyword.toLowerCase().includes(searchLower)))
          )
        })

  return {
    searchQuery,
    setSearchQuery,
    filteredFAQs,
  }
}
