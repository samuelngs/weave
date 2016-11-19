
import Inferno from 'inferno';

const css = (o) => {
  let res = '';
  for (const ref in o) {
    if (res.length === 0) {
      res = `${ref}: ${o[ref]};`
    } else {
      res += ` ${ref}: ${o[ref]};`;
    }
  }
  return res;
}

export default function NotFound() {
  return <div style={styles.error}>
    <div style={styles.text}>
      <h1 style={styles.h1}>404</h1>
      <div style={styles.desc}>
        <h2 style={styles.h2}>This page could not be found.</h2>
      </div>
    </div>
  </div>
}

const styles = {
  error: css({
    color: '#000',
    background: '#fff',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    'font-family': "-apple-system, BlinkMacSystemFont, Roboto, 'Segoe UI', 'Fira Sans', Avenir, 'Helvetica Neue', 'Lucida Grande', sans-serif",
    'text-align': 'center',
    'padding-top': '20%'
  }),
  desc: css({
    display: 'inline-block',
    height: '49px',
    'text-align': 'left',
    'line-height': '49px',
    'vertical-align': 'middle'
  }),
  h1: css({
    display: 'inline-block',
    'border-right': '1px solid rgba(0, 0, 0,.3)',
    margin: 0,
    'margin-right': '20px',
    padding: '10px 23px',
    'font-size': '24px',
    'font-weight': 500,
    'vertical-align': 'top'
  }),
  h2: css({
    'font-size': '14px',
    'font-weight': 'normal',
    margin: 0,
    padding: 0
  }),
}
