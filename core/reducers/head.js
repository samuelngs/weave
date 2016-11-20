
const defaults = {
  string: '',
  object: {},
  array : [],
};

export function title (state = defaults.string, action) {
  switch ( action.type ) {
    case 'WEAVE_TITLE_SET':
      return action.title || defaults.string;
    default:
      return state;
  }
}

export function meta (state = defaults.array, action) {
  switch ( action.type ) {
    case 'WEAVE_META_ADD':
      return [ ...state, ...(Array.isArray(action.metas) ? action.metas : defaults.array) ];
    case 'WEAVE_META_CLEAR':
      return defaults.array;
    case 'WEAVE_META_REPLACE':
      return Array.isArray(action.metas) ? action.metas : defaults.array;
    default:
      return state;
  }
}

