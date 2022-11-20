import { imageUrl } from ".";

// We need a separate test file to test types,
// because this file is not supposed to be run,
// only to be type-checked, as type errors
// would cause runtime errors.

describe("When flipping image", () => {
  describe("And we try to pass empty params", () => {
    it("Type error", () => {
      // @ts-expect-error
      imageUrl("test", {
        flip: {},
      });
    });
  });
});

describe("When trying to resize and crop at the same time", () => {
  it("Type error", () => {
    // @ts-expect-error
    imageUrl("test", {
      resize: {
        height: 100,
      },
      crop: {
        top: 1,
        bottom: 2,
        left: 3,
        right: 4,
      },
    });
  });
});

describe("When resizing", () => {
  describe("And we pass only height", () => {
    describe("And we try to pass 'fitIn' param", () => {
      it("Type error", () => {
        // @ts-expect-error
        imageUrl("test", {
          resize: {
            height: 100,
            fitIn: true,
          },
        });
      });
    });

    describe("And we try to pass 'fill' param", () => {
      it("Type error", () => {
        // @ts-expect-error
        imageUrl("test", {
          resize: {
            height: 100,
            fill: "ABCDEF",
          },
        });
      });
    });

    describe("And we try to pass 'focalPoint' param", () => {
      it("Type error", () => {
        // @ts-expect-error
        imageUrl("test", {
          resize: {
            height: 100,
            focalPoint: {
              left: 1,
              bottom: 2,
              right: 3,
              top: 4,
            },
          },
        });
      });
    });
  });

  describe("And we pass only width", () => {
    describe("And we try to pass 'fitIn' param", () => {
      it("Type error", () => {
        // @ts-expect-error
        imageUrl("test", {
          resize: {
            width: 100,
            fitIn: true,
          },
        });
      });
    });

    describe("And we try to pass 'fill' param", () => {
      it("Type error", () => {
        // @ts-expect-error
        imageUrl("test", {
          resize: {
            width: 100,
            fill: "ABCDEF",
          },
        });
      });
    });

    describe("And we try to pass 'focalPoint' param", () => {
      it("Type error", () => {
        // @ts-expect-error
        imageUrl("test", {
          resize: {
            width: 100,
            focalPoint: {
              left: 1,
              bottom: 2,
              right: 3,
              top: 4,
            },
          },
        });
      });
    });
  });

  describe("And we pass width and height", () => {
    describe("And 'fitIn' is false", () => {
      describe("And we try to pass 'fill' param", () => {
        it("Type error", () => {
          // @ts-expect-error
          imageUrl("test", {
            resize: {
              width: 100,
              height: 200,
              fitIn: false,
              fill: "AAAAAA",
            },
          });
        });
      });
    });

    describe("And 'fitIn' is true", () => {
      describe("And we try to pass 'focalPoint' param", () => {
        it("Type error", () => {
          // @ts-expect-error
          imageUrl("test", {
            resize: {
              width: 100,
              height: 200,
              fitIn: true,
              focalPoint: {
                left: 1,
                bottom: 2,
                right: 3,
                top: 4,
              },
            },
          });
        });
      });
    });
  });
});
