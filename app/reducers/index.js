
function counter(state = 0, action) {
  switch (action.type) {
  case 'INCREMENT':
    return state + 1
  }
  return state
}

export default {
  counter,
};
