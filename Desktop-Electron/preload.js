window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
      if(document.getElementById(selector))
          element.innerText = text
  }

  for(const dependency of ['chrome', 'node', 'electron']) {
      replaceText(`${dependency}-version`, process.versions[dependency])
  }
})
