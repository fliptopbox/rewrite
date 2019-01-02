let serial = -1;
const uuid = () => {
  serial++;
  return (
    String.fromCharCode(65 + (serial % 26)).toLowerCase() +
    (
      new Date().valueOf().toString(16) + // eg 127b795136 (11)
      Math.floor(1000 + Math.random() * 1000).toString(13) + // eg aa7 (3)
      (1000 + (serial % 1000)).toString(5) + // eg 13001 (5)
      ""
    ).slice(-15)
  );
};

export default uuid;
