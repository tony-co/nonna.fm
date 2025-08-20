interface FontReturn {
  className: string;
  style: {
    fontFamily: string;
  };
}

export function Inter(): FontReturn {
  return {
    className: "mock-inter-font",
    style: {
      fontFamily: "Inter",
    },
  };
}
