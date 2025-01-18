import { elasticClient } from '../config/elasticsearch';

export const indexBook = async (id: string, bookData: any) => {
    await elasticClient.index({
        index: 'books',
        id,
        document: bookData,
    });
};

export const updateBookIndex = async (id: string, bookData: any) => {
    await elasticClient.update({
        index: 'books',
        id,
        doc: bookData,
    });
};

export const deleteBookIndex = async (id: string) => {
    await elasticClient.delete({
        index: 'books',
        id,
    });
};

export const searchBooks = async (query: string) => {
    const result = await elasticClient.search({
        index: 'books',
        query: {
            multi_match: {
                query,
                fields: ['title', 'author', 'description'],
            },
        },
    });
    return result.hits.hits.map((hit: any) => hit._source);
};
