import { plainToClass } from 'class-transformer';
import { NotFoundError } from 'routing-controllers';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { CreationNewsRequest } from '../controllers/requests/CreationNewsRequest';
import { NewsResponse } from '../controllers/responses/NewsResponse';
import { News } from '../models/News';
import { NewsRepository } from '../repositories/NewsRepository';

@Service()
export class NewsService {

    public constructor(
        @OrmRepository() private newsRepository: NewsRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public async createNews(body: CreationNewsRequest): Promise<NewsResponse> {
        this.log.info('NewsService:createNews', { body });
        const newNews = new News();
        // newNews.banner = body.name;
        newNews.description = body.description;
        newNews.title = body.title;
        newNews.date = body.date;
        const savedNews = await this.newsRepository.save(newNews);
        this.log.info('NewsService:createNews:created', { hackId: savedNews.id });
        return plainToClass<NewsResponse, News>(
            NewsResponse,
            await this.newsRepository.findOne(savedNews.id),
            { excludeExtraneousValues: true }
        );
    }

    public async uploadFile(newsId: number, files: any[]): Promise<boolean> {
        this.log.info('NewsService:uploadFile', { files: files?.['image'][0], newsId });
        const news = await this.newsRepository.findOne(newsId);
        if (!news) {
            throw new NotFoundError();
        }
        await this.newsRepository.update(news.id, { banner: files?.['image'][0].filename});
        return true;
    }

    public async getNews(): Promise<NewsResponse[]> {
        this.log.info('HackatonService:getNews');
        const news = await this.newsRepository.find();
        return plainToClass<NewsResponse, News>(
            NewsResponse,
            news,
            { excludeExtraneousValues: true }
        );
    }

}
