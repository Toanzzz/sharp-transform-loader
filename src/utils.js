import sharp from 'sharp';
import svgToMiniDataURI from 'mini-svg-data-uri';
import SVGO from 'svgo';
import potrace from 'potrace';
import { promisify } from 'util';
import { async } from 'q';

export async function resizeImage(content, toWidth, toHeight) {
  const multiplierReq = new RegExp(/\dx{1}$/g);
  const imageMetadata = await sharp(content).metadata();
  const width = multiplierReq.test(toWidth)
    ? imageMetadata.width * parseInt(toWidth, 10)
    : parseInt(toWidth, 10);

  return sharp(content)
    .resize(width, toHeight)
    .toBuffer();
}

export function toWebp(content) {
  return sharp(content)
    .webp({ nearLossless: true })
    .toBuffer();
}

export async function toPlaceholder(content) {
  const imageMetadata = await sharp(content).metadata();
  const buffer = await sharp(content)
    .resize(20)
    .blur()
    .toBuffer();
  const url = `data:image/${imageMetadata.format};base64,${buffer.toString(
    'base64'
  )}`;
  const aspectRatio = imageMetadata.width / imageMetadata.height;

  return {
    url,
    aspectRatio
  };
}

export async function getTracedSvgPlaceholder(content) {
  const imageMetadata = await sharp(content).metadata();

  const url =
    imageMetadata.format === 'svg'
      ? await getGrayscaleSVG(content)
      : await getTraceSVG(content);
  return {
    url
  };
}

const defaultArgs = {
  color: `lightgray`,
  optTolerance: 0.4,
  turdSize: 100,
  turnPolicy: potrace.Potrace.TURNPOLICY_MAJORITY
};

const optimizeSvg = svg => {
  const svgo = new SVGO({ multipass: true, floatPrecision: 0 });
  return svgo.optimize(svg).then(({ data }) => data);
};

const encodeSpaces = str => str.replace(/ /gi, `%20`);

async function getTraceSVG(resourcePath, options = defaultArgs) {
  const trace = promisify(potrace.trace);

  return trace(resourcePath, options)
    .then(optimizeSvg)
    .then(svgToMiniDataURI)
    .then(encodeSpaces);
}

async function getGrayscaleSVG(resourcePath) {
  const buffer = await sharp(resourcePath)
    .gamma()
    .grayscale()
    .toBuffer();
  return `data:image/svg;base64,${buffer.toString('base64')}`;
}
