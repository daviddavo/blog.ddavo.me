import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as Plot from "https://cdn.jsdelivr.net/npm/@observablehq/plot@0.6/+esm";

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
  }, { rootMargin: '300px' })

  observer.observe(element)
}

function formatEthAddr(addr) {
  if (addr.startsWith('0x')) {
    return addr.slice(0, 6) + '...' + addr.slice(-4)
  } else if (addr.startsWith('only')) {
    return addr.slice('only'.length) + ' sellos p.u.'
  } else {
    return addr
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded')
  // runOnFirstVisible(document.getElementById('criptosellos-last-update'), (e) => {
  //   console.log("Getting data from", e.dataset.url)
  const e = document.getElementById('criptosellos-last-update')
  fetch(e.dataset.url).then(response => response.json()).then(json => {
    e.innerHTML = (new Date(json['last-update'])).toLocaleString()

    document.getElementById('criptosellos-total-tokens').innerHTML = json['total-tokens']
    document.getElementById('criptosellos-daily-avg').innerHTML = Math.round(json['daily-avg'] * 10) / 10
    document.getElementById('criptosellos-total-holders').innerHTML = json['total-holders']
    document.getElementById('criptosellos-holder-avg').innerHTML = Math.round(json['total-tokens'] / json['total-holders'] * 100) / 100
    document.getElementById('criptosellos-holder-whale-address').innerHTML = '<code>' + json['holders-whale-address'] + '</code>'
    document.getElementById('criptosellos-holder-whale-count').innerHTML = json['holders-whale-cnt']
    document.getElementById('criptosellos-holder-oneortwo-cnt').innerHTML = json['holder-oneortwo-holders-cnt'] + " de " + json['total-holders']
    document.getElementById('criptosellos-holders-had-nfts-avg').innerHTML = Math.round(json['holders-had-nfts-avg'] * 100) + '%'
    document.getElementById('criptosellos-holders-had-nfts-avg-not').innerHTML = 100 - Math.round(json['holders-had-nfts-avg'] * 100) + '%'

    document.getElementById('criptosellos-total-tokens2').innerHTML = json['total-tokens']
    document.getElementById('criptosellos-total-money').innerHTML = json['total-tokens'] * 5
  })
  // })

  runOnFirstVisible(document.getElementById('criptosellos-diario-chart'), async (e) => {
    console.log("Getting data from", e.dataset.url)
    const data = await d3.csv(e.dataset.url, (d) => {
      return {
        Fecha: new Date(d.block_date),
        daily: parseInt(d.Dia),
        "Total criptosellos": parseInt(d.Total),
      }
    })

    const plot = Plot.plot({
      height: 300,
      width: e.offsetWidth,
      y: { grid: true },
      marks: [
        Plot.lineY(data, {
          x: "Fecha",
          y: "Total criptosellos",
        }),
        Plot.tip(data, Plot.pointerX(
          {
            x: "Fecha",
            y: "Total criptosellos",
            title: d => `${d.Fecha.toLocaleDateString()}\n  Total: ${d["Total criptosellos"]}\n  Variación: ↑ ${d.daily}`,
          }
        ))
      ]
    })

    e.replaceChildren(plot)
  })

  runOnFirstVisible(document.getElementById('criptosellos-holders-chart'), async (e) => {
    console.log("Getting data from", e.dataset.url)
    const data = await d3.csv(e.dataset.url)
    const width = 500

    const height = Math.min(width, 500)
    const radius = Math.min(width, height) / 2

    const arc = d3.arc()
      .innerRadius(radius * 0.67)
      .outerRadius(radius - 1)

    const pie = d3.pie()
      .padAngle(1 / radius)
      .sort((a, b) => (a.eachCnt > b.eachCnt) && (a.cnt > b.cnt))
      .value(d => d.cnt)

    // const color = d3.scaleOrdinal()
    //   .domain(data.map(d => d.to))
    //   .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())
    const color = d3.scaleOrdinal(d3.schemeDark2)

    const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    svg.append("g")
      .selectAll()
      .data(pie(data))
      .join("path")
      .attr("fill", d => color(d.data.to))
      .attr("d", arc)
      .append("title")
      .text(d => {
        if (d.data.cnt / d.data.eachCnt == 1) {
          return `Dir: ${d.data.to}\n  ${d.data.cnt} sellos`
        } else {
          return `Múltiples direcciones\n  ${d.data.eachCnt} sellos por usuario\n  ${d.data.cnt / d.data.eachCnt} usuarios`
        }
      });

    svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .selectAll()
      .data(pie(data))
      .join("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .call(text => text.append("tspan")
        .attr("y", "-0.4em")
        .attr("font-weight", "bold")
        .text(d => formatEthAddr(d.data.to)))
      .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
        .attr("x", 0)
        .attr("y", "0.7em")
        .attr("fill-opacity", 0.7)
        .text(d => d.data.cnt.toLocaleString("es-ES")));

    e.replaceChildren(svg.node())
  })

  runOnFirstVisible(document.getElementById('criptosellos-correos-contratos'), async (e) => {
    console.log("Getting data from", e.dataset.url)
    const data = await d3.csv(e.dataset.url)
    const total = Math.round(d3.sum(data, d => d.dinero) * 100) / 100

    e.innerHTML = total.toLocaleString('es-ES')
    document.getElementById('criptosellos-correos-contratos-cnt').innerHTML = data.length
  })
})
