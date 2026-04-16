  const getLocalDateString = () => {
    const d = new Date();
    const tzOffset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tzOffset).toISOString().split("T")[0];
  };

console.log("getLocalDateString():", getLocalDateString());

const date = getLocalDateString();
let isoDate = new Date().toISOString();
if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    isoDate = `${date}T12:00:00.000Z`;
} 
console.log("isoDate from Modal:", isoDate);
