#!/usr/bin/env python3
"""Cria as campanhas v1 da Tuliu (plano-campanhas.md) na conta 876-312-1335. Tudo PAUSED."""
import os
import sys
import warnings

warnings.filterwarnings("ignore")
sys.path.insert(0, os.path.expanduser("~/.claude/skills/google-ads-ratos/scripts"))
from lib import init_client  # noqa: E402

CID = "8763121335"
BR = "geoTargetConstants/2076"
PT = "languageConstants/1014"
SITE = "https://tuliu.io"

NEG_A = ["login", "entrar", "webmail", "cpanel", "área do cliente", "telefone", "suporte",
         "grátis", "gratuito", "gratuita", "curso", "vaga", "emprego", "vps", "dedicado",
         "revenda", "minecraft", "servidor de jogo", "email marketing"]
NEG_B = ["vaga", "vagas", "emprego", "estágio", "salário", "curso", "faculdade", "pdf",
         "como abrir", "como ser", "como montar", "nome para", "logo", "grátis"]

RSA_A = dict(
    url=f"{SITE}/hospedagem", path1="hospedagem", path2="site-pronto",
    headlines=["Site Pronto + Hospedagem", "Por R$97/mês, Tudo Incluso", "Hospedagem Sozinha Não Vende",
               "Domínio, SSL e E-mail Inclusos", "Nós Criamos e Cuidamos do Site", "Hospedagem com Site Incluso",
               "Esqueça cPanel e Configuração", "Suporte Direto no WhatsApp", "Sem Taxa de Criação do Site",
               "Sem Fidelidade", "Mais que Hospedagem: Um Time", "Troque de Hospedagem Hoje",
               "Tuliu: Site Feito Para Você"],
    descriptions=["Hospedagem te dá um servidor. A Tuliu te entrega o site pronto, publicado e mantido.",
                  "Domínio, hospedagem, SSL, e-mails e site profissional por R$97/mês. Sem fidelidade.",
                  "Nada de painel técnico: você pede pelo WhatsApp e nosso time resolve.",
                  "Comece pelo Starter e cresça com tráfego pago e SEO quando quiser."],
)
RSA_B = dict(
    url=f"{SITE}/diagnostico", path1="agencia", path2="diagnostico",
    headlines=["Agência de Marketing Repensada", "Um Time de Marketing Completo", "Pelo Preço de uma Ferramenta",
               "Agências São Lentas e Caras", "IA Executa, Humano Aprova", "Diagnóstico Gratuito",
               "Tráfego, Site e SEO Juntos", "Gestão de Google e Meta Ads", "Melhora Toda Semana com Dados",
               "Planos a Partir de R$497/mês", "Sem Fidelidade, via WhatsApp", "Veja Nossos Cases Reais"],
    descriptions=["Site, SEO, conteúdo, tráfego pago e IA numa só operação que melhora toda semana.",
                  "A IA faz o operacional, nosso time cuida da estratégia. Você paga resultado, não horas.",
                  "Peça seu diagnóstico gratuito e receba um panorama real do seu marketing pelo WhatsApp.",
                  "Sem fidelidade e sem taxa de criação. Tudo direto pelo WhatsApp, sem fila."],
)

CAMPAIGNS = [
    dict(name="Tuliu | Search | Hospedagem → Starter", budget=30, cpc=3.0, negatives=NEG_A, rsa=RSA_A, groups=[
        ("A1 Hospedagem", ["hospedagem de site", "hospedagem de sites", "hospedagem site barata",
                           "hospedagem com domínio"], ["hospedagem de site"]),
        ("A2 Site + hospedagem", ["criar site profissional", "site com domínio e hospedagem", "quanto custa um site",
                                  "site para empresa", "fazer site para minha empresa"], []),
        ("A3 Concorrentes", ["hostinger", "locaweb", "hostgator", "kinghost", "alternativa hostinger",
                             "cancelar hostinger"], []),
    ]),
    dict(name="Tuliu | Search | Agência Repensada", budget=20, cpc=5.0, negatives=NEG_B, rsa=RSA_B, groups=[
        ("B1 Agência de marketing", ["agência de marketing digital", "contratar agência de marketing",
                                     "agência de marketing para pequenas empresas",
                                     "quanto custa agência de marketing", "agência de marketing preço"], []),
        ("B2 Tráfego pago", ["agência de tráfego pago", "gestão de tráfego pago", "gestor de tráfego para empresa",
                             "agência google ads"], []),
        ("B3 Agência com IA", ["agência de marketing com ia", "marketing com inteligência artificial para empresas",
                               "trocar de agência de marketing"], []),
    ]),
]

SITELINKS = [("Planos e Preços", f"{SITE}/#precos", "Starter R$97, Business R$497", "Sem fidelidade"),
             ("Cases Reais", f"{SITE}/cases", "Resultados de clientes reais", "Saúde, indústria e varejo"),
             ("Diagnóstico Gratuito", f"{SITE}/diagnostico", "Panorama do seu marketing", "Resposta pelo WhatsApp"),
             ("Hospedagem com Site", f"{SITE}/hospedagem", "Site pronto e mantido", "Domínio, SSL e e-mail")]
CALLOUTS = ["Sem fidelidade", "Sem taxa de criação", "Suporte via WhatsApp", "Domínio e SSL inclusos",
            "IA + especialistas", "Relatório de resultados"]


def micros(reais):
    return int(round(reais * 1_000_000))


def check_lengths():
    for c in CAMPAIGNS:
        r = c["rsa"]
        for h in r["headlines"]:
            assert len(h) <= 30, (len(h), h)
        for d in r["descriptions"]:
            assert len(d) <= 90, (len(d), d)
        assert len(r["path1"]) <= 15 and len(r["path2"]) <= 15
    for s in SITELINKS:
        assert len(s[0]) <= 25 and len(s[2]) <= 35 and len(s[3]) <= 35, s
    for co in CALLOUTS:
        assert len(co) <= 25, co


