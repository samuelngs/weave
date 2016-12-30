
const defaults = {
  string: '',
  object: {},
  array : [],
};

export function pathname (state = defaults.string, action) {
  switch ( action.type ) {
    case 'WEAVE_LOCATION_SET':
      return action.pathname || defaults.string;
    case 'WEAVE_LOCATION_CLEAR':
      return defaults.string;
    default:
      return state;
  }
}

