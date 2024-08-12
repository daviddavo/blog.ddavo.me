#!/usr/bin/env python
import os
import json
import datetime as dt

import pandas as pd
from dune_client.client import DuneClient

dune = DuneClient.from_env()
general_data = {'last-update': dt.datetime.now().isoformat()}

############################################################
# Obtener la distribución de sellos para el donut
############################################################
df: pd.DataFrame = dune.get_latest_result_dataframe(3917785).sort_values('eachCnt')
print("Got", len(df), "different holders numbers")
df.to_csv('data/holders.csv', index=False)

whale = df.loc[df[df['to'].str.startswith('0x')]['cnt'].idxmax()]
general_data['holders-whale-address'] = whale['to']
general_data['holders-whale-cnt'] = int(whale['cnt'])

_df = df[df['eachCnt'] <= 2]
general_data['holder-oneortwo-tokens-cnt'] = int((_df['cnt']).sum())
general_data['holder-oneortwo-holders-cnt'] = int((_df['cnt'] / _df['eachCnt']).sum())

############################################################
# Obtener datos genéricos
############################################################
query_result = dune.get_latest_result_dataframe(3918430).iloc[0]
general_data['total-tokens'] = int(query_result['total'])
general_data['total-holders'] = int(query_result['holders'])
general_data['last-mint'] = query_result['last_mint']
general_data['first-mint'] = query_result['first_mint']
# general_data['daily-avg'] = query_result['Avg. day since start']
general_data['daily-avg'] = float(query_result['Avg. day to last mint'])

############################################################
# Obtener cuantos usuarios tenían antes NFTs
############################################################
df = dune.get_latest_result_dataframe(3946509)
withnft = df[df['exists_prev_nft'] == 1]
general_data['holders-had-nfts-avg'] = withnft['cnt'].sum() / df['cnt'].sum()

############################################################
# Obtener cuantos usuarios tenían antes NFTs
############################################################
df = dune.get_latest_result_dataframe(3917833)
df.to_csv("data/daily-mints.csv", index=False)
print("Got", len(df), "days of mints")

with open('data/general-data.json', 'w') as f:
    json.dump(general_data, f, indent=2)
