function $(q) {
  return document.querySelector(q)
}

function loadItem(name) {
    const body = localStorage.getItem(name)
    return JSON.parse(body)
}

function saveItem(name, data) {
    const body = JSON.stringify(data)
    localStorage.setItem(name, body)
}
