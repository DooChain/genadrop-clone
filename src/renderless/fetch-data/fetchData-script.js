export const parseAlgoCollection = (result) => {
  const resValues = Object.values(result);
  return resValues.map((val) => ({
    ...val,
    type: "collections",
  }));
};
export const parseAlgoSingle = (result) => {
  const resValues = Object.values(result);
  return resValues.map((val) => ({
    ...val,
    type: "1of1",
  }));
};
export const parsePolygonCollection = (result) => {
  return result.map((val) => ({
    ...val,
    type: "collections",
  }));
};
export const parsePolygonSingle = (result) => {
  return result.map((val) => ({
    ...val,
    type: "1of1",
  }));
};
export const parseCeloCollection = (result) => {
  return result.map((val) => ({
    ...val,
    type: "collections",
  }));
};
export const parseCeloSingle = (result) => {
  return result.map((val) => ({
    ...val,
    type: "1of1",
  }));
};
export const parseAuroraCollection = (result) => {
  return result.map((val) => ({
    ...val,
    type: "collections",
  }));
};
export const parseAuroraSingle = (result) => {
  return result.map((val) => ({
    ...val,
    type: "1of1",
  }));
};
