import { isIPv6 } from './is-ipv6';

export function formatHostname(hostname: string): string {
  return isIPv6(hostname) ? `[${hostname}]` : hostname;
}
