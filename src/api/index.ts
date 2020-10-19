import dotenv from 'dotenv';

dotenv.config();

import api from './api';

(function(): void {
  const port = process.env.PORT || '8080';

  api.listen(port, () => {
    console.log(`Listening on port ${ port }.`);
  });
})();
