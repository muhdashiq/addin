import type { Business, BusinessId } from '../../content/types';

export type DeployStatus = 'idle' | 'deploying' | 'live';

export interface ShopState {
  businessId: BusinessId;
  customName: string;
  status: DeployStatus;
  stepIndex: number;
}

export type ShopAction =
  | { type: 'selectBusiness'; id: BusinessId }
  | { type: 'setName'; name: string }
  | { type: 'startDeploy' }
  | { type: 'advanceStep' }
  | { type: 'finishDeploy' }
  | { type: 'reset' };

export const MAX_NAME_LENGTH = 32;

export const initialShopState = (businessId: BusinessId): ShopState => ({
  businessId,
  customName: '',
  status: 'idle',
  stepIndex: 0,
});

export function shopReducer(state: ShopState, action: ShopAction): ShopState {
  switch (action.type) {
    case 'selectBusiness':
      return { ...state, businessId: action.id, status: 'idle', stepIndex: 0 };
    case 'setName':
      return {
        ...state,
        customName: action.name.slice(0, MAX_NAME_LENGTH),
        status: 'idle',
        stepIndex: 0,
      };
    case 'startDeploy':
      return state.status === 'deploying' ? state : { ...state, status: 'deploying', stepIndex: 0 };
    case 'advanceStep':
      return { ...state, stepIndex: state.stepIndex + 1 };
    case 'finishDeploy':
      return { ...state, status: 'live' };
    case 'reset':
      return { ...state, customName: '', status: 'idle', stepIndex: 0 };
  }
}

export function displayName(state: ShopState, business: Business): string {
  return state.customName.trim() || business.sampleName;
}

/** Turns a shop name into the mock address. Names with no latin letters use the fallback. */
export function toSlug(name: string, fallback: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || fallback;
}
