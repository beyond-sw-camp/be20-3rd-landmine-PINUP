#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");
const inputPath = path.join(projectRoot, "public/sido.geojson");
const outputPath = path.join(projectRoot, "public/statesData.js");

const nameToProvinceId = {
  서울특별시: "seoul",
  인천광역시: "incheon",
  경기도: "gyeonggi",
  강원특별자치도: "gangwon",
  충청북도: "chungbuk",
  충청남도: "chungnam",
  세종특별자치시: "sejong",
  대전광역시: "daejeon",
  전북특별자치도: "jeonbuk",
  전라남도: "jeonnam",
  광주광역시: "gwangju",
  경상북도: "gyeongbuk",
  대구광역시: "daegu",
  경상남도: "gyeongnam",
  부산광역시: "busan",
  울산광역시: "ulsan",
  제주특별자치도: "jeju"
};

const a = 6378137.0;
const f = 1 / 298.257222101;
const e2 = 2 * f - f * f;
const ePrimeSquared = e2 / (1 - e2);
const lon0 = (127 * Math.PI) / 180;
const lat0 = (38 * Math.PI) / 180;
const falseEasting = 1000000;
const falseNorthing = 2000000;
const k0 = 1;

const calcMeridionalArc = (phi) => {
  const e4 = e2 * e2;
  const e6 = e4 * e2;
  return (
    a *
    ((1 - e2 / 4 - (3 * e4) / 64 - (5 * e6) / 256) * phi -
      ((3 * e2) / 8 + (3 * e4) / 32 + (45 * e6) / 1024) * Math.sin(2 * phi) +
      ((15 * e4) / 256 + (45 * e6) / 1024) * Math.sin(4 * phi) -
      ((35 * e6) / 3072) * Math.sin(6 * phi))
  );
};

const e4 = e2 * e2;
const e6 = e4 * e2;
const coeffA = 1 - e2 / 4 - (3 * e4) / 64 - (5 * e6) / 256;
const M0 = calcMeridionalArc(lat0);
const sqrtOneMinusE2 = Math.sqrt(1 - e2);
const e1 = (1 - sqrtOneMinusE2) / (1 + sqrtOneMinusE2);

const radiansToDegrees = (rad) => (rad * 180) / Math.PI;
const roundCoord = (value) => Math.round(value * 1e6) / 1e6;

const convertPoint = (x, y) => {
  const dx = x - falseEasting;
  const dy = y - falseNorthing;
  const M = M0 + dy / k0;
  const mu = M / (a * coeffA);

  const phi1 =
    mu +
    ((3 * e1) / 2 - (27 * Math.pow(e1, 3)) / 32) * Math.sin(2 * mu) +
    ((21 * Math.pow(e1, 2)) / 16 - (55 * Math.pow(e1, 4)) / 32) * Math.sin(4 * mu) +
    ((151 * Math.pow(e1, 3)) / 96) * Math.sin(6 * mu) +
    ((1097 * Math.pow(e1, 4)) / 512) * Math.sin(8 * mu);

  const sinPhi1 = Math.sin(phi1);
  const cosPhi1 = Math.cos(phi1);
  const tanPhi1 = Math.tan(phi1);

  const C1 = ePrimeSquared * Math.pow(cosPhi1, 2);
  const T1 = Math.pow(tanPhi1, 2);
  const N1 = a / Math.sqrt(1 - e2 * Math.pow(sinPhi1, 2));
  const R1 = (a * (1 - e2)) / Math.pow(1 - e2 * Math.pow(sinPhi1, 2), 1.5);
  const D = dx / (N1 * k0);

  const lat =
    phi1 -
    ((N1 * tanPhi1) / R1) *
      (Math.pow(D, 2) / 2 -
        (5 + 3 * T1 + 10 * C1 - 4 * C1 * C1 - 9 * ePrimeSquared) * Math.pow(D, 4) / 24 +
        (61 + 90 * T1 + 298 * C1 + 45 * T1 * T1 - 252 * ePrimeSquared - 3 * C1 * C1) *
          Math.pow(D, 6) /
          720);

  const lon =
    lon0 +
    (D -
      (1 + 2 * T1 + C1) * Math.pow(D, 3) / 6 +
      (5 - 2 * C1 + 28 * T1 - 3 * C1 * C1 + 8 * ePrimeSquared + 24 * T1 * T1) *
        Math.pow(D, 5) /
        120) /
      cosPhi1;

  return {
    lat: roundCoord(radiansToDegrees(lat)),
    lon: roundCoord(radiansToDegrees(lon))
  };
};

const convertCoordinates = (coords) => {
  if (typeof coords[0] === "number") {
    const [x, y] = coords;
    const { lat, lon } = convertPoint(x, y);
    return [lon, lat];
  }
  return coords.map((inner) => convertCoordinates(inner));
};

const inputData = JSON.parse(readFileSync(inputPath, "utf8"));
const convertedFeatures = inputData.features.map((feature, idx) => {
  const geometry = feature.geometry ?? { type: "Polygon", coordinates: [] };
  const sidoName = feature.properties?.SIDO_NM ?? "";
  const provinceId = nameToProvinceId[sidoName];
  if (!provinceId) {
    console.warn(`Warning: could not match province id for "${sidoName}"`);
  }
  const fallbackId = feature.id ?? String(idx).padStart(2, "0");
  const featureId = provinceId ?? fallbackId;
  return {
    type: "Feature",
    id: featureId,
    properties: {
      ...feature.properties,
      name: sidoName || `Province ${idx + 1}`,
      provinceId
    },
    geometry: {
      type: geometry.type,
      coordinates: convertCoordinates(geometry.coordinates ?? [])
    }
  };
});

const statesData = {
  type: "FeatureCollection",
  features: convertedFeatures
};

const output = `var statesData = ${JSON.stringify(statesData, null, 2)};\n`;
writeFileSync(outputPath, output);
console.log(`Created statesData with ${convertedFeatures.length} features at ${outputPath}`);
