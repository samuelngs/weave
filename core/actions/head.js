
export function setTitle(title) {
  return { type: 'WEAVE_TITLE_SET', title }
}

export function clearTitle() {
  return { type: 'WEAVE_TITLE_CLEAR' }
}

export function addMeta(meta = { }) {
  return { type: 'WEAVE_META_ADD', metas: [ meta ] }
}

export function addMetas(metas = [ ]) {
  return { type: 'WEAVE_META_ADD', metas }
}

export function replaceMetas(metas = [ ]) {
  return { type: 'WEAVE_META_REPLACE', metas }
}

export function clearMetas() {
  return { type: 'WEAVE_META_CLEAR' }
}

export function addLink(link = { }) {
  return { type: 'WEAVE_LINK_ADD', links: [ link ] }
}

export function addLinks(links = [ ]) {
  return { type: 'WEAVE_LINK_ADD', links }
}

export function replaceLinks(links = [ ]) {
  return { type: 'WEAVE_LINK_REPLACE', links }
}

export function clearLinks() {
  return { type: 'WEAVE_LINK_CLEAR' }
}
