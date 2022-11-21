import { Xor } from "./utils";

export type ImageUrlParameters = {
  /**
   * Force a specific image format.
   * Supported formats are "webp", "jpeg" and "png".
   *
   * If not set, Storyblok Image Service will detect
   * whether the user's browser has support to WebP,
   * and then either send the image in WebP or fallback
   * to JPG.
   */
  format?: "webp" | "jpeg" | "png";

  /**
   * Request a specific image quality.
   *
   * Ranges from 0 to 100.
   *
   * Defaults to 100.
   */
  quality?: number;

  /**
   * Rotates image counter clockwise by a given angle
   * in degrees.
   *
   * Supported values are integer (negative included) multiples of 90deg.
   * E.g. ... -270, -180, -90, 0, 90, 180, 270 ...
   *
   * Defaults to 0deg (no rotation).
   */
  rotate?: number;

  /**
   * Displays image in black and white.
   *
   * Defaults to false.
   */
  grayscale?: boolean;

  /**
   * Blurs image.
   *
   * Defaults to no blur.
   */
  blur?: BlurParams;

  /**
   * Flips image vertically, horizontally,
   * or both.
   *
   * Defaults to no flip.
   */
  flip?: FlipParams;

  /**
   * Sets the image's brightness.
   *
   * Ranges from -100 to 100.
   *
   * Defaults to 0.
   */
  brightness?: number;
} & Xor<
  {
    /**
     * Resizes the image by defining either its new height,
     * width, or both.
     *
     * When setting only the height or only the width, the unset
     * dimension will be adjusted accordingly so that no cropping
     * occurs.
     *
     * When setting both width and height, it's possible (and likely)
     * that the image has to be cropped to maintain the image's
     * aspect ratio, which opens up some other possibilities,
     * like making the image 'fit-in' or defining a focal point.
     *
     * When making an image 'fit-in' we resize the image
     * without cropping, while padding any "blank" space that might
     * result from the resizing so that the
     * resized image + padding reaches the desired dimensions.
     */
    resize?: ResizeParams;
  },
  {
    /**
     * Crops image by defining a rectangle
     * that will be used to do the cropping.
     *
     * The rectangle is defined through two points,
     * the top-left and the bottom-right.
     *
     * Coordinates (0, 0) correspond to the image's
     * top-left corner, and they increase from
     * top to bottom and from left to right.
     *
     * Cropping is a form of resizing the image,
     * therefore it's not possible to use 'crop'
     * and 'resize' params at the same time.
     * They are mutually exclusive, so if you use one,
     * you cannot use the other and vice versa.
     */
    crop?: CropParams;
  }
>;

