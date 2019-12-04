import { getTracedSvgPlaceholder } from './utils';

module.exports = function traceSvgLoader(content) {
  if (this.cacheable) {
    this.cacheable();
  }

  const callback = this.async();

  getTracedSvgPlaceholder(content)
    .then(placeholder => {
      callback(null, `module.exports = ${JSON.stringify(placeholder)}`);
    })
    .catch(err => {
      callback(err);
    });
};

module.exports.raw = true;
