import { Client } from '@elastic/elasticsearch';
import * as fs from 'fs';
import { CA_FINGERPRINT, ELASTICSEARCH_PASSWORD, ELASTICSEARCH_URL } from '../constants';



// Elasticsearch Client with authentication and SSL (optional)
export const elasticClient = new Client({
    node: ELASTICSEARCH_URL,
    auth: {
        username: 'elastic',
        password: ELASTICSEARCH_PASSWORD,
    },
    tls: {
        ca: fs.readFileSync("/Users/jeevan/opensource/books-management/http_ca.crt"),  // Path to CA certificate if using SSL
        // fingerprint: CA_FINGERPRINT,  // CA fingerprint
        rejectUnauthorized: true,  // Ensure TLS validation
    },
});
