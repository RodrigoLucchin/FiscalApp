import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://192.168.0.25:8000';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NDc0NTA4MDAsImV4cCI6MTkwNTIxNzIwMH0.m9f4gZpow9CRtTxp_9tpOLJB3c_J8ybxhW6tRiwpJJ8';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Mapeamento de localizações para tabelas do Supabase
export const locationTableMap: Record<string, string> = {
  "NW Matriz": "omie_matriz_nfe",
  "NW ES": "omie_es_nfe",
  "NW MG": "omie_mg_nfe",
  "NW PA": "omie_pa_nfe",
  "NW RJ": "omie_rj_nfe",
  "NW RS": "omie_rs_nfe",
  "NW SC": "omie_sc_nfe",
  "NW SE": "omie_se_nfe",
  "NW SP": "omie_sp_nfe",
};

export interface NFeData {
  id: string;
  nfe_n: string;
  razao_dest: string;
  nfe_emi_date: string;
  nfe_pdf: string;
  nfe_key: string;
}
