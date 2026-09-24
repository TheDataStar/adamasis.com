import { feed } from '../../lib/feed';
export const GET = (context: { site?: URL }) => feed(context, 'journal');
