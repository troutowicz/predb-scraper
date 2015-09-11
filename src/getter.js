import request from 'request';

import parse from './parser';

export default function getter(args) {
  const defaultOptions = {
    url: 'http://predb.me',
    headers:  {
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1'
    },
  };

  const options = {
    ...defaultOptions,
    headers: { 'User-Agent': args.userAgent },
  };

  return {
    get(qs, cb) {
      request({ ...options, qs }, (err, resp, body) => {
        if (err) {
          return cb(err);
        }

        return cb(null, parse(body));
      });
    },
  }
}
