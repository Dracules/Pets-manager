import { Cat } from 'src/interfaces/cat.interface';
import { CacheService } from './cache.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CatCacheService extends CacheService<Cat> {}
