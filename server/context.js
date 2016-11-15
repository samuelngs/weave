
import uaparser from 'ua-parser-js';

const types = {
  string: '',
  object: {},
  array : [],
  number: 0,
  bool  : false,
  func  : () => {},
};

async function languages(header = types.string) {
  const res = [];
  const opt = header.split(',');
  for (const i of opt) {
    if (i.indexOf('=') === -1) res.push(i);
  }
  return res;
}

async function cookies() {
  const cookies = (document.cookie || types.string).split(', ');
  const res = { };
  for (let i = 0; i < cookies.length; i++) {
    const cur = cookies[i].split('=');
    res[cur[0]] = cur[1] || types.string;
  }
  return res;
}

async function headers() {
  return fetch('/ctx').then(res => res.json()).catch(_ => types.object);
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
      credentials: types.object,
      doNotTrack: req.headers['dnt'],
      geolocation: types.object,
      hardwareConcurrency: types.number,
      language: lang[0],
      languages: lang,
      maxTouchPoints: types.number,
      mediaDevices: types.object,
      mimeTypes: types.array,
      onLine: true,
      permissions: types.array,
      platform: `${ua.os.name} ${ua.os.version}`,
      plugins: types.array,
      presentation: types.object,
      product: types.string,
      productSub: types.string,
      userAgent: ua.ua,
      vendor: types.string,
      vendorSub: types.string,
    },
    location: {
      ancestorOrigins: types.array,
      assign: (path) => res.location(path),
      hash: types.string,
      host: `${req.hostname}:${req.socket.localPort}`,
      hostname: req.hostname || types.string,
      href: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
      origin: req.get('origin') || types.string,
      pathname: req.originalUrl || types.string,
      port: req.socket.localPort,
      protocol: `${req.protocol}:`,
      reload: () => res.location(req.path),
      replace: (path) => res.location(path),
      search: '',
    },
    document: {
      cookie: req.headers.cookie || types.string,
    },
    cookies: {
      ...req.cookies,
      ...req.signedCookies,
    },
    headers: {
      cookie: req.headers.cookie || types.string,
      ...req.headers,
    },
  };
}

export async function client() {
  return {
    navigator,
    location,
    document: {
      cookie: document.cookie || object.string,
    },
    cookies: await cookies(),
    headers: {
      cookie: document.cookie || object.string,
      ...await headers(),
    },
  };
}

export default async function context(...args) {
  if (__NODESERVER__) {
    return server(...args);
  }
  return client(...args);
}
