var link = document.getElementById("browser_source_link")
var base_url = URL.parse(document.location.href)
base_url.pathname = base_url.pathname.replace("redirect.html", "browser_source.html")

base_url.hash = ""
var params = new URLSearchParams();
params.append("client_id", "wk9am7u7mkbdnuvzdlvmbfo2dfv7c3")
params.append("token", parseToken())
base_url.search = "?" + params.toString()
link.value = base_url.toString()

var copy_button = document.getElementById("copy_button")
copy_button.onclick = function() {
	var link = document.getElementById("browser_source_link")
	navigator.clipboard.writeText(link.value);
	var hover = document.querySelector(".tooltip_hover")
	hover.textContent = "Copied!"
	hover.style.visibility = "visible"
	setTimeout(restoreTextContent, 1000)
}

function restoreTextContent() {
	var hover = document.querySelector(".tooltip_hover")
	hover.textContent  = "Copy"
	hover.style.visibility = "hidden"
}

function parseToken() {
	var split = document.location.hash.split(/[=&]/)
	return (split[1])
}