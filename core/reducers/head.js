
const defaults = {
  string: '',
  object: {},
  array : [],
};

export function title (state = defaults.string, action) {
  switch ( action.type ) {
    case 'WEAVE_TITLE_SET':
      return action.title || defaults.string;
    case 'WEAVE_TITLE_CLEAR':
      return defaults.string;
    default:
      return state;
  }
}

export function meta (state = defaults.array, action) {
  switch ( action.type ) {
    case 'WEAVE_META_ADD':
      const input = Array.isArray(action.metas) ? action.metas : [ action.metas ];
      const added = [ ...state ];
      for ( const meta of input ) {
        if ( typeof meta !== 'object' || meta === null ) {
          continue;
        }
        if ( Object.keys(meta).length === 0 ) {
          continue;
        }
        added.push(meta);
      }
      return added;
    case 'WEAVE_META_CLEAR':
      return defaults.array;
    case 'WEAVE_META_REPLACE':
      return Array.isArray(action.metas) ? action.metas : defaults.array;
    default:
      return state;
  }
}

export function link (state = defaults.array, action) {
  switch ( action.type ) {
    case 'WEAVE_LINK_ADD':
      const input = Array.isArray(action.links) ? action.links : [ action.links ];
      const added = [ ...state ];
      for ( const link of input ) {
        if ( typeof link !== 'object' || link === null ) {
          continue;
        }
        if ( Object.keys(link).length === 0 ) {
          continue;
        }
        added.push(link);
      }
      return added;
    case 'WEAVE_LINK_CLEAR':
      return defaults.array;
    case 'WEAVE_LINK_REPLACE':
      return Array.isArray(action.links) ? action.links : defaults.array;
    default:
      return state;
  }
}
