import 'reflect-metadata';

import { inject, injectable } from 'inversify';
import { z } from 'zod/v4';

import { getContainer } from '@/container';
import { TYPES } from '@/container/types';

import { HttpClientError } from '../../http';
import { RestService } from '../service';

const baseURL = 'https://jsonplaceholder.typicode.com';

@injectable()
class TestRestService {
    public instance: RestService;
    constructor(
        @inject(TYPES['Factory<RestService>']) restServiceFactory: (baseURL: string) => RestService,
    ) {
        this.instance = restServiceFactory(baseURL);
    }
}

const schema = z.object({
    id: z.number(),
    title: z.string(),
    body: z.string(),
    userId: z.number(),
});

const failedSchema = z.object({
    id: z.string(),
    title: z.number(),
    body: z.number(),
    userId: z.string(),
});

type Post = z.infer<typeof schema>;
type FailedPost = z.infer<typeof failedSchema>;

const getTestRestService = () => {
    return getContainer().get(TestRestService);
};

describe('RestService', () => {
    const service = getTestRestService();

    it('should construct HttpService with the provided baseURL', () => {
        expect(service.instance.baseURL).toBe(baseURL);
    });

    it('should call HttpService.request with method GET once', async () => {
        const success = await service.instance.get<Post>({
            url: '/posts/1',
            guards: {
                isResult: (arg) => schema.parse(arg),
            },
        });

        expect(success.statusText).toBe('OK');

        expect(success.response).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                title: expect.any(String),
                body: expect.any(String),
                userId: expect.any(Number),
            }),
        );

        await service.instance
            .get<FailedPost>({
                url: '/posts/1',
                guards: {
                    isResult: (arg) => failedSchema.parse(arg),
                },
            })
            .catch((error) => {
                expect(error).toBeInstanceOf(HttpClientError);
            });
    });

    it('should call HttpService.request with method GET many', async () => {
        const { response, statusText } = await service.instance.get<Post[]>({
            url: '/posts',
            guards: {
                isResult: (arg) => z.array(schema).parse(arg),
            },
        });

        expect(statusText).toBe('OK');

        expect(response).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    title: expect.any(String),
                    body: expect.any(String),
                    userId: expect.any(Number),
                }),
            ]),
        );

        await service.instance
            .get<FailedPost[]>({
                url: '/posts/1',
                guards: {
                    isResult: (arg) => z.array(failedSchema).parse(arg),
                },
            })
            .catch((error) => {
                expect(error).toBeInstanceOf(HttpClientError);
            });
    });

    it('should call HttpService.request with method POST once', async () => {
        const payload: Omit<Post, 'id'> = {
            title: 'x',
            body: 'z',
            userId: 1,
        };

        const { response, statusText } = await service.instance.post<
            Post,
            unknown,
            Omit<Post, 'id'>
        >({
            url: '/posts',
            payload,
            guards: {
                isResult: (arg) => schema.parse(arg),
                isPayload: (arg) => schema.omit({ id: true }).parse(arg),
            },
        });

        expect(statusText).toBe('Created');

        expect(response).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                ...payload,
            }),
        );

        await service.instance
            .get<FailedPost>({
                url: '/posts/1',
                guards: {
                    isResult: (arg) => failedSchema.parse(arg),
                    isPayload: (arg) => failedSchema.omit({ id: true }).parse(arg),
                },
            })
            .catch((error) => {
                expect(error).toBeInstanceOf(HttpClientError);
            });
    });

    it('should call HttpService.request with method PUT once', async () => {
        const payload: Post = {
            id: 1,
            title: 'x',
            body: 'z',
            userId: 1,
        };

        const { response, statusText } = await service.instance.put<Post, unknown, Post>({
            url: '/posts/1',
            payload,
            guards: {
                isResult: (arg) => schema.parse(arg),
                isPayload: (arg) => schema.parse(arg),
            },
        });

        expect(statusText).toBe('OK');

        expect(response).toEqual(expect.objectContaining(payload));

        await service.instance
            .get<FailedPost>({
                url: '/posts/1',
                guards: {
                    isResult: (arg) => failedSchema.parse(arg),
                    isPayload: (arg) => failedSchema.omit({ id: true }).parse(arg),
                },
            })
            .catch((error) => {
                expect(error).toBeInstanceOf(HttpClientError);
            });
    });

    it('should call HttpService.request with method PATCH once', async () => {
        const payload: Partial<Omit<Post, 'id'>> = {
            title: 'x',
        };

        const { response, statusText } = await service.instance.put<
            Pick<Post, 'id' | 'title'>,
            unknown,
            Partial<Omit<Post, 'id'>>
        >({
            url: '/posts/1',
            payload,
            guards: {
                isResult: (arg) => schema.pick({ title: true, id: true }).parse(arg),
                isPayload: (arg) => schema.pick({ title: true }).parse(arg),
            },
        });

        expect(statusText).toBe('OK');

        expect(response).toEqual(expect.objectContaining(payload));

        await service.instance
            .get<FailedPost>({
                url: '/posts/1',
                guards: {
                    isResult: (arg) => failedSchema.parse(arg),
                    isPayload: (arg) => failedSchema.pick({ title: true }).parse(arg),
                },
            })
            .catch((error) => {
                expect(error).toBeInstanceOf(HttpClientError);
            });
    });

    it('should call HttpService.request with method DELETE once', async () => {
        const { statusText } = await service.instance.delete({
            url: '/posts/1',
        });

        expect(statusText).toBe('OK');
    });
});
