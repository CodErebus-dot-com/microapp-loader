import { LOCAL_ENV } from '../constants';

export function buildRemoteUrl(url: string) {
  // working env is localhost or the provided url is absolute
  if (LOCAL_ENV || url.startsWith('http') || url.startsWith('https')) {
    // working env is localhost but the provided url is not an absolute localhost url
    if (LOCAL_ENV && !url.includes('localhost')) {
      throw new Error(
        'Local environment detected. Please provide an absolute url to the remote entry file.',
      );
    }
    return url;
  }

  if (url.startsWith('/')) {
    url = url.slice(1);
  }
  return `${window.location.origin}/${url}`;
}
