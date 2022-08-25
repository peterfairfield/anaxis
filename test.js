payload = "This is the [worst](/pf/worst.md) thing ever that [was](/amazing.md)" 

const findLinks = (payload) => {
  const linkRegex = /\[([\w\s\d]+)\]\(((?:\/|https?:\/\/)[\w\d./?=#]+)\)/g; // TODO: 
  const lmatch = payload.match(linkRegex);
  lmatch.forEach
  console.log(lmatch);
};

findLinks(payload);