type BlurParams = {
  /**
   * An int value between 0 and 150.
   * The higher the number, the more blurred the image will be.
   */
  radius: number;

  /**
   * Defaults to the same value as the radius.
   * Sigma is used in the gaussian function for blurring.
   */
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
  /**
   * Crop rectangle's left-top point
   * X coordinate.
   */
  left: number;

  /**
   * Crop rectangle's left-top point
   * Y coordinate.
   */
  top: number;

  /**
   * Crop rectangle's left-top point
   * X coordinate.
   */
  right: number;

  /**
   * Crop rectangle's left-top point
   * Y coordinate.
   */
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

export type ImageUrlOptions = {
  onError?: (errors: Array<string>) => void;
};

type StoryblokImageComponent = {
  filename: string;
};

/**
 * Builds url to be used with Storyblok Image Service.
 *
 * @param input Either the original image URL or a
 * Storyblok Asset component that is being used to
 * serve an image.
 * @param options Options to process the image
 */
export function imageUrl(
  originalImageUrl: string,
  parameters?: ImageUrlParameters,
  options?: ImageUrlOptions
): string;
export function imageUrl(
  imageComponent: StoryblokImageComponent,
  parameters?: ImageUrlParameters,
  options?: ImageUrlOptions
): string;
export function imageUrl(
  input: string | StoryblokImageComponent,
  parameters: ImageUrlParameters = {},
  options: ImageUrlOptions = {}
) {
  const { onError } = options;
  const errors = validateParameters(parameters);

  errors.forEach(console.error);
  onError?.(errors);

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
  } = parameters;

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

const validateParameters = (options: ImageUrlParameters) => {
  const { quality, rotate, brightness, blur, resize, crop } = options;

  const errors: Array<string> = [];

  if (quality !== undefined) {
    if (!Number.isInteger(quality) || quality < 0 || quality > 100) {
      errors.push(
        `When defined, 'quality' is expected to be a positive integer less than or equal 100, but received ${quality} instead.`
      );
    }
  }

  if (rotate !== undefined) {
    if (!Number.isInteger(rotate) || rotate % 90 !== 0) {
      errors.push(
        `When defined, 'rotate' is expected to be an integer (negative included) multiple of 90, but received ${rotate} instead.`
      );
    }
  }

  if (brightness !== undefined) {
    if (
      !Number.isInteger(brightness) ||
      brightness < -100 ||
      brightness > 100
    ) {
      errors.push(
        `When defined, 'brightness' is expected to be an integer ranging from -100 to 100 (inclusive), but received ${brightness} instead.`
      );
    }
  }

  if (blur !== undefined) {
    const { radius, sigma } = blur;
    if (!Number.isInteger(radius) || radius < 0 || radius > 150) {
      errors.push(
        `When defined, 'blur.radius' is expected to be an integer ranging from 0 to 150 (inclusive), but received ${radius} instead.`
      );
    }

    if (sigma !== undefined) {
      if (!Number.isInteger(sigma) || sigma < 0 || sigma > 150)
        errors.push(
          `When defined, 'blur.sigma' is expected to be an integer ranging from 0 to 150 (inclusive), but received ${sigma} instead.`
        );
    }
  }

  if (resize !== undefined) {
    const { height, width, fill, focalPoint } = resize;

    if (height !== undefined) {
      if (!Number.isInteger(height) || height < 0) {
        errors.push(`When defined, 'resize.height' is expected to be a positive integer, but received ${height} instead.
        If you passed a negative number to flip the image, use the 'flip' parameter instead.`);
      }
    }

    if (width !== undefined) {
      if (!Number.isInteger(width) || width < 0) {
        errors.push(`When defined, 'resize.width' is expected to be a positive integer, but received ${width} instead.
        If you passed a negative number to flip the image, use the 'flip' parameter instead.`);
      }
    }

    if (height !== undefined && width !== undefined) {
      if (fill !== undefined) {
        if (!/^([0-F]{6}|[0-F]{8})$/i.test(fill)) {
          errors.push(
            `When defined, 'resize.fill' is expected to be a hex color, optionally with the alpha channel (e.g. A242B7, a242b7, FFFFAABB), but received ${fill} instead.`
          );
        }
      }

      if (typeof focalPoint === "object") {
        const { bottom, left, right, top } = focalPoint;

        if (!Number.isInteger(bottom) || bottom < 0) {
          errors.push(
            `When defined, 'resize.focalPoint.bottom' is expected to be a positive integer, but received ${bottom} instead.`
          );
        }

        if (!Number.isInteger(left) || left < 0) {
          errors.push(
            `When defined, 'resize.focalPoint.left' is expected to be a positive integer, but received ${left} instead.`
          );
        }

        if (!Number.isInteger(right) || right < 0) {
          errors.push(
            `When defined, 'resize.focalPoint.right' is expected to be a positive integer, but received ${right} instead.`
          );
        }

        if (!Number.isInteger(top) || top < 0) {
          errors.push(
            `When defined, 'resize.focalPoint.top' is expected to be a positive integer, but received ${top} instead.`
          );
        }
      }
    }
  }

  if (crop !== undefined) {
    const { bottom, left, right, top } = crop;

    if (!Number.isInteger(bottom) || bottom < 0) {
      errors.push(
        `When defined, 'crop.bottom' is expected to be a positive integer, but received ${bottom} instead.`
      );
    }

    if (!Number.isInteger(left) || left < 0) {
      errors.push(
        `When defined, 'crop.left' is expected to be a positive integer, but received ${left} instead.`
      );
    }

    if (!Number.isInteger(right) || right < 0) {
      errors.push(
        `When defined, 'crop.right' is expected to be a positive integer, but received ${right} instead.`
      );
    }

    if (!Number.isInteger(top) || top < 0) {
      errors.push(
        `When defined, 'crop.top' is expected to be a positive integer, but received ${top} instead.`
      );
    }
  }

  return errors;
};
