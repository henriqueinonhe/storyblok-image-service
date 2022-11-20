import { Xor } from "./utils";

export type ImageUrlOptions = {
  format?: "webp" | "jpeg" | "png";
  quality?: number;
  rotate?: 90 | 180 | 270;
  grayscale?: boolean;
  blur?: BlurParams;
  flip?: FlipParams;
  brightness?: number;
} & Xor<
  {
    resize?: ResizeParams;
  },
  {
    crop?: CropParams;
  }
>;

type BlurParams = {
  radius: number;
  sigma?: number;
};

type ResizeParams =
  | ({
      height: number;
      width: number;
    } & (
      | { fitIn?: false; fill?: never; focalPoint?: FocalPointParams }
      | { fitIn: true; fill?: string; focalPoint?: never }
    ))
  | {
      height: number;
      width?: number;
      fitIn?: never;
      fill?: never;
      focalPoint?: never;
    }
  | {
      height?: number;
      width: number;
      fitIn?: never;
      fill?: never;
      focalPoint?: never;
    };

type CropParams = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

type FocalPointParams =
  | "smart"
  | {
      left: number;
      top: number;
      right: number;
      bottom: number;
    };

type FlipParams =
  | {
      horizontal: boolean;
      vertical: boolean;
    }
  | {
      horizontal?: boolean;
      vertical: boolean;
    }
  | {
      horizontal: boolean;
      vertical?: boolean;
    };

export function imageUrl(
  originalImageUrl: string,
  options?: ImageUrlOptions
): string;
export function imageUrl(
  imageComponent: StoryblokImageComponent,
  options?: ImageUrlOptions
): string;
export function imageUrl(
  input: string | StoryblokImageComponent,
  options: ImageUrlOptions = {}
) {
  const {
    blur,
    brightness,
    flip,
    format,
    grayscale,
    quality,
    resize,
    rotate,
    crop,
  } = options;

  // Non Filters
  const mandatoryParam = `m`;
  const fitInParam = resize?.fitIn !== undefined && "fit-in";
  const resizeAndFlipParam = buildResizeAndFlipParams(resize, flip);
  const cropParam =
    crop !== undefined &&
    `${crop.left}x${crop.top}:${crop.right}x${crop.bottom}`;
  const smartParam = resize?.focalPoint === "smart" && "smart";

  const nonFiltersParams = [
    mandatoryParam,
    fitInParam,
    resizeAndFlipParam,
    cropParam,
    smartParam,
  ]
    .filter(Boolean)
    .join("/");

  // Filters
  const fillParam = resize?.fill !== undefined && `fill(${resize.fill})`;
  const formatParam = format !== undefined && `format(${format})`;
  const qualityParam = quality !== undefined && `quality(${quality})`;
  const focalPointParam =
    resize !== undefined &&
    typeof resize.focalPoint === "object" &&
    `focal(${resize.focalPoint.left}x${resize.focalPoint.top}:${resize.focalPoint.right}x${resize.focalPoint.bottom})`;
  const grayscaleParam = grayscale && `grayscale()`;
  const blurParam =
    blur !== undefined &&
    `blur(${[blur.radius, blur.sigma].filter(Boolean).join(",")})`;
  const rotateParam = rotate !== undefined && `rotate(${rotate})`;
  const brightnessParam =
    brightness !== undefined && `brightness(${brightness})`;

  const filterParamsArray = [
    fillParam,
    formatParam,
    qualityParam,
    focalPointParam,
    grayscaleParam,
    blurParam,
    rotateParam,
    brightnessParam,
  ].filter(Boolean);
  const filterParams =
    filterParamsArray.length !== 0
      ? "filters:" + filterParamsArray.join(":")
      : "";

  const originalImageUrl = typeof input === "string" ? input : input.filename;

  return `${originalImageUrl}/${nonFiltersParams}/${filterParams}`;
}

const buildResizeAndFlipParams = (
  resize: ResizeParams | undefined,
  flip: FlipParams | undefined
) => {
  if (flip === undefined && resize === undefined) {
    return false;
  }

  return `${flip?.horizontal ? "-" : ""}${resize?.width ?? 0}x${
    flip?.vertical ? "-" : ""
  }${resize?.height ?? 0}`;
};

export type StoryblokImageComponent = {
  filename: string;
};

imageUrl("asdasdasd", {
  resize: {
    height: 100,
  },
});
