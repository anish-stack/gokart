import { useQuery } from '@tanstack/react-query';
import { fetchContactByPincode } from '../api/contact';

export function useContactByPincode(pincode, extra = {}) {
  return useQuery({
    queryKey: ['contact-area', pincode],
    queryFn: () => fetchContactByPincode(pincode, extra),
    enabled: !!pincode && pincode.length >= 3,
    retry: 0,
  });
}
