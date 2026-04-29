import { useQuery } from 'react-query';
import { APP_VERSION } from '../constants/appVersion';
import { getAppConfig } from '../services/AppConfigService';

export const APP_CONFIG_QUERY_KEY = 'AppConfig';

export function useAppConfig() {
  return useQuery({
    queryKey: [APP_CONFIG_QUERY_KEY, APP_VERSION],
    queryFn: getAppConfig,
    // Keep short so DB / API changes show up without waiting 10+ minutes
    staleTime: 0,
    // Avoid showing a stale store line (e.g. old 2.2.0) after the API moves to 2.1.0.
    cacheTime: 0,
    refetchOnMount: true,
    refetchOnReconnect: true,
    retry: 2,
  });
}
