export default function convertNullsToEmptyStrings(obj) {
    if (obj === null) {
      return "";
    }
  
    if (Array.isArray(obj)) {
      return obj.map((item) => convertNullsToEmptyStrings(item));
    }
  
    if (typeof obj === 'object' && obj !== null) {
      return Object.keys(obj).reduce((acc, key) => {
        acc[key] = convertNullsToEmptyStrings(obj[key]);
        return acc;
      }, {});
    }
  
    return obj;
  }
