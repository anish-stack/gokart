import { useQuery } from '@tanstack/react-query';
import { trackShipment } from '../api/tracking';
import { useAppStore } from '../store/useAppStore';

export function useTrackShipment(awb, options = {}) {
  const deviceId = useAppStore((s) => s.deviceId);

  return useQuery({
    queryKey: ['tracking', awb],
    queryFn: () => trackShipment(awb, deviceId),
    enabled: !!awb && (options.enabled ?? true),
    retry: 0,
    staleTime: 30 * 1000,
  });
}
