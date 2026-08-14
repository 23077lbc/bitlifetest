/*
==========================================================
 BITLIFE COMPLETION TRACKER
 wiki.js
==========================================================

Browser-only.

No Node.
No npm.
No libraries.
No installation.

This file is loaded by index.html.

==========================================================
*/


const WIKI =
  "https://bitlife-life-simulator.fandom.com";


const API = {

  achievements:
    WIKI +
    "/api.php" +
    "?action=parse" +
    "&page=Achievements" +
    "&prop=text" +
    "&format=json" +
    "&formatversion=2" +
    "&origin=*",

  ribbons:
    WIKI +
    "/api.php" +
    "?action=parse" +
    "&page=Ribbons" +
    "&prop=text" +
    "&format=json" +
    "&formatversion=2" +
    "&origin=*"

};


/*
==========================================================
 STORAGE
==========================================================
*/


const STORAGE =
  "bitlife-completion-v5";


let state = {

  achievements: [],

  ribbons: [],

  checked: {},

  activeTab:
    "achievements",

  search:
    "",

  category:
    "all",

  difficulty:
    "all"

};


const $ =
  id =>
    document.getElementById(id);


/*
==========================================================
 LOAD / SAVE
==========================================================
*/


function loadSaved(){

  try{

    const saved =
      JSON.parse(
        localStorage.getItem(
          STORAGE
        ) || "{}"
      );


    state.checked =
      saved.checked || {};


  }catch(error){

    console.warn(
      "Could not load saved progress:",
      error
    );

    state.checked = {};

  }

}


function save(){

  try{

    localStorage.setItem(
      STORAGE,
      JSON.stringify({
        checked:
          state.checked
      })
    );

  }catch(error){

    console.warn(
      "Could not save progress:",
      error
    );

  }

}


/*
==========================================================
 TEXT HELPERS
==========================================================
*/