def main():
    check_lengths()
    client = init_client()
    E = client.enums
    svc = client.get_service

    for c in CAMPAIGNS:
        bop = client.get_type("CampaignBudgetOperation")
        b = bop.create
        b.name = f"{c['name']} — budget"
        b.amount_micros = micros(c["budget"])
        b.delivery_method = E.BudgetDeliveryMethodEnum.STANDARD
        b.explicitly_shared = False
        budget_rn = svc("CampaignBudgetService").mutate_campaign_budgets(
            customer_id=CID, operations=[bop]).results[0].resource_name

        cop = client.get_type("CampaignOperation")
        k = cop.create
        k.name = c["name"]
        k.status = E.CampaignStatusEnum.PAUSED
        k.advertising_channel_type = E.AdvertisingChannelTypeEnum.SEARCH
        k.campaign_budget = budget_rn
        k.target_spend.cpc_bid_ceiling_micros = micros(c["cpc"])  # Maximizar cliques com teto
        k.network_settings.target_google_search = True
        k.network_settings.target_search_network = False
        k.network_settings.target_content_network = False
        k.geo_target_type_setting.positive_geo_target_type = E.PositiveGeoTargetTypeEnum.PRESENCE
        k.contains_eu_political_advertising = E.EuPoliticalAdvertisingStatusEnum.DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING
        camp_rn = svc("CampaignService").mutate_campaigns(
            customer_id=CID, operations=[cop]).results[0].resource_name
        print(f"✓ Campanha {c['name']} → {camp_rn}")

        crit_ops = []
        for rn in (BR, PT):
            op = client.get_type("CampaignCriterionOperation")
            op.create.campaign = camp_rn
            if rn == BR:
                op.create.location.geo_target_constant = rn
            else:
                op.create.language.language_constant = rn
            crit_ops.append(op)
        for neg in c["negatives"]:
            op = client.get_type("CampaignCriterionOperation")
            op.create.campaign = camp_rn
            op.create.negative = True
            op.create.keyword.text = neg
            op.create.keyword.match_type = E.KeywordMatchTypeEnum.PHRASE
            crit_ops.append(op)
        svc("CampaignCriterionService").mutate_campaign_criteria(customer_id=CID, operations=crit_ops)
        print(f"  ✓ Brasil + português + {len(c['negatives'])} negativas")

        for gname, phrase, exact in c["groups"]:
            gop = client.get_type("AdGroupOperation")
            g = gop.create
            g.name = gname
            g.campaign = camp_rn
            g.status = E.AdGroupStatusEnum.PAUSED
            g.type_ = E.AdGroupTypeEnum.SEARCH_STANDARD
            g.cpc_bid_micros = micros(c["cpc"])  # nunca o default de R$0,01 (aprendizados.md)
            ag_rn = svc("AdGroupService").mutate_ad_groups(
                customer_id=CID, operations=[gop]).results[0].resource_name

            kw_ops = []
            for text, mt in [(t, "PHRASE") for t in phrase] + [(t, "EXACT") for t in exact]:
                op = client.get_type("AdGroupCriterionOperation")
                op.create.ad_group = ag_rn
                op.create.status = E.AdGroupCriterionStatusEnum.ENABLED
                op.create.keyword.text = text
                op.create.keyword.match_type = E.KeywordMatchTypeEnum[mt]
                kw_ops.append(op)
            svc("AdGroupCriterionService").mutate_ad_group_criteria(customer_id=CID, operations=kw_ops)

            r = c["rsa"]
            aop = client.get_type("AdGroupAdOperation")
            a = aop.create
            a.ad_group = ag_rn
            a.status = E.AdGroupAdStatusEnum.PAUSED
            a.ad.final_urls.append(r["url"])
            rsa = a.ad.responsive_search_ad
            rsa.path1, rsa.path2 = r["path1"], r["path2"]
            for h in r["headlines"]:
                asset = client.get_type("AdTextAsset")
                asset.text = h
                rsa.headlines.append(asset)
            for d in r["descriptions"]:
                asset = client.get_type("AdTextAsset")
                asset.text = d
                rsa.descriptions.append(asset)
            svc("AdGroupAdService").mutate_ad_group_ads(customer_id=CID, operations=[aop])
            print(f"  ✓ {gname}: {len(kw_ops)} keywords + RSA")

    # Extensões no nível da conta
    asset_ops = []
    for text, url, d1, d2 in SITELINKS:
        op = client.get_type("AssetOperation")
        op.create.final_urls.append(url)
        op.create.sitelink_asset.link_text = text
        op.create.sitelink_asset.description1 = d1
        op.create.sitelink_asset.description2 = d2
        asset_ops.append(op)
    for text in CALLOUTS:
        op = client.get_type("AssetOperation")
        op.create.callout_asset.callout_text = text
        asset_ops.append(op)
    results = svc("AssetService").mutate_assets(customer_id=CID, operations=asset_ops).results
    link_ops = []
    for i, res in enumerate(results):
        op = client.get_type("CustomerAssetOperation")
        op.create.asset = res.resource_name
        op.create.field_type = E.AssetFieldTypeEnum.SITELINK if i < len(SITELINKS) else E.AssetFieldTypeEnum.CALLOUT
        link_ops.append(op)
    svc("CustomerAssetService").mutate_customer_assets(customer_id=CID, operations=link_ops)
    print(f"✓ {len(SITELINKS)} sitelinks + {len(CALLOUTS)} callouts na conta")


if __name__ == "__main__":
    main()
