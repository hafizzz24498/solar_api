import { CommonFilter } from 'src/shared/common-filter';

export class MaintainanceFilter extends CommonFilter {
  status?: string;
  priority?: string;
}
