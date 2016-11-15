
export default function Index(props) {
  return <div>{ props.message }</div>
}

Index.getInitialProps = async function() {
  return { message: 'Welcome to Weave!' };
}
