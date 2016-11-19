
import uaparser from 'ua-parser-js';

const defaults = {
  string: '',
  object: {},
  array : [],
  number: 0,
  bool  : false,
  func  : () => {},
};

async function languages(header = defaults.string) {
  const res = [];
  const opt = header.split(',');
  for (const i of opt) {
    if (i.indexOf('=') === -1) res.push(i);
  }
  return res;
}

async function cookies() {
  const cookies = (document.cookie || defaults.string).split(', ');
  const res = { };
  for (let i = 0; i < cookies.length; i++) {
    const cur = cookies[i].split('=');
    res[cur[0]] = cur[1] || defaults.string;
  }
  return res;
}

async function headers() {
  return fetch('/ctx').then(res => res.json()).catch(_ => defaults.object);
}

export async function server(req, res) {
  const ua = uaparser(req.headers['user-agent']);
  const lang = await languages(req.headers['accept-language']);
  return {
    navigator: {
      appCodeName: ua.browser.name,
      appName: ua.browser.name,
      appVersion: ua.browser.version,
      cookieEnabled: typeof req.cookies === 'object' && req.cookies !== null,
      credentials: defaults.object,
      doNotTrack: req.headers['dnt'],
      geolocation: defaults.object,
      hardwareConcurrency: defaults.number,
      language: lang[0],
      languages: lang,
      maxTouchPoints: defaults.number,
      mediaDevices: defaults.object,
      mimeTypes: defaults.array,
      onLine: true,
      permissions: defaults.array,
      platform: `${ua.os.name} ${ua.os.version}`,
      plugins: defaults.array,
      presentation: defaults.object,
      product: defaults.string,
      productSub: defaults.string,
      userAgent: ua.ua,
      vendor: defaults.string,
      vendorSub: defaults.string,
    },
    location: {
      ancestorOrigins: defaults.array,
      assign: (path) => res.location(path),
      hash: defaults.string,
      host: `${req.hostname}:${req.socket.localPort}`,
      hostname: req.hostname || defaults.string,
      href: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
      origin: req.get('origin') || defaults.string,
      pathname: req.originalUrl || defaults.string,
      port: req.socket.localPort,
      protocol: `${req.protocol}:`,
      reload: () => res.location(req.path),
      replace: (path) => res.location(path),
      search: '',
    },
    document: {
      cookie: req.headers.cookie || defaults.string,
    },
    cookies: {
      ...req.cookies,
      ...req.signedCookies,
    },
    headers: {
      cookie: req.headers.cookie || defaults.string,
      ...req.headers,
    },
  };
}

export async function client() {
  return {
    navigator,
    location,
    document: {
      cookie: document.cookie || defaults.string,
    },
    cookies: await cookies(),
    headers: {
      cookie: document.cookie || defaults.string,
      ...await headers(),
    },
  };
}

export default async function context(...args) {
  if (typeof window === 'undefined') {
    return server(...args);
  }
  return client(...args);
}
