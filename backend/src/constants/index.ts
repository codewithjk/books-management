import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3000;

export const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL || 'https://localhost:9200';
export const ELASTICSEARCH_PASSWORD = process.env.ELASTIC_PASSWORD || "";
export const CA_FINGERPRINT = process.env.ELASTIC_CA_FINGERPRINT || "";
