
import path from 'path';
import express from './express';

import root from 'application';

const { app, port } = express(root, path.join(__dirname, 'build'));

app.listen(port, () => {
  console.log('Server running on port ' + port);
});
