const https = require('https');

const request = (url) => {
  return new Promise((res, rej) => {
    https.get(url, (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        res(data);
      });

    }).on("error", (err) => {
      rej(err);
    });
  })
};


const getData = (sol = 0) => {
  const url = `https://api.maas2.apollorion.com/${sol || ''}`;

  return request(url).then(res => JSON.parse(res));
}

const getConsole = (res) => console.log(`Sol #${res.sol}: ${res.min_temp}..${res.max_temp} C`);

const getTempInfo = () => {
  getData().then(res => {
    const list = [];
    let prev = res.sol;

    getConsole(res);

    for (let sol = 0; sol < 5; sol++) {
      const count = res.sol - sol

      if (count <= 0) return

      getData(count).then(res => {
        if (prev === res.sol + 1) {
          prev = res.sol;
          getConsole(res);
        } else {
          list.push(res);
        }

        return list
      }).then((item) => {
        item.forEach(elem => {
          if (prev === elem.sol + 1) {
            prev = elem.sol;
            getConsole(elem);
          }
        })
      })
    }
  })
}

getTempInfo()
