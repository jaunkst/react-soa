import Axios from 'axios-observable';
import { BusinessStore, BusinessStoreState } from './business.store';
import { tap as rxTap } from 'rxjs/operators';
import { Service } from '@libs/frontend/utils';
import { ID } from '@datorama/akita';
import { merge, clone, without } from 'ramda';

@Service()
export class BusinessService {
  constructor(private businessStore: BusinessStore) {}

  public fetch() {
    this.businessStore.setLoading(true);
    return Axios.get('/api/businesses')
      .pipe(
        rxTap((response) => {
          if (response.status === 200) {
            this.businessStore.set(response.data);
          }
          this.businessStore.setLoading(false);
        })
      )
      .subscribe();
  }
}