function clean(text){

  if(
    text === null ||
    text === undefined
  ){
    return "";
  }


  let value =
    String(text);


  value =
    value.replace(
      /\[[0-9]+\]/g,
      ""
    );


  value =
    value.replace(
      /\[citation needed\]/gi,
      ""
    );


  value =
    value
      .replace(
        /&nbsp;/gi,
        " "
      )
      .replace(
        /&amp;/gi,
        "&"
      )
      .replace(
        /&quot;/gi,
        '"'
      )
      .replace(
        /&#039;/gi,
        "'"
      )
      .replace(
        /&lt;/gi,
        "<"
      )
      .replace(
        /&gt;/gi,
        ">"
      );


  value =
    value
      .replace(
        /\*\*/g,
        ""
      )
      .replace(
        /__/g,
        ""
      )
      .replace(
        /`/g,
        ""
      );


  value =
    value.replace(
      /\{\{[^{}]*\}\}/g,
      ""
    );


  return value
    .replace(
      /\s+/g,
      " "
    )
    .trim();

}


function elementText(element){

  if(!element){
    return "";
  }


  const clone =
    element.cloneNode(true);


  clone
    .querySelectorAll(
      "sup,style,script,noscript,.reference"
    )
    .forEach(
      el =>
        el.remove()
    );


  clone
    .querySelectorAll("br")
    .forEach(
      br =>
        br.replaceWith(
          document.createTextNode(" ")
        )
    );


  return clean(
    clone.textContent || ""
  );

}


function slug(text){

  return clean(text)
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /^-|-$/g,
      "");

}


function escapeHTML(value){

  return String(
    value ?? ""
  )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}


/*
==========================================================
 EMOJI
==========================================================
*/


function emojiFor(
  name,
  type
){

  const n =
    name.toLowerCase();


  const rules = [

    [
      /million|money|wealth|rich|loaded|billion|zillion|cash/,
      "💰"
    ],

    [
      /love|lover|marry|wedding|romance|heart/,
      "❤️"
    ],

    [
      /death|dead|kill|murder|assassin|execution|deadly/,
      "💀"
    ],

    [
      /animal|lion|gorilla|hippo|unicorn|leopard|horse|cat|dog|llama|zoo/,
      "🐾"
    ],

    [
      /school|student|academic|degree|university|college|professor/,
      "🎓"
    ],

    [
      /doctor|disease|plague|rabies|health|sick/,
      "🩺"
    ],

    [
      /crime|criminal|rob|steal|thief|burglar|mafia|cartel/,
      "🕵️"
    ],

    [
      /prison|jail|escape|bars|houdini/,
      "⛓️"
    ],

    [
      /military|general|admiral|veteran|army|navy|marine/,
      "🎖️"
    ],

    [
      /actor|movie|film|cinema|hollywood|theater|theatre/,
      "🎬"
    ],

    [
      /music|singer|album|song|concert|rapper|k-pop/,
      "🎵"
    ],

    [
      /social|influencer|followers|youtube|instagram|tiktok/,
      "📱"
    ],

    [
      /business|company|ceo|boss|career|job|work/,
      "💼"
    ],

    [
      /model|fashion|haute|designer/,
      "👗"
    ],

    [
      /royal|king|queen|monarch|prince|princess/,
      "👑"
    ],

    [
      /car|vehicle|bugatti|driver|pilot|boat/,
      "🚗"
    ],

    [
      /house|home|estate|property|real estate/,
      "🏠"
    ],

    [
      /casino|gamble|poker|slot|jackpot/,
      "🎰"
    ],

    [
      /vampire|blood|fang|coffin|undead/,
      "🧛"
    ],

    [
      /cult|commune|spiritual/,
      "🔮"
    ],

    [
      /spy|agency|operative|gadget/,
      "🕶️"
    ],

    [
      /fishing|fish|outdoor|hiking|camp/,
      "🎣"
    ],

    [
      /travel|country|globetrotter|emigrate/,
      "🌎"
    ],

    [
      /family|father|mother|child|children|parent/,
      "👨‍👩‍👧‍👦"
    ],

    [
      /party|club|rowdy|alcohol/,
      "🥳"
    ],

    [
      /plastic|surgery|barbie/,
      "💅"
    ],

    [
      /ribbon|medal|award|achievement/,
      "🏅"
    ]

  ];


  for(
    const [regex,icon]
    of rules
  ){

    if(
      regex.test(n)
    ){
      return icon;
    }

  }


  return type === "ribbon"
    ? "🎗️"
    : "🏆";

}


/*
==========================================================
 DIFFICULTY
==========================================================
*/


function normalizeDifficulty(
  value
){

  const text =
    clean(value);


  if(!text){
    return "Unknown";
  }


  const lower =
    text.toLowerCase();


  if(
    lower.includes(
      "very easy"
    )
  ){
    return "Very Easy";
  }


  if(
    lower === "easy"
  ){
    return "Easy";
  }


  if(
    lower === "moderate"
  ){
    return "Moderate";
  }


  if(
    lower === "medium"
  ){
    return "Medium";
  }


  if(
    lower.includes(
      "very hard"
    )
  ){
    return "Very Hard";
  }


  if(
    lower === "hard"
  ){
    return "Hard";
  }


  if(
    lower.includes(
      "extreme"
    )
  ){
    return "Extreme";
  }


  if(
    lower.includes("luck") ||
    lower.includes("random")
  ){
    return "Luck-based";
  }


  return text;

}


function difficultyClass(
  value
){

  return "diff-" +
    clean(value)
      .toLowerCase()
      .replace(
        /\s+/g,
        "-"
      );

}


/*
==========================================================
 PAID / RNG
==========================================================
*/


function paidInfo(text){

  const t =
    clean(text)
      .toLowerCase();


  if(!t){
    return false;
  }


  if(
    /\byes\b/.test(t) &&
    !/\bno\b/.test(t)
  ){
    return true;
  }


  return (
    /bitizenship/.test(t) ||
    /god mode/.test(t) ||
    /in-app/.test(t) ||
    /in app/.test(t) ||
    /paid/.test(t) ||
    /purchase/.test(t)
  );

}


function rngInfo(text){

  const t =
    clean(text)
      .toLowerCase();


  return (
    /\byes\b/.test(t) ||
    /kind of/.test(t) ||
    /luck/.test(t) ||
    /chance/.test(t) ||
    /random/.test(t)
  );

}


/*
==========================================================
 HEADER HELPERS
==========================================================
*/


function normalizeHeader(
  text
){

  return clean(text)
    .toLowerCase()
    .replace(
      /\?/g,
      ""
    )
    .replace(
      /[^a-z0-9]+/g,
      " "
    )
    .trim();

}


function findColumn(
  headers,
  patterns
){

  for(
    let i = 0;
    i < headers.length;
    i++
  ){

    const header =
      normalizeHeader(
        headers[i]
      );


    for(
      const pattern
      of patterns
    ){

      if(
        header.includes(pattern)
      ){
        return i;
      }

    }

  }


  return -1;

}


/*
==========================================================
 GET LINK TEXT
==========================================================
*/


function achievementLinkName(
  cell
){

  if(!cell){
    return "";
  }


  const links =
    Array.from(
      cell.querySelectorAll(
        "a"
      )
    );


  for(
    const link
    of links
  ){

    const href =
      link.getAttribute(
        "href"
      ) || "";


    const title =
      link.getAttribute(
        "title"
      ) || "";


    const text =
      clean(
        link.textContent
      );


    const combined =
      (
        href +
        " " +
        title
      ).toLowerCase();


    /*
      Individual achievement pages
      generally contain "(Achievement)"
      in their title/URL.

      This is much more reliable than
      relying on the table header.
    */

    if(
      combined.includes(
        "achievement"
      )
    ){

      const result =
        clean(
          text ||
          title
        )
          .replace(
            /\s*\(Achievement\)\s*$/i,
            ""
          );


      if(
        result &&
        result.length > 1 &&
        !/^input$/i.test(result)
      ){
        return result;
      }

    }

  }


  return "";

}


/*
==========================================================
 TABLE EXTRACTION
==========================================================
*/


function getTableData(
  table
){

  const rows =
    Array.from(
      table.querySelectorAll(
        "tr"
      )
    );


  if(
    !rows.length
  ){
    return null;
  }


  let headerIndex =
    -1;


  /*
    Find a header row.

    We don't require the word
    "Achievement" to be present.
  */

  for(
    let i = 0;
    i < Math.min(
      rows.length,
      8
    );
    i++
  ){

    const cells =
      Array.from(
        rows[i].querySelectorAll(
          "th,td"
        )
      );


    const text =
      cells
        .map(elementText)
        .join(" ")
        .toLowerCase();


    if(
      text.includes(
        "description"
      ) ||
      text.includes(
        "difficulty"
      ) ||
      text.includes(
        "chance-based"
      ) ||
      text.includes(
        "in-app"
      ) ||
      text.includes(
        "achievement"
      )
    ){

      headerIndex =
        i;

      break;

    }

  }


  if(
    headerIndex === -1
  ){

    /*
      Some tables don't use a proper
      header row. Use the first row.
    */

    headerIndex = 0;

  }


  const headerCells =
    Array.from(
      rows[headerIndex]
        .querySelectorAll(
          "th,td"
        )
    );


  const headers =
    headerCells.map(
      elementText
    );


  const dataRows = [];


  for(
    let i = headerIndex + 1;
    i < rows.length;
    i++
  ){

    const cells =
      Array.from(
        rows[i].querySelectorAll(
          "th,td"
        )
      );


    if(
      cells.length
    ){

      dataRows.push({
        elements: cells,
        text: cells.map(
          elementText
        )
      });

    }

  }


  return {
    headers,
    rows:dataRows
  };

}


/*
==========================================================
 ACHIEVEMENT PARSER
==========================================================

This is the major fix.

The old version required:

    header contains "Achievement"

That caused 395 instead of 410.

This version finds achievements from:

1. Actual achievement links.
2. Table rows.
3. Header-based columns when available.

The result is then deduplicated.

==========================================================
*/


function parseAchievements(
  html
){

  const parser =
    new DOMParser();


  const doc =
    parser.parseFromString(
      html,
      "text/html"
    );


  const output =
    new Map();


  /*
    Determine the current category while
    walking the document.

    We use the nearest preceding H2/H3/H4.
  */

  const headings =
    Array.from(
      doc.querySelectorAll(
        "h2,h3,h4"
      )
    );


  function categoryFor(
    element
  ){

    let category =
      "General";


    for(
      const heading
      of headings
    ){

      if(
        heading === element
      ){
        break;
      }


      const position =
        heading.compareDocumentPosition(
          element
        );


      if(
        position &
        Node.DOCUMENT_POSITION_FOLLOWING
      ){

        const text =
          clean(
            heading.textContent
          );


        if(
          text &&
          !/achievements/i.test(
            text
          ) &&
          !/list of achievements/i.test(
            text
          ) &&
          !/launched on/i.test(
            text
          )
        ){

          category =
            text;

        }

      }

    }


    return category;

  }


  /*
    First parse all tables.
  */

  const tables =
    Array.from(
      doc.querySelectorAll(
        "table"
      )
    );


  for(
    const table
    of tables
  ){

    const parsed =
      getTableData(
        table
      );


    if(!parsed){
      continue;
    }


    const headers =
      parsed.headers;


    const descriptionIndex =
      findColumn(
        headers,
        [
          "description"
        ]
      );


    const howIndex =
      findColumn(
        headers,
        [
          "how to achieve",
          "how achieve"
        ]
      );


    const purchaseIndex =
      findColumn(
        headers,
        [
          "in app",
          "inapp",
          "purchase",
          "requires in app"
        ]
      );


    const chanceIndex =
      findColumn(
        headers,
        [
          "chance based",
          "chance-based",
          "chance"
        ]
      );


    const difficultyIndex =
      findColumn(
        headers,
        [
          "difficulty"
        ]
      );


    const ribbonIndex =
      findColumn(
        headers,
        [
          "can you also earn a ribbon",
          "can also earn a ribbon",
          "also earn a ribbon",
          "ribbon"
        ]
      );


    for(
      const row
      of parsed.rows
    ){

      const cells =
        row.elements;


      const texts =
        row.text;


      /*
        Find the achievement by actual
        wiki link first.
      */

      let name =
        "";


      for(
        const cell
        of cells
      ){

        const candidate =
          achievementLinkName(
            cell
          );


        if(candidate){

          name =
            candidate;

          break;

        }

      }


      /*
        If there isn't a specific link,
        try the column identified by
        the table header.
      */

      if(!name){

        let achievementIndex =
          findColumn(
            headers,
            [
              "achievement",
              "name",
              "title"
            ]
          );


        if(
          achievementIndex >= 0 &&
          achievementIndex <
          texts.length
        ){

          name =
            clean(
              texts[
                achievementIndex
              ]
            );

        }

      }


      /*
        Final fallback.

        The achievement name is often
        the first meaningful cell.
      */

      if(!name){

        for(
          const text
          of texts
        ){

          const candidate =
            clean(text)
              .replace(
                /^\[Input\]\s*/i,
                ""
              );


          if(
            candidate &&
            candidate.length > 2 &&
            !/^input$/i.test(
              candidate
            ) &&
            !/^(achievement|description|difficulty)$/i.test(
              candidate
            )
          ){

            /*
              Don't use a long paragraph
              as an achievement name.
            */

            if(
              candidate.length <= 100
            ){

              name =
                candidate;

              break;

            }

          }

        }

      }


      name =
        clean(name)
          .replace(
            /^\[Input\]\s*/i,
            ""
          )
          .replace(
            /\s*\(Achievement\)\s*$/i,
            ""
          );


      if(
        !name ||
        name.length < 2 ||
        name.length > 150
      ){
        continue;
      }


      if(
        /^(achievement|description|difficulty|input)$/i.test(
          name
        )
      ){
        continue;
      }


      /*
        Don't accidentally add the page
        launch information.
      */

      if(
        /^launched on/i.test(name)
      ){
        continue;
      }


      const description =
        descriptionIndex >= 0
          ? clean(
              texts[
                descriptionIndex
              ]
            )
          : "";


      const howTo =
        howIndex >= 0
          ? clean(
              texts[
                howIndex
              ]
            )
          : "";


      const purchase =
        purchaseIndex >= 0
          ? clean(
              texts[
                purchaseIndex
              ]
            )
          : "";


      const chance =
        chanceIndex >= 0
          ? clean(
              texts[
                chanceIndex
              ]
            )
          : "";


      const difficulty =
        difficultyIndex >= 0
          ? normalizeDifficulty(
              texts[
                difficultyIndex
              ]
            )
          : "Unknown";


      const ribbon =
        ribbonIndex >= 0
          ? clean(
              texts[
                ribbonIndex
              ]
            )
          : "";


      const combinedDescription =
        [
          description,
          howTo
        ]
          .filter(Boolean)
          .join(" ");


      const id =
        "achievement:" +
        slug(name);


      /*
        Don't overwrite a better entry
        with an empty one from another
        table.
      */

      const existing =
        output.get(id);


      if(
        existing
      ){

        if(
          existing.description.length <
          combinedDescription.length
        ){

          existing.description =
            combinedDescription;

        }


        if(
          existing.difficulty ===
          "Unknown" &&
          difficulty !==
          "Unknown"
        ){

          existing.difficulty =
            difficulty;

        }


        if(
          !existing.purchase &&
          purchase
        ){

          existing.purchase =
            purchase;

        }


        if(
          !existing.chance &&
          chance
        ){

          existing.chance =
            chance;

        }


        if(
          !existing.ribbon &&
          ribbon
        ){

          existing.ribbon =
            ribbon;

        }


        continue;

      }


      output.set(
        id,
        {

          id,

          type:
            "achievement",

          name,

          description:
            combinedDescription ||
            "Description not provided on the source page.",

          category:
            categoryFor(table),

          purchase,

          chance,

          difficulty,

          ribbon,

          emoji:
            emojiFor(
              name,
              "achievement"
            )

        }
      );

    }

  }


  /*
    SECOND PASS:
    Find achievement links directly.

    This catches entries that are not
    parsed correctly from a table.
  */

  const links =
    Array.from(
      doc.querySelectorAll(
        "a[href]"
      )
    );


  for(
    const link
    of links
  ){

    const href =
      link.getAttribute(
        "href"
      ) || "";


    const title =
      link.getAttribute(
        "title"
      ) || "";


    const combined =
      (
        href +
        " " +
        title
      ).toLowerCase();


    if(
      !combined.includes(
        "achievement"
      )
    ){
      continue;
    }


    let name =
      clean(
        link.textContent
      ) ||
      clean(title);


    name =
      name
        .replace(
          /\s*\(Achievement\)\s*$/i,
          ""
        )
        .trim();


    if(
      !name ||
      name.length < 2 ||
      name.length > 100
    ){
      continue;
    }


    if(
      /^(achievement|achievements)$/i.test(
        name
      )
    ){
      continue;
    }


    if(
      /^launched on/i.test(name)
    ){
      continue;
    }


    const id =
      "achievement:" +
      slug(name);


    /*
      Don't create a bad duplicate if
      the link points to something that
      merely has "achievement" in its
      URL but isn't an achievement.
    */

    if(
      output.has(id)
    ){
      continue;
    }


    output.set(
      id,
      {

        id,

        type:
          "achievement",

        name,

        description:
          "Description available on the BitLife wiki.",

        category:
          categoryFor(link),

        purchase:
          "",

        chance:
          "",

        difficulty:
          "Unknown",

        ribbon:
          "",

        emoji:
          emojiFor(
            name,
            "achievement"
          )

      }
    );

  }


  return Array.from(
    output.values()
  );

}


/*
==========================================================
 RIBBON PARSER
==========================================================

IMPORTANT:

The old parser treated every heading as a ribbon.

That caused:

    Launched on Android

to become a ribbon.

This parser only accepts actual ribbon
sections and explicitly rejects metadata.

==========================================================
*/


function parseRibbons(
  html
){

  const parser =
    new DOMParser();


  const doc =
    parser.parseFromString(
      html,
      "text/html"
    );


  const output =
    new Map();


  const headings =
    Array.from(
      doc.querySelectorAll(
        "h2,h3,h4,h5"
      )
    );


  const forbidden =
    /^(ribbons|regular ribbons|secret ribbons|launched on ios|launched on android|contents|references|notes|external links|navigation)$/i;


  let insideRibbonSection =
    false;


  for(
    let i = 0;
    i < headings.length;
    i++
  ){

    const heading =
      headings[i];


    const name =
      clean(
        heading.textContent
      );


    if(!name){
      continue;
    }


    /*
      Detect the actual ribbon sections.
    */

    if(
      /^regular ribbons$/i.test(
        name
      ) ||
      /^secret ribbons$/i.test(
        name
      )
    ){

      insideRibbonSection =
        true;

      continue;

    }


    /*
      The main Ribbons heading itself
      isn't an entry.
    */

    if(
      /^ribbons$/i.test(
        name
      )
    ){

      continue;

    }


    /*
      This is the important fix.
    */

    if(
      forbidden.test(name)
    ){
      continue;
    }


    if(
      /^launched on/i.test(name)
    ){
      continue;
    }


    /*
      Ribbon names on this page are
      short headings.

      Reject obvious prose headings.
    */

    if(
      name.length > 70
    ){
      continue;
    }


    /*
      Only accept headings after the
      ribbon sections have started.

      This prevents unrelated page
      metadata from being interpreted
      as ribbons.
    */

    if(
      !insideRibbonSection
    ){
      continue;
    }


    let description =
      "";


    let difficulty =
      "Unknown";


    let node =
      heading.nextElementSibling;


    let safety =
      0;


    while(
      node &&
      safety < 30
    ){

      safety++;


      if(
        /^H[2-5]$/.test(
          node.tagName
        )
      ){
        break;
      }


      const text =
        elementText(node);


      if(text){

        const diff =
          text.match(
            /^Difficulty\s*:\s*(.+)$/i
          );


        if(diff){

          difficulty =
            normalizeDifficulty(
              diff[1]
            );

        }else if(
          !description &&
          text.length > 10 &&
          !/^the .+ ribbon\.?$/i.test(
            text
          ) &&
          !/^launched on/i.test(
            text
          )
        ){

          description =
            text;

        }

      }


      node =
        node.nextElementSibling;

    }


    /*
      A genuine ribbon entry should
      normally have ribbon-related
      content immediately below it.

      This extra check stops metadata
      headings from slipping through.
    */

    const nearbyText =
      clean(
        (
          heading.parentElement ||
          heading
        ).textContent
      );


    const looksLikeRibbon =
      /ribbon/i.test(
        nearbyText
      ) ||
      !!description ||
      difficulty !== "Unknown";


    if(
      !looksLikeRibbon
    ){
      continue;
    }


    const id =
      "ribbon:" +
      slug(name);


    if(
      output.has(id)
    ){
      continue;
    }


    output.set(
      id,
      {

        id,

        type:
          "ribbon",

        name,

        description:
          description ||
          "Description not provided on the source page.",

        category:
          "Ribbons",

        purchase:
          "",

        chance:
          /luck|random|chance/i.test(
            description
          )
            ? "Yes"
            : "",

        difficulty,

        ribbon:
          "",

        emoji:
          emojiFor(
            name,
            "ribbon"
          )

      }
    );

  }


  /*
    Final safety filter.

    This guarantees page metadata such
    as "Launched on Android" can never
    appear in the ribbon list.
  */

  return Array.from(
    output.values()
  ).filter(
    ribbon =>
      !/^launched on/i.test(
        ribbon.name
      ) &&
      !/^(ribbons|regular ribbons|secret ribbons)$/i.test(
        ribbon.name
      )
  );

}


/*
==========================================================
 FANDOM API
==========================================================
*/


async function fetchWikiPage(
  page
){

  const url =
    API[page];


  const controller =
    new AbortController();


  const timeout =
    setTimeout(
      () =>
        controller.abort(),
      20000
    );


  try{

    const response =
      await fetch(
        url,
        {
          method:
            "GET",

          cache:
            "no-store",

          credentials:
            "omit",

          signal:
            controller.signal,

          headers:{
            "Accept":
              "application/json"
          }

        }
      );


    if(
      !response.ok
    ){

      throw new Error(
        "Fandom API returned HTTP " +
        response.status
      );

    }


    const data =
      await response.json();


    if(
      data.error
    ){

      throw new Error(
        data.error.info ||
        data.error.code ||
        "Fandom API returned an error."
      );

    }


    let html =
      "";


    if(
      data.parse &&
      typeof data.parse.text ===
        "string"
    ){

      html =
        data.parse.text;

    }


    else if(
      data.parse &&
      data.parse.text &&
      typeof data.parse.text["*"] ===
        "string"
    ){

      html =
        data.parse.text["*"];

    }


    if(!html){

      throw new Error(
        "Fandom API returned no page HTML."
      );

    }


    return html;

  }catch(error){

    if(
      error.name ===
      "AbortError"
    ){

      throw new Error(
        "Fandom request timed out after 20 seconds."
      );

    }


    throw error;

  }finally{

    clearTimeout(
      timeout
    );

  }

}


/*
==========================================================
 SYNC
==========================================================
*/


async function syncWiki(){

  const syncButton =
    $("sync");


  syncButton.disabled =
    true;


  $("notice").className =
    "notice";


  $("notice").innerHTML =
    "🔄 Connecting to the BitLife wiki…";


  $("content").innerHTML =

    `
      <div class="loading">

        <div class="spinner"></div>

        Fetching information from the BitLife wiki…

      </div>
    `;


  try{

    /*
      Fetch both pages in parallel.

      This is faster than waiting for
      one page and then the other.
    */

    const [
      achievementHTML,
      ribbonHTML
    ] =
      await Promise.all([
        fetchWikiPage(
          "achievements"
        ),
        fetchWikiPage(
          "ribbons"
        )
      ]);


    $("notice").innerHTML =
      "🔄 Wiki pages downloaded. Parsing achievements and ribbons…";


    const achievements =
      parseAchievements(
        achievementHTML
      );


    const ribbons =
      parseRibbons(
        ribbonHTML
      );


    console.log(
      "BitLife Wiki sync:",
      {
        achievements:
          achievements.length,

        ribbons:
          ribbons.length
      }
    );


    /*
      Current wiki target:
        410 achievements
        40 ribbons

      We DON'T reject the data merely
      because a parser count differs.

      This is important because a wiki
      can change its HTML structure.
    */

    if(
      achievements.length === 0
    ){

      throw new Error(
        "The Achievements page was downloaded, " +
        "but no achievements could be parsed."
      );

    }


    if(
      ribbons.length === 0
    ){

      throw new Error(
        "The Ribbons page was downloaded, " +
        "but no ribbons could be parsed."
      );

    }


    state.achievements =
      achievements;


    state.ribbons =
      ribbons;


    populateCategories();


    $("notice").className =
      "notice success";


    let message =
      "✓ Wiki synced successfully — " +
      achievements.length +
      " achievements and " +
      ribbons.length +
      " ribbons loaded.";


    /*
      Give a useful warning rather
      than pretending the count is
      correct if the wiki changes.
    */

    if(
      achievements.length !== 410
    ){

      message +=
        " The wiki currently reports 410 achievements, " +
        "so " +
        Math.abs(
          410 -
          achievements.length
        ) +
        " may still need parser handling.";

    }


    if(
      ribbons.length !== 40
    ){

      message +=
        " The wiki currently reports 40 ribbons, " +
        "so " +
        Math.abs(
          40 -
          ribbons.length
        ) +
        " may still need parser handling.";

    }


    $("notice").innerHTML =
      message;


    render();


  }catch(error){

    console.error(
      "Wiki sync failed:",
      error
    );


    $("notice").className =
      "notice error";


    $("notice").innerHTML =

      `
        ⚠️ <strong>
          Could not sync the BitLife wiki.
        </strong>

        <small>
          ${escapeHTML(
            error.message ||
            "Unknown error"
          )}
        </small>

        <small>
          Your existing progress has not been deleted.
        </small>
      `;


    if(
      state.achievements.length ||
      state.ribbons.length
    ){

      render();

    }else{

      $("content").innerHTML =

        `
          <div class="empty">

            ⚠️ The wiki could not be loaded.

            <br><br>

            Press
            <strong>Sync Wiki</strong>
            to try again.

          </div>
        `;

    }

  }finally{

    syncButton.disabled =
      false;

  }

}


/*
==========================================================
 CATEGORIES
==========================================================
*/


function populateCategories(){

  const select =
    $("category");


  const current =
    state.category;


  const categories =
    [
      ...new Set(
        state.achievements
          .map(
            item =>
              item.category
          )
          .concat(
            state.ribbons
              .map(
                item =>
                  item.category
              )
          )
      )
    ]
      .filter(Boolean)
      .sort(
        (a,b) =>
          a.localeCompare(b)
      );


  select.innerHTML =

    `
      <option value="all">
        All categories
      </option>
    ` +

    categories
      .map(
        category =>
          `
            <option
              value="${escapeHTML(
                category
              )}"
            >
              ${escapeHTML(
                category
              )}
            </option>
          `
      )
      .join("");


  if(
    categories.includes(
      current
    )
  ){

    select.value =
      current;

  }else{

    state.category =
      "all";

    select.value =
      "all";

  }

}


/*
==========================================================
 FILTER
==========================================================
*/


function matches(
  item
){

  const q =
    state.search
      .toLowerCase()
      .trim();


  const searchable =
    [
      item.name,
      item.description,
      item.category,
      item.difficulty,
      item.ribbon,
      item.purchase,
      item.chance
    ]
      .join(" ")
      .toLowerCase();


  const searchMatch =
    !q ||
    searchable.includes(q);


  const categoryMatch =
    state.category === "all" ||
    item.category ===
      state.category;


  const difficultyMatch =
    state.difficulty === "all" ||
    item.difficulty ===
      state.difficulty;


  return (
    searchMatch &&
    categoryMatch &&
    difficultyMatch
  );

}


/*
==========================================================
 RENDER
==========================================================
*/


function render(){

  updateStats();


  const source =
    state.activeTab ===
    "achievements"

      ? state.achievements

      : state.ribbons;


  const filtered =
    source.filter(
      matches
    );


  if(
    !filtered.length
  ){

    $("content").innerHTML =

      `
        <div class="empty">

          🔎 Nothing matches
          your current filters.

        </div>
      `;

    return;

  }


  /*
    Incomplete items first.
  */

  const ordered =
    [...filtered].sort(
      (a,b) => {

        const aDone =
          !!state.checked[
            a.id
          ];


        const bDone =
          !!state.checked[
            b.id
          ];


        if(
          aDone !== bDone
        ){

          return aDone
            ? 1
            : -1;

        }


        return (
          source.indexOf(a) -
          source.indexOf(b)
        );

      }
    );


  const groups =
    {};


  ordered.forEach(
    item => {

      const key =
        item.category ||
        "General";


      if(
        !groups[key]
      ){

        groups[key] =
          [];

      }


      groups[key].push(
        item
      );

    }
  );


  $("content").innerHTML =

    Object.entries(
      groups
    )
      .map(
        ([category,items]) => {

          const done =
            items.filter(
              item =>
                state.checked[
                  item.id
                ]
            ).length;


          return `

            <section
              class="section"
            >

              <div
                class="section-title"
              >

                <h2>
                  ${escapeHTML(
                    category
                  )}
                </h2>

                <div
                  class="section-count"
                >
                  ${done}
                  /
                  ${items.length}
                  complete
                </div>

              </div>

              <div
                class="items"
              >

                ${items
                  .map(
                    renderItem
                  )
                  .join("")}

              </div>

            </section>

          `;

        }
      )
      .join("");


  document
    .querySelectorAll(
      ".checkbox"
    )
    .forEach(
      box => {

        box.addEventListener(
          "change",
          () => {

            state.checked[
              box.dataset.id
            ] =
              box.checked;


            save();


            render();

          }
        );

      }
    );

}


/*
==========================================================
 ITEM
==========================================================
*/


function renderItem(
  item
){

  const checked =
    !!state.checked[
      item.id
    ];


  const paid =
    paidInfo(
      item.purchase
    );


  const rng =
    rngInfo(
      item.chance
    );


  const difficulty =
    item.difficulty &&
    item.difficulty !==
      "Unknown"

      ? `

        <span
          class="badge difficulty ${difficultyClass(
            item.difficulty
          )}"
        >

          ${escapeHTML(
            item.difficulty
          )}

        </span>

      `

      : "";


  const paidBadge =
    paid

      ? `

        <span
          class="badge paid"
        >
          💳 PAID / BITIZEN
        </span>

      `

      : "";


  const rngBadge =
    rng

      ? `

        <span
          class="badge rng"
        >
          🎲 RNG
        </span>

      `

      : "";


  const ribbonBadge =
    item.ribbon &&
    !/^no$/i.test(
      item.ribbon
    )

      ? `

        <span
          class="badge ribbon"
        >
          🎗️
          ${escapeHTML(
            item.ribbon
          )}
        </span>

      `

      : "";


  const purchaseText =
    paid &&
    item.purchase

      ? `

        <span
          class="badge paid"
        >
          Requires:
          ${escapeHTML(
            item.purchase
          )}
        </span>

      `

      : "";


  return `

    <article
      class="item ${checked ? "done" : ""}"
      data-diff="${escapeHTML(
        item.difficulty
      )}"
    >

      <input
        class="checkbox"
        type="checkbox"
        data-id="${escapeHTML(
          item.id
        )}"
        ${checked ? "checked" : ""}
        aria-label="Mark ${escapeHTML(
          item.name
        )} complete"
      >


      <div
        class="item-main"
      >

        <div
          class="item-name"
        >

          <span
            class="emoji"
          >
            ${item.emoji}
          </span>

          <span>
            ${escapeHTML(
              item.name
            )}
          </span>

        </div>


        <div
          class="description"
        >
          ${escapeHTML(
            item.description
          )}
        </div>


        <div
          class="meta"
        >

          ${difficulty}

          ${paidBadge}

          ${purchaseText}

          ${rngBadge}

          ${ribbonBadge}

        </div>

      </div>


      <div
        class="item-side"
      >

        ${
          item.type ===
          "achievement"

            ? "ACHIEVEMENT"

            : "RIBBON"
        }

      </div>

    </article>

  `;

}


/*
==========================================================
 STATISTICS
==========================================================
*/


function updateStats(){

  const totalA =
    state.achievements.length;


  const totalR =
    state.ribbons.length;


  const doneA =
    state.achievements.filter(
      item =>
        state.checked[
          item.id
        ]
    ).length;


  const doneR =
    state.ribbons.filter(
      item =>
        state.checked[
          item.id
        ]
    ).length;


  const total =
    totalA +
    totalR;


  const done =
    doneA +
    doneR;


  const pct =
    total
      ? Math.round(
          done /
          total *
          100
        )
      : 0;


  $("overallPct")
    .textContent =
      pct + "%";


  $("overallBar")
    .style.width =
      pct + "%";


  $("achievementCount")
    .textContent =
      doneA +
      " / " +
      totalA;


  $("ribbonCount")
    .textContent =
      doneR +
      " / " +
      totalR;


  $("achievementBar")
    .style.width =
      (
        totalA
          ? doneA /
            totalA *
            100
          : 0
      ) + "%";


  $("ribbonBar")
    .style.width =
      (
        totalR
          ? doneR /
            totalR *
            100
          : 0
      ) + "%";


  $("remaining")
    .textContent =
      total -
      done;


  $("remainingBar")
    .style.width =
      (
        total
          ? (
              total -
              done
            ) /
            total *
            100
          : 0
      ) + "%";

}


/*
==========================================================
 RESET
==========================================================
*/


function resetProgress(){

  if(
    !confirm(
      "Reset ALL achievement and ribbon progress?\n\n" +
      "This cannot be undone."
    )
  ){

    return;

  }


  state.checked =
    {};


  save();


  render();

}


/*
==========================================================
 EVENTS
==========================================================
*/


$("search")
  .addEventListener(
    "input",
    event => {

      state.search =
        event.target.value;


      render();

    }
  );


$("category")
  .addEventListener(
    "change",
    event => {

      state.category =
        event.target.value;


      render();

    }
  );


$("difficulty")
  .addEventListener(
    "change",
    event => {

      state.difficulty =
        event.target.value;


      render();

    }
  );


$("sync")
  .addEventListener(
    "click",
    syncWiki
  );


$("reset")
  .addEventListener(
    "click",
    resetProgress
  );


document
  .querySelectorAll(
    ".tab"
  )
  .forEach(
    tab => {

      tab.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(
              ".tab"
            )
            .forEach(
              x =>
                x.classList.remove(
                  "active"
                )
            );


          tab.classList.add(
            "active"
          );


          state.activeTab =
            tab.dataset.tab;


          render();

        }
      );

    }
  );


/*
==========================================================
 START
==========================================================
*/


loadSaved();

syncWiki();
