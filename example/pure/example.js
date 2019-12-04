import whale from './whale.jpeg?sizes=400w+400w.webp+800w+800w.webp+1x+2x&placeholder&webp';
// alternative syntax
import paris from './paris.jpeg?sizes[]=400w&sizes[]=800w&placeholder=trace';
import WEBPACKICON from '../../test/assets/webpack-icon.svg?placeholder';
import Icon from './image.svg?placeholder=trace';
console.log('TCL: Icon', Icon);

console.log('TCL: WEBPACKICON', WEBPACKICON);

console.log('IMAGE', whale);

console.log('TCL: paris', paris);

[whale, paris].forEach(src => {
  const image = new Image();
  image.srcset = src.srcSet;
  image.src = src.sources['800w'];
  image.sizes = '(min-width: 1000px) 800px, 400px';
  image.style = 'width: 100%';
  document.body.appendChild(image);
});

function addImage(src, srcSet) {
  const image = new Image();
  image.src = src;
  image.style = 'width: 100%';

  if (srcSet) {
    image.srcset = srcSet;
  }
  document.body.appendChild(image);
}
addImage(paris.placeholder.url);
addImage(Icon.image);
addImage(Icon.placeholder.url);
addImage(WEBPACKICON.placeholder.url);
addImage(WEBPACKICON.image);
Object.keys(WEBPACKICON.sources).forEach(srcKey =>
  addImage(WEBPACKICON.sources[srcKey])
);
