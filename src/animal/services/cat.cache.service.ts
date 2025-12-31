import { Cat } from 'src/animal/interfaces/cat.interface';
import { CacheService } from '../../services/cache.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CatCacheService extends CacheService<Cat> {}
