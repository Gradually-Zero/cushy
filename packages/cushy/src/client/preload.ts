import routes from '@generated/routes';

export default function preload(pathname: string): Promise<void[]> {
  console.log('routes', routes);
  const matches = Array.from(new Set([pathname, decodeURI(pathname)]));

  return Promise.all([]);
}
