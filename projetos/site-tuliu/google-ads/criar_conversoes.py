#!/usr/bin/env python3
"""Cria as ações de conversão da Tuliu e imprime o ID da tag (AW-...) e os labels."""
import os, sys, warnings
warnings.filterwarnings("ignore")
sys.path.insert(0, os.path.expanduser("~/.claude/skills/google-ads-ratos/scripts"))
from lib import init_client

CID = "8763121335"
ACTIONS = [  # nome, categoria, primária
    ("Lead — Diagnóstico", "SUBMIT_LEAD_FORM", True),
    ("Checkout Starter iniciado", "BEGIN_CHECKOUT", True),
    ("Clique WhatsApp", "CONTACT", False),
]

client = init_client()
E = client.enums
ops = []
for name, cat, primary in ACTIONS:
    op = client.get_type("ConversionActionOperation")
    a = op.create
    a.name = name
    a.type_ = E.ConversionActionTypeEnum.WEBPAGE
    a.category = E.ConversionActionCategoryEnum[cat]
    a.status = E.ConversionActionStatusEnum.ENABLED
    a.primary_for_goal = primary
    a.counting_type = E.ConversionActionCountingTypeEnum.ONE_PER_CLICK
    a.click_through_lookback_window_days = 30
    a.value_settings.always_use_default_value = True
    a.value_settings.default_value = 0
    ops.append(op)
client.get_service("ConversionActionService").mutate_conversion_actions(customer_id=CID, operations=ops)

ga = client.get_service("GoogleAdsService")
q = "SELECT conversion_action.name, conversion_action.tag_snippets FROM conversion_action WHERE conversion_action.type = 'WEBPAGE'"
for r in ga.search(customer_id=CID, query=q):
    for s in r.conversion_action.tag_snippets:
        if s.type_.name == "WEBPAGE" and s.page_format.name == "HTML":
            import re
            sendto = re.search(r"'send_to': '([^']+)'", s.event_snippet)
            print(r.conversion_action.name, "→", sendto.group(1) if sendto else s.event_snippet[:200])
            break
