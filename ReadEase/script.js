const readme = document.getElementById("readme");
const textArea = document.getElementById("text-area");
const clear = document.getElementById("clear");

clear.addEventListener("click", () => {
  console.log("hello");
  textArea.value = ""
  parseInput(textArea.value)
});

function parseInput(text) {
  const lines = text.split("\n");
  let output = [];
  let inCodeBlock = false;
  let codeBlockContent = [];
  let inOrderList = false;
  let orderList = [];

  lines.forEach((line) => {
    //code for codeblock
    if (line.startsWith("```") && !inCodeBlock) {
      inCodeBlock = true;
    } else if (line.startsWith("```") && inCodeBlock) {
      // End the code block
      inCodeBlock = false;
      output.push(
        `<pre style="background-color:#002244; padding: 20px; border-radius:5px;color:#ead575"><code>${codeBlockContent.join(
          "\n"
        )}</code></pre>`
      );
    } else if (inCodeBlock) {
      // Store the content inside the code block
      codeBlockContent.push(line);
    }

    //code for orderd list
    else if (line.match(/^\d+\.\s/) && !inOrderList) {
      inOrderList = true;
      output.push('<ol type="1">');
      output.push(`<li>${line.slice(3)}</li>`);
    } else if (inOrderList) {
      if (line.match(/^\d+\.\s/)) {
        output.push(`<li>${line.slice(3)}</li>`);
      } else if (line.trim() === "") {
        // If an empty line is found, close the list
        inOrderList = false;
        output.push("</ol>");
      }
    }
    //for headings
    else if (line.startsWith("### ")) {
      output.push(`<h3>${line.slice(4)}</h3>`);
    } else if (line.startsWith("## ")) {
      output.push(`<h2>${line.slice(3)}</h2>`);
    } else if (line.startsWith("# ")) {
      output.push(`<h1>${line.slice(2)}</h1>`);
    }
    //for qoute
    else if (line.startsWith("> ")) {
      output.push(`<q>${line.slice(2)}</q>`);
    }
    //for strong
    else if (line.match(/\*\*(.*?)\*\*/)) {
      const matched = line.match(/\*\*(.*?)\*\*/);
      output.push(line.replace(matched[0], `<strong>${matched[1]}</strong>`));
    }
    //list
    else if (line.startsWith("- ") || line.startsWith("* ")) {
      output.push(`<li>${line.slice(2)}</li>`);
    }
    //italic
    else if (line.match(/\__(.*?)\__/)) {
      const matched = line.match(/\__(.*?)\__/);
      output.push(line.replace(matched[0], `<em>${matched[1]}</em>`));
    }
    //inline code
    else if (line.match(/`(.*?)`/)) {
      const matched = line.match(/`(.*?)`/);
      output.push(
        line.replace(
          matched[0],
          `<code style="background-color:#ead575;padding:2px;border-radius:5px;">${matched[1]}</code>`
        )
      );
    }
    // links
    else if (line.match(/^\[(.*?)\]\((.*?)\)$/)) {
      const match = line.match(/^\[(.*?)\]\((.*?)\)$/);
      output.push(`<a href="${match[2]}" target="_blank">${match[1]}</a>`);
    } else if (line.match(/^!\[(.*?)\]\((.*?)\)$/)) {
      const match = line.match(/^!\[(.*?)\]\((.*?)\)$/);
      output.push(
        `<img src="${match[2]}" alt="${match[1]}" style="max-width: 100%; height: auto;"/>`
      );
    } else {
      output.push(`<p>${line}</p>`); // Wrap normal text in <p>
    }
  });
  console.log(output.join("\n"));
  readme.innerHTML = output.join("\n");
}
textArea.addEventListener("input", (e) => {
  parseInput(e.target.value);
});
