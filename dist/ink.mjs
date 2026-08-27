import{createRequire as __cr}from"node:module";const require=__cr(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x2) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x2, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x2)(function(x2) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x2 + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to2, from2, except, desc) => {
  if (from2 && typeof from2 === "object" || typeof from2 === "function") {
    for (let key2 of __getOwnPropNames(from2))
      if (!__hasOwnProp.call(to2, key2) && key2 !== except)
        __defProp(to2, key2, { get: () => from2[key2], enumerable: !(desc = __getOwnPropDesc(from2, key2)) || desc.enumerable });
  }
  return to2;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/jpeg-js/lib/encoder.js
var require_encoder = __commonJS({
  "node_modules/jpeg-js/lib/encoder.js"(exports, module) {
    var btoa = btoa || function(buf) {
      return Buffer.from(buf).toString("base64");
    };
    function JPEGEncoder(quality) {
      var self2 = this;
      var fround = Math.round;
      var ffloor = Math.floor;
      var YTable = new Array(64);
      var UVTable = new Array(64);
      var fdtbl_Y = new Array(64);
      var fdtbl_UV = new Array(64);
      var YDC_HT;
      var UVDC_HT;
      var YAC_HT;
      var UVAC_HT;
      var bitcode = new Array(65535);
      var category = new Array(65535);
      var outputfDCTQuant = new Array(64);
      var DU = new Array(64);
      var byteout = [];
      var bytenew = 0;
      var bytepos = 7;
      var YDU = new Array(64);
      var UDU = new Array(64);
      var VDU = new Array(64);
      var clt = new Array(256);
      var RGB_YUV_TABLE = new Array(2048);
      var currentQuality;
      var ZigZag = [
        0,
        1,
        5,
        6,
        14,
        15,
        27,
        28,
        2,
        4,
        7,
        13,
        16,
        26,
        29,
        42,
        3,
        8,
        12,
        17,
        25,
        30,
        41,
        43,
        9,
        11,
        18,
        24,
        31,
        40,
        44,
        53,
        10,
        19,
        23,
        32,
        39,
        45,
        52,
        54,
        20,
        22,
        33,
        38,
        46,
        51,
        55,
        60,
        21,
        34,
        37,
        47,
        50,
        56,
        59,
        61,
        35,
        36,
        48,
        49,
        57,
        58,
        62,
        63
      ];
      var std_dc_luminance_nrcodes = [0, 0, 1, 5, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
      var std_dc_luminance_values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      var std_ac_luminance_nrcodes = [0, 0, 2, 1, 3, 3, 2, 4, 3, 5, 5, 4, 4, 0, 0, 1, 125];
      var std_ac_luminance_values = [
        1,
        2,
        3,
        0,
        4,
        17,
        5,
        18,
        33,
        49,
        65,
        6,
        19,
        81,
        97,
        7,
        34,
        113,
        20,
        50,
        129,
        145,
        161,
        8,
        35,
        66,
        177,
        193,
        21,
        82,
        209,
        240,
        36,
        51,
        98,
        114,
        130,
        9,
        10,
        22,
        23,
        24,
        25,
        26,
        37,
        38,
        39,
        40,
        41,
        42,
        52,
        53,
        54,
        55,
        56,
        57,
        58,
        67,
        68,
        69,
        70,
        71,
        72,
        73,
        74,
        83,
        84,
        85,
        86,
        87,
        88,
        89,
        90,
        99,
        100,
        101,
        102,
        103,
        104,
        105,
        106,
        115,
        116,
        117,
        118,
        119,
        120,
        121,
        122,
        131,
        132,
        133,
        134,
        135,
        136,
        137,
        138,
        146,
        147,
        148,
        149,
        150,
        151,
        152,
        153,
        154,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        178,
        179,
        180,
        181,
        182,
        183,
        184,
        185,
        186,
        194,
        195,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        210,
        211,
        212,
        213,
        214,
        215,
        216,
        217,
        218,
        225,
        226,
        227,
        228,
        229,
        230,
        231,
        232,
        233,
        234,
        241,
        242,
        243,
        244,
        245,
        246,
        247,
        248,
        249,
        250
      ];
      var std_dc_chrominance_nrcodes = [0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0];
      var std_dc_chrominance_values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      var std_ac_chrominance_nrcodes = [0, 0, 2, 1, 2, 4, 4, 3, 4, 7, 5, 4, 4, 0, 1, 2, 119];
      var std_ac_chrominance_values = [
        0,
        1,
        2,
        3,
        17,
        4,
        5,
        33,
        49,
        6,
        18,
        65,
        81,
        7,
        97,
        113,
        19,
        34,
        50,
        129,
        8,
        20,
        66,
        145,
        161,
        177,
        193,
        9,
        35,
        51,
        82,
        240,
        21,
        98,
        114,
        209,
        10,
        22,
        36,
        52,
        225,
        37,
        241,
        23,
        24,
        25,
        26,
        38,
        39,
        40,
        41,
        42,
        53,
        54,
        55,
        56,
        57,
        58,
        67,
        68,
        69,
        70,
        71,
        72,
        73,
        74,
        83,
        84,
        85,
        86,
        87,
        88,
        89,
        90,
        99,
        100,
        101,
        102,
        103,
        104,
        105,
        106,
        115,
        116,
        117,
        118,
        119,
        120,
        121,
        122,
        130,
        131,
        132,
        133,
        134,
        135,
        136,
        137,
        138,
        146,
        147,
        148,
        149,
        150,
        151,
        152,
        153,
        154,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        178,
        179,
        180,
        181,
        182,
        183,
        184,
        185,
        186,
        194,
        195,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        210,
        211,
        212,
        213,
        214,
        215,
        216,
        217,
        218,
        226,
        227,
        228,
        229,
        230,
        231,
        232,
        233,
        234,
        242,
        243,
        244,
        245,
        246,
        247,
        248,
        249,
        250
      ];
      function initQuantTables(sf) {
        var YQT = [
          16,
          11,
          10,
          16,
          24,
          40,
          51,
          61,
          12,
          12,
          14,
          19,
          26,
          58,
          60,
          55,
          14,
          13,
          16,
          24,
          40,
          57,
          69,
          56,
          14,
          17,
          22,
          29,
          51,
          87,
          80,
          62,
          18,
          22,
          37,
          56,
          68,
          109,
          103,
          77,
          24,
          35,
          55,
          64,
          81,
          104,
          113,
          92,
          49,
          64,
          78,
          87,
          103,
          121,
          120,
          101,
          72,
          92,
          95,
          98,
          112,
          100,
          103,
          99
        ];
        for (var i = 0; i < 64; i++) {
          var t = ffloor((YQT[i] * sf + 50) / 100);
          if (t < 1) {
            t = 1;
          } else if (t > 255) {
            t = 255;
          }
          YTable[ZigZag[i]] = t;
        }
        var UVQT = [
          17,
          18,
          24,
          47,
          99,
          99,
          99,
          99,
          18,
          21,
          26,
          66,
          99,
          99,
          99,
          99,
          24,
          26,
          56,
          99,
          99,
          99,
          99,
          99,
          47,
          66,
          99,
          99,
          99,
          99,
          99,
          99,
          99,
          99,
          99,
          99,
          99,
          99,
          99,
          99,
          99,
          99,
          99,
          99,
          99,
          99,
          99,
          99,
          99,
          99,
          99,
          99,
          99,
          99,
          99,
          99,
          99,
          99,
          99,
          99,
          99,
          99,
          99,
          99
        ];
        for (var j = 0; j < 64; j++) {
          var u = ffloor((UVQT[j] * sf + 50) / 100);
          if (u < 1) {
            u = 1;
          } else if (u > 255) {
            u = 255;
          }
          UVTable[ZigZag[j]] = u;
        }
        var aasf = [
          1,
          1.387039845,
          1.306562965,
          1.175875602,
          1,
          0.785694958,
          0.5411961,
          0.275899379
        ];
        var k = 0;
        for (var row = 0; row < 8; row++) {
          for (var col = 0; col < 8; col++) {
            fdtbl_Y[k] = 1 / (YTable[ZigZag[k]] * aasf[row] * aasf[col] * 8);
            fdtbl_UV[k] = 1 / (UVTable[ZigZag[k]] * aasf[row] * aasf[col] * 8);
            k++;
          }
        }
      }
      function computeHuffmanTbl(nrcodes, std_table) {
        var codevalue = 0;
        var pos_in_table = 0;
        var HT = new Array();
        for (var k = 1; k <= 16; k++) {
          for (var j = 1; j <= nrcodes[k]; j++) {
            HT[std_table[pos_in_table]] = [];
            HT[std_table[pos_in_table]][0] = codevalue;
            HT[std_table[pos_in_table]][1] = k;
            pos_in_table++;
            codevalue++;
          }
          codevalue *= 2;
        }
        return HT;
      }
      function initHuffmanTbl() {
        YDC_HT = computeHuffmanTbl(std_dc_luminance_nrcodes, std_dc_luminance_values);
        UVDC_HT = computeHuffmanTbl(std_dc_chrominance_nrcodes, std_dc_chrominance_values);
        YAC_HT = computeHuffmanTbl(std_ac_luminance_nrcodes, std_ac_luminance_values);
        UVAC_HT = computeHuffmanTbl(std_ac_chrominance_nrcodes, std_ac_chrominance_values);
      }
      function initCategoryNumber() {
        var nrlower = 1;
        var nrupper = 2;
        for (var cat = 1; cat <= 15; cat++) {
          for (var nr = nrlower; nr < nrupper; nr++) {
            category[32767 + nr] = cat;
            bitcode[32767 + nr] = [];
            bitcode[32767 + nr][1] = cat;
            bitcode[32767 + nr][0] = nr;
          }
          for (var nrneg = -(nrupper - 1); nrneg <= -nrlower; nrneg++) {
            category[32767 + nrneg] = cat;
            bitcode[32767 + nrneg] = [];
            bitcode[32767 + nrneg][1] = cat;
            bitcode[32767 + nrneg][0] = nrupper - 1 + nrneg;
          }
          nrlower <<= 1;
          nrupper <<= 1;
        }
      }
      function initRGBYUVTable() {
        for (var i = 0; i < 256; i++) {
          RGB_YUV_TABLE[i] = 19595 * i;
          RGB_YUV_TABLE[i + 256 >> 0] = 38470 * i;
          RGB_YUV_TABLE[i + 512 >> 0] = 7471 * i + 32768;
          RGB_YUV_TABLE[i + 768 >> 0] = -11059 * i;
          RGB_YUV_TABLE[i + 1024 >> 0] = -21709 * i;
          RGB_YUV_TABLE[i + 1280 >> 0] = 32768 * i + 8421375;
          RGB_YUV_TABLE[i + 1536 >> 0] = -27439 * i;
          RGB_YUV_TABLE[i + 1792 >> 0] = -5329 * i;
        }
      }
      function writeBits(bs) {
        var value = bs[0];
        var posval = bs[1] - 1;
        while (posval >= 0) {
          if (value & 1 << posval) {
            bytenew |= 1 << bytepos;
          }
          posval--;
          bytepos--;
          if (bytepos < 0) {
            if (bytenew == 255) {
              writeByte(255);
              writeByte(0);
            } else {
              writeByte(bytenew);
            }
            bytepos = 7;
            bytenew = 0;
          }
        }
      }
      function writeByte(value) {
        byteout.push(value);
      }
      function writeWord(value) {
        writeByte(value >> 8 & 255);
        writeByte(value & 255);
      }
      function fDCTQuant(data2, fdtbl) {
        var d0, d1, d2, d3, d4, d5, d6, d7;
        var dataOff = 0;
        var i;
        var I8 = 8;
        var I64 = 64;
        for (i = 0; i < I8; ++i) {
          d0 = data2[dataOff];
          d1 = data2[dataOff + 1];
          d2 = data2[dataOff + 2];
          d3 = data2[dataOff + 3];
          d4 = data2[dataOff + 4];
          d5 = data2[dataOff + 5];
          d6 = data2[dataOff + 6];
          d7 = data2[dataOff + 7];
          var tmp0 = d0 + d7;
          var tmp7 = d0 - d7;
          var tmp1 = d1 + d6;
          var tmp6 = d1 - d6;
          var tmp2 = d2 + d5;
          var tmp5 = d2 - d5;
          var tmp3 = d3 + d4;
          var tmp4 = d3 - d4;
          var tmp10 = tmp0 + tmp3;
          var tmp13 = tmp0 - tmp3;
          var tmp11 = tmp1 + tmp2;
          var tmp12 = tmp1 - tmp2;
          data2[dataOff] = tmp10 + tmp11;
          data2[dataOff + 4] = tmp10 - tmp11;
          var z1 = (tmp12 + tmp13) * 0.707106781;
          data2[dataOff + 2] = tmp13 + z1;
          data2[dataOff + 6] = tmp13 - z1;
          tmp10 = tmp4 + tmp5;
          tmp11 = tmp5 + tmp6;
          tmp12 = tmp6 + tmp7;
          var z5 = (tmp10 - tmp12) * 0.382683433;
          var z2 = 0.5411961 * tmp10 + z5;
          var z4 = 1.306562965 * tmp12 + z5;
          var z3 = tmp11 * 0.707106781;
          var z11 = tmp7 + z3;
          var z13 = tmp7 - z3;
          data2[dataOff + 5] = z13 + z2;
          data2[dataOff + 3] = z13 - z2;
          data2[dataOff + 1] = z11 + z4;
          data2[dataOff + 7] = z11 - z4;
          dataOff += 8;
        }
        dataOff = 0;
        for (i = 0; i < I8; ++i) {
          d0 = data2[dataOff];
          d1 = data2[dataOff + 8];
          d2 = data2[dataOff + 16];
          d3 = data2[dataOff + 24];
          d4 = data2[dataOff + 32];
          d5 = data2[dataOff + 40];
          d6 = data2[dataOff + 48];
          d7 = data2[dataOff + 56];
          var tmp0p2 = d0 + d7;
          var tmp7p2 = d0 - d7;
          var tmp1p2 = d1 + d6;
          var tmp6p2 = d1 - d6;
          var tmp2p2 = d2 + d5;
          var tmp5p2 = d2 - d5;
          var tmp3p2 = d3 + d4;
          var tmp4p2 = d3 - d4;
          var tmp10p2 = tmp0p2 + tmp3p2;
          var tmp13p2 = tmp0p2 - tmp3p2;
          var tmp11p2 = tmp1p2 + tmp2p2;
          var tmp12p2 = tmp1p2 - tmp2p2;
          data2[dataOff] = tmp10p2 + tmp11p2;
          data2[dataOff + 32] = tmp10p2 - tmp11p2;
          var z1p2 = (tmp12p2 + tmp13p2) * 0.707106781;
          data2[dataOff + 16] = tmp13p2 + z1p2;
          data2[dataOff + 48] = tmp13p2 - z1p2;
          tmp10p2 = tmp4p2 + tmp5p2;
          tmp11p2 = tmp5p2 + tmp6p2;
          tmp12p2 = tmp6p2 + tmp7p2;
          var z5p2 = (tmp10p2 - tmp12p2) * 0.382683433;
          var z2p2 = 0.5411961 * tmp10p2 + z5p2;
          var z4p2 = 1.306562965 * tmp12p2 + z5p2;
          var z3p2 = tmp11p2 * 0.707106781;
          var z11p2 = tmp7p2 + z3p2;
          var z13p2 = tmp7p2 - z3p2;
          data2[dataOff + 40] = z13p2 + z2p2;
          data2[dataOff + 24] = z13p2 - z2p2;
          data2[dataOff + 8] = z11p2 + z4p2;
          data2[dataOff + 56] = z11p2 - z4p2;
          dataOff++;
        }
        var fDCTQuant2;
        for (i = 0; i < I64; ++i) {
          fDCTQuant2 = data2[i] * fdtbl[i];
          outputfDCTQuant[i] = fDCTQuant2 > 0 ? fDCTQuant2 + 0.5 | 0 : fDCTQuant2 - 0.5 | 0;
        }
        return outputfDCTQuant;
      }
      function writeAPP0() {
        writeWord(65504);
        writeWord(16);
        writeByte(74);
        writeByte(70);
        writeByte(73);
        writeByte(70);
        writeByte(0);
        writeByte(1);
        writeByte(1);
        writeByte(0);
        writeWord(1);
        writeWord(1);
        writeByte(0);
        writeByte(0);
      }
      function writeAPP1(exifBuffer) {
        if (!exifBuffer) return;
        writeWord(65505);
        if (exifBuffer[0] === 69 && exifBuffer[1] === 120 && exifBuffer[2] === 105 && exifBuffer[3] === 102) {
          writeWord(exifBuffer.length + 2);
        } else {
          writeWord(exifBuffer.length + 5 + 2);
          writeByte(69);
          writeByte(120);
          writeByte(105);
          writeByte(102);
          writeByte(0);
        }
        for (var i = 0; i < exifBuffer.length; i++) {
          writeByte(exifBuffer[i]);
        }
      }
      function writeSOF0(width2, height2) {
        writeWord(65472);
        writeWord(17);
        writeByte(8);
        writeWord(height2);
        writeWord(width2);
        writeByte(3);
        writeByte(1);
        writeByte(17);
        writeByte(0);
        writeByte(2);
        writeByte(17);
        writeByte(1);
        writeByte(3);
        writeByte(17);
        writeByte(1);
      }
      function writeDQT() {
        writeWord(65499);
        writeWord(132);
        writeByte(0);
        for (var i = 0; i < 64; i++) {
          writeByte(YTable[i]);
        }
        writeByte(1);
        for (var j = 0; j < 64; j++) {
          writeByte(UVTable[j]);
        }
      }
      function writeDHT() {
        writeWord(65476);
        writeWord(418);
        writeByte(0);
        for (var i = 0; i < 16; i++) {
          writeByte(std_dc_luminance_nrcodes[i + 1]);
        }
        for (var j = 0; j <= 11; j++) {
          writeByte(std_dc_luminance_values[j]);
        }
        writeByte(16);
        for (var k = 0; k < 16; k++) {
          writeByte(std_ac_luminance_nrcodes[k + 1]);
        }
        for (var l = 0; l <= 161; l++) {
          writeByte(std_ac_luminance_values[l]);
        }
        writeByte(1);
        for (var m = 0; m < 16; m++) {
          writeByte(std_dc_chrominance_nrcodes[m + 1]);
        }
        for (var n = 0; n <= 11; n++) {
          writeByte(std_dc_chrominance_values[n]);
        }
        writeByte(17);
        for (var o = 0; o < 16; o++) {
          writeByte(std_ac_chrominance_nrcodes[o + 1]);
        }
        for (var p = 0; p <= 161; p++) {
          writeByte(std_ac_chrominance_values[p]);
        }
      }
      function writeCOM(comments) {
        if (typeof comments === "undefined" || comments.constructor !== Array) return;
        comments.forEach((e) => {
          if (typeof e !== "string") return;
          writeWord(65534);
          var l = e.length;
          writeWord(l + 2);
          var i;
          for (i = 0; i < l; i++)
            writeByte(e.charCodeAt(i));
        });
      }
      function writeSOS() {
        writeWord(65498);
        writeWord(12);
        writeByte(3);
        writeByte(1);
        writeByte(0);
        writeByte(2);
        writeByte(17);
        writeByte(3);
        writeByte(17);
        writeByte(0);
        writeByte(63);
        writeByte(0);
      }
      function processDU(CDU, fdtbl, DC, HTDC, HTAC) {
        var EOB = HTAC[0];
        var M16zeroes = HTAC[240];
        var pos;
        var I16 = 16;
        var I63 = 63;
        var I64 = 64;
        var DU_DCT = fDCTQuant(CDU, fdtbl);
        for (var j = 0; j < I64; ++j) {
          DU[ZigZag[j]] = DU_DCT[j];
        }
        var Diff = DU[0] - DC;
        DC = DU[0];
        if (Diff == 0) {
          writeBits(HTDC[0]);
        } else {
          pos = 32767 + Diff;
          writeBits(HTDC[category[pos]]);
          writeBits(bitcode[pos]);
        }
        var end0pos = 63;
        for (; end0pos > 0 && DU[end0pos] == 0; end0pos--) {
        }
        ;
        if (end0pos == 0) {
          writeBits(EOB);
          return DC;
        }
        var i = 1;
        var lng;
        while (i <= end0pos) {
          var startpos = i;
          for (; DU[i] == 0 && i <= end0pos; ++i) {
          }
          var nrzeroes = i - startpos;
          if (nrzeroes >= I16) {
            lng = nrzeroes >> 4;
            for (var nrmarker = 1; nrmarker <= lng; ++nrmarker)
              writeBits(M16zeroes);
            nrzeroes = nrzeroes & 15;
          }
          pos = 32767 + DU[i];
          writeBits(HTAC[(nrzeroes << 4) + category[pos]]);
          writeBits(bitcode[pos]);
          i++;
        }
        if (end0pos != I63) {
          writeBits(EOB);
        }
        return DC;
      }
      function initCharLookupTable() {
        var sfcc = String.fromCharCode;
        for (var i = 0; i < 256; i++) {
          clt[i] = sfcc(i);
        }
      }
      this.encode = function(image, quality2) {
        var time_start = (/* @__PURE__ */ new Date()).getTime();
        if (quality2) setQuality(quality2);
        byteout = new Array();
        bytenew = 0;
        bytepos = 7;
        writeWord(65496);
        writeAPP0();
        writeCOM(image.comments);
        writeAPP1(image.exifBuffer);
        writeDQT();
        writeSOF0(image.width, image.height);
        writeDHT();
        writeSOS();
        var DCY = 0;
        var DCU = 0;
        var DCV = 0;
        bytenew = 0;
        bytepos = 7;
        this.encode.displayName = "_encode_";
        var imageData = image.data;
        var width2 = image.width;
        var height2 = image.height;
        var quadWidth = width2 * 4;
        var tripleWidth = width2 * 3;
        var x2, y2 = 0;
        var r, g, b;
        var start, p, col, row, pos;
        while (y2 < height2) {
          x2 = 0;
          while (x2 < quadWidth) {
            start = quadWidth * y2 + x2;
            p = start;
            col = -1;
            row = 0;
            for (pos = 0; pos < 64; pos++) {
              row = pos >> 3;
              col = (pos & 7) * 4;
              p = start + row * quadWidth + col;
              if (y2 + row >= height2) {
                p -= quadWidth * (y2 + 1 + row - height2);
              }
              if (x2 + col >= quadWidth) {
                p -= x2 + col - quadWidth + 4;
              }
              r = imageData[p++];
              g = imageData[p++];
              b = imageData[p++];
              YDU[pos] = (RGB_YUV_TABLE[r] + RGB_YUV_TABLE[g + 256 >> 0] + RGB_YUV_TABLE[b + 512 >> 0] >> 16) - 128;
              UDU[pos] = (RGB_YUV_TABLE[r + 768 >> 0] + RGB_YUV_TABLE[g + 1024 >> 0] + RGB_YUV_TABLE[b + 1280 >> 0] >> 16) - 128;
              VDU[pos] = (RGB_YUV_TABLE[r + 1280 >> 0] + RGB_YUV_TABLE[g + 1536 >> 0] + RGB_YUV_TABLE[b + 1792 >> 0] >> 16) - 128;
            }
            DCY = processDU(YDU, fdtbl_Y, DCY, YDC_HT, YAC_HT);
            DCU = processDU(UDU, fdtbl_UV, DCU, UVDC_HT, UVAC_HT);
            DCV = processDU(VDU, fdtbl_UV, DCV, UVDC_HT, UVAC_HT);
            x2 += 32;
          }
          y2 += 8;
        }
        if (bytepos >= 0) {
          var fillbits = [];
          fillbits[1] = bytepos + 1;
          fillbits[0] = (1 << bytepos + 1) - 1;
          writeBits(fillbits);
        }
        writeWord(65497);
        if (typeof module === "undefined") return new Uint8Array(byteout);
        return Buffer.from(byteout);
        var jpegDataUri = "data:image/jpeg;base64," + btoa(byteout.join(""));
        byteout = [];
        var duration = (/* @__PURE__ */ new Date()).getTime() - time_start;
        return jpegDataUri;
      };
      function setQuality(quality2) {
        if (quality2 <= 0) {
          quality2 = 1;
        }
        if (quality2 > 100) {
          quality2 = 100;
        }
        if (currentQuality == quality2) return;
        var sf = 0;
        if (quality2 < 50) {
          sf = Math.floor(5e3 / quality2);
        } else {
          sf = Math.floor(200 - quality2 * 2);
        }
        initQuantTables(sf);
        currentQuality = quality2;
      }
      function init() {
        var time_start = (/* @__PURE__ */ new Date()).getTime();
        if (!quality) quality = 50;
        initCharLookupTable();
        initHuffmanTbl();
        initCategoryNumber();
        initRGBYUVTable();
        setQuality(quality);
        var duration = (/* @__PURE__ */ new Date()).getTime() - time_start;
      }
      init();
    }
    if (typeof module !== "undefined") {
      module.exports = encode;
    } else if (typeof window !== "undefined") {
      window["jpeg-js"] = window["jpeg-js"] || {};
      window["jpeg-js"].encode = encode;
    }
    function encode(imgData, qu) {
      if (typeof qu === "undefined") qu = 50;
      var encoder = new JPEGEncoder(qu);
      var data2 = encoder.encode(imgData, qu);
      return {
        data: data2,
        width: imgData.width,
        height: imgData.height
      };
    }
  }
});

// node_modules/jpeg-js/lib/decoder.js
var require_decoder = __commonJS({
  "node_modules/jpeg-js/lib/decoder.js"(exports, module) {
    var JpegImage = (function jpegImage() {
      "use strict";
      var dctZigZag = new Int32Array([
        0,
        1,
        8,
        16,
        9,
        2,
        3,
        10,
        17,
        24,
        32,
        25,
        18,
        11,
        4,
        5,
        12,
        19,
        26,
        33,
        40,
        48,
        41,
        34,
        27,
        20,
        13,
        6,
        7,
        14,
        21,
        28,
        35,
        42,
        49,
        56,
        57,
        50,
        43,
        36,
        29,
        22,
        15,
        23,
        30,
        37,
        44,
        51,
        58,
        59,
        52,
        45,
        38,
        31,
        39,
        46,
        53,
        60,
        61,
        54,
        47,
        55,
        62,
        63
      ]);
      var dctCos1 = 4017;
      var dctSin1 = 799;
      var dctCos3 = 3406;
      var dctSin3 = 2276;
      var dctCos6 = 1567;
      var dctSin6 = 3784;
      var dctSqrt2 = 5793;
      var dctSqrt1d2 = 2896;
      function constructor() {
      }
      function buildHuffmanTable(codeLengths, values) {
        var k = 0, code = [], i, j, length2 = 16;
        while (length2 > 0 && !codeLengths[length2 - 1])
          length2--;
        code.push({ children: [], index: 0 });
        var p = code[0], q;
        for (i = 0; i < length2; i++) {
          for (j = 0; j < codeLengths[i]; j++) {
            p = code.pop();
            p.children[p.index] = values[k];
            while (p.index > 0) {
              if (code.length === 0)
                throw new Error("Could not recreate Huffman Table");
              p = code.pop();
            }
            p.index++;
            code.push(p);
            while (code.length <= i) {
              code.push(q = { children: [], index: 0 });
              p.children[p.index] = q.children;
              p = q;
            }
            k++;
          }
          if (i + 1 < length2) {
            code.push(q = { children: [], index: 0 });
            p.children[p.index] = q.children;
            p = q;
          }
        }
        return code[0].children;
      }
      function decodeScan(data2, offset, frame, components, resetInterval, spectralStart, spectralEnd, successivePrev, successive, opts) {
        var precision = frame.precision;
        var samplesPerLine = frame.samplesPerLine;
        var scanLines = frame.scanLines;
        var mcusPerLine = frame.mcusPerLine;
        var progressive = frame.progressive;
        var maxH = frame.maxH, maxV = frame.maxV;
        var startOffset = offset, bitsData = 0, bitsCount = 0;
        function readBit() {
          if (bitsCount > 0) {
            bitsCount--;
            return bitsData >> bitsCount & 1;
          }
          bitsData = data2[offset++];
          if (bitsData == 255) {
            var nextByte = data2[offset++];
            if (nextByte) {
              throw new Error("unexpected marker: " + (bitsData << 8 | nextByte).toString(16));
            }
          }
          bitsCount = 7;
          return bitsData >>> 7;
        }
        function decodeHuffman(tree) {
          var node = tree, bit;
          while ((bit = readBit()) !== null) {
            node = node[bit];
            if (typeof node === "number")
              return node;
            if (typeof node !== "object")
              throw new Error("invalid huffman sequence");
          }
          return null;
        }
        function receive(length2) {
          var n2 = 0;
          while (length2 > 0) {
            var bit = readBit();
            if (bit === null) return;
            n2 = n2 << 1 | bit;
            length2--;
          }
          return n2;
        }
        function receiveAndExtend(length2) {
          var n2 = receive(length2);
          if (n2 >= 1 << length2 - 1)
            return n2;
          return n2 + (-1 << length2) + 1;
        }
        function decodeBaseline(component2, zz) {
          var t = decodeHuffman(component2.huffmanTableDC);
          var diff = t === 0 ? 0 : receiveAndExtend(t);
          zz[0] = component2.pred += diff;
          var k2 = 1;
          while (k2 < 64) {
            var rs = decodeHuffman(component2.huffmanTableAC);
            var s = rs & 15, r = rs >> 4;
            if (s === 0) {
              if (r < 15)
                break;
              k2 += 16;
              continue;
            }
            k2 += r;
            var z = dctZigZag[k2];
            zz[z] = receiveAndExtend(s);
            k2++;
          }
        }
        function decodeDCFirst(component2, zz) {
          var t = decodeHuffman(component2.huffmanTableDC);
          var diff = t === 0 ? 0 : receiveAndExtend(t) << successive;
          zz[0] = component2.pred += diff;
        }
        function decodeDCSuccessive(component2, zz) {
          zz[0] |= readBit() << successive;
        }
        var eobrun = 0;
        function decodeACFirst(component2, zz) {
          if (eobrun > 0) {
            eobrun--;
            return;
          }
          var k2 = spectralStart, e = spectralEnd;
          while (k2 <= e) {
            var rs = decodeHuffman(component2.huffmanTableAC);
            var s = rs & 15, r = rs >> 4;
            if (s === 0) {
              if (r < 15) {
                eobrun = receive(r) + (1 << r) - 1;
                break;
              }
              k2 += 16;
              continue;
            }
            k2 += r;
            var z = dctZigZag[k2];
            zz[z] = receiveAndExtend(s) * (1 << successive);
            k2++;
          }
        }
        var successiveACState = 0, successiveACNextValue;
        function decodeACSuccessive(component2, zz) {
          var k2 = spectralStart, e = spectralEnd, r = 0;
          while (k2 <= e) {
            var z = dctZigZag[k2];
            var direction = zz[z] < 0 ? -1 : 1;
            switch (successiveACState) {
              case 0:
                var rs = decodeHuffman(component2.huffmanTableAC);
                var s = rs & 15, r = rs >> 4;
                if (s === 0) {
                  if (r < 15) {
                    eobrun = receive(r) + (1 << r);
                    successiveACState = 4;
                  } else {
                    r = 16;
                    successiveACState = 1;
                  }
                } else {
                  if (s !== 1)
                    throw new Error("invalid ACn encoding");
                  successiveACNextValue = receiveAndExtend(s);
                  successiveACState = r ? 2 : 3;
                }
                continue;
              case 1:
              // skipping r zero items
              case 2:
                if (zz[z])
                  zz[z] += (readBit() << successive) * direction;
                else {
                  r--;
                  if (r === 0)
                    successiveACState = successiveACState == 2 ? 3 : 0;
                }
                break;
              case 3:
                if (zz[z])
                  zz[z] += (readBit() << successive) * direction;
                else {
                  zz[z] = successiveACNextValue << successive;
                  successiveACState = 0;
                }
                break;
              case 4:
                if (zz[z])
                  zz[z] += (readBit() << successive) * direction;
                break;
            }
            k2++;
          }
          if (successiveACState === 4) {
            eobrun--;
            if (eobrun === 0)
              successiveACState = 0;
          }
        }
        function decodeMcu(component2, decode3, mcu2, row, col) {
          var mcuRow = mcu2 / mcusPerLine | 0;
          var mcuCol = mcu2 % mcusPerLine;
          var blockRow = mcuRow * component2.v + row;
          var blockCol = mcuCol * component2.h + col;
          if (component2.blocks[blockRow] === void 0 && opts.tolerantDecoding)
            return;
          decode3(component2, component2.blocks[blockRow][blockCol]);
        }
        function decodeBlock(component2, decode3, mcu2) {
          var blockRow = mcu2 / component2.blocksPerLine | 0;
          var blockCol = mcu2 % component2.blocksPerLine;
          if (component2.blocks[blockRow] === void 0 && opts.tolerantDecoding)
            return;
          decode3(component2, component2.blocks[blockRow][blockCol]);
        }
        var componentsLength = components.length;
        var component, i, j, k, n;
        var decodeFn;
        if (progressive) {
          if (spectralStart === 0)
            decodeFn = successivePrev === 0 ? decodeDCFirst : decodeDCSuccessive;
          else
            decodeFn = successivePrev === 0 ? decodeACFirst : decodeACSuccessive;
        } else {
          decodeFn = decodeBaseline;
        }
        var mcu = 0, marker;
        var mcuExpected;
        if (componentsLength == 1) {
          mcuExpected = components[0].blocksPerLine * components[0].blocksPerColumn;
        } else {
          mcuExpected = mcusPerLine * frame.mcusPerColumn;
        }
        if (!resetInterval) resetInterval = mcuExpected;
        var h, v;
        while (mcu < mcuExpected) {
          for (i = 0; i < componentsLength; i++)
            components[i].pred = 0;
          eobrun = 0;
          if (componentsLength == 1) {
            component = components[0];
            for (n = 0; n < resetInterval; n++) {
              decodeBlock(component, decodeFn, mcu);
              mcu++;
            }
          } else {
            for (n = 0; n < resetInterval; n++) {
              for (i = 0; i < componentsLength; i++) {
                component = components[i];
                h = component.h;
                v = component.v;
                for (j = 0; j < v; j++) {
                  for (k = 0; k < h; k++) {
                    decodeMcu(component, decodeFn, mcu, j, k);
                  }
                }
              }
              mcu++;
              if (mcu === mcuExpected) break;
            }
          }
          if (mcu === mcuExpected) {
            do {
              if (data2[offset] === 255) {
                if (data2[offset + 1] !== 0) {
                  break;
                }
              }
              offset += 1;
            } while (offset < data2.length - 2);
          }
          bitsCount = 0;
          marker = data2[offset] << 8 | data2[offset + 1];
          if (marker < 65280) {
            throw new Error("marker was not found");
          }
          if (marker >= 65488 && marker <= 65495) {
            offset += 2;
          } else
            break;
        }
        return offset - startOffset;
      }
      function buildComponentData(frame, component) {
        var lines = [];
        var blocksPerLine = component.blocksPerLine;
        var blocksPerColumn = component.blocksPerColumn;
        var samplesPerLine = blocksPerLine << 3;
        var R = new Int32Array(64), r = new Uint8Array(64);
        function quantizeAndInverse(zz, dataOut, dataIn) {
          var qt = component.quantizationTable;
          var v0, v1, v2, v3, v4, v5, v6, v7, t;
          var p = dataIn;
          var i2;
          for (i2 = 0; i2 < 64; i2++)
            p[i2] = zz[i2] * qt[i2];
          for (i2 = 0; i2 < 8; ++i2) {
            var row = 8 * i2;
            if (p[1 + row] == 0 && p[2 + row] == 0 && p[3 + row] == 0 && p[4 + row] == 0 && p[5 + row] == 0 && p[6 + row] == 0 && p[7 + row] == 0) {
              t = dctSqrt2 * p[0 + row] + 512 >> 10;
              p[0 + row] = t;
              p[1 + row] = t;
              p[2 + row] = t;
              p[3 + row] = t;
              p[4 + row] = t;
              p[5 + row] = t;
              p[6 + row] = t;
              p[7 + row] = t;
              continue;
            }
            v0 = dctSqrt2 * p[0 + row] + 128 >> 8;
            v1 = dctSqrt2 * p[4 + row] + 128 >> 8;
            v2 = p[2 + row];
            v3 = p[6 + row];
            v4 = dctSqrt1d2 * (p[1 + row] - p[7 + row]) + 128 >> 8;
            v7 = dctSqrt1d2 * (p[1 + row] + p[7 + row]) + 128 >> 8;
            v5 = p[3 + row] << 4;
            v6 = p[5 + row] << 4;
            t = v0 - v1 + 1 >> 1;
            v0 = v0 + v1 + 1 >> 1;
            v1 = t;
            t = v2 * dctSin6 + v3 * dctCos6 + 128 >> 8;
            v2 = v2 * dctCos6 - v3 * dctSin6 + 128 >> 8;
            v3 = t;
            t = v4 - v6 + 1 >> 1;
            v4 = v4 + v6 + 1 >> 1;
            v6 = t;
            t = v7 + v5 + 1 >> 1;
            v5 = v7 - v5 + 1 >> 1;
            v7 = t;
            t = v0 - v3 + 1 >> 1;
            v0 = v0 + v3 + 1 >> 1;
            v3 = t;
            t = v1 - v2 + 1 >> 1;
            v1 = v1 + v2 + 1 >> 1;
            v2 = t;
            t = v4 * dctSin3 + v7 * dctCos3 + 2048 >> 12;
            v4 = v4 * dctCos3 - v7 * dctSin3 + 2048 >> 12;
            v7 = t;
            t = v5 * dctSin1 + v6 * dctCos1 + 2048 >> 12;
            v5 = v5 * dctCos1 - v6 * dctSin1 + 2048 >> 12;
            v6 = t;
            p[0 + row] = v0 + v7;
            p[7 + row] = v0 - v7;
            p[1 + row] = v1 + v6;
            p[6 + row] = v1 - v6;
            p[2 + row] = v2 + v5;
            p[5 + row] = v2 - v5;
            p[3 + row] = v3 + v4;
            p[4 + row] = v3 - v4;
          }
          for (i2 = 0; i2 < 8; ++i2) {
            var col = i2;
            if (p[1 * 8 + col] == 0 && p[2 * 8 + col] == 0 && p[3 * 8 + col] == 0 && p[4 * 8 + col] == 0 && p[5 * 8 + col] == 0 && p[6 * 8 + col] == 0 && p[7 * 8 + col] == 0) {
              t = dctSqrt2 * dataIn[i2 + 0] + 8192 >> 14;
              p[0 * 8 + col] = t;
              p[1 * 8 + col] = t;
              p[2 * 8 + col] = t;
              p[3 * 8 + col] = t;
              p[4 * 8 + col] = t;
              p[5 * 8 + col] = t;
              p[6 * 8 + col] = t;
              p[7 * 8 + col] = t;
              continue;
            }
            v0 = dctSqrt2 * p[0 * 8 + col] + 2048 >> 12;
            v1 = dctSqrt2 * p[4 * 8 + col] + 2048 >> 12;
            v2 = p[2 * 8 + col];
            v3 = p[6 * 8 + col];
            v4 = dctSqrt1d2 * (p[1 * 8 + col] - p[7 * 8 + col]) + 2048 >> 12;
            v7 = dctSqrt1d2 * (p[1 * 8 + col] + p[7 * 8 + col]) + 2048 >> 12;
            v5 = p[3 * 8 + col];
            v6 = p[5 * 8 + col];
            t = v0 - v1 + 1 >> 1;
            v0 = v0 + v1 + 1 >> 1;
            v1 = t;
            t = v2 * dctSin6 + v3 * dctCos6 + 2048 >> 12;
            v2 = v2 * dctCos6 - v3 * dctSin6 + 2048 >> 12;
            v3 = t;
            t = v4 - v6 + 1 >> 1;
            v4 = v4 + v6 + 1 >> 1;
            v6 = t;
            t = v7 + v5 + 1 >> 1;
            v5 = v7 - v5 + 1 >> 1;
            v7 = t;
            t = v0 - v3 + 1 >> 1;
            v0 = v0 + v3 + 1 >> 1;
            v3 = t;
            t = v1 - v2 + 1 >> 1;
            v1 = v1 + v2 + 1 >> 1;
            v2 = t;
            t = v4 * dctSin3 + v7 * dctCos3 + 2048 >> 12;
            v4 = v4 * dctCos3 - v7 * dctSin3 + 2048 >> 12;
            v7 = t;
            t = v5 * dctSin1 + v6 * dctCos1 + 2048 >> 12;
            v5 = v5 * dctCos1 - v6 * dctSin1 + 2048 >> 12;
            v6 = t;
            p[0 * 8 + col] = v0 + v7;
            p[7 * 8 + col] = v0 - v7;
            p[1 * 8 + col] = v1 + v6;
            p[6 * 8 + col] = v1 - v6;
            p[2 * 8 + col] = v2 + v5;
            p[5 * 8 + col] = v2 - v5;
            p[3 * 8 + col] = v3 + v4;
            p[4 * 8 + col] = v3 - v4;
          }
          for (i2 = 0; i2 < 64; ++i2) {
            var sample2 = 128 + (p[i2] + 8 >> 4);
            dataOut[i2] = sample2 < 0 ? 0 : sample2 > 255 ? 255 : sample2;
          }
        }
        requestMemoryAllocation(samplesPerLine * blocksPerColumn * 8);
        var i, j;
        for (var blockRow = 0; blockRow < blocksPerColumn; blockRow++) {
          var scanLine = blockRow << 3;
          for (i = 0; i < 8; i++)
            lines.push(new Uint8Array(samplesPerLine));
          for (var blockCol = 0; blockCol < blocksPerLine; blockCol++) {
            quantizeAndInverse(component.blocks[blockRow][blockCol], r, R);
            var offset = 0, sample = blockCol << 3;
            for (j = 0; j < 8; j++) {
              var line = lines[scanLine + j];
              for (i = 0; i < 8; i++)
                line[sample + i] = r[offset++];
            }
          }
        }
        return lines;
      }
      function clampTo8bit(a) {
        return a < 0 ? 0 : a > 255 ? 255 : a;
      }
      constructor.prototype = {
        load: function load(path) {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", path, true);
          xhr.responseType = "arraybuffer";
          xhr.onload = (function() {
            var data2 = new Uint8Array(xhr.response || xhr.mozResponseArrayBuffer);
            this.parse(data2);
            if (this.onload)
              this.onload();
          }).bind(this);
          xhr.send(null);
        },
        parse: function parse6(data2) {
          var maxResolutionInPixels = this.opts.maxResolutionInMP * 1e3 * 1e3;
          var offset = 0, length2 = data2.length;
          function readUint16() {
            var value = data2[offset] << 8 | data2[offset + 1];
            offset += 2;
            return value;
          }
          function readDataBlock() {
            var length3 = readUint16();
            var array2 = data2.subarray(offset, offset + length3 - 2);
            offset += array2.length;
            return array2;
          }
          function prepareComponents(frame2) {
            var maxH2 = 1, maxV2 = 1;
            var component2, componentId2;
            for (componentId2 in frame2.components) {
              if (frame2.components.hasOwnProperty(componentId2)) {
                component2 = frame2.components[componentId2];
                if (maxH2 < component2.h) maxH2 = component2.h;
                if (maxV2 < component2.v) maxV2 = component2.v;
              }
            }
            var mcusPerLine = Math.ceil(frame2.samplesPerLine / 8 / maxH2);
            var mcusPerColumn = Math.ceil(frame2.scanLines / 8 / maxV2);
            for (componentId2 in frame2.components) {
              if (frame2.components.hasOwnProperty(componentId2)) {
                component2 = frame2.components[componentId2];
                var blocksPerLine = Math.ceil(Math.ceil(frame2.samplesPerLine / 8) * component2.h / maxH2);
                var blocksPerColumn = Math.ceil(Math.ceil(frame2.scanLines / 8) * component2.v / maxV2);
                var blocksPerLineForMcu = mcusPerLine * component2.h;
                var blocksPerColumnForMcu = mcusPerColumn * component2.v;
                var blocksToAllocate = blocksPerColumnForMcu * blocksPerLineForMcu;
                var blocks = [];
                requestMemoryAllocation(blocksToAllocate * 256);
                for (var i2 = 0; i2 < blocksPerColumnForMcu; i2++) {
                  var row = [];
                  for (var j2 = 0; j2 < blocksPerLineForMcu; j2++)
                    row.push(new Int32Array(64));
                  blocks.push(row);
                }
                component2.blocksPerLine = blocksPerLine;
                component2.blocksPerColumn = blocksPerColumn;
                component2.blocks = blocks;
              }
            }
            frame2.maxH = maxH2;
            frame2.maxV = maxV2;
            frame2.mcusPerLine = mcusPerLine;
            frame2.mcusPerColumn = mcusPerColumn;
          }
          var jfif = null;
          var adobe = null;
          var pixels = null;
          var frame, resetInterval;
          var quantizationTables = [], frames = [];
          var huffmanTablesAC = [], huffmanTablesDC = [];
          var fileMarker = readUint16();
          var malformedDataOffset = -1;
          this.comments = [];
          if (fileMarker != 65496) {
            throw new Error("SOI not found");
          }
          fileMarker = readUint16();
          while (fileMarker != 65497) {
            var i, j, l;
            switch (fileMarker) {
              case 65280:
                break;
              case 65504:
              // APP0 (Application Specific)
              case 65505:
              // APP1
              case 65506:
              // APP2
              case 65507:
              // APP3
              case 65508:
              // APP4
              case 65509:
              // APP5
              case 65510:
              // APP6
              case 65511:
              // APP7
              case 65512:
              // APP8
              case 65513:
              // APP9
              case 65514:
              // APP10
              case 65515:
              // APP11
              case 65516:
              // APP12
              case 65517:
              // APP13
              case 65518:
              // APP14
              case 65519:
              // APP15
              case 65534:
                var appData = readDataBlock();
                if (fileMarker === 65534) {
                  var comment = String.fromCharCode.apply(null, appData);
                  this.comments.push(comment);
                }
                if (fileMarker === 65504) {
                  if (appData[0] === 74 && appData[1] === 70 && appData[2] === 73 && appData[3] === 70 && appData[4] === 0) {
                    jfif = {
                      version: { major: appData[5], minor: appData[6] },
                      densityUnits: appData[7],
                      xDensity: appData[8] << 8 | appData[9],
                      yDensity: appData[10] << 8 | appData[11],
                      thumbWidth: appData[12],
                      thumbHeight: appData[13],
                      thumbData: appData.subarray(14, 14 + 3 * appData[12] * appData[13])
                    };
                  }
                }
                if (fileMarker === 65505) {
                  if (appData[0] === 69 && appData[1] === 120 && appData[2] === 105 && appData[3] === 102 && appData[4] === 0) {
                    this.exifBuffer = appData.subarray(5, appData.length);
                  }
                }
                if (fileMarker === 65518) {
                  if (appData[0] === 65 && appData[1] === 100 && appData[2] === 111 && appData[3] === 98 && appData[4] === 101 && appData[5] === 0) {
                    adobe = {
                      version: appData[6],
                      flags0: appData[7] << 8 | appData[8],
                      flags1: appData[9] << 8 | appData[10],
                      transformCode: appData[11]
                    };
                  }
                }
                break;
              case 65499:
                var quantizationTablesLength = readUint16();
                var quantizationTablesEnd = quantizationTablesLength + offset - 2;
                while (offset < quantizationTablesEnd) {
                  var quantizationTableSpec = data2[offset++];
                  requestMemoryAllocation(64 * 4);
                  var tableData = new Int32Array(64);
                  if (quantizationTableSpec >> 4 === 0) {
                    for (j = 0; j < 64; j++) {
                      var z = dctZigZag[j];
                      tableData[z] = data2[offset++];
                    }
                  } else if (quantizationTableSpec >> 4 === 1) {
                    for (j = 0; j < 64; j++) {
                      var z = dctZigZag[j];
                      tableData[z] = readUint16();
                    }
                  } else
                    throw new Error("DQT: invalid table spec");
                  quantizationTables[quantizationTableSpec & 15] = tableData;
                }
                break;
              case 65472:
              // SOF0 (Start of Frame, Baseline DCT)
              case 65473:
              // SOF1 (Start of Frame, Extended DCT)
              case 65474:
                readUint16();
                frame = {};
                frame.extended = fileMarker === 65473;
                frame.progressive = fileMarker === 65474;
                frame.precision = data2[offset++];
                frame.scanLines = readUint16();
                frame.samplesPerLine = readUint16();
                frame.components = {};
                frame.componentsOrder = [];
                var pixelsInFrame = frame.scanLines * frame.samplesPerLine;
                if (pixelsInFrame > maxResolutionInPixels) {
                  var exceededAmount = Math.ceil((pixelsInFrame - maxResolutionInPixels) / 1e6);
                  throw new Error(`maxResolutionInMP limit exceeded by ${exceededAmount}MP`);
                }
                var componentsCount = data2[offset++], componentId;
                var maxH = 0, maxV = 0;
                for (i = 0; i < componentsCount; i++) {
                  componentId = data2[offset];
                  var h = data2[offset + 1] >> 4;
                  var v = data2[offset + 1] & 15;
                  var qId = data2[offset + 2];
                  if (h <= 0 || v <= 0) {
                    throw new Error("Invalid sampling factor, expected values above 0");
                  }
                  frame.componentsOrder.push(componentId);
                  frame.components[componentId] = {
                    h,
                    v,
                    quantizationIdx: qId
                  };
                  offset += 3;
                }
                prepareComponents(frame);
                frames.push(frame);
                break;
              case 65476:
                var huffmanLength = readUint16();
                for (i = 2; i < huffmanLength; ) {
                  var huffmanTableSpec = data2[offset++];
                  var codeLengths = new Uint8Array(16);
                  var codeLengthSum = 0;
                  for (j = 0; j < 16; j++, offset++) {
                    codeLengthSum += codeLengths[j] = data2[offset];
                  }
                  requestMemoryAllocation(16 + codeLengthSum);
                  var huffmanValues = new Uint8Array(codeLengthSum);
                  for (j = 0; j < codeLengthSum; j++, offset++)
                    huffmanValues[j] = data2[offset];
                  i += 17 + codeLengthSum;
                  (huffmanTableSpec >> 4 === 0 ? huffmanTablesDC : huffmanTablesAC)[huffmanTableSpec & 15] = buildHuffmanTable(codeLengths, huffmanValues);
                }
                break;
              case 65501:
                readUint16();
                resetInterval = readUint16();
                break;
              case 65500:
                readUint16();
                readUint16();
                break;
              case 65498:
                var scanLength = readUint16();
                var selectorsCount = data2[offset++];
                var components = [], component;
                for (i = 0; i < selectorsCount; i++) {
                  component = frame.components[data2[offset++]];
                  var tableSpec = data2[offset++];
                  component.huffmanTableDC = huffmanTablesDC[tableSpec >> 4];
                  component.huffmanTableAC = huffmanTablesAC[tableSpec & 15];
                  components.push(component);
                }
                var spectralStart = data2[offset++];
                var spectralEnd = data2[offset++];
                var successiveApproximation = data2[offset++];
                var processed = decodeScan(
                  data2,
                  offset,
                  frame,
                  components,
                  resetInterval,
                  spectralStart,
                  spectralEnd,
                  successiveApproximation >> 4,
                  successiveApproximation & 15,
                  this.opts
                );
                offset += processed;
                break;
              case 65535:
                if (data2[offset] !== 255) {
                  offset--;
                }
                break;
              default:
                if (data2[offset - 3] == 255 && data2[offset - 2] >= 192 && data2[offset - 2] <= 254) {
                  offset -= 3;
                  break;
                } else if (fileMarker === 224 || fileMarker == 225) {
                  if (malformedDataOffset !== -1) {
                    throw new Error(`first unknown JPEG marker at offset ${malformedDataOffset.toString(16)}, second unknown JPEG marker ${fileMarker.toString(16)} at offset ${(offset - 1).toString(16)}`);
                  }
                  malformedDataOffset = offset - 1;
                  const nextOffset = readUint16();
                  if (data2[offset + nextOffset - 2] === 255) {
                    offset += nextOffset - 2;
                    break;
                  }
                }
                throw new Error("unknown JPEG marker " + fileMarker.toString(16));
            }
            fileMarker = readUint16();
          }
          if (frames.length != 1)
            throw new Error("only single frame JPEGs supported");
          for (var i = 0; i < frames.length; i++) {
            var cp = frames[i].components;
            for (var j in cp) {
              cp[j].quantizationTable = quantizationTables[cp[j].quantizationIdx];
              delete cp[j].quantizationIdx;
            }
          }
          this.width = frame.samplesPerLine;
          this.height = frame.scanLines;
          this.jfif = jfif;
          this.adobe = adobe;
          this.components = [];
          for (var i = 0; i < frame.componentsOrder.length; i++) {
            var component = frame.components[frame.componentsOrder[i]];
            this.components.push({
              lines: buildComponentData(frame, component),
              scaleX: component.h / frame.maxH,
              scaleY: component.v / frame.maxV
            });
          }
        },
        getData: function getData(width2, height2) {
          var scaleX = this.width / width2, scaleY = this.height / height2;
          var component1, component2, component3, component4;
          var component1Line, component2Line, component3Line, component4Line;
          var x2, y2;
          var offset = 0;
          var Y, Cb, Cr, K2, C, M, Ye, R, G2, B;
          var colorTransform;
          var dataLength = width2 * height2 * this.components.length;
          requestMemoryAllocation(dataLength);
          var data2 = new Uint8Array(dataLength);
          switch (this.components.length) {
            case 1:
              component1 = this.components[0];
              for (y2 = 0; y2 < height2; y2++) {
                component1Line = component1.lines[0 | y2 * component1.scaleY * scaleY];
                for (x2 = 0; x2 < width2; x2++) {
                  Y = component1Line[0 | x2 * component1.scaleX * scaleX];
                  data2[offset++] = Y;
                }
              }
              break;
            case 2:
              component1 = this.components[0];
              component2 = this.components[1];
              for (y2 = 0; y2 < height2; y2++) {
                component1Line = component1.lines[0 | y2 * component1.scaleY * scaleY];
                component2Line = component2.lines[0 | y2 * component2.scaleY * scaleY];
                for (x2 = 0; x2 < width2; x2++) {
                  Y = component1Line[0 | x2 * component1.scaleX * scaleX];
                  data2[offset++] = Y;
                  Y = component2Line[0 | x2 * component2.scaleX * scaleX];
                  data2[offset++] = Y;
                }
              }
              break;
            case 3:
              colorTransform = true;
              if (this.adobe && this.adobe.transformCode)
                colorTransform = true;
              else if (typeof this.opts.colorTransform !== "undefined")
                colorTransform = !!this.opts.colorTransform;
              component1 = this.components[0];
              component2 = this.components[1];
              component3 = this.components[2];
              for (y2 = 0; y2 < height2; y2++) {
                component1Line = component1.lines[0 | y2 * component1.scaleY * scaleY];
                component2Line = component2.lines[0 | y2 * component2.scaleY * scaleY];
                component3Line = component3.lines[0 | y2 * component3.scaleY * scaleY];
                for (x2 = 0; x2 < width2; x2++) {
                  if (!colorTransform) {
                    R = component1Line[0 | x2 * component1.scaleX * scaleX];
                    G2 = component2Line[0 | x2 * component2.scaleX * scaleX];
                    B = component3Line[0 | x2 * component3.scaleX * scaleX];
                  } else {
                    Y = component1Line[0 | x2 * component1.scaleX * scaleX];
                    Cb = component2Line[0 | x2 * component2.scaleX * scaleX];
                    Cr = component3Line[0 | x2 * component3.scaleX * scaleX];
                    R = clampTo8bit(Y + 1.402 * (Cr - 128));
                    G2 = clampTo8bit(Y - 0.3441363 * (Cb - 128) - 0.71413636 * (Cr - 128));
                    B = clampTo8bit(Y + 1.772 * (Cb - 128));
                  }
                  data2[offset++] = R;
                  data2[offset++] = G2;
                  data2[offset++] = B;
                }
              }
              break;
            case 4:
              if (!this.adobe)
                throw new Error("Unsupported color mode (4 components)");
              colorTransform = false;
              if (this.adobe && this.adobe.transformCode)
                colorTransform = true;
              else if (typeof this.opts.colorTransform !== "undefined")
                colorTransform = !!this.opts.colorTransform;
              component1 = this.components[0];
              component2 = this.components[1];
              component3 = this.components[2];
              component4 = this.components[3];
              for (y2 = 0; y2 < height2; y2++) {
                component1Line = component1.lines[0 | y2 * component1.scaleY * scaleY];
                component2Line = component2.lines[0 | y2 * component2.scaleY * scaleY];
                component3Line = component3.lines[0 | y2 * component3.scaleY * scaleY];
                component4Line = component4.lines[0 | y2 * component4.scaleY * scaleY];
                for (x2 = 0; x2 < width2; x2++) {
                  if (!colorTransform) {
                    C = component1Line[0 | x2 * component1.scaleX * scaleX];
                    M = component2Line[0 | x2 * component2.scaleX * scaleX];
                    Ye = component3Line[0 | x2 * component3.scaleX * scaleX];
                    K2 = component4Line[0 | x2 * component4.scaleX * scaleX];
                  } else {
                    Y = component1Line[0 | x2 * component1.scaleX * scaleX];
                    Cb = component2Line[0 | x2 * component2.scaleX * scaleX];
                    Cr = component3Line[0 | x2 * component3.scaleX * scaleX];
                    K2 = component4Line[0 | x2 * component4.scaleX * scaleX];
                    C = 255 - clampTo8bit(Y + 1.402 * (Cr - 128));
                    M = 255 - clampTo8bit(Y - 0.3441363 * (Cb - 128) - 0.71413636 * (Cr - 128));
                    Ye = 255 - clampTo8bit(Y + 1.772 * (Cb - 128));
                  }
                  data2[offset++] = 255 - C;
                  data2[offset++] = 255 - M;
                  data2[offset++] = 255 - Ye;
                  data2[offset++] = 255 - K2;
                }
              }
              break;
            default:
              throw new Error("Unsupported color mode");
          }
          return data2;
        },
        copyToImageData: function copyToImageData(imageData, formatAsRGBA) {
          var width2 = imageData.width, height2 = imageData.height;
          var imageDataArray = imageData.data;
          var data2 = this.getData(width2, height2);
          var i = 0, j = 0, x2, y2;
          var Y, K2, C, M, R, G2, B;
          switch (this.components.length) {
            case 1:
              for (y2 = 0; y2 < height2; y2++) {
                for (x2 = 0; x2 < width2; x2++) {
                  Y = data2[i++];
                  imageDataArray[j++] = Y;
                  imageDataArray[j++] = Y;
                  imageDataArray[j++] = Y;
                  if (formatAsRGBA) {
                    imageDataArray[j++] = 255;
                  }
                }
              }
              break;
            case 3:
              for (y2 = 0; y2 < height2; y2++) {
                for (x2 = 0; x2 < width2; x2++) {
                  R = data2[i++];
                  G2 = data2[i++];
                  B = data2[i++];
                  imageDataArray[j++] = R;
                  imageDataArray[j++] = G2;
                  imageDataArray[j++] = B;
                  if (formatAsRGBA) {
                    imageDataArray[j++] = 255;
                  }
                }
              }
              break;
            case 4:
              for (y2 = 0; y2 < height2; y2++) {
                for (x2 = 0; x2 < width2; x2++) {
                  C = data2[i++];
                  M = data2[i++];
                  Y = data2[i++];
                  K2 = data2[i++];
                  R = 255 - clampTo8bit(C * (1 - K2 / 255) + K2);
                  G2 = 255 - clampTo8bit(M * (1 - K2 / 255) + K2);
                  B = 255 - clampTo8bit(Y * (1 - K2 / 255) + K2);
                  imageDataArray[j++] = R;
                  imageDataArray[j++] = G2;
                  imageDataArray[j++] = B;
                  if (formatAsRGBA) {
                    imageDataArray[j++] = 255;
                  }
                }
              }
              break;
            default:
              throw new Error("Unsupported color mode");
          }
        }
      };
      var totalBytesAllocated = 0;
      var maxMemoryUsageBytes = 0;
      function requestMemoryAllocation(increaseAmount = 0) {
        var totalMemoryImpactBytes = totalBytesAllocated + increaseAmount;
        if (totalMemoryImpactBytes > maxMemoryUsageBytes) {
          var exceededAmount = Math.ceil((totalMemoryImpactBytes - maxMemoryUsageBytes) / 1024 / 1024);
          throw new Error(`maxMemoryUsageInMB limit exceeded by at least ${exceededAmount}MB`);
        }
        totalBytesAllocated = totalMemoryImpactBytes;
      }
      constructor.resetMaxMemoryUsage = function(maxMemoryUsageBytes_) {
        totalBytesAllocated = 0;
        maxMemoryUsageBytes = maxMemoryUsageBytes_;
      };
      constructor.getBytesAllocated = function() {
        return totalBytesAllocated;
      };
      constructor.requestMemoryAllocation = requestMemoryAllocation;
      return constructor;
    })();
    if (typeof module !== "undefined") {
      module.exports = decode2;
    } else if (typeof window !== "undefined") {
      window["jpeg-js"] = window["jpeg-js"] || {};
      window["jpeg-js"].decode = decode2;
    }
    function decode2(jpegData, userOpts = {}) {
      var defaultOpts2 = {
        // "undefined" means "Choose whether to transform colors based on the image’s color model."
        colorTransform: void 0,
        useTArray: false,
        formatAsRGBA: true,
        tolerantDecoding: true,
        maxResolutionInMP: 100,
        // Don't decode more than 100 megapixels
        maxMemoryUsageInMB: 512
        // Don't decode if memory footprint is more than 512MB
      };
      var opts = { ...defaultOpts2, ...userOpts };
      var arr = new Uint8Array(jpegData);
      var decoder = new JpegImage();
      decoder.opts = opts;
      JpegImage.resetMaxMemoryUsage(opts.maxMemoryUsageInMB * 1024 * 1024);
      decoder.parse(arr);
      var channels = opts.formatAsRGBA ? 4 : 3;
      var bytesNeeded = decoder.width * decoder.height * channels;
      try {
        JpegImage.requestMemoryAllocation(bytesNeeded);
        var image = {
          width: decoder.width,
          height: decoder.height,
          exifBuffer: decoder.exifBuffer,
          data: opts.useTArray ? new Uint8Array(bytesNeeded) : Buffer.alloc(bytesNeeded)
        };
        if (decoder.comments.length > 0) {
          image["comments"] = decoder.comments;
        }
      } catch (err) {
        if (err instanceof RangeError) {
          throw new Error("Could not allocate enough memory for the image. Required: " + bytesNeeded);
        }
        if (err instanceof ReferenceError) {
          if (err.message === "Buffer is not defined") {
            throw new Error("Buffer is not globally defined in this environment. Consider setting useTArray to true");
          }
        }
        throw err;
      }
      decoder.copyToImageData(image, opts.formatAsRGBA);
      return image;
    }
  }
});

// node_modules/jpeg-js/index.js
var require_jpeg_js = __commonJS({
  "node_modules/jpeg-js/index.js"(exports, module) {
    var encode = require_encoder();
    var decode2 = require_decoder();
    module.exports = {
      encode,
      decode: decode2
    };
  }
});

// node_modules/pngjs/lib/chunkstream.js
var require_chunkstream = __commonJS({
  "node_modules/pngjs/lib/chunkstream.js"(exports, module) {
    "use strict";
    var util = __require("util");
    var Stream = __require("stream");
    var ChunkStream = module.exports = function() {
      Stream.call(this);
      this._buffers = [];
      this._buffered = 0;
      this._reads = [];
      this._paused = false;
      this._encoding = "utf8";
      this.writable = true;
    };
    util.inherits(ChunkStream, Stream);
    ChunkStream.prototype.read = function(length2, callback) {
      this._reads.push({
        length: Math.abs(length2),
        // if length < 0 then at most this length
        allowLess: length2 < 0,
        func: callback
      });
      process.nextTick(
        function() {
          this._process();
          if (this._paused && this._reads && this._reads.length > 0) {
            this._paused = false;
            this.emit("drain");
          }
        }.bind(this)
      );
    };
    ChunkStream.prototype.write = function(data2, encoding) {
      if (!this.writable) {
        this.emit("error", new Error("Stream not writable"));
        return false;
      }
      let dataBuffer;
      if (Buffer.isBuffer(data2)) {
        dataBuffer = data2;
      } else {
        dataBuffer = Buffer.from(data2, encoding || this._encoding);
      }
      this._buffers.push(dataBuffer);
      this._buffered += dataBuffer.length;
      this._process();
      if (this._reads && this._reads.length === 0) {
        this._paused = true;
      }
      return this.writable && !this._paused;
    };
    ChunkStream.prototype.end = function(data2, encoding) {
      if (data2) {
        this.write(data2, encoding);
      }
      this.writable = false;
      if (!this._buffers) {
        return;
      }
      if (this._buffers.length === 0) {
        this._end();
      } else {
        this._buffers.push(null);
        this._process();
      }
    };
    ChunkStream.prototype.destroySoon = ChunkStream.prototype.end;
    ChunkStream.prototype._end = function() {
      if (this._reads.length > 0) {
        this.emit("error", new Error("Unexpected end of input"));
      }
      this.destroy();
    };
    ChunkStream.prototype.destroy = function() {
      if (!this._buffers) {
        return;
      }
      this.writable = false;
      this._reads = null;
      this._buffers = null;
      this.emit("close");
    };
    ChunkStream.prototype._processReadAllowingLess = function(read) {
      this._reads.shift();
      let smallerBuf = this._buffers[0];
      if (smallerBuf.length > read.length) {
        this._buffered -= read.length;
        this._buffers[0] = smallerBuf.slice(read.length);
        read.func.call(this, smallerBuf.slice(0, read.length));
      } else {
        this._buffered -= smallerBuf.length;
        this._buffers.shift();
        read.func.call(this, smallerBuf);
      }
    };
    ChunkStream.prototype._processRead = function(read) {
      this._reads.shift();
      let pos = 0;
      let count = 0;
      let data2 = Buffer.alloc(read.length);
      while (pos < read.length) {
        let buf = this._buffers[count++];
        let len = Math.min(buf.length, read.length - pos);
        buf.copy(data2, pos, 0, len);
        pos += len;
        if (len !== buf.length) {
          this._buffers[--count] = buf.slice(len);
        }
      }
      if (count > 0) {
        this._buffers.splice(0, count);
      }
      this._buffered -= read.length;
      read.func.call(this, data2);
    };
    ChunkStream.prototype._process = function() {
      try {
        while (this._buffered > 0 && this._reads && this._reads.length > 0) {
          let read = this._reads[0];
          if (read.allowLess) {
            this._processReadAllowingLess(read);
          } else if (this._buffered >= read.length) {
            this._processRead(read);
          } else {
            break;
          }
        }
        if (this._buffers && !this.writable) {
          this._end();
        }
      } catch (ex) {
        this.emit("error", ex);
      }
    };
  }
});

// node_modules/pngjs/lib/interlace.js
var require_interlace = __commonJS({
  "node_modules/pngjs/lib/interlace.js"(exports) {
    "use strict";
    var imagePasses = [
      {
        // pass 1 - 1px
        x: [0],
        y: [0]
      },
      {
        // pass 2 - 1px
        x: [4],
        y: [0]
      },
      {
        // pass 3 - 2px
        x: [0, 4],
        y: [4]
      },
      {
        // pass 4 - 4px
        x: [2, 6],
        y: [0, 4]
      },
      {
        // pass 5 - 8px
        x: [0, 2, 4, 6],
        y: [2, 6]
      },
      {
        // pass 6 - 16px
        x: [1, 3, 5, 7],
        y: [0, 2, 4, 6]
      },
      {
        // pass 7 - 32px
        x: [0, 1, 2, 3, 4, 5, 6, 7],
        y: [1, 3, 5, 7]
      }
    ];
    exports.getImagePasses = function(width2, height2) {
      let images = [];
      let xLeftOver = width2 % 8;
      let yLeftOver = height2 % 8;
      let xRepeats = (width2 - xLeftOver) / 8;
      let yRepeats = (height2 - yLeftOver) / 8;
      for (let i = 0; i < imagePasses.length; i++) {
        let pass = imagePasses[i];
        let passWidth = xRepeats * pass.x.length;
        let passHeight = yRepeats * pass.y.length;
        for (let j = 0; j < pass.x.length; j++) {
          if (pass.x[j] < xLeftOver) {
            passWidth++;
          } else {
            break;
          }
        }
        for (let j = 0; j < pass.y.length; j++) {
          if (pass.y[j] < yLeftOver) {
            passHeight++;
          } else {
            break;
          }
        }
        if (passWidth > 0 && passHeight > 0) {
          images.push({ width: passWidth, height: passHeight, index: i });
        }
      }
      return images;
    };
    exports.getInterlaceIterator = function(width2) {
      return function(x2, y2, pass) {
        let outerXLeftOver = x2 % imagePasses[pass].x.length;
        let outerX = (x2 - outerXLeftOver) / imagePasses[pass].x.length * 8 + imagePasses[pass].x[outerXLeftOver];
        let outerYLeftOver = y2 % imagePasses[pass].y.length;
        let outerY = (y2 - outerYLeftOver) / imagePasses[pass].y.length * 8 + imagePasses[pass].y[outerYLeftOver];
        return outerX * 4 + outerY * width2 * 4;
      };
    };
  }
});

// node_modules/pngjs/lib/paeth-predictor.js
var require_paeth_predictor = __commonJS({
  "node_modules/pngjs/lib/paeth-predictor.js"(exports, module) {
    "use strict";
    module.exports = function paethPredictor(left, above, upLeft) {
      let paeth = left + above - upLeft;
      let pLeft = Math.abs(paeth - left);
      let pAbove = Math.abs(paeth - above);
      let pUpLeft = Math.abs(paeth - upLeft);
      if (pLeft <= pAbove && pLeft <= pUpLeft) {
        return left;
      }
      if (pAbove <= pUpLeft) {
        return above;
      }
      return upLeft;
    };
  }
});

// node_modules/pngjs/lib/filter-parse.js
var require_filter_parse = __commonJS({
  "node_modules/pngjs/lib/filter-parse.js"(exports, module) {
    "use strict";
    var interlaceUtils = require_interlace();
    var paethPredictor = require_paeth_predictor();
    function getByteWidth(width2, bpp, depth) {
      let byteWidth = width2 * bpp;
      if (depth !== 8) {
        byteWidth = Math.ceil(byteWidth / (8 / depth));
      }
      return byteWidth;
    }
    var Filter = module.exports = function(bitmapInfo, dependencies) {
      let width2 = bitmapInfo.width;
      let height2 = bitmapInfo.height;
      let interlace = bitmapInfo.interlace;
      let bpp = bitmapInfo.bpp;
      let depth = bitmapInfo.depth;
      this.read = dependencies.read;
      this.write = dependencies.write;
      this.complete = dependencies.complete;
      this._imageIndex = 0;
      this._images = [];
      if (interlace) {
        let passes = interlaceUtils.getImagePasses(width2, height2);
        for (let i = 0; i < passes.length; i++) {
          this._images.push({
            byteWidth: getByteWidth(passes[i].width, bpp, depth),
            height: passes[i].height,
            lineIndex: 0
          });
        }
      } else {
        this._images.push({
          byteWidth: getByteWidth(width2, bpp, depth),
          height: height2,
          lineIndex: 0
        });
      }
      if (depth === 8) {
        this._xComparison = bpp;
      } else if (depth === 16) {
        this._xComparison = bpp * 2;
      } else {
        this._xComparison = 1;
      }
    };
    Filter.prototype.start = function() {
      this.read(
        this._images[this._imageIndex].byteWidth + 1,
        this._reverseFilterLine.bind(this)
      );
    };
    Filter.prototype._unFilterType1 = function(rawData, unfilteredLine, byteWidth) {
      let xComparison = this._xComparison;
      let xBiggerThan = xComparison - 1;
      for (let x2 = 0; x2 < byteWidth; x2++) {
        let rawByte = rawData[1 + x2];
        let f1Left = x2 > xBiggerThan ? unfilteredLine[x2 - xComparison] : 0;
        unfilteredLine[x2] = rawByte + f1Left;
      }
    };
    Filter.prototype._unFilterType2 = function(rawData, unfilteredLine, byteWidth) {
      let lastLine = this._lastLine;
      for (let x2 = 0; x2 < byteWidth; x2++) {
        let rawByte = rawData[1 + x2];
        let f2Up = lastLine ? lastLine[x2] : 0;
        unfilteredLine[x2] = rawByte + f2Up;
      }
    };
    Filter.prototype._unFilterType3 = function(rawData, unfilteredLine, byteWidth) {
      let xComparison = this._xComparison;
      let xBiggerThan = xComparison - 1;
      let lastLine = this._lastLine;
      for (let x2 = 0; x2 < byteWidth; x2++) {
        let rawByte = rawData[1 + x2];
        let f3Up = lastLine ? lastLine[x2] : 0;
        let f3Left = x2 > xBiggerThan ? unfilteredLine[x2 - xComparison] : 0;
        let f3Add = Math.floor((f3Left + f3Up) / 2);
        unfilteredLine[x2] = rawByte + f3Add;
      }
    };
    Filter.prototype._unFilterType4 = function(rawData, unfilteredLine, byteWidth) {
      let xComparison = this._xComparison;
      let xBiggerThan = xComparison - 1;
      let lastLine = this._lastLine;
      for (let x2 = 0; x2 < byteWidth; x2++) {
        let rawByte = rawData[1 + x2];
        let f4Up = lastLine ? lastLine[x2] : 0;
        let f4Left = x2 > xBiggerThan ? unfilteredLine[x2 - xComparison] : 0;
        let f4UpLeft = x2 > xBiggerThan && lastLine ? lastLine[x2 - xComparison] : 0;
        let f4Add = paethPredictor(f4Left, f4Up, f4UpLeft);
        unfilteredLine[x2] = rawByte + f4Add;
      }
    };
    Filter.prototype._reverseFilterLine = function(rawData) {
      let filter4 = rawData[0];
      let unfilteredLine;
      let currentImage = this._images[this._imageIndex];
      let byteWidth = currentImage.byteWidth;
      if (filter4 === 0) {
        unfilteredLine = rawData.slice(1, byteWidth + 1);
      } else {
        unfilteredLine = Buffer.alloc(byteWidth);
        switch (filter4) {
          case 1:
            this._unFilterType1(rawData, unfilteredLine, byteWidth);
            break;
          case 2:
            this._unFilterType2(rawData, unfilteredLine, byteWidth);
            break;
          case 3:
            this._unFilterType3(rawData, unfilteredLine, byteWidth);
            break;
          case 4:
            this._unFilterType4(rawData, unfilteredLine, byteWidth);
            break;
          default:
            throw new Error("Unrecognised filter type - " + filter4);
        }
      }
      this.write(unfilteredLine);
      currentImage.lineIndex++;
      if (currentImage.lineIndex >= currentImage.height) {
        this._lastLine = null;
        this._imageIndex++;
        currentImage = this._images[this._imageIndex];
      } else {
        this._lastLine = unfilteredLine;
      }
      if (currentImage) {
        this.read(currentImage.byteWidth + 1, this._reverseFilterLine.bind(this));
      } else {
        this._lastLine = null;
        this.complete();
      }
    };
  }
});

// node_modules/pngjs/lib/filter-parse-async.js
var require_filter_parse_async = __commonJS({
  "node_modules/pngjs/lib/filter-parse-async.js"(exports, module) {
    "use strict";
    var util = __require("util");
    var ChunkStream = require_chunkstream();
    var Filter = require_filter_parse();
    var FilterAsync = module.exports = function(bitmapInfo) {
      ChunkStream.call(this);
      let buffers = [];
      let that = this;
      this._filter = new Filter(bitmapInfo, {
        read: this.read.bind(this),
        write: function(buffer) {
          buffers.push(buffer);
        },
        complete: function() {
          that.emit("complete", Buffer.concat(buffers));
        }
      });
      this._filter.start();
    };
    util.inherits(FilterAsync, ChunkStream);
  }
});

// node_modules/pngjs/lib/constants.js
var require_constants = __commonJS({
  "node_modules/pngjs/lib/constants.js"(exports, module) {
    "use strict";
    module.exports = {
      PNG_SIGNATURE: [137, 80, 78, 71, 13, 10, 26, 10],
      TYPE_IHDR: 1229472850,
      TYPE_IEND: 1229278788,
      TYPE_IDAT: 1229209940,
      TYPE_PLTE: 1347179589,
      TYPE_tRNS: 1951551059,
      // eslint-disable-line camelcase
      TYPE_gAMA: 1732332865,
      // eslint-disable-line camelcase
      // color-type bits
      COLORTYPE_GRAYSCALE: 0,
      COLORTYPE_PALETTE: 1,
      COLORTYPE_COLOR: 2,
      COLORTYPE_ALPHA: 4,
      // e.g. grayscale and alpha
      // color-type combinations
      COLORTYPE_PALETTE_COLOR: 3,
      COLORTYPE_COLOR_ALPHA: 6,
      COLORTYPE_TO_BPP_MAP: {
        0: 1,
        2: 3,
        3: 1,
        4: 2,
        6: 4
      },
      GAMMA_DIVISION: 1e5
    };
  }
});

// node_modules/pngjs/lib/crc.js
var require_crc = __commonJS({
  "node_modules/pngjs/lib/crc.js"(exports, module) {
    "use strict";
    var crcTable = [];
    (function() {
      for (let i = 0; i < 256; i++) {
        let currentCrc = i;
        for (let j = 0; j < 8; j++) {
          if (currentCrc & 1) {
            currentCrc = 3988292384 ^ currentCrc >>> 1;
          } else {
            currentCrc = currentCrc >>> 1;
          }
        }
        crcTable[i] = currentCrc;
      }
    })();
    var CrcCalculator = module.exports = function() {
      this._crc = -1;
    };
    CrcCalculator.prototype.write = function(data2) {
      for (let i = 0; i < data2.length; i++) {
        this._crc = crcTable[(this._crc ^ data2[i]) & 255] ^ this._crc >>> 8;
      }
      return true;
    };
    CrcCalculator.prototype.crc32 = function() {
      return this._crc ^ -1;
    };
    CrcCalculator.crc32 = function(buf) {
      let crc = -1;
      for (let i = 0; i < buf.length; i++) {
        crc = crcTable[(crc ^ buf[i]) & 255] ^ crc >>> 8;
      }
      return crc ^ -1;
    };
  }
});

// node_modules/pngjs/lib/parser.js
var require_parser = __commonJS({
  "node_modules/pngjs/lib/parser.js"(exports, module) {
    "use strict";
    var constants = require_constants();
    var CrcCalculator = require_crc();
    var Parser3 = module.exports = function(options, dependencies) {
      this._options = options;
      options.checkCRC = options.checkCRC !== false;
      this._hasIHDR = false;
      this._hasIEND = false;
      this._emittedHeadersFinished = false;
      this._palette = [];
      this._colorType = 0;
      this._chunks = {};
      this._chunks[constants.TYPE_IHDR] = this._handleIHDR.bind(this);
      this._chunks[constants.TYPE_IEND] = this._handleIEND.bind(this);
      this._chunks[constants.TYPE_IDAT] = this._handleIDAT.bind(this);
      this._chunks[constants.TYPE_PLTE] = this._handlePLTE.bind(this);
      this._chunks[constants.TYPE_tRNS] = this._handleTRNS.bind(this);
      this._chunks[constants.TYPE_gAMA] = this._handleGAMA.bind(this);
      this.read = dependencies.read;
      this.error = dependencies.error;
      this.metadata = dependencies.metadata;
      this.gamma = dependencies.gamma;
      this.transColor = dependencies.transColor;
      this.palette = dependencies.palette;
      this.parsed = dependencies.parsed;
      this.inflateData = dependencies.inflateData;
      this.finished = dependencies.finished;
      this.simpleTransparency = dependencies.simpleTransparency;
      this.headersFinished = dependencies.headersFinished || function() {
      };
    };
    Parser3.prototype.start = function() {
      this.read(constants.PNG_SIGNATURE.length, this._parseSignature.bind(this));
    };
    Parser3.prototype._parseSignature = function(data2) {
      let signature = constants.PNG_SIGNATURE;
      for (let i = 0; i < signature.length; i++) {
        if (data2[i] !== signature[i]) {
          this.error(new Error("Invalid file signature"));
          return;
        }
      }
      this.read(8, this._parseChunkBegin.bind(this));
    };
    Parser3.prototype._parseChunkBegin = function(data2) {
      let length2 = data2.readUInt32BE(0);
      let type = data2.readUInt32BE(4);
      let name = "";
      for (let i = 4; i < 8; i++) {
        name += String.fromCharCode(data2[i]);
      }
      let ancillary = Boolean(data2[4] & 32);
      if (!this._hasIHDR && type !== constants.TYPE_IHDR) {
        this.error(new Error("Expected IHDR on beggining"));
        return;
      }
      this._crc = new CrcCalculator();
      this._crc.write(Buffer.from(name));
      if (this._chunks[type]) {
        return this._chunks[type](length2);
      }
      if (!ancillary) {
        this.error(new Error("Unsupported critical chunk type " + name));
        return;
      }
      this.read(length2 + 4, this._skipChunk.bind(this));
    };
    Parser3.prototype._skipChunk = function() {
      this.read(8, this._parseChunkBegin.bind(this));
    };
    Parser3.prototype._handleChunkEnd = function() {
      this.read(4, this._parseChunkEnd.bind(this));
    };
    Parser3.prototype._parseChunkEnd = function(data2) {
      let fileCrc = data2.readInt32BE(0);
      let calcCrc = this._crc.crc32();
      if (this._options.checkCRC && calcCrc !== fileCrc) {
        this.error(new Error("Crc error - " + fileCrc + " - " + calcCrc));
        return;
      }
      if (!this._hasIEND) {
        this.read(8, this._parseChunkBegin.bind(this));
      }
    };
    Parser3.prototype._handleIHDR = function(length2) {
      this.read(length2, this._parseIHDR.bind(this));
    };
    Parser3.prototype._parseIHDR = function(data2) {
      this._crc.write(data2);
      let width2 = data2.readUInt32BE(0);
      let height2 = data2.readUInt32BE(4);
      let depth = data2[8];
      let colorType = data2[9];
      let compr = data2[10];
      let filter4 = data2[11];
      let interlace = data2[12];
      if (depth !== 8 && depth !== 4 && depth !== 2 && depth !== 1 && depth !== 16) {
        this.error(new Error("Unsupported bit depth " + depth));
        return;
      }
      if (!(colorType in constants.COLORTYPE_TO_BPP_MAP)) {
        this.error(new Error("Unsupported color type"));
        return;
      }
      if (compr !== 0) {
        this.error(new Error("Unsupported compression method"));
        return;
      }
      if (filter4 !== 0) {
        this.error(new Error("Unsupported filter method"));
        return;
      }
      if (interlace !== 0 && interlace !== 1) {
        this.error(new Error("Unsupported interlace method"));
        return;
      }
      this._colorType = colorType;
      let bpp = constants.COLORTYPE_TO_BPP_MAP[this._colorType];
      this._hasIHDR = true;
      this.metadata({
        width: width2,
        height: height2,
        depth,
        interlace: Boolean(interlace),
        palette: Boolean(colorType & constants.COLORTYPE_PALETTE),
        color: Boolean(colorType & constants.COLORTYPE_COLOR),
        alpha: Boolean(colorType & constants.COLORTYPE_ALPHA),
        bpp,
        colorType
      });
      this._handleChunkEnd();
    };
    Parser3.prototype._handlePLTE = function(length2) {
      this.read(length2, this._parsePLTE.bind(this));
    };
    Parser3.prototype._parsePLTE = function(data2) {
      this._crc.write(data2);
      let entries2 = Math.floor(data2.length / 3);
      for (let i = 0; i < entries2; i++) {
        this._palette.push([data2[i * 3], data2[i * 3 + 1], data2[i * 3 + 2], 255]);
      }
      this.palette(this._palette);
      this._handleChunkEnd();
    };
    Parser3.prototype._handleTRNS = function(length2) {
      this.simpleTransparency();
      this.read(length2, this._parseTRNS.bind(this));
    };
    Parser3.prototype._parseTRNS = function(data2) {
      this._crc.write(data2);
      if (this._colorType === constants.COLORTYPE_PALETTE_COLOR) {
        if (this._palette.length === 0) {
          this.error(new Error("Transparency chunk must be after palette"));
          return;
        }
        if (data2.length > this._palette.length) {
          this.error(new Error("More transparent colors than palette size"));
          return;
        }
        for (let i = 0; i < data2.length; i++) {
          this._palette[i][3] = data2[i];
        }
        this.palette(this._palette);
      }
      if (this._colorType === constants.COLORTYPE_GRAYSCALE) {
        this.transColor([data2.readUInt16BE(0)]);
      }
      if (this._colorType === constants.COLORTYPE_COLOR) {
        this.transColor([
          data2.readUInt16BE(0),
          data2.readUInt16BE(2),
          data2.readUInt16BE(4)
        ]);
      }
      this._handleChunkEnd();
    };
    Parser3.prototype._handleGAMA = function(length2) {
      this.read(length2, this._parseGAMA.bind(this));
    };
    Parser3.prototype._parseGAMA = function(data2) {
      this._crc.write(data2);
      this.gamma(data2.readUInt32BE(0) / constants.GAMMA_DIVISION);
      this._handleChunkEnd();
    };
    Parser3.prototype._handleIDAT = function(length2) {
      if (!this._emittedHeadersFinished) {
        this._emittedHeadersFinished = true;
        this.headersFinished();
      }
      this.read(-length2, this._parseIDAT.bind(this, length2));
    };
    Parser3.prototype._parseIDAT = function(length2, data2) {
      this._crc.write(data2);
      if (this._colorType === constants.COLORTYPE_PALETTE_COLOR && this._palette.length === 0) {
        throw new Error("Expected palette not found");
      }
      this.inflateData(data2);
      let leftOverLength = length2 - data2.length;
      if (leftOverLength > 0) {
        this._handleIDAT(leftOverLength);
      } else {
        this._handleChunkEnd();
      }
    };
    Parser3.prototype._handleIEND = function(length2) {
      this.read(length2, this._parseIEND.bind(this));
    };
    Parser3.prototype._parseIEND = function(data2) {
      this._crc.write(data2);
      this._hasIEND = true;
      this._handleChunkEnd();
      if (this.finished) {
        this.finished();
      }
    };
  }
});

// node_modules/pngjs/lib/bitmapper.js
var require_bitmapper = __commonJS({
  "node_modules/pngjs/lib/bitmapper.js"(exports) {
    "use strict";
    var interlaceUtils = require_interlace();
    var pixelBppMapper = [
      // 0 - dummy entry
      function() {
      },
      // 1 - L
      // 0: 0, 1: 0, 2: 0, 3: 0xff
      function(pxData, data2, pxPos, rawPos) {
        if (rawPos === data2.length) {
          throw new Error("Ran out of data");
        }
        let pixel = data2[rawPos];
        pxData[pxPos] = pixel;
        pxData[pxPos + 1] = pixel;
        pxData[pxPos + 2] = pixel;
        pxData[pxPos + 3] = 255;
      },
      // 2 - LA
      // 0: 0, 1: 0, 2: 0, 3: 1
      function(pxData, data2, pxPos, rawPos) {
        if (rawPos + 1 >= data2.length) {
          throw new Error("Ran out of data");
        }
        let pixel = data2[rawPos];
        pxData[pxPos] = pixel;
        pxData[pxPos + 1] = pixel;
        pxData[pxPos + 2] = pixel;
        pxData[pxPos + 3] = data2[rawPos + 1];
      },
      // 3 - RGB
      // 0: 0, 1: 1, 2: 2, 3: 0xff
      function(pxData, data2, pxPos, rawPos) {
        if (rawPos + 2 >= data2.length) {
          throw new Error("Ran out of data");
        }
        pxData[pxPos] = data2[rawPos];
        pxData[pxPos + 1] = data2[rawPos + 1];
        pxData[pxPos + 2] = data2[rawPos + 2];
        pxData[pxPos + 3] = 255;
      },
      // 4 - RGBA
      // 0: 0, 1: 1, 2: 2, 3: 3
      function(pxData, data2, pxPos, rawPos) {
        if (rawPos + 3 >= data2.length) {
          throw new Error("Ran out of data");
        }
        pxData[pxPos] = data2[rawPos];
        pxData[pxPos + 1] = data2[rawPos + 1];
        pxData[pxPos + 2] = data2[rawPos + 2];
        pxData[pxPos + 3] = data2[rawPos + 3];
      }
    ];
    var pixelBppCustomMapper = [
      // 0 - dummy entry
      function() {
      },
      // 1 - L
      // 0: 0, 1: 0, 2: 0, 3: 0xff
      function(pxData, pixelData, pxPos, maxBit) {
        let pixel = pixelData[0];
        pxData[pxPos] = pixel;
        pxData[pxPos + 1] = pixel;
        pxData[pxPos + 2] = pixel;
        pxData[pxPos + 3] = maxBit;
      },
      // 2 - LA
      // 0: 0, 1: 0, 2: 0, 3: 1
      function(pxData, pixelData, pxPos) {
        let pixel = pixelData[0];
        pxData[pxPos] = pixel;
        pxData[pxPos + 1] = pixel;
        pxData[pxPos + 2] = pixel;
        pxData[pxPos + 3] = pixelData[1];
      },
      // 3 - RGB
      // 0: 0, 1: 1, 2: 2, 3: 0xff
      function(pxData, pixelData, pxPos, maxBit) {
        pxData[pxPos] = pixelData[0];
        pxData[pxPos + 1] = pixelData[1];
        pxData[pxPos + 2] = pixelData[2];
        pxData[pxPos + 3] = maxBit;
      },
      // 4 - RGBA
      // 0: 0, 1: 1, 2: 2, 3: 3
      function(pxData, pixelData, pxPos) {
        pxData[pxPos] = pixelData[0];
        pxData[pxPos + 1] = pixelData[1];
        pxData[pxPos + 2] = pixelData[2];
        pxData[pxPos + 3] = pixelData[3];
      }
    ];
    function bitRetriever(data2, depth) {
      let leftOver = [];
      let i = 0;
      function split() {
        if (i === data2.length) {
          throw new Error("Ran out of data");
        }
        let byte = data2[i];
        i++;
        let byte8, byte7, byte6, byte5, byte4, byte3, byte2, byte1;
        switch (depth) {
          default:
            throw new Error("unrecognised depth");
          case 16:
            byte2 = data2[i];
            i++;
            leftOver.push((byte << 8) + byte2);
            break;
          case 4:
            byte2 = byte & 15;
            byte1 = byte >> 4;
            leftOver.push(byte1, byte2);
            break;
          case 2:
            byte4 = byte & 3;
            byte3 = byte >> 2 & 3;
            byte2 = byte >> 4 & 3;
            byte1 = byte >> 6 & 3;
            leftOver.push(byte1, byte2, byte3, byte4);
            break;
          case 1:
            byte8 = byte & 1;
            byte7 = byte >> 1 & 1;
            byte6 = byte >> 2 & 1;
            byte5 = byte >> 3 & 1;
            byte4 = byte >> 4 & 1;
            byte3 = byte >> 5 & 1;
            byte2 = byte >> 6 & 1;
            byte1 = byte >> 7 & 1;
            leftOver.push(byte1, byte2, byte3, byte4, byte5, byte6, byte7, byte8);
            break;
        }
      }
      return {
        get: function(count) {
          while (leftOver.length < count) {
            split();
          }
          let returner = leftOver.slice(0, count);
          leftOver = leftOver.slice(count);
          return returner;
        },
        resetAfterLine: function() {
          leftOver.length = 0;
        },
        end: function() {
          if (i !== data2.length) {
            throw new Error("extra data found");
          }
        }
      };
    }
    function mapImage8Bit(image, pxData, getPxPos, bpp, data2, rawPos) {
      let imageWidth = image.width;
      let imageHeight = image.height;
      let imagePass = image.index;
      for (let y2 = 0; y2 < imageHeight; y2++) {
        for (let x2 = 0; x2 < imageWidth; x2++) {
          let pxPos = getPxPos(x2, y2, imagePass);
          pixelBppMapper[bpp](pxData, data2, pxPos, rawPos);
          rawPos += bpp;
        }
      }
      return rawPos;
    }
    function mapImageCustomBit(image, pxData, getPxPos, bpp, bits, maxBit) {
      let imageWidth = image.width;
      let imageHeight = image.height;
      let imagePass = image.index;
      for (let y2 = 0; y2 < imageHeight; y2++) {
        for (let x2 = 0; x2 < imageWidth; x2++) {
          let pixelData = bits.get(bpp);
          let pxPos = getPxPos(x2, y2, imagePass);
          pixelBppCustomMapper[bpp](pxData, pixelData, pxPos, maxBit);
        }
        bits.resetAfterLine();
      }
    }
    exports.dataToBitMap = function(data2, bitmapInfo) {
      let width2 = bitmapInfo.width;
      let height2 = bitmapInfo.height;
      let depth = bitmapInfo.depth;
      let bpp = bitmapInfo.bpp;
      let interlace = bitmapInfo.interlace;
      let bits;
      if (depth !== 8) {
        bits = bitRetriever(data2, depth);
      }
      let pxData;
      if (depth <= 8) {
        pxData = Buffer.alloc(width2 * height2 * 4);
      } else {
        pxData = new Uint16Array(width2 * height2 * 4);
      }
      let maxBit = Math.pow(2, depth) - 1;
      let rawPos = 0;
      let images;
      let getPxPos;
      if (interlace) {
        images = interlaceUtils.getImagePasses(width2, height2);
        getPxPos = interlaceUtils.getInterlaceIterator(width2, height2);
      } else {
        let nonInterlacedPxPos = 0;
        getPxPos = function() {
          let returner = nonInterlacedPxPos;
          nonInterlacedPxPos += 4;
          return returner;
        };
        images = [{ width: width2, height: height2 }];
      }
      for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
        if (depth === 8) {
          rawPos = mapImage8Bit(
            images[imageIndex],
            pxData,
            getPxPos,
            bpp,
            data2,
            rawPos
          );
        } else {
          mapImageCustomBit(
            images[imageIndex],
            pxData,
            getPxPos,
            bpp,
            bits,
            maxBit
          );
        }
      }
      if (depth === 8) {
        if (rawPos !== data2.length) {
          throw new Error("extra data found");
        }
      } else {
        bits.end();
      }
      return pxData;
    };
  }
});

// node_modules/pngjs/lib/format-normaliser.js
var require_format_normaliser = __commonJS({
  "node_modules/pngjs/lib/format-normaliser.js"(exports, module) {
    "use strict";
    function dePalette(indata, outdata, width2, height2, palette) {
      let pxPos = 0;
      for (let y2 = 0; y2 < height2; y2++) {
        for (let x2 = 0; x2 < width2; x2++) {
          let color = palette[indata[pxPos]];
          if (!color) {
            throw new Error("index " + indata[pxPos] + " not in palette");
          }
          for (let i = 0; i < 4; i++) {
            outdata[pxPos + i] = color[i];
          }
          pxPos += 4;
        }
      }
    }
    function replaceTransparentColor(indata, outdata, width2, height2, transColor) {
      let pxPos = 0;
      for (let y2 = 0; y2 < height2; y2++) {
        for (let x2 = 0; x2 < width2; x2++) {
          let makeTrans = false;
          if (transColor.length === 1) {
            if (transColor[0] === indata[pxPos]) {
              makeTrans = true;
            }
          } else if (transColor[0] === indata[pxPos] && transColor[1] === indata[pxPos + 1] && transColor[2] === indata[pxPos + 2]) {
            makeTrans = true;
          }
          if (makeTrans) {
            for (let i = 0; i < 4; i++) {
              outdata[pxPos + i] = 0;
            }
          }
          pxPos += 4;
        }
      }
    }
    function scaleDepth(indata, outdata, width2, height2, depth) {
      let maxOutSample = 255;
      let maxInSample = Math.pow(2, depth) - 1;
      let pxPos = 0;
      for (let y2 = 0; y2 < height2; y2++) {
        for (let x2 = 0; x2 < width2; x2++) {
          for (let i = 0; i < 4; i++) {
            outdata[pxPos + i] = Math.floor(
              indata[pxPos + i] * maxOutSample / maxInSample + 0.5
            );
          }
          pxPos += 4;
        }
      }
    }
    module.exports = function(indata, imageData, skipRescale = false) {
      let depth = imageData.depth;
      let width2 = imageData.width;
      let height2 = imageData.height;
      let colorType = imageData.colorType;
      let transColor = imageData.transColor;
      let palette = imageData.palette;
      let outdata = indata;
      if (colorType === 3) {
        dePalette(indata, outdata, width2, height2, palette);
      } else {
        if (transColor) {
          replaceTransparentColor(indata, outdata, width2, height2, transColor);
        }
        if (depth !== 8 && !skipRescale) {
          if (depth === 16) {
            outdata = Buffer.alloc(width2 * height2 * 4);
          }
          scaleDepth(indata, outdata, width2, height2, depth);
        }
      }
      return outdata;
    };
  }
});

// node_modules/pngjs/lib/parser-async.js
var require_parser_async = __commonJS({
  "node_modules/pngjs/lib/parser-async.js"(exports, module) {
    "use strict";
    var util = __require("util");
    var zlib = __require("zlib");
    var ChunkStream = require_chunkstream();
    var FilterAsync = require_filter_parse_async();
    var Parser3 = require_parser();
    var bitmapper = require_bitmapper();
    var formatNormaliser = require_format_normaliser();
    var ParserAsync = module.exports = function(options) {
      ChunkStream.call(this);
      this._parser = new Parser3(options, {
        read: this.read.bind(this),
        error: this._handleError.bind(this),
        metadata: this._handleMetaData.bind(this),
        gamma: this.emit.bind(this, "gamma"),
        palette: this._handlePalette.bind(this),
        transColor: this._handleTransColor.bind(this),
        finished: this._finished.bind(this),
        inflateData: this._inflateData.bind(this),
        simpleTransparency: this._simpleTransparency.bind(this),
        headersFinished: this._headersFinished.bind(this)
      });
      this._options = options;
      this.writable = true;
      this._parser.start();
    };
    util.inherits(ParserAsync, ChunkStream);
    ParserAsync.prototype._handleError = function(err) {
      this.emit("error", err);
      this.writable = false;
      this.destroy();
      if (this._inflate && this._inflate.destroy) {
        this._inflate.destroy();
      }
      if (this._filter) {
        this._filter.destroy();
        this._filter.on("error", function() {
        });
      }
      this.errord = true;
    };
    ParserAsync.prototype._inflateData = function(data2) {
      if (!this._inflate) {
        if (this._bitmapInfo.interlace) {
          this._inflate = zlib.createInflate();
          this._inflate.on("error", this.emit.bind(this, "error"));
          this._filter.on("complete", this._complete.bind(this));
          this._inflate.pipe(this._filter);
        } else {
          let rowSize = (this._bitmapInfo.width * this._bitmapInfo.bpp * this._bitmapInfo.depth + 7 >> 3) + 1;
          let imageSize = rowSize * this._bitmapInfo.height;
          let chunkSize = Math.max(imageSize, zlib.Z_MIN_CHUNK);
          this._inflate = zlib.createInflate({ chunkSize });
          let leftToInflate = imageSize;
          let emitError = this.emit.bind(this, "error");
          this._inflate.on("error", function(err) {
            if (!leftToInflate) {
              return;
            }
            emitError(err);
          });
          this._filter.on("complete", this._complete.bind(this));
          let filterWrite = this._filter.write.bind(this._filter);
          this._inflate.on("data", function(chunk) {
            if (!leftToInflate) {
              return;
            }
            if (chunk.length > leftToInflate) {
              chunk = chunk.slice(0, leftToInflate);
            }
            leftToInflate -= chunk.length;
            filterWrite(chunk);
          });
          this._inflate.on("end", this._filter.end.bind(this._filter));
        }
      }
      this._inflate.write(data2);
    };
    ParserAsync.prototype._handleMetaData = function(metaData) {
      this._metaData = metaData;
      this._bitmapInfo = Object.create(metaData);
      this._filter = new FilterAsync(this._bitmapInfo);
    };
    ParserAsync.prototype._handleTransColor = function(transColor) {
      this._bitmapInfo.transColor = transColor;
    };
    ParserAsync.prototype._handlePalette = function(palette) {
      this._bitmapInfo.palette = palette;
    };
    ParserAsync.prototype._simpleTransparency = function() {
      this._metaData.alpha = true;
    };
    ParserAsync.prototype._headersFinished = function() {
      this.emit("metadata", this._metaData);
    };
    ParserAsync.prototype._finished = function() {
      if (this.errord) {
        return;
      }
      if (!this._inflate) {
        this.emit("error", "No Inflate block");
      } else {
        this._inflate.end();
      }
    };
    ParserAsync.prototype._complete = function(filteredData) {
      if (this.errord) {
        return;
      }
      let normalisedBitmapData;
      try {
        let bitmapData = bitmapper.dataToBitMap(filteredData, this._bitmapInfo);
        normalisedBitmapData = formatNormaliser(
          bitmapData,
          this._bitmapInfo,
          this._options.skipRescale
        );
        bitmapData = null;
      } catch (ex) {
        this._handleError(ex);
        return;
      }
      this.emit("parsed", normalisedBitmapData);
    };
  }
});

// node_modules/pngjs/lib/bitpacker.js
var require_bitpacker = __commonJS({
  "node_modules/pngjs/lib/bitpacker.js"(exports, module) {
    "use strict";
    var constants = require_constants();
    module.exports = function(dataIn, width2, height2, options) {
      let outHasAlpha = [constants.COLORTYPE_COLOR_ALPHA, constants.COLORTYPE_ALPHA].indexOf(
        options.colorType
      ) !== -1;
      if (options.colorType === options.inputColorType) {
        let bigEndian = (function() {
          let buffer = new ArrayBuffer(2);
          new DataView(buffer).setInt16(
            0,
            256,
            true
            /* littleEndian */
          );
          return new Int16Array(buffer)[0] !== 256;
        })();
        if (options.bitDepth === 8 || options.bitDepth === 16 && bigEndian) {
          return dataIn;
        }
      }
      let data2 = options.bitDepth !== 16 ? dataIn : new Uint16Array(dataIn.buffer);
      let maxValue = 255;
      let inBpp = constants.COLORTYPE_TO_BPP_MAP[options.inputColorType];
      if (inBpp === 4 && !options.inputHasAlpha) {
        inBpp = 3;
      }
      let outBpp = constants.COLORTYPE_TO_BPP_MAP[options.colorType];
      if (options.bitDepth === 16) {
        maxValue = 65535;
        outBpp *= 2;
      }
      let outData = Buffer.alloc(width2 * height2 * outBpp);
      let inIndex = 0;
      let outIndex = 0;
      let bgColor = options.bgColor || {};
      if (bgColor.red === void 0) {
        bgColor.red = maxValue;
      }
      if (bgColor.green === void 0) {
        bgColor.green = maxValue;
      }
      if (bgColor.blue === void 0) {
        bgColor.blue = maxValue;
      }
      function getRGBA() {
        let red;
        let green;
        let blue;
        let alpha = maxValue;
        switch (options.inputColorType) {
          case constants.COLORTYPE_COLOR_ALPHA:
            alpha = data2[inIndex + 3];
            red = data2[inIndex];
            green = data2[inIndex + 1];
            blue = data2[inIndex + 2];
            break;
          case constants.COLORTYPE_COLOR:
            red = data2[inIndex];
            green = data2[inIndex + 1];
            blue = data2[inIndex + 2];
            break;
          case constants.COLORTYPE_ALPHA:
            alpha = data2[inIndex + 1];
            red = data2[inIndex];
            green = red;
            blue = red;
            break;
          case constants.COLORTYPE_GRAYSCALE:
            red = data2[inIndex];
            green = red;
            blue = red;
            break;
          default:
            throw new Error(
              "input color type:" + options.inputColorType + " is not supported at present"
            );
        }
        if (options.inputHasAlpha) {
          if (!outHasAlpha) {
            alpha /= maxValue;
            red = Math.min(
              Math.max(Math.round((1 - alpha) * bgColor.red + alpha * red), 0),
              maxValue
            );
            green = Math.min(
              Math.max(Math.round((1 - alpha) * bgColor.green + alpha * green), 0),
              maxValue
            );
            blue = Math.min(
              Math.max(Math.round((1 - alpha) * bgColor.blue + alpha * blue), 0),
              maxValue
            );
          }
        }
        return { red, green, blue, alpha };
      }
      for (let y2 = 0; y2 < height2; y2++) {
        for (let x2 = 0; x2 < width2; x2++) {
          let rgba = getRGBA(data2, inIndex);
          switch (options.colorType) {
            case constants.COLORTYPE_COLOR_ALPHA:
            case constants.COLORTYPE_COLOR:
              if (options.bitDepth === 8) {
                outData[outIndex] = rgba.red;
                outData[outIndex + 1] = rgba.green;
                outData[outIndex + 2] = rgba.blue;
                if (outHasAlpha) {
                  outData[outIndex + 3] = rgba.alpha;
                }
              } else {
                outData.writeUInt16BE(rgba.red, outIndex);
                outData.writeUInt16BE(rgba.green, outIndex + 2);
                outData.writeUInt16BE(rgba.blue, outIndex + 4);
                if (outHasAlpha) {
                  outData.writeUInt16BE(rgba.alpha, outIndex + 6);
                }
              }
              break;
            case constants.COLORTYPE_ALPHA:
            case constants.COLORTYPE_GRAYSCALE: {
              let grayscale = (rgba.red + rgba.green + rgba.blue) / 3;
              if (options.bitDepth === 8) {
                outData[outIndex] = grayscale;
                if (outHasAlpha) {
                  outData[outIndex + 1] = rgba.alpha;
                }
              } else {
                outData.writeUInt16BE(grayscale, outIndex);
                if (outHasAlpha) {
                  outData.writeUInt16BE(rgba.alpha, outIndex + 2);
                }
              }
              break;
            }
            default:
              throw new Error("unrecognised color Type " + options.colorType);
          }
          inIndex += inBpp;
          outIndex += outBpp;
        }
      }
      return outData;
    };
  }
});

// node_modules/pngjs/lib/filter-pack.js
var require_filter_pack = __commonJS({
  "node_modules/pngjs/lib/filter-pack.js"(exports, module) {
    "use strict";
    var paethPredictor = require_paeth_predictor();
    function filterNone(pxData, pxPos, byteWidth, rawData, rawPos) {
      for (let x2 = 0; x2 < byteWidth; x2++) {
        rawData[rawPos + x2] = pxData[pxPos + x2];
      }
    }
    function filterSumNone(pxData, pxPos, byteWidth) {
      let sum = 0;
      let length2 = pxPos + byteWidth;
      for (let i = pxPos; i < length2; i++) {
        sum += Math.abs(pxData[i]);
      }
      return sum;
    }
    function filterSub(pxData, pxPos, byteWidth, rawData, rawPos, bpp) {
      for (let x2 = 0; x2 < byteWidth; x2++) {
        let left = x2 >= bpp ? pxData[pxPos + x2 - bpp] : 0;
        let val = pxData[pxPos + x2] - left;
        rawData[rawPos + x2] = val;
      }
    }
    function filterSumSub(pxData, pxPos, byteWidth, bpp) {
      let sum = 0;
      for (let x2 = 0; x2 < byteWidth; x2++) {
        let left = x2 >= bpp ? pxData[pxPos + x2 - bpp] : 0;
        let val = pxData[pxPos + x2] - left;
        sum += Math.abs(val);
      }
      return sum;
    }
    function filterUp(pxData, pxPos, byteWidth, rawData, rawPos) {
      for (let x2 = 0; x2 < byteWidth; x2++) {
        let up = pxPos > 0 ? pxData[pxPos + x2 - byteWidth] : 0;
        let val = pxData[pxPos + x2] - up;
        rawData[rawPos + x2] = val;
      }
    }
    function filterSumUp(pxData, pxPos, byteWidth) {
      let sum = 0;
      let length2 = pxPos + byteWidth;
      for (let x2 = pxPos; x2 < length2; x2++) {
        let up = pxPos > 0 ? pxData[x2 - byteWidth] : 0;
        let val = pxData[x2] - up;
        sum += Math.abs(val);
      }
      return sum;
    }
    function filterAvg(pxData, pxPos, byteWidth, rawData, rawPos, bpp) {
      for (let x2 = 0; x2 < byteWidth; x2++) {
        let left = x2 >= bpp ? pxData[pxPos + x2 - bpp] : 0;
        let up = pxPos > 0 ? pxData[pxPos + x2 - byteWidth] : 0;
        let val = pxData[pxPos + x2] - (left + up >> 1);
        rawData[rawPos + x2] = val;
      }
    }
    function filterSumAvg(pxData, pxPos, byteWidth, bpp) {
      let sum = 0;
      for (let x2 = 0; x2 < byteWidth; x2++) {
        let left = x2 >= bpp ? pxData[pxPos + x2 - bpp] : 0;
        let up = pxPos > 0 ? pxData[pxPos + x2 - byteWidth] : 0;
        let val = pxData[pxPos + x2] - (left + up >> 1);
        sum += Math.abs(val);
      }
      return sum;
    }
    function filterPaeth(pxData, pxPos, byteWidth, rawData, rawPos, bpp) {
      for (let x2 = 0; x2 < byteWidth; x2++) {
        let left = x2 >= bpp ? pxData[pxPos + x2 - bpp] : 0;
        let up = pxPos > 0 ? pxData[pxPos + x2 - byteWidth] : 0;
        let upleft = pxPos > 0 && x2 >= bpp ? pxData[pxPos + x2 - (byteWidth + bpp)] : 0;
        let val = pxData[pxPos + x2] - paethPredictor(left, up, upleft);
        rawData[rawPos + x2] = val;
      }
    }
    function filterSumPaeth(pxData, pxPos, byteWidth, bpp) {
      let sum = 0;
      for (let x2 = 0; x2 < byteWidth; x2++) {
        let left = x2 >= bpp ? pxData[pxPos + x2 - bpp] : 0;
        let up = pxPos > 0 ? pxData[pxPos + x2 - byteWidth] : 0;
        let upleft = pxPos > 0 && x2 >= bpp ? pxData[pxPos + x2 - (byteWidth + bpp)] : 0;
        let val = pxData[pxPos + x2] - paethPredictor(left, up, upleft);
        sum += Math.abs(val);
      }
      return sum;
    }
    var filters2 = {
      0: filterNone,
      1: filterSub,
      2: filterUp,
      3: filterAvg,
      4: filterPaeth
    };
    var filterSums = {
      0: filterSumNone,
      1: filterSumSub,
      2: filterSumUp,
      3: filterSumAvg,
      4: filterSumPaeth
    };
    module.exports = function(pxData, width2, height2, options, bpp) {
      let filterTypes;
      if (!("filterType" in options) || options.filterType === -1) {
        filterTypes = [0, 1, 2, 3, 4];
      } else if (typeof options.filterType === "number") {
        filterTypes = [options.filterType];
      } else {
        throw new Error("unrecognised filter types");
      }
      if (options.bitDepth === 16) {
        bpp *= 2;
      }
      let byteWidth = width2 * bpp;
      let rawPos = 0;
      let pxPos = 0;
      let rawData = Buffer.alloc((byteWidth + 1) * height2);
      let sel = filterTypes[0];
      for (let y2 = 0; y2 < height2; y2++) {
        if (filterTypes.length > 1) {
          let min = Infinity;
          for (let i = 0; i < filterTypes.length; i++) {
            let sum = filterSums[filterTypes[i]](pxData, pxPos, byteWidth, bpp);
            if (sum < min) {
              sel = filterTypes[i];
              min = sum;
            }
          }
        }
        rawData[rawPos] = sel;
        rawPos++;
        filters2[sel](pxData, pxPos, byteWidth, rawData, rawPos, bpp);
        rawPos += byteWidth;
        pxPos += byteWidth;
      }
      return rawData;
    };
  }
});

// node_modules/pngjs/lib/packer.js
var require_packer = __commonJS({
  "node_modules/pngjs/lib/packer.js"(exports, module) {
    "use strict";
    var constants = require_constants();
    var CrcStream = require_crc();
    var bitPacker = require_bitpacker();
    var filter4 = require_filter_pack();
    var zlib = __require("zlib");
    var Packer = module.exports = function(options) {
      this._options = options;
      options.deflateChunkSize = options.deflateChunkSize || 32 * 1024;
      options.deflateLevel = options.deflateLevel != null ? options.deflateLevel : 9;
      options.deflateStrategy = options.deflateStrategy != null ? options.deflateStrategy : 3;
      options.inputHasAlpha = options.inputHasAlpha != null ? options.inputHasAlpha : true;
      options.deflateFactory = options.deflateFactory || zlib.createDeflate;
      options.bitDepth = options.bitDepth || 8;
      options.colorType = typeof options.colorType === "number" ? options.colorType : constants.COLORTYPE_COLOR_ALPHA;
      options.inputColorType = typeof options.inputColorType === "number" ? options.inputColorType : constants.COLORTYPE_COLOR_ALPHA;
      if ([
        constants.COLORTYPE_GRAYSCALE,
        constants.COLORTYPE_COLOR,
        constants.COLORTYPE_COLOR_ALPHA,
        constants.COLORTYPE_ALPHA
      ].indexOf(options.colorType) === -1) {
        throw new Error(
          "option color type:" + options.colorType + " is not supported at present"
        );
      }
      if ([
        constants.COLORTYPE_GRAYSCALE,
        constants.COLORTYPE_COLOR,
        constants.COLORTYPE_COLOR_ALPHA,
        constants.COLORTYPE_ALPHA
      ].indexOf(options.inputColorType) === -1) {
        throw new Error(
          "option input color type:" + options.inputColorType + " is not supported at present"
        );
      }
      if (options.bitDepth !== 8 && options.bitDepth !== 16) {
        throw new Error(
          "option bit depth:" + options.bitDepth + " is not supported at present"
        );
      }
    };
    Packer.prototype.getDeflateOptions = function() {
      return {
        chunkSize: this._options.deflateChunkSize,
        level: this._options.deflateLevel,
        strategy: this._options.deflateStrategy
      };
    };
    Packer.prototype.createDeflate = function() {
      return this._options.deflateFactory(this.getDeflateOptions());
    };
    Packer.prototype.filterData = function(data2, width2, height2) {
      let packedData = bitPacker(data2, width2, height2, this._options);
      let bpp = constants.COLORTYPE_TO_BPP_MAP[this._options.colorType];
      let filteredData = filter4(packedData, width2, height2, this._options, bpp);
      return filteredData;
    };
    Packer.prototype._packChunk = function(type, data2) {
      let len = data2 ? data2.length : 0;
      let buf = Buffer.alloc(len + 12);
      buf.writeUInt32BE(len, 0);
      buf.writeUInt32BE(type, 4);
      if (data2) {
        data2.copy(buf, 8);
      }
      buf.writeInt32BE(
        CrcStream.crc32(buf.slice(4, buf.length - 4)),
        buf.length - 4
      );
      return buf;
    };
    Packer.prototype.packGAMA = function(gamma) {
      let buf = Buffer.alloc(4);
      buf.writeUInt32BE(Math.floor(gamma * constants.GAMMA_DIVISION), 0);
      return this._packChunk(constants.TYPE_gAMA, buf);
    };
    Packer.prototype.packIHDR = function(width2, height2) {
      let buf = Buffer.alloc(13);
      buf.writeUInt32BE(width2, 0);
      buf.writeUInt32BE(height2, 4);
      buf[8] = this._options.bitDepth;
      buf[9] = this._options.colorType;
      buf[10] = 0;
      buf[11] = 0;
      buf[12] = 0;
      return this._packChunk(constants.TYPE_IHDR, buf);
    };
    Packer.prototype.packIDAT = function(data2) {
      return this._packChunk(constants.TYPE_IDAT, data2);
    };
    Packer.prototype.packIEND = function() {
      return this._packChunk(constants.TYPE_IEND, null);
    };
  }
});

// node_modules/pngjs/lib/packer-async.js
var require_packer_async = __commonJS({
  "node_modules/pngjs/lib/packer-async.js"(exports, module) {
    "use strict";
    var util = __require("util");
    var Stream = __require("stream");
    var constants = require_constants();
    var Packer = require_packer();
    var PackerAsync = module.exports = function(opt) {
      Stream.call(this);
      let options = opt || {};
      this._packer = new Packer(options);
      this._deflate = this._packer.createDeflate();
      this.readable = true;
    };
    util.inherits(PackerAsync, Stream);
    PackerAsync.prototype.pack = function(data2, width2, height2, gamma) {
      this.emit("data", Buffer.from(constants.PNG_SIGNATURE));
      this.emit("data", this._packer.packIHDR(width2, height2));
      if (gamma) {
        this.emit("data", this._packer.packGAMA(gamma));
      }
      let filteredData = this._packer.filterData(data2, width2, height2);
      this._deflate.on("error", this.emit.bind(this, "error"));
      this._deflate.on(
        "data",
        function(compressedData) {
          this.emit("data", this._packer.packIDAT(compressedData));
        }.bind(this)
      );
      this._deflate.on(
        "end",
        function() {
          this.emit("data", this._packer.packIEND());
          this.emit("end");
        }.bind(this)
      );
      this._deflate.end(filteredData);
    };
  }
});

// node_modules/pngjs/lib/sync-inflate.js
var require_sync_inflate = __commonJS({
  "node_modules/pngjs/lib/sync-inflate.js"(exports, module) {
    "use strict";
    var assert = __require("assert").ok;
    var zlib = __require("zlib");
    var util = __require("util");
    var kMaxLength = __require("buffer").kMaxLength;
    function Inflate(opts) {
      if (!(this instanceof Inflate)) {
        return new Inflate(opts);
      }
      if (opts && opts.chunkSize < zlib.Z_MIN_CHUNK) {
        opts.chunkSize = zlib.Z_MIN_CHUNK;
      }
      zlib.Inflate.call(this, opts);
      this._offset = this._offset === void 0 ? this._outOffset : this._offset;
      this._buffer = this._buffer || this._outBuffer;
      if (opts && opts.maxLength != null) {
        this._maxLength = opts.maxLength;
      }
    }
    function createInflate(opts) {
      return new Inflate(opts);
    }
    function _close(engine, callback) {
      if (callback) {
        process.nextTick(callback);
      }
      if (!engine._handle) {
        return;
      }
      engine._handle.close();
      engine._handle = null;
    }
    Inflate.prototype._processChunk = function(chunk, flushFlag, asyncCb) {
      if (typeof asyncCb === "function") {
        return zlib.Inflate._processChunk.call(this, chunk, flushFlag, asyncCb);
      }
      let self2 = this;
      let availInBefore = chunk && chunk.length;
      let availOutBefore = this._chunkSize - this._offset;
      let leftToInflate = this._maxLength;
      let inOff = 0;
      let buffers = [];
      let nread = 0;
      let error;
      this.on("error", function(err) {
        error = err;
      });
      function handleChunk(availInAfter, availOutAfter) {
        if (self2._hadError) {
          return;
        }
        let have = availOutBefore - availOutAfter;
        assert(have >= 0, "have should not go down");
        if (have > 0) {
          let out = self2._buffer.slice(self2._offset, self2._offset + have);
          self2._offset += have;
          if (out.length > leftToInflate) {
            out = out.slice(0, leftToInflate);
          }
          buffers.push(out);
          nread += out.length;
          leftToInflate -= out.length;
          if (leftToInflate === 0) {
            return false;
          }
        }
        if (availOutAfter === 0 || self2._offset >= self2._chunkSize) {
          availOutBefore = self2._chunkSize;
          self2._offset = 0;
          self2._buffer = Buffer.allocUnsafe(self2._chunkSize);
        }
        if (availOutAfter === 0) {
          inOff += availInBefore - availInAfter;
          availInBefore = availInAfter;
          return true;
        }
        return false;
      }
      assert(this._handle, "zlib binding closed");
      let res;
      do {
        res = this._handle.writeSync(
          flushFlag,
          chunk,
          // in
          inOff,
          // in_off
          availInBefore,
          // in_len
          this._buffer,
          // out
          this._offset,
          //out_off
          availOutBefore
        );
        res = res || this._writeState;
      } while (!this._hadError && handleChunk(res[0], res[1]));
      if (this._hadError) {
        throw error;
      }
      if (nread >= kMaxLength) {
        _close(this);
        throw new RangeError(
          "Cannot create final Buffer. It would be larger than 0x" + kMaxLength.toString(16) + " bytes"
        );
      }
      let buf = Buffer.concat(buffers, nread);
      _close(this);
      return buf;
    };
    util.inherits(Inflate, zlib.Inflate);
    function zlibBufferSync(engine, buffer) {
      if (typeof buffer === "string") {
        buffer = Buffer.from(buffer);
      }
      if (!(buffer instanceof Buffer)) {
        throw new TypeError("Not a string or buffer");
      }
      let flushFlag = engine._finishFlushFlag;
      if (flushFlag == null) {
        flushFlag = zlib.Z_FINISH;
      }
      return engine._processChunk(buffer, flushFlag);
    }
    function inflateSync(buffer, opts) {
      return zlibBufferSync(new Inflate(opts), buffer);
    }
    module.exports = exports = inflateSync;
    exports.Inflate = Inflate;
    exports.createInflate = createInflate;
    exports.inflateSync = inflateSync;
  }
});

// node_modules/pngjs/lib/sync-reader.js
var require_sync_reader = __commonJS({
  "node_modules/pngjs/lib/sync-reader.js"(exports, module) {
    "use strict";
    var SyncReader = module.exports = function(buffer) {
      this._buffer = buffer;
      this._reads = [];
    };
    SyncReader.prototype.read = function(length2, callback) {
      this._reads.push({
        length: Math.abs(length2),
        // if length < 0 then at most this length
        allowLess: length2 < 0,
        func: callback
      });
    };
    SyncReader.prototype.process = function() {
      while (this._reads.length > 0 && this._buffer.length) {
        let read = this._reads[0];
        if (this._buffer.length && (this._buffer.length >= read.length || read.allowLess)) {
          this._reads.shift();
          let buf = this._buffer;
          this._buffer = buf.slice(read.length);
          read.func.call(this, buf.slice(0, read.length));
        } else {
          break;
        }
      }
      if (this._reads.length > 0) {
        throw new Error("There are some read requests waitng on finished stream");
      }
      if (this._buffer.length > 0) {
        throw new Error("unrecognised content at end of stream");
      }
    };
  }
});

// node_modules/pngjs/lib/filter-parse-sync.js
var require_filter_parse_sync = __commonJS({
  "node_modules/pngjs/lib/filter-parse-sync.js"(exports) {
    "use strict";
    var SyncReader = require_sync_reader();
    var Filter = require_filter_parse();
    exports.process = function(inBuffer, bitmapInfo) {
      let outBuffers = [];
      let reader = new SyncReader(inBuffer);
      let filter4 = new Filter(bitmapInfo, {
        read: reader.read.bind(reader),
        write: function(bufferPart) {
          outBuffers.push(bufferPart);
        },
        complete: function() {
        }
      });
      filter4.start();
      reader.process();
      return Buffer.concat(outBuffers);
    };
  }
});

// node_modules/pngjs/lib/parser-sync.js
var require_parser_sync = __commonJS({
  "node_modules/pngjs/lib/parser-sync.js"(exports, module) {
    "use strict";
    var hasSyncZlib = true;
    var zlib = __require("zlib");
    var inflateSync = require_sync_inflate();
    if (!zlib.deflateSync) {
      hasSyncZlib = false;
    }
    var SyncReader = require_sync_reader();
    var FilterSync = require_filter_parse_sync();
    var Parser3 = require_parser();
    var bitmapper = require_bitmapper();
    var formatNormaliser = require_format_normaliser();
    module.exports = function(buffer, options) {
      if (!hasSyncZlib) {
        throw new Error(
          "To use the sync capability of this library in old node versions, please pin pngjs to v2.3.0"
        );
      }
      let err;
      function handleError(_err_) {
        err = _err_;
      }
      let metaData;
      function handleMetaData(_metaData_) {
        metaData = _metaData_;
      }
      function handleTransColor(transColor) {
        metaData.transColor = transColor;
      }
      function handlePalette(palette) {
        metaData.palette = palette;
      }
      function handleSimpleTransparency() {
        metaData.alpha = true;
      }
      let gamma;
      function handleGamma(_gamma_) {
        gamma = _gamma_;
      }
      let inflateDataList = [];
      function handleInflateData(inflatedData2) {
        inflateDataList.push(inflatedData2);
      }
      let reader = new SyncReader(buffer);
      let parser2 = new Parser3(options, {
        read: reader.read.bind(reader),
        error: handleError,
        metadata: handleMetaData,
        gamma: handleGamma,
        palette: handlePalette,
        transColor: handleTransColor,
        inflateData: handleInflateData,
        simpleTransparency: handleSimpleTransparency
      });
      parser2.start();
      reader.process();
      if (err) {
        throw err;
      }
      let inflateData = Buffer.concat(inflateDataList);
      inflateDataList.length = 0;
      let inflatedData;
      if (metaData.interlace) {
        inflatedData = zlib.inflateSync(inflateData);
      } else {
        let rowSize = (metaData.width * metaData.bpp * metaData.depth + 7 >> 3) + 1;
        let imageSize = rowSize * metaData.height;
        inflatedData = inflateSync(inflateData, {
          chunkSize: imageSize,
          maxLength: imageSize
        });
      }
      inflateData = null;
      if (!inflatedData || !inflatedData.length) {
        throw new Error("bad png - invalid inflate data response");
      }
      let unfilteredData = FilterSync.process(inflatedData, metaData);
      inflateData = null;
      let bitmapData = bitmapper.dataToBitMap(unfilteredData, metaData);
      unfilteredData = null;
      let normalisedBitmapData = formatNormaliser(
        bitmapData,
        metaData,
        options.skipRescale
      );
      metaData.data = normalisedBitmapData;
      metaData.gamma = gamma || 0;
      return metaData;
    };
  }
});

// node_modules/pngjs/lib/packer-sync.js
var require_packer_sync = __commonJS({
  "node_modules/pngjs/lib/packer-sync.js"(exports, module) {
    "use strict";
    var hasSyncZlib = true;
    var zlib = __require("zlib");
    if (!zlib.deflateSync) {
      hasSyncZlib = false;
    }
    var constants = require_constants();
    var Packer = require_packer();
    module.exports = function(metaData, opt) {
      if (!hasSyncZlib) {
        throw new Error(
          "To use the sync capability of this library in old node versions, please pin pngjs to v2.3.0"
        );
      }
      let options = opt || {};
      let packer = new Packer(options);
      let chunks = [];
      chunks.push(Buffer.from(constants.PNG_SIGNATURE));
      chunks.push(packer.packIHDR(metaData.width, metaData.height));
      if (metaData.gamma) {
        chunks.push(packer.packGAMA(metaData.gamma));
      }
      let filteredData = packer.filterData(
        metaData.data,
        metaData.width,
        metaData.height
      );
      let compressedData = zlib.deflateSync(
        filteredData,
        packer.getDeflateOptions()
      );
      filteredData = null;
      if (!compressedData || !compressedData.length) {
        throw new Error("bad png - invalid compressed data response");
      }
      chunks.push(packer.packIDAT(compressedData));
      chunks.push(packer.packIEND());
      return Buffer.concat(chunks);
    };
  }
});

// node_modules/pngjs/lib/png-sync.js
var require_png_sync = __commonJS({
  "node_modules/pngjs/lib/png-sync.js"(exports) {
    "use strict";
    var parse6 = require_parser_sync();
    var pack = require_packer_sync();
    exports.read = function(buffer, options) {
      return parse6(buffer, options || {});
    };
    exports.write = function(png, options) {
      return pack(png, options);
    };
  }
});

// node_modules/pngjs/lib/png.js
var require_png = __commonJS({
  "node_modules/pngjs/lib/png.js"(exports) {
    "use strict";
    var util = __require("util");
    var Stream = __require("stream");
    var Parser3 = require_parser_async();
    var Packer = require_packer_async();
    var PNGSync = require_png_sync();
    var PNG2 = exports.PNG = function(options) {
      Stream.call(this);
      options = options || {};
      this.width = options.width | 0;
      this.height = options.height | 0;
      this.data = this.width > 0 && this.height > 0 ? Buffer.alloc(4 * this.width * this.height) : null;
      if (options.fill && this.data) {
        this.data.fill(0);
      }
      this.gamma = 0;
      this.readable = this.writable = true;
      this._parser = new Parser3(options);
      this._parser.on("error", this.emit.bind(this, "error"));
      this._parser.on("close", this._handleClose.bind(this));
      this._parser.on("metadata", this._metadata.bind(this));
      this._parser.on("gamma", this._gamma.bind(this));
      this._parser.on(
        "parsed",
        function(data2) {
          this.data = data2;
          this.emit("parsed", data2);
        }.bind(this)
      );
      this._packer = new Packer(options);
      this._packer.on("data", this.emit.bind(this, "data"));
      this._packer.on("end", this.emit.bind(this, "end"));
      this._parser.on("close", this._handleClose.bind(this));
      this._packer.on("error", this.emit.bind(this, "error"));
    };
    util.inherits(PNG2, Stream);
    PNG2.sync = PNGSync;
    PNG2.prototype.pack = function() {
      if (!this.data || !this.data.length) {
        this.emit("error", "No data provided");
        return this;
      }
      process.nextTick(
        function() {
          this._packer.pack(this.data, this.width, this.height, this.gamma);
        }.bind(this)
      );
      return this;
    };
    PNG2.prototype.parse = function(data2, callback) {
      if (callback) {
        let onParsed, onError;
        onParsed = function(parsedData) {
          this.removeListener("error", onError);
          this.data = parsedData;
          callback(null, this);
        }.bind(this);
        onError = function(err) {
          this.removeListener("parsed", onParsed);
          callback(err, null);
        }.bind(this);
        this.once("parsed", onParsed);
        this.once("error", onError);
      }
      this.end(data2);
      return this;
    };
    PNG2.prototype.write = function(data2) {
      this._parser.write(data2);
      return true;
    };
    PNG2.prototype.end = function(data2) {
      this._parser.end(data2);
    };
    PNG2.prototype._metadata = function(metadata) {
      this.width = metadata.width;
      this.height = metadata.height;
      this.emit("metadata", metadata);
    };
    PNG2.prototype._gamma = function(gamma) {
      this.gamma = gamma;
    };
    PNG2.prototype._handleClose = function() {
      if (!this._parser.writable && !this._packer.readable) {
        this.emit("close");
      }
    };
    PNG2.bitblt = function(src, dst, srcX, srcY, width2, height2, deltaX, deltaY) {
      srcX |= 0;
      srcY |= 0;
      width2 |= 0;
      height2 |= 0;
      deltaX |= 0;
      deltaY |= 0;
      if (srcX > src.width || srcY > src.height || srcX + width2 > src.width || srcY + height2 > src.height) {
        throw new Error("bitblt reading outside image");
      }
      if (deltaX > dst.width || deltaY > dst.height || deltaX + width2 > dst.width || deltaY + height2 > dst.height) {
        throw new Error("bitblt writing outside image");
      }
      for (let y2 = 0; y2 < height2; y2++) {
        src.data.copy(
          dst.data,
          (deltaY + y2) * dst.width + deltaX << 2,
          (srcY + y2) * src.width + srcX << 2,
          (srcY + y2) * src.width + srcX + width2 << 2
        );
      }
    };
    PNG2.prototype.bitblt = function(dst, srcX, srcY, width2, height2, deltaX, deltaY) {
      PNG2.bitblt(this, dst, srcX, srcY, width2, height2, deltaX, deltaY);
      return this;
    };
    PNG2.adjustGamma = function(src) {
      if (src.gamma) {
        for (let y2 = 0; y2 < src.height; y2++) {
          for (let x2 = 0; x2 < src.width; x2++) {
            let idx = src.width * y2 + x2 << 2;
            for (let i = 0; i < 3; i++) {
              let sample = src.data[idx + i] / 255;
              sample = Math.pow(sample, 1 / 2.2 / src.gamma);
              src.data[idx + i] = Math.round(sample * 255);
            }
          }
        }
        src.gamma = 0;
      }
    };
    PNG2.prototype.adjustGamma = function() {
      PNG2.adjustGamma(this);
    };
  }
});

// node_modules/cssom/lib/StyleSheet.js
var require_StyleSheet = __commonJS({
  "node_modules/cssom/lib/StyleSheet.js"(exports) {
    var CSSOM = {};
    CSSOM.StyleSheet = function StyleSheet() {
      this.parentStyleSheet = null;
    };
    exports.StyleSheet = CSSOM.StyleSheet;
  }
});

// node_modules/cssom/lib/CSSRule.js
var require_CSSRule = __commonJS({
  "node_modules/cssom/lib/CSSRule.js"(exports) {
    var CSSOM = {};
    CSSOM.CSSRule = function CSSRule() {
      this.parentRule = null;
      this.parentStyleSheet = null;
    };
    CSSOM.CSSRule.UNKNOWN_RULE = 0;
    CSSOM.CSSRule.STYLE_RULE = 1;
    CSSOM.CSSRule.CHARSET_RULE = 2;
    CSSOM.CSSRule.IMPORT_RULE = 3;
    CSSOM.CSSRule.MEDIA_RULE = 4;
    CSSOM.CSSRule.FONT_FACE_RULE = 5;
    CSSOM.CSSRule.PAGE_RULE = 6;
    CSSOM.CSSRule.KEYFRAMES_RULE = 7;
    CSSOM.CSSRule.KEYFRAME_RULE = 8;
    CSSOM.CSSRule.MARGIN_RULE = 9;
    CSSOM.CSSRule.NAMESPACE_RULE = 10;
    CSSOM.CSSRule.COUNTER_STYLE_RULE = 11;
    CSSOM.CSSRule.SUPPORTS_RULE = 12;
    CSSOM.CSSRule.DOCUMENT_RULE = 13;
    CSSOM.CSSRule.FONT_FEATURE_VALUES_RULE = 14;
    CSSOM.CSSRule.VIEWPORT_RULE = 15;
    CSSOM.CSSRule.REGION_STYLE_RULE = 16;
    CSSOM.CSSRule.prototype = {
      constructor: CSSOM.CSSRule
      //FIXME
    };
    exports.CSSRule = CSSOM.CSSRule;
  }
});

// node_modules/cssom/lib/CSSStyleRule.js
var require_CSSStyleRule = __commonJS({
  "node_modules/cssom/lib/CSSStyleRule.js"(exports) {
    var CSSOM = {
      CSSStyleDeclaration: require_CSSStyleDeclaration().CSSStyleDeclaration,
      CSSRule: require_CSSRule().CSSRule
    };
    CSSOM.CSSStyleRule = function CSSStyleRule() {
      CSSOM.CSSRule.call(this);
      this.selectorText = "";
      this.style = new CSSOM.CSSStyleDeclaration();
      this.style.parentRule = this;
    };
    CSSOM.CSSStyleRule.prototype = new CSSOM.CSSRule();
    CSSOM.CSSStyleRule.prototype.constructor = CSSOM.CSSStyleRule;
    CSSOM.CSSStyleRule.prototype.type = 1;
    Object.defineProperty(CSSOM.CSSStyleRule.prototype, "cssText", {
      get: function() {
        var text;
        if (this.selectorText) {
          text = this.selectorText + " {" + this.style.cssText + "}";
        } else {
          text = "";
        }
        return text;
      },
      set: function(cssText) {
        var rule = CSSOM.CSSStyleRule.parse(cssText);
        this.style = rule.style;
        this.selectorText = rule.selectorText;
      }
    });
    CSSOM.CSSStyleRule.parse = function(ruleText) {
      var i = 0;
      var state = "selector";
      var index;
      var j = i;
      var buffer = "";
      var SIGNIFICANT_WHITESPACE = {
        "selector": true,
        "value": true
      };
      var styleRule = new CSSOM.CSSStyleRule();
      var name, priority = "";
      for (var character; character = ruleText.charAt(i); i++) {
        switch (character) {
          case " ":
          case "	":
          case "\r":
          case "\n":
          case "\f":
            if (SIGNIFICANT_WHITESPACE[state]) {
              switch (ruleText.charAt(i - 1)) {
                case " ":
                case "	":
                case "\r":
                case "\n":
                case "\f":
                  break;
                default:
                  buffer += " ";
                  break;
              }
            }
            break;
          // String
          case '"':
            j = i + 1;
            index = ruleText.indexOf('"', j) + 1;
            if (!index) {
              throw '" is missing';
            }
            buffer += ruleText.slice(i, index);
            i = index - 1;
            break;
          case "'":
            j = i + 1;
            index = ruleText.indexOf("'", j) + 1;
            if (!index) {
              throw "' is missing";
            }
            buffer += ruleText.slice(i, index);
            i = index - 1;
            break;
          // Comment
          case "/":
            if (ruleText.charAt(i + 1) === "*") {
              i += 2;
              index = ruleText.indexOf("*/", i);
              if (index === -1) {
                throw new SyntaxError("Missing */");
              } else {
                i = index + 1;
              }
            } else {
              buffer += character;
            }
            break;
          case "{":
            if (state === "selector") {
              styleRule.selectorText = buffer.trim();
              buffer = "";
              state = "name";
            }
            break;
          case ":":
            if (state === "name") {
              name = buffer.trim();
              buffer = "";
              state = "value";
            } else {
              buffer += character;
            }
            break;
          case "!":
            if (state === "value" && ruleText.indexOf("!important", i) === i) {
              priority = "important";
              i += "important".length;
            } else {
              buffer += character;
            }
            break;
          case ";":
            if (state === "value") {
              styleRule.style.setProperty(name, buffer.trim(), priority);
              priority = "";
              buffer = "";
              state = "name";
            } else {
              buffer += character;
            }
            break;
          case "}":
            if (state === "value") {
              styleRule.style.setProperty(name, buffer.trim(), priority);
              priority = "";
              buffer = "";
            } else if (state === "name") {
              break;
            } else {
              buffer += character;
            }
            state = "selector";
            break;
          default:
            buffer += character;
            break;
        }
      }
      return styleRule;
    };
    exports.CSSStyleRule = CSSOM.CSSStyleRule;
  }
});

// node_modules/cssom/lib/CSSStyleSheet.js
var require_CSSStyleSheet = __commonJS({
  "node_modules/cssom/lib/CSSStyleSheet.js"(exports) {
    var CSSOM = {
      StyleSheet: require_StyleSheet().StyleSheet,
      CSSStyleRule: require_CSSStyleRule().CSSStyleRule
    };
    CSSOM.CSSStyleSheet = function CSSStyleSheet() {
      CSSOM.StyleSheet.call(this);
      this.cssRules = [];
    };
    CSSOM.CSSStyleSheet.prototype = new CSSOM.StyleSheet();
    CSSOM.CSSStyleSheet.prototype.constructor = CSSOM.CSSStyleSheet;
    CSSOM.CSSStyleSheet.prototype.insertRule = function(rule, index) {
      if (index < 0 || index > this.cssRules.length) {
        throw new RangeError("INDEX_SIZE_ERR");
      }
      var cssRule2 = CSSOM.parse(rule).cssRules[0];
      cssRule2.parentStyleSheet = this;
      this.cssRules.splice(index, 0, cssRule2);
      return index;
    };
    CSSOM.CSSStyleSheet.prototype.deleteRule = function(index) {
      if (index < 0 || index >= this.cssRules.length) {
        throw new RangeError("INDEX_SIZE_ERR");
      }
      this.cssRules.splice(index, 1);
    };
    CSSOM.CSSStyleSheet.prototype.toString = function() {
      var result = "";
      var rules = this.cssRules;
      for (var i = 0; i < rules.length; i++) {
        result += rules[i].cssText + "\n";
      }
      return result;
    };
    exports.CSSStyleSheet = CSSOM.CSSStyleSheet;
    CSSOM.parse = require_parse().parse;
  }
});

// node_modules/cssom/lib/MediaList.js
var require_MediaList = __commonJS({
  "node_modules/cssom/lib/MediaList.js"(exports) {
    var CSSOM = {};
    CSSOM.MediaList = function MediaList() {
      this.length = 0;
    };
    CSSOM.MediaList.prototype = {
      constructor: CSSOM.MediaList,
      /**
       * @return {string}
       */
      get mediaText() {
        return Array.prototype.join.call(this, ", ");
      },
      /**
       * @param {string} value
       */
      set mediaText(value) {
        var values = value.split(",");
        var length2 = this.length = values.length;
        for (var i = 0; i < length2; i++) {
          this[i] = values[i].trim();
        }
      },
      /**
       * @param {string} medium
       */
      appendMedium: function(medium) {
        if (Array.prototype.indexOf.call(this, medium) === -1) {
          this[this.length] = medium;
          this.length++;
        }
      },
      /**
       * @param {string} medium
       */
      deleteMedium: function(medium) {
        var index = Array.prototype.indexOf.call(this, medium);
        if (index !== -1) {
          Array.prototype.splice.call(this, index, 1);
        }
      }
    };
    exports.MediaList = CSSOM.MediaList;
  }
});

// node_modules/cssom/lib/CSSImportRule.js
var require_CSSImportRule = __commonJS({
  "node_modules/cssom/lib/CSSImportRule.js"(exports) {
    var CSSOM = {
      CSSRule: require_CSSRule().CSSRule,
      CSSStyleSheet: require_CSSStyleSheet().CSSStyleSheet,
      MediaList: require_MediaList().MediaList
    };
    CSSOM.CSSImportRule = function CSSImportRule() {
      CSSOM.CSSRule.call(this);
      this.href = "";
      this.media = new CSSOM.MediaList();
      this.styleSheet = new CSSOM.CSSStyleSheet();
    };
    CSSOM.CSSImportRule.prototype = new CSSOM.CSSRule();
    CSSOM.CSSImportRule.prototype.constructor = CSSOM.CSSImportRule;
    CSSOM.CSSImportRule.prototype.type = 3;
    Object.defineProperty(CSSOM.CSSImportRule.prototype, "cssText", {
      get: function() {
        var mediaText = this.media.mediaText;
        return "@import url(" + this.href + ")" + (mediaText ? " " + mediaText : "") + ";";
      },
      set: function(cssText) {
        var i = 0;
        var state = "";
        var buffer = "";
        var index;
        for (var character; character = cssText.charAt(i); i++) {
          switch (character) {
            case " ":
            case "	":
            case "\r":
            case "\n":
            case "\f":
              if (state === "after-import") {
                state = "url";
              } else {
                buffer += character;
              }
              break;
            case "@":
              if (!state && cssText.indexOf("@import", i) === i) {
                state = "after-import";
                i += "import".length;
                buffer = "";
              }
              break;
            case "u":
              if (state === "url" && cssText.indexOf("url(", i) === i) {
                index = cssText.indexOf(")", i + 1);
                if (index === -1) {
                  throw i + ': ")" not found';
                }
                i += "url(".length;
                var url = cssText.slice(i, index);
                if (url[0] === url[url.length - 1]) {
                  if (url[0] === '"' || url[0] === "'") {
                    url = url.slice(1, -1);
                  }
                }
                this.href = url;
                i = index;
                state = "media";
              }
              break;
            case '"':
              if (state === "url") {
                index = cssText.indexOf('"', i + 1);
                if (!index) {
                  throw i + `: '"' not found`;
                }
                this.href = cssText.slice(i + 1, index);
                i = index;
                state = "media";
              }
              break;
            case "'":
              if (state === "url") {
                index = cssText.indexOf("'", i + 1);
                if (!index) {
                  throw i + `: "'" not found`;
                }
                this.href = cssText.slice(i + 1, index);
                i = index;
                state = "media";
              }
              break;
            case ";":
              if (state === "media") {
                if (buffer) {
                  this.media.mediaText = buffer.trim();
                }
              }
              break;
            default:
              if (state === "media") {
                buffer += character;
              }
              break;
          }
        }
      }
    });
    exports.CSSImportRule = CSSOM.CSSImportRule;
  }
});

// node_modules/cssom/lib/CSSGroupingRule.js
var require_CSSGroupingRule = __commonJS({
  "node_modules/cssom/lib/CSSGroupingRule.js"(exports) {
    var CSSOM = {
      CSSRule: require_CSSRule().CSSRule
    };
    CSSOM.CSSGroupingRule = function CSSGroupingRule() {
      CSSOM.CSSRule.call(this);
      this.cssRules = [];
    };
    CSSOM.CSSGroupingRule.prototype = new CSSOM.CSSRule();
    CSSOM.CSSGroupingRule.prototype.constructor = CSSOM.CSSGroupingRule;
    CSSOM.CSSGroupingRule.prototype.insertRule = function insertRule(rule, index) {
      if (index < 0 || index > this.cssRules.length) {
        throw new RangeError("INDEX_SIZE_ERR");
      }
      var cssRule2 = CSSOM.parse(rule).cssRules[0];
      cssRule2.parentRule = this;
      this.cssRules.splice(index, 0, cssRule2);
      return index;
    };
    CSSOM.CSSGroupingRule.prototype.deleteRule = function deleteRule(index) {
      if (index < 0 || index >= this.cssRules.length) {
        throw new RangeError("INDEX_SIZE_ERR");
      }
      this.cssRules.splice(index, 1)[0].parentRule = null;
    };
    exports.CSSGroupingRule = CSSOM.CSSGroupingRule;
  }
});

// node_modules/cssom/lib/CSSConditionRule.js
var require_CSSConditionRule = __commonJS({
  "node_modules/cssom/lib/CSSConditionRule.js"(exports) {
    var CSSOM = {
      CSSRule: require_CSSRule().CSSRule,
      CSSGroupingRule: require_CSSGroupingRule().CSSGroupingRule
    };
    CSSOM.CSSConditionRule = function CSSConditionRule() {
      CSSOM.CSSGroupingRule.call(this);
      this.cssRules = [];
    };
    CSSOM.CSSConditionRule.prototype = new CSSOM.CSSGroupingRule();
    CSSOM.CSSConditionRule.prototype.constructor = CSSOM.CSSConditionRule;
    CSSOM.CSSConditionRule.prototype.conditionText = "";
    CSSOM.CSSConditionRule.prototype.cssText = "";
    exports.CSSConditionRule = CSSOM.CSSConditionRule;
  }
});

// node_modules/cssom/lib/CSSMediaRule.js
var require_CSSMediaRule = __commonJS({
  "node_modules/cssom/lib/CSSMediaRule.js"(exports) {
    var CSSOM = {
      CSSRule: require_CSSRule().CSSRule,
      CSSGroupingRule: require_CSSGroupingRule().CSSGroupingRule,
      CSSConditionRule: require_CSSConditionRule().CSSConditionRule,
      MediaList: require_MediaList().MediaList
    };
    CSSOM.CSSMediaRule = function CSSMediaRule() {
      CSSOM.CSSConditionRule.call(this);
      this.media = new CSSOM.MediaList();
    };
    CSSOM.CSSMediaRule.prototype = new CSSOM.CSSConditionRule();
    CSSOM.CSSMediaRule.prototype.constructor = CSSOM.CSSMediaRule;
    CSSOM.CSSMediaRule.prototype.type = 4;
    Object.defineProperties(CSSOM.CSSMediaRule.prototype, {
      "conditionText": {
        get: function() {
          return this.media.mediaText;
        },
        set: function(value) {
          this.media.mediaText = value;
        },
        configurable: true,
        enumerable: true
      },
      "cssText": {
        get: function() {
          var cssTexts = [];
          for (var i = 0, length2 = this.cssRules.length; i < length2; i++) {
            cssTexts.push(this.cssRules[i].cssText);
          }
          return "@media " + this.media.mediaText + " {" + cssTexts.join("") + "}";
        },
        configurable: true,
        enumerable: true
      }
    });
    exports.CSSMediaRule = CSSOM.CSSMediaRule;
  }
});

// node_modules/cssom/lib/CSSSupportsRule.js
var require_CSSSupportsRule = __commonJS({
  "node_modules/cssom/lib/CSSSupportsRule.js"(exports) {
    var CSSOM = {
      CSSRule: require_CSSRule().CSSRule,
      CSSGroupingRule: require_CSSGroupingRule().CSSGroupingRule,
      CSSConditionRule: require_CSSConditionRule().CSSConditionRule
    };
    CSSOM.CSSSupportsRule = function CSSSupportsRule() {
      CSSOM.CSSConditionRule.call(this);
    };
    CSSOM.CSSSupportsRule.prototype = new CSSOM.CSSConditionRule();
    CSSOM.CSSSupportsRule.prototype.constructor = CSSOM.CSSSupportsRule;
    CSSOM.CSSSupportsRule.prototype.type = 12;
    Object.defineProperty(CSSOM.CSSSupportsRule.prototype, "cssText", {
      get: function() {
        var cssTexts = [];
        for (var i = 0, length2 = this.cssRules.length; i < length2; i++) {
          cssTexts.push(this.cssRules[i].cssText);
        }
        return "@supports " + this.conditionText + " {" + cssTexts.join("") + "}";
      }
    });
    exports.CSSSupportsRule = CSSOM.CSSSupportsRule;
  }
});

// node_modules/cssom/lib/CSSFontFaceRule.js
var require_CSSFontFaceRule = __commonJS({
  "node_modules/cssom/lib/CSSFontFaceRule.js"(exports) {
    var CSSOM = {
      CSSStyleDeclaration: require_CSSStyleDeclaration().CSSStyleDeclaration,
      CSSRule: require_CSSRule().CSSRule
    };
    CSSOM.CSSFontFaceRule = function CSSFontFaceRule() {
      CSSOM.CSSRule.call(this);
      this.style = new CSSOM.CSSStyleDeclaration();
      this.style.parentRule = this;
    };
    CSSOM.CSSFontFaceRule.prototype = new CSSOM.CSSRule();
    CSSOM.CSSFontFaceRule.prototype.constructor = CSSOM.CSSFontFaceRule;
    CSSOM.CSSFontFaceRule.prototype.type = 5;
    Object.defineProperty(CSSOM.CSSFontFaceRule.prototype, "cssText", {
      get: function() {
        return "@font-face {" + this.style.cssText + "}";
      }
    });
    exports.CSSFontFaceRule = CSSOM.CSSFontFaceRule;
  }
});

// node_modules/cssom/lib/CSSHostRule.js
var require_CSSHostRule = __commonJS({
  "node_modules/cssom/lib/CSSHostRule.js"(exports) {
    var CSSOM = {
      CSSRule: require_CSSRule().CSSRule
    };
    CSSOM.CSSHostRule = function CSSHostRule() {
      CSSOM.CSSRule.call(this);
      this.cssRules = [];
    };
    CSSOM.CSSHostRule.prototype = new CSSOM.CSSRule();
    CSSOM.CSSHostRule.prototype.constructor = CSSOM.CSSHostRule;
    CSSOM.CSSHostRule.prototype.type = 1001;
    Object.defineProperty(CSSOM.CSSHostRule.prototype, "cssText", {
      get: function() {
        var cssTexts = [];
        for (var i = 0, length2 = this.cssRules.length; i < length2; i++) {
          cssTexts.push(this.cssRules[i].cssText);
        }
        return "@host {" + cssTexts.join("") + "}";
      }
    });
    exports.CSSHostRule = CSSOM.CSSHostRule;
  }
});

// node_modules/cssom/lib/CSSKeyframeRule.js
var require_CSSKeyframeRule = __commonJS({
  "node_modules/cssom/lib/CSSKeyframeRule.js"(exports) {
    var CSSOM = {
      CSSRule: require_CSSRule().CSSRule,
      CSSStyleDeclaration: require_CSSStyleDeclaration().CSSStyleDeclaration
    };
    CSSOM.CSSKeyframeRule = function CSSKeyframeRule() {
      CSSOM.CSSRule.call(this);
      this.keyText = "";
      this.style = new CSSOM.CSSStyleDeclaration();
      this.style.parentRule = this;
    };
    CSSOM.CSSKeyframeRule.prototype = new CSSOM.CSSRule();
    CSSOM.CSSKeyframeRule.prototype.constructor = CSSOM.CSSKeyframeRule;
    CSSOM.CSSKeyframeRule.prototype.type = 8;
    Object.defineProperty(CSSOM.CSSKeyframeRule.prototype, "cssText", {
      get: function() {
        return this.keyText + " {" + this.style.cssText + "} ";
      }
    });
    exports.CSSKeyframeRule = CSSOM.CSSKeyframeRule;
  }
});

// node_modules/cssom/lib/CSSKeyframesRule.js
var require_CSSKeyframesRule = __commonJS({
  "node_modules/cssom/lib/CSSKeyframesRule.js"(exports) {
    var CSSOM = {
      CSSRule: require_CSSRule().CSSRule
    };
    CSSOM.CSSKeyframesRule = function CSSKeyframesRule() {
      CSSOM.CSSRule.call(this);
      this.name = "";
      this.cssRules = [];
    };
    CSSOM.CSSKeyframesRule.prototype = new CSSOM.CSSRule();
    CSSOM.CSSKeyframesRule.prototype.constructor = CSSOM.CSSKeyframesRule;
    CSSOM.CSSKeyframesRule.prototype.type = 7;
    Object.defineProperty(CSSOM.CSSKeyframesRule.prototype, "cssText", {
      get: function() {
        var cssTexts = [];
        for (var i = 0, length2 = this.cssRules.length; i < length2; i++) {
          cssTexts.push("  " + this.cssRules[i].cssText);
        }
        return "@" + (this._vendorPrefix || "") + "keyframes " + this.name + " { \n" + cssTexts.join("\n") + "\n}";
      }
    });
    exports.CSSKeyframesRule = CSSOM.CSSKeyframesRule;
  }
});

// node_modules/cssom/lib/CSSValue.js
var require_CSSValue = __commonJS({
  "node_modules/cssom/lib/CSSValue.js"(exports) {
    var CSSOM = {};
    CSSOM.CSSValue = function CSSValue() {
    };
    CSSOM.CSSValue.prototype = {
      constructor: CSSOM.CSSValue,
      // @see: http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSValue
      set cssText(text) {
        var name = this._getConstructorName();
        throw new Error('DOMException: property "cssText" of "' + name + '" is readonly and can not be replaced with "' + text + '"!');
      },
      get cssText() {
        var name = this._getConstructorName();
        throw new Error('getter "cssText" of "' + name + '" is not implemented!');
      },
      _getConstructorName: function() {
        var s = this.constructor.toString(), c = s.match(/function\s([^\(]+)/), name = c[1];
        return name;
      }
    };
    exports.CSSValue = CSSOM.CSSValue;
  }
});

// node_modules/cssom/lib/CSSValueExpression.js
var require_CSSValueExpression = __commonJS({
  "node_modules/cssom/lib/CSSValueExpression.js"(exports) {
    var CSSOM = {
      CSSValue: require_CSSValue().CSSValue
    };
    CSSOM.CSSValueExpression = function CSSValueExpression(token, idx) {
      this._token = token;
      this._idx = idx;
    };
    CSSOM.CSSValueExpression.prototype = new CSSOM.CSSValue();
    CSSOM.CSSValueExpression.prototype.constructor = CSSOM.CSSValueExpression;
    CSSOM.CSSValueExpression.prototype.parse = function() {
      var token = this._token, idx = this._idx;
      var character = "", expression = "", error = "", info, paren = [];
      for (; ; ++idx) {
        character = token.charAt(idx);
        if (character === "") {
          error = "css expression error: unfinished expression!";
          break;
        }
        switch (character) {
          case "(":
            paren.push(character);
            expression += character;
            break;
          case ")":
            paren.pop(character);
            expression += character;
            break;
          case "/":
            if (info = this._parseJSComment(token, idx)) {
              if (info.error) {
                error = "css expression error: unfinished comment in expression!";
              } else {
                idx = info.idx;
              }
            } else if (info = this._parseJSRexExp(token, idx)) {
              idx = info.idx;
              expression += info.text;
            } else {
              expression += character;
            }
            break;
          case "'":
          case '"':
            info = this._parseJSString(token, idx, character);
            if (info) {
              idx = info.idx;
              expression += info.text;
            } else {
              expression += character;
            }
            break;
          default:
            expression += character;
            break;
        }
        if (error) {
          break;
        }
        if (paren.length === 0) {
          break;
        }
      }
      var ret;
      if (error) {
        ret = {
          error
        };
      } else {
        ret = {
          idx,
          expression
        };
      }
      return ret;
    };
    CSSOM.CSSValueExpression.prototype._parseJSComment = function(token, idx) {
      var nextChar = token.charAt(idx + 1), text;
      if (nextChar === "/" || nextChar === "*") {
        var startIdx = idx, endIdx, commentEndChar;
        if (nextChar === "/") {
          commentEndChar = "\n";
        } else if (nextChar === "*") {
          commentEndChar = "*/";
        }
        endIdx = token.indexOf(commentEndChar, startIdx + 1 + 1);
        if (endIdx !== -1) {
          endIdx = endIdx + commentEndChar.length - 1;
          text = token.substring(idx, endIdx + 1);
          return {
            idx: endIdx,
            text
          };
        } else {
          var error = "css expression error: unfinished comment in expression!";
          return {
            error
          };
        }
      } else {
        return false;
      }
    };
    CSSOM.CSSValueExpression.prototype._parseJSString = function(token, idx, sep) {
      var endIdx = this._findMatchedIdx(token, idx, sep), text;
      if (endIdx === -1) {
        return false;
      } else {
        text = token.substring(idx, endIdx + sep.length);
        return {
          idx: endIdx,
          text
        };
      }
    };
    CSSOM.CSSValueExpression.prototype._parseJSRexExp = function(token, idx) {
      var before3 = token.substring(0, idx).replace(/\s+$/, ""), legalRegx = [
        /^$/,
        /\($/,
        /\[$/,
        /\!$/,
        /\+$/,
        /\-$/,
        /\*$/,
        /\/\s+/,
        /\%$/,
        /\=$/,
        /\>$/,
        /<$/,
        /\&$/,
        /\|$/,
        /\^$/,
        /\~$/,
        /\?$/,
        /\,$/,
        /delete$/,
        /in$/,
        /instanceof$/,
        /new$/,
        /typeof$/,
        /void$/
      ];
      var isLegal = legalRegx.some(function(reg) {
        return reg.test(before3);
      });
      if (!isLegal) {
        return false;
      } else {
        var sep = "/";
        return this._parseJSString(token, idx, sep);
      }
    };
    CSSOM.CSSValueExpression.prototype._findMatchedIdx = function(token, idx, sep) {
      var startIdx = idx, endIdx;
      var NOT_FOUND = -1;
      while (true) {
        endIdx = token.indexOf(sep, startIdx + 1);
        if (endIdx === -1) {
          endIdx = NOT_FOUND;
          break;
        } else {
          var text = token.substring(idx + 1, endIdx), matched = text.match(/\\+$/);
          if (!matched || matched[0] % 2 === 0) {
            break;
          } else {
            startIdx = endIdx;
          }
        }
      }
      var nextNewLineIdx = token.indexOf("\n", idx + 1);
      if (nextNewLineIdx < endIdx) {
        endIdx = NOT_FOUND;
      }
      return endIdx;
    };
    exports.CSSValueExpression = CSSOM.CSSValueExpression;
  }
});

// node_modules/cssom/lib/MatcherList.js
var require_MatcherList = __commonJS({
  "node_modules/cssom/lib/MatcherList.js"(exports) {
    var CSSOM = {};
    CSSOM.MatcherList = function MatcherList() {
      this.length = 0;
    };
    CSSOM.MatcherList.prototype = {
      constructor: CSSOM.MatcherList,
      /**
       * @return {string}
       */
      get matcherText() {
        return Array.prototype.join.call(this, ", ");
      },
      /**
       * @param {string} value
       */
      set matcherText(value) {
        var values = value.split(",");
        var length2 = this.length = values.length;
        for (var i = 0; i < length2; i++) {
          this[i] = values[i].trim();
        }
      },
      /**
       * @param {string} matcher
       */
      appendMatcher: function(matcher) {
        if (Array.prototype.indexOf.call(this, matcher) === -1) {
          this[this.length] = matcher;
          this.length++;
        }
      },
      /**
       * @param {string} matcher
       */
      deleteMatcher: function(matcher) {
        var index = Array.prototype.indexOf.call(this, matcher);
        if (index !== -1) {
          Array.prototype.splice.call(this, index, 1);
        }
      }
    };
    exports.MatcherList = CSSOM.MatcherList;
  }
});

// node_modules/cssom/lib/CSSDocumentRule.js
var require_CSSDocumentRule = __commonJS({
  "node_modules/cssom/lib/CSSDocumentRule.js"(exports) {
    var CSSOM = {
      CSSRule: require_CSSRule().CSSRule,
      MatcherList: require_MatcherList().MatcherList
    };
    CSSOM.CSSDocumentRule = function CSSDocumentRule() {
      CSSOM.CSSRule.call(this);
      this.matcher = new CSSOM.MatcherList();
      this.cssRules = [];
    };
    CSSOM.CSSDocumentRule.prototype = new CSSOM.CSSRule();
    CSSOM.CSSDocumentRule.prototype.constructor = CSSOM.CSSDocumentRule;
    CSSOM.CSSDocumentRule.prototype.type = 10;
    Object.defineProperty(CSSOM.CSSDocumentRule.prototype, "cssText", {
      get: function() {
        var cssTexts = [];
        for (var i = 0, length2 = this.cssRules.length; i < length2; i++) {
          cssTexts.push(this.cssRules[i].cssText);
        }
        return "@-moz-document " + this.matcher.matcherText + " {" + cssTexts.join("") + "}";
      }
    });
    exports.CSSDocumentRule = CSSOM.CSSDocumentRule;
  }
});

// node_modules/cssom/lib/parse.js
var require_parse = __commonJS({
  "node_modules/cssom/lib/parse.js"(exports) {
    var CSSOM = {};
    CSSOM.parse = function parse6(token) {
      var i = 0;
      var state = "before-selector";
      var index;
      var buffer = "";
      var valueParenthesisDepth = 0;
      var SIGNIFICANT_WHITESPACE = {
        "selector": true,
        "value": true,
        "value-parenthesis": true,
        "atRule": true,
        "importRule-begin": true,
        "importRule": true,
        "atBlock": true,
        "conditionBlock": true,
        "documentRule-begin": true
      };
      var styleSheet = new CSSOM.CSSStyleSheet();
      var currentScope = styleSheet;
      var parentRule;
      var ancestorRules = [];
      var hasAncestors = false;
      var prevScope;
      var name, priority = "", styleRule, mediaRule, supportsRule, importRule, fontFaceRule, keyframesRule, documentRule, hostRule;
      var atKeyframesRegExp = /@(-(?:\w+-)+)?keyframes/g;
      var parseError = function(message) {
        var lines = token.substring(0, i).split("\n");
        var lineCount = lines.length;
        var charCount = lines.pop().length + 1;
        var error = new Error(message + " (line " + lineCount + ", char " + charCount + ")");
        error.line = lineCount;
        error["char"] = charCount;
        error.styleSheet = styleSheet;
        throw error;
      };
      for (var character; character = token.charAt(i); i++) {
        switch (character) {
          case " ":
          case "	":
          case "\r":
          case "\n":
          case "\f":
            if (SIGNIFICANT_WHITESPACE[state]) {
              buffer += character;
            }
            break;
          // String
          case '"':
            index = i + 1;
            do {
              index = token.indexOf('"', index) + 1;
              if (!index) {
                parseError('Unmatched "');
              }
            } while (token[index - 2] === "\\");
            buffer += token.slice(i, index);
            i = index - 1;
            switch (state) {
              case "before-value":
                state = "value";
                break;
              case "importRule-begin":
                state = "importRule";
                break;
            }
            break;
          case "'":
            index = i + 1;
            do {
              index = token.indexOf("'", index) + 1;
              if (!index) {
                parseError("Unmatched '");
              }
            } while (token[index - 2] === "\\");
            buffer += token.slice(i, index);
            i = index - 1;
            switch (state) {
              case "before-value":
                state = "value";
                break;
              case "importRule-begin":
                state = "importRule";
                break;
            }
            break;
          // Comment
          case "/":
            if (token.charAt(i + 1) === "*") {
              i += 2;
              index = token.indexOf("*/", i);
              if (index === -1) {
                parseError("Missing */");
              } else {
                i = index + 1;
              }
            } else {
              buffer += character;
            }
            if (state === "importRule-begin") {
              buffer += " ";
              state = "importRule";
            }
            break;
          // At-rule
          case "@":
            if (token.indexOf("@-moz-document", i) === i) {
              state = "documentRule-begin";
              documentRule = new CSSOM.CSSDocumentRule();
              documentRule.__starts = i;
              i += "-moz-document".length;
              buffer = "";
              break;
            } else if (token.indexOf("@media", i) === i) {
              state = "atBlock";
              mediaRule = new CSSOM.CSSMediaRule();
              mediaRule.__starts = i;
              i += "media".length;
              buffer = "";
              break;
            } else if (token.indexOf("@supports", i) === i) {
              state = "conditionBlock";
              supportsRule = new CSSOM.CSSSupportsRule();
              supportsRule.__starts = i;
              i += "supports".length;
              buffer = "";
              break;
            } else if (token.indexOf("@host", i) === i) {
              state = "hostRule-begin";
              i += "host".length;
              hostRule = new CSSOM.CSSHostRule();
              hostRule.__starts = i;
              buffer = "";
              break;
            } else if (token.indexOf("@import", i) === i) {
              state = "importRule-begin";
              i += "import".length;
              buffer += "@import";
              break;
            } else if (token.indexOf("@font-face", i) === i) {
              state = "fontFaceRule-begin";
              i += "font-face".length;
              fontFaceRule = new CSSOM.CSSFontFaceRule();
              fontFaceRule.__starts = i;
              buffer = "";
              break;
            } else {
              atKeyframesRegExp.lastIndex = i;
              var matchKeyframes = atKeyframesRegExp.exec(token);
              if (matchKeyframes && matchKeyframes.index === i) {
                state = "keyframesRule-begin";
                keyframesRule = new CSSOM.CSSKeyframesRule();
                keyframesRule.__starts = i;
                keyframesRule._vendorPrefix = matchKeyframes[1];
                i += matchKeyframes[0].length - 1;
                buffer = "";
                break;
              } else if (state === "selector") {
                state = "atRule";
              }
            }
            buffer += character;
            break;
          case "{":
            if (state === "selector" || state === "atRule") {
              styleRule.selectorText = buffer.trim();
              styleRule.style.__starts = i;
              buffer = "";
              state = "before-name";
            } else if (state === "atBlock") {
              mediaRule.media.mediaText = buffer.trim();
              if (parentRule) {
                ancestorRules.push(parentRule);
              }
              currentScope = parentRule = mediaRule;
              mediaRule.parentStyleSheet = styleSheet;
              buffer = "";
              state = "before-selector";
            } else if (state === "conditionBlock") {
              supportsRule.conditionText = buffer.trim();
              if (parentRule) {
                ancestorRules.push(parentRule);
              }
              currentScope = parentRule = supportsRule;
              supportsRule.parentStyleSheet = styleSheet;
              buffer = "";
              state = "before-selector";
            } else if (state === "hostRule-begin") {
              if (parentRule) {
                ancestorRules.push(parentRule);
              }
              currentScope = parentRule = hostRule;
              hostRule.parentStyleSheet = styleSheet;
              buffer = "";
              state = "before-selector";
            } else if (state === "fontFaceRule-begin") {
              if (parentRule) {
                fontFaceRule.parentRule = parentRule;
              }
              fontFaceRule.parentStyleSheet = styleSheet;
              styleRule = fontFaceRule;
              buffer = "";
              state = "before-name";
            } else if (state === "keyframesRule-begin") {
              keyframesRule.name = buffer.trim();
              if (parentRule) {
                ancestorRules.push(parentRule);
                keyframesRule.parentRule = parentRule;
              }
              keyframesRule.parentStyleSheet = styleSheet;
              currentScope = parentRule = keyframesRule;
              buffer = "";
              state = "keyframeRule-begin";
            } else if (state === "keyframeRule-begin") {
              styleRule = new CSSOM.CSSKeyframeRule();
              styleRule.keyText = buffer.trim();
              styleRule.__starts = i;
              buffer = "";
              state = "before-name";
            } else if (state === "documentRule-begin") {
              documentRule.matcher.matcherText = buffer.trim();
              if (parentRule) {
                ancestorRules.push(parentRule);
                documentRule.parentRule = parentRule;
              }
              currentScope = parentRule = documentRule;
              documentRule.parentStyleSheet = styleSheet;
              buffer = "";
              state = "before-selector";
            }
            break;
          case ":":
            if (state === "name") {
              name = buffer.trim();
              buffer = "";
              state = "before-value";
            } else {
              buffer += character;
            }
            break;
          case "(":
            if (state === "value") {
              if (buffer.trim() === "expression") {
                var info = new CSSOM.CSSValueExpression(token, i).parse();
                if (info.error) {
                  parseError(info.error);
                } else {
                  buffer += info.expression;
                  i = info.idx;
                }
              } else {
                state = "value-parenthesis";
                valueParenthesisDepth = 1;
                buffer += character;
              }
            } else if (state === "value-parenthesis") {
              valueParenthesisDepth++;
              buffer += character;
            } else {
              buffer += character;
            }
            break;
          case ")":
            if (state === "value-parenthesis") {
              valueParenthesisDepth--;
              if (valueParenthesisDepth === 0) state = "value";
            }
            buffer += character;
            break;
          case "!":
            if (state === "value" && token.indexOf("!important", i) === i) {
              priority = "important";
              i += "important".length;
            } else {
              buffer += character;
            }
            break;
          case ";":
            switch (state) {
              case "value":
                styleRule.style.setProperty(name, buffer.trim(), priority);
                priority = "";
                buffer = "";
                state = "before-name";
                break;
              case "atRule":
                buffer = "";
                state = "before-selector";
                break;
              case "importRule":
                importRule = new CSSOM.CSSImportRule();
                importRule.parentStyleSheet = importRule.styleSheet.parentStyleSheet = styleSheet;
                importRule.cssText = buffer + character;
                styleSheet.cssRules.push(importRule);
                buffer = "";
                state = "before-selector";
                break;
              default:
                buffer += character;
                break;
            }
            break;
          case "}":
            switch (state) {
              case "value":
                styleRule.style.setProperty(name, buffer.trim(), priority);
                priority = "";
              /* falls through */
              case "before-name":
              case "name":
                styleRule.__ends = i + 1;
                if (parentRule) {
                  styleRule.parentRule = parentRule;
                }
                styleRule.parentStyleSheet = styleSheet;
                currentScope.cssRules.push(styleRule);
                buffer = "";
                if (currentScope.constructor === CSSOM.CSSKeyframesRule) {
                  state = "keyframeRule-begin";
                } else {
                  state = "before-selector";
                }
                break;
              case "keyframeRule-begin":
              case "before-selector":
              case "selector":
                if (!parentRule) {
                  parseError("Unexpected }");
                }
                hasAncestors = ancestorRules.length > 0;
                while (ancestorRules.length > 0) {
                  parentRule = ancestorRules.pop();
                  if (parentRule.constructor.name === "CSSMediaRule" || parentRule.constructor.name === "CSSSupportsRule") {
                    prevScope = currentScope;
                    currentScope = parentRule;
                    currentScope.cssRules.push(prevScope);
                    break;
                  }
                  if (ancestorRules.length === 0) {
                    hasAncestors = false;
                  }
                }
                if (!hasAncestors) {
                  currentScope.__ends = i + 1;
                  styleSheet.cssRules.push(currentScope);
                  currentScope = styleSheet;
                  parentRule = null;
                }
                buffer = "";
                state = "before-selector";
                break;
            }
            break;
          default:
            switch (state) {
              case "before-selector":
                state = "selector";
                styleRule = new CSSOM.CSSStyleRule();
                styleRule.__starts = i;
                break;
              case "before-name":
                state = "name";
                break;
              case "before-value":
                state = "value";
                break;
              case "importRule-begin":
                state = "importRule";
                break;
            }
            buffer += character;
            break;
        }
      }
      return styleSheet;
    };
    exports.parse = CSSOM.parse;
    CSSOM.CSSStyleSheet = require_CSSStyleSheet().CSSStyleSheet;
    CSSOM.CSSStyleRule = require_CSSStyleRule().CSSStyleRule;
    CSSOM.CSSImportRule = require_CSSImportRule().CSSImportRule;
    CSSOM.CSSGroupingRule = require_CSSGroupingRule().CSSGroupingRule;
    CSSOM.CSSMediaRule = require_CSSMediaRule().CSSMediaRule;
    CSSOM.CSSConditionRule = require_CSSConditionRule().CSSConditionRule;
    CSSOM.CSSSupportsRule = require_CSSSupportsRule().CSSSupportsRule;
    CSSOM.CSSFontFaceRule = require_CSSFontFaceRule().CSSFontFaceRule;
    CSSOM.CSSHostRule = require_CSSHostRule().CSSHostRule;
    CSSOM.CSSStyleDeclaration = require_CSSStyleDeclaration().CSSStyleDeclaration;
    CSSOM.CSSKeyframeRule = require_CSSKeyframeRule().CSSKeyframeRule;
    CSSOM.CSSKeyframesRule = require_CSSKeyframesRule().CSSKeyframesRule;
    CSSOM.CSSValueExpression = require_CSSValueExpression().CSSValueExpression;
    CSSOM.CSSDocumentRule = require_CSSDocumentRule().CSSDocumentRule;
  }
});

// node_modules/cssom/lib/CSSStyleDeclaration.js
var require_CSSStyleDeclaration = __commonJS({
  "node_modules/cssom/lib/CSSStyleDeclaration.js"(exports) {
    var CSSOM = {};
    CSSOM.CSSStyleDeclaration = function CSSStyleDeclaration2() {
      this.length = 0;
      this.parentRule = null;
      this._importants = {};
    };
    CSSOM.CSSStyleDeclaration.prototype = {
      constructor: CSSOM.CSSStyleDeclaration,
      /**
       *
       * @param {string} name
       * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration-getPropertyValue
       * @return {string} the value of the property if it has been explicitly set for this declaration block.
       * Returns the empty string if the property has not been set.
       */
      getPropertyValue: function(name) {
        return this[name] || "";
      },
      /**
       *
       * @param {string} name
       * @param {string} value
       * @param {string} [priority=null] "important" or null
       * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration-setProperty
       */
      setProperty: function(name, value, priority) {
        if (this[name]) {
          var index = Array.prototype.indexOf.call(this, name);
          if (index < 0) {
            this[this.length] = name;
            this.length++;
          }
        } else {
          this[this.length] = name;
          this.length++;
        }
        this[name] = value + "";
        this._importants[name] = priority;
      },
      /**
       *
       * @param {string} name
       * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration-removeProperty
       * @return {string} the value of the property if it has been explicitly set for this declaration block.
       * Returns the empty string if the property has not been set or the property name does not correspond to a known CSS property.
       */
      removeProperty: function(name) {
        if (!(name in this)) {
          return "";
        }
        var index = Array.prototype.indexOf.call(this, name);
        if (index < 0) {
          return "";
        }
        var prevValue = this[name];
        this[name] = "";
        Array.prototype.splice.call(this, index, 1);
        return prevValue;
      },
      getPropertyCSSValue: function() {
      },
      /**
       *
       * @param {String} name
       */
      getPropertyPriority: function(name) {
        return this._importants[name] || "";
      },
      /**
       *   element.style.overflow = "auto"
       *   element.style.getPropertyShorthand("overflow-x")
       *   -> "overflow"
       */
      getPropertyShorthand: function() {
      },
      isPropertyImplicit: function() {
      },
      // Doesn't work in IE < 9
      get cssText() {
        var properties = [];
        for (var i = 0, length2 = this.length; i < length2; ++i) {
          var name = this[i];
          var value = this.getPropertyValue(name);
          var priority = this.getPropertyPriority(name);
          if (priority) {
            priority = " !" + priority;
          }
          properties[i] = name + ": " + value + priority + ";";
        }
        return properties.join(" ");
      },
      set cssText(text) {
        var i, name;
        for (i = this.length; i--; ) {
          name = this[i];
          this[name] = "";
        }
        Array.prototype.splice.call(this, 0, this.length);
        this._importants = {};
        var dummyRule = CSSOM.parse("#bogus{" + text + "}").cssRules[0].style;
        var length2 = dummyRule.length;
        for (i = 0; i < length2; ++i) {
          name = dummyRule[i];
          this.setProperty(dummyRule[i], dummyRule.getPropertyValue(name), dummyRule.getPropertyPriority(name));
        }
      }
    };
    exports.CSSStyleDeclaration = CSSOM.CSSStyleDeclaration;
    CSSOM.parse = require_parse().parse;
  }
});

// node_modules/cssom/lib/clone.js
var require_clone = __commonJS({
  "node_modules/cssom/lib/clone.js"(exports) {
    var CSSOM = {
      CSSStyleSheet: require_CSSStyleSheet().CSSStyleSheet,
      CSSRule: require_CSSRule().CSSRule,
      CSSStyleRule: require_CSSStyleRule().CSSStyleRule,
      CSSGroupingRule: require_CSSGroupingRule().CSSGroupingRule,
      CSSConditionRule: require_CSSConditionRule().CSSConditionRule,
      CSSMediaRule: require_CSSMediaRule().CSSMediaRule,
      CSSSupportsRule: require_CSSSupportsRule().CSSSupportsRule,
      CSSStyleDeclaration: require_CSSStyleDeclaration().CSSStyleDeclaration,
      CSSKeyframeRule: require_CSSKeyframeRule().CSSKeyframeRule,
      CSSKeyframesRule: require_CSSKeyframesRule().CSSKeyframesRule
    };
    CSSOM.clone = function clone(stylesheet) {
      var cloned = new CSSOM.CSSStyleSheet();
      var rules = stylesheet.cssRules;
      if (!rules) {
        return cloned;
      }
      for (var i = 0, rulesLength = rules.length; i < rulesLength; i++) {
        var rule = rules[i];
        var ruleClone = cloned.cssRules[i] = new rule.constructor();
        var style = rule.style;
        if (style) {
          var styleClone = ruleClone.style = new CSSOM.CSSStyleDeclaration();
          for (var j = 0, styleLength = style.length; j < styleLength; j++) {
            var name = styleClone[j] = style[j];
            styleClone[name] = style[name];
            styleClone._importants[name] = style.getPropertyPriority(name);
          }
          styleClone.length = style.length;
        }
        if (rule.hasOwnProperty("keyText")) {
          ruleClone.keyText = rule.keyText;
        }
        if (rule.hasOwnProperty("selectorText")) {
          ruleClone.selectorText = rule.selectorText;
        }
        if (rule.hasOwnProperty("mediaText")) {
          ruleClone.mediaText = rule.mediaText;
        }
        if (rule.hasOwnProperty("conditionText")) {
          ruleClone.conditionText = rule.conditionText;
        }
        if (rule.hasOwnProperty("cssRules")) {
          ruleClone.cssRules = clone(rule).cssRules;
        }
      }
      return cloned;
    };
    exports.clone = CSSOM.clone;
  }
});

// node_modules/cssom/lib/index.js
var require_lib = __commonJS({
  "node_modules/cssom/lib/index.js"(exports) {
    "use strict";
    exports.CSSStyleDeclaration = require_CSSStyleDeclaration().CSSStyleDeclaration;
    exports.CSSRule = require_CSSRule().CSSRule;
    exports.CSSGroupingRule = require_CSSGroupingRule().CSSGroupingRule;
    exports.CSSConditionRule = require_CSSConditionRule().CSSConditionRule;
    exports.CSSStyleRule = require_CSSStyleRule().CSSStyleRule;
    exports.MediaList = require_MediaList().MediaList;
    exports.CSSMediaRule = require_CSSMediaRule().CSSMediaRule;
    exports.CSSSupportsRule = require_CSSSupportsRule().CSSSupportsRule;
    exports.CSSImportRule = require_CSSImportRule().CSSImportRule;
    exports.CSSFontFaceRule = require_CSSFontFaceRule().CSSFontFaceRule;
    exports.CSSHostRule = require_CSSHostRule().CSSHostRule;
    exports.StyleSheet = require_StyleSheet().StyleSheet;
    exports.CSSStyleSheet = require_CSSStyleSheet().CSSStyleSheet;
    exports.CSSKeyframesRule = require_CSSKeyframesRule().CSSKeyframesRule;
    exports.CSSKeyframeRule = require_CSSKeyframeRule().CSSKeyframeRule;
    exports.MatcherList = require_MatcherList().MatcherList;
    exports.CSSDocumentRule = require_CSSDocumentRule().CSSDocumentRule;
    exports.CSSValue = require_CSSValue().CSSValue;
    exports.CSSValueExpression = require_CSSValueExpression().CSSValueExpression;
    exports.parse = require_parse().parse;
    exports.clone = require_clone().clone;
  }
});

// node_modules/linkedom/commonjs/canvas-shim.cjs
var require_canvas_shim = __commonJS({
  "node_modules/linkedom/commonjs/canvas-shim.cjs"(exports, module) {
    var Canvas2 = class {
      constructor(width2, height2) {
        this.width = width2;
        this.height = height2;
      }
      getContext() {
        return null;
      }
      toDataURL() {
        return "";
      }
    };
    module.exports = {
      createCanvas: (width2, height2) => new Canvas2(width2, height2)
    };
  }
});

// node_modules/linkedom/commonjs/canvas.cjs
var require_canvas = __commonJS({
  "node_modules/linkedom/commonjs/canvas.cjs"(exports, module) {
    try {
      module.exports = __require("canvas");
    } catch (fallback) {
      module.exports = require_canvas_shim();
    }
  }
});

// scripts/ink.ts
var import_jpeg_js = __toESM(require_jpeg_js(), 1);
var import_pngjs = __toESM(require_png(), 1);
import { readFile as readFile2, writeFile } from "node:fs/promises";
import { basename, dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// src/theme.ts
import { readFile } from "node:fs/promises";

// node_modules/linkedom/esm/shared/symbols.js
var CHANGED = /* @__PURE__ */ Symbol("changed");
var CLASS_LIST = /* @__PURE__ */ Symbol("classList");
var CUSTOM_ELEMENTS = /* @__PURE__ */ Symbol("CustomElements");
var CONTENT = /* @__PURE__ */ Symbol("content");
var DATASET = /* @__PURE__ */ Symbol("dataset");
var DOCTYPE = /* @__PURE__ */ Symbol("doctype");
var DOM_PARSER = /* @__PURE__ */ Symbol("DOMParser");
var END = /* @__PURE__ */ Symbol("end");
var EVENT_TARGET = /* @__PURE__ */ Symbol("EventTarget");
var GLOBALS = /* @__PURE__ */ Symbol("globals");
var IMAGE = /* @__PURE__ */ Symbol("image");
var MIME = /* @__PURE__ */ Symbol("mime");
var MUTATION_OBSERVER = /* @__PURE__ */ Symbol("MutationObserver");
var NEXT = /* @__PURE__ */ Symbol("next");
var OWNER_ELEMENT = /* @__PURE__ */ Symbol("ownerElement");
var PREV = /* @__PURE__ */ Symbol("prev");
var PRIVATE = /* @__PURE__ */ Symbol("private");
var SHEET = /* @__PURE__ */ Symbol("sheet");
var START = /* @__PURE__ */ Symbol("start");
var STYLE = /* @__PURE__ */ Symbol("style");
var UPGRADE = /* @__PURE__ */ Symbol("upgrade");
var VALUE = /* @__PURE__ */ Symbol("value");

// node_modules/htmlparser2/dist/esm/index.js
var esm_exports3 = {};
__export(esm_exports3, {
  DefaultHandler: () => DomHandler,
  DomHandler: () => DomHandler,
  DomUtils: () => esm_exports2,
  ElementType: () => esm_exports,
  Parser: () => Parser,
  QuoteType: () => QuoteType,
  Tokenizer: () => Tokenizer,
  createDocumentStream: () => createDocumentStream,
  createDomStream: () => createDomStream,
  getFeed: () => getFeed,
  parseDOM: () => parseDOM,
  parseDocument: () => parseDocument,
  parseFeed: () => parseFeed
});

// node_modules/htmlparser2/node_modules/entities/dist/esm/decode-codepoint.js
var _a;
var decodeMap = /* @__PURE__ */ new Map([
  [0, 65533],
  // C1 Unicode control character reference replacements
  [128, 8364],
  [130, 8218],
  [131, 402],
  [132, 8222],
  [133, 8230],
  [134, 8224],
  [135, 8225],
  [136, 710],
  [137, 8240],
  [138, 352],
  [139, 8249],
  [140, 338],
  [142, 381],
  [145, 8216],
  [146, 8217],
  [147, 8220],
  [148, 8221],
  [149, 8226],
  [150, 8211],
  [151, 8212],
  [152, 732],
  [153, 8482],
  [154, 353],
  [155, 8250],
  [156, 339],
  [158, 382],
  [159, 376]
]);
var fromCodePoint = (
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, n/no-unsupported-features/es-builtins
  (_a = String.fromCodePoint) !== null && _a !== void 0 ? _a : ((codePoint) => {
    let output = "";
    if (codePoint > 65535) {
      codePoint -= 65536;
      output += String.fromCharCode(codePoint >>> 10 & 1023 | 55296);
      codePoint = 56320 | codePoint & 1023;
    }
    output += String.fromCharCode(codePoint);
    return output;
  })
);
function replaceCodePoint(codePoint) {
  var _a3;
  if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) {
    return 65533;
  }
  return (_a3 = decodeMap.get(codePoint)) !== null && _a3 !== void 0 ? _a3 : codePoint;
}

// node_modules/htmlparser2/node_modules/entities/dist/esm/internal/decode-shared.js
function decodeBase64(input) {
  const binary = (
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    typeof atob === "function" ? (
      // Browser (and Node >=16)
      // eslint-disable-next-line n/no-unsupported-features/node-builtins
      atob(input)
    ) : (
      // Older Node versions (<16)
      // eslint-disable-next-line n/no-unsupported-features/node-builtins
      typeof Buffer.from === "function" ? (
        // eslint-disable-next-line n/no-unsupported-features/node-builtins
        Buffer.from(input, "base64").toString("binary")
      ) : (
        // eslint-disable-next-line unicorn/no-new-buffer, n/no-deprecated-api
        new Buffer(input, "base64").toString("binary")
      )
    )
  );
  const evenLength = binary.length & ~1;
  const out = new Uint16Array(evenLength / 2);
  for (let index = 0, outIndex = 0; index < evenLength; index += 2) {
    const lo = binary.charCodeAt(index);
    const hi = binary.charCodeAt(index + 1);
    out[outIndex++] = lo | hi << 8;
  }
  return out;
}

// node_modules/htmlparser2/node_modules/entities/dist/esm/generated/decode-data-html.js
var htmlDecodeTree = /* @__PURE__ */ decodeBase64("QR08ALkAAgH6AYsDNQR2BO0EPgXZBQEGLAbdBxMISQrvCmQLfQurDKQNLw4fD4YPpA+6D/IPAAAAAAAAAAAAAAAAKhBMEY8TmxUWF2EYLBkxGuAa3RsJHDscWR8YIC8jSCSIJcMl6ie3Ku8rEC0CLjoupS7kLgAIRU1hYmNmZ2xtbm9wcnN0dVQAWgBeAGUAaQBzAHcAfgCBAIQAhwCSAJoAoACsALMAbABpAGcAO4DGAMZAUAA7gCYAJkBjAHUAdABlADuAwQDBQHIiZXZlAAJhAAFpeW0AcgByAGMAO4DCAMJAEGRyAADgNdgE3XIAYQB2AGUAO4DAAMBA8CFoYZFj4SFjcgBhZAAAoFMqAAFncIsAjgBvAG4ABGFmAADgNdg43fAlbHlGdW5jdGlvbgCgYSBpAG4AZwA7gMUAxUAAAWNzpACoAHIAAOA12Jzc6SFnbgCgVCJpAGwAZABlADuAwwDDQG0AbAA7gMQAxEAABGFjZWZvcnN1xQDYANoA7QDxAPYA+QD8AAABY3LJAM8AayNzbGFzaAAAoBYidgHTANUAAKDnKmUAZAAAoAYjeQARZIABY3J0AOAA5QDrAGEidXNlAACgNSLuI291bGxpcwCgLCFhAJJjcgAA4DXYBd1wAGYAAOA12Dnd5SF2ZdhiYwDyAOoAbSJwZXEAAKBOIgAHSE9hY2RlZmhpbG9yc3UXARoBHwE6AVIBVQFiAWQBZgGCAakB6QHtAfIBYwB5ACdkUABZADuAqQCpQIABY3B5ACUBKAE1AfUhdGUGYWmg0iJ0KGFsRGlmZmVyZW50aWFsRAAAoEUhbCJleXMAAKAtIQACYWVpb0EBRAFKAU0B8iFvbgxhZABpAGwAO4DHAMdAcgBjAAhhbiJpbnQAAKAwIm8AdAAKYQABZG5ZAV0BaSJsbGEAuGB0I2VyRG90ALdg8gA5AWkAp2NyImNsZQAAAkRNUFRwAXQBeQF9AW8AdAAAoJkiaSJudXMAAKCWIuwhdXMAoJUiaSJtZXMAAKCXIm8AAAFjc4cBlAFrKndpc2VDb250b3VySW50ZWdyYWwAAKAyImUjQ3VybHkAAAFEUZwBpAFvJXVibGVRdW90ZQAAoB0gdSJvdGUAAKAZIAACbG5wdbABtgHNAdgBbwBuAGWgNyIAoHQqgAFnaXQAvAHBAcUB8iJ1ZW50AKBhIm4AdAAAoC8i7yV1ckludGVncmFsAKAuIgABZnLRAdMBAKACIe8iZHVjdACgECJuLnRlckNsb2Nrd2lzZUNvbnRvdXJJbnRlZ3JhbAAAoDMi7yFzcwCgLypjAHIAAOA12J7ccABDoNMiYQBwAACgTSKABURKU1phY2VmaW9zAAsCEgIVAhgCGwIsAjQCOQI9AnMCfwNvoEUh9CJyYWhkAKARKWMAeQACZGMAeQAFZGMAeQAPZIABZ3JzACECJQIoAuchZXIAoCEgcgAAoKEhaAB2AACg5CoAAWF5MAIzAvIhb24OYRRkbAB0oAciYQCUY3IAAOA12AfdAAFhZkECawIAAWNtRQJnAvIjaXRpY2FsAAJBREdUUAJUAl8CYwJjInV0ZQC0YG8AdAFZAloC2WJiJGxlQWN1dGUA3WJyImF2ZQBgYGkibGRlANxi7yFuZACgxCJmJWVyZW50aWFsRAAAoEYhcAR9AgAAAAAAAIECjgIAABoDZgAA4DXYO91EoagAhQKJAm8AdAAAoNwgcSJ1YWwAAKBQIuIhbGUAA0NETFJVVpkCqAK1Au8C/wIRA28AbgB0AG8AdQByAEkAbgB0AGUAZwByAGEA7ADEAW8AdAKvAgAAAACwAqhgbiNBcnJvdwAAoNMhAAFlb7kC0AJmAHQAgAFBUlQAwQLGAs0CciJyb3cAAKDQIekkZ2h0QXJyb3cAoNQhZQDlACsCbgBnAAABTFLWAugC5SFmdAABQVLcAuECciJyb3cAAKD4J+kkZ2h0QXJyb3cAoPon6SRnaHRBcnJvdwCg+SdpImdodAAAAUFU9gL7AnIicm93AACg0iFlAGUAAKCoInAAQQIGAwAAAAALA3Iicm93AACg0SFvJHduQXJyb3cAAKDVIWUlcnRpY2FsQmFyAACgJSJuAAADQUJMUlRhJAM2AzoDWgNxA3oDciJyb3cAAKGTIUJVLAMwA2EAcgAAoBMpcCNBcnJvdwAAoPUhciJldmUAEWPlIWZ00gJDAwAASwMAAFIDaSVnaHRWZWN0b3IAAKBQKWUkZVZlY3RvcgAAoF4p5SJjdG9yQqC9IWEAcgAAoFYpaSJnaHQA1AFiAwAAaQNlJGVWZWN0b3IAAKBfKeUiY3RvckKgwSFhAHIAAKBXKWUAZQBBoKQiciJyb3cAAKCnIXIAcgBvAPcAtAIAAWN0gwOHA3IAAOA12J/c8iFvaxBhAAhOVGFjZGZnbG1vcHFzdHV4owOlA6kDsAO/A8IDxgPNA9ID8gP9AwEEFAQeBCAEJQRHAEphSAA7gNAA0EBjAHUAdABlADuAyQDJQIABYWl5ALYDuQO+A/Ihb24aYXIAYwA7gMoAykAtZG8AdAAWYXIAAOA12AjdcgBhAHYAZQA7gMgAyEDlIm1lbnQAoAgiAAFhcNYD2QNjAHIAEmF0AHkAUwLhAwAAAADpA20lYWxsU3F1YXJlAACg+yVlJ3J5U21hbGxTcXVhcmUAAKCrJQABZ3D2A/kDbwBuABhhZgAA4DXYPN3zImlsb26VY3UAAAFhaQYEDgRsAFSgdSppImxkZQAAoEIi7CNpYnJpdW0AoMwhAAFjaRgEGwRyAACgMCFtAACgcyphAJdjbQBsADuAywDLQAABaXApBC0E8yF0cwCgAyLvJG5lbnRpYWxFAKBHIYACY2Zpb3MAPQQ/BEMEXQRyBHkAJGRyAADgNdgJ3WwibGVkAFMCTAQAAAAAVARtJWFsbFNxdWFyZQAAoPwlZSdyeVNtYWxsU3F1YXJlAACgqiVwA2UEAABpBAAAAABtBGYAAOA12D3dwSFsbACgACLyI2llcnRyZgCgMSFjAPIAcQQABkpUYWJjZGZnb3JzdIgEiwSOBJMElwSkBKcEqwStBLIE5QTqBGMAeQADZDuAPgA+QO0hbWFkoJMD3GNyImV2ZQAeYYABZWl5AJ0EoASjBOQhaWwiYXIAYwAcYRNkbwB0ACBhcgAA4DXYCt0AoNkicABmAADgNdg+3eUiYXRlcgADRUZHTFNUvwTIBM8E1QTZBOAEcSJ1YWwATKBlIuUhc3MAoNsidSRsbEVxdWFsAACgZyJyI2VhdGVyAACgoirlIXNzAKB3IuwkYW50RXF1YWwAoH4qaSJsZGUAAKBzImMAcgAA4DXYotwAoGsiAARBYWNmaW9zdfkE/QQFBQgFCwUTBSIFKwVSIkRjeQAqZAABY3QBBQQFZQBrAMdiXmDpIXJjJGFyAACgDCFsJWJlcnRTcGFjZQAAoAsh8AEYBQAAGwVmAACgDSHpJXpvbnRhbExpbmUAoAAlAAFjdCYFKAXyABIF8iFvayZhbQBwAEQBMQU5BW8AdwBuAEgAdQBtAPAAAAFxInVhbAAAoE8iAAdFSk9hY2RmZ21ub3N0dVMFVgVZBVwFYwVtBXAFcwV6BZAFtgXFBckFzQVjAHkAFWTsIWlnMmFjAHkAAWRjAHUAdABlADuAzQDNQAABaXlnBWwFcgBjADuAzgDOQBhkbwB0ADBhcgAAoBEhcgBhAHYAZQA7gMwAzEAAoREhYXB/BYsFAAFjZ4MFhQVyACphaSNuYXJ5SQAAoEghbABpAGUA8wD6AvQBlQUAAKUFZaAsIgABZ3KaBZ4F8iFhbACgKyLzI2VjdGlvbgCgwiJpI3NpYmxlAAABQ1SsBbEFbyJtbWEAAKBjIGkibWVzAACgYiCAAWdwdAC8Bb8FwwVvAG4ALmFmAADgNdhA3WEAmWNjAHIAAKAQIWkibGRlAChh6wHSBQAA1QVjAHkABmRsADuAzwDPQIACY2Zvc3UA4QXpBe0F8gX9BQABaXnlBegFcgBjADRhGWRyAADgNdgN3XAAZgAA4DXYQd3jAfcFAAD7BXIAAOA12KXc8iFjeQhk6yFjeQRkgANISmFjZm9zAAwGDwYSBhUGHQYhBiYGYwB5ACVkYwB5AAxk8CFwYZpjAAFleRkGHAbkIWlsNmEaZHIAAOA12A7dcABmAADgNdhC3WMAcgAA4DXYptyABUpUYWNlZmxtb3N0AD0GQAZDBl4GawZkB2gHcAd0B80H2gdjAHkACWQ7gDwAPECAAmNtbnByAEwGTwZSBlUGWwb1IXRlOWHiIWRhm2NnAACg6ifsI2FjZXRyZgCgEiFyAACgniGAAWFleQBkBmcGagbyIW9uPWHkIWlsO2EbZAABZnNvBjQHdAAABUFDREZSVFVWYXKABp4GpAbGBssG3AYDByEHwQIqBwABbnKEBowGZyVsZUJyYWNrZXQAAKDoJ/Ihb3cAoZAhQlKTBpcGYQByAACg5CHpJGdodEFycm93AKDGIWUjaWxpbmcAAKAII28A9QGqBgAAsgZiJWxlQnJhY2tldAAAoOYnbgDUAbcGAAC+BmUkZVZlY3RvcgAAoGEp5SJjdG9yQqDDIWEAcgAAoFkpbCJvb3IAAKAKI2kiZ2h0AAABQVbSBtcGciJyb3cAAKCUIeUiY3RvcgCgTikAAWVy4AbwBmUAAKGjIkFW5gbrBnIicm93AACgpCHlImN0b3IAoFopaSNhbmdsZQBCorIi+wYAAAAA/wZhAHIAAKDPKXEidWFsAACgtCJwAIABRFRWAAoHEQcYB+8kd25WZWN0b3IAoFEpZSRlVmVjdG9yAACgYCnlImN0b3JCoL8hYQByAACgWCnlImN0b3JCoLwhYQByAACgUilpAGcAaAB0AGEAcgByAG8A9wDMAnMAAANFRkdMU1Q/B0cHTgdUB1gHXwfxJXVhbEdyZWF0ZXIAoNoidSRsbEVxdWFsAACgZiJyI2VhdGVyAACgdiLlIXNzAKChKuwkYW50RXF1YWwAoH0qaSJsZGUAAKByInIAAOA12A/dZaDYIuYjdGFycm93AKDaIWkiZG90AD9hgAFucHcAege1B7kHZwAAAkxSbHKCB5QHmwerB+UhZnQAAUFSiAeNB3Iicm93AACg9SfpJGdodEFycm93AKD3J+kkZ2h0QXJyb3cAoPYn5SFmdAABYXLcAqEHaQBnAGgAdABhAHIAcgBvAPcA5wJpAGcAaAB0AGEAcgByAG8A9wDuAmYAAOA12EPdZQByAAABTFK/B8YHZSRmdEFycm93AACgmSHpJGdodEFycm93AKCYIYABY2h0ANMH1QfXB/IAWgYAoLAh8iFva0FhAKBqIgAEYWNlZmlvc3XpB+wH7gf/BwMICQgOCBEIcAAAoAUpeQAcZAABZGzyB/kHaSR1bVNwYWNlAACgXyBsI2ludHJmAACgMyFyAADgNdgQ3e4jdXNQbHVzAKATInAAZgAA4DXYRN1jAPIA/gecY4AESmFjZWZvc3R1ACEIJAgoCDUIgQiFCDsKQApHCmMAeQAKZGMidXRlAENhgAFhZXkALggxCDQI8iFvbkdh5CFpbEVhHWSAAWdzdwA7CGEIfQjhInRpdmWAAU1UVgBECEwIWQhlJWRpdW1TcGFjZQAAoAsgaABpAAABY25SCFMIawBTAHAAYQBjAOUASwhlAHIAeQBUAGgAaQDuAFQI9CFlZAABR0xnCHUIcgBlAGEAdABlAHIARwByAGUAYQB0AGUA8gDrBGUAcwBzAEwAZQBzAPMA2wdMImluZQAKYHIAAOA12BHdAAJCbnB0jAiRCJkInAhyImVhawAAoGAgwiZyZWFraW5nU3BhY2WgYGYAAKAVIUOq7CqzCMIIzQgAAOcIGwkAAAAAAAAtCQAAbwkAAIcJAACdCcAJGQoAADQKAAFvdbYIvAjuI2dydWVudACgYiJwIkNhcAAAoG0ibyh1YmxlVmVydGljYWxCYXIAAKAmIoABbHF4ANII1wjhCOUibWVudACgCSL1IWFsVKBgImkibGRlAADgQiI4A2kic3RzAACgBCJyI2VhdGVyAACjbyJFRkdMU1T1CPoIAgkJCQ0JFQlxInVhbAAAoHEidSRsbEVxdWFsAADgZyI4A3IjZWF0ZXIAAOBrIjgD5SFzcwCgeSLsJGFudEVxdWFsAOB+KjgDaSJsZGUAAKB1IvUhbXBEASAJJwnvI3duSHVtcADgTiI4A3EidWFsAADgTyI4A2UAAAFmczEJRgn0JFRyaWFuZ2xlQqLqIj0JAAAAAEIJYQByAADgzyk4A3EidWFsAACg7CJzAICibiJFR0xTVABRCVYJXAlhCWkJcSJ1YWwAAKBwInIjZWF0ZXIAAKB4IuUhc3MA4GoiOAPsJGFudEVxdWFsAOB9KjgDaSJsZGUAAKB0IuUic3RlZAABR0x1CX8J8iZlYXRlckdyZWF0ZXIA4KIqOAPlI3NzTGVzcwDgoSo4A/IjZWNlZGVzAKGAIkVTjwmVCXEidWFsAADgryo4A+wkYW50RXF1YWwAoOAiAAFlaaAJqQl2JmVyc2VFbGVtZW50AACgDCLnJWh0VHJpYW5nbGVCousitgkAAAAAuwlhAHIAAODQKTgDcSJ1YWwAAKDtIgABcXXDCeAJdSNhcmVTdQAAAWJwywnVCfMhZXRF4I8iOANxInVhbAAAoOIi5SJyc2V0ReCQIjgDcSJ1YWwAAKDjIoABYmNwAOYJ8AkNCvMhZXRF4IIi0iBxInVhbAAAoIgi4yJlZWRzgKGBIkVTVAD6CQAKBwpxInVhbAAA4LAqOAPsJGFudEVxdWFsAKDhImkibGRlAADgfyI4A+UicnNldEXggyLSIHEidWFsAACgiSJpImxkZQCAoUEiRUZUACIKJwouCnEidWFsAACgRCJ1JGxsRXF1YWwAAKBHImkibGRlAACgSSJlJXJ0aWNhbEJhcgAAoCQiYwByAADgNdip3GkAbABkAGUAO4DRANFAnWMAB0VhY2RmZ21vcHJzdHV2XgphCmgKcgp2CnoKgQqRCpYKqwqtCrsKyArNCuwhaWdSYWMAdQB0AGUAO4DTANNAAAFpeWwKcQpyAGMAO4DUANRAHmRiImxhYwBQYXIAAOA12BLdcgBhAHYAZQA7gNIA0kCAAWFlaQCHCooKjQpjAHIATGFnAGEAqWNjInJvbgCfY3AAZgAA4DXYRt3lI25DdXJseQABRFGeCqYKbyV1YmxlUXVvdGUAAKAcIHUib3RlAACgGCAAoFQqAAFjbLEKtQpyAADgNdiq3GEAcwBoADuA2ADYQGkAbAHACsUKZABlADuA1QDVQGUAcwAAoDcqbQBsADuA1gDWQGUAcgAAAUJQ0wrmCgABYXLXCtoKcgAAoD4gYQBjAAABZWvgCuIKAKDeI2UAdAAAoLQjYSVyZW50aGVzaXMAAKDcI4AEYWNmaGlsb3JzAP0KAwsFCwkLCwsMCxELIwtaC3IjdGlhbEQAAKACInkAH2RyAADgNdgT3WkApmOgY/Ujc01pbnVzsWAAAWlwFQsgC24AYwBhAHIAZQBwAGwAYQBuAOUACgVmAACgGSGAobsqZWlvACoLRQtJC+MiZWRlc4CheiJFU1QANAs5C0ALcSJ1YWwAAKCvKuwkYW50RXF1YWwAoHwiaSJsZGUAAKB+Im0AZQAAoDMgAAFkcE0LUQv1IWN0AKAPIm8jcnRpb24AYaA3ImwAAKAdIgABY2leC2ILcgAA4DXYq9yoYwACVWZvc2oLbwtzC3cLTwBUADuAIgAiQHIAAOA12BTdcABmAACgGiFjAHIAAOA12KzcAAZCRWFjZWZoaW9yc3WPC5MLlwupC7YL2AvbC90LhQyTDJoMowzhIXJyAKAQKUcAO4CuAK5AgAFjbnIAnQugC6ML9SF0ZVRhZwAAoOsncgB0oKAhbAAAoBYpgAFhZXkArwuyC7UL8iFvblhh5CFpbFZhIGR2oBwhZSJyc2UAAAFFVb8LzwsAAWxxwwvIC+UibWVudACgCyL1JGlsaWJyaXVtAKDLIXAmRXF1aWxpYnJpdW0AAKBvKXIAAKAcIW8AoWPnIWh0AARBQ0RGVFVWYewLCgwQDDIMNwxeDHwM9gIAAW5y8Av4C2clbGVCcmFja2V0AACg6SfyIW93AKGSIUJM/wsDDGEAcgAAoOUhZSRmdEFycm93AACgxCFlI2lsaW5nAACgCSNvAPUBFgwAAB4MYiVsZUJyYWNrZXQAAKDnJ24A1AEjDAAAKgxlJGVWZWN0b3IAAKBdKeUiY3RvckKgwiFhAHIAAKBVKWwib29yAACgCyMAAWVyOwxLDGUAAKGiIkFWQQxGDHIicm93AACgpiHlImN0b3IAoFspaSNhbmdsZQBCorMiVgwAAAAAWgxhAHIAAKDQKXEidWFsAACgtSJwAIABRFRWAGUMbAxzDO8kd25WZWN0b3IAoE8pZSRlVmVjdG9yAACgXCnlImN0b3JCoL4hYQByAACgVCnlImN0b3JCoMAhYQByAACgUykAAXB1iQyMDGYAAKAdIe4kZEltcGxpZXMAoHAp6SRnaHRhcnJvdwCg2yEAAWNongyhDHIAAKAbIQCgsSHsJGVEZWxheWVkAKD0KYAGSE9hY2ZoaW1vcXN0dQC/DMgMzAzQDOIM5gwKDQ0NFA0ZDU8NVA1YDQABQ2PDDMYMyCFjeSlkeQAoZEYiVGN5ACxkYyJ1dGUAWmEAorwqYWVpedgM2wzeDOEM8iFvbmBh5CFpbF5hcgBjAFxhIWRyAADgNdgW3e8hcnQAAkRMUlXvDPYM/QwEDW8kd25BcnJvdwAAoJMhZSRmdEFycm93AACgkCHpJGdodEFycm93AKCSIXAjQXJyb3cAAKCRIechbWGjY+EkbGxDaXJjbGUAoBgicABmAADgNdhK3XICHw0AAAAAIg10AACgGiLhIXJlgKGhJUlTVQAqDTINSg3uJXRlcnNlY3Rpb24AoJMidQAAAWJwNw1ADfMhZXRFoI8icSJ1YWwAAKCRIuUicnNldEWgkCJxInVhbAAAoJIibiJpb24AAKCUImMAcgAA4DXYrtxhAHIAAKDGIgACYmNtcF8Nag2ODZANc6DQImUAdABFoNAicSJ1YWwAAKCGIgABY2huDYkNZSJlZHMAgKF7IkVTVAB4DX0NhA1xInVhbAAAoLAq7CRhbnRFcXVhbACgfSJpImxkZQAAoH8iVABoAGEA9ADHCwCgESIAodEiZXOVDZ8NciJzZXQARaCDInEidWFsAACghyJlAHQAAKDRIoAFSFJTYWNmaGlvcnMAtQ27Db8NyA3ODdsN3w3+DRgOHQ4jDk8AUgBOADuA3gDeQMEhREUAoCIhAAFIY8MNxg1jAHkAC2R5ACZkAAFidcwNzQ0JYKRjgAFhZXkA1A3XDdoN8iFvbmRh5CFpbGJhImRyAADgNdgX3QABZWnjDe4N8gHoDQAA7Q3lImZvcmUAoDQiYQCYYwABY27yDfkNayNTcGFjZQAA4F8gCiDTInBhY2UAoAkg7CFkZYChPCJFRlQABw4MDhMOcSJ1YWwAAKBDInUkbGxFcXVhbAAAoEUiaSJsZGUAAKBIInAAZgAA4DXYS93pI3BsZURvdACg2yAAAWN0Jw4rDnIAAOA12K/c8iFva2Zh4QpFDlYOYA5qDgAAbg5yDgAAAAAAAAAAAAB5DnwOqA6zDgAADg8RDxYPGg8AAWNySA5ODnUAdABlADuA2gDaQHIAb6CfIeMhaXIAoEkpcgDjAVsOAABdDnkADmR2AGUAbGEAAWl5Yw5oDnIAYwA7gNsA20AjZGIibGFjAHBhcgAA4DXYGN1yAGEAdgBlADuA2QDZQOEhY3JqYQABZGl/Dp8OZQByAAABQlCFDpcOAAFhcokOiw5yAF9gYQBjAAABZWuRDpMOAKDfI2UAdAAAoLUjYSVyZW50aGVzaXMAAKDdI28AbgBQoMMi7CF1cwCgjiIAAWdwqw6uDm8AbgByYWYAAOA12EzdAARBREVUYWRwc78O0g7ZDuEOBQPqDvMOBw9yInJvdwDCoZEhyA4AAMwOYQByAACgEilvJHduQXJyb3cAAKDFIW8kd25BcnJvdwAAoJUhcSV1aWxpYnJpdW0AAKBuKWUAZQBBoKUiciJyb3cAAKClIW8AdwBuAGEAcgByAG8A9wAQA2UAcgAAAUxS+Q4AD2UkZnRBcnJvdwAAoJYh6SRnaHRBcnJvdwCglyFpAGyg0gNvAG4ApWPpIW5nbmFjAHIAAOA12LDcaSJsZGUAaGFtAGwAO4DcANxAgAREYmNkZWZvc3YALQ8xDzUPNw89D3IPdg97D4AP4SFzaACgqyJhAHIAAKDrKnkAEmThIXNobKCpIgCg5ioAAWVyQQ9DDwCgwSKAAWJ0eQBJD00Paw9hAHIAAKAWIGmgFiDjIWFsAAJCTFNUWA9cD18PZg9hAHIAAKAjIukhbmV8YGUkcGFyYXRvcgAAoFgnaSJsZGUAAKBAItQkaGluU3BhY2UAoAogcgAA4DXYGd1wAGYAAOA12E3dYwByAADgNdix3GQiYXNoAACgqiKAAmNlZm9zAI4PkQ+VD5kPng/pIXJjdGHkIWdlAKDAInIAAOA12BrdcABmAADgNdhO3WMAcgAA4DXYstwAAmZpb3OqD64Prw+0D3IAAOA12BvdnmNwAGYAAOA12E/dYwByAADgNdiz3IAEQUlVYWNmb3N1AMgPyw/OD9EP2A/gD+QP6Q/uD2MAeQAvZGMAeQAHZGMAeQAuZGMAdQB0AGUAO4DdAN1AAAFpedwP3w9yAGMAdmErZHIAAOA12BzdcABmAADgNdhQ3WMAcgAA4DXYtNxtAGwAeGEABEhhY2RlZm9z/g8BEAUQDRAQEB0QIBAkEGMAeQAWZGMidXRlAHlhAAFheQkQDBDyIW9ufWEXZG8AdAB7YfIBFRAAABwQbwBXAGkAZAB0AOgAVAhhAJZjcgAAoCghcABmAACgJCFjAHIAAOA12LXc4QtCEEkQTRAAAGcQbRByEAAAAAAAAAAAeRCKEJcQ8hD9EAAAGxEhETIROREAAD4RYwB1AHQAZQA7gOEA4UByImV2ZQADYYCiPiJFZGl1eQBWEFkQWxBgEGUQAOA+IjMDAKA/InIAYwA7gOIA4kB0AGUAO4C0ALRAMGRsAGkAZwA7gOYA5kByoGEgAOA12B7dcgBhAHYAZQA7gOAA4EAAAWVwfBCGEAABZnCAEIQQ8yF5bQCgNSHoAIMQaABhALFjAAFhcI0QWwAAAWNskRCTEHIAAWFnAACgPypkApwQAAAAALEQAKInImFkc3ajEKcQqRCuEG4AZAAAoFUqAKBcKmwib3BlAACgWCoAoFoqAKMgImVsbXJzersQvRDAEN0Q5RDtEACgpCllAACgICJzAGQAYaAhImEEzhDQENIQ1BDWENgQ2hDcEACgqCkAoKkpAKCqKQCgqykAoKwpAKCtKQCgrikAoK8pdAB2oB8iYgBkoL4iAKCdKQABcHTpEOwQaAAAoCIixWDhIXJyAKB8IwABZ3D1EPgQbwBuAAVhZgAA4DXYUt0Ao0giRWFlaW9wBxEJEQ0RDxESERQRAKBwKuMhaXIAoG8qAKBKImQAAKBLInMAJ2DyIW94ZaBIIvEADhFpAG4AZwA7gOUA5UCAAWN0eQAmESoRKxFyAADgNdi23CpgbQBwAGWgSCLxAPgBaQBsAGQAZQA7gOMA40BtAGwAO4DkAORAAAFjaUERRxFvAG4AaQBuAPQA6AFuAHQAAKARKgAITmFiY2RlZmlrbG5vcHJzdWQRaBGXEZ8RpxGrEdIR1hErEjASexKKEn0RThNbE3oTbwB0AACg7SoAAWNybBGJEWsAAAJjZXBzdBF4EX0RghHvIW5nAKBMInAjc2lsb24A9mNyImltZQAAoDUgaQBtAGWgPSJxAACgzSJ2AY0RkRFlAGUAAKC9ImUAZABnoAUjZQAAoAUjcgBrAHSgtSPiIXJrAKC2IwABb3mjEaYRbgDnAHcRMWTxIXVvAKAeIIACY21wcnQAtBG5Eb4RwRHFEeEhdXPloDUi5ABwInR5dgAAoLApcwDpAH0RbgBvAPUA6gCAAWFodwDLEcwRzhGyYwCgNiHlIWVuAKBsInIAAOA12B/dZwCAA2Nvc3R1dncA4xHyEQUSEhIhEiYSKRKAAWFpdQDpEesR7xHwAKMFcgBjAACg7yVwAACgwyKAAWRwdAD4EfwRABJvAHQAAKAAKuwhdXMAoAEqaSJtZXMAAKACKnECCxIAAAAADxLjIXVwAKAGKmEAcgAAoAUm8iNpYW5nbGUAAWR1GhIeEu8hd24AoL0lcAAAoLMlcCJsdXMAAKAEKmUA5QBCD+UAkg9hInJvdwAAoA0pgAFha28ANhJoEncSAAFjbjoSZRJrAIABbHN0AEESRxJNEm8jemVuZ2UAAKDrKXEAdQBhAHIA5QBcBPIjaWFuZ2xlgKG0JWRscgBYElwSYBLvIXduAKC+JeUhZnQAoMIlaSJnaHQAAKC4JWsAAKAjJLEBbRIAAHUSsgFxEgAAcxIAoJIlAKCRJTQAAKCTJWMAawAAoIglAAFlb38ShxJx4D0A5SD1IWl2AOBhIuUgdAAAoBAjAAJwdHd4kRKVEpsSnxJmAADgNdhT3XSgpSJvAG0AAKClIvQhaWUAoMgiAAZESFVWYmRobXB0dXayEsES0RLgEvcS+xIKExoTHxMjEygTNxMAAkxSbHK5ErsSvRK/EgCgVyUAoFQlAKBWJQCgUyUAolAlRFVkdckSyxLNEs8SAKBmJQCgaSUAoGQlAKBnJQACTFJsctgS2hLcEt4SAKBdJQCgWiUAoFwlAKBZJQCjUSVITFJobHLrEu0S7xLxEvMS9RIAoGwlAKBjJQCgYCUAoGslAKBiJQCgXyVvAHgAAKDJKQACTFJscgITBBMGEwgTAKBVJQCgUiUAoBAlAKAMJQCiACVEVWR1EhMUExYTGBMAoGUlAKBoJQCgLCUAoDQlaSJudXMAAKCfIuwhdXMAoJ4iaSJtZXMAAKCgIgACTFJsci8TMRMzEzUTAKBbJQCgWCUAoBglAKAUJQCjAiVITFJobHJCE0QTRhNIE0oTTBMAoGolAKBhJQCgXiUAoDwlAKAkJQCgHCUAAWV2UhNVE3YA5QD5AGIAYQByADuApgCmQAACY2Vpb2ITZhNqE24TcgAA4DXYt9xtAGkAAKBPIG0A5aA9IogRbAAAoVwAYmh0E3YTAKDFKfMhdWIAoMgnbAF+E4QTbABloCIgdAAAoCIgcAAAoU4iRWWJE4sTAKCuKvGgTyI8BeEMqRMAAN8TABQDFB8UAAAjFDQUAAAAAIUUAAAAAI0UAAAAANcU4xT3FPsUAACIFQAAlhWAAWNwcgCuE7ET1RP1IXRlB2GAoikiYWJjZHMAuxO/E8QTzhPSE24AZAAAoEQqciJjdXAAAKBJKgABYXXIE8sTcAAAoEsqcAAAoEcqbwB0AACgQCoA4CkiAP4AAWVv2RPcE3QAAKBBIO4ABAUAAmFlaXXlE+8T9RP4E/AB6hMAAO0TcwAAoE0qbwBuAA1hZABpAGwAO4DnAOdAcgBjAAlhcABzAHOgTCptAACgUCpvAHQAC2GAAWRtbgAIFA0UEhRpAGwAO4C4ALhAcCJ0eXYAAKCyKXQAAIGiADtlGBQZFKJAcgBkAG8A9ABiAXIAAOA12CDdgAFjZWkAKBQqFDIUeQBHZGMAawBtoBMn4SFyawCgEyfHY3IAAKPLJUVjZWZtcz8UQRRHFHcUfBSAFACgwykAocYCZWxGFEkUcQAAoFciZQBhAlAUAAAAAGAUciJyb3cAAAFsclYUWhTlIWZ0AKC6IWkiZ2h0AACguyGAAlJTYWNkAGgUaRRrFG8UcxSuYACgyCRzAHQAAKCbIukhcmMAoJoi4SFzaACgnSJuImludAAAoBAqaQBkAACg7yrjIWlyAKDCKfUhYnN1oGMmaQB0AACgYybsApMUmhS2FAAAwxRvAG4AZaA6APGgVCKrAG0CnxQAAAAAoxRhAHSgLABAYAChASJmbKcUqRTuABMNZQAAAW14rhSyFOUhbnQAoAEiZQDzANIB5wG6FAAAwBRkoEUibwB0AACgbSpuAPQAzAGAAWZyeQDIFMsUzhQA4DXYVN1vAOQA1wEAgakAO3MeAdMUcgAAoBchAAFhb9oU3hRyAHIAAKC1IXMAcwAAoBcnAAFjdeYU6hRyAADgNdi43AABYnDuFPIUZaDPKgCg0SploNAqAKDSKuQhb3QAoO8igANkZWxwcnZ3AAYVEBUbFSEVRBVlFYQV4SFycgABbHIMFQ4VAKA4KQCgNSlwAhYVAAAAABkVcgAAoN4iYwAAoN8i4SFycnCgtiEAoD0pgKIqImJjZG9zACsVMBU6FT4VQRVyImNhcAAAoEgqAAFhdTQVNxVwAACgRipwAACgSipvAHQAAKCNInIAAKBFKgDgKiIA/gACYWxydksVURVuFXMVcgByAG2gtyEAoDwpeQCAAWV2dwBYFWUVaRVxAHACXxUAAAAAYxVyAGUA4wAXFXUA4wAZFWUAZQAAoM4iZSJkZ2UAAKDPImUAbgA7gKQApEBlI2Fycm93AAABbHJ7FX8V5SFmdACgtiFpImdodAAAoLchZQDkAG0VAAFjaYsVkRVvAG4AaQBuAPQAkwFuAHQAAKAxImwiY3R5AACgLSOACUFIYWJjZGVmaGlqbG9yc3R1d3oAuBW7Fb8V1RXgFegV+RUKFhUWHxZUFlcWZRbFFtsW7xb7FgUXChdyAPIAtAJhAHIAAKBlKQACZ2xyc8YVyhXOFdAV5yFlcgCgICDlIXRoAKA4IfIA9QxoAHagECAAoKMiawHZFd4VYSJyb3cAAKAPKWEA4wBfAgABYXnkFecV8iFvbg9hNGQAoUYhYW/tFfQVAAFnciEC8RVyAACgyiF0InNlcQAAoHcqgAFnbG0A/xUCFgUWO4CwALBAdABhALRjcCJ0eXYAAKCxKQABaXIOFhIW8yFodACgfykA4DXYId1hAHIAAAFschsWHRYAoMMhAKDCIYACYWVnc3YAKBauAjYWOhY+Fm0AAKHEIm9zLhY0Fm4AZABzoMQi9SFpdACgZiZhIm1tYQDdY2kAbgAAoPIiAKH3AGlvQxZRFmQAZQAAgfcAO29KFksW90BuI3RpbWVzAACgxyJuAPgAUBZjAHkAUmRjAG8CXhYAAAAAYhZyAG4AAKAeI28AcAAAoA0jgAJscHR1dwBuFnEWdRaSFp4W7CFhciRgZgAA4DXYVd0AotkCZW1wc30WhBaJFo0WcQBkoFAibwB0AACgUSJpIm51cwAAoDgi7CF1cwCgFCLxInVhcmUAoKEiYgBsAGUAYgBhAHIAdwBlAGQAZwDlANcAbgCAAWFkaAClFqoWtBZyAHIAbwD3APUMbwB3AG4AYQByAHIAbwB3APMA8xVhI3Jwb29uAAABbHK8FsAWZQBmAPQAHBZpAGcAaAD0AB4WYgHJFs8WawBhAHIAbwD3AJILbwLUFgAAAADYFnIAbgAAoB8jbwBwAACgDCOAAWNvdADhFukW7BYAAXJ55RboFgDgNdi53FVkbAAAoPYp8iFvaxFhAAFkcvMW9xZvAHQAAKDxImkA5qC/JVsSAAFhaP8WAhdyAPIANQNhAPIA1wvhIm5nbGUAoKYpAAFjaQ4XEBd5AF9k5yJyYXJyAKD/JwAJRGFjZGVmZ2xtbm9wcXJzdHV4MRc4F0YXWxcyBF4XaRd5F40XrBe0F78X2RcVGCEYLRg1GEAYAAFEbzUXgRZvAPQA+BUAAWNzPBdCF3UAdABlADuA6QDpQPQhZXIAoG4qAAJhaW95TRdQF1YXWhfyIW9uG2FyAGOgViI7gOoA6kDsIW9uAKBVIk1kbwB0ABdhAAFEcmIXZhdvAHQAAKBSIgDgNdgi3XKhmipuF3QXYQB2AGUAO4DoAOhAZKCWKm8AdAAAoJgqgKGZKmlscwCAF4UXhxfuInRlcnMAoOcjAKATIWSglSpvAHQAAKCXKoABYXBzAJMXlheiF2MAcgATYXQAeQBzogUinxcAAAAAoRdlAHQAAKAFInAAMaADIDMBqRerFwCgBCAAoAUgAAFnc7AXsRdLYXAAAKACIAABZ3C4F7sXbwBuABlhZgAA4DXYVt2AAWFscwDFF8sXzxdyAHOg1SJsAACg4yl1AHMAAKBxKmkAAKG1A2x21RfYF28AbgC1Y/VjAAJjc3V24BfoF/0XEBgAAWlv5BdWF3IAYwAAoFYiaQLuFwAAAADwF+0ADQThIW50AAFnbPUX+Rd0AHIAAKCWKuUhc3MAoJUqgAFhZWkAAxgGGAoYbABzAD1gcwB0AACgXyJ2AESgYSJEAACgeCrwImFyc2wAoOUpAAFEYRkYHRhvAHQAAKBTInIAcgAAoHEpgAFjZGkAJxgqGO0XcgAAoC8hbwD0AIwCAAFhaDEYMhi3YzuA8ADwQAABbXI5GD0YbAA7gOsA60BvAACgrCCAAWNpcABGGEgYSxhsACFgcwD0ACwEAAFlb08YVxhjAHQAYQB0AGkAbwDuABoEbgBlAG4AdABpAGEAbADlADME4Ql1GAAAgRgAAIMYiBgAAAAAoRilGAAAqhgAALsYvhjRGAAA1xgnGWwAbABpAG4AZwBkAG8AdABzAGUA8QBlF3kARGRtImFsZQAAoEAmgAFpbHIAjRiRGJ0Y7CFpZwCgA/tpApcYAAAAAJoYZwAAoAD7aQBnAACgBPsA4DXYI93sIWlnAKAB++whaWcA4GYAagCAAWFsdACvGLIYthh0AACgbSZpAGcAAKAC+24AcwAAoLElbwBmAJJh8AHCGAAAxhhmAADgNdhX3QABYWvJGMwYbADsAGsEdqDUIgCg2SphI3J0aW50AACgDSoAAWFv2hgiGQABY3PeGB8ZsQPnGP0YBRkSGRUZAAAdGbID7xjyGPQY9xj5GAAA+xg7gL0AvUAAoFMhO4C8ALxAAKBVIQCgWSEAoFshswEBGQAAAxkAoFQhAKBWIbQCCxkOGQAAAAAQGTuAvgC+QACgVyEAoFwhNQAAoFghtgEZGQAAGxkAoFohAKBdITgAAKBeIWwAAKBEIHcAbgAAoCIjYwByAADgNdi73IAIRWFiY2RlZmdpamxub3JzdHYARhlKGVoZXhlmGWkZkhmWGZkZnRmgGa0ZxhnLGc8Z4BkjGmygZyIAoIwqgAFjbXAAUBlTGVgZ9SF0ZfVhbQBhAOSgswM6FgCghipyImV2ZQAfYQABaXliGWUZcgBjAB1hM2RvAHQAIWGAoWUibHFzAMYEcBl6GfGhZSLOBAAAdhlsAGEAbgD0AN8EgKF+KmNkbACBGYQZjBljAACgqSpvAHQAb6CAKmyggioAoIQqZeDbIgD+cwAAoJQqcgAA4DXYJN3noGsirATtIWVsAKA3IWMAeQBTZIChdyJFYWoApxmpGasZAKCSKgCgpSoAoKQqAAJFYWVztBm2Gb0ZwhkAoGkicABwoIoq8iFveACgiipxoIgq8aCIKrUZaQBtAACg5yJwAGYAAOA12FjdYQB2AOUAYwIAAWNp0xnWGXIAAKAKIW0AAKFzImVs3BneGQCgjioAoJAqAIM+ADtjZGxxco0E6xn0GfgZ/BkBGgABY2nvGfEZAKCnKnIAAKB6Km8AdAAAoNci0CFhcgCglSl1ImVzdAAAoHwqgAJhZGVscwAKGvQZFhrVBCAa8AEPGgAAFBpwAHIAbwD4AFkZcgAAoHgpcQAAAWxxxAQbGmwAZQBzAPMASRlpAO0A5AQAAWVuJxouGnIjdG5lcXEAAOBpIgD+xQAsGgAFQWFiY2Vma29zeUAaQxpmGmoabRqDGocalhrCGtMacgDyAMwCAAJpbG1yShpOGlAaVBpyAHMA8ABxD2YAvWBpAGwA9AASBQABZHJYGlsaYwB5AEpkAKGUIWN3YBpkGmkAcgAAoEgpAKCtIWEAcgAAoA8h6SFyYyVhgAFhbHIAcxp7Gn8a8iF0c3WgZSZpAHQAAKBlJuwhaXAAoCYg4yFvbgCguSJyAADgNdgl3XMAAAFld4wakRphInJvdwAAoCUpYSJyb3cAAKAmKYACYW1vcHIAnxqjGqcauhq+GnIAcgAAoP8h9CFodACgOyJrAAABbHKsGrMaZSRmdGFycm93AACgqSHpJGdodGFycm93AKCqIWYAAOA12Fnd4iFhcgCgFSCAAWNsdADIGswa0BpyAADgNdi93GEAcwDoAGka8iFvaydhAAFicNca2xr1IWxsAKBDIOghZW4AoBAg4Qr2GgAA/RoAAAgbExsaGwAAIRs7GwAAAAA+G2IbmRuVG6sbAACyG80b0htjAHUAdABlADuA7QDtQAChYyBpeQEbBhtyAGMAO4DuAO5AOGQAAWN4CxsNG3kANWRjAGwAO4ChAKFAAAFmcssCFhsA4DXYJt1yAGEAdgBlADuA7ADsQIChSCFpbm8AJxsyGzYbAAFpbisbLxtuAHQAAKAMKnQAAKAtIuYhaW4AoNwpdABhAACgKSHsIWlnM2GAAWFvcABDG1sbXhuAAWNndABJG0sbWRtyACthgAFlbHAAcQVRG1UbaQBuAOUAyAVhAHIA9AByBWgAMWFmAACgtyJlAGQAtWEAoggiY2ZvdGkbbRt1G3kb4SFyZQCgBSFpAG4AdKAeImkAZQAAoN0pZABvAPQAWxsAoisiY2VscIEbhRuPG5QbYQBsAACguiIAAWdyiRuNG2UAcgDzACMQ4wCCG2EicmhrAACgFyryIW9kAKA8KgACY2dwdJ8boRukG6gbeQBRZG8AbgAvYWYAAOA12FrdYQC5Y3UAZQBzAHQAO4C/AL9AAAFjabUbuRtyAADgNdi+3G4AAKIIIkVkc3bCG8QbyBvQAwCg+SJvAHQAAKD1Inag9CIAoPMiaaBiIOwhZGUpYesB1hsAANkbYwB5AFZkbAA7gO8A70AAA2NmbW9zdeYb7hvyG/Ub+hsFHAABaXnqG+0bcgBjADVhOWRyAADgNdgn3eEhdGg3YnAAZgAA4DXYW93jAf8bAAADHHIAAOA12L/c8iFjeVhk6yFjeVRkAARhY2ZnaGpvcxUcGhwiHCYcKhwtHDAcNRzwIXBhdqC6A/BjAAFleR4cIRzkIWlsN2E6ZHIAAOA12CjdciJlZW4AOGFjAHkARWRjAHkAXGRwAGYAAOA12FzdYwByAADgNdjA3IALQUJFSGFiY2RlZmdoamxtbm9wcnN0dXYAXhxtHHEcdRx5HN8cBx0dHTwd3B3tHfEdAR4EHh0eLB5FHrwewx7hHgkfPR9LH4ABYXJ0AGQcZxxpHHIA8gBvB/IAxQLhIWlsAKAbKeEhcnIAoA4pZ6BmIgCgiyphAHIAAKBiKWMJjRwAAJAcAACVHAAAAAAAAAAAAACZHJwcAACmHKgcrRwAANIc9SF0ZTph7SJwdHl2AKC0KXIAYQDuAFoG4iFkYbtjZwAAoegnZGyhHKMcAKCRKeUAiwYAoIUqdQBvADuAqwCrQHIAgKOQIWJmaGxwc3QAuhy/HMIcxBzHHMoczhxmoOQhcwAAoB8pcwAAoB0p6wCyGnAAAKCrIWwAAKA5KWkAbQAAoHMpbAAAoKIhAKGrKmFl1hzaHGkAbAAAoBkpc6CtKgDgrSoA/oABYWJyAOUc6RztHHIAcgAAoAwpcgBrAACgcicAAWFr8Rz4HGMAAAFla/Yc9xx7YFtgAAFlc/wc/hwAoIspbAAAAWR1Ax0FHQCgjykAoI0pAAJhZXV5Dh0RHRodHB3yIW9uPmEAAWRpFR0YHWkAbAA8YewAowbiAPccO2QAAmNxcnMkHScdLB05HWEAAKA2KXUAbwDyoBwgqhEAAWR1MB00HeghYXIAoGcpcyJoYXIAAKBLKWgAAKCyIQCiZCJmZ3FzRB1FB5Qdnh10AIACYWhscnQATh1WHWUdbB2NHXIicm93AHSgkCFhAOkAzxxhI3Jwb29uAAABZHVeHWId7yF3bgCgvSFwAACgvCHlJGZ0YXJyb3dzAKDHIWkiZ2h0AIABYWhzAHUdex2DHXIicm93APOglCGdBmEAcgBwAG8AbwBuAPMAzgtxAHUAaQBnAGEAcgByAG8A9wBlGugkcmVldGltZXMAoMsi8aFkIk0HAACaHWwAYQBuAPQAXgcAon0qY2Rnc6YdqR2xHbcdYwAAoKgqbwB0AG+gfypyoIEqAKCDKmXg2iIA/nMAAKCTKoACYWRlZ3MAwB3GHcod1h3ZHXAAcAByAG8A+ACmHG8AdAAAoNYicQAAAWdxzx3SHXQA8gBGB2cAdADyAHQcdADyAFMHaQDtAGMHgAFpbHIA4h3mHeod8yFodACgfClvAG8A8gDKBgDgNdgp3UWgdiIAoJEqYQH1Hf4dcgAAAWR1YB35HWygvCEAoGopbABrAACghCVjAHkAWWQAomoiYWNodAweDx4VHhkecgDyAGsdbwByAG4AZQDyAGAW4SFyZACgaylyAGkAAKD6JQABaW8hHiQe5CFvdEBh9SFzdGGgsCPjIWhlAKCwIwACRWFlczMeNR48HkEeAKBoInAAcKCJKvIhb3gAoIkqcaCHKvGghyo0HmkAbQAAoOYiAARhYm5vcHR3elIeXB5fHoUelh6mHqsetB4AAW5yVh5ZHmcAAKDsJ3IAAKD9IXIA6wCwBmcAgAFsbXIAZh52Hnse5SFmdAABYXKIB2weaQBnAGgAdABhAHIAcgBvAPcAkwfhInBzdG8AoPwnaQBnAGgAdABhAHIAcgBvAPcAmgdwI2Fycm93AAABbHKNHpEeZQBmAPQAxhxpImdodAAAoKwhgAFhZmwAnB6fHqIecgAAoIUpAOA12F3ddQBzAACgLSppIm1lcwAAoDQqYQGvHrMecwB0AACgFyLhAIoOZaHKJbkeRhLuIWdlAKDKJWEAcgBsoCgAdAAAoJMpgAJhY2htdADMHs8e1R7bHt0ecgDyAJ0GbwByAG4AZQDyANYWYQByAGSgyyEAoG0pAKAOIHIAaQAAoL8iAANhY2hpcXTrHu8e1QfzHv0eBh/xIXVvAKA5IHIAAOA12MHcbQDloXIi+h4AAPweAKCNKgCgjyoAAWJ19xwBH28AcqAYIACgGiDyIW9rQmEAhDwAO2NkaGlscXJCBhcfxh0gHyQfKB8sHzEfAAFjaRsfHR8AoKYqcgAAoHkqcgBlAOUAkx3tIWVzAKDJIuEhcnIAoHYpdSJlc3QAAKB7KgABUGk1HzkfYQByAACglillocMlAgdfEnIAAAFkdUIfRx9zImhhcgAAoEop6CFhcgCgZikAAWVuTx9WH3IjdG5lcXEAAOBoIgD+xQBUHwAHRGFjZGVmaGlsbm9wc3VuH3Ifoh+rH68ftx+7H74f5h/uH/MfBwj/HwsgxCFvdACgOiIAAmNscHJ5H30fiR+eH3IAO4CvAK9AAAFldIEfgx8AoEImZaAgJ3MAZQAAoCAnc6CmIXQAbwCAoaYhZGx1AJQfmB+cH28AdwDuAHkDZQBmAPQA6gbwAOkO6yFlcgCgriUAAW95ph+qH+0hbWEAoCkqPGThIXNoAKAUIOElc3VyZWRhbmdsZQCgISJyAADgNdgq3W8AAKAnIYABY2RuAMQfyR/bH3IAbwA7gLUAtUBhoiMi0B8AANMf1x9zAPQAKxFpAHIAAKDwKm8AdAA7gLcAt0B1AHMA4qESIh4TAADjH3WgOCIAoCoqYwHqH+0fcAAAoNsq8gB+GnAAbAB1APMACAgAAWRw9x/7H+UhbHMAoKciZgAA4DXYXt0AAWN0AyAHIHIAAOA12MLc8CFvcwCgPiJsobwDECAVIPQiaW1hcACguCJhAPAAEyAADEdMUlZhYmNkZWZnaGlqbG1vcHJzdHV2dzwgRyBmIG0geSCqILgg2iDeIBEhFSEyIUMhTSFQIZwhnyHSIQAiIyKLIrEivyIUIwABZ3RAIEMgAODZIjgD9uBrItIgBwmAAWVsdABNIF8gYiBmAHQAAAFhclMgWCByInJvdwAAoM0h6SRnaHRhcnJvdwCgziEA4NgiOAP24Goi0iBfCekkZ2h0YXJyb3cAoM8hAAFEZHEgdSDhIXNoAKCvIuEhc2gAoK4igAJiY25wdACCIIYgiSCNIKIgbABhAACgByL1IXRlRGFnAADgICLSIACiSSJFaW9wlSCYIJwgniAA4HAqOANkAADgSyI4A3MASWFyAG8A+AAyCnUAcgBhoG4mbADzoG4mmwjzAa8gAACzIHAAO4CgAKBAbQBwAOXgTiI4AyoJgAJhZW91eQDBIMogzSDWINkg8AHGIAAAyCAAoEMqbwBuAEhh5CFpbEZhbgBnAGSgRyJvAHQAAOBtKjgDcAAAoEIqPWThIXNoAKATIACjYCJBYWRxc3jpIO0g+SD+IAIhDCFyAHIAAKDXIXIAAAFocvIg9SBrAACgJClvoJch9wAGD28AdAAA4FAiOAN1AGkA9gC7CAABZWkGIQohYQByAACgKCntAN8I6SFzdPOgBCLlCHIAAOA12CvdAAJFZXN0/wgcISshLiHxoXEiIiEAABMJ8aFxIgAJAAAnIWwAYQBuAPQAEwlpAO0AGQlyoG8iAKBvIoABQWFwADghOyE/IXIA8gBeIHIAcgAAoK4hYQByAACg8ipzogsiSiEAAAAAxwtkoPwiAKD6ImMAeQBaZIADQUVhZGVzdABcIV8hYiFmIWkhkyGWIXIA8gBXIADgZiI4A3IAcgAAoJohcgAAoCUggKFwImZxcwBwIYQhjiF0AAABYXJ1IXohcgByAG8A9wBlIWkAZwBoAHQAYQByAHIAbwD3AD4h8aFwImAhAACKIWwAYQBuAPQAZwlz4H0qOAMAoG4iaQDtAG0JcqBuImkA5aDqIkUJaQDkADoKAAFwdKMhpyFmAADgNdhf3YCBrAA7aW4AriGvIcchrEBuAIChCSJFZHYAtyG6Ib8hAOD5IjgDbwB0AADg9SI4A+EB1gjEIcYhAKD3IgCg9iJpAHagDCLhAagJzyHRIQCg/iIAoP0igAFhb3IA2CHsIfEhcgCAoSYiYXN0AOAh5SHpIWwAbABlAOwAywhsAADg/SrlIADgAiI4A2wiaW50AACgFCrjoYAi9yEAAPohdQDlAJsJY+CvKjgDZaCAIvEAkwkAAkFhaXQHIgoiFyIeInIA8gBsIHIAcgAAoZshY3cRIhQiAOAzKTgDAOCdITgDZyRodGFycm93AACgmyFyAGkA5aDrIr4JgANjaGltcHF1AC8iPCJHIpwhTSJQIloigKGBImNlcgA2Iv0JOSJ1AOUABgoA4DXYw9zvIXJ0bQKdIQAAAABEImEAcgDhAOEhbQBloEEi8aBEIiYKYQDyAMsIcwB1AAABYnBWIlgi5QDUCeUA3wmAAWJjcABgInMieCKAoYQiRWVzAGci7glqIgDgxSo4A2UAdABl4IIi0iBxAPGgiCJoImMAZaCBIvEA/gmAoYUiRWVzAH8iFgqCIgDgxio4A2UAdABl4IMi0iBxAPGgiSKAIgACZ2lscpIilCKaIpwi7AAMCWwAZABlADuA8QDxQOcAWwlpI2FuZ2xlAAABbHKkIqoi5SFmdGWg6iLxAEUJaSJnaHQAZaDrIvEAvgltoL0DAKEjAGVzuCK8InIAbwAAoBYhcAAAoAcggARESGFkZ2lscnMAziLSItYi2iLeIugi7SICIw8j4SFzaACgrSLhIXJyAKAEKXAAAOBNItIg4SFzaACgrCIAAWV04iLlIgDgZSLSIADgPgDSIG4iZmluAACg3imAAUFldADzIvci+iJyAHIAAKACKQDgZCLSIHLgPADSIGkAZQAA4LQi0iAAAUF0BiMKI3IAcgAAoAMp8iFpZQDgtSLSIGkAbQAA4Dwi0iCAAUFhbgAaIx4jKiNyAHIAAKDWIXIAAAFociMjJiNrAACgIylvoJYh9wD/DuUhYXIAoCcpUxJqFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVCMAAF4jaSN/I4IjjSOeI8AUAAAAAKYjwCMAANoj3yMAAO8jHiQvJD8kRCQAAWNzVyNsFHUAdABlADuA8wDzQAABaXlhI2cjcgBjoJoiO4D0APRAPmSAAmFiaW9zAHEjdCN3I3EBeiNzAOgAdhTsIWFjUWF2AACgOCrvIWxkAKC8KewhaWdTYQABY3KFI4kjaQByAACgvykA4DXYLN1vA5QjAAAAAJYjAACcI24A22JhAHYAZQA7gPIA8kAAoMEpAAFibaEjjAphAHIAAKC1KQACYWNpdKwjryO6I70jcgDyAFkUAAFpcrMjtiNyAACgvinvIXNzAKC7KW4A5QDZCgCgwCmAAWFlaQDFI8gjyyNjAHIATWFnAGEAyWOAAWNkbgDRI9Qj1iPyIW9uv2MAoLYpdQDzAHgBcABmAADgNdhg3YABYWVsAOQj5yPrI3IAAKC3KXIAcAAAoLkpdQDzAHwBAKMoImFkaW9zdvkj/CMPJBMkFiQbJHIA8gBeFIChXSplZm0AAyQJJAwkcgBvoDQhZgAAoDQhO4CqAKpAO4C6ALpA5yFvZgCgtiJyAACgVipsIm9wZQAAoFcqAKBbKoABY2xvACMkJSQrJPIACCRhAHMAaAA7gPgA+EBsAACgmCJpAGwBMyQ4JGQAZQA7gPUA9UBlAHMAYaCXInMAAKA2Km0AbAA7gPYA9kDiIWFyAKA9I+EKXiQAAHokAAB8JJQkAACYJKkkAAAAALUkEQsAAPAkAAAAAAQleiUAAIMlcgCAoSUiYXN0AGUkbyQBCwCBtgA7bGokayS2QGwAZQDsABgDaQJ1JAAAAAB4JG0AAKDzKgCg/Sp5AD9kcgCAAmNpbXB0AIUkiCSLJJkSjyRuAHQAJWBvAGQALmBpAGwAAKAwIOUhbmsAoDEgcgAA4DXYLd2AAWltbwCdJKAkpCR2oMYD1WNtAGEA9AD+B24AZQAAoA4m9KHAA64kAAC0JGMjaGZvcmsAAKDUItZjAAFhdbgkxCRuAAABY2u9JMIkawBooA8hAKAOIfYAaRpzAACkKwBhYmNkZW1zdNMkIRPXJNsk4STjJOck6yTjIWlyAKAjKmkAcgAAoCIqAAFvdYsW3yQAoCUqAKByKm4AO4CxALFAaQBtAACgJip3AG8AAKAnKoABaXB1APUk+iT+JO4idGludACgFSpmAADgNdhh3W4AZAA7gKMAo0CApHoiRWFjZWlub3N1ABMlFSUYJRslTCVRJVklSSV1JQCgsypwAACgtyp1AOUAPwtjoK8qgKJ6ImFjZW5zACclLSU0JTYlSSVwAHAAcgBvAPgAFyV1AHIAbAB5AGUA8QA/C/EAOAuAAWFlcwA8JUElRSXwInByb3gAoLkqcQBxAACgtSppAG0AAKDoImkA7QBEC20AZQDzoDIgIguAAUVhcwBDJVclRSXwAEAlgAFkZnAATwtfJXElgAFhbHMAZSVpJW0l7CFhcgCgLiPpIW5lAKASI/UhcmYAoBMjdKAdIu8AWQvyIWVsAKCwIgABY2l9JYElcgAA4DXYxdzIY24iY3NwAACgCCAAA2Zpb3BzdZElKxuVJZolnyWkJXIAAOA12C7dcABmAADgNdhi3XIiaW1lAACgVyBjAHIAAOA12MbcgAFhZW8AqiW6JcAldAAAAWVpryW2JXIAbgBpAG8AbgDzABkFbgB0AACgFipzAHQAZaA/APEACRj0AG0LgApBQkhhYmNkZWZoaWxtbm9wcnN0dXgA4yXyJfYl+iVpJpAmpia9JtUm5ib4JlonaCdxJ3UnnietJ7EnyCfiJ+cngAFhcnQA6SXsJe4lcgDyAJkM8gD6AuEhaWwAoBwpYQByAPIA3BVhAHIAAKBkKYADY2RlbnFydAAGJhAmEyYYJiYmKyZaJgABZXUKJg0mAOA9IjEDdABlAFVhaQDjACAN7SJwdHl2AKCzKWcAgKHpJ2RlbAAgJiImJCYAoJIpAKClKeUA9wt1AG8AO4C7ALtAcgAApZIhYWJjZmhscHN0dz0mQCZFJkcmSiZMJk4mUSZVJlgmcAAAoHUpZqDlIXMAAKAgKQCgMylzAACgHinrALka8ACVHmwAAKBFKWkAbQAAoHQpbAAAoKMhAKCdIQABYWleJmImaQBsAACgGilvAG6gNiJhAGwA8wB2C4ABYWJyAG8mciZ2JnIA8gAvEnIAawAAoHMnAAFha3omgSZjAAABZWt/JoAmfWBdYAABZXOFJocmAKCMKWwAAAFkdYwmjiYAoI4pAKCQKQACYWV1eZcmmiajJqUm8iFvbllhAAFkaZ4moSZpAGwAV2HsAA8M4gCAJkBkAAJjbHFzrSawJrUmuiZhAACgNylkImhhcgAAoGkpdQBvAPKgHSCjAWgAAKCzIYABYWNnAMMm0iaUC2wAgKEcIWlwcwDLJs4migxuAOUAoAxhAHIA9ADaC3QAAKCtJYABaWxyANsm3ybjJvMhaHQAoH0pbwBvAPIANgwA4DXYL90AAWFv6ib1JnIAAAFkde8m8SYAoMEhbKDAIQCgbCl2oMED8WOAAWducwD+Jk4nUCdoAHQAAANhaGxyc3QKJxInISc1Jz0nRydyInJvdwB0oJIhYQDpAFYmYSNycG9vbgAAAWR1GiceJ28AdwDuAPAmcAAAoMAh5SFmdAABYWgnJy0ncgByAG8AdwDzAAkMYQByAHAAbwBvAG4A8wATBGklZ2h0YXJyb3dzAACgySFxAHUAaQBnAGEAcgByAG8A9wBZJugkcmVldGltZXMAoMwiZwDaYmkAbgBnAGQAbwB0AHMAZQDxABwYgAFhaG0AYCdjJ2YncgDyAAkMYQDyABMEAKAPIG8idXN0AGGgsSPjIWhlAKCxI+0haWQAoO4qAAJhYnB0fCeGJ4knmScAAW5ygCeDJ2cAAKDtJ3IAAKD+IXIA6wAcDIABYWZsAI8nkieVJ3IAAKCGKQDgNdhj3XUAcwAAoC4qaSJtZXMAAKA1KgABYXCiJ6gncgBnoCkAdAAAoJQp7yJsaW50AKASKmEAcgDyADwnAAJhY2hxuCe8J6EMwCfxIXVvAKA6IHIAAOA12MfcAAFidYAmxCdvAPKgGSCoAYABaGlyAM4n0ifWJ3IAZQDlAE0n7SFlcwCgyiJpAIChuSVlZmwAXAxjEt4n9CFyaQCgzinsInVoYXIAoGgpAKAeIWENBSgJKA0oSyhVKIYoAACLKLAoAAAAAOMo5ygAABApJCkxKW0pcSmHKaYpAACYKgAAAACxKmMidXRlAFthcQB1AO8ABR+ApHsiRWFjZWlucHN5ABwoHignKCooLygyKEEoRihJKACgtCrwASMoAAAlKACguCpvAG4AYWF1AOUAgw1koLAqaQBsAF9hcgBjAF1hgAFFYXMAOCg6KD0oAKC2KnAAAKC6KmkAbQAAoOki7yJsaW50AKATKmkA7QCIDUFkbwB0AGKixSKRFgAAAABTKACgZiqAA0FhY21zdHgAYChkKG8ocyh1KHkogihyAHIAAKDYIXIAAAFocmkoayjrAJAab6CYIfcAzAd0ADuApwCnQGkAO2D3IWFyAKApKW0AAAFpbn4ozQBuAHUA8wDOAHQAAKA2J3IA7+A12DDdIxkAAmFjb3mRKJUonSisKHIAcAAAoG8mAAFoeZkonChjAHkASWRIZHIAdABtAqUoAAAAAKgoaQDkAFsPYQByAGEA7ABsJDuArQCtQAABZ22zKLsobQBhAAChwwNmdroouijCY4CjPCJkZWdsbnByAMgozCjPKNMo1yjaKN4obwB0AACgairxoEMiCw5FoJ4qAKCgKkWgnSoAoJ8qZQAAoEYi7CF1cwCgJCrhIXJyAKByKWEAcgDyAPwMAAJhZWl07Sj8KAEpCCkAAWxz8Sj4KGwAcwBlAHQAbQDpAH8oaABwAACgMyrwImFyc2wAoOQpAAFkbFoPBSllAACgIyNloKoqc6CsKgDgrCoA/oABZmxwABUpGCkfKfQhY3lMZGKgLwBhoMQpcgAAoD8jZgAA4DXYZN1hAAABZHIoKRcDZQBzAHWgYCZpAHQAAKBgJoABY3N1ADYpRilhKQABYXU6KUApcABzoJMiAOCTIgD+cABzoJQiAOCUIgD+dQAAAWJwSylWKQChjyJlcz4NUCllAHQAZaCPIvEAPw0AoZAiZXNIDVspZQB0AGWgkCLxAEkNAKGhJWFmZilbBHIAZQFrKVwEAKChJWEAcgDyAAMNAAJjZW10dyl7KX8pgilyAADgNdjI3HQAbQDuAM4AaQDsAAYpYQByAOYAVw0AAWFyiimOKXIA5qAGJhESAAFhbpIpoylpImdodAAAAWVwmSmgKXAAcwBpAGwAbwDuANkXaADpAKAkcwCvYIACYmNtbnAArin8KY4NJSooKgCkgiJFZGVtbnByc7wpvinCKcgpzCnUKdgp3CkAoMUqbwB0AACgvSpkoIYibwB0AACgwyr1IWx0AKDBKgABRWXQKdIpAKDLKgCgiiLsIXVzAKC/KuEhcnIAoHkpgAFlaXUA4inxKfQpdAAAoYIiZW7oKewpcQDxoIYivSllAHEA8aCKItEpbQAAoMcqAAFicPgp+ikAoNUqAKDTKmMAgKJ7ImFjZW5zAAcqDSoUKhYqRihwAHAAcgBvAPgAIyh1AHIAbAB5AGUA8QCDDfEAfA2AAWFlcwAcKiIqPShwAHAAcgBvAPgAPChxAPEAOShnAACgaiYApoMiMTIzRWRlaGxtbnBzPCo/KkIqRSpHKlIqWCpjKmcqaypzKncqO4C5ALlAO4CyALJAO4CzALNAAKDGKgABb3NLKk4qdAAAoL4qdQBiAACg2CpkoIcibwB0AACgxCpzAAABb3VdKmAqbAAAoMknYgAAoNcq4SFycgCgeyn1IWx0AKDCKgABRWVvKnEqAKDMKgCgiyLsIXVzAKDAKoABZWl1AH0qjCqPKnQAAKGDImVugyqHKnEA8aCHIkYqZQBxAPGgiyJwKm0AAKDIKgABYnCTKpUqAKDUKgCg1iqAAUFhbgCdKqEqrCpyAHIAAKDZIXIAAAFocqYqqCrrAJUab6CZIfcAxQf3IWFyAKAqKWwAaQBnADuA3wDfQOELzyrZKtwq6SrsKvEqAAD1KjQrAAAAAAAAAAAAAEwrbCsAAHErvSsAAAAAAADRK3IC1CoAAAAA2CrnIWV0AKAWI8RjcgDrAOUKgAFhZXkA4SrkKucq8iFvbmVh5CFpbGNhQmRvAPQAIg5sInJlYwAAoBUjcgAA4DXYMd0AAmVpa2/7KhIrKCsuK/IBACsAAAkrZQAAATRm6g0EK28AcgDlAOsNYQBzorgDECsAAAAAEit5AG0A0WMAAWNuFislK2sAAAFhcxsrIStwAHAAcgBvAPgAFw5pAG0AAKA8InMA8AD9DQABYXMsKyEr8AAXDnIAbgA7gP4A/kDsATgrOyswG2QA5QBnAmUAcwCAgdcAO2JkAEMrRCtJK9dAYaCgInIAAKAxKgCgMCqAAWVwcwBRK1MraSvhAAkh4qKkIlsrXysAAAAAYytvAHQAAKA2I2kAcgAAoPEqb+A12GXdcgBrAACg2irhAHgociJpbWUAAKA0IIABYWlwAHYreSu3K2QA5QC+DYADYWRlbXBzdACFK6MrmiunK6wrsCuzK24iZ2xlAACitSVkbHFykCuUK5ornCvvIXduAKC/JeUhZnRloMMl8QACBwCgXCJpImdodABloLkl8QBdDG8AdAAAoOwlaSJudXMAAKA6KuwhdXMAoDkqYgAAoM0p6SFtZQCgOyrlInppdW0AoOIjgAFjaHQAwivKK80rAAFyecYrySsA4DXYydxGZGMAeQBbZPIhb2tnYQABaW/UK9creAD0ANERaCJlYWQAAAFsct4r5ytlAGYAdABhAHIAcgBvAPcAXQbpJGdodGFycm93AKCgIQAJQUhhYmNkZmdobG1vcHJzdHV3CiwNLBEsHSwnLDEsQCxLLFIsYix6LIQsjyzLLOgs7Sz/LAotcgDyAAkDYQByAACgYykAAWNyFSwbLHUAdABlADuA+gD6QPIACQ1yAOMBIywAACUseQBeZHYAZQBtYQABaXkrLDAscgBjADuA+wD7QENkgAFhYmgANyw6LD0scgDyANEO7CFhY3FhYQDyAOAOAAFpckQsSCzzIWh0AKB+KQDgNdgy3XIAYQB2AGUAO4D5APlAYQFWLF8scgAAAWxyWixcLACgvyEAoL4hbABrAACggCUAAWN0Zix2LG8CbCwAAAAAcyxyAG4AZaAcI3IAAKAcI28AcAAAoA8jcgBpAACg+CUAAWFsfiyBLGMAcgBrYTuAqACoQAABZ3CILIssbwBuAHNhZgAA4DXYZt0AA2FkaGxzdZksniynLLgsuyzFLHIAcgBvAPcACQ1vAHcAbgBhAHIAcgBvAPcA2A5hI3Jwb29uAAABbHKvLLMsZQBmAPQAWyxpAGcAaAD0AF0sdQDzAKYOaQAAocUDaGzBLMIs0mNvAG4AxWPwI2Fycm93cwCgyCGAAWNpdADRLOEs5CxvAtcsAAAAAN4scgBuAGWgHSNyAACgHSNvAHAAAKAOI24AZwBvYXIAaQAAoPklYwByAADgNdjK3IABZGlyAPMs9yz6LG8AdAAAoPAi7CFkZWlhaQBmoLUlAKC0JQABYW0DLQYtcgDyAMosbAA7gPwA/EDhIm5nbGUAoKcpgAdBQkRhY2RlZmxub3Byc3oAJy0qLTAtNC2bLZ0toS2/LcMtxy3TLdgt3C3gLfwtcgDyABADYQByAHag6CoAoOkqYQBzAOgA/gIAAW5yOC08LechcnQAoJwpgANla25wcnN0AJkpSC1NLVQtXi1iLYItYQBwAHAA4QAaHG8AdABoAGkAbgDnAKEXgAFoaXIAoSmzJFotbwBwAPQAdCVooJUh7wD4JgABaXVmLWotZwBtAOEAuygAAWJwbi14LXMjZXRuZXEAceCKIgD+AODLKgD+cyNldG5lcQBx4IsiAP4A4MwqAP4AAWhyhi2KLWUAdADhABIraSNhbmdsZQAAAWxyki2WLeUhZnQAoLIiaSJnaHQAAKCzInkAMmThIXNoAKCiIoABZWxyAKcttC24LWKiKCKuLQAAAACyLWEAcgAAoLsicQAAoFoi7CFpcACg7iIAAWJ0vC1eD2EA8gBfD3IAAOA12DPddAByAOkAlS1zAHUAAAFicM0t0C0A4IIi0iAA4IMi0iBwAGYAAOA12GfdcgBvAPAAWQt0AHIA6QCaLQABY3XkLegtcgAA4DXYy9wAAWJw7C30LW4AAAFFZXUt8S0A4IoiAP5uAAABRWV/LfktAOCLIgD+6SJnemFnAKCaKYADY2Vmb3BycwANLhAuJS4pLiMuLi40LukhcmN1YQABZGkULiEuAAFiZxguHC5hAHIAAKBfKmUAcaAnIgCgWSLlIXJwAKAYIXIAAOA12DTdcABmAADgNdho3WWgQCJhAHQA6ABqD2MAcgAA4DXYzNzjCuQRUC4AAFQuAABYLmIuAAAAAGMubS5wLnQuAAAAAIguki4AAJouJxIqEnQAcgDpAB0ScgAA4DXYNd0AAUFhWy5eLnIA8gDnAnIA8gCTB75jAAFBYWYuaS5yAPIA4AJyAPIAjAdhAPAAeh5pAHMAAKD7IoABZHB0APgReS6DLgABZmx9LoAuAOA12GnddQDzAP8RaQBtAOUABBIAAUFhiy6OLnIA8gDuAnIA8gCaBwABY3GVLgoScgAA4DXYzdwAAXB0nS6hLmwAdQDzACUScgDpACASAARhY2VmaW9zdbEuvC7ELsguzC7PLtQu2S5jAAABdXm2LrsudABlADuA/QD9QE9kAAFpecAuwy5yAGMAd2FLZG4AO4ClAKVAcgAA4DXYNt1jAHkAV2RwAGYAAOA12GrdYwByAADgNdjO3AABY23dLt8ueQBOZGwAO4D/AP9AAAVhY2RlZmhpb3N38y73Lv8uAi8MLxAvEy8YLx0vIi9jInV0ZQB6YQABYXn7Lv4u8iFvbn5hN2RvAHQAfGEAAWV0Bi8KL3QAcgDmAB8QYQC2Y3IAAOA12DfdYwB5ADZk5yJyYXJyAKDdIXAAZgAA4DXYa91jAHIAAOA12M/cAAFqbiYvKC8AoA0gagAAoAwg");

// node_modules/htmlparser2/node_modules/entities/dist/esm/generated/decode-data-xml.js
var xmlDecodeTree = /* @__PURE__ */ decodeBase64("AAJhZ2xxBwARABMAFQBtAg0AAAAAAA8AcAAmYG8AcwAnYHQAPmB0ADxg9SFvdCJg");

// node_modules/htmlparser2/node_modules/entities/dist/esm/internal/bin-trie-flags.js
var BinTrieFlags;
(function(BinTrieFlags3) {
  BinTrieFlags3[BinTrieFlags3["VALUE_LENGTH"] = 49152] = "VALUE_LENGTH";
  BinTrieFlags3[BinTrieFlags3["FLAG13"] = 8192] = "FLAG13";
  BinTrieFlags3[BinTrieFlags3["BRANCH_LENGTH"] = 8064] = "BRANCH_LENGTH";
  BinTrieFlags3[BinTrieFlags3["JUMP_TABLE"] = 127] = "JUMP_TABLE";
})(BinTrieFlags || (BinTrieFlags = {}));

// node_modules/htmlparser2/node_modules/entities/dist/esm/decode.js
var CharCodes;
(function(CharCodes4) {
  CharCodes4[CharCodes4["NUM"] = 35] = "NUM";
  CharCodes4[CharCodes4["SEMI"] = 59] = "SEMI";
  CharCodes4[CharCodes4["EQUALS"] = 61] = "EQUALS";
  CharCodes4[CharCodes4["ZERO"] = 48] = "ZERO";
  CharCodes4[CharCodes4["NINE"] = 57] = "NINE";
  CharCodes4[CharCodes4["LOWER_A"] = 97] = "LOWER_A";
  CharCodes4[CharCodes4["LOWER_F"] = 102] = "LOWER_F";
  CharCodes4[CharCodes4["LOWER_X"] = 120] = "LOWER_X";
  CharCodes4[CharCodes4["LOWER_Z"] = 122] = "LOWER_Z";
  CharCodes4[CharCodes4["UPPER_A"] = 65] = "UPPER_A";
  CharCodes4[CharCodes4["UPPER_F"] = 70] = "UPPER_F";
  CharCodes4[CharCodes4["UPPER_Z"] = 90] = "UPPER_Z";
})(CharCodes || (CharCodes = {}));
var TO_LOWER_BIT = 32;
function isNumber(code) {
  return code >= CharCodes.ZERO && code <= CharCodes.NINE;
}
function isHexadecimalCharacter(code) {
  return code >= CharCodes.UPPER_A && code <= CharCodes.UPPER_F || code >= CharCodes.LOWER_A && code <= CharCodes.LOWER_F;
}
function isAsciiAlphaNumeric(code) {
  return code >= CharCodes.UPPER_A && code <= CharCodes.UPPER_Z || code >= CharCodes.LOWER_A && code <= CharCodes.LOWER_Z || isNumber(code);
}
function isEntityInAttributeInvalidEnd(code) {
  return code === CharCodes.EQUALS || isAsciiAlphaNumeric(code);
}
var EntityDecoderState;
(function(EntityDecoderState3) {
  EntityDecoderState3[EntityDecoderState3["EntityStart"] = 0] = "EntityStart";
  EntityDecoderState3[EntityDecoderState3["NumericStart"] = 1] = "NumericStart";
  EntityDecoderState3[EntityDecoderState3["NumericDecimal"] = 2] = "NumericDecimal";
  EntityDecoderState3[EntityDecoderState3["NumericHex"] = 3] = "NumericHex";
  EntityDecoderState3[EntityDecoderState3["NamedEntity"] = 4] = "NamedEntity";
})(EntityDecoderState || (EntityDecoderState = {}));
var DecodingMode;
(function(DecodingMode3) {
  DecodingMode3[DecodingMode3["Legacy"] = 0] = "Legacy";
  DecodingMode3[DecodingMode3["Strict"] = 1] = "Strict";
  DecodingMode3[DecodingMode3["Attribute"] = 2] = "Attribute";
})(DecodingMode || (DecodingMode = {}));
var EntityDecoder = class {
  constructor(decodeTree, emitCodePoint, errors) {
    this.decodeTree = decodeTree;
    this.emitCodePoint = emitCodePoint;
    this.errors = errors;
    this.state = EntityDecoderState.EntityStart;
    this.consumed = 1;
    this.result = 0;
    this.treeIndex = 0;
    this.excess = 1;
    this.decodeMode = DecodingMode.Strict;
    this.runConsumed = 0;
  }
  /** Resets the instance to make it reusable. */
  startEntity(decodeMode) {
    this.decodeMode = decodeMode;
    this.state = EntityDecoderState.EntityStart;
    this.result = 0;
    this.treeIndex = 0;
    this.excess = 1;
    this.consumed = 1;
    this.runConsumed = 0;
  }
  /**
   * Write an entity to the decoder. This can be called multiple times with partial entities.
   * If the entity is incomplete, the decoder will return -1.
   *
   * Mirrors the implementation of `getDecoder`, but with the ability to stop decoding if the
   * entity is incomplete, and resume when the next string is written.
   *
   * @param input The string containing the entity (or a continuation of the entity).
   * @param offset The offset at which the entity begins. Should be 0 if this is not the first call.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  write(input, offset) {
    switch (this.state) {
      case EntityDecoderState.EntityStart: {
        if (input.charCodeAt(offset) === CharCodes.NUM) {
          this.state = EntityDecoderState.NumericStart;
          this.consumed += 1;
          return this.stateNumericStart(input, offset + 1);
        }
        this.state = EntityDecoderState.NamedEntity;
        return this.stateNamedEntity(input, offset);
      }
      case EntityDecoderState.NumericStart: {
        return this.stateNumericStart(input, offset);
      }
      case EntityDecoderState.NumericDecimal: {
        return this.stateNumericDecimal(input, offset);
      }
      case EntityDecoderState.NumericHex: {
        return this.stateNumericHex(input, offset);
      }
      case EntityDecoderState.NamedEntity: {
        return this.stateNamedEntity(input, offset);
      }
    }
  }
  /**
   * Switches between the numeric decimal and hexadecimal states.
   *
   * Equivalent to the `Numeric character reference state` in the HTML spec.
   *
   * @param input The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericStart(input, offset) {
    if (offset >= input.length) {
      return -1;
    }
    if ((input.charCodeAt(offset) | TO_LOWER_BIT) === CharCodes.LOWER_X) {
      this.state = EntityDecoderState.NumericHex;
      this.consumed += 1;
      return this.stateNumericHex(input, offset + 1);
    }
    this.state = EntityDecoderState.NumericDecimal;
    return this.stateNumericDecimal(input, offset);
  }
  /**
   * Parses a hexadecimal numeric entity.
   *
   * Equivalent to the `Hexademical character reference state` in the HTML spec.
   *
   * @param input The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericHex(input, offset) {
    while (offset < input.length) {
      const char = input.charCodeAt(offset);
      if (isNumber(char) || isHexadecimalCharacter(char)) {
        const digit = char <= CharCodes.NINE ? char - CharCodes.ZERO : (char | TO_LOWER_BIT) - CharCodes.LOWER_A + 10;
        this.result = this.result * 16 + digit;
        this.consumed++;
        offset++;
      } else {
        return this.emitNumericEntity(char, 3);
      }
    }
    return -1;
  }
  /**
   * Parses a decimal numeric entity.
   *
   * Equivalent to the `Decimal character reference state` in the HTML spec.
   *
   * @param input The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericDecimal(input, offset) {
    while (offset < input.length) {
      const char = input.charCodeAt(offset);
      if (isNumber(char)) {
        this.result = this.result * 10 + (char - CharCodes.ZERO);
        this.consumed++;
        offset++;
      } else {
        return this.emitNumericEntity(char, 2);
      }
    }
    return -1;
  }
  /**
   * Validate and emit a numeric entity.
   *
   * Implements the logic from the `Hexademical character reference start
   * state` and `Numeric character reference end state` in the HTML spec.
   *
   * @param lastCp The last code point of the entity. Used to see if the
   *               entity was terminated with a semicolon.
   * @param expectedLength The minimum number of characters that should be
   *                       consumed. Used to validate that at least one digit
   *                       was consumed.
   * @returns The number of characters that were consumed.
   */
  emitNumericEntity(lastCp, expectedLength) {
    var _a3;
    if (this.consumed <= expectedLength) {
      (_a3 = this.errors) === null || _a3 === void 0 ? void 0 : _a3.absenceOfDigitsInNumericCharacterReference(this.consumed);
      return 0;
    }
    if (lastCp === CharCodes.SEMI) {
      this.consumed += 1;
    } else if (this.decodeMode === DecodingMode.Strict) {
      return 0;
    }
    this.emitCodePoint(replaceCodePoint(this.result), this.consumed);
    if (this.errors) {
      if (lastCp !== CharCodes.SEMI) {
        this.errors.missingSemicolonAfterCharacterReference();
      }
      this.errors.validateNumericCharacterReference(this.result);
    }
    return this.consumed;
  }
  /**
   * Parses a named entity.
   *
   * Equivalent to the `Named character reference state` in the HTML spec.
   *
   * @param input The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNamedEntity(input, offset) {
    const { decodeTree } = this;
    let current = decodeTree[this.treeIndex];
    let valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
    while (offset < input.length) {
      if (valueLength === 0 && (current & BinTrieFlags.FLAG13) !== 0) {
        const runLength = (current & BinTrieFlags.BRANCH_LENGTH) >> 7;
        if (this.runConsumed === 0) {
          const firstChar = current & BinTrieFlags.JUMP_TABLE;
          if (input.charCodeAt(offset) !== firstChar) {
            return this.result === 0 ? 0 : this.emitNotTerminatedNamedEntity();
          }
          offset++;
          this.excess++;
          this.runConsumed++;
        }
        while (this.runConsumed < runLength) {
          if (offset >= input.length) {
            return -1;
          }
          const charIndexInPacked = this.runConsumed - 1;
          const packedWord = decodeTree[this.treeIndex + 1 + (charIndexInPacked >> 1)];
          const expectedChar = charIndexInPacked % 2 === 0 ? packedWord & 255 : packedWord >> 8 & 255;
          if (input.charCodeAt(offset) !== expectedChar) {
            this.runConsumed = 0;
            return this.result === 0 ? 0 : this.emitNotTerminatedNamedEntity();
          }
          offset++;
          this.excess++;
          this.runConsumed++;
        }
        this.runConsumed = 0;
        this.treeIndex += 1 + (runLength >> 1);
        current = decodeTree[this.treeIndex];
        valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
      }
      if (offset >= input.length)
        break;
      const char = input.charCodeAt(offset);
      if (char === CharCodes.SEMI && valueLength !== 0 && (current & BinTrieFlags.FLAG13) !== 0) {
        return this.emitNamedEntityData(this.treeIndex, valueLength, this.consumed + this.excess);
      }
      this.treeIndex = determineBranch(decodeTree, current, this.treeIndex + Math.max(1, valueLength), char);
      if (this.treeIndex < 0) {
        return this.result === 0 || // If we are parsing an attribute
        this.decodeMode === DecodingMode.Attribute && // We shouldn't have consumed any characters after the entity,
        (valueLength === 0 || // And there should be no invalid characters.
        isEntityInAttributeInvalidEnd(char)) ? 0 : this.emitNotTerminatedNamedEntity();
      }
      current = decodeTree[this.treeIndex];
      valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
      if (valueLength !== 0) {
        if (char === CharCodes.SEMI) {
          return this.emitNamedEntityData(this.treeIndex, valueLength, this.consumed + this.excess);
        }
        if (this.decodeMode !== DecodingMode.Strict && (current & BinTrieFlags.FLAG13) === 0) {
          this.result = this.treeIndex;
          this.consumed += this.excess;
          this.excess = 0;
        }
      }
      offset++;
      this.excess++;
    }
    return -1;
  }
  /**
   * Emit a named entity that was not terminated with a semicolon.
   *
   * @returns The number of characters consumed.
   */
  emitNotTerminatedNamedEntity() {
    var _a3;
    const { result, decodeTree } = this;
    const valueLength = (decodeTree[result] & BinTrieFlags.VALUE_LENGTH) >> 14;
    this.emitNamedEntityData(result, valueLength, this.consumed);
    (_a3 = this.errors) === null || _a3 === void 0 ? void 0 : _a3.missingSemicolonAfterCharacterReference();
    return this.consumed;
  }
  /**
   * Emit a named entity.
   *
   * @param result The index of the entity in the decode tree.
   * @param valueLength The number of bytes in the entity.
   * @param consumed The number of characters consumed.
   *
   * @returns The number of characters consumed.
   */
  emitNamedEntityData(result, valueLength, consumed) {
    const { decodeTree } = this;
    this.emitCodePoint(valueLength === 1 ? decodeTree[result] & ~(BinTrieFlags.VALUE_LENGTH | BinTrieFlags.FLAG13) : decodeTree[result + 1], consumed);
    if (valueLength === 3) {
      this.emitCodePoint(decodeTree[result + 2], consumed);
    }
    return consumed;
  }
  /**
   * Signal to the parser that the end of the input was reached.
   *
   * Remaining data will be emitted and relevant errors will be produced.
   *
   * @returns The number of characters consumed.
   */
  end() {
    var _a3;
    switch (this.state) {
      case EntityDecoderState.NamedEntity: {
        return this.result !== 0 && (this.decodeMode !== DecodingMode.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
      }
      // Otherwise, emit a numeric entity if we have one.
      case EntityDecoderState.NumericDecimal: {
        return this.emitNumericEntity(0, 2);
      }
      case EntityDecoderState.NumericHex: {
        return this.emitNumericEntity(0, 3);
      }
      case EntityDecoderState.NumericStart: {
        (_a3 = this.errors) === null || _a3 === void 0 ? void 0 : _a3.absenceOfDigitsInNumericCharacterReference(this.consumed);
        return 0;
      }
      case EntityDecoderState.EntityStart: {
        return 0;
      }
    }
  }
};
function determineBranch(decodeTree, current, nodeIndex, char) {
  const branchCount = (current & BinTrieFlags.BRANCH_LENGTH) >> 7;
  const jumpOffset = current & BinTrieFlags.JUMP_TABLE;
  if (branchCount === 0) {
    return jumpOffset !== 0 && char === jumpOffset ? nodeIndex : -1;
  }
  if (jumpOffset) {
    const value = char - jumpOffset;
    return value < 0 || value >= branchCount ? -1 : decodeTree[nodeIndex + value] - 1;
  }
  const packedKeySlots = branchCount + 1 >> 1;
  let lo = 0;
  let hi = branchCount - 1;
  while (lo <= hi) {
    const mid = lo + hi >>> 1;
    const slot = mid >> 1;
    const packed = decodeTree[nodeIndex + slot];
    const midKey = packed >> (mid & 1) * 8 & 255;
    if (midKey < char) {
      lo = mid + 1;
    } else if (midKey > char) {
      hi = mid - 1;
    } else {
      return decodeTree[nodeIndex + packedKeySlots + mid];
    }
  }
  return -1;
}

// node_modules/htmlparser2/dist/esm/Tokenizer.js
var CharCodes2;
(function(CharCodes4) {
  CharCodes4[CharCodes4["Tab"] = 9] = "Tab";
  CharCodes4[CharCodes4["NewLine"] = 10] = "NewLine";
  CharCodes4[CharCodes4["FormFeed"] = 12] = "FormFeed";
  CharCodes4[CharCodes4["CarriageReturn"] = 13] = "CarriageReturn";
  CharCodes4[CharCodes4["Space"] = 32] = "Space";
  CharCodes4[CharCodes4["ExclamationMark"] = 33] = "ExclamationMark";
  CharCodes4[CharCodes4["Number"] = 35] = "Number";
  CharCodes4[CharCodes4["Amp"] = 38] = "Amp";
  CharCodes4[CharCodes4["SingleQuote"] = 39] = "SingleQuote";
  CharCodes4[CharCodes4["DoubleQuote"] = 34] = "DoubleQuote";
  CharCodes4[CharCodes4["Dash"] = 45] = "Dash";
  CharCodes4[CharCodes4["Slash"] = 47] = "Slash";
  CharCodes4[CharCodes4["Zero"] = 48] = "Zero";
  CharCodes4[CharCodes4["Nine"] = 57] = "Nine";
  CharCodes4[CharCodes4["Semi"] = 59] = "Semi";
  CharCodes4[CharCodes4["Lt"] = 60] = "Lt";
  CharCodes4[CharCodes4["Eq"] = 61] = "Eq";
  CharCodes4[CharCodes4["Gt"] = 62] = "Gt";
  CharCodes4[CharCodes4["Questionmark"] = 63] = "Questionmark";
  CharCodes4[CharCodes4["UpperA"] = 65] = "UpperA";
  CharCodes4[CharCodes4["LowerA"] = 97] = "LowerA";
  CharCodes4[CharCodes4["UpperF"] = 70] = "UpperF";
  CharCodes4[CharCodes4["LowerF"] = 102] = "LowerF";
  CharCodes4[CharCodes4["UpperZ"] = 90] = "UpperZ";
  CharCodes4[CharCodes4["LowerZ"] = 122] = "LowerZ";
  CharCodes4[CharCodes4["LowerX"] = 120] = "LowerX";
  CharCodes4[CharCodes4["OpeningSquareBracket"] = 91] = "OpeningSquareBracket";
})(CharCodes2 || (CharCodes2 = {}));
var State;
(function(State2) {
  State2[State2["Text"] = 1] = "Text";
  State2[State2["BeforeTagName"] = 2] = "BeforeTagName";
  State2[State2["InTagName"] = 3] = "InTagName";
  State2[State2["InSelfClosingTag"] = 4] = "InSelfClosingTag";
  State2[State2["BeforeClosingTagName"] = 5] = "BeforeClosingTagName";
  State2[State2["InClosingTagName"] = 6] = "InClosingTagName";
  State2[State2["AfterClosingTagName"] = 7] = "AfterClosingTagName";
  State2[State2["BeforeAttributeName"] = 8] = "BeforeAttributeName";
  State2[State2["InAttributeName"] = 9] = "InAttributeName";
  State2[State2["AfterAttributeName"] = 10] = "AfterAttributeName";
  State2[State2["BeforeAttributeValue"] = 11] = "BeforeAttributeValue";
  State2[State2["InAttributeValueDq"] = 12] = "InAttributeValueDq";
  State2[State2["InAttributeValueSq"] = 13] = "InAttributeValueSq";
  State2[State2["InAttributeValueNq"] = 14] = "InAttributeValueNq";
  State2[State2["BeforeDeclaration"] = 15] = "BeforeDeclaration";
  State2[State2["InDeclaration"] = 16] = "InDeclaration";
  State2[State2["InProcessingInstruction"] = 17] = "InProcessingInstruction";
  State2[State2["BeforeComment"] = 18] = "BeforeComment";
  State2[State2["CDATASequence"] = 19] = "CDATASequence";
  State2[State2["InSpecialComment"] = 20] = "InSpecialComment";
  State2[State2["InCommentLike"] = 21] = "InCommentLike";
  State2[State2["BeforeSpecialS"] = 22] = "BeforeSpecialS";
  State2[State2["BeforeSpecialT"] = 23] = "BeforeSpecialT";
  State2[State2["SpecialStartSequence"] = 24] = "SpecialStartSequence";
  State2[State2["InSpecialTag"] = 25] = "InSpecialTag";
  State2[State2["InEntity"] = 26] = "InEntity";
})(State || (State = {}));
function isWhitespace(c) {
  return c === CharCodes2.Space || c === CharCodes2.NewLine || c === CharCodes2.Tab || c === CharCodes2.FormFeed || c === CharCodes2.CarriageReturn;
}
function isEndOfTagSection(c) {
  return c === CharCodes2.Slash || c === CharCodes2.Gt || isWhitespace(c);
}
function isASCIIAlpha(c) {
  return c >= CharCodes2.LowerA && c <= CharCodes2.LowerZ || c >= CharCodes2.UpperA && c <= CharCodes2.UpperZ;
}
var QuoteType;
(function(QuoteType2) {
  QuoteType2[QuoteType2["NoValue"] = 0] = "NoValue";
  QuoteType2[QuoteType2["Unquoted"] = 1] = "Unquoted";
  QuoteType2[QuoteType2["Single"] = 2] = "Single";
  QuoteType2[QuoteType2["Double"] = 3] = "Double";
})(QuoteType || (QuoteType = {}));
var Sequences = {
  Cdata: new Uint8Array([67, 68, 65, 84, 65, 91]),
  // CDATA[
  CdataEnd: new Uint8Array([93, 93, 62]),
  // ]]>
  CommentEnd: new Uint8Array([45, 45, 62]),
  // `-->`
  ScriptEnd: new Uint8Array([60, 47, 115, 99, 114, 105, 112, 116]),
  // `</script`
  StyleEnd: new Uint8Array([60, 47, 115, 116, 121, 108, 101]),
  // `</style`
  TitleEnd: new Uint8Array([60, 47, 116, 105, 116, 108, 101]),
  // `</title`
  TextareaEnd: new Uint8Array([
    60,
    47,
    116,
    101,
    120,
    116,
    97,
    114,
    101,
    97
  ]),
  // `</textarea`
  XmpEnd: new Uint8Array([60, 47, 120, 109, 112])
  // `</xmp`
};
var Tokenizer = class {
  constructor({ xmlMode = false, decodeEntities = true }, cbs) {
    this.cbs = cbs;
    this.state = State.Text;
    this.buffer = "";
    this.sectionStart = 0;
    this.index = 0;
    this.entityStart = 0;
    this.baseState = State.Text;
    this.isSpecial = false;
    this.running = true;
    this.offset = 0;
    this.currentSequence = void 0;
    this.sequenceIndex = 0;
    this.xmlMode = xmlMode;
    this.decodeEntities = decodeEntities;
    this.entityDecoder = new EntityDecoder(xmlMode ? xmlDecodeTree : htmlDecodeTree, (cp, consumed) => this.emitCodePoint(cp, consumed));
  }
  reset() {
    this.state = State.Text;
    this.buffer = "";
    this.sectionStart = 0;
    this.index = 0;
    this.baseState = State.Text;
    this.currentSequence = void 0;
    this.running = true;
    this.offset = 0;
  }
  write(chunk) {
    this.offset += this.buffer.length;
    this.buffer = chunk;
    this.parse();
  }
  end() {
    if (this.running)
      this.finish();
  }
  pause() {
    this.running = false;
  }
  resume() {
    this.running = true;
    if (this.index < this.buffer.length + this.offset) {
      this.parse();
    }
  }
  stateText(c) {
    if (c === CharCodes2.Lt || !this.decodeEntities && this.fastForwardTo(CharCodes2.Lt)) {
      if (this.index > this.sectionStart) {
        this.cbs.ontext(this.sectionStart, this.index);
      }
      this.state = State.BeforeTagName;
      this.sectionStart = this.index;
    } else if (this.decodeEntities && c === CharCodes2.Amp) {
      this.startEntity();
    }
  }
  stateSpecialStartSequence(c) {
    const isEnd = this.sequenceIndex === this.currentSequence.length;
    const isMatch = isEnd ? (
      // If we are at the end of the sequence, make sure the tag name has ended
      isEndOfTagSection(c)
    ) : (
      // Otherwise, do a case-insensitive comparison
      (c | 32) === this.currentSequence[this.sequenceIndex]
    );
    if (!isMatch) {
      this.isSpecial = false;
    } else if (!isEnd) {
      this.sequenceIndex++;
      return;
    }
    this.sequenceIndex = 0;
    this.state = State.InTagName;
    this.stateInTagName(c);
  }
  /** Look for an end tag. For <title> tags, also decode entities. */
  stateInSpecialTag(c) {
    if (this.sequenceIndex === this.currentSequence.length) {
      if (c === CharCodes2.Gt || isWhitespace(c)) {
        const endOfText = this.index - this.currentSequence.length;
        if (this.sectionStart < endOfText) {
          const actualIndex = this.index;
          this.index = endOfText;
          this.cbs.ontext(this.sectionStart, endOfText);
          this.index = actualIndex;
        }
        this.isSpecial = false;
        this.sectionStart = endOfText + 2;
        this.stateInClosingTagName(c);
        return;
      }
      this.sequenceIndex = 0;
    }
    if ((c | 32) === this.currentSequence[this.sequenceIndex]) {
      this.sequenceIndex += 1;
    } else if (this.sequenceIndex === 0) {
      if (this.currentSequence === Sequences.TitleEnd) {
        if (this.decodeEntities && c === CharCodes2.Amp) {
          this.startEntity();
        }
      } else if (this.fastForwardTo(CharCodes2.Lt)) {
        this.sequenceIndex = 1;
      }
    } else {
      this.sequenceIndex = Number(c === CharCodes2.Lt);
    }
  }
  stateCDATASequence(c) {
    if (c === Sequences.Cdata[this.sequenceIndex]) {
      if (++this.sequenceIndex === Sequences.Cdata.length) {
        this.state = State.InCommentLike;
        this.currentSequence = Sequences.CdataEnd;
        this.sequenceIndex = 0;
        this.sectionStart = this.index + 1;
      }
    } else {
      this.sequenceIndex = 0;
      this.state = State.InDeclaration;
      this.stateInDeclaration(c);
    }
  }
  /**
   * When we wait for one specific character, we can speed things up
   * by skipping through the buffer until we find it.
   *
   * @returns Whether the character was found.
   */
  fastForwardTo(c) {
    while (++this.index < this.buffer.length + this.offset) {
      if (this.buffer.charCodeAt(this.index - this.offset) === c) {
        return true;
      }
    }
    this.index = this.buffer.length + this.offset - 1;
    return false;
  }
  /**
   * Comments and CDATA end with `-->` and `]]>`.
   *
   * Their common qualities are:
   * - Their end sequences have a distinct character they start with.
   * - That character is then repeated, so we have to check multiple repeats.
   * - All characters but the start character of the sequence can be skipped.
   */
  stateInCommentLike(c) {
    if (c === this.currentSequence[this.sequenceIndex]) {
      if (++this.sequenceIndex === this.currentSequence.length) {
        if (this.currentSequence === Sequences.CdataEnd) {
          this.cbs.oncdata(this.sectionStart, this.index, 2);
        } else {
          this.cbs.oncomment(this.sectionStart, this.index, 2);
        }
        this.sequenceIndex = 0;
        this.sectionStart = this.index + 1;
        this.state = State.Text;
      }
    } else if (this.sequenceIndex === 0) {
      if (this.fastForwardTo(this.currentSequence[0])) {
        this.sequenceIndex = 1;
      }
    } else if (c !== this.currentSequence[this.sequenceIndex - 1]) {
      this.sequenceIndex = 0;
    }
  }
  /**
   * HTML only allows ASCII alpha characters (a-z and A-Z) at the beginning of a tag name.
   *
   * XML allows a lot more characters here (@see https://www.w3.org/TR/REC-xml/#NT-NameStartChar).
   * We allow anything that wouldn't end the tag.
   */
  isTagStartChar(c) {
    return this.xmlMode ? !isEndOfTagSection(c) : isASCIIAlpha(c);
  }
  startSpecial(sequence, offset) {
    this.isSpecial = true;
    this.currentSequence = sequence;
    this.sequenceIndex = offset;
    this.state = State.SpecialStartSequence;
  }
  stateBeforeTagName(c) {
    if (c === CharCodes2.ExclamationMark) {
      this.state = State.BeforeDeclaration;
      this.sectionStart = this.index + 1;
    } else if (c === CharCodes2.Questionmark) {
      this.state = State.InProcessingInstruction;
      this.sectionStart = this.index + 1;
    } else if (this.isTagStartChar(c)) {
      const lower = c | 32;
      this.sectionStart = this.index;
      if (this.xmlMode) {
        this.state = State.InTagName;
      } else if (lower === Sequences.ScriptEnd[2]) {
        this.state = State.BeforeSpecialS;
      } else if (lower === Sequences.TitleEnd[2] || lower === Sequences.XmpEnd[2]) {
        this.state = State.BeforeSpecialT;
      } else {
        this.state = State.InTagName;
      }
    } else if (c === CharCodes2.Slash) {
      this.state = State.BeforeClosingTagName;
    } else {
      this.state = State.Text;
      this.stateText(c);
    }
  }
  stateInTagName(c) {
    if (isEndOfTagSection(c)) {
      this.cbs.onopentagname(this.sectionStart, this.index);
      this.sectionStart = -1;
      this.state = State.BeforeAttributeName;
      this.stateBeforeAttributeName(c);
    }
  }
  stateBeforeClosingTagName(c) {
    if (isWhitespace(c)) {
    } else if (c === CharCodes2.Gt) {
      this.state = State.Text;
    } else {
      this.state = this.isTagStartChar(c) ? State.InClosingTagName : State.InSpecialComment;
      this.sectionStart = this.index;
    }
  }
  stateInClosingTagName(c) {
    if (c === CharCodes2.Gt || isWhitespace(c)) {
      this.cbs.onclosetag(this.sectionStart, this.index);
      this.sectionStart = -1;
      this.state = State.AfterClosingTagName;
      this.stateAfterClosingTagName(c);
    }
  }
  stateAfterClosingTagName(c) {
    if (c === CharCodes2.Gt || this.fastForwardTo(CharCodes2.Gt)) {
      this.state = State.Text;
      this.sectionStart = this.index + 1;
    }
  }
  stateBeforeAttributeName(c) {
    if (c === CharCodes2.Gt) {
      this.cbs.onopentagend(this.index);
      if (this.isSpecial) {
        this.state = State.InSpecialTag;
        this.sequenceIndex = 0;
      } else {
        this.state = State.Text;
      }
      this.sectionStart = this.index + 1;
    } else if (c === CharCodes2.Slash) {
      this.state = State.InSelfClosingTag;
    } else if (!isWhitespace(c)) {
      this.state = State.InAttributeName;
      this.sectionStart = this.index;
    }
  }
  stateInSelfClosingTag(c) {
    if (c === CharCodes2.Gt) {
      this.cbs.onselfclosingtag(this.index);
      this.state = State.Text;
      this.sectionStart = this.index + 1;
      this.isSpecial = false;
    } else if (!isWhitespace(c)) {
      this.state = State.BeforeAttributeName;
      this.stateBeforeAttributeName(c);
    }
  }
  stateInAttributeName(c) {
    if (c === CharCodes2.Eq || isEndOfTagSection(c)) {
      this.cbs.onattribname(this.sectionStart, this.index);
      this.sectionStart = this.index;
      this.state = State.AfterAttributeName;
      this.stateAfterAttributeName(c);
    }
  }
  stateAfterAttributeName(c) {
    if (c === CharCodes2.Eq) {
      this.state = State.BeforeAttributeValue;
    } else if (c === CharCodes2.Slash || c === CharCodes2.Gt) {
      this.cbs.onattribend(QuoteType.NoValue, this.sectionStart);
      this.sectionStart = -1;
      this.state = State.BeforeAttributeName;
      this.stateBeforeAttributeName(c);
    } else if (!isWhitespace(c)) {
      this.cbs.onattribend(QuoteType.NoValue, this.sectionStart);
      this.state = State.InAttributeName;
      this.sectionStart = this.index;
    }
  }
  stateBeforeAttributeValue(c) {
    if (c === CharCodes2.DoubleQuote) {
      this.state = State.InAttributeValueDq;
      this.sectionStart = this.index + 1;
    } else if (c === CharCodes2.SingleQuote) {
      this.state = State.InAttributeValueSq;
      this.sectionStart = this.index + 1;
    } else if (!isWhitespace(c)) {
      this.sectionStart = this.index;
      this.state = State.InAttributeValueNq;
      this.stateInAttributeValueNoQuotes(c);
    }
  }
  handleInAttributeValue(c, quote) {
    if (c === quote || !this.decodeEntities && this.fastForwardTo(quote)) {
      this.cbs.onattribdata(this.sectionStart, this.index);
      this.sectionStart = -1;
      this.cbs.onattribend(quote === CharCodes2.DoubleQuote ? QuoteType.Double : QuoteType.Single, this.index + 1);
      this.state = State.BeforeAttributeName;
    } else if (this.decodeEntities && c === CharCodes2.Amp) {
      this.startEntity();
    }
  }
  stateInAttributeValueDoubleQuotes(c) {
    this.handleInAttributeValue(c, CharCodes2.DoubleQuote);
  }
  stateInAttributeValueSingleQuotes(c) {
    this.handleInAttributeValue(c, CharCodes2.SingleQuote);
  }
  stateInAttributeValueNoQuotes(c) {
    if (isWhitespace(c) || c === CharCodes2.Gt) {
      this.cbs.onattribdata(this.sectionStart, this.index);
      this.sectionStart = -1;
      this.cbs.onattribend(QuoteType.Unquoted, this.index);
      this.state = State.BeforeAttributeName;
      this.stateBeforeAttributeName(c);
    } else if (this.decodeEntities && c === CharCodes2.Amp) {
      this.startEntity();
    }
  }
  stateBeforeDeclaration(c) {
    if (c === CharCodes2.OpeningSquareBracket) {
      this.state = State.CDATASequence;
      this.sequenceIndex = 0;
    } else {
      this.state = c === CharCodes2.Dash ? State.BeforeComment : State.InDeclaration;
    }
  }
  stateInDeclaration(c) {
    if (c === CharCodes2.Gt || this.fastForwardTo(CharCodes2.Gt)) {
      this.cbs.ondeclaration(this.sectionStart, this.index);
      this.state = State.Text;
      this.sectionStart = this.index + 1;
    }
  }
  stateInProcessingInstruction(c) {
    if (c === CharCodes2.Gt || this.fastForwardTo(CharCodes2.Gt)) {
      this.cbs.onprocessinginstruction(this.sectionStart, this.index);
      this.state = State.Text;
      this.sectionStart = this.index + 1;
    }
  }
  stateBeforeComment(c) {
    if (c === CharCodes2.Dash) {
      this.state = State.InCommentLike;
      this.currentSequence = Sequences.CommentEnd;
      this.sequenceIndex = 2;
      this.sectionStart = this.index + 1;
    } else {
      this.state = State.InDeclaration;
    }
  }
  stateInSpecialComment(c) {
    if (c === CharCodes2.Gt || this.fastForwardTo(CharCodes2.Gt)) {
      this.cbs.oncomment(this.sectionStart, this.index, 0);
      this.state = State.Text;
      this.sectionStart = this.index + 1;
    }
  }
  stateBeforeSpecialS(c) {
    const lower = c | 32;
    if (lower === Sequences.ScriptEnd[3]) {
      this.startSpecial(Sequences.ScriptEnd, 4);
    } else if (lower === Sequences.StyleEnd[3]) {
      this.startSpecial(Sequences.StyleEnd, 4);
    } else {
      this.state = State.InTagName;
      this.stateInTagName(c);
    }
  }
  stateBeforeSpecialT(c) {
    const lower = c | 32;
    switch (lower) {
      case Sequences.TitleEnd[3]: {
        this.startSpecial(Sequences.TitleEnd, 4);
        break;
      }
      case Sequences.TextareaEnd[3]: {
        this.startSpecial(Sequences.TextareaEnd, 4);
        break;
      }
      case Sequences.XmpEnd[3]: {
        this.startSpecial(Sequences.XmpEnd, 4);
        break;
      }
      default: {
        this.state = State.InTagName;
        this.stateInTagName(c);
      }
    }
  }
  startEntity() {
    this.baseState = this.state;
    this.state = State.InEntity;
    this.entityStart = this.index;
    this.entityDecoder.startEntity(this.xmlMode ? DecodingMode.Strict : this.baseState === State.Text || this.baseState === State.InSpecialTag ? DecodingMode.Legacy : DecodingMode.Attribute);
  }
  stateInEntity() {
    const indexInBuffer = this.index - this.offset;
    const length2 = this.entityDecoder.write(this.buffer, indexInBuffer);
    if (length2 >= 0) {
      this.state = this.baseState;
      if (length2 === 0) {
        this.index -= 1;
      }
    } else {
      if (indexInBuffer < this.buffer.length && this.buffer.charCodeAt(indexInBuffer) === CharCodes2.Amp) {
        this.state = this.baseState;
        this.index -= 1;
        return;
      }
      this.index = this.offset + this.buffer.length - 1;
    }
  }
  /**
   * Remove data that has already been consumed from the buffer.
   */
  cleanup() {
    if (this.running && this.sectionStart !== this.index) {
      if (this.state === State.Text || this.state === State.InSpecialTag && this.sequenceIndex === 0) {
        this.cbs.ontext(this.sectionStart, this.index);
        this.sectionStart = this.index;
      } else if (this.state === State.InAttributeValueDq || this.state === State.InAttributeValueSq || this.state === State.InAttributeValueNq) {
        this.cbs.onattribdata(this.sectionStart, this.index);
        this.sectionStart = this.index;
      }
    }
  }
  shouldContinue() {
    return this.index < this.buffer.length + this.offset && this.running;
  }
  /**
   * Iterates through the buffer, calling the function corresponding to the current state.
   *
   * States that are more likely to be hit are higher up, as a performance improvement.
   */
  parse() {
    while (this.shouldContinue()) {
      const c = this.buffer.charCodeAt(this.index - this.offset);
      switch (this.state) {
        case State.Text: {
          this.stateText(c);
          break;
        }
        case State.SpecialStartSequence: {
          this.stateSpecialStartSequence(c);
          break;
        }
        case State.InSpecialTag: {
          this.stateInSpecialTag(c);
          break;
        }
        case State.CDATASequence: {
          this.stateCDATASequence(c);
          break;
        }
        case State.InAttributeValueDq: {
          this.stateInAttributeValueDoubleQuotes(c);
          break;
        }
        case State.InAttributeName: {
          this.stateInAttributeName(c);
          break;
        }
        case State.InCommentLike: {
          this.stateInCommentLike(c);
          break;
        }
        case State.InSpecialComment: {
          this.stateInSpecialComment(c);
          break;
        }
        case State.BeforeAttributeName: {
          this.stateBeforeAttributeName(c);
          break;
        }
        case State.InTagName: {
          this.stateInTagName(c);
          break;
        }
        case State.InClosingTagName: {
          this.stateInClosingTagName(c);
          break;
        }
        case State.BeforeTagName: {
          this.stateBeforeTagName(c);
          break;
        }
        case State.AfterAttributeName: {
          this.stateAfterAttributeName(c);
          break;
        }
        case State.InAttributeValueSq: {
          this.stateInAttributeValueSingleQuotes(c);
          break;
        }
        case State.BeforeAttributeValue: {
          this.stateBeforeAttributeValue(c);
          break;
        }
        case State.BeforeClosingTagName: {
          this.stateBeforeClosingTagName(c);
          break;
        }
        case State.AfterClosingTagName: {
          this.stateAfterClosingTagName(c);
          break;
        }
        case State.BeforeSpecialS: {
          this.stateBeforeSpecialS(c);
          break;
        }
        case State.BeforeSpecialT: {
          this.stateBeforeSpecialT(c);
          break;
        }
        case State.InAttributeValueNq: {
          this.stateInAttributeValueNoQuotes(c);
          break;
        }
        case State.InSelfClosingTag: {
          this.stateInSelfClosingTag(c);
          break;
        }
        case State.InDeclaration: {
          this.stateInDeclaration(c);
          break;
        }
        case State.BeforeDeclaration: {
          this.stateBeforeDeclaration(c);
          break;
        }
        case State.BeforeComment: {
          this.stateBeforeComment(c);
          break;
        }
        case State.InProcessingInstruction: {
          this.stateInProcessingInstruction(c);
          break;
        }
        case State.InEntity: {
          this.stateInEntity();
          break;
        }
      }
      this.index++;
    }
    this.cleanup();
  }
  finish() {
    if (this.state === State.InEntity) {
      this.entityDecoder.end();
      this.state = this.baseState;
    }
    this.handleTrailingData();
    this.cbs.onend();
  }
  /** Handle any trailing data. */
  handleTrailingData() {
    const endIndex = this.buffer.length + this.offset;
    if (this.sectionStart >= endIndex) {
      return;
    }
    if (this.state === State.InCommentLike) {
      if (this.currentSequence === Sequences.CdataEnd) {
        this.cbs.oncdata(this.sectionStart, endIndex, 0);
      } else {
        this.cbs.oncomment(this.sectionStart, endIndex, 0);
      }
    } else if (this.state === State.InTagName || this.state === State.BeforeAttributeName || this.state === State.BeforeAttributeValue || this.state === State.AfterAttributeName || this.state === State.InAttributeName || this.state === State.InAttributeValueSq || this.state === State.InAttributeValueDq || this.state === State.InAttributeValueNq || this.state === State.InClosingTagName) {
    } else {
      this.cbs.ontext(this.sectionStart, endIndex);
    }
  }
  emitCodePoint(cp, consumed) {
    if (this.baseState !== State.Text && this.baseState !== State.InSpecialTag) {
      if (this.sectionStart < this.entityStart) {
        this.cbs.onattribdata(this.sectionStart, this.entityStart);
      }
      this.sectionStart = this.entityStart + consumed;
      this.index = this.sectionStart - 1;
      this.cbs.onattribentity(cp);
    } else {
      if (this.sectionStart < this.entityStart) {
        this.cbs.ontext(this.sectionStart, this.entityStart);
      }
      this.sectionStart = this.entityStart + consumed;
      this.index = this.sectionStart - 1;
      this.cbs.ontextentity(cp, this.sectionStart);
    }
  }
};

// node_modules/htmlparser2/dist/esm/Parser.js
var formTags = /* @__PURE__ */ new Set([
  "input",
  "option",
  "optgroup",
  "select",
  "button",
  "datalist",
  "textarea"
]);
var pTag = /* @__PURE__ */ new Set(["p"]);
var tableSectionTags = /* @__PURE__ */ new Set(["thead", "tbody"]);
var ddtTags = /* @__PURE__ */ new Set(["dd", "dt"]);
var rtpTags = /* @__PURE__ */ new Set(["rt", "rp"]);
var openImpliesClose = /* @__PURE__ */ new Map([
  ["tr", /* @__PURE__ */ new Set(["tr", "th", "td"])],
  ["th", /* @__PURE__ */ new Set(["th"])],
  ["td", /* @__PURE__ */ new Set(["thead", "th", "td"])],
  ["body", /* @__PURE__ */ new Set(["head", "link", "script"])],
  ["li", /* @__PURE__ */ new Set(["li"])],
  ["p", pTag],
  ["h1", pTag],
  ["h2", pTag],
  ["h3", pTag],
  ["h4", pTag],
  ["h5", pTag],
  ["h6", pTag],
  ["select", formTags],
  ["input", formTags],
  ["output", formTags],
  ["button", formTags],
  ["datalist", formTags],
  ["textarea", formTags],
  ["option", /* @__PURE__ */ new Set(["option"])],
  ["optgroup", /* @__PURE__ */ new Set(["optgroup", "option"])],
  ["dd", ddtTags],
  ["dt", ddtTags],
  ["address", pTag],
  ["article", pTag],
  ["aside", pTag],
  ["blockquote", pTag],
  ["details", pTag],
  ["div", pTag],
  ["dl", pTag],
  ["fieldset", pTag],
  ["figcaption", pTag],
  ["figure", pTag],
  ["footer", pTag],
  ["form", pTag],
  ["header", pTag],
  ["hr", pTag],
  ["main", pTag],
  ["nav", pTag],
  ["ol", pTag],
  ["pre", pTag],
  ["section", pTag],
  ["table", pTag],
  ["ul", pTag],
  ["rt", rtpTags],
  ["rp", rtpTags],
  ["tbody", tableSectionTags],
  ["tfoot", tableSectionTags]
]);
var voidElements = /* @__PURE__ */ new Set([
  "area",
  "base",
  "basefont",
  "br",
  "col",
  "command",
  "embed",
  "frame",
  "hr",
  "img",
  "input",
  "isindex",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
]);
var foreignContextElements = /* @__PURE__ */ new Set(["math", "svg"]);
var htmlIntegrationElements = /* @__PURE__ */ new Set([
  "mi",
  "mo",
  "mn",
  "ms",
  "mtext",
  "annotation-xml",
  "foreignobject",
  "desc",
  "title"
]);
var reNameEnd = /\s|\//;
var Parser = class {
  constructor(cbs, options = {}) {
    var _a3, _b, _c, _d, _e, _f;
    this.options = options;
    this.startIndex = 0;
    this.endIndex = 0;
    this.openTagStart = 0;
    this.tagname = "";
    this.attribname = "";
    this.attribvalue = "";
    this.attribs = null;
    this.stack = [];
    this.buffers = [];
    this.bufferOffset = 0;
    this.writeIndex = 0;
    this.ended = false;
    this.cbs = cbs !== null && cbs !== void 0 ? cbs : {};
    this.htmlMode = !this.options.xmlMode;
    this.lowerCaseTagNames = (_a3 = options.lowerCaseTags) !== null && _a3 !== void 0 ? _a3 : this.htmlMode;
    this.lowerCaseAttributeNames = (_b = options.lowerCaseAttributeNames) !== null && _b !== void 0 ? _b : this.htmlMode;
    this.recognizeSelfClosing = (_c = options.recognizeSelfClosing) !== null && _c !== void 0 ? _c : !this.htmlMode;
    this.tokenizer = new ((_d = options.Tokenizer) !== null && _d !== void 0 ? _d : Tokenizer)(this.options, this);
    this.foreignContext = [!this.htmlMode];
    (_f = (_e = this.cbs).onparserinit) === null || _f === void 0 ? void 0 : _f.call(_e, this);
  }
  // Tokenizer event handlers
  /** @internal */
  ontext(start, endIndex) {
    var _a3, _b;
    const data2 = this.getSlice(start, endIndex);
    this.endIndex = endIndex - 1;
    (_b = (_a3 = this.cbs).ontext) === null || _b === void 0 ? void 0 : _b.call(_a3, data2);
    this.startIndex = endIndex;
  }
  /** @internal */
  ontextentity(cp, endIndex) {
    var _a3, _b;
    this.endIndex = endIndex - 1;
    (_b = (_a3 = this.cbs).ontext) === null || _b === void 0 ? void 0 : _b.call(_a3, fromCodePoint(cp));
    this.startIndex = endIndex;
  }
  /**
   * Checks if the current tag is a void element. Override this if you want
   * to specify your own additional void elements.
   */
  isVoidElement(name) {
    return this.htmlMode && voidElements.has(name);
  }
  /** @internal */
  onopentagname(start, endIndex) {
    this.endIndex = endIndex;
    let name = this.getSlice(start, endIndex);
    if (this.lowerCaseTagNames) {
      name = name.toLowerCase();
    }
    this.emitOpenTag(name);
  }
  emitOpenTag(name) {
    var _a3, _b, _c, _d;
    this.openTagStart = this.startIndex;
    this.tagname = name;
    const impliesClose = this.htmlMode && openImpliesClose.get(name);
    if (impliesClose) {
      while (this.stack.length > 0 && impliesClose.has(this.stack[0])) {
        const element = this.stack.shift();
        (_b = (_a3 = this.cbs).onclosetag) === null || _b === void 0 ? void 0 : _b.call(_a3, element, true);
      }
    }
    if (!this.isVoidElement(name)) {
      this.stack.unshift(name);
      if (this.htmlMode) {
        if (foreignContextElements.has(name)) {
          this.foreignContext.unshift(true);
        } else if (htmlIntegrationElements.has(name)) {
          this.foreignContext.unshift(false);
        }
      }
    }
    (_d = (_c = this.cbs).onopentagname) === null || _d === void 0 ? void 0 : _d.call(_c, name);
    if (this.cbs.onopentag)
      this.attribs = {};
  }
  endOpenTag(isImplied) {
    var _a3, _b;
    this.startIndex = this.openTagStart;
    if (this.attribs) {
      (_b = (_a3 = this.cbs).onopentag) === null || _b === void 0 ? void 0 : _b.call(_a3, this.tagname, this.attribs, isImplied);
      this.attribs = null;
    }
    if (this.cbs.onclosetag && this.isVoidElement(this.tagname)) {
      this.cbs.onclosetag(this.tagname, true);
    }
    this.tagname = "";
  }
  /** @internal */
  onopentagend(endIndex) {
    this.endIndex = endIndex;
    this.endOpenTag(false);
    this.startIndex = endIndex + 1;
  }
  /** @internal */
  onclosetag(start, endIndex) {
    var _a3, _b, _c, _d, _e, _f, _g, _h;
    this.endIndex = endIndex;
    let name = this.getSlice(start, endIndex);
    if (this.lowerCaseTagNames) {
      name = name.toLowerCase();
    }
    if (this.htmlMode && (foreignContextElements.has(name) || htmlIntegrationElements.has(name))) {
      this.foreignContext.shift();
    }
    if (!this.isVoidElement(name)) {
      const pos = this.stack.indexOf(name);
      if (pos !== -1) {
        for (let index = 0; index <= pos; index++) {
          const element = this.stack.shift();
          (_b = (_a3 = this.cbs).onclosetag) === null || _b === void 0 ? void 0 : _b.call(_a3, element, index !== pos);
        }
      } else if (this.htmlMode && name === "p") {
        this.emitOpenTag("p");
        this.closeCurrentTag(true);
      }
    } else if (this.htmlMode && name === "br") {
      (_d = (_c = this.cbs).onopentagname) === null || _d === void 0 ? void 0 : _d.call(_c, "br");
      (_f = (_e = this.cbs).onopentag) === null || _f === void 0 ? void 0 : _f.call(_e, "br", {}, true);
      (_h = (_g = this.cbs).onclosetag) === null || _h === void 0 ? void 0 : _h.call(_g, "br", false);
    }
    this.startIndex = endIndex + 1;
  }
  /** @internal */
  onselfclosingtag(endIndex) {
    this.endIndex = endIndex;
    if (this.recognizeSelfClosing || this.foreignContext[0]) {
      this.closeCurrentTag(false);
      this.startIndex = endIndex + 1;
    } else {
      this.onopentagend(endIndex);
    }
  }
  closeCurrentTag(isOpenImplied) {
    var _a3, _b;
    const name = this.tagname;
    this.endOpenTag(isOpenImplied);
    if (this.stack[0] === name) {
      (_b = (_a3 = this.cbs).onclosetag) === null || _b === void 0 ? void 0 : _b.call(_a3, name, !isOpenImplied);
      this.stack.shift();
    }
  }
  /** @internal */
  onattribname(start, endIndex) {
    this.startIndex = start;
    const name = this.getSlice(start, endIndex);
    this.attribname = this.lowerCaseAttributeNames ? name.toLowerCase() : name;
  }
  /** @internal */
  onattribdata(start, endIndex) {
    this.attribvalue += this.getSlice(start, endIndex);
  }
  /** @internal */
  onattribentity(cp) {
    this.attribvalue += fromCodePoint(cp);
  }
  /** @internal */
  onattribend(quote, endIndex) {
    var _a3, _b;
    this.endIndex = endIndex;
    (_b = (_a3 = this.cbs).onattribute) === null || _b === void 0 ? void 0 : _b.call(_a3, this.attribname, this.attribvalue, quote === QuoteType.Double ? '"' : quote === QuoteType.Single ? "'" : quote === QuoteType.NoValue ? void 0 : null);
    if (this.attribs && !Object.prototype.hasOwnProperty.call(this.attribs, this.attribname)) {
      this.attribs[this.attribname] = this.attribvalue;
    }
    this.attribvalue = "";
  }
  getInstructionName(value) {
    const index = value.search(reNameEnd);
    let name = index < 0 ? value : value.substr(0, index);
    if (this.lowerCaseTagNames) {
      name = name.toLowerCase();
    }
    return name;
  }
  /** @internal */
  ondeclaration(start, endIndex) {
    this.endIndex = endIndex;
    const value = this.getSlice(start, endIndex);
    if (this.cbs.onprocessinginstruction) {
      const name = this.getInstructionName(value);
      this.cbs.onprocessinginstruction(`!${name}`, `!${value}`);
    }
    this.startIndex = endIndex + 1;
  }
  /** @internal */
  onprocessinginstruction(start, endIndex) {
    this.endIndex = endIndex;
    const value = this.getSlice(start, endIndex);
    if (this.cbs.onprocessinginstruction) {
      const name = this.getInstructionName(value);
      this.cbs.onprocessinginstruction(`?${name}`, `?${value}`);
    }
    this.startIndex = endIndex + 1;
  }
  /** @internal */
  oncomment(start, endIndex, offset) {
    var _a3, _b, _c, _d;
    this.endIndex = endIndex;
    (_b = (_a3 = this.cbs).oncomment) === null || _b === void 0 ? void 0 : _b.call(_a3, this.getSlice(start, endIndex - offset));
    (_d = (_c = this.cbs).oncommentend) === null || _d === void 0 ? void 0 : _d.call(_c);
    this.startIndex = endIndex + 1;
  }
  /** @internal */
  oncdata(start, endIndex, offset) {
    var _a3, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    this.endIndex = endIndex;
    const value = this.getSlice(start, endIndex - offset);
    if (!this.htmlMode || this.options.recognizeCDATA) {
      (_b = (_a3 = this.cbs).oncdatastart) === null || _b === void 0 ? void 0 : _b.call(_a3);
      (_d = (_c = this.cbs).ontext) === null || _d === void 0 ? void 0 : _d.call(_c, value);
      (_f = (_e = this.cbs).oncdataend) === null || _f === void 0 ? void 0 : _f.call(_e);
    } else {
      (_h = (_g = this.cbs).oncomment) === null || _h === void 0 ? void 0 : _h.call(_g, `[CDATA[${value}]]`);
      (_k = (_j = this.cbs).oncommentend) === null || _k === void 0 ? void 0 : _k.call(_j);
    }
    this.startIndex = endIndex + 1;
  }
  /** @internal */
  onend() {
    var _a3, _b;
    if (this.cbs.onclosetag) {
      this.endIndex = this.startIndex;
      for (let index = 0; index < this.stack.length; index++) {
        this.cbs.onclosetag(this.stack[index], true);
      }
    }
    (_b = (_a3 = this.cbs).onend) === null || _b === void 0 ? void 0 : _b.call(_a3);
  }
  /**
   * Resets the parser to a blank state, ready to parse a new HTML document
   */
  reset() {
    var _a3, _b, _c, _d;
    (_b = (_a3 = this.cbs).onreset) === null || _b === void 0 ? void 0 : _b.call(_a3);
    this.tokenizer.reset();
    this.tagname = "";
    this.attribname = "";
    this.attribs = null;
    this.stack.length = 0;
    this.startIndex = 0;
    this.endIndex = 0;
    (_d = (_c = this.cbs).onparserinit) === null || _d === void 0 ? void 0 : _d.call(_c, this);
    this.buffers.length = 0;
    this.foreignContext.length = 0;
    this.foreignContext.unshift(!this.htmlMode);
    this.bufferOffset = 0;
    this.writeIndex = 0;
    this.ended = false;
  }
  /**
   * Resets the parser, then parses a complete document and
   * pushes it to the handler.
   *
   * @param data Document to parse.
   */
  parseComplete(data2) {
    this.reset();
    this.end(data2);
  }
  getSlice(start, end) {
    while (start - this.bufferOffset >= this.buffers[0].length) {
      this.shiftBuffer();
    }
    let slice = this.buffers[0].slice(start - this.bufferOffset, end - this.bufferOffset);
    while (end - this.bufferOffset > this.buffers[0].length) {
      this.shiftBuffer();
      slice += this.buffers[0].slice(0, end - this.bufferOffset);
    }
    return slice;
  }
  shiftBuffer() {
    this.bufferOffset += this.buffers[0].length;
    this.writeIndex--;
    this.buffers.shift();
  }
  /**
   * Parses a chunk of data and calls the corresponding callbacks.
   *
   * @param chunk Chunk to parse.
   */
  write(chunk) {
    var _a3, _b;
    if (this.ended) {
      (_b = (_a3 = this.cbs).onerror) === null || _b === void 0 ? void 0 : _b.call(_a3, new Error(".write() after done!"));
      return;
    }
    this.buffers.push(chunk);
    if (this.tokenizer.running) {
      this.tokenizer.write(chunk);
      this.writeIndex++;
    }
  }
  /**
   * Parses the end of the buffer and clears the stack, calls onend.
   *
   * @param chunk Optional final chunk to parse.
   */
  end(chunk) {
    var _a3, _b;
    if (this.ended) {
      (_b = (_a3 = this.cbs).onerror) === null || _b === void 0 ? void 0 : _b.call(_a3, new Error(".end() after done!"));
      return;
    }
    if (chunk)
      this.write(chunk);
    this.ended = true;
    this.tokenizer.end();
  }
  /**
   * Pauses parsing. The parser won't emit events until `resume` is called.
   */
  pause() {
    this.tokenizer.pause();
  }
  /**
   * Resumes parsing after `pause` was called.
   */
  resume() {
    this.tokenizer.resume();
    while (this.tokenizer.running && this.writeIndex < this.buffers.length) {
      this.tokenizer.write(this.buffers[this.writeIndex++]);
    }
    if (this.ended)
      this.tokenizer.end();
  }
  /**
   * Alias of `write`, for backwards compatibility.
   *
   * @param chunk Chunk to parse.
   * @deprecated
   */
  parseChunk(chunk) {
    this.write(chunk);
  }
  /**
   * Alias of `end`, for backwards compatibility.
   *
   * @param chunk Optional final chunk to parse.
   * @deprecated
   */
  done(chunk) {
    this.end(chunk);
  }
};

// node_modules/domelementtype/lib/esm/index.js
var esm_exports = {};
__export(esm_exports, {
  CDATA: () => CDATA,
  Comment: () => Comment,
  Directive: () => Directive,
  Doctype: () => Doctype,
  ElementType: () => ElementType,
  Root: () => Root,
  Script: () => Script,
  Style: () => Style,
  Tag: () => Tag,
  Text: () => Text,
  isTag: () => isTag
});
var ElementType;
(function(ElementType5) {
  ElementType5["Root"] = "root";
  ElementType5["Text"] = "text";
  ElementType5["Directive"] = "directive";
  ElementType5["Comment"] = "comment";
  ElementType5["Script"] = "script";
  ElementType5["Style"] = "style";
  ElementType5["Tag"] = "tag";
  ElementType5["CDATA"] = "cdata";
  ElementType5["Doctype"] = "doctype";
})(ElementType || (ElementType = {}));
function isTag(elem) {
  return elem.type === ElementType.Tag || elem.type === ElementType.Script || elem.type === ElementType.Style;
}
var Root = ElementType.Root;
var Text = ElementType.Text;
var Directive = ElementType.Directive;
var Comment = ElementType.Comment;
var Script = ElementType.Script;
var Style = ElementType.Style;
var Tag = ElementType.Tag;
var CDATA = ElementType.CDATA;
var Doctype = ElementType.Doctype;

// node_modules/htmlparser2/node_modules/domhandler/lib/esm/node.js
var Node = class {
  constructor() {
    this.parent = null;
    this.prev = null;
    this.next = null;
    this.startIndex = null;
    this.endIndex = null;
  }
  // Read-write aliases for properties
  /**
   * Same as {@link parent}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get parentNode() {
    return this.parent;
  }
  set parentNode(parent) {
    this.parent = parent;
  }
  /**
   * Same as {@link prev}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get previousSibling() {
    return this.prev;
  }
  set previousSibling(prev2) {
    this.prev = prev2;
  }
  /**
   * Same as {@link next}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get nextSibling() {
    return this.next;
  }
  set nextSibling(next2) {
    this.next = next2;
  }
  /**
   * Clone this node, and optionally its children.
   *
   * @param recursive Clone child nodes as well.
   * @returns A clone of the node.
   */
  cloneNode(recursive = false) {
    return cloneNode(this, recursive);
  }
};
var DataNode = class extends Node {
  /**
   * @param data The content of the data node
   */
  constructor(data2) {
    super();
    this.data = data2;
  }
  /**
   * Same as {@link data}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get nodeValue() {
    return this.data;
  }
  set nodeValue(data2) {
    this.data = data2;
  }
};
var Text2 = class extends DataNode {
  constructor() {
    super(...arguments);
    this.type = ElementType.Text;
  }
  get nodeType() {
    return 3;
  }
};
var Comment2 = class extends DataNode {
  constructor() {
    super(...arguments);
    this.type = ElementType.Comment;
  }
  get nodeType() {
    return 8;
  }
};
var ProcessingInstruction = class extends DataNode {
  constructor(name, data2) {
    super(data2);
    this.name = name;
    this.type = ElementType.Directive;
  }
  get nodeType() {
    return 1;
  }
};
var NodeWithChildren = class extends Node {
  /**
   * @param children Children of the node. Only certain node types can have children.
   */
  constructor(children) {
    super();
    this.children = children;
  }
  // Aliases
  /** First child of the node. */
  get firstChild() {
    var _a3;
    return (_a3 = this.children[0]) !== null && _a3 !== void 0 ? _a3 : null;
  }
  /** Last child of the node. */
  get lastChild() {
    return this.children.length > 0 ? this.children[this.children.length - 1] : null;
  }
  /**
   * Same as {@link children}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get childNodes() {
    return this.children;
  }
  set childNodes(children) {
    this.children = children;
  }
};
var CDATA2 = class extends NodeWithChildren {
  constructor() {
    super(...arguments);
    this.type = ElementType.CDATA;
  }
  get nodeType() {
    return 4;
  }
};
var Document = class extends NodeWithChildren {
  constructor() {
    super(...arguments);
    this.type = ElementType.Root;
  }
  get nodeType() {
    return 9;
  }
};
var Element = class extends NodeWithChildren {
  /**
   * @param name Name of the tag, eg. `div`, `span`.
   * @param attribs Object mapping attribute names to attribute values.
   * @param children Children of the node.
   */
  constructor(name, attribs, children = [], type = name === "script" ? ElementType.Script : name === "style" ? ElementType.Style : ElementType.Tag) {
    super(children);
    this.name = name;
    this.attribs = attribs;
    this.type = type;
  }
  get nodeType() {
    return 1;
  }
  // DOM Level 1 aliases
  /**
   * Same as {@link name}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get tagName() {
    return this.name;
  }
  set tagName(name) {
    this.name = name;
  }
  get attributes() {
    return Object.keys(this.attribs).map((name) => {
      var _a3, _b;
      return {
        name,
        value: this.attribs[name],
        namespace: (_a3 = this["x-attribsNamespace"]) === null || _a3 === void 0 ? void 0 : _a3[name],
        prefix: (_b = this["x-attribsPrefix"]) === null || _b === void 0 ? void 0 : _b[name]
      };
    });
  }
};
function isTag2(node) {
  return isTag(node);
}
function isCDATA(node) {
  return node.type === ElementType.CDATA;
}
function isText(node) {
  return node.type === ElementType.Text;
}
function isComment(node) {
  return node.type === ElementType.Comment;
}
function isDirective(node) {
  return node.type === ElementType.Directive;
}
function isDocument(node) {
  return node.type === ElementType.Root;
}
function hasChildren(node) {
  return Object.prototype.hasOwnProperty.call(node, "children");
}
function cloneNode(node, recursive = false) {
  let result;
  if (isText(node)) {
    result = new Text2(node.data);
  } else if (isComment(node)) {
    result = new Comment2(node.data);
  } else if (isTag2(node)) {
    const children = recursive ? cloneChildren(node.children) : [];
    const clone = new Element(node.name, { ...node.attribs }, children);
    children.forEach((child) => child.parent = clone);
    if (node.namespace != null) {
      clone.namespace = node.namespace;
    }
    if (node["x-attribsNamespace"]) {
      clone["x-attribsNamespace"] = { ...node["x-attribsNamespace"] };
    }
    if (node["x-attribsPrefix"]) {
      clone["x-attribsPrefix"] = { ...node["x-attribsPrefix"] };
    }
    result = clone;
  } else if (isCDATA(node)) {
    const children = recursive ? cloneChildren(node.children) : [];
    const clone = new CDATA2(children);
    children.forEach((child) => child.parent = clone);
    result = clone;
  } else if (isDocument(node)) {
    const children = recursive ? cloneChildren(node.children) : [];
    const clone = new Document(children);
    children.forEach((child) => child.parent = clone);
    if (node["x-mode"]) {
      clone["x-mode"] = node["x-mode"];
    }
    result = clone;
  } else if (isDirective(node)) {
    const instruction = new ProcessingInstruction(node.name, node.data);
    if (node["x-name"] != null) {
      instruction["x-name"] = node["x-name"];
      instruction["x-publicId"] = node["x-publicId"];
      instruction["x-systemId"] = node["x-systemId"];
    }
    result = instruction;
  } else {
    throw new Error(`Not implemented yet: ${node.type}`);
  }
  result.startIndex = node.startIndex;
  result.endIndex = node.endIndex;
  if (node.sourceCodeLocation != null) {
    result.sourceCodeLocation = node.sourceCodeLocation;
  }
  return result;
}
function cloneChildren(childs) {
  const children = childs.map((child) => cloneNode(child, true));
  for (let i = 1; i < children.length; i++) {
    children[i].prev = children[i - 1];
    children[i - 1].next = children[i];
  }
  return children;
}

// node_modules/htmlparser2/node_modules/domhandler/lib/esm/index.js
var defaultOpts = {
  withStartIndices: false,
  withEndIndices: false,
  xmlMode: false
};
var DomHandler = class {
  /**
   * @param callback Called once parsing has completed.
   * @param options Settings for the handler.
   * @param elementCB Callback whenever a tag is closed.
   */
  constructor(callback, options, elementCB) {
    this.dom = [];
    this.root = new Document(this.dom);
    this.done = false;
    this.tagStack = [this.root];
    this.lastNode = null;
    this.parser = null;
    if (typeof options === "function") {
      elementCB = options;
      options = defaultOpts;
    }
    if (typeof callback === "object") {
      options = callback;
      callback = void 0;
    }
    this.callback = callback !== null && callback !== void 0 ? callback : null;
    this.options = options !== null && options !== void 0 ? options : defaultOpts;
    this.elementCB = elementCB !== null && elementCB !== void 0 ? elementCB : null;
  }
  onparserinit(parser2) {
    this.parser = parser2;
  }
  // Resets the handler back to starting state
  onreset() {
    this.dom = [];
    this.root = new Document(this.dom);
    this.done = false;
    this.tagStack = [this.root];
    this.lastNode = null;
    this.parser = null;
  }
  // Signals the handler that parsing is done
  onend() {
    if (this.done)
      return;
    this.done = true;
    this.parser = null;
    this.handleCallback(null);
  }
  onerror(error) {
    this.handleCallback(error);
  }
  onclosetag() {
    this.lastNode = null;
    const elem = this.tagStack.pop();
    if (this.options.withEndIndices) {
      elem.endIndex = this.parser.endIndex;
    }
    if (this.elementCB)
      this.elementCB(elem);
  }
  onopentag(name, attribs) {
    const type = this.options.xmlMode ? ElementType.Tag : void 0;
    const element = new Element(name, attribs, void 0, type);
    this.addNode(element);
    this.tagStack.push(element);
  }
  ontext(data2) {
    const { lastNode } = this;
    if (lastNode && lastNode.type === ElementType.Text) {
      lastNode.data += data2;
      if (this.options.withEndIndices) {
        lastNode.endIndex = this.parser.endIndex;
      }
    } else {
      const node = new Text2(data2);
      this.addNode(node);
      this.lastNode = node;
    }
  }
  oncomment(data2) {
    if (this.lastNode && this.lastNode.type === ElementType.Comment) {
      this.lastNode.data += data2;
      return;
    }
    const node = new Comment2(data2);
    this.addNode(node);
    this.lastNode = node;
  }
  oncommentend() {
    this.lastNode = null;
  }
  oncdatastart() {
    const text = new Text2("");
    const node = new CDATA2([text]);
    this.addNode(node);
    text.parent = node;
    this.lastNode = text;
  }
  oncdataend() {
    this.lastNode = null;
  }
  onprocessinginstruction(name, data2) {
    const node = new ProcessingInstruction(name, data2);
    this.addNode(node);
  }
  handleCallback(error) {
    if (typeof this.callback === "function") {
      this.callback(error, this.dom);
    } else if (error) {
      throw error;
    }
  }
  addNode(node) {
    const parent = this.tagStack[this.tagStack.length - 1];
    const previousSibling2 = parent.children[parent.children.length - 1];
    if (this.options.withStartIndices) {
      node.startIndex = this.parser.startIndex;
    }
    if (this.options.withEndIndices) {
      node.endIndex = this.parser.endIndex;
    }
    parent.children.push(node);
    if (previousSibling2) {
      node.prev = previousSibling2;
      previousSibling2.next = node;
    }
    node.parent = parent;
    this.lastNode = null;
  }
};

// node_modules/htmlparser2/node_modules/domutils/lib/esm/index.js
var esm_exports2 = {};
__export(esm_exports2, {
  DocumentPosition: () => DocumentPosition,
  append: () => append,
  appendChild: () => appendChild,
  compareDocumentPosition: () => compareDocumentPosition,
  existsOne: () => existsOne,
  filter: () => filter,
  find: () => find,
  findAll: () => findAll,
  findOne: () => findOne,
  findOneChild: () => findOneChild,
  getAttributeValue: () => getAttributeValue,
  getChildren: () => getChildren,
  getElementById: () => getElementById,
  getElements: () => getElements,
  getElementsByClassName: () => getElementsByClassName,
  getElementsByTagName: () => getElementsByTagName,
  getElementsByTagType: () => getElementsByTagType,
  getFeed: () => getFeed,
  getInnerHTML: () => getInnerHTML,
  getName: () => getName,
  getOuterHTML: () => getOuterHTML,
  getParent: () => getParent,
  getSiblings: () => getSiblings,
  getText: () => getText,
  hasAttrib: () => hasAttrib,
  hasChildren: () => hasChildren,
  innerText: () => innerText,
  isCDATA: () => isCDATA,
  isComment: () => isComment,
  isDocument: () => isDocument,
  isTag: () => isTag2,
  isText: () => isText,
  nextElementSibling: () => nextElementSibling,
  prepend: () => prepend,
  prependChild: () => prependChild,
  prevElementSibling: () => prevElementSibling,
  removeElement: () => removeElement,
  removeSubsets: () => removeSubsets,
  replaceElement: () => replaceElement,
  testElement: () => testElement,
  textContent: () => textContent,
  uniqueSort: () => uniqueSort
});

// node_modules/htmlparser2/node_modules/domutils/node_modules/dom-serializer/node_modules/entities/lib/esm/generated/decode-data-html.js
var decode_data_html_default = new Uint16Array(
  // prettier-ignore
  '\u1D41<\xD5\u0131\u028A\u049D\u057B\u05D0\u0675\u06DE\u07A2\u07D6\u080F\u0A4A\u0A91\u0DA1\u0E6D\u0F09\u0F26\u10CA\u1228\u12E1\u1415\u149D\u14C3\u14DF\u1525\0\0\0\0\0\0\u156B\u16CD\u198D\u1C12\u1DDD\u1F7E\u2060\u21B0\u228D\u23C0\u23FB\u2442\u2824\u2912\u2D08\u2E48\u2FCE\u3016\u32BA\u3639\u37AC\u38FE\u3A28\u3A71\u3AE0\u3B2E\u0800EMabcfglmnoprstu\\bfms\x7F\x84\x8B\x90\x95\x98\xA6\xB3\xB9\xC8\xCFlig\u803B\xC6\u40C6P\u803B&\u4026cute\u803B\xC1\u40C1reve;\u4102\u0100iyx}rc\u803B\xC2\u40C2;\u4410r;\uC000\u{1D504}rave\u803B\xC0\u40C0pha;\u4391acr;\u4100d;\u6A53\u0100gp\x9D\xA1on;\u4104f;\uC000\u{1D538}plyFunction;\u6061ing\u803B\xC5\u40C5\u0100cs\xBE\xC3r;\uC000\u{1D49C}ign;\u6254ilde\u803B\xC3\u40C3ml\u803B\xC4\u40C4\u0400aceforsu\xE5\xFB\xFE\u0117\u011C\u0122\u0127\u012A\u0100cr\xEA\xF2kslash;\u6216\u0176\xF6\xF8;\u6AE7ed;\u6306y;\u4411\u0180crt\u0105\u010B\u0114ause;\u6235noullis;\u612Ca;\u4392r;\uC000\u{1D505}pf;\uC000\u{1D539}eve;\u42D8c\xF2\u0113mpeq;\u624E\u0700HOacdefhilorsu\u014D\u0151\u0156\u0180\u019E\u01A2\u01B5\u01B7\u01BA\u01DC\u0215\u0273\u0278\u027Ecy;\u4427PY\u803B\xA9\u40A9\u0180cpy\u015D\u0162\u017Aute;\u4106\u0100;i\u0167\u0168\u62D2talDifferentialD;\u6145leys;\u612D\u0200aeio\u0189\u018E\u0194\u0198ron;\u410Cdil\u803B\xC7\u40C7rc;\u4108nint;\u6230ot;\u410A\u0100dn\u01A7\u01ADilla;\u40B8terDot;\u40B7\xF2\u017Fi;\u43A7rcle\u0200DMPT\u01C7\u01CB\u01D1\u01D6ot;\u6299inus;\u6296lus;\u6295imes;\u6297o\u0100cs\u01E2\u01F8kwiseContourIntegral;\u6232eCurly\u0100DQ\u0203\u020FoubleQuote;\u601Duote;\u6019\u0200lnpu\u021E\u0228\u0247\u0255on\u0100;e\u0225\u0226\u6237;\u6A74\u0180git\u022F\u0236\u023Aruent;\u6261nt;\u622FourIntegral;\u622E\u0100fr\u024C\u024E;\u6102oduct;\u6210nterClockwiseContourIntegral;\u6233oss;\u6A2Fcr;\uC000\u{1D49E}p\u0100;C\u0284\u0285\u62D3ap;\u624D\u0580DJSZacefios\u02A0\u02AC\u02B0\u02B4\u02B8\u02CB\u02D7\u02E1\u02E6\u0333\u048D\u0100;o\u0179\u02A5trahd;\u6911cy;\u4402cy;\u4405cy;\u440F\u0180grs\u02BF\u02C4\u02C7ger;\u6021r;\u61A1hv;\u6AE4\u0100ay\u02D0\u02D5ron;\u410E;\u4414l\u0100;t\u02DD\u02DE\u6207a;\u4394r;\uC000\u{1D507}\u0100af\u02EB\u0327\u0100cm\u02F0\u0322ritical\u0200ADGT\u0300\u0306\u0316\u031Ccute;\u40B4o\u0174\u030B\u030D;\u42D9bleAcute;\u42DDrave;\u4060ilde;\u42DCond;\u62C4ferentialD;\u6146\u0470\u033D\0\0\0\u0342\u0354\0\u0405f;\uC000\u{1D53B}\u0180;DE\u0348\u0349\u034D\u40A8ot;\u60DCqual;\u6250ble\u0300CDLRUV\u0363\u0372\u0382\u03CF\u03E2\u03F8ontourIntegra\xEC\u0239o\u0274\u0379\0\0\u037B\xBB\u0349nArrow;\u61D3\u0100eo\u0387\u03A4ft\u0180ART\u0390\u0396\u03A1rrow;\u61D0ightArrow;\u61D4e\xE5\u02CAng\u0100LR\u03AB\u03C4eft\u0100AR\u03B3\u03B9rrow;\u67F8ightArrow;\u67FAightArrow;\u67F9ight\u0100AT\u03D8\u03DErrow;\u61D2ee;\u62A8p\u0241\u03E9\0\0\u03EFrrow;\u61D1ownArrow;\u61D5erticalBar;\u6225n\u0300ABLRTa\u0412\u042A\u0430\u045E\u047F\u037Crrow\u0180;BU\u041D\u041E\u0422\u6193ar;\u6913pArrow;\u61F5reve;\u4311eft\u02D2\u043A\0\u0446\0\u0450ightVector;\u6950eeVector;\u695Eector\u0100;B\u0459\u045A\u61BDar;\u6956ight\u01D4\u0467\0\u0471eeVector;\u695Fector\u0100;B\u047A\u047B\u61C1ar;\u6957ee\u0100;A\u0486\u0487\u62A4rrow;\u61A7\u0100ct\u0492\u0497r;\uC000\u{1D49F}rok;\u4110\u0800NTacdfglmopqstux\u04BD\u04C0\u04C4\u04CB\u04DE\u04E2\u04E7\u04EE\u04F5\u0521\u052F\u0536\u0552\u055D\u0560\u0565G;\u414AH\u803B\xD0\u40D0cute\u803B\xC9\u40C9\u0180aiy\u04D2\u04D7\u04DCron;\u411Arc\u803B\xCA\u40CA;\u442Dot;\u4116r;\uC000\u{1D508}rave\u803B\xC8\u40C8ement;\u6208\u0100ap\u04FA\u04FEcr;\u4112ty\u0253\u0506\0\0\u0512mallSquare;\u65FBerySmallSquare;\u65AB\u0100gp\u0526\u052Aon;\u4118f;\uC000\u{1D53C}silon;\u4395u\u0100ai\u053C\u0549l\u0100;T\u0542\u0543\u6A75ilde;\u6242librium;\u61CC\u0100ci\u0557\u055Ar;\u6130m;\u6A73a;\u4397ml\u803B\xCB\u40CB\u0100ip\u056A\u056Fsts;\u6203onentialE;\u6147\u0280cfios\u0585\u0588\u058D\u05B2\u05CCy;\u4424r;\uC000\u{1D509}lled\u0253\u0597\0\0\u05A3mallSquare;\u65FCerySmallSquare;\u65AA\u0370\u05BA\0\u05BF\0\0\u05C4f;\uC000\u{1D53D}All;\u6200riertrf;\u6131c\xF2\u05CB\u0600JTabcdfgorst\u05E8\u05EC\u05EF\u05FA\u0600\u0612\u0616\u061B\u061D\u0623\u066C\u0672cy;\u4403\u803B>\u403Emma\u0100;d\u05F7\u05F8\u4393;\u43DCreve;\u411E\u0180eiy\u0607\u060C\u0610dil;\u4122rc;\u411C;\u4413ot;\u4120r;\uC000\u{1D50A};\u62D9pf;\uC000\u{1D53E}eater\u0300EFGLST\u0635\u0644\u064E\u0656\u065B\u0666qual\u0100;L\u063E\u063F\u6265ess;\u62DBullEqual;\u6267reater;\u6AA2ess;\u6277lantEqual;\u6A7Eilde;\u6273cr;\uC000\u{1D4A2};\u626B\u0400Aacfiosu\u0685\u068B\u0696\u069B\u069E\u06AA\u06BE\u06CARDcy;\u442A\u0100ct\u0690\u0694ek;\u42C7;\u405Eirc;\u4124r;\u610ClbertSpace;\u610B\u01F0\u06AF\0\u06B2f;\u610DizontalLine;\u6500\u0100ct\u06C3\u06C5\xF2\u06A9rok;\u4126mp\u0144\u06D0\u06D8ownHum\xF0\u012Fqual;\u624F\u0700EJOacdfgmnostu\u06FA\u06FE\u0703\u0707\u070E\u071A\u071E\u0721\u0728\u0744\u0778\u078B\u078F\u0795cy;\u4415lig;\u4132cy;\u4401cute\u803B\xCD\u40CD\u0100iy\u0713\u0718rc\u803B\xCE\u40CE;\u4418ot;\u4130r;\u6111rave\u803B\xCC\u40CC\u0180;ap\u0720\u072F\u073F\u0100cg\u0734\u0737r;\u412AinaryI;\u6148lie\xF3\u03DD\u01F4\u0749\0\u0762\u0100;e\u074D\u074E\u622C\u0100gr\u0753\u0758ral;\u622Bsection;\u62C2isible\u0100CT\u076C\u0772omma;\u6063imes;\u6062\u0180gpt\u077F\u0783\u0788on;\u412Ef;\uC000\u{1D540}a;\u4399cr;\u6110ilde;\u4128\u01EB\u079A\0\u079Ecy;\u4406l\u803B\xCF\u40CF\u0280cfosu\u07AC\u07B7\u07BC\u07C2\u07D0\u0100iy\u07B1\u07B5rc;\u4134;\u4419r;\uC000\u{1D50D}pf;\uC000\u{1D541}\u01E3\u07C7\0\u07CCr;\uC000\u{1D4A5}rcy;\u4408kcy;\u4404\u0380HJacfos\u07E4\u07E8\u07EC\u07F1\u07FD\u0802\u0808cy;\u4425cy;\u440Cppa;\u439A\u0100ey\u07F6\u07FBdil;\u4136;\u441Ar;\uC000\u{1D50E}pf;\uC000\u{1D542}cr;\uC000\u{1D4A6}\u0580JTaceflmost\u0825\u0829\u082C\u0850\u0863\u09B3\u09B8\u09C7\u09CD\u0A37\u0A47cy;\u4409\u803B<\u403C\u0280cmnpr\u0837\u083C\u0841\u0844\u084Dute;\u4139bda;\u439Bg;\u67EAlacetrf;\u6112r;\u619E\u0180aey\u0857\u085C\u0861ron;\u413Ddil;\u413B;\u441B\u0100fs\u0868\u0970t\u0500ACDFRTUVar\u087E\u08A9\u08B1\u08E0\u08E6\u08FC\u092F\u095B\u0390\u096A\u0100nr\u0883\u088FgleBracket;\u67E8row\u0180;BR\u0899\u089A\u089E\u6190ar;\u61E4ightArrow;\u61C6eiling;\u6308o\u01F5\u08B7\0\u08C3bleBracket;\u67E6n\u01D4\u08C8\0\u08D2eeVector;\u6961ector\u0100;B\u08DB\u08DC\u61C3ar;\u6959loor;\u630Aight\u0100AV\u08EF\u08F5rrow;\u6194ector;\u694E\u0100er\u0901\u0917e\u0180;AV\u0909\u090A\u0910\u62A3rrow;\u61A4ector;\u695Aiangle\u0180;BE\u0924\u0925\u0929\u62B2ar;\u69CFqual;\u62B4p\u0180DTV\u0937\u0942\u094CownVector;\u6951eeVector;\u6960ector\u0100;B\u0956\u0957\u61BFar;\u6958ector\u0100;B\u0965\u0966\u61BCar;\u6952ight\xE1\u039Cs\u0300EFGLST\u097E\u098B\u0995\u099D\u09A2\u09ADqualGreater;\u62DAullEqual;\u6266reater;\u6276ess;\u6AA1lantEqual;\u6A7Dilde;\u6272r;\uC000\u{1D50F}\u0100;e\u09BD\u09BE\u62D8ftarrow;\u61DAidot;\u413F\u0180npw\u09D4\u0A16\u0A1Bg\u0200LRlr\u09DE\u09F7\u0A02\u0A10eft\u0100AR\u09E6\u09ECrrow;\u67F5ightArrow;\u67F7ightArrow;\u67F6eft\u0100ar\u03B3\u0A0Aight\xE1\u03BFight\xE1\u03CAf;\uC000\u{1D543}er\u0100LR\u0A22\u0A2CeftArrow;\u6199ightArrow;\u6198\u0180cht\u0A3E\u0A40\u0A42\xF2\u084C;\u61B0rok;\u4141;\u626A\u0400acefiosu\u0A5A\u0A5D\u0A60\u0A77\u0A7C\u0A85\u0A8B\u0A8Ep;\u6905y;\u441C\u0100dl\u0A65\u0A6FiumSpace;\u605Flintrf;\u6133r;\uC000\u{1D510}nusPlus;\u6213pf;\uC000\u{1D544}c\xF2\u0A76;\u439C\u0480Jacefostu\u0AA3\u0AA7\u0AAD\u0AC0\u0B14\u0B19\u0D91\u0D97\u0D9Ecy;\u440Acute;\u4143\u0180aey\u0AB4\u0AB9\u0ABEron;\u4147dil;\u4145;\u441D\u0180gsw\u0AC7\u0AF0\u0B0Eative\u0180MTV\u0AD3\u0ADF\u0AE8ediumSpace;\u600Bhi\u0100cn\u0AE6\u0AD8\xEB\u0AD9eryThi\xEE\u0AD9ted\u0100GL\u0AF8\u0B06reaterGreate\xF2\u0673essLes\xF3\u0A48Line;\u400Ar;\uC000\u{1D511}\u0200Bnpt\u0B22\u0B28\u0B37\u0B3Areak;\u6060BreakingSpace;\u40A0f;\u6115\u0680;CDEGHLNPRSTV\u0B55\u0B56\u0B6A\u0B7C\u0BA1\u0BEB\u0C04\u0C5E\u0C84\u0CA6\u0CD8\u0D61\u0D85\u6AEC\u0100ou\u0B5B\u0B64ngruent;\u6262pCap;\u626DoubleVerticalBar;\u6226\u0180lqx\u0B83\u0B8A\u0B9Bement;\u6209ual\u0100;T\u0B92\u0B93\u6260ilde;\uC000\u2242\u0338ists;\u6204reater\u0380;EFGLST\u0BB6\u0BB7\u0BBD\u0BC9\u0BD3\u0BD8\u0BE5\u626Fqual;\u6271ullEqual;\uC000\u2267\u0338reater;\uC000\u226B\u0338ess;\u6279lantEqual;\uC000\u2A7E\u0338ilde;\u6275ump\u0144\u0BF2\u0BFDownHump;\uC000\u224E\u0338qual;\uC000\u224F\u0338e\u0100fs\u0C0A\u0C27tTriangle\u0180;BE\u0C1A\u0C1B\u0C21\u62EAar;\uC000\u29CF\u0338qual;\u62ECs\u0300;EGLST\u0C35\u0C36\u0C3C\u0C44\u0C4B\u0C58\u626Equal;\u6270reater;\u6278ess;\uC000\u226A\u0338lantEqual;\uC000\u2A7D\u0338ilde;\u6274ested\u0100GL\u0C68\u0C79reaterGreater;\uC000\u2AA2\u0338essLess;\uC000\u2AA1\u0338recedes\u0180;ES\u0C92\u0C93\u0C9B\u6280qual;\uC000\u2AAF\u0338lantEqual;\u62E0\u0100ei\u0CAB\u0CB9verseElement;\u620CghtTriangle\u0180;BE\u0CCB\u0CCC\u0CD2\u62EBar;\uC000\u29D0\u0338qual;\u62ED\u0100qu\u0CDD\u0D0CuareSu\u0100bp\u0CE8\u0CF9set\u0100;E\u0CF0\u0CF3\uC000\u228F\u0338qual;\u62E2erset\u0100;E\u0D03\u0D06\uC000\u2290\u0338qual;\u62E3\u0180bcp\u0D13\u0D24\u0D4Eset\u0100;E\u0D1B\u0D1E\uC000\u2282\u20D2qual;\u6288ceeds\u0200;EST\u0D32\u0D33\u0D3B\u0D46\u6281qual;\uC000\u2AB0\u0338lantEqual;\u62E1ilde;\uC000\u227F\u0338erset\u0100;E\u0D58\u0D5B\uC000\u2283\u20D2qual;\u6289ilde\u0200;EFT\u0D6E\u0D6F\u0D75\u0D7F\u6241qual;\u6244ullEqual;\u6247ilde;\u6249erticalBar;\u6224cr;\uC000\u{1D4A9}ilde\u803B\xD1\u40D1;\u439D\u0700Eacdfgmoprstuv\u0DBD\u0DC2\u0DC9\u0DD5\u0DDB\u0DE0\u0DE7\u0DFC\u0E02\u0E20\u0E22\u0E32\u0E3F\u0E44lig;\u4152cute\u803B\xD3\u40D3\u0100iy\u0DCE\u0DD3rc\u803B\xD4\u40D4;\u441Eblac;\u4150r;\uC000\u{1D512}rave\u803B\xD2\u40D2\u0180aei\u0DEE\u0DF2\u0DF6cr;\u414Cga;\u43A9cron;\u439Fpf;\uC000\u{1D546}enCurly\u0100DQ\u0E0E\u0E1AoubleQuote;\u601Cuote;\u6018;\u6A54\u0100cl\u0E27\u0E2Cr;\uC000\u{1D4AA}ash\u803B\xD8\u40D8i\u016C\u0E37\u0E3Cde\u803B\xD5\u40D5es;\u6A37ml\u803B\xD6\u40D6er\u0100BP\u0E4B\u0E60\u0100ar\u0E50\u0E53r;\u603Eac\u0100ek\u0E5A\u0E5C;\u63DEet;\u63B4arenthesis;\u63DC\u0480acfhilors\u0E7F\u0E87\u0E8A\u0E8F\u0E92\u0E94\u0E9D\u0EB0\u0EFCrtialD;\u6202y;\u441Fr;\uC000\u{1D513}i;\u43A6;\u43A0usMinus;\u40B1\u0100ip\u0EA2\u0EADncareplan\xE5\u069Df;\u6119\u0200;eio\u0EB9\u0EBA\u0EE0\u0EE4\u6ABBcedes\u0200;EST\u0EC8\u0EC9\u0ECF\u0EDA\u627Aqual;\u6AAFlantEqual;\u627Cilde;\u627Eme;\u6033\u0100dp\u0EE9\u0EEEuct;\u620Fortion\u0100;a\u0225\u0EF9l;\u621D\u0100ci\u0F01\u0F06r;\uC000\u{1D4AB};\u43A8\u0200Ufos\u0F11\u0F16\u0F1B\u0F1FOT\u803B"\u4022r;\uC000\u{1D514}pf;\u611Acr;\uC000\u{1D4AC}\u0600BEacefhiorsu\u0F3E\u0F43\u0F47\u0F60\u0F73\u0FA7\u0FAA\u0FAD\u1096\u10A9\u10B4\u10BEarr;\u6910G\u803B\xAE\u40AE\u0180cnr\u0F4E\u0F53\u0F56ute;\u4154g;\u67EBr\u0100;t\u0F5C\u0F5D\u61A0l;\u6916\u0180aey\u0F67\u0F6C\u0F71ron;\u4158dil;\u4156;\u4420\u0100;v\u0F78\u0F79\u611Cerse\u0100EU\u0F82\u0F99\u0100lq\u0F87\u0F8Eement;\u620Builibrium;\u61CBpEquilibrium;\u696Fr\xBB\u0F79o;\u43A1ght\u0400ACDFTUVa\u0FC1\u0FEB\u0FF3\u1022\u1028\u105B\u1087\u03D8\u0100nr\u0FC6\u0FD2gleBracket;\u67E9row\u0180;BL\u0FDC\u0FDD\u0FE1\u6192ar;\u61E5eftArrow;\u61C4eiling;\u6309o\u01F5\u0FF9\0\u1005bleBracket;\u67E7n\u01D4\u100A\0\u1014eeVector;\u695Dector\u0100;B\u101D\u101E\u61C2ar;\u6955loor;\u630B\u0100er\u102D\u1043e\u0180;AV\u1035\u1036\u103C\u62A2rrow;\u61A6ector;\u695Biangle\u0180;BE\u1050\u1051\u1055\u62B3ar;\u69D0qual;\u62B5p\u0180DTV\u1063\u106E\u1078ownVector;\u694FeeVector;\u695Cector\u0100;B\u1082\u1083\u61BEar;\u6954ector\u0100;B\u1091\u1092\u61C0ar;\u6953\u0100pu\u109B\u109Ef;\u611DndImplies;\u6970ightarrow;\u61DB\u0100ch\u10B9\u10BCr;\u611B;\u61B1leDelayed;\u69F4\u0680HOacfhimoqstu\u10E4\u10F1\u10F7\u10FD\u1119\u111E\u1151\u1156\u1161\u1167\u11B5\u11BB\u11BF\u0100Cc\u10E9\u10EEHcy;\u4429y;\u4428FTcy;\u442Ccute;\u415A\u0280;aeiy\u1108\u1109\u110E\u1113\u1117\u6ABCron;\u4160dil;\u415Erc;\u415C;\u4421r;\uC000\u{1D516}ort\u0200DLRU\u112A\u1134\u113E\u1149ownArrow\xBB\u041EeftArrow\xBB\u089AightArrow\xBB\u0FDDpArrow;\u6191gma;\u43A3allCircle;\u6218pf;\uC000\u{1D54A}\u0272\u116D\0\0\u1170t;\u621Aare\u0200;ISU\u117B\u117C\u1189\u11AF\u65A1ntersection;\u6293u\u0100bp\u118F\u119Eset\u0100;E\u1197\u1198\u628Fqual;\u6291erset\u0100;E\u11A8\u11A9\u6290qual;\u6292nion;\u6294cr;\uC000\u{1D4AE}ar;\u62C6\u0200bcmp\u11C8\u11DB\u1209\u120B\u0100;s\u11CD\u11CE\u62D0et\u0100;E\u11CD\u11D5qual;\u6286\u0100ch\u11E0\u1205eeds\u0200;EST\u11ED\u11EE\u11F4\u11FF\u627Bqual;\u6AB0lantEqual;\u627Dilde;\u627FTh\xE1\u0F8C;\u6211\u0180;es\u1212\u1213\u1223\u62D1rset\u0100;E\u121C\u121D\u6283qual;\u6287et\xBB\u1213\u0580HRSacfhiors\u123E\u1244\u1249\u1255\u125E\u1271\u1276\u129F\u12C2\u12C8\u12D1ORN\u803B\xDE\u40DEADE;\u6122\u0100Hc\u124E\u1252cy;\u440By;\u4426\u0100bu\u125A\u125C;\u4009;\u43A4\u0180aey\u1265\u126A\u126Fron;\u4164dil;\u4162;\u4422r;\uC000\u{1D517}\u0100ei\u127B\u1289\u01F2\u1280\0\u1287efore;\u6234a;\u4398\u0100cn\u128E\u1298kSpace;\uC000\u205F\u200ASpace;\u6009lde\u0200;EFT\u12AB\u12AC\u12B2\u12BC\u623Cqual;\u6243ullEqual;\u6245ilde;\u6248pf;\uC000\u{1D54B}ipleDot;\u60DB\u0100ct\u12D6\u12DBr;\uC000\u{1D4AF}rok;\u4166\u0AE1\u12F7\u130E\u131A\u1326\0\u132C\u1331\0\0\0\0\0\u1338\u133D\u1377\u1385\0\u13FF\u1404\u140A\u1410\u0100cr\u12FB\u1301ute\u803B\xDA\u40DAr\u0100;o\u1307\u1308\u619Fcir;\u6949r\u01E3\u1313\0\u1316y;\u440Eve;\u416C\u0100iy\u131E\u1323rc\u803B\xDB\u40DB;\u4423blac;\u4170r;\uC000\u{1D518}rave\u803B\xD9\u40D9acr;\u416A\u0100di\u1341\u1369er\u0100BP\u1348\u135D\u0100ar\u134D\u1350r;\u405Fac\u0100ek\u1357\u1359;\u63DFet;\u63B5arenthesis;\u63DDon\u0100;P\u1370\u1371\u62C3lus;\u628E\u0100gp\u137B\u137Fon;\u4172f;\uC000\u{1D54C}\u0400ADETadps\u1395\u13AE\u13B8\u13C4\u03E8\u13D2\u13D7\u13F3rrow\u0180;BD\u1150\u13A0\u13A4ar;\u6912ownArrow;\u61C5ownArrow;\u6195quilibrium;\u696Eee\u0100;A\u13CB\u13CC\u62A5rrow;\u61A5own\xE1\u03F3er\u0100LR\u13DE\u13E8eftArrow;\u6196ightArrow;\u6197i\u0100;l\u13F9\u13FA\u43D2on;\u43A5ing;\u416Ecr;\uC000\u{1D4B0}ilde;\u4168ml\u803B\xDC\u40DC\u0480Dbcdefosv\u1427\u142C\u1430\u1433\u143E\u1485\u148A\u1490\u1496ash;\u62ABar;\u6AEBy;\u4412ash\u0100;l\u143B\u143C\u62A9;\u6AE6\u0100er\u1443\u1445;\u62C1\u0180bty\u144C\u1450\u147Aar;\u6016\u0100;i\u144F\u1455cal\u0200BLST\u1461\u1465\u146A\u1474ar;\u6223ine;\u407Ceparator;\u6758ilde;\u6240ThinSpace;\u600Ar;\uC000\u{1D519}pf;\uC000\u{1D54D}cr;\uC000\u{1D4B1}dash;\u62AA\u0280cefos\u14A7\u14AC\u14B1\u14B6\u14BCirc;\u4174dge;\u62C0r;\uC000\u{1D51A}pf;\uC000\u{1D54E}cr;\uC000\u{1D4B2}\u0200fios\u14CB\u14D0\u14D2\u14D8r;\uC000\u{1D51B};\u439Epf;\uC000\u{1D54F}cr;\uC000\u{1D4B3}\u0480AIUacfosu\u14F1\u14F5\u14F9\u14FD\u1504\u150F\u1514\u151A\u1520cy;\u442Fcy;\u4407cy;\u442Ecute\u803B\xDD\u40DD\u0100iy\u1509\u150Drc;\u4176;\u442Br;\uC000\u{1D51C}pf;\uC000\u{1D550}cr;\uC000\u{1D4B4}ml;\u4178\u0400Hacdefos\u1535\u1539\u153F\u154B\u154F\u155D\u1560\u1564cy;\u4416cute;\u4179\u0100ay\u1544\u1549ron;\u417D;\u4417ot;\u417B\u01F2\u1554\0\u155BoWidt\xE8\u0AD9a;\u4396r;\u6128pf;\u6124cr;\uC000\u{1D4B5}\u0BE1\u1583\u158A\u1590\0\u15B0\u15B6\u15BF\0\0\0\0\u15C6\u15DB\u15EB\u165F\u166D\0\u1695\u169B\u16B2\u16B9\0\u16BEcute\u803B\xE1\u40E1reve;\u4103\u0300;Ediuy\u159C\u159D\u15A1\u15A3\u15A8\u15AD\u623E;\uC000\u223E\u0333;\u623Frc\u803B\xE2\u40E2te\u80BB\xB4\u0306;\u4430lig\u803B\xE6\u40E6\u0100;r\xB2\u15BA;\uC000\u{1D51E}rave\u803B\xE0\u40E0\u0100ep\u15CA\u15D6\u0100fp\u15CF\u15D4sym;\u6135\xE8\u15D3ha;\u43B1\u0100ap\u15DFc\u0100cl\u15E4\u15E7r;\u4101g;\u6A3F\u0264\u15F0\0\0\u160A\u0280;adsv\u15FA\u15FB\u15FF\u1601\u1607\u6227nd;\u6A55;\u6A5Clope;\u6A58;\u6A5A\u0380;elmrsz\u1618\u1619\u161B\u161E\u163F\u164F\u1659\u6220;\u69A4e\xBB\u1619sd\u0100;a\u1625\u1626\u6221\u0461\u1630\u1632\u1634\u1636\u1638\u163A\u163C\u163E;\u69A8;\u69A9;\u69AA;\u69AB;\u69AC;\u69AD;\u69AE;\u69AFt\u0100;v\u1645\u1646\u621Fb\u0100;d\u164C\u164D\u62BE;\u699D\u0100pt\u1654\u1657h;\u6222\xBB\xB9arr;\u637C\u0100gp\u1663\u1667on;\u4105f;\uC000\u{1D552}\u0380;Eaeiop\u12C1\u167B\u167D\u1682\u1684\u1687\u168A;\u6A70cir;\u6A6F;\u624Ad;\u624Bs;\u4027rox\u0100;e\u12C1\u1692\xF1\u1683ing\u803B\xE5\u40E5\u0180cty\u16A1\u16A6\u16A8r;\uC000\u{1D4B6};\u402Amp\u0100;e\u12C1\u16AF\xF1\u0288ilde\u803B\xE3\u40E3ml\u803B\xE4\u40E4\u0100ci\u16C2\u16C8onin\xF4\u0272nt;\u6A11\u0800Nabcdefiklnoprsu\u16ED\u16F1\u1730\u173C\u1743\u1748\u1778\u177D\u17E0\u17E6\u1839\u1850\u170D\u193D\u1948\u1970ot;\u6AED\u0100cr\u16F6\u171Ek\u0200ceps\u1700\u1705\u170D\u1713ong;\u624Cpsilon;\u43F6rime;\u6035im\u0100;e\u171A\u171B\u623Dq;\u62CD\u0176\u1722\u1726ee;\u62BDed\u0100;g\u172C\u172D\u6305e\xBB\u172Drk\u0100;t\u135C\u1737brk;\u63B6\u0100oy\u1701\u1741;\u4431quo;\u601E\u0280cmprt\u1753\u175B\u1761\u1764\u1768aus\u0100;e\u010A\u0109ptyv;\u69B0s\xE9\u170Cno\xF5\u0113\u0180ahw\u176F\u1771\u1773;\u43B2;\u6136een;\u626Cr;\uC000\u{1D51F}g\u0380costuvw\u178D\u179D\u17B3\u17C1\u17D5\u17DB\u17DE\u0180aiu\u1794\u1796\u179A\xF0\u0760rc;\u65EFp\xBB\u1371\u0180dpt\u17A4\u17A8\u17ADot;\u6A00lus;\u6A01imes;\u6A02\u0271\u17B9\0\0\u17BEcup;\u6A06ar;\u6605riangle\u0100du\u17CD\u17D2own;\u65BDp;\u65B3plus;\u6A04e\xE5\u1444\xE5\u14ADarow;\u690D\u0180ako\u17ED\u1826\u1835\u0100cn\u17F2\u1823k\u0180lst\u17FA\u05AB\u1802ozenge;\u69EBriangle\u0200;dlr\u1812\u1813\u1818\u181D\u65B4own;\u65BEeft;\u65C2ight;\u65B8k;\u6423\u01B1\u182B\0\u1833\u01B2\u182F\0\u1831;\u6592;\u65914;\u6593ck;\u6588\u0100eo\u183E\u184D\u0100;q\u1843\u1846\uC000=\u20E5uiv;\uC000\u2261\u20E5t;\u6310\u0200ptwx\u1859\u185E\u1867\u186Cf;\uC000\u{1D553}\u0100;t\u13CB\u1863om\xBB\u13CCtie;\u62C8\u0600DHUVbdhmptuv\u1885\u1896\u18AA\u18BB\u18D7\u18DB\u18EC\u18FF\u1905\u190A\u1910\u1921\u0200LRlr\u188E\u1890\u1892\u1894;\u6557;\u6554;\u6556;\u6553\u0280;DUdu\u18A1\u18A2\u18A4\u18A6\u18A8\u6550;\u6566;\u6569;\u6564;\u6567\u0200LRlr\u18B3\u18B5\u18B7\u18B9;\u655D;\u655A;\u655C;\u6559\u0380;HLRhlr\u18CA\u18CB\u18CD\u18CF\u18D1\u18D3\u18D5\u6551;\u656C;\u6563;\u6560;\u656B;\u6562;\u655Fox;\u69C9\u0200LRlr\u18E4\u18E6\u18E8\u18EA;\u6555;\u6552;\u6510;\u650C\u0280;DUdu\u06BD\u18F7\u18F9\u18FB\u18FD;\u6565;\u6568;\u652C;\u6534inus;\u629Flus;\u629Eimes;\u62A0\u0200LRlr\u1919\u191B\u191D\u191F;\u655B;\u6558;\u6518;\u6514\u0380;HLRhlr\u1930\u1931\u1933\u1935\u1937\u1939\u193B\u6502;\u656A;\u6561;\u655E;\u653C;\u6524;\u651C\u0100ev\u0123\u1942bar\u803B\xA6\u40A6\u0200ceio\u1951\u1956\u195A\u1960r;\uC000\u{1D4B7}mi;\u604Fm\u0100;e\u171A\u171Cl\u0180;bh\u1968\u1969\u196B\u405C;\u69C5sub;\u67C8\u016C\u1974\u197El\u0100;e\u1979\u197A\u6022t\xBB\u197Ap\u0180;Ee\u012F\u1985\u1987;\u6AAE\u0100;q\u06DC\u06DB\u0CE1\u19A7\0\u19E8\u1A11\u1A15\u1A32\0\u1A37\u1A50\0\0\u1AB4\0\0\u1AC1\0\0\u1B21\u1B2E\u1B4D\u1B52\0\u1BFD\0\u1C0C\u0180cpr\u19AD\u19B2\u19DDute;\u4107\u0300;abcds\u19BF\u19C0\u19C4\u19CA\u19D5\u19D9\u6229nd;\u6A44rcup;\u6A49\u0100au\u19CF\u19D2p;\u6A4Bp;\u6A47ot;\u6A40;\uC000\u2229\uFE00\u0100eo\u19E2\u19E5t;\u6041\xEE\u0693\u0200aeiu\u19F0\u19FB\u1A01\u1A05\u01F0\u19F5\0\u19F8s;\u6A4Don;\u410Ddil\u803B\xE7\u40E7rc;\u4109ps\u0100;s\u1A0C\u1A0D\u6A4Cm;\u6A50ot;\u410B\u0180dmn\u1A1B\u1A20\u1A26il\u80BB\xB8\u01ADptyv;\u69B2t\u8100\xA2;e\u1A2D\u1A2E\u40A2r\xE4\u01B2r;\uC000\u{1D520}\u0180cei\u1A3D\u1A40\u1A4Dy;\u4447ck\u0100;m\u1A47\u1A48\u6713ark\xBB\u1A48;\u43C7r\u0380;Ecefms\u1A5F\u1A60\u1A62\u1A6B\u1AA4\u1AAA\u1AAE\u65CB;\u69C3\u0180;el\u1A69\u1A6A\u1A6D\u42C6q;\u6257e\u0261\u1A74\0\0\u1A88rrow\u0100lr\u1A7C\u1A81eft;\u61BAight;\u61BB\u0280RSacd\u1A92\u1A94\u1A96\u1A9A\u1A9F\xBB\u0F47;\u64C8st;\u629Birc;\u629Aash;\u629Dnint;\u6A10id;\u6AEFcir;\u69C2ubs\u0100;u\u1ABB\u1ABC\u6663it\xBB\u1ABC\u02EC\u1AC7\u1AD4\u1AFA\0\u1B0Aon\u0100;e\u1ACD\u1ACE\u403A\u0100;q\xC7\xC6\u026D\u1AD9\0\0\u1AE2a\u0100;t\u1ADE\u1ADF\u402C;\u4040\u0180;fl\u1AE8\u1AE9\u1AEB\u6201\xEE\u1160e\u0100mx\u1AF1\u1AF6ent\xBB\u1AE9e\xF3\u024D\u01E7\u1AFE\0\u1B07\u0100;d\u12BB\u1B02ot;\u6A6Dn\xF4\u0246\u0180fry\u1B10\u1B14\u1B17;\uC000\u{1D554}o\xE4\u0254\u8100\xA9;s\u0155\u1B1Dr;\u6117\u0100ao\u1B25\u1B29rr;\u61B5ss;\u6717\u0100cu\u1B32\u1B37r;\uC000\u{1D4B8}\u0100bp\u1B3C\u1B44\u0100;e\u1B41\u1B42\u6ACF;\u6AD1\u0100;e\u1B49\u1B4A\u6AD0;\u6AD2dot;\u62EF\u0380delprvw\u1B60\u1B6C\u1B77\u1B82\u1BAC\u1BD4\u1BF9arr\u0100lr\u1B68\u1B6A;\u6938;\u6935\u0270\u1B72\0\0\u1B75r;\u62DEc;\u62DFarr\u0100;p\u1B7F\u1B80\u61B6;\u693D\u0300;bcdos\u1B8F\u1B90\u1B96\u1BA1\u1BA5\u1BA8\u622Arcap;\u6A48\u0100au\u1B9B\u1B9Ep;\u6A46p;\u6A4Aot;\u628Dr;\u6A45;\uC000\u222A\uFE00\u0200alrv\u1BB5\u1BBF\u1BDE\u1BE3rr\u0100;m\u1BBC\u1BBD\u61B7;\u693Cy\u0180evw\u1BC7\u1BD4\u1BD8q\u0270\u1BCE\0\0\u1BD2re\xE3\u1B73u\xE3\u1B75ee;\u62CEedge;\u62CFen\u803B\xA4\u40A4earrow\u0100lr\u1BEE\u1BF3eft\xBB\u1B80ight\xBB\u1BBDe\xE4\u1BDD\u0100ci\u1C01\u1C07onin\xF4\u01F7nt;\u6231lcty;\u632D\u0980AHabcdefhijlorstuwz\u1C38\u1C3B\u1C3F\u1C5D\u1C69\u1C75\u1C8A\u1C9E\u1CAC\u1CB7\u1CFB\u1CFF\u1D0D\u1D7B\u1D91\u1DAB\u1DBB\u1DC6\u1DCDr\xF2\u0381ar;\u6965\u0200glrs\u1C48\u1C4D\u1C52\u1C54ger;\u6020eth;\u6138\xF2\u1133h\u0100;v\u1C5A\u1C5B\u6010\xBB\u090A\u016B\u1C61\u1C67arow;\u690Fa\xE3\u0315\u0100ay\u1C6E\u1C73ron;\u410F;\u4434\u0180;ao\u0332\u1C7C\u1C84\u0100gr\u02BF\u1C81r;\u61CAtseq;\u6A77\u0180glm\u1C91\u1C94\u1C98\u803B\xB0\u40B0ta;\u43B4ptyv;\u69B1\u0100ir\u1CA3\u1CA8sht;\u697F;\uC000\u{1D521}ar\u0100lr\u1CB3\u1CB5\xBB\u08DC\xBB\u101E\u0280aegsv\u1CC2\u0378\u1CD6\u1CDC\u1CE0m\u0180;os\u0326\u1CCA\u1CD4nd\u0100;s\u0326\u1CD1uit;\u6666amma;\u43DDin;\u62F2\u0180;io\u1CE7\u1CE8\u1CF8\u40F7de\u8100\xF7;o\u1CE7\u1CF0ntimes;\u62C7n\xF8\u1CF7cy;\u4452c\u026F\u1D06\0\0\u1D0Arn;\u631Eop;\u630D\u0280lptuw\u1D18\u1D1D\u1D22\u1D49\u1D55lar;\u4024f;\uC000\u{1D555}\u0280;emps\u030B\u1D2D\u1D37\u1D3D\u1D42q\u0100;d\u0352\u1D33ot;\u6251inus;\u6238lus;\u6214quare;\u62A1blebarwedg\xE5\xFAn\u0180adh\u112E\u1D5D\u1D67ownarrow\xF3\u1C83arpoon\u0100lr\u1D72\u1D76ef\xF4\u1CB4igh\xF4\u1CB6\u0162\u1D7F\u1D85karo\xF7\u0F42\u026F\u1D8A\0\0\u1D8Ern;\u631Fop;\u630C\u0180cot\u1D98\u1DA3\u1DA6\u0100ry\u1D9D\u1DA1;\uC000\u{1D4B9};\u4455l;\u69F6rok;\u4111\u0100dr\u1DB0\u1DB4ot;\u62F1i\u0100;f\u1DBA\u1816\u65BF\u0100ah\u1DC0\u1DC3r\xF2\u0429a\xF2\u0FA6angle;\u69A6\u0100ci\u1DD2\u1DD5y;\u445Fgrarr;\u67FF\u0900Dacdefglmnopqrstux\u1E01\u1E09\u1E19\u1E38\u0578\u1E3C\u1E49\u1E61\u1E7E\u1EA5\u1EAF\u1EBD\u1EE1\u1F2A\u1F37\u1F44\u1F4E\u1F5A\u0100Do\u1E06\u1D34o\xF4\u1C89\u0100cs\u1E0E\u1E14ute\u803B\xE9\u40E9ter;\u6A6E\u0200aioy\u1E22\u1E27\u1E31\u1E36ron;\u411Br\u0100;c\u1E2D\u1E2E\u6256\u803B\xEA\u40EAlon;\u6255;\u444Dot;\u4117\u0100Dr\u1E41\u1E45ot;\u6252;\uC000\u{1D522}\u0180;rs\u1E50\u1E51\u1E57\u6A9Aave\u803B\xE8\u40E8\u0100;d\u1E5C\u1E5D\u6A96ot;\u6A98\u0200;ils\u1E6A\u1E6B\u1E72\u1E74\u6A99nters;\u63E7;\u6113\u0100;d\u1E79\u1E7A\u6A95ot;\u6A97\u0180aps\u1E85\u1E89\u1E97cr;\u4113ty\u0180;sv\u1E92\u1E93\u1E95\u6205et\xBB\u1E93p\u01001;\u1E9D\u1EA4\u0133\u1EA1\u1EA3;\u6004;\u6005\u6003\u0100gs\u1EAA\u1EAC;\u414Bp;\u6002\u0100gp\u1EB4\u1EB8on;\u4119f;\uC000\u{1D556}\u0180als\u1EC4\u1ECE\u1ED2r\u0100;s\u1ECA\u1ECB\u62D5l;\u69E3us;\u6A71i\u0180;lv\u1EDA\u1EDB\u1EDF\u43B5on\xBB\u1EDB;\u43F5\u0200csuv\u1EEA\u1EF3\u1F0B\u1F23\u0100io\u1EEF\u1E31rc\xBB\u1E2E\u0269\u1EF9\0\0\u1EFB\xED\u0548ant\u0100gl\u1F02\u1F06tr\xBB\u1E5Dess\xBB\u1E7A\u0180aei\u1F12\u1F16\u1F1Als;\u403Dst;\u625Fv\u0100;D\u0235\u1F20D;\u6A78parsl;\u69E5\u0100Da\u1F2F\u1F33ot;\u6253rr;\u6971\u0180cdi\u1F3E\u1F41\u1EF8r;\u612Fo\xF4\u0352\u0100ah\u1F49\u1F4B;\u43B7\u803B\xF0\u40F0\u0100mr\u1F53\u1F57l\u803B\xEB\u40EBo;\u60AC\u0180cip\u1F61\u1F64\u1F67l;\u4021s\xF4\u056E\u0100eo\u1F6C\u1F74ctatio\xEE\u0559nential\xE5\u0579\u09E1\u1F92\0\u1F9E\0\u1FA1\u1FA7\0\0\u1FC6\u1FCC\0\u1FD3\0\u1FE6\u1FEA\u2000\0\u2008\u205Allingdotse\xF1\u1E44y;\u4444male;\u6640\u0180ilr\u1FAD\u1FB3\u1FC1lig;\u8000\uFB03\u0269\u1FB9\0\0\u1FBDg;\u8000\uFB00ig;\u8000\uFB04;\uC000\u{1D523}lig;\u8000\uFB01lig;\uC000fj\u0180alt\u1FD9\u1FDC\u1FE1t;\u666Dig;\u8000\uFB02ns;\u65B1of;\u4192\u01F0\u1FEE\0\u1FF3f;\uC000\u{1D557}\u0100ak\u05BF\u1FF7\u0100;v\u1FFC\u1FFD\u62D4;\u6AD9artint;\u6A0D\u0100ao\u200C\u2055\u0100cs\u2011\u2052\u03B1\u201A\u2030\u2038\u2045\u2048\0\u2050\u03B2\u2022\u2025\u2027\u202A\u202C\0\u202E\u803B\xBD\u40BD;\u6153\u803B\xBC\u40BC;\u6155;\u6159;\u615B\u01B3\u2034\0\u2036;\u6154;\u6156\u02B4\u203E\u2041\0\0\u2043\u803B\xBE\u40BE;\u6157;\u615C5;\u6158\u01B6\u204C\0\u204E;\u615A;\u615D8;\u615El;\u6044wn;\u6322cr;\uC000\u{1D4BB}\u0880Eabcdefgijlnorstv\u2082\u2089\u209F\u20A5\u20B0\u20B4\u20F0\u20F5\u20FA\u20FF\u2103\u2112\u2138\u0317\u213E\u2152\u219E\u0100;l\u064D\u2087;\u6A8C\u0180cmp\u2090\u2095\u209Dute;\u41F5ma\u0100;d\u209C\u1CDA\u43B3;\u6A86reve;\u411F\u0100iy\u20AA\u20AErc;\u411D;\u4433ot;\u4121\u0200;lqs\u063E\u0642\u20BD\u20C9\u0180;qs\u063E\u064C\u20C4lan\xF4\u0665\u0200;cdl\u0665\u20D2\u20D5\u20E5c;\u6AA9ot\u0100;o\u20DC\u20DD\u6A80\u0100;l\u20E2\u20E3\u6A82;\u6A84\u0100;e\u20EA\u20ED\uC000\u22DB\uFE00s;\u6A94r;\uC000\u{1D524}\u0100;g\u0673\u061Bmel;\u6137cy;\u4453\u0200;Eaj\u065A\u210C\u210E\u2110;\u6A92;\u6AA5;\u6AA4\u0200Eaes\u211B\u211D\u2129\u2134;\u6269p\u0100;p\u2123\u2124\u6A8Arox\xBB\u2124\u0100;q\u212E\u212F\u6A88\u0100;q\u212E\u211Bim;\u62E7pf;\uC000\u{1D558}\u0100ci\u2143\u2146r;\u610Am\u0180;el\u066B\u214E\u2150;\u6A8E;\u6A90\u8300>;cdlqr\u05EE\u2160\u216A\u216E\u2173\u2179\u0100ci\u2165\u2167;\u6AA7r;\u6A7Aot;\u62D7Par;\u6995uest;\u6A7C\u0280adels\u2184\u216A\u2190\u0656\u219B\u01F0\u2189\0\u218Epro\xF8\u209Er;\u6978q\u0100lq\u063F\u2196les\xF3\u2088i\xED\u066B\u0100en\u21A3\u21ADrtneqq;\uC000\u2269\uFE00\xC5\u21AA\u0500Aabcefkosy\u21C4\u21C7\u21F1\u21F5\u21FA\u2218\u221D\u222F\u2268\u227Dr\xF2\u03A0\u0200ilmr\u21D0\u21D4\u21D7\u21DBrs\xF0\u1484f\xBB\u2024il\xF4\u06A9\u0100dr\u21E0\u21E4cy;\u444A\u0180;cw\u08F4\u21EB\u21EFir;\u6948;\u61ADar;\u610Firc;\u4125\u0180alr\u2201\u220E\u2213rts\u0100;u\u2209\u220A\u6665it\xBB\u220Alip;\u6026con;\u62B9r;\uC000\u{1D525}s\u0100ew\u2223\u2229arow;\u6925arow;\u6926\u0280amopr\u223A\u223E\u2243\u225E\u2263rr;\u61FFtht;\u623Bk\u0100lr\u2249\u2253eftarrow;\u61A9ightarrow;\u61AAf;\uC000\u{1D559}bar;\u6015\u0180clt\u226F\u2274\u2278r;\uC000\u{1D4BD}as\xE8\u21F4rok;\u4127\u0100bp\u2282\u2287ull;\u6043hen\xBB\u1C5B\u0AE1\u22A3\0\u22AA\0\u22B8\u22C5\u22CE\0\u22D5\u22F3\0\0\u22F8\u2322\u2367\u2362\u237F\0\u2386\u23AA\u23B4cute\u803B\xED\u40ED\u0180;iy\u0771\u22B0\u22B5rc\u803B\xEE\u40EE;\u4438\u0100cx\u22BC\u22BFy;\u4435cl\u803B\xA1\u40A1\u0100fr\u039F\u22C9;\uC000\u{1D526}rave\u803B\xEC\u40EC\u0200;ino\u073E\u22DD\u22E9\u22EE\u0100in\u22E2\u22E6nt;\u6A0Ct;\u622Dfin;\u69DCta;\u6129lig;\u4133\u0180aop\u22FE\u231A\u231D\u0180cgt\u2305\u2308\u2317r;\u412B\u0180elp\u071F\u230F\u2313in\xE5\u078Ear\xF4\u0720h;\u4131f;\u62B7ed;\u41B5\u0280;cfot\u04F4\u232C\u2331\u233D\u2341are;\u6105in\u0100;t\u2338\u2339\u621Eie;\u69DDdo\xF4\u2319\u0280;celp\u0757\u234C\u2350\u235B\u2361al;\u62BA\u0100gr\u2355\u2359er\xF3\u1563\xE3\u234Darhk;\u6A17rod;\u6A3C\u0200cgpt\u236F\u2372\u2376\u237By;\u4451on;\u412Ff;\uC000\u{1D55A}a;\u43B9uest\u803B\xBF\u40BF\u0100ci\u238A\u238Fr;\uC000\u{1D4BE}n\u0280;Edsv\u04F4\u239B\u239D\u23A1\u04F3;\u62F9ot;\u62F5\u0100;v\u23A6\u23A7\u62F4;\u62F3\u0100;i\u0777\u23AElde;\u4129\u01EB\u23B8\0\u23BCcy;\u4456l\u803B\xEF\u40EF\u0300cfmosu\u23CC\u23D7\u23DC\u23E1\u23E7\u23F5\u0100iy\u23D1\u23D5rc;\u4135;\u4439r;\uC000\u{1D527}ath;\u4237pf;\uC000\u{1D55B}\u01E3\u23EC\0\u23F1r;\uC000\u{1D4BF}rcy;\u4458kcy;\u4454\u0400acfghjos\u240B\u2416\u2422\u2427\u242D\u2431\u2435\u243Bppa\u0100;v\u2413\u2414\u43BA;\u43F0\u0100ey\u241B\u2420dil;\u4137;\u443Ar;\uC000\u{1D528}reen;\u4138cy;\u4445cy;\u445Cpf;\uC000\u{1D55C}cr;\uC000\u{1D4C0}\u0B80ABEHabcdefghjlmnoprstuv\u2470\u2481\u2486\u248D\u2491\u250E\u253D\u255A\u2580\u264E\u265E\u2665\u2679\u267D\u269A\u26B2\u26D8\u275D\u2768\u278B\u27C0\u2801\u2812\u0180art\u2477\u247A\u247Cr\xF2\u09C6\xF2\u0395ail;\u691Barr;\u690E\u0100;g\u0994\u248B;\u6A8Bar;\u6962\u0963\u24A5\0\u24AA\0\u24B1\0\0\0\0\0\u24B5\u24BA\0\u24C6\u24C8\u24CD\0\u24F9ute;\u413Amptyv;\u69B4ra\xEE\u084Cbda;\u43BBg\u0180;dl\u088E\u24C1\u24C3;\u6991\xE5\u088E;\u6A85uo\u803B\xAB\u40ABr\u0400;bfhlpst\u0899\u24DE\u24E6\u24E9\u24EB\u24EE\u24F1\u24F5\u0100;f\u089D\u24E3s;\u691Fs;\u691D\xEB\u2252p;\u61ABl;\u6939im;\u6973l;\u61A2\u0180;ae\u24FF\u2500\u2504\u6AABil;\u6919\u0100;s\u2509\u250A\u6AAD;\uC000\u2AAD\uFE00\u0180abr\u2515\u2519\u251Drr;\u690Crk;\u6772\u0100ak\u2522\u252Cc\u0100ek\u2528\u252A;\u407B;\u405B\u0100es\u2531\u2533;\u698Bl\u0100du\u2539\u253B;\u698F;\u698D\u0200aeuy\u2546\u254B\u2556\u2558ron;\u413E\u0100di\u2550\u2554il;\u413C\xEC\u08B0\xE2\u2529;\u443B\u0200cqrs\u2563\u2566\u256D\u257Da;\u6936uo\u0100;r\u0E19\u1746\u0100du\u2572\u2577har;\u6967shar;\u694Bh;\u61B2\u0280;fgqs\u258B\u258C\u0989\u25F3\u25FF\u6264t\u0280ahlrt\u2598\u25A4\u25B7\u25C2\u25E8rrow\u0100;t\u0899\u25A1a\xE9\u24F6arpoon\u0100du\u25AF\u25B4own\xBB\u045Ap\xBB\u0966eftarrows;\u61C7ight\u0180ahs\u25CD\u25D6\u25DErrow\u0100;s\u08F4\u08A7arpoon\xF3\u0F98quigarro\xF7\u21F0hreetimes;\u62CB\u0180;qs\u258B\u0993\u25FAlan\xF4\u09AC\u0280;cdgs\u09AC\u260A\u260D\u261D\u2628c;\u6AA8ot\u0100;o\u2614\u2615\u6A7F\u0100;r\u261A\u261B\u6A81;\u6A83\u0100;e\u2622\u2625\uC000\u22DA\uFE00s;\u6A93\u0280adegs\u2633\u2639\u263D\u2649\u264Bppro\xF8\u24C6ot;\u62D6q\u0100gq\u2643\u2645\xF4\u0989gt\xF2\u248C\xF4\u099Bi\xED\u09B2\u0180ilr\u2655\u08E1\u265Asht;\u697C;\uC000\u{1D529}\u0100;E\u099C\u2663;\u6A91\u0161\u2669\u2676r\u0100du\u25B2\u266E\u0100;l\u0965\u2673;\u696Alk;\u6584cy;\u4459\u0280;acht\u0A48\u2688\u268B\u2691\u2696r\xF2\u25C1orne\xF2\u1D08ard;\u696Bri;\u65FA\u0100io\u269F\u26A4dot;\u4140ust\u0100;a\u26AC\u26AD\u63B0che\xBB\u26AD\u0200Eaes\u26BB\u26BD\u26C9\u26D4;\u6268p\u0100;p\u26C3\u26C4\u6A89rox\xBB\u26C4\u0100;q\u26CE\u26CF\u6A87\u0100;q\u26CE\u26BBim;\u62E6\u0400abnoptwz\u26E9\u26F4\u26F7\u271A\u272F\u2741\u2747\u2750\u0100nr\u26EE\u26F1g;\u67ECr;\u61FDr\xEB\u08C1g\u0180lmr\u26FF\u270D\u2714eft\u0100ar\u09E6\u2707ight\xE1\u09F2apsto;\u67FCight\xE1\u09FDparrow\u0100lr\u2725\u2729ef\xF4\u24EDight;\u61AC\u0180afl\u2736\u2739\u273Dr;\u6985;\uC000\u{1D55D}us;\u6A2Dimes;\u6A34\u0161\u274B\u274Fst;\u6217\xE1\u134E\u0180;ef\u2757\u2758\u1800\u65CAnge\xBB\u2758ar\u0100;l\u2764\u2765\u4028t;\u6993\u0280achmt\u2773\u2776\u277C\u2785\u2787r\xF2\u08A8orne\xF2\u1D8Car\u0100;d\u0F98\u2783;\u696D;\u600Eri;\u62BF\u0300achiqt\u2798\u279D\u0A40\u27A2\u27AE\u27BBquo;\u6039r;\uC000\u{1D4C1}m\u0180;eg\u09B2\u27AA\u27AC;\u6A8D;\u6A8F\u0100bu\u252A\u27B3o\u0100;r\u0E1F\u27B9;\u601Arok;\u4142\u8400<;cdhilqr\u082B\u27D2\u2639\u27DC\u27E0\u27E5\u27EA\u27F0\u0100ci\u27D7\u27D9;\u6AA6r;\u6A79re\xE5\u25F2mes;\u62C9arr;\u6976uest;\u6A7B\u0100Pi\u27F5\u27F9ar;\u6996\u0180;ef\u2800\u092D\u181B\u65C3r\u0100du\u2807\u280Dshar;\u694Ahar;\u6966\u0100en\u2817\u2821rtneqq;\uC000\u2268\uFE00\xC5\u281E\u0700Dacdefhilnopsu\u2840\u2845\u2882\u288E\u2893\u28A0\u28A5\u28A8\u28DA\u28E2\u28E4\u0A83\u28F3\u2902Dot;\u623A\u0200clpr\u284E\u2852\u2863\u287Dr\u803B\xAF\u40AF\u0100et\u2857\u2859;\u6642\u0100;e\u285E\u285F\u6720se\xBB\u285F\u0100;s\u103B\u2868to\u0200;dlu\u103B\u2873\u2877\u287Bow\xEE\u048Cef\xF4\u090F\xF0\u13D1ker;\u65AE\u0100oy\u2887\u288Cmma;\u6A29;\u443Cash;\u6014asuredangle\xBB\u1626r;\uC000\u{1D52A}o;\u6127\u0180cdn\u28AF\u28B4\u28C9ro\u803B\xB5\u40B5\u0200;acd\u1464\u28BD\u28C0\u28C4s\xF4\u16A7ir;\u6AF0ot\u80BB\xB7\u01B5us\u0180;bd\u28D2\u1903\u28D3\u6212\u0100;u\u1D3C\u28D8;\u6A2A\u0163\u28DE\u28E1p;\u6ADB\xF2\u2212\xF0\u0A81\u0100dp\u28E9\u28EEels;\u62A7f;\uC000\u{1D55E}\u0100ct\u28F8\u28FDr;\uC000\u{1D4C2}pos\xBB\u159D\u0180;lm\u2909\u290A\u290D\u43BCtimap;\u62B8\u0C00GLRVabcdefghijlmoprstuvw\u2942\u2953\u297E\u2989\u2998\u29DA\u29E9\u2A15\u2A1A\u2A58\u2A5D\u2A83\u2A95\u2AA4\u2AA8\u2B04\u2B07\u2B44\u2B7F\u2BAE\u2C34\u2C67\u2C7C\u2CE9\u0100gt\u2947\u294B;\uC000\u22D9\u0338\u0100;v\u2950\u0BCF\uC000\u226B\u20D2\u0180elt\u295A\u2972\u2976ft\u0100ar\u2961\u2967rrow;\u61CDightarrow;\u61CE;\uC000\u22D8\u0338\u0100;v\u297B\u0C47\uC000\u226A\u20D2ightarrow;\u61CF\u0100Dd\u298E\u2993ash;\u62AFash;\u62AE\u0280bcnpt\u29A3\u29A7\u29AC\u29B1\u29CCla\xBB\u02DEute;\u4144g;\uC000\u2220\u20D2\u0280;Eiop\u0D84\u29BC\u29C0\u29C5\u29C8;\uC000\u2A70\u0338d;\uC000\u224B\u0338s;\u4149ro\xF8\u0D84ur\u0100;a\u29D3\u29D4\u666El\u0100;s\u29D3\u0B38\u01F3\u29DF\0\u29E3p\u80BB\xA0\u0B37mp\u0100;e\u0BF9\u0C00\u0280aeouy\u29F4\u29FE\u2A03\u2A10\u2A13\u01F0\u29F9\0\u29FB;\u6A43on;\u4148dil;\u4146ng\u0100;d\u0D7E\u2A0Aot;\uC000\u2A6D\u0338p;\u6A42;\u443Dash;\u6013\u0380;Aadqsx\u0B92\u2A29\u2A2D\u2A3B\u2A41\u2A45\u2A50rr;\u61D7r\u0100hr\u2A33\u2A36k;\u6924\u0100;o\u13F2\u13F0ot;\uC000\u2250\u0338ui\xF6\u0B63\u0100ei\u2A4A\u2A4Ear;\u6928\xED\u0B98ist\u0100;s\u0BA0\u0B9Fr;\uC000\u{1D52B}\u0200Eest\u0BC5\u2A66\u2A79\u2A7C\u0180;qs\u0BBC\u2A6D\u0BE1\u0180;qs\u0BBC\u0BC5\u2A74lan\xF4\u0BE2i\xED\u0BEA\u0100;r\u0BB6\u2A81\xBB\u0BB7\u0180Aap\u2A8A\u2A8D\u2A91r\xF2\u2971rr;\u61AEar;\u6AF2\u0180;sv\u0F8D\u2A9C\u0F8C\u0100;d\u2AA1\u2AA2\u62FC;\u62FAcy;\u445A\u0380AEadest\u2AB7\u2ABA\u2ABE\u2AC2\u2AC5\u2AF6\u2AF9r\xF2\u2966;\uC000\u2266\u0338rr;\u619Ar;\u6025\u0200;fqs\u0C3B\u2ACE\u2AE3\u2AEFt\u0100ar\u2AD4\u2AD9rro\xF7\u2AC1ightarro\xF7\u2A90\u0180;qs\u0C3B\u2ABA\u2AEAlan\xF4\u0C55\u0100;s\u0C55\u2AF4\xBB\u0C36i\xED\u0C5D\u0100;r\u0C35\u2AFEi\u0100;e\u0C1A\u0C25i\xE4\u0D90\u0100pt\u2B0C\u2B11f;\uC000\u{1D55F}\u8180\xAC;in\u2B19\u2B1A\u2B36\u40ACn\u0200;Edv\u0B89\u2B24\u2B28\u2B2E;\uC000\u22F9\u0338ot;\uC000\u22F5\u0338\u01E1\u0B89\u2B33\u2B35;\u62F7;\u62F6i\u0100;v\u0CB8\u2B3C\u01E1\u0CB8\u2B41\u2B43;\u62FE;\u62FD\u0180aor\u2B4B\u2B63\u2B69r\u0200;ast\u0B7B\u2B55\u2B5A\u2B5Flle\xEC\u0B7Bl;\uC000\u2AFD\u20E5;\uC000\u2202\u0338lint;\u6A14\u0180;ce\u0C92\u2B70\u2B73u\xE5\u0CA5\u0100;c\u0C98\u2B78\u0100;e\u0C92\u2B7D\xF1\u0C98\u0200Aait\u2B88\u2B8B\u2B9D\u2BA7r\xF2\u2988rr\u0180;cw\u2B94\u2B95\u2B99\u619B;\uC000\u2933\u0338;\uC000\u219D\u0338ghtarrow\xBB\u2B95ri\u0100;e\u0CCB\u0CD6\u0380chimpqu\u2BBD\u2BCD\u2BD9\u2B04\u0B78\u2BE4\u2BEF\u0200;cer\u0D32\u2BC6\u0D37\u2BC9u\xE5\u0D45;\uC000\u{1D4C3}ort\u026D\u2B05\0\0\u2BD6ar\xE1\u2B56m\u0100;e\u0D6E\u2BDF\u0100;q\u0D74\u0D73su\u0100bp\u2BEB\u2BED\xE5\u0CF8\xE5\u0D0B\u0180bcp\u2BF6\u2C11\u2C19\u0200;Ees\u2BFF\u2C00\u0D22\u2C04\u6284;\uC000\u2AC5\u0338et\u0100;e\u0D1B\u2C0Bq\u0100;q\u0D23\u2C00c\u0100;e\u0D32\u2C17\xF1\u0D38\u0200;Ees\u2C22\u2C23\u0D5F\u2C27\u6285;\uC000\u2AC6\u0338et\u0100;e\u0D58\u2C2Eq\u0100;q\u0D60\u2C23\u0200gilr\u2C3D\u2C3F\u2C45\u2C47\xEC\u0BD7lde\u803B\xF1\u40F1\xE7\u0C43iangle\u0100lr\u2C52\u2C5Ceft\u0100;e\u0C1A\u2C5A\xF1\u0C26ight\u0100;e\u0CCB\u2C65\xF1\u0CD7\u0100;m\u2C6C\u2C6D\u43BD\u0180;es\u2C74\u2C75\u2C79\u4023ro;\u6116p;\u6007\u0480DHadgilrs\u2C8F\u2C94\u2C99\u2C9E\u2CA3\u2CB0\u2CB6\u2CD3\u2CE3ash;\u62ADarr;\u6904p;\uC000\u224D\u20D2ash;\u62AC\u0100et\u2CA8\u2CAC;\uC000\u2265\u20D2;\uC000>\u20D2nfin;\u69DE\u0180Aet\u2CBD\u2CC1\u2CC5rr;\u6902;\uC000\u2264\u20D2\u0100;r\u2CCA\u2CCD\uC000<\u20D2ie;\uC000\u22B4\u20D2\u0100At\u2CD8\u2CDCrr;\u6903rie;\uC000\u22B5\u20D2im;\uC000\u223C\u20D2\u0180Aan\u2CF0\u2CF4\u2D02rr;\u61D6r\u0100hr\u2CFA\u2CFDk;\u6923\u0100;o\u13E7\u13E5ear;\u6927\u1253\u1A95\0\0\0\0\0\0\0\0\0\0\0\0\0\u2D2D\0\u2D38\u2D48\u2D60\u2D65\u2D72\u2D84\u1B07\0\0\u2D8D\u2DAB\0\u2DC8\u2DCE\0\u2DDC\u2E19\u2E2B\u2E3E\u2E43\u0100cs\u2D31\u1A97ute\u803B\xF3\u40F3\u0100iy\u2D3C\u2D45r\u0100;c\u1A9E\u2D42\u803B\xF4\u40F4;\u443E\u0280abios\u1AA0\u2D52\u2D57\u01C8\u2D5Alac;\u4151v;\u6A38old;\u69BClig;\u4153\u0100cr\u2D69\u2D6Dir;\u69BF;\uC000\u{1D52C}\u036F\u2D79\0\0\u2D7C\0\u2D82n;\u42DBave\u803B\xF2\u40F2;\u69C1\u0100bm\u2D88\u0DF4ar;\u69B5\u0200acit\u2D95\u2D98\u2DA5\u2DA8r\xF2\u1A80\u0100ir\u2D9D\u2DA0r;\u69BEoss;\u69BBn\xE5\u0E52;\u69C0\u0180aei\u2DB1\u2DB5\u2DB9cr;\u414Dga;\u43C9\u0180cdn\u2DC0\u2DC5\u01CDron;\u43BF;\u69B6pf;\uC000\u{1D560}\u0180ael\u2DD4\u2DD7\u01D2r;\u69B7rp;\u69B9\u0380;adiosv\u2DEA\u2DEB\u2DEE\u2E08\u2E0D\u2E10\u2E16\u6228r\xF2\u1A86\u0200;efm\u2DF7\u2DF8\u2E02\u2E05\u6A5Dr\u0100;o\u2DFE\u2DFF\u6134f\xBB\u2DFF\u803B\xAA\u40AA\u803B\xBA\u40BAgof;\u62B6r;\u6A56lope;\u6A57;\u6A5B\u0180clo\u2E1F\u2E21\u2E27\xF2\u2E01ash\u803B\xF8\u40F8l;\u6298i\u016C\u2E2F\u2E34de\u803B\xF5\u40F5es\u0100;a\u01DB\u2E3As;\u6A36ml\u803B\xF6\u40F6bar;\u633D\u0AE1\u2E5E\0\u2E7D\0\u2E80\u2E9D\0\u2EA2\u2EB9\0\0\u2ECB\u0E9C\0\u2F13\0\0\u2F2B\u2FBC\0\u2FC8r\u0200;ast\u0403\u2E67\u2E72\u0E85\u8100\xB6;l\u2E6D\u2E6E\u40B6le\xEC\u0403\u0269\u2E78\0\0\u2E7Bm;\u6AF3;\u6AFDy;\u443Fr\u0280cimpt\u2E8B\u2E8F\u2E93\u1865\u2E97nt;\u4025od;\u402Eil;\u6030enk;\u6031r;\uC000\u{1D52D}\u0180imo\u2EA8\u2EB0\u2EB4\u0100;v\u2EAD\u2EAE\u43C6;\u43D5ma\xF4\u0A76ne;\u660E\u0180;tv\u2EBF\u2EC0\u2EC8\u43C0chfork\xBB\u1FFD;\u43D6\u0100au\u2ECF\u2EDFn\u0100ck\u2ED5\u2EDDk\u0100;h\u21F4\u2EDB;\u610E\xF6\u21F4s\u0480;abcdemst\u2EF3\u2EF4\u1908\u2EF9\u2EFD\u2F04\u2F06\u2F0A\u2F0E\u402Bcir;\u6A23ir;\u6A22\u0100ou\u1D40\u2F02;\u6A25;\u6A72n\u80BB\xB1\u0E9Dim;\u6A26wo;\u6A27\u0180ipu\u2F19\u2F20\u2F25ntint;\u6A15f;\uC000\u{1D561}nd\u803B\xA3\u40A3\u0500;Eaceinosu\u0EC8\u2F3F\u2F41\u2F44\u2F47\u2F81\u2F89\u2F92\u2F7E\u2FB6;\u6AB3p;\u6AB7u\xE5\u0ED9\u0100;c\u0ECE\u2F4C\u0300;acens\u0EC8\u2F59\u2F5F\u2F66\u2F68\u2F7Eppro\xF8\u2F43urlye\xF1\u0ED9\xF1\u0ECE\u0180aes\u2F6F\u2F76\u2F7Approx;\u6AB9qq;\u6AB5im;\u62E8i\xED\u0EDFme\u0100;s\u2F88\u0EAE\u6032\u0180Eas\u2F78\u2F90\u2F7A\xF0\u2F75\u0180dfp\u0EEC\u2F99\u2FAF\u0180als\u2FA0\u2FA5\u2FAAlar;\u632Eine;\u6312urf;\u6313\u0100;t\u0EFB\u2FB4\xEF\u0EFBrel;\u62B0\u0100ci\u2FC0\u2FC5r;\uC000\u{1D4C5};\u43C8ncsp;\u6008\u0300fiopsu\u2FDA\u22E2\u2FDF\u2FE5\u2FEB\u2FF1r;\uC000\u{1D52E}pf;\uC000\u{1D562}rime;\u6057cr;\uC000\u{1D4C6}\u0180aeo\u2FF8\u3009\u3013t\u0100ei\u2FFE\u3005rnion\xF3\u06B0nt;\u6A16st\u0100;e\u3010\u3011\u403F\xF1\u1F19\xF4\u0F14\u0A80ABHabcdefhilmnoprstux\u3040\u3051\u3055\u3059\u30E0\u310E\u312B\u3147\u3162\u3172\u318E\u3206\u3215\u3224\u3229\u3258\u326E\u3272\u3290\u32B0\u32B7\u0180art\u3047\u304A\u304Cr\xF2\u10B3\xF2\u03DDail;\u691Car\xF2\u1C65ar;\u6964\u0380cdenqrt\u3068\u3075\u3078\u307F\u308F\u3094\u30CC\u0100eu\u306D\u3071;\uC000\u223D\u0331te;\u4155i\xE3\u116Emptyv;\u69B3g\u0200;del\u0FD1\u3089\u308B\u308D;\u6992;\u69A5\xE5\u0FD1uo\u803B\xBB\u40BBr\u0580;abcfhlpstw\u0FDC\u30AC\u30AF\u30B7\u30B9\u30BC\u30BE\u30C0\u30C3\u30C7\u30CAp;\u6975\u0100;f\u0FE0\u30B4s;\u6920;\u6933s;\u691E\xEB\u225D\xF0\u272El;\u6945im;\u6974l;\u61A3;\u619D\u0100ai\u30D1\u30D5il;\u691Ao\u0100;n\u30DB\u30DC\u6236al\xF3\u0F1E\u0180abr\u30E7\u30EA\u30EEr\xF2\u17E5rk;\u6773\u0100ak\u30F3\u30FDc\u0100ek\u30F9\u30FB;\u407D;\u405D\u0100es\u3102\u3104;\u698Cl\u0100du\u310A\u310C;\u698E;\u6990\u0200aeuy\u3117\u311C\u3127\u3129ron;\u4159\u0100di\u3121\u3125il;\u4157\xEC\u0FF2\xE2\u30FA;\u4440\u0200clqs\u3134\u3137\u313D\u3144a;\u6937dhar;\u6969uo\u0100;r\u020E\u020Dh;\u61B3\u0180acg\u314E\u315F\u0F44l\u0200;ips\u0F78\u3158\u315B\u109Cn\xE5\u10BBar\xF4\u0FA9t;\u65AD\u0180ilr\u3169\u1023\u316Esht;\u697D;\uC000\u{1D52F}\u0100ao\u3177\u3186r\u0100du\u317D\u317F\xBB\u047B\u0100;l\u1091\u3184;\u696C\u0100;v\u318B\u318C\u43C1;\u43F1\u0180gns\u3195\u31F9\u31FCht\u0300ahlrst\u31A4\u31B0\u31C2\u31D8\u31E4\u31EErrow\u0100;t\u0FDC\u31ADa\xE9\u30C8arpoon\u0100du\u31BB\u31BFow\xEE\u317Ep\xBB\u1092eft\u0100ah\u31CA\u31D0rrow\xF3\u0FEAarpoon\xF3\u0551ightarrows;\u61C9quigarro\xF7\u30CBhreetimes;\u62CCg;\u42DAingdotse\xF1\u1F32\u0180ahm\u320D\u3210\u3213r\xF2\u0FEAa\xF2\u0551;\u600Foust\u0100;a\u321E\u321F\u63B1che\xBB\u321Fmid;\u6AEE\u0200abpt\u3232\u323D\u3240\u3252\u0100nr\u3237\u323Ag;\u67EDr;\u61FEr\xEB\u1003\u0180afl\u3247\u324A\u324Er;\u6986;\uC000\u{1D563}us;\u6A2Eimes;\u6A35\u0100ap\u325D\u3267r\u0100;g\u3263\u3264\u4029t;\u6994olint;\u6A12ar\xF2\u31E3\u0200achq\u327B\u3280\u10BC\u3285quo;\u603Ar;\uC000\u{1D4C7}\u0100bu\u30FB\u328Ao\u0100;r\u0214\u0213\u0180hir\u3297\u329B\u32A0re\xE5\u31F8mes;\u62CAi\u0200;efl\u32AA\u1059\u1821\u32AB\u65B9tri;\u69CEluhar;\u6968;\u611E\u0D61\u32D5\u32DB\u32DF\u332C\u3338\u3371\0\u337A\u33A4\0\0\u33EC\u33F0\0\u3428\u3448\u345A\u34AD\u34B1\u34CA\u34F1\0\u3616\0\0\u3633cute;\u415Bqu\xEF\u27BA\u0500;Eaceinpsy\u11ED\u32F3\u32F5\u32FF\u3302\u330B\u330F\u331F\u3326\u3329;\u6AB4\u01F0\u32FA\0\u32FC;\u6AB8on;\u4161u\xE5\u11FE\u0100;d\u11F3\u3307il;\u415Frc;\u415D\u0180Eas\u3316\u3318\u331B;\u6AB6p;\u6ABAim;\u62E9olint;\u6A13i\xED\u1204;\u4441ot\u0180;be\u3334\u1D47\u3335\u62C5;\u6A66\u0380Aacmstx\u3346\u334A\u3357\u335B\u335E\u3363\u336Drr;\u61D8r\u0100hr\u3350\u3352\xEB\u2228\u0100;o\u0A36\u0A34t\u803B\xA7\u40A7i;\u403Bwar;\u6929m\u0100in\u3369\xF0nu\xF3\xF1t;\u6736r\u0100;o\u3376\u2055\uC000\u{1D530}\u0200acoy\u3382\u3386\u3391\u33A0rp;\u666F\u0100hy\u338B\u338Fcy;\u4449;\u4448rt\u026D\u3399\0\0\u339Ci\xE4\u1464ara\xEC\u2E6F\u803B\xAD\u40AD\u0100gm\u33A8\u33B4ma\u0180;fv\u33B1\u33B2\u33B2\u43C3;\u43C2\u0400;deglnpr\u12AB\u33C5\u33C9\u33CE\u33D6\u33DE\u33E1\u33E6ot;\u6A6A\u0100;q\u12B1\u12B0\u0100;E\u33D3\u33D4\u6A9E;\u6AA0\u0100;E\u33DB\u33DC\u6A9D;\u6A9Fe;\u6246lus;\u6A24arr;\u6972ar\xF2\u113D\u0200aeit\u33F8\u3408\u340F\u3417\u0100ls\u33FD\u3404lsetm\xE9\u336Ahp;\u6A33parsl;\u69E4\u0100dl\u1463\u3414e;\u6323\u0100;e\u341C\u341D\u6AAA\u0100;s\u3422\u3423\u6AAC;\uC000\u2AAC\uFE00\u0180flp\u342E\u3433\u3442tcy;\u444C\u0100;b\u3438\u3439\u402F\u0100;a\u343E\u343F\u69C4r;\u633Ff;\uC000\u{1D564}a\u0100dr\u344D\u0402es\u0100;u\u3454\u3455\u6660it\xBB\u3455\u0180csu\u3460\u3479\u349F\u0100au\u3465\u346Fp\u0100;s\u1188\u346B;\uC000\u2293\uFE00p\u0100;s\u11B4\u3475;\uC000\u2294\uFE00u\u0100bp\u347F\u348F\u0180;es\u1197\u119C\u3486et\u0100;e\u1197\u348D\xF1\u119D\u0180;es\u11A8\u11AD\u3496et\u0100;e\u11A8\u349D\xF1\u11AE\u0180;af\u117B\u34A6\u05B0r\u0165\u34AB\u05B1\xBB\u117Car\xF2\u1148\u0200cemt\u34B9\u34BE\u34C2\u34C5r;\uC000\u{1D4C8}tm\xEE\xF1i\xEC\u3415ar\xE6\u11BE\u0100ar\u34CE\u34D5r\u0100;f\u34D4\u17BF\u6606\u0100an\u34DA\u34EDight\u0100ep\u34E3\u34EApsilo\xEE\u1EE0h\xE9\u2EAFs\xBB\u2852\u0280bcmnp\u34FB\u355E\u1209\u358B\u358E\u0480;Edemnprs\u350E\u350F\u3511\u3515\u351E\u3523\u352C\u3531\u3536\u6282;\u6AC5ot;\u6ABD\u0100;d\u11DA\u351Aot;\u6AC3ult;\u6AC1\u0100Ee\u3528\u352A;\u6ACB;\u628Alus;\u6ABFarr;\u6979\u0180eiu\u353D\u3552\u3555t\u0180;en\u350E\u3545\u354Bq\u0100;q\u11DA\u350Feq\u0100;q\u352B\u3528m;\u6AC7\u0100bp\u355A\u355C;\u6AD5;\u6AD3c\u0300;acens\u11ED\u356C\u3572\u3579\u357B\u3326ppro\xF8\u32FAurlye\xF1\u11FE\xF1\u11F3\u0180aes\u3582\u3588\u331Bppro\xF8\u331Aq\xF1\u3317g;\u666A\u0680123;Edehlmnps\u35A9\u35AC\u35AF\u121C\u35B2\u35B4\u35C0\u35C9\u35D5\u35DA\u35DF\u35E8\u35ED\u803B\xB9\u40B9\u803B\xB2\u40B2\u803B\xB3\u40B3;\u6AC6\u0100os\u35B9\u35BCt;\u6ABEub;\u6AD8\u0100;d\u1222\u35C5ot;\u6AC4s\u0100ou\u35CF\u35D2l;\u67C9b;\u6AD7arr;\u697Bult;\u6AC2\u0100Ee\u35E4\u35E6;\u6ACC;\u628Blus;\u6AC0\u0180eiu\u35F4\u3609\u360Ct\u0180;en\u121C\u35FC\u3602q\u0100;q\u1222\u35B2eq\u0100;q\u35E7\u35E4m;\u6AC8\u0100bp\u3611\u3613;\u6AD4;\u6AD6\u0180Aan\u361C\u3620\u362Drr;\u61D9r\u0100hr\u3626\u3628\xEB\u222E\u0100;o\u0A2B\u0A29war;\u692Alig\u803B\xDF\u40DF\u0BE1\u3651\u365D\u3660\u12CE\u3673\u3679\0\u367E\u36C2\0\0\0\0\0\u36DB\u3703\0\u3709\u376C\0\0\0\u3787\u0272\u3656\0\0\u365Bget;\u6316;\u43C4r\xEB\u0E5F\u0180aey\u3666\u366B\u3670ron;\u4165dil;\u4163;\u4442lrec;\u6315r;\uC000\u{1D531}\u0200eiko\u3686\u369D\u36B5\u36BC\u01F2\u368B\0\u3691e\u01004f\u1284\u1281a\u0180;sv\u3698\u3699\u369B\u43B8ym;\u43D1\u0100cn\u36A2\u36B2k\u0100as\u36A8\u36AEppro\xF8\u12C1im\xBB\u12ACs\xF0\u129E\u0100as\u36BA\u36AE\xF0\u12C1rn\u803B\xFE\u40FE\u01EC\u031F\u36C6\u22E7es\u8180\xD7;bd\u36CF\u36D0\u36D8\u40D7\u0100;a\u190F\u36D5r;\u6A31;\u6A30\u0180eps\u36E1\u36E3\u3700\xE1\u2A4D\u0200;bcf\u0486\u36EC\u36F0\u36F4ot;\u6336ir;\u6AF1\u0100;o\u36F9\u36FC\uC000\u{1D565}rk;\u6ADA\xE1\u3362rime;\u6034\u0180aip\u370F\u3712\u3764d\xE5\u1248\u0380adempst\u3721\u374D\u3740\u3751\u3757\u375C\u375Fngle\u0280;dlqr\u3730\u3731\u3736\u3740\u3742\u65B5own\xBB\u1DBBeft\u0100;e\u2800\u373E\xF1\u092E;\u625Cight\u0100;e\u32AA\u374B\xF1\u105Aot;\u65ECinus;\u6A3Alus;\u6A39b;\u69CDime;\u6A3Bezium;\u63E2\u0180cht\u3772\u377D\u3781\u0100ry\u3777\u377B;\uC000\u{1D4C9};\u4446cy;\u445Brok;\u4167\u0100io\u378B\u378Ex\xF4\u1777head\u0100lr\u3797\u37A0eftarro\xF7\u084Fightarrow\xBB\u0F5D\u0900AHabcdfghlmoprstuw\u37D0\u37D3\u37D7\u37E4\u37F0\u37FC\u380E\u381C\u3823\u3834\u3851\u385D\u386B\u38A9\u38CC\u38D2\u38EA\u38F6r\xF2\u03EDar;\u6963\u0100cr\u37DC\u37E2ute\u803B\xFA\u40FA\xF2\u1150r\u01E3\u37EA\0\u37EDy;\u445Eve;\u416D\u0100iy\u37F5\u37FArc\u803B\xFB\u40FB;\u4443\u0180abh\u3803\u3806\u380Br\xF2\u13ADlac;\u4171a\xF2\u13C3\u0100ir\u3813\u3818sht;\u697E;\uC000\u{1D532}rave\u803B\xF9\u40F9\u0161\u3827\u3831r\u0100lr\u382C\u382E\xBB\u0957\xBB\u1083lk;\u6580\u0100ct\u3839\u384D\u026F\u383F\0\0\u384Arn\u0100;e\u3845\u3846\u631Cr\xBB\u3846op;\u630Fri;\u65F8\u0100al\u3856\u385Acr;\u416B\u80BB\xA8\u0349\u0100gp\u3862\u3866on;\u4173f;\uC000\u{1D566}\u0300adhlsu\u114B\u3878\u387D\u1372\u3891\u38A0own\xE1\u13B3arpoon\u0100lr\u3888\u388Cef\xF4\u382Digh\xF4\u382Fi\u0180;hl\u3899\u389A\u389C\u43C5\xBB\u13FAon\xBB\u389Aparrows;\u61C8\u0180cit\u38B0\u38C4\u38C8\u026F\u38B6\0\0\u38C1rn\u0100;e\u38BC\u38BD\u631Dr\xBB\u38BDop;\u630Eng;\u416Fri;\u65F9cr;\uC000\u{1D4CA}\u0180dir\u38D9\u38DD\u38E2ot;\u62F0lde;\u4169i\u0100;f\u3730\u38E8\xBB\u1813\u0100am\u38EF\u38F2r\xF2\u38A8l\u803B\xFC\u40FCangle;\u69A7\u0780ABDacdeflnoprsz\u391C\u391F\u3929\u392D\u39B5\u39B8\u39BD\u39DF\u39E4\u39E8\u39F3\u39F9\u39FD\u3A01\u3A20r\xF2\u03F7ar\u0100;v\u3926\u3927\u6AE8;\u6AE9as\xE8\u03E1\u0100nr\u3932\u3937grt;\u699C\u0380eknprst\u34E3\u3946\u394B\u3952\u395D\u3964\u3996app\xE1\u2415othin\xE7\u1E96\u0180hir\u34EB\u2EC8\u3959op\xF4\u2FB5\u0100;h\u13B7\u3962\xEF\u318D\u0100iu\u3969\u396Dgm\xE1\u33B3\u0100bp\u3972\u3984setneq\u0100;q\u397D\u3980\uC000\u228A\uFE00;\uC000\u2ACB\uFE00setneq\u0100;q\u398F\u3992\uC000\u228B\uFE00;\uC000\u2ACC\uFE00\u0100hr\u399B\u399Fet\xE1\u369Ciangle\u0100lr\u39AA\u39AFeft\xBB\u0925ight\xBB\u1051y;\u4432ash\xBB\u1036\u0180elr\u39C4\u39D2\u39D7\u0180;be\u2DEA\u39CB\u39CFar;\u62BBq;\u625Alip;\u62EE\u0100bt\u39DC\u1468a\xF2\u1469r;\uC000\u{1D533}tr\xE9\u39AEsu\u0100bp\u39EF\u39F1\xBB\u0D1C\xBB\u0D59pf;\uC000\u{1D567}ro\xF0\u0EFBtr\xE9\u39B4\u0100cu\u3A06\u3A0Br;\uC000\u{1D4CB}\u0100bp\u3A10\u3A18n\u0100Ee\u3980\u3A16\xBB\u397En\u0100Ee\u3992\u3A1E\xBB\u3990igzag;\u699A\u0380cefoprs\u3A36\u3A3B\u3A56\u3A5B\u3A54\u3A61\u3A6Airc;\u4175\u0100di\u3A40\u3A51\u0100bg\u3A45\u3A49ar;\u6A5Fe\u0100;q\u15FA\u3A4F;\u6259erp;\u6118r;\uC000\u{1D534}pf;\uC000\u{1D568}\u0100;e\u1479\u3A66at\xE8\u1479cr;\uC000\u{1D4CC}\u0AE3\u178E\u3A87\0\u3A8B\0\u3A90\u3A9B\0\0\u3A9D\u3AA8\u3AAB\u3AAF\0\0\u3AC3\u3ACE\0\u3AD8\u17DC\u17DFtr\xE9\u17D1r;\uC000\u{1D535}\u0100Aa\u3A94\u3A97r\xF2\u03C3r\xF2\u09F6;\u43BE\u0100Aa\u3AA1\u3AA4r\xF2\u03B8r\xF2\u09EBa\xF0\u2713is;\u62FB\u0180dpt\u17A4\u3AB5\u3ABE\u0100fl\u3ABA\u17A9;\uC000\u{1D569}im\xE5\u17B2\u0100Aa\u3AC7\u3ACAr\xF2\u03CEr\xF2\u0A01\u0100cq\u3AD2\u17B8r;\uC000\u{1D4CD}\u0100pt\u17D6\u3ADCr\xE9\u17D4\u0400acefiosu\u3AF0\u3AFD\u3B08\u3B0C\u3B11\u3B15\u3B1B\u3B21c\u0100uy\u3AF6\u3AFBte\u803B\xFD\u40FD;\u444F\u0100iy\u3B02\u3B06rc;\u4177;\u444Bn\u803B\xA5\u40A5r;\uC000\u{1D536}cy;\u4457pf;\uC000\u{1D56A}cr;\uC000\u{1D4CE}\u0100cm\u3B26\u3B29y;\u444El\u803B\xFF\u40FF\u0500acdefhiosw\u3B42\u3B48\u3B54\u3B58\u3B64\u3B69\u3B6D\u3B74\u3B7A\u3B80cute;\u417A\u0100ay\u3B4D\u3B52ron;\u417E;\u4437ot;\u417C\u0100et\u3B5D\u3B61tr\xE6\u155Fa;\u43B6r;\uC000\u{1D537}cy;\u4436grarr;\u61DDpf;\uC000\u{1D56B}cr;\uC000\u{1D4CF}\u0100jn\u3B85\u3B87;\u600Dj;\u600C'.split("").map((c) => c.charCodeAt(0))
);

// node_modules/htmlparser2/node_modules/domutils/node_modules/dom-serializer/node_modules/entities/lib/esm/generated/decode-data-xml.js
var decode_data_xml_default = new Uint16Array(
  // prettier-ignore
  "\u0200aglq	\x1B\u026D\0\0p;\u4026os;\u4027t;\u403Et;\u403Cuot;\u4022".split("").map((c) => c.charCodeAt(0))
);

// node_modules/htmlparser2/node_modules/domutils/node_modules/dom-serializer/node_modules/entities/lib/esm/decode_codepoint.js
var _a2;
var decodeMap2 = /* @__PURE__ */ new Map([
  [0, 65533],
  // C1 Unicode control character reference replacements
  [128, 8364],
  [130, 8218],
  [131, 402],
  [132, 8222],
  [133, 8230],
  [134, 8224],
  [135, 8225],
  [136, 710],
  [137, 8240],
  [138, 352],
  [139, 8249],
  [140, 338],
  [142, 381],
  [145, 8216],
  [146, 8217],
  [147, 8220],
  [148, 8221],
  [149, 8226],
  [150, 8211],
  [151, 8212],
  [152, 732],
  [153, 8482],
  [154, 353],
  [155, 8250],
  [156, 339],
  [158, 382],
  [159, 376]
]);
var fromCodePoint2 = (
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, node/no-unsupported-features/es-builtins
  (_a2 = String.fromCodePoint) !== null && _a2 !== void 0 ? _a2 : function(codePoint) {
    let output = "";
    if (codePoint > 65535) {
      codePoint -= 65536;
      output += String.fromCharCode(codePoint >>> 10 & 1023 | 55296);
      codePoint = 56320 | codePoint & 1023;
    }
    output += String.fromCharCode(codePoint);
    return output;
  }
);
function replaceCodePoint2(codePoint) {
  var _a3;
  if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) {
    return 65533;
  }
  return (_a3 = decodeMap2.get(codePoint)) !== null && _a3 !== void 0 ? _a3 : codePoint;
}

// node_modules/htmlparser2/node_modules/domutils/node_modules/dom-serializer/node_modules/entities/lib/esm/decode.js
var CharCodes3;
(function(CharCodes4) {
  CharCodes4[CharCodes4["NUM"] = 35] = "NUM";
  CharCodes4[CharCodes4["SEMI"] = 59] = "SEMI";
  CharCodes4[CharCodes4["EQUALS"] = 61] = "EQUALS";
  CharCodes4[CharCodes4["ZERO"] = 48] = "ZERO";
  CharCodes4[CharCodes4["NINE"] = 57] = "NINE";
  CharCodes4[CharCodes4["LOWER_A"] = 97] = "LOWER_A";
  CharCodes4[CharCodes4["LOWER_F"] = 102] = "LOWER_F";
  CharCodes4[CharCodes4["LOWER_X"] = 120] = "LOWER_X";
  CharCodes4[CharCodes4["LOWER_Z"] = 122] = "LOWER_Z";
  CharCodes4[CharCodes4["UPPER_A"] = 65] = "UPPER_A";
  CharCodes4[CharCodes4["UPPER_F"] = 70] = "UPPER_F";
  CharCodes4[CharCodes4["UPPER_Z"] = 90] = "UPPER_Z";
})(CharCodes3 || (CharCodes3 = {}));
var TO_LOWER_BIT2 = 32;
var BinTrieFlags2;
(function(BinTrieFlags3) {
  BinTrieFlags3[BinTrieFlags3["VALUE_LENGTH"] = 49152] = "VALUE_LENGTH";
  BinTrieFlags3[BinTrieFlags3["BRANCH_LENGTH"] = 16256] = "BRANCH_LENGTH";
  BinTrieFlags3[BinTrieFlags3["JUMP_TABLE"] = 127] = "JUMP_TABLE";
})(BinTrieFlags2 || (BinTrieFlags2 = {}));
function isNumber2(code) {
  return code >= CharCodes3.ZERO && code <= CharCodes3.NINE;
}
function isHexadecimalCharacter2(code) {
  return code >= CharCodes3.UPPER_A && code <= CharCodes3.UPPER_F || code >= CharCodes3.LOWER_A && code <= CharCodes3.LOWER_F;
}
function isAsciiAlphaNumeric2(code) {
  return code >= CharCodes3.UPPER_A && code <= CharCodes3.UPPER_Z || code >= CharCodes3.LOWER_A && code <= CharCodes3.LOWER_Z || isNumber2(code);
}
function isEntityInAttributeInvalidEnd2(code) {
  return code === CharCodes3.EQUALS || isAsciiAlphaNumeric2(code);
}
var EntityDecoderState2;
(function(EntityDecoderState3) {
  EntityDecoderState3[EntityDecoderState3["EntityStart"] = 0] = "EntityStart";
  EntityDecoderState3[EntityDecoderState3["NumericStart"] = 1] = "NumericStart";
  EntityDecoderState3[EntityDecoderState3["NumericDecimal"] = 2] = "NumericDecimal";
  EntityDecoderState3[EntityDecoderState3["NumericHex"] = 3] = "NumericHex";
  EntityDecoderState3[EntityDecoderState3["NamedEntity"] = 4] = "NamedEntity";
})(EntityDecoderState2 || (EntityDecoderState2 = {}));
var DecodingMode2;
(function(DecodingMode3) {
  DecodingMode3[DecodingMode3["Legacy"] = 0] = "Legacy";
  DecodingMode3[DecodingMode3["Strict"] = 1] = "Strict";
  DecodingMode3[DecodingMode3["Attribute"] = 2] = "Attribute";
})(DecodingMode2 || (DecodingMode2 = {}));
var EntityDecoder2 = class {
  constructor(decodeTree, emitCodePoint, errors) {
    this.decodeTree = decodeTree;
    this.emitCodePoint = emitCodePoint;
    this.errors = errors;
    this.state = EntityDecoderState2.EntityStart;
    this.consumed = 1;
    this.result = 0;
    this.treeIndex = 0;
    this.excess = 1;
    this.decodeMode = DecodingMode2.Strict;
  }
  /** Resets the instance to make it reusable. */
  startEntity(decodeMode) {
    this.decodeMode = decodeMode;
    this.state = EntityDecoderState2.EntityStart;
    this.result = 0;
    this.treeIndex = 0;
    this.excess = 1;
    this.consumed = 1;
  }
  /**
   * Write an entity to the decoder. This can be called multiple times with partial entities.
   * If the entity is incomplete, the decoder will return -1.
   *
   * Mirrors the implementation of `getDecoder`, but with the ability to stop decoding if the
   * entity is incomplete, and resume when the next string is written.
   *
   * @param string The string containing the entity (or a continuation of the entity).
   * @param offset The offset at which the entity begins. Should be 0 if this is not the first call.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  write(str, offset) {
    switch (this.state) {
      case EntityDecoderState2.EntityStart: {
        if (str.charCodeAt(offset) === CharCodes3.NUM) {
          this.state = EntityDecoderState2.NumericStart;
          this.consumed += 1;
          return this.stateNumericStart(str, offset + 1);
        }
        this.state = EntityDecoderState2.NamedEntity;
        return this.stateNamedEntity(str, offset);
      }
      case EntityDecoderState2.NumericStart: {
        return this.stateNumericStart(str, offset);
      }
      case EntityDecoderState2.NumericDecimal: {
        return this.stateNumericDecimal(str, offset);
      }
      case EntityDecoderState2.NumericHex: {
        return this.stateNumericHex(str, offset);
      }
      case EntityDecoderState2.NamedEntity: {
        return this.stateNamedEntity(str, offset);
      }
    }
  }
  /**
   * Switches between the numeric decimal and hexadecimal states.
   *
   * Equivalent to the `Numeric character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericStart(str, offset) {
    if (offset >= str.length) {
      return -1;
    }
    if ((str.charCodeAt(offset) | TO_LOWER_BIT2) === CharCodes3.LOWER_X) {
      this.state = EntityDecoderState2.NumericHex;
      this.consumed += 1;
      return this.stateNumericHex(str, offset + 1);
    }
    this.state = EntityDecoderState2.NumericDecimal;
    return this.stateNumericDecimal(str, offset);
  }
  addToNumericResult(str, start, end, base) {
    if (start !== end) {
      const digitCount = end - start;
      this.result = this.result * Math.pow(base, digitCount) + parseInt(str.substr(start, digitCount), base);
      this.consumed += digitCount;
    }
  }
  /**
   * Parses a hexadecimal numeric entity.
   *
   * Equivalent to the `Hexademical character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericHex(str, offset) {
    const startIdx = offset;
    while (offset < str.length) {
      const char = str.charCodeAt(offset);
      if (isNumber2(char) || isHexadecimalCharacter2(char)) {
        offset += 1;
      } else {
        this.addToNumericResult(str, startIdx, offset, 16);
        return this.emitNumericEntity(char, 3);
      }
    }
    this.addToNumericResult(str, startIdx, offset, 16);
    return -1;
  }
  /**
   * Parses a decimal numeric entity.
   *
   * Equivalent to the `Decimal character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericDecimal(str, offset) {
    const startIdx = offset;
    while (offset < str.length) {
      const char = str.charCodeAt(offset);
      if (isNumber2(char)) {
        offset += 1;
      } else {
        this.addToNumericResult(str, startIdx, offset, 10);
        return this.emitNumericEntity(char, 2);
      }
    }
    this.addToNumericResult(str, startIdx, offset, 10);
    return -1;
  }
  /**
   * Validate and emit a numeric entity.
   *
   * Implements the logic from the `Hexademical character reference start
   * state` and `Numeric character reference end state` in the HTML spec.
   *
   * @param lastCp The last code point of the entity. Used to see if the
   *               entity was terminated with a semicolon.
   * @param expectedLength The minimum number of characters that should be
   *                       consumed. Used to validate that at least one digit
   *                       was consumed.
   * @returns The number of characters that were consumed.
   */
  emitNumericEntity(lastCp, expectedLength) {
    var _a3;
    if (this.consumed <= expectedLength) {
      (_a3 = this.errors) === null || _a3 === void 0 ? void 0 : _a3.absenceOfDigitsInNumericCharacterReference(this.consumed);
      return 0;
    }
    if (lastCp === CharCodes3.SEMI) {
      this.consumed += 1;
    } else if (this.decodeMode === DecodingMode2.Strict) {
      return 0;
    }
    this.emitCodePoint(replaceCodePoint2(this.result), this.consumed);
    if (this.errors) {
      if (lastCp !== CharCodes3.SEMI) {
        this.errors.missingSemicolonAfterCharacterReference();
      }
      this.errors.validateNumericCharacterReference(this.result);
    }
    return this.consumed;
  }
  /**
   * Parses a named entity.
   *
   * Equivalent to the `Named character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNamedEntity(str, offset) {
    const { decodeTree } = this;
    let current = decodeTree[this.treeIndex];
    let valueLength = (current & BinTrieFlags2.VALUE_LENGTH) >> 14;
    for (; offset < str.length; offset++, this.excess++) {
      const char = str.charCodeAt(offset);
      this.treeIndex = determineBranch2(decodeTree, current, this.treeIndex + Math.max(1, valueLength), char);
      if (this.treeIndex < 0) {
        return this.result === 0 || // If we are parsing an attribute
        this.decodeMode === DecodingMode2.Attribute && // We shouldn't have consumed any characters after the entity,
        (valueLength === 0 || // And there should be no invalid characters.
        isEntityInAttributeInvalidEnd2(char)) ? 0 : this.emitNotTerminatedNamedEntity();
      }
      current = decodeTree[this.treeIndex];
      valueLength = (current & BinTrieFlags2.VALUE_LENGTH) >> 14;
      if (valueLength !== 0) {
        if (char === CharCodes3.SEMI) {
          return this.emitNamedEntityData(this.treeIndex, valueLength, this.consumed + this.excess);
        }
        if (this.decodeMode !== DecodingMode2.Strict) {
          this.result = this.treeIndex;
          this.consumed += this.excess;
          this.excess = 0;
        }
      }
    }
    return -1;
  }
  /**
   * Emit a named entity that was not terminated with a semicolon.
   *
   * @returns The number of characters consumed.
   */
  emitNotTerminatedNamedEntity() {
    var _a3;
    const { result, decodeTree } = this;
    const valueLength = (decodeTree[result] & BinTrieFlags2.VALUE_LENGTH) >> 14;
    this.emitNamedEntityData(result, valueLength, this.consumed);
    (_a3 = this.errors) === null || _a3 === void 0 ? void 0 : _a3.missingSemicolonAfterCharacterReference();
    return this.consumed;
  }
  /**
   * Emit a named entity.
   *
   * @param result The index of the entity in the decode tree.
   * @param valueLength The number of bytes in the entity.
   * @param consumed The number of characters consumed.
   *
   * @returns The number of characters consumed.
   */
  emitNamedEntityData(result, valueLength, consumed) {
    const { decodeTree } = this;
    this.emitCodePoint(valueLength === 1 ? decodeTree[result] & ~BinTrieFlags2.VALUE_LENGTH : decodeTree[result + 1], consumed);
    if (valueLength === 3) {
      this.emitCodePoint(decodeTree[result + 2], consumed);
    }
    return consumed;
  }
  /**
   * Signal to the parser that the end of the input was reached.
   *
   * Remaining data will be emitted and relevant errors will be produced.
   *
   * @returns The number of characters consumed.
   */
  end() {
    var _a3;
    switch (this.state) {
      case EntityDecoderState2.NamedEntity: {
        return this.result !== 0 && (this.decodeMode !== DecodingMode2.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
      }
      // Otherwise, emit a numeric entity if we have one.
      case EntityDecoderState2.NumericDecimal: {
        return this.emitNumericEntity(0, 2);
      }
      case EntityDecoderState2.NumericHex: {
        return this.emitNumericEntity(0, 3);
      }
      case EntityDecoderState2.NumericStart: {
        (_a3 = this.errors) === null || _a3 === void 0 ? void 0 : _a3.absenceOfDigitsInNumericCharacterReference(this.consumed);
        return 0;
      }
      case EntityDecoderState2.EntityStart: {
        return 0;
      }
    }
  }
};
function getDecoder(decodeTree) {
  let ret = "";
  const decoder = new EntityDecoder2(decodeTree, (str) => ret += fromCodePoint2(str));
  return function decodeWithTrie(str, decodeMode) {
    let lastIndex = 0;
    let offset = 0;
    while ((offset = str.indexOf("&", offset)) >= 0) {
      ret += str.slice(lastIndex, offset);
      decoder.startEntity(decodeMode);
      const len = decoder.write(
        str,
        // Skip the "&"
        offset + 1
      );
      if (len < 0) {
        lastIndex = offset + decoder.end();
        break;
      }
      lastIndex = offset + len;
      offset = len === 0 ? lastIndex + 1 : lastIndex;
    }
    const result = ret + str.slice(lastIndex);
    ret = "";
    return result;
  };
}
function determineBranch2(decodeTree, current, nodeIdx, char) {
  const branchCount = (current & BinTrieFlags2.BRANCH_LENGTH) >> 7;
  const jumpOffset = current & BinTrieFlags2.JUMP_TABLE;
  if (branchCount === 0) {
    return jumpOffset !== 0 && char === jumpOffset ? nodeIdx : -1;
  }
  if (jumpOffset) {
    const value = char - jumpOffset;
    return value < 0 || value >= branchCount ? -1 : decodeTree[nodeIdx + value] - 1;
  }
  let lo = nodeIdx;
  let hi = lo + branchCount - 1;
  while (lo <= hi) {
    const mid = lo + hi >>> 1;
    const midVal = decodeTree[mid];
    if (midVal < char) {
      lo = mid + 1;
    } else if (midVal > char) {
      hi = mid - 1;
    } else {
      return decodeTree[mid + branchCount];
    }
  }
  return -1;
}
var htmlDecoder = getDecoder(decode_data_html_default);
var xmlDecoder = getDecoder(decode_data_xml_default);

// node_modules/htmlparser2/node_modules/domutils/node_modules/dom-serializer/node_modules/entities/lib/esm/generated/encode-html.js
function restoreDiff(arr) {
  for (let i = 1; i < arr.length; i++) {
    arr[i][0] += arr[i - 1][0] + 1;
  }
  return arr;
}
var encode_html_default = new Map(/* @__PURE__ */ restoreDiff([[9, "&Tab;"], [0, "&NewLine;"], [22, "&excl;"], [0, "&quot;"], [0, "&num;"], [0, "&dollar;"], [0, "&percnt;"], [0, "&amp;"], [0, "&apos;"], [0, "&lpar;"], [0, "&rpar;"], [0, "&ast;"], [0, "&plus;"], [0, "&comma;"], [1, "&period;"], [0, "&sol;"], [10, "&colon;"], [0, "&semi;"], [0, { v: "&lt;", n: 8402, o: "&nvlt;" }], [0, { v: "&equals;", n: 8421, o: "&bne;" }], [0, { v: "&gt;", n: 8402, o: "&nvgt;" }], [0, "&quest;"], [0, "&commat;"], [26, "&lbrack;"], [0, "&bsol;"], [0, "&rbrack;"], [0, "&Hat;"], [0, "&lowbar;"], [0, "&DiacriticalGrave;"], [5, { n: 106, o: "&fjlig;" }], [20, "&lbrace;"], [0, "&verbar;"], [0, "&rbrace;"], [34, "&nbsp;"], [0, "&iexcl;"], [0, "&cent;"], [0, "&pound;"], [0, "&curren;"], [0, "&yen;"], [0, "&brvbar;"], [0, "&sect;"], [0, "&die;"], [0, "&copy;"], [0, "&ordf;"], [0, "&laquo;"], [0, "&not;"], [0, "&shy;"], [0, "&circledR;"], [0, "&macr;"], [0, "&deg;"], [0, "&PlusMinus;"], [0, "&sup2;"], [0, "&sup3;"], [0, "&acute;"], [0, "&micro;"], [0, "&para;"], [0, "&centerdot;"], [0, "&cedil;"], [0, "&sup1;"], [0, "&ordm;"], [0, "&raquo;"], [0, "&frac14;"], [0, "&frac12;"], [0, "&frac34;"], [0, "&iquest;"], [0, "&Agrave;"], [0, "&Aacute;"], [0, "&Acirc;"], [0, "&Atilde;"], [0, "&Auml;"], [0, "&angst;"], [0, "&AElig;"], [0, "&Ccedil;"], [0, "&Egrave;"], [0, "&Eacute;"], [0, "&Ecirc;"], [0, "&Euml;"], [0, "&Igrave;"], [0, "&Iacute;"], [0, "&Icirc;"], [0, "&Iuml;"], [0, "&ETH;"], [0, "&Ntilde;"], [0, "&Ograve;"], [0, "&Oacute;"], [0, "&Ocirc;"], [0, "&Otilde;"], [0, "&Ouml;"], [0, "&times;"], [0, "&Oslash;"], [0, "&Ugrave;"], [0, "&Uacute;"], [0, "&Ucirc;"], [0, "&Uuml;"], [0, "&Yacute;"], [0, "&THORN;"], [0, "&szlig;"], [0, "&agrave;"], [0, "&aacute;"], [0, "&acirc;"], [0, "&atilde;"], [0, "&auml;"], [0, "&aring;"], [0, "&aelig;"], [0, "&ccedil;"], [0, "&egrave;"], [0, "&eacute;"], [0, "&ecirc;"], [0, "&euml;"], [0, "&igrave;"], [0, "&iacute;"], [0, "&icirc;"], [0, "&iuml;"], [0, "&eth;"], [0, "&ntilde;"], [0, "&ograve;"], [0, "&oacute;"], [0, "&ocirc;"], [0, "&otilde;"], [0, "&ouml;"], [0, "&div;"], [0, "&oslash;"], [0, "&ugrave;"], [0, "&uacute;"], [0, "&ucirc;"], [0, "&uuml;"], [0, "&yacute;"], [0, "&thorn;"], [0, "&yuml;"], [0, "&Amacr;"], [0, "&amacr;"], [0, "&Abreve;"], [0, "&abreve;"], [0, "&Aogon;"], [0, "&aogon;"], [0, "&Cacute;"], [0, "&cacute;"], [0, "&Ccirc;"], [0, "&ccirc;"], [0, "&Cdot;"], [0, "&cdot;"], [0, "&Ccaron;"], [0, "&ccaron;"], [0, "&Dcaron;"], [0, "&dcaron;"], [0, "&Dstrok;"], [0, "&dstrok;"], [0, "&Emacr;"], [0, "&emacr;"], [2, "&Edot;"], [0, "&edot;"], [0, "&Eogon;"], [0, "&eogon;"], [0, "&Ecaron;"], [0, "&ecaron;"], [0, "&Gcirc;"], [0, "&gcirc;"], [0, "&Gbreve;"], [0, "&gbreve;"], [0, "&Gdot;"], [0, "&gdot;"], [0, "&Gcedil;"], [1, "&Hcirc;"], [0, "&hcirc;"], [0, "&Hstrok;"], [0, "&hstrok;"], [0, "&Itilde;"], [0, "&itilde;"], [0, "&Imacr;"], [0, "&imacr;"], [2, "&Iogon;"], [0, "&iogon;"], [0, "&Idot;"], [0, "&imath;"], [0, "&IJlig;"], [0, "&ijlig;"], [0, "&Jcirc;"], [0, "&jcirc;"], [0, "&Kcedil;"], [0, "&kcedil;"], [0, "&kgreen;"], [0, "&Lacute;"], [0, "&lacute;"], [0, "&Lcedil;"], [0, "&lcedil;"], [0, "&Lcaron;"], [0, "&lcaron;"], [0, "&Lmidot;"], [0, "&lmidot;"], [0, "&Lstrok;"], [0, "&lstrok;"], [0, "&Nacute;"], [0, "&nacute;"], [0, "&Ncedil;"], [0, "&ncedil;"], [0, "&Ncaron;"], [0, "&ncaron;"], [0, "&napos;"], [0, "&ENG;"], [0, "&eng;"], [0, "&Omacr;"], [0, "&omacr;"], [2, "&Odblac;"], [0, "&odblac;"], [0, "&OElig;"], [0, "&oelig;"], [0, "&Racute;"], [0, "&racute;"], [0, "&Rcedil;"], [0, "&rcedil;"], [0, "&Rcaron;"], [0, "&rcaron;"], [0, "&Sacute;"], [0, "&sacute;"], [0, "&Scirc;"], [0, "&scirc;"], [0, "&Scedil;"], [0, "&scedil;"], [0, "&Scaron;"], [0, "&scaron;"], [0, "&Tcedil;"], [0, "&tcedil;"], [0, "&Tcaron;"], [0, "&tcaron;"], [0, "&Tstrok;"], [0, "&tstrok;"], [0, "&Utilde;"], [0, "&utilde;"], [0, "&Umacr;"], [0, "&umacr;"], [0, "&Ubreve;"], [0, "&ubreve;"], [0, "&Uring;"], [0, "&uring;"], [0, "&Udblac;"], [0, "&udblac;"], [0, "&Uogon;"], [0, "&uogon;"], [0, "&Wcirc;"], [0, "&wcirc;"], [0, "&Ycirc;"], [0, "&ycirc;"], [0, "&Yuml;"], [0, "&Zacute;"], [0, "&zacute;"], [0, "&Zdot;"], [0, "&zdot;"], [0, "&Zcaron;"], [0, "&zcaron;"], [19, "&fnof;"], [34, "&imped;"], [63, "&gacute;"], [65, "&jmath;"], [142, "&circ;"], [0, "&caron;"], [16, "&breve;"], [0, "&DiacriticalDot;"], [0, "&ring;"], [0, "&ogon;"], [0, "&DiacriticalTilde;"], [0, "&dblac;"], [51, "&DownBreve;"], [127, "&Alpha;"], [0, "&Beta;"], [0, "&Gamma;"], [0, "&Delta;"], [0, "&Epsilon;"], [0, "&Zeta;"], [0, "&Eta;"], [0, "&Theta;"], [0, "&Iota;"], [0, "&Kappa;"], [0, "&Lambda;"], [0, "&Mu;"], [0, "&Nu;"], [0, "&Xi;"], [0, "&Omicron;"], [0, "&Pi;"], [0, "&Rho;"], [1, "&Sigma;"], [0, "&Tau;"], [0, "&Upsilon;"], [0, "&Phi;"], [0, "&Chi;"], [0, "&Psi;"], [0, "&ohm;"], [7, "&alpha;"], [0, "&beta;"], [0, "&gamma;"], [0, "&delta;"], [0, "&epsi;"], [0, "&zeta;"], [0, "&eta;"], [0, "&theta;"], [0, "&iota;"], [0, "&kappa;"], [0, "&lambda;"], [0, "&mu;"], [0, "&nu;"], [0, "&xi;"], [0, "&omicron;"], [0, "&pi;"], [0, "&rho;"], [0, "&sigmaf;"], [0, "&sigma;"], [0, "&tau;"], [0, "&upsi;"], [0, "&phi;"], [0, "&chi;"], [0, "&psi;"], [0, "&omega;"], [7, "&thetasym;"], [0, "&Upsi;"], [2, "&phiv;"], [0, "&piv;"], [5, "&Gammad;"], [0, "&digamma;"], [18, "&kappav;"], [0, "&rhov;"], [3, "&epsiv;"], [0, "&backepsilon;"], [10, "&IOcy;"], [0, "&DJcy;"], [0, "&GJcy;"], [0, "&Jukcy;"], [0, "&DScy;"], [0, "&Iukcy;"], [0, "&YIcy;"], [0, "&Jsercy;"], [0, "&LJcy;"], [0, "&NJcy;"], [0, "&TSHcy;"], [0, "&KJcy;"], [1, "&Ubrcy;"], [0, "&DZcy;"], [0, "&Acy;"], [0, "&Bcy;"], [0, "&Vcy;"], [0, "&Gcy;"], [0, "&Dcy;"], [0, "&IEcy;"], [0, "&ZHcy;"], [0, "&Zcy;"], [0, "&Icy;"], [0, "&Jcy;"], [0, "&Kcy;"], [0, "&Lcy;"], [0, "&Mcy;"], [0, "&Ncy;"], [0, "&Ocy;"], [0, "&Pcy;"], [0, "&Rcy;"], [0, "&Scy;"], [0, "&Tcy;"], [0, "&Ucy;"], [0, "&Fcy;"], [0, "&KHcy;"], [0, "&TScy;"], [0, "&CHcy;"], [0, "&SHcy;"], [0, "&SHCHcy;"], [0, "&HARDcy;"], [0, "&Ycy;"], [0, "&SOFTcy;"], [0, "&Ecy;"], [0, "&YUcy;"], [0, "&YAcy;"], [0, "&acy;"], [0, "&bcy;"], [0, "&vcy;"], [0, "&gcy;"], [0, "&dcy;"], [0, "&iecy;"], [0, "&zhcy;"], [0, "&zcy;"], [0, "&icy;"], [0, "&jcy;"], [0, "&kcy;"], [0, "&lcy;"], [0, "&mcy;"], [0, "&ncy;"], [0, "&ocy;"], [0, "&pcy;"], [0, "&rcy;"], [0, "&scy;"], [0, "&tcy;"], [0, "&ucy;"], [0, "&fcy;"], [0, "&khcy;"], [0, "&tscy;"], [0, "&chcy;"], [0, "&shcy;"], [0, "&shchcy;"], [0, "&hardcy;"], [0, "&ycy;"], [0, "&softcy;"], [0, "&ecy;"], [0, "&yucy;"], [0, "&yacy;"], [1, "&iocy;"], [0, "&djcy;"], [0, "&gjcy;"], [0, "&jukcy;"], [0, "&dscy;"], [0, "&iukcy;"], [0, "&yicy;"], [0, "&jsercy;"], [0, "&ljcy;"], [0, "&njcy;"], [0, "&tshcy;"], [0, "&kjcy;"], [1, "&ubrcy;"], [0, "&dzcy;"], [7074, "&ensp;"], [0, "&emsp;"], [0, "&emsp13;"], [0, "&emsp14;"], [1, "&numsp;"], [0, "&puncsp;"], [0, "&ThinSpace;"], [0, "&hairsp;"], [0, "&NegativeMediumSpace;"], [0, "&zwnj;"], [0, "&zwj;"], [0, "&lrm;"], [0, "&rlm;"], [0, "&dash;"], [2, "&ndash;"], [0, "&mdash;"], [0, "&horbar;"], [0, "&Verbar;"], [1, "&lsquo;"], [0, "&CloseCurlyQuote;"], [0, "&lsquor;"], [1, "&ldquo;"], [0, "&CloseCurlyDoubleQuote;"], [0, "&bdquo;"], [1, "&dagger;"], [0, "&Dagger;"], [0, "&bull;"], [2, "&nldr;"], [0, "&hellip;"], [9, "&permil;"], [0, "&pertenk;"], [0, "&prime;"], [0, "&Prime;"], [0, "&tprime;"], [0, "&backprime;"], [3, "&lsaquo;"], [0, "&rsaquo;"], [3, "&oline;"], [2, "&caret;"], [1, "&hybull;"], [0, "&frasl;"], [10, "&bsemi;"], [7, "&qprime;"], [7, { v: "&MediumSpace;", n: 8202, o: "&ThickSpace;" }], [0, "&NoBreak;"], [0, "&af;"], [0, "&InvisibleTimes;"], [0, "&ic;"], [72, "&euro;"], [46, "&tdot;"], [0, "&DotDot;"], [37, "&complexes;"], [2, "&incare;"], [4, "&gscr;"], [0, "&hamilt;"], [0, "&Hfr;"], [0, "&Hopf;"], [0, "&planckh;"], [0, "&hbar;"], [0, "&imagline;"], [0, "&Ifr;"], [0, "&lagran;"], [0, "&ell;"], [1, "&naturals;"], [0, "&numero;"], [0, "&copysr;"], [0, "&weierp;"], [0, "&Popf;"], [0, "&Qopf;"], [0, "&realine;"], [0, "&real;"], [0, "&reals;"], [0, "&rx;"], [3, "&trade;"], [1, "&integers;"], [2, "&mho;"], [0, "&zeetrf;"], [0, "&iiota;"], [2, "&bernou;"], [0, "&Cayleys;"], [1, "&escr;"], [0, "&Escr;"], [0, "&Fouriertrf;"], [1, "&Mellintrf;"], [0, "&order;"], [0, "&alefsym;"], [0, "&beth;"], [0, "&gimel;"], [0, "&daleth;"], [12, "&CapitalDifferentialD;"], [0, "&dd;"], [0, "&ee;"], [0, "&ii;"], [10, "&frac13;"], [0, "&frac23;"], [0, "&frac15;"], [0, "&frac25;"], [0, "&frac35;"], [0, "&frac45;"], [0, "&frac16;"], [0, "&frac56;"], [0, "&frac18;"], [0, "&frac38;"], [0, "&frac58;"], [0, "&frac78;"], [49, "&larr;"], [0, "&ShortUpArrow;"], [0, "&rarr;"], [0, "&darr;"], [0, "&harr;"], [0, "&updownarrow;"], [0, "&nwarr;"], [0, "&nearr;"], [0, "&LowerRightArrow;"], [0, "&LowerLeftArrow;"], [0, "&nlarr;"], [0, "&nrarr;"], [1, { v: "&rarrw;", n: 824, o: "&nrarrw;" }], [0, "&Larr;"], [0, "&Uarr;"], [0, "&Rarr;"], [0, "&Darr;"], [0, "&larrtl;"], [0, "&rarrtl;"], [0, "&LeftTeeArrow;"], [0, "&mapstoup;"], [0, "&map;"], [0, "&DownTeeArrow;"], [1, "&hookleftarrow;"], [0, "&hookrightarrow;"], [0, "&larrlp;"], [0, "&looparrowright;"], [0, "&harrw;"], [0, "&nharr;"], [1, "&lsh;"], [0, "&rsh;"], [0, "&ldsh;"], [0, "&rdsh;"], [1, "&crarr;"], [0, "&cularr;"], [0, "&curarr;"], [2, "&circlearrowleft;"], [0, "&circlearrowright;"], [0, "&leftharpoonup;"], [0, "&DownLeftVector;"], [0, "&RightUpVector;"], [0, "&LeftUpVector;"], [0, "&rharu;"], [0, "&DownRightVector;"], [0, "&dharr;"], [0, "&dharl;"], [0, "&RightArrowLeftArrow;"], [0, "&udarr;"], [0, "&LeftArrowRightArrow;"], [0, "&leftleftarrows;"], [0, "&upuparrows;"], [0, "&rightrightarrows;"], [0, "&ddarr;"], [0, "&leftrightharpoons;"], [0, "&Equilibrium;"], [0, "&nlArr;"], [0, "&nhArr;"], [0, "&nrArr;"], [0, "&DoubleLeftArrow;"], [0, "&DoubleUpArrow;"], [0, "&DoubleRightArrow;"], [0, "&dArr;"], [0, "&DoubleLeftRightArrow;"], [0, "&DoubleUpDownArrow;"], [0, "&nwArr;"], [0, "&neArr;"], [0, "&seArr;"], [0, "&swArr;"], [0, "&lAarr;"], [0, "&rAarr;"], [1, "&zigrarr;"], [6, "&larrb;"], [0, "&rarrb;"], [15, "&DownArrowUpArrow;"], [7, "&loarr;"], [0, "&roarr;"], [0, "&hoarr;"], [0, "&forall;"], [0, "&comp;"], [0, { v: "&part;", n: 824, o: "&npart;" }], [0, "&exist;"], [0, "&nexist;"], [0, "&empty;"], [1, "&Del;"], [0, "&Element;"], [0, "&NotElement;"], [1, "&ni;"], [0, "&notni;"], [2, "&prod;"], [0, "&coprod;"], [0, "&sum;"], [0, "&minus;"], [0, "&MinusPlus;"], [0, "&dotplus;"], [1, "&Backslash;"], [0, "&lowast;"], [0, "&compfn;"], [1, "&radic;"], [2, "&prop;"], [0, "&infin;"], [0, "&angrt;"], [0, { v: "&ang;", n: 8402, o: "&nang;" }], [0, "&angmsd;"], [0, "&angsph;"], [0, "&mid;"], [0, "&nmid;"], [0, "&DoubleVerticalBar;"], [0, "&NotDoubleVerticalBar;"], [0, "&and;"], [0, "&or;"], [0, { v: "&cap;", n: 65024, o: "&caps;" }], [0, { v: "&cup;", n: 65024, o: "&cups;" }], [0, "&int;"], [0, "&Int;"], [0, "&iiint;"], [0, "&conint;"], [0, "&Conint;"], [0, "&Cconint;"], [0, "&cwint;"], [0, "&ClockwiseContourIntegral;"], [0, "&awconint;"], [0, "&there4;"], [0, "&becaus;"], [0, "&ratio;"], [0, "&Colon;"], [0, "&dotminus;"], [1, "&mDDot;"], [0, "&homtht;"], [0, { v: "&sim;", n: 8402, o: "&nvsim;" }], [0, { v: "&backsim;", n: 817, o: "&race;" }], [0, { v: "&ac;", n: 819, o: "&acE;" }], [0, "&acd;"], [0, "&VerticalTilde;"], [0, "&NotTilde;"], [0, { v: "&eqsim;", n: 824, o: "&nesim;" }], [0, "&sime;"], [0, "&NotTildeEqual;"], [0, "&cong;"], [0, "&simne;"], [0, "&ncong;"], [0, "&ap;"], [0, "&nap;"], [0, "&ape;"], [0, { v: "&apid;", n: 824, o: "&napid;" }], [0, "&backcong;"], [0, { v: "&asympeq;", n: 8402, o: "&nvap;" }], [0, { v: "&bump;", n: 824, o: "&nbump;" }], [0, { v: "&bumpe;", n: 824, o: "&nbumpe;" }], [0, { v: "&doteq;", n: 824, o: "&nedot;" }], [0, "&doteqdot;"], [0, "&efDot;"], [0, "&erDot;"], [0, "&Assign;"], [0, "&ecolon;"], [0, "&ecir;"], [0, "&circeq;"], [1, "&wedgeq;"], [0, "&veeeq;"], [1, "&triangleq;"], [2, "&equest;"], [0, "&ne;"], [0, { v: "&Congruent;", n: 8421, o: "&bnequiv;" }], [0, "&nequiv;"], [1, { v: "&le;", n: 8402, o: "&nvle;" }], [0, { v: "&ge;", n: 8402, o: "&nvge;" }], [0, { v: "&lE;", n: 824, o: "&nlE;" }], [0, { v: "&gE;", n: 824, o: "&ngE;" }], [0, { v: "&lnE;", n: 65024, o: "&lvertneqq;" }], [0, { v: "&gnE;", n: 65024, o: "&gvertneqq;" }], [0, { v: "&ll;", n: new Map(/* @__PURE__ */ restoreDiff([[824, "&nLtv;"], [7577, "&nLt;"]])) }], [0, { v: "&gg;", n: new Map(/* @__PURE__ */ restoreDiff([[824, "&nGtv;"], [7577, "&nGt;"]])) }], [0, "&between;"], [0, "&NotCupCap;"], [0, "&nless;"], [0, "&ngt;"], [0, "&nle;"], [0, "&nge;"], [0, "&lesssim;"], [0, "&GreaterTilde;"], [0, "&nlsim;"], [0, "&ngsim;"], [0, "&LessGreater;"], [0, "&gl;"], [0, "&NotLessGreater;"], [0, "&NotGreaterLess;"], [0, "&pr;"], [0, "&sc;"], [0, "&prcue;"], [0, "&sccue;"], [0, "&PrecedesTilde;"], [0, { v: "&scsim;", n: 824, o: "&NotSucceedsTilde;" }], [0, "&NotPrecedes;"], [0, "&NotSucceeds;"], [0, { v: "&sub;", n: 8402, o: "&NotSubset;" }], [0, { v: "&sup;", n: 8402, o: "&NotSuperset;" }], [0, "&nsub;"], [0, "&nsup;"], [0, "&sube;"], [0, "&supe;"], [0, "&NotSubsetEqual;"], [0, "&NotSupersetEqual;"], [0, { v: "&subne;", n: 65024, o: "&varsubsetneq;" }], [0, { v: "&supne;", n: 65024, o: "&varsupsetneq;" }], [1, "&cupdot;"], [0, "&UnionPlus;"], [0, { v: "&sqsub;", n: 824, o: "&NotSquareSubset;" }], [0, { v: "&sqsup;", n: 824, o: "&NotSquareSuperset;" }], [0, "&sqsube;"], [0, "&sqsupe;"], [0, { v: "&sqcap;", n: 65024, o: "&sqcaps;" }], [0, { v: "&sqcup;", n: 65024, o: "&sqcups;" }], [0, "&CirclePlus;"], [0, "&CircleMinus;"], [0, "&CircleTimes;"], [0, "&osol;"], [0, "&CircleDot;"], [0, "&circledcirc;"], [0, "&circledast;"], [1, "&circleddash;"], [0, "&boxplus;"], [0, "&boxminus;"], [0, "&boxtimes;"], [0, "&dotsquare;"], [0, "&RightTee;"], [0, "&dashv;"], [0, "&DownTee;"], [0, "&bot;"], [1, "&models;"], [0, "&DoubleRightTee;"], [0, "&Vdash;"], [0, "&Vvdash;"], [0, "&VDash;"], [0, "&nvdash;"], [0, "&nvDash;"], [0, "&nVdash;"], [0, "&nVDash;"], [0, "&prurel;"], [1, "&LeftTriangle;"], [0, "&RightTriangle;"], [0, { v: "&LeftTriangleEqual;", n: 8402, o: "&nvltrie;" }], [0, { v: "&RightTriangleEqual;", n: 8402, o: "&nvrtrie;" }], [0, "&origof;"], [0, "&imof;"], [0, "&multimap;"], [0, "&hercon;"], [0, "&intcal;"], [0, "&veebar;"], [1, "&barvee;"], [0, "&angrtvb;"], [0, "&lrtri;"], [0, "&bigwedge;"], [0, "&bigvee;"], [0, "&bigcap;"], [0, "&bigcup;"], [0, "&diam;"], [0, "&sdot;"], [0, "&sstarf;"], [0, "&divideontimes;"], [0, "&bowtie;"], [0, "&ltimes;"], [0, "&rtimes;"], [0, "&leftthreetimes;"], [0, "&rightthreetimes;"], [0, "&backsimeq;"], [0, "&curlyvee;"], [0, "&curlywedge;"], [0, "&Sub;"], [0, "&Sup;"], [0, "&Cap;"], [0, "&Cup;"], [0, "&fork;"], [0, "&epar;"], [0, "&lessdot;"], [0, "&gtdot;"], [0, { v: "&Ll;", n: 824, o: "&nLl;" }], [0, { v: "&Gg;", n: 824, o: "&nGg;" }], [0, { v: "&leg;", n: 65024, o: "&lesg;" }], [0, { v: "&gel;", n: 65024, o: "&gesl;" }], [2, "&cuepr;"], [0, "&cuesc;"], [0, "&NotPrecedesSlantEqual;"], [0, "&NotSucceedsSlantEqual;"], [0, "&NotSquareSubsetEqual;"], [0, "&NotSquareSupersetEqual;"], [2, "&lnsim;"], [0, "&gnsim;"], [0, "&precnsim;"], [0, "&scnsim;"], [0, "&nltri;"], [0, "&NotRightTriangle;"], [0, "&nltrie;"], [0, "&NotRightTriangleEqual;"], [0, "&vellip;"], [0, "&ctdot;"], [0, "&utdot;"], [0, "&dtdot;"], [0, "&disin;"], [0, "&isinsv;"], [0, "&isins;"], [0, { v: "&isindot;", n: 824, o: "&notindot;" }], [0, "&notinvc;"], [0, "&notinvb;"], [1, { v: "&isinE;", n: 824, o: "&notinE;" }], [0, "&nisd;"], [0, "&xnis;"], [0, "&nis;"], [0, "&notnivc;"], [0, "&notnivb;"], [6, "&barwed;"], [0, "&Barwed;"], [1, "&lceil;"], [0, "&rceil;"], [0, "&LeftFloor;"], [0, "&rfloor;"], [0, "&drcrop;"], [0, "&dlcrop;"], [0, "&urcrop;"], [0, "&ulcrop;"], [0, "&bnot;"], [1, "&profline;"], [0, "&profsurf;"], [1, "&telrec;"], [0, "&target;"], [5, "&ulcorn;"], [0, "&urcorn;"], [0, "&dlcorn;"], [0, "&drcorn;"], [2, "&frown;"], [0, "&smile;"], [9, "&cylcty;"], [0, "&profalar;"], [7, "&topbot;"], [6, "&ovbar;"], [1, "&solbar;"], [60, "&angzarr;"], [51, "&lmoustache;"], [0, "&rmoustache;"], [2, "&OverBracket;"], [0, "&bbrk;"], [0, "&bbrktbrk;"], [37, "&OverParenthesis;"], [0, "&UnderParenthesis;"], [0, "&OverBrace;"], [0, "&UnderBrace;"], [2, "&trpezium;"], [4, "&elinters;"], [59, "&blank;"], [164, "&circledS;"], [55, "&boxh;"], [1, "&boxv;"], [9, "&boxdr;"], [3, "&boxdl;"], [3, "&boxur;"], [3, "&boxul;"], [3, "&boxvr;"], [7, "&boxvl;"], [7, "&boxhd;"], [7, "&boxhu;"], [7, "&boxvh;"], [19, "&boxH;"], [0, "&boxV;"], [0, "&boxdR;"], [0, "&boxDr;"], [0, "&boxDR;"], [0, "&boxdL;"], [0, "&boxDl;"], [0, "&boxDL;"], [0, "&boxuR;"], [0, "&boxUr;"], [0, "&boxUR;"], [0, "&boxuL;"], [0, "&boxUl;"], [0, "&boxUL;"], [0, "&boxvR;"], [0, "&boxVr;"], [0, "&boxVR;"], [0, "&boxvL;"], [0, "&boxVl;"], [0, "&boxVL;"], [0, "&boxHd;"], [0, "&boxhD;"], [0, "&boxHD;"], [0, "&boxHu;"], [0, "&boxhU;"], [0, "&boxHU;"], [0, "&boxvH;"], [0, "&boxVh;"], [0, "&boxVH;"], [19, "&uhblk;"], [3, "&lhblk;"], [3, "&block;"], [8, "&blk14;"], [0, "&blk12;"], [0, "&blk34;"], [13, "&square;"], [8, "&blacksquare;"], [0, "&EmptyVerySmallSquare;"], [1, "&rect;"], [0, "&marker;"], [2, "&fltns;"], [1, "&bigtriangleup;"], [0, "&blacktriangle;"], [0, "&triangle;"], [2, "&blacktriangleright;"], [0, "&rtri;"], [3, "&bigtriangledown;"], [0, "&blacktriangledown;"], [0, "&dtri;"], [2, "&blacktriangleleft;"], [0, "&ltri;"], [6, "&loz;"], [0, "&cir;"], [32, "&tridot;"], [2, "&bigcirc;"], [8, "&ultri;"], [0, "&urtri;"], [0, "&lltri;"], [0, "&EmptySmallSquare;"], [0, "&FilledSmallSquare;"], [8, "&bigstar;"], [0, "&star;"], [7, "&phone;"], [49, "&female;"], [1, "&male;"], [29, "&spades;"], [2, "&clubs;"], [1, "&hearts;"], [0, "&diamondsuit;"], [3, "&sung;"], [2, "&flat;"], [0, "&natural;"], [0, "&sharp;"], [163, "&check;"], [3, "&cross;"], [8, "&malt;"], [21, "&sext;"], [33, "&VerticalSeparator;"], [25, "&lbbrk;"], [0, "&rbbrk;"], [84, "&bsolhsub;"], [0, "&suphsol;"], [28, "&LeftDoubleBracket;"], [0, "&RightDoubleBracket;"], [0, "&lang;"], [0, "&rang;"], [0, "&Lang;"], [0, "&Rang;"], [0, "&loang;"], [0, "&roang;"], [7, "&longleftarrow;"], [0, "&longrightarrow;"], [0, "&longleftrightarrow;"], [0, "&DoubleLongLeftArrow;"], [0, "&DoubleLongRightArrow;"], [0, "&DoubleLongLeftRightArrow;"], [1, "&longmapsto;"], [2, "&dzigrarr;"], [258, "&nvlArr;"], [0, "&nvrArr;"], [0, "&nvHarr;"], [0, "&Map;"], [6, "&lbarr;"], [0, "&bkarow;"], [0, "&lBarr;"], [0, "&dbkarow;"], [0, "&drbkarow;"], [0, "&DDotrahd;"], [0, "&UpArrowBar;"], [0, "&DownArrowBar;"], [2, "&Rarrtl;"], [2, "&latail;"], [0, "&ratail;"], [0, "&lAtail;"], [0, "&rAtail;"], [0, "&larrfs;"], [0, "&rarrfs;"], [0, "&larrbfs;"], [0, "&rarrbfs;"], [2, "&nwarhk;"], [0, "&nearhk;"], [0, "&hksearow;"], [0, "&hkswarow;"], [0, "&nwnear;"], [0, "&nesear;"], [0, "&seswar;"], [0, "&swnwar;"], [8, { v: "&rarrc;", n: 824, o: "&nrarrc;" }], [1, "&cudarrr;"], [0, "&ldca;"], [0, "&rdca;"], [0, "&cudarrl;"], [0, "&larrpl;"], [2, "&curarrm;"], [0, "&cularrp;"], [7, "&rarrpl;"], [2, "&harrcir;"], [0, "&Uarrocir;"], [0, "&lurdshar;"], [0, "&ldrushar;"], [2, "&LeftRightVector;"], [0, "&RightUpDownVector;"], [0, "&DownLeftRightVector;"], [0, "&LeftUpDownVector;"], [0, "&LeftVectorBar;"], [0, "&RightVectorBar;"], [0, "&RightUpVectorBar;"], [0, "&RightDownVectorBar;"], [0, "&DownLeftVectorBar;"], [0, "&DownRightVectorBar;"], [0, "&LeftUpVectorBar;"], [0, "&LeftDownVectorBar;"], [0, "&LeftTeeVector;"], [0, "&RightTeeVector;"], [0, "&RightUpTeeVector;"], [0, "&RightDownTeeVector;"], [0, "&DownLeftTeeVector;"], [0, "&DownRightTeeVector;"], [0, "&LeftUpTeeVector;"], [0, "&LeftDownTeeVector;"], [0, "&lHar;"], [0, "&uHar;"], [0, "&rHar;"], [0, "&dHar;"], [0, "&luruhar;"], [0, "&ldrdhar;"], [0, "&ruluhar;"], [0, "&rdldhar;"], [0, "&lharul;"], [0, "&llhard;"], [0, "&rharul;"], [0, "&lrhard;"], [0, "&udhar;"], [0, "&duhar;"], [0, "&RoundImplies;"], [0, "&erarr;"], [0, "&simrarr;"], [0, "&larrsim;"], [0, "&rarrsim;"], [0, "&rarrap;"], [0, "&ltlarr;"], [1, "&gtrarr;"], [0, "&subrarr;"], [1, "&suplarr;"], [0, "&lfisht;"], [0, "&rfisht;"], [0, "&ufisht;"], [0, "&dfisht;"], [5, "&lopar;"], [0, "&ropar;"], [4, "&lbrke;"], [0, "&rbrke;"], [0, "&lbrkslu;"], [0, "&rbrksld;"], [0, "&lbrksld;"], [0, "&rbrkslu;"], [0, "&langd;"], [0, "&rangd;"], [0, "&lparlt;"], [0, "&rpargt;"], [0, "&gtlPar;"], [0, "&ltrPar;"], [3, "&vzigzag;"], [1, "&vangrt;"], [0, "&angrtvbd;"], [6, "&ange;"], [0, "&range;"], [0, "&dwangle;"], [0, "&uwangle;"], [0, "&angmsdaa;"], [0, "&angmsdab;"], [0, "&angmsdac;"], [0, "&angmsdad;"], [0, "&angmsdae;"], [0, "&angmsdaf;"], [0, "&angmsdag;"], [0, "&angmsdah;"], [0, "&bemptyv;"], [0, "&demptyv;"], [0, "&cemptyv;"], [0, "&raemptyv;"], [0, "&laemptyv;"], [0, "&ohbar;"], [0, "&omid;"], [0, "&opar;"], [1, "&operp;"], [1, "&olcross;"], [0, "&odsold;"], [1, "&olcir;"], [0, "&ofcir;"], [0, "&olt;"], [0, "&ogt;"], [0, "&cirscir;"], [0, "&cirE;"], [0, "&solb;"], [0, "&bsolb;"], [3, "&boxbox;"], [3, "&trisb;"], [0, "&rtriltri;"], [0, { v: "&LeftTriangleBar;", n: 824, o: "&NotLeftTriangleBar;" }], [0, { v: "&RightTriangleBar;", n: 824, o: "&NotRightTriangleBar;" }], [11, "&iinfin;"], [0, "&infintie;"], [0, "&nvinfin;"], [4, "&eparsl;"], [0, "&smeparsl;"], [0, "&eqvparsl;"], [5, "&blacklozenge;"], [8, "&RuleDelayed;"], [1, "&dsol;"], [9, "&bigodot;"], [0, "&bigoplus;"], [0, "&bigotimes;"], [1, "&biguplus;"], [1, "&bigsqcup;"], [5, "&iiiint;"], [0, "&fpartint;"], [2, "&cirfnint;"], [0, "&awint;"], [0, "&rppolint;"], [0, "&scpolint;"], [0, "&npolint;"], [0, "&pointint;"], [0, "&quatint;"], [0, "&intlarhk;"], [10, "&pluscir;"], [0, "&plusacir;"], [0, "&simplus;"], [0, "&plusdu;"], [0, "&plussim;"], [0, "&plustwo;"], [1, "&mcomma;"], [0, "&minusdu;"], [2, "&loplus;"], [0, "&roplus;"], [0, "&Cross;"], [0, "&timesd;"], [0, "&timesbar;"], [1, "&smashp;"], [0, "&lotimes;"], [0, "&rotimes;"], [0, "&otimesas;"], [0, "&Otimes;"], [0, "&odiv;"], [0, "&triplus;"], [0, "&triminus;"], [0, "&tritime;"], [0, "&intprod;"], [2, "&amalg;"], [0, "&capdot;"], [1, "&ncup;"], [0, "&ncap;"], [0, "&capand;"], [0, "&cupor;"], [0, "&cupcap;"], [0, "&capcup;"], [0, "&cupbrcap;"], [0, "&capbrcup;"], [0, "&cupcup;"], [0, "&capcap;"], [0, "&ccups;"], [0, "&ccaps;"], [2, "&ccupssm;"], [2, "&And;"], [0, "&Or;"], [0, "&andand;"], [0, "&oror;"], [0, "&orslope;"], [0, "&andslope;"], [1, "&andv;"], [0, "&orv;"], [0, "&andd;"], [0, "&ord;"], [1, "&wedbar;"], [6, "&sdote;"], [3, "&simdot;"], [2, { v: "&congdot;", n: 824, o: "&ncongdot;" }], [0, "&easter;"], [0, "&apacir;"], [0, { v: "&apE;", n: 824, o: "&napE;" }], [0, "&eplus;"], [0, "&pluse;"], [0, "&Esim;"], [0, "&Colone;"], [0, "&Equal;"], [1, "&ddotseq;"], [0, "&equivDD;"], [0, "&ltcir;"], [0, "&gtcir;"], [0, "&ltquest;"], [0, "&gtquest;"], [0, { v: "&leqslant;", n: 824, o: "&nleqslant;" }], [0, { v: "&geqslant;", n: 824, o: "&ngeqslant;" }], [0, "&lesdot;"], [0, "&gesdot;"], [0, "&lesdoto;"], [0, "&gesdoto;"], [0, "&lesdotor;"], [0, "&gesdotol;"], [0, "&lap;"], [0, "&gap;"], [0, "&lne;"], [0, "&gne;"], [0, "&lnap;"], [0, "&gnap;"], [0, "&lEg;"], [0, "&gEl;"], [0, "&lsime;"], [0, "&gsime;"], [0, "&lsimg;"], [0, "&gsiml;"], [0, "&lgE;"], [0, "&glE;"], [0, "&lesges;"], [0, "&gesles;"], [0, "&els;"], [0, "&egs;"], [0, "&elsdot;"], [0, "&egsdot;"], [0, "&el;"], [0, "&eg;"], [2, "&siml;"], [0, "&simg;"], [0, "&simlE;"], [0, "&simgE;"], [0, { v: "&LessLess;", n: 824, o: "&NotNestedLessLess;" }], [0, { v: "&GreaterGreater;", n: 824, o: "&NotNestedGreaterGreater;" }], [1, "&glj;"], [0, "&gla;"], [0, "&ltcc;"], [0, "&gtcc;"], [0, "&lescc;"], [0, "&gescc;"], [0, "&smt;"], [0, "&lat;"], [0, { v: "&smte;", n: 65024, o: "&smtes;" }], [0, { v: "&late;", n: 65024, o: "&lates;" }], [0, "&bumpE;"], [0, { v: "&PrecedesEqual;", n: 824, o: "&NotPrecedesEqual;" }], [0, { v: "&sce;", n: 824, o: "&NotSucceedsEqual;" }], [2, "&prE;"], [0, "&scE;"], [0, "&precneqq;"], [0, "&scnE;"], [0, "&prap;"], [0, "&scap;"], [0, "&precnapprox;"], [0, "&scnap;"], [0, "&Pr;"], [0, "&Sc;"], [0, "&subdot;"], [0, "&supdot;"], [0, "&subplus;"], [0, "&supplus;"], [0, "&submult;"], [0, "&supmult;"], [0, "&subedot;"], [0, "&supedot;"], [0, { v: "&subE;", n: 824, o: "&nsubE;" }], [0, { v: "&supE;", n: 824, o: "&nsupE;" }], [0, "&subsim;"], [0, "&supsim;"], [2, { v: "&subnE;", n: 65024, o: "&varsubsetneqq;" }], [0, { v: "&supnE;", n: 65024, o: "&varsupsetneqq;" }], [2, "&csub;"], [0, "&csup;"], [0, "&csube;"], [0, "&csupe;"], [0, "&subsup;"], [0, "&supsub;"], [0, "&subsub;"], [0, "&supsup;"], [0, "&suphsub;"], [0, "&supdsub;"], [0, "&forkv;"], [0, "&topfork;"], [0, "&mlcp;"], [8, "&Dashv;"], [1, "&Vdashl;"], [0, "&Barv;"], [0, "&vBar;"], [0, "&vBarv;"], [1, "&Vbar;"], [0, "&Not;"], [0, "&bNot;"], [0, "&rnmid;"], [0, "&cirmid;"], [0, "&midcir;"], [0, "&topcir;"], [0, "&nhpar;"], [0, "&parsim;"], [9, { v: "&parsl;", n: 8421, o: "&nparsl;" }], [44343, { n: new Map(/* @__PURE__ */ restoreDiff([[56476, "&Ascr;"], [1, "&Cscr;"], [0, "&Dscr;"], [2, "&Gscr;"], [2, "&Jscr;"], [0, "&Kscr;"], [2, "&Nscr;"], [0, "&Oscr;"], [0, "&Pscr;"], [0, "&Qscr;"], [1, "&Sscr;"], [0, "&Tscr;"], [0, "&Uscr;"], [0, "&Vscr;"], [0, "&Wscr;"], [0, "&Xscr;"], [0, "&Yscr;"], [0, "&Zscr;"], [0, "&ascr;"], [0, "&bscr;"], [0, "&cscr;"], [0, "&dscr;"], [1, "&fscr;"], [1, "&hscr;"], [0, "&iscr;"], [0, "&jscr;"], [0, "&kscr;"], [0, "&lscr;"], [0, "&mscr;"], [0, "&nscr;"], [1, "&pscr;"], [0, "&qscr;"], [0, "&rscr;"], [0, "&sscr;"], [0, "&tscr;"], [0, "&uscr;"], [0, "&vscr;"], [0, "&wscr;"], [0, "&xscr;"], [0, "&yscr;"], [0, "&zscr;"], [52, "&Afr;"], [0, "&Bfr;"], [1, "&Dfr;"], [0, "&Efr;"], [0, "&Ffr;"], [0, "&Gfr;"], [2, "&Jfr;"], [0, "&Kfr;"], [0, "&Lfr;"], [0, "&Mfr;"], [0, "&Nfr;"], [0, "&Ofr;"], [0, "&Pfr;"], [0, "&Qfr;"], [1, "&Sfr;"], [0, "&Tfr;"], [0, "&Ufr;"], [0, "&Vfr;"], [0, "&Wfr;"], [0, "&Xfr;"], [0, "&Yfr;"], [1, "&afr;"], [0, "&bfr;"], [0, "&cfr;"], [0, "&dfr;"], [0, "&efr;"], [0, "&ffr;"], [0, "&gfr;"], [0, "&hfr;"], [0, "&ifr;"], [0, "&jfr;"], [0, "&kfr;"], [0, "&lfr;"], [0, "&mfr;"], [0, "&nfr;"], [0, "&ofr;"], [0, "&pfr;"], [0, "&qfr;"], [0, "&rfr;"], [0, "&sfr;"], [0, "&tfr;"], [0, "&ufr;"], [0, "&vfr;"], [0, "&wfr;"], [0, "&xfr;"], [0, "&yfr;"], [0, "&zfr;"], [0, "&Aopf;"], [0, "&Bopf;"], [1, "&Dopf;"], [0, "&Eopf;"], [0, "&Fopf;"], [0, "&Gopf;"], [1, "&Iopf;"], [0, "&Jopf;"], [0, "&Kopf;"], [0, "&Lopf;"], [0, "&Mopf;"], [1, "&Oopf;"], [3, "&Sopf;"], [0, "&Topf;"], [0, "&Uopf;"], [0, "&Vopf;"], [0, "&Wopf;"], [0, "&Xopf;"], [0, "&Yopf;"], [1, "&aopf;"], [0, "&bopf;"], [0, "&copf;"], [0, "&dopf;"], [0, "&eopf;"], [0, "&fopf;"], [0, "&gopf;"], [0, "&hopf;"], [0, "&iopf;"], [0, "&jopf;"], [0, "&kopf;"], [0, "&lopf;"], [0, "&mopf;"], [0, "&nopf;"], [0, "&oopf;"], [0, "&popf;"], [0, "&qopf;"], [0, "&ropf;"], [0, "&sopf;"], [0, "&topf;"], [0, "&uopf;"], [0, "&vopf;"], [0, "&wopf;"], [0, "&xopf;"], [0, "&yopf;"], [0, "&zopf;"]])) }], [8906, "&fflig;"], [0, "&filig;"], [0, "&fllig;"], [0, "&ffilig;"], [0, "&ffllig;"]]));

// node_modules/htmlparser2/node_modules/domutils/node_modules/dom-serializer/node_modules/entities/lib/esm/escape.js
var xmlReplacer = /["&'<>$\x80-\uFFFF]/g;
var xmlCodeMap = /* @__PURE__ */ new Map([
  [34, "&quot;"],
  [38, "&amp;"],
  [39, "&apos;"],
  [60, "&lt;"],
  [62, "&gt;"]
]);
var getCodePoint = (
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  String.prototype.codePointAt != null ? (str, index) => str.codePointAt(index) : (
    // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
    (c, index) => (c.charCodeAt(index) & 64512) === 55296 ? (c.charCodeAt(index) - 55296) * 1024 + c.charCodeAt(index + 1) - 56320 + 65536 : c.charCodeAt(index)
  )
);
function encodeXML(str) {
  let ret = "";
  let lastIdx = 0;
  let match;
  while ((match = xmlReplacer.exec(str)) !== null) {
    const i = match.index;
    const char = str.charCodeAt(i);
    const next2 = xmlCodeMap.get(char);
    if (next2 !== void 0) {
      ret += str.substring(lastIdx, i) + next2;
      lastIdx = i + 1;
    } else {
      ret += `${str.substring(lastIdx, i)}&#x${getCodePoint(str, i).toString(16)};`;
      lastIdx = xmlReplacer.lastIndex += Number((char & 64512) === 55296);
    }
  }
  return ret + str.substr(lastIdx);
}
function getEscaper(regex, map2) {
  return function escape4(data2) {
    let match;
    let lastIdx = 0;
    let result = "";
    while (match = regex.exec(data2)) {
      if (lastIdx !== match.index) {
        result += data2.substring(lastIdx, match.index);
      }
      result += map2.get(match[0].charCodeAt(0));
      lastIdx = match.index + 1;
    }
    return result + data2.substring(lastIdx);
  };
}
var escapeUTF8 = getEscaper(/[&<>'"]/g, xmlCodeMap);
var escapeAttribute = getEscaper(/["&\u00A0]/g, /* @__PURE__ */ new Map([
  [34, "&quot;"],
  [38, "&amp;"],
  [160, "&nbsp;"]
]));
var escapeText = getEscaper(/[&<>\u00A0]/g, /* @__PURE__ */ new Map([
  [38, "&amp;"],
  [60, "&lt;"],
  [62, "&gt;"],
  [160, "&nbsp;"]
]));

// node_modules/htmlparser2/node_modules/domutils/node_modules/dom-serializer/node_modules/entities/lib/esm/index.js
var EntityLevel;
(function(EntityLevel3) {
  EntityLevel3[EntityLevel3["XML"] = 0] = "XML";
  EntityLevel3[EntityLevel3["HTML"] = 1] = "HTML";
})(EntityLevel || (EntityLevel = {}));
var EncodingMode;
(function(EncodingMode3) {
  EncodingMode3[EncodingMode3["UTF8"] = 0] = "UTF8";
  EncodingMode3[EncodingMode3["ASCII"] = 1] = "ASCII";
  EncodingMode3[EncodingMode3["Extensive"] = 2] = "Extensive";
  EncodingMode3[EncodingMode3["Attribute"] = 3] = "Attribute";
  EncodingMode3[EncodingMode3["Text"] = 4] = "Text";
})(EncodingMode || (EncodingMode = {}));

// node_modules/htmlparser2/node_modules/domutils/node_modules/dom-serializer/lib/esm/foreignNames.js
var elementNames = new Map([
  "altGlyph",
  "altGlyphDef",
  "altGlyphItem",
  "animateColor",
  "animateMotion",
  "animateTransform",
  "clipPath",
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feDropShadow",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence",
  "foreignObject",
  "glyphRef",
  "linearGradient",
  "radialGradient",
  "textPath"
].map((val) => [val.toLowerCase(), val]));
var attributeNames = new Map([
  "definitionURL",
  "attributeName",
  "attributeType",
  "baseFrequency",
  "baseProfile",
  "calcMode",
  "clipPathUnits",
  "diffuseConstant",
  "edgeMode",
  "filterUnits",
  "glyphRef",
  "gradientTransform",
  "gradientUnits",
  "kernelMatrix",
  "kernelUnitLength",
  "keyPoints",
  "keySplines",
  "keyTimes",
  "lengthAdjust",
  "limitingConeAngle",
  "markerHeight",
  "markerUnits",
  "markerWidth",
  "maskContentUnits",
  "maskUnits",
  "numOctaves",
  "pathLength",
  "patternContentUnits",
  "patternTransform",
  "patternUnits",
  "pointsAtX",
  "pointsAtY",
  "pointsAtZ",
  "preserveAlpha",
  "preserveAspectRatio",
  "primitiveUnits",
  "refX",
  "refY",
  "repeatCount",
  "repeatDur",
  "requiredExtensions",
  "requiredFeatures",
  "specularConstant",
  "specularExponent",
  "spreadMethod",
  "startOffset",
  "stdDeviation",
  "stitchTiles",
  "surfaceScale",
  "systemLanguage",
  "tableValues",
  "targetX",
  "targetY",
  "textLength",
  "viewBox",
  "viewTarget",
  "xChannelSelector",
  "yChannelSelector",
  "zoomAndPan"
].map((val) => [val.toLowerCase(), val]));

// node_modules/htmlparser2/node_modules/domutils/node_modules/dom-serializer/lib/esm/index.js
var unencodedElements = /* @__PURE__ */ new Set([
  "style",
  "script",
  "xmp",
  "iframe",
  "noembed",
  "noframes",
  "plaintext",
  "noscript"
]);
function replaceQuotes(value) {
  return value.replace(/"/g, "&quot;");
}
function formatAttributes(attributes, opts) {
  var _a3;
  if (!attributes)
    return;
  const encode = ((_a3 = opts.encodeEntities) !== null && _a3 !== void 0 ? _a3 : opts.decodeEntities) === false ? replaceQuotes : opts.xmlMode || opts.encodeEntities !== "utf8" ? encodeXML : escapeAttribute;
  return Object.keys(attributes).map((key2) => {
    var _a4, _b;
    const value = (_a4 = attributes[key2]) !== null && _a4 !== void 0 ? _a4 : "";
    if (opts.xmlMode === "foreign") {
      key2 = (_b = attributeNames.get(key2)) !== null && _b !== void 0 ? _b : key2;
    }
    if (!opts.emptyAttrs && !opts.xmlMode && value === "") {
      return key2;
    }
    return `${key2}="${encode(value)}"`;
  }).join(" ");
}
var singleTag = /* @__PURE__ */ new Set([
  "area",
  "base",
  "basefont",
  "br",
  "col",
  "command",
  "embed",
  "frame",
  "hr",
  "img",
  "input",
  "isindex",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
]);
function render(node, options = {}) {
  const nodes = "length" in node ? node : [node];
  let output = "";
  for (let i = 0; i < nodes.length; i++) {
    output += renderNode(nodes[i], options);
  }
  return output;
}
var esm_default = render;
function renderNode(node, options) {
  switch (node.type) {
    case Root:
      return render(node.children, options);
    // @ts-expect-error We don't use `Doctype` yet
    case Doctype:
    case Directive:
      return renderDirective(node);
    case Comment:
      return renderComment(node);
    case CDATA:
      return renderCdata(node);
    case Script:
    case Style:
    case Tag:
      return renderTag(node, options);
    case Text:
      return renderText(node, options);
  }
}
var foreignModeIntegrationPoints = /* @__PURE__ */ new Set([
  "mi",
  "mo",
  "mn",
  "ms",
  "mtext",
  "annotation-xml",
  "foreignObject",
  "desc",
  "title"
]);
var foreignElements = /* @__PURE__ */ new Set(["svg", "math"]);
function renderTag(elem, opts) {
  var _a3;
  if (opts.xmlMode === "foreign") {
    elem.name = (_a3 = elementNames.get(elem.name)) !== null && _a3 !== void 0 ? _a3 : elem.name;
    if (elem.parent && foreignModeIntegrationPoints.has(elem.parent.name)) {
      opts = { ...opts, xmlMode: false };
    }
  }
  if (!opts.xmlMode && foreignElements.has(elem.name)) {
    opts = { ...opts, xmlMode: "foreign" };
  }
  let tag = `<${elem.name}`;
  const attribs = formatAttributes(elem.attribs, opts);
  if (attribs) {
    tag += ` ${attribs}`;
  }
  if (elem.children.length === 0 && (opts.xmlMode ? (
    // In XML mode or foreign mode, and user hasn't explicitly turned off self-closing tags
    opts.selfClosingTags !== false
  ) : (
    // User explicitly asked for self-closing tags, even in HTML mode
    opts.selfClosingTags && singleTag.has(elem.name)
  ))) {
    if (!opts.xmlMode)
      tag += " ";
    tag += "/>";
  } else {
    tag += ">";
    if (elem.children.length > 0) {
      tag += render(elem.children, opts);
    }
    if (opts.xmlMode || !singleTag.has(elem.name)) {
      tag += `</${elem.name}>`;
    }
  }
  return tag;
}
function renderDirective(elem) {
  return `<${elem.data}>`;
}
function renderText(elem, opts) {
  var _a3;
  let data2 = elem.data || "";
  if (((_a3 = opts.encodeEntities) !== null && _a3 !== void 0 ? _a3 : opts.decodeEntities) !== false && !(!opts.xmlMode && elem.parent && unencodedElements.has(elem.parent.name))) {
    data2 = opts.xmlMode || opts.encodeEntities !== "utf8" ? encodeXML(data2) : escapeText(data2);
  }
  return data2;
}
function renderCdata(elem) {
  return `<![CDATA[${elem.children[0].data}]]>`;
}
function renderComment(elem) {
  return `<!--${elem.data}-->`;
}

// node_modules/htmlparser2/node_modules/domutils/lib/esm/stringify.js
function getOuterHTML(node, options) {
  return esm_default(node, options);
}
function getInnerHTML(node, options) {
  return hasChildren(node) ? node.children.map((node2) => getOuterHTML(node2, options)).join("") : "";
}
function getText(node) {
  if (Array.isArray(node))
    return node.map(getText).join("");
  if (isTag2(node))
    return node.name === "br" ? "\n" : getText(node.children);
  if (isCDATA(node))
    return getText(node.children);
  if (isText(node))
    return node.data;
  return "";
}
function textContent(node) {
  if (Array.isArray(node))
    return node.map(textContent).join("");
  if (hasChildren(node) && !isComment(node)) {
    return textContent(node.children);
  }
  if (isText(node))
    return node.data;
  return "";
}
function innerText(node) {
  if (Array.isArray(node))
    return node.map(innerText).join("");
  if (hasChildren(node) && (node.type === ElementType.Tag || isCDATA(node))) {
    return innerText(node.children);
  }
  if (isText(node))
    return node.data;
  return "";
}

// node_modules/htmlparser2/node_modules/domutils/lib/esm/traversal.js
function getChildren(elem) {
  return hasChildren(elem) ? elem.children : [];
}
function getParent(elem) {
  return elem.parent || null;
}
function getSiblings(elem) {
  const parent = getParent(elem);
  if (parent != null)
    return getChildren(parent);
  const siblings2 = [elem];
  let { prev: prev2, next: next2 } = elem;
  while (prev2 != null) {
    siblings2.unshift(prev2);
    ({ prev: prev2 } = prev2);
  }
  while (next2 != null) {
    siblings2.push(next2);
    ({ next: next2 } = next2);
  }
  return siblings2;
}
function getAttributeValue(elem, name) {
  var _a3;
  return (_a3 = elem.attribs) === null || _a3 === void 0 ? void 0 : _a3[name];
}
function hasAttrib(elem, name) {
  return elem.attribs != null && Object.prototype.hasOwnProperty.call(elem.attribs, name) && elem.attribs[name] != null;
}
function getName(elem) {
  return elem.name;
}
function nextElementSibling(elem) {
  let { next: next2 } = elem;
  while (next2 !== null && !isTag2(next2))
    ({ next: next2 } = next2);
  return next2;
}
function prevElementSibling(elem) {
  let { prev: prev2 } = elem;
  while (prev2 !== null && !isTag2(prev2))
    ({ prev: prev2 } = prev2);
  return prev2;
}

// node_modules/htmlparser2/node_modules/domutils/lib/esm/manipulation.js
function removeElement(elem) {
  if (elem.prev)
    elem.prev.next = elem.next;
  if (elem.next)
    elem.next.prev = elem.prev;
  if (elem.parent) {
    const childs = elem.parent.children;
    const childsIndex = childs.lastIndexOf(elem);
    if (childsIndex >= 0) {
      childs.splice(childsIndex, 1);
    }
  }
  elem.next = null;
  elem.prev = null;
  elem.parent = null;
}
function replaceElement(elem, replacement) {
  const prev2 = replacement.prev = elem.prev;
  if (prev2) {
    prev2.next = replacement;
  }
  const next2 = replacement.next = elem.next;
  if (next2) {
    next2.prev = replacement;
  }
  const parent = replacement.parent = elem.parent;
  if (parent) {
    const childs = parent.children;
    childs[childs.lastIndexOf(elem)] = replacement;
    elem.parent = null;
  }
}
function appendChild(parent, child) {
  removeElement(child);
  child.next = null;
  child.parent = parent;
  if (parent.children.push(child) > 1) {
    const sibling = parent.children[parent.children.length - 2];
    sibling.next = child;
    child.prev = sibling;
  } else {
    child.prev = null;
  }
}
function append(elem, next2) {
  removeElement(next2);
  const { parent } = elem;
  const currNext = elem.next;
  next2.next = currNext;
  next2.prev = elem;
  elem.next = next2;
  next2.parent = parent;
  if (currNext) {
    currNext.prev = next2;
    if (parent) {
      const childs = parent.children;
      childs.splice(childs.lastIndexOf(currNext), 0, next2);
    }
  } else if (parent) {
    parent.children.push(next2);
  }
}
function prependChild(parent, child) {
  removeElement(child);
  child.parent = parent;
  child.prev = null;
  if (parent.children.unshift(child) !== 1) {
    const sibling = parent.children[1];
    sibling.prev = child;
    child.next = sibling;
  } else {
    child.next = null;
  }
}
function prepend(elem, prev2) {
  removeElement(prev2);
  const { parent } = elem;
  if (parent) {
    const childs = parent.children;
    childs.splice(childs.indexOf(elem), 0, prev2);
  }
  if (elem.prev) {
    elem.prev.next = prev2;
  }
  prev2.parent = parent;
  prev2.prev = elem.prev;
  prev2.next = elem;
  elem.prev = prev2;
}

// node_modules/htmlparser2/node_modules/domutils/lib/esm/querying.js
function filter(test, node, recurse = true, limit = Infinity) {
  return find(test, Array.isArray(node) ? node : [node], recurse, limit);
}
function find(test, nodes, recurse, limit) {
  const result = [];
  const nodeStack = [Array.isArray(nodes) ? nodes : [nodes]];
  const indexStack = [0];
  for (; ; ) {
    if (indexStack[0] >= nodeStack[0].length) {
      if (indexStack.length === 1) {
        return result;
      }
      nodeStack.shift();
      indexStack.shift();
      continue;
    }
    const elem = nodeStack[0][indexStack[0]++];
    if (test(elem)) {
      result.push(elem);
      if (--limit <= 0)
        return result;
    }
    if (recurse && hasChildren(elem) && elem.children.length > 0) {
      indexStack.unshift(0);
      nodeStack.unshift(elem.children);
    }
  }
}
function findOneChild(test, nodes) {
  return nodes.find(test);
}
function findOne(test, nodes, recurse = true) {
  const searchedNodes = Array.isArray(nodes) ? nodes : [nodes];
  for (let i = 0; i < searchedNodes.length; i++) {
    const node = searchedNodes[i];
    if (isTag2(node) && test(node)) {
      return node;
    }
    if (recurse && hasChildren(node) && node.children.length > 0) {
      const found = findOne(test, node.children, true);
      if (found)
        return found;
    }
  }
  return null;
}
function existsOne(test, nodes) {
  return (Array.isArray(nodes) ? nodes : [nodes]).some((node) => isTag2(node) && test(node) || hasChildren(node) && existsOne(test, node.children));
}
function findAll(test, nodes) {
  const result = [];
  const nodeStack = [Array.isArray(nodes) ? nodes : [nodes]];
  const indexStack = [0];
  for (; ; ) {
    if (indexStack[0] >= nodeStack[0].length) {
      if (nodeStack.length === 1) {
        return result;
      }
      nodeStack.shift();
      indexStack.shift();
      continue;
    }
    const elem = nodeStack[0][indexStack[0]++];
    if (isTag2(elem) && test(elem))
      result.push(elem);
    if (hasChildren(elem) && elem.children.length > 0) {
      indexStack.unshift(0);
      nodeStack.unshift(elem.children);
    }
  }
}

// node_modules/htmlparser2/node_modules/domutils/lib/esm/legacy.js
var Checks = {
  tag_name(name) {
    if (typeof name === "function") {
      return (elem) => isTag2(elem) && name(elem.name);
    } else if (name === "*") {
      return isTag2;
    }
    return (elem) => isTag2(elem) && elem.name === name;
  },
  tag_type(type) {
    if (typeof type === "function") {
      return (elem) => type(elem.type);
    }
    return (elem) => elem.type === type;
  },
  tag_contains(data2) {
    if (typeof data2 === "function") {
      return (elem) => isText(elem) && data2(elem.data);
    }
    return (elem) => isText(elem) && elem.data === data2;
  }
};
function getAttribCheck(attrib, value) {
  if (typeof value === "function") {
    return (elem) => isTag2(elem) && value(elem.attribs[attrib]);
  }
  return (elem) => isTag2(elem) && elem.attribs[attrib] === value;
}
function combineFuncs(a, b) {
  return (elem) => a(elem) || b(elem);
}
function compileTest(options) {
  const funcs = Object.keys(options).map((key2) => {
    const value = options[key2];
    return Object.prototype.hasOwnProperty.call(Checks, key2) ? Checks[key2](value) : getAttribCheck(key2, value);
  });
  return funcs.length === 0 ? null : funcs.reduce(combineFuncs);
}
function testElement(options, node) {
  const test = compileTest(options);
  return test ? test(node) : true;
}
function getElements(options, nodes, recurse, limit = Infinity) {
  const test = compileTest(options);
  return test ? filter(test, nodes, recurse, limit) : [];
}
function getElementById(id, nodes, recurse = true) {
  if (!Array.isArray(nodes))
    nodes = [nodes];
  return findOne(getAttribCheck("id", id), nodes, recurse);
}
function getElementsByTagName(tagName19, nodes, recurse = true, limit = Infinity) {
  return filter(Checks["tag_name"](tagName19), nodes, recurse, limit);
}
function getElementsByClassName(className, nodes, recurse = true, limit = Infinity) {
  return filter(getAttribCheck("class", className), nodes, recurse, limit);
}
function getElementsByTagType(type, nodes, recurse = true, limit = Infinity) {
  return filter(Checks["tag_type"](type), nodes, recurse, limit);
}

// node_modules/htmlparser2/node_modules/domutils/lib/esm/helpers.js
function removeSubsets(nodes) {
  let idx = nodes.length;
  while (--idx >= 0) {
    const node = nodes[idx];
    if (idx > 0 && nodes.lastIndexOf(node, idx - 1) >= 0) {
      nodes.splice(idx, 1);
      continue;
    }
    for (let ancestor = node.parent; ancestor; ancestor = ancestor.parent) {
      if (nodes.includes(ancestor)) {
        nodes.splice(idx, 1);
        break;
      }
    }
  }
  return nodes;
}
var DocumentPosition;
(function(DocumentPosition3) {
  DocumentPosition3[DocumentPosition3["DISCONNECTED"] = 1] = "DISCONNECTED";
  DocumentPosition3[DocumentPosition3["PRECEDING"] = 2] = "PRECEDING";
  DocumentPosition3[DocumentPosition3["FOLLOWING"] = 4] = "FOLLOWING";
  DocumentPosition3[DocumentPosition3["CONTAINS"] = 8] = "CONTAINS";
  DocumentPosition3[DocumentPosition3["CONTAINED_BY"] = 16] = "CONTAINED_BY";
})(DocumentPosition || (DocumentPosition = {}));
function compareDocumentPosition(nodeA, nodeB) {
  const aParents = [];
  const bParents = [];
  if (nodeA === nodeB) {
    return 0;
  }
  let current = hasChildren(nodeA) ? nodeA : nodeA.parent;
  while (current) {
    aParents.unshift(current);
    current = current.parent;
  }
  current = hasChildren(nodeB) ? nodeB : nodeB.parent;
  while (current) {
    bParents.unshift(current);
    current = current.parent;
  }
  const maxIdx = Math.min(aParents.length, bParents.length);
  let idx = 0;
  while (idx < maxIdx && aParents[idx] === bParents[idx]) {
    idx++;
  }
  if (idx === 0) {
    return DocumentPosition.DISCONNECTED;
  }
  const sharedParent = aParents[idx - 1];
  const siblings2 = sharedParent.children;
  const aSibling = aParents[idx];
  const bSibling = bParents[idx];
  if (siblings2.indexOf(aSibling) > siblings2.indexOf(bSibling)) {
    if (sharedParent === nodeB) {
      return DocumentPosition.FOLLOWING | DocumentPosition.CONTAINED_BY;
    }
    return DocumentPosition.FOLLOWING;
  }
  if (sharedParent === nodeA) {
    return DocumentPosition.PRECEDING | DocumentPosition.CONTAINS;
  }
  return DocumentPosition.PRECEDING;
}
function uniqueSort(nodes) {
  nodes = nodes.filter((node, i, arr) => !arr.includes(node, i + 1));
  nodes.sort((a, b) => {
    const relative = compareDocumentPosition(a, b);
    if (relative & DocumentPosition.PRECEDING) {
      return -1;
    } else if (relative & DocumentPosition.FOLLOWING) {
      return 1;
    }
    return 0;
  });
  return nodes;
}

// node_modules/htmlparser2/node_modules/domutils/lib/esm/feeds.js
function getFeed(doc) {
  const feedRoot = getOneElement(isValidFeed, doc);
  return !feedRoot ? null : feedRoot.name === "feed" ? getAtomFeed(feedRoot) : getRssFeed(feedRoot);
}
function getAtomFeed(feedRoot) {
  var _a3;
  const childs = feedRoot.children;
  const feed = {
    type: "atom",
    items: getElementsByTagName("entry", childs).map((item) => {
      var _a4;
      const { children } = item;
      const entry = { media: getMediaElements(children) };
      addConditionally(entry, "id", "id", children);
      addConditionally(entry, "title", "title", children);
      const href2 = (_a4 = getOneElement("link", children)) === null || _a4 === void 0 ? void 0 : _a4.attribs["href"];
      if (href2) {
        entry.link = href2;
      }
      const description = fetch("summary", children) || fetch("content", children);
      if (description) {
        entry.description = description;
      }
      const pubDate = fetch("updated", children);
      if (pubDate) {
        entry.pubDate = new Date(pubDate);
      }
      return entry;
    })
  };
  addConditionally(feed, "id", "id", childs);
  addConditionally(feed, "title", "title", childs);
  const href = (_a3 = getOneElement("link", childs)) === null || _a3 === void 0 ? void 0 : _a3.attribs["href"];
  if (href) {
    feed.link = href;
  }
  addConditionally(feed, "description", "subtitle", childs);
  const updated = fetch("updated", childs);
  if (updated) {
    feed.updated = new Date(updated);
  }
  addConditionally(feed, "author", "email", childs, true);
  return feed;
}
function getRssFeed(feedRoot) {
  var _a3, _b;
  const childs = (_b = (_a3 = getOneElement("channel", feedRoot.children)) === null || _a3 === void 0 ? void 0 : _a3.children) !== null && _b !== void 0 ? _b : [];
  const feed = {
    type: feedRoot.name.substr(0, 3),
    id: "",
    items: getElementsByTagName("item", feedRoot.children).map((item) => {
      const { children } = item;
      const entry = { media: getMediaElements(children) };
      addConditionally(entry, "id", "guid", children);
      addConditionally(entry, "title", "title", children);
      addConditionally(entry, "link", "link", children);
      addConditionally(entry, "description", "description", children);
      const pubDate = fetch("pubDate", children) || fetch("dc:date", children);
      if (pubDate)
        entry.pubDate = new Date(pubDate);
      return entry;
    })
  };
  addConditionally(feed, "title", "title", childs);
  addConditionally(feed, "link", "link", childs);
  addConditionally(feed, "description", "description", childs);
  const updated = fetch("lastBuildDate", childs);
  if (updated) {
    feed.updated = new Date(updated);
  }
  addConditionally(feed, "author", "managingEditor", childs, true);
  return feed;
}
var MEDIA_KEYS_STRING = ["url", "type", "lang"];
var MEDIA_KEYS_INT = [
  "fileSize",
  "bitrate",
  "framerate",
  "samplingrate",
  "channels",
  "duration",
  "height",
  "width"
];
function getMediaElements(where) {
  return getElementsByTagName("media:content", where).map((elem) => {
    const { attribs } = elem;
    const media = {
      medium: attribs["medium"],
      isDefault: !!attribs["isDefault"]
    };
    for (const attrib of MEDIA_KEYS_STRING) {
      if (attribs[attrib]) {
        media[attrib] = attribs[attrib];
      }
    }
    for (const attrib of MEDIA_KEYS_INT) {
      if (attribs[attrib]) {
        media[attrib] = parseInt(attribs[attrib], 10);
      }
    }
    if (attribs["expression"]) {
      media.expression = attribs["expression"];
    }
    return media;
  });
}
function getOneElement(tagName19, node) {
  return getElementsByTagName(tagName19, node, true, 1)[0];
}
function fetch(tagName19, where, recurse = false) {
  return textContent(getElementsByTagName(tagName19, where, recurse, 1)).trim();
}
function addConditionally(obj, prop2, tagName19, where, recurse = false) {
  const val = fetch(tagName19, where, recurse);
  if (val)
    obj[prop2] = val;
}
function isValidFeed(value) {
  return value === "rss" || value === "feed" || value === "rdf:RDF";
}

// node_modules/htmlparser2/dist/esm/index.js
function parseDocument(data2, options) {
  const handler4 = new DomHandler(void 0, options);
  new Parser(handler4, options).end(data2);
  return handler4.root;
}
function parseDOM(data2, options) {
  return parseDocument(data2, options).children;
}
function createDocumentStream(callback, options, elementCallback) {
  const handler4 = new DomHandler((error) => callback(error, handler4.root), options, elementCallback);
  return new Parser(handler4, options);
}
function createDomStream(callback, options, elementCallback) {
  const handler4 = new DomHandler(callback, options, elementCallback);
  return new Parser(handler4, options);
}
var parseFeedDefaultOptions = { xmlMode: true };
function parseFeed(feed, options = parseFeedDefaultOptions) {
  return getFeed(parseDOM(feed, options));
}

// node_modules/linkedom/esm/shared/constants.js
var NODE_END = -1;
var ELEMENT_NODE = 1;
var ATTRIBUTE_NODE = 2;
var TEXT_NODE = 3;
var CDATA_SECTION_NODE = 4;
var COMMENT_NODE = 8;
var DOCUMENT_NODE = 9;
var DOCUMENT_TYPE_NODE = 10;
var DOCUMENT_FRAGMENT_NODE = 11;
var BLOCK_ELEMENTS = /* @__PURE__ */ new Set(["ARTICLE", "ASIDE", "BLOCKQUOTE", "BODY", "BR", "BUTTON", "CANVAS", "CAPTION", "COL", "COLGROUP", "DD", "DIV", "DL", "DT", "EMBED", "FIELDSET", "FIGCAPTION", "FIGURE", "FOOTER", "FORM", "H1", "H2", "H3", "H4", "H5", "H6", "LI", "UL", "OL", "P"]);
var SHOW_ALL = -1;
var SHOW_ELEMENT = 1;
var SHOW_TEXT = 4;
var SHOW_CDATA_SECTION = 8;
var SHOW_COMMENT = 128;
var DOCUMENT_POSITION_DISCONNECTED = 1;
var DOCUMENT_POSITION_PRECEDING = 2;
var DOCUMENT_POSITION_FOLLOWING = 4;
var DOCUMENT_POSITION_CONTAINS = 8;
var DOCUMENT_POSITION_CONTAINED_BY = 16;
var DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 32;
var SVG_NAMESPACE = "http://www.w3.org/2000/svg";

// node_modules/linkedom/esm/shared/object.js
var {
  assign,
  create,
  defineProperties,
  entries,
  getOwnPropertyDescriptors,
  keys,
  setPrototypeOf
} = Object;

// node_modules/linkedom/esm/shared/utils.js
var $String = String;
var getEnd = (node) => node.nodeType === ELEMENT_NODE ? node[END] : node;
var ignoreCase = ({ ownerDocument }) => ownerDocument[MIME].ignoreCase;
var knownAdjacent = (prev2, next2) => {
  prev2[NEXT] = next2;
  next2[PREV] = prev2;
};
var knownBoundaries = (prev2, current, next2) => {
  knownAdjacent(prev2, current);
  knownAdjacent(getEnd(current), next2);
};
var knownSegment = (prev2, start, end, next2) => {
  knownAdjacent(prev2, start);
  knownAdjacent(getEnd(end), next2);
};
var knownSiblings = (prev2, current, next2) => {
  knownAdjacent(prev2, current);
  knownAdjacent(current, next2);
};
var localCase = ({ localName, ownerDocument }) => {
  return ownerDocument[MIME].ignoreCase ? localName.toUpperCase() : localName;
};
var setAdjacent = (prev2, next2) => {
  if (prev2)
    prev2[NEXT] = next2;
  if (next2)
    next2[PREV] = prev2;
};
var htmlToFragment = (ownerDocument, html2) => {
  const fragment = ownerDocument.createDocumentFragment();
  const elem = ownerDocument.createElement("");
  elem.innerHTML = html2;
  const { firstChild, lastChild } = elem;
  if (firstChild) {
    knownSegment(fragment, firstChild, lastChild, fragment[END]);
    let child = firstChild;
    do {
      child.parentNode = fragment;
    } while (child !== lastChild && (child = getEnd(child)[NEXT]));
  }
  return fragment;
};

// node_modules/linkedom/esm/shared/shadow-roots.js
var shadowRoots = /* @__PURE__ */ new WeakMap();

// node_modules/linkedom/esm/interface/custom-element-registry.js
var reactive = false;
var Classes = /* @__PURE__ */ new WeakMap();
var customElements = /* @__PURE__ */ new WeakMap();
var attributeChangedCallback = (element, attributeName, oldValue, newValue) => {
  if (reactive && customElements.has(element) && element.attributeChangedCallback && element.constructor.observedAttributes.includes(attributeName)) {
    element.attributeChangedCallback(attributeName, oldValue, newValue);
  }
};
var createTrigger = (method, isConnected2) => (element) => {
  if (customElements.has(element)) {
    const info = customElements.get(element);
    if (info.connected !== isConnected2 && element.isConnected === isConnected2) {
      info.connected = isConnected2;
      if (method in element)
        element[method]();
    }
  }
};
var triggerConnected = createTrigger("connectedCallback", true);
var connectedCallback = (element) => {
  if (reactive) {
    triggerConnected(element);
    if (shadowRoots.has(element))
      element = shadowRoots.get(element).shadowRoot;
    let { [NEXT]: next2, [END]: end } = element;
    while (next2 !== end) {
      if (next2.nodeType === ELEMENT_NODE)
        triggerConnected(next2);
      next2 = next2[NEXT];
    }
  }
};
var triggerDisconnected = createTrigger("disconnectedCallback", false);
var disconnectedCallback = (element) => {
  if (reactive) {
    triggerDisconnected(element);
    if (shadowRoots.has(element))
      element = shadowRoots.get(element).shadowRoot;
    let { [NEXT]: next2, [END]: end } = element;
    while (next2 !== end) {
      if (next2.nodeType === ELEMENT_NODE)
        triggerDisconnected(next2);
      next2 = next2[NEXT];
    }
  }
};
var CustomElementRegistry = class {
  /**
   * @param {Document} ownerDocument
   */
  constructor(ownerDocument) {
    this.ownerDocument = ownerDocument;
    this.registry = /* @__PURE__ */ new Map();
    this.waiting = /* @__PURE__ */ new Map();
    this.active = false;
  }
  /**
   * @param {string} localName the custom element definition name
   * @param {Function} Class the custom element **Class** definition
   * @param {object?} options the optional object with an `extends` property
   */
  define(localName, Class, options = {}) {
    const { ownerDocument, registry, waiting } = this;
    if (registry.has(localName))
      throw new Error("unable to redefine " + localName);
    if (Classes.has(Class))
      throw new Error("unable to redefine the same class: " + Class);
    this.active = reactive = true;
    const { extends: extend2 } = options;
    Classes.set(Class, {
      ownerDocument,
      options: { is: extend2 ? localName : "" },
      localName: extend2 || localName
    });
    const check = extend2 ? (element) => {
      return element.localName === extend2 && element.getAttribute("is") === localName;
    } : (element) => element.localName === localName;
    registry.set(localName, { Class, check });
    if (waiting.has(localName)) {
      for (const resolve2 of waiting.get(localName))
        resolve2(Class);
      waiting.delete(localName);
    }
    ownerDocument.querySelectorAll(
      extend2 ? `${extend2}[is="${localName}"]` : localName
    ).forEach(this.upgrade, this);
  }
  /**
   * @param {Element} element
   */
  upgrade(element) {
    if (customElements.has(element))
      return;
    const { ownerDocument, registry } = this;
    const ce = element.getAttribute("is") || element.localName;
    if (registry.has(ce)) {
      const { Class, check } = registry.get(ce);
      if (check(element)) {
        const { attributes, isConnected: isConnected2 } = element;
        for (const attr2 of attributes)
          element.removeAttributeNode(attr2);
        const values = entries(element);
        for (const [key2] of values)
          delete element[key2];
        setPrototypeOf(element, Class.prototype);
        ownerDocument[UPGRADE] = { element, values };
        new Class(ownerDocument, ce);
        customElements.set(element, { connected: isConnected2 });
        for (const attr2 of attributes)
          element.setAttributeNode(attr2);
        if (isConnected2 && element.connectedCallback)
          element.connectedCallback();
      }
    }
  }
  /**
   * @param {string} localName the custom element definition name
   */
  whenDefined(localName) {
    const { registry, waiting } = this;
    return new Promise((resolve2) => {
      if (registry.has(localName))
        resolve2(registry.get(localName).Class);
      else {
        if (!waiting.has(localName))
          waiting.set(localName, []);
        waiting.get(localName).push(resolve2);
      }
    });
  }
  /**
   * @param {string} localName the custom element definition name
   * @returns {Function?} the custom element **Class**, if any
   */
  get(localName) {
    const info = this.registry.get(localName);
    return info && info.Class;
  }
  /**
   * @param {Function} Class **Class** of custom element
   * @returns {string?} found tag name or null
   */
  getName(Class) {
    if (Classes.has(Class)) {
      const { localName } = Classes.get(Class);
      return localName;
    }
    return null;
  }
};

// node_modules/linkedom/esm/shared/parse-from-string.js
var { Parser: Parser2 } = esm_exports3;
var notParsing = true;
var append2 = (self2, node, active) => {
  const end = self2[END];
  node.parentNode = self2;
  knownBoundaries(end[PREV], node, end);
  if (active && node.nodeType === ELEMENT_NODE)
    connectedCallback(node);
  return node;
};
var attribute = (element, end, attribute2, value, active) => {
  attribute2[VALUE] = value;
  attribute2.ownerElement = element;
  knownSiblings(end[PREV], attribute2, end);
  if (attribute2.name === "class")
    element.className = value;
  if (active)
    attributeChangedCallback(element, attribute2.name, null, value);
};
var parseFromString = (document2, isHTML, markupLanguage) => {
  const { active, registry } = document2[CUSTOM_ELEMENTS];
  let node = document2;
  let ownerSVGElement = null;
  let parsingCData = false;
  notParsing = false;
  const content = new Parser2({
    // <!DOCTYPE ...>
    onprocessinginstruction(name, data2) {
      if (name.toLowerCase() === "!doctype")
        document2.doctype = data2.slice(name.length).trim();
    },
    // <tagName>
    onopentag(name, attributes) {
      let create4 = true;
      if (isHTML) {
        if (ownerSVGElement) {
          node = append2(node, document2.createElementNS(SVG_NAMESPACE, name), active);
          node.ownerSVGElement = ownerSVGElement;
          create4 = false;
        } else if (name === "svg" || name === "SVG") {
          ownerSVGElement = document2.createElementNS(SVG_NAMESPACE, name);
          node = append2(node, ownerSVGElement, active);
          create4 = false;
        } else if (active) {
          const ce = name.includes("-") ? name : attributes.is || "";
          if (ce && registry.has(ce)) {
            const { Class } = registry.get(ce);
            node = append2(node, new Class(), active);
            delete attributes.is;
            create4 = false;
          }
        }
      }
      if (create4)
        node = append2(node, document2.createElement(name), false);
      let end = node[END];
      for (const name2 of keys(attributes))
        attribute(node, end, document2.createAttribute(name2), attributes[name2], active);
    },
    // #text, #comment
    oncomment(data2) {
      append2(node, document2.createComment(data2), active);
    },
    ontext(text) {
      if (parsingCData) {
        append2(node, document2.createCDATASection(text), active);
      } else {
        append2(node, document2.createTextNode(text), active);
      }
    },
    // #cdata
    oncdatastart() {
      parsingCData = true;
    },
    oncdataend() {
      parsingCData = false;
    },
    // </tagName>
    onclosetag() {
      if (isHTML && node === ownerSVGElement)
        ownerSVGElement = null;
      node = node.parentNode;
    }
  }, {
    lowerCaseAttributeNames: false,
    decodeEntities: true,
    xmlMode: !isHTML
  });
  content.write(markupLanguage);
  content.end();
  notParsing = true;
  return document2;
};

// node_modules/linkedom/esm/shared/register-html-class.js
var htmlClasses = /* @__PURE__ */ new Map();
var registerHTMLClass = (names2, Class) => {
  for (const name of [].concat(names2)) {
    htmlClasses.set(name, Class);
    htmlClasses.set(name.toUpperCase(), Class);
  }
};

// node_modules/linkedom/esm/shared/jsdon.js
var loopSegment = ({ [NEXT]: next2, [END]: end }, json) => {
  while (next2 !== end) {
    switch (next2.nodeType) {
      case ATTRIBUTE_NODE:
        attrAsJSON(next2, json);
        break;
      case TEXT_NODE:
      case COMMENT_NODE:
      case CDATA_SECTION_NODE:
        characterDataAsJSON(next2, json);
        break;
      case ELEMENT_NODE:
        elementAsJSON(next2, json);
        next2 = getEnd(next2);
        break;
      case DOCUMENT_TYPE_NODE:
        documentTypeAsJSON(next2, json);
        break;
    }
    next2 = next2[NEXT];
  }
  const last = json.length - 1;
  const value = json[last];
  if (typeof value === "number" && value < 0)
    json[last] += NODE_END;
  else
    json.push(NODE_END);
};
var attrAsJSON = (attr2, json) => {
  json.push(ATTRIBUTE_NODE, attr2.name);
  const value = attr2[VALUE].trim();
  if (value)
    json.push(value);
};
var characterDataAsJSON = (node, json) => {
  const value = node[VALUE];
  if (value.trim())
    json.push(node.nodeType, value);
};
var nonElementAsJSON = (node, json) => {
  json.push(node.nodeType);
  loopSegment(node, json);
};
var documentTypeAsJSON = ({ name, publicId, systemId }, json) => {
  json.push(DOCUMENT_TYPE_NODE, name);
  if (publicId)
    json.push(publicId);
  if (systemId)
    json.push(systemId);
};
var elementAsJSON = (element, json) => {
  json.push(ELEMENT_NODE, element.localName);
  loopSegment(element, json);
};

// node_modules/linkedom/esm/interface/mutation-observer.js
var createRecord = (type, target, element, addedNodes, removedNodes, attributeName, oldValue) => ({
  type,
  target,
  addedNodes,
  removedNodes,
  attributeName,
  oldValue,
  previousSibling: element?.previousSibling || null,
  nextSibling: element?.nextSibling || null
});
var queueAttribute = (observer, target, attributeName, attributeFilter, attributeOldValue, oldValue) => {
  if (!attributeFilter || attributeFilter.includes(attributeName)) {
    const { callback, records, scheduled } = observer;
    records.push(createRecord(
      "attributes",
      target,
      null,
      [],
      [],
      attributeName,
      attributeOldValue ? oldValue : void 0
    ));
    if (!scheduled) {
      observer.scheduled = true;
      Promise.resolve().then(() => {
        observer.scheduled = false;
        callback(records.splice(0), observer);
      });
    }
  }
};
var attributeChangedCallback2 = (element, attributeName, oldValue) => {
  const { ownerDocument } = element;
  const { active, observers } = ownerDocument[MUTATION_OBSERVER];
  if (active) {
    for (const observer of observers) {
      for (const [
        target,
        {
          childList,
          subtree,
          attributes,
          attributeFilter,
          attributeOldValue
        }
      ] of observer.nodes) {
        if (childList) {
          if (subtree && (target === ownerDocument || target.contains(element)) || !subtree && target.children.includes(element)) {
            queueAttribute(
              observer,
              element,
              attributeName,
              attributeFilter,
              attributeOldValue,
              oldValue
            );
            break;
          }
        } else if (attributes && target === element) {
          queueAttribute(
            observer,
            element,
            attributeName,
            attributeFilter,
            attributeOldValue,
            oldValue
          );
          break;
        }
      }
    }
  }
};
var moCallback = (element, parentNode) => {
  const { ownerDocument } = element;
  const { active, observers } = ownerDocument[MUTATION_OBSERVER];
  if (active) {
    for (const observer of observers) {
      for (const [target, { subtree, childList, characterData }] of observer.nodes) {
        if (childList) {
          if (parentNode && (target === parentNode || /* c8 ignore next */
          subtree && target.contains(parentNode)) || !parentNode && (subtree && (target === ownerDocument || /* c8 ignore next */
          target.contains(element)) || !subtree && target[characterData ? "childNodes" : "children"].includes(element))) {
            const { callback, records, scheduled } = observer;
            records.push(createRecord(
              "childList",
              target,
              element,
              parentNode ? [] : [element],
              parentNode ? [element] : []
            ));
            if (!scheduled) {
              observer.scheduled = true;
              Promise.resolve().then(() => {
                observer.scheduled = false;
                callback(records.splice(0), observer);
              });
            }
            break;
          }
        }
      }
    }
  }
};
var MutationObserverClass = class {
  constructor(ownerDocument) {
    const observers = /* @__PURE__ */ new Set();
    this.observers = observers;
    this.active = false;
    this.class = class MutationObserver {
      constructor(callback) {
        this.callback = callback;
        this.nodes = /* @__PURE__ */ new Map();
        this.records = [];
        this.scheduled = false;
      }
      disconnect() {
        this.records.splice(0);
        this.nodes.clear();
        observers.delete(this);
        ownerDocument[MUTATION_OBSERVER].active = !!observers.size;
      }
      /**
       * @param {Element} target
       * @param {MutationObserverInit} options
       */
      observe(target, options = {
        subtree: false,
        childList: false,
        attributes: false,
        attributeFilter: null,
        attributeOldValue: false,
        characterData: false
        // TODO: not implemented yet
        // characterDataOldValue: false
      }) {
        if ("attributeOldValue" in options || "attributeFilter" in options)
          options.attributes = true;
        options.childList = !!options.childList;
        options.subtree = !!options.subtree;
        this.nodes.set(target, options);
        observers.add(this);
        ownerDocument[MUTATION_OBSERVER].active = true;
      }
      /**
       * @returns {MutationRecord[]}
       */
      takeRecords() {
        return this.records.splice(0);
      }
    };
  }
};

// node_modules/linkedom/esm/shared/attributes.js
var emptyAttributes = /* @__PURE__ */ new Set([
  "allowfullscreen",
  "allowpaymentrequest",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "class",
  "contenteditable",
  "controls",
  "default",
  "defer",
  "disabled",
  "draggable",
  "formnovalidate",
  "hidden",
  "id",
  "ismap",
  "itemscope",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected",
  "style",
  "truespeed"
]);
var setAttribute = (element, attribute2) => {
  const { [VALUE]: value, name } = attribute2;
  attribute2.ownerElement = element;
  knownSiblings(element, attribute2, element[NEXT]);
  if (name === "class")
    element.className = value;
  attributeChangedCallback2(element, name, null);
  attributeChangedCallback(element, name, null, value);
};
var removeAttribute = (element, attribute2) => {
  const { [VALUE]: value, name } = attribute2;
  knownAdjacent(attribute2[PREV], attribute2[NEXT]);
  attribute2.ownerElement = attribute2[PREV] = attribute2[NEXT] = null;
  if (name === "class")
    element[CLASS_LIST] = null;
  attributeChangedCallback2(element, name, value);
  attributeChangedCallback(element, name, value, null);
};
var booleanAttribute = {
  get(element, name) {
    return element.hasAttribute(name);
  },
  set(element, name, value) {
    if (value)
      element.setAttribute(name, "");
    else
      element.removeAttribute(name);
  }
};
var numericAttribute = {
  get(element, name) {
    return parseFloat(element.getAttribute(name) || 0);
  },
  set(element, name, value) {
    element.setAttribute(name, value);
  }
};
var stringAttribute = {
  get(element, name) {
    return element.getAttribute(name) || "";
  },
  set(element, name, value) {
    element.setAttribute(name, value);
  }
};

// node_modules/linkedom/esm/interface/event-target.js
var wm = /* @__PURE__ */ new WeakMap();
function dispatch(event, listener) {
  if (typeof listener === "function")
    listener.call(event.target, event);
  else
    listener.handleEvent(event);
  return event._stopImmediatePropagationFlag;
}
function invokeListeners({ currentTarget, target }) {
  const map2 = wm.get(currentTarget);
  if (map2 && map2.has(this.type)) {
    const listeners = map2.get(this.type);
    if (currentTarget === target) {
      this.eventPhase = this.AT_TARGET;
    } else {
      this.eventPhase = this.BUBBLING_PHASE;
    }
    this.currentTarget = currentTarget;
    this.target = target;
    for (const [listener, options] of listeners) {
      if (options && options.once)
        listeners.delete(listener);
      if (dispatch(this, listener))
        break;
    }
    delete this.currentTarget;
    delete this.target;
    return this.cancelBubble;
  }
}
var DOMEventTarget = class {
  constructor() {
    wm.set(this, /* @__PURE__ */ new Map());
  }
  /**
   * @protected
   */
  _getParent() {
    return null;
  }
  addEventListener(type, listener, options) {
    const map2 = wm.get(this);
    if (!map2.has(type))
      map2.set(type, /* @__PURE__ */ new Map());
    map2.get(type).set(listener, options);
  }
  removeEventListener(type, listener) {
    const map2 = wm.get(this);
    if (map2.has(type)) {
      const listeners = map2.get(type);
      if (listeners.delete(listener) && !listeners.size)
        map2.delete(type);
    }
  }
  dispatchEvent(event) {
    let node = this;
    event.eventPhase = event.CAPTURING_PHASE;
    while (node) {
      if (node.dispatchEvent)
        event._path.push({ currentTarget: node, target: this });
      node = event.bubbles && node._getParent && node._getParent();
    }
    event._path.some(invokeListeners, event);
    event._path = [];
    event.eventPhase = event.NONE;
    return !event.defaultPrevented;
  }
};

// node_modules/linkedom/esm/interface/node-list.js
var NodeList = class extends Array {
  item(i) {
    return i < this.length ? this[i] : null;
  }
};

// node_modules/linkedom/esm/interface/node.js
var getParentNodeCount = ({ parentNode }) => {
  let count = 0;
  while (parentNode) {
    count++;
    parentNode = parentNode.parentNode;
  }
  return count;
};
var Node2 = class extends DOMEventTarget {
  static get ELEMENT_NODE() {
    return ELEMENT_NODE;
  }
  static get ATTRIBUTE_NODE() {
    return ATTRIBUTE_NODE;
  }
  static get TEXT_NODE() {
    return TEXT_NODE;
  }
  static get CDATA_SECTION_NODE() {
    return CDATA_SECTION_NODE;
  }
  static get COMMENT_NODE() {
    return COMMENT_NODE;
  }
  static get DOCUMENT_NODE() {
    return DOCUMENT_NODE;
  }
  static get DOCUMENT_FRAGMENT_NODE() {
    return DOCUMENT_FRAGMENT_NODE;
  }
  static get DOCUMENT_TYPE_NODE() {
    return DOCUMENT_TYPE_NODE;
  }
  constructor(ownerDocument, localName, nodeType) {
    super();
    this.ownerDocument = ownerDocument;
    this.localName = localName;
    this.nodeType = nodeType;
    this.parentNode = null;
    this[NEXT] = null;
    this[PREV] = null;
  }
  get ELEMENT_NODE() {
    return ELEMENT_NODE;
  }
  get ATTRIBUTE_NODE() {
    return ATTRIBUTE_NODE;
  }
  get TEXT_NODE() {
    return TEXT_NODE;
  }
  get CDATA_SECTION_NODE() {
    return CDATA_SECTION_NODE;
  }
  get COMMENT_NODE() {
    return COMMENT_NODE;
  }
  get DOCUMENT_NODE() {
    return DOCUMENT_NODE;
  }
  get DOCUMENT_FRAGMENT_NODE() {
    return DOCUMENT_FRAGMENT_NODE;
  }
  get DOCUMENT_TYPE_NODE() {
    return DOCUMENT_TYPE_NODE;
  }
  get baseURI() {
    const ownerDocument = this.nodeType === DOCUMENT_NODE ? this : this.ownerDocument;
    if (ownerDocument) {
      const base = ownerDocument.querySelector("base");
      if (base)
        return base.getAttribute("href");
      const { location } = ownerDocument.defaultView;
      if (location)
        return location.href;
    }
    return null;
  }
  /* c8 ignore start */
  // mixin: node
  get isConnected() {
    return false;
  }
  get nodeName() {
    return this.localName;
  }
  get parentElement() {
    return null;
  }
  get previousSibling() {
    return null;
  }
  get previousElementSibling() {
    return null;
  }
  get nextSibling() {
    return null;
  }
  get nextElementSibling() {
    return null;
  }
  get childNodes() {
    return new NodeList();
  }
  get firstChild() {
    return null;
  }
  get lastChild() {
    return null;
  }
  // default values
  get nodeValue() {
    return null;
  }
  set nodeValue(value) {
  }
  get textContent() {
    return null;
  }
  set textContent(value) {
  }
  normalize() {
  }
  cloneNode() {
    return null;
  }
  contains() {
    return false;
  }
  /**
   * Inserts a node before a reference node as a child of this parent node.
   * @param {Node} newNode The node to be inserted.
   * @param {Node} referenceNode The node before which newNode is inserted. If this is null, then newNode is inserted at the end of node's child nodes.
   * @returns The added child
   */
  // eslint-disable-next-line no-unused-vars
  insertBefore(newNode, referenceNode) {
    return newNode;
  }
  /**
   * Adds a node to the end of the list of children of this node.
   * @param {Node} child The node to append to the given parent node.
   * @returns The appended child.
   */
  appendChild(child) {
    return child;
  }
  /**
   * Replaces a child node within this node
   * @param {Node} newChild The new node to replace oldChild.
   * @param {Node} oldChild The child to be replaced.
   * @returns The replaced Node. This is the same node as oldChild.
   */
  replaceChild(newChild, oldChild) {
    return oldChild;
  }
  /**
   * Removes a child node from the DOM.
   * @param {Node} child A Node that is the child node to be removed from the DOM.
   * @returns The removed node.
   */
  removeChild(child) {
    return child;
  }
  toString() {
    return "";
  }
  /* c8 ignore stop */
  hasChildNodes() {
    return !!this.lastChild;
  }
  isSameNode(node) {
    return this === node;
  }
  // TODO: attributes?
  compareDocumentPosition(target) {
    let result = 0;
    if (this !== target) {
      let self2 = getParentNodeCount(this);
      let other = getParentNodeCount(target);
      if (self2 < other) {
        result += DOCUMENT_POSITION_FOLLOWING;
        if (this.contains(target))
          result += DOCUMENT_POSITION_CONTAINED_BY;
      } else if (other < self2) {
        result += DOCUMENT_POSITION_PRECEDING;
        if (target.contains(this))
          result += DOCUMENT_POSITION_CONTAINS;
      } else if (self2 && other) {
        const { childNodes } = this.parentNode;
        if (childNodes.indexOf(this) < childNodes.indexOf(target))
          result += DOCUMENT_POSITION_FOLLOWING;
        else
          result += DOCUMENT_POSITION_PRECEDING;
      }
      if (!self2 || !other) {
        result += DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
        result += DOCUMENT_POSITION_DISCONNECTED;
      }
    }
    return result;
  }
  isEqualNode(node) {
    if (this === node)
      return true;
    if (this.nodeType === node.nodeType) {
      switch (this.nodeType) {
        case DOCUMENT_NODE:
        case DOCUMENT_FRAGMENT_NODE: {
          const aNodes = this.childNodes;
          const bNodes = node.childNodes;
          return aNodes.length === bNodes.length && aNodes.every((node2, i) => node2.isEqualNode(bNodes[i]));
        }
      }
      return this.toString() === node.toString();
    }
    return false;
  }
  /**
   * @protected
   */
  _getParent() {
    return this.parentNode;
  }
  /**
   * Calling it on an element inside a standard web page will return an HTMLDocument object representing the entire page (or <iframe>).
   * Calling it on an element inside a shadow DOM will return the associated ShadowRoot.
   * @return {ShadowRoot | HTMLDocument}
   */
  getRootNode() {
    let root2 = this;
    while (root2.parentNode)
      root2 = root2.parentNode;
    return root2;
  }
};

// node_modules/linkedom/esm/shared/text-escaper.js
var { replace } = "";
var ca = /[<>&\xA0]/g;
var esca = {
  "\xA0": "&#160;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
var pe = (m) => esca[m];
var escape2 = (es) => replace.call(es, ca, pe);

// node_modules/linkedom/esm/interface/attr.js
var QUOTE = /"/g;
var Attr = class _Attr extends Node2 {
  constructor(ownerDocument, name, value = "") {
    super(ownerDocument, name, ATTRIBUTE_NODE);
    this.ownerElement = null;
    this.name = $String(name);
    this[VALUE] = $String(value);
    this[CHANGED] = false;
  }
  get value() {
    return this[VALUE];
  }
  set value(newValue) {
    const { [VALUE]: oldValue, name, ownerElement } = this;
    this[VALUE] = $String(newValue);
    this[CHANGED] = true;
    if (ownerElement) {
      attributeChangedCallback2(ownerElement, name, oldValue);
      attributeChangedCallback(ownerElement, name, oldValue, this[VALUE]);
    }
  }
  cloneNode() {
    const { ownerDocument, name, [VALUE]: value } = this;
    return new _Attr(ownerDocument, name, value);
  }
  toString() {
    const { name, [VALUE]: value } = this;
    if (emptyAttributes.has(name) && !value) {
      return ignoreCase(this) ? name : `${name}=""`;
    }
    const escapedValue = (ignoreCase(this) ? value : escape2(value)).replace(QUOTE, "&quot;");
    return `${name}="${escapedValue}"`;
  }
  toJSON() {
    const json = [];
    attrAsJSON(this, json);
    return json;
  }
};

// node_modules/linkedom/esm/shared/node.js
var isConnected = ({ ownerDocument, parentNode }) => {
  while (parentNode) {
    if (parentNode === ownerDocument)
      return true;
    parentNode = parentNode.parentNode || parentNode.host;
  }
  return false;
};
var parentElement = ({ parentNode }) => {
  if (parentNode) {
    switch (parentNode.nodeType) {
      case DOCUMENT_NODE:
      case DOCUMENT_FRAGMENT_NODE:
        return null;
    }
  }
  return parentNode;
};
var previousSibling = ({ [PREV]: prev2 }) => {
  switch (prev2 ? prev2.nodeType : 0) {
    case NODE_END:
      return prev2[START];
    case TEXT_NODE:
    case COMMENT_NODE:
    case CDATA_SECTION_NODE:
      return prev2;
  }
  return null;
};
var nextSibling = (node) => {
  const next2 = getEnd(node)[NEXT];
  return next2 && (next2.nodeType === NODE_END ? null : next2);
};

// node_modules/linkedom/esm/mixin/non-document-type-child-node.js
var nextElementSibling2 = (node) => {
  let next2 = nextSibling(node);
  while (next2 && next2.nodeType !== ELEMENT_NODE)
    next2 = nextSibling(next2);
  return next2;
};
var previousElementSibling = (node) => {
  let prev2 = previousSibling(node);
  while (prev2 && prev2.nodeType !== ELEMENT_NODE)
    prev2 = previousSibling(prev2);
  return prev2;
};

// node_modules/linkedom/esm/mixin/child-node.js
var asFragment = (ownerDocument, nodes) => {
  const fragment = ownerDocument.createDocumentFragment();
  fragment.append(...nodes);
  return fragment;
};
var before = (node, nodes) => {
  const { ownerDocument, parentNode } = node;
  if (parentNode)
    parentNode.insertBefore(
      asFragment(ownerDocument, nodes),
      node
    );
};
var after = (node, nodes) => {
  const { ownerDocument, parentNode } = node;
  if (parentNode)
    parentNode.insertBefore(
      asFragment(ownerDocument, nodes),
      getEnd(node)[NEXT]
    );
};
var replaceWith = (node, nodes) => {
  const { ownerDocument, parentNode } = node;
  if (parentNode) {
    if (nodes.includes(node))
      replaceWith(node, [node = node.cloneNode()]);
    parentNode.insertBefore(
      asFragment(ownerDocument, nodes),
      node
    );
    node.remove();
  }
};
var remove = (prev2, current, next2) => {
  const { parentNode, nodeType } = current;
  if (prev2 || next2) {
    setAdjacent(prev2, next2);
    current[PREV] = null;
    getEnd(current)[NEXT] = null;
  }
  if (parentNode) {
    current.parentNode = null;
    moCallback(current, parentNode);
    if (nodeType === ELEMENT_NODE)
      disconnectedCallback(current);
  }
};

// node_modules/linkedom/esm/interface/character-data.js
var CharacterData = class extends Node2 {
  constructor(ownerDocument, localName, nodeType, data2) {
    super(ownerDocument, localName, nodeType);
    this[VALUE] = $String(data2);
  }
  // <Mixins>
  get isConnected() {
    return isConnected(this);
  }
  get parentElement() {
    return parentElement(this);
  }
  get previousSibling() {
    return previousSibling(this);
  }
  get nextSibling() {
    return nextSibling(this);
  }
  get previousElementSibling() {
    return previousElementSibling(this);
  }
  get nextElementSibling() {
    return nextElementSibling2(this);
  }
  before(...nodes) {
    before(this, nodes);
  }
  after(...nodes) {
    after(this, nodes);
  }
  replaceWith(...nodes) {
    replaceWith(this, nodes);
  }
  remove() {
    remove(this[PREV], this, this[NEXT]);
  }
  // </Mixins>
  // CharacterData only
  /* c8 ignore start */
  get data() {
    return this[VALUE];
  }
  set data(value) {
    this[VALUE] = $String(value);
    moCallback(this, this.parentNode);
  }
  get nodeValue() {
    return this.data;
  }
  set nodeValue(value) {
    this.data = value;
  }
  get textContent() {
    return this.data;
  }
  set textContent(value) {
    this.data = value;
  }
  get length() {
    return this.data.length;
  }
  substringData(offset, count) {
    return this.data.substr(offset, count);
  }
  appendData(data2) {
    this.data += data2;
  }
  insertData(offset, data2) {
    const { data: t } = this;
    this.data = t.slice(0, offset) + data2 + t.slice(offset);
  }
  deleteData(offset, count) {
    const { data: t } = this;
    this.data = t.slice(0, offset) + t.slice(offset + count);
  }
  replaceData(offset, count, data2) {
    const { data: t } = this;
    this.data = t.slice(0, offset) + data2 + t.slice(offset + count);
  }
  /* c8 ignore stop */
  toJSON() {
    const json = [];
    characterDataAsJSON(this, json);
    return json;
  }
};

// node_modules/linkedom/esm/interface/cdata-section.js
var CDATASection = class _CDATASection extends CharacterData {
  constructor(ownerDocument, data2 = "") {
    super(ownerDocument, "#cdatasection", CDATA_SECTION_NODE, data2);
  }
  cloneNode() {
    const { ownerDocument, [VALUE]: data2 } = this;
    return new _CDATASection(ownerDocument, data2);
  }
  toString() {
    return `<![CDATA[${this[VALUE]}]]>`;
  }
};

// node_modules/linkedom/esm/interface/comment.js
var Comment3 = class _Comment extends CharacterData {
  constructor(ownerDocument, data2 = "") {
    super(ownerDocument, "#comment", COMMENT_NODE, data2);
  }
  cloneNode() {
    const { ownerDocument, [VALUE]: data2 } = this;
    return new _Comment(ownerDocument, data2);
  }
  toString() {
    return `<!--${this[VALUE]}-->`;
  }
};

// node_modules/boolbase/dist/index.js
function trueFunc() {
  return true;
}
function falseFunc() {
  return false;
}

// node_modules/css-what/dist/types.js
var SelectorType;
(function(SelectorType2) {
  SelectorType2["Attribute"] = "attribute";
  SelectorType2["Pseudo"] = "pseudo";
  SelectorType2["PseudoElement"] = "pseudo-element";
  SelectorType2["Tag"] = "tag";
  SelectorType2["Universal"] = "universal";
  SelectorType2["Adjacent"] = "adjacent";
  SelectorType2["Child"] = "child";
  SelectorType2["Descendant"] = "descendant";
  SelectorType2["Parent"] = "parent";
  SelectorType2["Sibling"] = "sibling";
  SelectorType2["ColumnCombinator"] = "column-combinator";
})(SelectorType || (SelectorType = {}));
var AttributeAction;
(function(AttributeAction2) {
  AttributeAction2["Any"] = "any";
  AttributeAction2["Element"] = "element";
  AttributeAction2["End"] = "end";
  AttributeAction2["Equals"] = "equals";
  AttributeAction2["Exists"] = "exists";
  AttributeAction2["Hyphen"] = "hyphen";
  AttributeAction2["Not"] = "not";
  AttributeAction2["Start"] = "start";
})(AttributeAction || (AttributeAction = {}));

// node_modules/css-what/dist/parse.js
var reName = /^[^#\\]?(?:\\(?:[\da-f]{1,6}\s?|.)|[\w\u00B0-\uFFFF-])+/;
var reEscape = /\\([\da-f]{1,6}\s?|(\s)|.)/gi;
var CharCode;
(function(CharCode2) {
  CharCode2[CharCode2["LeftParenthesis"] = 40] = "LeftParenthesis";
  CharCode2[CharCode2["RightParenthesis"] = 41] = "RightParenthesis";
  CharCode2[CharCode2["LeftSquareBracket"] = 91] = "LeftSquareBracket";
  CharCode2[CharCode2["RightSquareBracket"] = 93] = "RightSquareBracket";
  CharCode2[CharCode2["Comma"] = 44] = "Comma";
  CharCode2[CharCode2["Period"] = 46] = "Period";
  CharCode2[CharCode2["Colon"] = 58] = "Colon";
  CharCode2[CharCode2["SingleQuote"] = 39] = "SingleQuote";
  CharCode2[CharCode2["DoubleQuote"] = 34] = "DoubleQuote";
  CharCode2[CharCode2["Plus"] = 43] = "Plus";
  CharCode2[CharCode2["Tilde"] = 126] = "Tilde";
  CharCode2[CharCode2["QuestionMark"] = 63] = "QuestionMark";
  CharCode2[CharCode2["ExclamationMark"] = 33] = "ExclamationMark";
  CharCode2[CharCode2["Slash"] = 47] = "Slash";
  CharCode2[CharCode2["Equal"] = 61] = "Equal";
  CharCode2[CharCode2["Dollar"] = 36] = "Dollar";
  CharCode2[CharCode2["Pipe"] = 124] = "Pipe";
  CharCode2[CharCode2["Circumflex"] = 94] = "Circumflex";
  CharCode2[CharCode2["Asterisk"] = 42] = "Asterisk";
  CharCode2[CharCode2["GreaterThan"] = 62] = "GreaterThan";
  CharCode2[CharCode2["LessThan"] = 60] = "LessThan";
  CharCode2[CharCode2["Hash"] = 35] = "Hash";
  CharCode2[CharCode2["LowerI"] = 105] = "LowerI";
  CharCode2[CharCode2["LowerS"] = 115] = "LowerS";
  CharCode2[CharCode2["BackSlash"] = 92] = "BackSlash";
  CharCode2[CharCode2["Space"] = 32] = "Space";
  CharCode2[CharCode2["Tab"] = 9] = "Tab";
  CharCode2[CharCode2["NewLine"] = 10] = "NewLine";
  CharCode2[CharCode2["FormFeed"] = 12] = "FormFeed";
  CharCode2[CharCode2["CarriageReturn"] = 13] = "CarriageReturn";
})(CharCode || (CharCode = {}));
var actionTypes = /* @__PURE__ */ new Map([
  [CharCode.Tilde, AttributeAction.Element],
  [CharCode.Circumflex, AttributeAction.Start],
  [CharCode.Dollar, AttributeAction.End],
  [CharCode.Asterisk, AttributeAction.Any],
  [CharCode.ExclamationMark, AttributeAction.Not],
  [CharCode.Pipe, AttributeAction.Hyphen]
]);
var unpackPseudos = /* @__PURE__ */ new Set([
  "has",
  "not",
  "matches",
  "is",
  "where",
  "host",
  "host-context"
]);
var pseudosToPseudoElements = /* @__PURE__ */ new Set([
  "before",
  "after",
  "first-line",
  "first-letter"
]);
function isTraversal(selector) {
  switch (selector.type) {
    case SelectorType.Adjacent:
    case SelectorType.Child:
    case SelectorType.Descendant:
    case SelectorType.Parent:
    case SelectorType.Sibling:
    case SelectorType.ColumnCombinator: {
      return true;
    }
    case SelectorType.Attribute:
    case SelectorType.Pseudo:
    case SelectorType.PseudoElement:
    case SelectorType.Tag:
    case SelectorType.Universal: {
      return false;
    }
  }
}
var stripQuotesFromPseudos = /* @__PURE__ */ new Set(["contains", "icontains"]);
function funescape(_, escaped, escapedWhitespace) {
  const high = Number.parseInt(escaped, 16) - 65536;
  return Number.isNaN(high) || escapedWhitespace ? escaped : high < 0 ? (
    // BMP codepoint
    String.fromCharCode(high + 65536)
  ) : (
    // Supplemental Plane codepoint (surrogate pair)
    String.fromCharCode(high >> 10 | 55296, high & 1023 | 56320)
  );
}
function unescapeCSS(cssString) {
  return cssString.replace(reEscape, funescape);
}
function isQuote(c) {
  return c === CharCode.SingleQuote || c === CharCode.DoubleQuote;
}
function isWhitespace2(c) {
  return c === CharCode.Space || c === CharCode.Tab || c === CharCode.NewLine || c === CharCode.FormFeed || c === CharCode.CarriageReturn;
}
function parse(selector) {
  const subselects2 = [];
  const endIndex = parseSelector(subselects2, `${selector}`, 0);
  if (endIndex < selector.length) {
    throw new Error(`Unmatched selector: ${selector.slice(endIndex)}`);
  }
  return subselects2;
}
function parseSelector(subselects2, selector, selectorIndex) {
  let tokens = [];
  function getName4(offset) {
    const match = selector.slice(selectorIndex + offset).match(reName);
    if (!match) {
      throw new Error(`Expected name, found ${selector.slice(selectorIndex)}`);
    }
    const [name] = match;
    selectorIndex += offset + name.length;
    return unescapeCSS(name);
  }
  function stripWhitespace(offset) {
    selectorIndex += offset;
    while (selectorIndex < selector.length && isWhitespace2(selector.charCodeAt(selectorIndex))) {
      selectorIndex++;
    }
  }
  function readValueWithParenthesis() {
    selectorIndex += 1;
    const start = selectorIndex;
    for (let counter = 1; selectorIndex < selector.length; selectorIndex++) {
      switch (selector.charCodeAt(selectorIndex)) {
        case CharCode.BackSlash: {
          selectorIndex += 1;
          break;
        }
        case CharCode.LeftParenthesis: {
          counter += 1;
          break;
        }
        case CharCode.RightParenthesis: {
          counter -= 1;
          if (counter === 0) {
            return unescapeCSS(selector.slice(start, selectorIndex++));
          }
          break;
        }
      }
    }
    throw new Error("Parenthesis not matched");
  }
  function ensureNotTraversal() {
    if (tokens.length > 0 && isTraversal(tokens[tokens.length - 1])) {
      throw new Error("Did not expect successive traversals.");
    }
  }
  function addTraversal(type) {
    if (tokens.length > 0 && tokens[tokens.length - 1].type === SelectorType.Descendant) {
      tokens[tokens.length - 1].type = type;
      return;
    }
    ensureNotTraversal();
    tokens.push({ type });
  }
  function addSpecialAttribute(name, action) {
    tokens.push({
      type: SelectorType.Attribute,
      name,
      action,
      value: getName4(1),
      namespace: null,
      ignoreCase: "quirks"
    });
  }
  function finalizeSubselector() {
    if (tokens.length > 0 && tokens[tokens.length - 1].type === SelectorType.Descendant) {
      tokens.pop();
    }
    if (tokens.length === 0) {
      throw new Error("Empty sub-selector");
    }
    subselects2.push(tokens);
  }
  stripWhitespace(0);
  if (selector.length === selectorIndex) {
    return selectorIndex;
  }
  loop: while (selectorIndex < selector.length) {
    const firstChar = selector.charCodeAt(selectorIndex);
    switch (firstChar) {
      // Whitespace
      case CharCode.Space:
      case CharCode.Tab:
      case CharCode.NewLine:
      case CharCode.FormFeed:
      case CharCode.CarriageReturn: {
        if (tokens.length === 0 || tokens[0].type !== SelectorType.Descendant) {
          ensureNotTraversal();
          tokens.push({ type: SelectorType.Descendant });
        }
        stripWhitespace(1);
        break;
      }
      // Traversals
      case CharCode.GreaterThan: {
        addTraversal(SelectorType.Child);
        stripWhitespace(1);
        break;
      }
      case CharCode.LessThan: {
        addTraversal(SelectorType.Parent);
        stripWhitespace(1);
        break;
      }
      case CharCode.Tilde: {
        addTraversal(SelectorType.Sibling);
        stripWhitespace(1);
        break;
      }
      case CharCode.Plus: {
        addTraversal(SelectorType.Adjacent);
        stripWhitespace(1);
        break;
      }
      // Special attribute selectors: .class, #id
      case CharCode.Period: {
        addSpecialAttribute("class", AttributeAction.Element);
        break;
      }
      case CharCode.Hash: {
        addSpecialAttribute("id", AttributeAction.Equals);
        break;
      }
      case CharCode.LeftSquareBracket: {
        stripWhitespace(1);
        let name;
        let namespace = null;
        if (selector.charCodeAt(selectorIndex) === CharCode.Pipe) {
          name = getName4(1);
        } else if (selector.startsWith("*|", selectorIndex)) {
          namespace = "*";
          name = getName4(2);
        } else {
          name = getName4(0);
          if (selector.charCodeAt(selectorIndex) === CharCode.Pipe && selector.charCodeAt(selectorIndex + 1) !== CharCode.Equal) {
            namespace = name;
            name = getName4(1);
          }
        }
        stripWhitespace(0);
        let action = AttributeAction.Exists;
        const possibleAction = actionTypes.get(selector.charCodeAt(selectorIndex));
        if (possibleAction) {
          action = possibleAction;
          if (selector.charCodeAt(selectorIndex + 1) !== CharCode.Equal) {
            throw new Error("Expected `=`");
          }
          stripWhitespace(2);
        } else if (selector.charCodeAt(selectorIndex) === CharCode.Equal) {
          action = AttributeAction.Equals;
          stripWhitespace(1);
        }
        let value = "";
        let ignoreCase2 = null;
        if (action !== "exists") {
          if (isQuote(selector.charCodeAt(selectorIndex))) {
            const quote = selector.charCodeAt(selectorIndex);
            selectorIndex += 1;
            const sectionStart = selectorIndex;
            while (selectorIndex < selector.length && selector.charCodeAt(selectorIndex) !== quote) {
              selectorIndex += // Skip next character if it is escaped
              selector.charCodeAt(selectorIndex) === CharCode.BackSlash ? 2 : 1;
            }
            if (selector.charCodeAt(selectorIndex) !== quote) {
              throw new Error("Attribute value didn't end");
            }
            value = unescapeCSS(selector.slice(sectionStart, selectorIndex));
            selectorIndex += 1;
          } else {
            const valueStart = selectorIndex;
            while (selectorIndex < selector.length && !isWhitespace2(selector.charCodeAt(selectorIndex)) && selector.charCodeAt(selectorIndex) !== CharCode.RightSquareBracket) {
              selectorIndex += // Skip next character if it is escaped
              selector.charCodeAt(selectorIndex) === CharCode.BackSlash ? 2 : 1;
            }
            value = unescapeCSS(selector.slice(valueStart, selectorIndex));
          }
          stripWhitespace(0);
          switch (selector.charCodeAt(selectorIndex) | 32) {
            // If the forceIgnore flag is set (either `i` or `s`), use that value
            case CharCode.LowerI: {
              ignoreCase2 = true;
              stripWhitespace(1);
              break;
            }
            case CharCode.LowerS: {
              ignoreCase2 = false;
              stripWhitespace(1);
              break;
            }
          }
        }
        if (selector.charCodeAt(selectorIndex) !== CharCode.RightSquareBracket) {
          throw new Error("Attribute selector didn't terminate");
        }
        selectorIndex += 1;
        const attributeSelector = {
          type: SelectorType.Attribute,
          name,
          action,
          value,
          namespace,
          ignoreCase: ignoreCase2
        };
        tokens.push(attributeSelector);
        break;
      }
      case CharCode.Colon: {
        if (selector.charCodeAt(selectorIndex + 1) === CharCode.Colon) {
          tokens.push({
            type: SelectorType.PseudoElement,
            name: getName4(2).toLowerCase(),
            data: selector.charCodeAt(selectorIndex) === CharCode.LeftParenthesis ? readValueWithParenthesis() : null
          });
          break;
        }
        const name = getName4(1).toLowerCase();
        if (pseudosToPseudoElements.has(name)) {
          tokens.push({
            type: SelectorType.PseudoElement,
            name,
            data: null
          });
          break;
        }
        let data2 = null;
        if (selector.charCodeAt(selectorIndex) === CharCode.LeftParenthesis) {
          if (unpackPseudos.has(name)) {
            if (isQuote(selector.charCodeAt(selectorIndex + 1))) {
              throw new Error(`Pseudo-selector ${name} cannot be quoted`);
            }
            data2 = [];
            selectorIndex = parseSelector(data2, selector, selectorIndex + 1);
            if (selector.charCodeAt(selectorIndex) !== CharCode.RightParenthesis) {
              throw new Error(`Missing closing parenthesis in :${name} (${selector})`);
            }
            selectorIndex += 1;
          } else {
            data2 = readValueWithParenthesis();
            if (stripQuotesFromPseudos.has(name)) {
              const quot = data2.charCodeAt(0);
              if (quot === data2.charCodeAt(data2.length - 1) && isQuote(quot)) {
                data2 = data2.slice(1, -1);
              }
            }
            data2 = unescapeCSS(data2);
          }
        }
        tokens.push({ type: SelectorType.Pseudo, name, data: data2 });
        break;
      }
      case CharCode.Comma: {
        finalizeSubselector();
        tokens = [];
        stripWhitespace(1);
        break;
      }
      default: {
        if (selector.startsWith("/*", selectorIndex)) {
          const endIndex = selector.indexOf("*/", selectorIndex + 2);
          if (endIndex === -1) {
            throw new Error("Comment was not terminated");
          }
          selectorIndex = endIndex + 2;
          if (tokens.length === 0) {
            stripWhitespace(0);
          }
          break;
        }
        let namespace = null;
        let name;
        if (firstChar === CharCode.Asterisk) {
          selectorIndex += 1;
          name = "*";
        } else if (firstChar === CharCode.Pipe) {
          name = "";
          if (selector.charCodeAt(selectorIndex + 1) === CharCode.Pipe) {
            addTraversal(SelectorType.ColumnCombinator);
            stripWhitespace(2);
            break;
          }
        } else if (reName.test(selector.slice(selectorIndex))) {
          name = getName4(0);
        } else {
          break loop;
        }
        if (selector.charCodeAt(selectorIndex) === CharCode.Pipe && selector.charCodeAt(selectorIndex + 1) !== CharCode.Pipe) {
          namespace = name;
          if (selector.charCodeAt(selectorIndex + 1) === CharCode.Asterisk) {
            name = "*";
            selectorIndex += 2;
          } else {
            name = getName4(1);
          }
        }
        tokens.push(name === "*" ? { type: SelectorType.Universal, namespace } : { type: SelectorType.Tag, name, namespace });
      }
    }
  }
  finalizeSubselector();
  return selectorIndex;
}

// node_modules/domhandler/node_modules/domelementtype/dist/index.js
var ElementType2;
(function(ElementType5) {
  ElementType5["Root"] = "root";
  ElementType5["Text"] = "text";
  ElementType5["Directive"] = "directive";
  ElementType5["Comment"] = "comment";
  ElementType5["Script"] = "script";
  ElementType5["Style"] = "style";
  ElementType5["Tag"] = "tag";
  ElementType5["CDATA"] = "cdata";
  ElementType5["Doctype"] = "doctype";
})(ElementType2 || (ElementType2 = {}));
function isTag3(element) {
  return element.type === ElementType2.Tag || element.type === ElementType2.Script || element.type === ElementType2.Style;
}
var Root2 = ElementType2.Root;
var Text3 = ElementType2.Text;
var Directive2 = ElementType2.Directive;
var Comment4 = ElementType2.Comment;
var Script2 = ElementType2.Script;
var Style2 = ElementType2.Style;
var Tag2 = ElementType2.Tag;
var CDATA3 = ElementType2.CDATA;
var Doctype2 = ElementType2.Doctype;

// node_modules/domhandler/dist/node.js
function isTag4(node) {
  return isTag3(node);
}
function isCDATA2(node) {
  return node.type === ElementType2.CDATA;
}
function isText2(node) {
  return node.type === ElementType2.Text;
}
function isComment2(node) {
  return node.type === ElementType2.Comment;
}
function hasChildren2(node) {
  return Object.hasOwn(node, "children");
}

// node_modules/domutils/dist/index.js
var dist_exports2 = {};
__export(dist_exports2, {
  DocumentPosition: () => DocumentPosition2,
  append: () => append3,
  appendChild: () => appendChild2,
  compareDocumentPosition: () => compareDocumentPosition2,
  existsOne: () => existsOne2,
  filter: () => filter2,
  find: () => find2,
  findAll: () => findAll2,
  findOne: () => findOne2,
  getAttributeValue: () => getAttributeValue2,
  getChildren: () => getChildren2,
  getElementById: () => getElementById2,
  getElements: () => getElements2,
  getElementsByClassName: () => getElementsByClassName2,
  getElementsByTagName: () => getElementsByTagName2,
  getElementsByTagType: () => getElementsByTagType2,
  getFeed: () => getFeed2,
  getInnerHTML: () => getInnerHTML2,
  getName: () => getName2,
  getOuterHTML: () => getOuterHTML2,
  getParent: () => getParent2,
  getSiblings: () => getSiblings2,
  getText: () => getText2,
  hasAttrib: () => hasAttrib2,
  innerText: () => innerText2,
  nextElementSibling: () => nextElementSibling3,
  prepend: () => prepend2,
  prependChild: () => prependChild2,
  prevElementSibling: () => prevElementSibling2,
  removeElement: () => removeElement2,
  removeSubsets: () => removeSubsets2,
  replaceElement: () => replaceElement2,
  testElement: () => testElement2,
  textContent: () => textContent2,
  uniqueSort: () => uniqueSort2
});

// node_modules/domutils/dist/querying.js
function filter2(test, node, recurse = true, limit = Number.POSITIVE_INFINITY) {
  return find2(test, Array.isArray(node) ? node : [node], recurse, limit);
}
function find2(test, nodes, recurse, limit) {
  const result = [];
  const nodeStack = [Array.isArray(nodes) ? nodes : [nodes]];
  const indexStack = [0];
  for (; ; ) {
    if (indexStack[0] >= nodeStack[0].length) {
      if (indexStack.length === 1) {
        return result;
      }
      nodeStack.shift();
      indexStack.shift();
      continue;
    }
    const element = nodeStack[0][indexStack[0]++];
    if (test(element)) {
      result.push(element);
      if (--limit <= 0)
        return result;
    }
    if (recurse && hasChildren2(element) && element.children.length > 0) {
      indexStack.unshift(0);
      nodeStack.unshift(element.children);
    }
  }
}
function findOne2(test, nodes, recurse = true) {
  const searchedNodes = Array.isArray(nodes) ? nodes : [nodes];
  for (const node of searchedNodes) {
    if (isTag4(node) && test(node)) {
      return node;
    }
    if (recurse && hasChildren2(node) && node.children.length > 0) {
      const found = findOne2(test, node.children, true);
      if (found)
        return found;
    }
  }
  return null;
}
function existsOne2(test, nodes) {
  return (Array.isArray(nodes) ? nodes : [nodes]).some((node) => isTag4(node) && test(node) || hasChildren2(node) && existsOne2(test, node.children));
}
function findAll2(test, nodes) {
  const result = [];
  const nodeStack = [Array.isArray(nodes) ? nodes : [nodes]];
  const indexStack = [0];
  for (; ; ) {
    if (indexStack[0] >= nodeStack[0].length) {
      if (nodeStack.length === 1) {
        return result;
      }
      nodeStack.shift();
      indexStack.shift();
      continue;
    }
    const element = nodeStack[0][indexStack[0]++];
    if (isTag4(element) && test(element))
      result.push(element);
    if (hasChildren2(element) && element.children.length > 0) {
      indexStack.unshift(0);
      nodeStack.unshift(element.children);
    }
  }
}

// node_modules/domutils/dist/legacy.js
var Checks2 = {
  tag_name(name) {
    if (typeof name === "function") {
      return (element) => isTag4(element) && name(element.name);
    }
    if (name === "*") {
      return isTag4;
    }
    return (element) => isTag4(element) && element.name === name;
  },
  tag_type(type) {
    if (typeof type === "function") {
      return (element) => type(element.type);
    }
    return (element) => element.type === type;
  },
  tag_contains(data2) {
    if (typeof data2 === "function") {
      return (element) => isText2(element) && data2(element.data);
    }
    return (element) => isText2(element) && element.data === data2;
  }
};
function getAttribCheck2(attrib, value) {
  if (typeof value === "function") {
    return (element) => isTag4(element) && value(element.attribs[attrib]);
  }
  return (element) => isTag4(element) && element.attribs[attrib] === value;
}
function combineFuncs2(a, b) {
  return (element) => a(element) || b(element);
}
function compileTest2(options) {
  const funcs = Object.keys(options).map((key2) => {
    const value = options[key2];
    return Object.hasOwn(Checks2, key2) ? Checks2[key2](value) : getAttribCheck2(key2, value);
  });
  return funcs.length === 0 ? null : funcs.reduce(combineFuncs2);
}
function testElement2(options, node) {
  const test = compileTest2(options);
  return test ? test(node) : true;
}
function getElements2(options, nodes, recurse, limit = Number.POSITIVE_INFINITY) {
  const test = compileTest2(options);
  return test ? filter2(test, nodes, recurse, limit) : [];
}
function getElementById2(id, nodes, recurse = true) {
  if (!Array.isArray(nodes))
    nodes = [nodes];
  return findOne2(getAttribCheck2("id", id), nodes, recurse);
}
function getElementsByTagName2(tagName19, nodes, recurse = true, limit = Number.POSITIVE_INFINITY) {
  return filter2(Checks2["tag_name"](tagName19), nodes, recurse, limit);
}
function getElementsByClassName2(className, nodes, recurse = true, limit = Number.POSITIVE_INFINITY) {
  return filter2(getAttribCheck2("class", className), nodes, recurse, limit);
}
function getElementsByTagType2(type, nodes, recurse = true, limit = Number.POSITIVE_INFINITY) {
  return filter2(Checks2["tag_type"](type), nodes, recurse, limit);
}

// node_modules/dom-serializer/node_modules/domelementtype/dist/index.js
var ElementType3;
(function(ElementType5) {
  ElementType5["Root"] = "root";
  ElementType5["Text"] = "text";
  ElementType5["Directive"] = "directive";
  ElementType5["Comment"] = "comment";
  ElementType5["Script"] = "script";
  ElementType5["Style"] = "style";
  ElementType5["Tag"] = "tag";
  ElementType5["CDATA"] = "cdata";
  ElementType5["Doctype"] = "doctype";
})(ElementType3 || (ElementType3 = {}));
var Root3 = ElementType3.Root;
var Text4 = ElementType3.Text;
var Directive3 = ElementType3.Directive;
var Comment5 = ElementType3.Comment;
var Script3 = ElementType3.Script;
var Style3 = ElementType3.Style;
var Tag3 = ElementType3.Tag;
var CDATA4 = ElementType3.CDATA;
var Doctype3 = ElementType3.Doctype;

// node_modules/entities/dist/escape.js
var xmlCodeMap2 = /* @__PURE__ */ new Map([
  [34, "&quot;"],
  [38, "&amp;"],
  [39, "&apos;"],
  [60, "&lt;"],
  [62, "&gt;"]
]);
var getCodePoint2 = typeof String.prototype.codePointAt === "function" ? (input, index) => input.codePointAt(index) : (
  // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
  (c, index) => (c.charCodeAt(index) & 64512) === 55296 ? (c.charCodeAt(index) - 55296) * 1024 + c.charCodeAt(index + 1) - 56320 + 65536 : c.charCodeAt(index)
);
var XML_BITSET_VALUE = 1342177476;
function encodeXML2(input) {
  let out;
  let last = 0;
  const { length: length2 } = input;
  for (let index = 0; index < length2; index++) {
    const char = input.charCodeAt(index);
    if (char < 128 && ((XML_BITSET_VALUE >>> char & 1) === 0 || char >= 64 || char < 32)) {
      continue;
    }
    if (out === void 0)
      out = input.substring(0, index);
    else if (last !== index)
      out += input.substring(last, index);
    if (char < 64) {
      out += xmlCodeMap2.get(char);
      last = index + 1;
      continue;
    }
    const cp = getCodePoint2(input, index);
    out += `&#x${cp.toString(16)};`;
    if (cp !== char)
      index++;
    last = index + 1;
  }
  if (out === void 0)
    return input;
  if (last < length2)
    out += input.substr(last);
  return out;
}
function getEscaper2(regex, map2) {
  return function escape4(data2) {
    let match;
    let lastIndex = 0;
    let result = "";
    while (match = regex.exec(data2)) {
      if (lastIndex !== match.index) {
        result += data2.substring(lastIndex, match.index);
      }
      result += map2.get(match[0].charCodeAt(0));
      lastIndex = match.index + 1;
    }
    return result + data2.substring(lastIndex);
  };
}
var escapeAttribute2 = /* @__PURE__ */ getEscaper2(/["&\u00A0]/g, /* @__PURE__ */ new Map([
  [34, "&quot;"],
  [38, "&amp;"],
  [160, "&nbsp;"]
]));
var escapeText2 = /* @__PURE__ */ getEscaper2(/[&<>\u00A0]/g, /* @__PURE__ */ new Map([
  [38, "&amp;"],
  [60, "&lt;"],
  [62, "&gt;"],
  [160, "&nbsp;"]
]));

// node_modules/entities/dist/index.js
var EntityLevel2;
(function(EntityLevel3) {
  EntityLevel3[EntityLevel3["XML"] = 0] = "XML";
  EntityLevel3[EntityLevel3["HTML"] = 1] = "HTML";
})(EntityLevel2 || (EntityLevel2 = {}));
var EncodingMode2;
(function(EncodingMode3) {
  EncodingMode3[EncodingMode3["UTF8"] = 0] = "UTF8";
  EncodingMode3[EncodingMode3["ASCII"] = 1] = "ASCII";
  EncodingMode3[EncodingMode3["Extensive"] = 2] = "Extensive";
  EncodingMode3[EncodingMode3["Attribute"] = 3] = "Attribute";
  EncodingMode3[EncodingMode3["Text"] = 4] = "Text";
})(EncodingMode2 || (EncodingMode2 = {}));

// node_modules/dom-serializer/dist/foreign-names.js
var elementNames2 = new Map("altGlyph altGlyphDef altGlyphItem animateColor animateMotion animateTransform clipPath feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feDistantLight feDropShadow feFlood feFuncA feFuncB feFuncG feFuncR feGaussianBlur feImage feMerge feMergeNode feMorphology feOffset fePointLight feSpecularLighting feSpotLight feTile feTurbulence foreignObject glyphRef linearGradient radialGradient textPath".split(" ").map((name) => [name.toLowerCase(), name]));
var attributeNames2 = new Map("definitionURL attributeName attributeType baseFrequency baseProfile calcMode clipPathUnits diffuseConstant edgeMode filterUnits glyphRef gradientTransform gradientUnits kernelMatrix kernelUnitLength keyPoints keySplines keyTimes lengthAdjust limitingConeAngle markerHeight markerUnits markerWidth maskContentUnits maskUnits numOctaves pathLength patternContentUnits patternTransform patternUnits pointsAtX pointsAtY pointsAtZ preserveAlpha preserveAspectRatio primitiveUnits refX refY repeatCount repeatDur requiredExtensions requiredFeatures specularConstant specularExponent spreadMethod startOffset stdDeviation stitchTiles surfaceScale systemLanguage tableValues targetX targetY textLength viewBox viewTarget xChannelSelector yChannelSelector zoomAndPan".split(" ").map((name) => [name.toLowerCase(), name]));

// node_modules/dom-serializer/dist/index.js
var unencodedElements2 = new Set("style script xmp iframe noembed noframes plaintext noscript".split(" "));
var voidElements2 = new Set("area base basefont br col command embed frame hr img input isindex keygen link meta param source track wbr".split(" "));
var foreignElements2 = /* @__PURE__ */ new Set(["svg", "math"]);
var foreignModeIntegrationPoints2 = new Set("mi mo mn ms mtext annotation-xml foreignObject desc title".split(" "));
function render2(node, options = {}) {
  const nodes = "length" in node ? node : [node];
  const xmlMode = options.xmlMode ?? false;
  let output = "";
  for (let index = 0; index < nodes.length; index++) {
    output += renderNode2(nodes[index], options, xmlMode);
  }
  return output;
}
var dist_default = render2;
function renderChildren(children, options, xmlMode) {
  let output = "";
  for (let index = 0; index < children.length; index++) {
    output += renderNode2(children[index], options, xmlMode);
  }
  return output;
}
function renderNode2(node, options, xmlMode) {
  switch (node.type) {
    case Root3: {
      return renderChildren(node.children, options, xmlMode);
    }
    case Directive3: {
      return `<${node.data}>`;
    }
    case Comment5: {
      return `<!--${node.data}-->`;
    }
    case CDATA4: {
      return `<![CDATA[${node.children[0].data}]]>`;
    }
    case Script3:
    case Style3:
    case Tag3: {
      return renderTag2(node, options, xmlMode);
    }
    case Text4: {
      const element = node;
      const data2 = element.data || "";
      if ((options.encodeEntities ?? options.decodeEntities) !== false && !(!xmlMode && element.parent && unencodedElements2.has(element.parent.name))) {
        return xmlMode || options.encodeEntities !== "utf8" ? encodeXML2(data2) : escapeText2(data2);
      }
      return data2;
    }
  }
}
function renderTag2(element, options, xmlMode) {
  if (xmlMode === "foreign") {
    element.name = elementNames2.get(element.name) ?? element.name;
    if (element.parent && foreignModeIntegrationPoints2.has(element.parent.name)) {
      xmlMode = false;
    }
  }
  if (!xmlMode && foreignElements2.has(element.name)) {
    xmlMode = "foreign";
  }
  const { name, children } = element;
  const isVoid2 = !xmlMode && voidElements2.has(name);
  let tag = `<${name}${formatAttributes2(element.attribs, options, xmlMode)}`;
  if (children.length === 0 && (xmlMode ? options.selfClosingTags !== false : options.selfClosingTags && isVoid2)) {
    tag += xmlMode ? "/>" : " />";
  } else {
    tag += ">";
    if (children.length > 0) {
      tag += renderChildren(children, options, xmlMode);
    }
    if (!isVoid2) {
      tag += `</${name}>`;
    }
  }
  return tag;
}
function replaceQuotes2(value) {
  return value.replaceAll('"', "&quot;");
}
function formatAttributes2(attributes, options, xmlMode) {
  if (!attributes)
    return "";
  const encode = (options.encodeEntities ?? options.decodeEntities) === false ? replaceQuotes2 : xmlMode || options.encodeEntities !== "utf8" ? encodeXML2 : escapeAttribute2;
  const isForeign = xmlMode === "foreign";
  const showEmpty = !!(options.emptyAttrs ?? xmlMode);
  let result = "";
  for (const key2 in attributes) {
    if (!Object.hasOwn(attributes, key2))
      continue;
    const value = attributes[key2];
    const k = isForeign ? attributeNames2.get(key2) ?? key2 : key2;
    result += !showEmpty && (value == null || value === "") ? ` ${k}` : ` ${k}="${encode(value == null ? "" : String(value))}"`;
  }
  return result;
}

// node_modules/domutils/node_modules/domelementtype/dist/index.js
var ElementType4;
(function(ElementType5) {
  ElementType5["Root"] = "root";
  ElementType5["Text"] = "text";
  ElementType5["Directive"] = "directive";
  ElementType5["Comment"] = "comment";
  ElementType5["Script"] = "script";
  ElementType5["Style"] = "style";
  ElementType5["Tag"] = "tag";
  ElementType5["CDATA"] = "cdata";
  ElementType5["Doctype"] = "doctype";
})(ElementType4 || (ElementType4 = {}));
var Root4 = ElementType4.Root;
var Text5 = ElementType4.Text;
var Directive4 = ElementType4.Directive;
var Comment6 = ElementType4.Comment;
var Script4 = ElementType4.Script;
var Style4 = ElementType4.Style;
var Tag4 = ElementType4.Tag;
var CDATA5 = ElementType4.CDATA;
var Doctype4 = ElementType4.Doctype;

// node_modules/domutils/dist/stringify.js
function getOuterHTML2(node, options) {
  return dist_default(node, options);
}
function getInnerHTML2(node, options) {
  return hasChildren2(node) ? node.children.map((node2) => getOuterHTML2(node2, options)).join("") : "";
}
function getText2(node) {
  if (Array.isArray(node))
    return node.map(getText2).join("");
  if (isTag4(node))
    return node.name === "br" ? "\n" : getText2(node.children);
  if (isCDATA2(node))
    return getText2(node.children);
  if (isText2(node))
    return node.data;
  return "";
}
function textContent2(node) {
  if (Array.isArray(node))
    return node.map(textContent2).join("");
  if (hasChildren2(node) && !isComment2(node)) {
    return textContent2(node.children);
  }
  if (isText2(node))
    return node.data;
  return "";
}
function innerText2(node) {
  if (Array.isArray(node))
    return node.map(innerText2).join("");
  if (hasChildren2(node) && (node.type === ElementType4.Tag || isCDATA2(node))) {
    return innerText2(node.children);
  }
  if (isText2(node))
    return node.data;
  return "";
}

// node_modules/domutils/dist/feeds.js
function getFeed2(document2) {
  const feedRoot = getOneElement2(isValidFeed2, document2);
  return feedRoot ? feedRoot.name === "feed" ? getAtomFeed2(feedRoot) : getRssFeed2(feedRoot) : null;
}
function getAtomFeed2(feedRoot) {
  const childs = feedRoot.children;
  const feed = {
    type: "atom",
    items: getElementsByTagName2("entry", childs).map((item) => {
      const { children } = item;
      const entry = { media: getMediaElements2(children) };
      addConditionally2(entry, "id", "id", children);
      addConditionally2(entry, "title", "title", children);
      const href2 = getOneElement2("link", children)?.attribs["href"];
      if (href2) {
        entry.link = href2;
      }
      const description = fetch2("summary", children) || fetch2("content", children);
      if (description) {
        entry.description = description;
      }
      const pubDate = fetch2("updated", children);
      if (pubDate) {
        entry.pubDate = new Date(pubDate);
      }
      return entry;
    })
  };
  addConditionally2(feed, "id", "id", childs);
  addConditionally2(feed, "title", "title", childs);
  const href = getOneElement2("link", childs)?.attribs["href"];
  if (href) {
    feed.link = href;
  }
  addConditionally2(feed, "description", "subtitle", childs);
  const updated = fetch2("updated", childs);
  if (updated) {
    feed.updated = new Date(updated);
  }
  addConditionally2(feed, "author", "email", childs, true);
  return feed;
}
function getRssFeed2(feedRoot) {
  const childs = getOneElement2("channel", feedRoot.children)?.children ?? [];
  const feed = {
    type: feedRoot.name.substr(0, 3),
    id: "",
    items: getElementsByTagName2("item", feedRoot.children).map((item) => {
      const { children } = item;
      const entry = { media: getMediaElements2(children) };
      addConditionally2(entry, "id", "guid", children);
      addConditionally2(entry, "title", "title", children);
      addConditionally2(entry, "link", "link", children);
      addConditionally2(entry, "description", "description", children);
      const pubDate = fetch2("pubDate", children) || fetch2("dc:date", children);
      if (pubDate)
        entry.pubDate = new Date(pubDate);
      return entry;
    })
  };
  addConditionally2(feed, "title", "title", childs);
  addConditionally2(feed, "link", "link", childs);
  addConditionally2(feed, "description", "description", childs);
  const updated = fetch2("lastBuildDate", childs);
  if (updated) {
    feed.updated = new Date(updated);
  }
  addConditionally2(feed, "author", "managingEditor", childs, true);
  return feed;
}
var MEDIA_KEYS_STRING2 = ["url", "type", "lang"];
var MEDIA_KEYS_INT2 = [
  "fileSize",
  "bitrate",
  "framerate",
  "samplingrate",
  "channels",
  "duration",
  "height",
  "width"
];
function getMediaElements2(where) {
  return getElementsByTagName2("media:content", where).map((element) => {
    const { attribs } = element;
    const media = {
      medium: attribs["medium"],
      isDefault: !!attribs["isDefault"]
    };
    for (const attrib of MEDIA_KEYS_STRING2) {
      if (attribs[attrib]) {
        media[attrib] = attribs[attrib];
      }
    }
    for (const attrib of MEDIA_KEYS_INT2) {
      if (attribs[attrib]) {
        media[attrib] = Number.parseInt(attribs[attrib], 10);
      }
    }
    if (attribs["expression"]) {
      media.expression = attribs["expression"];
    }
    return media;
  });
}
function getOneElement2(tagName19, node) {
  return getElementsByTagName2(tagName19, node, true, 1)[0];
}
function fetch2(tagName19, where, recurse = false) {
  return textContent2(getElementsByTagName2(tagName19, where, recurse, 1)).trim();
}
function addConditionally2(object, property, tagName19, where, recurse = false) {
  const value = fetch2(tagName19, where, recurse);
  if (value)
    object[property] = value;
}
function isValidFeed2(value) {
  return value === "rss" || value === "feed" || value === "rdf:RDF";
}

// node_modules/domutils/dist/helpers.js
function removeSubsets2(nodes) {
  let index = nodes.length;
  while (--index >= 0) {
    const node = nodes[index];
    if (index > 0 && nodes.lastIndexOf(node, index - 1) >= 0) {
      nodes.splice(index, 1);
      continue;
    }
    for (let ancestor = node.parent; ancestor; ancestor = ancestor.parent) {
      if (nodes.includes(ancestor)) {
        nodes.splice(index, 1);
        break;
      }
    }
  }
  return nodes;
}
var DocumentPosition2;
(function(DocumentPosition3) {
  DocumentPosition3[DocumentPosition3["DISCONNECTED"] = 1] = "DISCONNECTED";
  DocumentPosition3[DocumentPosition3["PRECEDING"] = 2] = "PRECEDING";
  DocumentPosition3[DocumentPosition3["FOLLOWING"] = 4] = "FOLLOWING";
  DocumentPosition3[DocumentPosition3["CONTAINS"] = 8] = "CONTAINS";
  DocumentPosition3[DocumentPosition3["CONTAINED_BY"] = 16] = "CONTAINED_BY";
})(DocumentPosition2 || (DocumentPosition2 = {}));
function compareDocumentPosition2(nodeA, nodeB) {
  const aParents = [];
  const bParents = [];
  if (nodeA === nodeB) {
    return 0;
  }
  let current = hasChildren2(nodeA) ? nodeA : nodeA.parent;
  while (current) {
    aParents.unshift(current);
    current = current.parent;
  }
  current = hasChildren2(nodeB) ? nodeB : nodeB.parent;
  while (current) {
    bParents.unshift(current);
    current = current.parent;
  }
  const maxIndex = Math.min(aParents.length, bParents.length);
  let index = 0;
  while (index < maxIndex && aParents[index] === bParents[index]) {
    index++;
  }
  if (index === 0) {
    return DocumentPosition2.DISCONNECTED;
  }
  const sharedParent = aParents[index - 1];
  const siblings2 = sharedParent.children;
  const aSibling = aParents[index];
  const bSibling = bParents[index];
  if (siblings2.indexOf(aSibling) > siblings2.indexOf(bSibling)) {
    if (sharedParent === nodeB) {
      return DocumentPosition2.FOLLOWING | DocumentPosition2.CONTAINED_BY;
    }
    return DocumentPosition2.FOLLOWING;
  }
  if (sharedParent === nodeA) {
    return DocumentPosition2.PRECEDING | DocumentPosition2.CONTAINS;
  }
  return DocumentPosition2.PRECEDING;
}
function uniqueSort2(nodes) {
  nodes = nodes.filter((node, index, array2) => !array2.includes(node, index + 1));
  nodes.sort((a, b) => {
    const relative = compareDocumentPosition2(a, b);
    if (relative & DocumentPosition2.PRECEDING) {
      return -1;
    }
    if (relative & DocumentPosition2.FOLLOWING) {
      return 1;
    }
    return 0;
  });
  return nodes;
}

// node_modules/domutils/dist/manipulation.js
function removeElement2(element) {
  if (element.prev)
    element.prev.next = element.next;
  if (element.next)
    element.next.prev = element.prev;
  if (element.parent) {
    const childs = element.parent.children;
    const childsIndex = childs.lastIndexOf(element);
    if (childsIndex !== -1) {
      childs.splice(childsIndex, 1);
    }
  }
  element.next = null;
  element.prev = null;
  element.parent = null;
}
function replaceElement2(element, replacement) {
  replacement.prev = element.prev;
  if (replacement.prev) {
    replacement.prev.next = replacement;
  }
  replacement.next = element.next;
  if (replacement.next) {
    replacement.next.prev = replacement;
  }
  replacement.parent = element.parent;
  if (replacement.parent) {
    const { children } = replacement.parent;
    const elementIndex = children.lastIndexOf(element);
    if (elementIndex === -1) {
      return;
    }
    children[elementIndex] = replacement;
    element.parent = null;
  }
}
function appendChild2(parent, child) {
  removeElement2(child);
  child.next = null;
  child.parent = parent;
  if (parent.children.push(child) > 1) {
    const sibling = parent.children[parent.children.length - 2];
    sibling.next = child;
    child.prev = sibling;
  } else {
    child.prev = null;
  }
}
function append3(element, next2) {
  removeElement2(next2);
  const { parent } = element;
  const currentNext = element.next;
  next2.next = currentNext;
  next2.prev = element;
  element.next = next2;
  next2.parent = parent;
  if (currentNext) {
    currentNext.prev = next2;
    if (parent) {
      const childs = parent.children;
      childs.splice(childs.lastIndexOf(currentNext), 0, next2);
    }
  } else if (parent) {
    parent.children.push(next2);
  }
}
function prependChild2(parent, child) {
  removeElement2(child);
  child.parent = parent;
  child.prev = null;
  if (parent.children.unshift(child) === 1) {
    child.next = null;
  } else {
    const sibling = parent.children[1];
    sibling.prev = child;
    child.next = sibling;
  }
}
function prepend2(element, previous) {
  removeElement2(previous);
  const { parent } = element;
  if (parent) {
    const childs = parent.children;
    childs.splice(childs.indexOf(element), 0, previous);
  }
  if (element.prev) {
    element.prev.next = previous;
  }
  previous.parent = parent;
  previous.prev = element.prev;
  previous.next = element;
  element.prev = previous;
}

// node_modules/domutils/dist/traversal.js
function getChildren2(element) {
  return hasChildren2(element) ? element.children : [];
}
function getParent2(element) {
  return element.parent || null;
}
function getSiblings2(element) {
  const parent = getParent2(element);
  if (parent != null)
    return getChildren2(parent);
  const siblings2 = [element];
  let { prev: prev2, next: next2 } = element;
  while (prev2 != null) {
    siblings2.unshift(prev2);
    ({ prev: prev2 } = prev2);
  }
  while (next2 != null) {
    siblings2.push(next2);
    ({ next: next2 } = next2);
  }
  return siblings2;
}
function getAttributeValue2(element, name) {
  const { attribs } = element;
  return attribs?.[name];
}
function hasAttrib2(element, name) {
  const { attribs } = element;
  return attribs != null && Object.hasOwn(attribs, name) && attribs[name] != null;
}
function getName2(element) {
  return element.name;
}
function nextElementSibling3(element) {
  let { next: next2 } = element;
  while (next2 !== null && !isTag4(next2))
    ({ next: next2 } = next2);
  return next2;
}
function prevElementSibling2(element) {
  let { prev: prev2 } = element;
  while (prev2 !== null && !isTag4(prev2))
    ({ prev: prev2 } = prev2);
  return prev2;
}

// node_modules/css-select/dist/attributes.js
var reChars = /[-[\]{}()*+?.,\\^$|#\s]/g;
var whitespaceRe = /\s/;
function escapeRegex(value) {
  return value.replace(reChars, "\\$&");
}
var caseInsensitiveAttributes = /* @__PURE__ */ new Set([
  "accept",
  "accept-charset",
  "align",
  "alink",
  "axis",
  "bgcolor",
  "charset",
  "checked",
  "clear",
  "codetype",
  "color",
  "compact",
  "declare",
  "defer",
  "dir",
  "direction",
  "disabled",
  "enctype",
  "face",
  "frame",
  "hreflang",
  "http-equiv",
  "lang",
  "language",
  "link",
  "media",
  "method",
  "multiple",
  "nohref",
  "noresize",
  "noshade",
  "nowrap",
  "readonly",
  "rel",
  "rev",
  "rules",
  "scope",
  "scrolling",
  "selected",
  "shape",
  "target",
  "text",
  "type",
  "valign",
  "valuetype",
  "vlink"
]);
function shouldIgnoreCase(selector, options) {
  return typeof selector.ignoreCase === "boolean" ? selector.ignoreCase : selector.ignoreCase === "quirks" ? !!options.quirksMode : !options.xmlMode && caseInsensitiveAttributes.has(selector.name);
}
var attributeRules = {
  equals(next2, data2, options) {
    const { adapter: adapter2 } = options;
    const { name } = data2;
    let { value } = data2;
    if (shouldIgnoreCase(data2, options)) {
      value = value.toLowerCase();
      return (element) => {
        const attribute2 = adapter2.getAttributeValue(element, name);
        return attribute2 != null && attribute2.length === value.length && attribute2.toLowerCase() === value && next2(element);
      };
    }
    return (element) => adapter2.getAttributeValue(element, name) === value && next2(element);
  },
  hyphen(next2, data2, options) {
    const { adapter: adapter2 } = options;
    const { name } = data2;
    let { value } = data2;
    const { length: length2 } = value;
    if (shouldIgnoreCase(data2, options)) {
      value = value.toLowerCase();
      return function hyphenIC(element) {
        const attribute2 = adapter2.getAttributeValue(element, name);
        return attribute2 != null && (attribute2.length === length2 || attribute2.charAt(length2) === "-") && attribute2.substr(0, length2).toLowerCase() === value && next2(element);
      };
    }
    return function hyphen(element) {
      const attribute2 = adapter2.getAttributeValue(element, name);
      return attribute2 != null && (attribute2.length === length2 || attribute2.charAt(length2) === "-") && attribute2.substr(0, length2) === value && next2(element);
    };
  },
  element(next2, data2, options) {
    const { adapter: adapter2 } = options;
    const { name, value } = data2;
    if (whitespaceRe.test(value)) {
      return falseFunc;
    }
    const regex = new RegExp(`(?:^|\\s)${escapeRegex(value)}(?:$|\\s)`, shouldIgnoreCase(data2, options) ? "i" : "");
    return function element(node) {
      const attribute2 = adapter2.getAttributeValue(node, name);
      return attribute2 != null && attribute2.length >= value.length && regex.test(attribute2) && next2(node);
    };
  },
  exists(next2, { name }, { adapter: adapter2 }) {
    return (element) => adapter2.hasAttrib(element, name) && next2(element);
  },
  start(next2, data2, options) {
    const { adapter: adapter2 } = options;
    const { name } = data2;
    let { value } = data2;
    const { length: length2 } = value;
    if (length2 === 0) {
      return falseFunc;
    }
    if (shouldIgnoreCase(data2, options)) {
      value = value.toLowerCase();
      return (element) => {
        const attribute2 = adapter2.getAttributeValue(element, name);
        return attribute2 != null && attribute2.length >= length2 && attribute2.substr(0, length2).toLowerCase() === value && next2(element);
      };
    }
    return (element) => !!adapter2.getAttributeValue(element, name)?.startsWith(value) && next2(element);
  },
  end(next2, data2, options) {
    const { adapter: adapter2 } = options;
    const { name } = data2;
    let { value } = data2;
    const length2 = -value.length;
    if (length2 === 0) {
      return falseFunc;
    }
    if (shouldIgnoreCase(data2, options)) {
      value = value.toLowerCase();
      return (element) => adapter2.getAttributeValue(element, name)?.substr(length2).toLowerCase() === value && next2(element);
    }
    return (element) => !!adapter2.getAttributeValue(element, name)?.endsWith(value) && next2(element);
  },
  any(next2, data2, options) {
    const { adapter: adapter2 } = options;
    const { name, value } = data2;
    if (value === "") {
      return falseFunc;
    }
    if (shouldIgnoreCase(data2, options)) {
      const regex = new RegExp(escapeRegex(value), "i");
      return function anyIC(element) {
        const attribute2 = adapter2.getAttributeValue(element, name);
        return attribute2 != null && attribute2.length >= value.length && regex.test(attribute2) && next2(element);
      };
    }
    return (element) => !!adapter2.getAttributeValue(element, name)?.includes(value) && next2(element);
  },
  not(next2, data2, options) {
    const { adapter: adapter2 } = options;
    const { name } = data2;
    let { value } = data2;
    if (value === "") {
      return (element) => !!adapter2.getAttributeValue(element, name) && next2(element);
    }
    if (shouldIgnoreCase(data2, options)) {
      value = value.toLowerCase();
      return (element) => {
        const attribute2 = adapter2.getAttributeValue(element, name);
        return (attribute2 == null || attribute2.length !== value.length || attribute2.toLowerCase() !== value) && next2(element);
      };
    }
    return (element) => adapter2.getAttributeValue(element, name) !== value && next2(element);
  }
};

// node_modules/css-select/dist/helpers/querying.js
function findAll3(query2, nodes, options) {
  const { adapter: adapter2, xmlMode = false } = options;
  const result = [];
  const nodeStack = [nodes];
  const indexStack = [0];
  for (; ; ) {
    if (indexStack[0] >= nodeStack[0].length) {
      if (nodeStack.length === 1) {
        return result;
      }
      nodeStack.shift();
      indexStack.shift();
      continue;
    }
    const element = nodeStack[0][indexStack[0]++];
    if (!adapter2.isTag(element)) {
      continue;
    }
    if (query2(element)) {
      result.push(element);
    }
    if (xmlMode || adapter2.getName(element) !== "template") {
      const children = adapter2.getChildren(element);
      if (children.length > 0) {
        nodeStack.unshift(children);
        indexStack.unshift(0);
      }
    }
  }
}
function findOne3(query2, nodes, options) {
  const { adapter: adapter2, xmlMode = false } = options;
  const nodeStack = [nodes];
  const indexStack = [0];
  for (; ; ) {
    if (indexStack[0] >= nodeStack[0].length) {
      if (nodeStack.length === 1) {
        return null;
      }
      nodeStack.shift();
      indexStack.shift();
      continue;
    }
    const element = nodeStack[0][indexStack[0]++];
    if (!adapter2.isTag(element)) {
      continue;
    }
    if (query2(element)) {
      return element;
    }
    if (xmlMode || adapter2.getName(element) !== "template") {
      const children = adapter2.getChildren(element);
      if (children.length > 0) {
        nodeStack.unshift(children);
        indexStack.unshift(0);
      }
    }
  }
}
function getNextSiblings(element, adapter2) {
  const siblings2 = adapter2.getSiblings(element);
  if (siblings2.length <= 1) {
    return [];
  }
  const elementIndex = siblings2.indexOf(element);
  if (elementIndex === -1 || elementIndex === siblings2.length - 1) {
    return [];
  }
  return siblings2.slice(elementIndex + 1).filter(adapter2.isTag);
}
function getElementParent(node, adapter2) {
  const parent = adapter2.getParent(node);
  return parent != null && adapter2.isTag(parent) ? parent : null;
}

// node_modules/css-select/dist/pseudo-selectors/aliases.js
var textControl = "input:is([type=text i],[type=search i],[type=url i],[type=tel i],[type=email i],[type=password i],[type=date i],[type=month i],[type=week i],[type=time i],[type=datetime-local i],[type=number i])";
var aliases = {
  // Links
  "any-link": ":is(a, area, link)[href]",
  link: ":any-link:not(:visited)",
  // Forms
  // https://html.spec.whatwg.org/multipage/scripting.html#disabled-elements
  disabled: `:is(
        :is(button, input, select, textarea, optgroup, option)[disabled],
        optgroup[disabled] > option,
        fieldset[disabled]:not(fieldset[disabled] legend:first-of-type *)
    )`,
  enabled: ":is(button, input, select, textarea, optgroup, option, fieldset):not(:disabled)",
  checked: ":is(:is(input[type=radio], input[type=checkbox])[checked], :selected)",
  required: ":is(input, select, textarea)[required]",
  optional: ":is(input, select, textarea):not([required])",
  "read-only": `[readonly]:is(textarea, ${textControl})`,
  "read-write": `:not([readonly]):is(textarea, ${textControl})`,
  // JQuery extensions
  /**
   * `:selected` matches option elements that have the `selected` attribute,
   * or are the first option element in a select element that does not have
   * the `multiple` attribute and does not have any option elements with the
   * `selected` attribute.
   * @see https://html.spec.whatwg.org/multipage/form-elements.html#concept-option-selectedness
   */
  selected: "option:is([selected], select:not([multiple]):not(:has(> option[selected])) > :first-of-type)",
  checkbox: "[type=checkbox]",
  file: "[type=file]",
  password: "[type=password]",
  radio: "[type=radio]",
  reset: "[type=reset]",
  image: "[type=image]",
  submit: "[type=submit]",
  parent: ":not(:empty)",
  header: ":is(h1, h2, h3, h4, h5, h6)",
  button: ":is(button, input[type=button])",
  input: ":is(input, textarea, select, button)",
  text: "input:is(:not([type!='']), [type=text])"
};

// node_modules/nth-check/dist/compile.js
function compile(parsed) {
  const a = parsed[0];
  const b = parsed[1] - 1;
  if (b < 0 && a <= 0)
    return falseFunc;
  if (a === -1)
    return (index) => index <= b;
  if (a === 0)
    return (index) => index === b;
  if (a === 1)
    return b < 0 ? trueFunc : (index) => index >= b;
  const absA = Math.abs(a);
  const bModulo = (b % absA + absA) % absA;
  return a > 1 ? (index) => index >= b && index % absA === bModulo : (index) => index <= b && index % absA === bModulo;
}

// node_modules/nth-check/dist/parse.js
var whitespace = /* @__PURE__ */ new Set([9, 10, 12, 13, 32]);
var ZERO = "0".charCodeAt(0);
var NINE = "9".charCodeAt(0);
function parse2(formula) {
  formula = formula.trim().toLowerCase();
  switch (formula) {
    case "even": {
      return [2, 0];
    }
    case "odd": {
      return [2, 1];
    }
  }
  let index = 0;
  let a = 0;
  let sign = readSign();
  let number = readNumber();
  if (index < formula.length && formula.charAt(index) === "n") {
    index++;
    a = sign * (number ?? 1);
    skipWhitespace();
    if (index < formula.length) {
      sign = readSign();
      skipWhitespace();
      number = readNumber();
    } else {
      sign = number = 0;
    }
  }
  if (number === null || index < formula.length) {
    throw new Error(`n-th rule couldn't be parsed ('${formula}')`);
  }
  return [a, sign * number];
  function readSign() {
    switch (formula.charAt(index)) {
      case "-": {
        index++;
        return -1;
      }
      case "+": {
        index++;
        break;
      }
    }
    return 1;
  }
  function readNumber() {
    const start = index;
    let value = 0;
    while (index < formula.length && formula.charCodeAt(index) >= ZERO && formula.charCodeAt(index) <= NINE) {
      value = value * 10 + (formula.charCodeAt(index) - ZERO);
      index++;
    }
    return index === start ? null : value;
  }
  function skipWhitespace() {
    while (index < formula.length && whitespace.has(formula.charCodeAt(index))) {
      index++;
    }
  }
}

// node_modules/nth-check/dist/index.js
function nthCheck(formula) {
  return compile(parse2(formula));
}

// node_modules/css-select/dist/helpers/cache.js
function cacheParentResults(next2, { adapter: adapter2, cacheResults }, matches2) {
  if (cacheResults === false || typeof WeakMap === "undefined") {
    return (element) => next2(element) && matches2(element);
  }
  const resultCache = /* @__PURE__ */ new WeakMap();
  function addResultToCache(element) {
    const result = matches2(element);
    resultCache.set(element, result);
    return result;
  }
  return function cachedMatcher(element) {
    if (!next2(element)) {
      return false;
    }
    if (resultCache.has(element)) {
      return resultCache.get(element) ?? false;
    }
    let node = element;
    do {
      const parent = getElementParent(node, adapter2);
      if (parent === null) {
        return addResultToCache(element);
      }
      node = parent;
    } while (!resultCache.has(node));
    return resultCache.get(node) ? addResultToCache(element) : false;
  };
}

// node_modules/css-select/dist/helpers/options.js
function copyOptions(options) {
  const { context: _, rootFunc: __, ...copied } = options;
  return copied;
}

// node_modules/css-select/dist/pseudo-selectors/filters.js
function extendedFilter(tag, range) {
  if (range[0] !== "*" && range[0] !== tag[0])
    return false;
  let tagIndex = 1;
  for (let rangeIndex = 1; rangeIndex < range.length; rangeIndex++) {
    if (range[rangeIndex] === "*")
      continue;
    while (tagIndex < tag.length && tag[tagIndex] !== range[rangeIndex]) {
      if (tag[tagIndex++].length <= 1)
        return false;
    }
    if (tagIndex >= tag.length)
      return false;
    tagIndex++;
  }
  return true;
}
var nthOfRegex = /^(.+?)\s+of\s+(.+)$/is;
function compileNth(reverse, ofType) {
  return function nth(next2, rule, options, context, compileToken2) {
    const { adapter: adapter2, equals } = options;
    const ofMatch = ofType ? null : rule.match(nthOfRegex);
    const nthCheck2 = nthCheck(ofMatch ? ofMatch[1].trim() : rule);
    if (nthCheck2 === falseFunc)
      return falseFunc;
    const ofSelector = ofMatch && compileToken2 ? compileToken2(parse(ofMatch[2].trim()), copyOptions(options), context) : void 0;
    if (ofSelector === falseFunc)
      return falseFunc;
    if (nthCheck2 === trueFunc && !ofSelector) {
      return (element) => getElementParent(element, adapter2) !== null && next2(element);
    }
    const shouldCount = ofSelector ? (_element, sibling) => ofSelector(sibling) : ofType ? (element, sibling) => adapter2.getName(sibling) === adapter2.getName(element) : trueFunc;
    if (reverse) {
      return function nthLast(element) {
        if (ofSelector && !ofSelector(element))
          return false;
        const siblings2 = adapter2.getSiblings(element);
        let pos = 0;
        for (let index = siblings2.length - 1; index >= 0; index--) {
          const sibling = siblings2[index];
          if (equals(element, sibling))
            break;
          if (adapter2.isTag(sibling) && shouldCount(element, sibling))
            pos++;
        }
        return nthCheck2(pos) && next2(element);
      };
    }
    return function nth2(element) {
      if (ofSelector && !ofSelector(element))
        return false;
      const siblings2 = adapter2.getSiblings(element);
      let pos = 0;
      for (const sibling of siblings2) {
        if (equals(element, sibling))
          break;
        if (adapter2.isTag(sibling) && shouldCount(element, sibling))
          pos++;
      }
      return nthCheck2(pos) && next2(element);
    };
  };
}
var filters = {
  contains(next2, text, options) {
    const { getText: getText4 } = options.adapter;
    return cacheParentResults(next2, options, (element) => getText4(element).includes(text));
  },
  icontains(next2, text, options) {
    const itext = text.toLowerCase();
    const { getText: getText4 } = options.adapter;
    return cacheParentResults(next2, options, (element) => getText4(element).toLowerCase().includes(itext));
  },
  // Location specific methods
  "nth-child": compileNth(false, false),
  "nth-last-child": compileNth(true, false),
  "nth-of-type": compileNth(false, true),
  "nth-last-of-type": compileNth(true, true),
  // TODO determine the actual root element
  root(next2, _rule, { adapter: adapter2 }) {
    return (element) => getElementParent(element, adapter2) === null && next2(element);
  },
  scope(next2, rule, options, context) {
    const { equals } = options;
    if (!context || context.length === 0) {
      return filters["root"](next2, rule, options);
    }
    if (context.length === 1) {
      return (element) => equals(context[0], element) && next2(element);
    }
    return (element) => context.includes(element) && next2(element);
  },
  lang(next2, code, { adapter: adapter2 }) {
    const ranges = code.split(",").map((r) => r.trim()).filter((r) => r.length > 0).map((r) => r.replace(/^['"]|['"]$/g, "").toLowerCase().split("-"));
    return function lang(element) {
      let node = element;
      while (node != null) {
        const value = adapter2.getAttributeValue(node, "xml:lang") ?? adapter2.getAttributeValue(node, "lang");
        if (value != null) {
          if (!value) {
            return ranges.some((r) => r[0] === "") && next2(element);
          }
          const tag = value.toLowerCase().split("-");
          return ranges.some((r) => extendedFilter(tag, r)) && next2(element);
        }
        const parent = adapter2.getParent(node);
        node = parent != null && adapter2.isTag(parent) ? parent : null;
      }
      return ranges.some((r) => r[0] === "") && next2(element);
    };
  },
  hover: dynamicStatePseudo("isHovered"),
  visited: dynamicStatePseudo("isVisited"),
  active: dynamicStatePseudo("isActive")
};
function dynamicStatePseudo(name) {
  return function dynamicPseudo(next2, _rule, { adapter: adapter2 }) {
    const filterFunction = adapter2[name];
    if (typeof filterFunction !== "function") {
      return falseFunc;
    }
    return function active(element) {
      return filterFunction(element) && next2(element);
    };
  };
}

// node_modules/css-select/dist/pseudo-selectors/pseudos.js
var isDocumentWhiteSpace = /^[ \t\r\n]*$/;
var pseudos = {
  empty(element, { adapter: adapter2 }) {
    const children = adapter2.getChildren(element);
    return (
      // First, make sure the tag does not have any element children.
      children.every((element2) => !adapter2.isTag(element2)) && // Then, check that the text content is only whitespace.
      children.every((element2) => (
        // FIXME: `getText` call is potentially expensive.
        isDocumentWhiteSpace.test(adapter2.getText(element2))
      ))
    );
  },
  "first-child"(element, { adapter: adapter2, equals }) {
    if (adapter2.prevElementSibling) {
      return adapter2.prevElementSibling(element) == null;
    }
    const firstChild = adapter2.getSiblings(element).find((sibling) => adapter2.isTag(sibling));
    return firstChild != null && equals(element, firstChild);
  },
  "last-child"(element, { adapter: adapter2, equals }) {
    const siblings2 = adapter2.getSiblings(element);
    for (let index = siblings2.length - 1; index >= 0; index--) {
      if (equals(element, siblings2[index])) {
        return true;
      }
      if (adapter2.isTag(siblings2[index])) {
        break;
      }
    }
    return false;
  },
  "first-of-type"(element, { adapter: adapter2, equals }) {
    const siblings2 = adapter2.getSiblings(element);
    const elementName = adapter2.getName(element);
    for (const currentSibling of siblings2) {
      if (equals(element, currentSibling)) {
        return true;
      }
      if (adapter2.isTag(currentSibling) && adapter2.getName(currentSibling) === elementName) {
        break;
      }
    }
    return false;
  },
  "last-of-type"(element, { adapter: adapter2, equals }) {
    const siblings2 = adapter2.getSiblings(element);
    const elementName = adapter2.getName(element);
    for (let index = siblings2.length - 1; index >= 0; index--) {
      const currentSibling = siblings2[index];
      if (equals(element, currentSibling)) {
        return true;
      }
      if (adapter2.isTag(currentSibling) && adapter2.getName(currentSibling) === elementName) {
        break;
      }
    }
    return false;
  },
  "only-of-type"(element, { adapter: adapter2, equals }) {
    const elementName = adapter2.getName(element);
    return adapter2.getSiblings(element).every((sibling) => equals(element, sibling) || !adapter2.isTag(sibling) || adapter2.getName(sibling) !== elementName);
  },
  "only-child"(element, { adapter: adapter2, equals }) {
    return adapter2.getSiblings(element).every((sibling) => equals(element, sibling) || !adapter2.isTag(sibling));
  }
};
function verifyPseudoArguments(pseudoClassCondition, name, subselect, argumentIndex) {
  if (subselect === null) {
    if (pseudoClassCondition.length > argumentIndex) {
      throw new Error(`Pseudo-class :${name} requires an argument`);
    }
  } else if (pseudoClassCondition.length === argumentIndex) {
    throw new Error(`Pseudo-class :${name} doesn't have any arguments`);
  }
}

// node_modules/css-select/dist/helpers/selectors.js
function isTraversal2(token) {
  return token.type === "_flexibleDescendant" || isTraversal(token);
}
function sortRules(array2) {
  const ratings = array2.map(getQuality);
  for (let index = 1; index < array2.length; index++) {
    const procNew = ratings[index];
    if (procNew < 0) {
      continue;
    }
    for (let currentIndex = index; currentIndex > 0 && procNew < ratings[currentIndex - 1]; currentIndex--) {
      const token = array2[currentIndex];
      array2[currentIndex] = array2[currentIndex - 1];
      array2[currentIndex - 1] = token;
      ratings[currentIndex] = ratings[currentIndex - 1];
      ratings[currentIndex - 1] = procNew;
    }
  }
}
function getAttributeQuality(token) {
  switch (token.action) {
    case AttributeAction.Exists: {
      return 10;
    }
    case AttributeAction.Equals: {
      return token.name === "id" ? 9 : 8;
    }
    case AttributeAction.Not: {
      return 7;
    }
    case AttributeAction.Start: {
      return 6;
    }
    case AttributeAction.End: {
      return 6;
    }
    case AttributeAction.Any: {
      return 5;
    }
    case AttributeAction.Hyphen: {
      return 4;
    }
    case AttributeAction.Element: {
      return 3;
    }
  }
}
function getQuality(token) {
  switch (token.type) {
    case SelectorType.Universal: {
      return 50;
    }
    case SelectorType.Tag: {
      return 30;
    }
    case SelectorType.Attribute: {
      return Math.floor(getAttributeQuality(token) / // `ignoreCase` adds some overhead, half the result if applicable.
      (token.ignoreCase ? 2 : 1));
    }
    case SelectorType.Pseudo: {
      return token.data ? token.name === "has" || token.name === "contains" || token.name === "icontains" ? (
        // Expensive in any case — run as late as possible.
        0
      ) : Array.isArray(token.data) ? (
        // Eg. `:is`, `:not`
        Math.max(
          // If we have traversals, try to avoid executing this selector
          0,
          Math.min(...token.data.map((d) => Math.min(...d.map(getQuality))))
        )
      ) : 2 : 3;
    }
    default: {
      return -1;
    }
  }
}
function includesScopePseudo(t) {
  return t.type === SelectorType.Pseudo && (t.name === "scope" || Array.isArray(t.data) && t.data.some((data2) => data2.some(includesScopePseudo)));
}

// node_modules/css-select/dist/pseudo-selectors/subselects.js
var PLACEHOLDER_ELEMENT = {};
function hasDependsOnCurrentElement(selector) {
  return selector.some((sel) => sel.length > 0 && (isTraversal2(sel[0]) || sel.some(includesScopePseudo)));
}
var is = (next2, token, options, context, compileToken2) => {
  const compiledToken = compileToken2(token, copyOptions(options), context);
  return compiledToken === trueFunc ? next2 : compiledToken === falseFunc ? falseFunc : (element) => compiledToken(element) && next2(element);
};
var subselects = {
  is,
  /**
   * `:matches` and `:where` are aliases for `:is`.
   */
  matches: is,
  where: is,
  not(next2, token, options, context, compileToken2) {
    const compiledToken = compileToken2(token, copyOptions(options), context);
    return compiledToken === falseFunc ? next2 : compiledToken === trueFunc ? falseFunc : (element) => !compiledToken(element) && next2(element);
  },
  has(next2, subselect, options, _context, compileToken2) {
    const { adapter: adapter2 } = options;
    const copiedOptions = copyOptions(options);
    copiedOptions.relativeSelector = true;
    const context = subselect.some((s) => s.some(isTraversal2)) ? (
      // Used as a placeholder. Will be replaced with the actual element.
      [PLACEHOLDER_ELEMENT]
    ) : void 0;
    const skipCache = hasDependsOnCurrentElement(subselect);
    const compiled = compileToken2(subselect, copiedOptions, context);
    if (compiled === falseFunc) {
      return falseFunc;
    }
    if (context && compiled !== trueFunc) {
      return skipCache ? (element) => {
        if (!next2(element)) {
          return false;
        }
        context[0] = element;
        const childs = adapter2.getChildren(element);
        return findOne3(compiled, compiled.shouldTestNextSiblings ? [
          ...childs,
          ...getNextSiblings(element, adapter2)
        ] : childs, options) !== null;
      } : cacheParentResults(next2, options, (element) => {
        context[0] = element;
        return findOne3(compiled, adapter2.getChildren(element), options) !== null;
      });
    }
    const hasOne = (element) => findOne3(compiled, adapter2.getChildren(element), options) !== null;
    return skipCache ? (element) => next2(element) && hasOne(element) : cacheParentResults(next2, options, hasOne);
  }
};

// node_modules/css-select/dist/pseudo-selectors/index.js
function compilePseudoSelector(next2, selector, options, context, compileToken2) {
  const { name, data: data2 } = selector;
  if (Array.isArray(data2)) {
    if (!(name in subselects)) {
      throw new Error(`Unknown pseudo-class :${name}(${data2})`);
    }
    return subselects[name](next2, data2, options, context, compileToken2);
  }
  const userPseudo = options.pseudos?.[name];
  const stringPseudo = typeof userPseudo === "string" ? userPseudo : aliases[name];
  if (typeof stringPseudo === "string") {
    if (data2 != null) {
      throw new Error(`Pseudo ${name} doesn't have any arguments`);
    }
    const alias = parse(stringPseudo);
    return subselects["is"](next2, alias, options, context, compileToken2);
  }
  if (typeof userPseudo === "function") {
    verifyPseudoArguments(userPseudo, name, data2, 1);
    return (element) => userPseudo(element, data2) && next2(element);
  }
  if (name in filters) {
    return filters[name](next2, data2, options, context, compileToken2);
  }
  if (name in pseudos) {
    const pseudo = pseudos[name];
    verifyPseudoArguments(pseudo, name, data2, 2);
    return (element) => pseudo(element, options, data2) && next2(element);
  }
  throw new Error(`Unknown pseudo-class :${name}`);
}

// node_modules/css-select/dist/general.js
function compileGeneralSelector(next2, selector, options, context, compileToken2, hasExpensiveSubselector) {
  const { adapter: adapter2, equals, cacheResults } = options;
  switch (selector.type) {
    case SelectorType.PseudoElement: {
      throw new Error("Pseudo-elements are not supported by css-select");
    }
    case SelectorType.ColumnCombinator: {
      throw new Error("Column combinators are not yet supported by css-select");
    }
    case SelectorType.Attribute: {
      if (selector.namespace != null) {
        throw new Error("Namespaced attributes are not yet supported by css-select");
      }
      if (!options.xmlMode || options.lowerCaseAttributeNames) {
        selector.name = selector.name.toLowerCase();
      }
      return attributeRules[selector.action](next2, selector, options);
    }
    case SelectorType.Pseudo: {
      return compilePseudoSelector(next2, selector, options, context, compileToken2);
    }
    // Tags
    case SelectorType.Tag: {
      if (selector.namespace != null) {
        throw new Error("Namespaced tag names are not yet supported by css-select");
      }
      let { name } = selector;
      if (!options.xmlMode || options.lowerCaseTags) {
        name = name.toLowerCase();
      }
      return function tag(element) {
        return adapter2.getName(element) === name && next2(element);
      };
    }
    // Traversal
    case SelectorType.Descendant: {
      if (!hasExpensiveSubselector || cacheResults === false || typeof WeakMap === "undefined") {
        return function descendant(element) {
          let current = element;
          while (current = getElementParent(current, adapter2)) {
            if (next2(current)) {
              return true;
            }
          }
          return false;
        };
      }
      const resultCache = /* @__PURE__ */ new WeakMap();
      return function cachedDescendant(element) {
        let current = element;
        let result;
        while (current = getElementParent(current, adapter2)) {
          const cached = resultCache.get(current);
          if (cached === void 0) {
            result ??= { matches: false };
            result.matches = next2(current);
            resultCache.set(current, result);
            if (result.matches) {
              return true;
            }
          } else {
            if (result) {
              result.matches = cached.matches;
            }
            return cached.matches;
          }
        }
        return false;
      };
    }
    case "_flexibleDescendant": {
      return function flexibleDescendant(element) {
        let current = element;
        do {
          if (next2(current)) {
            return true;
          }
          current = getElementParent(current, adapter2);
        } while (current);
        return false;
      };
    }
    case SelectorType.Parent: {
      return function parent(element) {
        return adapter2.getChildren(element).some((element2) => adapter2.isTag(element2) && next2(element2));
      };
    }
    case SelectorType.Child: {
      return function child(element) {
        const parent = getElementParent(element, adapter2);
        return parent !== null && next2(parent);
      };
    }
    case SelectorType.Sibling: {
      return function sibling(element) {
        const siblings2 = adapter2.getSiblings(element);
        for (const currentSibling of siblings2) {
          if (equals(element, currentSibling)) {
            break;
          }
          if (adapter2.isTag(currentSibling) && next2(currentSibling)) {
            return true;
          }
        }
        return false;
      };
    }
    case SelectorType.Adjacent: {
      if (adapter2.prevElementSibling) {
        return function adjacent(element) {
          const previous = adapter2.prevElementSibling(element);
          return previous != null && next2(previous);
        };
      }
      return function adjacent(element) {
        const siblings2 = adapter2.getSiblings(element);
        let lastElement;
        for (const currentSibling of siblings2) {
          if (equals(element, currentSibling)) {
            break;
          }
          if (adapter2.isTag(currentSibling)) {
            lastElement = currentSibling;
          }
        }
        return !!lastElement && next2(lastElement);
      };
    }
    case SelectorType.Universal: {
      if (selector.namespace != null && selector.namespace !== "*") {
        throw new Error("Namespaced universal selectors are not yet supported by css-select");
      }
      return next2;
    }
  }
}

// node_modules/css-select/dist/compile.js
var DESCENDANT_TOKEN = { type: SelectorType.Descendant };
var FLEXIBLE_DESCENDANT_TOKEN = {
  type: "_flexibleDescendant"
};
var SCOPE_TOKEN = {
  type: SelectorType.Pseudo,
  name: "scope",
  data: null
};
function absolutize(token, { adapter: adapter2 }, context) {
  const hasContext = !!context?.every((element) => element === PLACEHOLDER_ELEMENT || adapter2.isTag(element) && getElementParent(element, adapter2) !== null);
  for (const t of token) {
    if (t.length > 0 && isTraversal2(t[0]) && t[0].type !== SelectorType.Descendant) {
    } else if (hasContext && !t.some(includesScopePseudo)) {
      t.unshift(DESCENDANT_TOKEN);
    } else {
      continue;
    }
    t.unshift(SCOPE_TOKEN);
  }
}
function compileToken(token, options, compilationContext) {
  for (const rules of token) {
    sortRules(rules);
  }
  const { context = compilationContext, rootFunc: rootFunction = trueFunc } = options;
  const isArrayContext = Array.isArray(context);
  const finalContext = context && (Array.isArray(context) ? context : [context]);
  if (options.relativeSelector !== false) {
    absolutize(token, options, finalContext);
  } else if (token.some((t) => t.length > 0 && isTraversal2(t[0]))) {
    throw new Error("Relative selectors are not allowed when the `relativeSelector` option is disabled");
  }
  let shouldTestNextSiblings = false;
  let query2 = falseFunc;
  combineLoop: for (const rules of token) {
    if (rules.length >= 2) {
      const [first, second] = rules;
      if (first.type !== SelectorType.Pseudo || first.name !== "scope") {
      } else if (isArrayContext && second.type === SelectorType.Descendant) {
        rules[1] = FLEXIBLE_DESCENDANT_TOKEN;
      } else if (second.type === SelectorType.Adjacent || second.type === SelectorType.Sibling) {
        shouldTestNextSiblings = true;
      }
    }
    let next2 = rootFunction;
    let hasExpensiveSubselector = false;
    for (const rule of rules) {
      next2 = compileGeneralSelector(next2, rule, options, finalContext, compileToken, hasExpensiveSubselector);
      const quality = getQuality(rule);
      if (quality === 0) {
        hasExpensiveSubselector = true;
      }
      if (next2 === falseFunc) {
        continue combineLoop;
      }
    }
    if (next2 === rootFunction) {
      return rootFunction;
    }
    query2 = query2 === falseFunc ? next2 : or(query2, next2);
  }
  query2.shouldTestNextSiblings = shouldTestNextSiblings;
  return query2;
}
function or(a, b) {
  return (element) => a(element) || b(element);
}

// node_modules/css-select/dist/index.js
var defaultEquals = (a, b) => a === b;
var defaultOptions = {
  adapter: { ...dist_exports2, isTag: isTag4 },
  equals: defaultEquals
};
function convertOptionFormats(options) {
  const finalOptions = options ?? defaultOptions;
  finalOptions.adapter ??= defaultOptions.adapter;
  finalOptions.equals ??= finalOptions.adapter?.equals ?? defaultEquals;
  return finalOptions;
}
function compile2(selector, options, context) {
  const convertedOptions = convertOptionFormats(options);
  const next2 = _compileUnsafe(selector, convertedOptions, context);
  return next2 === falseFunc ? falseFunc : (element) => convertedOptions.adapter.isTag(element) && next2(element);
}
function _compileUnsafe(selector, options, context) {
  return compileToken(typeof selector === "string" ? parse(selector) : selector, convertOptionFormats(options), context);
}
function getSelectorFunction(searchFunction) {
  return function select(query2, elements2, options) {
    const convertedOptions = convertOptionFormats(options);
    if (typeof query2 !== "function") {
      query2 = _compileUnsafe(query2, convertedOptions, elements2);
    }
    const filteredElements = prepareContext(elements2, convertedOptions.adapter, query2.shouldTestNextSiblings);
    return searchFunction(query2, filteredElements, convertedOptions);
  };
}
function prepareContext(elements2, adapter2, shouldTestNextSiblings = false) {
  if (shouldTestNextSiblings) {
    elements2 = appendNextSiblings(elements2, adapter2);
  }
  return Array.isArray(elements2) ? adapter2.removeSubsets(elements2) : adapter2.getChildren(elements2);
}
function appendNextSiblings(element, adapter2) {
  const elements2 = Array.isArray(element) ? [...element] : [element];
  const elementsLength = elements2.length;
  for (let index = 0; index < elementsLength; index++) {
    const nextSiblings = getNextSiblings(elements2[index], adapter2);
    elements2.push(...nextSiblings);
  }
  return elements2;
}
var selectAll = getSelectorFunction((query2, elements2, options) => query2 === falseFunc || !elements2 || elements2.length === 0 ? [] : findAll3(query2, elements2, options));
var selectOne = getSelectorFunction((query2, elements2, options) => query2 === falseFunc || !elements2 || elements2.length === 0 ? null : findOne3(query2, elements2, options));
function is2(element, query2, options) {
  return (typeof query2 === "function" ? query2 : compile2(query2, options))(element);
}

// node_modules/linkedom/esm/shared/matches.js
var { isArray } = Array;
var isTag5 = ({ nodeType }) => nodeType === ELEMENT_NODE;
var existsOne3 = (test, elements2) => elements2.some(
  (element) => isTag5(element) && (test(element) || existsOne3(test, getChildren3(element)))
);
var getAttributeValue3 = (element, name) => name === "class" ? element.classList.value : element.getAttribute(name);
var getChildren3 = ({ childNodes }) => childNodes;
var getName3 = (element) => {
  const { localName } = element;
  return ignoreCase(element) ? localName.toLowerCase() : localName;
};
var getParent3 = ({ parentNode }) => parentNode;
var getSiblings3 = (element) => {
  const { parentNode } = element;
  return parentNode ? getChildren3(parentNode) : element;
};
var getText3 = (node) => {
  if (isArray(node))
    return node.map(getText3).join("");
  if (isTag5(node))
    return getText3(getChildren3(node));
  if (node.nodeType === TEXT_NODE)
    return node.data;
  return "";
};
var hasAttrib3 = (element, name) => element.hasAttribute(name);
var removeSubsets3 = (nodes) => {
  let { length: length2 } = nodes;
  while (length2--) {
    const node = nodes[length2];
    if (length2 && -1 < nodes.lastIndexOf(node, length2 - 1)) {
      nodes.splice(length2, 1);
      continue;
    }
    for (let { parentNode } = node; parentNode; parentNode = parentNode.parentNode) {
      if (nodes.includes(parentNode)) {
        nodes.splice(length2, 1);
        break;
      }
    }
  }
  return nodes;
};
var findAll4 = (test, nodes) => {
  const matches2 = [];
  for (const node of nodes) {
    if (isTag5(node)) {
      if (test(node))
        matches2.push(node);
      matches2.push(...findAll4(test, getChildren3(node)));
    }
  }
  return matches2;
};
var findOne4 = (test, nodes) => {
  for (let node of nodes)
    if (test(node) || (node = findOne4(test, getChildren3(node))))
      return node;
  return null;
};
var adapter = {
  isTag: isTag5,
  existsOne: existsOne3,
  getAttributeValue: getAttributeValue3,
  getChildren: getChildren3,
  getName: getName3,
  getParent: getParent3,
  getSiblings: getSiblings3,
  getText: getText3,
  hasAttrib: hasAttrib3,
  removeSubsets: removeSubsets3,
  findAll: findAll4,
  findOne: findOne4
};
var prepareMatch = (element, selectors) => compile2(
  selectors,
  {
    context: selectors.includes(":scope") ? element : void 0,
    xmlMode: !ignoreCase(element),
    adapter
  }
);
var matches = (element, selectors) => is2(
  element,
  selectors,
  {
    strict: true,
    context: selectors.includes(":scope") ? element : void 0,
    xmlMode: !ignoreCase(element),
    adapter
  }
);

// node_modules/linkedom/esm/interface/text.js
var Text6 = class _Text extends CharacterData {
  constructor(ownerDocument, data2 = "") {
    super(ownerDocument, "#text", TEXT_NODE, data2);
  }
  get wholeText() {
    const text = [];
    let { previousSibling: previousSibling2, nextSibling: nextSibling2 } = this;
    while (previousSibling2) {
      if (previousSibling2.nodeType === TEXT_NODE)
        text.unshift(previousSibling2[VALUE]);
      else
        break;
      previousSibling2 = previousSibling2.previousSibling;
    }
    text.push(this[VALUE]);
    while (nextSibling2) {
      if (nextSibling2.nodeType === TEXT_NODE)
        text.push(nextSibling2[VALUE]);
      else
        break;
      nextSibling2 = nextSibling2.nextSibling;
    }
    return text.join("");
  }
  cloneNode() {
    const { ownerDocument, [VALUE]: data2 } = this;
    return new _Text(ownerDocument, data2);
  }
  toString() {
    return escape2(this[VALUE]);
  }
};

// node_modules/linkedom/esm/mixin/parent-node.js
var isNode = (node) => node instanceof Node2;
var insert = (parentNode, child, nodes) => {
  const { ownerDocument } = parentNode;
  for (const node of nodes)
    parentNode.insertBefore(
      isNode(node) ? node : new Text6(ownerDocument, node),
      child
    );
};
var ParentNode = class extends Node2 {
  constructor(ownerDocument, localName, nodeType) {
    super(ownerDocument, localName, nodeType);
    this[PRIVATE] = null;
    this[NEXT] = this[END] = {
      [NEXT]: null,
      [PREV]: this,
      [START]: this,
      nodeType: NODE_END,
      ownerDocument: this.ownerDocument,
      parentNode: null
    };
  }
  get childNodes() {
    const childNodes = new NodeList();
    let { firstChild } = this;
    while (firstChild) {
      childNodes.push(firstChild);
      firstChild = nextSibling(firstChild);
    }
    return childNodes;
  }
  get children() {
    const children = new NodeList();
    let { firstElementChild } = this;
    while (firstElementChild) {
      children.push(firstElementChild);
      firstElementChild = nextElementSibling2(firstElementChild);
    }
    return children;
  }
  /**
   * @returns {NodeStruct | null}
   */
  get firstChild() {
    let { [NEXT]: next2, [END]: end } = this;
    while (next2.nodeType === ATTRIBUTE_NODE)
      next2 = next2[NEXT];
    return next2 === end ? null : next2;
  }
  /**
   * @returns {NodeStruct | null}
   */
  get firstElementChild() {
    let { firstChild } = this;
    while (firstChild) {
      if (firstChild.nodeType === ELEMENT_NODE)
        return firstChild;
      firstChild = nextSibling(firstChild);
    }
    return null;
  }
  get lastChild() {
    const prev2 = this[END][PREV];
    switch (prev2.nodeType) {
      case NODE_END:
        return prev2[START];
      case ATTRIBUTE_NODE:
        return null;
    }
    return prev2 === this ? null : prev2;
  }
  get lastElementChild() {
    let { lastChild } = this;
    while (lastChild) {
      if (lastChild.nodeType === ELEMENT_NODE)
        return lastChild;
      lastChild = previousSibling(lastChild);
    }
    return null;
  }
  get childElementCount() {
    return this.children.length;
  }
  prepend(...nodes) {
    insert(this, this.firstChild, nodes);
  }
  append(...nodes) {
    insert(this, this[END], nodes);
  }
  replaceChildren(...nodes) {
    let { [NEXT]: next2, [END]: end } = this;
    while (next2 !== end && next2.nodeType === ATTRIBUTE_NODE)
      next2 = next2[NEXT];
    while (next2 !== end) {
      const after3 = getEnd(next2)[NEXT];
      next2.remove();
      next2 = after3;
    }
    if (nodes.length)
      insert(this, end, nodes);
  }
  getElementsByClassName(className) {
    const elements2 = new NodeList();
    let { [NEXT]: next2, [END]: end } = this;
    while (next2 !== end) {
      if (next2.nodeType === ELEMENT_NODE && next2.hasAttribute("class") && next2.classList.has(className))
        elements2.push(next2);
      next2 = next2[NEXT];
    }
    return elements2;
  }
  getElementsByTagName(tagName19) {
    const elements2 = new NodeList();
    let { [NEXT]: next2, [END]: end } = this;
    while (next2 !== end) {
      if (next2.nodeType === ELEMENT_NODE && (next2.localName === tagName19 || localCase(next2) === tagName19))
        elements2.push(next2);
      next2 = next2[NEXT];
    }
    return elements2;
  }
  querySelector(selectors) {
    const matches2 = prepareMatch(this, selectors);
    let { [NEXT]: next2, [END]: end } = this;
    while (next2 !== end) {
      if (next2.nodeType === ELEMENT_NODE && matches2(next2))
        return next2;
      next2 = next2.nodeType === ELEMENT_NODE && next2.localName === "template" ? next2[END] : next2[NEXT];
    }
    return null;
  }
  querySelectorAll(selectors) {
    const matches2 = prepareMatch(this, selectors);
    const elements2 = new NodeList();
    let { [NEXT]: next2, [END]: end } = this;
    while (next2 !== end) {
      if (next2.nodeType === ELEMENT_NODE && matches2(next2))
        elements2.push(next2);
      next2 = next2.nodeType === ELEMENT_NODE && next2.localName === "template" ? next2[END] : next2[NEXT];
    }
    return elements2;
  }
  appendChild(node) {
    return this.insertBefore(node, this[END]);
  }
  contains(node) {
    let parentNode = node;
    while (parentNode && parentNode !== this)
      parentNode = parentNode.parentNode;
    return parentNode === this;
  }
  insertBefore(node, before3 = null) {
    if (node === before3)
      return node;
    if (node === this)
      throw new Error("unable to append a node to itself");
    const next2 = before3 || this[END];
    switch (node.nodeType) {
      case ELEMENT_NODE:
        node.remove();
        node.parentNode = this;
        knownBoundaries(next2[PREV], node, next2);
        moCallback(node, null);
        connectedCallback(node);
        break;
      case DOCUMENT_FRAGMENT_NODE: {
        let { [PRIVATE]: parentNode, firstChild, lastChild } = node;
        if (firstChild) {
          knownSegment(next2[PREV], firstChild, lastChild, next2);
          knownAdjacent(node, node[END]);
          if (parentNode)
            parentNode.replaceChildren();
          do {
            firstChild.parentNode = this;
            moCallback(firstChild, null);
            if (firstChild.nodeType === ELEMENT_NODE)
              connectedCallback(firstChild);
          } while (firstChild !== lastChild && (firstChild = nextSibling(firstChild)));
        }
        break;
      }
      case TEXT_NODE:
      case COMMENT_NODE:
      case CDATA_SECTION_NODE:
        node.remove();
      /* eslint no-fallthrough:0 */
      // this covers DOCUMENT_TYPE_NODE too
      default:
        node.parentNode = this;
        knownSiblings(next2[PREV], node, next2);
        moCallback(node, null);
        break;
    }
    return node;
  }
  normalize() {
    let { [NEXT]: next2, [END]: end } = this;
    while (next2 !== end) {
      const { [NEXT]: $next, [PREV]: $prev, nodeType } = next2;
      if (nodeType === TEXT_NODE) {
        if (!next2[VALUE])
          next2.remove();
        else if ($prev && $prev.nodeType === TEXT_NODE) {
          $prev.textContent += next2.textContent;
          next2.remove();
        }
      }
      next2 = $next;
    }
  }
  removeChild(node) {
    if (node.parentNode !== this)
      throw new Error("node is not a child");
    node.remove();
    return node;
  }
  replaceChild(node, replaced) {
    const next2 = getEnd(replaced)[NEXT];
    replaced.remove();
    this.insertBefore(node, next2);
    return replaced;
  }
};

// node_modules/linkedom/esm/mixin/non-element-parent-node.js
var NonElementParentNode = class extends ParentNode {
  getElementById(id) {
    let { [NEXT]: next2, [END]: end } = this;
    while (next2 !== end) {
      if (next2.nodeType === ELEMENT_NODE && next2.id === id)
        return next2;
      next2 = next2[NEXT];
    }
    return null;
  }
  cloneNode(deep) {
    const { ownerDocument, constructor } = this;
    const nonEPN = new constructor(ownerDocument);
    if (deep) {
      const { [END]: end } = nonEPN;
      for (const node of this.childNodes)
        nonEPN.insertBefore(node.cloneNode(deep), end);
    }
    return nonEPN;
  }
  toString() {
    const { childNodes, localName } = this;
    return `<${localName}>${childNodes.join("")}</${localName}>`;
  }
  toJSON() {
    const json = [];
    nonElementAsJSON(this, json);
    return json;
  }
};

// node_modules/linkedom/esm/interface/document-fragment.js
var DocumentFragment = class extends NonElementParentNode {
  constructor(ownerDocument) {
    super(ownerDocument, "#document-fragment", DOCUMENT_FRAGMENT_NODE);
  }
};

// node_modules/linkedom/esm/interface/document-type.js
var DocumentType = class _DocumentType extends Node2 {
  constructor(ownerDocument, name, publicId = "", systemId = "") {
    super(ownerDocument, "#document-type", DOCUMENT_TYPE_NODE);
    this.name = name;
    this.publicId = publicId;
    this.systemId = systemId;
  }
  cloneNode() {
    const { ownerDocument, name, publicId, systemId } = this;
    return new _DocumentType(ownerDocument, name, publicId, systemId);
  }
  toString() {
    const { name, publicId, systemId } = this;
    const hasPublic = 0 < publicId.length;
    const str = [name];
    if (hasPublic)
      str.push("PUBLIC", `"${publicId}"`);
    if (systemId.length) {
      if (!hasPublic)
        str.push("SYSTEM");
      str.push(`"${systemId}"`);
    }
    return `<!DOCTYPE ${str.join(" ")}>`;
  }
  toJSON() {
    const json = [];
    documentTypeAsJSON(this, json);
    return json;
  }
};

// node_modules/linkedom/esm/mixin/inner-html.js
var getInnerHtml = (node) => node.childNodes.join("");
var setInnerHtml = (node, html2) => {
  const { ownerDocument } = node;
  const { constructor } = ownerDocument;
  const document2 = new constructor();
  document2[CUSTOM_ELEMENTS] = ownerDocument[CUSTOM_ELEMENTS];
  const { childNodes } = parseFromString(document2, ignoreCase(node), html2);
  node.replaceChildren(...childNodes.map(setOwnerDocument, ownerDocument));
};
function setOwnerDocument(node) {
  node.ownerDocument = this;
  switch (node.nodeType) {
    case ELEMENT_NODE:
    case DOCUMENT_FRAGMENT_NODE:
      node.childNodes.forEach(setOwnerDocument, this);
      break;
  }
  return node;
}

// node_modules/uhyphen/esm/index.js
var esm_default2 = (camel) => camel.replace(/(([A-Z0-9])([A-Z0-9][a-z]))|(([a-z0-9]+)([A-Z]))/g, "$2$5-$3$6").toLowerCase();

// node_modules/linkedom/esm/dom/string-map.js
var refs = /* @__PURE__ */ new WeakMap();
var key = (name) => `data-${esm_default2(name)}`;
var prop = (name) => name.slice(5).replace(/-([a-z])/g, (_, $1) => $1.toUpperCase());
var handler = {
  get(dataset, name) {
    if (name in dataset)
      return refs.get(dataset).getAttribute(key(name));
  },
  set(dataset, name, value) {
    dataset[name] = value;
    refs.get(dataset).setAttribute(key(name), value);
    return true;
  },
  deleteProperty(dataset, name) {
    if (name in dataset)
      refs.get(dataset).removeAttribute(key(name));
    return delete dataset[name];
  }
};
var DOMStringMap = class {
  /**
   * @param {Element} ref
   */
  constructor(ref) {
    for (const { name, value } of ref.attributes) {
      if (/^data-/.test(name))
        this[prop(name)] = value;
    }
    refs.set(this, ref);
    return new Proxy(this, handler);
  }
};
setPrototypeOf(DOMStringMap.prototype, null);

// node_modules/linkedom/esm/dom/token-list.js
var { add } = Set.prototype;
var addTokens = (self2, tokens) => {
  for (const token of tokens) {
    if (token)
      add.call(self2, token);
  }
};
var update = ({ [OWNER_ELEMENT]: ownerElement, value }) => {
  const attribute2 = ownerElement.getAttributeNode("class");
  if (attribute2)
    attribute2.value = value;
  else
    setAttribute(
      ownerElement,
      new Attr(ownerElement.ownerDocument, "class", value)
    );
};
var DOMTokenList = class extends Set {
  constructor(ownerElement) {
    super();
    this[OWNER_ELEMENT] = ownerElement;
    const attribute2 = ownerElement.getAttributeNode("class");
    if (attribute2)
      addTokens(this, attribute2.value.split(/\s+/));
  }
  get length() {
    return this.size;
  }
  get value() {
    return [...this].join(" ");
  }
  /**
   * @param  {...string} tokens
   */
  add(...tokens) {
    addTokens(this, tokens);
    update(this);
  }
  /**
   * @param {string} token
   */
  contains(token) {
    return this.has(token);
  }
  /**
   * @param  {...string} tokens
   */
  remove(...tokens) {
    for (const token of tokens)
      this.delete(token);
    update(this);
  }
  /**
   * @param {string} token
   * @param {boolean?} force
   */
  toggle(token, force) {
    if (this.has(token)) {
      if (force)
        return true;
      this.delete(token);
      update(this);
    } else if (force || arguments.length === 1) {
      super.add(token);
      update(this);
      return true;
    }
    return false;
  }
  /**
   * @param {string} token
   * @param {string} newToken
   */
  replace(token, newToken) {
    if (this.has(token)) {
      this.delete(token);
      super.add(newToken);
      update(this);
      return true;
    }
    return false;
  }
  /**
   * @param {string} token
   */
  supports() {
    return true;
  }
};

// node_modules/linkedom/esm/interface/css-style-declaration.js
var refs2 = /* @__PURE__ */ new WeakMap();
var getKeys = (style) => [...style.keys()].filter((key2) => key2 !== PRIVATE);
var updateKeys = (style) => {
  const attr2 = refs2.get(style).getAttributeNode("style");
  if (!attr2 || attr2[CHANGED] || style.get(PRIVATE) !== attr2) {
    style.clear();
    if (attr2) {
      style.set(PRIVATE, attr2);
      for (const rule of attr2[VALUE].split(/\s*;\s*/)) {
        let [key2, ...rest] = rule.split(":");
        if (rest.length > 0) {
          key2 = key2.trim();
          const value = rest.join(":").trim();
          if (key2 && value)
            style.set(key2, value);
        }
      }
    }
  }
  return attr2;
};
var handler2 = {
  get(style, name) {
    if (name in prototype)
      return style[name];
    updateKeys(style);
    if (name === "length")
      return getKeys(style).length;
    if (/^\d+$/.test(name))
      return getKeys(style)[name];
    return style.get(esm_default2(name)) ?? "";
  },
  set(style, name, value) {
    if (name === "cssText")
      style[name] = value;
    else {
      let attr2 = updateKeys(style);
      if (value == null)
        style.delete(esm_default2(name));
      else
        style.set(esm_default2(name), value);
      if (!attr2) {
        const element = refs2.get(style);
        attr2 = element.ownerDocument.createAttribute("style");
        element.setAttributeNode(attr2);
        style.set(PRIVATE, attr2);
      }
      attr2[CHANGED] = false;
      attr2[VALUE] = style.toString();
    }
    return true;
  }
};
var CSSStyleDeclaration = class extends Map {
  constructor(element) {
    super();
    refs2.set(this, element);
    return new Proxy(this, handler2);
  }
  get cssText() {
    return this.toString();
  }
  set cssText(value) {
    refs2.get(this).setAttribute("style", value);
  }
  getPropertyValue(name) {
    const self2 = this[PRIVATE];
    return handler2.get(self2, name);
  }
  setProperty(name, value) {
    const self2 = this[PRIVATE];
    handler2.set(self2, name, value);
  }
  removeProperty(name) {
    const self2 = this[PRIVATE];
    handler2.set(self2, name, null);
  }
  [Symbol.iterator]() {
    const self2 = this[PRIVATE];
    updateKeys(self2);
    const keys2 = getKeys(self2);
    const { length: length2 } = keys2;
    let i = 0;
    return {
      next() {
        const done = i === length2;
        return { done, value: done ? null : keys2[i++] };
      }
    };
  }
  get [PRIVATE]() {
    return this;
  }
  toString() {
    const self2 = this[PRIVATE];
    updateKeys(self2);
    const cssText = [];
    self2.forEach(push, cssText);
    return cssText.join(";");
  }
};
var { prototype } = CSSStyleDeclaration;
function push(value, key2) {
  if (key2 !== PRIVATE)
    this.push(`${key2}:${value}`);
}

// node_modules/linkedom/esm/interface/event.js
var BUBBLING_PHASE = 3;
var AT_TARGET = 2;
var CAPTURING_PHASE = 1;
var NONE = 0;
function getCurrentTarget(ev) {
  return ev.currentTarget;
}
var GlobalEvent = class {
  static get BUBBLING_PHASE() {
    return BUBBLING_PHASE;
  }
  static get AT_TARGET() {
    return AT_TARGET;
  }
  static get CAPTURING_PHASE() {
    return CAPTURING_PHASE;
  }
  static get NONE() {
    return NONE;
  }
  constructor(type, eventInitDict = {}) {
    this.type = type;
    this.bubbles = !!eventInitDict.bubbles;
    this.cancelBubble = false;
    this._stopImmediatePropagationFlag = false;
    this.cancelable = !!eventInitDict.cancelable;
    this.eventPhase = this.NONE;
    this.timeStamp = Date.now();
    this.defaultPrevented = false;
    this.originalTarget = null;
    this.returnValue = null;
    this.srcElement = null;
    this.target = null;
    this._path = [];
  }
  get BUBBLING_PHASE() {
    return BUBBLING_PHASE;
  }
  get AT_TARGET() {
    return AT_TARGET;
  }
  get CAPTURING_PHASE() {
    return CAPTURING_PHASE;
  }
  get NONE() {
    return NONE;
  }
  preventDefault() {
    this.defaultPrevented = true;
  }
  // simplified implementation, should be https://dom.spec.whatwg.org/#dom-event-composedpath
  composedPath() {
    return this._path.map(getCurrentTarget);
  }
  stopPropagation() {
    this.cancelBubble = true;
  }
  stopImmediatePropagation() {
    this.stopPropagation();
    this._stopImmediatePropagationFlag = true;
  }
};

// node_modules/linkedom/esm/interface/named-node-map.js
var NamedNodeMap = class extends Array {
  constructor(ownerElement) {
    super();
    this.ownerElement = ownerElement;
  }
  getNamedItem(name) {
    return this.ownerElement.getAttributeNode(name);
  }
  setNamedItem(attr2) {
    this.ownerElement.setAttributeNode(attr2);
    this.unshift(attr2);
  }
  removeNamedItem(name) {
    const item = this.getNamedItem(name);
    this.ownerElement.removeAttribute(name);
    this.splice(this.indexOf(item), 1);
  }
  item(index) {
    return index < this.length ? this[index] : null;
  }
  /* c8 ignore start */
  getNamedItemNS(_, name) {
    return this.getNamedItem(name);
  }
  setNamedItemNS(_, attr2) {
    return this.setNamedItem(attr2);
  }
  removeNamedItemNS(_, name) {
    return this.removeNamedItem(name);
  }
  /* c8 ignore stop */
};

// node_modules/linkedom/esm/interface/shadow-root.js
var ShadowRoot = class extends NonElementParentNode {
  constructor(host) {
    super(host.ownerDocument, "#shadow-root", DOCUMENT_FRAGMENT_NODE);
    this.host = host;
  }
  get innerHTML() {
    return getInnerHtml(this);
  }
  set innerHTML(html2) {
    setInnerHtml(this, html2);
  }
};

// node_modules/linkedom/esm/interface/element.js
var attributesHandler = {
  get(target, key2) {
    return key2 in target ? target[key2] : target.find(({ name }) => name === key2);
  }
};
var create2 = (ownerDocument, element, localName) => {
  if ("ownerSVGElement" in element) {
    const svg2 = ownerDocument.createElementNS(SVG_NAMESPACE, localName);
    svg2.ownerSVGElement = element.ownerSVGElement;
    return svg2;
  }
  return ownerDocument.createElement(localName);
};
var isVoid = ({ localName, ownerDocument }) => {
  return ownerDocument[MIME].voidElements.test(localName);
};
var Element2 = class extends ParentNode {
  constructor(ownerDocument, localName) {
    super(ownerDocument, localName, ELEMENT_NODE);
    this[CLASS_LIST] = null;
    this[DATASET] = null;
    this[STYLE] = null;
  }
  // <Mixins>
  get isConnected() {
    return isConnected(this);
  }
  get parentElement() {
    return parentElement(this);
  }
  get previousSibling() {
    return previousSibling(this);
  }
  get nextSibling() {
    return nextSibling(this);
  }
  get namespaceURI() {
    return "http://www.w3.org/1999/xhtml";
  }
  get previousElementSibling() {
    return previousElementSibling(this);
  }
  get nextElementSibling() {
    return nextElementSibling2(this);
  }
  before(...nodes) {
    before(this, nodes);
  }
  after(...nodes) {
    after(this, nodes);
  }
  replaceWith(...nodes) {
    replaceWith(this, nodes);
  }
  remove() {
    remove(this[PREV], this, this[END][NEXT]);
  }
  // </Mixins>
  // <specialGetters>
  get id() {
    return stringAttribute.get(this, "id");
  }
  set id(value) {
    stringAttribute.set(this, "id", value);
  }
  get className() {
    return this.classList.value;
  }
  set className(value) {
    const { classList } = this;
    classList.clear();
    classList.add(...$String(value).split(/\s+/));
  }
  get nodeName() {
    return localCase(this);
  }
  get tagName() {
    return localCase(this);
  }
  get classList() {
    return this[CLASS_LIST] || (this[CLASS_LIST] = new DOMTokenList(this));
  }
  get dataset() {
    return this[DATASET] || (this[DATASET] = new DOMStringMap(this));
  }
  getBoundingClientRect() {
    return {
      x: 0,
      y: 0,
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0
    };
  }
  get nonce() {
    return stringAttribute.get(this, "nonce");
  }
  set nonce(value) {
    stringAttribute.set(this, "nonce", value);
  }
  get style() {
    return this[STYLE] || (this[STYLE] = new CSSStyleDeclaration(this));
  }
  get tabIndex() {
    return numericAttribute.get(this, "tabindex") || -1;
  }
  set tabIndex(value) {
    numericAttribute.set(this, "tabindex", value);
  }
  get slot() {
    return stringAttribute.get(this, "slot");
  }
  set slot(value) {
    stringAttribute.set(this, "slot", value);
  }
  // </specialGetters>
  // <contentRelated>
  get innerText() {
    const text = [];
    let { [NEXT]: next2, [END]: end } = this;
    while (next2 !== end) {
      if (next2.nodeType === TEXT_NODE) {
        text.push(next2.textContent.replace(/\s+/g, " "));
      } else if (text.length && next2[NEXT] != end && BLOCK_ELEMENTS.has(next2.tagName)) {
        text.push("\n");
      }
      next2 = next2[NEXT];
    }
    return text.join("");
  }
  /**
   * @returns {String}
   */
  get textContent() {
    const text = [];
    let { [NEXT]: next2, [END]: end } = this;
    while (next2 !== end) {
      const nodeType = next2.nodeType;
      if (nodeType === TEXT_NODE || nodeType === CDATA_SECTION_NODE)
        text.push(next2.textContent);
      next2 = next2[NEXT];
    }
    return text.join("");
  }
  set textContent(text) {
    this.replaceChildren();
    if (text != null && text !== "")
      this.appendChild(new Text6(this.ownerDocument, text));
  }
  get innerHTML() {
    return getInnerHtml(this);
  }
  set innerHTML(html2) {
    setInnerHtml(this, html2);
  }
  get outerHTML() {
    return this.toString();
  }
  set outerHTML(html2) {
    const template = this.ownerDocument.createElement("");
    template.innerHTML = html2;
    this.replaceWith(...template.childNodes);
  }
  // </contentRelated>
  // <attributes>
  get attributes() {
    const attributes = new NamedNodeMap(this);
    let next2 = this[NEXT];
    while (next2.nodeType === ATTRIBUTE_NODE) {
      attributes.push(next2);
      next2 = next2[NEXT];
    }
    return new Proxy(attributes, attributesHandler);
  }
  focus() {
    this.dispatchEvent(new GlobalEvent("focus"));
  }
  getAttribute(name) {
    if (name === "class")
      return this.className;
    const attribute2 = this.getAttributeNode(name);
    return attribute2 && (ignoreCase(this) ? attribute2.value : escape2(attribute2.value));
  }
  getAttributeNode(name) {
    let next2 = this[NEXT];
    while (next2.nodeType === ATTRIBUTE_NODE) {
      if (next2.name === name)
        return next2;
      next2 = next2[NEXT];
    }
    return null;
  }
  getAttributeNames() {
    const attributes = new NodeList();
    let next2 = this[NEXT];
    while (next2.nodeType === ATTRIBUTE_NODE) {
      attributes.push(next2.name);
      next2 = next2[NEXT];
    }
    return attributes;
  }
  hasAttribute(name) {
    return !!this.getAttributeNode(name);
  }
  hasAttributes() {
    return this[NEXT].nodeType === ATTRIBUTE_NODE;
  }
  removeAttribute(name) {
    if (name === "class" && this[CLASS_LIST])
      this[CLASS_LIST].clear();
    let next2 = this[NEXT];
    while (next2.nodeType === ATTRIBUTE_NODE) {
      if (next2.name === name) {
        removeAttribute(this, next2);
        return;
      }
      next2 = next2[NEXT];
    }
  }
  removeAttributeNode(attribute2) {
    let next2 = this[NEXT];
    while (next2.nodeType === ATTRIBUTE_NODE) {
      if (next2 === attribute2) {
        removeAttribute(this, next2);
        return;
      }
      next2 = next2[NEXT];
    }
  }
  setAttribute(name, value) {
    if (name === "class")
      this.className = value;
    else {
      const attribute2 = this.getAttributeNode(name);
      if (attribute2)
        attribute2.value = value;
      else
        setAttribute(this, new Attr(this.ownerDocument, name, value));
    }
  }
  setAttributeNode(attribute2) {
    const { name } = attribute2;
    const previously = this.getAttributeNode(name);
    if (previously !== attribute2) {
      if (previously)
        this.removeAttributeNode(previously);
      const { ownerElement } = attribute2;
      if (ownerElement)
        ownerElement.removeAttributeNode(attribute2);
      setAttribute(this, attribute2);
    }
    return previously;
  }
  toggleAttribute(name, force) {
    if (this.hasAttribute(name)) {
      if (!force) {
        this.removeAttribute(name);
        return false;
      }
      return true;
    } else if (force || arguments.length === 1) {
      this.setAttribute(name, "");
      return true;
    }
    return false;
  }
  // </attributes>
  // <ShadowDOM>
  get shadowRoot() {
    if (shadowRoots.has(this)) {
      const { mode, shadowRoot } = shadowRoots.get(this);
      if (mode === "open")
        return shadowRoot;
    }
    return null;
  }
  attachShadow(init) {
    if (shadowRoots.has(this))
      throw new Error("operation not supported");
    const shadowRoot = new ShadowRoot(this);
    shadowRoots.set(this, {
      mode: init.mode,
      shadowRoot
    });
    return shadowRoot;
  }
  // </ShadowDOM>
  // <selectors>
  matches(selectors) {
    return matches(this, selectors);
  }
  closest(selectors) {
    let parentElement2 = this;
    const matches2 = prepareMatch(parentElement2, selectors);
    while (parentElement2 && !matches2(parentElement2))
      parentElement2 = parentElement2.parentElement;
    return parentElement2;
  }
  // </selectors>
  // <insertAdjacent>
  insertAdjacentElement(position2, element) {
    const { parentElement: parentElement2 } = this;
    switch (position2) {
      case "beforebegin":
        if (parentElement2) {
          parentElement2.insertBefore(element, this);
          break;
        }
        return null;
      case "afterbegin":
        this.insertBefore(element, this.firstChild);
        break;
      case "beforeend":
        this.insertBefore(element, null);
        break;
      case "afterend":
        if (parentElement2) {
          parentElement2.insertBefore(element, this.nextSibling);
          break;
        }
        return null;
    }
    return element;
  }
  insertAdjacentHTML(position2, html2) {
    this.insertAdjacentElement(position2, htmlToFragment(this.ownerDocument, html2));
  }
  insertAdjacentText(position2, text) {
    const node = this.ownerDocument.createTextNode(text);
    this.insertAdjacentElement(position2, node);
  }
  // </insertAdjacent>
  cloneNode(deep = false) {
    const { ownerDocument, localName } = this;
    const addNext = (next3) => {
      next3.parentNode = parentNode;
      knownAdjacent($next, next3);
      $next = next3;
    };
    const clone = create2(ownerDocument, this, localName);
    let parentNode = clone, $next = clone;
    let { [NEXT]: next2, [END]: prev2 } = this;
    while (next2 !== prev2 && (deep || next2.nodeType === ATTRIBUTE_NODE)) {
      switch (next2.nodeType) {
        case NODE_END:
          knownAdjacent($next, parentNode[END]);
          $next = parentNode[END];
          parentNode = parentNode.parentNode;
          break;
        case ELEMENT_NODE: {
          const node = create2(ownerDocument, next2, next2.localName);
          addNext(node);
          parentNode = node;
          break;
        }
        case ATTRIBUTE_NODE: {
          const attr2 = next2.cloneNode(deep);
          attr2.ownerElement = parentNode;
          addNext(attr2);
          break;
        }
        case TEXT_NODE:
        case COMMENT_NODE:
        case CDATA_SECTION_NODE:
          addNext(next2.cloneNode(deep));
          break;
      }
      next2 = next2[NEXT];
    }
    knownAdjacent($next, clone[END]);
    return clone;
  }
  // <custom>
  toString() {
    const out = [];
    const { [END]: end } = this;
    let next2 = { [NEXT]: this };
    let isOpened = false;
    do {
      next2 = next2[NEXT];
      switch (next2.nodeType) {
        case ATTRIBUTE_NODE: {
          const attr2 = " " + next2;
          switch (attr2) {
            case " id":
            case " class":
            case " style":
              break;
            default:
              out.push(attr2);
          }
          break;
        }
        case NODE_END: {
          const start = next2[START];
          if (isOpened) {
            if ("ownerSVGElement" in start)
              out.push(" />");
            else if (isVoid(start))
              out.push(ignoreCase(start) ? ">" : " />");
            else
              out.push(`></${start.localName}>`);
            isOpened = false;
          } else
            out.push(`</${start.localName}>`);
          break;
        }
        case ELEMENT_NODE:
          if (isOpened)
            out.push(">");
          if (next2.toString !== this.toString) {
            out.push(next2.toString());
            next2 = next2[END];
            isOpened = false;
          } else {
            out.push(`<${next2.localName}`);
            isOpened = true;
          }
          break;
        case TEXT_NODE:
        case COMMENT_NODE:
        case CDATA_SECTION_NODE:
          out.push((isOpened ? ">" : "") + next2);
          isOpened = false;
          break;
      }
    } while (next2 !== end);
    return out.join("");
  }
  toJSON() {
    const json = [];
    elementAsJSON(this, json);
    return json;
  }
  // </custom>
  /* c8 ignore start */
  getAttributeNS(_, name) {
    return this.getAttribute(name);
  }
  getElementsByTagNameNS(_, name) {
    return this.getElementsByTagName(name);
  }
  hasAttributeNS(_, name) {
    return this.hasAttribute(name);
  }
  removeAttributeNS(_, name) {
    this.removeAttribute(name);
  }
  setAttributeNS(_, name, value) {
    this.setAttribute(name, value);
  }
  setAttributeNodeNS(attr2) {
    return this.setAttributeNode(attr2);
  }
  /* c8 ignore stop */
};

// node_modules/linkedom/esm/svg/element.js
var classNames = /* @__PURE__ */ new WeakMap();
var handler3 = {
  get(target, name) {
    return target[name];
  },
  set(target, name, value) {
    target[name] = value;
    return true;
  }
};
var SVGElement = class extends Element2 {
  constructor(ownerDocument, localName, ownerSVGElement = null) {
    super(ownerDocument, localName);
    this.ownerSVGElement = ownerSVGElement;
  }
  get className() {
    if (!classNames.has(this))
      classNames.set(this, new Proxy({ baseVal: "", animVal: "" }, handler3));
    return classNames.get(this);
  }
  /* c8 ignore start */
  set className(value) {
    const { classList } = this;
    classList.clear();
    classList.add(...$String(value).split(/\s+/));
  }
  /* c8 ignore stop */
  get namespaceURI() {
    return "http://www.w3.org/2000/svg";
  }
  getAttribute(name) {
    return name === "class" ? [...this.classList].join(" ") : super.getAttribute(name);
  }
  setAttribute(name, value) {
    if (name === "class")
      this.className = value;
    else if (name === "style") {
      const { className } = this;
      className.baseVal = className.animVal = value;
    }
    super.setAttribute(name, value);
  }
};

// node_modules/linkedom/esm/shared/facades.js
var illegalConstructor = () => {
  throw new TypeError("Illegal constructor");
};
function Attr2() {
  illegalConstructor();
}
setPrototypeOf(Attr2, Attr);
Attr2.prototype = Attr.prototype;
function CDATASection2() {
  illegalConstructor();
}
setPrototypeOf(CDATASection2, CDATASection);
CDATASection2.prototype = CDATASection.prototype;
function CharacterData2() {
  illegalConstructor();
}
setPrototypeOf(CharacterData2, CharacterData);
CharacterData2.prototype = CharacterData.prototype;
function Comment7() {
  illegalConstructor();
}
setPrototypeOf(Comment7, Comment3);
Comment7.prototype = Comment3.prototype;
function DocumentFragment2() {
  illegalConstructor();
}
setPrototypeOf(DocumentFragment2, DocumentFragment);
DocumentFragment2.prototype = DocumentFragment.prototype;
function DocumentType2() {
  illegalConstructor();
}
setPrototypeOf(DocumentType2, DocumentType);
DocumentType2.prototype = DocumentType.prototype;
function Element3() {
  illegalConstructor();
}
setPrototypeOf(Element3, Element2);
Element3.prototype = Element2.prototype;
function Node3() {
  illegalConstructor();
}
setPrototypeOf(Node3, Node2);
Node3.prototype = Node2.prototype;
function ShadowRoot2() {
  illegalConstructor();
}
setPrototypeOf(ShadowRoot2, ShadowRoot);
ShadowRoot2.prototype = ShadowRoot.prototype;
function Text7() {
  illegalConstructor();
}
setPrototypeOf(Text7, Text6);
Text7.prototype = Text6.prototype;
function SVGElement2() {
  illegalConstructor();
}
setPrototypeOf(SVGElement2, SVGElement);
SVGElement2.prototype = SVGElement.prototype;
var Facades = {
  Attr: Attr2,
  CDATASection: CDATASection2,
  CharacterData: CharacterData2,
  Comment: Comment7,
  DocumentFragment: DocumentFragment2,
  DocumentType: DocumentType2,
  Element: Element3,
  Node: Node3,
  ShadowRoot: ShadowRoot2,
  Text: Text7,
  SVGElement: SVGElement2
};

// node_modules/linkedom/esm/html/element.js
var Level0 = /* @__PURE__ */ new WeakMap();
var level0 = {
  get(element, name) {
    return Level0.has(element) && Level0.get(element)[name] || null;
  },
  set(element, name, value) {
    if (!Level0.has(element))
      Level0.set(element, {});
    const handlers = Level0.get(element);
    const type = name.slice(2);
    if (handlers[name])
      element.removeEventListener(type, handlers[name], false);
    if (handlers[name] = value)
      element.addEventListener(type, value, false);
  }
};
var HTMLElement = class extends Element2 {
  static get observedAttributes() {
    return [];
  }
  constructor(ownerDocument = null, localName = "") {
    super(ownerDocument, localName);
    const ownerLess = !ownerDocument;
    let options;
    if (ownerLess) {
      const { constructor: Class } = this;
      if (!Classes.has(Class))
        throw new Error("unable to initialize this Custom Element");
      ({ ownerDocument, localName, options } = Classes.get(Class));
    }
    if (ownerDocument[UPGRADE]) {
      const { element, values } = ownerDocument[UPGRADE];
      ownerDocument[UPGRADE] = null;
      for (const [key2, value] of values)
        element[key2] = value;
      return element;
    }
    if (ownerLess) {
      this.ownerDocument = this[END].ownerDocument = ownerDocument;
      this.localName = localName;
      customElements.set(this, { connected: false });
      if (options.is)
        this.setAttribute("is", options.is);
    }
  }
  /* c8 ignore start */
  /* TODO: what about these?
  offsetHeight
  offsetLeft
  offsetParent
  offsetTop
  offsetWidth
  */
  blur() {
    this.dispatchEvent(new GlobalEvent("blur"));
  }
  click() {
    const clickEvent = new GlobalEvent("click", { bubbles: true, cancelable: true });
    clickEvent.button = 0;
    this.dispatchEvent(clickEvent);
  }
  // Boolean getters
  get accessKeyLabel() {
    const { accessKey } = this;
    return accessKey && `Alt+Shift+${accessKey}`;
  }
  get isContentEditable() {
    return this.hasAttribute("contenteditable");
  }
  // Boolean Accessors
  get contentEditable() {
    return booleanAttribute.get(this, "contenteditable");
  }
  set contentEditable(value) {
    booleanAttribute.set(this, "contenteditable", value);
  }
  get draggable() {
    return booleanAttribute.get(this, "draggable");
  }
  set draggable(value) {
    booleanAttribute.set(this, "draggable", value);
  }
  get hidden() {
    return booleanAttribute.get(this, "hidden");
  }
  set hidden(value) {
    booleanAttribute.set(this, "hidden", value);
  }
  get spellcheck() {
    return booleanAttribute.get(this, "spellcheck");
  }
  set spellcheck(value) {
    booleanAttribute.set(this, "spellcheck", value);
  }
  // String Accessors
  get accessKey() {
    return stringAttribute.get(this, "accesskey");
  }
  set accessKey(value) {
    stringAttribute.set(this, "accesskey", value);
  }
  get dir() {
    return stringAttribute.get(this, "dir");
  }
  set dir(value) {
    stringAttribute.set(this, "dir", value);
  }
  get lang() {
    return stringAttribute.get(this, "lang");
  }
  set lang(value) {
    stringAttribute.set(this, "lang", value);
  }
  get title() {
    return stringAttribute.get(this, "title");
  }
  set title(value) {
    stringAttribute.set(this, "title", value);
  }
  // DOM Level 0
  get onabort() {
    return level0.get(this, "onabort");
  }
  set onabort(value) {
    level0.set(this, "onabort", value);
  }
  get onblur() {
    return level0.get(this, "onblur");
  }
  set onblur(value) {
    level0.set(this, "onblur", value);
  }
  get oncancel() {
    return level0.get(this, "oncancel");
  }
  set oncancel(value) {
    level0.set(this, "oncancel", value);
  }
  get oncanplay() {
    return level0.get(this, "oncanplay");
  }
  set oncanplay(value) {
    level0.set(this, "oncanplay", value);
  }
  get oncanplaythrough() {
    return level0.get(this, "oncanplaythrough");
  }
  set oncanplaythrough(value) {
    level0.set(this, "oncanplaythrough", value);
  }
  get onchange() {
    return level0.get(this, "onchange");
  }
  set onchange(value) {
    level0.set(this, "onchange", value);
  }
  get onclick() {
    return level0.get(this, "onclick");
  }
  set onclick(value) {
    level0.set(this, "onclick", value);
  }
  get onclose() {
    return level0.get(this, "onclose");
  }
  set onclose(value) {
    level0.set(this, "onclose", value);
  }
  get oncontextmenu() {
    return level0.get(this, "oncontextmenu");
  }
  set oncontextmenu(value) {
    level0.set(this, "oncontextmenu", value);
  }
  get oncuechange() {
    return level0.get(this, "oncuechange");
  }
  set oncuechange(value) {
    level0.set(this, "oncuechange", value);
  }
  get ondblclick() {
    return level0.get(this, "ondblclick");
  }
  set ondblclick(value) {
    level0.set(this, "ondblclick", value);
  }
  get ondrag() {
    return level0.get(this, "ondrag");
  }
  set ondrag(value) {
    level0.set(this, "ondrag", value);
  }
  get ondragend() {
    return level0.get(this, "ondragend");
  }
  set ondragend(value) {
    level0.set(this, "ondragend", value);
  }
  get ondragenter() {
    return level0.get(this, "ondragenter");
  }
  set ondragenter(value) {
    level0.set(this, "ondragenter", value);
  }
  get ondragleave() {
    return level0.get(this, "ondragleave");
  }
  set ondragleave(value) {
    level0.set(this, "ondragleave", value);
  }
  get ondragover() {
    return level0.get(this, "ondragover");
  }
  set ondragover(value) {
    level0.set(this, "ondragover", value);
  }
  get ondragstart() {
    return level0.get(this, "ondragstart");
  }
  set ondragstart(value) {
    level0.set(this, "ondragstart", value);
  }
  get ondrop() {
    return level0.get(this, "ondrop");
  }
  set ondrop(value) {
    level0.set(this, "ondrop", value);
  }
  get ondurationchange() {
    return level0.get(this, "ondurationchange");
  }
  set ondurationchange(value) {
    level0.set(this, "ondurationchange", value);
  }
  get onemptied() {
    return level0.get(this, "onemptied");
  }
  set onemptied(value) {
    level0.set(this, "onemptied", value);
  }
  get onended() {
    return level0.get(this, "onended");
  }
  set onended(value) {
    level0.set(this, "onended", value);
  }
  get onerror() {
    return level0.get(this, "onerror");
  }
  set onerror(value) {
    level0.set(this, "onerror", value);
  }
  get onfocus() {
    return level0.get(this, "onfocus");
  }
  set onfocus(value) {
    level0.set(this, "onfocus", value);
  }
  get oninput() {
    return level0.get(this, "oninput");
  }
  set oninput(value) {
    level0.set(this, "oninput", value);
  }
  get oninvalid() {
    return level0.get(this, "oninvalid");
  }
  set oninvalid(value) {
    level0.set(this, "oninvalid", value);
  }
  get onkeydown() {
    return level0.get(this, "onkeydown");
  }
  set onkeydown(value) {
    level0.set(this, "onkeydown", value);
  }
  get onkeypress() {
    return level0.get(this, "onkeypress");
  }
  set onkeypress(value) {
    level0.set(this, "onkeypress", value);
  }
  get onkeyup() {
    return level0.get(this, "onkeyup");
  }
  set onkeyup(value) {
    level0.set(this, "onkeyup", value);
  }
  get onload() {
    return level0.get(this, "onload");
  }
  set onload(value) {
    level0.set(this, "onload", value);
  }
  get onloadeddata() {
    return level0.get(this, "onloadeddata");
  }
  set onloadeddata(value) {
    level0.set(this, "onloadeddata", value);
  }
  get onloadedmetadata() {
    return level0.get(this, "onloadedmetadata");
  }
  set onloadedmetadata(value) {
    level0.set(this, "onloadedmetadata", value);
  }
  get onloadstart() {
    return level0.get(this, "onloadstart");
  }
  set onloadstart(value) {
    level0.set(this, "onloadstart", value);
  }
  get onmousedown() {
    return level0.get(this, "onmousedown");
  }
  set onmousedown(value) {
    level0.set(this, "onmousedown", value);
  }
  get onmouseenter() {
    return level0.get(this, "onmouseenter");
  }
  set onmouseenter(value) {
    level0.set(this, "onmouseenter", value);
  }
  get onmouseleave() {
    return level0.get(this, "onmouseleave");
  }
  set onmouseleave(value) {
    level0.set(this, "onmouseleave", value);
  }
  get onmousemove() {
    return level0.get(this, "onmousemove");
  }
  set onmousemove(value) {
    level0.set(this, "onmousemove", value);
  }
  get onmouseout() {
    return level0.get(this, "onmouseout");
  }
  set onmouseout(value) {
    level0.set(this, "onmouseout", value);
  }
  get onmouseover() {
    return level0.get(this, "onmouseover");
  }
  set onmouseover(value) {
    level0.set(this, "onmouseover", value);
  }
  get onmouseup() {
    return level0.get(this, "onmouseup");
  }
  set onmouseup(value) {
    level0.set(this, "onmouseup", value);
  }
  get onmousewheel() {
    return level0.get(this, "onmousewheel");
  }
  set onmousewheel(value) {
    level0.set(this, "onmousewheel", value);
  }
  get onpause() {
    return level0.get(this, "onpause");
  }
  set onpause(value) {
    level0.set(this, "onpause", value);
  }
  get onplay() {
    return level0.get(this, "onplay");
  }
  set onplay(value) {
    level0.set(this, "onplay", value);
  }
  get onplaying() {
    return level0.get(this, "onplaying");
  }
  set onplaying(value) {
    level0.set(this, "onplaying", value);
  }
  get onprogress() {
    return level0.get(this, "onprogress");
  }
  set onprogress(value) {
    level0.set(this, "onprogress", value);
  }
  get onratechange() {
    return level0.get(this, "onratechange");
  }
  set onratechange(value) {
    level0.set(this, "onratechange", value);
  }
  get onreset() {
    return level0.get(this, "onreset");
  }
  set onreset(value) {
    level0.set(this, "onreset", value);
  }
  get onresize() {
    return level0.get(this, "onresize");
  }
  set onresize(value) {
    level0.set(this, "onresize", value);
  }
  get onscroll() {
    return level0.get(this, "onscroll");
  }
  set onscroll(value) {
    level0.set(this, "onscroll", value);
  }
  get onseeked() {
    return level0.get(this, "onseeked");
  }
  set onseeked(value) {
    level0.set(this, "onseeked", value);
  }
  get onseeking() {
    return level0.get(this, "onseeking");
  }
  set onseeking(value) {
    level0.set(this, "onseeking", value);
  }
  get onselect() {
    return level0.get(this, "onselect");
  }
  set onselect(value) {
    level0.set(this, "onselect", value);
  }
  get onshow() {
    return level0.get(this, "onshow");
  }
  set onshow(value) {
    level0.set(this, "onshow", value);
  }
  get onstalled() {
    return level0.get(this, "onstalled");
  }
  set onstalled(value) {
    level0.set(this, "onstalled", value);
  }
  get onsubmit() {
    return level0.get(this, "onsubmit");
  }
  set onsubmit(value) {
    level0.set(this, "onsubmit", value);
  }
  get onsuspend() {
    return level0.get(this, "onsuspend");
  }
  set onsuspend(value) {
    level0.set(this, "onsuspend", value);
  }
  get ontimeupdate() {
    return level0.get(this, "ontimeupdate");
  }
  set ontimeupdate(value) {
    level0.set(this, "ontimeupdate", value);
  }
  get ontoggle() {
    return level0.get(this, "ontoggle");
  }
  set ontoggle(value) {
    level0.set(this, "ontoggle", value);
  }
  get onvolumechange() {
    return level0.get(this, "onvolumechange");
  }
  set onvolumechange(value) {
    level0.set(this, "onvolumechange", value);
  }
  get onwaiting() {
    return level0.get(this, "onwaiting");
  }
  set onwaiting(value) {
    level0.set(this, "onwaiting", value);
  }
  get onauxclick() {
    return level0.get(this, "onauxclick");
  }
  set onauxclick(value) {
    level0.set(this, "onauxclick", value);
  }
  get ongotpointercapture() {
    return level0.get(this, "ongotpointercapture");
  }
  set ongotpointercapture(value) {
    level0.set(this, "ongotpointercapture", value);
  }
  get onlostpointercapture() {
    return level0.get(this, "onlostpointercapture");
  }
  set onlostpointercapture(value) {
    level0.set(this, "onlostpointercapture", value);
  }
  get onpointercancel() {
    return level0.get(this, "onpointercancel");
  }
  set onpointercancel(value) {
    level0.set(this, "onpointercancel", value);
  }
  get onpointerdown() {
    return level0.get(this, "onpointerdown");
  }
  set onpointerdown(value) {
    level0.set(this, "onpointerdown", value);
  }
  get onpointerenter() {
    return level0.get(this, "onpointerenter");
  }
  set onpointerenter(value) {
    level0.set(this, "onpointerenter", value);
  }
  get onpointerleave() {
    return level0.get(this, "onpointerleave");
  }
  set onpointerleave(value) {
    level0.set(this, "onpointerleave", value);
  }
  get onpointermove() {
    return level0.get(this, "onpointermove");
  }
  set onpointermove(value) {
    level0.set(this, "onpointermove", value);
  }
  get onpointerout() {
    return level0.get(this, "onpointerout");
  }
  set onpointerout(value) {
    level0.set(this, "onpointerout", value);
  }
  get onpointerover() {
    return level0.get(this, "onpointerover");
  }
  set onpointerover(value) {
    level0.set(this, "onpointerover", value);
  }
  get onpointerup() {
    return level0.get(this, "onpointerup");
  }
  set onpointerup(value) {
    level0.set(this, "onpointerup", value);
  }
  /* c8 ignore stop */
};

// node_modules/linkedom/esm/html/template-element.js
var tagName = "template";
var HTMLTemplateElement = class extends HTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, tagName);
    const content = this.ownerDocument.createDocumentFragment();
    (this[CONTENT] = content)[PRIVATE] = this;
  }
  get content() {
    if (this.hasChildNodes() && !this[CONTENT].hasChildNodes()) {
      for (const node of this.childNodes)
        this[CONTENT].appendChild(node.cloneNode(true));
    }
    return this[CONTENT];
  }
};
registerHTMLClass(tagName, HTMLTemplateElement);

// node_modules/linkedom/esm/html/html-element.js
var HTMLHtmlElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "html") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/text-element.js
var { toString } = HTMLElement.prototype;
var TextElement = class extends HTMLElement {
  get innerHTML() {
    return this.textContent;
  }
  set innerHTML(html2) {
    this.textContent = html2;
  }
  toString() {
    const outerHTML = toString.call(this.cloneNode());
    return outerHTML.replace("><", () => `>${this.textContent}<`);
  }
};

// node_modules/linkedom/esm/html/script-element.js
var tagName2 = "script";
var HTMLScriptElement = class extends TextElement {
  constructor(ownerDocument, localName = tagName2) {
    super(ownerDocument, localName);
  }
  get type() {
    return stringAttribute.get(this, "type");
  }
  set type(value) {
    stringAttribute.set(this, "type", value);
  }
  get src() {
    return stringAttribute.get(this, "src");
  }
  set src(value) {
    stringAttribute.set(this, "src", value);
  }
  get defer() {
    return booleanAttribute.get(this, "defer");
  }
  set defer(value) {
    booleanAttribute.set(this, "defer", value);
  }
  get crossOrigin() {
    return stringAttribute.get(this, "crossorigin");
  }
  set crossOrigin(value) {
    stringAttribute.set(this, "crossorigin", value);
  }
  get nomodule() {
    return booleanAttribute.get(this, "nomodule");
  }
  set nomodule(value) {
    booleanAttribute.set(this, "nomodule", value);
  }
  get referrerPolicy() {
    return stringAttribute.get(this, "referrerpolicy");
  }
  set referrerPolicy(value) {
    stringAttribute.set(this, "referrerpolicy", value);
  }
  get nonce() {
    return stringAttribute.get(this, "nonce");
  }
  set nonce(value) {
    stringAttribute.set(this, "nonce", value);
  }
  get async() {
    return booleanAttribute.get(this, "async");
  }
  set async(value) {
    booleanAttribute.set(this, "async", value);
  }
  get text() {
    return this.textContent;
  }
  set text(content) {
    this.textContent = content;
  }
};
registerHTMLClass(tagName2, HTMLScriptElement);

// node_modules/linkedom/esm/html/frame-element.js
var HTMLFrameElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "frame") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/i-frame-element.js
var tagName3 = "iframe";
var HTMLIFrameElement = class extends HTMLElement {
  constructor(ownerDocument, localName = tagName3) {
    super(ownerDocument, localName);
  }
  /* c8 ignore start */
  get src() {
    return stringAttribute.get(this, "src");
  }
  set src(value) {
    stringAttribute.set(this, "src", value);
  }
  get srcdoc() {
    return stringAttribute.get(this, "srcdoc");
  }
  set srcdoc(value) {
    stringAttribute.set(this, "srcdoc", value);
  }
  get name() {
    return stringAttribute.get(this, "name");
  }
  set name(value) {
    stringAttribute.set(this, "name", value);
  }
  get allow() {
    return stringAttribute.get(this, "allow");
  }
  set allow(value) {
    stringAttribute.set(this, "allow", value);
  }
  get allowFullscreen() {
    return booleanAttribute.get(this, "allowfullscreen");
  }
  set allowFullscreen(value) {
    booleanAttribute.set(this, "allowfullscreen", value);
  }
  get referrerPolicy() {
    return stringAttribute.get(this, "referrerpolicy");
  }
  set referrerPolicy(value) {
    stringAttribute.set(this, "referrerpolicy", value);
  }
  get loading() {
    return stringAttribute.get(this, "loading");
  }
  set loading(value) {
    stringAttribute.set(this, "loading", value);
  }
  /* c8 ignore stop */
};
registerHTMLClass(tagName3, HTMLIFrameElement);

// node_modules/linkedom/esm/html/object-element.js
var HTMLObjectElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "object") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/head-element.js
var HTMLHeadElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "head") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/body-element.js
var HTMLBodyElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "body") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/style-element.js
var import_cssom = __toESM(require_lib(), 1);
var tagName4 = "style";
var HTMLStyleElement = class extends TextElement {
  constructor(ownerDocument, localName = tagName4) {
    super(ownerDocument, localName);
    this[SHEET] = null;
  }
  get sheet() {
    const sheet = this[SHEET];
    if (sheet !== null) {
      return sheet;
    }
    return this[SHEET] = (0, import_cssom.parse)(this.textContent);
  }
  get innerHTML() {
    return super.innerHTML || "";
  }
  set innerHTML(value) {
    super.textContent = value;
    this[SHEET] = null;
  }
  get innerText() {
    return super.innerText || "";
  }
  set innerText(value) {
    super.textContent = value;
    this[SHEET] = null;
  }
  get textContent() {
    return super.textContent || "";
  }
  set textContent(value) {
    super.textContent = value;
    this[SHEET] = null;
  }
};
registerHTMLClass(tagName4, HTMLStyleElement);

// node_modules/linkedom/esm/html/time-element.js
var HTMLTimeElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "time") {
    super(ownerDocument, localName);
  }
  /**
   * @type {string}
   */
  get dateTime() {
    return stringAttribute.get(this, "datetime");
  }
  set dateTime(value) {
    stringAttribute.set(this, "datetime", value);
  }
};
registerHTMLClass("time", HTMLTimeElement);

// node_modules/linkedom/esm/html/field-set-element.js
var HTMLFieldSetElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "fieldset") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/embed-element.js
var HTMLEmbedElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "embed") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/hr-element.js
var HTMLHRElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "hr") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/progress-element.js
var HTMLProgressElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "progress") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/paragraph-element.js
var HTMLParagraphElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "p") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/table-element.js
var HTMLTableElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "table") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/frame-set-element.js
var HTMLFrameSetElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "frameset") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/li-element.js
var HTMLLIElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "li") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/base-element.js
var HTMLBaseElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "base") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/data-list-element.js
var HTMLDataListElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "datalist") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/input-element.js
var tagName5 = "input";
var HTMLInputElement = class extends HTMLElement {
  constructor(ownerDocument, localName = tagName5) {
    super(ownerDocument, localName);
  }
  /* c8 ignore start */
  get autofocus() {
    return booleanAttribute.get(this, "autofocus") || -1;
  }
  set autofocus(value) {
    booleanAttribute.set(this, "autofocus", value);
  }
  get disabled() {
    return booleanAttribute.get(this, "disabled");
  }
  set disabled(value) {
    booleanAttribute.set(this, "disabled", value);
  }
  get name() {
    return this.getAttribute("name");
  }
  set name(value) {
    this.setAttribute("name", value);
  }
  get placeholder() {
    return this.getAttribute("placeholder");
  }
  set placeholder(value) {
    this.setAttribute("placeholder", value);
  }
  get type() {
    return this.getAttribute("type");
  }
  set type(value) {
    this.setAttribute("type", value);
  }
  get value() {
    return stringAttribute.get(this, "value");
  }
  set value(value) {
    stringAttribute.set(this, "value", value);
  }
  /* c8 ignore stop */
};
registerHTMLClass(tagName5, HTMLInputElement);

// node_modules/linkedom/esm/html/param-element.js
var HTMLParamElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "param") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/media-element.js
var HTMLMediaElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "media") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/audio-element.js
var HTMLAudioElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "audio") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/heading-element.js
var tagName6 = "h1";
var HTMLHeadingElement = class extends HTMLElement {
  constructor(ownerDocument, localName = tagName6) {
    super(ownerDocument, localName);
  }
};
registerHTMLClass([tagName6, "h2", "h3", "h4", "h5", "h6"], HTMLHeadingElement);

// node_modules/linkedom/esm/html/directory-element.js
var HTMLDirectoryElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "dir") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/quote-element.js
var HTMLQuoteElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "quote") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/canvas-element.js
var import_canvas = __toESM(require_canvas(), 1);
var { createCanvas } = import_canvas.default;
var tagName7 = "canvas";
var HTMLCanvasElement = class extends HTMLElement {
  constructor(ownerDocument, localName = tagName7) {
    super(ownerDocument, localName);
    this[IMAGE] = createCanvas(300, 150);
  }
  get width() {
    return this[IMAGE].width;
  }
  set width(value) {
    numericAttribute.set(this, "width", value);
    this[IMAGE].width = value;
  }
  get height() {
    return this[IMAGE].height;
  }
  set height(value) {
    numericAttribute.set(this, "height", value);
    this[IMAGE].height = value;
  }
  getContext(type) {
    return this[IMAGE].getContext(type);
  }
  toDataURL(...args) {
    return this[IMAGE].toDataURL(...args);
  }
};
registerHTMLClass(tagName7, HTMLCanvasElement);

// node_modules/linkedom/esm/html/legend-element.js
var HTMLLegendElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "legend") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/option-element.js
var tagName8 = "option";
var HTMLOptionElement = class extends HTMLElement {
  constructor(ownerDocument, localName = tagName8) {
    super(ownerDocument, localName);
  }
  /* c8 ignore start */
  get value() {
    return stringAttribute.get(this, "value");
  }
  set value(value) {
    stringAttribute.set(this, "value", value);
  }
  /* c8 ignore stop */
  get selected() {
    return booleanAttribute.get(this, "selected");
  }
  set selected(value) {
    const option = this.parentElement?.querySelector("option[selected]");
    if (option && option !== this)
      option.selected = false;
    booleanAttribute.set(this, "selected", value);
  }
};
registerHTMLClass(tagName8, HTMLOptionElement);

// node_modules/linkedom/esm/html/span-element.js
var HTMLSpanElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "span") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/meter-element.js
var HTMLMeterElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "meter") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/video-element.js
var HTMLVideoElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "video") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/table-cell-element.js
var HTMLTableCellElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "td") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/title-element.js
var tagName9 = "title";
var HTMLTitleElement = class extends TextElement {
  constructor(ownerDocument, localName = tagName9) {
    super(ownerDocument, localName);
  }
};
registerHTMLClass(tagName9, HTMLTitleElement);

// node_modules/linkedom/esm/html/output-element.js
var HTMLOutputElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "output") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/table-row-element.js
var HTMLTableRowElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "tr") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/data-element.js
var HTMLDataElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "data") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/menu-element.js
var HTMLMenuElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "menu") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/select-element.js
var tagName10 = "select";
var HTMLSelectElement = class extends HTMLElement {
  constructor(ownerDocument, localName = tagName10) {
    super(ownerDocument, localName);
  }
  get options() {
    let children = new NodeList();
    let { firstElementChild } = this;
    while (firstElementChild) {
      if (firstElementChild.tagName === "OPTGROUP")
        children.push(...firstElementChild.children);
      else
        children.push(firstElementChild);
      firstElementChild = firstElementChild.nextElementSibling;
    }
    return children;
  }
  /* c8 ignore start */
  get disabled() {
    return booleanAttribute.get(this, "disabled");
  }
  set disabled(value) {
    booleanAttribute.set(this, "disabled", value);
  }
  get name() {
    return this.getAttribute("name");
  }
  set name(value) {
    this.setAttribute("name", value);
  }
  /* c8 ignore stop */
  get value() {
    return this.querySelector("option[selected]")?.value;
  }
};
registerHTMLClass(tagName10, HTMLSelectElement);

// node_modules/linkedom/esm/html/br-element.js
var HTMLBRElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "br") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/button-element.js
var tagName11 = "button";
var HTMLButtonElement = class extends HTMLElement {
  constructor(ownerDocument, localName = tagName11) {
    super(ownerDocument, localName);
  }
  /* c8 ignore start */
  get disabled() {
    return booleanAttribute.get(this, "disabled");
  }
  set disabled(value) {
    booleanAttribute.set(this, "disabled", value);
  }
  get name() {
    return this.getAttribute("name");
  }
  set name(value) {
    this.setAttribute("name", value);
  }
  get type() {
    return this.getAttribute("type");
  }
  set type(value) {
    this.setAttribute("type", value);
  }
  /* c8 ignore stop */
};
registerHTMLClass(tagName11, HTMLButtonElement);

// node_modules/linkedom/esm/html/map-element.js
var HTMLMapElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "map") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/opt-group-element.js
var HTMLOptGroupElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "optgroup") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/d-list-element.js
var HTMLDListElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "dl") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/text-area-element.js
var tagName12 = "textarea";
var HTMLTextAreaElement = class extends TextElement {
  constructor(ownerDocument, localName = tagName12) {
    super(ownerDocument, localName);
  }
  /* c8 ignore start */
  get disabled() {
    return booleanAttribute.get(this, "disabled");
  }
  set disabled(value) {
    booleanAttribute.set(this, "disabled", value);
  }
  get name() {
    return this.getAttribute("name");
  }
  set name(value) {
    this.setAttribute("name", value);
  }
  get placeholder() {
    return this.getAttribute("placeholder");
  }
  set placeholder(value) {
    this.setAttribute("placeholder", value);
  }
  get type() {
    return this.getAttribute("type");
  }
  set type(value) {
    this.setAttribute("type", value);
  }
  get value() {
    return this.textContent;
  }
  set value(content) {
    this.textContent = content;
  }
  /* c8 ignore stop */
};
registerHTMLClass(tagName12, HTMLTextAreaElement);

// node_modules/linkedom/esm/html/font-element.js
var HTMLFontElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "font") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/div-element.js
var HTMLDivElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "div") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/link-element.js
var tagName13 = "link";
var HTMLLinkElement = class extends HTMLElement {
  constructor(ownerDocument, localName = tagName13) {
    super(ownerDocument, localName);
  }
  /* c8 ignore start */
  // copy paste from img.src, already covered
  get disabled() {
    return booleanAttribute.get(this, "disabled");
  }
  set disabled(value) {
    booleanAttribute.set(this, "disabled", value);
  }
  get href() {
    return stringAttribute.get(this, "href").trim();
  }
  set href(value) {
    stringAttribute.set(this, "href", value);
  }
  get hreflang() {
    return stringAttribute.get(this, "hreflang");
  }
  set hreflang(value) {
    stringAttribute.set(this, "hreflang", value);
  }
  get media() {
    return stringAttribute.get(this, "media");
  }
  set media(value) {
    stringAttribute.set(this, "media", value);
  }
  get rel() {
    return stringAttribute.get(this, "rel");
  }
  set rel(value) {
    stringAttribute.set(this, "rel", value);
  }
  get type() {
    return stringAttribute.get(this, "type");
  }
  set type(value) {
    stringAttribute.set(this, "type", value);
  }
  /* c8 ignore stop */
};
registerHTMLClass(tagName13, HTMLLinkElement);

// node_modules/linkedom/esm/html/slot-element.js
var tagName14 = "slot";
var HTMLSlotElement = class extends HTMLElement {
  constructor(ownerDocument, localName = tagName14) {
    super(ownerDocument, localName);
  }
  /* c8 ignore start */
  get name() {
    return this.getAttribute("name");
  }
  set name(value) {
    this.setAttribute("name", value);
  }
  assign() {
  }
  assignedNodes(options) {
    const isNamedSlot = !!this.name;
    const hostChildNodes = this.getRootNode().host?.childNodes ?? [];
    let slottables;
    if (isNamedSlot) {
      slottables = [...hostChildNodes].filter((node) => node.slot === this.name);
    } else {
      slottables = [...hostChildNodes].filter((node) => !node.slot);
    }
    if (options?.flatten) {
      const result = [];
      for (let slottable of slottables) {
        if (slottable.localName === "slot") {
          result.push(...slottable.assignedNodes({ flatten: true }));
        } else {
          result.push(slottable);
        }
      }
      slottables = result;
    }
    return slottables.length ? slottables : [...this.childNodes];
  }
  assignedElements(options) {
    const slottables = this.assignedNodes(options).filter((n) => n.nodeType === 1);
    return slottables.length ? slottables : [...this.children];
  }
  /* c8 ignore stop */
};
registerHTMLClass(tagName14, HTMLSlotElement);

// node_modules/linkedom/esm/html/form-element.js
var HTMLFormElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "form") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/image-element.js
var tagName15 = "img";
var HTMLImageElement = class extends HTMLElement {
  constructor(ownerDocument, localName = tagName15) {
    super(ownerDocument, localName);
  }
  /* c8 ignore start */
  get alt() {
    return stringAttribute.get(this, "alt");
  }
  set alt(value) {
    stringAttribute.set(this, "alt", value);
  }
  get sizes() {
    return stringAttribute.get(this, "sizes");
  }
  set sizes(value) {
    stringAttribute.set(this, "sizes", value);
  }
  get src() {
    return stringAttribute.get(this, "src");
  }
  set src(value) {
    stringAttribute.set(this, "src", value);
  }
  get srcset() {
    return stringAttribute.get(this, "srcset");
  }
  set srcset(value) {
    stringAttribute.set(this, "srcset", value);
  }
  get title() {
    return stringAttribute.get(this, "title");
  }
  set title(value) {
    stringAttribute.set(this, "title", value);
  }
  get width() {
    return numericAttribute.get(this, "width");
  }
  set width(value) {
    numericAttribute.set(this, "width", value);
  }
  get height() {
    return numericAttribute.get(this, "height");
  }
  set height(value) {
    numericAttribute.set(this, "height", value);
  }
  /* c8 ignore stop */
};
registerHTMLClass(tagName15, HTMLImageElement);

// node_modules/linkedom/esm/html/pre-element.js
var HTMLPreElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "pre") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/u-list-element.js
var HTMLUListElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "ul") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/meta-element.js
var tagName16 = "meta";
var HTMLMetaElement = class extends HTMLElement {
  constructor(ownerDocument, localName = tagName16) {
    super(ownerDocument, localName);
  }
  /* c8 ignore start */
  get name() {
    return stringAttribute.get(this, "name");
  }
  set name(value) {
    stringAttribute.set(this, "name", value);
  }
  get httpEquiv() {
    return stringAttribute.get(this, "http-equiv");
  }
  set httpEquiv(value) {
    stringAttribute.set(this, "http-equiv", value);
  }
  get content() {
    return stringAttribute.get(this, "content");
  }
  set content(value) {
    stringAttribute.set(this, "content", value);
  }
  get charset() {
    return stringAttribute.get(this, "charset");
  }
  set charset(value) {
    stringAttribute.set(this, "charset", value);
  }
  get media() {
    return stringAttribute.get(this, "media");
  }
  set media(value) {
    stringAttribute.set(this, "media", value);
  }
  /* c8 ignore stop */
};
registerHTMLClass(tagName16, HTMLMetaElement);

// node_modules/linkedom/esm/html/picture-element.js
var HTMLPictureElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "picture") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/area-element.js
var HTMLAreaElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "area") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/o-list-element.js
var HTMLOListElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "ol") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/table-caption-element.js
var HTMLTableCaptionElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "caption") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/anchor-element.js
var tagName17 = "a";
var HTMLAnchorElement = class extends HTMLElement {
  constructor(ownerDocument, localName = tagName17) {
    super(ownerDocument, localName);
  }
  /* c8 ignore start */
  // copy paste from img.src, already covered
  get href() {
    return encodeURI(decodeURI(stringAttribute.get(this, "href"))).trim();
  }
  set href(value) {
    stringAttribute.set(this, "href", decodeURI(value));
  }
  get download() {
    return encodeURI(decodeURI(stringAttribute.get(this, "download")));
  }
  set download(value) {
    stringAttribute.set(this, "download", decodeURI(value));
  }
  get target() {
    return stringAttribute.get(this, "target");
  }
  set target(value) {
    stringAttribute.set(this, "target", value);
  }
  get type() {
    return stringAttribute.get(this, "type");
  }
  set type(value) {
    stringAttribute.set(this, "type", value);
  }
  get rel() {
    return stringAttribute.get(this, "rel");
  }
  set rel(value) {
    stringAttribute.set(this, "rel", value);
  }
  /* c8 ignore stop */
};
registerHTMLClass(tagName17, HTMLAnchorElement);

// node_modules/linkedom/esm/html/label-element.js
var HTMLLabelElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "label") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/unknown-element.js
var HTMLUnknownElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "unknown") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/mod-element.js
var HTMLModElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "mod") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/details-element.js
var HTMLDetailsElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "details") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/source-element.js
var tagName18 = "source";
var HTMLSourceElement = class extends HTMLElement {
  constructor(ownerDocument, localName = tagName18) {
    super(ownerDocument, localName);
  }
  /* c8 ignore start */
  get src() {
    return stringAttribute.get(this, "src");
  }
  set src(value) {
    stringAttribute.set(this, "src", value);
  }
  get srcset() {
    return stringAttribute.get(this, "srcset");
  }
  set srcset(value) {
    stringAttribute.set(this, "srcset", value);
  }
  get sizes() {
    return stringAttribute.get(this, "sizes");
  }
  set sizes(value) {
    stringAttribute.set(this, "sizes", value);
  }
  get type() {
    return stringAttribute.get(this, "type");
  }
  set type(value) {
    stringAttribute.set(this, "type", value);
  }
  /* c8 ignore stop */
};
registerHTMLClass(tagName18, HTMLSourceElement);

// node_modules/linkedom/esm/html/track-element.js
var HTMLTrackElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "track") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/marquee-element.js
var HTMLMarqueeElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "marquee") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/shared/html-classes.js
var HTMLClasses = {
  HTMLElement,
  HTMLTemplateElement,
  HTMLHtmlElement,
  HTMLScriptElement,
  HTMLFrameElement,
  HTMLIFrameElement,
  HTMLObjectElement,
  HTMLHeadElement,
  HTMLBodyElement,
  HTMLStyleElement,
  HTMLTimeElement,
  HTMLFieldSetElement,
  HTMLEmbedElement,
  HTMLHRElement,
  HTMLProgressElement,
  HTMLParagraphElement,
  HTMLTableElement,
  HTMLFrameSetElement,
  HTMLLIElement,
  HTMLBaseElement,
  HTMLDataListElement,
  HTMLInputElement,
  HTMLParamElement,
  HTMLMediaElement,
  HTMLAudioElement,
  HTMLHeadingElement,
  HTMLDirectoryElement,
  HTMLQuoteElement,
  HTMLCanvasElement,
  HTMLLegendElement,
  HTMLOptionElement,
  HTMLSpanElement,
  HTMLMeterElement,
  HTMLVideoElement,
  HTMLTableCellElement,
  HTMLTitleElement,
  HTMLOutputElement,
  HTMLTableRowElement,
  HTMLDataElement,
  HTMLMenuElement,
  HTMLSelectElement,
  HTMLBRElement,
  HTMLButtonElement,
  HTMLMapElement,
  HTMLOptGroupElement,
  HTMLDListElement,
  HTMLTextAreaElement,
  HTMLFontElement,
  HTMLDivElement,
  HTMLLinkElement,
  HTMLSlotElement,
  HTMLFormElement,
  HTMLImageElement,
  HTMLPreElement,
  HTMLUListElement,
  HTMLMetaElement,
  HTMLPictureElement,
  HTMLAreaElement,
  HTMLOListElement,
  HTMLTableCaptionElement,
  HTMLAnchorElement,
  HTMLLabelElement,
  HTMLUnknownElement,
  HTMLModElement,
  HTMLDetailsElement,
  HTMLSourceElement,
  HTMLTrackElement,
  HTMLMarqueeElement
};

// node_modules/linkedom/esm/shared/mime.js
var voidElements3 = { test: () => true };
var Mime = {
  "text/html": {
    docType: "<!DOCTYPE html>",
    ignoreCase: true,
    voidElements: /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i
  },
  "image/svg+xml": {
    docType: '<?xml version="1.0" encoding="utf-8"?>',
    ignoreCase: false,
    voidElements: voidElements3
  },
  "text/xml": {
    docType: '<?xml version="1.0" encoding="utf-8"?>',
    ignoreCase: false,
    voidElements: voidElements3
  },
  "application/xml": {
    docType: '<?xml version="1.0" encoding="utf-8"?>',
    ignoreCase: false,
    voidElements: voidElements3
  },
  "application/xhtml+xml": {
    docType: '<?xml version="1.0" encoding="utf-8"?>',
    ignoreCase: false,
    voidElements: voidElements3
  }
};

// node_modules/linkedom/esm/interface/custom-event.js
var CustomEvent = class extends GlobalEvent {
  constructor(type, eventInitDict = {}) {
    super(type, eventInitDict);
    this.detail = eventInitDict.detail;
  }
};

// node_modules/linkedom/esm/interface/input-event.js
var InputEvent = class extends GlobalEvent {
  constructor(type, inputEventInit = {}) {
    super(type, inputEventInit);
    this.inputType = inputEventInit.inputType;
    this.data = inputEventInit.data;
    this.dataTransfer = inputEventInit.dataTransfer;
    this.isComposing = inputEventInit.isComposing || false;
    this.ranges = inputEventInit.ranges;
  }
};

// node_modules/linkedom/esm/interface/image.js
var ImageClass = (ownerDocument) => (
  /**
   * @implements globalThis.Image
   */
  class Image extends HTMLImageElement {
    constructor(width2, height2) {
      super(ownerDocument);
      switch (arguments.length) {
        case 1:
          this.height = width2;
          this.width = width2;
          break;
        case 2:
          this.height = height2;
          this.width = width2;
          break;
      }
    }
  }
);

// node_modules/linkedom/esm/interface/range.js
var deleteContents = ({ [START]: start, [END]: end }, fragment = null) => {
  setAdjacent(start[PREV], end[NEXT]);
  do {
    const after3 = getEnd(start);
    const next2 = after3 === end ? after3 : after3[NEXT];
    if (fragment)
      fragment.insertBefore(start, fragment[END]);
    else
      start.remove();
    start = next2;
  } while (start !== end);
};
var Range = class _Range {
  constructor() {
    this[START] = null;
    this[END] = null;
    this.commonAncestorContainer = null;
  }
  /* TODO: this is more complicated than it looks
    setStart(node, offset) {
      this[START] = node.childNodes[offset];
    }
  
    setEnd(node, offset) {
      this[END] = getEnd(node.childNodes[offset]);
    }
    //*/
  insertNode(newNode) {
    this[END].parentNode.insertBefore(newNode, this[START]);
  }
  selectNode(node) {
    this[START] = node;
    this[END] = getEnd(node);
  }
  // TODO: SVG elements should then create contextual fragments
  //       that return SVG nodes
  selectNodeContents(node) {
    this.selectNode(node);
    this.commonAncestorContainer = node;
  }
  surroundContents(parentNode) {
    parentNode.replaceChildren(this.extractContents());
  }
  setStartBefore(node) {
    this[START] = node;
  }
  setStartAfter(node) {
    this[START] = node.nextSibling;
  }
  setEndBefore(node) {
    this[END] = getEnd(node.previousSibling);
  }
  setEndAfter(node) {
    this[END] = getEnd(node);
  }
  cloneContents() {
    let { [START]: start, [END]: end } = this;
    const fragment = start.ownerDocument.createDocumentFragment();
    while (start !== end) {
      fragment.insertBefore(start.cloneNode(true), fragment[END]);
      start = getEnd(start);
      if (start !== end)
        start = start[NEXT];
    }
    return fragment;
  }
  deleteContents() {
    deleteContents(this);
  }
  extractContents() {
    const fragment = this[START].ownerDocument.createDocumentFragment();
    deleteContents(this, fragment);
    return fragment;
  }
  createContextualFragment(html2) {
    const { commonAncestorContainer: doc } = this;
    const isSVG = "ownerSVGElement" in doc;
    const document2 = isSVG ? doc.ownerDocument : doc;
    let content = htmlToFragment(document2, html2);
    if (isSVG) {
      const childNodes = [...content.childNodes];
      content = document2.createDocumentFragment();
      Object.setPrototypeOf(content, SVGElement.prototype);
      content.ownerSVGElement = document2;
      for (const child of childNodes) {
        Object.setPrototypeOf(child, SVGElement.prototype);
        child.ownerSVGElement = document2;
        content.appendChild(child);
      }
    } else
      this.selectNode(content);
    return content;
  }
  cloneRange() {
    const range = new _Range();
    range[START] = this[START];
    range[END] = this[END];
    return range;
  }
};

// node_modules/linkedom/esm/interface/tree-walker.js
var isOK = ({ nodeType }, mask) => {
  switch (nodeType) {
    case ELEMENT_NODE:
      return mask & SHOW_ELEMENT;
    case TEXT_NODE:
      return mask & SHOW_TEXT;
    case COMMENT_NODE:
      return mask & SHOW_COMMENT;
    case CDATA_SECTION_NODE:
      return mask & SHOW_CDATA_SECTION;
  }
  return 0;
};
var TreeWalker = class {
  constructor(root2, whatToShow = SHOW_ALL) {
    this.root = root2;
    this.currentNode = root2;
    this.whatToShow = whatToShow;
    let { [NEXT]: next2, [END]: end } = root2;
    if (root2.nodeType === DOCUMENT_NODE) {
      const { documentElement } = root2;
      next2 = documentElement;
      end = documentElement[END];
    }
    const nodes = [];
    while (next2 && next2 !== end) {
      if (isOK(next2, whatToShow))
        nodes.push(next2);
      next2 = next2[NEXT];
    }
    this[PRIVATE] = { i: 0, nodes };
  }
  nextNode() {
    const $ = this[PRIVATE];
    this.currentNode = $.i < $.nodes.length ? $.nodes[$.i++] : null;
    return this.currentNode;
  }
};

// node_modules/linkedom/esm/interface/document.js
var query = (method, ownerDocument, selectors) => {
  let { [NEXT]: next2, [END]: end } = ownerDocument;
  return method.call({ ownerDocument, [NEXT]: next2, [END]: end }, selectors);
};
var globalExports = assign(
  {},
  Facades,
  HTMLClasses,
  {
    CustomEvent,
    Event: GlobalEvent,
    EventTarget: DOMEventTarget,
    InputEvent,
    NamedNodeMap,
    NodeList
  }
);
var window2 = /* @__PURE__ */ new WeakMap();
var Document2 = class extends NonElementParentNode {
  constructor(type) {
    super(null, "#document", DOCUMENT_NODE);
    this[CUSTOM_ELEMENTS] = { active: false, registry: null };
    this[MUTATION_OBSERVER] = { active: false, class: null };
    this[MIME] = Mime[type];
    this[DOCTYPE] = null;
    this[DOM_PARSER] = null;
    this[GLOBALS] = null;
    this[IMAGE] = null;
    this[UPGRADE] = null;
  }
  /**
   * @type {globalThis.Document['defaultView']}
   */
  get defaultView() {
    if (!window2.has(this))
      window2.set(this, new Proxy(globalThis, {
        set: (target, name, value) => {
          switch (name) {
            case "addEventListener":
            case "removeEventListener":
            case "dispatchEvent":
              this[EVENT_TARGET][name] = value;
              break;
            default:
              target[name] = value;
              break;
          }
          return true;
        },
        get: (globalThis2, name) => {
          switch (name) {
            case "addEventListener":
            case "removeEventListener":
            case "dispatchEvent":
              if (!this[EVENT_TARGET]) {
                const et = this[EVENT_TARGET] = new DOMEventTarget();
                et.dispatchEvent = et.dispatchEvent.bind(et);
                et.addEventListener = et.addEventListener.bind(et);
                et.removeEventListener = et.removeEventListener.bind(et);
              }
              return this[EVENT_TARGET][name];
            case "document":
              return this;
            /* c8 ignore start */
            case "navigator":
              return {
                userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36"
              };
            /* c8 ignore stop */
            case "window":
              return window2.get(this);
            case "customElements":
              if (!this[CUSTOM_ELEMENTS].registry)
                this[CUSTOM_ELEMENTS] = new CustomElementRegistry(this);
              return this[CUSTOM_ELEMENTS];
            case "performance":
              return globalThis2.performance;
            case "DOMParser":
              return this[DOM_PARSER];
            case "Image":
              if (!this[IMAGE])
                this[IMAGE] = ImageClass(this);
              return this[IMAGE];
            case "MutationObserver":
              if (!this[MUTATION_OBSERVER].class)
                this[MUTATION_OBSERVER] = new MutationObserverClass(this);
              return this[MUTATION_OBSERVER].class;
          }
          return this[GLOBALS] && this[GLOBALS][name] || globalExports[name] || globalThis2[name];
        }
      }));
    return window2.get(this);
  }
  get doctype() {
    const docType = this[DOCTYPE];
    if (docType)
      return docType;
    const { firstChild } = this;
    if (firstChild && firstChild.nodeType === DOCUMENT_TYPE_NODE)
      return this[DOCTYPE] = firstChild;
    return null;
  }
  set doctype(value) {
    if (/^([a-z:]+)(\s+system|\s+public(\s+"([^"]+)")?)?(\s+"([^"]+)")?/i.test(value)) {
      const { $1: name, $4: publicId, $6: systemId } = RegExp;
      this[DOCTYPE] = new DocumentType(this, name, publicId, systemId);
      knownSiblings(this, this[DOCTYPE], this[NEXT]);
    }
  }
  get documentElement() {
    return this.firstElementChild;
  }
  get isConnected() {
    return true;
  }
  /**
   * @protected
   */
  _getParent() {
    return this[EVENT_TARGET];
  }
  createAttribute(name) {
    return new Attr(this, name);
  }
  createCDATASection(data2) {
    return new CDATASection(this, data2);
  }
  createComment(textContent3) {
    return new Comment3(this, textContent3);
  }
  createDocumentFragment() {
    return new DocumentFragment(this);
  }
  createDocumentType(name, publicId, systemId) {
    return new DocumentType(this, name, publicId, systemId);
  }
  createElement(localName) {
    return new Element2(this, localName);
  }
  createRange() {
    const range = new Range();
    range.commonAncestorContainer = this;
    return range;
  }
  createTextNode(textContent3) {
    return new Text6(this, textContent3);
  }
  createTreeWalker(root2, whatToShow = -1) {
    return new TreeWalker(root2, whatToShow);
  }
  createNodeIterator(root2, whatToShow = -1) {
    return this.createTreeWalker(root2, whatToShow);
  }
  createEvent(name) {
    const event = create(name === "Event" ? new GlobalEvent("") : new CustomEvent(""));
    event.initEvent = event.initCustomEvent = (type, canBubble = false, cancelable = false, detail) => {
      event.bubbles = !!canBubble;
      defineProperties(event, {
        type: { value: type },
        canBubble: { value: canBubble },
        cancelable: { value: cancelable },
        detail: { value: detail }
      });
    };
    return event;
  }
  cloneNode(deep = false) {
    const {
      constructor,
      [CUSTOM_ELEMENTS]: customElements2,
      [DOCTYPE]: doctype
    } = this;
    const document2 = new constructor();
    document2[CUSTOM_ELEMENTS] = customElements2;
    if (deep) {
      const end = document2[END];
      const { childNodes } = this;
      for (let { length: length2 } = childNodes, i = 0; i < length2; i++)
        document2.insertBefore(childNodes[i].cloneNode(true), end);
      if (doctype)
        document2[DOCTYPE] = childNodes[0];
    }
    return document2;
  }
  importNode(externalNode) {
    const deep = 1 < arguments.length && !!arguments[1];
    const node = externalNode.cloneNode(deep);
    const { [CUSTOM_ELEMENTS]: customElements2 } = this;
    const { active } = customElements2;
    const upgrade = (element) => {
      const { ownerDocument, nodeType } = element;
      element.ownerDocument = this;
      if (active && ownerDocument !== this && nodeType === ELEMENT_NODE)
        customElements2.upgrade(element);
    };
    upgrade(node);
    if (deep) {
      switch (node.nodeType) {
        case ELEMENT_NODE:
        case DOCUMENT_FRAGMENT_NODE: {
          let { [NEXT]: next2, [END]: end } = node;
          while (next2 !== end) {
            if (next2.nodeType === ELEMENT_NODE)
              upgrade(next2);
            next2 = next2[NEXT];
          }
          break;
        }
      }
    }
    return node;
  }
  toString() {
    return this.childNodes.join("");
  }
  querySelector(selectors) {
    return query(super.querySelector, this, selectors);
  }
  querySelectorAll(selectors) {
    return query(super.querySelectorAll, this, selectors);
  }
  /* c8 ignore start */
  getElementsByTagNameNS(_, name) {
    return this.getElementsByTagName(name);
  }
  createAttributeNS(_, name) {
    return this.createAttribute(name);
  }
  createElementNS(nsp, localName, options) {
    return nsp === SVG_NAMESPACE ? new SVGElement(this, localName, null) : this.createElement(localName, options);
  }
  /* c8 ignore stop */
};
setPrototypeOf(
  globalExports.Document = function Document3() {
    illegalConstructor();
  },
  Document2
).prototype = Document2.prototype;

// node_modules/linkedom/esm/shared/parse-json.js
var { parse: parse4 } = JSON;

// node_modules/linkedom/esm/index.js
function Document4() {
  illegalConstructor();
}
setPrototypeOf(Document4, Document2).prototype = Document2.prototype;

// node_modules/@svgdotjs/svg.js/dist/svg.esm.js
var __create2 = Object.create;
var __defProp2 = Object.defineProperty;
var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
var __getOwnPropNames2 = Object.getOwnPropertyNames;
var __getProtoOf2 = Object.getPrototypeOf;
var __hasOwnProp2 = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __exportAll = (all, no_symbols) => {
  let target = {};
  for (var name in all) {
    __defProp2(target, name, {
      get: all[name],
      enumerable: true
    });
  }
  if (!no_symbols) {
    __defProp2(target, Symbol.toStringTag, { value: "Module" });
  }
  return target;
};
var __copyProps2 = (to2, from2, except, desc) => {
  if (from2 && typeof from2 === "object" || typeof from2 === "function") {
    for (var keys2 = __getOwnPropNames2(from2), i = 0, n = keys2.length, key2; i < n; i++) {
      key2 = keys2[i];
      if (!__hasOwnProp2.call(to2, key2) && key2 !== except) {
        __defProp2(to2, key2, {
          get: ((k) => from2[k]).bind(null, key2),
          enumerable: !(desc = __getOwnPropDesc2(from2, key2)) || desc.enumerable
        });
      }
    }
  }
  return to2;
};
var __toESM2 = (mod, isNodeMode, target) => (target = mod != null ? __create2(__getProtoOf2(mod)) : {}, __copyProps2(isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", {
  value: mod,
  enumerable: true
}) : target, mod));
var methods = {};
var names = [];
function registerMethods(name, m) {
  if (Array.isArray(name)) {
    for (const _name of name) registerMethods(_name, m);
    return;
  }
  if (typeof name === "object") {
    for (const _name in name) registerMethods(_name, name[_name]);
    return;
  }
  addMethodNames(Object.getOwnPropertyNames(m));
  methods[name] = Object.assign(methods[name] || {}, m);
}
function getMethodsFor(name) {
  return methods[name] || {};
}
function getMethodNames() {
  return [...new Set(names)];
}
function addMethodNames(_names) {
  names.push(..._names);
}
var require_fails = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  module.exports = function(exec) {
    try {
      return !!exec();
    } catch (error) {
      return true;
    }
  };
}));
var require_function_bind_native = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var fails = require_fails();
  module.exports = !fails(function() {
    var test = function() {
    }.bind();
    return typeof test != "function" || test.hasOwnProperty("prototype");
  });
}));
var require_function_uncurry_this = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var NATIVE_BIND = require_function_bind_native();
  var FunctionPrototype = Function.prototype;
  var call = FunctionPrototype.call;
  var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);
  module.exports = NATIVE_BIND ? uncurryThisWithBind : function(fn) {
    return function() {
      return call.apply(fn, arguments);
    };
  };
}));
var require_object_is_prototype_of = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var uncurryThis = require_function_uncurry_this();
  module.exports = uncurryThis({}.isPrototypeOf);
}));
var require_global_this = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var check = function(it) {
    return it && it.Math === Math && it;
  };
  module.exports = check(typeof globalThis == "object" && globalThis) || check(typeof window == "object" && window) || check(typeof self == "object" && self) || check(typeof global == "object" && global) || check(typeof exports == "object" && exports) || /* @__PURE__ */ (function() {
    return this;
  })() || Function("return this")();
}));
var require_function_apply = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var NATIVE_BIND = require_function_bind_native();
  var FunctionPrototype = Function.prototype;
  var apply = FunctionPrototype.apply;
  var call = FunctionPrototype.call;
  module.exports = typeof Reflect == "object" && Reflect.apply || (NATIVE_BIND ? call.bind(apply) : function() {
    return call.apply(apply, arguments);
  });
}));
var require_classof_raw = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var uncurryThis = require_function_uncurry_this();
  var toString2 = uncurryThis({}.toString);
  var stringSlice = uncurryThis("".slice);
  module.exports = function(it) {
    return stringSlice(toString2(it), 8, -1);
  };
}));
var require_function_uncurry_this_clause = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var classofRaw = require_classof_raw();
  var uncurryThis = require_function_uncurry_this();
  module.exports = function(fn) {
    if (classofRaw(fn) === "Function") return uncurryThis(fn);
  };
}));
var require_is_callable = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var documentAll = typeof document == "object" && document.all;
  module.exports = typeof documentAll == "undefined" && documentAll !== void 0 ? function(argument) {
    return typeof argument == "function" || argument === documentAll;
  } : function(argument) {
    return typeof argument == "function";
  };
}));
var require_descriptors = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var fails = require_fails();
  module.exports = !fails(function() {
    return Object.defineProperty({}, 1, { get: function() {
      return 7;
    } })[1] !== 7;
  });
}));
var require_function_call = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var NATIVE_BIND = require_function_bind_native();
  var call = Function.prototype.call;
  module.exports = NATIVE_BIND ? call.bind(call) : function() {
    return call.apply(call, arguments);
  };
}));
var require_object_property_is_enumerable = /* @__PURE__ */ __commonJSMin(((exports) => {
  var $propertyIsEnumerable = {}.propertyIsEnumerable;
  var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);
  exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
    var descriptor = getOwnPropertyDescriptor(this, V);
    return !!descriptor && descriptor.enumerable;
  } : $propertyIsEnumerable;
}));
var require_create_property_descriptor = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  module.exports = function(bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value
    };
  };
}));
var require_indexed_object = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var uncurryThis = require_function_uncurry_this();
  var fails = require_fails();
  var classof = require_classof_raw();
  var $Object = Object;
  var split = uncurryThis("".split);
  module.exports = fails(function() {
    return !$Object("z").propertyIsEnumerable(0);
  }) ? function(it) {
    return classof(it) === "String" ? split(it, "") : $Object(it);
  } : $Object;
}));
var require_is_null_or_undefined = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  module.exports = function(it) {
    return it === null || it === void 0;
  };
}));
var require_require_object_coercible = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var isNullOrUndefined = require_is_null_or_undefined();
  var $TypeError = TypeError;
  module.exports = function(it) {
    if (isNullOrUndefined(it)) throw new $TypeError("Can't call method on " + it);
    return it;
  };
}));
var require_to_indexed_object = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var IndexedObject = require_indexed_object();
  var requireObjectCoercible = require_require_object_coercible();
  module.exports = function(it) {
    return IndexedObject(requireObjectCoercible(it));
  };
}));
var require_is_object = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var isCallable = require_is_callable();
  module.exports = function(it) {
    return typeof it == "object" ? it !== null : isCallable(it);
  };
}));
var require_path = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  module.exports = {};
}));
var require_get_built_in = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var path = require_path();
  var globalThis2 = require_global_this();
  var isCallable = require_is_callable();
  var aFunction = function(variable) {
    return isCallable(variable) ? variable : void 0;
  };
  module.exports = function(namespace, method) {
    return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(globalThis2[namespace]) : path[namespace] && path[namespace][method] || globalThis2[namespace] && globalThis2[namespace][method];
  };
}));
var require_environment_user_agent = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var navigator = require_global_this().navigator;
  var userAgent = navigator && navigator.userAgent;
  module.exports = userAgent ? String(userAgent) : "";
}));
var require_environment_v8_version = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var globalThis2 = require_global_this();
  var userAgent = require_environment_user_agent();
  var process2 = globalThis2.process;
  var Deno = globalThis2.Deno;
  var versions = process2 && process2.versions || Deno && Deno.version;
  var v8 = versions && versions.v8;
  var match;
  var version;
  if (v8) {
    match = v8.split(".");
    version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
  }
  if (!version && userAgent) {
    match = userAgent.match(/Edge\/(\d+)/);
    if (!match || match[1] >= 74) {
      match = userAgent.match(/Chrome\/(\d+)/);
      if (match) version = +match[1];
    }
  }
  module.exports = version;
}));
var require_symbol_constructor_detection = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var V8_VERSION = require_environment_v8_version();
  var fails = require_fails();
  var $String2 = require_global_this().String;
  module.exports = !!Object.getOwnPropertySymbols && !fails(function() {
    var symbol = /* @__PURE__ */ Symbol("symbol detection");
    return !$String2(symbol) || !(Object(symbol) instanceof Symbol) || !Symbol.sham && V8_VERSION && V8_VERSION < 41;
  });
}));
var require_use_symbol_as_uid = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var NATIVE_SYMBOL = require_symbol_constructor_detection();
  module.exports = NATIVE_SYMBOL && !Symbol.sham && typeof Symbol.iterator == "symbol";
}));
var require_is_symbol = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var getBuiltIn = require_get_built_in();
  var isCallable = require_is_callable();
  var isPrototypeOf = require_object_is_prototype_of();
  var USE_SYMBOL_AS_UID = require_use_symbol_as_uid();
  var $Object = Object;
  module.exports = USE_SYMBOL_AS_UID ? function(it) {
    return typeof it == "symbol";
  } : function(it) {
    var $Symbol = getBuiltIn("Symbol");
    return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
  };
}));
var require_try_to_string = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var $String2 = String;
  module.exports = function(argument) {
    try {
      return $String2(argument);
    } catch (error) {
      return "Object";
    }
  };
}));
var require_a_callable = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var isCallable = require_is_callable();
  var tryToString = require_try_to_string();
  var $TypeError = TypeError;
  module.exports = function(argument) {
    if (isCallable(argument)) return argument;
    throw new $TypeError(tryToString(argument) + " is not a function");
  };
}));
var require_get_method = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var aCallable = require_a_callable();
  var isNullOrUndefined = require_is_null_or_undefined();
  module.exports = function(V, P) {
    var func = V[P];
    return isNullOrUndefined(func) ? void 0 : aCallable(func);
  };
}));
var require_ordinary_to_primitive = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var call = require_function_call();
  var isCallable = require_is_callable();
  var isObject = require_is_object();
  var $TypeError = TypeError;
  module.exports = function(input, pref) {
    var fn, val;
    if (pref === "string" && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
    if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
    if (pref !== "string" && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
    throw new $TypeError("Can't convert object to primitive value");
  };
}));
var require_is_pure = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  module.exports = true;
}));
var require_define_global_property = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var globalThis2 = require_global_this();
  var defineProperty = Object.defineProperty;
  module.exports = function(key2, value) {
    try {
      defineProperty(globalThis2, key2, {
        value,
        configurable: true,
        writable: true
      });
    } catch (error) {
      globalThis2[key2] = value;
    }
    return value;
  };
}));
var require_shared_store = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var IS_PURE = require_is_pure();
  var globalThis2 = require_global_this();
  var defineGlobalProperty = require_define_global_property();
  var SHARED = "__core-js_shared__";
  var store = module.exports = globalThis2[SHARED] || defineGlobalProperty(SHARED, {});
  (store.versions || (store.versions = [])).push({
    version: "3.49.0",
    mode: IS_PURE ? "pure" : "global",
    copyright: "\xA9 2013\u20132025 Denis Pushkarev (zloirock.ru), 2025\u20132026 CoreJS Company (core-js.io). All rights reserved.",
    license: "https://github.com/zloirock/core-js/blob/v3.49.0/LICENSE",
    source: "https://github.com/zloirock/core-js"
  });
}));
var require_shared = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var store = require_shared_store();
  module.exports = function(key2, value) {
    return store[key2] || (store[key2] = value || {});
  };
}));
var require_to_object = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var requireObjectCoercible = require_require_object_coercible();
  var $Object = Object;
  module.exports = function(argument) {
    return $Object(requireObjectCoercible(argument));
  };
}));
var require_has_own_property = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var uncurryThis = require_function_uncurry_this();
  var toObject = require_to_object();
  var hasOwnProperty = uncurryThis({}.hasOwnProperty);
  module.exports = Object.hasOwn || function hasOwn(it, key2) {
    return hasOwnProperty(toObject(it), key2);
  };
}));
var require_uid = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var uncurryThis = require_function_uncurry_this();
  var id = 0;
  var postfix = Math.random();
  var toString2 = uncurryThis(1.1.toString);
  module.exports = function(key2) {
    return "Symbol(" + (key2 === void 0 ? "" : key2) + ")_" + toString2(++id + postfix, 36);
  };
}));
var require_well_known_symbol = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var globalThis2 = require_global_this();
  var shared = require_shared();
  var hasOwn = require_has_own_property();
  var uid = require_uid();
  var NATIVE_SYMBOL = require_symbol_constructor_detection();
  var USE_SYMBOL_AS_UID = require_use_symbol_as_uid();
  var Symbol2 = globalThis2.Symbol;
  var WellKnownSymbolsStore = shared("wks");
  var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol2["for"] || Symbol2 : Symbol2 && Symbol2.withoutSetter || uid;
  module.exports = function(name) {
    if (!hasOwn(WellKnownSymbolsStore, name)) WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol2, name) ? Symbol2[name] : createWellKnownSymbol("Symbol." + name);
    return WellKnownSymbolsStore[name];
  };
}));
var require_to_primitive = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var call = require_function_call();
  var isObject = require_is_object();
  var isSymbol = require_is_symbol();
  var getMethod = require_get_method();
  var ordinaryToPrimitive = require_ordinary_to_primitive();
  var wellKnownSymbol = require_well_known_symbol();
  var $TypeError = TypeError;
  var TO_PRIMITIVE = wellKnownSymbol("toPrimitive");
  module.exports = function(input, pref) {
    if (!isObject(input) || isSymbol(input)) return input;
    var exoticToPrim = getMethod(input, TO_PRIMITIVE);
    var result;
    if (exoticToPrim) {
      if (pref === void 0) pref = "default";
      result = call(exoticToPrim, input, pref);
      if (!isObject(result) || isSymbol(result)) return result;
      throw new $TypeError("Can't convert object to primitive value");
    }
    if (pref === void 0) pref = "number";
    return ordinaryToPrimitive(input, pref);
  };
}));
var require_to_property_key = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var toPrimitive = require_to_primitive();
  var isSymbol = require_is_symbol();
  module.exports = function(argument) {
    var key2 = toPrimitive(argument, "string");
    return isSymbol(key2) ? key2 : key2 + "";
  };
}));
var require_document_create_element = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var globalThis2 = require_global_this();
  var isObject = require_is_object();
  var document2 = globalThis2.document;
  var EXISTS = isObject(document2) && isObject(document2.createElement);
  module.exports = function(it) {
    return EXISTS ? document2.createElement(it) : {};
  };
}));
var require_ie8_dom_define = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var DESCRIPTORS = require_descriptors();
  var fails = require_fails();
  var createElement = require_document_create_element();
  module.exports = !DESCRIPTORS && !fails(function() {
    return Object.defineProperty(createElement("div"), "a", { get: function() {
      return 7;
    } }).a !== 7;
  });
}));
var require_object_get_own_property_descriptor = /* @__PURE__ */ __commonJSMin(((exports) => {
  var DESCRIPTORS = require_descriptors();
  var call = require_function_call();
  var propertyIsEnumerableModule = require_object_property_is_enumerable();
  var createPropertyDescriptor = require_create_property_descriptor();
  var toIndexedObject = require_to_indexed_object();
  var toPropertyKey = require_to_property_key();
  var hasOwn = require_has_own_property();
  var IE8_DOM_DEFINE = require_ie8_dom_define();
  var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
    O = toIndexedObject(O);
    P = toPropertyKey(P);
    if (IE8_DOM_DEFINE) try {
      return $getOwnPropertyDescriptor(O, P);
    } catch (error) {
    }
    if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
  };
}));
var require_is_forced = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var fails = require_fails();
  var isCallable = require_is_callable();
  var replacement = /#|\.prototype\./;
  var isForced = function(feature, detection) {
    var value = data2[normalize(feature)];
    return value === POLYFILL ? true : value === NATIVE ? false : isCallable(detection) ? fails(detection) : !!detection;
  };
  var normalize = isForced.normalize = function(string) {
    return String(string).replace(replacement, ".").toLowerCase();
  };
  var data2 = isForced.data = {};
  var NATIVE = isForced.NATIVE = "N";
  var POLYFILL = isForced.POLYFILL = "P";
  module.exports = isForced;
}));
var require_function_bind_context = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var uncurryThis = require_function_uncurry_this_clause();
  var aCallable = require_a_callable();
  var NATIVE_BIND = require_function_bind_native();
  var bind = uncurryThis(uncurryThis.bind);
  module.exports = function(fn, that) {
    aCallable(fn);
    return that === void 0 ? fn : NATIVE_BIND ? bind(fn, that) : function() {
      return fn.apply(that, arguments);
    };
  };
}));
var require_v8_prototype_define_bug = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var DESCRIPTORS = require_descriptors();
  var fails = require_fails();
  module.exports = DESCRIPTORS && fails(function() {
    return Object.defineProperty(function() {
    }, "prototype", {
      value: 42,
      writable: false
    }).prototype !== 42;
  });
}));
var require_an_object = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var isObject = require_is_object();
  var $String2 = String;
  var $TypeError = TypeError;
  module.exports = function(argument) {
    if (isObject(argument)) return argument;
    throw new $TypeError($String2(argument) + " is not an object");
  };
}));
var require_object_define_property = /* @__PURE__ */ __commonJSMin(((exports) => {
  var DESCRIPTORS = require_descriptors();
  var IE8_DOM_DEFINE = require_ie8_dom_define();
  var V8_PROTOTYPE_DEFINE_BUG = require_v8_prototype_define_bug();
  var anObject = require_an_object();
  var toPropertyKey = require_to_property_key();
  var $TypeError = TypeError;
  var $defineProperty = Object.defineProperty;
  var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  var ENUMERABLE = "enumerable";
  var CONFIGURABLE = "configurable";
  var WRITABLE = "writable";
  exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
    anObject(O);
    P = toPropertyKey(P);
    anObject(Attributes);
    if (typeof O === "function" && P === "prototype" && "value" in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
      var current = $getOwnPropertyDescriptor(O, P);
      if (current && current[WRITABLE]) {
        O[P] = Attributes.value;
        Attributes = {
          configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
          enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
          writable: false
        };
      }
    }
    return $defineProperty(O, P, Attributes);
  } : $defineProperty : function defineProperty(O, P, Attributes) {
    anObject(O);
    P = toPropertyKey(P);
    anObject(Attributes);
    if (IE8_DOM_DEFINE) try {
      return $defineProperty(O, P, Attributes);
    } catch (error) {
    }
    if ("get" in Attributes || "set" in Attributes) throw new $TypeError("Accessors not supported");
    if ("value" in Attributes) O[P] = Attributes.value;
    return O;
  };
}));
var require_create_non_enumerable_property = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var DESCRIPTORS = require_descriptors();
  var definePropertyModule = require_object_define_property();
  var createPropertyDescriptor = require_create_property_descriptor();
  module.exports = DESCRIPTORS ? function(object, key2, value) {
    return definePropertyModule.f(object, key2, createPropertyDescriptor(1, value));
  } : function(object, key2, value) {
    object[key2] = value;
    return object;
  };
}));
var require_export = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var globalThis2 = require_global_this();
  var apply = require_function_apply();
  var uncurryThis = require_function_uncurry_this_clause();
  var isCallable = require_is_callable();
  var getOwnPropertyDescriptor = require_object_get_own_property_descriptor().f;
  var isForced = require_is_forced();
  var path = require_path();
  var bind = require_function_bind_context();
  var createNonEnumerableProperty = require_create_non_enumerable_property();
  var hasOwn = require_has_own_property();
  require_shared_store();
  var wrapConstructor = function(NativeConstructor) {
    var Wrapper = function(a, b, c) {
      if (this instanceof Wrapper) {
        switch (arguments.length) {
          case 0:
            return new NativeConstructor();
          case 1:
            return new NativeConstructor(a);
          case 2:
            return new NativeConstructor(a, b);
        }
        return new NativeConstructor(a, b, c);
      }
      return apply(NativeConstructor, this, arguments);
    };
    Wrapper.prototype = NativeConstructor.prototype;
    return Wrapper;
  };
  module.exports = function(options, source) {
    var TARGET = options.target;
    var GLOBAL = options.global;
    var STATIC = options.stat;
    var PROTO = options.proto;
    var nativeSource = GLOBAL ? globalThis2 : STATIC ? globalThis2[TARGET] : globalThis2[TARGET] && globalThis2[TARGET].prototype;
    var target = GLOBAL ? path : path[TARGET] || createNonEnumerableProperty(path, TARGET, {})[TARGET];
    var targetPrototype = target.prototype;
    var FORCED, USE_NATIVE, VIRTUAL_PROTOTYPE;
    var key2, sourceProperty, targetProperty, nativeProperty, resultProperty, descriptor;
    for (key2 in source) {
      FORCED = isForced(GLOBAL ? key2 : TARGET + (STATIC ? "." : "#") + key2, options.forced);
      USE_NATIVE = !FORCED && nativeSource && hasOwn(nativeSource, key2);
      targetProperty = target[key2];
      if (USE_NATIVE) if (options.dontCallGetSet) {
        descriptor = getOwnPropertyDescriptor(nativeSource, key2);
        nativeProperty = descriptor && descriptor.value;
      } else nativeProperty = nativeSource[key2];
      sourceProperty = USE_NATIVE && nativeProperty ? nativeProperty : source[key2];
      if (!FORCED && !PROTO && typeof targetProperty == typeof sourceProperty) continue;
      if (options.bind && USE_NATIVE) resultProperty = bind(sourceProperty, globalThis2);
      else if (options.wrap && USE_NATIVE) resultProperty = wrapConstructor(sourceProperty);
      else if (PROTO && isCallable(sourceProperty)) resultProperty = uncurryThis(sourceProperty);
      else resultProperty = sourceProperty;
      if (options.sham || sourceProperty && sourceProperty.sham || targetProperty && targetProperty.sham) createNonEnumerableProperty(resultProperty, "sham", true);
      createNonEnumerableProperty(target, key2, resultProperty);
      if (PROTO) {
        VIRTUAL_PROTOTYPE = TARGET + "Prototype";
        if (!hasOwn(path, VIRTUAL_PROTOTYPE)) createNonEnumerableProperty(path, VIRTUAL_PROTOTYPE, {});
        createNonEnumerableProperty(path[VIRTUAL_PROTOTYPE], key2, sourceProperty);
        if (options.real && targetPrototype && (FORCED || !targetPrototype[key2])) createNonEnumerableProperty(targetPrototype, key2, sourceProperty);
      }
    }
  };
}));
var require_math_trunc = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var ceil = Math.ceil;
  var floor = Math.floor;
  module.exports = Math.trunc || function trunc(x2) {
    var n = +x2;
    return (n > 0 ? floor : ceil)(n);
  };
}));
var require_to_integer_or_infinity = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var trunc = require_math_trunc();
  module.exports = function(argument) {
    var number = +argument;
    return number !== number || number === 0 ? 0 : trunc(number);
  };
}));
var require_to_absolute_index = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var toIntegerOrInfinity = require_to_integer_or_infinity();
  var max = Math.max;
  var min = Math.min;
  module.exports = function(index, length2) {
    var integer = toIntegerOrInfinity(index);
    return integer < 0 ? max(integer + length2, 0) : min(integer, length2);
  };
}));
var require_to_length = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var toIntegerOrInfinity = require_to_integer_or_infinity();
  var min = Math.min;
  module.exports = function(argument) {
    var len = toIntegerOrInfinity(argument);
    return len > 0 ? min(len, 9007199254740991) : 0;
  };
}));
var require_length_of_array_like = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var toLength = require_to_length();
  module.exports = function(obj) {
    return toLength(obj.length);
  };
}));
var require_array_includes = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var toIndexedObject = require_to_indexed_object();
  var toAbsoluteIndex = require_to_absolute_index();
  var lengthOfArrayLike = require_length_of_array_like();
  var createMethod = function(IS_INCLUDES) {
    return function($this, el, fromIndex) {
      var O = toIndexedObject($this);
      var length2 = lengthOfArrayLike(O);
      if (length2 === 0) return !IS_INCLUDES && -1;
      var index = toAbsoluteIndex(fromIndex, length2);
      var value;
      if (IS_INCLUDES && el !== el) while (length2 > index) {
        value = O[index++];
        if (value !== value) return true;
      }
      else for (; length2 > index; index++) if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
      return !IS_INCLUDES && -1;
    };
  };
  module.exports = {
    includes: createMethod(true),
    indexOf: createMethod(false)
  };
}));
var require_add_to_unscopables = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  module.exports = function() {
  };
}));
var require_es_array_includes = /* @__PURE__ */ __commonJSMin((() => {
  var $ = require_export();
  var $includes = require_array_includes().includes;
  var fails = require_fails();
  var addToUnscopables = require_add_to_unscopables();
  var BROKEN_ON_SPARSE = fails(function() {
    return !Array(1).includes();
  });
  var BROKEN_ON_SPARSE_WITH_FROM_INDEX = fails(function() {
    return [, 1].includes(void 0, 1);
  });
  $({
    target: "Array",
    proto: true,
    forced: BROKEN_ON_SPARSE || BROKEN_ON_SPARSE_WITH_FROM_INDEX
  }, { includes: function includes(el) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : void 0);
  } });
  addToUnscopables("includes");
}));
var require_get_built_in_prototype_method = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var globalThis2 = require_global_this();
  var path = require_path();
  module.exports = function(CONSTRUCTOR, METHOD) {
    var Namespace = path[CONSTRUCTOR + "Prototype"];
    var pureMethod = Namespace && Namespace[METHOD];
    if (pureMethod) return pureMethod;
    var NativeConstructor = globalThis2[CONSTRUCTOR];
    var NativePrototype = NativeConstructor && NativeConstructor.prototype;
    return NativePrototype && NativePrototype[METHOD];
  };
}));
var require_includes$3 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  require_es_array_includes();
  var getBuiltInPrototypeMethod = require_get_built_in_prototype_method();
  module.exports = getBuiltInPrototypeMethod("Array", "includes");
}));
var require_is_regexp = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var isObject = require_is_object();
  var classof = require_classof_raw();
  var MATCH = require_well_known_symbol()("match");
  module.exports = function(it) {
    var isRegExp;
    return isObject(it) && ((isRegExp = it[MATCH]) !== void 0 ? !!isRegExp : classof(it) === "RegExp");
  };
}));
var require_not_a_regexp = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var isRegExp = require_is_regexp();
  var $TypeError = TypeError;
  module.exports = function(it) {
    if (isRegExp(it)) throw new $TypeError("The method doesn't accept regular expressions");
    return it;
  };
}));
var require_to_string_tag_support = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var TO_STRING_TAG = require_well_known_symbol()("toStringTag");
  var test = {};
  test[TO_STRING_TAG] = "z";
  module.exports = String(test) === "[object z]";
}));
var require_classof = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var TO_STRING_TAG_SUPPORT = require_to_string_tag_support();
  var isCallable = require_is_callable();
  var classofRaw = require_classof_raw();
  var TO_STRING_TAG = require_well_known_symbol()("toStringTag");
  var $Object = Object;
  var CORRECT_ARGUMENTS = classofRaw(/* @__PURE__ */ (function() {
    return arguments;
  })()) === "Arguments";
  var tryGet = function(it, key2) {
    try {
      return it[key2];
    } catch (error) {
    }
  };
  module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function(it) {
    var O, tag, result;
    return it === void 0 ? "Undefined" : it === null ? "Null" : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == "string" ? tag : CORRECT_ARGUMENTS ? classofRaw(O) : (result = classofRaw(O)) === "Object" && isCallable(O.callee) ? "Arguments" : result;
  };
}));
var require_to_string = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var classof = require_classof();
  var $String2 = String;
  module.exports = function(argument) {
    if (classof(argument) === "Symbol") throw new TypeError("Cannot convert a Symbol value to a string");
    return $String2(argument);
  };
}));
var require_correct_is_regexp_logic = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var MATCH = require_well_known_symbol()("match");
  module.exports = function(METHOD_NAME) {
    var regexp = /./;
    try {
      "/./"[METHOD_NAME](regexp);
    } catch (error1) {
      try {
        regexp[MATCH] = false;
        return "/./"[METHOD_NAME](regexp);
      } catch (error2) {
      }
    }
    return false;
  };
}));
var require_es_string_includes = /* @__PURE__ */ __commonJSMin((() => {
  var $ = require_export();
  var uncurryThis = require_function_uncurry_this();
  var notARegExp = require_not_a_regexp();
  var requireObjectCoercible = require_require_object_coercible();
  var toString2 = require_to_string();
  var correctIsRegExpLogic = require_correct_is_regexp_logic();
  var stringIndexOf = uncurryThis("".indexOf);
  $({
    target: "String",
    proto: true,
    forced: !correctIsRegExpLogic("includes")
  }, { includes: function includes(searchString) {
    return !!~stringIndexOf(toString2(requireObjectCoercible(this)), toString2(notARegExp(searchString)), arguments.length > 1 ? arguments[1] : void 0);
  } });
}));
var require_includes$2 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  require_es_string_includes();
  var getBuiltInPrototypeMethod = require_get_built_in_prototype_method();
  module.exports = getBuiltInPrototypeMethod("String", "includes");
}));
var require_includes$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var isPrototypeOf = require_object_is_prototype_of();
  var arrayMethod = require_includes$3();
  var stringMethod = require_includes$2();
  var ArrayPrototype = Array.prototype;
  var StringPrototype = String.prototype;
  module.exports = function(it) {
    var own = it.includes;
    if (it === ArrayPrototype || isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.includes) return arrayMethod;
    if (typeof it == "string" || it === StringPrototype || isPrototypeOf(StringPrototype, it) && own === StringPrototype.includes) return stringMethod;
    return own;
  };
}));
var require_includes = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var parent = require_includes$1();
  module.exports = parent;
}));
var import_includes = /* @__PURE__ */ __toESM2(require_includes(), 1);
function map(array2, block) {
  let i;
  const il = array2.length;
  const result = [];
  for (i = 0; i < il; i++) result.push(block(array2[i]));
  return result;
}
function filter3(array2, block) {
  let i;
  const il = array2.length;
  const result = [];
  for (i = 0; i < il; i++) if (block(array2[i])) result.push(array2[i]);
  return result;
}
function radians(d) {
  return d % 360 * Math.PI / 180;
}
function unCamelCase(s) {
  return s.replace(/([A-Z])/g, function(m, g) {
    return "-" + g.toLowerCase();
  });
}
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function proportionalSize(element, width2, height2, box) {
  if (width2 == null || height2 == null) {
    box = box || element.bbox();
    if (width2 == null) width2 = box.width / box.height * height2;
    else if (height2 == null) height2 = box.height / box.width * width2;
  }
  return {
    width: width2,
    height: height2
  };
}
function getOrigin(o, element) {
  const origin = o.origin;
  let ox = o.ox != null ? o.ox : o.originX != null ? o.originX : "center";
  let oy = o.oy != null ? o.oy : o.originY != null ? o.originY : "center";
  if (origin != null) [ox, oy] = Array.isArray(origin) ? origin : typeof origin === "object" ? [origin.x, origin.y] : [origin, origin];
  const condX = typeof ox === "string";
  const condY = typeof oy === "string";
  if (condX || condY) {
    const { height: height2, width: width2, x: x2, y: y2 } = element.bbox();
    if (condX) ox = (0, import_includes.default)(ox).call(ox, "left") ? x2 : (0, import_includes.default)(ox).call(ox, "right") ? x2 + width2 : x2 + width2 / 2;
    if (condY) oy = (0, import_includes.default)(oy).call(oy, "top") ? y2 : (0, import_includes.default)(oy).call(oy, "bottom") ? y2 + height2 : y2 + height2 / 2;
  }
  return [ox, oy];
}
var descriptiveElements = /* @__PURE__ */ new Set([
  "desc",
  "metadata",
  "title"
]);
var isDescriptive = (element) => descriptiveElements.has(element.nodeName);
var writeDataToDom = (element, data2, defaults = {}) => {
  const cloned = { ...data2 };
  for (const key2 in cloned) if (cloned[key2].valueOf() === defaults[key2]) delete cloned[key2];
  if (Object.keys(cloned).length) element.node.setAttribute("data-svgjs", JSON.stringify(cloned));
  else {
    element.node.removeAttribute("data-svgjs");
    element.node.removeAttribute("svgjs:data");
  }
};
var svg = "http://www.w3.org/2000/svg";
var html = "http://www.w3.org/1999/xhtml";
var xmlns = "http://www.w3.org/2000/xmlns/";
var xlink = "http://www.w3.org/1999/xlink";
var globals = {
  window: typeof window === "undefined" ? null : window,
  document: typeof document === "undefined" ? null : document
};
function getWindow() {
  return globals.window;
}
var Base = class {
};
var elements = {};
var root = "___SYMBOL___ROOT___";
function create3(name, ns = svg) {
  return globals.document.createElementNS(ns, name);
}
function makeInstance(element, isHTML = false) {
  if (element instanceof Base) return element;
  if (typeof element === "object") return adopter(element);
  if (element == null) return new elements[root]();
  if (typeof element === "string" && element.trim().charAt(0) !== "<") return adopter(globals.document.querySelector(element));
  const wrapper = isHTML ? globals.document.createElement("div") : create3("svg");
  wrapper.innerHTML = element.trim();
  element = adopter(wrapper.firstElementChild);
  wrapper.removeChild(wrapper.firstElementChild);
  return element;
}
function nodeOrNew(name, node) {
  return node && (node instanceof globals.window.Node || node.ownerDocument && node instanceof node.ownerDocument.defaultView.Node) ? node : create3(name);
}
function adopt(node) {
  if (!node) return null;
  if (node.instance instanceof Base) return node.instance;
  if (node.nodeName === "#document-fragment") return new elements.Fragment(node);
  let className = capitalize(node.nodeName || "Dom");
  if (className === "LinearGradient" || className === "RadialGradient") className = "Gradient";
  else if (!elements[className]) className = "Dom";
  return new elements[className](node);
}
var adopter = adopt;
function register(element, name = element.name, asRoot = false) {
  elements[name] = element;
  if (asRoot) elements[root] = element;
  addMethodNames(Object.getOwnPropertyNames(element.prototype));
  return element;
}
function getClass(name) {
  return elements[name];
}
var did = 1e3;
function eid(name) {
  return "Svgjs" + capitalize(name) + did++;
}
function assignNewId(node) {
  for (let i = node.children.length - 1; i >= 0; i--) assignNewId(node.children[i]);
  if (node.id) {
    node.id = eid(node.nodeName);
    return node;
  }
  return node;
}
function extend(modules, methods2) {
  let key2, i;
  modules = Array.isArray(modules) ? modules : [modules];
  for (i = modules.length - 1; i >= 0; i--) for (key2 in methods2) modules[i].prototype[key2] = methods2[key2];
}
function wrapWithAttrCheck(fn) {
  return function(...args) {
    const o = args[args.length - 1];
    if (o && o.constructor === Object && !(o instanceof Array)) return fn.apply(this, args.slice(0, -1)).attr(o);
    else return fn.apply(this, args);
  };
}
function siblings() {
  return this.parent().children();
}
function position() {
  return this.parent().index(this);
}
function next() {
  return this.siblings()[this.position() + 1];
}
function prev() {
  return this.siblings()[this.position() - 1];
}
function forward() {
  const i = this.position();
  this.parent().add(this.remove(), i + 1);
  return this;
}
function backward() {
  const i = this.position();
  this.parent().add(this.remove(), i ? i - 1 : 0);
  return this;
}
function front() {
  this.parent().add(this.remove());
  return this;
}
function back() {
  this.parent().add(this.remove(), 0);
  return this;
}
function before2(element) {
  element = makeInstance(element);
  element.remove();
  const i = this.position();
  this.parent().add(element, i);
  return this;
}
function after2(element) {
  element = makeInstance(element);
  element.remove();
  const i = this.position();
  this.parent().add(element, i + 1);
  return this;
}
function insertBefore(element) {
  element = makeInstance(element);
  element.before(this);
  return this;
}
function insertAfter(element) {
  element = makeInstance(element);
  element.after(this);
  return this;
}
registerMethods("Dom", {
  siblings,
  position,
  next,
  prev,
  forward,
  backward,
  front,
  back,
  before: before2,
  after: after2,
  insertBefore,
  insertAfter
});
var numberAndUnit = /^([+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?)([a-z%]*)$/i;
var hex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
var rgb = /rgb\((\d+),(\d+),(\d+)\)/;
var reference = /^(#[^\s]+)$/;
var transforms = /\)\s*,?\s*/;
var whitespace2 = /\s/g;
var isHex = /^#[a-f0-9]{3}$|^#[a-f0-9]{6}$/i;
var isRgb = /^rgb\(/;
var isBlank = /^(\s+)?$/;
var isNumber3 = /^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;
var isImage = /\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i;
var delimiter = /[\s,]+/;
var isPathLetter = /[MLHVCSQTAZ]/i;
function classes() {
  const attr2 = this.attr("class");
  return attr2 == null ? [] : attr2.trim().split(delimiter);
}
function hasClass(name) {
  return this.classes().indexOf(name) !== -1;
}
function addClass(name) {
  if (!this.hasClass(name)) {
    const array2 = this.classes();
    array2.push(name);
    this.attr("class", array2.join(" "));
  }
  return this;
}
function removeClass(name) {
  if (this.hasClass(name)) this.attr("class", this.classes().filter(function(c) {
    return c !== name;
  }).join(" "));
  return this;
}
function toggleClass(name) {
  return this.hasClass(name) ? this.removeClass(name) : this.addClass(name);
}
registerMethods("Dom", {
  classes,
  hasClass,
  addClass,
  removeClass,
  toggleClass
});
var cssName = (name) => name.startsWith("--") ? name : unCamelCase(name);
function css(style, val) {
  const ret = {};
  if (arguments.length === 0) {
    const declaration = this.node.style;
    for (let i = 0; i < declaration.length; i++) {
      const name = declaration.item(i);
      const value = declaration.getPropertyValue(name);
      const priority = declaration.getPropertyPriority(name);
      ret[name] = priority ? `${value} !${priority}` : value;
    }
    return ret;
  }
  if (arguments.length < 2) {
    if (Array.isArray(style)) {
      for (const name of style) {
        const cased = cssName(name);
        ret[name] = this.node.style.getPropertyValue(cased);
      }
      return ret;
    }
    if (typeof style === "string") return this.node.style.getPropertyValue(cssName(style));
    if (typeof style === "object") for (const name in style) this.node.style.setProperty(cssName(name), style[name] == null || isBlank.test(style[name]) ? "" : style[name]);
  }
  if (arguments.length === 2) this.node.style.setProperty(cssName(style), val == null || isBlank.test(val) ? "" : val);
  return this;
}
function show() {
  return this.css("display", "");
}
function hide() {
  return this.css("display", "none");
}
function visible() {
  return this.css("display") !== "none";
}
registerMethods("Dom", {
  css,
  show,
  hide,
  visible
});
function data(a, v, r) {
  if (a == null) return this.data(map(filter3(this.node.attributes, (el) => el.nodeName.indexOf("data-") === 0), (el) => el.nodeName.slice(5)));
  else if (a instanceof Array) {
    const data2 = {};
    for (const key2 of a) data2[key2] = this.data(key2);
    return data2;
  } else if (typeof a === "object") for (v in a) this.data(v, a[v]);
  else if (arguments.length < 2) try {
    return JSON.parse(this.attr("data-" + a));
  } catch (e) {
    return this.attr("data-" + a);
  }
  else this.attr("data-" + a, v === null ? null : r === true || typeof v === "string" || typeof v === "number" ? v : JSON.stringify(v));
  return this;
}
registerMethods("Dom", { data });
function remember(k, v) {
  if (typeof arguments[0] === "object") for (const key2 in k) this.remember(key2, k[key2]);
  else if (arguments.length === 1) return this.memory()[k];
  else this.memory()[k] = v;
  return this;
}
function forget() {
  if (arguments.length === 0) this._memory = {};
  else for (let i = arguments.length - 1; i >= 0; i--) delete this.memory()[arguments[i]];
  return this;
}
function memory() {
  return this._memory = this._memory || {};
}
registerMethods("Dom", {
  remember,
  forget,
  memory
});
function sixDigitHex(hex2) {
  return hex2.length === 4 ? [
    "#",
    hex2.substring(1, 2),
    hex2.substring(1, 2),
    hex2.substring(2, 3),
    hex2.substring(2, 3),
    hex2.substring(3, 4),
    hex2.substring(3, 4)
  ].join("") : hex2;
}
function componentHex(component) {
  const hex2 = Math.max(0, Math.min(255, Math.round(component))).toString(16);
  return hex2.length === 1 ? "0" + hex2 : hex2;
}
function is3(object, space) {
  for (let i = space.length; i--; ) if (object[space[i]] == null) return false;
  return true;
}
function getParameters(a, b) {
  const params = is3(a, "rgb") ? {
    _a: a.r,
    _b: a.g,
    _c: a.b,
    _d: 0,
    space: "rgb"
  } : is3(a, "xyz") ? {
    _a: a.x,
    _b: a.y,
    _c: a.z,
    _d: 0,
    space: "xyz"
  } : is3(a, "hsl") ? {
    _a: a.h,
    _b: a.s,
    _c: a.l,
    _d: 0,
    space: "hsl"
  } : is3(a, "lab") ? {
    _a: a.l,
    _b: a.a,
    _c: a.b,
    _d: 0,
    space: "lab"
  } : is3(a, "lch") ? {
    _a: a.l,
    _b: a.c,
    _c: a.h,
    _d: 0,
    space: "lch"
  } : is3(a, "cmyk") ? {
    _a: a.c,
    _b: a.m,
    _c: a.y,
    _d: a.k,
    space: "cmyk"
  } : {
    _a: 0,
    _b: 0,
    _c: 0,
    space: "rgb"
  };
  params.space = b || params.space;
  return params;
}
function cieSpace(space) {
  if (space === "lab" || space === "xyz" || space === "lch") return true;
  else return false;
}
function hueToRgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}
var Color = class Color2 {
  constructor(...inputs) {
    this.init(...inputs);
  }
  static isColor(color) {
    return color && (color instanceof Color2 || this.isRgb(color) || this.test(color));
  }
  static isRgb(color) {
    return color && typeof color.r === "number" && typeof color.g === "number" && typeof color.b === "number";
  }
  static random(mode = "vibrant", t) {
    const { random, round, sin, PI: pi } = Math;
    if (mode === "vibrant") {
      const l = 24 * random() + 57;
      const c = 38 * random() + 45;
      const h = 360 * random();
      return new Color2(l, c, h, "lch");
    } else if (mode === "sine") {
      t = t == null ? random() : t;
      const r = round(80 * sin(2 * pi * t / 0.5 + 0.01) + 150);
      const g = round(50 * sin(2 * pi * t / 0.5 + 4.6) + 200);
      const b = round(100 * sin(2 * pi * t / 0.5 + 2.3) + 150);
      return new Color2(r, g, b);
    } else if (mode === "pastel") {
      const l = 8 * random() + 86;
      const c = 17 * random() + 9;
      const h = 360 * random();
      return new Color2(l, c, h, "lch");
    } else if (mode === "dark") {
      const l = 10 + 10 * random();
      const c = 50 * random() + 86;
      const h = 360 * random();
      return new Color2(l, c, h, "lch");
    } else if (mode === "rgb") {
      const r = 255 * random();
      const g = 255 * random();
      const b = 255 * random();
      return new Color2(r, g, b);
    } else if (mode === "lab") {
      const l = 100 * random();
      const a = 256 * random() - 128;
      const b = 256 * random() - 128;
      return new Color2(l, a, b, "lab");
    } else if (mode === "grey") {
      const grey = 255 * random();
      return new Color2(grey, grey, grey);
    } else throw new Error("Unsupported random color mode");
  }
  static test(color) {
    return typeof color === "string" && (isHex.test(color) || isRgb.test(color));
  }
  cmyk() {
    const { _a: _a3, _b, _c } = this.rgb();
    const [r, g, b] = [
      _a3,
      _b,
      _c
    ].map((v) => v / 255);
    const k = Math.min(1 - r, 1 - g, 1 - b);
    if (k === 1) return new Color2(0, 0, 0, 1, "cmyk");
    const c = (1 - r - k) / (1 - k);
    const m = (1 - g - k) / (1 - k);
    const y2 = (1 - b - k) / (1 - k);
    return new Color2(c, m, y2, k, "cmyk");
  }
  hsl() {
    const { _a: _a3, _b, _c } = this.rgb();
    const [r, g, b] = [
      _a3,
      _b,
      _c
    ].map((v) => v / 255);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    const isGrey = max === min;
    const delta = max - min;
    const s = isGrey ? 0 : l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    const h = isGrey ? 0 : max === r ? ((g - b) / delta + (g < b ? 6 : 0)) / 6 : max === g ? ((b - r) / delta + 2) / 6 : max === b ? ((r - g) / delta + 4) / 6 : 0;
    return new Color2(360 * h, 100 * s, 100 * l, "hsl");
  }
  init(a = 0, b = 0, c = 0, d = 0, space = "rgb") {
    a = !a ? 0 : a;
    if (this.space) for (const component in this.space) delete this[this.space[component]];
    if (typeof a === "number") {
      space = typeof d === "string" ? d : space;
      d = typeof d === "string" ? 0 : d;
      Object.assign(this, {
        _a: a,
        _b: b,
        _c: c,
        _d: d,
        space
      });
    } else if (a instanceof Array) {
      this.space = b || (typeof a[3] === "string" ? a[3] : a[4]) || "rgb";
      Object.assign(this, {
        _a: a[0],
        _b: a[1],
        _c: a[2],
        _d: a[3] || 0
      });
    } else if (a instanceof Object) {
      const values = getParameters(a, b);
      Object.assign(this, values);
    } else if (typeof a === "string") if (isRgb.test(a)) {
      const noWhitespace = a.replace(whitespace2, "");
      const [_a4, _b2, _c2] = rgb.exec(noWhitespace).slice(1, 4).map((v) => parseInt(v));
      Object.assign(this, {
        _a: _a4,
        _b: _b2,
        _c: _c2,
        _d: 0,
        space: "rgb"
      });
    } else if (isHex.test(a)) {
      const hexParse = (v) => parseInt(v, 16);
      const [, _a4, _b2, _c2] = hex.exec(sixDigitHex(a)).map(hexParse);
      Object.assign(this, {
        _a: _a4,
        _b: _b2,
        _c: _c2,
        _d: 0,
        space: "rgb"
      });
    } else throw Error("Unsupported string format, can't construct Color");
    const { _a: _a3, _b, _c, _d } = this;
    const components = this.space === "rgb" ? {
      r: _a3,
      g: _b,
      b: _c
    } : this.space === "xyz" ? {
      x: _a3,
      y: _b,
      z: _c
    } : this.space === "hsl" ? {
      h: _a3,
      s: _b,
      l: _c
    } : this.space === "lab" ? {
      l: _a3,
      a: _b,
      b: _c
    } : this.space === "lch" ? {
      l: _a3,
      c: _b,
      h: _c
    } : this.space === "cmyk" ? {
      c: _a3,
      m: _b,
      y: _c,
      k: _d
    } : {};
    Object.assign(this, components);
  }
  lab() {
    const { x: x2, y: y2, z } = this.xyz();
    const l = 116 * y2 - 16;
    const a = 500 * (x2 - y2);
    const b = 200 * (y2 - z);
    return new Color2(l, a, b, "lab");
  }
  lch() {
    const { l, a, b } = this.lab();
    const c = Math.sqrt(a ** 2 + b ** 2);
    let h = 180 * Math.atan2(b, a) / Math.PI;
    if (h < 0) {
      h *= -1;
      h = 360 - h;
    }
    return new Color2(l, c, h, "lch");
  }
  rgb() {
    if (this.space === "rgb") return this;
    else if (cieSpace(this.space)) {
      let { x: x2, y: y2, z } = this;
      if (this.space === "lab" || this.space === "lch") {
        let { l, a, b: b2 } = this;
        if (this.space === "lch") {
          const { c, h } = this;
          const dToR = Math.PI / 180;
          a = c * Math.cos(dToR * h);
          b2 = c * Math.sin(dToR * h);
        }
        const yL = (l + 16) / 116;
        const xL = a / 500 + yL;
        const zL = yL - b2 / 200;
        const ct = 16 / 116;
        const mx = 8856e-6;
        const nm = 7.787;
        x2 = 0.95047 * (xL ** 3 > mx ? xL ** 3 : (xL - ct) / nm);
        y2 = 1 * (yL ** 3 > mx ? yL ** 3 : (yL - ct) / nm);
        z = 1.08883 * (zL ** 3 > mx ? zL ** 3 : (zL - ct) / nm);
      }
      const rU = x2 * 3.2406 + y2 * -1.5372 + z * -0.4986;
      const gU = x2 * -0.9689 + y2 * 1.8758 + z * 0.0415;
      const bU = x2 * 0.0557 + y2 * -0.204 + z * 1.057;
      const pow = Math.pow;
      const bd = 31308e-7;
      const r = rU > bd ? 1.055 * pow(rU, 1 / 2.4) - 0.055 : 12.92 * rU;
      const g = gU > bd ? 1.055 * pow(gU, 1 / 2.4) - 0.055 : 12.92 * gU;
      const b = bU > bd ? 1.055 * pow(bU, 1 / 2.4) - 0.055 : 12.92 * bU;
      return new Color2(255 * r, 255 * g, 255 * b);
    } else if (this.space === "hsl") {
      let { h, s, l } = this;
      h /= 360;
      s /= 100;
      l /= 100;
      if (s === 0) {
        l *= 255;
        return new Color2(l, l, l);
      }
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      const r = 255 * hueToRgb(p, q, h + 1 / 3);
      const g = 255 * hueToRgb(p, q, h);
      const b = 255 * hueToRgb(p, q, h - 1 / 3);
      return new Color2(r, g, b);
    } else if (this.space === "cmyk") {
      const { c, m, y: y2, k } = this;
      const r = 255 * (1 - Math.min(1, c * (1 - k) + k));
      const g = 255 * (1 - Math.min(1, m * (1 - k) + k));
      const b = 255 * (1 - Math.min(1, y2 * (1 - k) + k));
      return new Color2(r, g, b);
    } else return this;
  }
  toArray() {
    const { _a: _a3, _b, _c, _d, space } = this;
    return [
      _a3,
      _b,
      _c,
      _d,
      space
    ];
  }
  toHex() {
    const [r, g, b] = this._clamped().map(componentHex);
    return `#${r}${g}${b}`;
  }
  toRgb() {
    const [rV, gV, bV] = this._clamped();
    return `rgb(${rV},${gV},${bV})`;
  }
  toString() {
    return this.toHex();
  }
  xyz() {
    const { _a: r255, _b: g255, _c: b255 } = this.rgb();
    const [r, g, b] = [
      r255,
      g255,
      b255
    ].map((v) => v / 255);
    const rL = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    const gL = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    const bL = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    const xU = (rL * 0.4124 + gL * 0.3576 + bL * 0.1805) / 0.95047;
    const yU = (rL * 0.2126 + gL * 0.7152 + bL * 0.0722) / 1;
    const zU = (rL * 0.0193 + gL * 0.1192 + bL * 0.9505) / 1.08883;
    const x2 = xU > 8856e-6 ? Math.pow(xU, 1 / 3) : 7.787 * xU + 16 / 116;
    const y2 = yU > 8856e-6 ? Math.pow(yU, 1 / 3) : 7.787 * yU + 16 / 116;
    const z = zU > 8856e-6 ? Math.pow(zU, 1 / 3) : 7.787 * zU + 16 / 116;
    return new Color2(x2, y2, z, "xyz");
  }
  _clamped() {
    const { _a: _a3, _b, _c } = this.rgb();
    const { max, min, round } = Math;
    const format = (v) => max(0, min(round(v), 255));
    return [
      _a3,
      _b,
      _c
    ].map(format);
  }
};
var Point = class Point2 {
  constructor(...args) {
    this.init(...args);
  }
  clone() {
    return new Point2(this);
  }
  init(x2, y2) {
    const base = {
      x: 0,
      y: 0
    };
    const source = Array.isArray(x2) ? {
      x: x2[0],
      y: x2[1]
    } : typeof x2 === "object" ? {
      x: x2.x,
      y: x2.y
    } : {
      x: x2,
      y: y2
    };
    this.x = source.x == null ? base.x : source.x;
    this.y = source.y == null ? base.y : source.y;
    return this;
  }
  toArray() {
    return [this.x, this.y];
  }
  transform(m) {
    return this.clone().transformO(m);
  }
  transformO(m) {
    if (!Matrix.isMatrixLike(m)) m = new Matrix(m);
    const { x: x2, y: y2 } = this;
    this.x = m.a * x2 + m.c * y2 + m.e;
    this.y = m.b * x2 + m.d * y2 + m.f;
    return this;
  }
};
function point(x2, y2) {
  return new Point(x2, y2).transformO(this.screenCTM().inverseO());
}
function closeEnough(a, b, threshold2) {
  return Math.abs(b - a) < (threshold2 || 1e-6);
}
var Matrix = class Matrix2 {
  constructor(...args) {
    this.init(...args);
  }
  static formatTransforms(o) {
    const flipBoth = o.flip === "both" || o.flip === true;
    const flipX = o.flip && (flipBoth || o.flip === "x") ? -1 : 1;
    const flipY = o.flip && (flipBoth || o.flip === "y") ? -1 : 1;
    const skewX = o.skew && o.skew.length ? o.skew[0] : isFinite(o.skew) ? o.skew : isFinite(o.skewX) ? o.skewX : 0;
    const skewY = o.skew && o.skew.length ? o.skew[1] : isFinite(o.skew) ? o.skew : isFinite(o.skewY) ? o.skewY : 0;
    const scaleX = o.scale && o.scale.length ? o.scale[0] * flipX : isFinite(o.scale) ? o.scale * flipX : isFinite(o.scaleX) ? o.scaleX * flipX : flipX;
    const scaleY = o.scale && o.scale.length ? o.scale[1] * flipY : isFinite(o.scale) ? o.scale * flipY : isFinite(o.scaleY) ? o.scaleY * flipY : flipY;
    const shear = o.shear || 0;
    const theta = o.rotate || o.theta || 0;
    const origin = new Point(o.origin || o.around || o.ox || o.originX, o.oy || o.originY);
    const ox = origin.x;
    const oy = origin.y;
    const position2 = new Point(o.position ?? o.px ?? o.positionX ?? NaN, o.py ?? o.positionY ?? NaN);
    const px = position2.x;
    const py = position2.y;
    const translate = new Point(o.translate || o.tx || o.translateX, o.ty || o.translateY);
    const tx = translate.x;
    const ty = translate.y;
    const relative = new Point(o.relative || o.rx || o.relativeX, o.ry || o.relativeY);
    return {
      scaleX,
      scaleY,
      skewX,
      skewY,
      shear,
      theta,
      rx: relative.x,
      ry: relative.y,
      tx,
      ty,
      ox,
      oy,
      px,
      py
    };
  }
  static fromArray(a) {
    return {
      a: a[0],
      b: a[1],
      c: a[2],
      d: a[3],
      e: a[4],
      f: a[5]
    };
  }
  static isMatrixLike(o) {
    return o.a != null || o.b != null || o.c != null || o.d != null || o.e != null || o.f != null;
  }
  static matrixMultiply(l, r, o) {
    const a = l.a * r.a + l.c * r.b;
    const b = l.b * r.a + l.d * r.b;
    const c = l.a * r.c + l.c * r.d;
    const d = l.b * r.c + l.d * r.d;
    const e = l.e + l.a * r.e + l.c * r.f;
    const f = l.f + l.b * r.e + l.d * r.f;
    o.a = a;
    o.b = b;
    o.c = c;
    o.d = d;
    o.e = e;
    o.f = f;
    return o;
  }
  around(cx2, cy2, matrix) {
    return this.clone().aroundO(cx2, cy2, matrix);
  }
  aroundO(cx2, cy2, matrix) {
    const dx2 = cx2 || 0;
    const dy2 = cy2 || 0;
    return this.translateO(-dx2, -dy2).lmultiplyO(matrix).translateO(dx2, dy2);
  }
  clone() {
    return new Matrix2(this);
  }
  decompose(cx2 = 0, cy2 = 0) {
    const a = this.a;
    const b = this.b;
    const c = this.c;
    const d = this.d;
    const e = this.e;
    const f = this.f;
    const determinant = a * d - b * c;
    const ccw = determinant > 0 ? 1 : -1;
    const sx = ccw * Math.sqrt(a * a + b * b);
    const thetaRad = Math.atan2(ccw * b, ccw * a);
    const theta = 180 / Math.PI * thetaRad;
    const lam = (a * c + b * d) / determinant;
    return {
      scaleX: sx,
      scaleY: c * sx / (lam * a - b) || d * sx / (lam * b + a),
      shear: lam,
      rotate: theta,
      translateX: e - cx2 + cx2 * a + cy2 * c,
      translateY: f - cy2 + cx2 * b + cy2 * d,
      originX: cx2,
      originY: cy2,
      a: this.a,
      b: this.b,
      c: this.c,
      d: this.d,
      e: this.e,
      f: this.f
    };
  }
  equals(other) {
    if (other === this) return true;
    const comp = new Matrix2(other);
    return closeEnough(this.a, comp.a) && closeEnough(this.b, comp.b) && closeEnough(this.c, comp.c) && closeEnough(this.d, comp.d) && closeEnough(this.e, comp.e) && closeEnough(this.f, comp.f);
  }
  flip(axis, around) {
    return this.clone().flipO(axis, around);
  }
  flipO(axis, around) {
    return axis === "x" ? this.scaleO(-1, 1, around, 0) : axis === "y" ? this.scaleO(1, -1, 0, around) : this.scaleO(-1, -1, axis, around || axis);
  }
  init(source) {
    const base = Matrix2.fromArray([
      1,
      0,
      0,
      1,
      0,
      0
    ]);
    source = source instanceof Element4 ? source.matrixify() : typeof source === "string" ? Matrix2.fromArray(source.split(delimiter).map(parseFloat)) : Array.isArray(source) ? Matrix2.fromArray(source) : typeof source === "object" && Matrix2.isMatrixLike(source) ? source : typeof source === "object" ? new Matrix2().transform(source) : arguments.length === 6 ? Matrix2.fromArray([].slice.call(arguments)) : base;
    this.a = source.a != null ? source.a : base.a;
    this.b = source.b != null ? source.b : base.b;
    this.c = source.c != null ? source.c : base.c;
    this.d = source.d != null ? source.d : base.d;
    this.e = source.e != null ? source.e : base.e;
    this.f = source.f != null ? source.f : base.f;
    return this;
  }
  inverse() {
    return this.clone().inverseO();
  }
  inverseO() {
    const a = this.a;
    const b = this.b;
    const c = this.c;
    const d = this.d;
    const e = this.e;
    const f = this.f;
    const det = a * d - b * c;
    if (!det) throw new Error("Cannot invert " + this);
    const na = d / det;
    const nb = -b / det;
    const nc = -c / det;
    const nd = a / det;
    const ne = -(na * e + nc * f);
    const nf = -(nb * e + nd * f);
    this.a = na;
    this.b = nb;
    this.c = nc;
    this.d = nd;
    this.e = ne;
    this.f = nf;
    return this;
  }
  lmultiply(matrix) {
    return this.clone().lmultiplyO(matrix);
  }
  lmultiplyO(matrix) {
    const r = this;
    const l = matrix instanceof Matrix2 ? matrix : new Matrix2(matrix);
    return Matrix2.matrixMultiply(l, r, this);
  }
  multiply(matrix) {
    return this.clone().multiplyO(matrix);
  }
  multiplyO(matrix) {
    const l = this;
    const r = matrix instanceof Matrix2 ? matrix : new Matrix2(matrix);
    return Matrix2.matrixMultiply(l, r, this);
  }
  rotate(r, cx2, cy2) {
    return this.clone().rotateO(r, cx2, cy2);
  }
  rotateO(r, cx2 = 0, cy2 = 0) {
    r = radians(r);
    const cos = Math.cos(r);
    const sin = Math.sin(r);
    const { a, b, c, d, e, f } = this;
    this.a = a * cos - b * sin;
    this.b = b * cos + a * sin;
    this.c = c * cos - d * sin;
    this.d = d * cos + c * sin;
    this.e = e * cos - f * sin + cy2 * sin - cx2 * cos + cx2;
    this.f = f * cos + e * sin - cx2 * sin - cy2 * cos + cy2;
    return this;
  }
  scale() {
    return this.clone().scaleO(...arguments);
  }
  scaleO(x2, y2 = x2, cx2 = 0, cy2 = 0) {
    if (arguments.length === 3) {
      cy2 = cx2;
      cx2 = y2;
      y2 = x2;
    }
    const { a, b, c, d, e, f } = this;
    this.a = a * x2;
    this.b = b * y2;
    this.c = c * x2;
    this.d = d * y2;
    this.e = e * x2 - cx2 * x2 + cx2;
    this.f = f * y2 - cy2 * y2 + cy2;
    return this;
  }
  shear(a, cx2, cy2) {
    return this.clone().shearO(a, cx2, cy2);
  }
  shearO(lx, cx2 = 0, cy2 = 0) {
    const { a, b, c, d, e, f } = this;
    this.a = a + b * lx;
    this.c = c + d * lx;
    this.e = e + f * lx - cy2 * lx;
    return this;
  }
  skew() {
    return this.clone().skewO(...arguments);
  }
  skewO(x2, y2 = x2, cx2 = 0, cy2 = 0) {
    if (arguments.length === 3) {
      cy2 = cx2;
      cx2 = y2;
      y2 = x2;
    }
    x2 = radians(x2);
    y2 = radians(y2);
    const lx = Math.tan(x2);
    const ly = Math.tan(y2);
    const { a, b, c, d, e, f } = this;
    this.a = a + b * lx;
    this.b = b + a * ly;
    this.c = c + d * lx;
    this.d = d + c * ly;
    this.e = e + f * lx - cy2 * lx;
    this.f = f + e * ly - cx2 * ly;
    return this;
  }
  skewX(x2, cx2, cy2) {
    return this.skew(x2, 0, cx2, cy2);
  }
  skewY(y2, cx2, cy2) {
    return this.skew(0, y2, cx2, cy2);
  }
  toArray() {
    return [
      this.a,
      this.b,
      this.c,
      this.d,
      this.e,
      this.f
    ];
  }
  toString() {
    return "matrix(" + this.a + "," + this.b + "," + this.c + "," + this.d + "," + this.e + "," + this.f + ")";
  }
  transform(o) {
    if (Matrix2.isMatrixLike(o)) return new Matrix2(o).multiplyO(this);
    const t = Matrix2.formatTransforms(o);
    const current = this;
    const { x: ox, y: oy } = new Point(t.ox, t.oy).transform(current);
    const transformer = new Matrix2().translateO(t.rx, t.ry).lmultiplyO(current).translateO(-ox, -oy).scaleO(t.scaleX, t.scaleY).skewO(t.skewX, t.skewY).shearO(t.shear).rotateO(t.theta).translateO(ox, oy);
    if (isFinite(t.px) || isFinite(t.py)) {
      const origin = new Point(ox, oy).transform(transformer);
      const dx2 = isFinite(t.px) ? t.px - origin.x : 0;
      const dy2 = isFinite(t.py) ? t.py - origin.y : 0;
      transformer.translateO(dx2, dy2);
    }
    transformer.translateO(t.tx, t.ty);
    return transformer;
  }
  translate(x2, y2) {
    return this.clone().translateO(x2, y2);
  }
  translateO(x2, y2) {
    this.e += x2 || 0;
    this.f += y2 || 0;
    return this;
  }
  valueOf() {
    return {
      a: this.a,
      b: this.b,
      c: this.c,
      d: this.d,
      e: this.e,
      f: this.f
    };
  }
};
function ctm() {
  return new Matrix(this.node.getCTM());
}
function screenCTM() {
  try {
    if (typeof this.isRoot === "function" && !this.isRoot()) {
      const rect = this.rect(1, 1);
      const m = rect.node.getScreenCTM();
      rect.remove();
      return new Matrix(m);
    }
    return new Matrix(this.node.getScreenCTM());
  } catch (e) {
    console.warn(`Cannot get CTM from SVG node ${this.node.nodeName}. Is the element rendered?`);
    return new Matrix();
  }
}
register(Matrix, "Matrix");
function parser() {
  if (!parser.nodes || parser.nodes.svg.node.ownerDocument !== globals.document) {
    const svg2 = makeInstance().size(2, 0);
    svg2.node.style.cssText = [
      "opacity: 0",
      "position: absolute",
      "left: -100%",
      "top: -100%",
      "overflow: hidden"
    ].join(";");
    svg2.attr("focusable", "false");
    svg2.attr("aria-hidden", "true");
    parser.nodes = {
      svg: svg2,
      path: svg2.path().node
    };
  }
  if (!parser.nodes.svg.node.parentNode) parser.nodes.svg.addTo(globals.document.body || globals.document.documentElement);
  return parser.nodes;
}
function isNulledBox(box) {
  return !box.width && !box.height && !box.x && !box.y;
}
function domContains(node) {
  return node === globals.document || (globals.document.documentElement.contains || function(node2) {
    while (node2.parentNode) node2 = node2.parentNode;
    return node2 === globals.document;
  }).call(globals.document.documentElement, node);
}
var Box = class Box2 {
  constructor(...args) {
    this.init(...args);
  }
  addOffset() {
    this.x += globals.window.pageXOffset;
    this.y += globals.window.pageYOffset;
    return new Box2(this);
  }
  init(source) {
    source = typeof source === "string" ? source.split(delimiter).map(parseFloat) : Array.isArray(source) ? source : typeof source === "object" ? [
      source.left != null ? source.left : source.x,
      source.top != null ? source.top : source.y,
      source.width,
      source.height
    ] : arguments.length === 4 ? [].slice.call(arguments) : [
      0,
      0,
      0,
      0
    ];
    this.x = source[0] || 0;
    this.y = source[1] || 0;
    this.width = this.w = source[2] || 0;
    this.height = this.h = source[3] || 0;
    this.x2 = this.x + this.w;
    this.y2 = this.y + this.h;
    this.cx = this.x + this.w / 2;
    this.cy = this.y + this.h / 2;
    return this;
  }
  isNulled() {
    return isNulledBox(this);
  }
  merge(box) {
    const x2 = Math.min(this.x, box.x);
    const y2 = Math.min(this.y, box.y);
    const width2 = Math.max(this.x + this.width, box.x + box.width) - x2;
    const height2 = Math.max(this.y + this.height, box.y + box.height) - y2;
    return new Box2(x2, y2, width2, height2);
  }
  toArray() {
    return [
      this.x,
      this.y,
      this.width,
      this.height
    ];
  }
  toString() {
    return this.x + " " + this.y + " " + this.width + " " + this.height;
  }
  transform(m) {
    if (!(m instanceof Matrix)) m = new Matrix(m);
    let xMin = Infinity;
    let xMax = -Infinity;
    let yMin = Infinity;
    let yMax = -Infinity;
    [
      new Point(this.x, this.y),
      new Point(this.x2, this.y),
      new Point(this.x, this.y2),
      new Point(this.x2, this.y2)
    ].forEach(function(p) {
      p = p.transform(m);
      xMin = Math.min(xMin, p.x);
      xMax = Math.max(xMax, p.x);
      yMin = Math.min(yMin, p.y);
      yMax = Math.max(yMax, p.y);
    });
    return new Box2(xMin, yMin, xMax - xMin, yMax - yMin);
  }
};
function getBox(el, getBBoxFn, retry) {
  let box;
  try {
    box = getBBoxFn(el.node);
    if (isNulledBox(box) && !domContains(el.node)) throw new Error("Element not in the dom");
  } catch (e) {
    box = retry(el);
  }
  return box;
}
function bbox() {
  const getBBox = (node) => node.getBBox();
  const retry = (el) => {
    try {
      const clone = el.clone().addTo(parser().svg).show();
      const box2 = clone.node.getBBox();
      clone.remove();
      return box2;
    } catch (e) {
      throw new Error(`Getting bbox of element "${el.node.nodeName}" is not possible: ${e.toString()}`);
    }
  };
  const box = getBox(this, getBBox, retry);
  return new Box(box);
}
function rbox(el) {
  const getRBox = (node) => node.getBoundingClientRect();
  const retry = (el2) => {
    throw new Error(`Getting rbox of element "${el2.node.nodeName}" is not possible`);
  };
  const box = getBox(this, getRBox, retry);
  const rbox2 = new Box(box);
  if (el) return rbox2.transform(el.screenCTM().inverseO());
  return rbox2.addOffset();
}
function inside(x2, y2) {
  const box = this.bbox();
  return x2 > box.x && y2 > box.y && x2 < box.x + box.width && y2 < box.y + box.height;
}
registerMethods({ viewbox: {
  viewbox(x2, y2, width2, height2) {
    if (x2 == null) return new Box(this.attr("viewBox"));
    return this.attr("viewBox", new Box(x2, y2, width2, height2));
  },
  zoom(level, point2) {
    let { width: width2, height: height2 } = this.attr(["width", "height"]);
    if (!width2 && !height2 || typeof width2 === "string" || typeof height2 === "string") {
      width2 = this.node.clientWidth;
      height2 = this.node.clientHeight;
    }
    if (!width2 || !height2) throw new Error("Impossible to get absolute width and height. Please provide an absolute width and height attribute on the zooming element");
    const v = this.viewbox();
    const zoomX = width2 / v.width;
    const zoomY = height2 / v.height;
    const zoom = Math.min(zoomX, zoomY);
    if (level == null) return zoom;
    let zoomAmount = zoom / level;
    if (zoomAmount === Infinity) zoomAmount = Number.MAX_SAFE_INTEGER / 100;
    point2 = point2 || new Point(width2 / 2 / zoomX + v.x, height2 / 2 / zoomY + v.y);
    const box = new Box(v).transform(new Matrix({
      scale: zoomAmount,
      origin: point2
    }));
    return this.viewbox(box);
  }
} });
register(Box, "Box");
var List = class extends Array {
  constructor(arr = [], ...args) {
    super(arr, ...args);
    if (typeof arr === "number") return this;
    this.length = 0;
    this.push(...arr);
  }
};
extend([List], {
  each(fnOrMethodName, ...args) {
    if (typeof fnOrMethodName === "function") return this.map((el, i, arr) => {
      return fnOrMethodName.call(el, el, i, arr);
    });
    else return this.map((el) => {
      return el[fnOrMethodName](...args);
    });
  },
  toArray() {
    return Array.prototype.concat.apply([], this);
  }
});
var reserved = [
  "toArray",
  "constructor",
  "each"
];
List.extend = function(methods2) {
  methods2 = methods2.reduce((obj, name) => {
    if ((0, import_includes.default)(reserved).call(reserved, name)) return obj;
    if (name[0] === "_") return obj;
    if (name in Array.prototype) obj["$" + name] = Array.prototype[name];
    obj[name] = function(...attrs2) {
      return this.each(name, ...attrs2);
    };
    return obj;
  }, {});
  extend([List], methods2);
};
function getReferenceId(value) {
  let referenceValue = (value + "").trim();
  const url = referenceValue.match(/^url\((.*)\)$/i);
  if (url) {
    referenceValue = url[1].trim();
    const quote = referenceValue[0];
    if (quote === '"' || quote === "'") {
      if (referenceValue[referenceValue.length - 1] !== quote) return null;
      referenceValue = referenceValue.slice(1, -1);
    }
  }
  const match = referenceValue.match(reference);
  return match ? match[1].slice(1) : null;
}
function findById(rootNode, id) {
  const selector = `#${globals.window.CSS.escape(id)}`;
  if (rootNode.nodeType === 1 && rootNode.matches(selector)) return rootNode;
  return rootNode.querySelector(selector);
}
function resolveReference(node, value) {
  const id = getReferenceId(value);
  return id ? findById(node.getRootNode(), id) : null;
}
function findReferences(node, attribute2, selector = `[${attribute2}]`) {
  const id = node.getAttribute("id");
  const rootNode = node.getRootNode();
  if (!id || findById(rootNode, id) !== node) return new List();
  const references = [];
  if (rootNode.nodeType === 1 && rootNode.matches(selector) && getReferenceId(rootNode.getAttribute(attribute2)) === id) references.push(adopt(rootNode));
  for (const element of rootNode.querySelectorAll(selector)) if (getReferenceId(element.getAttribute(attribute2)) === id) references.push(adopt(element));
  return new List(references);
}
function baseFind(query2, parent) {
  return new List(map((parent || globals.document).querySelectorAll(query2), function(node) {
    return adopt(node);
  }));
}
function find3(query2) {
  return baseFind(query2, this.node);
}
function findOne5(query2) {
  return adopt(this.node.querySelector(query2));
}
var listenerId = 0;
var eventStore = /* @__PURE__ */ new WeakMap();
var listenerIds = /* @__PURE__ */ new WeakMap();
var createEventMap = () => /* @__PURE__ */ Object.create(null);
function getEvents(instance) {
  const holder = instance.getEventHolder();
  let bag = eventStore.get(holder);
  if (!bag) {
    bag = createEventMap();
    eventStore.set(holder, bag);
  }
  return bag;
}
function getEventTarget(instance) {
  return instance.getEventTarget();
}
function clearEvents(instance) {
  eventStore.delete(instance.getEventHolder());
}
function on(node, events, listener, binding, options) {
  const l = listener.bind(binding || node);
  const listenerOptions = options || false;
  const instance = makeInstance(node);
  const bag = getEvents(instance);
  const n = getEventTarget(instance);
  events = Array.isArray(events) ? events : events.split(delimiter);
  let id = listenerIds.get(listener);
  if (!id) {
    id = ++listenerId;
    listenerIds.set(listener, id);
  }
  events.forEach(function(event) {
    const ev = event.split(".")[0];
    const ns = event.split(".")[1] || "*";
    bag[ev] = bag[ev] || createEventMap();
    bag[ev][ns] = bag[ev][ns] || createEventMap();
    bag[ev][ns][id] = bag[ev][ns][id] || [];
    bag[ev][ns][id].push({
      listener: l,
      options: listenerOptions
    });
    n.addEventListener(ev, l, listenerOptions);
  });
}
function off(node, events, listener, options) {
  const instance = makeInstance(node);
  const bag = getEvents(instance);
  const n = getEventTarget(instance);
  if (typeof listener === "function") {
    listener = listenerIds.get(listener);
    if (!listener) return;
  }
  events = Array.isArray(events) ? events : (events || "").split(delimiter);
  events.forEach(function(event) {
    const ev = event && event.split(".")[0];
    const ns = event && event.split(".")[1];
    let namespace, l;
    if (listener) {
      if (bag[ev] && bag[ev][ns || "*"]) {
        const listeners = bag[ev][ns || "*"][listener];
        if (!listeners) return;
        listeners.forEach(function(registration) {
          n.removeEventListener(ev, registration.listener, registration.options ?? options ?? false);
        });
        delete bag[ev][ns || "*"][listener];
      }
    } else if (ev && ns) {
      if (bag[ev] && bag[ev][ns]) {
        for (l in bag[ev][ns]) off(n, [ev, ns].join("."), l);
        delete bag[ev][ns];
      }
    } else if (ns) {
      for (event in bag) for (namespace in bag[event]) if (ns === namespace) off(n, [event, ns].join("."));
    } else if (ev) {
      if (bag[ev]) {
        for (namespace in bag[ev]) off(n, [ev, namespace].join("."));
        delete bag[ev];
      }
    } else {
      for (event in bag) off(n, event);
      clearEvents(instance);
    }
  });
}
function dispatch2(node, event, data2, options) {
  const n = getEventTarget(node);
  if (event instanceof globals.window.Event) n.dispatchEvent(event);
  else {
    event = new globals.window.CustomEvent(event, {
      detail: data2,
      cancelable: true,
      ...options
    });
    n.dispatchEvent(event);
  }
  return event;
}
var EventTarget = class extends Base {
  addEventListener() {
  }
  dispatch(event, data2, options) {
    return dispatch2(this, event, data2, options);
  }
  dispatchEvent(event) {
    const events = getEvents(this)[event.type];
    if (!events) return true;
    for (const i in events) for (const j in events[i]) events[i][j].forEach(function(registration) {
      registration.listener(event);
    });
    return !event.defaultPrevented;
  }
  fire(event, data2, options) {
    this.dispatch(event, data2, options);
    return this;
  }
  getEventHolder() {
    return this;
  }
  getEventTarget() {
    return this;
  }
  off(event, listener, options) {
    off(this, event, listener, options);
    return this;
  }
  on(event, listener, binding, options) {
    on(this, event, listener, binding, options);
    return this;
  }
  removeEventListener() {
  }
};
register(EventTarget, "EventTarget");
function noop() {
}
var timeline = {
  duration: 400,
  ease: ">",
  delay: 0
};
var attrs = {
  "fill-opacity": 1,
  "stroke-opacity": 1,
  "stroke-width": 0,
  "stroke-linejoin": "miter",
  "stroke-linecap": "butt",
  fill: "#000000",
  stroke: "#000000",
  opacity: 1,
  x: 0,
  y: 0,
  cx: 0,
  cy: 0,
  width: 0,
  height: 0,
  r: 0,
  rx: 0,
  ry: 0,
  offset: 0,
  "stop-opacity": 1,
  "stop-color": "#000000",
  "text-anchor": "start"
};
var SVGArray = class extends Array {
  constructor(...args) {
    super(...args);
    this.init(...args);
  }
  clone() {
    return new this.constructor(this);
  }
  init(arr) {
    if (typeof arr === "number") return this;
    this.length = 0;
    this.push(...this.parse(arr));
    return this;
  }
  parse(array2 = []) {
    if (array2 instanceof Array) return array2;
    return array2.trim().split(delimiter).map(parseFloat);
  }
  toArray() {
    return Array.prototype.concat.apply([], this);
  }
  toSet() {
    return new Set(this);
  }
  toString() {
    return this.join(" ");
  }
  valueOf() {
    const ret = [];
    ret.push(...this);
    return ret;
  }
};
var SVGNumber = class SVGNumber2 {
  constructor(...args) {
    this.init(...args);
  }
  convert(unit) {
    return new SVGNumber2(this.value, unit);
  }
  divide(number) {
    number = new SVGNumber2(number);
    return new SVGNumber2(this / number, this.unit || number.unit);
  }
  init(value, unit) {
    unit = Array.isArray(value) ? value[1] : unit;
    value = Array.isArray(value) ? value[0] : value;
    this.value = 0;
    this.unit = unit || "";
    if (typeof value === "number") this.value = isNaN(value) ? 0 : !isFinite(value) ? value < 0 ? -34e37 : 34e37 : value;
    else if (typeof value === "string") {
      unit = value.match(numberAndUnit);
      if (unit) {
        this.value = parseFloat(unit[1]);
        if (unit[5] === "%") this.value /= 100;
        else if (unit[5] === "s") this.value *= 1e3;
        this.unit = unit[5];
      }
    } else if (value instanceof SVGNumber2) {
      this.value = value.valueOf();
      this.unit = value.unit;
    }
    return this;
  }
  minus(number) {
    number = new SVGNumber2(number);
    return new SVGNumber2(this - number, this.unit || number.unit);
  }
  plus(number) {
    number = new SVGNumber2(number);
    return new SVGNumber2(this + number, this.unit || number.unit);
  }
  times(number) {
    number = new SVGNumber2(number);
    return new SVGNumber2(this * number, this.unit || number.unit);
  }
  toArray() {
    return [this.value, this.unit];
  }
  toJSON() {
    return this.toString();
  }
  toString() {
    return (this.unit === "%" ? ~~(this.value * 1e8) / 1e6 : this.unit === "s" ? this.value / 1e3 : this.value) + this.unit;
  }
  valueOf() {
    return this.value;
  }
};
var colorAttributes = /* @__PURE__ */ new Set([
  "fill",
  "stroke",
  "color",
  "bgcolor",
  "stop-color",
  "flood-color",
  "lighting-color"
]);
var hooks = [];
function registerAttrHook(fn) {
  hooks.push(fn);
}
function attr(attr2, val, ns) {
  if (attr2 == null) {
    attr2 = {};
    val = this.node.attributes;
    for (const node of val) attr2[node.nodeName] = isNumber3.test(node.nodeValue) ? parseFloat(node.nodeValue) : node.nodeValue;
    return attr2;
  } else if (attr2 instanceof Array) return attr2.reduce((last, curr) => {
    last[curr] = this.attr(curr);
    return last;
  }, {});
  else if (typeof attr2 === "object" && attr2.constructor === Object) for (val in attr2) this.attr(val, attr2[val]);
  else if (val === null) this.node.removeAttribute(attr2);
  else if (val == null) {
    val = this.node.getAttribute(attr2);
    return val == null ? attrs[attr2] : isNumber3.test(val) ? parseFloat(val) : val;
  } else {
    val = hooks.reduce((_val, hook) => {
      return hook(attr2, _val, this);
    }, val);
    if (typeof val === "number") val = new SVGNumber(val);
    else if (colorAttributes.has(attr2) && Color.isColor(val)) val = new Color(val);
    else if (val.constructor === Array) val = new SVGArray(val);
    if (attr2 === "leading") {
      if (this.leading) this.leading(val);
    } else typeof ns === "string" ? this.node.setAttributeNS(ns, attr2, val.toString()) : this.node.setAttribute(attr2, val.toString());
    if (this.rebuild && (attr2 === "font-size" || attr2 === "x")) this.rebuild();
  }
  return this;
}
var Dom = class Dom2 extends EventTarget {
  constructor(node, attrs2) {
    super();
    this.node = node;
    this.type = node.nodeName;
    if (attrs2 && node !== attrs2) this.attr(attrs2);
  }
  add(element, i) {
    element = makeInstance(element);
    if (element.removeNamespace && this.node instanceof globals.window.SVGElement) element.removeNamespace();
    if (i == null) this.node.appendChild(element.node);
    else if (element.node !== this.node.childNodes[i]) this.node.insertBefore(element.node, this.node.childNodes[i]);
    return this;
  }
  addTo(parent, i) {
    return makeInstance(parent).put(this, i);
  }
  children() {
    return new List(map(this.node.children, function(node) {
      return adopt(node);
    }));
  }
  clear() {
    while (this.node.hasChildNodes()) this.node.removeChild(this.node.lastChild);
    return this;
  }
  clone(deep = true, assignNewIds = true) {
    this.writeDataToDom();
    let nodeClone = this.node.cloneNode(deep);
    if (assignNewIds) nodeClone = assignNewId(nodeClone);
    return new this.constructor(nodeClone);
  }
  each(block, deep) {
    const children = this.children();
    let i, il;
    for (i = 0, il = children.length; i < il; i++) {
      block.apply(children[i], [i, children]);
      if (deep) children[i].each(block, deep);
    }
    return this;
  }
  element(nodeName, attrs2) {
    return this.put(new Dom2(create3(nodeName), attrs2));
  }
  first() {
    return adopt(this.node.firstChild);
  }
  get(i) {
    return adopt(this.node.childNodes[i]);
  }
  getEventHolder() {
    return this.node;
  }
  getEventTarget() {
    return this.node;
  }
  has(element) {
    return this.index(element) >= 0;
  }
  html(htmlOrFn, outerHTML) {
    return this.xml(htmlOrFn, outerHTML, html);
  }
  id(id) {
    if (typeof id === "undefined" && !this.node.id) this.node.id = eid(this.type);
    return this.attr("id", id);
  }
  index(element) {
    return [].slice.call(this.node.childNodes).indexOf(element.node);
  }
  last() {
    return adopt(this.node.lastChild);
  }
  matches(selector) {
    const el = this.node;
    const matcher = el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector || null;
    return matcher && matcher.call(el, selector);
  }
  parent(type) {
    let parent = this;
    if (!parent.node.parentNode) return null;
    parent = adopt(parent.node.parentNode);
    if (!type) return parent;
    do
      if (typeof type === "string" ? parent.matches(type) : parent instanceof type) return parent;
    while (parent = adopt(parent.node.parentNode));
    return parent;
  }
  put(element, i) {
    element = makeInstance(element);
    this.add(element, i);
    return element;
  }
  putIn(parent, i) {
    return makeInstance(parent).add(this, i);
  }
  remove() {
    if (this.parent()) this.parent().removeElement(this);
    return this;
  }
  removeElement(element) {
    this.node.removeChild(element.node);
    return this;
  }
  replace(element) {
    element = makeInstance(element);
    if (this.node.parentNode) this.node.parentNode.replaceChild(element.node, this.node);
    return element;
  }
  round(precision = 2, map2 = null) {
    const factor = 10 ** precision;
    const attrs2 = this.attr(map2);
    for (const i in attrs2) if (typeof attrs2[i] === "number") attrs2[i] = Math.round(attrs2[i] * factor) / factor;
    this.attr(attrs2);
    return this;
  }
  svg(svgOrFn, outerSVG) {
    return this.xml(svgOrFn, outerSVG, svg);
  }
  toString() {
    return this.id();
  }
  words(text) {
    this.node.textContent = text;
    return this;
  }
  wrap(node) {
    const parent = this.parent();
    if (!parent) return this.addTo(node);
    const position2 = parent.index(this);
    return parent.put(node, position2).put(this);
  }
  writeDataToDom() {
    this.each(function() {
      this.writeDataToDom();
    });
    return this;
  }
  xml(xmlOrFn, outerXML, ns) {
    if (typeof xmlOrFn === "boolean") {
      ns = outerXML;
      outerXML = xmlOrFn;
      xmlOrFn = null;
    }
    if (xmlOrFn == null || typeof xmlOrFn === "function") {
      outerXML = outerXML == null ? true : outerXML;
      this.writeDataToDom();
      let current = this;
      if (xmlOrFn != null) {
        current = adopt(current.node.cloneNode(true));
        if (outerXML) {
          const result = xmlOrFn(current);
          current = result || current;
          if (result === false) return "";
        }
        current.each(function() {
          const result = xmlOrFn(this);
          const _this = result || this;
          if (result === false) this.remove();
          else if (result && this !== _this) this.replace(_this);
        }, true);
      }
      return outerXML ? current.node.outerHTML : current.node.innerHTML;
    }
    outerXML = outerXML == null ? false : outerXML;
    const well = create3("wrapper", ns);
    const fragment = globals.document.createDocumentFragment();
    well.innerHTML = xmlOrFn;
    for (let len = well.children.length; len--; ) fragment.appendChild(well.firstElementChild);
    const parent = this.parent();
    return outerXML ? this.replace(fragment) && parent : this.add(fragment);
  }
};
extend(Dom, {
  attr,
  find: find3,
  findOne: findOne5
});
register(Dom, "Dom");
var Element4 = class extends Dom {
  constructor(node, attrs2) {
    super(node, attrs2);
    this.dom = {};
    this.node.instance = this;
    if (node.hasAttribute("data-svgjs") || node.hasAttribute("svgjs:data")) this.setData(JSON.parse(node.getAttribute("data-svgjs")) ?? JSON.parse(node.getAttribute("svgjs:data")) ?? {});
  }
  center(x2, y2) {
    return this.cx(x2).cy(y2);
  }
  cx(x2) {
    return x2 == null ? this.x() + this.width() / 2 : this.x(x2 - this.width() / 2);
  }
  cy(y2) {
    return y2 == null ? this.y() + this.height() / 2 : this.y(y2 - this.height() / 2);
  }
  defs() {
    const root2 = this.root();
    return root2 && root2.defs();
  }
  dmove(x2, y2) {
    return this.dx(x2).dy(y2);
  }
  dx(x2 = 0) {
    return this.x(new SVGNumber(x2).plus(this.x()));
  }
  dy(y2 = 0) {
    return this.y(new SVGNumber(y2).plus(this.y()));
  }
  getEventHolder() {
    return this;
  }
  height(height2) {
    return this.attr("height", height2);
  }
  move(x2, y2) {
    return this.x(x2).y(y2);
  }
  parents(until = this.root()) {
    const isSelector = typeof until === "string";
    const root2 = this.root();
    const rootNode = root2 && root2.node;
    if (!isSelector) until = until && makeInstance(until).node;
    const parents = new List();
    let parent = this;
    while ((parent = parent.parent()) && parent.node !== globals.document && parent.node.nodeName !== "#document-fragment") {
      parents.push(parent);
      if (!isSelector && parent.node === until) break;
      if (isSelector && parent.matches(until)) break;
      if (rootNode && parent.node === rootNode) return null;
    }
    return parents;
  }
  reference(attr2) {
    attr2 = this.attr(attr2);
    if (!attr2) return null;
    const target = resolveReference(this.node, attr2);
    return target ? makeInstance(target) : null;
  }
  root() {
    const p = this.parent(getClass(root));
    return p && p.root();
  }
  setData(o) {
    this.dom = o;
    return this;
  }
  size(width2, height2) {
    const p = proportionalSize(this, width2, height2);
    return this.width(new SVGNumber(p.width)).height(new SVGNumber(p.height));
  }
  width(width2) {
    return this.attr("width", width2);
  }
  writeDataToDom(defaults) {
    writeDataToDom(this, this.dom, defaults);
    return super.writeDataToDom();
  }
  x(x2) {
    return this.attr("x", x2);
  }
  y(y2) {
    return this.attr("y", y2);
  }
};
extend(Element4, {
  bbox,
  rbox,
  inside,
  point,
  ctm,
  screenCTM
});
register(Element4, "Element");
var sugar = {
  stroke: [
    "color",
    "width",
    "opacity",
    "linecap",
    "linejoin",
    "miterlimit",
    "dasharray",
    "dashoffset"
  ],
  fill: [
    "color",
    "opacity",
    "rule"
  ],
  prefix: function(t, a) {
    return a === "color" ? t : t + "-" + a;
  }
};
["fill", "stroke"].forEach(function(m) {
  const extension = {};
  let i;
  extension[m] = function(o) {
    if (typeof o === "undefined") return this.attr(m);
    if (typeof o === "string" || o instanceof Color || Color.isRgb(o) || o instanceof Element4) this.attr(m, o);
    else for (i = sugar[m].length - 1; i >= 0; i--) if (o[sugar[m][i]] != null) this.attr(sugar.prefix(m, sugar[m][i]), o[sugar[m][i]]);
    return this;
  };
  registerMethods(["Element", "Runner"], extension);
});
registerMethods(["Element", "Runner"], {
  matrix: function(mat, b, c, d, e, f) {
    if (mat == null) return new Matrix(this);
    return this.attr("transform", new Matrix(mat, b, c, d, e, f));
  },
  rotate: function(angle, cx2, cy2) {
    return this.transform({
      rotate: angle,
      ox: cx2,
      oy: cy2
    }, true);
  },
  skew: function(x2, y2, cx2, cy2) {
    return arguments.length === 1 || arguments.length === 3 ? this.transform({
      skew: x2,
      ox: y2,
      oy: cx2
    }, true) : this.transform({
      skew: [x2, y2],
      ox: cx2,
      oy: cy2
    }, true);
  },
  shear: function(lam, cx2, cy2) {
    return this.transform({
      shear: lam,
      ox: cx2,
      oy: cy2
    }, true);
  },
  scale: function(x2, y2, cx2, cy2) {
    return arguments.length === 1 || arguments.length === 3 ? this.transform({
      scale: x2,
      ox: y2,
      oy: cx2
    }, true) : this.transform({
      scale: [x2, y2],
      ox: cx2,
      oy: cy2
    }, true);
  },
  translate: function(x2, y2) {
    return this.transform({ translate: [x2, y2] }, true);
  },
  relative: function(x2, y2) {
    return this.transform({ relative: [x2, y2] }, true);
  },
  flip: function(direction = "both", origin = "center") {
    if ("xybothtrue".indexOf(direction) === -1) {
      origin = direction;
      direction = "both";
    }
    return this.transform({
      flip: direction,
      origin
    }, true);
  },
  opacity: function(value) {
    return this.attr("opacity", value);
  }
});
registerMethods("radius", { radius: function(x2, y2 = x2) {
  return (this._element || this).type === "radialGradient" ? this.attr("r", new SVGNumber(x2)) : this.rx(x2).ry(y2);
} });
registerMethods("Path", {
  length: function() {
    return this.node.getTotalLength();
  },
  pointAt: function(length2) {
    return new Point(this.node.getPointAtLength(length2));
  }
});
registerMethods(["Element", "Runner"], { font: function(a, v) {
  if (typeof a === "object") {
    for (v in a) this.font(v, a[v]);
    return this;
  }
  return a === "leading" ? this.leading(v) : a === "anchor" ? this.attr("text-anchor", v) : a === "size" || a === "family" || a === "weight" || a === "stretch" || a === "variant" || a === "style" ? this.attr("font-" + a, v) : this.attr(a, v);
} });
registerMethods("Element", [
  "click",
  "dblclick",
  "mousedown",
  "mouseup",
  "mouseover",
  "mouseout",
  "mousemove",
  "mouseenter",
  "mouseleave",
  "touchstart",
  "touchmove",
  "touchleave",
  "touchend",
  "touchcancel",
  "contextmenu",
  "wheel",
  "pointerdown",
  "pointermove",
  "pointerup",
  "pointerleave",
  "pointercancel"
].reduce(function(last, event) {
  const fn = function(f) {
    if (f === null) this.off(event);
    else this.on(event, f);
    return this;
  };
  last[event] = fn;
  return last;
}, {}));
function untransform() {
  return this.attr("transform", null);
}
function matrixify() {
  return (this.attr("transform") || "").split(transforms).slice(0, -1).map(function(str) {
    const kv = str.trim().split("(");
    return [kv[0].trim(), kv[1].split(delimiter).map(function(str2) {
      return parseFloat(str2);
    })];
  }).reverse().reduce(function(matrix, transform2) {
    if (transform2[0] === "matrix") return matrix.lmultiply(Matrix.fromArray(transform2[1]));
    return matrix[transform2[0]].apply(matrix, transform2[1]);
  }, new Matrix());
}
function toParent(parent, i) {
  if (this === parent) return this;
  if (isDescriptive(this.node)) return this.addTo(parent, i);
  const ctm2 = this.screenCTM();
  const pCtm = parent.screenCTM().inverse();
  this.addTo(parent, i).untransform().transform(pCtm.multiply(ctm2));
  return this;
}
function toRoot(i) {
  return this.toParent(this.root(), i);
}
function transform(o, relative) {
  if (o == null || typeof o === "string") {
    const decomposed = new Matrix(this).decompose();
    return o == null ? decomposed : decomposed[o];
  }
  if (!Matrix.isMatrixLike(o)) o = {
    ...o,
    origin: getOrigin(o, this)
  };
  const result = new Matrix(relative === true ? this : relative || false).transform(o);
  return this.attr("transform", result);
}
registerMethods("Element", {
  untransform,
  matrixify,
  toParent,
  toRoot,
  transform
});
var Container = class Container2 extends Element4 {
  flatten() {
    this.each(function() {
      if (this instanceof Container2) return this.flatten().ungroup();
    });
    return this;
  }
  ungroup(parent = this.parent(), index = parent.index(this)) {
    index = index === -1 ? parent.children().length : index;
    this.each(function(i, children) {
      return children[children.length - i - 1].toParent(parent, index);
    });
    return this.remove();
  }
};
register(Container, "Container");
var Defs = class extends Container {
  constructor(node, attrs2 = node) {
    super(nodeOrNew("defs", node), attrs2);
  }
  flatten() {
    return this;
  }
  ungroup() {
    return this;
  }
};
register(Defs, "Defs");
var Shape = class extends Element4 {
};
register(Shape, "Shape");
var circled_exports = /* @__PURE__ */ __exportAll({
  cx: () => cx$1,
  cy: () => cy$1,
  height: () => height$2,
  rx: () => rx,
  ry: () => ry,
  width: () => width$2,
  x: () => x$3,
  y: () => y$3
});
function rx(rx2) {
  return this.attr("rx", rx2);
}
function ry(ry2) {
  return this.attr("ry", ry2);
}
function x$3(x2) {
  return x2 == null ? this.cx() - this.rx() : this.cx(x2 + this.rx());
}
function y$3(y2) {
  return y2 == null ? this.cy() - this.ry() : this.cy(y2 + this.ry());
}
function cx$1(x2) {
  return this.attr("cx", x2);
}
function cy$1(y2) {
  return this.attr("cy", y2);
}
function width$2(width2) {
  return width2 == null ? this.rx() * 2 : this.rx(new SVGNumber(width2).divide(2));
}
function height$2(height2) {
  return height2 == null ? this.ry() * 2 : this.ry(new SVGNumber(height2).divide(2));
}
var Ellipse = class extends Shape {
  constructor(node, attrs2 = node) {
    super(nodeOrNew("ellipse", node), attrs2);
  }
  size(width2, height2) {
    const p = proportionalSize(this, width2, height2);
    return this.rx(new SVGNumber(p.width).divide(2)).ry(new SVGNumber(p.height).divide(2));
  }
};
extend(Ellipse, circled_exports);
registerMethods("Container", { ellipse: wrapWithAttrCheck(function(width2 = 0, height2 = width2) {
  return this.put(new Ellipse()).size(width2, height2).move(0, 0);
}) });
register(Ellipse, "Ellipse");
var Fragment = class extends Dom {
  constructor(node = globals.document.createDocumentFragment()) {
    super(node);
  }
  xml(xmlOrFn, outerXML, ns) {
    if (typeof xmlOrFn === "boolean") {
      ns = outerXML;
      outerXML = xmlOrFn;
      xmlOrFn = null;
    }
    if (xmlOrFn == null || typeof xmlOrFn === "function") {
      const wrapper = new Dom(create3("wrapper", ns));
      wrapper.add(this.node.cloneNode(true));
      return wrapper.xml(false, ns);
    }
    return super.xml(xmlOrFn, false, ns);
  }
};
register(Fragment, "Fragment");
var gradiented_exports = /* @__PURE__ */ __exportAll({
  from: () => from,
  to: () => to
});
function from(x2, y2) {
  return (this._element || this).type === "radialGradient" ? this.attr({
    fx: new SVGNumber(x2),
    fy: new SVGNumber(y2)
  }) : this.attr({
    x1: new SVGNumber(x2),
    y1: new SVGNumber(y2)
  });
}
function to(x2, y2) {
  return (this._element || this).type === "radialGradient" ? this.attr({
    cx: new SVGNumber(x2),
    cy: new SVGNumber(y2)
  }) : this.attr({
    x2: new SVGNumber(x2),
    y2: new SVGNumber(y2)
  });
}
var Gradient = class extends Container {
  constructor(type, attrs2) {
    super(nodeOrNew(type + "Gradient", typeof type === "string" ? null : type), attrs2);
  }
  attr(a, b, c) {
    if (a === "transform") a = "gradientTransform";
    return super.attr(a, b, c);
  }
  bbox() {
    return new Box();
  }
  targets() {
    return findReferences(this.node, "fill");
  }
  toString() {
    return this.url();
  }
  update(block) {
    this.clear();
    if (typeof block === "function") block.call(this, this);
    return this;
  }
  url() {
    return "url(#" + this.id() + ")";
  }
};
extend(Gradient, gradiented_exports);
registerMethods({
  Container: { gradient(...args) {
    return this.defs().gradient(...args);
  } },
  Defs: { gradient: wrapWithAttrCheck(function(type, block) {
    return this.put(new Gradient(type)).update(block);
  }) }
});
register(Gradient, "Gradient");
var Pattern = class extends Container {
  constructor(node, attrs2 = node) {
    super(nodeOrNew("pattern", node), attrs2);
  }
  attr(a, b, c) {
    if (a === "transform") a = "patternTransform";
    return super.attr(a, b, c);
  }
  bbox() {
    return new Box();
  }
  targets() {
    return findReferences(this.node, "fill");
  }
  toString() {
    return this.url();
  }
  update(block) {
    this.clear();
    if (typeof block === "function") block.call(this, this);
    return this;
  }
  url() {
    return "url(#" + this.id() + ")";
  }
};
registerMethods({
  Container: { pattern(...args) {
    return this.defs().pattern(...args);
  } },
  Defs: { pattern: wrapWithAttrCheck(function(width2, height2, block) {
    return this.put(new Pattern()).update(block).attr({
      x: 0,
      y: 0,
      width: width2,
      height: height2,
      patternUnits: "userSpaceOnUse"
    });
  }) }
});
register(Pattern, "Pattern");
var Image = class extends Shape {
  constructor(node, attrs2 = node) {
    super(nodeOrNew("image", node), attrs2);
  }
  load(url, callback) {
    if (!url) return this;
    const img = new globals.window.Image();
    on(img, "load", function(e) {
      const p = this.parent(Pattern);
      if (this.width() === 0 && this.height() === 0) this.size(img.width, img.height);
      if (p instanceof Pattern) {
        if (p.width() === 0 && p.height() === 0) p.size(this.width(), this.height());
      }
      if (typeof callback === "function") callback.call(this, e);
    }, this);
    on(img, "load error", function() {
      off(img);
    });
    return this.attr("href", img.src = url, xlink);
  }
};
registerAttrHook(function(attr2, val, _this) {
  if (attr2 === "fill" || attr2 === "stroke") {
    if (isImage.test(val)) val = _this.root().defs().image(val);
  }
  if (val instanceof Image) val = _this.root().defs().pattern(0, 0, (pattern) => {
    pattern.add(val);
  });
  return val;
});
registerMethods({ Container: { image: wrapWithAttrCheck(function(source, callback) {
  return this.put(new Image()).size(0, 0).load(source, callback);
}) } });
register(Image, "Image");
var PointArray = class extends SVGArray {
  bbox() {
    let maxX = -Infinity;
    let maxY = -Infinity;
    let minX = Infinity;
    let minY = Infinity;
    this.forEach(function(el) {
      maxX = Math.max(el[0], maxX);
      maxY = Math.max(el[1], maxY);
      minX = Math.min(el[0], minX);
      minY = Math.min(el[1], minY);
    });
    return new Box(minX, minY, maxX - minX, maxY - minY);
  }
  move(x2, y2) {
    const box = this.bbox();
    x2 -= box.x;
    y2 -= box.y;
    if (!isNaN(x2) && !isNaN(y2)) for (let i = this.length - 1; i >= 0; i--) this[i] = [this[i][0] + x2, this[i][1] + y2];
    return this;
  }
  parse(array2 = [0, 0]) {
    const points = [];
    if (array2 instanceof Array) array2 = Array.prototype.concat.apply([], array2);
    else array2 = array2.trim().split(delimiter).map(parseFloat);
    if (array2.length % 2 !== 0) array2.pop();
    for (let i = 0, len = array2.length; i < len; i = i + 2) points.push([array2[i], array2[i + 1]]);
    return points;
  }
  size(width2, height2) {
    let i;
    const box = this.bbox();
    for (i = this.length - 1; i >= 0; i--) {
      if (box.width) this[i][0] = (this[i][0] - box.x) * width2 / box.width + box.x;
      if (box.height) this[i][1] = (this[i][1] - box.y) * height2 / box.height + box.y;
    }
    return this;
  }
  toLine() {
    return {
      x1: this[0][0],
      y1: this[0][1],
      x2: this[1][0],
      y2: this[1][1]
    };
  }
  toString() {
    const array2 = [];
    for (let i = 0, il = this.length; i < il; i++) array2.push(this[i].join(","));
    return array2.join(" ");
  }
  transform(m) {
    return this.clone().transformO(m);
  }
  transformO(m) {
    if (!Matrix.isMatrixLike(m)) m = new Matrix(m);
    for (let i = this.length; i--; ) {
      const [x2, y2] = this[i];
      this[i][0] = m.a * x2 + m.c * y2 + m.e;
      this[i][1] = m.b * x2 + m.d * y2 + m.f;
    }
    return this;
  }
};
var pointed_exports = /* @__PURE__ */ __exportAll({
  MorphArray: () => MorphArray,
  height: () => height$1,
  width: () => width$1,
  x: () => x$2,
  y: () => y$2
});
var MorphArray = PointArray;
function x$2(x2) {
  return x2 == null ? this.bbox().x : this.move(x2, this.bbox().y);
}
function y$2(y2) {
  return y2 == null ? this.bbox().y : this.move(this.bbox().x, y2);
}
function width$1(width2) {
  const b = this.bbox();
  return width2 == null ? b.width : this.size(width2, b.height);
}
function height$1(height2) {
  const b = this.bbox();
  return height2 == null ? b.height : this.size(b.width, height2);
}
var Line = class extends Shape {
  constructor(node, attrs2 = node) {
    super(nodeOrNew("line", node), attrs2);
  }
  array() {
    return new PointArray([[this.attr("x1"), this.attr("y1")], [this.attr("x2"), this.attr("y2")]]);
  }
  move(x2, y2) {
    return this.attr(this.array().move(x2, y2).toLine());
  }
  plot(x1, y1, x2, y2) {
    if (x1 == null) return this.array();
    else if (typeof y1 !== "undefined") x1 = {
      x1,
      y1,
      x2,
      y2
    };
    else x1 = new PointArray(x1).toLine();
    return this.attr(x1);
  }
  size(width2, height2) {
    const p = proportionalSize(this, width2, height2);
    return this.attr(this.array().size(p.width, p.height).toLine());
  }
};
extend(Line, pointed_exports);
registerMethods({ Container: { line: wrapWithAttrCheck(function(...args) {
  return Line.prototype.plot.apply(this.put(new Line()), args[0] != null ? args : [
    0,
    0,
    0,
    0
  ]);
}) } });
register(Line, "Line");
var Marker = class extends Container {
  constructor(node, attrs2 = node) {
    super(nodeOrNew("marker", node), attrs2);
  }
  height(height2) {
    return this.attr("markerHeight", height2);
  }
  orient(orient) {
    return this.attr("orient", orient);
  }
  ref(x2, y2) {
    return this.attr("refX", x2).attr("refY", y2);
  }
  toString() {
    return "url(#" + this.id() + ")";
  }
  update(block) {
    this.clear();
    if (typeof block === "function") block.call(this, this);
    return this;
  }
  width(width2) {
    return this.attr("markerWidth", width2);
  }
};
registerMethods({
  Container: { marker(...args) {
    return this.defs().marker(...args);
  } },
  Defs: { marker: wrapWithAttrCheck(function(width2, height2, block) {
    return this.put(new Marker()).size(width2, height2).ref(width2 / 2, height2 / 2).viewbox(0, 0, width2, height2).attr("orient", "auto").update(block);
  }) },
  marker: { marker(marker, width2, height2, block) {
    let attr2 = ["marker"];
    if (marker !== "all") attr2.push(marker);
    attr2 = attr2.join("-");
    marker = arguments[1] instanceof Marker ? arguments[1] : this.defs().marker(width2, height2, block);
    return this.attr(attr2, marker);
  } }
});
register(Marker, "Marker");
function makeSetterGetter(k, f) {
  return function(v) {
    if (v == null) return this[k];
    this[k] = v;
    if (f) f.call(this);
    return this;
  };
}
var easing = {
  "-": function(pos) {
    return pos;
  },
  "<>": function(pos) {
    return -Math.cos(pos * Math.PI) / 2 + 0.5;
  },
  ">": function(pos) {
    return Math.sin(pos * Math.PI / 2);
  },
  "<": function(pos) {
    return -Math.cos(pos * Math.PI / 2) + 1;
  },
  bezier: function(x1, y1, x2, y2) {
    return function(t) {
      if (t < 0) if (x1 > 0) return y1 / x1 * t;
      else if (x2 > 0) return y2 / x2 * t;
      else return 0;
      else if (t > 1) if (x2 < 1) return (1 - y2) / (1 - x2) * t + (y2 - x2) / (1 - x2);
      else if (x1 < 1) return (1 - y1) / (1 - x1) * t + (y1 - x1) / (1 - x1);
      else return 1;
      else return 3 * t * (1 - t) ** 2 * y1 + 3 * t ** 2 * (1 - t) * y2 + t ** 3;
    };
  },
  steps: function(steps, stepPosition = "end") {
    stepPosition = stepPosition.split("-").reverse()[0];
    let jumps = steps;
    if (stepPosition === "none") --jumps;
    else if (stepPosition === "both") ++jumps;
    return (t, beforeFlag = false) => {
      let step = Math.floor(t * steps);
      const jumping = t * step % 1 === 0;
      if (stepPosition === "start" || stepPosition === "both") ++step;
      if (beforeFlag && jumping) --step;
      if (t >= 0 && step < 0) step = 0;
      if (t <= 1 && step > jumps) step = jumps;
      return step / jumps;
    };
  }
};
var Stepper = class {
  done() {
    return false;
  }
};
var Ease = class extends Stepper {
  constructor(fn = timeline.ease) {
    super();
    this.ease = easing[fn] || fn;
  }
  step(from2, to2, pos) {
    if (typeof from2 !== "number") return pos < 1 ? from2 : to2;
    return from2 + (to2 - from2) * this.ease(pos);
  }
};
var Controller = class extends Stepper {
  constructor(fn) {
    super();
    this.stepper = fn;
  }
  done(c) {
    return c.done;
  }
  step(current, target, dt, c) {
    return this.stepper(current, target, dt, c);
  }
};
function recalculate() {
  const duration = (this._duration || 500) / 1e3;
  const overshoot = this._overshoot || 0;
  const eps = 1e-10;
  const pi = Math.PI;
  const os = Math.log(overshoot / 100 + eps);
  const zeta = -os / Math.sqrt(pi * pi + os * os);
  const wn = 3.9 / (zeta * duration);
  this.d = 2 * zeta * wn;
  this.k = wn * wn;
}
var Spring = class extends Controller {
  constructor(duration = 500, overshoot = 0) {
    super();
    this.duration(duration).overshoot(overshoot);
  }
  step(current, target, dt, c) {
    if (typeof current === "string") return current;
    c.done = dt === Infinity;
    if (dt === Infinity) return target;
    if (dt === 0) return current;
    if (dt > 100) dt = 16;
    dt /= 1e3;
    const velocity = c.velocity || 0;
    const acceleration = -this.d * velocity - this.k * (current - target);
    const newPosition = current + velocity * dt + acceleration * dt * dt / 2;
    c.velocity = velocity + acceleration * dt;
    c.done = Math.abs(target - newPosition) + Math.abs(velocity) < 2e-3;
    return c.done ? target : newPosition;
  }
};
extend(Spring, {
  duration: makeSetterGetter("_duration", recalculate),
  overshoot: makeSetterGetter("_overshoot", recalculate)
});
var PID = class extends Controller {
  constructor(p = 0.1, i = 0.01, d = 0, windup = 1e3) {
    super();
    this.p(p).i(i).d(d).windup(windup);
  }
  step(current, target, dt, c) {
    if (typeof current === "string") return current;
    c.done = dt === Infinity;
    if (dt === Infinity) return target;
    if (dt === 0) return current;
    const p = target - current;
    let i = (c.integral || 0) + p * dt;
    const d = (p - (c.error || 0)) / dt;
    const windup = this._windup;
    if (windup !== false) i = Math.max(-windup, Math.min(i, windup));
    c.error = p;
    c.integral = i;
    c.done = Math.abs(p) < 1e-3;
    return c.done ? target : current + (this.P * p + this.I * i + this.D * d);
  }
};
extend(PID, {
  windup: makeSetterGetter("_windup"),
  p: makeSetterGetter("P"),
  i: makeSetterGetter("I"),
  d: makeSetterGetter("D")
});
var segmentParameters = {
  M: 2,
  L: 2,
  H: 1,
  V: 1,
  C: 6,
  S: 4,
  Q: 4,
  T: 2,
  A: 7,
  Z: 0
};
var pathHandlers = {
  M: function(c, p, p0) {
    p.x = p0.x = c[0];
    p.y = p0.y = c[1];
    return [
      "M",
      p.x,
      p.y
    ];
  },
  L: function(c, p) {
    p.x = c[0];
    p.y = c[1];
    return [
      "L",
      c[0],
      c[1]
    ];
  },
  H: function(c, p) {
    p.x = c[0];
    return ["H", c[0]];
  },
  V: function(c, p) {
    p.y = c[0];
    return ["V", c[0]];
  },
  C: function(c, p) {
    p.x = c[4];
    p.y = c[5];
    return [
      "C",
      c[0],
      c[1],
      c[2],
      c[3],
      c[4],
      c[5]
    ];
  },
  S: function(c, p) {
    p.x = c[2];
    p.y = c[3];
    return [
      "S",
      c[0],
      c[1],
      c[2],
      c[3]
    ];
  },
  Q: function(c, p) {
    p.x = c[2];
    p.y = c[3];
    return [
      "Q",
      c[0],
      c[1],
      c[2],
      c[3]
    ];
  },
  T: function(c, p) {
    p.x = c[0];
    p.y = c[1];
    return [
      "T",
      c[0],
      c[1]
    ];
  },
  Z: function(c, p, p0) {
    p.x = p0.x;
    p.y = p0.y;
    return ["Z"];
  },
  A: function(c, p) {
    p.x = c[5];
    p.y = c[6];
    return [
      "A",
      c[0],
      c[1],
      c[2],
      c[3],
      c[4],
      c[5],
      c[6]
    ];
  }
};
var mlhvqtcsaz = "mlhvqtcsaz".split("");
for (let i = 0, il = mlhvqtcsaz.length; i < il; ++i) pathHandlers[mlhvqtcsaz[i]] = /* @__PURE__ */ (function(i2) {
  return function(c, p, p0) {
    if (i2 === "H") c[0] = c[0] + p.x;
    else if (i2 === "V") c[0] = c[0] + p.y;
    else if (i2 === "A") {
      c[5] = c[5] + p.x;
      c[6] = c[6] + p.y;
    } else for (let j = 0, jl = c.length; j < jl; ++j) c[j] = c[j] + (j % 2 ? p.y : p.x);
    return pathHandlers[i2](c, p, p0);
  };
})(mlhvqtcsaz[i].toUpperCase());
function makeAbsolut(parser2) {
  return pathHandlers[parser2.segment[0]](parser2.segment.slice(1), parser2.p, parser2.p0);
}
function segmentComplete(parser2) {
  return parser2.segment.length && parser2.segment.length - 1 === segmentParameters[parser2.segment[0].toUpperCase()];
}
function startNewSegment(parser2, token) {
  parser2.inNumber && finalizeNumber(parser2, false);
  const pathLetter = isPathLetter.test(token);
  if (pathLetter) parser2.segment = [token];
  else {
    const lastCommand = parser2.lastCommand;
    const small = lastCommand.toLowerCase();
    parser2.segment = [small === "m" ? lastCommand === small ? "l" : "L" : lastCommand];
  }
  parser2.inSegment = true;
  parser2.lastCommand = parser2.segment[0];
  return pathLetter;
}
function finalizeNumber(parser2, inNumber) {
  if (!parser2.inNumber) throw new Error("Parser Error");
  parser2.number && parser2.segment.push(parseFloat(parser2.number));
  parser2.inNumber = inNumber;
  parser2.number = "";
  parser2.pointSeen = false;
  parser2.hasExponent = false;
  if (segmentComplete(parser2)) finalizeSegment(parser2);
}
function finalizeSegment(parser2) {
  parser2.inSegment = false;
  if (parser2.absolute) parser2.segment = makeAbsolut(parser2);
  parser2.segments.push(parser2.segment);
}
function isArcFlag(parser2) {
  if (!parser2.segment.length) return false;
  const isArc = parser2.segment[0].toUpperCase() === "A";
  const length2 = parser2.segment.length;
  return isArc && (length2 === 4 || length2 === 5);
}
function isExponential(parser2) {
  return parser2.lastToken.toUpperCase() === "E";
}
var pathDelimiters = /* @__PURE__ */ new Set([
  " ",
  ",",
  "	",
  "\n",
  "\r",
  "\f"
]);
function pathParser(d, toAbsolute = true) {
  let index = 0;
  let token = "";
  const parser2 = {
    segment: [],
    inNumber: false,
    number: "",
    lastToken: "",
    inSegment: false,
    segments: [],
    pointSeen: false,
    hasExponent: false,
    absolute: toAbsolute,
    p0: new Point(),
    p: new Point()
  };
  while (parser2.lastToken = token, token = d.charAt(index++)) {
    if (!parser2.inSegment) {
      if (startNewSegment(parser2, token)) continue;
    }
    if (token === ".") {
      if (parser2.pointSeen || parser2.hasExponent) {
        finalizeNumber(parser2, false);
        --index;
        continue;
      }
      parser2.inNumber = true;
      parser2.pointSeen = true;
      parser2.number += token;
      continue;
    }
    if (!isNaN(parseInt(token))) {
      if (parser2.number === "0" || isArcFlag(parser2)) {
        parser2.inNumber = true;
        parser2.number = token;
        finalizeNumber(parser2, true);
        continue;
      }
      parser2.inNumber = true;
      parser2.number += token;
      continue;
    }
    if (pathDelimiters.has(token)) {
      if (parser2.inNumber) finalizeNumber(parser2, false);
      continue;
    }
    if (token === "-" || token === "+") {
      if (parser2.inNumber && !isExponential(parser2)) {
        finalizeNumber(parser2, false);
        --index;
        continue;
      }
      parser2.number += token;
      parser2.inNumber = true;
      continue;
    }
    if (token.toUpperCase() === "E") {
      parser2.number += token;
      parser2.hasExponent = true;
      continue;
    }
    if (isPathLetter.test(token)) {
      if (parser2.inNumber) finalizeNumber(parser2, false);
      else if (!segmentComplete(parser2)) throw new Error("parser Error");
      else finalizeSegment(parser2);
      --index;
    }
  }
  if (parser2.inNumber) finalizeNumber(parser2, false);
  if (parser2.inSegment && segmentComplete(parser2)) finalizeSegment(parser2);
  return parser2.segments;
}
function arrayToString(a) {
  let s = "";
  for (let i = 0, il = a.length; i < il; i++) {
    s += a[i][0];
    if (a[i][1] != null) {
      s += a[i][1];
      if (a[i][2] != null) {
        s += " ";
        s += a[i][2];
        if (a[i][3] != null) {
          s += " ";
          s += a[i][3];
          s += " ";
          s += a[i][4];
          if (a[i][5] != null) {
            s += " ";
            s += a[i][5];
            s += " ";
            s += a[i][6];
            if (a[i][7] != null) {
              s += " ";
              s += a[i][7];
            }
          }
        }
      }
    }
  }
  return s + " ";
}
var PathArray = class extends SVGArray {
  bbox() {
    parser().path.setAttribute("d", this.toString());
    return new Box(parser.nodes.path.getBBox());
  }
  move(x2, y2) {
    const box = this.bbox();
    x2 -= box.x;
    y2 -= box.y;
    if (!isNaN(x2) && !isNaN(y2)) for (let l, i = this.length - 1; i >= 0; i--) {
      l = this[i][0];
      if (l === "M" || l === "L" || l === "T") {
        this[i][1] += x2;
        this[i][2] += y2;
      } else if (l === "H") this[i][1] += x2;
      else if (l === "V") this[i][1] += y2;
      else if (l === "C" || l === "S" || l === "Q") {
        this[i][1] += x2;
        this[i][2] += y2;
        this[i][3] += x2;
        this[i][4] += y2;
        if (l === "C") {
          this[i][5] += x2;
          this[i][6] += y2;
        }
      } else if (l === "A") {
        this[i][6] += x2;
        this[i][7] += y2;
      }
    }
    return this;
  }
  parse(d = "M0 0") {
    if (Array.isArray(d)) d = Array.prototype.concat.apply([], d).toString();
    return pathParser(d);
  }
  size(width2, height2) {
    const box = this.bbox();
    let i, l;
    box.width = box.width === 0 ? 1 : box.width;
    box.height = box.height === 0 ? 1 : box.height;
    for (i = this.length - 1; i >= 0; i--) {
      l = this[i][0];
      if (l === "M" || l === "L" || l === "T") {
        this[i][1] = (this[i][1] - box.x) * width2 / box.width + box.x;
        this[i][2] = (this[i][2] - box.y) * height2 / box.height + box.y;
      } else if (l === "H") this[i][1] = (this[i][1] - box.x) * width2 / box.width + box.x;
      else if (l === "V") this[i][1] = (this[i][1] - box.y) * height2 / box.height + box.y;
      else if (l === "C" || l === "S" || l === "Q") {
        this[i][1] = (this[i][1] - box.x) * width2 / box.width + box.x;
        this[i][2] = (this[i][2] - box.y) * height2 / box.height + box.y;
        this[i][3] = (this[i][3] - box.x) * width2 / box.width + box.x;
        this[i][4] = (this[i][4] - box.y) * height2 / box.height + box.y;
        if (l === "C") {
          this[i][5] = (this[i][5] - box.x) * width2 / box.width + box.x;
          this[i][6] = (this[i][6] - box.y) * height2 / box.height + box.y;
        }
      } else if (l === "A") {
        this[i][1] = this[i][1] * width2 / box.width;
        this[i][2] = this[i][2] * height2 / box.height;
        this[i][6] = (this[i][6] - box.x) * width2 / box.width + box.x;
        this[i][7] = (this[i][7] - box.y) * height2 / box.height + box.y;
      }
    }
    return this;
  }
  toString() {
    return arrayToString(this);
  }
};
var getClassForType = (value) => {
  const type = typeof value;
  if (type === "number") return SVGNumber;
  else if (type === "string") if (Color.isColor(value)) return Color;
  else if (delimiter.test(value)) return isPathLetter.test(value) ? PathArray : SVGArray;
  else if (numberAndUnit.test(value)) return SVGNumber;
  else return NonMorphable;
  else if (morphableTypes.indexOf(value.constructor) > -1) return value.constructor;
  else if (Array.isArray(value)) return SVGArray;
  else if (type === "object") return ObjectBag;
  else return NonMorphable;
};
var Morphable = class {
  constructor(stepper) {
    this._stepper = stepper || new Ease("-");
    this._from = null;
    this._to = null;
    this._type = null;
    this._context = null;
    this._morphObj = null;
  }
  at(pos) {
    return this._morphObj.morph(this._from, this._to, pos, this._stepper, this._context);
  }
  done() {
    return this._context.map(this._stepper.done).reduce(function(last, curr) {
      return last && curr;
    }, true);
  }
  from(val) {
    if (val == null) return this._from;
    this._from = this._set(val);
    return this;
  }
  stepper(stepper) {
    if (stepper == null) return this._stepper;
    this._stepper = stepper;
    return this;
  }
  to(val) {
    if (val == null) return this._to;
    this._to = this._set(val);
    return this;
  }
  type(type) {
    if (type == null) return this._type;
    this._type = type;
    return this;
  }
  _set(value) {
    if (!this._type) this.type(getClassForType(value));
    let result = new this._type(value);
    if (this._type === Color) result = this._to ? result[this._to[4]]() : this._from ? result[this._from[4]]() : result;
    if (this._type === ObjectBag) result = this._to ? result.align(this._to) : this._from ? result.align(this._from) : result;
    result = result.toConsumable();
    this._morphObj = this._morphObj || new this._type();
    this._context = this._context || Array.apply(null, Array(result.length)).map(Object).map(function(o) {
      o.done = true;
      return o;
    });
    return result;
  }
};
var NonMorphable = class {
  constructor(...args) {
    this.init(...args);
  }
  init(val) {
    val = Array.isArray(val) ? val[0] : val;
    this.value = val;
    return this;
  }
  toArray() {
    return [this.value];
  }
  valueOf() {
    return this.value;
  }
};
var TransformBag = class TransformBag2 {
  constructor(...args) {
    this.init(...args);
  }
  init(obj) {
    if (Array.isArray(obj)) obj = {
      scaleX: obj[0],
      scaleY: obj[1],
      shear: obj[2],
      rotate: obj[3],
      translateX: obj[4],
      translateY: obj[5],
      originX: obj[6],
      originY: obj[7]
    };
    Object.assign(this, TransformBag2.defaults, obj);
    return this;
  }
  toArray() {
    const v = this;
    return [
      v.scaleX,
      v.scaleY,
      v.shear,
      v.rotate,
      v.translateX,
      v.translateY,
      v.originX,
      v.originY
    ];
  }
};
TransformBag.defaults = {
  scaleX: 1,
  scaleY: 1,
  shear: 0,
  rotate: 0,
  translateX: 0,
  translateY: 0,
  originX: 0,
  originY: 0
};
var sortByKey = (a, b) => {
  return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0;
};
var ObjectBag = class {
  constructor(...args) {
    this.init(...args);
  }
  align(other) {
    const values = this.values;
    for (let i = 0, il = values.length; i < il; ++i) {
      if (values[i + 1] === other[i + 1]) {
        if (values[i + 1] === Color && other[i + 7] !== values[i + 7]) {
          const space = other[i + 7];
          const color = new Color(this.values.splice(i + 3, 5))[space]().toArray();
          this.values.splice(i + 3, 0, ...color);
        }
        i += values[i + 2] + 2;
        continue;
      }
      if (!other[i + 1]) return this;
      const defaultObject = new other[i + 1]().toArray();
      const toDelete = values[i + 2] + 3;
      values.splice(i, toDelete, other[i], other[i + 1], other[i + 2], ...defaultObject);
      i += values[i + 2] + 2;
    }
    return this;
  }
  init(objOrArr) {
    this.values = [];
    if (Array.isArray(objOrArr)) {
      this.values = objOrArr.slice();
      return;
    }
    objOrArr = objOrArr || {};
    const entries2 = [];
    for (const i in objOrArr) {
      const Type = getClassForType(objOrArr[i]);
      const val = new Type(objOrArr[i]).toArray();
      entries2.push([
        i,
        Type,
        val.length,
        ...val
      ]);
    }
    entries2.sort(sortByKey);
    this.values = entries2.reduce((last, curr) => last.concat(curr), []);
    return this;
  }
  toArray() {
    return this.values;
  }
  valueOf() {
    const obj = {};
    const arr = this.values;
    while (arr.length) {
      const key2 = arr.shift();
      const Type = arr.shift();
      const num = arr.shift();
      obj[key2] = new Type(arr.splice(0, num));
    }
    return obj;
  }
};
var morphableTypes = [
  NonMorphable,
  TransformBag,
  ObjectBag
];
function registerMorphableType(type = []) {
  morphableTypes.push(...[].concat(type));
}
function makeMorphable() {
  extend(morphableTypes, {
    to(val) {
      return new Morphable().type(this.constructor).from(this.toArray()).to(val);
    },
    fromArray(arr) {
      this.init(arr);
      return this;
    },
    toConsumable() {
      return this.toArray();
    },
    morph(from2, to2, pos, stepper, context) {
      const mapper = function(i, index) {
        return stepper.step(i, to2[index], pos, context[index], context);
      };
      return this.fromArray(from2.map(mapper));
    }
  });
}
var Path = class extends Shape {
  constructor(node, attrs2 = node) {
    super(nodeOrNew("path", node), attrs2);
  }
  array() {
    return this._array || (this._array = new PathArray(this.attr("d")));
  }
  clear() {
    delete this._array;
    return this;
  }
  height(height2) {
    return height2 == null ? this.bbox().height : this.size(this.bbox().width, height2);
  }
  move(x2, y2) {
    return this.attr("d", this.array().move(x2, y2));
  }
  plot(d) {
    return d == null ? this.array() : this.clear().attr("d", typeof d === "string" ? d : this._array = new PathArray(d));
  }
  size(width2, height2) {
    const p = proportionalSize(this, width2, height2);
    return this.attr("d", this.array().size(p.width, p.height));
  }
  width(width2) {
    return width2 == null ? this.bbox().width : this.size(width2, this.bbox().height);
  }
  x(x2) {
    return x2 == null ? this.bbox().x : this.move(x2, this.bbox().y);
  }
  y(y2) {
    return y2 == null ? this.bbox().y : this.move(this.bbox().x, y2);
  }
};
Path.prototype.MorphArray = PathArray;
registerMethods({ Container: { path: wrapWithAttrCheck(function(d) {
  return this.put(new Path()).plot(d || new PathArray());
}) } });
register(Path, "Path");
var poly_exports = /* @__PURE__ */ __exportAll({
  array: () => array,
  clear: () => clear,
  move: () => move$2,
  plot: () => plot,
  size: () => size$1
});
function array() {
  return this._array || (this._array = new PointArray(this.attr("points")));
}
function clear() {
  delete this._array;
  return this;
}
function move$2(x2, y2) {
  return this.attr("points", this.array().move(x2, y2));
}
function plot(p) {
  return p == null ? this.array() : this.clear().attr("points", typeof p === "string" ? p : this._array = new PointArray(p));
}
function size$1(width2, height2) {
  const p = proportionalSize(this, width2, height2);
  return this.attr("points", this.array().size(p.width, p.height));
}
var Polygon = class extends Shape {
  constructor(node, attrs2 = node) {
    super(nodeOrNew("polygon", node), attrs2);
  }
};
registerMethods({ Container: { polygon: wrapWithAttrCheck(function(p) {
  return this.put(new Polygon()).plot(p || new PointArray());
}) } });
extend(Polygon, pointed_exports);
extend(Polygon, poly_exports);
register(Polygon, "Polygon");
var Polyline = class extends Shape {
  constructor(node, attrs2 = node) {
    super(nodeOrNew("polyline", node), attrs2);
  }
};
registerMethods({ Container: { polyline: wrapWithAttrCheck(function(p) {
  return this.put(new Polyline()).plot(p || new PointArray());
}) } });
extend(Polyline, pointed_exports);
extend(Polyline, poly_exports);
register(Polyline, "Polyline");
var Rect = class extends Shape {
  constructor(node, attrs2 = node) {
    super(nodeOrNew("rect", node), attrs2);
  }
};
extend(Rect, {
  rx,
  ry
});
registerMethods({ Container: { rect: wrapWithAttrCheck(function(width2, height2) {
  return this.put(new Rect()).size(width2, height2);
}) } });
register(Rect, "Rect");
var Queue = class {
  constructor() {
    this._first = null;
    this._last = null;
  }
  first() {
    return this._first && this._first.value;
  }
  last() {
    return this._last && this._last.value;
  }
  push(value) {
    const item = typeof value.next !== "undefined" ? value : {
      value,
      next: null,
      prev: null
    };
    if (this._last) {
      item.prev = this._last;
      this._last.next = item;
      this._last = item;
    } else {
      this._last = item;
      this._first = item;
    }
    return item;
  }
  remove(item) {
    if (item.prev) item.prev.next = item.next;
    if (item.next) item.next.prev = item.prev;
    if (item === this._last) this._last = item.prev;
    if (item === this._first) this._first = item.next;
    item.prev = null;
    item.next = null;
  }
  shift() {
    const remove2 = this._first;
    if (!remove2) return null;
    this._first = remove2.next;
    if (this._first) this._first.prev = null;
    this._last = this._first ? this._last : null;
    return remove2.value;
  }
};
var Animator = {
  nextDraw: null,
  frames: new Queue(),
  timeouts: new Queue(),
  immediates: new Queue(),
  timer: () => globals.window.performance || globals.window.Date,
  frame(fn) {
    const node = Animator.frames.push({ run: fn });
    if (Animator.nextDraw === null) Animator.nextDraw = globals.window.requestAnimationFrame(Animator._draw);
    return node;
  },
  timeout(fn, delay) {
    delay = delay || 0;
    const time = Animator.timer().now() + delay;
    const node = Animator.timeouts.push({
      run: fn,
      time
    });
    if (Animator.nextDraw === null) Animator.nextDraw = globals.window.requestAnimationFrame(Animator._draw);
    return node;
  },
  immediate(fn) {
    const node = Animator.immediates.push(fn);
    if (Animator.nextDraw === null) Animator.nextDraw = globals.window.requestAnimationFrame(Animator._draw);
    return node;
  },
  cancelFrame(node) {
    node != null && Animator.frames.remove(node);
  },
  clearTimeout(node) {
    node != null && Animator.timeouts.remove(node);
  },
  cancelImmediate(node) {
    node != null && Animator.immediates.remove(node);
  },
  _draw(now) {
    try {
      let nextTimeout = null;
      const lastTimeout = Animator.timeouts.last();
      while (nextTimeout = Animator.timeouts.shift()) {
        if (now >= nextTimeout.time) nextTimeout.run();
        else Animator.timeouts.push(nextTimeout);
        if (nextTimeout === lastTimeout) break;
      }
      let nextFrame = null;
      const lastFrame = Animator.frames.last();
      while (nextFrame !== lastFrame && (nextFrame = Animator.frames.shift())) nextFrame.run(now);
      let nextImmediate = null;
      while (nextImmediate = Animator.immediates.shift()) nextImmediate();
    } finally {
      const pending = Animator.timeouts.first() || Animator.frames.first() || Animator.immediates.first();
      Animator.nextDraw = pending ? globals.window.requestAnimationFrame(Animator._draw) : null;
    }
  }
};
var makeSchedule = function(runnerInfo) {
  const start = runnerInfo.start;
  const duration = runnerInfo.runner.duration();
  return {
    start,
    duration,
    end: start + duration,
    runner: runnerInfo.runner
  };
};
var defaultSource = function() {
  const w = globals.window;
  return (w.performance || w.Date).now();
};
var Timeline = class extends EventTarget {
  constructor(timeSource = defaultSource) {
    super();
    this._timeSource = timeSource;
    this.terminate();
  }
  active() {
    return !!this._nextFrame;
  }
  finish() {
    this._finishing = true;
    try {
      this.time(this.getEndTimeOfTimeline() + 1);
    } finally {
      this._finishing = false;
    }
    return this.pause();
  }
  getEndTime() {
    const lastRunnerInfo = this.getLastRunnerInfo();
    const lastDuration = lastRunnerInfo ? lastRunnerInfo.runner.duration() : 0;
    return (lastRunnerInfo ? lastRunnerInfo.start : this._time) + lastDuration;
  }
  getEndTimeOfTimeline() {
    const endTimes = this._runners.map((i) => i.start + i.runner.duration());
    return Math.max(0, ...endTimes);
  }
  getLastRunnerInfo() {
    return this.getRunnerInfoById(this._lastRunnerId);
  }
  getRunnerInfoById(id) {
    return this._runners[this._runnerIds.indexOf(id)] || null;
  }
  pause() {
    this._paused = true;
    return this._continue();
  }
  persist(dtOrForever) {
    if (dtOrForever == null) return this._persist;
    this._persist = dtOrForever;
    return this;
  }
  play() {
    this._paused = false;
    return this.updateTime()._continue();
  }
  reverse(yes) {
    const currentSpeed = this.speed();
    if (yes == null) return this.speed(-currentSpeed);
    const positive = Math.abs(currentSpeed);
    return this.speed(yes ? -positive : positive);
  }
  schedule(runner, delay, when) {
    if (runner == null) return this._runners.map(makeSchedule);
    let absoluteStartTime = 0;
    const endTime = this.getEndTime();
    delay = delay || 0;
    if (when == null || when === "last" || when === "after") absoluteStartTime = endTime;
    else if (when === "absolute" || when === "start") {
      absoluteStartTime = delay;
      delay = 0;
    } else if (when === "now") absoluteStartTime = this._time;
    else if (when === "relative") {
      const runnerInfo2 = this.getRunnerInfoById(runner.id);
      if (runnerInfo2) {
        absoluteStartTime = runnerInfo2.start + delay;
        delay = 0;
      }
    } else if (when === "with-last") {
      const lastRunnerInfo = this.getLastRunnerInfo();
      absoluteStartTime = lastRunnerInfo ? lastRunnerInfo.start : this._time;
    } else throw new Error('Invalid value for the "when" parameter');
    runner.unschedule();
    runner.timeline(this);
    runner._retired = false;
    const persist = runner.persist();
    const runnerInfo = {
      persist: persist === null ? this._persist : persist,
      start: absoluteStartTime + delay,
      runner
    };
    this._lastRunnerId = runner.id;
    runner._runnerInfo = runnerInfo;
    this._runners.push(runnerInfo);
    this._runners.sort((a, b) => a.start - b.start);
    this._runnerIds = this._runners.map((info) => info.runner.id);
    this.updateTime()._continue();
    return this;
  }
  seek(dt) {
    return this.time(this._time + dt);
  }
  source(fn) {
    if (fn == null) return this._timeSource;
    this._timeSource = fn;
    return this;
  }
  speed(speed) {
    if (speed == null) return this._speed;
    this._speed = speed;
    return this;
  }
  stop() {
    this.time(0);
    return this.pause();
  }
  time(time) {
    if (time == null) return this._time;
    this._time = time;
    return this._continue(true);
  }
  unschedule(runner) {
    const index = this._runnerIds.indexOf(runner.id);
    if (index < 0) return this;
    this._runners.splice(index, 1);
    this._runnerIds.splice(index, 1);
    runner.timeline(null);
    runner._runnerInfo = null;
    runner._retired = true;
    return this;
  }
  updateTime() {
    if (!this.active()) this._lastSourceTime = this._timeSource();
    return this;
  }
  _continue(immediateStep = false) {
    Animator.cancelFrame(this._nextFrame);
    this._nextFrame = null;
    if (immediateStep) return this._stepImmediate();
    if (this._paused) return this;
    this._nextFrame = Animator.frame(this._step);
    return this;
  }
  _stepFn(immediateStep = false) {
    const generation = this._generation;
    const time = this._timeSource();
    let dtSource = time - this._lastSourceTime;
    if (immediateStep) dtSource = 0;
    const dtTime = this._speed * dtSource + (this._time - this._lastStepTime);
    this._lastSourceTime = time;
    if (!immediateStep) {
      this._time += dtTime;
      this._time = this._time < 0 ? 0 : this._time;
    }
    this._lastStepTime = this._time;
    this.fire("time", this._time);
    const scheduled = this._runners.slice();
    for (let k = scheduled.length; k--; ) {
      const runnerInfo = scheduled[k];
      if (runnerInfo.runner._runnerInfo !== runnerInfo) continue;
      const runner = runnerInfo.runner;
      if (this._time - runnerInfo.start < 0) runner.reset(true);
    }
    let runnersLeft = false;
    for (const runnerInfo of this._runners.slice()) {
      if (runnerInfo.runner._runnerInfo !== runnerInfo) continue;
      const runner = runnerInfo.runner;
      let dt = dtTime;
      const dtToStart = this._time - runnerInfo.start;
      if (dtToStart < 0) {
        runnersLeft = true;
        continue;
      } else if (dtToStart === 0) {
        runner.reset();
        runnersLeft = true;
        continue;
      } else if (dtToStart < dt) dt = dtToStart;
      if (!runner.active()) continue;
      const finished = (this._finishing && runner._isDeclarative ? runner.finish() : runner.step(dt)).done;
      if (runner._runnerInfo !== runnerInfo) continue;
      if (!finished) runnersLeft = true;
      else if (runnerInfo.persist !== true) {
        if (runner.duration() - runner.time() + this._time + runnerInfo.persist <= this._time) runner.unschedule();
      }
    }
    if (generation !== this._generation) return this;
    if (!runnersLeft) runnersLeft = this._runners.some(({ start, runner }) => start >= this._time || runner.active() && !runner.done);
    if (runnersLeft && !(this._speed < 0 && this._time === 0) || this._runnerIds.length && this._speed < 0 && this._time > 0) this._continue();
    else {
      this.pause();
      this.fire("finished");
    }
    return this;
  }
  terminate() {
    Animator.cancelFrame(this._nextFrame);
    this._generation = (this._generation || 0) + 1;
    this._startTime = 0;
    this._speed = 1;
    this._persist = 0;
    for (const { runner } of this._runners || []) {
      runner._retired = true;
      runner._runnerInfo = null;
    }
    this._nextFrame = null;
    this._paused = true;
    this._finishing = false;
    this._runners = [];
    this._runnerIds = [];
    this._lastRunnerId = -1;
    this._time = 0;
    this._lastSourceTime = 0;
    this._lastStepTime = 0;
    this._step = this._stepFn.bind(this, false);
    this._stepImmediate = this._stepFn.bind(this, true);
  }
};
registerMethods({ Element: { timeline: function(timeline2) {
  if (timeline2 == null) {
    this._timeline = this._timeline || new Timeline();
    return this._timeline;
  } else {
    this._timeline = timeline2;
    return this;
  }
} } });
var Runner = class Runner2 extends EventTarget {
  constructor(options) {
    super();
    this.id = Runner2.id++;
    options = options == null ? timeline.duration : options;
    options = typeof options === "function" ? new Controller(options) : options;
    this._element = null;
    this._timeline = null;
    this._runnerInfo = null;
    this.done = false;
    this._queue = [];
    this._duration = typeof options === "number" && options;
    this._isDeclarative = options instanceof Controller;
    this._stepper = this._isDeclarative ? options : new Ease();
    this._history = {};
    this.enabled = true;
    this._time = 0;
    this._lastTime = 0;
    this._reseted = true;
    this.transforms = new Matrix();
    this._isAbsoluteTransform = false;
    this._hasTransform = false;
    this._transformInitialised = false;
    this._transformActive = false;
    this._retired = false;
    this._reverse = false;
    this._swing = false;
    this._wait = 0;
    this._times = 1;
    this._persist = this._isDeclarative ? true : null;
  }
  static sanitise(duration, delay, when) {
    let times = 1;
    let swing = false;
    let wait = 0;
    duration = duration ?? timeline.duration;
    delay = delay ?? timeline.delay;
    when = when || "last";
    if (typeof duration === "object" && !(duration instanceof Stepper)) {
      delay = duration.delay ?? delay;
      when = duration.when ?? when;
      swing = duration.swing || swing;
      times = duration.times ?? times;
      wait = duration.wait ?? wait;
      duration = duration.duration ?? timeline.duration;
    }
    return {
      duration,
      delay,
      swing,
      times,
      wait,
      when
    };
  }
  active(enabled) {
    if (enabled == null) return this.enabled;
    this.enabled = enabled;
    return this;
  }
  addTransform(transform2) {
    this.transforms.lmultiplyO(transform2);
    this._transformInitialised = true;
    this._transformActive = true;
    return this;
  }
  after(fn) {
    return this.on("finished", fn);
  }
  animate(duration, delay, when) {
    const o = Runner2.sanitise(duration, delay, when);
    const runner = new Runner2(o.duration);
    if (this._timeline) runner.timeline(this._timeline);
    if (this._element) runner.element(this._element);
    return runner.loop(o).schedule(o.delay, o.when);
  }
  clearTransform() {
    this.transforms = new Matrix();
    return this;
  }
  delay(delay) {
    return this.animate(0, delay);
  }
  duration() {
    return this._times * (this._wait + this._duration) - this._wait;
  }
  during(fn) {
    return this.queue(null, fn);
  }
  ease(fn) {
    this._stepper = new Ease(fn);
    return this;
  }
  element(element) {
    if (element == null) return this._element;
    this._element = element;
    element._prepareRunner();
    return this;
  }
  finish() {
    if (!this._isDeclarative) return this.time(this.duration());
    const time = this._time;
    this.step(Infinity);
    this._time = time;
    return this;
  }
  loop(times, swing, wait) {
    if (typeof times === "object") {
      swing = times.swing;
      wait = times.wait;
      times = times.times;
    }
    this._times = times || Infinity;
    this._swing = swing || false;
    this._wait = wait || 0;
    if (this._times === true) this._times = Infinity;
    return this;
  }
  loops(p) {
    const loopDuration = this._duration + this._wait;
    if (p == null) {
      const loopsDone = Math.floor(this._time / loopDuration);
      const position2 = (this._time - loopsDone * loopDuration) / this._duration;
      return Math.min(loopsDone + position2, this._times);
    }
    const whole = Math.floor(p);
    const partial = p % 1;
    const time = loopDuration * whole + this._duration * partial;
    return this.time(time);
  }
  persist(dtOrForever) {
    if (dtOrForever == null) return this._persist;
    this._persist = dtOrForever;
    return this;
  }
  position(p) {
    const x2 = this._time;
    const d = this._duration;
    const w = this._wait;
    const t = this._times;
    const s = this._swing;
    const r = this._reverse;
    let position2;
    if (p == null) {
      const f = function(x3) {
        const swinging = s * Math.floor(x3 % (2 * (w + d)) / (w + d));
        const backwards = swinging && !r || !swinging && r;
        const uncliped = Math.pow(-1, backwards) * (x3 % (w + d)) / d + backwards;
        return Math.max(Math.min(uncliped, 1), 0);
      };
      const endTime = t * (w + d) - w;
      position2 = x2 <= 0 ? Math.round(f(1e-5)) : x2 < endTime ? f(x2) : Math.round(f(endTime - 1e-5));
      return position2;
    }
    const loopsDone = Math.floor(this.loops());
    const swingForward = s && loopsDone % 2 === 0;
    position2 = loopsDone + (swingForward && !r || r && swingForward ? p : 1 - p);
    return this.loops(position2);
  }
  progress(p) {
    if (p == null) return Math.min(1, this._time / this.duration());
    return this.time(p * this.duration());
  }
  queue(initFn, runFn, retargetFn, isTransform) {
    if (this._isDeclarative) this.done = false;
    this._queue.push({
      initialiser: initFn || noop,
      runner: runFn || noop,
      retarget: retargetFn,
      isTransform,
      initialised: false,
      finished: false
    });
    this.timeline() && this.timeline()._continue();
    return this;
  }
  reset(deactivateTransform = false) {
    if (this._reseted) {
      const transformActive = !deactivateTransform && this._hasTransform && this.position() !== 0;
      if (transformActive && !this._transformInitialised) {
        this.step(0);
        this._reseted = true;
        return this;
      }
      if (transformActive !== this._transformActive) {
        this._transformActive = transformActive;
        this._element && this._element._addRunner(this);
      }
      return this;
    }
    if (!this._reseted) {
      this.time(0);
      this._reseted = true;
    }
    if (deactivateTransform && this._transformActive) {
      this._transformActive = false;
      this._element && this._element._addRunner(this);
    }
    return this;
  }
  reverse(reverse) {
    this._reverse = reverse == null ? !this._reverse : reverse;
    return this;
  }
  schedule(timeline2, delay, when) {
    if (!(timeline2 instanceof Timeline)) {
      when = delay;
      delay = timeline2;
      timeline2 = this.timeline();
    }
    if (!timeline2) throw Error("Runner cannot be scheduled without timeline");
    timeline2.schedule(this, delay, when);
    return this;
  }
  step(dt) {
    if (!this.enabled) return this;
    const wasDone = this.done;
    dt = dt == null ? 16 : dt;
    this._time += dt;
    const position2 = this.position();
    const running = this._lastPosition !== position2 && this._time >= 0;
    this._lastPosition = position2;
    const duration = this.duration();
    const justStarted = this._lastTime <= 0 && this._time > 0;
    this._lastTime = this._time;
    if (justStarted) this.fire("start", this);
    const declarative = this._isDeclarative;
    this.done = !declarative && this._time >= duration;
    this._reseted = false;
    const transformActive = this._hasTransform && (this._time > 0 || position2 !== 0);
    this._transformActive = transformActive;
    let converged = false;
    if (running || declarative) {
      this._initialise(running);
      this.transforms = new Matrix();
      converged = this._run(declarative ? dt : position2);
      this._transformActive = transformActive;
      this.fire("step", this);
    }
    this.done = this.done || converged && declarative;
    if (this.done && !wasDone) this.fire("finished", this);
    return this;
  }
  time(time) {
    if (time == null) return this._time;
    const dt = time - this._time;
    this.step(dt);
    return this;
  }
  timeline(timeline2) {
    if (typeof timeline2 === "undefined") return this._timeline;
    this._timeline = timeline2;
    return this;
  }
  unschedule() {
    const timeline2 = this.timeline();
    timeline2 && timeline2.unschedule(this);
    return this;
  }
  _initialise(running) {
    if (!running && !this._isDeclarative) return;
    for (let i = 0, len = this._queue.length; i < len; ++i) {
      const current = this._queue[i];
      const needsIt = this._isDeclarative || !current.initialised && running;
      running = !current.finished;
      if (needsIt && running) {
        current.initialiser.call(this);
        current.initialised = true;
      }
    }
  }
  _rememberMorpher(method, morpher) {
    this._history[method] = {
      morpher,
      caller: this._queue[this._queue.length - 1]
    };
    if (this._isDeclarative) {
      const timeline2 = this.timeline();
      timeline2 && timeline2.play();
    }
  }
  _run(positionOrDt) {
    let allfinished = true;
    for (let i = 0, len = this._queue.length; i < len; ++i) {
      const current = this._queue[i];
      if (this._isDeclarative && current.finished && !current.isTransform) continue;
      const converged = current.runner.call(this, positionOrDt);
      current.finished = current.finished || converged === true;
      allfinished = allfinished && current.finished;
    }
    return allfinished;
  }
  _tryRetarget(method, target, extra) {
    if (this._history[method]) {
      if (!this._history[method].caller.initialised) {
        const index = this._queue.indexOf(this._history[method].caller);
        this._queue.splice(index, 1);
        return false;
      }
      if (this._history[method].caller.retarget) this._history[method].caller.retarget.call(this, target, extra);
      else this._history[method].morpher.to(target);
      this._history[method].caller.finished = false;
      if (this._isDeclarative) this.done = false;
      const timeline2 = this.timeline();
      timeline2 && timeline2.play();
      return true;
    }
    return false;
  }
};
Runner.id = 0;
var FakeRunner = class {
  constructor(transforms2 = new Matrix(), id = -1, done = true, isAbsoluteTransform = false) {
    this.transforms = transforms2;
    this.id = id;
    this.done = done;
    this._isAbsoluteTransform = isAbsoluteTransform;
    this._transformActive = true;
    this._retired = true;
  }
};
extend([Runner, FakeRunner], { mergeWith(runner) {
  return new FakeRunner(this._isAbsoluteTransform ? this.transforms : runner.transforms.lmultiply(this.transforms), runner.id, true, runner._isAbsoluteTransform || this._isAbsoluteTransform);
} });
var lmultiply = (last, curr) => last.lmultiplyO(curr);
var getRunnerTransform = (runner) => runner.transforms;
var isActiveTransform = (runner) => runner._transformActive;
function activeTransformRunners(runners) {
  const activeRunners = runners.filter(isActiveTransform);
  let firstRunner = 0;
  for (let i = 0; i < activeRunners.length; ++i) if (activeRunners[i]._isAbsoluteTransform) firstRunner = i;
  return activeRunners.slice(firstRunner);
}
function mergeTransforms() {
  const netTransform = activeTransformRunners(this._transformationRunners.runners).map(getRunnerTransform).reduce(lmultiply, new Matrix());
  this.transform(netTransform);
  this._transformationRunners.merge();
  if (this._transformationRunners.length() === 1) this._frameId = null;
}
var RunnerArray = class {
  constructor() {
    this.runners = [];
  }
  add(runner) {
    var _context;
    if ((0, import_includes.default)(_context = this.runners).call(_context, runner)) return;
    this.runners.push(runner);
    return this;
  }
  edit(id, newRunner) {
    const index = this.runners.findIndex((runner) => runner.id === id);
    if (index >= 0) this.runners.splice(index, 1, newRunner);
    return this;
  }
  getByID(id) {
    return this.runners.find((runner) => runner.id === id);
  }
  length() {
    return this.runners.length;
  }
  merge() {
    let lastRunner = null;
    for (let i = 0; i < this.runners.length; ++i) {
      const runner = this.runners[i];
      if (lastRunner && runner.done && lastRunner.done && runner._retired && lastRunner._retired) {
        this.remove(runner.id);
        const newRunner = runner.mergeWith(lastRunner);
        this.edit(lastRunner.id, newRunner);
        lastRunner = newRunner;
        --i;
      } else lastRunner = runner;
    }
    return this;
  }
  remove(id) {
    const index = this.runners.findIndex((runner) => runner.id === id);
    if (index >= 0) this.runners.splice(index, 1);
    return this;
  }
};
registerMethods({ Element: {
  animate(duration, delay, when) {
    const o = Runner.sanitise(duration, delay, when);
    const timeline2 = this.timeline();
    return new Runner(o.duration).loop(o).element(this).timeline(timeline2.play()).schedule(o.delay, o.when);
  },
  delay(by, when) {
    return this.animate(0, by, when);
  },
  _currentTransform(current) {
    const runners = this._transformationRunners.runners;
    const currentIndex = runners.indexOf(current);
    return activeTransformRunners(runners.slice(0, currentIndex + 1)).map(getRunnerTransform).reduce(lmultiply, new Matrix());
  },
  _addRunner(runner) {
    if (this._transformationRunners.length() === 1 && this._transformationRunners.runners[0].id === -1) this._transformationRunners.runners[0].transforms = new Matrix(this);
    this._transformationRunners.add(runner);
    Animator.cancelImmediate(this._frameId);
    this._frameId = Animator.immediate(mergeTransforms.bind(this));
  },
  _prepareRunner() {
    if (this._frameId == null) this._transformationRunners = new RunnerArray().add(new FakeRunner(new Matrix(this)));
  }
} });
var difference = (a, b) => a.filter((x2) => !(0, import_includes.default)(b).call(b, x2));
extend(Runner, {
  attr(a, v) {
    return this.styleAttr("attr", a, v);
  },
  css(s, v) {
    return this.styleAttr("css", s, v);
  },
  styleAttr(type, nameOrAttrs, val) {
    if (typeof nameOrAttrs === "string") return this.styleAttr(type, { [nameOrAttrs]: val });
    const attrs2 = nameOrAttrs;
    const history = this._history[type];
    if (history && !history.caller.initialised && history.caller.retarget) {
      history.caller.retarget.call(this, attrs2);
      return this;
    }
    if (this._tryRetarget(type, attrs2)) return this;
    let morpher = new Morphable(this._stepper).to(attrs2);
    let keys2 = Object.keys(attrs2);
    this.queue(function() {
      morpher = morpher.from(this.element()[type](keys2));
    }, function(pos) {
      this.element()[type](morpher.at(pos).valueOf());
      return morpher.done();
    }, function(newToAttrs) {
      const differences = difference(Object.keys(newToAttrs), keys2);
      if (differences.length && morpher.from() != null) {
        const addedFromAttrs = this.element()[type](differences);
        const oldFromAttrs = new ObjectBag(morpher.from()).valueOf();
        Object.assign(oldFromAttrs, addedFromAttrs);
        morpher.from(oldFromAttrs);
      }
      const mergedToAttrs = new ObjectBag(morpher.to()).valueOf();
      Object.assign(mergedToAttrs, newToAttrs);
      morpher.to(mergedToAttrs);
      keys2 = Object.keys(mergedToAttrs);
    });
    this._rememberMorpher(type, morpher);
    return this;
  },
  zoom(level, point2) {
    if (this._tryRetarget("zoom", level, point2)) return this;
    let morpher = new Morphable(this._stepper).to(new SVGNumber(level));
    this.queue(function() {
      morpher = morpher.from(this.element().zoom());
    }, function(pos) {
      this.element().zoom(morpher.at(pos), point2);
      return morpher.done();
    }, function(newLevel, newPoint) {
      point2 = newPoint;
      morpher.to(newLevel);
    });
    this._rememberMorpher("zoom", morpher);
    return this;
  },
  /**
  ** absolute transformations
  **/
  transform(transforms2, relative, affine) {
    relative = transforms2.relative || relative;
    this._hasTransform = true;
    this._isAbsoluteTransform = this._isAbsoluteTransform || !relative;
    if (this._isDeclarative && !relative && this._tryRetarget("transform", transforms2)) return this;
    const isMatrix = Matrix.isMatrixLike(transforms2);
    affine = transforms2.affine != null ? transforms2.affine : affine != null ? affine : !isMatrix;
    const morpher = new Morphable(this._stepper).type(affine ? TransformBag : Matrix);
    const matrixMorpher = affine ? new Morphable(this._stepper).type(Matrix) : morpher;
    let origin;
    let element;
    let current;
    let currentAngle;
    let startTransform;
    function setup() {
      element = element || this.element();
      origin = origin || getOrigin(transforms2, element);
      startTransform = new Matrix(relative ? void 0 : element);
      element._addRunner(this);
    }
    function run(pos) {
      if (!relative) this.clearTransform();
      const { x: x2, y: y2 } = new Point(origin).transform(element._currentTransform(this));
      const targetTransforms = {
        ...transforms2,
        origin: [x2, y2]
      };
      if (targetTransforms.relative === true) delete targetTransforms.relative;
      let target = new Matrix(targetTransforms);
      let start = this._isDeclarative && current ? current : startTransform;
      let activeMorpher = morpher;
      if (affine) {
        const targetParameters = target.decompose(x2, y2);
        const startParameters = start.decompose(x2, y2);
        if (!new TransformBag(targetParameters).toArray().concat(new TransformBag(startParameters).toArray()).every(Number.isFinite)) activeMorpher = matrixMorpher;
        else {
          target = targetParameters;
          start = startParameters;
          const rTarget = target.rotate;
          const rCurrent = start.rotate;
          const possibilities = [
            rTarget - 360,
            rTarget,
            rTarget + 360
          ];
          const distances = possibilities.map((a) => Math.abs(a - rCurrent));
          const shortest = Math.min(...distances);
          const index = distances.indexOf(shortest);
          target.rotate = possibilities[index];
        }
      }
      if (relative && activeMorpher === morpher) {
        if (!isMatrix) target.rotate = transforms2.rotate || 0;
        if (this._isDeclarative && currentAngle) start.rotate = currentAngle;
      }
      activeMorpher.from(start);
      activeMorpher.to(target);
      const affineParameters = activeMorpher.at(pos);
      currentAngle = affineParameters.rotate;
      current = new Matrix(affineParameters);
      this.addTransform(current);
      element._addRunner(this);
      return activeMorpher.done();
    }
    function retarget(newTransforms) {
      origin = getOrigin(newTransforms, element);
      transforms2 = { ...newTransforms };
    }
    this.queue(setup, run, retarget, true);
    this._isDeclarative && this._rememberMorpher("transform", morpher);
    return this;
  },
  x(x2) {
    return this._queueNumber("x", x2);
  },
  y(y2) {
    return this._queueNumber("y", y2);
  },
  ax(x2) {
    return this._queueNumber("ax", x2);
  },
  ay(y2) {
    return this._queueNumber("ay", y2);
  },
  dx(x2 = 0) {
    return this._queueNumberDelta("x", x2);
  },
  dy(y2 = 0) {
    return this._queueNumberDelta("y", y2);
  },
  dmove(x2, y2) {
    return this.dx(x2).dy(y2);
  },
  _queueNumberDelta(method, to2) {
    to2 = new SVGNumber(to2);
    if (this._tryRetarget(method, to2)) return this;
    const morpher = new Morphable(this._stepper).to(to2);
    let from2 = null;
    this.queue(function() {
      from2 = this.element()[method]();
      morpher.from(from2);
      morpher.to(from2 + to2);
    }, function(pos) {
      this.element()[method](morpher.at(pos));
      return morpher.done();
    }, function(newTo) {
      morpher.to(from2 + new SVGNumber(newTo));
    });
    this._rememberMorpher(method, morpher);
    return this;
  },
  _queueObject(method, to2) {
    if (this._tryRetarget(method, to2)) return this;
    const morpher = new Morphable(this._stepper).to(to2);
    this.queue(function() {
      morpher.from(this.element()[method]());
    }, function(pos) {
      this.element()[method](morpher.at(pos));
      return morpher.done();
    });
    this._rememberMorpher(method, morpher);
    return this;
  },
  _queueNumber(method, value) {
    return this._queueObject(method, new SVGNumber(value));
  },
  cx(x2) {
    return this._queueNumber("cx", x2);
  },
  cy(y2) {
    return this._queueNumber("cy", y2);
  },
  move(x2, y2) {
    return this.x(x2).y(y2);
  },
  amove(x2, y2) {
    return this.ax(x2).ay(y2);
  },
  center(x2, y2) {
    return this.cx(x2).cy(y2);
  },
  size(width2, height2) {
    const size2 = proportionalSize(this._element, width2, height2);
    return this.width(size2.width).height(size2.height);
  },
  width(width2) {
    return this._queueNumber("width", width2);
  },
  height(height2) {
    return this._queueNumber("height", height2);
  },
  plot(a, b, c, d) {
    if (arguments.length === 4) return this.plot([
      a,
      b,
      c,
      d
    ]);
    if (this._tryRetarget("plot", a)) return this;
    const morpher = new Morphable(this._stepper).type(this._element.MorphArray).to(a);
    this.queue(function() {
      morpher.from(this._element.array());
    }, function(pos) {
      this._element.plot(morpher.at(pos));
      return morpher.done();
    });
    this._rememberMorpher("plot", morpher);
    return this;
  },
  leading(value) {
    return this._queueNumber("leading", value);
  },
  viewbox(x2, y2, width2, height2) {
    return this._queueObject("viewbox", new Box(x2, y2, width2, height2));
  },
  update(o) {
    if (typeof o !== "object") return this.update({
      offset: arguments[0],
      color: arguments[1],
      opacity: arguments[2]
    });
    if (o.opacity != null) this.attr("stop-opacity", o.opacity);
    if (o.color != null) this.attr("stop-color", o.color);
    if (o.offset != null) this.attr("offset", o.offset);
    return this;
  }
});
extend(Runner, {
  rx,
  ry,
  from,
  to
});
register(Runner, "Runner");
var Svg = class extends Container {
  constructor(node, attrs2 = node) {
    super(nodeOrNew("svg", node), attrs2);
    this.namespace();
  }
  defs() {
    if (!this.isRoot()) return this.root().defs();
    return adopt(this.node.querySelector("defs")) || this.put(new Defs());
  }
  isRoot() {
    return !this.node.parentNode || !(this.node.parentNode instanceof globals.window.SVGElement) && this.node.parentNode.nodeName !== "#document-fragment";
  }
  namespace() {
    if (!this.isRoot()) return this.root().namespace();
    return this.attr({
      xmlns: svg,
      version: "1.1"
    }).attr("xmlns:xlink", xlink, xmlns);
  }
  removeNamespace() {
    return this.attr({
      xmlns: null,
      version: null
    }).attr("xmlns:xlink", null, xmlns).attr("xmlns:svgjs", null, xmlns);
  }
  root() {
    if (this.isRoot()) return this;
    return super.root();
  }
};
registerMethods({ Container: { nested: wrapWithAttrCheck(function() {
  return this.put(new Svg());
}) } });
register(Svg, "Svg", true);
var Symbol$1 = class extends Container {
  constructor(node, attrs2 = node) {
    super(nodeOrNew("symbol", node), attrs2);
  }
};
registerMethods({ Container: { symbol: wrapWithAttrCheck(function() {
  return this.put(new Symbol$1());
}) } });
register(Symbol$1, "Symbol");
var textable_exports = /* @__PURE__ */ __exportAll({
  amove: () => amove,
  ax: () => ax,
  ay: () => ay,
  build: () => build,
  center: () => center,
  cx: () => cx,
  cy: () => cy,
  length: () => length,
  move: () => move$1,
  plain: () => plain,
  x: () => x$1,
  y: () => y$1
});
function plain(text) {
  if (this._build === false) this.clear();
  this.node.appendChild(globals.document.createTextNode(text));
  return this;
}
function length() {
  return this.node.getComputedTextLength();
}
function x$1(x2, box = this.bbox()) {
  if (x2 == null) return box.x;
  return this.attr("x", this.attr("x") + x2 - box.x);
}
function y$1(y2, box = this.bbox()) {
  if (y2 == null) return box.y;
  return this.attr("y", this.attr("y") + y2 - box.y);
}
function move$1(x2, y2, box = this.bbox()) {
  return this.x(x2, box).y(y2, box);
}
function cx(x2, box = this.bbox()) {
  if (x2 == null) return box.cx;
  return this.attr("x", this.attr("x") + x2 - box.cx);
}
function cy(y2, box = this.bbox()) {
  if (y2 == null) return box.cy;
  return this.attr("y", this.attr("y") + y2 - box.cy);
}
function center(x2, y2, box = this.bbox()) {
  return this.cx(x2, box).cy(y2, box);
}
function ax(x2) {
  return this.attr("x", x2);
}
function ay(y2) {
  return this.attr("y", y2);
}
function amove(x2, y2) {
  return this.ax(x2).ay(y2);
}
function build(build2) {
  this._build = !!build2;
  return this;
}
var Text8 = class extends Shape {
  constructor(node, attrs2 = node) {
    super(nodeOrNew("text", node), attrs2);
    this.dom.leading = this.dom.leading ?? new SVGNumber(1.3);
    this._rebuild = true;
    this._build = false;
  }
  leading(value) {
    if (value == null) return this.dom.leading;
    this.dom.leading = new SVGNumber(value);
    return this.rebuild();
  }
  rebuild(rebuild) {
    if (typeof rebuild === "boolean") this._rebuild = rebuild;
    if (this._rebuild) {
      const self2 = this;
      let blankLineOffset = 0;
      const leading = this.dom.leading;
      this.each(function(i) {
        if (isDescriptive(this.node)) return;
        const fontSize = globals.window.getComputedStyle(this.node).getPropertyValue("font-size");
        const dy2 = leading * new SVGNumber(fontSize);
        if (this.dom.newLined) {
          this.attr("x", self2.attr("x"));
          if (this.text() === "\n") blankLineOffset += dy2;
          else {
            this.attr("dy", i ? dy2 + blankLineOffset : 0);
            blankLineOffset = 0;
          }
        }
      });
      this.fire("rebuild");
    }
    return this;
  }
  setData(o) {
    this.dom = o;
    this.dom.leading = new SVGNumber(o.leading || 1.3);
    return this;
  }
  writeDataToDom() {
    return super.writeDataToDom({ leading: 1.3 });
  }
  text(text) {
    if (text === void 0) {
      const children = this.node.childNodes;
      let firstLine = 0;
      text = "";
      for (let i = 0, len = children.length; i < len; ++i) {
        if (children[i].nodeName === "textPath" || isDescriptive(children[i])) {
          if (i === 0) firstLine = i + 1;
          continue;
        }
        if (i !== firstLine && children[i].nodeType !== 3 && adopt(children[i]).dom.newLined === true) text += "\n";
        text += children[i].textContent;
      }
      return text;
    }
    this.clear().build(true);
    if (typeof text === "function") text.call(this, this);
    else {
      text = (text + "").split("\n");
      for (let j = 0, jl = text.length; j < jl; j++) this.newLine(text[j]);
    }
    return this.build(false).rebuild();
  }
};
extend(Text8, textable_exports);
registerMethods({ Container: {
  text: wrapWithAttrCheck(function(text = "") {
    return this.put(new Text8()).text(text);
  }),
  plain: wrapWithAttrCheck(function(text = "") {
    return this.put(new Text8()).plain(text);
  })
} });
register(Text8, "Text");
var Tspan = class extends Shape {
  constructor(node, attrs2 = node) {
    super(nodeOrNew("tspan", node), attrs2);
    this._build = false;
  }
  dx(dx2) {
    return this.attr("dx", dx2);
  }
  dy(dy2) {
    return this.attr("dy", dy2);
  }
  newLine() {
    this.dom.newLined = true;
    const text = this.parent();
    if (!(text instanceof Text8)) return this;
    const i = text.index(this);
    const fontSize = globals.window.getComputedStyle(this.node).getPropertyValue("font-size");
    const dy2 = text.dom.leading * new SVGNumber(fontSize);
    return this.dy(i ? dy2 : 0).attr("x", text.x());
  }
  text(text) {
    if (text == null) return this.node.textContent + (this.dom.newLined ? "\n" : "");
    if (typeof text === "function") {
      this.clear().build(true);
      text.call(this, this);
      this.build(false);
    } else this.plain(text);
    return this;
  }
};
extend(Tspan, textable_exports);
registerMethods({
  Tspan: { tspan: wrapWithAttrCheck(function(text = "") {
    const tspan = new Tspan();
    if (!this._build) this.clear();
    return this.put(tspan).text(text);
  }) },
  Text: { newLine: function(text = "") {
    return this.tspan(text).newLine();
  } }
});
register(Tspan, "Tspan");
var Circle = class extends Shape {
  constructor(node, attrs2 = node) {
    super(nodeOrNew("circle", node), attrs2);
  }
  radius(r) {
    return this.attr("r", r);
  }
  rx(rx2) {
    return this.attr("r", rx2);
  }
  ry(ry2) {
    return this.rx(ry2);
  }
  size(size2) {
    return this.radius(new SVGNumber(size2).divide(2));
  }
};
extend(Circle, {
  x: x$3,
  y: y$3,
  cx: cx$1,
  cy: cy$1,
  width: width$2,
  height: height$2
});
registerMethods({ Container: { circle: wrapWithAttrCheck(function(size2 = 0) {
  return this.put(new Circle()).size(size2).move(0, 0);
}) } });
register(Circle, "Circle");
var ClipPath = class extends Container {
  constructor(node, attrs2 = node) {
    super(nodeOrNew("clipPath", node), attrs2);
  }
  remove() {
    this.targets().forEach(function(el) {
      el.unclip();
    });
    return super.remove();
  }
  targets() {
    return findReferences(this.node, "clip-path");
  }
};
registerMethods({
  Container: { clip: wrapWithAttrCheck(function() {
    return this.defs().put(new ClipPath());
  }) },
  Element: {
    clipper() {
      return this.reference("clip-path");
    },
    clipWith(element) {
      const clipper = element instanceof ClipPath ? element : this.parent().clip().add(element);
      return this.attr("clip-path", "url(#" + clipper.id() + ")");
    },
    unclip() {
      return this.attr("clip-path", null);
    }
  }
});
register(ClipPath, "ClipPath");
var ForeignObject = class extends Element4 {
  constructor(node, attrs2 = node) {
    super(nodeOrNew("foreignObject", node), attrs2);
  }
};
registerMethods({ Container: { foreignObject: wrapWithAttrCheck(function(width2, height2) {
  return this.put(new ForeignObject()).size(width2, height2);
}) } });
register(ForeignObject, "ForeignObject");
var containerGeometry_exports = /* @__PURE__ */ __exportAll({
  dmove: () => dmove,
  dx: () => dx,
  dy: () => dy,
  height: () => height,
  move: () => move,
  size: () => size,
  width: () => width,
  x: () => x,
  y: () => y
});
function dmove(dx2, dy2) {
  this.children().forEach((child) => {
    let bbox2;
    try {
      bbox2 = child.node instanceof getWindow().SVGSVGElement ? new Box(child.attr([
        "x",
        "y",
        "width",
        "height"
      ])) : child.bbox();
    } catch (e) {
      return;
    }
    const m = new Matrix(child);
    const matrix = m.translate(dx2, dy2).transform(m.inverse());
    const p = new Point(bbox2.x, bbox2.y).transform(matrix);
    child.dmove(p.x - bbox2.x, p.y - bbox2.y);
  });
  return this;
}
function dx(dx2) {
  return this.dmove(dx2, 0);
}
function dy(dy2) {
  return this.dmove(0, dy2);
}
function height(height2, box = this.bbox()) {
  if (height2 == null) return box.height;
  return this.size(box.width, height2, box);
}
function move(x2 = 0, y2 = 0, box = this.bbox()) {
  const dx2 = x2 - box.x;
  const dy2 = y2 - box.y;
  return this.dmove(dx2, dy2);
}
function size(width2, height2, box = this.bbox()) {
  const p = proportionalSize(this, width2, height2, box);
  const scaleX = p.width / box.width;
  const scaleY = p.height / box.height;
  this.children().forEach((child) => {
    const o = new Point(box).transform(new Matrix(child).inverse());
    child.scale(scaleX, scaleY, o.x, o.y);
  });
  return this;
}
function width(width2, box = this.bbox()) {
  if (width2 == null) return box.width;
  return this.size(width2, box.height, box);
}
function x(x2, box = this.bbox()) {
  if (x2 == null) return box.x;
  return this.move(x2, box.y, box);
}
function y(y2, box = this.bbox()) {
  if (y2 == null) return box.y;
  return this.move(box.x, y2, box);
}
var G = class extends Container {
  constructor(node, attrs2 = node) {
    super(nodeOrNew("g", node), attrs2);
  }
};
extend(G, containerGeometry_exports);
registerMethods({ Container: { group: wrapWithAttrCheck(function() {
  return this.put(new G());
}) } });
register(G, "G");
var A = class extends Container {
  constructor(node, attrs2 = node) {
    super(nodeOrNew("a", node), attrs2);
  }
  target(target) {
    return this.attr("target", target);
  }
  to(url) {
    return this.attr("href", url, xlink);
  }
};
extend(A, containerGeometry_exports);
registerMethods({
  Container: { link: wrapWithAttrCheck(function(url) {
    return this.put(new A()).to(url);
  }) },
  Element: {
    unlink() {
      const link = this.linker();
      if (!link) return this;
      const parent = link.parent();
      if (!parent) return this.remove();
      const index = parent.index(link);
      parent.add(this, index);
      link.remove();
      return this;
    },
    linkTo(url) {
      let link = this.linker();
      if (!link) {
        link = new A();
        this.wrap(link);
      }
      if (typeof url === "function") url.call(link, link);
      else link.to(url);
      return this;
    },
    linker() {
      const link = this.parent();
      if (link && link.node.nodeName.toLowerCase() === "a") return link;
      return null;
    }
  }
});
register(A, "A");
var Mask = class extends Container {
  constructor(node, attrs2 = node) {
    super(nodeOrNew("mask", node), attrs2);
  }
  remove() {
    this.targets().forEach(function(el) {
      el.unmask();
    });
    return super.remove();
  }
  targets() {
    return findReferences(this.node, "mask");
  }
};
registerMethods({
  Container: { mask: wrapWithAttrCheck(function() {
    return this.defs().put(new Mask());
  }) },
  Element: {
    masker() {
      return this.reference("mask");
    },
    maskWith(element) {
      const masker = element instanceof Mask ? element : this.parent().mask().add(element);
      return this.attr("mask", "url(#" + masker.id() + ")");
    },
    unmask() {
      return this.attr("mask", null);
    }
  }
});
register(Mask, "Mask");
var Stop = class extends Element4 {
  constructor(node, attrs2 = node) {
    super(nodeOrNew("stop", node), attrs2);
  }
  update(o) {
    if (typeof o === "number" || o instanceof SVGNumber) o = {
      offset: arguments[0],
      color: arguments[1],
      opacity: arguments[2]
    };
    if (o.opacity != null) this.attr("stop-opacity", o.opacity);
    if (o.color != null) this.attr("stop-color", o.color);
    if (o.offset != null) this.attr("offset", new SVGNumber(o.offset));
    return this;
  }
};
registerMethods({ Gradient: { stop: function(offset, color, opacity) {
  return this.put(new Stop()).update(offset, color, opacity);
} } });
register(Stop, "Stop");
function cssRule(selector, rule) {
  if (!selector) return "";
  if (!rule) return selector;
  let ret = selector + "{";
  for (const i in rule) ret += unCamelCase(i) + ":" + rule[i] + ";";
  ret += "}";
  return ret;
}
var Style5 = class extends Element4 {
  constructor(node, attrs2 = node) {
    super(nodeOrNew("style", node), attrs2);
  }
  addText(w = "") {
    this.node.textContent += w;
    return this;
  }
  font(name, src, params = {}) {
    return this.rule("@font-face", {
      fontFamily: name,
      src,
      ...params
    });
  }
  rule(selector, obj) {
    return this.addText(cssRule(selector, obj));
  }
};
registerMethods("Dom", {
  style(selector, obj) {
    return this.put(new Style5()).rule(selector, obj);
  },
  fontface(name, src, params) {
    return this.put(new Style5()).font(name, src, params);
  }
});
register(Style5, "Style");
var TextPath = class extends Text8 {
  constructor(node, attrs2 = node) {
    super(nodeOrNew("textPath", node), attrs2);
  }
  array() {
    const track = this.track();
    return track ? track.array() : null;
  }
  plot(d) {
    const track = this.track();
    let pathArray = null;
    if (track) pathArray = track.plot(d);
    return d == null ? pathArray : this;
  }
  track() {
    return this.reference("href");
  }
};
registerMethods({
  Container: { textPath: wrapWithAttrCheck(function(text, path) {
    if (!(text instanceof Text8)) text = this.text(text);
    return text.path(path);
  }) },
  Text: {
    path: wrapWithAttrCheck(function(track, importNodes = true) {
      const textPath = new TextPath();
      if (!(track instanceof Path)) track = this.defs().path(track);
      textPath.attr("href", "#" + track, xlink);
      let node;
      if (importNodes) while (node = this.node.firstChild) textPath.node.appendChild(node);
      return this.put(textPath);
    }),
    textPath() {
      return this.findOne("textPath");
    }
  },
  Path: {
    text: wrapWithAttrCheck(function(text) {
      if (!(text instanceof Text8)) text = new Text8().addTo(this.parent()).text(text);
      return text.path(this);
    }),
    targets() {
      return findReferences(this.node, "href", "textPath");
    }
  }
});
TextPath.prototype.MorphArray = PathArray;
register(TextPath, "TextPath");
var Use = class extends Shape {
  constructor(node, attrs2 = node) {
    super(nodeOrNew("use", node), attrs2);
  }
  use(element, file) {
    return this.attr("href", (file || "") + "#" + element, xlink);
  }
};
registerMethods({ Container: { use: wrapWithAttrCheck(function(element, file) {
  return this.put(new Use()).use(element, file);
}) } });
register(Use, "Use");
extend([
  Svg,
  Symbol$1,
  Image,
  Pattern,
  Marker
], getMethodsFor("viewbox"));
extend([
  Line,
  Polyline,
  Polygon,
  Path
], getMethodsFor("marker"));
extend(Text8, getMethodsFor("Text"));
extend(Path, getMethodsFor("Path"));
extend(Defs, getMethodsFor("Defs"));
extend([Text8, Tspan], getMethodsFor("Tspan"));
extend([
  Rect,
  Ellipse,
  Gradient,
  Runner
], getMethodsFor("radius"));
extend(EventTarget, getMethodsFor("EventTarget"));
extend(Dom, getMethodsFor("Dom"));
extend(Element4, getMethodsFor("Element"));
extend(Shape, getMethodsFor("Shape"));
extend([Container, Fragment], getMethodsFor("Container"));
extend(Gradient, getMethodsFor("Gradient"));
extend(Runner, getMethodsFor("Runner"));
List.extend(getMethodNames());
registerMorphableType([
  SVGNumber,
  Color,
  Box,
  Matrix,
  SVGArray,
  PointArray,
  PathArray,
  Point
]);
makeMorphable();

// src/theme.ts
var hexToRgb = (h) => {
  let s = h.replace("#", "");
  if (s.length === 3) s = [...s].map((c) => c + c).join("");
  return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
};
var rgbToHex = (rgb2) => "#" + rgb2.map((c) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, "0")).join("").toUpperCase();
var mix = (a, b, t) => {
  const [ra, ga, ba] = hexToRgb(a);
  const [rb, gb, bb] = hexToRgb(b);
  return rgbToHex([ra + (rb - ra) * t, ga + (gb - ga) * t, ba + (bb - ba) * t]);
};
var darken = (h, t) => mix(h, "#000000", t);
var lighten = (h, t) => mix(h, "#FFFFFF", t);
var rgbTriple = (h) => hexToRgb(h).join(",");
var channel = (c) => {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
var luminance = (h) => {
  const [r, g, b] = hexToRgb(h);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};
var contrast = (fg, bg) => {
  const l1 = luminance(fg);
  const l2 = luminance(bg);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};
function accessibleOn(fg, bg, target = 4.5, steps = 40) {
  if (contrast(fg, bg) >= target) return fg;
  const toward = luminance(bg) > 0.5 ? "#000000" : "#FFFFFF";
  let best = fg;
  let bestRatio = contrast(fg, bg);
  for (let i = 1; i <= steps; i++) {
    const cand = mix(fg, toward, i / steps);
    const ratio = contrast(cand, bg);
    if (ratio > bestRatio) {
      best = cand;
      bestRatio = ratio;
    }
    if (ratio >= target) return cand;
  }
  return best;
}
function separateFrom(colour, bg, target = 3, steps = 60) {
  if (contrast(colour, bg) >= target) return colour;
  const [r, g, b] = hexToRgb(colour);
  let best = colour;
  for (let i = 1; i <= steps; i++) {
    const k = 1 + i / steps * 2.4;
    const cand = rgbToHex([r * k, g * k, b * k]);
    if (contrast(cand, bg) >= target) return cand;
    best = cand;
  }
  return best;
}
function shallowerThan(fold, lit, voidColour, steps = 40) {
  const target = contrast(lit, voidColour);
  let out = fold;
  for (let i = 0; i <= steps; i++) {
    if (contrast(lit, out) < target) return out;
    out = mix(fold, voidColour, (i + 1) / steps);
  }
  return out;
}
var DEFAULT_THEME = {
  name: "Teal Arc",
  brand: { name: "Your Brand", footer: "" },
  colors: {
    surface: "#0F2733",
    accent: "#35C0B6",
    secondary: "#3E7FB8",
    text_on_dark: "#EEF3F9"
  },
  fonts: {
    display: "'Barlow Condensed', 'Arial Narrow', 'Liberation Sans Narrow', 'Roboto Condensed', system-ui, sans-serif",
    body: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    mono: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
  },
  space: {
    1: ".5rem",
    2: ".75rem",
    3: "1rem",
    4: "1.5rem",
    5: "2rem",
    6: "3rem",
    page_x: "4.5rem",
    page_top: "3rem",
    page_bottom: "4rem"
  },
  type: {
    band: "3rem",
    h1: "3.2rem",
    h2: "2.4rem",
    h3: "1.75rem",
    body: "1.55rem",
    hand: "2.1rem",
    statement: "4.6rem",
    line_height: "1.55"
  },
  motion: {
    ease_paper: "cubic-bezier(.16, 1, .3, 1)",
    ease_cloth: "cubic-bezier(.5, 0, .2, 1)",
    curtain: "2200ms",
    float: "900ms",
    open: "1100ms",
    flip: "720ms",
    riffle_page: "150ms",
    reveal: "520ms",
    reveal_stagger: "90ms",
    write_speed_ms_per_char: 34
  },
  a11y: { enforce: true, min_contrast: 4.5 }
};
function buildPalette(theme) {
  const c = theme.colors ?? {};
  const enforce = theme.a11y?.enforce ?? true;
  const target = theme.a11y?.min_contrast ?? 4.5;
  const surface = c.surface ?? "#1C2833";
  const surfaceAlt = c.surface_alt ?? lighten(surface, 0.06);
  const accent = c.accent ?? "#E0A33E";
  const secondary = c.secondary ?? mix(surface, "#4A7FB5", 0.75);
  const white = c.white ?? "#FFFFFF";
  const text = c.text_on_dark ?? "#EEF3F9";
  const textOnLight = c.text_on_light ?? surface;
  const textMuted = c.text_on_dark_muted ?? mix(text, surface, 0.42);
  const deep = c.surface_deep ?? mix(mix(surface, "#000000", 0.9), "#04070E", 0.5);
  const lightBg = c.surface_light ?? mix(surface, white, 0.94);
  const accentBright = c.accent_bright ?? lighten(accent, 0.1);
  const secondaryBright = c.secondary_bright ?? lighten(secondary, 0.22);
  const fix = (col, bg) => enforce ? accessibleOn(col, bg, target) : col;
  const pinned = (explicit, derived, bg) => fix(explicit ?? derived, bg);
  const paper = c.paper ?? mix("#FAF6EC", accent, 0.04);
  const paper2 = c.paper_alt ?? darken(paper, 0.05);
  const ink = c.ink ?? mix(surface, "#000000", 0.12);
  const cloth = c.curtain ?? separateFrom(mix(secondary, "#000000", 0.18), deep, 3);
  return {
    surface,
    surfaceAlt,
    deep,
    accent,
    accentBright,
    secondary,
    secondaryBright,
    white,
    text,
    textMuted,
    textFaint: mix(text, surface, 0.66),
    // ── the stage ────────────────────────────────────────────────────────
    // WARM LIGHT, COOL SHADOW. This is the oldest trick in stage and film
    // lighting and it is doing most of the work here: the lit face of the cloth
    // is pulled toward the accent, the folds toward a cold blue-black. Two
    // tones of the same hue read as flat; a warm/cool pair reads as lit.
    curtainCloth: cloth,
    // Restrained on purpose. At lighten(.26) the whole upper half of the cloth
    // washed out to a pale sky and stopped reading as heavy fabric — the base
    // colour already carries the 3.48:1 separation, so the highlight only has
    // to shape the folds, not add more light.
    // PINNED, BUT STILL MEASURED — the same rule as `accent_ink` and
    // `link_on_paper` above: a design decision outranks derivation, and it does
    // not outrank a measurement.
    //
    // The lit crest is what the eye reads as "there is cloth there" — the base
    // colour is the shadowed trough. Four of the seven ported palettes pin a
    // crest that scores under 3:1 against their own void (Plum 2.04, Oxblood
    // 2.06, Tobacco 2.21, Green 2.70) because they were authored for a CSS
    // gradient curtain rather than a lit shader, and the shader draws the same
    // colour darker. Shipped as pinned they would each render the invisible
    // curtain this kit already fixed once.
    //
    // `separateFrom` raises by SCALING the channels, so the hue survives and
    // the cloth reads as the same fabric under more light — which is what a
    // stage actually does. A crest already clearing the bar is returned
    // untouched, so the shipped Teal Arc keeps the design's exact #1C6B72.
    curtainClothLit: separateFrom(c.curtain_lit ?? mix(lighten(cloth, 0.13), accent, 0.14), deep, 3),
    // The deep fold is measured against the CREST, not fixed, for the same
    // reason: the whole failure mode is folds out-contrasting the cloth against
    // its own background, which makes the eye read stripes on a dark field
    // rather than lit fabric. Raising a crest to clear the void raises the fold
    // contrast with it — Green ended up failing by 0.01 that way, having passed
    // before the crest was corrected. So the fold is lifted until the cloth
    // wins its own comparison, and a palette that already reads as fabric is
    // left exactly as it is.
    curtainClothDeep: shallowerThan(
      c.curtain_deep ?? mix(darken(cloth, 0.62), "#050B14", 0.35),
      separateFrom(c.curtain_lit ?? mix(lighten(cloth, 0.13), accent, 0.14), deep, 3),
      deep
    ),
    // The rim: where the gathered edge catches the house lights. This is what
    // actually separates the swag from the void — an edge, not a fill.
    curtainRim: c.curtain_rim ?? mix(accentBright, white, 0.15),
    // Haze hanging in the void, so the space behind has depth instead of being
    // switched-off pixels. Sits between the void and the cloth in luminance.
    stageHaze: c.stage_haze ?? mix(deep, secondary, 0.3),
    // The pool of light the book stands in.
    stagePool: c.stage_pool ?? mix(deep, accent, 0.16),
    // Sticky notes. Derived from the accent so they belong to the brand, but
    // pushed toward yellow-green and heavily lightened — a sticky note that is
    // simply "the brand colour" reads as a UI chip, not as a thing someone
    // stuck on the page. Ink is dark enough to stay legible on all three.
    sticky1: c.sticky ?? mix(lighten(accent, 0.62), "#FFF9A8", 0.5),
    sticky2: c.sticky_alt ?? mix(lighten(accent, 0.58), "#BFEFCB", 0.55),
    sticky3: c.sticky_third ?? mix(lighten(accent, 0.6), "#FFC9D6", 0.5),
    stickyInk: c.sticky_ink ?? mix(ink, "#000000", 0.15),
    // book / paper
    paper,
    paper2,
    paperEdge: darken(paper, 0.08),
    paperEdge2: darken(paper, 0.14),
    paperEdge3: darken(paper, 0.2),
    paperEdge4: darken(paper, 0.27),
    ink,
    inkSoft: mix(ink, paper, 0.45),
    rule: `rgba(${rgbTriple(ink)},0.07)`,
    ruleStrong: `rgba(${rgbTriple(ink)},0.16)`,
    // Accent and links must stay legible on PAPER, which is light — so they get
    // the same automatic correction the light theme gets.
    accentInk: pinned(c.accent_ink, accent, paper),
    linkOnPaper: pinned(c.link_on_paper, secondary, paper),
    lightBg,
    lightAlt: mix(surface, white, 0.965),
    lightText: textOnLight,
    lightTextMuted: fix(mix(textOnLight, lightBg, 0.38), lightBg),
    lightAccent: fix(accent, lightBg),
    lightAccentBright: fix(accentBright, lightBg),
    lightSecondaryBright: fix(secondaryBright, lightBg),
    rgbSurface: rgbTriple(surface),
    rgbDeep: rgbTriple(deep),
    rgbAccent: rgbTriple(accent),
    rgbWhite: "255,255,255",
    rgbBlack: "0,0,0"
  };
}
async function loadTheme(path) {
  try {
    const raw = await readFile(path, "utf8");
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_THEME,
      ...parsed,
      colors: { ...DEFAULT_THEME.colors, ...parsed.colors },
      space: { ...DEFAULT_THEME.space, ...parsed.space },
      type: { ...DEFAULT_THEME.type, ...parsed.type },
      motion: { ...DEFAULT_THEME.motion, ...parsed.motion },
      fonts: { ...DEFAULT_THEME.fonts, ...parsed.fonts }
    };
  } catch {
    return DEFAULT_THEME;
  }
}

// src/studio/ink.ts
var K = 1.6;
var INK_PRESETS = {
  /** Pencil shading: a gentle ramp, so most of the picture survives as tone. */
  soft: { nib: 0.9, line: 20, threshold: 0.7, body: 2, vignette: 0.28 },
  /** Natural media — the house setting. A drawn line over real tone. */
  drawn: { nib: 0.9, line: 34, threshold: 0.62, body: 4, vignette: 0.28 },
  /** Two-tone woodcut: φ high enough that the ramp is effectively a cliff. */
  engraved: { nib: 1.1, line: 60, threshold: 0.56, body: 16, vignette: 0.22 }
};
var DEFAULT_INK = INK_PRESETS.drawn;
function hexToRgb2(hex2) {
  const h = hex2.trim().replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [
    parseInt(full.slice(0, 2), 16) || 0,
    parseInt(full.slice(2, 4), 16) || 0,
    parseInt(full.slice(4, 6), 16) || 0
  ];
}
function kernel(sigma) {
  const radius = Math.max(1, Math.ceil(sigma * 3));
  const k = new Float32Array(radius * 2 + 1);
  const denom = 2 * sigma * sigma;
  let sum = 0;
  for (let i = -radius; i <= radius; i++) {
    const v = Math.exp(-(i * i) / denom);
    k[i + radius] = v;
    sum += v;
  }
  for (let i = 0; i < k.length; i++) k[i] = k[i] / sum;
  return k;
}
function gaussian(plane, w, h, sigma) {
  if (sigma <= 0.05) return plane.slice();
  const k = kernel(sigma);
  const r = (k.length - 1) / 2;
  const tmp = new Float32Array(plane.length);
  const out = new Float32Array(plane.length);
  for (let y2 = 0; y2 < h; y2++) {
    const row = y2 * w;
    for (let x2 = 0; x2 < w; x2++) {
      let acc = 0;
      for (let i = -r; i <= r; i++) {
        const xx = x2 + i < 0 ? 0 : x2 + i > w - 1 ? w - 1 : x2 + i;
        acc += plane[row + xx] * k[i + r];
      }
      tmp[row + x2] = acc;
    }
  }
  for (let x2 = 0; x2 < w; x2++) {
    for (let y2 = 0; y2 < h; y2++) {
      let acc = 0;
      for (let i = -r; i <= r; i++) {
        const yy = y2 + i < 0 ? 0 : y2 + i > h - 1 ? h - 1 : y2 + i;
        acc += tmp[yy * w + x2] * k[i + r];
      }
      out[y2 * w + x2] = acc;
    }
  }
  return out;
}
function hash2(x2, y2) {
  const n = Math.sin(x2 * 127.1 + y2 * 311.7) * 43758.5453;
  return n - Math.floor(n);
}
function valueNoise(x2, y2) {
  const xi = Math.floor(x2);
  const yi = Math.floor(y2);
  const xf = x2 - xi;
  const yf = y2 - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash2(xi, yi);
  const b = hash2(xi + 1, yi);
  const c = hash2(xi, yi + 1);
  const d = hash2(xi + 1, yi + 1);
  return a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v;
}
var smoothstep = (t) => {
  const c = t < 0 ? 0 : t > 1 ? 1 : t;
  return c * c * (3 - 2 * c);
};
function edgeMask(x2, y2, w, h, vignette) {
  if (vignette <= 0) return 1;
  const spanX = Math.max(1, w * vignette);
  const spanY = Math.max(1, h * vignette);
  const dx2 = Math.min(x2, w - 1 - x2) / spanX;
  const dy2 = Math.min(y2, h - 1 - y2) / spanY;
  let d = Math.min(dx2, dy2);
  if (d < 1.4) {
    const grain = Math.max(spanX, spanY) / 3;
    d += (valueNoise(x2 / grain, y2 / grain) - 0.5) * 0.5;
  }
  return smoothstep(d);
}
function threshold(u, epsilon, phi) {
  return u >= epsilon ? 1 : 1 + Math.tanh(phi * (u - epsilon));
}
function inkWash(src, ink, settings = DEFAULT_INK) {
  const { width: w, height: h } = src;
  const px = src.data;
  const { nib, line, threshold: epsilon, body: phi, vignette } = settings;
  const lum = new Float32Array(w * h);
  for (let i = 0, p = 0; p < lum.length; i += 4, p++) {
    lum[p] = (0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2]) / 255;
  }
  const sigma = Math.max(0.3, nib);
  const near = gaussian(lum, w, h, sigma);
  const far = gaussian(lum, w, h, sigma * K);
  const out = new Uint8ClampedArray(new ArrayBuffer(px.length));
  for (let p = 0, i = 0; p < lum.length; p++, i += 4) {
    const x2 = p % w;
    const y2 = (p - x2) / w;
    const s = (1 + line) * near[p] - line * far[p];
    const coverage = 1 - Math.min(1, Math.max(0, threshold(s, epsilon, phi)));
    const mask = edgeMask(x2, y2, w, h, vignette);
    const alpha = coverage * mask;
    out[i] = ink[0];
    out[i + 1] = ink[1];
    out[i + 2] = ink[2];
    out[i + 3] = Math.round(alpha * 255);
  }
  return { data: out, width: w, height: h };
}

// scripts/ink.ts
var ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
function exit(msg) {
  console.error(`ink: ${msg}`);
  process.exit(1);
}
var USAGE = `
  node dist/ink.mjs <picture> [out.png] [options]

  Turns a picture into something that looks drawn on the page, in the book's
  own ink. Writes a transparent PNG: it carries only ink coverage, so the
  page reads through it. Add {.plate} in your lesson if the page's ruled
  lines should not run through the picture.

  Presets     --soft  --drawn (default)  --engraved
  The hand    --nib <px>  --line <p>  --threshold <e>  --body <phi>
  The plate   --fade <0..0.45>
  Output      --width <px>   (default 1200; 0 keeps the source size)
  Theme       --theme <path> (default theme.json)
`;
function parse5(argv) {
  const positional = [];
  let settings = { ...DEFAULT_INK };
  let width2 = 1200;
  let theme = "theme.json";
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next2 = () => {
      const v = argv[++i];
      if (v === void 0) exit(`${a} needs a value`);
      return v;
    };
    const num = () => {
      const v = Number(next2());
      if (!Number.isFinite(v)) exit(`${a} needs a number`);
      return v;
    };
    if (!a.startsWith("--")) {
      positional.push(a);
      continue;
    }
    const preset = INK_PRESETS[a.slice(2)];
    if (preset) {
      settings = { ...preset };
      continue;
    }
    switch (a) {
      case "--nib":
        settings.nib = num();
        break;
      case "--line":
        settings.line = num();
        break;
      case "--threshold":
        settings.threshold = num();
        break;
      case "--body":
        settings.body = num();
        break;
      case "--fade":
        settings.vignette = num();
        break;
      case "--width":
        width2 = num();
        break;
      case "--theme":
        theme = next2();
        break;
      case "--help":
      case "-h":
        console.log(USAGE);
        process.exit(0);
        break;
      default:
        exit(`unknown option ${a}
${USAGE}`);
    }
  }
  const input = positional[0];
  if (!input) {
    console.error(USAGE);
    process.exit(1);
  }
  const named = positional[1];
  const output = named ?? join(dirname(input), `${basename(input, extname(input))}.ink.png`);
  return { input, output, width: width2, theme, settings };
}
async function decode(path) {
  const bytes = await readFile2(path).catch(() => exit(`cannot read ${path}`));
  const ext = extname(path).toLowerCase();
  if (ext === ".png") {
    const png = import_pngjs.PNG.sync.read(bytes);
    return { data: new Uint8ClampedArray(png.data), width: png.width, height: png.height };
  }
  if (ext === ".jpg" || ext === ".jpeg") {
    const img = import_jpeg_js.default.decode(bytes, { useTArray: true });
    return { data: new Uint8ClampedArray(img.data), width: img.width, height: img.height };
  }
  exit(`${ext || "that"} is not a format this can read \u2014 give it a JPEG or a PNG.
       WebP and AVIF decode in the studio, which uses the browser's own decoders.`);
}
function resize(src, w) {
  if (w >= src.width || w <= 0) return src;
  const h = Math.max(1, Math.round(src.height * w / src.width));
  const out = new Uint8ClampedArray(w * h * 4);
  const sx = src.width / w;
  const sy = src.height / h;
  for (let y2 = 0; y2 < h; y2++) {
    const y0 = Math.floor(y2 * sy);
    const y1 = Math.min(src.height, Math.max(y0 + 1, Math.floor((y2 + 1) * sy)));
    for (let x2 = 0; x2 < w; x2++) {
      const x0 = Math.floor(x2 * sx);
      const x1 = Math.min(src.width, Math.max(x0 + 1, Math.floor((x2 + 1) * sx)));
      let r = 0, g = 0, b = 0, a = 0, n = 0;
      for (let yy = y0; yy < y1; yy++) {
        for (let xx = x0; xx < x1; xx++) {
          const i = (yy * src.width + xx) * 4;
          r += src.data[i];
          g += src.data[i + 1];
          b += src.data[i + 2];
          a += src.data[i + 3];
          n++;
        }
      }
      const o = (y2 * w + x2) * 4;
      out[o] = r / n;
      out[o + 1] = g / n;
      out[o + 2] = b / n;
      out[o + 3] = a / n;
    }
  }
  return { data: out, width: w, height: h };
}
async function main() {
  const args = parse5(process.argv.slice(2));
  const theme = await loadTheme(resolve(ROOT, args.theme)).catch(() => exit(`cannot read the theme at ${args.theme}`));
  const palette = buildPalette(theme);
  const source = await decode(args.input);
  const scaled = resize(source, args.width);
  const settings = {
    ...args.settings,
    nib: args.settings.nib * (scaled.width / 900)
  };
  const t0 = Date.now();
  const drawn = inkWash(scaled, hexToRgb2(palette.ink), settings);
  const png = new import_pngjs.PNG({ width: drawn.width, height: drawn.height });
  png.data = Buffer.from(drawn.data.buffer, drawn.data.byteOffset, drawn.data.byteLength);
  const bytes = import_pngjs.PNG.sync.write(png);
  await writeFile(args.output, bytes);
  const kb = (n) => `${Math.round(n / 1024)} KB`;
  console.log(`  ${args.output}`);
  console.log(`  ${drawn.width}\xD7${drawn.height} \xB7 ${kb(bytes.length)} \xB7 ink ${palette.ink} \xB7 ${Date.now() - t0} ms`);
  console.log(`  use it with {.plate} if the page's ruled lines should not run through it`);
}
await main();
/*! Bundled license information:

@svgdotjs/svg.js/dist/svg.esm.js:
  (*!
  * @svgdotjs/svg.js - A lightweight library for manipulating and animating SVG.
  * @version 3.2.8
  * https://svgjs.dev/
  *
  * @copyright Wout Fierens <wout@mick-wout.com>
  * @license MIT
  *
  * BUILT: 2026-08-04T07:47:41.000Z
  *)
*/
