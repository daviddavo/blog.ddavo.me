console.log("Loaded data.js")
console.log("{{ . }}")

function runOnFirstVisible(element, callback) {
  const observer = new IntersectionObserver((es, o) => {
    es.forEach((e) => {
      if (e.isIntersecting) {
        callback(e.target)
        o.unobserve(e.target)
      }
    })
  }, {rootMargin: '300px 0px'})

  observer.observe(element)
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded')
  runOnFirstVisible(document.getElementById('criptosellos-last-update'), (e) => {
    console.log("Getting data from", e.dataset.url)
    fetch(e.dataset.url).then(response => response.json()).then(json => {
      e.innerHTML = json['last-update']

      document.getElementById('criptosellos-total-tokens').innerHTML = json['total-tokens']
      document.getElementById('criptosellos-daily-avg').innerHTML = json['daily-avg']
      document.getElementById('criptosellos-total-holders').innerHTML = json['total-holders']
      document.getElementById('criptosellos-holder-avg').innerHTML = Math.round(json['total-tokens'] / json['total-holders'] * 100) / 100

      document.getElementById('criptosellos-holder-whale-address').innerHTML = '<a href="'+json['holder-whale-address']+'"><code>'+json['holder-whale-address'].substring(0, 10)+'</code></a>'
      document.getElementById('criptosellos-holder-whale-count').innerHTML = json['holder-whale-count']
    })
  })
})
