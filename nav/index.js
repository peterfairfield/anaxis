import fs from "fs"
import markdown from "remark-parse"
import stringify from "remark-stringify"
import { unified } from "unified"
import { selectAll } from "unist-util-select"

let mdast
unified()
  .use(markdown)
  .use(() => tree => (mdast = tree))
  .use(stringify)
  .process(fs.readFileSync("post.md"))

const headingsNodes = selectAll("heading[depth=2]", mdast)
const json = JSON.stringify(headingsNodes, null, 2)

console.log(json)