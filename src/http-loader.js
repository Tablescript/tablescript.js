// Copyright 2017 Jamie Hale
//
// This file is part of Tablescript.js.
//
// Tablescript.js is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Tablescript.js is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Tablescript.js. If not, see <http://www.gnu.org/licenses/>.

import http from 'http';

export const loadHttpFile = async (context, filename) => {
  return new Promise((resolve, reject) => {
    try {
      http.get(filename, res => {
        const { statusCode } = res;
        if (statusCode !== 200) {
          res.resume();
          resolve(undefined);
        } else {
          res.setEncoding('utf8');
          let rawData = '';
          res.on('data', chunk => { rawData += chunk; });
          res.on('end', () => {
            resolve({ path: filename, body: rawData });
          });
        }
      }).on('error', e => {
        resolve(undefined);
      });
    } catch (e) {
      resolve(undefined);
    }
  });
};
