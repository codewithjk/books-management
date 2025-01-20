import { Client } from '@elastic/elasticsearch';
import { ELASTICSEARCH_URL } from '../constants';


export const elasticClient = new Client({
    node: ELASTICSEARCH_URL,
});


